# Theme

================

A lightweight, efficient, and easy-to-use theme management system for JavaScript applications.

## Overview

This module provides a simple way to manage color schemes in your application. It allows you to determine the user's preferred color scheme, subscribe to changes in the current color scheme, and apply a color scheme to the root element of the document.

## Usage

```javascript
import {
    getCurrentColorScheme,
    getPreferredColorScheme,
    getSettings,
    initThemeModule,
    onCurrentColorSchemeChange,
    onSystemColorSchemeChange,
    setCurrentColorScheme,
    setSettings,
} from "@supercat1337/theme";

// Initialize the theme module
initThemeModule();

let settings = getSettings();
console.log(settings); // Output: { colorScheme: "auto" }

// Set the persistent theme settings
setSettings({ colorScheme: "dark" });

// Get the user's preferred color scheme
const preferredColorScheme = getPreferredColorScheme();
console.log(preferredColorScheme); // Output: "dark" or "light"

// Subscribe to changes in the current color scheme
onCurrentColorSchemeChange((theme) => {
    console.log(`Color scheme changed to ${theme}`);
});

onSystemColorSchemeChange((theme) => {
    console.log(`System color scheme changed to ${theme}`);
});

let currentColorScheme = getCurrentColorScheme();
console.log(currentColorScheme); // Output: "dark" or "light"

// Set the current color scheme temporarily
setCurrentColorScheme("dark");
```

## Functions

### initThemeModule()

Initializes the theme module.

### adaptInputsToUserPreferredColorScheme()

Adapts the color scheme of all input elements on the page to match the user's preferred color scheme.

### addMetaThemeColor(lightColor = "#FFFFFF", darkColor = "#212529")

Adds meta tags to the document head to specify theme colors for light and dark modes.

-   `lightColor`: The theme color for light mode. Default is `"#FFFFFF"`.
-   `darkColor`: The theme color for dark mode. Default is `"#212529"`.

### applyColorThemeToElement(theme, element)

Applies a color scheme to an HTML element. The theme is used to set the `data-bs-theme` attribute on the root element of the document, which is used by Bootstrap 5 to determine the theme to use for styled components.

-   `theme`: The color scheme to apply to the element. Can be `"dark"`, `"light"`, `"auto"`, or a custom theme.
-   `element`: The HTML element to apply the color scheme to.

### getCurrentColorScheme()

Gets the current color scheme of the application.

-   Returns: The current color scheme, which can be `"dark"`, or `"light"`.

### setCurrentColorScheme(theme)

Sets the current color scheme of the application.

-   `theme`: The color scheme to set as the current color scheme. Can be `"dark"`, `"light"`, or `"auto"`.

### getPreferredColorScheme()

Determines the user's preferred color scheme.

-   Returns: The user's preferred color scheme, which can be `"dark"` or `"light"`.

### getSettings()

Gets the current settings of the theme module.

-   Returns: An object containing the current settings, including the current color scheme.

### setSettings(settings)

Sets the settings of the theme module.

-   `settings`: An object containing the new settings, including the current color scheme.

### onCurrentColorSchemeChange(callback)

Subscribes to changes in the current color scheme.

-   `callback`: The function to call when the color scheme changes.
-   Returns: A function that can be called to unsubscribe from the color scheme change events.

### onSystemColorSchemeChange(callback)

Calls the given callback when the user's preferred color scheme changes.

-   `callback`: The callback to call when the user's preferred color scheme changes.
-   Returns: A function that can be called to unsubscribe from changes to the user's preferred color scheme.

## License

This module is licensed under the MIT License.

## Author

Supercat1337
