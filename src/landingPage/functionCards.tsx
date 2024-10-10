// import { selectUser } from '../reducers/userSlice.tsx';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../../store.tsx';
// import { fetchCards } from '../reducers/cardSlice.tsx';
import { card } from "../reducers/cardSlice"

function FunctionCards({name, visual, view, remove}:card) {
    // const username = useSelector(selectUser);
    // const dispatch: AppDispatch = useDispatch();

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

            <button id = 'deleteButton'>
                {remove}
            </button>
        </div>
    )
}

export default FunctionCards;