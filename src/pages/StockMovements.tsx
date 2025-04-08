
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, ArrowDownUp, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { format } from 'date-fns';

const StockMovements = () => {
  const { stockMovements, products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter movements based on search term
  const filteredMovements = stockMovements
    .filter(movement => 
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout requiredPermission="manage_inventory">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Stock Movements</h1>
          <div className="flex gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Movement
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Stock Movement</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {/* Add stock movement form would go here */}
                  <p className="text-gray-500">Stock movement form would be implemented here</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movements..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMovements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No stock movements found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMovements.map(movement => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">
                        {format(new Date(movement.date), 'MMM d, yyyy h:mm a')}
                      </TableCell>
                      <TableCell>{movement.productName}</TableCell>
                      <TableCell>
                        <Badge variant={movement.type === 'in' ? 'success' : 'destructive'} className="flex items-center w-20 justify-center">
                          <ArrowDownUp className={`h-3 w-3 mr-1 ${movement.type === 'in' ? 'rotate-180' : ''}`} />
                          {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{movement.quantity}</TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>{movement.performedBy}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StockMovements;
