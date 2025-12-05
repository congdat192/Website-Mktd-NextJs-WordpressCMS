import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronUp, Info } from "lucide-react";
import { CouponCode, parseDiscountFromTitle } from "@/lib/vouchers";
import type { VoucherProgram } from "@/lib/voucher-programs";

interface VoucherCardProps {
  program: VoucherProgram;
  claimed: CouponCode | undefined;
  isExpanded: boolean;
  isClaiming: boolean;
  onExpandClick: () => void;
  onCollapseClick: () => void;
  onClaimClick: () => void;
  onDetailsClick: () => void;
}

export function VoucherCard({
  program,
  claimed,
  isExpanded,
  isClaiming,
  onExpandClick,
  onCollapseClick,
  onClaimClick,
  onDetailsClick,
}: VoucherCardProps) {
  const parsed = parseDiscountFromTitle(program.title);

  if (!isExpanded) {
    return (
      <button
        onClick={onExpandClick}
        className="px-4 py-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-medium text-sm transition-all border border-orange-200 hover:border-orange-300 cursor-pointer whitespace-nowrap"
      >
        Giam {parsed.discount || "??"}
      </button>
    );
  }

  return (
    <div className="bg-white border-2 border-red-300 rounded-xl p-4 shadow-lg space-y-3 w-full sm:max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-red-600 font-bold text-base">{program.title}</div>
          <div className="text-sm text-gray-900 font-medium mt-1">{program.programName}</div>
        </div>
        <button onClick={onCollapseClick} className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Dieu kien:</span>
          <span className="text-gray-900 font-medium">
            {program.minOrder ? `Don toi thieu ${program.minOrder.toLocaleString()}d` : "Khong yeu cau"}
          </span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>HSD:</span>
          <span className="text-gray-900 font-medium">{claimed?.validUntil ?? ""}</span>
        </div>
        {parsed.type === "percentage" && parsed.maxDiscount && (
          <div className="flex justify-between text-gray-700">
            <span>Toi da giam:</span>
            <span className="text-gray-900 font-medium">{parsed.maxDiscount.toLocaleString()}d</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex-1 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all flex items-center justify-center gap-1"
                onClick={onDetailsClick}
              >
                <Info className="w-4 h-4" />
                Chi tiet
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs max-w-xs">
              Xem chi tiet dieu kien cua voucher
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          size="sm"
          onClick={onClaimClick}
          disabled={isClaiming || !!claimed}
          className="flex-1 h-9 bg-red-500 hover:bg-red-600 text-white font-medium"
        >
          {isClaiming ? "Dang lay..." : claimed ? "Da lay" : "Lay"}
        </Button>
      </div>
    </div>
  );
}
