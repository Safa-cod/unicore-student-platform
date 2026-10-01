# =====================================================================
# db.py — MySQL connection helper for Unicore
# =====================================================================
# Wraps mysql-connector-python so the rest of the backend can just call
# get_db() and get back a connection with dictionary-style rows.
# Configure the real credentials in a .env file (see .env.example).
# =====================================================================

import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "unicore"),
}


def get_db():
    """Open a fresh connection with dictionary-style cursors.

    A new connection per request is simplest and safe for a course
    project's traffic level; close() is always called in a `finally`
    block by the route that opens it.
    """
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        raise RuntimeError(f"Could not connect to MySQL: {e}")


def run_query(query, params=None, fetch=False, fetch_one=False, commit=False):
    """Small convenience wrapper for the common query patterns used
    throughout app.py: fetch rows, or run an INSERT/UPDATE and commit.
    """
    conn = get_db()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(query, params or ())

        result = None
        if fetch_one:
            result = cur.fetchone()
        elif fetch:
            result = cur.fetchall()

        if commit:
            conn.commit()
            result = cur.lastrowid

        cur.close()
        return result
    finally:
        conn.close()
