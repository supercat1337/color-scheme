/**
 * Adds a style sheet to the document head that sets the color scheme of inputs to either light or dark,
 * depending on the user's preferred color scheme.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
 */
export function adaptInputsToUserPreferredColorScheme(): void;
/**
 * Adds meta tags to the document head to specify theme colors for light and dark modes.
 *
 * @param {string} [lightColor="#FFFFFF"] - The theme color for light mode.
 * @param {string} [darkColor="#212529"] - The theme color for dark mode.
 */
export function addMetaThemeColor(lightColor?: string, darkColor?: string): void;
/**
 * Applies a color scheme to an HTML element. The theme is used to set the `data-bs-theme` attribute
 * on the root element of the document, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {("dark"|"light"|"auto")} theme - The color scheme to apply to the element.
 * @param {HTMLElement} element - The HTML element to apply the color scheme to.
 */
export function applyColorThemeToElement(theme: ("dark" | "light" | "auto"), element: HTMLElement): void;
/**
 * Retrieves the current color scheme.
 *
 * @returns {"dark"|"light"} The current color scheme being used.
 */
export function getCurrentColorScheme(): "dark" | "light";
/**
 * Determines the user's preferred color scheme.
 *
 * @returns {"dark"|"light"} "dark" if the user prefers a dark theme, "light" otherwise.
 */
export function getPreferredColorScheme(): "dark" | "light";
/**
 * Retrieves the current theme settings.
 *
 * @returns {{colorScheme:"dark"|"light"|"auto"}} The current theme settings.
 */
export function getSettings(): {
    colorScheme: "dark" | "light" | "auto";
};
/**
 * Initializes the theme module by loading theme settings from local storage, setting the theme
 * meta tags, adapting inputs to the user's preferred color scheme, and setting up an event
 * listener to update the theme when the user's preferred color scheme changes.
 *
 * @param {string} [lightColor="#FFFFFF"] - The theme color for light mode.
 * @param {string} [darkColor="#212529"] - The theme color for dark mode.
 */
export function initThemeModule(lightColor?: string, darkColor?: string): void;
/**
 * Subscribes to changes in the current color scheme.
 *
 * @param {(theme: "dark"|"light") => void} callback - The function to call when the color scheme changes.
 * @returns {() => void} A function that can be called to unsubscribe from the color scheme change events.
 */
export function onCurrentColorSchemeChange(callback: (theme: "dark" | "light") => void): () => void;
/**
 * Calls the given callback when the user's preferred color scheme changes.
 *
 * @param {(theme: "dark"|"light") => void} callback - The callback to call when the user's preferred color scheme changes.
 * @returns {() => void} A function that can be called to unsubscribe from changes to the user's preferred color scheme.
 */
export function onSystemColorSchemeChange(callback: (theme: "dark" | "light") => void): () => void;
/**
 * Sets the current color scheme. The color scheme is used by Bootstrap 5 to determine the style to
 * use for styled components. The color scheme is also used to update the theme meta tags.
 *
 * @param {"dark"|"light"|"auto"} colorScheme - The color scheme to set. Must be either "dark" or "light."
 */
export function setCurrentColorScheme(colorScheme: "dark" | "light" | "auto"): void;
/**
 * Sets new theme settings and saves them to local storage.
 *
 * @param { {colorScheme:"dark"|"light"|"auto"} } newSettings - The new theme settings.
 */
export function setSettings(newSettings: {
    colorScheme: "dark" | "light" | "auto";
}): void;
//# sourceMappingURL=theme.esm.d.ts.map