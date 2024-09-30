import { Request, Response, RequestHandler } from "express";
import { Book } from "../models/book.model";


export const addBook = async (req: any, res: any) => {
    try {
        const { name, category, rentPerDay } = req.body;

        // Validate request body
        if (!name || !rentPerDay || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, author, publishedDate, category).',
            });
        }

        // Create new book instance
        const newBook = new Book({
            name,
            rentPerDay,
            category,
        });

        // Save the book in the database
        const savedBook = await newBook.save();

        return res.status(201).json({
            success: true,
            message: 'Book added successfully.',
            book: savedBook,
        });
    } catch (error) {
        console.error('Error adding book:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};


export const searchBooks = async (req: any, res: any) => {
    try {

        const { name, minRent, maxRent, category } = req.body;

        let query: any = {};


        // search by name
        if (name) {
            // case insensititve request
            query.name = { $regex: name, $options: 'i' };
        }


        // search by rent 
        if (minRent && maxRent) {
            query.rentPerDay = {
                $gte: parseInt(minRent, 10),
                $lte: parseInt(maxRent, 10)
            };
        } else if (minRent) {
            query.rentperday = { $gte: parseInt(minRent, 10) };
        } else if (maxRent) {
            query.rentperday = { $lte: parseInt(maxRent, 10) };
        }


        // search by category
        if (category) {
            query.category = category;
        }

        const result = await Book.find(query);

        // if no book found
        if (result.length === 0) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No book with given data found"
                })
        }

        return res
            .status(200)
            .json({
                success: true,
                message: "Books found successfully",
                books: result
            })


    } catch (error) {
        console.error("Error searching for books:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const allBooks = async (req: any, res: any) => {
    try {
        const Books = await Book.find();
        if (Books.length === 0) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "No book found"
                })
        }
        return res
            .status(200)
            .json({
                success: true,
                message: "Books found successfully.",
                allBooks: Books
            })
    } catch (error) {
        console.error("Error searching for All books:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}