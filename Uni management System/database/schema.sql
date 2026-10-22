CREATE DATABASE IF NOT EXISTS uniconnect;
USE uniconnect;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('STUDENT','TEACHER','ADMIN') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(120) NOT NULL,
  semester INT NOT NULL,
  teacher_id BIGINT NULL,
  FOREIGN KEY (teacher_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  academic_year VARCHAR(12) NOT NULL,
  UNIQUE(student_id, course_id, academic_year),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  class_date DATE NOT NULL,
  status ENUM('PRESENT','ABSENT','LATE') NOT NULL,
  recorded_by BIGINT NULL,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS marks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  assessment_name VARCHAR(100) NOT NULL,
  marks_obtained DECIMAL(5,2) NOT NULL,
  max_marks DECIMAL(5,2) NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  entered_by BIGINT NULL,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (entered_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  created_by BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
