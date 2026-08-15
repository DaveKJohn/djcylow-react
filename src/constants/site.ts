/**
 * De canonieke basis-URL van de site.
 *
 * ZONDER `www`, EN DAT IS GEMETEN IN PLAATS VAN GEKOZEN. De www-variant van `/luister` geeft
 * `301 Moved Permanently` naar het kale domein, dat zelf met 200 antwoordt. De hosting heeft dus al
 * besloten welke van de twee de echte is.
 *
 * Tot 2026-08-15 stond de www-variant hard op 22 plekken in elf bestanden, en daarmee wezen de
 * `canonical`, de `og:url`, de JSON-LD en alle 84 URL's in `sitemap.xml` naar het domein dat
 * wegredirect. Dat is een tegenstrijdig signaal: de server zegt "het kale domein is het origineel",
 * en de HTML in datzelfde antwoord zegt "nee, www". Een canonical hoort per definitie een URL te
 * zijn die 200 geeft.
 *
 * Wil je ooit naar `www` toe, dan begint die verandering bij de hosting -- de redirect omdraaien --
 * en landt hij pas daarna hier. Deze constante volgt de server, hij bepaalt hem niet.
 *
 * (De URL's staan hierboven bewust omschreven en niet uitgeschreven: een zoek-en-vervang over deze
 * boom zou anders de uitleg meenemen die juist beschrijft wat er vervangen is. Dat is bij het
 * schrijven van dit bestand ook precies gebeurd.)
 */
export const SITE_URL = 'https://djcylow.com';
