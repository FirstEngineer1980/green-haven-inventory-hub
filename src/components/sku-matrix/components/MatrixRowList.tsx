
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MatrixRowListProps {
  rows: { label: string; color: string }[];
  onRemoveRow: (index: number) => void;
}

const MatrixRowList = ({ rows, onRemoveRow }: MatrixRowListProps) => {
  if (rows.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-2">
        No rows added
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4">
      {rows.map((row, index) => (
        <div key={index} className="flex items-center space-x-2 p-2 border rounded-md">
          <div
            className="w-6 h-6 rounded-md flex-shrink-0"
            style={{ backgroundColor: row.color }}
          ></div>
          <span className="flex-grow">{row.label}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveRow(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MatrixRowList;
