import {asyncHandler} from "../../../src/utils/asyncHandler.js";
import { registerService, loginService } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const user = await registerService(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user
    });
});

export const login = asyncHandler(async (req, res) => {
    const { user, token } = await loginService(req.body);
    res.json({
        success: true,
        message: "Logged in successfully",
        token,
        user
    });
});
