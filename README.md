# @supercat1337/color-scheme

A tiny, fast, and easy-to-use color scheme and color theme management system for JavaScript applications that works with Bootstrap 5 and supports dark and light themes.

## Overview

This module provides a simple way to manage color schemes in your application. It allows you to determine the user's preferred color scheme, subscribe to changes in the current color scheme, and apply a color scheme to the root element of the document.

## Usage

```javascript
import {
    applyColorTheme,
    applyColorThemeToElement,
    currentColorSchemeStorage,
    preferredSchemeStorage,
    systemSchemeStorage,
} from "@supercat1337/color-scheme";

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
let darkmode_is_on = currentColorSchemeStorage.scheme === "dark";
switcher.checked = darkmode_is_on;

// Listen for changes in the current color scheme and update the switcher accordingly.
currentColorSchemeStorage.onSchemeChange((scheme) => {
    let darkmode_is_on = scheme === "dark";
    switcher.checked = darkmode_is_on;
});

// Listen for changes in the switcher and update the current color scheme accordingly.
switcher.addEventListener("change", () => {
    currentColorSchemeStorage.scheme = switcher.checked ? "dark" : "light";
});

// You can also save the user's preferred color scheme using localStorage.
// This will allow the user to switch back to their preferred color scheme after closing their browser.
preferredSchemeStorage.scheme = currentColorSchemeStorage.scheme;

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
```

## Objects

### SystemSchemeStorage

`The SystemSchemeStorage object` manages the system color scheme, providing methods to get and subscribe to changes in the scheme.

Methods:

-   `onSchemeChange`(callback): Subscribes to changes in the system color scheme and calls the provided callback function when the scheme changes. Returns an -unsubscribe function to stop receiving updates.
-   get `scheme`: Returns the current system color scheme, which can be either "dark" or "light".

### PreferredSchemeStorage

`The PreferredSchemeStorage object` manages the user's preferred color scheme, storing it in local storage and providing methods to get, set, and subscribe to changes in the scheme.

Methods:

-   get `scheme`: Returns the current preferred color scheme.
-   set `scheme`: Sets the preferred color scheme to a new value, updating local storage and emitting an event if the scheme changes.
-   `onSchemeChange`: Subscribes to changes in the preferred color scheme, calling the provided callback function when the scheme changes, and returns an unsubscribe function.

### CurrentColorSchemeStorage

`The CurrentColorSchemeStorage object` manages the current color scheme, storing it in local storage and providing methods to get, set, and subscribe to changes in the scheme.

Methods:

-   get `scheme`: Returns the current color scheme.
-   set `scheme`: Sets the current color scheme to a new value, updating local storage and emitting an event if the scheme changes.
-   `onSchemeChange`: Subscribes to changes in the current color scheme, calling the provided callback function when the scheme changes, and returns an unsubscribe function.

## Functions

### applyColorTheme(theme)

Applies a color scheme to the root element of the document. The theme is used to set the `data-bs-theme` attribute, which is used by Bootstrap 5 to determine the theme to use for styled components.

-   `theme`: The color scheme to apply to the root element. Can be `"dark"`, `"light"`, `"auto"`, or a custom theme.

### applyColorThemeToElement(element, theme)

Applies a color scheme to an HTML element. The theme is used to set the `data-bs-theme` attribute on the root element of the document, which is used by Bootstrap 5 to determine the theme to use for styled components.

-   `element`: The HTML element to apply the color scheme to.
-   `theme`: The color scheme to apply to the element. Can be `"dark"`, `"light"`, `"auto"`, or a custom theme.

## License

This module is licensed under the MIT License.

## Author

Supercat1337
