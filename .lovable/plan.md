

## Problem

The build is failing because `PlatformSidebar.tsx` has an extra closing `</div>` tag at line 126. The `SidebarContent` component has this structure:

```text
<div>          // line 57 - root
  <div>        // line 59 - logo wrapper
  </div>       // line 63
  <nav>        // line 66
  </nav>       // line 99
  <div>        // line 104 - bottom items
  </div>       // line 124
</div>         // line 125 - closes root
</div>         // line 126 - EXTRA! causes build error
```

## Fix

Remove the extra `</div>` on line 126. The component only opens one root `<div>` (line 57) and it's already closed at line 125. The third `</div>` is orphaned and causes esbuild to choke with "Unterminated regular expression."

Single line removal — no other files affected.

