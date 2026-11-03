// Supply-risk signals found by searching the web and reading supplier newsrooms and news sources.
// Covers 2026-10-03 to 2026-11-02 (checked 2026-11-02). Cataloochee Cell Works is not here: the
// dashboard reads its advisories feed directly. Every item below was opened and its date confirmed.
//
// Each entry: supplier_id, supplier, date (of the source), headline, summary, severity
// (high | medium | low | none), source (link), checked (the day we looked).
// severity "none" means "checked, nothing found". It is not proof that nothing happened:
// some newsroom pages could not be read, and the "summary" says which.
window.SIGNALS = [
  // --- Items found ---
  {
    supplier_id: 'S02', supplier: 'Bosch eBike Systems', date: '2026-10-27', checked: '2026-11-02',
    headline: 'North Sea port strike averted (Hamburg, Bremerhaven)',
    summary: 'Port workers voted for a strike but missed the 75% needed, so there is no strike; a 12-month pay deal (3.4%) was agreed. Our Bosch parts go through Hamburg. Watch only, since earlier strikes in Aug-Sep 2026 had closed terminals.',
    severity: 'low', source: 'https://sozonline.de/2026/10/nordseehaefen-doch-kein-streik'
  },
  {
    supplier_id: 'S03', supplier: 'Bafang', date: '2026-10-16', checked: '2026-11-02',
    headline: 'Shanghai port still has a long ship queue after typhoons',
    summary: 'Shanghai says it is back to normal, but 114 ships (about 629,000 containers) were still waiting at anchor on Oct 10, the longest queue of the ports tracked. Our Bafang shipments leave from Shanghai and could load late.',
    severity: 'low', source: 'https://maritime-executive.com/article/shanghai-moved-a-staggering-5-1m-teu-in-september-recovering-from-typhoons'
  },
  {
    supplier_id: 'S04', supplier: 'Giant Manufacturing', date: '2026-10-24', checked: '2026-11-02',
    headline: 'Super Typhoon Champi hits Taiwan; offices closed in central Taiwan',
    summary: 'Offices and schools closed for two days across northern and central Taiwan (Taichung is in central Taiwan), and 167,000 homes lost power. The article does not mention Taichung, its port or any factory, so please ask Giant whether shipments slipped.',
    severity: 'low', source: 'https://www.thestar.com.my/news/world/2026/10/24/typhoon-champi-sweeps-past-taiwan-one-dead-and-500-injured'
  },
  {
    supplier_id: 'S05', supplier: 'Fox Factory', date: '2026-10-19', checked: '2026-11-02',
    headline: 'Fox Factory reports a supply disruption, a CEO change and lower results',
    summary: 'Fox says a supply disruption in its vehicle-parts division (not bike suspension) will continue into Q4. The CEO stepped down on Oct 16 and an interim CEO is in place. The article does not say our bike forks are affected.',
    severity: 'low', source: 'https://theshopmag.com/?p=203603'
  },
  {
    supplier_id: 'S05', supplier: 'Fox Factory', date: '2026-10-24', checked: '2026-11-02',
    headline: 'Super Typhoon Champi hits Taiwan; offices closed in central Taiwan',
    summary: 'Offices and schools closed for two days across northern and central Taiwan (Taichung is in central Taiwan), and 167,000 homes lost power. The article does not mention Taichung, its port or any factory, so please ask Fox whether shipments slipped.',
    severity: 'low', source: 'https://www.thestar.com.my/news/world/2026/10/24/typhoon-champi-sweeps-past-taiwan-one-dead-and-500-injured'
  },
  {
    supplier_id: 'S08', supplier: 'Tektro', date: '2026-10-24', checked: '2026-11-02',
    headline: 'Super Typhoon Champi hits Taiwan; offices closed in central Taiwan',
    summary: 'Offices and schools closed for two days across northern and central Taiwan (Taichung is in central Taiwan), and 167,000 homes lost power. The article does not mention Taichung, its port or any factory, so please ask Tektro whether shipments slipped.',
    severity: 'low', source: 'https://www.thestar.com.my/news/world/2026/10/24/typhoon-champi-sweeps-past-taiwan-one-dead-and-500-injured'
  },
  {
    supplier_id: 'S09', supplier: 'Continental', date: '2026-10-27', checked: '2026-11-02',
    headline: 'North Sea port strike averted (Hamburg, Bremerhaven)',
    summary: 'Port workers voted for a strike but missed the 75% needed, so there is no strike; a 12-month pay deal (3.4%) was agreed. Our Continental tires go through Bremerhaven. Watch only, since earlier strikes in Aug-Sep 2026 had closed terminals.',
    severity: 'low', source: 'https://sozonline.de/2026/10/nordseehaefen-doch-kein-streik'
  },
  {
    supplier_id: 'S11', supplier: 'Busch & Muller', date: '2026-10-27', checked: '2026-11-02',
    headline: 'North Sea port strike averted (Hamburg, Bremerhaven)',
    summary: 'Port workers voted for a strike but missed the 75% needed, so there is no strike; a 12-month pay deal (3.4%) was agreed. Our Busch & Muller lights go through Hamburg. Watch only, since earlier strikes in Aug-Sep 2026 had closed terminals.',
    severity: 'low', source: 'https://sozonline.de/2026/10/nordseehaefen-doch-kein-streik'
  },

  // --- Checked, nothing found ---
  {
    supplier_id: 'S06', supplier: 'Shimano', date: '2026-11-02', checked: '2026-11-02',
    headline: 'Checked, nothing found',
    summary: 'No dated item in the last 30 days. Shimano\'s news page blocked our reader, so this covers web search only.',
    severity: 'none', source: null
  },
  {
    supplier_id: 'S07', supplier: 'KMC Chain', date: '2026-11-02', checked: '2026-11-02',
    headline: 'Checked, nothing found',
    summary: 'No recall, fire or shutdown found in web search. KMC\'s news page could not be loaded, so this covers web search only.',
    severity: 'none', source: null
  },
  {
    supplier_id: 'S10', supplier: 'DT Swiss', date: '2026-11-02', checked: '2026-11-02',
    headline: 'Checked, nothing found',
    summary: 'No item dated in the last 30 days. DT Swiss\'s news pages could not be loaded, so this covers web search only.',
    severity: 'none', source: null
  },
  {
    supplier_id: 'S12', supplier: 'Selle Royal', date: '2026-11-02', checked: '2026-11-02',
    headline: 'Checked, nothing found',
    summary: 'No dated news on their site and none in web search. A possible Italian port strike on Oct 30 was reported but could not be confirmed, so it is not listed; worth a manual check.',
    severity: 'none', source: null
  },
  {
    supplier_id: 'S13', supplier: 'Uline', date: '2026-11-02', checked: '2026-11-02',
    headline: 'Checked, nothing found',
    summary: 'No closure, fire, recall or strike found in web search. Uline\'s press page could not be loaded, so this covers web search only.',
    severity: 'none', source: null
  }
];
