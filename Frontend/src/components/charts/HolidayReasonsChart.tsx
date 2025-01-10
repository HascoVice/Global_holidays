import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { RootState } from '@/store';
import { formatNumber } from '@/helpers';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const HolidayReasonsChart: React.FC = () => {
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);

    const reasonCounts = holidays.reduce((acc: Record<string, number>, holiday) => {
        const reason = holiday.travel_reason;
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(reasonCounts)
        .map((reason) => ({
            name: reason,
            value: reasonCounts[reason],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 20);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Legend />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Top 20 Travel Reasons
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default HolidayReasonsChart;
