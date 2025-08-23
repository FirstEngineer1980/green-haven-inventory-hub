<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add clinic_location_id to rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('customer_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id', 'customer_id']);
        });

        // Add clinic_location_id to units table
        Schema::table('units', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('room_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id']);
        });

        // Add clinic_location_id to bins table
        Schema::table('bins', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id']);
        });

        // Add clinic_location_id to sku_matrices table
        Schema::table('sku_matrices', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('room_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id', 'room_id']);
        });

        // Add clinic_location_id to inventory_items table
        Schema::table('inventory_items', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('unit_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id', 'product_id']);
        });

        // Add clinic_location_id to stock_movements table
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('product_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id', 'product_id', 'created_at']);
        });

        // Add clinic_location_id to customer_lists table
        Schema::table('customer_lists', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('customer_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id', 'customer_id']);
        });

        // Add clinic_location_id to customer_products table
        Schema::table('customer_products', function (Blueprint $table) {
            $table->foreignId('clinic_location_id')->nullable()->after('customer_id')->constrained('clinic_locations')->onDelete('cascade');
            $table->index(['clinic_location_id', 'customer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove clinic_location_id from all tables
        Schema::table('customer_products', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('customer_lists', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('sku_matrices', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('bins', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropForeign(['clinic_location_id']);
            $table->dropColumn('clinic_location_id');
        });
    }
};