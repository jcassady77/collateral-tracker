import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CollateralItem, getAllCollateralItems, getCollateralHistory } from '../../api/collateralApi';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

const CollateralList: React.FC = () => {
  const [collateralItems, setCollateralItems] = useState<CollateralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCollateralItems = async () => {
    setLoading(true);
    try {
      const data = await getAllCollateralItems();
      setCollateralItems(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch collateral items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id: string) => {
    setHistoryLoading(true);
    try {
      const history = await getCollateralHistory(id);
      setHistoryData(history);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCollateralItems();
  }, []);

  const handleViewHistory = (id: string) => {
    setSelectedItemId(id);
    fetchHistory(id);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Collateral Items</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading collateral items...</p>
        ) : error ? (
          <div>
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchCollateralItems} className="mt-2">Retry</Button>
          </div>
        ) : collateralItems.length === 0 ? (
          <p>No collateral items found. Create one to get started.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Appraisal Date</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collateralItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.value.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(item.appraisalDate)}</TableCell>
                  <TableCell>{item.updatedAt ? formatDate(item.updatedAt) : 'N/A'}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewHistory(item.id!)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> History
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>History for {item.name}</DialogTitle>
                        </DialogHeader>
                        {historyLoading ? (
                          <p>Loading history...</p>
                        ) : historyData.length === 0 ? (
                          <p>No history records found for this item.</p>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Old Value</TableHead>
                                <TableHead>New Value</TableHead>
                                <TableHead>Changed At</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {historyData.map((record) => (
                                <TableRow key={record.id}>
                                  <TableCell>{record.fieldName}</TableCell>
                                  <TableCell>{record.oldValue}</TableCell>
                                  <TableCell>{record.newValue}</TableCell>
                                  <TableCell>{formatDate(record.changedAt)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Button onClick={fetchCollateralItems} className="mt-4">Refresh</Button>
      </CardContent>
    </Card>
  );
};

export default CollateralList;
