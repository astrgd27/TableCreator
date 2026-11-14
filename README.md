# Table Forge

A dependency-free RPG/worldbuilding random table creator. All application code is in index.html.

## Features
- Create, rename, duplicate, delete, search, and edit tables.
- Weighted entries with roll ranges; reorder rows or paste a bulk list.
- Single-table rolls and linked mode combining selected tables.
- Nested sub-tables, including creation directly from an entry. Circular links stop safely.
- Inline dice expressions such as [[2d6+3]].
- JSON collection backups preserve links. CSV and plain text table import/export.
- Automatic local browser storage; responsive desktop, tablet, and phone layouts.
- Batch rolls, result history, and copy/download results.

## GitHub Pages
Upload index.html to the root of the main branch in astrgd27/TableCreator.
In repository Settings → Pages, select Deploy from a branch → main → / (root), then Save.
There are no dependencies or build steps. .nojekyll disables unnecessary Jekyll processing.

Data is saved per browser/device, not to the repository. Export JSON backups to move data or protect it against clearing browser storage. Result history lasts for the current session.

## Import formats
JSON: a Table Forge version 1 collection. Imported tables are added with fresh IDs, preserving internal links.
CSV: text,weight,subtable header. Subtable names must uniquely match a table already in the collection. Quoted commas, quotes, and newlines are supported.
Plain text: one entry per nonempty line.

## Tests
Run `node test.cjs` for parser, validation, backup remapping, nested/circular roll, and dice-bound checks.
Browser checks covered editing, creation of linked sub-tables, single/linked rolls, bulk entry addition, CSV import, and persistence after reload.


