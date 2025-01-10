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

const CountryPassengerChart: React.FC = () => {
    const passengers = useSelector((state: RootState) => state.passengers.data);

    const countryTotals = passengers.reduce((acc: Record<string, number>, passenger) => {
        const country = passenger.country_code;
        acc[country] = (acc[country] || 0) + (passenger.total_passenger || 0);
        return acc;
    }, {});

    const chartData = Object.keys(countryTotals).map((country) => ({
        country,
        passengers: countryTotals[country],
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" name="Country Code" unit="" />
                <YAxis dataKey="passengers" name="Passengers" unit=" people" />
                <Tooltip />
                <Legend />
                <Bar dataKey="passengers" fill="#82ca9d" />
                <text
                    x={200}
                    y={20}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold"
                >
                    Passengers by Country
                </text>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CountryPassengerChart;
