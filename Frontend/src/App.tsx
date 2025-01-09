import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/layouts/Layout.tsx';
import DashboardPage from '@/pages/DashboardPage.tsx';
import DataManagerPage from '@/pages/DataManagerPage.tsx';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path={'/data-manager'} element={<DataManagerPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
