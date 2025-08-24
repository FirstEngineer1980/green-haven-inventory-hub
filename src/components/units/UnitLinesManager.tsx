import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { UnitLine } from '@/types';
import { useUnitLines } from '@/context/UnitLineContext';
import { useToast } from '@/hooks/use-toast';

interface UnitLinesManagerProps {
  unitId: string;
  unitName: string;
}

const UnitLinesManager = ({ unitId, unitName }: UnitLinesManagerProps) => {
  const { getUnitLinesByUnitId, addUnitLine, updateUnitLine, deleteUnitLine, fetchUnitLines } = useUnitLines();
  const { toast } = useToast();
  const [unitLines, setUnitLines] = useState<UnitLine[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 0,
    currentStock: 0,
    position: 0
  });

  useEffect(() => {
    fetchUnitLines(unitId);
  }, [unitId, fetchUnitLines]);

  useEffect(() => {
    setUnitLines(getUnitLinesByUnitId(unitId));
  }, [unitId, getUnitLinesByUnitId]);

  const handleAddLine = async () => {
    try {
      await addUnitLine({
        unitId,
        name: formData.name,
        description: formData.description,
        capacity: formData.capacity,
        currentStock: formData.currentStock,
        position: formData.position || unitLines.length
      });
      
      setFormData({ name: '', description: '', capacity: 0, currentStock: 0, position: 0 });
      setShowAddForm(false);
      
      toast({
        title: "Line Added",
        description: `Line "${formData.name}" has been added successfully`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add line",
        variant: "destructive",
      });
    }
  };

  const handleUpdateLine = async (id: string, updates: Partial<UnitLine>) => {
    try {
      await updateUnitLine(id, updates);
      setEditingId(null);
      
      toast({
        title: "Line Updated",
        description: "Line has been updated successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update line",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLine = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete line "${name}"?`)) {
      try {
        await deleteUnitLine(id);
        
        toast({
          title: "Line Deleted",
          description: `Line "${name}" has been deleted`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete line",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Lines for Unit: {unitName}
          <Button 
            onClick={() => setShowAddForm(true)} 
            size="sm"
            disabled={showAddForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Line
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="line-name">Line Name</Label>
                  <Input
                    id="line-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter line name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line-capacity">Capacity</Label>
                  <Input
                    id="line-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line-stock">Current Stock</Label>
                  <Input
                    id="line-stock"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line-position">Position</Label>
                  <Input
                    id="line-position"
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="line-description">Description</Label>
                <Textarea
                  id="line-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter line description"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddLine} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Line
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', description: '', capacity: 0, currentStock: 0, position: 0 });
                  }}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {unitLines.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No lines added yet. Click "Add Line" to create the first line.
          </div>
        ) : (
          <div className="space-y-2">
            {unitLines.map((line) => (
              <Card key={line.id} className="border">
                <CardContent className="pt-4">
                  {editingId === line.id ? (
                    <EditLineForm
                      line={line}
                      onSave={(updates) => handleUpdateLine(line.id, updates)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{line.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Capacity: {line.capacity || 0} | Stock: {line.currentStock || 0} | Position: {line.position}
                        </p>
                        {line.description && (
                          <p className="text-sm text-muted-foreground mt-1">{line.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(line.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLine(line.id, line.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface EditLineFormProps {
  line: UnitLine;
  onSave: (updates: Partial<UnitLine>) => void;
  onCancel: () => void;
}

const EditLineForm = ({ line, onSave, onCancel }: EditLineFormProps) => {
  const [formData, setFormData] = useState({
    name: line.name,
    description: line.description || '',
    capacity: line.capacity || 0,
    currentStock: line.currentStock || 0,
    position: line.position || 0
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Line Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-capacity">Capacity</Label>
          <Input
            id="edit-capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-stock">Current Stock</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-position">Position</Label>
          <Input
            id="edit-position"
            type="number"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel} size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UnitLinesManager;