import { useState } from "react";

export default function App() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(100);
  const [message, setMessage] = useState("");

  async function pay() {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/stk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ STK sent! Check your phone");
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ Failed to connect to server");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>ECG Payment</h1>

      <input
        placeholder="2547XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <br /><br />

      <button onClick={pay}>Pay via STK</button>

      <p>{message}</p>
    </div>
  );
}
