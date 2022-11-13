import { useEffect, useState } from "react"
import Login from "./pages/Login/Login"
import AppRoutes from "./pages/AppRoutes"

import {app} from './Firebase'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "./Components/Loading/Loading"

const App = () => {
  const auth = getAuth(app)

  const [weaterData, setWeaterData] = useState(null)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [location, setLocation] = useState({
    lat: 0,
    lon: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true)
        setLoading(false)
      } else {
        setIsUserLoggedIn(false)
        setLoading(false)

      }
    })
  }, [])

  useEffect(() => {
    //here
    const getLocation = () => {
      if (!navigator.geolocation) {
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lon: longitude
          })
        }, () => {
        });
      }

    }

    getLocation()

  }, [])

  useEffect(() => {
    if(location.lat !== 0 && location.lon !== 0){
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=88d2efcaea28f04722ae5374cd196f84`)
      .then(response => response.json())
      .then(data => {
        setWeaterData(data)
      })
    }
  }, [location])

  return (
    <>
      {
        loading ? <Loading /> : isUserLoggedIn ? <AppRoutes weather = {weaterData} location = {location} /> : <Login setIsUserLoggedIn = {setIsUserLoggedIn}/>
      }
    </>
  )
}

export default App
