
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
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('bin_id')->nullable();
            $table->integer('quantity')->default(0);
            $table->foreignId('sku_matrix_id')->nullable();
            $table->string('status')->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Add foreign key constraints if the referenced tables exist
        if (Schema::hasTable('bins')) {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->foreign('bin_id')->references('id')->on('bins')->nullOnDelete();
            });
        }

        if (Schema::hasTable('sku_matrices')) {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->foreign('sku_matrix_id')->references('id')->on('sku_matrices')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};
