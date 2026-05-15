# Code Coverage Report

Panduan menggunakan code coverage reporting untuk project ini.

## Generate Coverage Report

### Command yang tersedia:

```bash
# Run tests dengan coverage report
npm run test:coverage

# Run tests dengan coverage report dan watch mode (auto-rerun saat file berubah)
npm run test:coverage:watch

# Run specific test file dengan coverage
npm test -- --coverage tests/unit_testing/job.test.ts
```

## View Coverage Report

Setelah menjalankan `npm run test:coverage`, hasil coverage akan tersimpan di folder `coverage/`.

### HTML Report (Recommended):
```bash
# Buka file ini di browser
coverage/index.html
```

File ini menampilkan coverage breakdown per file dengan line-by-line highlighting.

### Terminal Output:
Coverage summary juga ditampilkan di terminal setelah test selesai.

Contoh output:
```
-------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |   45.23 |   38.50  |   52.10 |   45.23 |
 src/       |   45.23 |   38.50  |   52.10 |   45.23 |
  ...
```

## Coverage Thresholds

Minimum coverage yang ditargetkan:
- **Statements**: 50%
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%

Jika coverage di bawah threshold, test akan fail. Edit `jest.config.cjs` untuk mengubah threshold ini:

```javascript
coverageThreshold: {
  global: {
    branches: 50,      // Ubah angka ini
    functions: 50,
    lines: 50,
    statements: 50
  }
}
```

## Coverage Report Files

Setelah run `npm run test:coverage`, folder `coverage/` akan berisi:

- **index.html** - HTML report interaktif (buka di browser)
- **coverage-summary.json** - Summary dalam format JSON
- **lcov.info** - Format LCOV untuk integrasi dengan tools lain
- **Text reports** - Summary di terminal

## Mengecualikan File dari Coverage

File-file berikut sudah dikecualikan:
- TypeScript definition files (*.d.ts)
- Entry points (main.tsx, vite-env.d.ts)
- node_modules/ dan dist/

Untuk menambah pengecualian, edit `collectCoverageFrom` di `jest.config.cjs`.

## Integration dengan CI/CD

Jika menggunakan GitHub Actions atau CI lain, tambahkan step:

```yaml
- name: Generate Coverage Report
  run: npm run test:coverage
  
- name: Upload Coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/lcov.info
```

## Tips

1. Jalankan `npm run test:coverage:watch` saat development untuk real-time feedback
2. Fokus pada coverage di file-file yang critical terlebih dahulu
3. Bukan semua code perlu 100% coverage — prioritaskan business logic
4. Use coverage report untuk identify untested code paths
