const express = require('express');
const router = express.Router();
router.use(express.json({limit: '50mb'}));

const GraphController = require("../controllers/GraphController");
const PeakController = require("../controllers/PeakController");
const SitesController = require("../controllers/SitesController");
const UsersController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/auth-middleware")


// router.post("/users/sign_up", UserController.insert);
router.get("/users/day_graph/:gsm_id",GraphController.dayGraph);
router.get("/users/month_graph/:gsm_id",GraphController.monthGraph);
router.get("/users/year_graph/:gsm_id",GraphController.yearGraph);
router.get("/users/total_graph/:gsm_id",GraphController.yearGraph);

router.get("/users/day_peak_data/:gsm_id",PeakController.dayPeak);
router.get("/users/month_peak_data/:gsm_id",PeakController.MonthPeak);
router.get("/users/year_peak_data/:gsm_id",PeakController.yearPeak);
router.get("/users/total_peak_data/:gsm_id",PeakController.totalPeak);

router.get("/users/sites_details/:gsm_id",SitesController.sitesData);
router.get("/users/sites_tables/:gsm_id",SitesController.sitesTable);
router.post("/users/sites_create",SitesController.create);
router.put("/user/sites/:gsm_id",AuthMiddleware,SitesController.update);

router.post("/user/registration",UsersController.register);
router.post("/user/login", UsersController.login);
router.post("/user/get_otp",UsersController.sendOtp);
router.post("/user/verify_otp",UsersController.verifyOtp);
router.post("/user/change_password",UsersController.changePassword);
router.get("/user/get_update_user_profile",AuthMiddleware,UsersController.auth_user);
router.post("/user/update_user_profile",AuthMiddleware,UsersController.updateProfile)

































module.exports = router;