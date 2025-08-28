const authMiddleware = require("../middleware/auth.middleware");
const router = require("express").Router();
const taskController = require("../controllers/task.controller");

router.get("/:projectId", authMiddleware, taskController.getAllTasksForProject);
router.post("/", authMiddleware, taskController.createTask);
router.put("/:projectId", authMiddleware, taskController.updateTaskStatus);

module.exports = router;
