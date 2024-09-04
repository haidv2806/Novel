import express from "express";
import Book from "../../Model/Book/Book.js";
import Chapter from "../../Model/Book/Chapter.js";
import multer from "multer";

const ChapterController = express.Router();
const upload = multer();

ChapterController.post("/create", upload.single('content'), async (req, res, cb) => {
    const BookName = req.body.book_name
    const VolumeName = req.body.volume_name
    const ChapterName = req.body.chapter_name
    const Content = req.body.content
    try {
        const result = await Book.createChapter(BookName, VolumeName, ChapterName, Content)
        res.status(200).json( {result: true, message: `tạo Chapter mới cho volume ${VolumeName} của truyện ${BookName} thành công`, Chapter: result})
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
//   "content": string
// }

ChapterController.get("/:chapterId", async (req, res) => {
    const chapterId = req.params.chapterId;
  
    try {
      const content = await Chapter.getContent(chapterId)
      
      // Nếu content là văn bản:
      res.status(200).send(content);
  
      // Nếu content là file (image, PDF, v.v.), bạn có thể đặt header thích hợp:
      // res.setHeader('Content-Type', 'application/pdf');
      // res.status(200).send(content);
    } catch (err) {
      res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi lấy chapter", error: err.message });
    }
  });

export default ChapterController