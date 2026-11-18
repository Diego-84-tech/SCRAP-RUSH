# Scrap Rush v0.1.0
By DS TECHNOLOGY™. An iPhone-first salvage yard driving game.

## Play
Open index.html in a WebGL-capable browser. No installation, API keys, or build required.
Drive with arrow keys / WASD, boost with Space, pause with P or Escape. Phones have on-screen controls.
Collect steel ($20), copper ($45), and gold ($100). Drive into the green depot to sell. Avoid forklifts: each collision costs 25 health and up to two parts.

Rush lasts 90 seconds; Work Shift lasts four minutes. Complete salvage jobs for bonuses. Spend banked cash on bed upgrades or repairs. Rush and Work Shift save separate best gross earnings in the browser. The original best remains visible as a legacy score when present on the same origin.


## Forklift Shift

Use landscape for the widest cockpit view. Hold Drive or Reverse and steer with the left buttons. On keyboard use arrows or WASD, R to lift, and F to lower. Forks start at slot height. Drive straight into the marked pallet until the HUD confirms seating. Lift briefly, carry low to the green Bay 03 rectangle, lower, and reverse out. Restart delivery resets the bay.

## Preview changes

- Arcade Yard reuses the original Rush and Work Shift game rules and world layout, with redrawn vehicles, distinct scrap, lighting, and a fully framed yard.
- Score tracks earnings independently of repair or upgrade spending. One delivery can award multiple job bonuses.
- Added one first-person delivery with fork alignment, lifting, and placement validation.
- The preview uses original procedural scenery, generated surface textures, and vehicle artwork. The 3D scene uses the bundled MIT-licensed Three.js runtime.
- Baseline: Scrap Rush GitHub commit c186745. The original baseline has no release tag or version label.

## v0.1.0 release

- Expanded landscape Arcade Yard artwork with textured pavement, dimensional containers, brighter depot lighting, and a touch joystick.
- Refined the Forklift Shift cab, fork tips, wood pallet, steel crate, and Bay 03 with textured models and lighting.
- Added a proportional touch wheel with automatic centering, independent of the Drive and Reverse controls.
- The first browser release includes one Forklift Shift training delivery. Additional routes and visual refinement are future updates.

Verified locally in a browser with an emulated iPhone landscape viewport. Checks covered scrap pickup and sale, the Work Shift timer, separate records and save reload, mode switching, and a complete Forklift Shift delivery. Physical iPhone play remains to be tested.
