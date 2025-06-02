
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StockMovement } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Search, Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/context/ProductContext';
import { apiInstance } from '@/api/services/api';

const StockMovements = () => {
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { products, fetchProducts } = useProducts();
  
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    type: 'in' as 'in' | 'out',
    reason: '',
    date: new Date(),
  });

  useEffect(() => {
    fetchProducts();
    fetchStockMovements();
  }, []);

  const fetchStockMovements = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get('/stock-movements');
      
      // Transform backend data to frontend format
      const transformedMovements = response.data.map((movement: any) => ({
        id: movement.id.toString(),
        productId: movement.product_id.toString(),
        productName: movement.product?.name || 'Unknown Product',
        quantity: movement.quantity,
        type: movement.type,
        reason: movement.reason,
        performedBy: movement.performer?.name || 'Unknown User',
        date: movement.created_at,
        createdAt: movement.created_at,
        userId: movement.performed_by?.toString() || '1'
      }));
      
      setStockMovements(transformedMovements);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock movements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      setFormData(prev => ({
        ...prev,
        productId: value,
        productName: product?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };
  
  const handleAddMovement = async () => {
    // Validation
    if (!formData.productId || formData.quantity <= 0 || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const stockMovementData = {
        product_id: parseInt(formData.productId),
        quantity: formData.quantity,
        type: formData.type,
        reason: formData.reason,
        notes: '',
      };

      await apiInstance.post('/stock-movements', stockMovementData);
      
      // Refresh stock movements list
      await fetchStockMovements();
      
      // Clear form and close dialog
      setFormData({
        productId: '',
        productName: '',
        quantity: 1,
        type: 'in',
        reason: '',
        date: new Date(),
      });
      
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Stock ${formData.type === 'in' ? 'added to' : 'removed from'} inventory.`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error creating stock movement:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record stock movement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter stock movements based on search term and type filter
  const filteredMovements = stockMovements.filter(movement => {
    const matchesSearch = 
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Stock Movements</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Movement
          </Button>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search product or reason..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all" onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Movement History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Performed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No stock movements found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMovements.map(movement => (
                      <TableRow key={movement.id}>
                        <TableCell>{format(new Date(movement.date), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="font-medium">{movement.productName}</TableCell>
                        <TableCell>
                          {movement.type === 'in' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              <ArrowDownCircle className="mr-1 h-3 w-3 inline" /> Stock In
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                              <ArrowUpCircle className="mr-1 h-3 w-3 inline" /> Stock Out
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.performedBy}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Stock Movement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
            <DialogDescription>
              Add stock in or out for a product in your inventory.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <Select value={formData.productId} onValueChange={(value) => handleSelectChange('productId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} (SKU: {product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Movement Type</Label>
              <Select value={formData.type} onValueChange={(value: 'in' | 'out') => handleSelectChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                min="1" 
                value={formData.quantity.toString()}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea 
                id="reason" 
                name="reason" 
                value={formData.reason}
                onChange={handleInputChange}
                placeholder={formData.type === 'in' ? 'e.g., New delivery, Returned items' : 'e.g., Customer order, Internal use'}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker date={formData.date} setDate={handleDateChange} />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMovement} disabled={loading}>
              {loading ? 'Saving...' : 'Save Movement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StockMovements;
