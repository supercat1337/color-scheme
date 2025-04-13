// @ts-check

import { applyColorTheme, applyColorThemeToElement } from "./tools.js";

import { PreferredSchemeStorage } from "./preferredScheme.js";
import { CurrentSchemeStorage } from "./currentScheme.js";
import { SystemSchemeStorage } from "./systemScheme.js";

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

export {
    applyColorThemeToElement,
    applyColorTheme,
    systemSchemeStorage,
    currentSchemeStorage,
    preferredSchemeStorage,
};
