import Link from 'next/link';
import { getPosts, type WPPost } from '@/lib/wordpress';

export default async function HomePage() {
    // Fetch latest 3 posts for the news section
    let latestPosts: WPPost[] = [];
    try {
        latestPosts = await getPosts({ perPage: 3 });
    } catch (error) {
        console.error('Failed to fetch latest posts:', error);
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Mắt Kính Tâm Đức
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Hệ thống mắt kính uy tín với hơn 20 năm kinh nghiệm.
                        Chất lượng cao, giá cả hợp lý, phục vụ tận tâm.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/blog"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Xem tin tức
                        </Link>
                        <Link
                            href="/pages/gioi-thieu"
                            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Về chúng tôi
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Dịch vụ của chúng tôi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Sản phẩm đa dạng</h3>
                            <p className="text-gray-600">
                                Gọng kính, tròng kính, kính mát từ các thương hiệu nổi tiếng
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Chất lượng đảm bảo</h3>
                            <p className="text-gray-600">
                                Sản phẩm chính hãng, bảo hành dài hạn
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Hệ thống cửa hàng</h3>
                            <p className="text-gray-600">
                                Nhiều chi nhánh trên toàn quốc, phục vụ tận nơi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest News Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold">Tin tức mới nhất</h2>
                        <Link
                            href="/blog"
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Xem tất cả →
                        </Link>
                    </div>

                    {latestPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {latestPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                        <div className="aspect-video bg-gray-200">
                                            <img
                                                src={post._embedded['wp:featuredmedia'][0].source_url}
                                                alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <time className="text-sm text-gray-500">
                                            {new Date(post.date).toLocaleDateString('vi-VN')}
                                        </time>
                                        <h3 className="text-xl font-semibold mt-2 mb-3">
                                            <Link
                                                href={`/ ${post.slug} `}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {post.title.rendered}
                                            </Link>
                                        </h3>
                                        <div
                                            className="text-gray-600 line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                        />
                                        <Link
                                            href={`/ ${post.slug} `}
                                            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            Đọc thêm →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">
                            Chưa có bài viết nào. Vui lòng kiểm tra cấu hình WordPress API.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
