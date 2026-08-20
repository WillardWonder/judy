# Judy's Dream Pony Stable

A cute, self-contained horse-care and dress-up game designed for GitHub Pages.

## What it includes

- Six cute horses to choose from: Rosie, Buttercup, Mochi, Cocoa, Lavender, and Pepper
- Different horse personalities and markings including stars, blazes, dapples, and socks
- Each horse remembers its own custom name, coat color, and mane color
- A larger dress-up closet with bows, flowers, halters, show blankets, glasses, scarves, rosettes, crowns, and cloud wings
- Horse-care activities: feeding, brushing, playing, cuddling, braiding, hoof picking, carrot picnics, and pole practice
- Happiness, fullness, cleanliness, and friendship stats
- Collectible show ribbons for stable milestones
- Daily visit streaks and rewards
- Six horsey locations: flower meadow, peach sunset, moonlit stable, apple orchard, sunny paddock, and ribbon show
- A falling-star mini game
- A stable journal that records little milestones
- Automatic local progress saving with `localStorage`
- Export/import backup files for moving progress to another browser or device
- Responsive layout for laptops, tablets, and phones
- No framework, package manager, build step, server, database, or API key required

## Publish on GitHub Pages

1. Create a new GitHub repository, for example `judys-pony-pal`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. In GitHub, open **Settings -> Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`, then save.
6. GitHub will provide a Pages URL such as `https://YOUR-USERNAME.github.io/judys-pony-pal/`.

## How saving works

The game saves to the browser's `localStorage` under the key `judys-pony-pal-v1`. The key remains the same as the first version so an existing Judy's Pony Pal save can be upgraded instead of discarded. The new version automatically migrates the original pony name/colors into Rosie's profile.

Judy can return to the same GitHub Pages URL on the same laptop and browser profile and her stable progress will still be there.

Important: GitHub Pages itself is read-only, so progress is not stored in the GitHub repository and does not automatically sync to another laptop or browser. The **Save & backup** button lets Judy export a small JSON backup file and import it elsewhere.

## Files

- `index.html` - page structure and horse SVG artwork
- `styles.css` - visual styling and responsive layout
- `app.js` - horse selection, care mechanics, dress-up, ribbons, coins, mini game, streaks, and saving
