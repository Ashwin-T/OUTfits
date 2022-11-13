import './weather.css';

import {TiWeatherCloudy} from 'react-icons/ti'
import {BiCloudRain} from 'react-icons/bi'
import {BsCloudSnow} from 'react-icons/bs'
import {BsSun} from 'react-icons/bs'
import {BsCloudDrizzle} from 'react-icons/bs'
import {TiWeatherStormy} from 'react-icons/ti'
import {BsCloudFog} from 'react-icons/bs'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Weather = ({weather, location}) => { 

  const kelvin = (k) => {
    if(celcius)
      return Math.round(k - 273.15);
    else
      return Math.round((k - 273.15) * 9/5 + 32);
  };

  const milesPerHour = (m) => {
    return Math.round(m*2.237);
  };
  
  const[tempLabel, setTempLabel] = useState("Change to Celcius")

  const[celcius, setCelcius] = useState(false)

  const [allowData, setAllowData] = useState(false)

  const [WeatherIcon, setWeatherIcon] = useState(<></>)

  function celciusAndFareinheit(e) {
    setTempLabel(celcius ? "Change to Celcius" : "Change to Fahrenheit")
    setCelcius(!celcius)
  }

  useEffect(() => {
    if(weather === null){
      setAllowData(false)
    }
    else{
      setAllowData(true)
      switch(weather.weather[0].main) {
        case "Clouds":
          setWeatherIcon(<TiWeatherCloudy size = {150}/>);
          break;
        case "Rain":
          setWeatherIcon(<BiCloudRain size = {150}/>);
          break;
        case "Snow":
          setWeatherIcon(<BsCloudSnow size = {150}/>);
          break;
        case "Drizzle":
          setWeatherIcon(<BsCloudDrizzle size = {150}/>);
          break;
        case "Thunderstorm":
          setWeatherIcon(<TiWeatherStormy size = {150}/>);
          break;
        case "Atmosphere":
          setWeatherIcon(<BsCloudFog size = {150}/>);
          break;
        case "Clear":
          setWeatherIcon(<BsSun size = {150}/>);
          break;
      }
    }
  }, [weather])

  return (
    <div className="weather">
      <button className='celciusButton' onClick={celciusAndFareinheit}>
        {tempLabel}
      </button>
      {
        allowData ? 
        <>
          <div className="main_box">
              {WeatherIcon}
              <h3 className = 'temp'> {kelvin(weather.main.temp)}°</h3>
              <h3 className='name'> {weather.name}</h3>
              <h5 className = 'description'> {weather.weather[0].description}</h5>
              <h5 className = 'highLow'> High: {kelvin(weather.main.temp_max)}° Low: {kelvin(weather.main.temp_min)}°</h5>
        </div>
        <div className="other_box">
          <div className="content-box">
              <h5 className = 'real_feel'>Feels Like</h5>
              <h3>{kelvin(weather.main.feels_like)}°</h3>
            </div>
            <div className="content-box">
                <h5 className = 'humidity'>Humidity</h5>
                <h3>{weather.main.humidity}%</h3>
            </div>
            <div className="content-box">
              <h5 className = 'wind_speed'>Wind Speed</h5>
              <h3>{milesPerHour(weather.wind.speed)} mph</h3>
            </div>
            <div className="content-box">
              <h5 className = 'pressure'>Pressure</h5>
              <h3>{Math.round(weather.main.pressure * 0.030)} inHg</h3>
            </div>
        </div>
          <button className='link-button'>
            <Link to = "/">
              Check if your outfit is ready for the weather!
            </Link>
          </button>
        </> 
        : 
        <>
          {/* Loader */}
        </> 
        
      }
    </div>
  );

}

export default Weather;