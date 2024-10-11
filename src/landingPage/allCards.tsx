import FunctionCards from './functionCards.tsx'
import { RootState } from '../../store.tsx';
import { card, selectCard } from '../reducers/cardSlice.tsx'
import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../reducers/cardSlice.tsx';
import { AppDispatch } from '../../store.tsx';
import { useEffect } from 'react';




function AllCards() {

    const cards = useSelector((state: RootState)=> state.card.allCards) as card[];
    // console.log('card', cards)

    const user = useSelector(selectUser);
    const card = useSelector(selectCard);
    const dispatch: AppDispatch = useDispatch();

    //not sure how we are continually fetching data yet
    //this gives 'Unexpected token '<', "<!doctype "... is not valid JSON' error
    useEffect(() => {
        if (user && card.status === 'idle') {
            dispatch(fetchCards())
        }
    }, []);

    return (
      <div className='allFunctionCards'>
        {cards.map((card, index) => {
          // console.log('card info', card);
          return(
            <FunctionCards 
            key={index} 
            name={card.name} 
            visual={card.visual} 
            remove= {card.remove} 
            view= {card.view}/>
            )
          }
        )}  
      </div>
    )
}

export default AllCards;