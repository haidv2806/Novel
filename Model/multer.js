import multer from 'multer';
import path from 'path';
import env from "dotenv";
env.config();

// Tạo thư mục lưu trữ file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.env.PATH_SAVE_IMAGE)); // Thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Đặt tên file duy nhất
    }
});

// Kiểm tra file upload có phải là ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Sử dụng multer với cấu hình lưu trữ và kiểm tra loại file
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload