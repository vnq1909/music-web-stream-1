import express from "express";
import {login, register, getAllUsers, deleteUser} from '../controllers/authController.js'
import { userJwtMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post("/login", login); //login route
router.post("/register", register); //register route
router.get("/users", [userJwtMiddleware, adminMiddleware], getAllUsers); // get all users (admin only)
router.delete("/users/:id", [userJwtMiddleware, adminMiddleware], deleteUser); // delete user (admin only)

export default router;
