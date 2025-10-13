import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { menuService } from '@/services/menuService';
import { orderManagementService } from '@/services/orderManagement';
import { toast } from 'sonner';
import { RefreshCw, Upload, Database, FileUp, FileDown } from 'lucide-react';
import { Label } from '@/components/ui/Label';

const SettingsPanel: React.FC = () => {
  const [busy, setBusy] = useState(false);

  const resetMockData = async () => {
    setBusy(true);
    try {
      menuService.reset([]);
      orderManagementService.reset([]);
      toast.success('Mock data reset successfully');
    } catch (e) {
      toast.error('Failed to reset');
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const importFullMenu = async () => {
    setBusy(true);
    try {
      await menuService.forceImportFromSite();
      toast.success('Full site menu imported');
    } catch (e) {
      toast.error('Failed to import menu');
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const parseCsvAndImport = async (file: File) => {
    setBusy(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 3) throw new Error('CSV appears empty or malformed');

      // Expect header like: OH Smash,,,,Wonder Wings,,,,Okra Green,,,
      // And columns like: Category,Name,Price(£),,Category,Name,Price(£),,Category,Name,Price(£),
      // But support variable number of brand groups by inferring from header line.

      const headerBrandsRaw = lines[0].split(',');
      // Build group map from header: every 4th column is a brand name
      const groups: { brandKey: string; offset: number }[] = [];
      for (let idx = 0; idx < headerBrandsRaw.length; idx += 4) {
        const raw = (headerBrandsRaw[idx] || '').trim();
        if (!raw) continue;
        // Normalise brand names
        const norm = raw
          .replace(/\s+/g, ' ') // collapse spaces
          .replace(/^OH\s*Smash$/i, 'OhSmash')
          .replace(/^Oh\s*Smash$/i, 'OhSmash')
          .replace(/^Wonder\s*Wings$/i, 'Wonder Wings')
          .replace(/^Okra\s*Green$/i, 'Okra Green');
        const brandKey = norm as 'OhSmash' | 'Wonder Wings' | 'Okra Green' | string;
        groups.push({ brandKey, offset: idx });
      }

      const siteMenusDynamic: Record<string, { name: string; price: number; description?: string; category: string; veg?: boolean; image?: string; }[]> = {};
      groups.forEach(g => { siteMenusDynamic[g.brandKey] = []; });

      // Start from line 3 (index 2): data rows
      for (let i = 2; i < lines.length; i++) {
        const row = lines[i];
        // Split by comma but keep quoted values together
        const cols: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let c = 0; c < row.length; c++) {
          const ch = row[c];
          if (ch === '"') {
            inQuotes = !inQuotes;
            continue;
          }
          if (ch === ',' && !inQuotes) {
            cols.push(current);
            current = '';
          } else {
            current += ch;
          }
        }
        cols.push(current);

        // Expected pattern per row (12 columns inc. empties):
        // [cat1,name1,price1,empty, cat2,name2,price2,empty, cat3,name3,price3, empty]
        groups.forEach(g => {
          const cat = (cols[g.offset] || '').trim();
          const name = (cols[g.offset + 1] || '').trim();
          const priceStr = (cols[g.offset + 2] || '').trim();
          if (!name) return;
          const price = Number(priceStr.replace(/[^0-9.]/g, ''));
          if (Number.isNaN(price)) return;
          if (!siteMenusDynamic[g.brandKey]) siteMenusDynamic[g.brandKey] = [];
          siteMenusDynamic[g.brandKey].push({
            name,
            price,
            category: cat || 'General',
          });
        });
      }

      // Remove empty arrays (if any)
      Object.keys(siteMenusDynamic).forEach((k) => {
        if (siteMenusDynamic[k].length === 0) delete (siteMenusDynamic as any)[k];
      });

      menuService.importFromSiteMenus(siteMenusDynamic);
      toast.success('Menu imported from CSV');
    } catch (e) {
      console.error(e);
      toast.error('Failed to import CSV');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Data Management</h2>
          <p className="text-sm text-muted-foreground">Reset or import data for the admin system.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={resetMockData} disabled={busy} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Mock Data
            </Button>
            <Button onClick={importFullMenu} disabled={busy}>
              <Upload className="h-4 w-4 mr-2" />
              Import Full Menu from Site
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              disabled={busy}
              variant="outline"
              onClick={async () => {
                try {
                  setBusy(true);
                  const res = await fetch('/menu-template.csv', { cache: 'no-store' });
                  if (!res.ok) throw new Error('Template CSV not found');
                  const text = await res.text();
                  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
                  if (lines.length < 2) throw new Error('Template CSV empty');
                  const header = lines[0].split(',').map(s => s.trim().toLowerCase());
                  const col = (name: string) => header.indexOf(name);
                  const idxBrand = col('brand');
                  const idxCategory = col('category');
                  const idxName = col('name');
                  const idxDesc = col('description');
                  const idxPrice = col('price');
                  const idxVeg = col('veg');
                  const idxImage = col('image');
                  if (idxBrand < 0 || idxCategory < 0 || idxName < 0 || idxPrice < 0) throw new Error('Missing required columns');
                  const siteMenusDynamic: Record<string, { name: string; price: number; description?: string; category: string; veg?: boolean; image?: string; }[]> = {};
                  const normBrand = (raw: string) => {
                    const t = (raw || '').trim();
                    if (/^oh\s*smash$/i.test(t)) return 'OhSmash';
                    if (/^wonder\s*wings$/i.test(t)) return 'Wonder Wings';
                    if (/^okra\s*green$/i.test(t)) return 'Okra Green';
                    return t;
                  };
                  for (let i = 1; i < lines.length; i++) {
                    const row = lines[i];
                    const cols: string[] = [];
                    let cur = ''; let inQ = false;
                    for (let j = 0; j < row.length; j++) {
                      const ch = row[j];
                      if (ch === '"') { inQ = !inQ; continue; }
                      if (ch === ',' && !inQ) { cols.push(cur); cur=''; } else { cur += ch; }
                    }
                    cols.push(cur);
                    const brand = normBrand(cols[idxBrand] || '');
                    const category = (cols[idxCategory] || 'General').trim();
                    const name = (cols[idxName] || '').trim();
                    const priceStr = (cols[idxPrice] || '').trim();
                    if (!brand || !name || !priceStr) continue;
                    const price = Number(priceStr.replace(/[^0-9.]/g, ''));
                    if (Number.isNaN(price)) continue;
                    const description = (cols[idxDesc] || '').trim();
                    const vegVal = (cols[idxVeg] || '').trim().toLowerCase();
                    const veg = vegVal === 'true' ? true : vegVal === 'false' ? false : undefined;
                    const image = (cols[idxImage] || '').trim();
                    if (!siteMenusDynamic[brand]) siteMenusDynamic[brand] = [];
                    siteMenusDynamic[brand].push({ name, price, description, category, veg, image });
                  }
                  menuService.importFromSiteMenus(siteMenusDynamic);
                  toast.success('Imported from template CSV');
                } catch (e) {
                  console.error(e);
                  toast.error('Failed to import from template');
                } finally {
                  setBusy(false);
                }
              }}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Import From Template (public/menu-template.csv)
            </Button>
            <a
              className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-muted"
              href="/menu-template.csv" download
            >
              <FileDown className="h-4 w-4 mr-2" /> Download CSV Template
            </a>
          </div>
          <div className="space-y-2 pt-2">
            <Label>Import Menu from CSV (Downloads sheet)</Label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) parseCsvAndImport(f);
                }}
              />
              <span className="text-xs text-muted-foreground">Expected columns per brand: Category, Name, Price(£)</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <FileUp className="inline h-3 w-3 mr-1" />
              Supports your sheet format with three brand columns.
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <Database className="inline h-3 w-3 mr-1" />
            Uses localStorage for persistence in this mock environment.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;


