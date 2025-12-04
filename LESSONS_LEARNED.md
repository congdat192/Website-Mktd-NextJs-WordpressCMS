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

## 🔄 GraphQL Migration (December 4, 2024)

### Migration Summary
**Migrated**: Products page from REST API to GraphQL  
**Status**: ✅ Complete  
**Files Changed**: 7

### Errors Encountered

#### 1. Module Not Found - graphql-request
**Error**: `Module not found: Can't resolve 'graphql-request'`  
**Cause**: Package installed but dev server not restarted  
**Solution**: Kill server and restart after `npm install`  
**Lesson**: Always restart dev server after installing packages

#### 2. GraphQL Query - Missing Inline Fragments
**Error**: `Cannot query field "date" on type "ProductUnion"`  
**Cause**: `date` and `productCategories` need inline fragments  
**Solution**: Move fields into `... on SimpleProduct` and `... on VariableProduct`  
**Lesson**: WooCommerce products are unions - always use inline fragments

#### 3. Price Display - Formatted Strings
**Error**: Price showing as "1,92đ" instead of "1.920.000đ"  
**Cause**: GraphQL returns formatted price `"1.920.000 ₫"`  
**Solution**: Created `parsePrice()` helper to strip non-digits  
**Lesson**: GraphQL price format differs from REST API

### Solutions Applied

1. **GraphQL Client Setup**
   ```typescript
   // lib/graphql-client.ts
   import { GraphQLClient } from 'graphql-request';
   const graphqlClient = new GraphQLClient(endpoint, {
     next: { revalidate: 60 }
   });
   ```

2. **Inline Fragments Pattern**
   ```graphql
   ... on SimpleProduct {
     date
     price
     productCategories { nodes { name } }
   }
   ... on VariableProduct {
     date
     price
     productCategories { nodes { name } }
   }
   ```

3. **Price Parsing**
   ```typescript
   function parsePrice(priceString?: string): string {
     return priceString?.replace(/[^\d]/g, '') || '0';
   }
   ```

4. **Backward Compatibility**
   - Created `graphql-adapter.ts`
   - Converts GraphQL → REST API format
   - Existing components work without changes

### Best Practices Established

1. **GraphQL Query Structure**
   - Always use inline fragments for union types
   - Include `type` field to identify product type
   - Fetch only needed fields

2. **Migration Strategy**
   - Gradual migration (page by page)
   - Keep REST API as fallback
   - Use adapter for backward compatibility

3. **Testing Workflow**
   - Test queries in GraphiQL IDE first
   - Verify data structure
   - Check price formatting

### Files Created

- `lib/graphql-client.ts` - GraphQL client
- `lib/graphql/queries/products.ts` - Product queries
- `lib/graphql/products.ts` - GraphQL functions
- `lib/graphql-adapter.ts` - Data adapter
- `WPGRAPHQL_MIGRATION_GUIDE.md` - Migration guide
- `GRAPHQL_SETUP.md` - Setup instructions

### WordPress Plugins Required

- WPGraphQL
- WPGraphQL for WooCommerce

---

**Next Session**: Follow AI_GUIDELINES.md strictly to avoid these errors.

