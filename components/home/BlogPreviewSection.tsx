import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User } from 'lucide-react';

// Custom interface for blog preview posts (transformed from GraphQL)
interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    date?: string;
    author?: string;
    featuredImage?: {
        url: string;
        alt?: string;
    } | null;
}

interface BlogPreviewSectionProps {
    posts: BlogPost[];
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
    if (posts.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                            Blog
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Tin tức &amp; Mẹo chăm sóc mắt
                        </h2>
                        <p className="text-lg text-gray-600">
                            Kiến thức hữu ích về kính mắt và sức khỏe thị lực
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary font-medium 
                                 hover:text-primary-dark transition-colors group"
                    >
                        Xem tất cả
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {posts.slice(0, 3).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="h-full bg-white rounded-2xl overflow-hidden 
                                              border border-gray-100 hover:border-primary/20
                                              shadow-sm hover:shadow-card transition-all duration-300
                                              hover:-translate-y-1">
                                {/* Image */}
                                <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                                    {post.featuredImage ? (
                                        <Image
                                            src={post.featuredImage.url}
                                            alt={post.featuredImage.alt || post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                            <span className="text-4xl">📰</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        {post.date && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(post.date).toLocaleDateString('vi-VN')}
                                            </span>
                                        )}
                                        {post.author && (
                                            <span className="flex items-center gap-1">
                                                <User className="w-3.5 h-3.5" />
                                                {post.author}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 
                                                  line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    {post.excerpt && (
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {post.excerpt.replace(/<[^>]*>/g, '')}
                                        </p>
                                    )}

                                    {/* Read more */}
                                    <span className="inline-flex items-center gap-1 text-primary font-medium text-sm
                                                   group-hover:gap-2 transition-all">
                                        Đọc thêm
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
