import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx'

interface dataState {
    latency: string[];
}

const initialState: dataState ={
    latency: []
}

export const dataSlice = createSlice({
    name: 'data', initialState,
    reducers:{
        setLatency: (state, action)=>{
            state.latency = action.payload;
        }
    }
})

export const {
    setLatency
} = dataSlice.actions;

export const selectData =  (state: RootState) => {state.data};

export default dataSlice.reducer;