import mongoose, { Schema, Document, Types } from 'mongoose';
import { BookInterface } from './book.model';
import { userInterface } from './user.model';

export interface transactionInterface extends Document {
    book: (Types.ObjectId | BookInterface),
    issueDate: Date,
    returnDate?: Date,
    user: (Types.ObjectId | userInterface)
}

const transactionSchema: Schema<transactionInterface> = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        issueDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Transaction = mongoose.model("Transaction", transactionSchema);