const express = require("express");
const {
  createEnquiry,
  getAllEnquiry,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryContoller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.post("/add", createEnquiry);
router.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  getAllEnquiry
);
router.get(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  getEnquiryById
);
router.put(
  "/update/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  updateEnquiry
);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  deleteEnquiry
);

module.exports = router;
