import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  time: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  forecastContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  temperature: {
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
};

const HourlyForecast = ({ hourlyForecast, iconRefCallback }) => (
  <div style={styles.container}>
    {hourlyForecast.map((forecast, idx) => (
      <div
        style={{
          ...styles.forecastContainer,
          marginRight: idx < hourlyForecast.length - 1 ? 10 : 0,
        }}
        key={forecast.time}
      >
        <h6 style={styles.time}>{forecast.time}</h6>
        {/* <h6>{forecast.precipProbability}</h6> */}
        <canvas style={{ margin: 'auto' }} ref={iconRefCallback(forecast.icon)} id="icon1" width="30" height="30" />
        <h6 style={styles.temperature}>
          {forecast.temp}
          <span style={{ position: 'absolute' }}>&#176;</span>
        </h6>
      </div>
    ))}

  </div>
);

HourlyForecast.propTypes = {
  hourlyForecast: PropTypes.array.isRequired,
  iconRefCallback: PropTypes.func.isRequired,
};

export default HourlyForecast;
