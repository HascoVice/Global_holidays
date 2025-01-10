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
} from 'recharts';
import { RootState } from '@/store';

const HolidayTrend: React.FC = () => {
    // Select filtered holidays data from the store
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);

    // Aggregate holidays by year
    const yearlyTotals = holidays.reduce((acc: Record<number, number>, holiday) => {
        const year = new Date(holiday.date).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});

    // Prepare data for the chart
    const chartData = Object.keys(yearlyTotals)
        .sort((a, b) => parseInt(a) - parseInt(b)) // Sort by year
        .map((year) => ({
            year: parseInt(year),
            holidays: yearlyTotals[parseInt(year)],
        }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="holidays" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HolidayTrend;
