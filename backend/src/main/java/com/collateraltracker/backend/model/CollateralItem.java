package com.collateraltracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "collateral_items")
public class CollateralItem {
    
    @Id
    private String id;
    
    private String name;
    private Double value;
    private LocalDate appraisalDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private Map<String, Object> creDatapoints;
    
    public CollateralItem() {
        this.creDatapoints = new HashMap<>();
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Double getValue() {
        return value;
    }
    
    public void setValue(Double value) {
        this.value = value;
    }
    
    public LocalDate getAppraisalDate() {
        return appraisalDate;
    }
    
    public void setAppraisalDate(LocalDate appraisalDate) {
        this.appraisalDate = appraisalDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Map<String, Object> getCreDatapoints() {
        return creDatapoints;
    }
    
    public void setCreDatapoints(Map<String, Object> creDatapoints) {
        this.creDatapoints = creDatapoints;
    }
    
    public void setCreDatapoint(String key, Object value) {
        if (this.creDatapoints == null) {
            this.creDatapoints = new HashMap<>();
        }
        this.creDatapoints.put(key, value);
    }
    
    public Object getCreDatapoint(String key) {
        if (this.creDatapoints == null) {
            return null;
        }
        return this.creDatapoints.get(key);
    }
}
