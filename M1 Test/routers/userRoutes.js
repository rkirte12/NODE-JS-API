const router = require("express").Router();
const userOperation = require("../controller/userOperation")

router.post("/sign-up", userOperation.userSignup);
router.post("/verify-otp",userOperation.otpVerify);
router.put("/resend-otp", userOperation.resendOTP);
router.put("/forget-password", userOperation.forgetPass);
router.put("/resetpassword/:otp", userOperation.resetPass);
router.post("/user-login/:otp",userOperation.userLogin);
router.put("/edit-profile/:id",userOperation.updateProfile);
router.get("/list-user", userOperation.fetchUser);
router.get("/view-user",userOperation.viewUser);
router.get("/staticlist", userOperation.staticList);
router.get("/viewStatic/:type",userOperation.viewStatic);
router.put("/editStatic/:id",userOperation.editStatic);

module.exports = router;