// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import { useEffect } from "react";
import 'aos/dist/aos.css';


import Weather from "./components/Weather";
import CropRecommendation from "./components/CropRecommendation";
import Navbar from "./components/Navbar";
import MandiPrices from './components/MandiPrices';
import SarkariSchemes from "./pages/SarkariSchemes";
import KisaanNews from "./pages/KisaanNews";
import Contact from "./pages/Contact";
import Login from './components/Login';
import Register from './components/Register';

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Weather />} />
        <Route path="/recommend" element={<CropRecommendation />} />
        <Route path="/mandiPrices" element={<MandiPrices />} />
        <Route path="/schemes" element={<SarkariSchemes />} />
        <Route path="/news" element={<KisaanNews />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
