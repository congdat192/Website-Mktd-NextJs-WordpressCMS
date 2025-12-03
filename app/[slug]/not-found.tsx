import Link from 'next/link';

export default function PageNotFound() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Không tìm thấy trang</h1>
                <p className="text-gray-600 mb-8">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}
