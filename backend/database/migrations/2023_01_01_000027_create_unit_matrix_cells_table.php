<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_matrix_cells', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_matrix_row_id')->constrained()->cascadeOnDelete();
            $table->string('column_id');
            $table->string('value')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_matrix_cells');
    }
};
