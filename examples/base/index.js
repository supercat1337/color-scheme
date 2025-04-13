// @ts-check
import {
    applyColorTheme,
    applyColorThemeToElement,
    currentSchemeStorage,
    preferredSchemeStorage,
    systemSchemeStorage,
} from "../../dist/color-scheme.bundle.esm.js";

// You can set the color scheme directly using the applyColorTheme function.
applyColorTheme("dark");

// You can also set the color scheme on an HTML element using the applyColorThemeToElement function.
applyColorThemeToElement(
    /** @type {HTMLInputElement} */ (document.body.querySelector("h1")),
    "light"
);

// You can also listen for changes in the current color scheme using the onSchemeChange function.
const switcher = /** @type {HTMLInputElement} */ (
    document.querySelector("input")
);

// Initialize the switcher to reflect the current color scheme.
let darkmode_is_on = currentSchemeStorage.scheme === "dark";
switcher.checked = darkmode_is_on;

// Listen for changes in the current color scheme and update the switcher accordingly.
currentSchemeStorage.onSchemeChange((scheme) => {
    let darkmode_is_on = scheme === "dark";
    switcher.checked = darkmode_is_on;
});

// Listen for changes in the switcher and update the current color scheme accordingly.
switcher.addEventListener("change", () => {
    currentSchemeStorage.scheme = switcher.checked ? "dark" : "light";
});

// You can also save the user's preferred color scheme using localStorage.
// This will allow the user to switch back to their preferred color scheme after closing their browser.
preferredSchemeStorage.scheme = currentSchemeStorage.scheme;

// You can also listen for changes in the user's preferred color scheme using the onSchemeChange function.
preferredSchemeStorage.onSchemeChange((scheme) => {
    console.log(`Preferred Color Scheme: ${scheme}`);
});

// You can also get the system color scheme.
console.log(`System Color Scheme: ${systemSchemeStorage.scheme}`);

// You can also listen for changes in the system color scheme using the onSchemeChange function.
systemSchemeStorage.onSchemeChange((scheme) => {
    console.log(`System Color Scheme: ${scheme}`);
});
