import { Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { UserRole } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

export const updateUserRole = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;

    if (!role || !Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid user role is required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};