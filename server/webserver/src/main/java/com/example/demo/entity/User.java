package com.example.demo.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String name;
    private String email;
    private String password;
    private LocalDate dob;

    private int rank = 0;

    private List<FollowingHabit> followingHabits = new ArrayList<>();

    public User() {
    }

    // ==================================================
    // USER
    // ==================================================

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public List<FollowingHabit> getFollowingHabits() {
        return followingHabits;
    }

    public void setFollowingHabits(
            List<FollowingHabit> followingHabits) {
        this.followingHabits = followingHabits;
    }

    // ==================================================
    // FOLLOWING HABIT
    // ==================================================

    public static class FollowingHabit {

        private String habitId;

        private int days;

        // Date user clicked Follow
        private LocalDate dateFollowed;

        // First day of tracking
        private LocalDate startedAt;

        // Last day of tracking
        private LocalDate endAt;

        public FollowingHabit() {
        }

        public String getHabitId() {
            return habitId;
        }

        public void setHabitId(String habitId) {
            this.habitId = habitId;
        }

        public int getDays() {
            return days;
        }

        public void setDays(int days) {
            this.days = days;
        }

        public LocalDate getDateFollowed() {
            return dateFollowed;
        }

        public void setDateFollowed(LocalDate dateFollowed) {
            this.dateFollowed = dateFollowed;
        }

        public LocalDate getStartedAt() {
            return startedAt;
        }

        public void setStartedAt(LocalDate startedAt) {
            this.startedAt = startedAt;
        }

        public LocalDate getEndAt() {
            return endAt;
        }

        public void setEndAt(LocalDate endAt) {
            this.endAt = endAt;
        }
    }
}