import StepFunctionInput from "./stepFunctionInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store.tsx";
import { setAddCardForm } from "../reducers/cardSlice"
import { selectCard } from '../reducers/cardSlice.tsx'


function AddCard() {
    const dispatch:AppDispatch = useDispatch()
    const card = useSelector(selectCard)

    const handleClick = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(setAddCardForm())
    }

    return (
        <div className="addCard">
            <button className="add" onClick={handleClick}>
                Add Function
            </button>

            {card.addCardform && <StepFunctionInput/>}
        </div>
    )
}




export default AddCard;