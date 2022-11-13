import './navbar.css';
import { useState, useEffect } from 'react';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';

const Navbar = () => {

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return (
    <>
      {width < 768 ? <MobileNav /> : <DesktopNav />}
    </>
  )
}

export default Navbar;