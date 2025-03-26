import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import CollateralList from '../components/collateral/CollateralList';
import { getCollateralItemByName } from '../api/collateralApi';

const HomePage: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [refreshList, setRefreshList] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      setError('Please enter a name to search');
      setShowResults(false);
      return;
    }

    try {
      const result = await getCollateralItemByName(searchName);
      setSearchResult(result);
      setShowResults(true);
      setError('');
    } catch (err) {
      setError('Collateral item not found');
      setShowResults(false);
    }
  };

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
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        </div>

        {showResults && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <CollateralList 
              key={refreshList ? 'refresh' : 'initial'} 
              searchResult={searchResult} 
              onUpdate={handleRefresh} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
