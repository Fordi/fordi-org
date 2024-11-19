export default class ModuleCache {
  #modules = {};

  #fetchModule;

  #get(obj, path) {
    if (path.length === 1) {
      return obj?.[path[0]];
    }
    return this.#get(obj[path[0]], path.slice(1));
  }

  static parseComponentName(name) {
    const path = name.split('/');
    const dots = path.pop().split('.');
    path.push(dots.shift());
    return {
      moduleName: path.join('/'),
      exportName: dots.length ? dots : ['default'],
    };
  }

  constructor(fetchModule) {
    this.#fetchModule = fetchModule;
  }

  async get(name) {
    if (name in this.#modules) {
      return this.#modules[name];
    }
    this.#modules[name] = this.#fetchModule(name);
    this.#modules[name].then((mod) => {
      this.#modules[name] = mod;
    });
    return this.#modules[name];
  }

  async getExport(name) {
    const { moduleName, exportName } = this.constructor.parseComponentName(name);
    return this.#get(await this.get(moduleName), exportName);
  }
}
