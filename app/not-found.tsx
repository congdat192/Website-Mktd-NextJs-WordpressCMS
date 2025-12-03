import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Không tìm thấy trang
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}
