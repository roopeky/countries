import axios from "axios";
import { useState, useEffect } from "react";

const CountryDetails = ({ country }) => {
  const [temperature, setTemperature] = useState(0);
  const [wind, setWind] = useState(0);
  const [icon, setIcon] = useState("");

  const api_key = process.env.REACT_APP_API_KEY;

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}`
    )
    .then((response) => {
      console.log(response.data);
      setTemperature(Math.round(response.data.main.temp * 10) / 10 - 273.15);
      setWind(response.data.wind.speed);
      setIcon(response.data.weather[0].icon);
    });

  return (
    <>
      <h1>{country.name}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <div>
        <img src={country.flags.png} alt={`${country.name} flag`} />
      </div>
      <h2>Weather in {country.capital[0]}</h2>
      <div>temperature {temperature} Celsius</div>
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="" />
      <div>wind {wind} m/s</div>
    </>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [showCountry, setShowCountry] = useState({});

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) =>
      setCountries(
        response.data.map(({ name, capital, area, languages, flags }) => ({
          name: name.common,
          capital,
          area,
          languages,
          flags,
        }))
      )
    );
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(query)
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    setShowCountry({});
  };

  const handleShow = (name) => () =>
    setShowCountry(
      filteredCountries.filter((country) => country.name.includes(name))[0]
    );

  return (
    <div>
      <p>
        find countries <input value={query} onChange={handleChange} />
      </p>
      {filteredCountries.length > 10 && (
        <div>Too many matches, specify another filter</div>
      )}
      {filteredCountries.length <= 10 &&
        filteredCountries.length > 1 &&
        filteredCountries.map((country) => (
          <div key={country.name}>
            {country.name}{" "}
            <button onClick={handleShow(country.name)}>show</button>
          </div>
        ))}
      {filteredCountries.length === 1 && (
        <CountryDetails country={filteredCountries[0]} />
      )}
      {showCountry.name && <CountryDetails country={showCountry} />}
    </div>
  );
};

export default App;
