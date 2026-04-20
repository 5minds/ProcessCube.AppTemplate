# ProcessCube Studio Design System (globals.css)

Apply this CSS to AppSDK apps via `app/globals.css` imported in `app/layout.tsx`.

```css
:root {
  --color-highlight: rgb(248, 181, 68);
  --color-highlight-hover: rgb(228, 161, 48);
  --color-primary: #3b82f6;
  --color-success: #16a34a;
  --color-error: #dc2626;

  --bg-main: #f3f4f6;
  --bg-surface: #ffffff;
  --bg-surface-secondary: #f3f4f6;

  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;

  --border-color: #e5e7eb;
  --border-color-hover: #d1d5db;
  --border-color-focus: #3b82f6;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);

  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-base: 14px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background: var(--bg-main);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

## CSS Classes

| Class | Usage |
|-------|-------|
| `.menu-bar` | Top nav bar (h:52px, border-bottom, shadow) |
| `.menu-bar .logo` | App name with gold dot |
| `.btn` | Base button (flex, padding, radius, transition) |
| `.btn-primary` | Gold gradient button |
| `.btn-secondary` | Gray border button, `.active` for gold border |
| `.content` | Main area (max-width:720px, centered) |
| `.task-list` | Grid of task cards |
| `.task-card` | Clickable card with hover (gold border, shadow, lift) |
| `.empty-state` | Centered empty message |
| `.form-group` | Form field wrapper |
| `.form-label` | Label (0.8125rem, weight 500) |
| `.form-input` | Input with focus ring (blue) |
| `.task-detail` | Card for UserTask form |
| `.task-detail-header` | Header with border-bottom |
| `.back-link` | Back button (text style, hover blue) |
| `.status-bar` | Fixed bottom bar (gold gradient, 26px) |

## Brand Identity

- **Gold accent**: `rgb(248, 181, 68)` — primary buttons, status bar, active states
- **Blue focus**: `#3b82f6` — input focus, links
- **8px border radius** default
- **System fonts** for performance
