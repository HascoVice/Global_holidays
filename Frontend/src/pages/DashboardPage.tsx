import React from 'react';

import HolidayCountChart from '@/components/charts/HolidayCountChart.tsx';
import HolidayReasonsChart from '@/components/charts/HolidayReasonsChart.tsx';
import CountryPassengerChart from '@/components/charts/CountryPassengerChart.tsx';
import MonthlyPassengerChart from '@/components/charts/MonthlyPassengerChart.tsx';
import HolidayTrendChart from '@/components/charts/HolidayTrendChart.tsx';
import PassengerTypeChart from '@/components/charts/PassengerTypeChart.tsx';
import PassengerTrendChart from '@/components/charts/PassengerTrendChart.tsx';
import PassengerPieChart from '@/components/charts/PassengerPieChart.tsx';
import WorldMap from '@/components/map/WorldMap';
import { useEffect, useState } from 'react';

import geoData from '@/components/map/GeoChart.world.geo.json';
import { fetchHolidays, fetchPassengers } from '@/api';

const DashboardPage = () => {
    const [holidayData, setHolidayData] = useState<Holiday[]>([]);
    const [passengerData, setPassengerData] = useState<Passenger[]>([]);
    const [selectedYear, setSelectedYear] = useState(2017);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Dashboard';
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [holidays, passengers] = await Promise.all([
                    fetchHolidays(),
                    fetchPassengers(0, 40000),
                ]);
                console.log('Holidays data:', holidays);
                console.log('Passengers data:', passengers);
                setHolidayData(holidays || []);
                setPassengerData(passengers || []);
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data. Please try again later.');
                setHolidayData([]);
                setPassengerData([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="dashboard">
            {/* Graphs Section */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <HolidayTrendChart />
                <HolidayCountChart />
                <HolidayReasonsChart />
                <MonthlyPassengerChart />
                <PassengerTypeChart />
                <PassengerTrendChart />
                <PassengerPieChart data={passengerData} year={selectedYear} />
                <CountryPassengerChart />
                <div className="col-span-2">
                    <div className="flex gap-4 mb-4">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="p-2 rounded"
                        >
                            {[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <WorldMap
                        data={geoData as any}
                        passengerData={passengerData}
                        year={selectedYear}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
