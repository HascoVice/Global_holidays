import React from 'react';

import HolidayCountChart from '@/components/charts/HolidayCountChart.tsx';
import HolidayReasonsChart from '@/components/charts/HolidayReasonsChart.tsx';
import CountryPassengerChart from '@/components/charts/CountryPassengerChart.tsx';
import MonthlyPassengerChart from '@/components/charts/MonthlyPassengerChart.tsx';
import HolidayTrend from '@/components/charts/HolidayTrendChart.tsx';
import PassengerTypeChart from '@/components/charts/PassengerTypeChart.tsx';
import PassengerTrendChart from '@/components/charts/PassengerTrendChart.tsx';
import PassengerPieChart from '@/components/charts/PassengerPieChart.tsx';

const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard">
            {/* Graphs Section */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <HolidayTrend />
                <HolidayCountChart />
                <HolidayReasonsChart />
                <MonthlyPassengerChart />
                <PassengerTypeChart />
                <PassengerTrendChart />
                <PassengerPieChart />
                <CountryPassengerChart />
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    );
};

export default DashboardPage;
