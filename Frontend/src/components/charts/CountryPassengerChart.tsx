import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RootState } from '@/store';

const CountryPassengerChart: React.FC = () => {
    // Select filtered passengers data from the store
    const passengers = useSelector((state: RootState) => state.passengers.filteredData);

    // Aggregate passengers by country
    const countryTotals = passengers.reduce((acc: Record<string, number>, passenger) => {
        const country = passenger.country_code;
        acc[country] = (acc[country] || 0) + (passenger.total_passenger || 0);
        return acc;
    }, {});

    const chartData = Object.keys(countryTotals)
        .map((country) => ({
            country,
            passengers: countryTotals[country],
        }))
        .sort((a, b) => b.passengers - a.passengers); // Sort by passenger count (descending)

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="passengers" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CountryPassengerChart;
