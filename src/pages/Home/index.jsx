import { useState, useEffect, useRef } from 'react';
import { formatTime } from "../../utils/FormatData"
import "./index.css"

function Home() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);
    
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);


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

        // Notificação ao atingir o tempo limite
        useEffect(() => {
            const LIMITE = 10; // 5 minutos
            if (elapsedTime === LIMITE && Notification.permission === "granted") {
                new Notification("⏰ Tempo atingido!", {
                    body: "Seu cronômetro chegou a 5 minutos.",
                    icon: "../../assets/react.svg" // substitua com o seu ícone PWA
                });
            }
        }, [elapsedTime]);

    

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

export default Home;