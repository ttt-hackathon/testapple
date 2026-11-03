// Weather section: fills <div id="weather"> with today's weather at each supplier's factory city.
// Uses Open-Meteo (free, no key). Severe conditions are flagged from Open-Meteo's forecast numbers
// (they are not official government alerts), each with a source link and date.
(function () {
  var CODES = {
    0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Freezing fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Heavy freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains', 80: 'Light showers', 81: 'Showers',
    82: 'Violent showers', 85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
    96: 'Thunderstorm with hail', 99: 'Severe thunderstorm with hail'
  };
  var SEVERE_CODES = { 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Heavy freezing rain', 75: 'Heavy snow',
    82: 'Violent rain showers', 86: 'Heavy snow showers', 95: 'Thunderstorm', 96: 'Thunderstorm with hail',
    99: 'Severe thunderstorm with hail' };

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function getJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  // Find the city's coordinates. Tries the full name, then each part split at a comma or slash.
  function geocode(s) {
    var names = [s.factory_city];
    s.factory_city.split(/[,\/]/).forEach(function (part) {
      part = part.trim();
      if (part && names.indexOf(part) < 0) names.push(part);
    });
    function attempt(i) {
      if (i >= names.length) return Promise.resolve(null);
      var url = 'https://geocoding-api.open-meteo.com/v1/search?count=20&language=en&name=' + encodeURIComponent(names[i]);
      return getJSON(url).then(function (res) {
        var hits = (res.results || []).filter(function (h) { return h.country === s.factory_country; });
        var region = s.factory_region.toLowerCase();
        var best = hits.filter(function (h) { return h.admin1 && h.admin1.toLowerCase() === region; })[0] || hits[0];
        return best || attempt(i + 1);
      });
    }
    return attempt(0);
  }

  function forecast(loc) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.latitude + '&longitude=' + loc.longitude +
      '&current=temperature_2m,weather_code,wind_speed_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_gusts_10m_max' +
      '&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=1';
    return getJSON(url);
  }

  function severe(d) {
    var out = [], code = d.daily.weather_code[0];
    if (SEVERE_CODES[code]) out.push(SEVERE_CODES[code] + ' expected today');
    if (d.daily.wind_gusts_10m_max[0] >= 50) out.push('Damaging wind gusts up to ' + Math.round(d.daily.wind_gusts_10m_max[0]) + ' mph');
    if (d.daily.precipitation_sum[0] >= 2) out.push('Very heavy precipitation: ' + d.daily.precipitation_sum[0].toFixed(1) + ' in');
    if (d.daily.temperature_2m_max[0] >= 100) out.push('Extreme heat: high of ' + Math.round(d.daily.temperature_2m_max[0]) + '°F');
    if (d.daily.temperature_2m_min[0] <= 14) out.push('Extreme cold: low of ' + Math.round(d.daily.temperature_2m_min[0]) + '°F');
    return out;
  }

  function place(s) { return s.factory_city + ', ' + (s.factory_country === 'United States' ? s.factory_region : s.factory_country); }

  var CSS = '<style>' +
    '#weather h2{margin:0 0 4px;font-size:20px}' +
    '#weather .weather-note{margin:0 0 14px;color:#5b6b62;font-size:14px}' +
    '#weather .weather-row{border-top:1px solid #ddd8cc;padding:10px 0;font-size:14px}' +
    '#weather .weather-top{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}' +
    '#weather .weather-sub{color:#5b6b62}' +
    '#weather .weather-warn{margin-top:6px;background:#f8d7d3;color:#8a1c12;border-radius:8px;padding:6px 10px}' +
    '#weather .weather-warn a{color:#8a1c12}' +
    '#weather .weather-ok{color:#1d5a37;font-weight:600}' +
    '</style>';

  function rowHtml(c) {
    var names = c.suppliers.map(function (s) { return s.supplier_name; }).join(', ');
    var head = '<div class="weather-top"><div><strong>' + esc(c.label) + '</strong><div class="weather-sub">' + esc(names) + '</div></div>';
    if (c.error) return '<div class="weather-row">' + head + '<div class="weather-sub">Weather unavailable (' + esc(c.error) + ')</div></div></div>';
    var d = c.data, cur = d.current, day = d.daily;
    var flags = severe(d);
    var link = 'https://open-meteo.com/en/docs#latitude=' + c.loc.latitude + '&longitude=' + c.loc.longitude;
    var src = '<a href="' + esc(link) + '" target="_blank" rel="noopener">Open-Meteo forecast</a>, ' + esc(day.time[0]);
    var html = head + '<div style="text-align:right"><strong>' + Math.round(cur.temperature_2m) + '°F</strong> ' +
      esc(CODES[cur.weather_code] || 'Conditions unknown') + '<div class="weather-sub">High ' + Math.round(day.temperature_2m_max[0]) +
      '° / Low ' + Math.round(day.temperature_2m_min[0]) + '° · Wind ' + Math.round(cur.wind_speed_10m) + ' mph</div></div></div>';
    if (flags.length) html += '<div class="weather-warn"><strong>Severe conditions:</strong> ' + esc(flags.join('; ')) + '. Source: ' + src + '</div>';
    else html += '<div class="weather-ok">No severe conditions today <span class="weather-sub" style="font-weight:400">(' + src + ')</span></div>';
    return '<div class="weather-row">' + html + '</div>';
  }

  function render() {
    var box = document.getElementById('weather');
    var d = window.LAUREL_RIDGE;
    if (!box || !d) return;

    var cities = {}, order = [];
    d.suppliers.forEach(function (s) {
      var k = s.factory_city + '|' + s.factory_country;
      if (!cities[k]) { cities[k] = { label: place(s), suppliers: [], s: s }; order.push(k); }
      cities[k].suppliers.push(s);
    });

    box.innerHTML = CSS + '<h2>Weather at supplier factories</h2><p class="weather-note">Loading today\'s weather…</p>';

    Promise.all(order.map(function (k) {
      var c = cities[k];
      return geocode(c.s).then(function (loc) {
        if (!loc) throw new Error('city not found');
        c.loc = loc;
        return forecast(loc);
      }).then(function (data) { c.data = data; }).catch(function (e) { c.error = e.message || 'network problem'; });
    })).then(function () {
      var flagged = order.filter(function (k) { return cities[k].data && severe(cities[k].data).length; }).length;
      var summary = flagged ? flagged + ' of ' + order.length + ' factory cities have severe conditions today.' : 'No severe conditions at any factory city today.';
      box.innerHTML = CSS + '<h2>Weather at supplier factories</h2><p class="weather-note">Today\'s conditions from Open-Meteo. ' +
        'Severe flags come from forecast numbers (storms, heavy rain or snow, strong wind, extreme heat or cold), not official government alerts. ' + summary + '</p>' +
        order.map(function (k) { return rowHtml(cities[k]); }).join('');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
