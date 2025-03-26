import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import CollateralForm from '../components/collateral/CollateralForm';

const CreatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Collateral Item</h1>
          <p className="text-gray-600">Add a new collateral item to track</p>
        </header>

        <div className="flex justify-start mb-6">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <CollateralForm showNameWarning={true} />
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
