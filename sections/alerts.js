// Alerts section: fills <div id="alerts"> with the result of checking supplier websites for advisories.
// A web page can only read another website if that site allows it, and only Cataloochee Cell Works
// publishes a machine-readable advisories feed. Every other supplier is listed as "check manually".
// High-severity advisories also show as a red banner at the top of the dashboard, with an email draft.
(function () {
  // Suppliers whose advisories a web page can read automatically: supplier_id -> feed + page.
  var FEEDS = {
    S01: {
      feed: 'https://ttt-hackathon.github.io/cataloochee-cellworks/advisories.json',
      page: 'https://ttt-hackathon.github.io/cataloochee-cellworks/advisories.html'
    }
  };

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function niceDate(iso) {
    var m = /^(\d{4})-(\d\d)-(\d\d)/.exec(iso || '');
    if (!m) return iso || 'date not given';
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[+m[2] - 1] + ' ' + (+m[3]) + ', ' + m[1];
  }

  function isHigh(a) { return /^(high|critical|severe)$/i.test(a.severity || '') && !/^resolved$/i.test(a.status || ''); }

  // Build the email from the advisory plus what our own purchasing data says about that supplier.
  function buildEmail(s, a, link, d) {
    var parts = d.parts.filter(function (p) { return p.supplier_id === s.supplier_id; });
    var lines = parts.map(function (p) {
      var inv = d.inventory.filter(function (i) { return i.part_number === p.part_number; })[0];
      return inv ? '  - ' + p.description + ' (' + p.part_number + '): ' + inv.on_hand_units + ' on hand, about ' + inv.weeks_of_cover + ' weeks of cover' : null;
    }).filter(Boolean);
    var orders = d.openOrders.filter(function (o) { return o.supplier_id === s.supplier_id; });
    var delay = a.expected_delay_weeks;
    var minCover = Math.min.apply(null, parts.map(function (p) {
      var inv = d.inventory.filter(function (i) { return i.part_number === p.part_number; })[0];
      return inv ? inv.weeks_of_cover : Infinity;
    }));
    var gap = (typeof delay === 'number' && isFinite(minCover) && delay > minCover)
      ? 'The expected delay (' + delay + ' weeks) is longer than our thinnest stock (' + minCover + ' weeks), so we could run out of parts.'
      : (typeof delay === 'number' && isFinite(minCover) ? 'Our thinnest stock (' + minCover + ' weeks) currently covers the expected delay (' + delay + ' weeks), but with little margin to spare.' : '');
    var onlySrc = parts.filter(function (p) { return p.only_source === 'Yes'; }).length;

    var subject = 'URGENT: ' + s.supplier_name + ' advisory: ' + a.title;
    var body = [
      'Hi purchasing team,',
      '',
      s.supplier_name + ' has posted a high-severity customer advisory.',
      '',
      'What happened',
      '  ' + a.title + ' (' + niceDate(a.date) + ')',
      '  ' + a.details,
      '  Products affected: ' + ((a.products_affected || []).join(', ') || 'not stated'),
      '  Expected delay: ' + (typeof delay === 'number' ? delay + ' weeks' : 'not stated'),
      '  Status: ' + (a.status || 'not stated'),
      '',
      'Where we stand',
      lines.length ? lines.join('\n') : '  (no stock records found)',
      '  Open orders with them: ' + orders.length + (orders.length ? ' (next promised arrival ' + orders.map(function (o) { return o.promised_arrival_date; }).sort()[0] + ')' : ''),
      onlySrc ? '  They are our only approved source for ' + onlySrc + ' part' + (onlySrc > 1 ? 's' : '') + '.' : '',
      gap ? '  ' + gap : '',
      '',
      'What to do',
      '  1. Call ' + s.supplier_name + ' today to confirm the delay, what is affected and which of our open orders are at risk.',
      '  2. Check the open orders above against the promised arrival dates and ask for the earliest possible shipments.',
      '  3. Tell production planning how many weeks of build could be affected.',
      onlySrc ? '  4. Because there is no backup source for these parts, start looking at options now.' : '',
      '',
      'Source: ' + link + ' (published ' + niceDate(a.date) + ', advisory ' + a.id + ')'
    ].filter(function (l) { return l !== null; }).join('\n').replace(/\n\n\n+/g, '\n\n');
    return { subject: subject, body: body };
  }

  var CSS = '<style>' +
    '#alerts h2{margin:0 0 4px;font-size:20px}' +
    '#alerts .alerts-note{margin:0 0 14px;color:#5b6b62;font-size:14px}' +
    '#alerts .alerts-row{border-top:1px solid #ddd8cc;padding:8px 0;font-size:14px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}' +
    '#alerts .alerts-sub{color:#5b6b62}' +
    '#alerts .alerts-ok{color:#1d5a37;font-weight:600}' +
    '#alerts .alerts-email{margin-top:10px;border:1px solid #ddd8cc;border-radius:8px;padding:12px;background:#faf9f5}' +
    '#alerts .alerts-email pre{white-space:pre-wrap;font:13px/1.5 ui-monospace,Consolas,monospace;margin:8px 0}' +
    '#alerts .alerts-btn{display:inline-block;margin-right:8px;padding:6px 12px;border-radius:6px;border:1px solid #2f6b4f;background:#2f6b4f;color:#fff;font-size:13px;text-decoration:none;cursor:pointer}' +
    '#alerts-banner{background:#b3261e;color:#fff;padding:14px 20px;font-size:15px}' +
    '#alerts-banner a{color:#fff;font-weight:700}' +
    '</style>';

  function setBanner(items) {
    var old = document.getElementById('alerts-banner');
    if (old) old.parentNode.removeChild(old);
    if (!items.length) return;
    var el = document.createElement('div');
    el.id = 'alerts-banner';
    el.setAttribute('role', 'alert');
    el.innerHTML = '<strong>HIGH-SEVERITY SUPPLIER ADVISORY:</strong> ' + items.map(function (x) {
      return esc(x.s.supplier_name) + ': ' + esc(x.a.title) + ' (' + esc(niceDate(x.a.date)) + ')';
    }).join(' · ') + ' <a href="#alerts">See the email to purchasing</a>';
    var anchor = document.querySelector('header') || document.querySelector('main') || document.body.firstChild;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(el, anchor); else document.body.appendChild(el);
  }

  function render() {
    var box = document.getElementById('alerts');
    var d = window.LAUREL_RIDGE;
    if (!box || !d) return;
    box.innerHTML = CSS + '<h2>Supplier advisories</h2><p class="alerts-note">Checking supplier websites…</p>';

    var results = d.suppliers.map(function (s) {
      var f = FEEDS[s.supplier_id];
      if (!f) return Promise.resolve({ s: s, status: 'manual' });
      return fetch(f.feed).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) { return { s: s, status: 'ok', feed: f, list: j.advisories || [], updated: j.updated }; })
        .catch(function (e) { return { s: s, status: 'error', feed: f, error: e.message || 'network problem' }; });
    });

    Promise.all(results).then(function (res) {
      var highs = [];
      res.forEach(function (r) {
        if (r.status === 'ok') r.list.filter(isHigh).forEach(function (a) { highs.push({ s: r.s, a: a, feed: r.feed }); });
      });
      setBanner(highs);

      var checked = res.filter(function (r) { return r.status === 'ok'; }).length;
      var html = CSS + '<h2>Supplier advisories</h2><p class="alerts-note">' + checked + ' of ' + res.length +
        ' suppliers publish advisories a web page can read automatically; the rest need a manual check. ' +
        (highs.length ? highs.length + ' high-severity advisory found.' : 'No high-severity advisories right now.') + '</p>';

      highs.forEach(function (x, i) {
        var link = x.feed.page + '#' + x.a.id;
        var m = buildEmail(x.s, x.a, link, d);
        html += '<div class="alerts-email"><strong>Ready-to-send email to purchasing</strong> ' +
          '<span class="alerts-sub">· Source: <a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(x.s.supplier_name) + ' advisory ' + esc(x.a.id) + '</a>, ' + esc(niceDate(x.a.date)) + '</span>' +
          '<pre id="alerts-email-' + i + '"><strong>Subject: ' + esc(m.subject) + '</strong>\n\n' + esc(m.body) + '</pre>' +
          '<a class="alerts-btn" href="mailto:?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body) + '">Open in my email</a>' +
          '<button class="alerts-btn" data-alerts-copy="' + i + '">Copy email</button></div>';
        x.text = 'Subject: ' + m.subject + '\n\n' + m.body;
      });

      res.forEach(function (r) {
        var site = '<a href="' + esc(r.s.website) + '" target="_blank" rel="noopener">website</a>';
        var right;
        if (r.status === 'ok') {
          var open = r.list.filter(function (a) { return !/^resolved$/i.test(a.status || ''); });
          right = '<span class="alerts-ok">Checked: ' + open.length + ' active advisor' + (open.length === 1 ? 'y' : 'ies') + ', none high-severity</span>';
          if (r.list.some(isHigh)) right = '<strong style="color:#b3261e">High-severity advisory, see above</strong>';
          right += ' <span class="alerts-sub">(<a href="' + esc(r.feed.page) + '" target="_blank" rel="noopener">advisories page</a>)</span>';
        } else if (r.status === 'error') {
          right = '<span style="color:#8a1c12">Could not read advisories (' + esc(r.error) + ')</span> <span class="alerts-sub">(<a href="' + esc(r.feed.page) + '" target="_blank" rel="noopener">check page</a>)</span>';
        } else {
          right = '<span class="alerts-sub">Cannot be checked automatically. Please check their ' + site + ' by hand.</span>';
        }
        html += '<div class="alerts-row"><strong>' + esc(r.s.supplier_name) + '</strong><span>' + right + '</span></div>';
      });

      box.innerHTML = html;
      Array.prototype.forEach.call(box.querySelectorAll('[data-alerts-copy]'), function (b) {
        b.addEventListener('click', function () {
          var text = highs[+b.getAttribute('data-alerts-copy')].text;
          if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { b.textContent = 'Copied'; });
        });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
