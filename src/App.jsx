// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./components/Weather";
import CropRecommendation from "./components/CropRecommendation";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/recommend" element={<CropRecommendation />} />
      </Routes>
    </Router>
  );
}

export default App;
