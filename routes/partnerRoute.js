const express = require("express");
const {
  createPartner,
  getAllPartner,
  getPartnerById,
  updatePartner,
  deletePartner,
} = require("../controllers/partnerController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/add",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  createPartner
);
router.get(
  "/",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  getAllPartner
);
router.get(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  getPartnerById
);
router.put(
  "/update/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  updatePartner
);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("superAdmin", "admin"),
  deletePartner
);

module.exports = router;
