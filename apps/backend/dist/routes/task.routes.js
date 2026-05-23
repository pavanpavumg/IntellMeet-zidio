"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/').post(auth_middleware_1.protect, task_controller_1.createTask);
router.route('/:workspaceId').get(auth_middleware_1.protect, task_controller_1.getTasksByWorkspace);
router.route('/:id/status').put(auth_middleware_1.protect, task_controller_1.updateTaskStatus);
exports.default = router;
