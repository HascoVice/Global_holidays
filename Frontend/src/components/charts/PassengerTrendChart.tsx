import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RootState } from '@/store';

const PassengerTrendChart: React.FC = () => {
    // Select filtered passengers data from the store
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    // Prepare data grouped by year and month
    const monthlyCounts = passengers.reduce((acc: Record<string, number>, passenger) => {
        const key = `${passenger.year}-${passenger.month}`;
        acc[key] = (acc[key] || 0) + passenger.total_passenger;
        return acc;
    }, {});

    const chartData = Object.keys(monthlyCounts).map((key) => {
        const [year, month] = key.split('-').map(Number);
        return { year, month, count: monthlyCounts[key] };
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PassengerTrendChart;
