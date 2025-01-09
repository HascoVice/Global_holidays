import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { month: 'Jan', passengers: 2133.74 },
    { month: 'Feb', passengers: 2133.74 },
    // Ajouter les données pour d'autres mois...
];

const PassengerTrend = () => (
    <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="passengers" stroke="#82ca9d" />
    </LineChart>
);

export default PassengerTrend;
