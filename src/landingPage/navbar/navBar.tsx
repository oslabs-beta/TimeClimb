import AboutPage from './aboutPage.tsx';
import ContactUs from './contactUs.tsx';
import HomeButton from './homeButton.tsx';
import Logout from './logout.tsx';

function NavBar() {
  return (
    <div>
      <HomeButton />
      <AboutPage />
      <ContactUs />
      <Logout />
      This is the Nav Bar
    </div>
  );
}

export default NavBar;
