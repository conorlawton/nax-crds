import "ultimate-crosscode-typedefs/modloader";
import "ultimate-crosscode-typedefs/crosscode";
import "./headers/**/*.d.ts";

export { };

declare global {

	namespace nax {
		namespace crds {
			type ResourceWrapper = { [index: string]: ResourceHandler<unknown> };

			const resourceHandler: ResourceWrapper;
			const registerResource: <T>(resourceHandlerName: string, resource: T) => void;
			const registerResourceHandler: <T>(resourceHandlerName: string, resourceHandlerMethod: (resource: T) => void) => void;

			interface ResourceHandler<T> {
				resources: T[];
				resourceHandlerCallbacks: ((resource: T) => void)[];
			}
		}
	}
}
