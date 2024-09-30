import mongoose, { Schema, Document, Types } from 'mongoose';
import { transactionInterface } from './transaction.model';

export enum BookCategory {
    Fiction = 'Fiction',
    NonFiction = 'Non-Fiction',
    Science = 'Science',
    History = 'History',
    Biography = 'Biography',
    Fantasy = 'Fantasy',
    Mystery = 'Mystery'
}

export interface BookInterface extends Document {
    name: string,
    category: BookCategory,
    rentPerDay: number,
    isIssued: boolean,
    transactionHistory?: (Types.ObjectId | transactionInterface)[]
}

const bookSchema: Schema<BookInterface> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            enum: Object.values(BookCategory),
            required: true,
        },
        rentPerDay: {
            type: Number,
            default: 0,
        },
        isIssued: {
            type: Boolean,
            default: false
        },
        transactionHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Transaction",
        }]
    },
    {
        timestamps: true
    }
);

export const Book = mongoose.model("Book", bookSchema);