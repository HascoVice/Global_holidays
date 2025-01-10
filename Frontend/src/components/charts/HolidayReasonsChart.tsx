import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { RootState } from '@/store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const HolidayReasonsChart: React.FC = () => {
    // Select filtered holidays data from the store
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);

    // Count frequency of holiday reasons
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
        .sort((a, b) => b.value - a.value) // Sort in descending order
        .slice(0, 20);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default HolidayReasonsChart;
