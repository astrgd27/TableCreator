# Religion Worldbuilder — variety-expanded edition

Source: Religion_Worldbuilder_Variety_Expanded(1).zip supplied by the user.

- 322 tables; no added or renamed tables.
- 12,472 weighted entries.
- 6,338 sub-table links, all resolved to existing tables.
- Folder: `default/religion`.

## Replacement update

Version 2 overwrites the bundled religion rows on the next app load. Existing table IDs are reused where possible so saved generators and references remain valid. Missing bundled tables are restored. Other folders are not replaced. Successful installation is recorded so subsequent reloads do not overwrite later edits. A storage failure leaves the previous directory intact.

The default religion dossier is replaced with its version 2 source. The old Settlement narrative test template and its Add monarchy example button are removed. Explicit full-directory imports continue to mean the imported directory is authoritative.

## Full religion dossier

The template references 176 tables directly. Traversing their positive-weight sub-table links reaches all 322 tables. Conditional branches and chance-based passages mean an individual religion does not roll every table.

New passages cover divination, aesthetics, economic arrangements, education, membership, metaphysical puzzles, ritual clothing, sacred animals, sacred objects, saint/hero veneration, and an optional separately identified local facet. This last passage uses the facet selector without replacing the main account's doctrine.

Named rolls drive later conditions and remain stable within an output. Primary results retain their linked nuances. Incompatible local details are explicitly distinguished from universal doctrine. Generated accounts remain fictional worldbuilding prompts and may need editorial reconciliation.

Regression tests verify all-table reachability, missing references, branch suppression, random dossier generation, replacement of old entries/templates, retained IDs, one-time migrations, and rollback on storage failure.
