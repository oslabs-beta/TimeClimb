import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx';

type accessKeyID = string;

export interface card {
    name: string,
    visual: string,
    view: string
    remove: string//dom.element or react.element?
}

interface cardState {
    allCards: card[],
    status: 'idle' | 'loading' | 'success' | 'failed',
    error: string | null
}

const initialState:cardState = {
    allCards: [
        { name: 'Card 1', visual: 'Flowchart 1', view: 'View', remove: 'Delete' },
        { name: 'Card 2', visual: 'Flowchart 2', view: 'View', remove: 'Delete' }
    ],
    status: 'idle',
    error: null,
}

export const fetchCards = createAsyncThunk(
    'cards/fetchingCards',
    async (accessKeyID: accessKeyID) => {
        const cards = await fetch(`/home/card/${accessKeyID}`, {
            headers: {"content-Type": "application/json"}
        })
        if (!cards.ok) {
            throw new Error('cannot fetch cards')
        }
        const homeCards = await cards.json();
        console.log(homeCards)
        return homeCards;
    }
)

export const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.pending, (state)=> {
                state.status = 'loading'
            })
            .addCase(fetchCards.fulfilled, (state, action)=> {
                state.status = 'success'
                state.allCards = action.payload
                console.log('fetchcards success', action.payload)
            })
            .addCase(fetchCards.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'failed to fetch cards'
            })
    }
 }
)

export const selectCard = (state:RootState) => state.card
export default cardSlice.reducer