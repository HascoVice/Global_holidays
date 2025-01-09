import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const data = [
    { country: 'Aruba', public: 4, religious: 0, other: 0 },
    // Ajouter d'autres pays...
];

const HolidayChart = () => (
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
