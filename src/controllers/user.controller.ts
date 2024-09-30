import express, { Request, RequestHandler, Response } from "express";
import { User } from "../models/user.model";
import { BookInterface } from "../models/book.model";
import { transactionInterface } from "../models/transaction.model";

export const addUser = async (req: any, res: any) => {
    try {
        const { name, email, mobile } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, author, publishedDate, category).',
            });
        }

        const newUser = new User({
            name,
            email,
            mobile,
        });

        const savedUser = await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'user added successfully.',
            book: savedUser,
        });
    } catch (error) {
        console.error('Error adding user:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

export const allUsers = async (req: any, res: any) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Users found successfully.",
            allusers: users
        });
    } catch (error) {
        console.error("Error searching for all users:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const bookIssuedToUser = async (req: any, res: any) => {
    try {

        const { identity } = req.body;
        const user = await User.findOne({
            $or: [{ email: identity }, { name: identity }]
        }).populate({
            path: "transactionHistory",
            populate: {
                path: 'book',
                select: "name"
            }
        }).exec();

        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No user found"
                })
        }

        const transactions = user.transactionHistory || []

        const issuedBooks = transactions.map(transaction => {
            const book = (transaction as transactionInterface).book as BookInterface;
            return book.name;
        });

        return res
            .status(200)
            .json({
                success: true,
                message: "books found successfully.",
                issuedBooks
            })
    } catch (error) {
        console.error("Error searching for issued books:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}