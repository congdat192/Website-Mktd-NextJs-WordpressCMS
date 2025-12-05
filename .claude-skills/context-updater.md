# CONTEXT UPDATER V1.1

## Mục đích
Skill này giúp cập nhật file documentation (CLAUDE.md, CONTEXT.md, hoặc module-specific docs) sau khi hoàn thành một feature/fix, đảm bảo documentation luôn đồng bộ với codebase.

---

## 🎯 TRIGGER KEYWORDS

Kích hoạt skill khi user nói:
- "update context", "cập nhật CLAUDE.md", "update CONTEXT.md"
- "nhớ ghi lại phần này vào doc", "document lại feature này"
- "viết tóm tắt để cập nhật CLAUDE.md", "update guideline cho edge function này"
- "dùng skill context updater", "chạy context updater"
- "ghi nhớ lại những gì đã làm", "lưu vào documentation"

---

## ⚙️ CHẾ ĐỘ HOẠT ĐỘNG

### Mode 1: Proposal (Mặc định)
- Chỉ tạo block markdown đề xuất
- User review trước khi apply
- Output: Code block markdown để copy

### Mode 2: Apply
- Trực tiếp chỉnh sửa file documentation
- Chỉ dùng khi user yêu cầu rõ: "apply luôn", "cập nhật trực tiếp"
- Mô tả chính xác vị trí chèn nội dung

**Trigger mode:**
- "đề xuất update" / "proposal" → Mode 1
- "apply luôn" / "cập nhật trực tiếp" / "ghi vào file" → Mode 2

---

## 🔗 KẾT NỐI VỚI CÁC SKILL KHÁC

### Workflow chuẩn sau khi implement feature:

```
PLAN CREATOR V2.0          PLAN REVIEWER V1.0         CONTEXT UPDATER V1.1
      │                           │                           │
      ▼                           ▼                           ▼
  Tạo PLAN ──────────────► Review PLAN ──────────────► Update Docs
                                  │
                            (Implement)
                                  │
                                  ▼
                          Hoàn thành feature
```

**Sau khi PLAN-[FEATURE].md được implement xong và review:**
1. Dùng CONTEXT UPDATER để:
   - Thêm Feature vào "Feature Documentation"
   - Thêm lỗi mới vào "Common Errors & Fixes"
   - Cập nhật "Edge Function Guidelines"
   - Link tới PLAN file gốc

---

## 📁 XÁC ĐỊNH FILE CẦN UPDATE

### Bảng mapping loại thay đổi → File

| Loại thay đổi | File ưu tiên | Fallback |
|---------------|--------------|----------|
| Core kiến trúc, coding standards | `CLAUDE.md` | - |
| Module Affiliate (F0 Portal) | `docs/affiliate.md` | `CLAUDE.md` section Affiliate |
| Module Voucher/Marketing | `docs/voucher.md` | `CLAUDE.md` |
| Webhook KiotViet | `docs/webhook-kiotviet.md` | `CLAUDE.md` section Webhook |
| Database schema | `CLAUDE.md` section Database | - |
| Common Errors | `CLAUDE.md` section Errors | - |
| Edge Functions | `CLAUDE.md` hoặc module-specific | - |

### Quy tắc chọn file:
1. **Kiểm tra file tồn tại** trước khi quyết định
2. **Ưu tiên module-specific** nếu có (tránh phình CLAUDE.md)
3. **Fallback về CLAUDE.md** nếu không có file riêng
4. **Không tạo file mới** trừ khi user yêu cầu

---

## ⚠️ RULE QUAN TRỌNG: KHÔNG ĐƯỢC BỊA

### Anti-Hallucination Rules:

1. **Chỉ document những gì đã thực sự implement trong session hiện tại**
   - Có file đã tạo/sửa → OK
   - Có SQL đã chạy → OK
   - Có Edge Function đã deploy → OK

2. **Nếu thiếu thông tin cụ thể:**
   ```markdown
   **Error:** [TODO: bổ sung error message cụ thể khi có log thực tế]
   ```

3. **Không tự tưởng tượng:**
   - ❌ Function/schema chưa tồn tại
   - ❌ Error message chưa thấy
   - ❌ Workflow chưa implement

4. **Khi không chắc chắn:**
   - Hỏi user xác nhận trước khi document
   - Đánh dấu `[UNVERIFIED]` nếu cần

---

## Quy trình thực hiện

### Bước 1: Thu thập thông tin từ session

**Checklist - chỉ tick những gì ĐÃ LÀM trong session:**

```
□ Edge Functions mới/cập nhật? → Tên + version?
□ Database changes? → Table/view/RPC nào?
□ New error patterns? → Error message thực tế?
□ New coding patterns? → Code example từ file nào?
□ Files đã tạo/sửa? → List paths
□ PLAN file liên quan? → PLAN-[NAME].md
```

**Nguồn dữ liệu tin cậy:**
- Files đã Read/Edit trong session
- SQL đã Execute
- Edge Functions đã Deploy
- Conversation history với user

### Bước 2: Xác định file và section cần cập nhật

Map thay đổi → section:

| Loại thay đổi | Section trong CLAUDE.md |
|---------------|------------------------|
| Database schema | `## Database Schema Architecture` |
| Edge Function | `## Edge Function Guidelines` hoặc section riêng |
| Common error | `## Common Errors & Fixes` |
| Frontend pattern | `## Frontend Patterns` |
| Service/Hook | `## Development Patterns` |
| Affiliate module | `## 👥 Affiliate Module` |
| Webhook | `## 🔔 Webhook` section |

### Bước 3: Format nội dung mới

*(Xem Templates bên dưới)*

### Bước 4: Output theo Mode

**Mode Proposal:**
```markdown
## 📝 Đề xuất cập nhật CLAUDE.md

### Vị trí chèn:
Section: [tên section]
Sau dòng: [line number hoặc marker text]

### Nội dung đề xuất:
\`\`\`markdown
[content here]
\`\`\`

### Lý do:
[Giải thích tại sao cần thêm]
```

**Mode Apply:**
- Sử dụng Edit tool để chèn nội dung
- Update version number
- Update Last Updated date

### Bước 5: Tạo summary

```markdown
## 📝 Documentation Updated

### Changes made:
- [Section 1]: Added [description]
- [Section 2]: Updated [description]

### Source:
- Session: [mô tả ngắn session]
- Related PLAN: `PLAN-[NAME].md` (nếu có)

### Files affected:
- `CLAUDE.md` (hoặc file khác)

### Version: X.X.X → X.X.X
```

---

## 📋 TEMPLATES

### Template A: Common Error Documentation

```markdown
### [Số thứ tự]. ❌ [Tên lỗi ngắn gọn]

**Context:** [Trong tình huống nào xuất hiện? VD: khi sync invoice từ KiotViet, khi gọi webhook voucher...]

**Related Feature/Module:** [Tên feature: Voucher Telesales, KiotViet Invoice Sync, Affiliate Commission...]

**Error:**
```
[Error message thực tế - copy từ log]
```

**Cause:** [Nguyên nhân root cause]

**Fix:**
```[language]
// ❌ WRONG - [Giải thích tại sao sai]
[old code]

// ✅ CORRECT - [Giải thích tại sao đúng]
[new code]
```

**Files affected:** [Danh sách files]

**Prevention:** [Cách tránh lặp lại trong tương lai]
```

### Template B: Feature Documentation

```markdown
## 🆕 [Feature Name]

### Related Plan
- `PLAN-[FEATURE-NAME].md`

### Overview
[Mô tả tổng quan feature - 2-3 câu]

### Database Schema
```sql
-- Tables/Views involved
[schema].[table_name]
-- Columns: [list key columns]
```

### Edge Functions
| Function | Version | Purpose |
|----------|---------|---------|
| `[name]` | vXX | [purpose] |

### Frontend Components
```
src/modules/[module]/
├── pages/[Page].tsx
├── components/[Component].tsx
└── services/[service].ts
```

### Key Logic
```typescript
// [Mô tả logic quan trọng]
[code snippet]
```

### Usage Flow
```
Step 1 → Step 2 → Step 3
```
```

### Template C: Edge Function Documentation

```markdown
## 🔧 Edge Function: `[function-name]`

### Related Plan
- `PLAN-[NAME].md` (nếu có)

### Purpose
[Mô tả ngắn gọn - 1 câu]

### Version History
| Version | Date | Changes |
|---------|------|---------|
| vXX | YYYY-MM-DD | [changes] |

### Location
`supabase/functions/[function-name]/index.ts`

### Key Logic
```typescript
[Code snippet quan trọng - max 20 lines]
```

### Input/Output
```typescript
// Request
{ field1: type, field2: type }

// Response
{ success: boolean, data?: {...}, error?: string }
```

### Usage from FE
```typescript
const { data } = await supabase.functions.invoke('[function-name]', {
  body: { ... }
});
```
```

### Template D: Quick Reference

```markdown
### [Category]: [Item]

**Location:** `[file path]`
**Related:** [PLAN/Feature name]

**Purpose:** [One-line description]

**Example:**
```typescript
[Usage example - max 10 lines]
```
```

---

## 📊 VERSION GUIDELINES

### Semantic Versioning cho CLAUDE.md

```
MAJOR.MINOR.PATCH

MAJOR: Đổi cấu trúc lớn của file (thêm/xóa section chính)
MINOR: Thêm section mới, thêm feature documentation
PATCH: Chỉnh sửa nhỏ, typo, clarification
```

### Vị trí version trong file:
- **Cuối file** CLAUDE.md có block:
```markdown
---
**Last Updated:** YYYY-MM-DD
**Version:** X.X.X
**Maintainer:** AI Development Team
```

### Khi update:
1. Tăng version number theo semantic versioning
2. Update Last Updated date
3. (Optional) Thêm vào Version History table nếu có

---

## 🌐 STYLE GUIDELINES

### Ngôn ngữ:

| Element | Language | Example |
|---------|----------|---------|
| Section headers | English | `## Common Errors & Fixes` |
| Mô tả, giải thích | Vietnamese + EN terms | "Lỗi xảy ra khi gọi Edge Function" |
| Function/table names | English (giữ nguyên) | `get-f0-dashboard-stats`, `f1_customer_orders` |
| Code comments | English | `// Check if locked` |
| Error messages | Giữ nguyên từ source | Copy từ log |

### Format:
- Dùng emoji cho visual scanning (🔧, ❌, ✅, 📝)
- Code blocks có syntax highlighting
- Tables cho structured data
- Bullet points cho lists

---

## ✅ CHECKLIST TRƯỚC KHI HOÀN TẤT

### Content Quality:
- [ ] Nội dung chỉ từ những gì đã làm trong session?
- [ ] Không có thông tin bịa/assume?
- [ ] Code examples lấy từ actual files?
- [ ] Error messages là real errors?

### Format:
- [ ] Markdown format đúng?
- [ ] Syntax highlighting đúng language?
- [ ] Links/references chính xác?
- [ ] Consistent với existing style?

### Metadata:
- [ ] Version number updated?
- [ ] Last Updated date updated?
- [ ] Related PLAN linked?

### Structure:
- [ ] Đúng file (CLAUDE.md vs module-specific)?
- [ ] Đúng section?
- [ ] Không duplicate content?
- [ ] TOC cần update không?

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12-04 | Initial version |
| 1.1 | 2024-12-04 | Added: Trigger keywords, Anti-hallucination rules, Multi-file support, Skill integration, Mode Proposal/Apply, Enhanced templates, Version guidelines, Style guidelines |
