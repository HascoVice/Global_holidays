import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RootState } from '@/store';

const HolidayCountChart: React.FC = () => {
    // Select filtered holidays data from the store
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);

    // Transform data to count holidays by year
    const yearCounts = holidays.reduce((acc: Record<string, number>, holiday) => {
        const year = new Date(holiday.date).getFullYear(); // Extract year from the date
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(yearCounts)
        .sort((a, b) => parseInt(a) - parseInt(b)) // Sort by year
        .map((year) => ({
            year,
            count: yearCounts[parseInt(year)],
        }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HolidayCountChart;
