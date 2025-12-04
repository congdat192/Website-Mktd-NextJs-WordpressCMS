# AI Development Guidelines - Next.js 15 + WordPress Headless CMS

> **Purpose**: Prevent common errors and maintain code quality when developing with AI assistance.
> **Last Updated**: December 4, 2024
> **Project**: Mắt Kính Tâm Đức - WordPress Headless CMS

---

## 🚨 Critical Rules - MUST FOLLOW

### 1. Server vs Client Components (Next.js 15 App Router)

#### ❌ NEVER DO:
```tsx
// Server Component with event handler - WRONG!
export default function Page() {
  return (
    <button onClick={() => console.log('click')}>
      Click me
    </button>
  );
}
```

#### ✅ ALWAYS DO:
```tsx
// Client Component with 'use client' directive
'use client';

export default function Page() {
  return (
    <button onClick={() => console.log('click')}>
      Click me
    </button>
  );
}
```

#### Decision Tree:
```
Does component have:
├─ onClick, onChange, onSubmit? → 'use client'
├─ useState, useEffect, hooks? → 'use client'
├─ Browser APIs (window, document)? → 'use client'
├─ Event handlers (onError, onLoad)? → 'use client'
└─ None of above? → Server Component (default)
```

---

### 2. Nested Interactive Elements

#### ❌ NEVER DO:
```tsx
// Nested <a> tags - CAUSES HYDRATION ERROR!
<Link href="/product">
  <div>
    <Link href="/product">View Details</Link>
  </div>
</Link>
```

#### ✅ ALWAYS DO:
```tsx
// Use button for nested interactions
<Link href="/product">
  <div>
    <button onClick={(e) => {
      e.preventDefault();
      window.location.href = '/product';
    }}>
      View Details
    </button>
  </div>
</Link>
```

---

### 3. Component Props with Event Handlers

#### ❌ NEVER DO:
```tsx
// Passing event handlers to Server Component
<ServerComponent onClick={() => {}} />
```

#### ✅ ALWAYS DO:
```tsx
// Make component Client Component first
'use client';

export function MyComponent({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Click</button>;
}
```

---

### 4. Image Error Handling in Server Components

#### ❌ NEVER DO:
```tsx
// Server Component with onError
export default function Page() {
  return (
    <img 
      src="/image.jpg" 
      onError={(e) => e.currentTarget.src = '/fallback.jpg'} 
    />
  );
}
```

#### ✅ ALWAYS DO:
```tsx
// Use direct fallback URL or make it Client Component
export default function Page() {
  return <img src="https://direct-url-to-image.jpg" alt="..." />;
}

// OR make it Client Component
'use client';
export default function Page() {
  return (
    <img 
      src="/image.jpg" 
      onError={(e) => e.currentTarget.src = '/fallback.jpg'} 
    />
  );
}
```

---

## 📋 Development Workflow

### Phase 1: Planning (ALWAYS DO THIS FIRST)

```markdown
1. List all components to create
2. Mark each as Server or Client
3. Identify dependencies needed
4. Plan component hierarchy
5. Check for nested interactive elements
```

**Example:**
```
Components to create:
- ProductCard (Client) - has onClick
- ProductGrid (Server) - just renders cards
- AddToCart (Client) - has button onClick
- ProductFilter (Client) - has form inputs
```

---

### Phase 2: Implementation

#### Step-by-step Process:

```bash
1. Create 2-3 components at a time
2. Add 'use client' if needed (check Decision Tree)
3. Test immediately (npm run dev)
4. Fix errors before continuing
5. Commit when working
6. Repeat for next batch
```

#### ❌ DON'T:
- Create 10 components at once
- Commit without testing
- Replace files multiple times
- Skip 'use client' directive

#### ✅ DO:
- Create complete files in one go
- Test after each batch
- Use `write_to_file` with `Overwrite=true`
- Add 'use client' from the start

---

### Phase 3: Testing Checklist

```markdown
Before committing, check:
- [ ] No build errors (npm run dev)
- [ ] No console errors in browser
- [ ] No hydration warnings
- [ ] All interactive elements work
- [ ] Responsive on mobile/desktop
- [ ] TypeScript types are correct
```

---

## 🔧 Common Errors & Solutions

### Error 1: "Event handlers cannot be passed to Client Component props"

**Cause**: Server Component trying to use event handlers

**Solution**:
```tsx
// Add 'use client' at the top
'use client';

export function MyComponent() {
  return <button onClick={() => {}}>Click</button>;
}
```

---

### Error 2: "In HTML, <a> cannot be a descendant of <a>"

**Cause**: Nested Link components

**Solution**:
```tsx
// Change inner Link to button
<Link href="/product">
  <div>
    <button onClick={(e) => {
      e.preventDefault();
      window.location.href = '/details';
    }}>
      Details
    </button>
  </div>
</Link>
```

---

### Error 3: "React does not recognize the `asChild` prop"

**Cause**: Missing Radix UI Slot

**Solution**:
```bash
npm install @radix-ui/react-slot
```

```tsx
import { Slot } from '@radix-ui/react-slot';

export function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
}
```

---

### Error 4: "Expression expected" or Syntax Errors

**Cause**: File corruption during replacement

**Solution**:
```typescript
// Don't use replace_file_content multiple times
// Use write_to_file with Overwrite=true instead

write_to_file({
  TargetFile: '/path/to/file.tsx',
  Overwrite: true,
  CodeContent: '... complete file content ...'
});
```

---

## 🎯 Component Templates

### Client Component Template

```tsx
'use client';

import { useState } from 'react';
import { ComponentProps } from './types';

interface Props {
  // Define props
}

export function MyComponent({ ...props }: Props) {
  const [state, setState] = useState();

  const handleClick = () => {
    // Event handler
  };

  return (
    <div>
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

---

### Server Component Template

```tsx
import { ComponentProps } from './types';

interface Props {
  // Define props
}

export async function MyComponent({ ...props }: Props) {
  // Can use async/await
  const data = await fetchData();

  return (
    <div>
      {/* No event handlers! */}
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

---

## 📦 Dependencies Checklist

### Always Install These for UI Components:

```bash
# State Management
npm install zustand

# UI Primitives
npm install @radix-ui/react-slot
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge
```

---

## 🚀 Best Practices

### 1. File Organization

```
components/
├── ui/              # Base UI components (Client)
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Badge.tsx
├── product/         # Feature components
│   ├── ProductCard.tsx      # Client
│   ├── ProductGrid.tsx      # Server
│   └── AddToCart.tsx        # Client
└── layout/          # Layout components
    ├── Header.tsx           # Client (has cart button)
    └── Footer.tsx           # Server
```

### 2. Import Order

```tsx
// 1. React imports
'use client';
import { useState } from 'react';

// 2. Next.js imports
import Link from 'next/link';
import Image from 'next/image';

// 3. Third-party imports
import { ShoppingCart } from 'lucide-react';

// 4. Local imports
import { Button } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
```

### 3. TypeScript Types

```tsx
// Always define interfaces
interface ProductCardProps {
  product: WPProduct;
  onAddToCart?: (id: number) => void;
}

// Use type imports
import type { WPProduct } from '@/lib/wordpress';
```

---

## 🔍 Code Review Checklist

Before committing, verify:

### TypeScript
- [ ] No `any` types
- [ ] All props have interfaces
- [ ] Proper type imports

### Next.js
- [ ] 'use client' where needed
- [ ] No nested interactive elements
- [ ] No event handlers in Server Components
- [ ] Proper async/await in Server Components

### React
- [ ] Proper key props in lists
- [ ] No inline function definitions in JSX (for performance)
- [ ] Proper hook dependencies

### Styling
- [ ] Consistent Tailwind classes
- [ ] Responsive design (sm:, md:, lg:)
- [ ] Proper color tokens from design system

---

## 📝 Commit Message Format

```bash
# Good commit messages
git commit -m "Add ProductCard component with 'use client' directive"
git commit -m "Fix nested anchor tags in ProductCard"
git commit -m "Install @radix-ui/react-slot for Button asChild prop"

# Bad commit messages
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

---

## 🎓 Learning Resources

### Next.js 15 Docs
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

### Common Patterns
- When to use Server vs Client Components
- How to pass data between Server and Client
- Avoiding hydration errors

---

## 🐛 Debugging Tips

### 1. Build Errors
```bash
# Always check build output
npm run build

# Common issues:
# - Missing 'use client'
# - Syntax errors
# - Type errors
```

### 2. Runtime Errors
```bash
# Check browser console
# Look for:
# - Hydration errors
# - Event handler errors
# - Nested element warnings
```

### 3. Hydration Errors
```bash
# Common causes:
# - Server HTML ≠ Client HTML
# - Nested <a> tags
# - Different content on server vs client
```

---

## ✅ Success Metrics

### Code Quality
- Zero build errors
- Zero runtime errors
- Zero hydration warnings
- All TypeScript types defined

### Performance
- Fast page loads
- No unnecessary re-renders
- Proper code splitting (Server vs Client)

### Maintainability
- Clear component structure
- Consistent patterns
- Good documentation
- Proper git history

---

## 📞 When in Doubt

### Ask These Questions:

1. **Does this component need interactivity?**
   - Yes → 'use client'
   - No → Server Component

2. **Am I nesting interactive elements?**
   - Yes → Use button instead
   - No → Proceed

3. **Do I need this dependency?**
   - Check if already installed
   - Install before using

4. **Should I test now?**
   - After 2-3 components → Yes
   - After 10 components → Too late!

---

## 🎯 Remember

> **"Code slowly, test frequently, commit confidently"**

- ✅ Plan before coding
- ✅ Test after each batch
- ✅ Fix errors immediately
- ✅ Commit working code
- ✅ Document changes

---

**End of Guidelines**

*These guidelines should be reviewed before starting any new feature or component.*
