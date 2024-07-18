import { PrismaClient, ThemeType } from "@prisma/client";
import { User } from "../../src/types";
import ApiError from "../../src/utils/ApiError";
import prisma from "../prisma.client";

class UserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    async addUser(userData: User) {
        try {
            const newUser = await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    Profile: {
                        create: {
                            image: userData.Profile?.image || "",
                            about: "",
                            theme: userData.Profile.theme,
                        },
                    },
                },
                include: {
                    Profile: {},
                },
            });
            return newUser;
        } catch (error) {
            console.error("Error adding user:", error);
            throw error;
        }
    }

    async getUser(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    Profile: {},
                },
            });
            return user;
        } catch (error) {
            console.error("Error retrieving user:", error);
            throw error;
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: email },
                include: {
                    Profile: {},
                    friendId: {},
                },
            });
            return user;
        } catch (error) {
            console.error("Error retrieving user:", error);
            throw new ApiError(404, "Error retrieving user");
        }
    }

    async updateUser(userId: string, userData: Omit<User, "Profile">) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: userData,
            });
            return updatedUser;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async deleteUser(userId: string) {
        try {
            await this.prisma.user.delete({
                where: { id: userId },
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    // Add other methods as needed
}
export default new UserRepository();
