import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    fetchHolidayData,
    fetchMoreHolidayData,
    setCountryFilter as setHolidayCountryFilter,
    clearCountryFilter as clearHolidayCountryFilter,
} from '@/slices/holidaySlice';
import {
    fetchPassengerData,
    fetchMorePassengerData,
    setCountryFilter as setPassengerCountryFilter,
    clearCountryFilter as clearPassengerCountryFilter,
} from '@/slices/passengerSlice';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const dispatch = useDispatch();

    const pageTitles: Record<string, string> = {
        '/': 'Dashboard',
        '/data-manager': 'Data Manager',
    };

    const currentPage = pageTitles[location.pathname] || 'Page Not Found';

    // Redux store data
    const holidayStatus = useSelector((state: RootState) => state.holidays.status);
    const passengerStatus = useSelector((state: RootState) => state.passengers.status);
    const hasMoreHolidays = useSelector((state: RootState) => state.holidays.hasMoreData);
    const hasMorePassengers = useSelector((state: RootState) => state.passengers.hasMoreData);
    const holidayCount = useSelector((state: RootState) => state.holidays.filteredData.length);
    const passengerCount = useSelector((state: RootState) => state.passengers.filteredData.length);

    const [isPageLoading, setIsPageLoading] = useState(false);
    const [countryFilter, setCountryFilter] = useState<string>('');

    const isHolidayLoadingStopped = !hasMoreHolidays;
    const isPassengerLoadingStopped = !hasMorePassengers;
    const isAutoLoadStopped = isHolidayLoadingStopped && isPassengerLoadingStopped;

    // Initial data load
    useEffect(() => {
        if (holidayStatus === 'idle') {
            dispatch(fetchHolidayData());
        }
        if (passengerStatus === 'idle') {
            dispatch(fetchPassengerData());
        }
    }, [dispatch, holidayStatus, passengerStatus]);

    // Automatically load more data every 5 seconds
    useEffect(() => {
        if (isAutoLoadStopped) return;

        const interval = setInterval(async () => {
            if (!isPageLoading) {
                setIsPageLoading(true);

                await Promise.all([
                    !isHolidayLoadingStopped && dispatch(fetchMoreHolidayData()),
                    !isPassengerLoadingStopped && dispatch(fetchMorePassengerData()),
                ]);

                setIsPageLoading(false);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [
        dispatch,
        isPageLoading,
        isHolidayLoadingStopped,
        isPassengerLoadingStopped,
        isAutoLoadStopped,
    ]);

    const handleLoadMore = async () => {
        setIsPageLoading(true);

        await Promise.all([
            !isHolidayLoadingStopped && dispatch(fetchMoreHolidayData()),
            !isPassengerLoadingStopped && dispatch(fetchMorePassengerData()),
        ]);

        setIsPageLoading(false);
    };

    const applyCountryFilter = () => {
        dispatch(setHolidayCountryFilter(countryFilter));
        dispatch(setPassengerCountryFilter(countryFilter));
    };

    const clearCountryFilter = () => {
        setCountryFilter('');
        dispatch(clearHolidayCountryFilter());
        dispatch(clearPassengerCountryFilter());
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-4 px-4">
                            <div className="text-sm text-gray-500">
                                <p>Holidays Loaded: {holidayCount}</p>
                                <p>Passengers Loaded: {passengerCount}</p>
                                {isAutoLoadStopped && (
                                    <p className="text-green-600">All data has been loaded.</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={countryFilter}
                                    onChange={(e) => setCountryFilter(e.target.value)}
                                    placeholder="Enter country code"
                                    className="w-40"
                                />
                                <Button
                                    onClick={applyCountryFilter}
                                    disabled={!countryFilter}
                                    variant="default"
                                >
                                    Apply Filter
                                </Button>
                                <Button
                                    onClick={clearCountryFilter}
                                    disabled={!countryFilter}
                                    variant="outline"
                                >
                                    Clear Filter
                                </Button>
                            </div>
                            <Button
                                disabled={isPageLoading || isAutoLoadStopped}
                                onClick={handleLoadMore}
                            >
                                {isPageLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More Data'
                                )}
                            </Button>
                        </div>
                    </header>
                    <div
                        className={`flex flex-1 flex-col gap-4 p-4 pt-0 ${
                            isPageLoading ? 'opacity-50' : ''
                        }`}
                    >
                        <Outlet />
                    </div>
                </>
            </SidebarInset>
        </SidebarProvider>
    );
}
