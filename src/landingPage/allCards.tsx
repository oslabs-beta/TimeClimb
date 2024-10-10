import AddCard from './addCard.tsx'
import FunctionCards from './functionCards.tsx'
import { useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';


function AllCards() {

    const cards = useSelector((state: RootState)=> state.card.allCards)

    interface cardType {
        name: string
        chart: string
        view: string
        remove: string
    }

    const allCards = [];
      for (let i = 0; i < cards.length; i++) {
        const card: cardType = cards[i];
        const { name, chart, view ,remove} = card 
        allCards.push(<FunctionCards key={i} name={name} chart= {chart} remove ={remove} view ={view}/>);
      }

    return (
        <div className='allCards'>
            <AddCard />
            <div className='allFunctionCards'>{allCards}</div>
            This is the All Cards
        </div>
    )
}

export default AllCards;