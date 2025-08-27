const router = require("express").Router();
const projectController = require("../controllers/project.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, projectController.getAllProjects);
router.post("/", authMiddleware, projectController.createProject);
router.get("/:id", authMiddleware, projectController.getProjectById);
router.put("/:id", authMiddleware, projectController.updateProject);
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
