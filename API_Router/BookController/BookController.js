import express from "express";
import Book from "../../Model/Book/Book.js";


const BookController = express.Router();

BookController.post("/create", async (req, res, cb) => {
    const name = req.body.name
    const author = req.body.author
    const artist = req.body.artist
    const status = req.body.status
    const decription = req.body.decription

    try {
        const result = await Book.create(name, author, artist, status, decription)
        res.status(200).json( {result: true, message: "tạo bộ sách mới thành công", book: result})
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi sách mới", error: err });
    }
})

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "name": string,
//   "author": string,
//   "artist": string,
//   "status": string,
//   "decription": string
// }

export default BookController