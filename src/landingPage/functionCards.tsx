// import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch} from 'react-redux';
import { AppDispatch } from '../../store.tsx';
// import { fetchCards } from '../reducers/cardSlice.tsx';
import { card, deleteCard } from "../reducers/cardSlice"


function FunctionCards({name, visual, view, remove}:card) {
    // const username = useSelector(selectUser);
    const dispatch: AppDispatch = useDispatch();

    const handleDelete = (name: string) => {
        dispatch(deleteCard(name))
    }

    return (
        <div className="functionCards">
            <div className="cardName">
                {name}
            </div>
            <div className="cardVisual"> 
                {visual} 
            </div>

            <button id="viewButton">
                {view}
            </button>

            <button id = 'deleteButton' onClick={()=> handleDelete(name)}>
                {remove}
            </button>
        </div>
    )
}

export default FunctionCards;