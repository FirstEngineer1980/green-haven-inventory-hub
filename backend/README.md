
# Laravel Backend API

This is the backend API for the inventory management system built with Laravel.

## Setup Instructions

1. Install PHP and Composer
2. Clone the repository
3. Run `composer install`
4. Copy `.env.example` to `.env` and configure your database
5. Run migrations: `php artisan migrate`
6. Generate application key: `php artisan key:generate`
7. Start the server: `php artisan serve`

## API Endpoints

The API provides endpoints for the following resources:

- Users
- Customers
- Customer Products
- Customer Lists
- Rooms
- Units
- Vendors
- Purchase Orders

## Authentication

The API uses Laravel Sanctum for authentication. To authenticate:

1. Register a new user via `/api/register`
2. Login via `/api/login` to get a token
3. Include the token in the Authorization header for subsequent requests

## Models and Relationships

The API includes the following data models and their relationships:

- User: Has many customers
- Customer: Belongs to a user, has many products, lists, and rooms
- CustomerProduct: Belongs to a customer
- CustomerList: Belongs to a customer
- Room: Belongs to a customer, has many units
- Unit: Belongs to a room
- Vendor: Has many purchase orders
- PurchaseOrder: Belongs to a vendor, has many items
- PurchaseOrderItem: Belongs to a purchase order

## File Upload

The API includes an ImageService for handling file uploads, which supports:

- Regular file uploads
- Base64 encoded image storage

## License

The Laravel framework is open-sourced software licensed under the MIT license.
