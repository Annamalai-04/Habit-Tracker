package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.Habit;
import com.example.demo.repository.HabitRepository;
import org.springframework.data.mongodb.core.MongoTemplate;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitRepository habitRepository;
    
    public HabitController(HabitRepository habitRepository) {
        this.habitRepository = habitRepository;
    }


    // Get all habits
    @GetMapping
    public ResponseEntity<List<Habit>> getAllHabits() {
        return ResponseEntity.ok(habitRepository.findAll());
    }

    // Get one habit
    @GetMapping("/{id}")
    public ResponseEntity<?> getHabit(@PathVariable String id) {

        return habitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                    ResponseEntity.notFound().build()
                );
    }
    
    @PostMapping
    public ResponseEntity<?> createHabit(
            @RequestBody Habit habit) {

        habit.setFollowers(0);

        Habit savedHabit = habitRepository.save(habit);

        return ResponseEntity.ok(savedHabit);
    }
    

}