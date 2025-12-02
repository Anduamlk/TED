import { diskStorage, StorageEngine } from 'multer';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

export const fileStorage = (subfolder = 'uploads'): StorageEngine => {
  return diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), subfolder);
      if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${file.originalname.substring(
        file.originalname.lastIndexOf('.'),
      )}`;
      cb(null, uniqueName);
    },
  });
};
