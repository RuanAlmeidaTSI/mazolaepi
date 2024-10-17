import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.resolve('catalogo.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    const response = new NextResponse(fileBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="catalogo.pdf"',
        },
    });

    return response;
}
