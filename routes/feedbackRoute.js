const express = require("express");
const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/add", createFeedback);
router.get("/", getAllFeedback);
router.get("/:id", getFeedbackById);
router.put(
  "/update/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  updateFeedback
);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  deleteFeedback
);

module.exports = router;
