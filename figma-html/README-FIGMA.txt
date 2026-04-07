Figma HTML specs for Member 5 (Customer Dashboard & marketing pages)
=====================================================================

1280/ subfolder — fixed 1280px-wide frames (match teammate Figma artboards).
mobile/ subfolder — fixed 375px-wide frames (typical phone artboard); stacked layouts, vertical order tracker.
Parent folder — fluid max-width layouts.

How to use:
1. Open any .html file in Chrome (double-click). Tailwind loads from CDN so you see the real layout.
2. For Figma: use a plugin like "html.to.design" or "Import HTML" — paste the file URL after hosting locally, or paste HTML source (plugin-dependent).

Files:
- 01-home-landing.html      — Hero, categories strip, featured products, newsletter CTA, nav + footer
- 02-order-history.html      — Order list with filters (All, Pending, Shipped, Delivered) + View details
- 03-order-details.html      — Progress tracker, line items with images, address, total, Track order
- 04-about-us.html
- 05-contact-us.html

Colors match tailwind.config.js: primary #1a1a32, accent-gold #b89e6c.
