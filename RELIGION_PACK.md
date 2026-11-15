# Religion Worldbuilder — variety-expanded edition

Source: Religion_Worldbuilder_Variety_Expanded(1).zip supplied by the user.

- 322 tables; no added or renamed tables.
- 12,472 weighted entries.
- 6,338 sub-table links, all resolved to existing tables.
- Root folder: `default/religion`, organized into subject subfolders.

## Replacement update

Version 2 overwrites the bundled religion rows on the next app load. Existing table IDs are reused where possible so saved generators and references remain valid. Missing bundled tables are restored. Other folders are not replaced. Successful installation is recorded so subsequent reloads do not overwrite later edits. A storage failure leaves the previous directory intact.

The default religion dossier is replaced with its version 3 source. The old Settlement narrative test template and its Add monarchy example button are removed. Explicit full-directory imports continue to mean the imported directory is authoritative.

## Full religion dossier

The template references 176 tables directly. Traversing their positive-weight sub-table links reaches all 322 tables. Conditional branches and chance-based passages mean an individual religion does not roll every table.

New passages cover divination, aesthetics, economic arrangements, education, membership, metaphysical puzzles, ritual clothing, sacred animals, sacred objects, saint/hero veneration, and an optional separately identified local facet. This last passage uses the facet selector without replacing the main account's doctrine.

Named rolls drive later conditions and remain stable within an output. Primary results retain their linked nuances. Incompatible local details are explicitly distinguished from universal doctrine. Generated accounts remain fictional worldbuilding prompts and may need editorial reconciliation.

Regression tests verify all-table reachability, missing references, branch suppression, random dossier generation, replacement of old entries/templates, retained IDs, one-time migrations, and rollback on storage failure.

## Dossier variation (revision 3)

Each output chooses 2–4 distinct emphases, including a core inferred from recognizable centrality results (with a random fallback). The emphasis remains stable throughout that output. Eight strands are available: ritual, learning, service, ancestors, mysticism, sacred landscape, covenant, and devotion.

Related topics receive brief, full, or extended treatment. Retreats, exemplary lives, magic, and inner teaching can be omitted, summarized, or developed; a related emphasis makes their fuller treatment more likely (and guarantees inclusion of those modules). Explicit negative table results still gate incompatible details. Omission means the dossier does not discuss a feature, not that the religion forbids it.

Household, village, itinerant, and regional participation combine with four geographic patterns. Family and occupational membership bias participation; priest-ruler results add state institutions. Four cohesion patterns allow shared custom and friendly diversity as well as negotiation or disagreement. Eight present phases cover continuity, quiet adaptation, recent foundation, renewal, contraction, dormancy, fragmentation, and expansion. Crisis is optional (35%), as are the second and third local examples. Specific table results can still introduce local conflicts.

The table pack is unchanged. Template revision 3 upgrades the prior bundled template once, retaining its ID. Directory replacement remains authoritative. The browser and AI backend use the same extended template engine.

## Folder organization (revision 1)

The 322 tables are assigned to 31 leaf paths under `default/religion`. The 15 main subjects are Identity and belonging; Origins and history; Divinities and cosmology; Teachings and knowledge; Ethics and obligations; Ritual and daily life; Institutions and religious roles; Sacred places and objects; Art and symbols; Festivals and life passages; Death and ancestors; Mysticism and the supernatural; Society and livelihood; Government and conflict; and Communities and diversity.

Divinities and cosmology contains a Forms subfolder. Each subject's expanded nuance/complication tables live in its Nuances and complications subfolder. `religion-folders.js` maps the existing canonical table IDs to these paths; it introduces no tables or entries.

Existing installations receive a one-time folder migration. It preserves all existing rows, weights, table IDs, sub-table links, and saved generator references. It refreshes the default religion template's table bindings by canonical identity and persists folders with the directory. User-created unrelated tables are left in place. Fresh installations receive the organized paths immediately. Storage failure rolls back the migration; an explicit directory import remains authoritative.

## Deity companion template

`deity-template.js` / `fantasy-deity-template.txt` add **Fantasy deity - full dossier** beside the religion template. This is a short deity-and-cult account, with a guaranteed profile followed by sparse thematic paragraphs. All 322 original tables are reachable, but typical outputs draw only a small subset. `deity-pack.js` adds 48 personal names and 30 individual domains in the existing Divinities and cosmology folder. The supplemental tables use stable bundle keys and do not alter the original 322-table pack or its links.

`test-deity.cjs` checks all-table reachability, 1–5 distinct domains and decreasing continuation chances, average length over 400 generations, retention of the religion template, missing-dependency rollback, storage rollback, idempotence, and explicit directory import behavior.
