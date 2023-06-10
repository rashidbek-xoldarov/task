import "./App.css";

import { useEffect, useRef, useState } from "react";
import moment from "moment";

import useGetAll from "./hooks/useGetAll";

import loading from "./assets/images/loading.svg";
import airBalon from "./assets/images/air-ballon.png";
import sunny from "./assets/images/sunny.jpg";
import rain from "./assets/images/rain.jpg";
import cloudy from "./assets/images/cloudy.jpg";

function App() {
  const [city, setCity] = useState("andijon");
  const inputRef = useRef();
  const regions = [
    { title: "Andijan", id: 1 },
    { title: "Bukhara", id: 2 },
    { title: "Fergana", id: 3 },
    { title: "Jizzakh", id: 4 },
    { title: "Toshkent", id: 5 },
    { title: "Namangan", id: 6 },
    { title: "Navoiy", id: 7 },
    { title: "Qashqadaryo", id: 8 },
    { title: "Samarkand", id: 9 },
    { title: "Sirdaryo", id: 10 },
    { title: "Surxandaryo", id: 11 },
    { title: "Khiva", id: 12 },
  ];

  const { data, isLoading, isFetching, refetch } = useGetAll({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1103290dc7ddc44fe0752d04f883a253`,
    name: "weather",
    onError: (error) => {
      if (error?.response?.data?.message === "city not found") {
        alert("Siz izlagan nom boyicha shaxar topilmadi");
        setCity("Andijon");
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [city]);

  function defineTime(dt, zone) {
    let time = dt;
    // var timezone = 5 * 60 * 60;
    let timezone = zone;
    let timeInMillSecond = time * 1000;
    let date = new Date(timeInMillSecond + timezone);

    return moment(date).format("hh:mm - dddd, DD MMM");
  }
  let weatherType = data?.weather[0]?.main;
  return (
    <div className="container">
      <div className="weather-wrapper">
        {isLoading || isFetching ? (
          <div className="laoding">
            <img src={loading} alt="loading image" />
          </div>
        ) : data ? (
          <div className="weather-main">
            <div className="weather-left">
              <span className="weather-text">the.weather</span>
              <div className="weather-img-wrapper">
                <img
                  className="weather-img"
                  src={
                    weatherType === "Clear"
                      ? sunny
                      : weatherType === "Clouds"
                      ? cloudy
                      : weatherType === "Rain"
                      ? rain
                      : airBalon
                  }
                  alt="air balon image"
                  width={240}
                  height={275}
                />
              </div>
              <div className="weather-info">
                <span className="weather-degree">
                  {Math.round(data?.main?.temp)}
                  <sup className="weather-degree-sup">o</sup>
                </span>
                <div className="weather-city-wrapper">
                  <h3 className="weather-city">{data?.name}</h3>
                  <p className="weather-time">
                    {defineTime(data?.dt, data?.timezone)}
                  </p>
                </div>
                <div className="weather-state">
                  <img
                    src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                    alt="weather icon"
                    width={40}
                    height={40}
                  />
                  <span>{data?.weather[0].main}</span>
                </div>
              </div>
            </div>
            <div className="weather-right">
              <div className="weather-search">
                <form
                  className="weather-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCity(inputRef.current.value);
                  }}
                >
                  <input
                    className="weather-input"
                    ref={inputRef}
                    type="text"
                    placeholder="Another location"
                  />
                  <button className="weather-btn" type="submit"></button>
                </form>
                <ul className="regions-list">
                  {regions?.map((item) => {
                    return (
                      <li
                        className="region-item"
                        key={item?.id}
                        onClick={() => setCity(item?.title)}
                      >
                        {item?.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="weather-details">
                <h4 className="weather-detail-title">Weather details</h4>
                <ul className="weather-details-list">
                  <li className="weather-details-item">
                    Cloudy{" "}
                    <span className="weather-cloudy">{data?.clouds?.all}%</span>
                  </li>
                  <li className="weather-details-item">
                    Humidity{" "}
                    <span className="weather-humidity">
                      {data?.main?.humidity}%
                    </span>
                  </li>
                  <li className="weather-details-item">
                    Wind{" "}
                    <span className="weather-wind">
                      {Math.round(data?.wind?.speed)}m/s
                    </span>
                  </li>
                  <li className="weather-details-item">
                    Rain{" "}
                    <span className="weather-rain">
                      {data?.rain ? data?.rain["1h"] : 0}mm
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
