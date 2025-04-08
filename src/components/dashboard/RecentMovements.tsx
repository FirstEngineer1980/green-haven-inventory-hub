
import React from 'react';
import { StockMovement } from '@/types';
import { format, parseISO } from 'date-fns';

interface RecentMovementsProps {
  movements: StockMovement[];
}

const RecentMovements: React.FC<RecentMovementsProps> = ({ movements }) => {
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
            {movements.map((movement) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentMovements;
