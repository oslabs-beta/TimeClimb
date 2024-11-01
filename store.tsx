import { configureStore, /*combineReducers*/ } from "@reduxjs/toolkit";
import userReducer from './src/reducers/userSlice';
import cardReducer from "./src/reducers/cardSlice";
import dataReducer from "./src/reducers/dataSlice";
// import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage';

// const persistConfig = {
//     key: 'root',
//     storage,
//   };

// const rootReducer = combineReducers({
//     user: userReducer,
//     card: cardReducer,
//     data: dataReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: {
        user: userReducer,
        card: cardReducer,
        data: dataReducer,
    }
    // reducer: persistedReducer,
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch

// export const persistor = persistStore(store);
export default store