import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { year: 2010, holidays: 12 },
    { year: 2011, holidays: 15 },
    // Ajouter les données annuelles...
];

const HolidayTrend = () => (
    <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="holidays" stroke="#8884d8" />
    </LineChart>
);

export default HolidayTrend;
