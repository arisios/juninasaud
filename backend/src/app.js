const express = require('express');
const cors = require('cors');
const path = require('path');

const producersRoutes = require('./routes/producers');
const eventsRoutes = require('./routes/events');
const exhibitorsRoutes = require('./routes/exhibitors');
const auditorsRoutes = require('./routes/auditors');
const openingRoutes = require('./routes/opening');
const periodicRoutes = require('./routes/periodic');
const finalRoutes = require('./routes/final');
const eventBoothsRoutes = require('./routes/eventBooths');
const eventDashboardRoutes = require('./routes/eventDashboard');
const nfcRoutes = require('./routes/nfc');
const withdrawalsRoutes = require('./routes/withdrawals');
const boothPageRoutes = require('./routes/boothPage');
const auditRequestsRoutes = require('./routes/auditRequests');

const app = express();

/* CORS */
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

// Simple internal UI (vanilla HTML/JS) served by this backend
const uiDir = path.resolve(__dirname, '..', 'ui');
app.use('/ui', express.static(uiDir));
app.get('/', (_req, res) => res.redirect('/ui/'));

app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'OK' });
});

app.use('/producers', producersRoutes);
app.use('/events', eventsRoutes);
app.use('/exhibitors', exhibitorsRoutes);
app.use('/auditors', auditorsRoutes);
app.use('/opening', openingRoutes);
app.use('/periodic', periodicRoutes);
app.use('/final', finalRoutes);
app.use('/events', eventBoothsRoutes);
app.use('/events', eventDashboardRoutes);
app.use('/audit-requests', auditRequestsRoutes);
app.use('/nfc', nfcRoutes);
app.use('/withdrawals', withdrawalsRoutes);

app.use('/', boothPageRoutes);

module.exports = app;
