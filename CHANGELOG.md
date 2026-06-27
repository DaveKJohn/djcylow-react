# Changelog
Wijzigingen op deze branch (config/ga4-ip-filter). Bij merge naar main schuiven deze regels onder ## [Unreleased] in de hoofd-CHANGELOG. Zie de werkwijze in CLAUDE.md.

## [Unreleased]

### GA4 IP-filter — eigen bezoeken uitsluiten
**Branch naam** config/ga4-ip-filter
**Datum merge op main** 2026-06-27
**Branch type** Config

GA4 gegevensfilter "Eigen bezoeken" aangemaakt en geactiveerd. IP-adresregel ingesteld voor thuisIP `83.86.198.113` (traffic_type=internal). Eigen bezoeken worden uitgesloten van alle analytics-rapporten. Werk-IP (Limpergstraat 6, Rijswijk) volgt zodra dat IP-adres bekend is.
