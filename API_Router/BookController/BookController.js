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
        res.status(200).json({ result: true, message: "tạo bộ sách mới thành công", book: result })
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi tạo sách mới", error: err.message });
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

BookController.get("/:bookId", async (req, res) => {
    const bookid = req.params.bookId
    try {
        const result = await Book.findById(bookid)     
        res.status(200).json({ result: true, message: "tìm kiếm sách thông quaID thành công", Book: result})
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi tìm sách bằng ID", error: err.message });
    }
})

// sử dụng
//gửi get vào: BaseURL/Book/<INT>

BookController.post("/search", async (req, res) => {
    const name = req.body.name
    const page = parseInt(req.params.page) || 1;  // Kiểm tra và đặt giá trị mặc định cho page
    try {
        const result = await Book.findBySearchName(name, page)
        res.status(200).json({ result: true, message: "tìm kiếm sách thông qua tên thành công", Book: result})
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi tìm sách bằng tên", error: err.message });
    }
})

// sử dụng
//gửi post vào: BaseURL/Book/<INT>

export default BookController