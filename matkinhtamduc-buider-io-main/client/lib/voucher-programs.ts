export type VoucherProgram = {
  id: string;
  kind: "VOUCHER" | "COUPON";
  title: string; // e.g., "50,000đ OFF" or "10% OFF"
  minOrder: number;
  startDate: string;
  color: "green" | "red";
  programName: string; // human friendly program name
  code?: string; // static code (if any)
  eligibility?: {
    newCustomerOnly?: boolean;
  };
};

export const VOUCHER_PROGRAMS: VoucherProgram[] = [
  { id: "welcome", kind: "COUPON", title: "50,000đ OFF", minOrder: 0, startDate: new Date().toISOString(), color: "green", programName: "WELCOME", code: "WELCOME", eligibility: { newCustomerOnly: true } },
  { id: "v1", kind: "VOUCHER", title: "50,000đ OFF", minOrder: 300000, startDate: "2025-10-08T00:00:00", color: "green", programName: "Chương trình Tết Nguyên Đán" },
  { id: "v2", kind: "COUPON", title: "49% OFF", minOrder: 300000, startDate: "2025-10-03T00:00:00", color: "red", programName: "Black Friday Sale 2024" },
  { id: "v3", kind: "COUPON", title: "10% OFF", minOrder: 300000, startDate: "2025-10-10T00:00:00", color: "red", programName: "Khuyến mãi sinh nhật" },
  { id: "v4", kind: "COUPON", title: "5% OFF (Max 500K)", minOrder: 300000, startDate: "2025-10-10T00:00:00", color: "red", programName: "Thành viên VIP" },
  { id: "v5", kind: "COUPON", title: "40% OFF", minOrder: 300000, startDate: "2025-10-10T00:00:00", color: "red", programName: "Flash Sale cuối tuần" },
  { id: "v6", kind: "VOUCHER", title: "100,000đ OFF", minOrder: 300000, startDate: "2025-10-10T00:00:00", color: "green", programName: "Khuyến mãi mùa hè" },
];

import { getCurrentUser } from "./auth";

export const getUserVoucherPrograms = (phone?: string | null): VoucherProgram[] => {
  const raw = phone || getCurrentUser()?.phone || "";
  const p = (raw || "").replace(/\D/g, ""); // normalize
  const nowIso = new Date().toISOString();
  const mk = (
    id: string,
    kind: "VOUCHER" | "COUPON",
    title: string,
    minOrder: number,
    programName: string,
    color: "green" | "red" = kind === "VOUCHER" ? "green" : "red",
  ): VoucherProgram => ({ id, kind, title, minOrder, startDate: nowIso, color, programName });

  switch (p) {
    case "0909000001":
      return [
        mk("u1_200k_1500k", "VOUCHER", "200,000đ OFF", 1500000, "Sinh nhật tháng này - Giảm 200K"),
        mk("u1_100k_1000k", "VOUCHER", "100,000đ OFF", 1000000, "Sinh nhật tháng này - Giảm 100K"),
        mk("u1_50pct_frames_sunglasses", "COUPON", "50% OFF", 0, "Coupon 50% Gọng kính, kính mát"),
      ];
    case "0909000002":
      return [
        mk("u2_500k_5000k", "VOUCHER", "500,000đ OFF", 5000000, "VIP - Giảm 500K cho hóa đơn 5,000K"),
        mk("u2_2000k_5000k", "VOUCHER", "2,000,000đ OFF", 5000000, "VIP - Giảm 2,000K cho hóa đơn 5,000K"),
      ];
    case "0909000003":
      return [
        mk("u3_50pct_sunglasses", "VOUCHER", "50% OFF", 0, "Giảm 50% kính mát (mua trong tháng)"),
        mk("u3_100k_500k", "VOUCHER", "100,000đ OFF", 500000, "Giảm 100K cho hóa đơn 500K (mua trong tháng)"),
      ];
    default:
      return [
        mk("new_50k_300k", "VOUCHER", "50,000đ OFF", 300000, "Khách mới - Giảm 50K cho hóa đơn 300K"),
        mk("new_200k_korean_lens", "VOUCHER", "200,000đ OFF", 0, "Giảm 200K tròng kính Hàn Quốc"),
        mk("new_299k_povino_frame", "VOUCHER", "299,000đ OFF", 0, "Giảm 299K gọng kính POVINO"),
        mk("new_500k_lens_with_rayban", "VOUCHER", "500,000đ OFF", 0, "Tròng kính 500K khi mua gọng kính Rayban"),
      ];
  }
};

export const getAllVoucherProgramsForCurrentUser = (): VoucherProgram[] => {
  const u = getCurrentUser();
  return getUserVoucherPrograms(u?.phone);
};
