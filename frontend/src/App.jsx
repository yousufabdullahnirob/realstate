import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProjectDetails from "./ProjectDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
        <Route path="/project-details" element={<ProjectDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
