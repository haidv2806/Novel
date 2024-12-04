import express from "express";
import Book from "../../Model/Book/Book.js";

const VolumeController = express.Router();

VolumeController.post("/create", async (req, res, cb) => {
    const BookName = req.body.book_name
    const VolumeName = req.body.volume_name

    try {
        const result = await Book.createVolume(BookName, VolumeName)
        res.status(201).json( {result: true, message: `tạo volume mới cho ${BookName} thành công`, Volume: result})
    } catch (err) {   
        return res.status(500).json({ result: false, message: "Đã xảy ra lỗi khi tạo volume mới", error: err.message });
    }
})

// Sử dụng
// truyền dữ liệu vào body:
// {
//   "book_name": string,
//   "volume_name": string
// }

export default VolumeController