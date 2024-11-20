import { Admin } from "../model/admin.model.js";
import jwt from 'jsonwebtoken'


//this logic is to add admin credentials to backend
export const addAdmin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" })
    }

    const admin = await Admin.create({
        email,
        password
    })

    if (!admin) {
        return res.status(500).json({ error: "Failed to add admin" })
    }

    return res.status(200).json({ message: "Admin added successfully" })

}



// this logic is to login admin
export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" })
    }

    const user = await Admin.findOne({ email })

    if (!user) {
        return res.status(404).json({ error: "Admin does not Found" })
    }

    const isPasswordCorrect = await user.isPasswordValid(password)

    if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid Password" })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return res
        .status(200)
        .json({ message: "Authentication Complete", token, id: user._id });
}
