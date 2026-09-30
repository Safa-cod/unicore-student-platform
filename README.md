🎓 UniCore

A Smart Student Community Platform

UniCore is a student-focused web platform designed to bring multiple useful campus services together in one place. It aims to make everyday student activities easier by providing practical tools for finding lost items, buying and selling products, finding accommodation, connecting with alumni, and checking weather information.Instead of using separate platforms for different needs, UniCore provides these services through a single, simple, and user-friendly platform.

Lost & Found · Live Weather · Alumni Network · Find a Home — all in one place.
________________________________________


Table of Contents

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

About the Project

Student life at a university is spread across notice boards, Facebook groups, messaging apps, and word of mouth. UniCore brings the most useful everyday services into one centralized, web-based platform so students can:
•	recover lost belongings quickly,
•	check the weather before heading to campus,
•	find and connect with alumni for guidance and mentorship, and
•	find (or advertise) a place to live near campus.
UniCore was built as a team project for the Software Development and Project Management Lab course.
________________________________________

Key Features

Module	What it does
🎒 Lost & Found	Post lost/found items with a photo, description, location and contact number. Search existing posts and comment on them. Items carry an Unclaimed / Claimed status badge.
🌦️ Weather	Live weather for any city: temperature (°C and °F), "feels like", condition, humidity, wind, pressure, sunrise/sunset, an hourly forecast for the next hours, and a 5-day outlook. Powered by the free Open-Meteo API (no API key needed).
🎓 Alumni Network	Browse the alumni directory and search by name, ID, batch, department, graduation year, job, company, location, email, phone or mentorship availability. View academic and career details, and see who is open to mentoring.
🏠 Find a Home	Post available houses/rooms with title, location, details, monthly rent (BDT) and contact number. Search listings and comment to make inquiries. Listings show an Available / Rented badge.
🔐 Accounts	Sign up with Student ID, name and password; log in and log out. Passwords are stored as salted hashes (Werkzeug), never as plain text.
📱 Responsive UI	Sidebar dashboard on desktop and a dropdown navigation on small screens.




