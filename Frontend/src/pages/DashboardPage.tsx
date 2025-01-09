import HolidayChart from '@/components/charts/HolidayChart.tsx';
import HolidayTrend from '@/components/charts/HolidayTrend.tsx';
import PassengerPieChart from '@/components/charts/PassengerPieChart.tsx';
import PassengerTrend from '@/components/charts/PassengerTrend.tsx';
import { useEffect, useState } from 'react';
import { fetchHolidays } from '@/api';
import Holiday from '@/types/Holiday.ts';

const DashboardPage = () => {
    const [holidayData, setHolidayData] = useState<Holiday[]>([]);

    useEffect(() => {
        document.title = 'Dashboard';

        //fetchHolidays().then((data) => setHolidayData(data));
    }, []);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <HolidayChart data={holidayData} />
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
