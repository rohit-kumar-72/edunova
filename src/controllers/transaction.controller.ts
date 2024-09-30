import { Request, Response } from "express";
import { User, userInterface } from "../models/user.model";
import { Transaction, transactionInterface } from "../models/transaction.model";
import { Book, BookInterface } from "../models/book.model";


export const issueBook = async (req: any, res: any) => {
    try {
        const { bookName, identity, issueDate } = req.body;

        if (!bookName || !identity || !issueDate) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "provide all data"
                })
        }

        const user = await User.findOne({
            $or: [{ email: identity }, { name: identity }]
        });

        if (!user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "NO user found."
                })
        }
        const book = await Book.findOne({
            name: bookName
        })

        if (!book) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "NO book found."
                })
        }

        if (book.isIssued) {
            return res
                .status(300)
                .json({
                    success: false,
                    message: "book already issued."
                })
        }

        const transaction = await Transaction.create(
            {
                book: book._id,
                issueDate: new Date(issueDate),
                user: user._id
            }
        );

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $push: {
                transactionHistory: transaction._id
            }
        })
        const updatedBook = await Book.findByIdAndUpdate(book._id, {
            $push: {
                transactionHistory: transaction._id
            },
            isIssued: true
        })

        return res.status(201).json({
            success: true,
            message: "Book issued successfully.",
            transaction: transaction
        });
    } catch (error) {
        console.error("Error issuing book:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const returnBook = async (req: any, res: any) => {
    try {
        const { bookName, identity, returnDate } = req.body;

        if (!bookName || !identity || !returnDate) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "provide all data"
                })
        }

        const user = await User.findOne({
            $or: [{ email: identity }, { name: identity }]
        });

        if (!user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "NO user found."
                })
        }
        const book: BookInterface | null = await Book.findOne({
            name: bookName,
        }).populate('transactionHistory').exec()

        if (!book) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "NO book found."
                })
        }

        const transactions = book.transactionHistory as transactionInterface[];

        const openBookTransaction = transactions.filter((trans) => !trans.returnDate)[0];

        if (!openBookTransaction) {
            return res.status(404).json({
                success: false,
                message: "No open transactions found for this book."
            });
        }


        openBookTransaction.returnDate = new Date(returnDate);
        openBookTransaction.save();

        const rent = ((openBookTransaction.returnDate.getTime() - openBookTransaction.issueDate.getTime()) / (1000 * 3600 * 24)) * book.rentPerDay

        const updatedBook = await Book.findByIdAndUpdate(book._id, {
            isIssued: false
        })

        return res.status(201).json({
            success: true,
            message: "Book returned successfully.",
            rent,
            issueDate: openBookTransaction.issueDate,
            returnDate,
            rentPerDay: book.rentPerDay
        });
    } catch (error) {
        console.error("Error issuing book:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getBookDetails = async (req: any, res: any) => {
    const { bookName } = req.body;

    try {

        const book = await Book.findOne({ name: bookName });
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found." });
        }


        const transactions = await Transaction.find({ book: book._id }).populate('user');

        const totalCount = transactions.length;
        const currentlyIssuedTransaction = transactions.find(transaction => !transaction.returnDate);

        let currentUser = null;
        if (currentlyIssuedTransaction) {
            currentUser = currentlyIssuedTransaction.user;
        }

        const totalRent = transactions.reduce((sum, transaction) => {
            const duration = transaction.returnDate
                ? (transaction.returnDate.getTime() - transaction.issueDate.getTime()) / (1000 * 3600 * 24)
                : 0;
            return sum + (duration * book.rentPerDay);
        }, 0);

        return res.status(200).json({
            success: true,
            totalCount,
            currentUser,
            totalRentGenerated: totalRent
        });
    } catch (error) {
        console.error("Error fetching book details:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getBooksIssuedInDateRange = async (req: any, res: any) => {
    const { startDate, endDate } = req.body;

    try {
        const transactions = await Transaction.find({
            issueDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate('user book');

        if (!transactions.length) {
            return res.status(404).json({ success: false, message: "No transactions found in this date range." });
        }

        const issuedBooks = transactions.map(transaction => {
            const book = transaction.book as BookInterface;
            const user = transaction.user as userInterface;

            return {
                book: book.name,
                issuedTo: user.name,
                issueDate: transaction.issueDate,
                returnDate: transaction.returnDate
            };
        });

        return res.status(200).json({
            success: true,
            issuedBooks
        });
    } catch (error) {
        console.error("Error fetching books issued in date range:", error);
        return res.status(500).json({ message: 'Server error' });
    }
};

