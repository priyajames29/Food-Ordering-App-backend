import { getAllUsers, createUser, getUserFromId } from '../services/userService.js'
import { createUserSchema } from '../validators/userValidator.js';

export async function getUsers(req, res) {
    const users = await getAllUsers();

    res.json({ users });
}

export async function createUserController(req, res) {
    try {
        const validatedData = createUserSchema.parse(req.body);

        const user = await createUser(validatedData);

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }

}

export async function getUserFromIdController(req, res) {
    try {
        const user = await getUserFromId(req.params);
        res.json({ user });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
}


export async function updateUser(req, res) {
    try {
    } catch (error) {
        
    }
}