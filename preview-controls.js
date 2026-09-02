/* JobAI Slovakia — Preview controls are implemented in analysis.js.
   This file intentionally stays as a compatibility loader to avoid creating a
   duplicate controls box before the full template/color/font editor starts. */
(function () {
    "use strict";
    function refreshJobAIPreviewControls() {
        try {
            if (typeof window.initPreviewControls === "function") window.initPreviewControls();
        } catch (e) {
            console.error("JobAI Preview controls error:", e);
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(refreshJobAIPreviewControls, 120);
        });
    } else {
        setTimeout(refreshJobAIPreviewControls, 120);
    }
})();
