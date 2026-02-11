import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { getResumeFeedback } from '@/lib/resume-analyser';
import { db } from '@/db';
import { resumeFeedback } from '@/db/schema';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY ?? '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ?? '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ?? '',
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Invalid file type. Only PDF files are allowed.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: `resume-${Date.now()}.pdf`,
            folder: '/resumes',
        });

        const loader = new WebPDFLoader(file);
        const docs = await loader.load();
        console.log('Extracted text from PDF:', docs[0]);  //docs[0]?.pageContent

        // AI feedback logic can be added here using the extracted text

        const feedback = await getResumeFeedback({ userInput: docs[0]?.pageContent ?? "" });

        // persist resume + feedback to DB (userId can be provided by client)
        const userId = formData.get('userId')?.toString() ?? 'user-123';
        try {
            await db.insert(resumeFeedback).values({
                userId,
                resumeUrl: uploadResponse.url,
                feedback,
            });
        } catch (err) {
            console.error('Failed to save resume feedback to DB', err);
        }

        return NextResponse.json({ url: uploadResponse.url, fileId: uploadResponse.fileId, feedback: feedback });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
