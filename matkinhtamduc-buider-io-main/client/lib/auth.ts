// Mock authentication service for demo purposes

// Simulate existing customers database
const EXISTING_CUSTOMERS: Customer[] = [
  // Demo existing numbers
  { phone: "0901234567", name: "Nguyễn Văn A", password: "123456", gender: "male", birthDate: "1990-01-15" },
  { phone: "0987654321", name: "Trần Thị B", password: "abcdef", gender: "female", birthDate: "1985-05-20" },
  { phone: "0912345678", name: "Lê Văn C", password: "password", gender: "male", birthDate: "1992-10-10" },
  // Phone-based voucher mock users
  { phone: "0909000001", name: "Khách sinh nhật", gender: "male", birthDate: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-15`; })() },
  { phone: "0909000002", name: "Khách VIP", gender: "female", birthDate: "1990-06-20" },
  { phone: "0909000003", name: "Khách mua trong tháng", gender: "male", birthDate: "1995-03-10" },
];

// Mock current user state
let currentUser: { phone: string; name: string } | null = null;

// Mock OTP storage (in real app, this would be server-side)
let otpStorage: { [phone: string]: string } = {};

const emitAuthChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-changed"));
  }
};

export interface Customer {
  phone: string;
  name: string;
  password?: string;
  gender?: "male" | "female" | "other";
  birthDate?: string;
  email?: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  exists?: boolean;
  otp?: string; // For demo purposes only
}

// Check if phone number exists in database
export const checkPhoneExists = async (phone: string): Promise<{ exists: boolean; customer?: Customer }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const customer = EXISTING_CUSTOMERS.find(c => c.phone === phone);
  return {
    exists: !!customer,
    customer: customer ? { phone: customer.phone, name: customer.name } : undefined
  };
};

// Send OTP (mock implementation)
export const sendOTP = async (phone: string): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock OTP (for demo, always use 1234)
  const otp = "1234";
  otpStorage[phone] = otp;

  return {
    success: true,
    message: `OTP đã được gửi đến số ${phone}`,
    otp: otp // In real app, this wouldn't be returned
  };
};

// Verify OTP
export const verifyOTP = async (phone: string, otp: string): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const storedOTP = otpStorage[phone];

  if (!storedOTP) {
    return {
      success: false,
      message: "OTP đã hết hạn. Vui lòng gửi lại."
    };
  }

  if (storedOTP !== otp) {
    return {
      success: false,
      message: "Mã OTP không chính xác. Vui lòng thử lại."
    };
  }

  // Clear OTP after successful verification
  delete otpStorage[phone];

  return {
    success: true,
    message: "Xác thực OTP thành công"
  };
};

// Register new customer
export const registerCustomer = async (customerData: {
  phone: string;
  name: string;
  password?: string;
  gender?: "male" | "female" | "other";
  birthDate?: string;
  email?: string;
}): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Upsert customer: if đã auto-tạo sau OTP, cho phép hoàn tất hồ sơ thay vì báo trùng
  const idx = EXISTING_CUSTOMERS.findIndex(c => c.phone === customerData.phone);
  if (idx >= 0) {
    const prev = EXISTING_CUSTOMERS[idx];
    EXISTING_CUSTOMERS[idx] = {
      ...prev,
      phone: customerData.phone,
      name: customerData.name || prev.name || "Khách hàng",
      password: customerData.password ?? prev.password,
      gender: customerData.gender ?? prev.gender,
      birthDate: customerData.birthDate ?? prev.birthDate,
      email: customerData.email ?? (prev as any).email,
    } as Customer;
  } else {
    EXISTING_CUSTOMERS.push({
      phone: customerData.phone,
      name: customerData.name,
      password: customerData.password,
      gender: customerData.gender,
      birthDate: customerData.birthDate,
      email: customerData.email,
    });
  }

  currentUser = { phone: customerData.phone, name: customerData.name };
  emitAuthChanged();
  // Best-effort persist profile to Supabase
  (async () => {
    try {
      const { supabase } = await import("./supabase");
      await supabase.from("profiles").upsert({
        phone: customerData.phone,
        name: customerData.name,
        email: customerData.email ?? null,
        gender: customerData.gender ?? null,
        birthday: customerData.birthDate ?? null,
      }, { onConflict: "phone" as any });
    } catch {}
  })();
  return { success: true, message: "Cập nhật thông tin thành công" };
};

// Login existing customer with phone (OTP verified)
export const loginCustomer = async (phone: string): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let customer = EXISTING_CUSTOMERS.find(c => c.phone === phone);
  if (!customer) {
    // Auto-create minimal customer for OTP flow (treat as khách hàng mới)
    customer = { phone, name: "Khách mới" } as any;
    EXISTING_CUSTOMERS.push(customer as any);
  }

  currentUser = { phone: customer.phone, name: customer.name };
  emitAuthChanged();
  // Best-effort persist minimal profile to Supabase
  (async () => {
    try {
      const { supabase } = await import("./supabase");
      await supabase.from("profiles").upsert({
        phone: customer.phone,
        name: customer.name,
        gender: customer.gender ?? null,
        birthday: customer.birthDate ?? null,
        email: (customer as any).email ?? null,
      }, { onConflict: "phone" as any });
    } catch {}
  })();
  return { success: true, message: "Đăng nhập thành công" };
};

// Login with phone and password
export const loginWithPassword = async (phone: string, password: string): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const customer = EXISTING_CUSTOMERS.find(c => c.phone === phone);
  if (!customer) {
    return {
      success: false,
      message: "Số điện thoại chưa được đ��ng ký"
    };
  }

  if (customer.password !== password) {
    return {
      success: false,
      message: "Mật khẩu không chính xác"
    };
  }

  // Set current user
  currentUser = {
    phone: customer.phone,
    name: customer.name
  };

  // Notify listeners about auth change
  emitAuthChanged();

  return {
    success: true,
    message: "Đăng nhập thành công"
  };
};

// Get current user
export const getCurrentUser = (): { phone: string; name: string } | null => {
  return currentUser;
};

export const setCurrentUser = (user: { phone: string; name: string } | null) => {
  currentUser = user;
  emitAuthChanged();
};

// Logout
export const logout = (): void => {
  currentUser = null;
  emitAuthChanged();
};

// Validate Vietnamese phone number
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove spaces and special characters
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');

  // Check Vietnamese phone format
  const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return phoneRegex.test(cleanPhone);
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');

  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }

  return phone;
};
