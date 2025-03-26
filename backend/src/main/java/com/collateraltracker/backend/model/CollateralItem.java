package com.collateraltracker.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "collateral_items")
public class CollateralItem {
    
    @Id
    private String id;
    
    private String name;
    private Double value;
    private LocalDate appraisalDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
