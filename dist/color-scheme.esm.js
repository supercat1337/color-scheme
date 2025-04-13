import { EventEmitter } from '@supercat1337/event-emitter';

// @ts-check

/**
 * Determines the user's preferred color scheme.
 *
 * @returns {"dark"|"light"} "dark" if the user prefers a dark theme, "light" otherwise.
 */
function getSystemPreferredColorScheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
}

/**
 * Applies a color scheme to the root element of the document. The theme is used to set the
 * `data-bs-theme` attribute, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {"dark"|"light"|string} theme - The color scheme to apply to the element.
 */
function applyColorTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
}

/**
 * Calls the given callback when the user's preferred color scheme changes.
 *
 * @param {(theme: "dark"|"light") => void} callback - The callback to call when the user's preferred color scheme changes.
 * @returns {() => void} A function that can be called to unsubscribe from changes to the user's preferred color scheme.
 */
function onSystemColorSchemeChange(callback) {
    let fn = () => {
        callback(getSystemPreferredColorScheme());
    };

    let unsubscriber = () => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .removeEventListener("change", fn);
    };

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", fn);

    return unsubscriber;
}

/**
 * Applies a color scheme to an HTML element. The theme is used to set the `data-bs-theme` attribute
 * on the root element of the document, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {HTMLElement} element - The HTML element to apply the color scheme to.
 * @param {("dark"|"light"|"auto")} theme - The color scheme to apply to the element.
 */
function applyColorThemeToElement(element, theme) {
    element.setAttribute("data-bs-theme", theme);
}

// @ts-check


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

// @ts-check


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

// @ts-check


class CurrentSchemeStorage {
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
     * Initializes the currentSchemeStorage instance by determining the current color scheme.
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

// @ts-check


let styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(/* css */ `
    :root {
        color-scheme: light dark;
    }`);
document.adoptedStyleSheets.push(styleSheet);

// storages
const systemSchemeStorage = new SystemSchemeStorage();
const preferredSchemeStorage = new PreferredSchemeStorage();
const currentSchemeStorage = new CurrentSchemeStorage(
    systemSchemeStorage,
    preferredSchemeStorage
);

let lightColor = "#FFFFFF",
    darkColor = "#212529";

let metaElement = document.createElement("meta");
metaElement.name = "theme-color";
metaElement.content =
    currentSchemeStorage.scheme === "dark" ? darkColor : lightColor;
document.head.appendChild(metaElement);

currentSchemeStorage.onSchemeChange((colorScheme) => {
    metaElement.content = colorScheme === "dark" ? darkColor : lightColor;
});

systemSchemeStorage.onSchemeChange((colorScheme) => {
    let preferredColorScheme = preferredSchemeStorage.scheme;
    if (preferredColorScheme === "auto") {
        currentSchemeStorage.scheme = colorScheme;
    }
});

currentSchemeStorage.onSchemeChange((colorScheme) => {
    applyColorTheme(currentSchemeStorage.getDefaultTheme());
});

applyColorTheme(currentSchemeStorage.getDefaultTheme());

export { applyColorTheme, applyColorThemeToElement, currentSchemeStorage, preferredSchemeStorage, systemSchemeStorage };
