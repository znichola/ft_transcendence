import { existsSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import path = require('path');



type validFileExtension = '.png' | '.jpg' | '.jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['.png', '.jpg', '.jpeg'];
const validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToServer =
{
    storage: diskStorage({
        destination: './avatars',
        filename: (req, file, callback) => {
            const username: string = req.params.username;
            validFileExtensions.forEach((extension) => {
                const fileToDelete: string = path.join('./avatars', username + extension);
                if (existsSync(fileToDelete)) unlinkSync(fileToDelete)
            });
            const fileExtension: string = path.extname(file.originalname);
            const fileName: string = username + fileExtension
            callback(null, fileName)
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes: validMimeType[] = validMimeTypes;
        allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    }
}