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

### Full directory backups

**Export directory** downloads every table, generator (including meta-combinations), template, folder/subfolder path, and notebook entry. **Import directory** validates a complete backup, shows two separate warning screens, and requires typing `REPLACE` before wiping and replacing this browser's directory. Export your current directory from the first warning if you need a recovery copy. Storage is written before the active in-memory directory changes; failed validation or a storage-quota error leaves the old directory intact. Import tables still merges rather than replacing. Session roll history and deck positions are temporary and are reset on directory replacement.

### Templates

The new Templates screen creates paragraph-based narratives. Use inline table rolls, named reusable results, condition/else blocks, percentage-chance blocks, repeat blocks, and dice. Choose **Fantasy religion — full dossier** under `default/religion` for a complete working narrative template. Template edits save automatically, including drafts with syntax errors; errors appear when generating. Template table bindings survive table renames. Saved templates and their bindings travel with directory exports and merge imports.

For AI tool access and a self-hostable backend, see [API.md](API.md).

### Reusable template choices

`{{pick emphasis = Ritual | Learning | Service}}` silently stores one uniformly chosen literal option. `{{emphasis}}` displays it; ordinary `if` blocks can use it.

`{{pick themes 2..3 with emphasis = Ritual | Learning | Service}}` chooses a uniform count from 2 through 3, samples distinct options without replacement, and includes the previously assigned `emphasis`. Omit `with emphasis` for an unconstrained sample. Results are comma-separated strings; `contains` can check an individual theme. Options cannot contain `|` or template delimiters; avoid overlapping labels when using `contains`. One literal option also assigns a fixed value. Lists allow up to 100 unique, nonempty options. Choices are exposed in the generated `variables` object and do not count as table expansions.

### Folder browser

Table selection now uses a shared directory picker in single rolls, multiple rolls, meta-combinations, template insertion, entry references, sub-table links, and conditions. Browse one folder level at a time, navigate with breadcrumbs, enter a folder path directly, or search that folder and its descendants. Full table paths distinguish duplicate names. Multiple selections persist while navigating between folders; use Show selected to review them before applying. Cancel leaves the current selection unchanged.

The editor collection uses the same folder hierarchy. New folder creates an empty folder (or nested path), and New table creates a table in the folder currently being viewed. New linked sub-tables inherit their parent's folder. These are directory paths inside Table Forge; full directory exports preserve them. References use stable table IDs so moving a table does not break a template or saved roll.

### Fantasy deity dossier

Select **Fantasy deity - full dossier** in Templates under `default/religion`. It starts with a personal name, one to five distinct domains, appearance, origin, and temperament. The 15 optional cult themes have independent 12–25% inclusion chances, averaging about three brief themed paragraphs. Any theme can be omitted; a short profile alone is possible. Across 400 test runs the mean was approximately 190 words, far shorter than the broader religion dossier.

Two new tables in `default/religion/Divinities and cosmology` supply personal names and individual domains. The Deity domains table has one domain per row. The template always draws one, then nests chances of 60%, 35%, 20%, and 10% for each additional domain, up to five. Draws use the remaining entries, so every combination is possible without duplicates. Existing religion tables remain unchanged and are all reachable via thematic alternatives or linked sub-tables. Rare alternative accounts are explicitly local/historical. The original religion template remains available.

The new template and its two tables are installed once, atomically. Directory exports include them and work with the existing AI backend; an explicit directory import remains authoritative.

### Drawing a comma-separated list

`{{draw domains = Deity domains}}` silently draws one unused entry and appends it to the named list. Repeating this directive adds another entry; `{{domains}}` displays the results separated by commas. A list uses one table and resets for every generation. Entry weights still apply, and ordinary rolls remain independent. Linked sub-tables within that list also use draws without replacement. Exhaustion produces an explicit error rather than repeating an entry.

The default deity template always draws one domain and nests continuation chances of 60%, 35%, 20%, and 10%. The resulting probabilities for exactly 1–5 domains are 40%, 39%, 16.8%, 3.78%, and 0.42%. The second draw must succeed before the third is considered, and so on. Domain choices are independent of their count and are not predefined combinations.

### Replace a table from a file

In the table editor, choose **Upload & replace** beside **Paste entries**. Select a TXT file (one entry per line), a CSV with `text,weight,subtable` columns, or a JSON containing one table or an entry array. Preview the upload, then choose **Replace table entries**. This replaces all entries, including their weights, conditions, and outgoing links, while retaining the table's name, folder, and ID so existing references keep working. Export the table first if you want a backup. Invalid uploads and storage failures leave the table unchanged; multi-table JSON belongs in Import tables instead.

### Large fantasy deity dossier

**Fantasy deity - full dossier - large** is a separate template under `default/religion`. It preserves the original deity profile and one-to-five unique domain draws, increases the 15 thematic section chances to 42–85%, raises most supporting sentence chances to 50%, and gives each included theme a separate 30% chance of a local or historical detail paragraph. Core descriptions and extra details can now appear together. Existing conditional restrictions still govern sacrifices, clergy, images, secret teachings, and other dependent rolls. The original short dossier and table contents are preserved. Both versions can reach the same religion tables, including linked sub-tables. The large template is installed once and included in directory exports; explicit directory imports remain authoritative.
