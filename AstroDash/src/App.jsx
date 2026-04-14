import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DetailView from './pages/DetailView';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/series/:id" element={<DetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
