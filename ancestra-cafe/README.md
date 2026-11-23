# Ancestra Cafe – ITE17 Bootstrap 5 Project

This is the uploaded café project updated with Ancestra Cafe business content and menu information. It uses HTML5, CSS3, Bootstrap 5.3 and vanilla JavaScript.

## Real Ancestra Cafe information used
- Official website: https://www.ancestracafe.ph/
- Home and About copy: official Ancestra Cafe pages.
- Menu names and prices: transcribed from the two menu-board images on the official website.
- Blog: rewards program, name story, guest policies, soft opening, and Hablon sa Argao posts.
- Contact: 311 General Ortega St., Poblacion, Argao, 6021 Cebu; contact@ancestracafe.ph; 0917 807 4596; Instagram @ancestracafe; Facebook /ancestracafe.
- Images: official Ancestra Cafe Squarespace CDN assets (see `ASSET-SOURCES.md`).

## Pages
| File | Contents |
|---|---|
| `index.html` | Ancestra homepage content, official menu-board previews, digital loyalty demo, project vouchers, customer review feature |
| `about.html` | Published About Us copy and Ancestra name story |
| `menu.html` | Published menu data, search, category filters, favorites, sorting, demo cart and checkout |
| `blog.html` | Published blog stories and guest policies as flip cards; “Show more” turns the card around and the open card is shared through the `?post=` link |
| `contact.html` | Published contact details and location map; reservation form clearly marked as a demo because official policy says no table reservations |
| `admin.html` | Front-end demo admin dashboard |

## Eight features retained
1. Table reservation form (local demo only; Ancestra's published policy says table reservations are not accepted)
2. Interactive menu ordering/cart (demo only; orders are not sent to Ancestra)
3. Digital loyalty card (based on the published 9-stamp reward terms; browser demo only)
4. Promo vouchers (sample project codes only, not official promotions)
5. Customer reviews (user-submitted demo reviews; no fabricated testimonials preloaded)
6. Admin dashboard (demo password: `admin123`; not secure and no backend)
7. Menu search, category filters, sorting, favorites
8. Interactive map and directions to the published address

## Run
Extract the ZIP, open this folder in VS Code, and use Live Server to open `index.html`. Internet is required for Bootstrap, Bootstrap Icons, Google Fonts, map embed, and the café's hosted photographs/menu-board images.

## Important limitations
This is an academic front-end project and is not an official Ancestra Cafe website or service. Reservations, orders, vouchers, reviews, loyalty card and admin data are browser-based demonstrations only. No information is sent to the café. Prices and menu availability may change; verify with Ancestra Cafe before visiting.

## Hero video note
The hero background plays the supplied café recording `videos/squarespace-cdn.mp4` as a muted, looping, inline video (autoplay is skipped and the video is hidden for readers who prefer reduced motion). `images/ancestra-house-hero.jpg` — a cropped still from the same recording — is kept as the video's poster and as the static fallback, so the hero still looks right before the video loads, if it cannot play, or when motion is reduced. The recording's resolution is limited; replace `videos/squarespace-cdn.mp4` with the original licensed high-resolution hero video if the café supplies it.

## UI/UX enhancement pass
This pass preserves the existing Ancestra-inspired palette, typography, centered wordmark navigation, section order, and original content while adding small usability refinements:
- slim reading-progress indicator at the top of the viewport;
- accessible “Skip to content” link and visible keyboard focus states;
- smoother hover/press feedback for navigation, buttons, cards, filters, and photos;
- mobile navigation closes after a page is selected;
- accessible photo/menu-board preview with keyboard support and Escape-to-close;
- `/` keyboard shortcut to focus menu search (Escape returns focus to the page);
- the home hero plays the supplied café video as a muted looping background, falling back to the still image for reduced-motion readers;
- blog cards flip between the cover/teaser and the full post (“Show more”/“Show less”, one card at a time), and the open card is carried in the page URL as `?post=…` so a copied or revisited link reopens it (`js/blog.js`, no browser storage);
- reduced-motion preferences continue to be respected.

The added interactions are front-end only. Existing cart, loyalty, voucher, review, reservation-demo, and admin behavior remains unchanged. Reservation and ordering demos are not connected to Ancestra Cafe systems and do not create real bookings or payments.


## Cleaner homepage and feature access
The homepage is intentionally limited to the café introduction, original menu boards, space/story imagery, and location. The digital loyalty card, project vouchers, and guest review demo are grouped on the separate Rewards page so they do not interrupt the original café presentation. Ordering/cart remains on the Menu page, and the reservation-request demonstration remains on Contact (clearly labeled as a project demo because the café's published policy says it does not accept table reservations). Scroll reveals are restrained to major sections only.
