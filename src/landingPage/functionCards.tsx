// import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store.tsx';
// import { fetchCards } from '../reducers/cardSlice.tsx';
import { card, deleteCard } from '../reducers/cardSlice';
import { useNavigate } from 'react-router-dom';
import FlowChartView from '../DetailedView/FlowChartView.tsx';
import { setStepFunction } from '../reducers/dataSlice.tsx';

function FunctionCards({
  name,
  region,
  visual,
  view,
  remove,
  definition,
}: card) {
  // const username = useSelector(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (name: string) => {
    dispatch(deleteCard(name));
  };

  const handleView = (name: string) => {
    navigate(`/expandView`, { state: { cardName: name } });
    dispatch(setStepFunction(definition));
    console.log(definition);
  };
  // function changeView(){
  //     navigate("/expandView")
  // }

  return (
    <div className='functionCards'>
      <div className='cardName'>{name}</div>

      <div className='cardRegion'>{region}</div>

      <div className='cardVisual'>
        {visual}{' '}
        <FlowChartView height={200} width={200} definition={definition} />
      </div>

      <button id='viewButton' onClick={() => handleView(name)}>
        {view}
      </button>

      <button id='deleteButton' onClick={() => handleDelete(name)}>
        {remove}
      </button>
    </div>
  );
}

export default FunctionCards;
