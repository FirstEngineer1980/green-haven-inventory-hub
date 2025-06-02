
import React, { useState, useEffect } from 'react';
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
import { FormControl } from '@/components/ui/form';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkuSelectorProps {
  value?: string;
  onValueChange: (sku: string) => void;
  onProductSelect?: (product: any) => void;
  placeholder?: string;
}

const SkuSelector: React.FC<SkuSelectorProps> = ({
  value,
  onValueChange,
  onProductSelect,
  placeholder = "Select SKU..."
}) => {
  const { products, loading } = useProductSelection();
  const [open, setOpen] = useState(false);

  const selectedProduct = products.find(product => product.sku === value);

  const handleSelect = (sku: string) => {
    const product = products.find(p => p.sku === sku);
    onValueChange(sku);
    if (product && onProductSelect) {
      onProductSelect(product);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
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
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandEmpty>
            {loading ? "Loading products..." : "No products found."}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={product.sku}
                onSelect={() => handleSelect(product.sku)}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === product.sku ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{product.sku}</span>
                    <span className="text-muted-foreground">-</span>
                    <span>{product.name}</span>
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

export default SkuSelector;
