import axios from "axios";

const BASE_URL = "https://api.weatherapi.com/v1/";
const APP_KEY = "3b5201d3438444218de140545241802";

const forecastUrl = (params) =>
  `${BASE_URL}forecast.json?key=${APP_KEY}&q=${params.cityName}&days=${params.days}&api=no&alerts=no`;
const locationUrl = (params) =>
  `${BASE_URL}search.json?key=${APP_KEY}&q=${params.cityName}`;

const apiCall = async (URL) => {
  const options = {
    method: "GET",
    url: URL,
  };

  try {
    const res = await axios.request(options);
    return res.data;
  } catch (err) {
    console.log("err =>", err);
    return null;
  }
};

export const fetchWeatherForecast = (params) => {
  return apiCall(forecastUrl(params));
};

export const fetchLocations = (params) => {
  return apiCall(locationUrl(params));
};
