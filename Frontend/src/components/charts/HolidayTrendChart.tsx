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
    Legend,
} from 'recharts';
import { RootState } from '@/store';

const HolidayTrendChart: React.FC = () => {
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);

    const yearCounts = holidays.reduce((acc: Record<string, number>, holiday) => {
        const year = new Date(holiday.date).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(yearCounts).map((year) => ({
        year: parseInt(year),
        holidays: yearCounts[year],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" name="Year" unit="" />
                <YAxis dataKey="holidays" name="Number of Holidays" unit=" days" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="holidays" stroke="#8884d8" />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Annual Holiday Trends
                </text>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HolidayTrendChart;
