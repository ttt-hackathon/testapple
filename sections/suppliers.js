// Suppliers section: fills <div id="suppliers"> with every supplier, a risk level and a one-line reason.
// Risk points: only-source parts, weeks of stock on hand, lead time, on-time delivery.
// 6+ points = High, 3-5 = Medium, 0-2 = Low.
(function () {
  function assess(s, parts, inventory) {
    var mine = parts.filter(function (p) { return p.supplier_id === s.supplier_id; });
    var only = mine.filter(function (p) { return p.only_source === 'Yes'; });
    var cover = null, coverPart = null;
    mine.forEach(function (p) {
      var inv = inventory.filter(function (i) { return i.part_number === p.part_number; })[0];
      if (inv && (cover === null || inv.weeks_of_cover < cover)) { cover = inv.weeks_of_cover; coverPart = p; }
    });
    var pts = 0, why = [];
    if (only.length) { pts += 1; why.push('only source for ' + only.length + ' part' + (only.length > 1 ? 's' : '')); }
    if (cover !== null) {
      if (cover <= 4) pts += 3; else if (cover <= 8) pts += 2; else if (cover <= 12) pts += 1;
      if (cover <= 8) why.push('only ' + cover + ' weeks of stock (' + coverPart.description + ')');
    }
    if (s.lead_time_days >= 90) { pts += 2; why.push(s.lead_time_days + '-day lead time'); }
    else if (s.lead_time_days >= 45) { pts += 1; why.push(s.lead_time_days + '-day lead time'); }
    if (s.on_time_delivery_pct_last_12_months < 90) { pts += 2; why.push(s.on_time_delivery_pct_last_12_months + '% on time'); }
    else if (s.on_time_delivery_pct_last_12_months < 95) { pts += 1; why.push(s.on_time_delivery_pct_last_12_months + '% on time'); }
    var level = pts >= 6 ? 'High' : pts >= 3 ? 'Medium' : 'Low';
    var reason = why.length ? why.join('; ') : 'plenty of stock, short lead time, reliable deliveries';
    reason = reason.charAt(0).toUpperCase() + reason.slice(1) + '.';
    return { level: level, pts: pts, reason: reason, cover: cover };
  }

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function render() {
    var box = document.getElementById('suppliers');
    var d = window.LAUREL_RIDGE;
    if (!box || !d) return;
    var order = { High: 0, Medium: 1, Low: 2 };
    var rows = d.suppliers.map(function (s) { return { s: s, r: assess(s, d.parts, d.inventory) }; });
    rows.sort(function (a, b) { return order[a.r.level] - order[b.r.level] || b.r.pts - a.r.pts; });

    var css = '<style>' +
      '#suppliers h2{margin:0 0 4px;font-size:20px}' +
      '#suppliers .suppliers-note{margin:0 0 14px;color:#5b6b62;font-size:14px}' +
      '#suppliers table.suppliers-table{width:100%;border-collapse:collapse;font-size:14px}' +
      '#suppliers .suppliers-table th{text-align:left;border-bottom:2px solid #ddd8cc;padding:8px 10px;color:#5b6b62;font-size:12px;text-transform:uppercase;letter-spacing:.04em}' +
      '#suppliers .suppliers-table td{border-bottom:1px solid #ddd8cc;padding:8px 10px;vertical-align:top}' +
      '#suppliers .suppliers-badge{display:inline-block;padding:2px 10px;border-radius:999px;font-weight:700;font-size:12px}' +
      '#suppliers .suppliers-High{background:#f8d7d3;color:#8a1c12}' +
      '#suppliers .suppliers-Medium{background:#fbe8b8;color:#6b4a00}' +
      '#suppliers .suppliers-Low{background:#d6ecdd;color:#1d5a37}' +
      '</style>';

    var body = rows.map(function (x) {
      return '<tr><td><strong>' + esc(x.s.supplier_name) + '</strong><br><span style="color:#5b6b62">' + esc(x.s.parts_supplied) + '</span></td>' +
        '<td><span class="suppliers-badge suppliers-' + x.r.level + '">' + x.r.level + '</span></td>' +
        '<td>' + esc(x.r.reason) + '</td></tr>';
    }).join('');

    box.innerHTML = css + '<h2>Suppliers</h2>' +
      '<p class="suppliers-note">Risk is based on only-source parts, weeks of stock on hand, lead time and on-time delivery. Highest risk first.</p>' +
      '<table class="suppliers-table"><thead><tr><th>Supplier</th><th>Risk</th><th>Why</th></tr></thead><tbody>' + body + '</tbody></table>';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
