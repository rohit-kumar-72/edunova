import express from 'express';
import { getBookDetails, getBooksIssuedInDateRange, issueBook, returnBook } from '../controllers/transaction.controller';

const router = express.Router();

router.route("/issue-book").post(issueBook);
router.route("/return-book").post(returnBook);
router.route("/get-book-details").post(getBookDetails);
router.route("/get-book-in-date-range").post(getBooksIssuedInDateRange);


export default router;
