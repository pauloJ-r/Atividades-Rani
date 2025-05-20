import { urlBase64ToUint8Array } from "../utils/pushUtils";

const PUBLIC_VAPID_KEY = 'BGVB2PSSt2DefJXoLyNodGPveKYxQ6wuGQuBJkN6xktL3TGt6ZbVGVcsGsTunH5dcOM7C3-OvmzcBaLZyDc9X18';

export async function subscribeToPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                const newSub = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
                });

                await fetch('https://atividades-rani-production.up.railway.app/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSub),
                });
            }
        } catch (error) {
            console.error("Erro ao inscrever no Push:", error);
        }
    }
}
