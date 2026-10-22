# UniConnect — University Management System

A student-project starter built with **HTML, CSS, JavaScript, Java (Spring Boot), and MySQL**.

## Features in this starter
- Separate Student, Teacher, and Administrator login experiences
- Responsive dashboard layout
- Student dashboard sections for courses, attendance, marks/results, timetable, announcements, and profile
- Teacher sections for student records, attendance, marks, and results
- Simple administrator workspace for students, teachers, courses, and reports
- Java REST endpoints for demo login and dashboard data
- MySQL schema for users, courses, enrolments, attendance, marks, and announcements

**Important:** This is a learning prototype. Login credentials and dashboard figures are demo data; the sample Java login uses hard-coded demo users and is not production authentication. Do not use it for real student records. Before a real deployment, implement Spring Security, password hashing, role-based authorization, session/token handling, validation, and audit logs. The CRUD-style sections are UI demonstrations and do not yet save records to MySQL.

## Requirements
- JDK 17+
- Maven 3.9+
- MySQL 8+

## Run it
1. Open the project folder in IntelliJ IDEA as a Maven project.
2. In MySQL Workbench, run `database/schema.sql` (it creates the `uniconnect` database and tables).
3. Open `src/main/resources/application.properties` and replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.
4. Start the app from IntelliJ by running `UniConnectApplication.java`, or run `mvn spring-boot:run` from the project directory.
5. Open `http://localhost:8080`.

## Demo login
Use the role selector and these credentials:

| Role | Email | Password |
|---|---|---|
| Student | `student@uniconnect.edu` | `demo123` |
| Teacher | `teacher@uniconnect.edu` | `demo123` |
| Administrator | `admin@uniconnect.edu` | `demo123` |

The backend API can be checked at `http://localhost:8080/api/health`.

## Project structure
```text
UniConnect_University_Management_System/
├── pom.xml
├── README.md
├── database/schema.sql
└── src/main/
    ├── java/com/uniconnect/
    │   ├── UniConnectApplication.java
    │   └── PortalController.java
    └── resources/
        ├── application.properties
        └── static/
            ├── index.html
            ├── styles.css
            └── app.js
```

## Suggested next steps
1. Connect users and courses to MySQL using Spring JDBC repositories.
2. Add Spring Security and store only password hashes.
3. Build real forms to add students/teachers/courses and persist them to the database.
4. Add attendance entry and marks entry APIs with teacher-course permissions.
5. Add validation, error handling, and tests.
