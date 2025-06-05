export class Container {
  constructor() {
    this.instances = new Map();
  }

  register(name, Class) {
    const instance = new Class();
    this.instances.set(name, instance);
  }

  get(name) {
    return this.instances.get(name);
  }

  has(name) {
    return this.instances.has(name);
  }
}

export const container = new Container();
