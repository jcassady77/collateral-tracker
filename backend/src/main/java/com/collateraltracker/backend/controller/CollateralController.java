package com.collateraltracker.backend.controller;

import com.collateraltracker.backend.model.CollateralHistory;
import com.collateraltracker.backend.model.CollateralItem;
import com.collateraltracker.backend.service.CollateralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<CollateralItem> createCollateralItem(@RequestBody CollateralItem collateralItem) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collateralService.createCollateralItem(collateralItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollateralItem> updateCollateralItem(
            @PathVariable String id,
            @RequestBody CollateralItem collateralItem) {
        return collateralService.updateCollateralItem(id, collateralItem)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<CollateralHistory>> getCollateralHistory(@PathVariable String id) {
        return ResponseEntity.ok(collateralService.getCollateralHistory(id));
    }
}
