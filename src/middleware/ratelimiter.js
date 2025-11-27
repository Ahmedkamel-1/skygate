import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, 
    message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
},
    standardHeaders: true, 
    legacyHeaders: false,
});

// brute force on login/signup
export const authLimiter = rateLimit({
  wCndowMs: 5 * 60 * 1000, 
  max: 5, 
    message: {
    success: false,
    message: "Too many login attempts, please try again later."
},
    standardHeaders: true,
    legacyHeaders: false,
});