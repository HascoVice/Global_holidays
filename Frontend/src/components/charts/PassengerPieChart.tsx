import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { RootState } from '@/store';

const COLORS = ['#0088FE', '#00C49F'];

const PassengerPieChart: React.FC = () => {
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

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
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Domestic vs. International Passengers
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PassengerPieChart;
