import AboutPage from './aboutPage.tsx';
import ContactUs from './contactUs.tsx';
import HomeButton from './homeButton.tsx';
import Logout from './logOut.tsx'; //need to fix



function NavBar() {
    return (
        <div>
            <HomeButton />
            <AboutPage />
            <ContactUs />
            <Logout />
            This is the Nav Bar
        </div>
    )
}

export default NavBar;