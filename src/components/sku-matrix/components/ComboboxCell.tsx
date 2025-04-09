
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
  const [inputValue, setInputValue] = useState(value);
  const [isCreating, setIsCreating] = useState(false);
  const [allOptions, setAllOptions] = useState<string[]>(options || []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // Make sure we're working with a valid array
    setAllOptions(Array.isArray(options) ? [...options] : []);
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
    if (inputValue.trim() !== "") {
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
          <Command>
            <CommandInput 
              placeholder="Search..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandEmpty>
              No item found. 
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={handleCreateNew}
              >
                <Plus className="h-3 w-3 mr-1" /> Create
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {safeOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={(currentValue) => handleSelect(currentValue)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
              <CommandItem
                className="text-sm text-muted-foreground hover:text-primary"
                onSelect={handleCreateNew}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create new item
              </CommandItem>
            </CommandGroup>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxCell;
