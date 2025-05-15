const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const vapidKeys = require('./vapid.json');

webpush.setVapidDetails(
  'mailto:seuemail@exemplo.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const SUBSCRIPTION_FILE = './subscriptions.json';

// Carrega ou inicia a lista de subscriptions
let subscriptions = [];
if (fs.existsSync(SUBSCRIPTION_FILE)) {
  subscriptions = JSON.parse(fs.readFileSync(SUBSCRIPTION_FILE));
}

// Endpoint para registrar uma nova subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  fs.writeFileSync(SUBSCRIPTION_FILE, JSON.stringify(subscriptions, null, 2));
  res.status(201).json({ message: 'Inscrição salva com sucesso!' });
});

// Endpoint para disparar notificações a todos inscritos
app.post('/notify', async (req, res) => {
  const payload = JSON.stringify({
    title: '⏰ Alerta!',
    body: 'Você precisa voltar ao app!'
  });

  const results = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ success: true });
    } catch (error) {
      console.error('Erro ao enviar push:', error);
      results.push({ success: false, error });
    }
  }

  res.json({ results });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
