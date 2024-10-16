import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store.tsx';

export interface card {
  name: string;
  region: string;
  visual: string;
  view: string;
  remove: string; //dom.element or react.element?
  // link?: string //how are we validating step functions when we are adding new function cards?
  definition: object;
}

interface cardState {
  allCards: card[];
  status: 'idle' | 'loading' | 'success' | 'failed';
  error: string | null;
  addCardform: boolean;
  currentLink: string;
  currentName: string;
  currentRegion: string;
}

const initialState: cardState = {
  allCards: [
    // {
    //   name: 'Card 1',
    //   region: 'US',
    //   visual: 'Flowchart 1',
    //   view: 'View',
    //   remove: 'Delete',
    // },
    // {
    //   name: 'Card 2',
    //   region: 'US',
    //   visual: 'Flowchart 2',
    //   view: 'View',
    //   remove: 'Delete',
    // },
  ],
  status: 'idle',
  error: '',
  addCardform: false,
  currentLink: '',
  currentName: '',
  currentRegion: '',
};

export const fetchCards = createAsyncThunk('cards/fetchingCards', async () => {
  const cards = await fetch(`/home/card`, {
    headers: { 'content-Type': 'application/json' },
  });
  if (!cards.ok) {
    throw new Error('cannot fetch cards');
  }
  const homeCards = await cards.json();
  // console.log(homeCards)
  return homeCards;
});

export const fetchFunc = createAsyncThunk(
  'cards/fetchFunc',
  async (link: string) => {
    const func = await fetch(`home/func/${link}`, {
      headers: { 'content-Type': 'application/json' },
    });
    if (!func.ok) {
      throw new Error('cannot fetch func');
    }
    const funcCard = await func.json();
    // console.log(funcCard)
    return funcCard;
  }
);

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setAddCardForm: (state) => {
      state.addCardform = true;
    },
    setAddCardFormFalse: (state) => {
      state.addCardform = false;
    },
    setCardLink: (state, action) => {
      state.currentLink = action.payload;
    },
    setCardName: (state, action) => {
      state.currentName = action.payload;
    },
    setCardRegion: (state, action) => {
      state.currentRegion = action.payload;
    },
    addCard: (state, action) => {
      const exists = state.allCards.some(
        (card) => card.name === state.currentName
      );
      if (exists) {
        state.error = 'name already exists';
        return;
      }
      const newCard: card = {
        name: action.payload.name,
        region: state.currentRegion,
        visual: 'chart',
        view: 'View',
        remove: 'delete',
        //link: state.currentLink
        definition: action.payload.definiton,
      };
      state.allCards.push(newCard);
      state.currentName = '';
      state.currentLink = '';
      state.error = '';
    },
    deleteCard: (state, action) => {
      state.allCards = state.allCards.filter(
        (card) => card.name !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'success';
        state.allCards = action.payload;
        console.log('fetchcards success', action.payload);
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'failed to fetch cards';
      });
  },
});

export const {
  setAddCardForm,
  setAddCardFormFalse,
  setCardLink,
  setCardName,
  addCard,
  deleteCard,
  setCardRegion,
} = cardSlice.actions;

export const selectCard = (state: RootState) => state.card;
export default cardSlice.reducer;
