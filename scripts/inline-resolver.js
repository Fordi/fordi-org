const { readFileSync } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { parse } = require('node-html-parser');

exports.interfaceVersion = 2;

const importMapCache = {};

const getImportMap = (file) => {
  if (!importMapCache[file]) {
    const html = readFileSync(file, 'utf-8');
    const dom = parse(html);
    const map = dom.querySelector('script[type=importmap]');
    try {
      const { imports } = JSON.parse(map.textContent);
      importMapCache[file] = imports;
    } catch (e) {
      importMapCache[file] = {};
    }
  }
  return importMapCache[file];
};

const root = resolve(__dirname, '..');

exports.resolve = (source, file, config) => {
  const mapPath = resolve(root, `${config.importMap}`);
  const imports = getImportMap(mapPath);
  const lib = imports[source];
  if (lib) {
    if (lib.startsWith('https://')) {
      return { found: true, path: null };
    }
    const path = resolve(root, `docs/${lib}`);
    return { found: true, path };
  }
  return { found: undefined, path: null };
};
