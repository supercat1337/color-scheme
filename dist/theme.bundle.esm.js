// @ts-check
/** @module EventEmitter */

/**
 * @template {string} T
 */
class EventEmitter {
    /** @type {Object.<string, Function[]>} */
    events = {};

    /**
     * on is used to add a callback function that's going to be executed when the event is triggered
     * @param {T|"#has-listeners"|"#no-listeners"} event
     * @param {Function} listener
     * @returns {()=>void}
     */
    on(event, listener) {

        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);

        let that = this;

        let unsubscriber = function () {
            that.removeListener(event, listener);
        };

        if (!/^(#has-listeners|#no-listeners)$/.test(event) && this.events[event].length == 1) { 
            this.emit("#has-listeners", event);
        }

        return unsubscriber;
    }
    /**
     * Remove an event listener from an event
     * @param {T|"#has-listeners"|"#no-listeners"} event
     * @param {Function} listener
     */
    removeListener(event, listener) {
        var idx;

        if (typeof this.events[event] === 'object') {
            idx = this.events[event].indexOf(listener);

            if (idx > -1) {
                this.events[event].splice(idx, 1);

                if (!/^(#has-listeners|#no-listeners)$/.test(event) && this.events[event].length == 0) {
                    this.emit("#no-listeners", event);
                }
            }
        }

    }
    /**
     * emit is used to trigger an event
     * @param {T|"#has-listeners"|"#no-listeners"} event
     */
    emit(event) {
        if (typeof this.events[event] !== 'object') return;

        var i, listeners, length, args = [].slice.call(arguments, 1);

        listeners = this.events[event].slice();
        length = listeners.length;

        for (i = 0; i < length; i++) {

            try {
                listeners[i].apply(this, args);
            }
            catch (e) {
                console.error(event, args);
                console.error(e);
            }

        }
    }

    /**
     * Add a one-time listener
     * @param {T|"#has-listeners"|"#no-listeners"} event
     * @param {Function} listener
     * @returns {()=>void}
     */
    once(event, listener) {
        return this.on(event, function g() {
            this.removeListener(event, g);
            listener.apply(this, arguments);
        });
    }


    /**
     * Wait for an event to be emitted
     * @param {T} event
     * @param {number} [max_wait_ms=0] - Maximum time to wait in ms. If 0, the function will wait indefinitely.
     * @returns {Promise<boolean>} - Resolves with true if the event was emitted, false if the time ran out.
     */
    waitForEvent(event, max_wait_ms = 0) {

        return new Promise((resolve) => {
            let timeout;

            let unsubscriber = this.on(event, () => {

                if (max_wait_ms > 0) {
                    clearTimeout(timeout);
                }

                unsubscriber();
                resolve(true);
            });

            if (max_wait_ms > 0) {
                timeout = setTimeout(() => {
                    unsubscriber();
                    resolve(false);
                }, max_wait_ms);

            }

        });
    }


    /**
     * Wait for any of the specified events to be emitted
     * @param {T[]} events - Array of event names to wait for
     * @param {number} [max_wait_ms=0] - Maximum time to wait in ms. If 0, the function will wait indefinitely.
     * @returns {Promise<boolean>} - Resolves with true if any event was emitted, false if the time ran out.
     */
    waitForAnyEvent(events, max_wait_ms = 0) {

        return new Promise((resolve) => {
            let timeout;

            /** @type {Function[]} */
            let unsubscribers = [];

            const main_unsubscriber = () => {
                if (max_wait_ms > 0) {
                    clearTimeout(timeout);
                }

                unsubscribers.forEach((unsubscriber) => {
                    unsubscriber();
                });

                resolve(true);
            };

            events.forEach((event) => {
                unsubscribers.push(this.on(event, main_unsubscriber));
            });

            if (max_wait_ms > 0) {
                timeout = setTimeout(() => {
                    main_unsubscriber();
                    resolve(false);
                }, max_wait_ms);

            }

        });
    }

    /**
     * Clear all events
     */
    clear() {
        this.events = {};
    }

    /**
     * Destroys the event emitter, clearing all events and listeners.
     * @alias clear
     */
    destroy() {
        this.clear();
    }

    /**
     * Clears all listeners for a specified event.
     * @param {T|"#has-listeners"|"#no-listeners"} event - The event for which to clear all listeners.
     */
    clearEventListeners(event) {
        let listeners = this.events[event] || [];
        let listenersCount = listeners.length;

        if (listenersCount > 0) {
            this.events[event] = [];
            this.emit("#no-listeners", event);
        }
    }

    /**
     * onHasEventListeners() is used to subscribe to the "#has-listeners" event. This event is emitted when the number of listeners for any event (except "#has-listeners" and "#no-listeners") goes from 0 to 1.
     * @param {Function} callback
     * @returns {()=>void}
     */
    onHasEventListeners(callback) {
        return this.on("#has-listeners", callback);
    }

    /**
     * onNoEventListeners() is used to subscribe to the "#no-listeners" event. This event is emitted when the number of listeners for any event (except "#has-listeners" and "#no-listeners") goes from 1 to 0.
     * @param {Function} callback
     * @returns {()=>void}
     */
    onNoEventListeners(callback) {
        return this.on("#no-listeners", callback);
    }
}

// @ts-check


/** @type {EventEmitter<"color-theme-change">} */
const eventEmitter = new EventEmitter();

/** @type {{colorScheme:"dark"|"light"|"auto"}} */
let settings = { colorScheme: "auto" };

/** @type {"dark"|"light"} */
let currentColorScheme = "light";

/**
 * Determines the user's preferred color scheme.
 *
 * @returns {"dark"|"light"} "dark" if the user prefers a dark theme, "light" otherwise.
 */
function getPreferredColorScheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
}

/**
 * Calls the given callback when the user's preferred color scheme changes.
 *
 * @param {(theme: "dark"|"light") => void} callback - The callback to call when the user's preferred color scheme changes.
 * @returns {() => void} A function that can be called to unsubscribe from changes to the user's preferred color scheme.
 */
function onSystemColorSchemeChange(callback) {
    let fn = () => {
        callback(getPreferredColorScheme());
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
 * Subscribes to changes in the current color scheme.
 *
 * @param {(theme: "dark"|"light") => void} callback - The function to call when the color scheme changes.
 * @returns {() => void} A function that can be called to unsubscribe from the color scheme change events.
 */
function onCurrentColorSchemeChange(callback) {
    return eventEmitter.on("color-theme-change", callback);
}

/**
 * Applies a color scheme to the root element of the document. The theme is used to set the
 * `data-bs-theme` attribute, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {"dark"|"light"|"auto"|string} theme - The color scheme to apply to the element.
 */
function applyColorTheme(theme) {
    if (theme === "auto") {
        theme = settings.colorScheme;
    }

    document.documentElement.setAttribute("data-bs-theme", theme);
}

/**
 * Applies a color scheme to an HTML element. The theme is used to set the `data-bs-theme` attribute
 * on the root element of the document, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {("dark"|"light"|"auto")} theme - The color scheme to apply to the element.
 * @param {HTMLElement} element - The HTML element to apply the color scheme to.
 */
function applyColorThemeToElement(theme, element) {
    if (theme === "auto") {
        theme = getPreferredColorScheme();
    }

    element.setAttribute("data-bs-theme", theme);
}

/**
 * Adds meta tags to the document head to specify theme colors for light and dark modes.
 *
 * @param {string} [lightColor="#FFFFFF"] - The theme color for light mode.
 * @param {string} [darkColor="#212529"] - The theme color for dark mode.
 */
function addMetaThemeColor(lightColor = "#FFFFFF", darkColor = "#212529") {
    /*
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#212529" />
    */

    const lightMeta = document.createElement("meta");
    lightMeta.name = "theme-color";
    lightMeta.media = "(prefers-color-scheme: light)";
    lightMeta.content = lightColor;
    document.head.appendChild(lightMeta);

    const darkMeta = document.createElement("meta");
    darkMeta.name = "theme-color";
    darkMeta.media = "(prefers-color-scheme: dark)";
    darkMeta.content = darkColor;
    document.head.appendChild(darkMeta);
}

let styleSheetUsed = false;

/**
 * Adds a style sheet to the document head that sets the color scheme of inputs to either light or dark,
 * depending on the user's preferred color scheme.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
 */
function adaptInputsToUserPreferredColorScheme() {
    if (styleSheetUsed) {
        return;
    }

    let styleSheet = new CSSStyleSheet();

    styleSheet.replaceSync(/* css */ `
    :root {
        color-scheme: light dark;
    }
    `);

    document.adoptedStyleSheets.push(styleSheet);
    styleSheetUsed = true;
}

/**
 * Loads theme settings from local storage.
 *
 * If no settings are found, default settings are used.
 *
 * @returns {{colorScheme:"dark"|"light"|"auto"}} The loaded settings.
 */
function loadSettings() {
    try {
        /** @type {string|null} */
        let data = localStorage.getItem("theme-settings");

        if (typeof data === "string") {
            settings = JSON.parse(data);
        }
    } catch (e) {
        localStorage.setItem(
            "theme-settings",
            JSON.stringify({ colorScheme: "auto" })
        );
    }

    return settings;
}

/**
 * Saves theme settings to local storage.
 */
function saveSettings() {
    localStorage.setItem("theme-settings", JSON.stringify(settings));
}

/**
 * Retrieves the current theme settings.
 *
 * @returns {{colorScheme:"dark"|"light"|"auto"}} The current theme settings.
 */
function getSettings() {
    return settings;
}

/**
 * Sets new theme settings and saves them to local storage.
 *
 * @param { {colorScheme:"dark"|"light"|"auto"} } newSettings - The new theme settings.
 */
function setSettings(newSettings) {
    settings = newSettings;
    saveSettings();
}

/**
 * Initializes the theme module by loading theme settings from local storage, setting the theme
 * meta tags, adapting inputs to the user's preferred color scheme, and setting up an event
 * listener to update the theme when the user's preferred color scheme changes.
 *
 * @param {string} [lightColor="#FFFFFF"] - The theme color for light mode.
 * @param {string} [darkColor="#212529"] - The theme color for dark mode.
 */
function initThemeModule(lightColor, darkColor) {
    addMetaThemeColor(lightColor, darkColor);
    adaptInputsToUserPreferredColorScheme();
    loadSettings();

    let preferredColorScheme = getPreferredColorScheme();

    document.documentElement.setAttribute(
        "data-bs-theme",
        settings.colorScheme === "auto"
            ? preferredColorScheme
            : settings.colorScheme
    );

    currentColorScheme =
        settings.colorScheme === "auto"
            ? preferredColorScheme
            : settings.colorScheme;

    applyColorTheme(settings.colorScheme);

    onSystemColorSchemeChange((colorScheme) => {
        if (settings.colorScheme === "auto") {
            setCurrentColorScheme(colorScheme);
        }
    });
}

/**
 * Retrieves the current color scheme.
 *
 * @returns {"dark"|"light"} The current color scheme being used.
 */
function getCurrentColorScheme() {
    return currentColorScheme;
}

/**
 * Sets the current color scheme. The color scheme is used by Bootstrap 5 to determine the style to
 * use for styled components. The color scheme is also used to update the theme meta tags.
 *
 * @param {"dark"|"light"|"auto"} colorScheme - The color scheme to set. Must be either "dark" or "light."
 */
function setCurrentColorScheme(colorScheme) {
    if (
        colorScheme !== "dark" &&
        colorScheme !== "light" &&
        colorScheme !== "auto"
    ) {
        throw new Error(
            "Color scheme must be either 'dark', 'light', or 'auto'."
        );
    }

    let theme =
        colorScheme === "auto" ? getPreferredColorScheme() : colorScheme;

    if (theme === currentColorScheme) {
        return;
    }

    applyColorTheme(theme);
    currentColorScheme = theme;
    eventEmitter.emit("color-theme-change", currentColorScheme);
}

export { adaptInputsToUserPreferredColorScheme, addMetaThemeColor, applyColorThemeToElement, getCurrentColorScheme, getPreferredColorScheme, getSettings, initThemeModule, onCurrentColorSchemeChange, onSystemColorSchemeChange, setCurrentColorScheme, setSettings };
