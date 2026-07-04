import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend Offline"));
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial",
        background: "#111",
        color: "white",
        fontSize: "2rem",
      }}
    >
      {message}
    </div>
  );
}

export default App;