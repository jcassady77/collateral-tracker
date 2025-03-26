package com.collateraltracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cre_glossary_terms")
public class CREGlossaryTerm {
    @Id
    private String id;
    private String term;
    private String definition;
    
    public CREGlossaryTerm() {}
    
    public CREGlossaryTerm(String term, String definition) {
        this.term = term;
        this.definition = definition;
    }
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTerm() {
        return term;
    }
    
    public void setTerm(String term) {
        this.term = term;
    }
    
    public String getDefinition() {
        return definition;
    }
    
    public void setDefinition(String definition) {
        this.definition = definition;
    }
}
