# Custom Resource Definitions

This mod allows for mods to register resources and resource handlers. Resource handlers take an ID for the type of resource and a callback for handling that resources. This mod sets everything up during construction. This means the registration methods are available as soon as possible.

### Registering a resource

```ts
window.nax.crds.registerResource<{ someKey: string }>("my-mod.my-resource-type", { someKey: "some value" });
```

### Registering a resource handler

```ts
window.nax.crds.registerResourceHandler<{ someKey: string }>("my-mod.my-resource-type", (resource: { someKey: string }) => {
	/* Do stuff with the resource here! */
});
```

---

### Notes

- I'd recommend exporting types for users (other mod developers) of your resource handler so that they can use the typings provided here. Otherwise, `any` will do.
- The calling of resource handlers is done in order of registration. The following will log to the console 5, 13, 10, 26, in succession. This shows that resources added before resource handlers are called once a resource handler is registered, likewise resource handlers added before resources will be called with a given resource once that resource is registered.

```js
window.nax.crds.registerResource < { key: number } > ("test", { key: 5 });
window.nax.crds.registerResourceHandler < { key: number } > ("test", resource => console.log(resource.key));
window.nax.crds.registerResource < { key: number } > ("test", { key: 13 });
window.nax.crds.registerResourceHandler < { key: number } > ("test", resource => console.log(resource.key * 2));
```
