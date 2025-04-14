
# Inventory Management System - Entity Relationship Diagrams

## System Overview

This inventory management system is built with Laravel (backend) and React (frontend) to provide a comprehensive solution for tracking inventory, managing customer products, handling purchase orders, and more.

## Database Structure

### Core Entities

1. **Users**: System users with different roles and permissions
2. **Customers**: Clients who have products stored in the system
3. **Products**: General inventory items that can be stocked
4. **Categories**: Classification of products
5. **Rooms**: Physical spaces owned by customers
6. **Units**: Subdivisions within rooms for storing items
7. **Vendors**: Suppliers of products
8. **Purchase Orders**: Orders placed with vendors

### Inventory Entities

1. **Inventory Items**: Specific instances of products stored in units/bins
2. **Stock Movements**: Record of all inventory changes
3. **Bins**: Storage containers within units
4. **SKU Matrices**: Custom identifier systems for bins/items

### Support Entities

1. **Customer Products**: Products owned by customers
2. **Customer Lists**: Customer-specific product lists
3. **Settings**: System configuration values
4. **Notifications**: System messages for users
5. **Reports**: Saved report configurations

## ERD Diagrams

### Main Entities

```
+----------+        +------------+        +-----------+
|  Users   |<-------| Customers  |------->|   Rooms   |
+----------+        +------------+        +-----------+
                         |                     |
                         v                     v
                   +------------+        +-----------+
                   | Customer   |        |   Units   |
                   | Products   |        +-----------+
                   +------------+             |
                         |                    |
                         v                    v
                   +------------+        +-----------+
                   | Customer   |        |   Bins    |
                   |   Lists    |        +-----------+
                   +------------+             |
                                              v
                                        +-----------+
                                        | Inventory |
                                        |   Items   |
                                        +-----------+
```

### Inventory Management

```
+------------+        +------------+        +---------------+
| Categories |<-------| Products   |------->| Stock         |
+------------+        +------------+        | Movements     |
                           ^                +---------------+
                           |
                           v
+------------+        +------------+        +---------------+
| Vendors    |------->| Purchase   |------->| Purchase      |
+------------+        | Orders     |        | Order Items   |
                      +------------+        +---------------+
```

### SKU Matrix System

```
+-----------+        +--------------+        +----------------+
|   Rooms   |------->| SKU Matrices |------->| SKU Matrix Rows|
+-----------+        +--------------+        +----------------+
                            |                        |
                            v                        v
                      +-----------+        +----------------+
                      |   Units   |        | SKU Matrix Cells|
                      +-----------+        +----------------+
```

## Database Relationships

### User Relationships
- User has many Customers
- User has many Notifications
- User has many Reports
- User has many StockMovements (performed_by)

### Customer Relationships
- Customer belongs to User
- Customer has many CustomerProducts
- Customer has many CustomerLists
- Customer has many Rooms

### Room Relationships
- Room belongs to Customer
- Room has many Units
- Room has many SkuMatrices

### Unit Relationships
- Unit belongs to Room
- Unit has many InventoryItems
- Unit belongs to many SkuMatrices (many-to-many)

### Product Relationships
- Product belongs to Category
- Product has many InventoryItems
- Product has many StockMovements
- Product belongs to many Vendors (many-to-many with pivot data)
- Product has many PurchaseOrderItems

### Inventory Item Relationships
- InventoryItem belongs to Product
- InventoryItem belongs to Unit
- InventoryItem belongs to Bin
- InventoryItem belongs to SkuMatrix
- InventoryItem has many StockMovements (morphMany)

### Vendor Relationships
- Vendor has many PurchaseOrders
- Vendor belongs to many Products (many-to-many with pivot data)

### Purchase Order Relationships
- PurchaseOrder belongs to Vendor
- PurchaseOrder has many PurchaseOrderItems

### SKU Matrix Relationships
- SkuMatrix belongs to Room
- SkuMatrix belongs to many Units (many-to-many)
- SkuMatrix has many SkuMatrixRows
- SkuMatrix has many InventoryItems

## Alternative Structure Option

An alternative structure could focus more on customer-centric organization:

```
+----------+        +------------+        +-----------+
|  Users   |<-------| Customers  |------->| Customer  |
+----------+        +------------+        | Products  |
                          |                +-----------+
                          |
                          v
                    +-----------+        +-----------+
                    |   Rooms   |------->|   Units   |
                    +-----------+        +-----------+
                                              |
                                              v
                    +-----------+        +-----------+
                    | Products  |------->| Inventory |
                    +-----------+        |   Items   |
                    |    |                +-----------+
                    |    |                      |
                    v    v                      v
           +------------+              +-----------------+
           | Categories |              | Stock Movements |
           +------------+              +-----------------+
```

In this alternative structure, the inventory management is more directly tied to customer storage locations, with less emphasis on the vendor/purchase order aspects.
