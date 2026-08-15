/**
 * Gedeelde opstart voor de componenttests. Wordt per bestand geimporteerd en NIET via `setupFiles`
 * in vitest.config.ts, om dezelfde reden als de omgeving daar: mix-data.test.ts draait in node,
 * heeft geen DOM nodig, en hoeft React Testing Library dus ook niet te laden.
 *
 * Wat hier staat is precies wat elke componenttest nodig heeft en geen enkele zelf hoort te regelen:
 *
 * 1. De jest-dom-matchers (`toBeInTheDocument`, `toHaveClass`, `toHaveStyle`).
 * 2. Het opruimen van de vorige render. Vitest doet dat NIET vanzelf -- de automatische cleanup van
 *    RTL hangt aan `globals: true`, en die staat hier bewust uit omdat de tests hun describe/it/expect
 *    expliciet importeren. Zonder deze regel stapelen de renders zich op in dezelfde document.body en
 *    faalt elke query met "found multiple elements", ook als de component zelf niets mankeert.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
