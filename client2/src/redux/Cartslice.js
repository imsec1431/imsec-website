import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [], // ✅ Ensure cart is an array
  reducers: {
    add: (state, action) => {
      state.push(action.payload); // ✅ Adds item to the cart
    },
    remove: (state, action) => {
      return state.filter((item) => item._id !== action.payload);
    },
    clearCart: () => {
      localStorage.removeItem("persist:root"); // Clear localStorage on logout
      return [];
    },
  },
});

export const { add, remove, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
