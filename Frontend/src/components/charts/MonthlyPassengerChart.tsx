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

const MonthlyPassengerChart: React.FC = () => {
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    const monthlyTotals = passengers.reduce((acc: Record<string, number>, passenger) => {
        const month = passenger.month;
        acc[month] = (acc[month] || 0) + (passenger.total_passenger || 0);
        return acc;
    }, {});

    const chartData = Object.keys(monthlyTotals).map((month) => ({
        month,
        passengers: monthlyTotals[month],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" name="Month" unit="" />
                <YAxis dataKey="passengers" name="Passengers" unit=" people" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="passengers" stroke="#8884d8" />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Monthly Passenger Totals
                </text>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default MonthlyPassengerChart;
