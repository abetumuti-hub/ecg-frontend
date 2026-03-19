import { useState } from "react";

export default function App() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setMessage("");

    if (!phone.startsWith("254") || phone.length !== 12) {
      return setMessage("❌ Enter valid phone (2547XXXXXXXX)");
    }

    if (amount < 10) {
      return setMessage("❌ Minimum amount is 10");
    }

    try {
      setLoading(true);

      const res = await fetch(
        import.meta.env.VITE_API_URL + "/stk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, amount }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ STK sent! Check your phone");
      } else {
        setMessage("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ECG Payment</h1>

        <input
          style={styles.input}
          placeholder="2547XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <button style={styles.button} onClick={pay} disabled={loading}>
          {loading ? "Processing..." : "Pay via STK"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
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
    width: "300px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  message: {
    marginTop: "15px",
    fontSize: "14px",
  },
};
