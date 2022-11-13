import {BiAddToQueue} from 'react-icons/bi'
import {GrGallery} from 'react-icons/gr'
import {TiWeatherStormy} from 'react-icons/ti'
import { Link } from 'react-router-dom'
const MobileNav = () => {

  return (
    <nav className="mobile-nav">
      <Link to="/weather"><TiWeatherStormy size = {40} className="mobile-nav__icon"/></Link>
      <Link to="/"><BiAddToQueue size = {40} className="mobile-nav__icon"/></Link>
      <Link to="/gallery"><GrGallery size = {40} className="mobile-nav__icon"/></Link>
    </nav>  
  )
}

export default MobileNav