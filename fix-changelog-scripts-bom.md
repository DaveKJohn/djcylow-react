### BOM-bug gefixt in changelog entry-scripts
**Branch naam** fix/changelog-scripts-bom
**Datum merge op main** 2026-07-02
**Branch type** Fix

`scripts/release/fold-changelog-entry.ps1` en `scripts/release/new-changelog-entry.ps1` schreven bestanden weg met `Set-Content -Encoding UTF8`, wat in Windows PowerShell 5.1 altijd een UTF-8 BOM toevoegt — terwijl de rest van de repo (waaronder `CHANGELOG.md`) BOM-loos is. Bij de eerste test op main voegde het fold-script hierdoor een BOM toe aan `CHANGELOG.md`. Beide scripts schrijven nu via `[System.IO.File]::WriteAllText` met een expliciete BOM-loze UTF8-encoding.