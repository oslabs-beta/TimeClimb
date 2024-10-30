// import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store.tsx';
// import { fetchCards } from '../reducers/cardSlice.tsx';
import { card, deleteCard } from '../reducers/cardSlice';
import { useNavigate } from 'react-router-dom';
import FlowChartView from '../DetailedView/FlowChartView.tsx';
import { setDefinitionID, setStepFunction } from '../reducers/dataSlice.tsx';

function FunctionCards({
  name,
  region,
  visual,
  view,
  remove,
  definition,
  id,
}: card) {
  // const username = useSelecor(selectUser);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  //console.log(definition);

  const handleDelete = (name: string) => {
    dispatch(deleteCard(name));
  };

  const handleView = (name: string) => {
    navigate(`/expandView`, { state: { cardName: name } });
    dispatch(setStepFunction(definition));
    dispatch(setDefinitionID(id));
  };
  // function changeView() {
  //     navigate("/expandView")
  // }

  return (
    <div className='hover:opacity-100  opacity-90 p-3 size-100 bg-gradient-to-br from-purple-600 to-fuchsia-400 rounded-3xl flex flex-col items-center'>
      <div className=''>{name}</div>

      <div className=''>{region}</div>

      <div className=''>
        {visual} <FlowChartView size='size-80' definition={definition} />
      </div>

      <button
        className='inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 my-6'
        id='viewButton'
        onClick={() => handleView(name)}
      >
        {view}
      </button>

      {/* <button id='deleteButton' onClick={() => handleDelete(name)}>
        {remove}
      </button> */}
    </div>
  );
}

export default FunctionCards;
