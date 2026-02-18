import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) => {
        if (response.ok) {
          return "Connected to Backend Successfully!";
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => setMessage(data))
      .catch((error) =>
        setMessage("Error linking to backend: " + error.message),
      );
  }, []);

  return (
    <>
      <h1>Frontend + Backend</h1>
      <div className="card">
        <p>
          Backend Status: <strong>{message}</strong>
        </p>
      </div>
    </>
  );
}

export default App;
