import HolidayChart from '@/components/charts/HolidayChart.tsx';
import HolidayTrend from '@/components/charts/HolidayTrend.tsx';
import PassengerPieChart from '@/components/charts/PassengerPieChart.tsx';
import PassengerTrend from '@/components/charts/PassengerTrend.tsx';
import { useEffect } from 'react';
import { fetchHolidays } from '@/api';

const DashboardPage = () => {
    useEffect(() => {
        document.title = 'Dashboard';

        const HolidayData = fetchHolidays();
        console.log(HolidayData);
    });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <HolidayChart />
                <HolidayTrend />
                <PassengerPieChart />
            </div>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <PassengerTrend />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
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
