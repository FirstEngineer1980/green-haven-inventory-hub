
/**
 * Utility to generate template files for importing data
 */

export interface TemplateField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  description: string;
  example: any;
}

export interface Template {
  name: string;
  description: string;
  fields: TemplateField[];
}

export const generateTemplateJSON = (template: Template): string => {
  // Create example data based on template fields
  const exampleItem: Record<string, any> = {};
  
  template.fields.forEach(field => {
    exampleItem[field.name] = field.example;
  });
  
  // Return JSON string with 2 example items
  return JSON.stringify([exampleItem, { ...exampleItem }], null, 2);
};

// Define templates for each module
export const templates: Record<string, Template> = {
  users: {
    name: 'Users',
    description: 'Template for importing users',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'User\'s full name', example: 'John Doe' },
      { name: 'email', type: 'string', required: true, description: 'User\'s email address', example: 'john.doe@example.com' },
      { name: 'role', type: 'string', required: true, description: 'User\'s role (admin, manager, staff, viewer)', example: 'staff' },
      { name: 'permissions', type: 'array', required: false, description: 'List of permissions', example: ['view_reports', 'manage_inventory'] },
      { name: 'avatar', type: 'string', required: false, description: 'URL to user\'s avatar image', example: 'https://example.com/avatar.jpg' },
    ]
  },
  bins: {
    name: 'Bins',
    description: 'Template for importing bins',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Bin name', example: 'Bin A1' },
      { name: 'length', type: 'number', required: true, description: 'Length of the bin', example: 10 },
      { name: 'width', type: 'number', required: true, description: 'Width of the bin', example: 10 },
      { name: 'height', type: 'number', required: true, description: 'Height of the bin', example: 10 },
      { name: 'volumeCapacity', type: 'number', required: true, description: 'Volume capacity of the bin', example: 1000 },
      { name: 'unitMatrixId', type: 'string', required: false, description: 'ID of the unit matrix', example: '1' },
    ]
  },
  rooms: {
    name: 'Rooms',
    description: 'Template for importing rooms',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Room name', example: 'Storage Room A' },
      { name: 'customerId', type: 'string', required: true, description: 'ID of the customer', example: '1' },
      { name: 'unit', type: 'number', required: true, description: 'Unit number', example: 101 },
    ]
  },
  units: {
    name: 'Units',
    description: 'Template for importing units',
    fields: [
      { name: 'roomId', type: 'string', required: true, description: 'ID of the room', example: '1' },
      { name: 'number', type: 'string', required: true, description: 'Unit number', example: 'U101' },
      { name: 'size', type: 'number', required: true, description: 'Size of the unit', example: 150 },
      { name: 'sizeUnit', type: 'string', required: true, description: 'Unit of size measurement (sqft, sqm, m²)', example: 'sqft' },
      { name: 'status', type: 'string', required: true, description: 'Unit status (available, occupied, maintenance)', example: 'available' },
      { name: 'description', type: 'string', required: false, description: 'Description of the unit', example: 'Corner unit with good ventilation' },
    ]
  },
  unitMatrices: {
    name: 'SKU Matrices',
    description: 'Template for importing SKU matrices',
    fields: [
      { name: 'roomId', type: 'string', required: true, description: 'ID of the room', example: '1' },
      { name: 'name', type: 'string', required: true, description: 'Name of the matrix', example: 'Matrix A' },
      { name: 'rows', type: 'array', required: true, description: 'Array of row objects', example: [
        { label: 'Row 1', color: '#FF0000', cells: [{ value: 'A1', columnId: '1' }] }
      ] },
    ]
  },
  products: {
    name: 'Products',
    description: 'Template for importing products',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Product name', example: 'Widget XYZ' },
      { name: 'sku', type: 'string', required: true, description: 'Product SKU', example: 'WID-XYZ-001' },
      { name: 'description', type: 'string', required: false, description: 'Product description', example: 'High-quality widget for industrial use' },
      { name: 'category', type: 'string', required: true, description: 'Product category', example: 'Widgets' },
      { name: 'price', type: 'number', required: true, description: 'Sale price', example: 29.99 },
      { name: 'costPrice', type: 'number', required: true, description: 'Cost price', example: 19.99 },
      { name: 'quantity', type: 'number', required: true, description: 'Available quantity', example: 100 },
      { name: 'threshold', type: 'number', required: true, description: 'Low stock threshold', example: 20 },
      { name: 'location', type: 'string', required: false, description: 'Storage location', example: 'Warehouse A' },
    ]
  },
  purchaseOrders: {
    name: 'Purchase Orders',
    description: 'Template for importing purchase orders',
    fields: [
      { name: 'poNumber', type: 'string', required: true, description: 'Purchase order number', example: 'PO-2023-001' },
      { name: 'vendorId', type: 'string', required: true, description: 'ID of the vendor', example: '1' },
      { name: 'status', type: 'string', required: true, description: 'Status (draft, pending, approved, received, cancelled)', example: 'draft' },
      { name: 'total', type: 'number', required: true, description: 'Total amount', example: 1500.00 },
      { name: 'expectedDeliveryDate', type: 'date', required: false, description: 'Expected delivery date', example: '2023-12-31' },
      { name: 'notes', type: 'string', required: false, description: 'Additional notes', example: 'Please deliver before noon' },
      { name: 'items', type: 'array', required: true, description: 'Array of order items', example: [
        { productId: '1', productName: 'Widget XYZ', quantity: 10, unitPrice: 19.99, total: 199.90 }
      ] },
    ]
  },
  categories: {
    name: 'Categories',
    description: 'Template for importing categories',
    fields: [
      { name: 'name', type: 'string', required: true, description: 'Category name', example: 'Electronics' },
      { name: 'description', type: 'string', required: false, description: 'Category description', example: 'Electronic components and devices' },
      { name: 'productCount', type: 'number', required: false, description: 'Number of products in this category', example: 25 },
    ]
  }
};

// Function to generate template download URLs (in-memory URLs)
export const getTemplateUrl = (templateKey: string): string | undefined => {
  const template = templates[templateKey];
  if (!template) return undefined;
  
  const templateContent = generateTemplateJSON(template);
  const blob = new Blob([templateContent], { type: 'application/json' });
  return URL.createObjectURL(blob);
};

// Validation functions for different data types
export const validateTemplate = (data: any[], templateKey: string): { valid: boolean; errors?: string[] } => {
  const template = templates[templateKey];
  if (!template) return { valid: false, errors: ['Invalid template key'] };
  
  if (!Array.isArray(data)) {
    return { valid: false, errors: ['Data must be an array'] };
  }
  
  const errors: string[] = [];
  
  data.forEach((item, index) => {
    template.fields.forEach(field => {
      // Check required fields
      if (field.required && (item[field.name] === undefined || item[field.name] === null)) {
        errors.push(`Item ${index + 1}: Missing required field '${field.name}'`);
      }
      
      // Type checking
      if (item[field.name] !== undefined && item[field.name] !== null) {
        const value = item[field.name];
        
        switch (field.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`Item ${index + 1}: Field '${field.name}' must be a string`);
            }
            break;
          case 'number':
            if (typeof value !== 'number') {
              errors.push(`Item ${index + 1}: Field '${field.name}' must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`Item ${index + 1}: Field '${field.name}' must be a boolean`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`Item ${index + 1}: Field '${field.name}' must be an array`);
            }
            break;
          case 'object':
            if (typeof value !== 'object' || Array.isArray(value) || value === null) {
              errors.push(`Item ${index + 1}: Field '${field.name}' must be an object`);
            }
            break;
        }
      }
    });
  });
  
  return { valid: errors.length === 0, errors };
};
