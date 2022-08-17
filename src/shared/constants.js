// Constants for the project
// @flow

// project types
export const LEGACY_TILES: number = 1;
export const BUILDING_FOOTPRINTS: number = 2;
export const CHANGE_DETECTION: number = 3;
export const COMPLETENESS_PROJECT: number = 4;

// colours
export const COLOR_BLACK = 'black';
export const COLOR_BLUE = '#4080c3';
export const COLOR_DEEP_BLUE = '#0d1949';
export const COLOR_GREEN = 'rgb(36, 219, 26)'; // #24DB1A
export const COLOR_SUCCESS_GREEN = '#32A82C';
export const COLOR_GREEN_OVERLAY = 'rgba(36, 219, 26, 0.2)';
export const COLOR_TRANSPARENT_GREEN = 'rgba(36, 219, 26, 0)';
export const COLOR_RED = 'rgb(230, 28, 28)';
export const COLOR_RED_OVERLAY = 'rgba(230, 28, 28, 0.2)';
export const COLOR_TRANSPARENT_RED = 'rgba(230, 28, 28, 0)';
export const COLOR_YELLOW = 'rgb(237, 209, 28)';
export const COLOR_YELLOW_OVERLAY = 'rgba(237, 209, 28, 0.2)';
export const COLOR_TRANSPARENT_YELLOW = 'rgba(237, 209, 28, 0)';
export const COLOR_TRANSPARENT = 'transparent';
export const COLOR_WHITE = 'white';
export const COLOR_DARK_GRAY = '#212121';
export const COLOR_LIGHT_GRAY = '#eef2fb';
export const COLOR_TRANSPARENT_LIGHT_GRAY = 'rgba(238, 242, 251, 0)';
export const COLOR_LIME_BACKGROUND = 'rgb(163, 230, 53)';

// font weights
export const FONT_WEIGHT_MEDIUM = '400';
export const FONT_WEIGHT_BOLD = '600';

// font sizes
export const FONT_SIZE_SMALL = 14;
export const FONT_SIZE_MEDIUM = 16;
export const FONT_SIZE_LARGE = 20;
export const FONT_SIZE_EXTRA_LARGE = 26;

// spacing
export const SPACING_EXTRA_SMALL = 4;
export const SPACING_SMALL = 8;
export const SPACING_MEDIUM = 16;
export const SPACING_LARGE = 24;

// languages
export const supportedLanguages = [
    // follows (hopefully) the order in which they are displayed
    // in wikipedia's list of languages (left side toolbar)
    // as shown on https://en.wikipedia.org/wiki/Main_Page
    { code: 'cs', name: 'Čeština' },
    { code: 'da', name: 'Dansk' },
    { code: 'de', name: 'Deutsch' },
    { code: 'et', name: 'Eesti' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fa_AF', name: 'دری- افغانستان' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'hu', name: 'Magyar' },
    { code: 'ja', name: '日本語' },
    { code: 'ne', name: 'नेपाली' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'zh', name: '中文' },
];

// The 3 modes the tutorial prompt box can be in
export const tutorialModes = {
    // instructions is shown at the start, until another mode is switched to:
    instructions: 'instructions',
    // success is displayed once the user has reached the correct combination
    // of taps by themselves,
    success: 'success',
    // hint is shown if they press the "show answers" button
    hint: 'hint',
};

// various urls
export const devOsmUrl = 'https://master.apis.dev.openstreetmap.org/';

export const chevronRight = `
<svg width="17" height="26" viewBox="0 0 17 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.23404 1L1 3.1L11.5356 13L1 22.9L3.23404 25L16 13L3.23404 1Z" fill="#262626" stroke="#262626" stroke-width="0.942857"/>
</svg>
`;
