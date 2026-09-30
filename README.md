🎓 UniCore
A Smart Student Community Platform
UniCore is a student-focused web platform designed to bring multiple useful campus services together in one place. It aims to make everyday student activities easier by providing practical tools for finding lost items, buying and selling products, finding accommodation, connecting with alumni, and checking weather information.Instead of using separate platforms for different needs, UniCore provides these services through a single, simple, and user-friendly platform.

Lost & Found · Live Weather · Alumni Network · Find a Home — all in one place.
       





 


                                                                 





________________________________________

📑 Table of Contents
1.	About the Project
2.	Key Features
3.	Deployment Type & Access
4.	System Requirements
5.	Installation Guide (Localhost)
6.	User Manual — Step by Step
7.	Project Structure
8.	Tech Stack
9.	REST API Reference
10.	Database Design
11.	Testing
12.	Troubleshooting
13.	Current Status & Roadmap
14.	Project Management Notes
15.	Team
16.	Acknowledgements
________________________________________

📖 About the Project
Student life at a university is spread across notice boards, Facebook groups, messaging apps, and word of mouth. UniCore brings the most useful everyday services into one centralized, web-based platform so students can:
•	recover lost belongings quickly,
•	check the weather before heading to campus,
•	find and connect with alumni for guidance and mentorship, and
•	find (or advertise) a place to live near campus.
UniCore was built as a team project for the Software Development and Project Management Lab course.
	
________________________________________
✨ Key Features
Module	What it does
🎒 Lost & Found	Post lost/found items with a photo, description, location and contact number. Search existing posts and comment on them. Items carry an Unclaimed / Claimed status badge.
🌦️ Weather	Live weather for any city: temperature (°C and °F), "feels like", condition, humidity, wind, pressure, sunrise/sunset, an hourly forecast for the next hours, and a 5-day outlook. Powered by the free Open-Meteo API (no API key needed).
🎓 Alumni Network	Browse the alumni directory and search by name, ID, batch, department, graduation year, job, company, location, email, phone or mentorship availability. View academic and career details, and see who is open to mentoring.
🏠 Find a Home	Post available houses/rooms with title, location, details, monthly rent (BDT) and contact number. Search listings and comment to make inquiries. Listings show an Available / Rented badge.
🔐 Accounts	Sign up with Student ID, name and password; log in and log out. Passwords are stored as salted hashes (Werkzeug), never as plain text.
📱 Responsive UI	Sidebar dashboard on desktop and a dropdown navigation on small screens.
________________________________________

🌐 Deployment Type & Access
UniCore is a localhost application. It is not hosted on a public website, so there is no live URL.
You run it on your own computer, then open it in your browser at:
http://localhost:5000
Follow the Installation Guide below. A typical setup takes about 10 minutes.
________________________________________
💻 System Requirements
Software required to run the app
Software	Required Version	Purpose	Download
Python	3.10 or newer (developed and run on Python 3.14)	Runs the Flask backend	python.org

pip	23.0+ (ships with Python)	Installs Python dependencies	Included with Python
MySQL Server	8.0 or newer (8.4 LTS works)	Stores users, posts, comments, alumni	dev.mysql.com

Git	2.30+	Clones the repository	git-scm.com

Web browser	See below	Uses the app	—
Internet connection	Required	Weather data (Open-Meteo) and Google Fonts	—
Node.js is not required. The frontend is plain HTML/CSS/JavaScript served by Flask.
Python packages (installed automatically)
Pinned in backend/requirements.txt:
Package	Version
Flask	3.0.3
flask-cors	4.0.1
mysql-connector-python	8.4.0
python-dotenv	1.0.1
requests	2.32.3
Werkzeug	3.0.3
Supported browsers
UniCore uses standard modern web features (CSS variables, fetch, async/await, FileReader, sessionStorage), so any up-to-date browser works:
Browser	Minimum Version	Recommended
Google Chrome	90+	Latest
Microsoft Edge	90+	Latest
Mozilla Firefox	88+	Latest
Safari	14+	Latest
Internet Explorer is not supported.
Operating systems
Windows 10/11, macOS 12+, and Linux (Ubuntu 20.04+) are all supported.
________________________________________
🛠️ Installation Guide (Localhost)
Step 1 — Clone the repository
git clone https://github.com/Safa-cod/unicore-student-platform.git
cd unicore-student-platform
(If you downloaded the ZIP instead, extract it and open a terminal inside the extracted folder.)
Step 2 — Verify the prerequisites
python --version      # should print 3.10 or higher  (use python3 on macOS/Linux)
pip --version
mysql --version       # should print 8.0 or higher
Step 3 — Create the database
Make sure MySQL Server is running, then from the project root run:
mysql -u root -p < database/schema.sql
Enter your MySQL root password when prompted. This creates the unicore database, all tables, and starter sample data (alumni, lost items, houses).
⚠️ Warning: schema.sql begins with DROP DATABASE IF EXISTS unicore;. Running it again will erase and recreate the unicore database.
Step 4 — Set up a Python virtual environment (recommended)
cd backend

# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1

# Windows (Command Prompt)
python -m venv venv
venv\Scripts\activate.bat

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
Step 5 — Install the dependencies
pip install -r requirements.txt
Step 6 — Configure environment variables
Copy the example file and edit it:
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
Open .env and fill in your values:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password      # <-- your real MySQL password
DB_NAME=unicore

SECRET_KEY=change-this-to-something-random   # <-- any long random string
🔒 Never commit your .env file. It contains secrets.
Step 7 — Start the server
python app.py
You should see output similar to:
 * Running on http://127.0.0.1:5000
 * Debug mode: on
Step 8 — Open the app
Go to http://localhost:5000 in your browser. You'll see the UniCore landing page. 🎉
To stop the server, press Ctrl + C in the terminal.
________________________________________
📘 User Manual — Step by Step
1. Create an account and log in
1.	Open http://localhost:5000.
2.	Click Sign Up.
3.	Enter your Student ID, Name, Password, and Confirm Password, then click Create Account.
4.	You'll be redirected to your Dashboard.
5.	Next time, click Login, enter your Name and Password, and click Sign In.
6.	To leave, click Logout at the bottom of the left sidebar.
All fields are required. If the two passwords don't match, the form will show an error and highlight the field.
2. Dashboard
After logging in you see a welcome message and four cards — Lost & Found, Weather, Alumni Network, Find a Home. Click Open on a card, or use the left sidebar (or the dropdown menu on mobile) to switch between modules.
3. 🎒 Lost & Found
Post an item
1.	Open Lost & Found from the sidebar.
2.	In the Post an item panel, (optionally) click the photo box to upload an image.
3.	Fill in Item name, Details (where/when, identifying marks), Location, and Contact number.
4.	Click Add item. Your post appears at the top of the board with an Unclaimed badge.
Item name, location and contact number are required.
Search
•	Type in the search box — results filter instantly by name, description, or location.
Comment
•	Under any post, type into the comment box (e.g., "This is mine, I'll collect it today") and press Enter.
4. 🌦️ Weather
1.	Open Weather from the sidebar. Dhaka loads by default.
2.	Type a city (e.g., Chattogram, Sylhet, London) into the search box and press Enter.
3.	Read the results: 
o	Current: temperature in °C and °F, "feels like", and condition icon
o	Details: humidity, wind speed, pressure, sunrise, sunset
o	Next hours: scrollable hourly strip with temperature and chance of rain
o	5-day outlook: daily high/low and condition
4.	If a city can't be found, a clear message is shown — check the spelling and try again.
The Near me button currently resolves to the campus city (Dhaka).
5. 🎓 Alumni Network
1.	Open Alumni Network from the sidebar.
2.	Browse the alumni cards, which show name, batch, department, job and company.
3.	Use the search box to filter by name, ID, batch, department, graduation year, company, location, email, phone — or type mentor to see alumni who are available for mentorship.
4.	Open a profile to see graduation year, current role, location, contact details, LinkedIn, bio, and mentorship status — then reach out to connect.
6. 🏠 Find a Home
Post a property
1.	Open Find a Home.
2.	In Add new house, fill in Property title, Location, Details, Monthly rent (BDT), and Contact number.
3.	Click Add house. The listing appears with an Available badge.
Search
•	Filter by title, location, description, or rent using the search box.
Ask about a listing
•	Use the comment box under a listing (e.g., "Is electricity included?") and press Enter.
________________________________________


📂 Project Structure
UniCore/
├── backend/
│   ├── app.py              # Flask app: routes for auth, lost & found, houses, alumni, weather
│   ├── db.py               # MySQL connection + query helper
│   ├── weather.py          # Open-Meteo geocoding + forecast integration
│   ├── requirements.txt    # Python dependencies (pinned)
│   └── .env.example        # Template for environment variables
├── database/
│   └── schema.sql          # Database schema + seed data
├── frontend/
│   ├── index.html          # Landing, login and sign-up pages
│   ├── dashboard.html      # Main dashboard (all four modules)
│   ├── style.css           # Styling (responsive)
│   └── app.js              # Client-side logic and API calls
└── README.md
________________________________________
🧰 Tech Stack
Layer	Technology
Frontend	HTML5, CSS3, Vanilla JavaScript (ES6)
Backend	Python, Flask, Flask-CORS
Database	MySQL (mysql-connector-python)
External API	Open-Meteo Geocoding + Forecast APIs

Security	Werkzeug password hashing, server-side sessions, parameterized SQL queries
Testing	Postman (API), manual UI testing
Tooling	Git & GitHub
________________________________________
🔌 REST API Reference
Base URL: http://localhost:5000
Method	Endpoint	Description
POST	/api/signup	Register a new user (studentId, name, password)
POST	/api/login	Log in (name, password)
POST	/api/logout	End the session
GET	/api/user	Get the currently logged-in user
GET	/api/lost-items	List all lost/found items with comments
POST	/api/lost-items	Create an item (name, location, contact, optional details, photo)
POST	/api/lost-items/<id>/comments	Comment on an item (text)
GET	/api/houses	List all houses with comments
POST	/api/houses	Create a listing (title, location, rent, contact, optional details)
POST	/api/houses/<id>/comments	Comment on a listing (text)
GET	/api/alumni	List all alumni
GET	/api/weather?city=<city>	Live weather + hourly + 5-day forecast for a city
Example
curl "http://localhost:5000/api/weather?city=Dhaka"
Error handling: endpoints return JSON with success: false and a message, using proper status codes — 400 (missing/invalid input), 401 (bad credentials / not logged in), 404 (city not found), 409 (Student ID already registered), 502 (weather service unreachable).
________________________________________
🗄️ Database Design
Database name: unicore (utf8mb4)
Table	Purpose
users	Registered students (student_id is unique, password stored as hash)
lost_items	Lost & found posts (status: unclaimed / claimed)
lost_item_comments	Comments on lost items (cascade-deleted with the item)
houses	Rental listings (status: available / rented)
house_comments	Comments on listings (cascade-deleted with the listing)
alumni	Alumni directory with career info and mentorship flag

Architecture

 UniCore follows a classic three-tier design. Flask serves the static frontend and  the JSON API       from the same origin, which avoids CORS issues during normal use.
 

Weather request flow
 

✅ Testing
Area	Method	What was verified
API	Postman	Endpoints, requests/responses, status codes, payloads; Weather API responses validated
UI	Manual	Input fields, forms, buttons, validation messages, cross-flow checks (submit → response)
Backend	Module-level	Data submission and processing, API communication
Database	Manual	Data stored, retrieved correctly and stays consistent
All major features were tested end-to-end and work together.
________________________________________
🩺 Troubleshooting
Problem	Likely Cause	Fix
Could not connect to MySQL	MySQL not running, or wrong credentials	Start MySQL; check DB_* values in backend/.env
Access denied for user 'root'	Wrong DB_PASSWORD	Update the password in .env
Unknown database 'unicore'	Schema not imported	Re-run Step 3
ModuleNotFoundError	Dependencies not installed / venv not active	Activate the venv and run pip install -r requirements.txt
'mysql' is not recognized (Windows)	MySQL bin folder not on PATH	Add it to PATH, or run the schema in MySQL Workbench
Port 5000 already in use	Another program (e.g., AirPlay on macOS) uses it	Stop it, or change the port in the last line of backend/app.py
Weather says "Weather service error"	No internet or Open-Meteo unreachable	Check your connection and retry
Weather says city not found	Misspelled city	Try another spelling or a nearby larger city
Page shows no styles	Opened the HTML file directly	Always use http://localhost:5000
________________________________________

🚧 Current Status & Roadmap
Current status
•	✅ Weather module is fully integrated end-to-end: frontend → Flask → Open-Meteo.
•	✅ Backend & database for authentication, Lost & Found, Find a Home and Alumni are implemented (routes, MySQL schema, seed data, password hashing, input validation).
•	⚠️ In the current frontend build, the Login/Sign-up, Lost & Found, Find a Home and Alumni screens run on built-in sample data in the browser. Posts and comments you add there appear immediately but are not yet saved to MySQL and reset on refresh. The frontend hooks for these (apiLogin, apiCreateLostItem, etc.) are already in place and mapped to the endpoints above.
Roadmap
•	[ ] Connect the frontend forms to the existing /api/... endpoints so all data persists in MySQL
•	[ ] Enforce login on protected API routes
•	[ ] Real "Near me" weather using browser geolocation
•	[ ] Mark lost items as Claimed and houses as Rented from the UI
•	[ ] Image upload to file storage instead of inline data
•	[ ] Alumni registration and a mentorship request flow
•	[ ] Deployment to a public host
________________________________________
📊 Project Management Notes
•	Timeline: The project was completed within the schedule defined in our Gantt chart.
•	Risks identified: API integration issues, data validation problems, software bugs, team coordination/time management, and frontend–backend integration. These were reduced through early testing, regular communication, and staged integration.
•	Challenges solved: Weather API integration, incomplete user input (input validation), frontend–backend–database connection, and combining multiple features into one system.
•	Lessons learned: Early testing + clear communication + gradual integration = fewer problems. Our workflow going forward: Plan → Develop → Test → Integrate → Retest.
________________________________________

👥 Team
Name	Student ID
Safayet Hossain Bhuiyan	2023200000648
Md. Nihad Hasan	2023200000779
Md. Ammar Uddin	2023200000513
Sajia Jarin Sristi	2022200000042
Instructor: Ms. Namirah Rasul 
________________________________________
🙏 Acknowledgements
•	Open-Meteo for the free weather and geocoding APIs
•	Flask and MySQL communities
•	Google Fonts (Inter, Source Serif 4)
•	Our instructor, Ms. Namirah Rasul, for her guidance throughout the course
________________________________________


