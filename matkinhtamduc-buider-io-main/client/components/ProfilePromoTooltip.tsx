import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoSlide {
  title: string;
  description: string;
}

const slides: PromoSlide[] = [
  {
    title: "Đăng ký mới nhận ngay",
    description: "Voucher GIẢM 15%",
  },
  {
    title: "Đăng ký mới nhận ngay",
    description: "50.000 CoolCash",
  },
];

interface ProfilePromoTooltipProps {
  onClose: () => void;
}

export const ProfilePromoTooltip = ({ onClose }: ProfilePromoTooltipProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-full right-0 sm:right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 flex sm:block flex-col sm:flex-col" style={{ marginRight: "5px" }}>
      {/* Arrow pointing up to profile icon */}
      <div className="absolute -top-1.5 right-8 sm:right-12 w-3 h-3 bg-white rotate-45 border-l border-t border-gray-200 shadow-sm"></div>

      {/* Tooltip content - Smaller size */}
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-48 sm:w-56 mr-1.5 sm:mr-0 flex sm:block flex-col sm:flex-col justify-center sm:justify-start items-start h-auto sm:h-auto sm:w-56 sm:pr-0 sm:mr-0 sm:mr-6" style={{ width: "172px", paddingRight: "4px", marginRight: "8px" }}>
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
        </Button>

        {/* TĐ Member Badge */}
        <div className="mb-2">
          <div className="inline-flex items-center gap-0.5 bg-green-700 sm:bg-blue-600 text-white px-2 py-1 sm:py-1 rounded-md font-bold text-xs shadow-sm" style={{ paddingTop: "4px" }}>
            <span className="tracking-tight">TĐ</span>
            <span className="bg-white text-green-700 sm:text-blue-600 px-1.5 py-0.5 rounded text-xs font-extrabold">Member</span>
          </div>
        </div>

        {/* Fixed title and sliding description */}
        <div className="text-gray-700 font-medium text-xs mb-0">
          Đăng ký mới nhận ngay
        </div>

        {/* Slider content - only description slides */}
        <div className="relative overflow-hidden h-6 flex sm:block flex-col sm:flex-col items-stretch" style={{ lineHeight: "16px" }}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full flex-shrink-0"
              >
                <div className="text-gray-900 font-bold text-sm sm:text-base leading-tight">
                  {slide.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
