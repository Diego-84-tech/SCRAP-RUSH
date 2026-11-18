# Scrap Rush v0.2.0
By DS TECHNOLOGY™. An iPhone-first salvage yard driving game.

## Play
Open index.html in a WebGL-capable browser. Choose a work order on the Shift Board, then tap Clock In. No installation, API keys, or build required.
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

## v0.1.1-preview.1

Local phone preview based on the published v0.1.0 tag. Added a compact work-order Shift Board, gameplay sized to the visible viewport, and a forklift delivery ticket. The forklift now captures a seated pallet before applying movement, and Lift held during the final aligned approach waits for the forks to seat.

Verified in a browser emulating an iPhone in portrait and landscape. Work Shift start, pause, return to the board, simultaneous Drive + Lift and Reverse + Lift, and a complete touch-only forklift delivery all passed. Physical-device Safari play remains unverified.

## v0.1.1-preview.2

Reworked the Shift Board into a landscape-first yard timesheet with a work-order list and a separate clock-in panel. The portrait layout offers a rotation hint. The forklift fix and existing play modes carry forward from preview.1.

Verified the full timesheet fits 844×390 and 667×320 landscape viewports without scrolling. The iPhone-emulated touch regression passed Work Shift and a full forklift delivery, including both simultaneous lift-and-drive combinations.

## v0.1.1-preview.3

Added the approved Forklift License artwork as the iPhone Home Screen touch icon and browser favicon. The 1024 × 1024 master is in assets. The Yard Timesheet and gameplay carry forward from preview.2.

## v0.2.0

- The landscape Yard Timesheet uses the approved worn-paper reference, wordmark, and forklift artwork. The Forklift License remains the Home Screen icon.
- Forklift Training awards the timesheet's Qualified stamp. Gate Dispatch adds three linked pallet jobs at Gates 03, 09, and 01, with live dispatch instructions, highlighted bays, and a barrier around which to steer.
- Copper Crossing adds a different obstacle layout and a two-minute, five-coil objective. Rush and Work Shift continue with their existing records.
- The forklift workshop persists shift credits and purchased work lights, hydraulics, and fork guides in browser storage. Each cleared gate delivery earns one credit.

Release verification used an emulated iPhone browser. Checked all mode entry points, Copper Crossing's objective, both simultaneous lift-and-drive inputs, the full touch training delivery, all three dispatch pickup/drop transitions using docked approaches, and workshop purchase persistence. Full route handling on a physical iPhone remains to be tested.
