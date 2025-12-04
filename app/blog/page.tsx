/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { getPosts } from '@/lib/graphql/posts';
import { graphQLPostsToWPPosts } from '@/lib/graphql-adapter';
import { Card, CardContent } from '@/components/ui';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata = {
    title: 'Blog - Mắt Kính Tâm Đức',
    description: 'Tin tức, kiến thức và hướng dẫn về mắt kính',
};

export default async function BlogPage() {
    let posts: any[] = [];

    try {
        const result = await getPosts({ first: 12 });
        const graphQLPosts = result.edges.map((edge: any) => edge.node);
        posts = graphQLPostsToWPPosts(graphQLPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#228B22] to-[#1a6b1a] text-white py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                        Tin tức, kiến thức và hướng dẫn chăm sóc mắt
                    </p>
                </div>
            </div>

            {/* Blog Posts */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[#666666] text-lg">Chưa có bài viết nào.</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {posts[0] && (
                            <div className="mb-12">
                                <Link href={`/${posts[0].slug}`}>
                                    <Card variant="elevated" padding="none" className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                                        <div className="grid md:grid-cols-2 gap-0">
                                            {/* Image */}
                                            {posts[0]._embedded?.['wp:featuredmedia']?.[0] && (
                                                <div className="relative aspect-video md:aspect-square overflow-hidden bg-[#F5F5F5]">
                                                    <img
                                                        src={posts[0]._embedded['wp:featuredmedia'][0].source_url}
                                                        alt={posts[0].title.rendered}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="p-6 md:p-8 flex flex-col justify-center">
                                                <div className="inline-block mb-4">
                                                    <span className="bg-[#228B22] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                        Nổi bật
                                                    </span>
                                                </div>

                                                <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4 hover:text-[#228B22] transition">
                                                    {posts[0].title.rendered}
                                                </h2>

                                                {posts[0].excerpt?.rendered && (
                                                    <div
                                                        className="text-[#666666] mb-6 line-clamp-3"
                                                        dangerouslySetInnerHTML={{ __html: posts[0].excerpt.rendered }}
                                                    />
                                                )}

                                                <div className="flex items-center gap-4 text-sm text-[#666666] mb-6">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(posts[0].date)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-[#228B22] font-semibold">
                                                    Đọc thêm
                                                    <ArrowRight className="w-5 h-5 ml-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        )}

                        {/* Posts Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.slice(1).map((post) => (
                                <Link key={post.id} href={`/${post.slug}`}>
                                    <Card variant="default" padding="none" className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                                        {/* Image */}
                                        {post._embedded?.['wp:featuredmedia']?.[0] && (
                                            <div className="relative aspect-video overflow-hidden bg-[#F5F5F5]">
                                                <img
                                                    src={post._embedded['wp:featuredmedia'][0].source_url}
                                                    alt={post.title.rendered}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold text-[#333333] mb-3 line-clamp-2 hover:text-[#228B22] transition min-h-[3.5rem]">
                                                {post.title.rendered}
                                            </h3>

                                            {post.excerpt?.rendered && (
                                                <div
                                                    className="text-sm text-[#666666] mb-4 line-clamp-3"
                                                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                                />
                                            )}

                                            <div className="flex items-center gap-2 text-xs text-[#666666]">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(post.date)}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
