
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  // Ensure products is always an array and filter out malformed entries
  const safeProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => p && typeof p === 'object' && typeof p.sku === 'string' && typeof p.name === 'string');
  }, [products]);

  const selected = React.useMemo(() => {
    if (!value || !safeProducts.length) return null;
    return safeProducts.find(p => p.sku === value) || null;
  }, [value, safeProducts]);

  const handleSelect = (sku: string) => {
    onChange(sku);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs">{selected.sku}</span>
              <span className="text-muted-foreground">-</span>
              <span>{selected.name}</span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Search SKU products..." />
          <CommandEmpty>No products found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {safeProducts.length > 0 ? safeProducts.map((product) => (
              <CommandItem
                key={`${product.id}-${product.sku}`}
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
                <span className="font-mono text-xs">{product.sku}</span>
                <span className="text-muted-foreground">-</span>
                <span>{product.name}</span>
              </CommandItem>
            )) : (
              <CommandItem disabled>
                Loading products...
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SkuProductComboboxCell;
