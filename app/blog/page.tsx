import Link from 'next/link';
import { getPosts, type WPPost } from '@/lib/wordpress';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tin tức - Mắt Kính Tâm Đức',
    description: 'Tin tức, bài viết về mắt kính, sức khỏe mắt và xu hướng thời trang',
};

export default async function BlogPage() {
    let posts: WPPost[] = [];
    let error = null;

    try {
        posts = await getPosts({ perPage: 20 });
    } catch (err) {
        error = err;
        console.error('Failed to fetch posts:', err);
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Tin tức</h1>
                <p className="text-gray-600 mb-12">
                    Cập nhật tin tức mới nhất về mắt kính, sức khỏe mắt và xu hướng thời trang
                </p>

                {error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-600 font-semibold mb-2">
                            Không thể tải bài viết
                        </p>
                        <p className="text-sm text-gray-600">
                            Vui lòng kiểm tra cấu hình NEXT_PUBLIC_WP_API_URL trong file .env.local
                        </p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <p className="text-gray-600">
                            Chưa có bài viết nào.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="md:flex">
                                    {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                        <div className="md:w-1/3 bg-gray-200">
                                            <img
                                                src={post._embedded['wp:featuredmedia'][0].source_url}
                                                alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 md:w-2/3">
                                        <time className="text-sm text-gray-500">
                                            {new Date(post.date).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                        <h2 className="text-2xl font-bold mt-2 mb-3">
                                            <Link
                                                href={`/${post.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {post.title.rendered}
                                            </Link>
                                        </h2>
                                        <div
                                            className="text-gray-600 line-clamp-3 mb-4"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                        />
                                        <Link
                                            href={`/${post.slug}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                                        >
                                            Đọc thêm
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
