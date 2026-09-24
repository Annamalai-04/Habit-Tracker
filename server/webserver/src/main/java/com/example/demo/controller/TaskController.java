package com.example.demo.controller;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.HabitTask;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.TrackingService;

@RestController
@RequestMapping("/api/users/{userId}/tasks")
public class TaskController {

    private static final ZoneId ZONE =
            ZoneId.of("Asia/Kolkata");

    private final TrackingService taskTrackingService;
    private final UserRepository userRepository;

    public TaskController(
            TrackingService taskTrackingService,
            UserRepository userRepository) {

        this.taskTrackingService =
                taskTrackingService;

        this.userRepository =
                userRepository;
    }

    // ==================================================
    // SAVE TODAY'S TASK
    // ==================================================

    @PostMapping
    public ResponseEntity<?> saveTask(
            @PathVariable("userId") String userId,
            @RequestBody TaskRequest request) {

        if (request.getHabitId() == null
                || request.getHabitId().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error",
                        "Habit ID is required"
                    ));
        }

        if (request.getStatus() == null
                || request.getStatus().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error",
                        "Task status is required"
                    ));
        }

        User user =
                userRepository.findById(userId)
                .orElse(null);

        if (user == null) {

            return ResponseEntity.notFound()
                    .build();
        }

        boolean following =
                user.getFollowingHabits()
                    .stream()
                    .anyMatch(
                        h -> h.getHabitId()
                              .equals(request.getHabitId())
                    );

        if (!following) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error",
                        "User is not following this habit"
                    ));
        }

        try {

            HabitTask saved =
                    taskTrackingService.saveTask(
                        userId,
                        request.getHabitId(),
                        request.getStatus()
                    );

            return ResponseEntity.ok(saved);

        }
        catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error",
                        e.getMessage()
                    ));
        }
    }

    // ==================================================
    // TODAY'S TASK
    // ==================================================

    @GetMapping("/today")
    public ResponseEntity<?> getTodayTask(
            @PathVariable("userId") String userId,
            @RequestParam("habitId") String habitId) {

        taskTrackingService.markMissedDays();

        HabitTask task =
                taskTrackingService
                    .getOrCreate(userId);

        String today =
                LocalDate.now(ZONE).toString();

        String status = null;

        if (contains(
                task.getCompleted(),
                habitId,
                today)) {

            status = "completed";

        }
        else if (contains(
                task.getIncomplete(),
                habitId,
                today)) {

            status = "incomplete";

        }
        else if (contains(
                task.getSkipped(),
                habitId,
                today)) {

            status = "skipped";
        }

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put(
                "habitId",
                habitId
        );

        result.put(
                "date",
                today
        );

        result.put(
                "status",
                status
        );

        return ResponseEntity.ok(result);
    }

    private boolean contains(
            Map<String, java.util.List<String>> map,
            String habitId,
            String date) {

        return map.containsKey(habitId)
                && map.get(habitId)
                    .contains(date);
    }

    // ==================================================
    // REQUEST
    // ==================================================

    public static class TaskRequest {

        private String habitId;
        private String status;
        private Integer durationMinutes;
        private String note;

        public String getHabitId() {
            return habitId;
        }

        public void setHabitId(String habitId) {
            this.habitId = habitId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Integer getDurationMinutes() {
            return durationMinutes;
        }

        public void setDurationMinutes(
                Integer durationMinutes) {

            this.durationMinutes =
                    durationMinutes;
        }

        public String getNote() {
            return note;
        }

        public void setNote(String note) {
            this.note = note;
        }
    }
}