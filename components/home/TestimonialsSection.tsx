'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'Nguyễn Văn An',
        role: 'Doanh nhân',
        avatar: null,
        rating: 5,
        content: 'Dịch vụ kiểm tra mắt rất chuyên nghiệp. Nhân viên tư vấn nhiệt tình, giúp tôi chọn được gọng kính phù hợp với gương mặt. Rất hài lòng!',
    },
    {
        id: 2,
        name: 'Trần Thị Bích',
        role: 'Giáo viên',
        avatar: null,
        rating: 5,
        content: 'Mua tròng kính chống ánh sáng xanh tại đây, chất lượng rất tốt. Giảm mỏi mắt đáng kể khi làm việc với máy tính.',
    },
    {
        id: 3,
        name: 'Lê Hoàng Minh',
        role: 'Sinh viên',
        avatar: null,
        rating: 5,
        content: 'Giá cả hợp lý, nhiều mẫu mã đẹp. Bảo hành 12 tháng nên rất yên tâm. Sẽ giới thiệu cho bạn bè!',
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                        }`}
                />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                        Đánh giá khách hàng
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Khách hàng nói gì về chúng tôi
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Hơn 10.000 khách hàng tin tưởng sử dụng dịch vụ của Mắt Kính Tâm Đức
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-soft 
                                     hover:shadow-elevated transition-all duration-300 
                                     hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10 
                                            group-hover:text-primary/20 transition-colors" />

                            {/* Rating */}
                            <div className="mb-4">
                                <StarRating rating={testimonial.rating} />
                            </div>

                            {/* Content */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark 
                                              flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
