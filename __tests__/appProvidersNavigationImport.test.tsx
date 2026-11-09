import fs from 'node:fs';
import path from 'node:path';

test('application providers do not require NavigationProvider at app startup', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'src/app/providers/AppProviders.tsx'), 'utf8');
  expect(source).not.toContain('NavigationProvider');
});
