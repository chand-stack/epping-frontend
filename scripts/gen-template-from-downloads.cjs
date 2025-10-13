const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(process.env.HOME || process.env.USERPROFILE, 'Downloads', 'Epping food court - Sheet1.csv');
const outputPath = path.resolve(process.cwd(), 'public', 'menu-template.csv');

function parseCsvRow(row) {
  const cols = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { cols.push(current); current = ''; }
    else { current += ch; }
  }
  cols.push(current);
  return cols;
}

function normBrand(raw) {
  const t = (raw || '').trim();
  if (!t) return '';
  if (/^oh\s*smash$/i.test(t) || /^OH\s*Smash$/i.test(t)) return 'OhSmash';
  if (/^wonder\s*wings$/i.test(t)) return 'Wonder Wings';
  if (/^okra\s*green$/i.test(t)) return 'Okra Green';
  return t; // fallback to raw
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Input CSV not found:', inputPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(inputPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 3) {
    console.error('CSV seems too short');
    process.exit(1);
  }
  const header1 = parseCsvRow(lines[0]);
  const header2 = parseCsvRow(lines[1]);

  // Determine groups of 4 columns (Category,Name,Price,blank)
  const groups = [];
  for (let i = 0; i < header1.length; i += 4) {
    const brandKey = normBrand(header1[i]);
    if (brandKey) groups.push({ brandKey, offset: i });
  }
  if (groups.length === 0) {
    console.error('No brand columns detected from first header row');
    process.exit(1);
  }

  const outRows = [];
  // Header for template
  outRows.push(['Brand','Category','Name','Description','Price','VEG','Image']);

  for (let r = 2; r < lines.length; r++) {
    const cols = parseCsvRow(lines[r]);
    groups.forEach(g => {
      const cat = (cols[g.offset] || '').trim();
      const name = (cols[g.offset + 1] || '').trim();
      const priceStr = (cols[g.offset + 2] || '').trim();
      if (!name) return; // skip empty brand cell
      const price = priceStr.replace(/[^0-9.]/g, '');
      outRows.push([
        g.brandKey,
        cat || 'General',
        name,
        '', // Description blank for user to fill
        price,
        '', // VEG blank for user to fill (true/false)
        ''  // Image URL blank for user to fill
      ]);
    });
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const csv = outRows.map(r => r.map(v => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }).join(',')) .join('\n') + '\n';
  fs.writeFileSync(outputPath, csv, 'utf8');
  console.log('Wrote template:', outputPath, 'rows:', outRows.length - 1);
}

main();
