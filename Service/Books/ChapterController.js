import express from "express";
import Book from "../../Model/Book/Book.js";
import Chapter from "../../Model/Book/Chapter.js";
import User from "../../Model/Person/User.js";
import passport from "../../Model/passport.js";
// import multer from "multer";

const ChapterController = express.Router();
// const upload = multer();

ChapterController.post("/create", async (req, res, cb) => {
    const BookName = req.body.book_name
    const VolumeName = req.body.volume_name
    const ChapterName = req.body.chapter_name
    const Content = req.body.content
    try {
        const result = await Book.createChapter(BookName, VolumeName, ChapterName, Content)
        res.status(201).json( {result: true, message: `tạo Chapter mới cho volume ${VolumeName} của truyện ${BookName} thành công`, Chapter: result})
    } catch (err) {   
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi tạo chapter mới", error: err.message });
    }
});

// Sử dụng
// truyền dữ liệu vào form-data cuar body:
// {
//   "book_name": string,
//   "volume_name": string,
//   "chapter_name": string,
//   "content": string (đường dẫn vào file word trong máy)
// }

ChapterController.get("/", async (req, res) => {
    const chapterId = req.query.chapterId;
    try {
      const result = await Chapter.findById(chapterId)
      res.status(200).json({ result: true, message: "tìm kiếm chapter bằng ID thành công", chapter: result});
    } catch (err) {
      res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi lấy chapter", error: err.message });
    }
  });

// sử dụng
//gửi get vào: BaseURL/Book/Volume/Chapter?chapterId=<INT>

// ChapterController.get("/Content/:chapterId", async (req, res) => {
//     const chapterId = req.params.chapterId;
//     try {
//         const result = await Chapter.getContentById(chapterId)
//         const addView = await User.updateUserInteraction(result.book_id, )
//         res.status(200).json({ result: true, message: "tìm kiếm content bằng ID thành công", chapter: result});
//     } catch (err) {
//         res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi lấy content của chapter", error: err.message });
//     }
// })

ChapterController.get("/Content", passport.authenticate('jwt', { session: false, optional: false }),
async (req, res, cb) => {
    const chapterId = req.query.chapterId;
    try {
        const result = await Chapter.getContentById(chapterId)
        await User.updateUserInteraction(result.book_id, req.user.user_id, 'view', '')
        res.status(200).json({ result: true, message: "tìm kiếm content bằng ID thành công", chapter: result});
    } catch (err) {
        res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi lấy content của chapter", error: err.message });
    }
});
//gửi get vào: BaseURL/Book/Volume/Chapter/Content?chapterId=<INT>



export default ChapterController