// import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch} from 'react-redux';
import { AppDispatch } from '../../store.tsx';
// import { fetchCards } from '../reducers/cardSlice.tsx';
import { card, deleteCard } from "../reducers/cardSlice"
import { useNavigate } from 'react-router-dom';

function FunctionCards({name, region, visual, view, remove}:card) {
    // const username = useSelector(selectUser);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const handleDelete = (name: string) => {
        dispatch(deleteCard(name))
    }

    // const handleView = (name :string) => {
    //     navigate(`detailedView/:name`, {state: {cardName: name}})
    // }
    function changeView(){
        navigate("/expandView")
    }

    return (
        <div className="functionCards">
            <div className="cardName">
                {name}
            </div>

            <div className="cardRegion">
                {region}
            </div>

            <div className="cardVisual"> 
                {visual} 
            </div>

            <button id="viewButton" onClick={changeView}>
                {view}
            </button>

            <button id = 'deleteButton' onClick={()=> handleDelete(name)}>
                {remove}
            </button>
        </div>
    )
}

export default FunctionCards;

