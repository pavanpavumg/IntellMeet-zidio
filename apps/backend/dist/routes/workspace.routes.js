"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workspace_controller_1 = require("../controllers/workspace.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.route('/').post(auth_middleware_1.protect, workspace_controller_1.createWorkspace).get(auth_middleware_1.protect, workspace_controller_1.getWorkspaces);
router.route('/:id/invite').post(auth_middleware_1.protect, workspace_controller_1.inviteMember);
exports.default = router;
