import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Holiday from '@/types/Holiday.ts';

type Props = {
    data: Holiday[];
};

const HolidayChart = ({ data }: Props) => (
    <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="country" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="public" stackId="a" fill="#8884d8" />
        <Bar dataKey="religious" stackId="a" fill="#82ca9d" />
        <Bar dataKey="other" stackId="a" fill="#ffc658" />
    </BarChart>
);

export default HolidayChart;
