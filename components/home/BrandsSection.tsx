'use client';

import { useEffect, useRef } from 'react';

const brands = [
    { name: 'Seeson', logo: null },
    { name: 'Police', logo: null },
    { name: 'Furla', logo: null },
    { name: 'FreshVue', logo: null },
    { name: 'Chemi', logo: null },
    { name: 'Essilor', logo: null },
];

export function BrandsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let scrollPosition = 0;

        const animate = () => {
            scrollPosition += 0.5;
            if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                scrollPosition = 0;
            }
            scrollContainer.scrollLeft = scrollPosition;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <section className="py-12 bg-white border-y border-gray-100">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
                    Thương hiệu đối tác
                </p>

                <div
                    ref={scrollRef}
                    className="flex gap-12 overflow-hidden"
                    style={{ scrollBehavior: 'auto' }}
                >
                    {/* Duplicate for infinite scroll effect */}
                    {[...brands, ...brands].map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}`}
                            className="flex-shrink-0 flex items-center justify-center w-32 h-16 
                                       grayscale hover:grayscale-0 opacity-60 hover:opacity-100
                                       transition-all duration-300 cursor-pointer"
                        >
                            {brand.logo ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-xl font-bold text-gray-400 hover:text-primary transition-colors">
                                    {brand.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
