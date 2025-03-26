package com.collateraltracker.backend.controller;

import com.collateraltracker.backend.model.CollateralHistory;
import com.collateraltracker.backend.model.CollateralItem;
import com.collateraltracker.backend.service.CollateralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/collateral")
public class CollateralController {

    @Autowired
    private CollateralService collateralService;

    @GetMapping
    public ResponseEntity<List<CollateralItem>> getAllCollateralItems() {
        return ResponseEntity.ok(collateralService.getAllCollateralItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollateralItem> getCollateralItemById(@PathVariable String id) {
        return collateralService.getCollateralItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<CollateralItem> getCollateralItemByName(@RequestParam String name) {
        return collateralService.getCollateralItemByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCollateralItem(@RequestBody CollateralItem collateralItem) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(collateralService.createCollateralItem(collateralItem));
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid date format: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating collateral item: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollateralItem(
            @PathVariable String id,
            @RequestBody CollateralItem collateralItem) {
        try {
            return collateralService.updateCollateralItem(id, collateralItem)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid date format: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating collateral item: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<CollateralHistory>> getCollateralHistory(@PathVariable String id) {
        return ResponseEntity.ok(collateralService.getCollateralHistory(id));
    }
}
