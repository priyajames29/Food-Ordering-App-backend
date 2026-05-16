import { getAllUsers, createUser } from '../services/userService.js'
import { createUserSchema } from '../validators/userValidator.js';

export async function getUsers(req, res) {
    const users = await getAllUsers();

    res.json({ users });
}

export async function createUserController(req, res) {
    try {
        const validatedData = createUserSchema.parse(req.body);

        const user = createUser(validatedData);

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }

}