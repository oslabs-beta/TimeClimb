import NavBar from './navbar/navBar.tsx'
import AllCard from './allCards.tsx'
import { selectUser } from '../reducers/userSlice.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../reducers/cardSlice.tsx';
import { AppDispatch } from '../../store.tsx';
import { useEffect } from 'react';


function LandingPage() {
    const username = useSelector(selectUser);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (username) {
            dispatch(fetchCards(username))
        }
    }, []);
    
    return (
        <div>
            <NavBar />
            <AllCard />
            This is the Landing Page
        </div>
    )
}

export default LandingPage;