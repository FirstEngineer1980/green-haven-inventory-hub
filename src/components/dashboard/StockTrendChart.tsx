
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface StockTrendChartProps {
  data: {
    date: string;
    inStock: number;
  }[];
}

const StockTrendChart: React.FC<StockTrendChartProps> = ({ data }) => {
  // Ensure data is valid and has the correct format
  const formattedData = data.map(item => ({
    ...item,
    // Ensure date is a valid string that can be parsed
    date: typeof item.date === 'string' ? item.date : new Date().toISOString()
  }));

  return (
    <div className="h-full">
      <h3 className="text-base font-medium mb-3">Stock Trend</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
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
              tickFormatter={(dateStr) => {
                try {
                  // Only try to format if it's a valid date string
                  if (dateStr && typeof dateStr === 'string') {
                    return format(new Date(dateStr), 'MMM d');
                  }
                  return '';
                } catch (error) {
                  console.error('Date formatting error:', error, dateStr);
                  return '';
                }
              }}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(dateStr) => {
                try {
                  // Only try to format if it's a valid date string
                  if (dateStr && typeof dateStr === 'string') {
                    return format(new Date(dateStr), 'MMMM d, yyyy');
                  }
                  return 'Unknown date';
                } catch (error) {
                  console.error('Tooltip date formatting error:', error, dateStr);
                  return 'Invalid date';
                }
              }}
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
