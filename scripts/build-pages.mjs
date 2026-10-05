import { cpSync, mkdirSync, rmSync, writeFileSync, symlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = process.cwd();
const stage = resolve(root, '.pages-build');
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage);
// Allowlist only application sources. Never copy environment files or server routes.
for (const dir of ['components', 'config', 'content', 'features', 'styles', 'lib', 'public', 'vendor', 'hooks'])
  cpSync(resolve(root, dir), resolve(stage, dir), { recursive: true });
mkdirSync(resolve(stage, 'app'));
for (const file of ['page.tsx', 'layout.tsx', 'globals.css'])
  cpSync(resolve(root, 'app', file), resolve(stage, 'app', file));
cpSync(resolve(root, 'app/demo'), resolve(stage, 'app/demo'), { recursive: true });
for (const file of ['package.json', 'tsconfig.json', 'postcss.config.mjs'])
  cpSync(resolve(root, file), resolve(stage, file));
symlinkSync(resolve(root, 'node_modules'), resolve(stage, 'node_modules'), 'dir');
writeFileSync(resolve(stage, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], strict: true, skipLibCheck: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true, jsx: 'react-jsx', allowImportingTsExtensions: true, paths: { '@/*': ['./*'] } }, include: ['app/**/*.tsx', 'next-env.d.ts', '.next/types/**/*.ts'], exclude: ['node_modules'] }));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/reformers-website';
writeFileSync(resolve(stage, 'next.config.mjs'), `export default { output: 'export', trailingSlash: true, basePath: ${JSON.stringify(basePath)}, images: { unoptimized: true } };\n`);
const result = spawnSync(process.execPath, [resolve(root, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], {
  cwd: stage, stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_STATIC_SITE: 'true', NEXT_PUBLIC_BASE_PATH: basePath, NEXT_TELEMETRY_DISABLED: '1' }
});
if (result.status !== 0) process.exit(result.status ?? 1);
rmSync(resolve(root, 'pages-out'), { recursive: true, force: true });
cpSync(resolve(stage, 'out'), resolve(root, 'pages-out'), { recursive: true });
writeFileSync(resolve(root, 'pages-out/.nojekyll'), '');
