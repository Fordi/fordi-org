export default class JsonCache {
  #resources = {};

  #fetch;

  #revivers = new Set();

  constructor(fetchItem, revivers = []) {
    this.#fetch = fetchItem;
    this.addReviver(...revivers);
  }

  has(name) {
    return !!this.#resources[name];
  }

  async get(name) {
    if (name in this.#resources) return this.#resources[name];
    this.#resources[name] = this.#fetch(name).then((text) => this.#parseJson(text));
    this.#resources[name].then((layout) => {
      this.#resources[name] = layout;
    });
    return this.#resources[name];
  }

  async #parseJson(text) {
    return this.constructor.#hydrate(JSON.parse(
      text,
      (key, value) => this.#revive(key, value),
    ));
  }

  static async #hydrate(value) {
    if (value === null) return value;
    if (typeof value !== 'object') return value;
    if (typeof value?.then === 'function') return value;
    if (Array.isArray(value)) {
      return Promise.all(value.map((v) => this.#hydrate(v)));
    }
    const result = {};
    await Promise.all(Object.keys(value).map((key) => (
      this.#hydrate(value[key]).then((r) => {
        result[key] = r;
      })
    )));
    return result;
  }

  #revive(key, value) {
    for (const revive of this.#revivers) {
      const revived = revive(key, value);
      if (revived !== undefined) {
        return revived;
      }
    }
    return value;
  }

  addReviver(...revivers) {
    revivers.forEach((r) => this.#revivers.add(r));
  }

  removeReviver(...revivers) {
    revivers.forEach((r) => this.#revivers.delete(r));
  }
}
