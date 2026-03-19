export async function initiateSTK(phone: string, amount: number) {
  try {
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

    if (!res.ok) {
      throw new Error(data.error || "Payment failed");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Network error");
  }
}
