// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./components/Weather";
import CropRecommendation from "./components/CropRecommendation";
import Navbar from "./components/Navbar";
import MandiPrices from './components/MandiPrices';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/recommend" element={<CropRecommendation />} />
        <Route path="/mandiPrices" element={<MandiPrices />} />
      </Routes>
    </Router>
  );
}

export default App;
