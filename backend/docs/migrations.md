
# Migration Recommendations for Inventory Management System

Below are the recommended migrations for each entity in our inventory management system.

## Core Migrations

### Products Table

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('sku')->nullable()->unique();
    $table->text('description')->nullable();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->decimal('price', 10, 2)->default(0);
    $table->decimal('cost_price', 10, 2)->default(0);
    $table->integer('quantity')->default(0);
    $table->integer('threshold')->default(5);
    $table->string('location')->nullable();
    $table->string('image')->nullable();
    $table->string('status')->default('active');
    $table->string('barcode')->nullable();
    $table->string('weight')->nullable();
    $table->string('dimensions')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

### Categories Table

```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```

### Stock Movements Table

```php
Schema::create('stock_movements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->integer('quantity');
    $table->enum('type', ['in', 'out']);
    $table->string('reason');
    $table->morphs('reference');
    $table->foreignId('performed_by')->constrained('users');
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

### Inventory Items Table

```php
Schema::create('inventory_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
    $table->foreignId('bin_id')->nullable()->constrained()->nullOnDelete();
    $table->integer('quantity')->default(0);
    $table->foreignId('sku_matrix_id')->nullable()->constrained('sku_matrices')->nullOnDelete();
    $table->string('status')->default('active');
    $table->text('notes')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

### Bins Table

```php
Schema::create('bins', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('length', 8, 2)->nullable();
    $table->decimal('width', 8, 2)->nullable();
    $table->decimal('height', 8, 2)->nullable();
    $table->decimal('volume_capacity', 10, 2)->nullable();
    $table->string('location')->nullable();
    $table->foreignId('unit_matrix_id')->nullable()->constrained()->nullOnDelete();
    $table->string('status')->default('active');
    $table->timestamps();
    $table->softDeletes();
});
```

## SKU Matrix Tables

### SKU Matrices Table

```php
Schema::create('sku_matrices', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->foreignId('room_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```

### SKU Matrix Units Pivot Table

```php
Schema::create('sku_matrix_units', function (Blueprint $table) {
    $table->id();
    $table->foreignId('sku_matrix_id')->constrained()->cascadeOnDelete();
    $table->foreignId('unit_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});
```

### SKU Matrix Rows Table

```php
Schema::create('sku_matrix_rows', function (Blueprint $table) {
    $table->id();
    $table->foreignId('sku_matrix_id')->constrained()->cascadeOnDelete();
    $table->string('label');
    $table->string('color')->nullable();
    $table->timestamps();
});
```

### SKU Matrix Cells Table

```php
Schema::create('sku_matrix_cells', function (Blueprint $table) {
    $table->id();
    $table->foreignId('sku_matrix_row_id')->constrained()->cascadeOnDelete();
    $table->string('column_id');
    $table->string('value')->nullable();
    $table->timestamps();
});
```

## Vendor Management Tables

### Product Vendors Pivot Table

```php
Schema::create('product_vendors', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->cascadeOnDelete();
    $table->foreignId('vendor_id')->constrained()->cascadeOnDelete();
    $table->string('sku')->nullable();
    $table->decimal('cost', 10, 2)->nullable();
    $table->integer('lead_time')->nullable();
    $table->boolean('is_preferred')->default(false);
    $table->timestamps();
});
```

## Settings and Notifications Tables

### Settings Table

```php
Schema::create('settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->text('value');
    $table->string('group')->nullable();
    $table->text('description')->nullable();
    $table->timestamps();
});
```

### Notifications Table

```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('message');
    $table->string('type')->default('info');
    $table->boolean('read')->default(false);
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('link')->nullable();
    $table->morphs('reference');
    $table->timestamps();
});
```

### Reports Table

```php
Schema::create('reports', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->string('type');
    $table->json('params')->nullable();
    $table->string('schedule')->nullable();
    $table->timestamp('last_run')->nullable();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
    $table->softDeletes();
});
```
