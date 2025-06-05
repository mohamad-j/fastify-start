export class RequestContainer {
  constructor(appContainer) {
    this.appContainer = appContainer;
    this.instances = new Map();
  }

  set(name, instance) {
    this.instances.set(name, instance);
  }

  get(name) {
    if (this.instances.has(name)) return this.instances.get(name);
    if (this.appContainer.has(name)) return this.appContainer.get(name);
    throw new Error(`Service \${name} not found`);
  }
}
