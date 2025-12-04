import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { WPPost } from '@/lib/wordpress';

interface RelatedPostsProps {
    posts: WPPost[];
    currentPostId: number;
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
    // Filter out current post and limit to 3
    const relatedPosts = posts
        .filter(post => post.id !== currentPostId)
        .slice(0, 3);

    if (relatedPosts.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 pt-12 border-t border-[#E5E5E5]">
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Bài viết liên quan</h2>

            <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
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
                            <CardContent className="p-4">
                                <h3 className="text-lg font-bold text-[#333333] mb-2 line-clamp-2 hover:text-[#228B22] transition">
                                    {post.title.rendered}
                                </h3>

                                <div className="flex items-center gap-2 text-xs text-[#666666]">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(post.date)}</span>
                                </div>

                                <div className="flex items-center text-[#228B22] text-sm font-semibold mt-3">
                                    Đọc thêm
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
