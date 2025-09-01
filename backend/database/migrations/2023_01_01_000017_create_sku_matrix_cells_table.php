
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
        Schema::create('sku_matrix_cells', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sku_matrix_row_id')->constrained()->cascadeOnDelete();
            $table->string('column_id');
            $table->string('value')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sku_matrix_cells');
    }
};
