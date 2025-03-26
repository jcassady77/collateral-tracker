package com.collateraltracker.backend.service;

import com.collateraltracker.backend.model.CREGlossaryTerm;
import com.collateraltracker.backend.repository.CREGlossaryTermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class CREGlossaryService {
    
    @Autowired
    private CREGlossaryTermRepository glossaryTermRepository;
    
    public List<CREGlossaryTerm> getAllTerms() {
        return glossaryTermRepository.findAll();
    }
    
    public CREGlossaryTerm getTermByName(String term) {
        return glossaryTermRepository.findByTerm(term);
    }
    
    public CREGlossaryTerm saveTerm(CREGlossaryTerm term) {
        return glossaryTermRepository.save(term);
    }
    
    @PostConstruct
    public void initializeGlossaryTerms() {
        if (glossaryTermRepository.count() > 0) {
            return;
        }
        
        saveGlossaryTerm("10 Year Treasury", "The US 10-year Treasury Yield at the end of the reflected time period.");
        saveGlossaryTerm("1031 Exchange", "A property that is eligible for a 1031 exchange.");
        saveGlossaryTerm("1031 Replacement Property", "A property purchased with the proceeds from the sale of another property recently sold by the buyer, so as to qualify the sale and subsequent purchase as a 1031 exchange.");
        saveGlossaryTerm("12-Month Rolling Metro Cap Rate", "12-Month Rolling Cap Rates are calculated from the average of the metro's mean cap rate from the previous four quarters.");
        saveGlossaryTerm("Appraised Date Underwritten", "The date the Valuation Amount at Contribution was determined.");
        saveGlossaryTerm("Appraised Value Current", "Code used to identify the source of the most recent property valuation. See CMBS Data Dictionary.");
        saveGlossaryTerm("Appraised Value Underwritten", "The valuation amount of the property as of the Valuation Date at Contribution.");
        saveGlossaryTerm("Arm's Length Transaction", "A transaction between unrelated parties under no duress.");
        saveGlossaryTerm("Asking Rent", "The rental rate at which a space is being marketed for lease.");
        saveGlossaryTerm("Building Class", "Classification of a building's quality, typically A, B, or C grade.");
        saveGlossaryTerm("Additional Financing Original Balance", "The original balance of any additional financing on the property.");
        saveGlossaryTerm("Additional Income", "Income generated from sources other than rent.");
        saveGlossaryTerm("Affordable Housing Sector", "Properties designated for low-income residents with rent restrictions.");
        saveGlossaryTerm("Amortization Type", "The method by which the loan principal is reduced over time.");
        saveGlossaryTerm("Anchor Tenant", "A major tenant that serves as a primary draw for a commercial property.");
        saveGlossaryTerm("Annualized", "A figure that has been mathematically converted to represent an annual rate.");
        saveGlossaryTerm("Apartment Sector", "The segment of real estate focused on residential rental properties.");
        saveGlossaryTerm("APN", "Assessor's Parcel Number - unique identifier assigned by the tax assessor.");
        saveGlossaryTerm("Appraisal Date Current", "The date of the most recent property appraisal.");
    }
    
    private void saveGlossaryTerm(String term, String definition) {
        CREGlossaryTerm glossaryTerm = new CREGlossaryTerm(term, definition);
        glossaryTermRepository.save(glossaryTerm);
    }
}
