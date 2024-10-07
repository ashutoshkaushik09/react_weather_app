// src/components/Clock.js
import React, { useEffect, useState } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); 
  }, []);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  
  const timeString = currentTime.toLocaleString(undefined, options);

  return (
    <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'white', fontSize: '0.8rem', zIndex: 10 }}>
      {timeString}
    </div>
  );
};

export default Clock;
