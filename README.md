# SCRAP RUSH
By DS TECHNOLOGY™. An iPhone-first salvage yard driving game.

## Play
Open index.html in a browser. No installation, API keys, or build required.
Drive with arrow keys / WASD, boost with Space, pause with P or Escape. Phones have on-screen controls.
Collect steel ($20), copper ($45), and gold ($100). Drive into the green depot to sell. Avoid forklifts: each collision costs 25 health and up to two parts.

Rush lasts 90 seconds; Work Shift lasts four minutes. Complete salvage jobs for bonuses. Spend banked cash on bed upgrades or repairs. Best score stays in your browser.

## Netlify
Unzip the release ZIP, then drag the folder containing index.html onto Netlify Drop (https://app.netlify.com/drop).
Alternatively import this GitHub repository: leave the build command blank, set publish directory to `.`. No environment variables needed.

## Files
- index.html: interface
- style.css: responsive styling
- game.js: canvas game, controls, audio, scoring
- netlify.toml: deployment configuration

All game art is drawn in Canvas. Google Fonts is optional; system fallback fonts work offline. Game progress is per run; only best score persists locally.
