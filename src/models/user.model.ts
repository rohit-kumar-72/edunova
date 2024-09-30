import mongoose, { Schema, Document, Types } from 'mongoose';
import { transactionInterface } from './transaction.model';

export interface userInterface extends Document {
    name: string,
    email: string,
    mobile: string,
    transactionHistory?: (Types.ObjectId | transactionInterface)[]
}

const userSchema: Schema<userInterface> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            match: [/.+\@.+\..+/, "please use a valid email"],
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            trim: true,
        },
        transactionHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }],
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)