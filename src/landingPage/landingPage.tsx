import NavBar from './navbar/navBar.tsx'
import AllCard from './allCards.tsx'
import AddCard from './addCard.tsx';
// import StepFunctionInput from "./stepFunctionInput";

function LandingPage() {

    return (
        <div className='landingPage'>
            <NavBar />
            <AddCard /> 
            {/* <StepFunctionInput /> */}
            <AllCard />
            This is the Landing Page
        </div>
    )
}

export default LandingPage;