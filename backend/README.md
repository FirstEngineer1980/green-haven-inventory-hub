
# Inventory Management System - Backend

This is the Laravel 11 backend for the Inventory Management System with a focus on purchase orders and client recurring orders.

## Features

- **User Management** with role-based permissions
- **Inventory Management** for tracking products and stock levels
- **Purchase Order System** for ordering products from vendors
- **Client Order Templates** for recurring client orders
- **Comprehensive API** for frontend integration
- **Activity Logging** for auditing changes
- **Automated Processes** for recurring orders

## Architecture

The backend is built using the following architectural patterns:

- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic encapsulation
- **Role-based Access Control** using Spatie Permission
- **Soft Deletes** for data recovery

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure Database**
   - Update the database settings in `.env` file
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=inventory
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run Migrations and Seeders**
   ```bash
   php artisan migrate --seed
   ```

6. **Generate API Documentation**
   ```bash
   php artisan l5-swagger:generate
   ```

7. **Start the Server**
   ```bash
   php artisan serve
   ```

## Key Components

### Models

- **User** - System users with roles and permissions
- **Product** - Inventory items with stock tracking
- **PurchaseOrder** - Orders from vendors
- **ClientOrderTemplate** - Templates for recurring client orders
- **Category** - Product categorization
- **Vendor** - Suppliers information
- **Customer** - Client information

### Services

- **PurchaseOrderService** - Business logic for purchase orders
- **ClientOrderTemplateService** - Manages recurring order templates
- **StockMovementService** - Handles inventory adjustments
- **ReportService** - Generates system reports

### Scheduled Tasks

The system includes scheduled tasks for:

- Processing recurring orders
- Cleaning up old activity logs
- Database backups

## API Documentation

API documentation is available at `/api/documentation` when using the development server.

## Testing

Run the test suite with:

```bash
php artisan test
```

## Permissions

The system uses role-based permissions. See [Permission Structure](docs/permission_structure.md) for details.

## Entity Relationships

For detailed information about the database structure, see:
- [Client Order ERD](docs/client_order_erd.md)
- [Migrations Overview](docs/migrations.md)

## License

This project is private and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
