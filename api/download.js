export default function handler(req, res) {
    const filePath = 'public/catalogo.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="catalogo.pdf"');
    res.sendFile(filePath, { root: process.cwd() });
}
