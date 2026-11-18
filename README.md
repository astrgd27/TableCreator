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

### Input-specific entries and rolls

Entries have an optional `input` string. Omitted, empty, or whitespace-only inputs are always eligible. A nonblank input requires one exactly matching supplied value (case-sensitive, ignoring outer whitespace). Matching rows join the unrestricted rows with their existing weights; they do not replace them. Existing Conditions must also pass. Use `||` for alternative input matches and `&&` for requirements within an alternative. No exclusions or substring matching are applied.

CSV now uses `text,weight,subtable,input`; old three-column CSV remains supported. JSON entries use `"input":"Rivers"`; collection/directory backups and table replacement preserve it. Plain-text lists remain entry text only, so use CSV or JSON to retain inputs, weights and links.

The Generator's **Roll inputs** box accepts one value per line for single, multiple, and meta-combined rolls. Inputs are saved with a generator, reused on rerolls, and inherited by sub-tables and inline references.

Templates can pass variables and double-quoted literal strings:

```text
{{draw domains = Deity domains}}
{{draw domains = Deity domains}}
{{roll offering = Sacred offering | input: domains, "Winter"}}
{{offering}}
{{table:Sacred taboo | input: domains}}
```

The same `| input:` clause works on `roll`, `draw`, and `table:`. A draw or multi-choice pick variable supplies each selected value separately. A normal roll variable supplies its full generated text as one value, including any linked qualifications. A comma within a quoted literal remains part of that one value. Unassigned input variables raise an error. Inputs are local to that roll and its descendants; subsequent template rolls without a clause receive none.

The bundled religion and both deity dossiers pass their domain values to their other table rolls. Existing installed bundled templates receive this syntax once while preserving edits and paragraph odds; unrelated templates and all tables remain unchanged. Input-specific results only become available after rows are assigned inputs.

### Domain-flavored religion additions

The first domain expansion adds 226 distinct results (440 weighted rows) across 55 existing religion tables. All 105 domains weighted 4–6 in the supplied `deity-domains.csv` are represented. A result in a table with a linked detail/complication has a weight-9 unlinked row and a weight-3 linked row with identical text and inputs: the linked variant has 25% of that result's weight. Tables without links receive one weight-12 row. Existing rows, links, other tables and template paragraph odds are retained.

The Deity domains table uses the supplied 201-row list with its exact spelling and weights. Both deity templates and the religion dossier use this vocabulary. Religion domains remains available as its own separate table. The one-time expansion appends content without replacing edited religion entries; table IDs and folder paths are retained. Explicit directory import remains authoritative.

Multiple required row inputs use `&&`, for example `Rivers && Ancestors`. Every listed value must be supplied, with exact case-sensitive matching after trimming outer spaces. A single supplied string `Rivers && Ancestors` does not substitute for the two separate inputs. Blank inputs always qualify; OR alternatives use `||`; exclusions are not implemented. CSV and JSON store the same input string, and manual generators accept the separate supplied values one per line.


OR row input example: `Rivers || Healing` requires either value. `Rivers && Ancestors || Healing` requires both Rivers and Ancestors, or Healing alone. AND binds before OR; no parentheses grouping is implemented. Matching remains exact and case-sensitive. A row is eligible only once even if multiple alternatives match, so its weight is not multiplied. Blank inputs remain always eligible. CSV and JSON preserve the expression as a string; supply individual values through templates, manual rolls or the API.



### Updated default collections (November 2026)

On the next load, the app replaces the 324 matching tables under `default/religion` with the uploaded Distinct Rare Domain Pass (11,429 rows), preserving table IDs and existing narrative templates. This is a one-time overwrite; later edits remain yours. Tables outside that folder are retained.

The Stage 27 settlement/region collection adds 1,239 tables (32,493 rows) under `default/settlements and regions`, organized into Settlements, Regions and nations, and Shared tables, with 47 subject paths. Stage numbers are removed from folder names; table names, weights, inputs, and sub-table relationships are preserved.

Four templates are available in its Templates folder: **Fantasy settlement - quick portrait**, **Fantasy settlement - full dossier**, **Fantasy region and nation - gazetteer**, and **Fantasy settlement - local establishment**. They roll the supplied vocabulary tables first and pass those exact values to later rolls. The larger templates add optional themed paragraphs and branches for relevant geography and fantasy traits. Inputs bias eligible weighted outcomes; blank-input rows remain available, so context is not a guarantee of perfect narrative consistency.

Collections now allow up to 5,000 tables in the browser and AI engine. Unchanged default rows use immutable versioned packs as a local-storage dictionary; edited rows are saved in full. Directory exports remain complete, standalone JSON. Keep `religion-refresh-v1.js` and `worldbuilding-pack-v1.js` immutable and available in future releases so existing saved dictionaries can be decoded. A full directory import is authoritative and does not automatically reapply these defaults.

### Focused templates and people/place rosters

The settlement dossier now creates 3–5 numbered locations and 3–5 important people; the regional gazetteer creates 4–7 of each. Each person belongs to the corresponding location and receives a public reputation, ambition, useful knowledge, and an optional private concern. Core people share relationship history and favors; core locations share a practical connection. Extra people and their locations appear together, so optional sections never leave dangling narrative references. The initial context inputs are passed through every detail roll; each location also supplies its own type as an input.

Six focused templates live below `default/settlements and regions/Templates`: port town, frontier fortress, magical industrial town, tavern or inn, guildhall, and forest sites. They establish relevant exact inputs, use specialist tables, and include several contacts, guests, or locations. People are identified by numbered descriptions rather than invented personal names.

A separate one-time template update upgrades the two big templates and installs the six new ones without changing any tables or religion templates. A locally edited big template is retained in `Templates/Previous versions` before its original slot is upgraded. The quick portrait and general local-establishment templates stay unchanged. Directory imports remain authoritative.


### Complete large-template coverage and settlement size

The full settlement dossier can reach all 998 tables under Settlements plus the shared qualification table. The regional gazetteer can reach all 240 Regions and nations tables, plus relevant peoples, civilizations, diaspora, historical-change and rural-geography tables (576 targets including the shared qualification). Existing core references remain available. Twenty-three supporting facet selectors provide optional thematic entry points; linked details and qualifications remain connected to their parents. Input-only tables are selected only through an eligible input expression. Coverage is audited in `worldbuilding-coverage.json` and exercised by `test-worldbuilding-coverage.cjs`.

These are possible sources across different generations, not a request to roll every table in every output. Each thematic section has a 55% appearance chance and a 35% chance of a second local example. Vocabulary tables feed exact context strings into the facets. Additional details are framed as particular local or historical examples, so they do not redefine the main profile.

Settlement rosters use the rolled Settlement scale when it states a population; qualitative scale results fall back to the settlement type. The size band is displayed explicitly. Tiny: 1–2 people and locations; Small: 2–4; Medium: 4–6; Large: 6–9; Metropolis: 9–13. Each optional person/location pair appears together. Connections to a second or third person are emitted only when those people exist. Region rosters remain 4–7. The one-time template revision preserves table edits and backs up edited large templates before replacement.



### Independent people and locations

The large settlement and region templates no longer assign important people to numbered locations or roll a place-connection detail for those people. Their numbers identify separate lists. Size-based counts and person-to-person relationships are retained. The NPC/place-connection table remains available as an optional, separate local vignette about an unnamed resident and unspecified place, preserving table coverage without linking the generated cast. Existing edited large templates are backed up before this one-time update.



Settlement content update: `settlement-update-v1.js` overlays the immutable Stage 27 storage dictionary with the Stage 29 notable-person replacement and 60 new linked follow-up tables. The one-time migration overwrites default settlement tables, preserves their IDs, and leaves other folders intact. Its seven revised templates add type-matched location details and three optional generic-detail rolls (70%, 45%, 25%). Specialist support tables use stable inline references; conditional generic rows inherit the location and settlement inputs. Edited default templates are backed up before replacement. Directory imports remain authoritative. The versioned update asset contains the current settlement template sources; the original worldbuilding bundle remains available for prior-version migration.


The relationship audit (`location-relationship-audit.json`) covers Local Places, Everyday Buildings, Specialized Local Sites, Distinctive Local Life, Streets and Urban Fabric, and Rural Fabric. `relationship-update-v1.js` supplies the current sources for nine templates and coherent routing for 35 location types, urban surroundings, rural scenes, institutional/community relationships, and regional/wilderness scenes. It changes support tables and templates only; uploaded content tables remain untouched. The dedicated location router receives the site type and environmental/economic context, but not the settlement-kind token, avoiding collisions such as an Inn within a Temple settlement. Generic detail rolls still receive the full context. Alternate descriptive category tables remain in broad dossier facets. Mandatory follow-up links continue to execute automatically. Edited templates are backed up before the one-time migration.
