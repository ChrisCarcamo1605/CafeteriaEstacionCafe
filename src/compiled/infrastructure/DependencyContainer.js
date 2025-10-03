"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.DependencyContainer = void 0;
class DependencyContainer {
    constructor() {
        this.services = new Map();
        this.instances = new Map();
    }
    register(name, factory) {
        this.services.set(name, factory);
    }
    resolve(name) {
        // Singleton pattern - una vez creado, reutiliza la misma instancia
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }
        const factory = this.services.get(name);
        if (!factory) {
            throw new Error(`Service ${name} not registered`);
        }
        const instance = factory();
        this.instances.set(name, instance);
        return instance;
    }
    // Método para limpiar instancias (útil para testing)
    clear() {
        this.instances.clear();
        this.services.clear();
    }
}
exports.DependencyContainer = DependencyContainer;
// Instancia global del contenedor
exports.container = new DependencyContainer();
