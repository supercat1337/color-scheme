// @ts-check

import { EventEmitter } from "@supercat1337/event-emitter";
import { SystemSchemeStorage } from "./systemScheme.js";
import { PreferredSchemeStorage } from "./preferredScheme.js";

class CurrentColorSchemeStorage {
    #eventEmitter = new EventEmitter();

    /** @type {"dark"|"light"} */
    #currentColorScheme = "light";

    /** @type {PreferredSchemeStorage} */
    #preferredSchemeStorage;

    /** @type {SystemSchemeStorage} */
    #systemSchemeStorage;

    /**
     * The name of the theme for the dark color scheme.
     * @type {string}
     */
    darkThemeName = "dark";

    /**
     * The name of the theme for the light color scheme.
     * @type {string}
     */
    lightThemeName = "light";

    /**
     * Initializes the CurrentColorSchemeStorage instance by determining the current color scheme.
     *
     * @param {SystemSchemeStorage} systemSchemeStorage - An instance of SystemSchemeStorage to retrieve the system color scheme.
     * @param {PreferredSchemeStorage} preferredSchemeStorage - An instance of preferredSchemeStorage to retrieve the preferred color scheme.
     */
    constructor(systemSchemeStorage, preferredSchemeStorage) {
        this.#preferredSchemeStorage = preferredSchemeStorage;
        this.#systemSchemeStorage = systemSchemeStorage;

        let preferredColorScheme = preferredSchemeStorage.scheme;
        let systemColorScheme = systemSchemeStorage.scheme;

        let loadedColorScheme = /** @type {"dark"|"light"|"unknown"} */ (
            sessionStorage.getItem("currentColorScheme") || "unknown"
        );

        if (!(loadedColorScheme == "dark" || loadedColorScheme == "light")) {
            loadedColorScheme = "unknown";
        }

        if (loadedColorScheme === "unknown") {
            this.#currentColorScheme =
                preferredColorScheme === "auto"
                    ? systemColorScheme
                    : preferredColorScheme;
        } else {
            this.#currentColorScheme = loadedColorScheme;
        }
    }

    /**
     * Subscribes to changes in the current color scheme.
     *
     * @param {(scheme: "dark"|"light") => void} callback - The function to call when the color scheme changes.
     * @returns {() => void} A function that can be called to unsubscribe from the color scheme change events.
     */
    onSchemeChange(callback) {
        return this.#eventEmitter.on("current-scheme-change", callback);
    }

    /**
     * Retrieves the current color scheme.
     *
     * @returns {"dark"|"light"} The current color scheme being used.
     */
    get scheme() {
        return this.#currentColorScheme;
    }

    /**
     * Sets the current color scheme.
     * @param {"dark"|"light"|"auto"} colorScheme - The color scheme to set. Must be either "dark", "light" or "auto".
     */
    set scheme(colorScheme) {
        if (
            colorScheme !== "dark" &&
            colorScheme !== "light" &&
            colorScheme !== "auto"
        ) {
            throw new Error(
                "Color scheme must be either 'dark', 'light' or 'auto'."
            );
        }

        if (colorScheme === "auto") {
            colorScheme = this.#preferredSchemeStorage.scheme;

            if (colorScheme === "auto") {
                colorScheme = this.#systemSchemeStorage.scheme;
            }
        }

        if (colorScheme === this.#currentColorScheme) {
            return;
        }

        sessionStorage.setItem("currentColorScheme", colorScheme);

        this.#currentColorScheme = colorScheme;
        this.#eventEmitter.emit(
            "current-scheme-change",
            this.#currentColorScheme
        );
    }

    /**
     * Returns the default theme name based on the current color scheme.
     *
     * @returns {string} The name of the theme. Returns `darkThemeName` if the current color scheme is "dark",
     * otherwise returns `lightThemeName`.
     */
    getDefaultTheme() {
        if (this.#currentColorScheme === "dark") {
            return this.darkThemeName;
        }

        return this.lightThemeName;
    }
}

export { CurrentColorSchemeStorage };
