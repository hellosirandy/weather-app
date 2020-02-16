import React, { useEffect, useState } from 'react';
import Skycons from 'react-skycons';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import { darkskyAPIKey, geolocationAPIKey } from './secrets';

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(#dedede, #737373)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    textAlign: 'center',
    padding: 50,
    boxSizing: 'border-box',
  },
  location: {
    fontWeight: 400,
    fontSize: '1.8rem',
    color: 'white',
  },
  degree: {
    fontSize: '5rem',
    margin: 0,
    color: 'white',
  },
  time: {
    color: 'white',
    margin: 0,
    fontSize: '1rem',
    fontWeight: 500,
  },
};

const App = () => {
  const [finished, setFinished] = useState(false);
  const [width, setWidth] = useState(0);
  const [data, setData] = useState({
    temp: 0,
    icon: '',
    summary: '',
    location: '',
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const [weatherRes, geoRes] = await Promise.all([
          fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkskyAPIKey}/${lat},${lon}`)
            .then((res) => res.json()),
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?result_type=locality&latlng=${lat},${lon}&key=${geolocationAPIKey}`)
            .then((res) => res.json()),
        ]);

        setData({
          temp: Math.round(weatherRes.currently.temperature),
          icon: weatherRes.currently.icon.replace(/-/g, '_').toUpperCase(),
          summary: weatherRes.currently.summary,
          location: geoRes.results[0].formatted_address.trim().replace(/-/g, '').split(',')[0],
        });
        setFinished(true);
      } catch (e) {
        console.log(e);
      }
    });
  }, []);

  const refCallback = (element) => {
    if (element) {
      setWidth(element.getBoundingClientRect().height);
    }
  };

  const isMobile = useMediaQuery({ query: '(max-width: 500px)' });
  return (
    <div style={styles.container}>
      {finished ? (
        <div ref={refCallback} style={isMobile ? { textAlign: 'center' } : { ...styles.circle, width }}>
          <div>
            <h6 style={styles.location}>{data.location}</h6>
            <h6 style={styles.time}>{moment().format('LT')}</h6>
          </div>
          <div>
            <h6 style={styles.degree}>
              {data.temp}
              <span style={{ position: 'absolute' }}>&#176;</span>
            </h6>
          </div>
          <div style={{ width: 200, margin: 'auto' }}>
            <Skycons
              color="white"
              icon={data.icon}
              autoplay={false}
            />
            <h6 style={{
              margin: 0, color: 'white', fontSize: '1rem', fontWeight: 500,
            }}
            >
              {data.summary}
            </h6>
          </div>
        </div>
      ) : <Spinner animation="grow" />}

    </div>
  );
};

export default App;
