# Frontend Assets Directory

## Purpose
This directory stores static assets for the Post Office Management System frontend.

## Asset Categories

### Images
- Logo files
- Icons (user, parcel, package, tracking, etc.)
- Background images
- UI graphics

### Icons
- Navigation icons
- Action icons (edit, delete, add, search, etc.)
- Status icons (pending, delivered, failed, etc.)
- Payment method icons

### Fonts
- Custom font files (if not using system fonts)
- Icon fonts (Font Awesome, Material Icons, etc.)

## Asset Organization

```
assets/
├── images/
│   ├── logo.png
│   ├── icons/
│   │   ├── parcel.svg
│   │   ├── user.svg
│   │   └── tracking.svg
│   └── backgrounds/
│
├── icons/
│   └── (SVG or icon font files)
│
├── fonts/
│   └── (Custom font files)
│
└── data/
    └── (Static JSON data for testing)
```

## File Naming Convention
- Use lowercase with hyphens for file names: `my-icon.svg`, `background-pattern.png`
- Use descriptive names: `user-profile-icon.svg` (not `icon1.svg`)
- Include size in name if applicable: `logo-48x48.png`

## Best Practices
- Optimize images: Use PNG for transparent images, JPG for photos
- Use SVG for icons when possible (scalable, small file size)
- Keep file sizes minimal for faster loading
- Use consistent naming conventions across all assets
- Document which components use which assets
