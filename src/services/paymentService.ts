import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const stkPush = async (phone: string, amount: number) => {
  try {
    const res = await axios.post(`${API}/stk`, {
      phone,
      amount,
    });

    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error ||
      error.message ||
      "Payment request failed"
    );
  }
};
