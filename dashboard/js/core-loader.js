/**
 * Core Loader for AI Project OS Dashboard
 * Fetches state from data/*.json and updates UI without direct python execution.
 */

$(document).ready(function() {
    console.log("Core Loader initialized.");
    
    // Globals
    const SETTINGS_URL = '../data/settings.json';
    const I18N_URL = '../data/i18n.json';
    let translations = {};

    // Fetch and apply settings
    function loadSettings() {
        $.when(
            $.getJSON(SETTINGS_URL),
            $.getJSON(I18N_URL)
        ).done(function(settingsData, i18nData) {
            console.log("Settings and i18n loaded");
            translations = i18nData[0];
            
            const system = settingsData[0].system;
            const bootstrap = settingsData[0].bootstrap;
            
            applySystemSettings(system);
            applyProjectInfo(bootstrap);
            
            // Trigger routing on load
            handleRouting();
        }).fail(function() {
            console.error("Failed to load settings or translations.");
        });
    }

    // Apply system settings (theme, mode, language)
    function applySystemSettings(systemSettings) {
        if (!systemSettings) return;

        // Apply Theme
        // PATCHED: ThemeStore (localStorage) takes priority over settings.json.
        // Only apply settings.json theme if user has NOT saved a custom preference.
        var userSavedTheme = localStorage.getItem('aip_theme_mode');
        if (!userSavedTheme) {
            // No localStorage preference — use settings.json value
            if (systemSettings.theme === 'dark') {
                $('body').removeClass('md-skin').addClass('skin-1 dark-mode'); // skin-1 is dark theme sidebar, dark-mode is full custom dark
            } else {
                $('body').removeClass('skin-1 dark-mode').addClass('md-skin');
            }
        }
        // If userSavedTheme exists, ThemeStore has already applied it — do nothing here.

        // Apply Mode
        $('.current-mode-label').text(systemSettings.mode === 'developer' ? 'Developer Mode' : 'Client Mode');

        // Apply Language
        const lang = systemSettings.language.toLowerCase();
        $('.current-language-label').text(lang.toUpperCase());
        updateTranslations(lang);
    }
    
    // Update DOM translations
    function updateTranslations(lang) {
        if (!translations[lang]) return;
        const dict = translations[lang];
        $('[data-i18n]').each(function() {
            const key = $(this).data('i18n');
            if (dict[key]) {
                // Check if it's an input/placeholder or just text
                if ($(this).is('input')) {
                    $(this).attr('placeholder', dict[key]);
                } else {
                    $(this).text(dict[key]);
                }
            }
        });
    }

    // Apply Project Information
    function applyProjectInfo(bootstrapData) {
        if (!bootstrapData) return;
        $('.project-framework-label').text(bootstrapData.framework);
        $('.project-type-label').text(bootstrapData.project_type);
    }
    
    // Simple Hash Routing
    function handleRouting() {
        let hash = window.location.hash || '#dashboard';
        
        // Hide all sections, show target
        $('.page-section').hide();
        $(hash).show();
        
        // Update sidebar active states
        $('#side-menu li').removeClass('active');
        $(`a[href="${hash}"]`).closest('li').addClass('active');
    }

    $(window).on('hashchange', handleRouting);

    // Event Listeners for UI Testing
    $('.theme-toggle').on('click', function(e) {
        e.preventDefault();
        const newTheme = $(this).data('theme');
        applySystemSettings({ theme: newTheme, mode: 'developer', language: $('.current-language-label').text().toLowerCase() });
    });

    $('.lang-toggle').on('click', function(e) {
        e.preventDefault();
        const newLang = $(this).data('lang');
        applySystemSettings({ theme: $('body').hasClass('skin-1') ? 'dark' : 'light', mode: 'developer', language: newLang });
    });

    // Initialize
    loadSettings();
});
