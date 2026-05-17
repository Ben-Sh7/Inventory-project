package com.example.inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryRepository repository;

    @GetMapping
    public List<Item> getAllItems() {
        return repository.findAll();
    }

    @PostMapping // עכשיו הקומפיילר ידע בדיוק איפה למצוא אותי
    public Item addItem(@RequestBody Item item) {
        return repository.save(item);
    }
}