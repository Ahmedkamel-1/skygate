import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
    message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
},
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,
});

// Auth-specific limiter (to prevent brute force on login/signup)
export const authLimiter = rateLimit({
  wCndowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests
    message: {
    success: false,
    message: "Too many login attempts, please try again later."
},
    standardHeaders: true,
    legacyHeaders: false,
});