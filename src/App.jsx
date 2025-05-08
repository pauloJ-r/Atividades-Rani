import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const seconds = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedTime(seconds);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  function formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  return (
    <>
      <div className='timer'>{formatTime(elapsedTime)}</div>
      <div className='group'>
      <button onClick={startTimer} disabled={isRunning}>Iniciar</button>
      <button onClick={pauseTimer} disabled={!isRunning}>Pausar</button>
      <button onClick={resetTimer}>Resetar</button>
      </div>
    </>
  );
}

export default App;
