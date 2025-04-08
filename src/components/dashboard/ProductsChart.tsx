
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProductsChartProps {
  data: {
    category: string;
    count: number;
  }[];
}

const COLORS = ['#74c696', '#6bacde', '#ffd166', '#ef476f', '#118ab2', '#073b4c'];

const ProductsChart: React.FC<ProductsChartProps> = ({ data }) => {
  return (
    <div className="h-full">
      <h3 className="text-base font-medium mb-3">Products by Category</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="count"
              nameKey="category"
              label={({ category, count }) => `${category}: ${count}`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${value} products`, props.payload.category]}
              labelFormatter={() => ''}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductsChart;
