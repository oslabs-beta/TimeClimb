// import { selectUser } from '../reducers/userSlice.tsx';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch } from '../../store.tsx';
// import { fetchCards } from '../reducers/cardSlice.tsx';

interface props {
    name: string
    chart: string
    view: string
    remove: string
}

function FunctionCards({name, chart, view, remove}:props) {
    // const username = useSelector(selectUser);
    // const dispatch: AppDispatch = useDispatch();

    return (
        <div className="functionCards">
            <div>
                'Name of function' {name}
            </div>
            <div> 
                Visualization flow chart {chart} 
            </div>

            <button>
                View {view}
            </button>

            <button id = 'deletebutton'>
                Remove {remove}
            </button>
        </div>
    )
}

export default FunctionCards;