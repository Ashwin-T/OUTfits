import {Routes, Route} from 'react-router-dom'
import Weather from './Weather/Weather'
import Analyze from './Analyze/Analyze'
import Gallery from './Gallery/Gallery'

import Navbar from '../components/Navbar/Navbar'

const AppRoutes = ({weather, location}) => {
  return (
    <>
      <Routes>
        <Route path="/weather" element={<Weather weather={weather} location = {location} />} />
        <Route path="/" element={<Analyze weather = {weather} />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
      <Navbar />
    </>
    )
}

export default AppRoutes;