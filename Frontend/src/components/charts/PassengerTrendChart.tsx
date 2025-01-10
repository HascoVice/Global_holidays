import React from 'react';
import { useSelector } from 'react-redux';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { RootState } from '@/store';
import { formatNumber } from '@/helpers';

const PassengerTrendChart: React.FC = () => {
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    const monthlyCounts = passengers.reduce((acc: Record<string, number>, passenger) => {
        const key = `${passenger.year}-${passenger.month}`;
        acc[key] = Math.round((acc[key] || 0) + (passenger.total_passenger || 0));
        return acc;
    }, {});

    const chartData = Object.keys(monthlyCounts).map((key) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, count: monthlyCounts[key] };
    });

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" name="Month" unit="" />
                <YAxis
                    name="Passengers"
                    unit=" people"
                    tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Monthly Passenger Trends
                </text>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PassengerTrendChart;
