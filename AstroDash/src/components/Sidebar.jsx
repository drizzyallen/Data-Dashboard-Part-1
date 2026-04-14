import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>AstroDash</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
      </ul>
    </div>
  );
}
