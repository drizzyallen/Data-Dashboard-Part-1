import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ReleaseMonthChart({ data }) {
  if (!data || data.length === 0) return null;

  const monthCounts = {};
  data.forEach((movie) => {
    const month = movie.releaseDate?.month;
    if (month && month >= 1 && month <= 12) {
      const monthName = MONTHS[month - 1];
      monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
    }
  });

  const chartData = MONTHS.map(m => ({
    name: m,
    count: monthCounts[m] || 0
  }));

  return (
    <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
      <h3>Releases per Month</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
