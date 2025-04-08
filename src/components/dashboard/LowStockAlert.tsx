
import React from 'react';
import { Product } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface LowStockAlertProps {
  products: Product[];
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ products }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <AlertTriangle className="text-yellow-500 mr-2 h-5 w-5" />
        <h3 className="font-medium text-yellow-700">Low Stock Alert</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded border border-yellow-100 p-3 flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-yellow-600 text-xs font-bold">{product.quantity}</span>
            </div>
            <div>
              <div className="font-medium text-sm">{product.name}</div>
              <div className="text-xs text-gray-500">
                Threshold: {product.threshold}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
