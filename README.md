# 🎓 UniCore

## A Smart Student Community Platform

UniCore is a student-focused web platform designed to bring multiple useful campus services together in one place. It aims to make everyday student activities easier by providing practical tools for finding lost items, buying and selling products, finding accommodation, connecting with alumni, and checking weather information.

Instead of using separate platforms for different needs, UniCore provides these services through a single, simple, and user-friendly platform.

**Lost & Found · Live Weather · Alumni Network · Find a Home — all in one place.**

---

## 📚 Table of Contents

1. [About the Project](#about-the-project)
2. [Key Features](#key-features)
3. [Deployment Type & Access](#deployment-type--access)
4. [System Requirements](#system-requirements)
5. [Installation Guide — Running UniCore in VS Code](#installation-guide--running-unicore-in-vs-code)
6. [User Manual — Step by Step](#user-manual--step-by-step)
7. [Project Structure](#project-structure)
8. [Tech Stack](#tech-stack)
9. [REST API Reference](#rest-api-reference)
10. [Database Design](#database-design)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)
13. [Current Status & Roadmap](#current-status--roadmap)
14. [Project Management Notes](#project-management-notes)
15. [Team](#team)
16. [Acknowledgements](#acknowledgements)

---

## About the Project

Student life at a university is spread across notice boards, Facebook groups, messaging apps, and word of mouth. UniCore brings the most useful everyday services into one centralized, web-based platform so students can:

- Recover lost belongings quickly.
- Check the weather before heading to campus.
- Find and connect with alumni for guidance and mentorship.
- Find or advertise a place to live near campus.

UniCore was built as a team project for the Software Development and Project Management Lab course.

---

## Key Features

| Module | What it does |
|---|---|
| 🎒 **Lost & Found** | Post lost/found items with a photo, description, location, and contact number. Search existing posts and comment on them. Items carry an **Unclaimed / Claimed** status badge. |
| 🌦️ **Weather** | Live weather for any city: temperature (°C and °F), feels like, condition, humidity, wind, pressure, sunrise/sunset, an hourly forecast for the next hours, and a 5-day outlook. Powered by the free Open-Meteo API (no API key needed). |
| 🎓 **Alumni Network** | Browse the alumni directory and search by name, ID, batch, department, graduation year, job, company, location, email, phone, or mentorship availability. View academic and career details and see who is open to mentoring. |
| 🏠 **Find a Home** | Post available houses/rooms with title, location, details, monthly rent (BDT), and contact number. Search listings and comment to make inquiries. Listings show an **Available / Rented** badge. |
| 🔐 **Accounts** | Sign up with Student ID, name, and password; log in and log out. Passwords are stored as salted hashes using Werkzeug, never as plain text. |
| 📱 **Responsive UI** | Sidebar dashboard on desktop and dropdown navigation on small screens. |

---

## Deployment Type & Access

UniCore is a **localhost application**. It is not hosted on a public website, so there is no live URL.

You run it on your own computer using **Visual Studio Code (VS Code)** and then open it in your browser at:

```text
http://localhost:5000
```

Follow the Installation Guide below. A typical setup takes about 10 minutes.

---

## System Requirements

### Required Software

| Software | Required Version | Purpose | Download |
|---|---|---|---|
| Python | 3.10 or newer | Runs the Flask backend | [python.org](https://www.python.org/) |
| pip | 23.0+ | Installs Python dependencies | Included with Python |
| MySQL Server | 8.0 or newer (8.4 LTS works) | Stores users, posts, comments, and alumni | [dev.mysql.com](https://dev.mysql.com/) |
| Git | 2.30+ | Clones the repository | [git-scm.com](https://git-scm.com/) |
| Web browser | See supported browsers below | Uses the application | — |
| Internet connection | Required | Weather data (Open-Meteo) and Google Fonts | — |

> **Note:** Node.js is **not required**. The frontend is plain HTML/CSS/JavaScript served by Flask.

### Python Packages

The following packages are pinned in `backend/requirements.txt`:

| Package | Version |
|---|---:|
| Flask | 3.0.3 |
| flask-cors | 4.0.1 |
| mysql-connector-python | 8.4.0 |
| python-dotenv | 1.0.1 |
| requests | 2.32.3 |
| Werkzeug | 3.0.3 |

### Supported Browsers

UniCore uses standard modern web features such as CSS variables, `fetch`, `async/await`, `FileReader`, and `sessionStorage`.

| Browser | Minimum Version | Recommended |
|---|---:|---|
| Google Chrome | 90+ | Latest |
| Microsoft Edge | 90+ | Latest |
| Mozilla Firefox | 88+ | Latest |
| Safari | 14+ | Latest |

> **Note:** Internet Explorer is not supported.

### Supported Operating Systems

- Windows 10/11
- macOS 12+
- Linux (Ubuntu 20.04+)

---

# Installation Guide — Running UniCore in VS Code

UniCore is a localhost-based web application. The project must be opened in **Visual Studio Code (VS Code)** and the Flask backend must be started from the **VS Code terminal**.

## Step 1 — Install the Required Software

Install the following software before running UniCore:

1. Visual Studio Code
2. Python 3.10 or newer
3. MySQL Server 8.0 or newer
4. Git 2.30 or newer
5. A modern web browser such as Google Chrome, Microsoft Edge, or Mozilla Firefox
6. An active internet connection for the Weather module

> **Note:** Node.js is not required.

## Step 2 — Open the UniCore Project in VS Code

1. Open **Visual Studio Code**.
2. Click **File → Open Folder**.
3. Select the **UniCore** project folder.
4. Click **Select Folder**.
5. Confirm that the VS Code Explorer shows the project folders:

```text
backend
database
frontend
```

## Step 3 — Open the VS Code Terminal

1. In VS Code, click **Terminal** from the top menu.
2. Select **New Terminal**.
3. Make sure the terminal is opened in the **UniCore project root folder**.

The terminal is used to run the commands required to configure and start the project.

## Step 4 — Check Python, pip, and MySQL

In the VS Code terminal, run:

```bash
python --version
pip --version
mysql --version
```

The required versions are:

- **Python:** 3.10 or newer
- **pip:** 23.0 or newer
- **MySQL:** 8.0 or newer

## Step 5 — Create the Database

Make sure MySQL Server is running.

From the UniCore project root folder, run:

```bash
mysql -u root -p < database/schema.sql
```

Then:

1. Press **Enter**.
2. Enter your MySQL root password when prompted.
3. The command creates the `unicore` database, tables, and starter sample data.

> **Important:** Do not repeatedly run this command because `schema.sql` contains `DROP DATABASE IF EXISTS unicore;`. Running it again will recreate the database and erase the existing data.

## Step 6 — Open the Backend Folder

In the VS Code terminal, run:

```bash
cd backend
```

The terminal should now be working inside the `backend` folder.

## Step 7 — Create a Virtual Environment

### Windows PowerShell

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

### Windows Command Prompt

```cmd
python -m venv venv
venv\Scripts\activate.bat
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## Step 8 — Install Python Dependencies

After activating the virtual environment, run:

```bash
pip install -r requirements.txt
```

This installs the Python packages required by the UniCore backend.

## Step 9 — Configure the `.env` File

Inside the `backend` folder, create the `.env` file from `.env.example`.

### Windows

```cmd
copy .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Open the `.env` file in VS Code and enter the required values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=unicore
SECRET_KEY=change-this-to-something-random
```

Replace `your_mysql_password` with the actual MySQL root password.

> **Security:** Do not upload or commit the `.env` file to GitHub.

## Step 10 — Start the Flask Server

Make sure the VS Code terminal is still inside the `backend` folder and the virtual environment is active.

Run:

```bash
python app.py
```

A successful startup should show a message similar to:

```text
Running on http://127.0.0.1:5000
```

> **Important:** Do not close this terminal while using UniCore.

## Step 11 — Open UniCore

Open Google Chrome, Microsoft Edge, or another supported browser.

Enter:

```text
http://localhost:5000
```

The UniCore landing page will open.

## Step 12 — Stop UniCore

When you finish using the application:

1. Return to the VS Code terminal where `python app.py` is running.
2. Press:

```text
Ctrl + C
```

The Flask server will stop.

---

# User Manual — Step by Step

After starting the Flask server in VS Code and opening `http://localhost:5000`, follow these steps to use UniCore.

## 1. Create an Account and Log In

1. Open `http://localhost:5000`.
2. Click **Sign Up**.
3. Enter your **Student ID, Name, Password, and Confirm Password**, then click **Create Account**.
4. You'll be redirected to your Dashboard.
5. Next time, click **Login**, enter your Name and Password, and click **Sign In**.
6. To leave, click **Logout** at the bottom of the left sidebar.

> All fields are required. If the two passwords don't match, the form will show an error and highlight the field.

## 2. Dashboard

After logging in you see a welcome message and four cards:

- Lost & Found
- Weather
- Alumni Network
- Find a Home

Click **Open** on a card, or use the left sidebar (or the dropdown menu on mobile) to switch between modules.

## 3. Lost & Found

### Post an Item

1. Open **Lost & Found** from the sidebar.
2. In the **Post an item** panel, optionally click the photo box to upload an image.
3. Fill in:
   - Item name
   - Details (where/when, identifying marks)
   - Location
   - Contact number
4. Click **Add item**.
5. Your post appears at the top of the board with an **Unclaimed** badge.

> Item name, location, and contact number are required.

### Search

Type in the search box. Results filter instantly by name, description, or location.

### Comment

Under any post, type into the comment box and press **Enter**.

Example:

```text
This is mine, I'll collect it today
```

## 4. Weather

1. Open **Weather** from the sidebar. Dhaka loads by default.
2. Type a city (for example, Chattogram, Sylhet, or London) into the search box and press **Enter**.
3. Read the results:

| Section | Information |
|---|---|
| Current | Temperature in °C and °F, feels like, and condition icon |
| Details | Humidity, wind speed, pressure, sunrise, and sunset |
| Next hours | Scrollable hourly strip with temperature and chance of rain |
| 5-day outlook | Daily high/low and condition |

4. If a city can't be found, a clear message is shown. Check the spelling and try again.

> The **Near me** button currently resolves to the campus city (Dhaka).

## 5. Alumni Network

1. Open **Alumni Network** from the sidebar.
2. Browse the alumni cards, which show name, batch, department, job, and company.
3. Use the search box to filter by:
   - Name
   - ID
   - Batch
   - Department
   - Graduation year
   - Company
   - Location
   - Email
   - Phone
   - `mentor` to see alumni who are available for mentorship
4. Open a profile to see graduation year, current role, location, contact details, LinkedIn, bio, and mentorship status.

## 6. Find a Home

### Post a Property

1. Open **Find a Home**.
2. In **Add new house**, fill in:
   - Property title
   - Location
   - Details
   - Monthly rent (BDT)
   - Contact number
3. Click **Add house**.
4. The listing appears with an **Available** badge.

### Search

Filter by title, location, description, or rent using the search box.

### Ask About a Listing

Use the comment box under a listing and press **Enter**.

Example:

```text
Is electricity included?
```

---

# Project Structure

```text
UniCore/
├── backend/
│   ├── app.py                 # Flask app: routes for auth, lost & found,
│   │                          # houses, alumni, weather
│   ├── db.py                  # MySQL connection + query helper
│   ├── weather.py             # Open-Meteo geocoding + forecast integration
│   ├── requirements.txt       # Python dependencies (pinned)
│   └── .env.example           # Template for environment variables
│
├── database/
│   └── schema.sql             # Database schema + seed data
│
├── frontend/
│   ├── index.html             # Landing, login and sign-up pages
│   ├── dashboard.html         # Main dashboard (all four modules)
│   ├── style.css              # Styling (responsive)
│   └── app.js                 # Client-side logic and API calls
│
└── README.md
```

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6) |
| Backend | Python, Flask, Flask-CORS |
| Database | MySQL (`mysql-connector-python`) |
| External API | Open-Meteo Geocoding + Forecast APIs |
| Security | Werkzeug password hashing, server-side sessions, parameterized SQL queries |
| Testing | Postman (API), manual UI testing |
| Tooling | Git & GitHub |

---

# REST API Reference

**Base URL:**

```text
http://localhost:5000
```

## Authentication & User Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signup` | Register a new user (`studentId`, `name`, `password`) |
| `POST` | `/api/login` | Log in (`name`, `password`) |
| `POST` | `/api/logout` | End the session |
| `GET` | `/api/user` | Get the currently logged-in user |

## Lost & Found Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lost-items` | List all lost/found items with comments |
| `POST` | `/api/lost-items` | Create an item (name, location, contact, optional details, photo) |
| `POST` | `/api/lost-items/<id>/comments` | Comment on an item (text) |

## Housing Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/houses` | List all houses with comments |
| `POST` | `/api/houses` | Create a listing (title, location, rent, contact, optional details) |
| `POST` | `/api/houses/<id>/comments` | Comment on a listing (text) |

## Alumni & Weather Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alumni` | List all alumni |
| `GET` | `/api/weather?city=<city>` | Live weather + hourly + 5-day forecast for a city |

### Weather API Example

```bash
curl "http://localhost:5000/api/weather?city=Dhaka"
```

### Error Handling

Endpoints return JSON with `success: false` and a message, using appropriate status codes:

| Status Code | Meaning |
|---:|---|
| `400` | Missing or invalid input |
| `401` | Bad credentials / not logged in |
| `404` | City not found |
| `409` | Student ID already registered |
| `502` | Weather service unreachable |

---

# Database Design

**Database name:** `unicore`  
**Character set:** `utf8mb4`

| Table | Purpose |
|---|---|
| `users` | Registered students (`student_id` is unique; password stored as a hash) |
| `lost_items` | Lost & found posts (status: `unclaimed` / `claimed`) |
| `lost_item_comments` | Comments on lost items (cascade-deleted with the item) |
| `houses` | Rental listings (status: `available` / `rented`) |
| `house_comments` | Comments on listings (cascade-deleted with the listing) |
| `alumni` | Alumni directory with career information and mentorship flag |

## Architecture

UniCore follows a classic **three-tier design**. Flask serves the static frontend and the JSON API from the same origin, which avoids CORS issues during normal use.

### Weather Request Flow

```text
User enters a city
        ↓
Frontend sends weather request
        ↓
Flask backend receives the request
        ↓
Open-Meteo geocoding resolves the city
        ↓
Open-Meteo forecast API provides weather data
        ↓
Flask returns JSON response
        ↓
Frontend displays the weather information
```

---

# Testing

| Area | Method | What was verified |
|---|---|---|
| API | Postman | Endpoints, requests/responses, status codes, payloads; Weather API responses validated |
| UI | Manual | Input fields, forms, buttons, validation messages, cross-flow checks (submit → response) |
| Backend | Module-level | Data submission and processing, API communication |
| Database | Manual | Data stored and retrieved correctly and stays consistent |

> All major features were tested end-to-end and work together.

---

# Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Could not connect to MySQL | MySQL not running, or wrong credentials | Start MySQL; check `DB_*` values in `backend/.env` |
| Access denied for user `'root'` | Wrong `DB_PASSWORD` | Update the password in `.env` |
| Unknown database `'unicore'` | Schema not imported | Re-run the database setup step |
| `ModuleNotFoundError` | Dependencies not installed / virtual environment not active | Activate the virtual environment and run `pip install -r requirements.txt` |
| `'mysql' is not recognized` (Windows) | MySQL bin folder not on PATH | Add it to PATH, or run the schema in MySQL Workbench |
| Port 5000 already in use | Another program uses port 5000 | Stop the program, or change the port in the last line of `backend/app.py` |
| Weather says `"Weather service error"` | No internet or Open-Meteo unreachable | Check your connection and retry |
| Weather says city not found | Misspelled city | Try another spelling or a nearby larger city |
| Page shows no styles | Opened the HTML file directly | Always use `http://localhost:5000` |

---

# Current Status & Roadmap

## Current Status

- ✅ Weather module is fully integrated end-to-end: frontend → Flask → Open-Meteo.
- ✅ Backend & database for authentication, Lost & Found, Find a Home, and Alumni are implemented (routes, MySQL schema, seed data, password hashing, input validation).
- ⚠️ In the current frontend build, the Login/Sign-up, Lost & Found, Find a Home, and Alumni screens run on built-in sample data in the browser. Posts and comments added there appear immediately but are not yet saved to MySQL and reset on refresh. The frontend hooks for these (`apiLogin`, `apiCreateLostItem`, etc.) are already in place and mapped to the endpoints above.

## Roadmap

- [ ] Connect the frontend forms to the existing `/api/...` endpoints so all data persists in MySQL.
- [ ] Enforce login on protected API routes.
- [ ] Real "Near me" weather using browser geolocation.
- [ ] Mark lost items as Claimed and houses as Rented from the UI.
- [ ] Image upload to file storage instead of inline data.
- [ ] Alumni registration and a mentorship request flow.
- [ ] Deployment to a public host.

---

# Project Management Notes

- **Timeline:** The project was completed within the schedule defined in our Gantt chart.
- **Risks identified:** API integration issues, data validation problems, software bugs, team coordination/time management, and frontend–backend integration. These were reduced through early testing, regular communication, and staged integration.
- **Challenges solved:** Weather API integration, incomplete user input (input validation), frontend–backend–database connection, and combining multiple features into one system.
- **Lessons learned:** Early testing + clear communication + gradual integration = fewer problems.

### Development Workflow

```text
Plan → Develop → Test → Integrate → Retest
```

---

# Team

| Name | Student ID |
|---|---:|
| Safayet Hossain Bhuiyan | 2023200000648 |
| Md. Nihad Hasan | 2023200000779 |
| Md. Ammar Uddin | 2023200000513 |
| Sajia Jarin Sristi | 2022200000042 |

**Instructor:** Ms. Namirah Rasul

---

# Acknowledgements

- [Open-Meteo](https://open-meteo.com/) for the free weather and geocoding APIs.
- Flask and MySQL communities.
- Google Fonts (Inter, Source Serif 4).
- Our instructor, Ms. Namirah Rasul, for her guidance throughout the course.

---


