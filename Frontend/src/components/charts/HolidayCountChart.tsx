import React from 'react';
import { useSelector } from 'react-redux';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { RootState } from '@/store';
import { formatNumber } from '@/helpers';

const HolidayCountChart: React.FC = () => {
    const holidays = useSelector((state: RootState) => state.holidays.filteredData);

    const yearCounts = holidays.reduce((acc: Record<string, number>, holiday) => {
        const year = new Date(holiday.date).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(yearCounts).map((year) => ({
        year: parseInt(year),
        count: yearCounts[year],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" name="Year" unit="" />
                <YAxis
                    dataKey="count"
                    name="Holidays Count"
                    unit=" days"
                    tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Number of Holidays Per Year
                </text>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HolidayCountChart;
