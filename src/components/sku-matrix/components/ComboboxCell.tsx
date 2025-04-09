
import React, { useState, useRef, useEffect } from 'react';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface ComboboxCellProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

const ComboboxCell = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select item...", 
  disabled = false 
}: ComboboxCellProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isCreating, setIsCreating] = useState(false);
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    // Make sure we're working with a valid array
    const safeOptions = Array.isArray(options) ? options : [];
    setAllOptions(safeOptions);
  }, [options]);

  const handleSelect = (currentValue: string) => {
    onChange(currentValue);
    setInputValue(currentValue);
    setOpen(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCreateSubmit = () => {
    if (inputValue && inputValue.trim() !== "") {
      // Only add to options if it doesn't already exist
      if (!allOptions.includes(inputValue)) {
        setAllOptions(prev => [...prev, inputValue]);
      }
      onChange(inputValue);
      setIsCreating(false);
      setOpen(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateSubmit();
    } else if (e.key === "Escape") {
      setIsCreating(false);
    }
  };

  // Safely create a valid array for Command items
  const safeOptions = Array.isArray(allOptions) ? allOptions : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 px-2 py-1 text-sm"
          onClick={() => !disabled && setOpen(true)}
          disabled={disabled}
        >
          {value ? value.length > 15 ? `${value.substring(0, 15)}...` : value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {isCreating ? (
          <div className="flex items-center p-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="h-8 flex-1"
              placeholder="Type new value..."
              autoFocus
            />
            <Button 
              size="sm" 
              className="ml-1 h-8" 
              onClick={handleCreateSubmit}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            {/* Simplified Command component usage */}
            <div className="flex items-center border-b px-3">
              <Input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search..."
                value={inputValue || ''}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            
            <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
              {safeOptions.length === 0 ? (
                <div className="py-6 text-center text-sm">
                  No item found.
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2" 
                    onClick={handleCreateNew}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Create
                  </Button>
                </div>
              ) : (
                <div>
                  {safeOptions.map((option) => (
                    <div
                      key={option}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => handleSelect(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option}
                    </div>
                  ))}
                  <div
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create new item
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxCell;
