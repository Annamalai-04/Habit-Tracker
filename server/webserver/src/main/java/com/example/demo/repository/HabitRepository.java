package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.entity.Habit;

public interface HabitRepository extends MongoRepository<Habit, String> {
}