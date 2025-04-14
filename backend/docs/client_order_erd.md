
# Client Order System - Entity Relationship Diagram

## Overview
This document outlines the database structure for client recurring orders in our inventory management system. The design allows for clients to have pre-defined order templates that can automatically generate purchase orders on a scheduled basis.

## Core Entities

### PurchaseOrder
Represents a purchase order that can be either standalone or generated from a client template.

```
PurchaseOrder
-------------
id (PK)
order_number (unique)
vendor_id (FK to vendors)
customer_id (FK to customers) [nullable]
status (pending, approved, shipped, received, cancelled)
total_amount
expected_delivery_date
delivery_date
is_recurring (boolean)
recurring_frequency (weekly, biweekly, monthly)
next_recurring_date
notes
created_at
updated_at
deleted_at
```

### PurchaseOrderItem
Represents an item on a purchase order.

```
PurchaseOrderItem
----------------
id (PK)
purchase_order_id (FK to purchase_orders)
product_id (FK to products) [nullable]
sku
name
quantity
unit_price
total_price
received_quantity
status (pending, partial, received)
created_at
updated_at
deleted_at
```

### ClientOrderTemplate
Represents a template for recurring client orders.

```
ClientOrderTemplate
------------------
id (PK)
customer_id (FK to customers)
name
frequency (weekly, biweekly, monthly)
next_order_date
is_active (boolean)
notes
created_at
updated_at
deleted_at
```

### ClientOrderTemplateItem
Represents an item in a client order template.

```
ClientOrderTemplateItem
----------------------
id (PK)
client_order_template_id (FK to client_order_templates)
product_id (FK to products)
quantity
is_active (boolean)
created_at
updated_at
```

## Relationships

1. **PurchaseOrder** has many **PurchaseOrderItems**
2. **PurchaseOrder** belongs to **Vendor**
3. **PurchaseOrder** may belong to **Customer**
4. **PurchaseOrderItem** belongs to **PurchaseOrder**
5. **PurchaseOrderItem** may belong to **Product**
6. **ClientOrderTemplate** belongs to **Customer**
7. **ClientOrderTemplate** has many **ClientOrderTemplateItems**
8. **ClientOrderTemplateItem** belongs to **ClientOrderTemplate**
9. **ClientOrderTemplateItem** belongs to **Product**

## Process Flow

1. Client order templates are created with product items and frequency settings.
2. A scheduled job runs daily to check for templates that are due for ordering.
3. When a template is due, a new purchase order is automatically created with the template's items.
4. The template's next_order_date is updated based on the frequency setting.
5. The purchase order follows the normal purchase order workflow.

## Diagram

```
+-------------------+       +----------------------+
|   PurchaseOrder   |-------| PurchaseOrderItem   |
+-------------------+       +----------------------+
| id                |<---   | id                   |
| order_number      |    |  | purchase_order_id    |
| vendor_id         |    |  | product_id           |
| customer_id       |    |  | sku                  |
| status            |    |  | name                 |
| total_amount      |    |  | quantity             |
| expected_delivery |    |  | unit_price           |
| delivery_date     |    |  | total_price          |
| is_recurring      |    |  | received_quantity    |
| recurring_freq    |    |  | status               |
| next_recurring    |    |  +----------------------+
| notes             |    |
+-------------------+    |
                          
+-------------------+       +----------------------+
| ClientOrderTemplate|------| ClientOrderTemplateItem|
+-------------------+       +----------------------+
| id                |<---   | id                   |
| customer_id       |    |  | template_id          |
| name              |    |  | product_id           |
| frequency         |    |  | quantity             |
| next_order_date   |    |  | is_active            |
| is_active         |    |  +----------------------+
| notes             |    |
+-------------------+    |
```

## Notes
- A PurchaseOrder can exist without being tied to a ClientOrderTemplate (regular PO).
- When a PurchaseOrder is created from a ClientOrderTemplate, it references the customer but doesn't maintain a direct relationship to the template to avoid tight coupling.
- The ClientOrderTemplate has a next_order_date field that is updated after each order is created.
- Both PurchaseOrder and ClientOrderTemplate entities support frequency settings, allowing for different types of recurring orders.
