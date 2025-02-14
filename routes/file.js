var express = require('express');
var router = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Cấu hình lưu trữ động dựa trên header
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lấy tên folder từ header
    const folderName = req.headers['upload-type'] || 'default';

    // Thư mục lưu trữ (mặc định là `uploads/<folderName>`)
    const uploadPath = path.join('./public/images', folderName);

    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath); // Chỉ định đường dẫn lưu file
  },
 
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
  
});

// Bộ lọc file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh.'), false);
  }
};

// Tạo cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Giới hạn file 2MB
  }
});

// API upload ảnh
router.post('/upload', upload.single('fileImg'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được tải lên.' });
    }
 
    res.status(200).json(
        {
           "statusCode": 201,
           "message": "Upload file thành công!",
           data: {
            filePath: `${req.file.filename}`
          }
        })

  });
  
  // Test API
  router.get('/', (req, res) => {
    res.status(200).json({ message: 'API Upload Hoạt Động' });
  });


module.exports = router;