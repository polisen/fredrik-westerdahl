import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata = {
    title: 'CV - Fredrik Westerdahl',
};

export default function CVPage() {
    return (
        <main className="w-full min-h-full px-8 md:px-24 py-8 md:py-24 max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto mt-20 md:mt-0 h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 rounded-full p-8 mb-6">
                    <FileText size={48} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold mb-4">Curriculum Vitae</h1>
                <p className="text-gray-600 mb-8 max-w-md">
                    A summary of my professional experience, skills, and projects.
                </p>
                <Link
                    href="/fredrik_westerdahl_cv.pdf"
                    target="_blank"
                    className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Download PDF
                </Link>
            </div>
        </main>
    );
}
