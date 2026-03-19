import { useState } from "react";
import { stkPush } from "../services/paymentService";

export default function BuyCredits() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhone = (input) => {
    let p = input.trim();

    if (p.startsWith("0")) return "254" + p.slice(1);
    if (p.startsWith("+254")) return p.slice(1);
    if (!p.startsWith("254")) return "254" + p;

    return p;
  };

  const pay = async () => {
    setMessage("");

    const formattedPhone = formatPhone(phone);

    if (!formattedPhone.match(/^254(7|1)\d{8}$/)) {
      return setMessage("❌ Enter valid phone (0712345678)");
    }

    if (amount < 10) {
      return setMessage("❌ Minimum amount is 10");
    }

    try {
      setLoading(true);

      await stkPush(formattedPhone, amount);

      setMessage("✅ STK sent! Check your phone");
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ECG Payment</h1>

        <input
          style={styles.input}
          placeholder="0712345678"
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
