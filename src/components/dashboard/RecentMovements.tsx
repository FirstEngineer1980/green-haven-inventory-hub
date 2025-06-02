
import React, { useState, useEffect } from 'react';
import { StockMovement } from '@/types';
import { format, parseISO } from 'date-fns';
import { apiInstance } from '@/api/services/api';

interface RecentMovementsProps {
  movements?: StockMovement[];
}

const RecentMovements: React.FC<RecentMovementsProps> = ({ movements: propMovements }) => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propMovements) {
      fetchRecentMovements();
    } else {
      setMovements(propMovements);
    }
  }, [propMovements]);

  const fetchRecentMovements = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get('/stock-movements');
      
      // Transform backend data to frontend format and get only recent ones
      const transformedMovements = response.data
        .slice(0, 5) // Get only the 5 most recent
        .map((movement: any) => ({
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
      
      setMovements(transformedMovements);
    } catch (error) {
      console.error('Error fetching recent movements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full">
        <h3 className="text-base font-medium mb-3">Recent Stock Movements</h3>
        <div className="text-center py-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-base font-medium mb-3">Recent Stock Movements</h3>
      <div className="overflow-y-auto max-h-[250px]">
        <table className="gh-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No recent movements
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id}>
                  <td className="font-medium">{movement.productName}</td>
                  <td>
                    <span className={`gh-badge ${movement.type === 'in' ? 'gh-badge-green' : 'gh-badge-blue'}`}>
                      {movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                    </span>
                  </td>
                  <td>{movement.quantity}</td>
                  <td className="text-gray-500">{format(parseISO(movement.date), 'MMM d, h:mm a')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentMovements;
