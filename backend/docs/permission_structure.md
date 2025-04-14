# Permission Structure Documentation

## Overview
This document outlines the role and permission structure for the inventory management system. We use the Spatie Laravel Permission package for managing roles and permissions in Laravel 11.

## Roles

The system has the following predefined roles:

1. **Super Admin**
   - Has all permissions
   - Can manage system settings and configurations
   - Can view all data across all areas

2. **Admin**
   - Manages users, roles, and permissions
   - Has access to most functionality but not system settings
   - Can view all areas of the application

3. **Manager**
   - Manages day-to-day operations
   - Can create, update, and approve purchase orders
   - Can manage inventory and view reports
   - Cannot modify system settings or manage users

4. **Staff**
   - Limited access to operational functions
   - Can view and update inventory 
   - Can receive purchase orders
   - Cannot create or approve purchase orders
   - Cannot view sensitive financial information

5. **Client**
   - Limited access to their own data
   - Can view their own orders and products
   - Cannot view inventory or other client data

## Permission Groups

Permissions are organized into functional groups:

### User Management
- `view users`
- `create users`
- `edit users`
- `delete users`
- `assign roles`

### Customer Management
- `view customers`
- `create customers`
- `edit customers`
- `delete customers`

### Product Management
- `view products`
- `create products`
- `edit products`
- `delete products`
- `adjust stock`

### Inventory Management
- `view inventory`
- `transfer inventory`
- `adjust inventory`
- `view stock movements`
- `create stock movements`

### Purchase Order Management
- `view purchase orders`
- `create purchase orders`
- `edit purchase orders`
- `delete purchase orders`
- `approve purchase orders`
- `receive purchase orders`

### Client Order Template Management
- `view client templates`
- `create client templates`
- `edit client templates`
- `delete client templates`
- `process orders`

### Vendor Management
- `view vendors`
- `create vendors`
- `edit vendors`
- `delete vendors`

### Report Management
- `view reports`
- `create reports`
- `export reports`

### System Management
- `view settings`
- `edit settings`
- `manage backups`
- `view logs`

## Role-Permission Assignments

### Super Admin
- All permissions

### Admin
- All permissions except:
  - `manage backups`
  - `edit settings`

### Manager
- Customer Management (all)
- Product Management (all)
- Inventory Management (all)
- Purchase Order Management (all)
- Client Order Template Management (all)
- Vendor Management (all)
- Report Management (view, export)
- View-only access to users and settings

### Staff
- `view customers`
- `view products`
- `view inventory`
- `transfer inventory`
- `adjust inventory`
- `view stock movements`
- `create stock movements`
- `view purchase orders`
- `receive purchase orders`
- `view client templates`
- `view vendors`
- `view reports`

### Client
- `view own orders`
- `view own products`
- `view own templates`
- `create own templates`
- `edit own templates`

## Implementation in Laravel 11

### Creating Roles and Permissions

The system uses database seeding to create roles and permissions:

```php
// DatabaseSeeder.php
public function run()
{
    $this->call([
        PermissionSeeder::class,
        RoleSeeder::class,
        UserSeeder::class,
    ]);
}
```

```php
// PermissionSeeder.php
use Spatie\Permission\Models\Permission;

public function run()
{
    $permissions = [
        // User Management
        'view users',
        'create users',
        'edit users',
        'delete users',
        'assign roles',

        // Customer Management
        'view customers',
        'create customers',
        'edit customers',
        'delete customers',

        // Product Management
        'view products',
        'create products',
        'edit products',
        'delete products',
        'adjust stock',

        // Inventory Management
        'view inventory',
        'transfer inventory',
        'adjust inventory',
        'view stock movements',
        'create stock movements',

        // Purchase Order Management
        'view purchase orders',
        'create purchase orders',
        'edit purchase orders',
        'delete purchase orders',
        'approve purchase orders',
        'receive purchase orders',

        // Client Order Template Management
        'view client templates',
        'create client templates',
        'edit client templates',
        'delete client templates',
        'process orders',

        // Vendor Management
        'view vendors',
        'create vendors',
        'edit vendors',
        'delete vendors',

        // Report Management
        'view reports',
        'create reports',
        'export reports',

        // System Management
        'view settings',
        'edit settings',
        'manage backups',
        'view logs',
    ];

    foreach ($permissions as $permission) {
        Permission::create(['name' => $permission]);
    }
}
```

```php
// RoleSeeder.php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

public function run()
{
    // Create roles
    $superAdmin = Role::create(['name' => 'super admin']);
    $admin = Role::create(['name' => 'admin']);
    $manager = Role::create(['name' => 'manager']);
    $staff = Role::create(['name' => 'staff']);
    $client = Role::create(['name' => 'client']);

    // Assign all permissions to super admin
    $superAdmin->givePermissionTo(Permission::all());

    // Assign specific permissions to each role
    $admin->givePermissionTo([
        'view users',
        'create users',
        'edit users',
        'delete users',
        'assign roles',
        'view customers',
        'create customers',
        'edit customers',
        'delete customers',
        'view products',
        'create products',
        'edit products',
        'delete products',
        'adjust stock',
        'view inventory',
        'transfer inventory',
        'adjust inventory',
        'view stock movements',
        'create stock movements',
        'view purchase orders',
        'create purchase orders',
        'edit purchase orders',
        'delete purchase orders',
        'approve purchase orders',
        'receive purchase orders',
        'view client templates',
        'create client templates',
        'edit client templates',
        'delete client templates',
        'process orders',
        'view vendors',
        'create vendors',
        'edit vendors',
        'delete vendors',
        'view reports',
        'create reports',
        'export reports',
        'view settings',
        'view logs',
    ]);

    $manager->givePermissionTo([
        'view customers',
        'create customers',
        'edit customers',
        'delete customers',
        'view products',
        'create products',
        'edit products',
        'delete products',
        'adjust stock',
        'view inventory',
        'transfer inventory',
        'adjust inventory',
        'view stock movements',
        'create stock movements',
        'view purchase orders',
        'create purchase orders',
        'edit purchase orders',
        'delete purchase orders',
        'approve purchase orders',
        'receive purchase orders',
        'view client templates',
        'create client templates',
        'edit client templates',
        'delete client templates',
        'process orders',
        'view vendors',
        'create vendors',
        'edit vendors',
        'delete vendors',
        'view reports',
        'create reports',
        'export reports',
        'view users',
        'view settings',
    ]);

    $staff->givePermissionTo([
        'view customers',
        'view products',
        'view inventory',
        'transfer inventory',
        'adjust inventory',
        'view stock movements',
        'create stock movements',
        'view purchase orders',
        'receive purchase orders',
        'view client templates',
        'view vendors',
        'view reports',
    ]);

    $client->givePermissionTo([
        'view purchase orders',
        'view client templates',
    ]);
}
```

### Checking Permissions in Controllers

Controller methods use middleware to check permissions:

```php
// PurchaseOrderController.php
public function __construct()
{
    $this->middleware('permission:view purchase orders')->only(['index', 'show']);
    $this->middleware('permission:create purchase orders')->only(['store']);
    $this->middleware('permission:edit purchase orders')->only(['update', 'updateStatus']);
    $this->middleware('permission:delete purchase orders')->only(['destroy']);
    $this->middleware('permission:receive purchase orders')->only(['receiveItems']);
}
```

### Policy-based Authorization

For more complex authorization logic, we use policies:

```php
// PurchaseOrderPolicy.php
use App\Models\User;
use App\Models\PurchaseOrder;
use Illuminate\Auth\Access\HandlesAuthorization;

class PurchaseOrderPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any purchase orders.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->hasAnyRole(['super admin', 'admin', 'manager', 'staff', 'client']);
    }

    /**
     * Determine whether the user can view the purchase order.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PurchaseOrder  $purchaseOrder
     * @return mixed
     */
    public function view(User $user, PurchaseOrder $purchaseOrder)
    {
        // Super admin, admin, and manager can view all POs
        if ($user->hasAnyRole(['super admin', 'admin', 'manager'])) {
            return true;
        }

        // Staff can view all non-sensitive POs
        if ($user->hasRole('staff')) {
            return true;
        }

        // Clients can only view their own POs
        if ($user->hasRole('client')) {
            return $user->customer && $purchaseOrder->customer_id === $user->customer->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create purchase orders.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->hasAnyRole(['super admin', 'admin', 'manager']);
    }

    /**
     * Determine whether the user can update the purchase order.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PurchaseOrder  $purchaseOrder
     * @return mixed
     */
    public function update(User $user, PurchaseOrder $purchaseOrder)
    {
        if ($user->hasAnyRole(['super admin', 'admin'])) {
            return true;
        }

        if ($user->hasRole('manager')) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the purchase order.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PurchaseOrder  $purchaseOrder
     * @return mixed
     */
    public function delete(User $user, PurchaseOrder $purchaseOrder)
    {
        return $user->hasAnyRole(['super admin', 'admin']);
    }

    /**
     * Determine whether the user can receive items for the purchase order.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PurchaseOrder  $purchaseOrder
     * @return mixed
     */
    public function receiveItems(User $user, PurchaseOrder $purchaseOrder)
    {
        return $user->hasAnyRole(['super admin', 'admin', 'manager', 'staff']);
    }
}
```

## UI Considerations

The application UI dynamically adjusts based on user permissions:

- Menu items only show for permitted actions
- Buttons (edit, delete, etc.) only appear for authorized users
- Forms adjust fields based on permission level
- Reports filter data based on access level

## Further Recommendations

1. **Row-Level Security**: Consider implementing row-level security for data where multiple clients access the system.

2. **Permission Auditing**: Log permission changes to maintain an audit trail.

3. **Role Hierarchy**: Implement a role hierarchy to simplify permission management.

4. **Client-Specific Permissions**: For multi-tenant setups, consider scoped permissions.
