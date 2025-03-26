package com.collateraltracker.backend.service;

import com.collateraltracker.backend.model.CollateralHistory;
import com.collateraltracker.backend.model.CollateralItem;
import com.collateraltracker.backend.repository.CollateralHistoryRepository;
import com.collateraltracker.backend.repository.CollateralItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CollateralService {

    @Autowired
    private CollateralItemRepository collateralItemRepository;

    @Autowired
    private CollateralHistoryRepository collateralHistoryRepository;

    public List<CollateralItem> getAllCollateralItems() {
        return collateralItemRepository.findAll();
    }

    public Optional<CollateralItem> getCollateralItemById(String id) {
        return collateralItemRepository.findById(id);
    }

    public Optional<CollateralItem> getCollateralItemByName(String name) {
        return collateralItemRepository.findByName(name);
    }

    public CollateralItem createCollateralItem(CollateralItem collateralItem) {
        collateralItem.setCreatedAt(LocalDateTime.now());
        collateralItem.setUpdatedAt(LocalDateTime.now());
        
        if (collateralItem.getAppraisalDate() == null) {
            collateralItem.setAppraisalDate(LocalDate.now());
        }
        
        return collateralItemRepository.save(collateralItem);
    }

    public Optional<CollateralItem> updateCollateralItem(String id, CollateralItem updatedItem) {
        return collateralItemRepository.findById(id)
                .map(existingItem -> {
                    if (updatedItem.getName() != null && !updatedItem.getName().equals(existingItem.getName())) {
                        saveHistory(existingItem.getId(), "name", existingItem.getName(), updatedItem.getName());
                        existingItem.setName(updatedItem.getName());
                    }
                    
                    if (updatedItem.getValue() != null && !updatedItem.getValue().equals(existingItem.getValue())) {
                        saveHistory(existingItem.getId(), "value", existingItem.getValue(), updatedItem.getValue());
                        existingItem.setValue(updatedItem.getValue());
                    }
                    
                    if (updatedItem.getAppraisalDate() != null && !updatedItem.getAppraisalDate().equals(existingItem.getAppraisalDate())) {
                        saveHistory(existingItem.getId(), "appraisalDate", existingItem.getAppraisalDate(), updatedItem.getAppraisalDate());
                        existingItem.setAppraisalDate(updatedItem.getAppraisalDate());
                    }
                    
                    existingItem.setUpdatedAt(LocalDateTime.now());
                    return collateralItemRepository.save(existingItem);
                });
    }

    private void saveHistory(String collateralItemId, String fieldName, Object oldValue, Object newValue) {
        CollateralHistory history = new CollateralHistory();
        history.setCollateralItemId(collateralItemId);
        history.setFieldName(fieldName);
        history.setOldValue(oldValue);
        history.setNewValue(newValue);
        history.setChangedAt(LocalDateTime.now());
        collateralHistoryRepository.save(history);
    }

    public List<CollateralHistory> getCollateralHistory(String collateralItemId) {
        return collateralHistoryRepository.findByCollateralItemIdOrderByChangedAtDesc(collateralItemId);
    }
}
