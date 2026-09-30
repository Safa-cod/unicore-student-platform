-- =====================================================================
-- Unicore — Campus Utilities
-- MySQL schema + seed data
--
-- Run this once to create the database, tables and starter rows that
-- match what the frontend already shows as sample data.
--
--   mysql -u root -p < schema.sql
-- =====================================================================

DROP DATABASE IF EXISTS unicore;
CREATE DATABASE unicore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE unicore;

-- ---------------------------------------------------------------------
-- Users (signup / login)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    student_id    VARCHAR(30)  NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- Lost & Found
-- ---------------------------------------------------------------------
CREATE TABLE lost_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    details    TEXT,
    location   VARCHAR(150) NOT NULL,
    contact    VARCHAR(40)  NOT NULL,
    photo      LONGTEXT,                         -- data: URL or image path, nullable
    status     ENUM('unclaimed','claimed') NOT NULL DEFAULT 'unclaimed',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_item_comments (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    lost_item_id INT NOT NULL,
    author       VARCHAR(120) NOT NULL,
    text         TEXT NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lost_item_id) REFERENCES lost_items(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Find a Home
-- ---------------------------------------------------------------------
CREATE TABLE houses (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(150) NOT NULL,
    location   VARCHAR(150) NOT NULL,
    details    TEXT,
    rent       VARCHAR(30)  NOT NULL,             -- kept as text: frontend renders "18,000"
    contact    VARCHAR(40)  NOT NULL,
    status     ENUM('available','rented') NOT NULL DEFAULT 'available',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE house_comments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    house_id   INT NOT NULL,
    author     VARCHAR(120) NOT NULL,
    text       TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Alumni Network
-- ---------------------------------------------------------------------
CREATE TABLE alumni (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    student_id VARCHAR(30)  NOT NULL,
    batch      VARCHAR(10)  NOT NULL,
    dept       VARCHAR(20)  NOT NULL,
    grad_year  VARCHAR(10)  NOT NULL,
    email      VARCHAR(150) NOT NULL,
    phone      VARCHAR(40)  NOT NULL,
    job        VARCHAR(120) NOT NULL,
    company    VARCHAR(120) NOT NULL,
    location   VARCHAR(120) NOT NULL,
    linkedin   VARCHAR(150) NOT NULL,
    bio        TEXT,
    mentorship BOOLEAN NOT NULL DEFAULT FALSE
);

-- =====================================================================
-- Seed data — mirrors the sample data currently hardcoded in app.js
-- =====================================================================

INSERT INTO lost_items (name, details, location, contact, status, created_at) VALUES
('Blue Jansport backpack',
 'Left in the 2nd floor library reading room, near the window seats. Has a keychain with a small fox charm on the zipper.',
 'Library, 2nd floor', '01711-223344', 'unclaimed', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('Casio calculator (fx-991)',
 'Found on a bench outside the Commerce building after the 3pm exam block.',
 'Commerce building', '01899-004521', 'unclaimed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Black umbrella',
 'Found near the main gate during the evening rain. Slightly bent handle.',
 'Main gate', '01722-556677', 'claimed', DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT INTO lost_item_comments (lost_item_id, author, text) VALUES
(1, 'Rafi', 'Is this still there? I think I saw it at the help desk.'),
(1, 'Araf', 'This is mine, I''ll come collect it today.'),
(3, 'Mahin', 'That''s mine, thank you for holding onto it!');

INSERT INTO houses (title, location, details, rent, contact, status, created_at) VALUES
('2-bed flat, walk to campus', 'Mirpur',
 'Quiet residential street, 8 minutes on foot from the north gate. Attached bath, balcony.',
 '18,000', '01715-778899', 'available', NOW()),
('Single room, shared kitchen', 'Dhanmondi',
 'Furnished single room in a shared apartment with two other students. Wifi included.',
 '9,500', '01822-114455', 'available', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('3-bed family apartment', 'Uttara',
 'Spacious apartment near Sector 10, good for a group of roommates. Generator backup.',
 '28,000', '01911-223300', 'rented', DATE_SUB(NOW(), INTERVAL 7 DAY));

INSERT INTO house_comments (house_id, author, text) VALUES
(1, 'Tasnim', 'Is the room still available?'),
(3, 'Rakib', 'Can I visit tomorrow?');

INSERT INTO alumni (name, student_id, batch, dept, grad_year, email, phone, job, company, location, linkedin, bio, mentorship) VALUES
('Arif Hasan', '2020200000768', '65', 'CSE', '2024', 'arif.hasan@example.com', '01711-223344', 'Software Engineer', 'Microsoft', 'Seattle, USA', 'linkedin.com/in/arifhasan', 'Backend-leaning full-stack engineer working on Azure developer tooling. Loves mentoring juniors on DSA and job-hunt prep.', TRUE),
('Nusrat Jahan', '2019100000512', '64', 'BBA', '2023', 'nusrat.jahan@example.com', '01822-334455', 'Product Manager', 'bKash', 'Dhaka, Bangladesh', 'linkedin.com/in/nusratjahan', 'Leads the merchant payments product line. Happy to talk through product management transitions from a business background.', TRUE),
('Tanvir Ahmed', '2018200000341', '63', 'CSE', '2022', 'tanvir.ahmed@example.com', '+1 416-555-0134', 'Cloud Engineer', 'Amazon', 'Toronto, Canada', 'linkedin.com/in/tanvirahmed', 'Works on AWS infrastructure automation. Can help with cloud certifications and relocating for tech jobs abroad.', TRUE),
('Farzana Akter', '2020200000903', '65', 'EEE', '2024', 'farzana.akter@example.com', '01933-556677', 'Data Analyst', 'Grameenphone', 'Dhaka, Bangladesh', 'linkedin.com/in/farzanaakter', 'Analyzes network usage data to guide product decisions. New to mentoring but open to a few conversations.', FALSE),
('Shafiul Islam', '2017300000221', '62', 'CSE', '2021', 'shafiul.islam@example.com', '01644-778899', 'Backend Developer', 'Pathao', 'Chattogram, Bangladesh', 'linkedin.com/in/shafiulislam', 'Builds ride-hailing dispatch systems. Focused on his own projects right now, so not taking on mentees.', FALSE),
('Mahmuda Rahman', '2019200000678', '64', 'BBA', '2023', 'mahmuda.rahman@example.com', '+65 8123-4567', 'Strategy Consultant', 'Accenture', 'Singapore', 'linkedin.com/in/mahmudarahman', 'Advises clients on market-entry strategy across Southeast Asia. Enjoys mentoring students interested in consulting.', TRUE);
