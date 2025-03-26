import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import CollateralList from '../components/collateral/CollateralList';
import { getCollateralItemByName, searchCollateralItems, CollateralItem } from '../api/collateralApi';

const HomePage: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<CollateralItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [refreshList, setRefreshList] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      setError('Please enter a name to search');
      setShowResults(false);
      return;
    }

    try {
      const result = await getCollateralItemByName(searchName);
      setSearchResult(result);
      setSearchResults([]);
      setShowResults(true);
      setError('');
    } catch (err) {
      setError('Collateral item not found');
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (searchName.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const debounceTimeout = setTimeout(async () => {
      try {
        const results = await searchCollateralItems(searchName);
        setSearchResults(results);
        setSearchResult(null);
        setShowResults(true);
        setError('');
      } catch (err) {
        console.error('Search error:', err);
        setError('Error searching collateral items');
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimeout);
  }, [searchName]);

  const handleRefresh = () => {
    setRefreshList(!refreshList);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collateral Tracker</h1>
          <p className="text-gray-600">Manage and track your collateral items</p>
        </header>

        <div className="flex justify-end mb-6">
          <Link to="/create">
            <Button>Create</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Collateral</h2>
          <div className="flex space-x-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="searchName">Search by Name</Label>
              <Input
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter collateral name to search"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch}>Search Exact</Button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {isSearching && <p className="text-blue-500 text-sm mb-4">Searching...</p>}
        </div>

        {showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            {searchResults && searchResults.length > 0 ? (
              <CollateralList 
                key={refreshList ? 'refresh' : 'initial'} 
                searchResults={searchResults}
                onUpdate={handleRefresh} 
              />
            ) : searchResult ? (
              <CollateralList 
                key={refreshList ? 'refresh' : 'initial'} 
                searchResult={searchResult} 
                onUpdate={handleRefresh} 
              />
            ) : (
              <p>No results found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
