package com.collateraltracker.backend.controller;

import com.collateraltracker.backend.model.CREGlossaryTerm;
import com.collateraltracker.backend.service.CREGlossaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/glossary")
public class CREGlossaryController {
    
    @Autowired
    private CREGlossaryService glossaryService;
    
    @GetMapping
    public ResponseEntity<List<CREGlossaryTerm>> getAllTerms() {
        return ResponseEntity.ok(glossaryService.getAllTerms());
    }
    
    @GetMapping("/{term}")
    public ResponseEntity<CREGlossaryTerm> getTermByName(@PathVariable String term) {
        CREGlossaryTerm glossaryTerm = glossaryService.getTermByName(term);
        if (glossaryTerm == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(glossaryTerm);
    }
}
