import { where } from "sequelize";
import { User } from "../models/User.js";

export async function getAllUsers() {
    return await User.findAll();
}

export async function createUser(data) {
    try {
        return await User.create(data);
    } catch (error) {
        throw error
    }
}

export async function getUserFromId(params) {
    try {
        const data = await User.findOne({
            where: {
                id: params.id
            }
        });
        return data
    } catch (error) {
        throw error
    }
}
