/**
 * Applies a color scheme to the root element of the document. The theme is used to set the
 * `data-bs-theme` attribute, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {"dark"|"light"|string} theme - The color scheme to apply to the element.
 */
export function applyColorTheme(theme: "dark" | "light" | string): void;
/**
 * Applies a color scheme to an HTML element. The theme is used to set the `data-bs-theme` attribute
 * on the root element of the document, which is used by Bootstrap 5 to determine the theme to use for
 * styled components.
 *
 * @param {HTMLElement} element - The HTML element to apply the color scheme to.
 * @param {("dark"|"light"|"auto")} theme - The color scheme to apply to the element.
 */
export function applyColorThemeToElement(element: HTMLElement, theme: ("dark" | "light" | "auto")): void;
export const currentColorSchemeStorage: CurrentColorSchemeStorage;
export const preferredSchemeStorage: PreferredSchemeStorage;
export const systemSchemeStorage: SystemSchemeStorage;
declare class CurrentColorSchemeStorage {
    /**
     * Initializes the CurrentColorSchemeStorage instance by determining the current color scheme.
     *
     * @param {SystemSchemeStorage} systemSchemeStorage - An instance of SystemSchemeStorage to retrieve the system color scheme.
     * @param {PreferredSchemeStorage} preferredSchemeStorage - An instance of preferredSchemeStorage to retrieve the preferred color scheme.
     */
    constructor(systemSchemeStorage: SystemSchemeStorage, preferredSchemeStorage: PreferredSchemeStorage);
    /**
     * The name of the theme for the dark color scheme.
     * @type {string}
     */
    darkThemeName: string;
    /**
     * The name of the theme for the light color scheme.
     * @type {string}
     */
    lightThemeName: string;
    /**
     * Subscribes to changes in the current color scheme.
     *
     * @param {(scheme: "dark"|"light") => void} callback - The function to call when the color scheme changes.
     * @returns {() => void} A function that can be called to unsubscribe from the color scheme change events.
     */
    onSchemeChange(callback: (scheme: "dark" | "light") => void): () => void;
    /**
     * Sets the current color scheme.
     * @param {"dark"|"light"|"auto"} colorScheme - The color scheme to set. Must be either "dark", "light" or "auto".
     */
    set scheme(colorScheme: "dark" | "light");
    /**
     * Retrieves the current color scheme.
     *
     * @returns {"dark"|"light"} The current color scheme being used.
     */
    get scheme(): "dark" | "light";
    /**
     * Returns the default theme name based on the current color scheme.
     *
     * @returns {string} The name of the theme. Returns `darkThemeName` if the current color scheme is "dark",
     * otherwise returns `lightThemeName`.
     */
    getDefaultTheme(): string;
    #private;
}
declare class PreferredSchemeStorage {
    /**
     * Sets the preferred color scheme.
     * @param {"dark"|"light"|"auto"} scheme
     */
    set scheme(scheme: "auto" | "dark" | "light");
    /**
     * @returns {"dark"|"light"|"auto"} The preferred color scheme.
     */
    get scheme(): "auto" | "dark" | "light";
    /**
     * Subscribes to changes in the preferred color scheme.
     *
     * @param {(scheme: "dark"|"light"|"auto") => void} callback - The function to call when the preferred color scheme changes.
     * @returns {() => void} A function that can be called to unsubscribe from the preferred color scheme change events.
     */
    onSchemeChange(callback: (scheme: "dark" | "light" | "auto") => void): () => void;
    #private;
}
declare class SystemSchemeStorage {
    /**
     * Subscribes to changes in the system color scheme.
     *
     * @param {(scheme: "dark"|"light") => void} callback - The function to call when the system color scheme changes.
     * @returns {() => void} A function that can be called to unsubscribe from the color scheme change events.
     */
    onSchemeChange(callback: (scheme: "dark" | "light") => void): () => void;
    /**
     * Gets the system color scheme.
     *
     * @returns {"dark"|"light"} The system color scheme.
     */
    get scheme(): "dark" | "light";
}
export {};
//# sourceMappingURL=theme.esm.d.ts.map