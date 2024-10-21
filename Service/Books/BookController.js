import express from "express";
import Book from "../../Model/Book/Book.js";
import Category from "../../Model/Book/Category.js";


const BookController = express.Router();

BookController.post("/create", async (req, res, cb) => {
    const name = req.body.name
    const image = req.body.image
    const author = req.body.author
    const artist = req.body.artist
    const status = req.body.status
    const decription = req.body.decription
    const categories = req.body.categories
    try {
        const addBook = await Book.create(name, image, author, artist, status, decription)
        categories.forEach(async (category) => {
            await Category.addCategories(addBook.book_id, category)
        });
        res.status(200).json({ result: true, message: "tạo bộ sách mới thành công", book: addBook })
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi tạo sách mới", error: err.message });
    }
})

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "name": string,
//   "image": string,
//   "author": string,
//   "artist": string,
//   "status": string,
//   "decription": string,
//   "categories": array[String]
// }


//tìm kiếm thông tin chi tiết của sách
BookController.get("/", async (req, res) => {
    const bookid = req.query.bookId  
    try {
        const book = new Book();
        await book.init(bookid);
        res.status(200).json({ result: true, message: "tìm kiếm sách thông quaID thành công", Book: book })
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi tìm sách bằng ID", error: err.message });
    }
})

// sử dụng
// gửi get vào: BaseURL/Book?bookId=<INT>

//lấy danh sách sách thông qua số lượng View
BookController.get("/View", async (req, res) => {
    const page = req.query.page || 1
    try {
        const book = await Book.findByView(page)
        res.status(200).json({ result: true, message: "tìm kiếm sách thông qua số lượng view thành công", Book: book })
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi lấy danh sách bộ sách", error: err.message });
    }
})

// sử dụng
// gửi get vào: BaseURL/Book/View?page=<INT>


BookController.post("/search", async (req, res) => {
    const search = req.body.search
    const page = req.query.page || 1;  // Kiểm tra và đặt giá trị mặc định cho page
    try {
        const result = await Book.findBySearchName(search, page)
        res.status(200).json({ result: true, message: "tìm kiếm sách thông qua tên thành công", Book: result })
    } catch (err) {
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi tìm sách bằng tên", error: err.message });
    }
})

// sử dụng
// gửi post vào: BaseURL/Book/<INT>
// Truyền dữ liệu vào body
// {
// search: string
// }



export default BookController