
<?php

namespace Database\Seeders;

use App\Models\SkuMatrix;
use App\Models\SkuMatrixRow;
use App\Models\SkuMatrixCell;
use Illuminate\Database\Seeder;

class SkuMatrixSeeder extends Seeder
{
    public function run(): void
    {
        // Create SKU Matrix
        $matrix = SkuMatrix::create([
            'name' => 'Electronics Matrix',
            'description' => 'Matrix for electronic items',
            'room_id' => 1
        ]);

        // Create Matrix Rows
        $row = SkuMatrixRow::create([
            'sku_matrix_id' => $matrix->id,
            'label' => 'Row A',
            'color' => '#FF0000'
        ]);

        // Create Matrix Cells
        SkuMatrixCell::create([
            'sku_matrix_row_id' => $row->id,
            'column_id' => 1,
            'value' => 'Cell A1'
        ]);
    }
}
