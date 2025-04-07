const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const filePath = path.join(__dirname, 'data.json');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify(Array.from({ length: 50 }, (_, i) => ({ id: i + 1, reserved: false })), null, 2));
}

app.get('/api/numbers', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

app.post('/api/reserve/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(filePath));
  const number = data.find(n => n.id === id);
  if (number && !number.reserved) {
    number.reserved = true;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Número já reservado ou inválido' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
