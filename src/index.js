// @ts-check

import { EventEmitter } from "@supercat1337/event-emitter";

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

export {
    adaptInputsToUserPreferredColorScheme,
    addMetaThemeColor,
    applyColorThemeToElement,
    getCurrentColorScheme,
    getPreferredColorScheme,
    initThemeModule,
    getSettings,
    onCurrentColorSchemeChange,
    onSystemColorSchemeChange,
    setSettings,
    setCurrentColorScheme,
};
