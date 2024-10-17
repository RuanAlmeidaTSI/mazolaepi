import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(__dirname, 'catalogo.pdf');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Set headers to force download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="catalogo.pdf"');
    
    // Read the file and send it as response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
}
