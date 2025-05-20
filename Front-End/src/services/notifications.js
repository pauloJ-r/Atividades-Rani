export function sendNotification(isWorkSession) {
    const title = isWorkSession ? "🚨 Tempo de Pausa!" : "🕒 Hora de Trabalhar!";
    const body = isWorkSession
        ? "Você completou um Pomodoro. Faça uma pausa!"
        : "Pausa concluída. Volte ao foco.";

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body,
                icon: "/icons/icon-192.ico",
                badge: "/icons/icon-192.ico",
                vibrate: [200, 100, 200],
                tag: "pomodoro-notification"
            });
        });
    } else if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
}
