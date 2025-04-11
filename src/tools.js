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

export {
    getSystemPreferredColorScheme,
    applyColorTheme,
    addMetaThemeColor,
    applyColorThemeToElement,
    onSystemColorSchemeChange,
};
