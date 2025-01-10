import React from 'react';
import { useSelector } from 'react-redux';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { RootState } from '@/store';

const MonthlyPassengerChart: React.FC = () => {
    // Select filtered passengers data from the store
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    // Aggregate passengers by month
    const monthlyTotals = passengers.reduce((acc: Record<string, number>, passenger) => {
        const month = `${passenger.year}-${String(passenger.month).padStart(2, '0')}`; // Format as "YYYY-MM"
        acc[month] = (acc[month] || 0) + (passenger.total_passenger || 0);
        return acc;
    }, {});

    // Sort data by month (chronological order)
    const chartData = Object.keys(monthlyTotals)
        .sort()
        .map((month) => ({
            month,
            passengers: monthlyTotals[month],
        }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="passengers" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default MonthlyPassengerChart;
