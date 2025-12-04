# Lessons Learned - Development Session Log

**Date**: December 4, 2024
**Session**: Homepage & Product Components Implementation

---

## 🐛 Errors Encountered

### 1. Header.tsx Syntax Error
**Error**: Expression expected, corrupted JSX
**Cause**: Multiple file replacements caused corruption
**Solution**: Complete file rewrite with `Overwrite=true`
**Lesson**: Use `write_to_file` instead of multiple `replace_file_content`

### 2. Button Component - Missing `asChild` Prop
**Error**: React does not recognize the `asChild` prop
**Cause**: Missing `@radix-ui/react-slot` dependency
**Solution**: 
- Install `@radix-ui/react-slot`
- Import `Slot` and use conditional rendering
**Lesson**: Check dependencies before using advanced props

### 3. Homepage Image - Event Handler in Server Component
**Error**: Event handlers cannot be passed to Client Component props
**Cause**: `onError` handler in Server Component
**Solution**: Remove `onError` and use direct URL
**Lesson**: Server Components cannot have event handlers

### 4. Products Page Syntax Error
**Error**: Expected '</', got 'jsx text'
**Cause**: File corruption during replacement
**Solution**: Complete file rewrite
**Lesson**: Same as #1 - avoid multiple replacements

### 5. ProductCard - Nested Anchor Tags
**Error**: In HTML, <a> cannot be a descendant of <a>
**Cause**: Link component inside Link component
**Solution**: Change inner Link to button with `window.location.href`
**Lesson**: Never nest interactive elements

### 6. ProductCard - Event Handler in Server Component
**Error**: Event handlers cannot be passed to Client Component props
**Cause**: ProductCard had onClick but no 'use client'
**Solution**: Add `'use client'` directive
**Lesson**: Always add 'use client' for components with interactivity

---

## ✅ Solutions Applied

1. **Always use complete file rewrites**
   - `write_to_file` with `Overwrite=true`
   - Avoid multiple `replace_file_content` calls

2. **Check Server vs Client Components**
   - Add `'use client'` for any component with:
     - Event handlers (onClick, onChange, etc.)
     - React hooks (useState, useEffect, etc.)
     - Browser APIs (window, document, etc.)

3. **Avoid nested interactive elements**
   - Use buttons instead of nested Links
   - Use `window.location.href` for navigation in buttons

4. **Install dependencies before using**
   - Check if package is installed
   - Install immediately when needed

---

## 🎯 Best Practices Established

### 1. Development Workflow
```
Plan → Create 2-3 components → Test → Fix → Commit → Repeat
```

### 2. Component Creation
- Define Server vs Client upfront
- Add 'use client' from the start if needed
- Write complete file in one go
- Test immediately

### 3. Error Prevention
- Use Decision Tree for Server vs Client
- Check for nested interactive elements
- Verify dependencies before coding
- Test after each batch of components

---

## 📊 Statistics

**Total Errors**: 6
**Time to Fix**: ~10 minutes
**Commits**: 8
**Files Fixed**: 4

**Error Categories**:
- File corruption: 2
- Server/Client confusion: 3
- Missing dependencies: 1

---

## 🚀 Improvements for Next Time

1. **Pre-flight Checklist**
   - [ ] List all components
   - [ ] Mark Server vs Client
   - [ ] Check dependencies
   - [ ] Plan component hierarchy

2. **During Development**
   - [ ] Create complete files
   - [ ] Add 'use client' immediately
   - [ ] Test after 2-3 components
   - [ ] Fix before continuing

3. **Before Commit**
   - [ ] Run build
   - [ ] Check browser console
   - [ ] Verify no hydration errors
   - [ ] Test on mobile

---

**Next Session**: Follow AI_GUIDELINES.md strictly to avoid these errors.
