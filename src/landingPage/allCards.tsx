import FunctionCards from './functionCards.tsx';
import { RootState } from '../../store.tsx';
import { addCard, card, selectCard } from '../reducers/cardSlice.tsx';
// import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../reducers/cardSlice.tsx';
import { AppDispatch } from '../../store.tsx';
import { useEffect } from 'react';
import { getStepFunctions } from '../reducers/dataSlice.tsx';
import { getStepFunctionList } from '../reducers/dataSlice.tsx';
// console.log('from all cards');
// console.log(data);
// const data = useSelector(getStepFunctions);

function AllCards() {
  
  const cards = useSelector(
    (state: RootState) => state.card.allCards
  ) as card[];
  const stepFunctionList = useSelector(
    (state: RootState) => state.data.stepfunctions
  );


  // const user = useSelector(selectUser);
  const card = useSelector(selectCard);
  const dispatch: AppDispatch = useDispatch();


  const stepfunctions = useSelector(
    (state: RootState) => state.data.stepfunctions
  );

  // Fetch step functions when component mounts
  useEffect(() => {
    dispatch(getStepFunctionList());
  }, [dispatch]);

  // Log descriptions of each step function
  useEffect(() => {
    if (!stepfunctions) return;
    stepfunctions.forEach((sf) => {
      // Adjust 'description' based on your actual data
      dispatch(addCard(sf));
    });
  }, [stepfunctions]);
  //end

  ('');

  //not sure how we are continually fetching data yet
  //this gives 'Unexpected token '<', "<!doctype "... is not valid JSON' error
  useEffect(() => {
    if (card.status === 'idle') {
      dispatch(fetchCards());
    }
  }, [card.allCards.length, dispatch, card.status]);

  let filteredCards = [];

  // if (card.currentRegion) {
  //   filteredCards = cards.filter((c) => c.region === card.currentRegion);
  // } else filteredCards = cards;

  // console.log('filteredcards: ', filteredCards);

  // console.log('filter', filteredCards)
  //if (filteredCards.length > 0) console.log(filteredCards);

  return (
    <div className='grid grid-cols-2 gap-x-20 gap-y-20 h-fit'>
      {cards.map((card, index) => (
        <FunctionCards
          key={index}
          name={card.name}
          region={card.region}
          visual={card.visual}
          remove={card.remove}
          view={card.view}
          definition={card.definition}
          id={index + 1}
        />
      ))}
    </div>
  );
}

export default AllCards;
