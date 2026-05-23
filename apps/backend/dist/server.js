"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const workspace_routes_1 = __importDefault(require("./routes/workspace.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const http_1 = require("http");
const socket_1 = require("./socket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5000;
// Initialize Socket.io
(0, socket_1.initializeSocket)(server);
// Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Connect DB
(0, db_1.default)();
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/workspaces', workspace_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'intell-meet-backend' });
});
server.listen(PORT, () => {
    console.log(`Server & WebSockets running on port ${PORT}`);
});
