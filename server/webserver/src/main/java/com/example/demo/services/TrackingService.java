package com.example.demo.services;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.demo.entity.HabitTask;
import com.example.demo.entity.User;
import com.example.demo.repository.HabitTaskRepository;
import com.example.demo.repository.UserRepository;

@Service
public class TrackingService {

    private static final ZoneId ZONE =
            ZoneId.of("Asia/Kolkata");

    private final HabitTaskRepository habitTaskRepository;
    private final UserRepository userRepository;

    public TrackingService(
            HabitTaskRepository habitTaskRepository,
            UserRepository userRepository) {

        this.habitTaskRepository =
                habitTaskRepository;

        this.userRepository =
                userRepository;
    }

    // ==================================================
    // GET / CREATE HABITTASK DOCUMENT
    // ==================================================

    public HabitTask getOrCreate(String userId) {

        return habitTaskRepository
                .findByUserId(userId)
                .orElseGet(() -> {

                    HabitTask task = new HabitTask();

                    task.setUserId(userId);

                    return habitTaskRepository.save(task);
                });
    }

    // ==================================================
    // ADD HABIT TO HABITTASK
    // ==================================================

    public void addHabit(
            String userId,
            String habitId) {

        HabitTask task =
                getOrCreate(userId);

        if (!task.getHabitIds()
                .contains(habitId)) {

            task.getHabitIds()
                    .add(habitId);
        }

        habitTaskRepository.save(task);
    }

    // ==================================================
    // REMOVE HABIT FROM ACTIVE HABITS
    // ==================================================

    public void removeHabit(
            String userId,
            String habitId) {

        HabitTask task =
                getOrCreate(userId);

        task.getHabitIds()
                .remove(habitId);

        // Keep history in completed/incomplete/skipped.
        // Only remove from active habitIds.

        habitTaskRepository.save(task);
    }

    // ==================================================
    // SAVE TODAY'S TASK
    // ==================================================

    public HabitTask saveTask(
            String userId,
            String habitId,
            String status) {

        HabitTask task =
                getOrCreate(userId);

        LocalDate today =
                LocalDate.now(ZONE);

        removeDate(
                task.getCompleted(),
                habitId,
                today
        );

        removeDate(
                task.getIncomplete(),
                habitId,
                today
        );

        removeDate(
                task.getSkipped(),
                habitId,
                today
        );

        if ("completed".equals(status)) {

            addDate(
                task.getCompleted(),
                habitId,
                today
            );

        }
        else if ("incomplete".equals(status)) {

            addDate(
                task.getIncomplete(),
                habitId,
                today
            );

        }
        else if ("skipped".equals(status)) {

            addDate(
                task.getSkipped(),
                habitId,
                today
            );

        }
        else {

            throw new IllegalArgumentException(
                    "Invalid task status"
            );
        }

        return habitTaskRepository.save(task);
    }

    // ==================================================
    // AUTOMATIC SKIPPED DAYS
    // ==================================================

    /*
     * Yesterday and older dates with no action
     * become skipped.
     *
     * Today is NOT automatically skipped.
     */

    public void markMissedDays() {

        LocalDate today =
                LocalDate.now(ZONE);

        LocalDate yesterday =
                today.minusDays(1);

        List<User> users =
                userRepository.findAll();

        for (User user : users) {

            HabitTask task =
                    getOrCreate(user.getId());

            if (user.getFollowingHabits() == null) {
                continue;
            }

            for (User.FollowingHabit following
                    : user.getFollowingHabits()) {

                String habitId =
                        following.getHabitId();

                LocalDate start =
                        following.getDateFollowed();

                if (start == null) {
                    start = following.getStartedAt();
                }

                LocalDate end =
                        following.getEndAt();

                if (start == null || end == null) {
                    continue;
                }

                LocalDate lastDate =
                        yesterday.isBefore(end)
                                ? yesterday
                                : end;

                LocalDate date = start;

                while (!date.isAfter(lastDate)) {

                    if (!hasAnyStatus(
                            task,
                            habitId,
                            date)) {

                        addDate(
                                task.getSkipped(),
                                habitId,
                                date
                        );
                    }

                    date = date.plusDays(1);
                }
            }

            habitTaskRepository.save(task);
        }
    }

    // ==================================================
    // RUN EVERY MIDNIGHT
    // ==================================================

    @Scheduled(
        cron = "0 0 0 * * *",
        zone = "Asia/Kolkata"
    )
    public void automaticDailySkip() {

        markMissedDays();
    }

    // ==================================================
    // CHECK STATUS
    // ==================================================

    private boolean hasAnyStatus(
            HabitTask task,
            String habitId,
            LocalDate date) {

        String value =
                date.toString();

        return containsDate(
                    task.getCompleted(),
                    habitId,
                    value
                )
                ||
                containsDate(
                    task.getIncomplete(),
                    habitId,
                    value
                )
                ||
                containsDate(
                    task.getSkipped(),
                    habitId,
                    value
                );
    }

    // ==================================================
    // ADD DATE
    // ==================================================

    private void addDate(
            Map<String, List<String>> map,
            String habitId,
            LocalDate date) {

        List<String> dates =
                map.computeIfAbsent(
                    habitId,
                    key -> new ArrayList<>()
                );

        String value =
                date.toString();

        if (!dates.contains(value)) {
            dates.add(value);
        }
    }

    // ==================================================
    // REMOVE DATE
    // ==================================================

    private void removeDate(
            Map<String, List<String>> map,
            String habitId,
            LocalDate date) {

        List<String> dates =
                map.get(habitId);

        if (dates != null) {

            dates.remove(
                    date.toString()
            );
        }
    }

    // ==================================================
    // CONTAINS DATE
    // ==================================================

    private boolean containsDate(
            Map<String, List<String>> map,
            String habitId,
            String date) {

        List<String> dates =
                map.get(habitId);

        return dates != null
                && dates.contains(date);
    }
}