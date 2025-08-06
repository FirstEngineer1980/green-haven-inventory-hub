import React, { useState } from 'react';
import { useProductSelection } from '@/context/ProductSelectionContext';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { ChevronsUpDown } from 'lucide-react';

interface SkuSelectorProps {
    value?: string;
    onValueChange: (sku: string) => void;
    onProductSelect?: (product: any) => void;
    placeholder?: string;
}

const SkuSelector: React.FC<SkuSelectorProps> = ({
                                                     value = '',
                                                     onValueChange,
                                                     onProductSelect,
                                                     placeholder = 'Select SKU...',
                                                 }) => {
    const { products, loading } = useProductSelection();
    const [isOpen, setIsOpen] = useState(false);

    // تصفية البيانات
    const safeProducts = Array.isArray(products)
        ? products.filter(
            (p) =>
                p &&
                p.id &&
                typeof p.sku === 'string' &&
                p.sku.trim() !== '' &&
                typeof p.name === 'string' &&
                p.name.trim() !== ''
        )
        : [];

    const options = safeProducts.map((product) => ({
        value: product.sku,
        label: `${product.sku} - ${product.name}`,
        product,
    }));

    const selectedOption = options.find((option) => option.value === value);

    const handleChange = (option: any) => {
        if (option) {
            onValueChange(option.value);
            if (onProductSelect) {
                onProductSelect(option.product);
            }
        } else {
            onValueChange('');
            if (onProductSelect) {
                onProductSelect(null);
            }
        }
        setIsOpen(false);
    };

    if (loading && safeProducts.length === 0) {
        return (
            <Button variant="outline" disabled className="w-full justify-between">
                Loading products...
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        );
    }

    return (
        <FormControl>
            <Select
                options={options}
                value={selectedOption}
                onChange={handleChange}
                placeholder={placeholder}
                isSearchable
                isClearable
                className="w-full"
                classNamePrefix="select"
                onMenuOpen={() => setIsOpen(true)}
                onMenuClose={() => setIsOpen(false)}
                formatOptionLabel={(option) => (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{option.value}</span>
                            <span className="text-muted-foreground">-</span>
                            <span>{option.product.name}</span>
                        </div>
                        {option.product.description && (
                            <span className="text-xs text-muted-foreground truncate">
                {option.product.description}
              </span>
                        )}
                    </div>
                )}
            />
        </FormControl>
    );
};

export default SkuSelector;