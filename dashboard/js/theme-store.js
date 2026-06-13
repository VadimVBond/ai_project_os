/**
 * AI Project OS — ThemeStore + RightSideThemePanel
 * 
 * Управляет:
 *   - themeMode: 'light' | 'dark' | 'system'
 *   - accentColor: строка-ключ предустановленного цвета
 * 
 * Сохраняет состояние в localStorage.
 * Полностью независим от core-loader.js, не ломает его.
 */

(function () {
    'use strict';

    /* ────────────────────────────────────────────────
       CONSTANTS
    ──────────────────────────────────────────────── */
    var STORAGE_KEY_THEME  = 'aip_theme_mode';
    var STORAGE_KEY_ACCENT = 'aip_accent_color';

    var ACCENT_COLORS = [
        { key: 'primary',  label: 'Teal'    },
        { key: 'blue',     label: 'Blue'    },
        { key: 'violet',   label: 'Violet'  },
        { key: 'coral',    label: 'Coral'   },
        { key: 'amber',    label: 'Amber'   },
        { key: 'emerald',  label: 'Emerald' },
        { key: 'rose',     label: 'Rose'    },
        { key: 'slate',    label: 'Slate'   }
    ];

    /* ────────────────────────────────────────────────
       STATE
    ──────────────────────────────────────────────── */
    var state = {
        themeMode:   localStorage.getItem(STORAGE_KEY_THEME)  || 'system',
        accentColor: localStorage.getItem(STORAGE_KEY_ACCENT) || 'primary',
        panelOpen:   false
    };

    /* ────────────────────────────────────────────────
       THEME APPLICATION
    ──────────────────────────────────────────────── */

    /**
     * Определяет эффективную тему с учётом системных настроек.
     * @returns {'light'|'dark'}
     */
    function resolveEffectiveTheme() {
        if (state.themeMode === 'dark')  return 'dark';
        if (state.themeMode === 'light') return 'light';
        // 'system'
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? 'dark'
            : 'light';
    }

    /**
     * Применяет тему к <body> (совместимо с core-loader.js).
     */
    function applyTheme() {
        var effective = resolveEffectiveTheme();
        var $body = $('body');

        if (effective === 'dark') {
            $body.removeClass('md-skin').addClass('skin-1 dark-mode');
        } else {
            $body.removeClass('skin-1 dark-mode').addClass('md-skin');
        }

        // Убираем временный preload-класс после применения настоящих классов
        $('html').removeClass('theme-preload-dark');
    }

    /**
     * Применяет акцентный цвет через data-атрибут на <html>.
     */
    function applyAccent() {
        $('html').attr('data-accent', state.accentColor);
    }

    /**
     * Сохраняет состояние в localStorage.
     */
    function persist() {
        localStorage.setItem(STORAGE_KEY_THEME,  state.themeMode);
        localStorage.setItem(STORAGE_KEY_ACCENT, state.accentColor);
    }

    /**
     * Устанавливает тему и применяет изменения.
     * @param {'light'|'dark'|'system'} mode
     */
    function setThemeMode(mode) {
        state.themeMode = mode;
        persist();
        applyTheme();
        updatePanelUI();
    }

    /**
     * Устанавливает акцентный цвет.
     * @param {string} colorKey
     */
    function setAccentColor(colorKey) {
        state.accentColor = colorKey;
        persist();
        applyAccent();
        updatePanelUI();
    }

    /**
     * Сбрасывает к дефолтным настройкам.
     */
    function resetToDefaults() {
        state.themeMode   = 'system';
        state.accentColor = 'primary';
        persist();
        applyTheme();
        applyAccent();
        updatePanelUI();
    }

    /* ────────────────────────────────────────────────
       PANEL OPEN / CLOSE
    ──────────────────────────────────────────────── */

    function openPanel() {
        state.panelOpen = true;
        $('#theme-panel').addClass('open');
        $('body').addClass('theme-panel-open');
        $('#theme-panel-overlay').addClass('visible');
    }

    function closePanel() {
        state.panelOpen = false;
        $('#theme-panel').removeClass('open');
        $('body').removeClass('theme-panel-open');
        $('#theme-panel-overlay').removeClass('visible');
    }

    function togglePanel() {
        if (state.panelOpen) closePanel();
        else openPanel();
    }

    /* ────────────────────────────────────────────────
       UI SYNC — обновление активных состояний в панели
    ──────────────────────────────────────────────── */

    function updatePanelUI() {
        // Theme mode buttons
        $('.theme-mode-btn').removeClass('active');
        $('.theme-mode-btn[data-mode="' + state.themeMode + '"]').addClass('active');

        // Accent swatches
        $('.accent-color-swatch').removeClass('active');
        $('.accent-color-swatch[data-accent="' + state.accentColor + '"]').addClass('active');

        // Toggle button accent
        $('#theme-panel-toggle').css('background-color', '');  // вернёт к CSS var
    }

    /* ────────────────────────────────────────────────
       BUILD PANEL HTML — вставляет компонент в DOM
    ──────────────────────────────────────────────── */

    function buildSwatchesHTML() {
        return ACCENT_COLORS.map(function (c) {
            return [
                '<div class="accent-swatch-wrap">',
                '  <div class="accent-color-swatch swatch-' + c.key + '"',
                '       data-accent="' + c.key + '"',
                '       title="' + c.label + '">',
                '    <span class="swatch-check"><i class="fa fa-check"></i></span>',
                '  </div>',
                '  <span class="accent-color-name">' + c.label + '</span>',
                '</div>'
            ].join('');
        }).join('');
    }

    function buildPanelHTML() {
        return [
            /* ── Toggle Button ── */
            '<button id="theme-panel-toggle" title="Customize UI">',
            '  <span class="toggle-icon"><i class="fa fa-sliders"></i></span>',
            '  <span class="toggle-label">UI</span>',
            '</button>',

            /* ── Overlay ── */
            '<div id="theme-panel-overlay"></div>',

            /* ── Panel ── */
            '<div id="theme-panel" role="complementary" aria-label="UI Customization Panel">',

            /* Header */
            '  <div class="theme-panel-header">',
            '    <div class="panel-icon"><i class="fa fa-paint-brush"></i></div>',
            '    <div>',
            '      <h5>UI Customization</h5>',
            '      <small>Theme &amp; Accent Colors</small>',
            '    </div>',
            '  </div>',

            /* Section: Theme Mode */
            '  <div class="theme-panel-section">',
            '    <p class="theme-panel-section-label">Theme Mode</p>',
            '    <div class="theme-mode-grid">',
            '      <button class="theme-mode-btn" data-mode="light" title="Light Theme">',
            '        <i class="fa fa-sun-o"></i>',
            '        <span>Light</span>',
            '        <span class="check-badge"><i class="fa fa-check"></i></span>',
            '      </button>',
            '      <button class="theme-mode-btn" data-mode="dark" title="Dark Theme">',
            '        <i class="fa fa-moon-o"></i>',
            '        <span>Dark</span>',
            '        <span class="check-badge"><i class="fa fa-check"></i></span>',
            '      </button>',
            '      <button class="theme-mode-btn" data-mode="system" title="Follow System">',
            '        <i class="fa fa-desktop"></i>',
            '        <span>Auto</span>',
            '        <span class="check-badge"><i class="fa fa-check"></i></span>',
            '      </button>',
            '    </div>',
            '  </div>',

            /* Section: Accent Color */
            '  <div class="theme-panel-section">',
            '    <p class="theme-panel-section-label">Accent Color</p>',
            '    <div class="accent-color-grid">',
            buildSwatchesHTML(),
            '    </div>',
            '  </div>',

            /* Footer */
            '  <div class="theme-panel-footer">',
            '    <button class="reset-btn" id="theme-panel-reset">',
            '      <i class="fa fa-undo"></i> Reset to Defaults',
            '    </button>',
            '  </div>',

            '</div>'  /* #theme-panel */
        ].join('\n');
    }

    /* ────────────────────────────────────────────────
       EVENT BINDING
    ──────────────────────────────────────────────── */

    function bindEvents() {
        // Toggle open/close
        $(document).on('click', '#theme-panel-toggle', function () {
            togglePanel();
        });

        // Overlay click — close
        $(document).on('click', '#theme-panel-overlay', function () {
            closePanel();
        });

        // Theme mode buttons
        $(document).on('click', '.theme-mode-btn', function () {
            var mode = $(this).data('mode');
            setThemeMode(mode);
        });

        // Accent swatches
        $(document).on('click', '.accent-color-swatch', function () {
            var accent = $(this).data('accent');
            setAccentColor(accent);
        });

        // Reset button
        $(document).on('click', '#theme-panel-reset', function () {
            resetToDefaults();
        });

        // Системное изменение темы (prefers-color-scheme)
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
                if (state.themeMode === 'system') {
                    applyTheme();
                }
            });
        }

        // ESC — закрыть панель
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && state.panelOpen) {
                closePanel();
            }
        });
    }

    /* ────────────────────────────────────────────────
       INIT — добавляем стили accent-swatch-wrap
    ──────────────────────────────────────────────── */

    function injectHelperStyles() {
        var style = document.createElement('style');
        style.id  = 'theme-store-helpers';
        style.textContent = [
            '.accent-color-grid {',
            '    display: grid;',
            '    grid-template-columns: repeat(4, 1fr);',
            '    gap: 10px;',
            '}',
            '.accent-swatch-wrap {',
            '    display: flex;',
            '    flex-direction: column;',
            '    align-items: center;',
            '    gap: 4px;',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    /* ────────────────────────────────────────────────
       PUBLIC API (доступна через window.ThemeStore)
    ──────────────────────────────────────────────── */
    window.ThemeStore = {
        setThemeMode:  setThemeMode,
        setAccentColor: setAccentColor,
        reset:         resetToDefaults,
        getState:      function () { return Object.assign({}, state); },
        openPanel:     openPanel,
        closePanel:    closePanel
    };

    /* ────────────────────────────────────────────────
       DOCUMENT READY
    ──────────────────────────────────────────────── */
    $(document).ready(function () {
        // 1. Применяем сохранённое состояние сразу (до рендера панели)
        applyTheme();
        applyAccent();

        // 2. Вставляем панель в DOM
        injectHelperStyles();
        $('body').append(buildPanelHTML());

        // 3. Привязываем события
        bindEvents();

        // 4. Синхронизируем UI панели с текущим состоянием
        updatePanelUI();

        // 5. Pulse-анимация кнопки при первом запуске (если ещё не было сессий)
        var isFirstVisit = !localStorage.getItem(STORAGE_KEY_THEME);
        if (isFirstVisit) {
            setTimeout(function () {
                $('#theme-panel-toggle').addClass('pulse');
                setTimeout(function () {
                    $('#theme-panel-toggle').removeClass('pulse');
                }, 4000);
            }, 1500);
        }

        console.log('[ThemeStore] Initialized. Mode:', state.themeMode, '| Accent:', state.accentColor);
    });

})();
