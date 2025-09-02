import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SkuProduct = { id: string; name: string; sku: string };

interface SkuProductComboboxCellProps {
  value: string;
  onChange: (sku: string) => void;
  products?: SkuProduct[];
  placeholder?: string;
  disabled?: boolean;
}

const SkuProductComboboxCell = ({
  value,
  onChange,
  products = [],
  placeholder = "Select SKU product...",
  disabled = false
}: SkuProductComboboxCellProps) => {
  // Ensure products is always an array and filter out malformed entries
  const safeProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => p && typeof p === 'object' && typeof p.sku === 'string' && typeof p.name === 'string');
  }, [products]);

  const selected = React.useMemo(() => {
    if (!value || !safeProducts.length) return null;
    return safeProducts.find(p => p.sku === value) || null;
  }, [value, safeProducts]);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selected ? (
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs">{selected.sku}</span>
              <span className="text-muted-foreground">-</span>
              <span>{selected.name}</span>
            </span>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {safeProducts.length > 0 ? (
          safeProducts.map((product) => (
            <SelectItem key={`${product.id}-${product.sku}`} value={product.sku}>
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs">{product.sku}</span>
                <span className="text-muted-foreground">-</span>
                <span>{product.name}</span>
              </span>
            </SelectItem>
          ))
        ) : (
          <SelectItem value="" disabled>
            Loading products...
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SkuProductComboboxCell;