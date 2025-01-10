import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { RootState } from '@/store';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const PassengerPieChart: React.FC = () => {
    // Select filtered passengers data from the store
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    // Calculate total domestic and international passengers
    const totalDomestic = passengers.reduce((sum, passenger) => sum + passenger.domestic, 0);
    const totalInternational = passengers.reduce(
        (sum, passenger) => sum + passenger.international,
        0
    );

    const chartData = [
        { name: 'Domestic', value: totalDomestic },
        { name: 'International', value: totalInternational },
    ];

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

export default PassengerPieChart;
