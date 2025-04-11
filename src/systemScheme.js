// @ts-check

import {
    getSystemPreferredColorScheme,
    onSystemColorSchemeChange,
} from "./tools.js";

class SystemSchemeStorage {
    /**
     * Subscribes to changes in the system color scheme.
     *
     * @param {(scheme: "dark"|"light") => void} callback - The function to call when the system color scheme changes.
     * @returns {() => void} A function that can be called to unsubscribe from the color scheme change events.
     */
    onSchemeChange(callback) {
        return onSystemColorSchemeChange(callback);
    }

    /**
     * Gets the system color scheme.
     *
     * @returns {"dark"|"light"} The system color scheme.
     */
    get scheme() {
        return getSystemPreferredColorScheme();
    }
}

export { SystemSchemeStorage };
