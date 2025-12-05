import { VOUCHER_PROGRAMS, type VoucherProgram, getAllVoucherProgramsForCurrentUser } from "./voucher-programs";

export interface CouponCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string; // programName
  minOrder?: number;
  validUntil: string;
  maxDiscount?: number;
  programId?: string; // link back to program
}

const STORAGE_KEY = "claimedCoupons";

export const getClaimedCoupons = (): CouponCode[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CouponCode[];
  } catch {
    return [];
  }
};

// Fetch claimed coupons from Supabase for the current user and sync local cache
export const fetchClaimedCouponsForCurrentUser = async (): Promise<CouponCode[]> => {
  try {
    const { getCurrentUser } = await import("./auth");
    const u = getCurrentUser();
    if (!u) return getClaimedCoupons();
    const { supabase } = await import("./supabase");
    const { data, error } = await supabase
      .from("claimed_coupons")
      .select("program_id,code,discount,type,description,min_order,valid_until,max_discount")
      .eq("user_phone", u.phone);
    if (error) throw error;
    const rows = (data || []).map((r: any) => ({
      programId: r.program_id || undefined,
      code: r.code,
      discount: Number(r.discount) || 0,
      type: (r.type === "percentage" ? "percentage" : "fixed") as CouponCode["type"],
      description: r.description || "",
      minOrder: typeof r.min_order === "number" ? r.min_order : r.min_order ? Number(r.min_order) : undefined,
      validUntil: r.valid_until || "",
      maxDiscount: r.max_discount == null ? undefined : Number(r.max_discount),
    })) as CouponCode[];
    // Sync to local for fast access and broadcast update
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      window.dispatchEvent(new CustomEvent("claimed-coupons-updated"));
    }
    return rows;
  } catch {
    return getClaimedCoupons();
  }
};

export const saveClaimedCoupon = (coupon: CouponCode) => {
  if (typeof window === "undefined") return;
  const existing = getClaimedCoupons();
  const next = [
    ...existing.filter((c) => c.code !== coupon.code),
    coupon,
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("claimed-coupons-updated"));
  // Best-effort persist to Supabase (non-blocking)
  (async () => {
    try {
      const { getCurrentUser } = await import("./auth");
      const u = getCurrentUser();
      if (!u) return;
      const { supabase } = await import("./supabase");
      await supabase
        .from("claimed_coupons")
        .upsert({
          user_phone: u.phone,
          program_id: coupon.programId || null,
          code: coupon.code,
          discount: coupon.discount,
          type: coupon.type,
          description: coupon.description,
          min_order: coupon.minOrder ?? null,
          valid_until: coupon.validUntil || null,
          max_discount: coupon.maxDiscount ?? null,
        }, { onConflict: "user_phone,code" as any });
    } catch {}
  })();
};

export const parseAmount = (s: string): number => {
  if (!s) return 0;
  const kMatch = s.match(/(\d+[\d.,]*)\s*[kK]/);
  if (kMatch) return parseInt(kMatch[1].replace(/[^\d]/g, ""), 10) * 1000;
  const dMatch = s.match(/(\d+[\d.,]*)\s*(đ|d|vnđ)/i);
  if (dMatch) return parseInt(dMatch[1].replace(/[^\d]/g, ""), 10);
  return parseInt(s.replace(/[^\d]/g, ""), 10) || 0;
};

export const parseDiscountFromTitle = (
  title: string,
): { type: "percentage" | "fixed"; discount: number; maxDiscount?: number } => {
  const pct = title.match(/(\d+)\s*%/);
  if (pct) {
    const percent = parseInt(pct[1], 10);
    const cap = title.match(/max\s*([\d.,]+\s*[kK]|[\d.,]+\s*(?:đ|vnđ|d))/i);
    const maxDiscount = cap ? parseAmount(cap[1]) : undefined;
    return { type: "percentage", discount: percent, maxDiscount };
  }
  const fixed = title.match(/([\d.,]+)\s*(?:đ|vnđ|d)\s*off/i);
  if (fixed) {
    return { type: "fixed", discount: parseAmount(fixed[1]) };
  }
  return { type: "percentage", discount: 0 };
};

const generateVoucherCode = () => {
  const codes = ["NEW123ABC", "BD456DEF", "VIP789GHI", "CAMP012JKL", "SALE2024", "MEMBER10"];
  return codes[Math.floor(Math.random() * codes.length)] + Math.floor(Math.random() * 90 + 10);
};

const generateExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString("vi-VN");
};

const isNewCustomer = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const orderCountRaw = localStorage.getItem("orderCount");
    const hasPurchasedBefore = localStorage.getItem("hasPurchasedBefore");
    const orderCount = orderCountRaw ? parseInt(orderCountRaw, 10) : 0;
    if (hasPurchasedBefore === "true") return false;
    return orderCount <= 0;
  } catch {
    return true;
  }
};

export const claimVoucher = (programId: string): CouponCode => {
  const program: VoucherProgram | undefined = getAllVoucherProgramsForCurrentUser().find(v => v.id === programId);
  if (!program) throw new Error("Voucher program not found");

  if (program.eligibility?.newCustomerOnly && !isNewCustomer()) {
    throw new Error("Voucher chỉ áp dụng cho khách hàng mới");
  }

  const parsed = parseDiscountFromTitle(program.title);
  const coupon: CouponCode = {
    programId: program.id,
    code: program.code || generateVoucherCode(),
    discount: parsed.discount,
    type: parsed.type,
    description: program.programName,
    minOrder: program.minOrder,
    validUntil: generateExpiryDate(),
    maxDiscount: parsed.maxDiscount,
  };
  saveClaimedCoupon(coupon);
  return coupon;
};
