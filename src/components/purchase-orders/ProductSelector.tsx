
import React, { useState } from 'react';
import { useProductSelection } from '@/context/ProductSelectionContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductSelectorProps {
  value?: string;
  onValueChange: (productId: string) => void;
  onProductSelect?: (product: any) => void;
  placeholder?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  value,
  onValueChange,
  onProductSelect,
  placeholder = "Select Product..."
}) => {
  const { products, loading } = useProductSelection();
  const [open, setOpen] = useState(false);

  // Ensure products is always a valid array to prevent cmdk errors
  const safeProducts = Array.isArray(products) ? products.filter(p => p && p.id && typeof p.id === 'string') : [];

  const selectedProduct = safeProducts.find(product => product.id === value);

  const handleSelect = (productId: string) => {
    const product = safeProducts.find(p => p.id === productId);
    onValueChange(productId);
    if (product && onProductSelect) {
      onProductSelect(product);
    }
    setOpen(false);
  };

  // Don't render the command component until we have safe data
  if (loading && safeProducts.length === 0) {
    return (
      <Button
        variant="outline"
        disabled
        className="w-full justify-between"
      >
        Loading products...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProduct ? (
            <span className="flex items-center gap-2">
              <span className="font-mono text-sm">{selectedProduct.sku}</span>
              <span className="text-muted-foreground">-</span>
              <span>{selectedProduct.name}</span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandEmpty>
            {loading ? "Loading products..." : "No products found."}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {safeProducts.map((product) => (
              <CommandItem
                key={product.id}
                value={product.id}
                onSelect={() => handleSelect(product.id)}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === product.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{product.sku}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{product.name}</span>
                    {product.price && <span className="text-sm text-muted-foreground">${product.price}</span>}
                  </div>
                  {product.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {product.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSelector;
