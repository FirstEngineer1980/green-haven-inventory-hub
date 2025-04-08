
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface StockTrendChartProps {
  data: {
    date: string;
    inStock: number;
  }[];
}

const StockTrendChart: React.FC<StockTrendChartProps> = ({ data }) => {
  return (
    <div className="h-full">
      <h3 className="text-base font-medium mb-3">Stock Trend</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(parseISO(date), 'MMM d')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => format(parseISO(date), 'MMMM d, yyyy')}
              formatter={(value) => [`${value} products`, 'In Stock']}
            />
            <Line
              type="monotone"
              dataKey="inStock"
              stroke="#6bacde"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockTrendChart;
