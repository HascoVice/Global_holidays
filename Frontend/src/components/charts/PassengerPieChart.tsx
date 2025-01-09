import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
    { name: 'Domestic', value: 0 },
    { name: 'International', value: 2133.74 },
];

const COLORS = ['#0088FE', '#00C49F'];

const PassengerPieChart = () => (
    <PieChart width={400} height={400}>
        <Pie
            data={data}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
        >
            {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
    </PieChart>
);

export default PassengerPieChart;
