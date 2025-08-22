import {createSlice} from "@reduxjs/toolkit"
import {toast} from "react-hot-toast"

const initialState = {
    cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
    totalItems: localStorage.getItem("totalItem")
    ? JSON.parse(localStorage.getItem("totalItems"))
     : 0
};

const cartSlice = createSlice({
    name:"cart",
    initialState: initialState,
    reducers:{
        setTotalItems(state,value) {
            state.totalItems = value.payload;
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        },
        //add to cart function
        addToCart(state,value) {
            state.cartItems.push(value.payload);
            state.totalItems = state.cartItems.length;
            //local storage
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

            toast.success("Item added to cart!");

        },
        //remove from cart
        removeFromCart(state, value) {
            // value.payload should be the item's id
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== value.payload
            );
            state.totalItems = state.cartItems.length;

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

            toast.error("Item removed from cart");
        },
        //reset cart function
        resetCart(state) {
            state.cartItems = [];
            state.totalItems = 0;

            localStorage.removeItem("cartItems");
            localStorage.removeItem("totalItems");

            toast("Cart cleared");
        },
}
});

export const {setTotalItems} = cartSlice.actions;
export default cartSlice.reducer;