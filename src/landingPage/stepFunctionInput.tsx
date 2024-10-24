import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store.tsx';
import {
  setAddCardFormFalse,
  setCardName,
  addCard,
  setCardRegion,
} from '../reducers/cardSlice';
import { selectCard } from '../reducers/cardSlice.tsx';
import { useSelector } from 'react-redux';
import { addStepFunction, appendStepFunction } from '../reducers/dataSlice.tsx';
// import { card } from "../reducers/cardSlice";
// import { fetchFunc } from "../reducers/cardSlice";
// import { setCardLink } from "../reducers/cardSlice"

function StepFunctionInput() {
  const dispatch: AppDispatch = useDispatch();
  const card = useSelector(selectCard);
  // const { addCardform } = useSelector(selectCard)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const link = (form.elements.namedItem('link') as HTMLInputElement).value;
    const region = link.split(':states:')[1].split(':')[0];
    // dispatch(setCardLink(link))
    dispatch(setCardName(name));
    // dispatch(fetchFunc(link))// not sure how we are verifying or getting info yet

    dispatch(setCardRegion(region));

    //dispatch(addCard());

    dispatch(addStepFunction(link))
      .unwrap()
      .then((data) => dispatch(appendStepFunction(data)));

    if (!card.error) {
      dispatch(setAddCardFormFalse());
    }
  };

  const handleClose = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setAddCardFormFalse());
  };

  return (
    <div className='stepFunc' style={{color: "black"}}>
      <form name={'form'} onSubmit={handleSubmit}>
        <label htmlFor='name'> Name of Function</label>
        <input
          className='name'
          name='name'
          type='text'
          defaultValue={card.currentName}
        />
        <label htmlFor='stepFunc'>Step Function ARN Link</label>
        <input
          className='name'
          name='link'
          type='text'
          defaultValue={card.currentLink}
        />

        {card.error && <p className='error'>{card.error}</p>}

        <div className='stepFuncButtons'>
          <button onClick={handleClose}>Close</button>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default StepFunctionInput;
