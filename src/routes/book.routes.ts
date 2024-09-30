import express from 'express';
import { addBook, allBooks, searchBooks } from '../controllers/book.controller';

const router = express.Router();

router.route("/search-books").post(searchBooks);
router.route("/all-books").get(allBooks);
router.route("/add-book").post(addBook);


export default router;
