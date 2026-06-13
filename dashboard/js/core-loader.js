/**
 * Core Loader for AI Project OS Dashboard
 * Fetches state from data/*.json and updates UI without direct python execution.
 */

$(document).ready(function() {
    console.log("Core Loader initialized.");
    
    // Globals
    const SETTINGS_URL = '../data/settings.json';
    const I18N_URL = '../data/i18n.json';
    const LANGUAGE_STORAGE_KEY = 'aip_language';
    let translations = {};

    function parseLanguageFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const requestedLang = params.get('lang');
        return requestedLang ? requestedLang.toLowerCase() : null;
    }

    // Fetch and apply settings
    function loadSettings() {
        console.log("Loading settings from:", SETTINGS_URL);
        console.log("Loading i18n from:", I18N_URL);

        $.when(
            $.ajax({ url: SETTINGS_URL, dataType: 'json' }),
            $.ajax({ url: I18N_URL, dataType: 'json' })
        ).done(function(settingsData, i18nData) {
            console.log("Settings and i18n data loaded successfully");

            translations = i18nData[0];
            console.log("Available languages:", Object.keys(translations));

            const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
            const requestedLanguage = parseLanguageFromQuery();
            let activeLanguage = requestedLanguage || savedLanguage || settingsData[0].system.language;

            // Fallback to 'en' if requested/saved language is not in registry
            if (!translations[activeLanguage]) {
                console.warn("Language", activeLanguage, "not found. Falling back to 'en'");
                activeLanguage = 'en';
            }

            localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
            settingsData[0].system.language = activeLanguage;

            const system = settingsData[0].system;
            const bootstrap = settingsData[0].bootstrap;

            applySystemSettings(system);
            applyProjectInfo(bootstrap);

            // Trigger routing on load
            handleRouting();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("CRITICAL: Failed to load settings or translations.", textStatus, errorThrown, jqXHR);
            // Default fallback
            translations = { en: {} }; 
            console.warn("Initialized with empty translations as fallback.");
        });
    }

    function buildUrlWithLanguage(href, lang) {
        if (!href || href === '#') return href;
        try {
            const url = new URL(href, window.location.origin + window.location.pathname);
            url.searchParams.set('lang', lang);
            return url.href;
        } catch (error) {
            return href;
        }
    }

    function updatePreservedLinks(lang) {
        $('a[data-lang-preserve]').each(function() {
            const href = $(this).attr('href');
            const updated = buildUrlWithLanguage(href, lang);
            $(this).attr('href', updated);
        });
    }

    // Apply system settings (theme, mode, language)
    function applySystemSettings(systemSettings) {
        if (!systemSettings) return;

        // Apply Theme
        var userSavedTheme = localStorage.getItem('aip_theme_mode');
        if (!userSavedTheme) {
            if (systemSettings.theme === 'dark') {
                $('body').removeClass('md-skin').addClass('skin-1 dark-mode');
            } else {
                $('body').removeClass('skin-1 dark-mode').addClass('md-skin');
            }
        }

        // Apply Mode
        $('.current-mode-label').text(systemSettings.mode === 'developer' ? 'Developer Mode' : 'Client Mode');

        // Apply Language
        const lang = systemSettings.language.toLowerCase();
        $('.current-language-label').text(lang.toUpperCase());
        $('html').attr('lang', lang);
        updateTranslations(lang);
        updatePreservedLinks(lang);
        handleRouting();
    }
    
    function setTranslationText($element, text) {
        if ($element.is('input, textarea')) {
            $element.attr('placeholder', text);
            return;
        }
        $element.text(text);
    }

    // Update DOM translations
    function updateTranslations(lang) {
        console.log("Attempting to update translations for:", lang);
        if (!translations[lang]) {
            console.error("Translations not found for lang:", lang);
            return;
        }
        const dict = translations[lang];
        $('[data-i18n]').each(function() {
            const key = $(this).data('i18n');
            if (dict[key]) {
                setTranslationText($(this), dict[key]);
            }
        });
        console.log("Translations update complete.");
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
        
        $('.page-section').hide();
        $(hash).show();
        
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
        let newLang = $(this).data('lang');
        if (newLang === 'ua') newLang = 'uk';
        localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
        console.log("Lang toggle clicked. New lang:", newLang);
        applySystemSettings({ theme: $('body').hasClass('skin-1') ? 'dark' : 'light', mode: 'developer', language: newLang });
    });

    // Initialize
    loadSettings();
});
