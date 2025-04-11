// @ts-check

import {
    addMetaThemeColor,
    applyColorTheme,
    applyColorThemeToElement,
} from "./tools.js";

import { PreferredSchemeStorage } from "./preferredScheme.js";
import { CurrentColorSchemeStorage } from "./currentScheme.js";
import { SystemSchemeStorage } from "./systemScheme.js";

let metaElement = document.createElement("meta");
metaElement.name = "theme-color";
document.head.appendChild(metaElement);

let styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(/* css */ `
    :root {
        color-scheme: light dark;
    }`);
document.adoptedStyleSheets.push(styleSheet);

// storages
const systemSchemeStorage = new SystemSchemeStorage();
const preferredSchemeStorage = new PreferredSchemeStorage();
const currentColorSchemeStorage = new CurrentColorSchemeStorage(
    systemSchemeStorage,
    preferredSchemeStorage
);

let lightColor = "#FFFFFF",
    darkColor = "#212529";

metaElement.content =
    currentColorSchemeStorage.scheme === "dark" ? darkColor : lightColor;

systemSchemeStorage.onSchemeChange((colorScheme) => {
    let preferredColorScheme = preferredSchemeStorage.scheme;
    if (preferredColorScheme === "auto") {
        currentColorSchemeStorage.scheme = colorScheme;
    }
});

currentColorSchemeStorage.onSchemeChange((colorScheme) => {
    metaElement.content = colorScheme === "dark" ? darkColor : lightColor;

    applyColorTheme(currentColorSchemeStorage.getDefaultTheme());
});

applyColorTheme(currentColorSchemeStorage.getDefaultTheme());

export {
    applyColorThemeToElement,
    applyColorTheme,
    systemSchemeStorage,
    currentColorSchemeStorage,
    preferredSchemeStorage,
};
