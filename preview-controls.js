/* JobAI Slovakia — Preview template & color controls */
(function () {
    "use strict";

    var templates = [
        ["modern", "Modern"],
        ["professional", "Professional"],
        ["executive", "Executive"],
        ["creative", "Creative"],
        ["ats", "ATS Simple"]
    ];

    var colors = [
        ["blue", "Синій", "#1976d2"],
        ["black", "Чорний", "#222222"],
        ["green", "Зелений", "#198754"],
        ["purple", "Фіолетовий", "#7048a8"],
        ["orange", "Помаранчевий", "#d97706"],
        ["red", "Червоний", "#c0392b"],
        ["teal", "Бірюзовий", "#168b8b"],
        ["navy", "Темно-синій", "#243b64"]
    ];

    function language() {
        return localStorage.getItem("jobaiLanguage") || "ua";
    }

    function labels() {
        var lang = language();
        if (lang === "sk") {
            return { title: "Vzhľad životopisu", template: "Šablóna", color: "Farba" };
        }
        if (lang === "en") {
            return { title: "Resume appearance", template: "Template", color: "Color" };
        }
        return { title: "Вигляд резюме", template: "Шаблон", color: "Колір" };
    }

    function selectedTemplate() {
        return localStorage.getItem("jobaiResumeTemplate") || "modern";
    }

    function selectedColor() {
        return localStorage.getItem("jobaiResumeColor") || "blue";
    }

    function selectExistingTemplate(id) {
        var button = document.getElementById({
            modern: "templateModern",
            professional: "templateProfessional",
            executive: "templateExecutive",
            creative: "templateCreative",
            ats: "templateATS"
        }[id]);

        if (button) {
            button.click();
        } else if (typeof window.selectTemplate === "function") {
            window.selectTemplate(id);
        }
    }

    function selectExistingColor(id) {
        var button = document.querySelector('.color-button[data-color="' + id + '"]');

        if (button) {
            button.click();
        } else if (typeof window.selectColor === "function") {
            window.selectColor(id);
        }
    }

    function syncControls(root) {
        var currentTemplate = selectedTemplate();
        var currentColor = selectedColor();

        root.querySelectorAll("[data-preview-template]").forEach(function (button) {
            button.classList.toggle(
                "selected",
                button.getAttribute("data-preview-template") === currentTemplate
            );
        });

        root.querySelectorAll("[data-preview-color]").forEach(function (button) {
            button.classList.toggle(
                "selected",
                button.getAttribute("data-preview-color") === currentColor
            );
        });
    }

    function buildControls() {
        if (document.getElementById("jobaiPreviewControls")) {
            syncControls(document.getElementById("jobaiPreviewControls"));
            return;
        }

        var preview = document.getElementById("preview");
        var wrapper = preview && preview.querySelector(".preview-wrapper");
        if (!preview || !wrapper) return;

        var text = labels();
        var box = document.createElement("div");
        box.id = "jobaiPreviewControls";
        box.className = "card jobai-preview-controls";

        var templateButtons = templates.map(function (item) {
            return '<button type="button" class="template-button" data-preview-template="' + item[0] + '">' + item[1] + '</button>';
        }).join("");

        var colorButtons = colors.map(function (item) {
            return '<button type="button" class="color-button" title="' + item[1] + '" aria-label="' + item[1] + '" data-preview-color="' + item[0] + '" style="background:' + item[2] + '"></button>';
        }).join("");

        box.innerHTML = '' +
            '<h2 id="jobaiPreviewControlsTitle">' + text.title + '</h2>' +
            '<div class="jobai-preview-control-group">' +
                '<h3 id="jobaiPreviewTemplateTitle">' + text.template + '</h3>' +
                '<div class="template-grid">' + templateButtons + '</div>' +
            '</div>' +
            '<div class="jobai-preview-control-group" style="margin-top:18px;">' +
                '<h3 id="jobaiPreviewColorTitle">' + text.color + '</h3>' +
                '<div class="color-options">' + colorButtons + '</div>' +
            '</div>';

        wrapper.parentNode.insertBefore(box, wrapper);

        box.querySelectorAll("[data-preview-template]").forEach(function (button) {
            button.addEventListener("click", function () {
                selectExistingTemplate(button.getAttribute("data-preview-template"));
                setTimeout(function () { syncControls(box); }, 0);
            });
        });

        box.querySelectorAll("[data-preview-color]").forEach(function (button) {
            button.addEventListener("click", function () {
                selectExistingColor(button.getAttribute("data-preview-color"));
                setTimeout(function () { syncControls(box); }, 0);
            });
        });

        syncControls(box);
    }

    function updateLabels() {
        var box = document.getElementById("jobaiPreviewControls");
        if (!box) return;
        var text = labels();
        var title = document.getElementById("jobaiPreviewControlsTitle");
        var template = document.getElementById("jobaiPreviewTemplateTitle");
        var color = document.getElementById("jobaiPreviewColorTitle");
        if (title) title.textContent = text.title;
        if (template) template.textContent = text.template;
        if (color) color.textContent = text.color;
    }

    function refresh() {
        buildControls();
        updateLabels();
        var box = document.getElementById("jobaiPreviewControls");
        if (box) syncControls(box);
    }

    function addStyles() {
        if (document.getElementById("jobaiPreviewControlsStyles")) return;
        var style = document.createElement("style");
        style.id = "jobaiPreviewControlsStyles";
        style.textContent =
            ".jobai-preview-controls{margin-bottom:20px;}" +
            ".jobai-preview-controls h2{margin-bottom:18px;}" +
            ".jobai-preview-control-group h3{margin:0 0 10px;}" +
            ".jobai-preview-controls .template-button.selected{background:#1976d2;border-color:#1976d2;}" +
            ".jobai-preview-controls .color-button{flex:0 0 35px;}" +
            "@media(max-width:700px){.jobai-preview-controls .template-grid{grid-template-columns:repeat(2,1fr);}.jobai-preview-controls .template-button{min-height:44px;}}";
        document.head.appendChild(style);
    }

    function init() {
        addStyles();
        refresh();

        var originalShowTab = window.showTab;
        if (typeof originalShowTab === "function" && !originalShowTab.__jobaiPreviewControls) {
            var wrappedShowTab = function (tabName) {
                originalShowTab.apply(this, arguments);
                if (tabName === "preview") {
                    setTimeout(refresh, 30);
                }
            };
            wrappedShowTab.__jobaiPreviewControls = true;
            window.showTab = wrappedShowTab;
        }

        var originalSetLanguage = window.setLanguage;
        if (typeof originalSetLanguage === "function" && !originalSetLanguage.__jobaiPreviewControls) {
            var wrappedLanguage = function () {
                var result = originalSetLanguage.apply(this, arguments);
                setTimeout(refresh, 30);
                return result;
            };
            wrappedLanguage.__jobaiPreviewControls = true;
            window.setLanguage = wrappedLanguage;
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
