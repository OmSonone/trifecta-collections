# Custom Fonts Directory

Place your custom font files here and update the CSS in `app/globals.css` to use them.

## Supported Font Formats:
- `.woff2` (recommended for modern browsers)
- `.woff` (fallback for older browsers)
- `.ttf` (True Type Fonts)
- `.otf` (OpenType Fonts)

## Example Setup:

1. Add your font files to this directory
2. Update `app/globals.css` with @font-face declarations
3. Update the font-family property to use your custom font

## File Structure Example:
```
public/fonts/
├── YourCustomFont-Regular.woff2
├── YourCustomFont-Bold.woff2
├── YourCustomFont-Light.woff2
└── README.md (this file)
```

## CSS Example:
```css
@font-face {
  font-family: 'YourCustomFont';
  src: url('/fonts/YourCustomFont-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'YourCustomFont';
  src: url('/fonts/YourCustomFont-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}
```
