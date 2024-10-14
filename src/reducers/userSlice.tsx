import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx';

const initialState = {
    accessKeyID: '',
    secretAccessKey: '',
    region: 'Select one',
    allCards: {},
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAccessKeyID: (state, action) => {
            state.accessKeyID = action.payload
        },
        setSecretAccessKey: (state, action) => {
            state.secretAccessKey = action.payload
        },
        setRegion: (state, action) => {
            state.region = action.payload
        }
    }
})

export const {
    setAccessKeyID,
    setSecretAccessKey,
    setRegion
} = userSlice.actions;

export const selectUser = (state:RootState) => state.user
export default userSlice.reducer