
// Warehouse type definition that was missing
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  description?: string;
  manager?: string;
  createdAt: string;
  updatedAt: string;
}
