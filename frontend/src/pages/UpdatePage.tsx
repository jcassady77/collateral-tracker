import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import CollateralForm from '../components/collateral/CollateralForm';
import { getCollateralItemById } from '../api/collateralApi';

const UpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collateralItem, setCollateralItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCollateralItem = async () => {
      if (!id) {
        setError('No collateral ID provided');
        setLoading(false);
        return;
      }

      try {
        const item = await getCollateralItemById(id);
        setCollateralItem(item);
        setError('');
      } catch (err) {
        setError('Failed to fetch collateral item');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollateralItem();
  }, [id]);

  const handleUpdateSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Update Collateral Item</h1>
          <p className="text-gray-600">Modify details of an existing collateral item</p>
        </header>

        <div className="flex justify-start mb-6">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {loading ? (
            <p>Loading collateral item...</p>
          ) : error ? (
            <div>
              <p className="text-red-500">{error}</p>
              <Button onClick={() => navigate('/')} className="mt-4">Return to Home</Button>
            </div>
          ) : (
            <CollateralForm 
              initialData={collateralItem} 
              isUpdate={true} 
              hideSearch={true}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
