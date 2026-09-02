import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// Ensure upload directories exist
['logos', 'resumes', 'avatars'].forEach((dir) => {
  const fullPath = path.join(uploadDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const type = (req as any).uploadType || 'misc';
    const dest = path.join(uploadDir, type);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (allowed: string[]) => (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowed.join(', ')} files are allowed`));
  }
};

export const logoUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.webp', '.svg']),
});

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(['.pdf', '.doc', '.docx']),
});

export const getFileUrl = (type: string, filename: string): string => {
  const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${type}/${filename}`;
};

export const deleteFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('File deletion failed:', err);
  }
};
