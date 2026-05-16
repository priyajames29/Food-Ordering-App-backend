import { User } from "../models/User.js";

export async function getAllUsers() {
    return await User.findAll();
}

export async function createUser(data) {
    try{
        return await User.create(data);
    } catch(error) {
        throw error
    }
}