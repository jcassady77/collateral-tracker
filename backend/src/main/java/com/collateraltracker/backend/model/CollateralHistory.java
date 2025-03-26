package com.collateraltracker.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "collateral_history")
public class CollateralHistory {
    
    @Id
    private String id;
    
    private String collateralItemId;
    private String fieldName;
    private Object oldValue;
    private Object newValue;
    private LocalDateTime changedAt;
}
