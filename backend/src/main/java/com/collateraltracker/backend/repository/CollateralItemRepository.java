package com.collateraltracker.backend.repository;

import com.collateraltracker.backend.model.CollateralItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CollateralItemRepository extends MongoRepository<CollateralItem, String> {
    Optional<CollateralItem> findByName(String name);
    List<CollateralItem> findByNameContainingIgnoreCase(String partialName);
}
