import AboutPage from './aboutPage.tsx';
import ContactUs from './contactUs.tsx';
import HomeButton from './homeButton.tsx';
import Logout from './logout.tsx';

function NavBar() {
  return (
    <div className='navBar'>
      <HomeButton />
      <AboutPage />
      <ContactUs />
      <Logout />
    </div>
  );
}

export default NavBar;
