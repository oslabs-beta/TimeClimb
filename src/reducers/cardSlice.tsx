import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

type Username = string;

const initialState = {
    allCards: [],

}

export const fetchCards = createAsyncThunk(
    'cards/fetchingCards',
    async (username: Username) => {
        const cards = await fetch(`/home/card/${username}`, {
            headers: {"content-Type": "application/json"}
        })
        if (!cards.ok) {
            throw new Error('cannot fetch cards')
        }
        const homeCards = await cards.json();
        return homeCards;
    }
)

export const cardSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        showCards: (state, action) => {

        }
    }
 }
)

export default cardSlice.reducer