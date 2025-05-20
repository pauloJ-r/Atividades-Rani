import { useState, useEffect, useRef } from 'react';
import { formatTime } from "../../utils/FormatData";
import { subscribeToPush } from "../../services/pushService";
import { sendNotification } from "../../services/notifications";
import "./index.css";

function Home() {
    const WORK_DURATION = 25 * 60;
    const SHORT_BREAK = 5 * 60;
    const LONG_BREAK = 15 * 60;
    const CYCLES_BEFORE_LONG_BREAK = 4;

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isWorkSession, setIsWorkSession] = useState(true);
    const [cycleCount, setCycleCount] = useState(0);

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        subscribeToPush();
    }, []);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - elapsedTime * 1000;
            timerRef.current = setInterval(() => {
                const now = Date.now();
                setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    useEffect(() => {
        const duration = isWorkSession
            ? WORK_DURATION
            : (cycleCount % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK);

        if (elapsedTime >= duration) {
            sendNotification(isWorkSession);
            setIsRunning(false);
            setElapsedTime(0);

            if (isWorkSession) {
                setCycleCount(prev => prev + 1);
            }

            setIsWorkSession(prev => !prev);
        }
    }, [elapsedTime]);

    const totalDuration = isWorkSession
        ? WORK_DURATION
        : (cycleCount % CYCLES_BEFORE_LONG_BREAK === 0 ? LONG_BREAK : SHORT_BREAK);

    const timeLeft = totalDuration - elapsedTime;

    return (
        <>
            <div className='timer'>
                {isWorkSession ? "⏱️ Foco" : "🛋️ Pausa"} - {formatTime(timeLeft)}
            </div>
            <div className='group'>
                <button onClick={() => setIsRunning(true)} disabled={isRunning}>Iniciar</button>
                <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Pausar</button>
                <button onClick={() => {
                    setIsRunning(false);
                    setElapsedTime(0);
                    setIsWorkSession(true);
                    setCycleCount(0);
                }}>Resetar</button>
            </div>
            <div className="cycles">Ciclos completos: {cycleCount}</div>
        </>
    );
}

export default Home;
