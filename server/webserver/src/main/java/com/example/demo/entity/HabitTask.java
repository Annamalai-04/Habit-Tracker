package com.example.demo.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "habitTasks")
public class HabitTask {

    @Id
    private String id;

    private String userId;

    // All habits currently tracked by this user
    private List<String> habitIds = new ArrayList<>();

    // habitId -> completed dates
    private Map<String, List<String>> completed =
            new HashMap<>();

    // habitId -> incomplete dates
    private Map<String, List<String>> incomplete =
            new HashMap<>();

    // habitId -> skipped dates
    private Map<String, List<String>> skipped =
            new HashMap<>();

    public HabitTask() {
    }

    // ==================================================
    // ID
    // ==================================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // ==================================================
    // USER ID
    // ==================================================

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    // ==================================================
    // HABIT IDS
    // ==================================================

    public List<String> getHabitIds() {
        return habitIds;
    }

    public void setHabitIds(List<String> habitIds) {
        this.habitIds = habitIds;
    }

    // ==================================================
    // COMPLETED
    // ==================================================

    public Map<String, List<String>> getCompleted() {
        return completed;
    }

    public void setCompleted(
            Map<String, List<String>> completed) {
        this.completed = completed;
    }

    // ==================================================
    // INCOMPLETE
    // ==================================================

    public Map<String, List<String>> getIncomplete() {
        return incomplete;
    }

    public void setIncomplete(
            Map<String, List<String>> incomplete) {
        this.incomplete = incomplete;
    }

    // ==================================================
    // SKIPPED
    // ==================================================

    public Map<String, List<String>> getSkipped() {
        return skipped;
    }

    public void setSkipped(
            Map<String, List<String>> skipped) {
        this.skipped = skipped;
    }
}