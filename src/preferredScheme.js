// @ts-check

import { EventEmitter } from "@supercat1337/event-emitter";

class PreferredSchemeStorage {
    #eventEmitter = new EventEmitter();

    /** @type {"dark"|"light"|"auto"} */
    #preferredColorScheme = "auto";

    constructor() {
        /** @type {"dark"|"light"|"auto"|string|null} */
        let data = localStorage.getItem("preferredColorScheme");

        if (data === "dark" || data === "light" || data === "auto") {
            this.#preferredColorScheme = data;
            localStorage.setItem("preferredColorScheme", data);
        } else {
            this.#preferredColorScheme = "auto";
            localStorage.setItem("preferredColorScheme", "auto");
        }
    }

    /**
     * @returns {"dark"|"light"|"auto"} The preferred color scheme.
     */
    get scheme() {
        return this.#preferredColorScheme;
    }

    /**
     * Sets the preferred color scheme.
     * @param {"dark"|"light"|"auto"} scheme
     */
    set scheme(scheme) {
        if (scheme === this.#preferredColorScheme) {
            return;
        }

        this.#preferredColorScheme = scheme;
        localStorage.setItem(
            "preferredColorScheme",
            this.#preferredColorScheme
        );

        this.#eventEmitter.emit("preferred-scheme-change", scheme);
    }

    /**
     * Subscribes to changes in the preferred color scheme.
     *
     * @param {(scheme: "dark"|"light"|"auto") => void} callback - The function to call when the preferred color scheme changes.
     * @returns {() => void} A function that can be called to unsubscribe from the preferred color scheme change events.
     */
    onSchemeChange(callback) {
        return this.#eventEmitter.on("preferred-scheme-change", callback);
    }
}

export { PreferredSchemeStorage };
