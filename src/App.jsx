import BuyCredits from "./components/BuyCredits";

export default function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ECG Payment</h1>

        {/* 🔥 NEW COMPONENT */}
        <BuyCredits />
      </div>
    </div>
  );
}

// -------------------- STYLES --------------------
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
};
