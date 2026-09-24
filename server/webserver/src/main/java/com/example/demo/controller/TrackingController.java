package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.HabitTask;
import com.example.demo.services.TrackingService;

@RestController
@RequestMapping("/api/users/{userId}/tracking")
public class TrackingController {

    private final TrackingService taskTrackingService;

    public TrackingController(
            TrackingService taskTrackingService) {

        this.taskTrackingService =
                taskTrackingService;
    }

    @GetMapping
    public ResponseEntity<?> getTracking(
            @PathVariable("userId") String userId) {

        // Mark previous missed days first
        taskTrackingService.markMissedDays();

        HabitTask task =
                taskTrackingService
                    .getOrCreate(userId);

        return ResponseEntity.ok(
            Map.of(
                "habitIds",
                task.getHabitIds(),

                "completed",
                task.getCompleted(),

                "incomplete",
                task.getIncomplete(),

                "skipped",
                task.getSkipped()
            )
        );
    }
}