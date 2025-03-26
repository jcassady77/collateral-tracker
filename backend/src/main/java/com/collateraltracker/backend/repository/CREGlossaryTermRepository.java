package com.collateraltracker.backend.repository;

import com.collateraltracker.backend.model.CREGlossaryTerm;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CREGlossaryTermRepository extends MongoRepository<CREGlossaryTerm, String> {
    CREGlossaryTerm findByTerm(String term);
}
