package com.example.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Item, Long> {
    // כאן אפשר להוסיף פונקציות חיפוש מותאמות אישית בעתיד אם נרצה
}