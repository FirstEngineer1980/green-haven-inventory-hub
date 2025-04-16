
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Plus, Edit, Trash, Tag, Percent, Calendar, Eye } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useProducts } from '@/context/ProductContext';
import { format } from "date-fns";

// Mock promotion type
interface Promotion {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discount: number;
  categories: string[];
  active: boolean;
  image: string;
}

const defaultPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Summer Sale',
    description: 'Save up to 40% on selected products',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    discount: 0.4,
    categories: ['Electronics', 'Office Supplies'],
    active: true,
    image: 'https://picsum.photos/seed/promo1/800/300'
  },
  {
    id: '2',
    title: 'Back to Office',
    description: '25% off on furniture and office supplies',
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    discount: 0.25,
    categories: ['Furniture', 'Office Supplies'],
    active: true,
    image: 'https://picsum.photos/seed/promo2/800/300'
  },
  {
    id: '3',
    title: 'Flash Sale',
    description: 'Limited time offer - 30% off select electronics',
    startDate: '2024-06-10',
    endDate: '2024-07-20',
    discount: 0.3,
    categories: ['Electronics'],
    active: true,
    image: 'https://picsum.photos/seed/promo3/800/300'
  }
];

const ManagePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(defaultPromotions);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { categories } = useProducts();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Omit<Promotion, 'id'>>({
    title: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    discount: 0.1,
    categories: [],
    active: true,
    image: 'https://picsum.photos/seed/new/800/300'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'discount' ? Math.min(1, Math.max(0, numValue)) : numValue
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      active: checked
    }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") return;
    
    setFormData(prev => {
      if (prev.categories.includes(value)) {
        return {
          ...prev,
          categories: prev.categories.filter(cat => cat !== value)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, value]
        };
      }
    });
  };

  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      discount: 0.1,
      categories: [],
      active: true,
      image: 'https://picsum.photos/seed/new/800/300'
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      discount: promotion.discount,
      categories: [...promotion.categories],
      active: promotion.active,
      image: promotion.image
    });
    setIsEditDialogOpen(true);
  };

  const handleAddPromotion = () => {
    const newPromotion: Promotion = {
      ...formData,
      id: Date.now().toString()
    };
    
    setPromotions(prev => [...prev, newPromotion]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Promotion created",
      description: `${newPromotion.title} has been created successfully`,
    });
  };

  const handleUpdatePromotion = () => {
    if (!currentPromotion) return;
    
    setPromotions(prev => 
      prev.map(promo => 
        promo.id === currentPromotion.id 
          ? { ...promo, ...formData }
          : promo
      )
    );
    setIsEditDialogOpen(false);
    
    toast({
      title: "Promotion updated",
      description: `${formData.title} has been updated successfully`,
    });
  };

  const handleDeletePromotion = (id: string) => {
    const promotionToDelete = promotions.find(p => p.id === id);
    
    setPromotions(prev => prev.filter(promo => promo.id !== id));
    
    toast({
      title: "Promotion deleted",
      description: `${promotionToDelete?.title} has been deleted`,
      variant: "destructive"
    });
  };

  const handleToggleActive = (id: string) => {
    setPromotions(prev => 
      prev.map(promo => 
        promo.id === id 
          ? { ...promo, active: !promo.active }
          : promo
      )
    );
    
    const promotion = promotions.find(p => p.id === id);
    const newStatus = !promotion?.active;
    
    toast({
      title: newStatus ? "Promotion activated" : "Promotion deactivated",
      description: `${promotion?.title} is now ${newStatus ? 'active' : 'inactive'}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Promotions</h1>
            <p className="text-muted-foreground mt-1">Create and manage promotional campaigns for your products</p>
          </div>
          <Button onClick={openAddDialog} size="sm" className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" /> Add Promotion
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Promotions</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <PromotionsTable 
              promotions={promotions} 
              onEdit={openEditDialog} 
              onDelete={handleDeletePromotion}
              onToggleActive={handleToggleActive}
            />
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <PromotionsTable 
              promotions={promotions.filter(p => {
                const now = new Date().toISOString().split('T')[0];
                return p.active && p.startDate <= now && p.endDate >= now;
              })}
              onEdit={openEditDialog} 
              onDelete={handleDeletePromotion}
              onToggleActive={handleToggleActive}
            />
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <PromotionsTable 
              promotions={promotions.filter(p => {
                const now = new Date().toISOString().split('T')[0];
                return p.startDate > now;
              })}
              onEdit={openEditDialog} 
              onDelete={handleDeletePromotion}
              onToggleActive={handleToggleActive}
            />
          </TabsContent>
          
          <TabsContent value="expired" className="space-y-4">
            <PromotionsTable 
              promotions={promotions.filter(p => {
                const now = new Date().toISOString().split('T')[0];
                return p.endDate < now;
              })}
              onEdit={openEditDialog} 
              onDelete={handleDeletePromotion}
              onToggleActive={handleToggleActive}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Promotion Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
            <DialogDescription>
              Add a new promotional campaign for your products
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Promotion Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Summer Sale"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <div className="flex items-center">
                  <Input 
                    id="discount" 
                    name="discount" 
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.discount} 
                    onChange={handleNumberChange}
                  />
                  <span className="ml-2 text-muted-foreground">({(formData.discount * 100).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Describe what this promotion offers..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => handleDateChange(date, 'startDate')}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  date={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) => handleDateChange(date, 'endDate')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={formData.categories.includes(category.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category.name)}
                    className="mr-2 mb-2"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image URL</Label>
              <Input 
                id="image" 
                name="image" 
                value={formData.image} 
                onChange={handleInputChange} 
                placeholder="https://example.com/image.jpg"
              />
              
              {formData.image && (
                <div className="mt-2 rounded-md overflow-hidden border">
                  <img 
                    src={formData.image} 
                    alt="Promotion banner preview" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={formData.active} 
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPromotion}>Create Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
            <DialogDescription>
              Update the details of this promotional campaign
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Promotion Title</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Discount Percentage</Label>
                <div className="flex items-center">
                  <Input 
                    id="edit-discount" 
                    name="discount" 
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={formData.discount} 
                    onChange={handleNumberChange}
                  />
                  <span className="ml-2 text-muted-foreground">({(formData.discount * 100).toFixed(0)}%)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => handleDateChange(date, 'startDate')}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  date={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) => handleDateChange(date, 'endDate')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable Categories</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={formData.categories.includes(category.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category.name)}
                    className="mr-2 mb-2"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image">Banner Image URL</Label>
              <Input 
                id="edit-image" 
                name="image" 
                value={formData.image} 
                onChange={handleInputChange} 
              />
              
              {formData.image && (
                <div className="mt-2 rounded-md overflow-hidden border">
                  <img 
                    src={formData.image} 
                    alt="Promotion banner preview" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-active" 
                checked={formData.active} 
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePromotion}>Update Promotion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

interface PromotionsTableProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const PromotionsTable: React.FC<PromotionsTableProps> = ({ 
  promotions, 
  onEdit, 
  onDelete,
  onToggleActive
}) => {
  if (promotions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40">
          <p className="text-muted-foreground text-center">No promotions found</p>
          <Button variant="outline" size="sm" className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create your first promotion
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map(promotion => {
            const now = new Date().toISOString().split('T')[0];
            let status: 'active' | 'upcoming' | 'expired' | 'inactive' = 'inactive';
            
            if (!promotion.active) {
              status = 'inactive';
            } else if (promotion.startDate > now) {
              status = 'upcoming';
            } else if (promotion.endDate < now) {
              status = 'expired';
            } else {
              status = 'active';
            }
            
            return (
              <TableRow key={promotion.id}>
                <TableCell>
                  <div className="font-medium">{promotion.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                    {promotion.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{(promotion.discount * 100).toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <div>
                      <div className="text-xs">{new Date(promotion.startDate).toLocaleDateString()}</div>
                      <div className="text-xs">to</div>
                      <div className="text-xs">{new Date(promotion.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {promotion.categories.map(category => (
                      <span 
                        key={category} 
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status === 'active' ? 'bg-green-100 text-green-800' :
                      status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      status === 'expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(promotion)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActive(promotion.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {promotion.active ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(promotion.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManagePromotions;
