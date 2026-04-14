import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ReleaseYearChart({ data }) {
  if (!data || data.length === 0) return null;

  const yearCounts = {};
  data.forEach((movie) => {
    const year = movie.releaseDate?.year;
    if (year) {
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    }
  });

  const chartData = Object.keys(yearCounts).map(year => ({
    name: year,
    count: yearCounts[year]
  })).sort((a, b) => Number(a.name) - Number(b.name));

  return (
    <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
      <h3>Releases per Year</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
