import { useState, useEffect, useRef } from 'react';
import { formatTime } from "../../utils/FormatData"
import "./index.css"

function Home() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
    }
    
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);
    useEffect(() => {
        const PUBLIC_VAPID_KEY = 'BGVB2PSSt2DefJXoLyNodGPveKYxQ6wuGQuBJkN6xktL3TGt6ZbVGVcsGsTunH5dcOM7C3-OvmzcBaLZyDc9X18';
    
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(async registration => {
                const subscription = await registration.pushManager.getSubscription();
                if (!subscription) {
                    try {
                        const newSub = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
                        });
                        console.log('Inscrito para push:', newSub);
    
                        // Envia para o backend
                        await fetch('https://atividades-rani-production.up.railway.app/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newSub),
                        });
                    } catch (err) {
                        console.error('Erro ao inscrever:', err);
                    }
                }
            });
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

    useEffect(() => {
        const LIMITE = 10;
    
        if (elapsedTime === LIMITE) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification("⏰ Tempo atingido!", {
                        body: "Seu cronômetro chegou a 10 segundos.",
                        icon: "/icons/icon-192.ico",
                        badge: "/icons/icon-192.ico",
                        vibrate: [200, 100, 200],
                        tag: "timer-notification"
                    });
                }).catch(err => {
                    console.error("Erro ao exibir notificação:", err);
                });
            } else if (Notification.permission === "granted") {
                // fallback direto se não houver serviceWorker
                new Notification("⏰ Tempo atingido!", {
                    body: "Seu cronômetro chegou a 10 segundos."
                });
            }
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