package com.typeverse.tasktracker.controller;

import com.typeverse.tasktracker.model.Task;
import com.typeverse.tasktracker.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // for frontend access
public class TaskController {
    @Autowired
    private TaskRepository repo;

    @GetMapping
    public List<Task> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        return repo.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task t = repo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        t.setTitle(updatedTask.getTitle());
        t.setDescription(updatedTask.getDescription());
        t.setCompleted(updatedTask.isCompleted());
        // Add other fields as needed
        return repo.save(t);
    }
}
