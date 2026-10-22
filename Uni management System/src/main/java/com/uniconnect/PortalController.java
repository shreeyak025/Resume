package com.uniconnect;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For local student-project development only.
public class PortalController {

    private static final Map<String, Map<String, String>> DEMO_USERS = Map.of(
        "student", Map.of("email", "student@uniconnect.edu", "password", "demo123", "name", "Aarav Sharma"),
        "teacher", Map.of("email", "teacher@uniconnect.edu", "password", "demo123", "name", "Dr. Meera Shah"),
        "admin",   Map.of("email", "admin@uniconnect.edu",   "password", "demo123", "name", "Administrator")
    );

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String role = body.getOrDefault("role", "").toLowerCase();
        String email = body.getOrDefault("email", "");
        String password = body.getOrDefault("password", "");
        Map<String, String> user = DEMO_USERS.get(role);
        if (user == null || !user.get("email").equalsIgnoreCase(email) || !user.get("password").equals(password)) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid demo credentials");
        }
        return Map.of("success", true, "role", role, "name", user.get("name"), "email", user.get("email"));
    }

    @GetMapping("/dashboard/{role}")
    public Map<String, Object> dashboard(@PathVariable String role) {
        return switch (role.toLowerCase()) {
            case "student" -> Map.of(
                "title", "Student Overview",
                "stats", List.of(
                    Map.of("label", "Attendance", "value", "92%", "note", "Across all subjects"),
                    Map.of("label", "Current GPA", "value", "8.7", "note", "Sample data"),
                    Map.of("label", "Courses", "value", "6", "note", "This semester"),
                    Map.of("label", "Pending tasks", "value", "3", "note", "Assignments and work")
                ),
                "items", List.of(
                    Map.of("name", "Data Structures", "detail", "Next class · 10:00 AM", "status", "In progress"),
                    Map.of("name", "Database Management Systems", "detail", "Assignment due · Friday", "status", "Due soon"),
                    Map.of("name", "Artificial Intelligence", "detail", "Internal marks published", "status", "Updated")
                )
            );
            case "teacher" -> Map.of(
                "title", "Teacher Overview",
                "stats", List.of(
                    Map.of("label", "My students", "value", "124", "note", "Across assigned courses"),
                    Map.of("label", "Courses", "value", "4", "note", "Current semester"),
                    Map.of("label", "Attendance pending", "value", "2", "note", "Sheets to complete"),
                    Map.of("label", "Marks pending", "value", "18", "note", "Entries to review")
                ),
                "items", List.of(
                    Map.of("name", "CS-201 · Data Structures", "detail", "42 students", "status", "Attendance open"),
                    Map.of("name", "CS-204 · Database Systems", "detail", "38 students", "status", "Marks review"),
                    Map.of("name", "CS-210 · Intro to AI", "detail", "44 students", "status", "Up to date")
                )
            );
            case "admin" -> Map.of(
                "title", "Administrator Overview",
                "stats", List.of(
                    Map.of("label", "Students", "value", "1,248", "note", "Sample total"),
                    Map.of("label", "Teachers", "value", "86", "note", "Academic staff"),
                    Map.of("label", "Courses", "value", "42", "note", "Active courses"),
                    Map.of("label", "Pending requests", "value", "7", "note", "Need review")
                ),
                "items", List.of(
                    Map.of("name", "Student directory", "detail", "Add or review student records", "status", "Open section"),
                    Map.of("name", "Faculty directory", "detail", "Manage teacher accounts", "status", "Open section"),
                    Map.of("name", "Courses & subjects", "detail", "Maintain course catalogue", "status", "Open section")
                )
            );
            default -> throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Unknown role");
        };
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "app", "UniConnect API");
    }
}