package com.collateraltracker.backend.repository;

import com.collateraltracker.backend.model.CollateralHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CollateralHistoryRepository extends MongoRepository<CollateralHistory, String> {
    List<CollateralHistory> findByCollateralItemIdOrderByChangedAtDesc(String collateralItemId);
}
