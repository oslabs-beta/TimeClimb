import { configureStore } from "@reduxjs/toolkit";
import userReducer from './src/reducers/userSlice';
import cardReducer from "./src/reducers/cardSlice";


const store = configureStore({
    reducer: {
        user: userReducer,
        card: cardReducer, 
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch

export default store