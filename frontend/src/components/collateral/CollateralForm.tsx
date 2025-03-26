import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../components/ui/dialog";
import { 
  CollateralItem, 
  createCollateralItem, 
  updateCollateralItem, 
  getCollateralItemByName 
} from '../../api/collateralApi';
import { Calendar } from 'lucide-react';

interface CollateralFormProps {
  onSuccess?: () => void;
  showNameWarning?: boolean;
  initialData?: any;
  isUpdate?: boolean;
  hideSearch?: boolean;
}

const CollateralForm: React.FC<CollateralFormProps> = ({ 
  onSuccess = () => {}, 
  showNameWarning = false,
  initialData = null,
  isUpdate = false,
  hideSearch = false
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState(initialData?.name || '');
  const [value, setValue] = useState(initialData?.value ? initialData.value.toString() : '');
  const [appraisalDate, setAppraisalDate] = useState(initialData?.appraisalDate || '');
  const [searchName, setSearchName] = useState('');
  const [localIsUpdate, setLocalIsUpdate] = useState(isUpdate);
  const [currentItem, setCurrentItem] = useState<CollateralItem | null>(initialData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setName('');
    setValue('');
    setAppraisalDate('');
    setCurrentItem(null);
    setLocalIsUpdate(false);
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
      setLocalIsUpdate(true);
      setError('');
    } catch (err) {
      setError('Collateral item not found');
      setCurrentItem(null);
      setLocalIsUpdate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !value || !appraisalDate) {
      setError('All fields are required');
      return;
    }

    try {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(appraisalDate)) {
        setError('Please enter a valid date in YYYY-MM-DD format');
        return;
      }
      
      const selectedDate = new Date(appraisalDate);
      
      if (isNaN(selectedDate.getTime())) {
        setError('Please enter a valid date');
        return;
      }
      
      const maxAllowedYear = new Date().getFullYear() + 100; // Allow dates up to 100 years in the future
      
      if (selectedDate.getFullYear() > maxAllowedYear) {
        setError(`Appraisal date cannot be more than 100 years in the future (${maxAllowedYear})`);
        return;
      }
      
      if (showNameWarning && !isUpdate) {
        try {
          await getCollateralItemByName(name);
          setError(`A collateral item with the name "${name}" already exists. Please choose a different name.`);
          return;
        } catch (err) {
          console.log('Name is unique, proceeding with creation');
        }
      }
      
      const collateralItem: CollateralItem = {
        name,
        value: parseFloat(value),
        appraisalDate: appraisalDate
      };

      if (localIsUpdate && currentItem?.id) {
        await updateCollateralItem(currentItem.id, collateralItem);
        setSuccessMessage('Collateral item updated successfully');
      } else {
        await createCollateralItem(collateralItem);
        setSuccessMessage('Collateral item created successfully');
      }
      
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error saving collateral item:', err);
      setError('Failed to save collateral item');
    }
  };

  const handleNavigateHome = () => {
    resetForm();
    navigate('/');
    onSuccess();
  };

  return (
    <>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{successMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={handleNavigateHome}>
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isUpdate ? 'Update Collateral Item' : 'Create New Collateral Item'}</CardTitle>
        </CardHeader>
        <CardContent>
          {!hideSearch && (
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
          )}

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
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={appraisalDate}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    setAppraisalDate(dateValue);
                    setError('');
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
    </>
  );
};

export default CollateralForm;
