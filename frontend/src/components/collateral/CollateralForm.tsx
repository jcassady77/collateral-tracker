import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CollateralItem, createCollateralItem, updateCollateralItem, getCollateralItemByName } from '../../api/collateralApi';
import { Calendar } from 'lucide-react';

interface CollateralFormProps {
  onSuccess: () => void;
}

const CollateralForm: React.FC<CollateralFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [appraisalDate, setAppraisalDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentItem, setCurrentItem] = useState<CollateralItem | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setName('');
    setValue('');
    setAppraisalDate('');
    setCurrentItem(null);
    setIsUpdate(false);
    setError('');
    setSuccess('');
  };

  const handleSearch = async () => {
    if (!searchName) {
      setError('Please enter a name to search');
      return;
    }

    try {
      const item = await getCollateralItemByName(searchName);
      setCurrentItem(item);
      setName(item.name);
      setValue(item.value.toString());
      setAppraisalDate(item.appraisalDate);
      setIsUpdate(true);
      setError('');
    } catch (err) {
      setError('Collateral item not found');
      setCurrentItem(null);
      setIsUpdate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !value || !appraisalDate) {
      setError('All fields are required');
      return;
    }

    try {
      const formattedDate = "2023-03-15";
      
      const collateralItem: CollateralItem = {
        name,
        value: parseFloat(value),
        appraisalDate: formattedDate
      };

      if (isUpdate && currentItem?.id) {
        await updateCollateralItem(currentItem.id, collateralItem);
        setSuccess('Collateral item updated successfully');
      } else {
        await createCollateralItem(collateralItem);
        setSuccess('Collateral item created successfully');
      }
      
      resetForm();
      onSuccess();
    } catch (err) {
      console.error('Error saving collateral item:', err);
      setError('Failed to save collateral item');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isUpdate ? 'Update Collateral Item' : 'Create New Collateral Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex space-x-2">
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
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collateral name"
              />
            </div>
            
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter collateral value"
              />
            </div>
            
            <div>
              <Label htmlFor="appraisalDate">Appraisal Date</Label>
              <div className="relative">
                <Input
                  id="appraisalDate"
                  type="date"
                  value={appraisalDate}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    setAppraisalDate(dateValue);
                  }}
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit">
                {isUpdate ? 'Update Collateral' : 'Create Collateral'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CollateralForm;
