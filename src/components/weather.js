import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Icon,
  CircularProgress,
} from "@mui/material";
import rain from "../assets/images/rain.png";
import wind from "../assets/images/wind.png";
import humidityImg from "../assets/images/humidity.png";
import clear from "../assets/images/clear.png";
import clouds from "../assets/images/clouds.png";
import drizzle from "../assets/images/drizzle.png";
import snow from "../assets/images/snow.png";
import mist from "../assets/images/mist.png";
import data from "./data.json";

const WeatherCard = () => {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [pressure, setPressure] = useState("");
  const [feelLike, setFeelLike] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiKey = "f0b9fd4348dbabdc9f95961822e4e4eb";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
  const weatherIconRef = useRef(null);

  useEffect(() => {
    setStates(data.states);
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    setSelectedState(selectedStateName);
    setSelectedDistrict("");
    setDistricts([]);

    if (selectedStateName) {
      const selectedStateData = data.states.find(
        (state) => state.state === selectedStateName
      );
      setDistricts(selectedStateData ? selectedStateData.districts : []);
    }
    setErrorMessage("");
  };

  const handleDistrictChange = async (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    setLoading(true);
    setErrorMessage("");
    setTemperature("");
    setFeelLike("");
    setHumidity("");
    setWindSpeed("");
    setPressure("");

    await fetchWeather(district);
    setLoading(false);
  };

  const fetchWeather = async (location) => {
    try {
      const response = await fetch(`${apiUrl}${location}&appid=${apiKey}`);
      if (!response.ok) {
        setErrorMessage("Location not found");
        return;
      }
      const data = await response.json();
      setTemperature(`${Math.round(data.main.temp)}°C`);
      setFeelLike(`${Math.round(data.main.feels_like)}°C`);
      setHumidity(`${data.main.humidity}%`);
      setWindSpeed(`${data.wind.speed} km/h`);
      setPressure(`${data.main.pressure} hPa`);

      if (weatherIconRef.current) {
        switch (data.weather[0].main) {
          case "Clouds":
            weatherIconRef.current.src = clouds;
            break;
          case "Rain":
            weatherIconRef.current.src = rain;
            break;
          case "Clear":
            weatherIconRef.current.src = clear;
            break;
          case "Drizzle":
            weatherIconRef.current.src = drizzle;
            break;
          case "Mist":
            weatherIconRef.current.src = mist;
            break;
          default:
            weatherIconRef.current.src = clear;
            break;
        }
      }
    } catch (error) {
      setErrorMessage("Error fetching weather");
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: "auto", mt: 4 }}>
      <CardContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="state-select-label">Select State</InputLabel>
          <Select
            labelId="state-select-label"
            id="state-select"
            value={selectedState}
            label="Select State"
            onChange={handleStateChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {states.map((state) => (
              <MenuItem key={state.state} value={state.state}>
                {state.state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth disabled={!selectedState} sx={{ mb: 2 }}>
          <InputLabel id="district-select-label">Select District</InputLabel>
          <Select
            labelId="district-select-label"
            id="district-select"
            value={selectedDistrict}
            label="Select District"
            onChange={handleDistrictChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {districts.map((district, index) => (
              <MenuItem key={index} value={district}>
                {district}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : errorMessage ? (
          <Typography variant="body2" sx={{ color: "red" }}>
            {errorMessage}
          </Typography>
        ) : (
          <>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <CardMedia
                component="img"
                image={rain}
                alt="Weather Icon"
                ref={weatherIconRef}
                sx={{ width: 100, height: 100 }}
              />
              <Typography variant="h3" component="div">
                {temperature}
              </Typography>
              <Typography variant="h5" component="div">
                {selectedDistrict}
              </Typography>
              <Typography variant="body1" component="div">
                Today - {currentDate}
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Icon>
                    <img src={humidityImg} alt="Humidity Icon" />
                  </Icon>
                  <Box ml={1}>
                    <Typography variant="body2">{humidity}</Typography>
                    <Typography variant="caption">Humidity</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Icon>
                    <img src={wind} alt="Wind Icon" />
                  </Icon>
                  <Box ml={1}>
                    <Typography variant="body2">{windSpeed}</Typography>
                    <Typography variant="caption">Wind Speed</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Icon>
                    <img src={humidityImg} alt="Feel Like Icon" />
                  </Icon>
                  <Box ml={1}>
                    <Typography variant="body2">{feelLike}</Typography>
                    <Typography variant="caption">Feel Like</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">{pressure}</Typography>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Pressure
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
