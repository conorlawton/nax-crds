/// <reference path="global.d.ts" />

import { Mod, PluginClass } from "ultimate-crosscode-typedefs/modloader/mod";

export default class CRDS implements PluginClass {
	mod: Mod;

	constructor(mod: Mod) {
		this.mod = mod;
		// @ts-expect-error
		window.nax ??= {}
		window.nax.crds = {
			resourceHandler: {},
			registerResource: this.registerResource.bind(this),
			registerResourceHandler: this.registerResourceHandler.bind(this),
		};
	}

	preload() {
		// window.nax.crds.registerResource<{ key: number }>("test", { key: 5 });
		// window.nax.crds.registerResourceHandler<{ key: number }>("test", resource => console.log(resource.key));
		// window.nax.crds.registerResource<{ key: number }>("test", { key: 13 });
		// window.nax.crds.registerResourceHandler<{ key: number }>("test", resource => console.log(resource.key * 2));
	}

	/**
	 * Registers a resource.
	 * Resources can be added before resource handlers and will always be handled in order, though mods may load out of order.
	 * @param resourceHandlerName Name of the resource handler to pass this resource to.
	 * @param resource The resource to register.
	 */
	public registerResource<T>(
		resourceHandlerName: string,
		resource: T) {
		let resourceHandler = window.nax.crds.resourceHandler[resourceHandlerName];
		if (!resourceHandler) resourceHandler = this._addResourceHandler(resourceHandlerName);
		resourceHandler.resources.push(resource);

		// Pass the newly registered resource to all currently registered resource handlers.
		resourceHandler.resourceHandlerCallbacks.forEach((resourceHandlerCallback: (resource: T) => void) => {
			resourceHandlerCallback(resource);
		});
	}

	/**
	 * Registers a resource handler.
	 * Resource handlers can be added before or after resources, if added after, all existing resources will 
	 * @param resourceHandlerName Name of the resource handler to register.
	 * @param resourceHandlerMethod The callback for resources to be passed to (the resource handler itself).
	 */
	public registerResourceHandler<T>(resourceHandlerName: string, resourceHandlerMethod: (resource: T) => void) {
		let resourceHandler = window.nax.crds.resourceHandler[resourceHandlerName] as nax.crds.ResourceHandler<T>;
		if (!resourceHandler) resourceHandler = this._addResourceHandler(resourceHandlerName);
		resourceHandler.resourceHandlerCallbacks.push(resourceHandlerMethod);

		// Pass all presently registered resources to the newly registered handler.
		resourceHandler.resources.forEach((resource: T) => {
			resourceHandlerMethod(resource);
		});
	}

	/**
	 * Get all the resources associated with a given name.
	 * @param resourceHandlerName
	 * @returns A list of the resources.
	*/
	public getResources<T>(resourceHandlerName: string): T[] {
		return window.nax.crds.resourceHandler[resourceHandlerName].resources as T[];
	}

	/**
	 * Get all the resource handlers for a given name.
	 * @param resourceHandlerName
	 * @returns A list of the resource handlers.
	 */
	public getResourceHandlers<T>(resourceHandlerName: string): ((resource: T) => void)[] {
		return window.nax.crds.resourceHandler[resourceHandlerName].resourceHandlerCallbacks;
	}

	private _addResourceHandler(resourceHandlerName: string) {
		return window.nax.crds.resourceHandler[resourceHandlerName] = { resources: [], resourceHandlerCallbacks: [] };
	}
}
