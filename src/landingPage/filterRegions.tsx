import { useDispatch} from "react-redux";
import { AppDispatch } from "../../store.tsx";
import { selectCard, setCardRegion } from '../reducers/cardSlice.tsx'
import { useSelector } from "react-redux";

function FilterRegions() {

    const card = useSelector(selectCard)
    const dispatch: AppDispatch = useDispatch()

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setCardRegion(e.target.value))
    }

    return(
        <div>
            <label htmlFor="region">Filter By Region</label>
            <select className="regions" value={card.currentRegion} onChange={handleChange}> 
                <option value=''>All</option>
                <option value='US'>US</option>
                <option value='us-east-1'>us-east-1</option>
            </select>
        </div>
    )
}

export default FilterRegions