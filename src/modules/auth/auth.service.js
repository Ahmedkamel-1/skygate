import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../../DB/models/user.model.js";

export const registerService = async ({ username, email, password }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("E mail already exists");
    
    const hashedPass = bcrypt.hashSync(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPass
    });

    return user;
};

export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("You have to register!");

    const match = bcrypt.compareSync(password, user.password);
    if (!match) throw new Error("Invalid password");

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    return { user, token };
};
