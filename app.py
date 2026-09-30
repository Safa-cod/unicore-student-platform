# =====================================================================
# app.py — Unicore backend (Flask + MySQL)
# =====================================================================
# Serves the frontend from ../frontend (index.html, dashboard.html, style.css, app.js) and implements
# every /api/... endpoint app.js already calls:
#
#   POST /api/login
#   POST /api/signup
#   POST /api/logout
#   GET  /api/user
#   GET  /api/lost-items
#   POST /api/lost-items
#   POST /api/lost-items/<id>/comments
#   GET  /api/houses
#   POST /api/houses
#   POST /api/houses/<id>/comments
#   GET  /api/alumni
#   GET  /api/weather?city=<city>
#
# Run:
#   pip install -r requirements.txt
#   mysql -u root -p < schema.sql
#   cp .env.example .env      # then fill in your MySQL password
#   python app.py
#   -> open http://localhost:5000
# =====================================================================

import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request, session, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

from db import run_query
from weather import get_weather

load_dotenv()

app = Flask(__name__, static_folder="../frontend", static_url_path="")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-change-me")

# Credentials-aware CORS, useful if the frontend is ever opened from a
# different origin (e.g. the VS Code "Live Server" extension on
# :5500) instead of being served by Flask itself on :5000.
CORS(app, supports_credentials=True)


# =====================================================================
# Helpers
# =====================================================================
def time_ago(dt):
    """Turn a MySQL DATETIME into the same kind of string app.js's
    sample data used ("2 hours ago", "Yesterday", "3 days ago")."""
    if dt is None:
        return ""
    now = datetime.now()
    diff = now - dt
    seconds = diff.total_seconds()

    if seconds < 60:
        return "Just now"
    if seconds < 3600:
        mins = int(seconds // 60)
        return f"{mins} minute{'s' if mins != 1 else ''} ago"
    if seconds < 86400:
        hours = int(seconds // 3600)
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    days = int(seconds // 86400)
    if days == 1:
        return "Yesterday"
    if days < 7:
        return f"{days} days ago"
    weeks = days // 7
    return f"{weeks} week{'s' if weeks != 1 else ''} ago"


def current_user_row():
    uid = session.get("user_id")
    if not uid:
        return None
    return run_query(
        "SELECT id, student_id, name FROM users WHERE id = %s",
        (uid,), fetch_one=True,
    )


def require_login():
    user = current_user_row()
    if not user:
        return None
    return user


# =====================================================================
# Static frontend
# =====================================================================
@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/dashboard.html")
def serve_dashboard():
    return send_from_directory(app.static_folder, "dashboard.html")


# =====================================================================
# Authentication
# =====================================================================
@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json(silent=True) or {}
    student_id = (data.get("studentId") or "").strip()
    name = (data.get("name") or "").strip()
    password = data.get("password") or ""

    if not student_id or not name or not password:
        return jsonify(success=False, message="All fields are required."), 400

    existing = run_query(
        "SELECT id FROM users WHERE student_id = %s", (student_id,), fetch_one=True
    )
    if existing:
        return jsonify(success=False, message="An account with this Student ID already exists."), 409

    password_hash = generate_password_hash(password)
    user_id = run_query(
        "INSERT INTO users (student_id, name, password_hash) VALUES (%s, %s, %s)",
        (student_id, name, password_hash), commit=True,
    )

    session["user_id"] = user_id
    return jsonify(success=True, user={"name": name, "studentId": student_id})


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    password = data.get("password") or ""

    if not name or not password:
        return jsonify(success=False, message="Please fill in both fields."), 400

    user = run_query(
        "SELECT id, student_id, name, password_hash FROM users WHERE name = %s",
        (name,), fetch_one=True,
    )
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify(success=False, message="Incorrect name or password."), 401

    session["user_id"] = user["id"]
    return jsonify(success=True, user={"name": user["name"], "studentId": user["student_id"]})


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify(success=True)


@app.route("/api/user", methods=["GET"])
def api_user():
    user = current_user_row()
    if not user:
        return jsonify(success=False), 401
    return jsonify(success=True, user={"name": user["name"], "studentId": user["student_id"]})


# =====================================================================
# Lost & Found
# =====================================================================
@app.route("/api/lost-items", methods=["GET"])
def get_lost_items():
    items = run_query(
        "SELECT * FROM lost_items ORDER BY created_at DESC", fetch=True
    )
    result = []
    for item in items:
        comments = run_query(
            "SELECT author, text FROM lost_item_comments WHERE lost_item_id = %s ORDER BY created_at ASC",
            (item["id"],), fetch=True,
        )
        result.append({
            "id": item["id"],
            "name": item["name"],
            "details": item["details"],
            "location": item["location"],
            "contact": item["contact"],
            "photo": item["photo"],
            "status": item["status"],
            "posted": time_ago(item["created_at"]),
            "comments": comments,
        })
    return jsonify(result)


@app.route("/api/lost-items", methods=["POST"])
def create_lost_item():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    location = (data.get("location") or "").strip()
    contact = (data.get("contact") or "").strip()
    details = data.get("details") or ""
    photo = data.get("photo")

    if not name or not location or not contact:
        return jsonify(success=False, message="Name, location and contact are required."), 400

    new_id = run_query(
        """INSERT INTO lost_items (name, details, location, contact, photo, status)
           VALUES (%s, %s, %s, %s, %s, 'unclaimed')""",
        (name, details, location, contact, photo), commit=True,
    )
    return jsonify(success=True, id=new_id)


@app.route("/api/lost-items/<int:item_id>/comments", methods=["POST"])
def comment_lost_item(item_id):
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    user = current_user_row()
    author = data.get("author") or (user["name"] if user else "You")

    if not text:
        return jsonify(success=False, message="Comment cannot be empty."), 400

    run_query(
        "INSERT INTO lost_item_comments (lost_item_id, author, text) VALUES (%s, %s, %s)",
        (item_id, author, text), commit=True,
    )
    return jsonify(success=True)


# =====================================================================
# Find a Home
# =====================================================================
@app.route("/api/houses", methods=["GET"])
def get_houses():
    houses = run_query(
        "SELECT * FROM houses ORDER BY created_at DESC", fetch=True
    )
    result = []
    for h in houses:
        comments = run_query(
            "SELECT author, text FROM house_comments WHERE house_id = %s ORDER BY created_at ASC",
            (h["id"],), fetch=True,
        )
        result.append({
            "id": h["id"],
            "title": h["title"],
            "location": h["location"],
            "details": h["details"],
            "rent": h["rent"],
            "contact": h["contact"],
            "status": h["status"],
            "posted": time_ago(h["created_at"]),
            "comments": comments,
        })
    return jsonify(result)


@app.route("/api/houses", methods=["POST"])
def create_house():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    location = (data.get("location") or "").strip()
    rent = (data.get("rent") or "").strip()
    contact = (data.get("contact") or "").strip()
    details = data.get("details") or ""

    if not title or not location or not rent or not contact:
        return jsonify(success=False, message="Title, location, rent and contact are required."), 400

    new_id = run_query(
        """INSERT INTO houses (title, location, details, rent, contact, status)
           VALUES (%s, %s, %s, %s, %s, 'available')""",
        (title, location, details, rent, contact), commit=True,
    )
    return jsonify(success=True, id=new_id)


@app.route("/api/houses/<int:house_id>/comments", methods=["POST"])
def comment_house(house_id):
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    user = current_user_row()
    author = data.get("author") or (user["name"] if user else "You")

    if not text:
        return jsonify(success=False, message="Comment cannot be empty."), 400

    run_query(
        "INSERT INTO house_comments (house_id, author, text) VALUES (%s, %s, %s)",
        (house_id, author, text), commit=True,
    )
    return jsonify(success=True)


# =====================================================================
# Alumni Network
# =====================================================================
@app.route("/api/alumni", methods=["GET"])
def get_alumni():
    rows = run_query("SELECT * FROM alumni ORDER BY name ASC", fetch=True)
    result = [{
        "name": r["name"],
        "id": r["student_id"],
        "batch": r["batch"],
        "dept": r["dept"],
        "gradYear": r["grad_year"],
        "email": r["email"],
        "phone": r["phone"],
        "job": r["job"],
        "company": r["company"],
        "location": r["location"],
        "linkedin": r["linkedin"],
        "bio": r["bio"],
        "mentorship": bool(r["mentorship"]),
    } for r in rows]
    return jsonify(result)


# =====================================================================
# Weather (Open-Meteo)
# =====================================================================
@app.route("/api/weather", methods=["GET"])
def api_weather():
    city = request.args.get("city", "Dhaka").strip() or "Dhaka"
    try:
        payload = get_weather(city)
    except Exception as e:
        return jsonify(success=False, message=f"Weather service error: {e}"), 502

    if payload is None:
        return jsonify(success=False, message=f'Could not find a city called "{city}".'), 404

    return jsonify(payload)


# =====================================================================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
