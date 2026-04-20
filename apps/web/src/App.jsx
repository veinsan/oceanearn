import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-ocean-900">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-3">[OCEANEARN]</h1>
                <p className="text-ocean-100 text-lg">Maritime Waste Reward System</p>
                <p className="text-ocean-400 text-sm mt-4">React + Vite + Tailwind OK</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
