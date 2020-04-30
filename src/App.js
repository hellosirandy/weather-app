import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import { darkskyAPIKey, geolocationAPIKey } from './secrets';
import HourlyForecast from './components/HourlyForecast';

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(#dedede, #737373)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  location: {
    fontWeight: 400,
    fontSize: '1.8rem',
    color: 'white',
    textAlign: 'center',
  },
  temperature: {
    fontSize: '5rem',
    margin: 0,
    color: 'white',
  },
  iconSummary: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
  },
  tempIconSummary: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  summary: {
    margin: 0,
    color: 'white',
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  error: {
    fontSize: '1.5rem',
    color: 'white',
    textAlign: 'center',
  },
};

const App = () => {
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    temp: 0,
    icon: '',
    summary: '',
    location: '',
    hourlyForecast: [],
  });
  useEffect(() => {
    const success = async (position) => {
      console.log(position);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const [weatherRes, geoRes] = await Promise.all([
          fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkskyAPIKey}/${lat},${lon}`)
            .then((res) => res.json()),
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&latlng=${lat},${lon}&key=${geolocationAPIKey}`)
            .then((res) => res.json()),
        ]);
        const hourlyForecast = weatherRes.hourly.data.slice(0, 8).map((forecast) => {
          const time = moment(forecast.time * 1000).format('LT');
          const m = time.split(' ')[1];
          const hour = time.split(':')[0];
          const formattedTime = `${hour}${m}`;
          return {
            time: formattedTime,
            icon: forecast.icon,
            precipProbability: forecast.precipProbability,
            temp: Math.round(forecast.temperature),
          };
        });
        setData({
          temp: Math.round(weatherRes.currently.temperature),
          icon: weatherRes.currently.icon,
          summary: weatherRes.currently.summary,
          location: geoRes.results[0].formatted_address.trim().replace(/-/g, '').split(',')[0],
          hourlyForecast,
        });
        setFinished(true);
      } catch (e) {
        setError(true);
      }
    };
    const error = (err) => {
      console.log(err);
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  const iconRefCallback = (icon) => (element) => {
    const skycons = new window.Skycons({ color: 'white' });
    skycons.add(element, icon);
  };

  let content;

  if (error) {
    content = (
      <div>
        <h6 style={styles.error}>
Unfortunetly,
          <br />
We are unable to retrieve weather.
        </h6>
      </div>
    );
  } else if (finished) {
    content = (
      <div>
        <div>
          <h6 style={styles.location}>{data.location}</h6>
        </div>
        <div style={styles.tempIconSummary}>
          <h6 style={styles.temperature}>
            {data.temp}
&#176;
          </h6>
          <div style={styles.iconSummary}>
            <canvas style={{ margin: 'auto' }} ref={iconRefCallback(data.icon)} id="icon1" width="80" height="80" />
            <h6 style={styles.summary}>
              {data.summary}
            </h6>
          </div>

        </div>
        <HourlyForecast hourlyForecast={data.hourlyForecast} iconRefCallback={iconRefCallback} />
      </div>
    );
  } else {
    content = <Spinner animation="grow" />;
  }

  return (
    <div style={styles.container}>
      {content}

    </div>
  );
};

export default App;
