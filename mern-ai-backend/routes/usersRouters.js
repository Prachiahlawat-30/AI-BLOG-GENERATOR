//User → URL → Router → Controller → Response
//full backend flow
//Route → Router → Controller → Model → Database

const express = require("express");
const router = express.Router();

const { 
  register, 
  login, 
  logout, 
  userProfile,
  activateFreePlan,
  checkAuth   // ✅ added
} = require("../controllers/usersControllers");

const { isAuthenticated } = require("../middleware/isAuthenticated.js");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", isAuthenticated, userProfile);

// ✅ ADD THIS ROUTE
router.get("/check", checkAuth);

// user routes
router.post("/activate-free", isAuthenticated, activateFreePlan);

module.exports = router;