import express from 'express';
import { addUser, allUsers, bookIssuedToUser } from '../controllers/user.controller';

const router = express.Router();

router.route("/all-user").get(allUsers);
router.route("/issued-books").post(bookIssuedToUser);
router.route("/add-user").post(addUser);


export default router;
