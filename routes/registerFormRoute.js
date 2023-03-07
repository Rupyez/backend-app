const express = require("express");
const {
  createRegisterForm,
  getAllRegisterForm,
  getRegisterFormById,
  updateRegisterForm,
  deleteRegisterForm,
} = require("../controllers/registerFormController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.post("/add", createRegisterForm);
router.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  getAllRegisterForm
);
router.get(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  getRegisterFormById
);
router.put("/update/:id", updateRegisterForm);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  deleteRegisterForm
);

module.exports = router;
