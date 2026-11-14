# Table Forge

Browser-based RPG and worldbuilding random table creator, hosted at https://astrgd27.github.io/TableCreator/ . No dependencies or build step; application code is in index.html.

## Generator modes
- Single table: choose one table and generate one or more results.
- Multiple tables: combine selected tables, with an independent roll count for each.
- Meta-combined: choose one named combination by weight, then roll every table in that combination. Each result in a batch chooses independently. Weights 6, 3, and 1 give 60%, 30%, and 10% odds.
- Add settlement example creates five editable example tables and a saved Random settlement generator: Settlement + Biome + Culture, with optional Secret treasure or Secret plot.
- Save named generators with mode, combinations, weights, repeat rule, table counts, and batch size.

## Tables and results
Weighted entries; bulk paste; inline [Table name] references; nested sub-tables; inline dice such as [[2d6+3]]. Insert references through the Reference button to preserve their identity through renames. Circular links and excessive reference expansion stop with visible notices.

Lock individual result parts and reroll the rest. Rerolling keeps the original meta combination; use Roll meta-list to choose a new one.

## Organization and notebook
Assign folders and comma-separated tags. The collection filter and search match these fields.
Save a result to the Notebook, edit its title, text, and notes, search it, and export text. Notebook records are included in JSON backups.

## Repeat rules
- Allow repeats: ordinary independent weighted rolls.
- No repeats in this batch: every entry can be used once across the current batch, including sub-tables and inline references. Rerolls respect retained parts from that batch in result history.
- Deck: entries remain depleted across roll clicks until Reset decks or page reload. Editing a table resets that table's deck when it is next used.
Weights affect selection among remaining entries; each row is drawn once, regardless of its weight. Exhaustion produces a notice rather than silently resetting the pool. Deck depletion and result history are session-only.

## Dice ranges
Edit dice ranges accepts inclusive ranges (e.g. 01–35, 36–80, 81–100) that cover a specified die exactly in row order. Gaps, overlaps, and invalid bounds are rejected before changing entries. Applying ranges converts their lengths into weights. Later weight/reorder changes recalculate displayed ranges.

## Storage and import/export
Tables, folders, tags, saved generators, and notebook entries automatically save in this browser/device, not to GitHub. Export JSON for backups or transfers. JSON imports add fresh copies and remap all table links and combinations. Existing version-1 backups remain supported.
CSV: text,weight,subtable columns; subtable names must uniquely match existing tables. Plain text: one entry per line. JSON is the full-fidelity format; CSV/text export only the current table.

## Verification and deployment
Run `node test.cjs` for backup validation and remapping, nested/inline rolls, dice limits, locks, meta-selection boundaries, unique/deck draws, range validation, and metadata round-trips.
The GitHub Actions Pages workflow tests the app and publishes index.html on main pushes.

### Nested folders

Set a table's Folder to a path such as `World/Regions/Settlements`. Parent folders appear automatically in the indented folder filter; choosing a parent includes all descendants. Change the path to move a table. Folders are inferred from tables, so empty folders are not retained. JSON backups preserve paths.

### Conditional entries

Use an entry's **Conditions** button to require all or any matches against entry text selected by earlier tables in the same result. Operators are equals, contains, and does not equal (case-insensitive). Matching uses the selected text before dice/reference expansion. Missing earlier tables never match, including negative conditions. Multiple rolls of a source table accumulate: positive conditions match any earlier choice; does-not-equal requires all earlier choices to differ.

Tables roll in their listed order. Parent choices are available to their sub-tables and inline references. Context resets for every generated result. Only eligible entries participate in weighted selection; displayed editor ranges describe the full table, while runtime odds are recalculated among eligible entries. No eligible entries produces an explicit notice.

**Reroll unlocked** processes parts in order and retains locked choices as context. Rerolling a single part leaves other parts unchanged; use Reroll unlocked to refresh downstream results too. Deleting a referenced source table leaves conditions disabled until repaired. JSON preserves and remaps conditions; CSV/text exports do not preserve them.
