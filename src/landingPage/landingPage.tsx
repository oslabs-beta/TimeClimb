import NavBar from './navbar/navBar.tsx'
import AllCard from './allCards.tsx'
import AddCard from './addCard.tsx';


function LandingPage() {

    return (
        <div className='landingPage'>
            <NavBar />
            <AddCard /> 
            <AllCard />
            This is the Landing Page
        </div>
    )
}

export default LandingPage;