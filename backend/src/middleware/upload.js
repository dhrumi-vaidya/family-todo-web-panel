const path = require('path');
const multer = require('multer');

// Configure storage for bill attachments
const billStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/bills/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'bill-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for bills (PDF and images only)
const billFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF and image files are allowed!'));
    }
};

const uploadBillAttachment = multer({
    storage: billStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: billFileFilter
});

module.exports = { uploadBillAttachment };
