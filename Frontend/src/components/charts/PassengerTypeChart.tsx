import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RootState } from '@/store';
import { formatNumber } from '@/helpers';

const COLORS = ['#0088FE', '#FF8042'];

const PassengerTypeChart: React.FC = () => {
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    const totalDomestic = Math.round(
        passengers.reduce((sum, passenger) => sum + (passenger.domestic || 0), 0)
    );
    const totalInternational = Math.round(
        passengers.reduce((sum, passenger) => sum + (passenger.international || 0), 0)
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
                    outerRadius={100}
                    label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                >
                    {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value as number)} />
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

export default PassengerTypeChart;
