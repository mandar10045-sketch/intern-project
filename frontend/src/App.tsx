import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertiesPage from './components/PropertiesPage';
import PropertyDetails from './components/PropertyDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PropertiesPage />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
