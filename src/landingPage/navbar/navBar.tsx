import AboutPage from './aboutPage.tsx';
import ContactUs from './contactUs.tsx';
import HomeButton from './homeButton.tsx';
import Logout from './logout.tsx';
//import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <div className='navBar'>
        {/* <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/expandView" >graph</Link></li>
          </ul> */}
        <HomeButton />
        <AboutPage />
        <ContactUs />
        <Logout />
      </div>
  </>
  );
}

export default NavBar;
