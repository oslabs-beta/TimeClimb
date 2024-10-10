import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx';

const initialState = {
    username: null,
    allCards: {},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload
        },
        
    }
})

export const {
    setUser
} = userSlice.actions;

export const selectUser = (state:RootState) => state.user.username
export default userSlice.reducer