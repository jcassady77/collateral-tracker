import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CollateralItem, CREGlossaryTerm, getAllCollateralItems, getCollateralHistory, getAllGlossaryTerms } from '../../api/collateralApi';
import { format } from 'date-fns';
import { Eye, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { InfoIcon } from '../../components/ui/info-icon';

interface CollateralListProps {
  searchResult?: CollateralItem | null;
  searchResults?: CollateralItem[];
  onUpdate?: () => void;
}

const CollateralList: React.FC<CollateralListProps> = ({ searchResult, searchResults = [], onUpdate }) => {
  const [collateralItems, setCollateralItems] = useState<CollateralItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [glossaryTerms, setGlossaryTerms] = useState<CREGlossaryTerm[]>([]);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const fetchCollateralItems = async () => {
    setLoading(true);
    try {
      if (searchResult) {
        setCollateralItems([searchResult]);
      } else if (searchResults && searchResults.length > 0) {
        setCollateralItems(searchResults);
      } else {
        const data = await getAllCollateralItems();
        setCollateralItems(data);
      }
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
    const fetchGlossaryTerms = async () => {
      try {
        const terms = await getAllGlossaryTerms();
        setGlossaryTerms(terms);
      } catch (err) {
        console.error('Failed to fetch glossary terms', err);
      }
    };
    
    fetchGlossaryTerms();
  }, []);

  useEffect(() => {
    fetchCollateralItems();
  }, [searchResult, searchResults]);
  
  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleViewHistory = (id: string) => {
    fetchHistory(id);
    if (onUpdate) {
      onUpdate();
    }
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
                <TableHead>CRE Datapoints</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collateralItems.map((item) => {
                const isExpanded = item.id && expandedItems[item.id];
                const hasDatapoints = item.creDatapoints && Object.keys(item.creDatapoints || {}).length > 0;
                
                return (
                  <React.Fragment key={item.id}>
                    <TableRow>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.value.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(item.appraisalDate)}</TableCell>
                      <TableCell>{item.updatedAt ? formatDate(item.updatedAt) : 'N/A'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => item.id && toggleExpandItem(item.id)}
                          className="flex items-center"
                        >
                          {hasDatapoints ? 
                            `${Object.keys(item.creDatapoints || {}).length} datapoints` : 
                            'No datapoints'}
                          {isExpanded ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                              >
                                <Eye className="h-4 w-4 mr-1" /> History
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl" onOpenAutoFocus={(e) => {
                              e.preventDefault();
                              if (item.id) {
                                handleViewHistory(item.id);
                              }
                            }}>
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
                          <Link to={`/update/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" /> Update
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && hasDatapoints && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50">
                          <div className="p-4">
                            <h4 className="text-sm font-medium mb-2">CRE Datapoints</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(item.creDatapoints || {}).map(([key, value]) => {
                                const term = glossaryTerms.find(t => t.term === key);
                                return (
                                  <div key={key} className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-sm font-medium">{key}</span>
                                      {term && <InfoIcon content={term.definition} />}
                                    </div>
                                    <span className="text-sm">{value?.toString() || 'N/A'}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
        <Button onClick={fetchCollateralItems} className="mt-4">Refresh</Button>
      </CardContent>
    </Card>
  );
};

export default CollateralList;
