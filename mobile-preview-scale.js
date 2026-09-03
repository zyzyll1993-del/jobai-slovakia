/* JobAI Slovakia — fit the A4 resume preview to mobile screens. */
(function () {
  "use strict";

  var A4_WIDTH = 794;
  var MOBILE_MAX = 900;
  var frame = 0;

  function previewParts() {
    var preview = document.getElementById("preview");
    var wrapper = preview && preview.querySelector(".preview-wrapper");
    var page = document.getElementById("resumePreview");
    return { wrapper: wrapper, page: page };
  }

  function reset(wrapper, page) {
    page.style.removeProperty("transform");
    page.style.removeProperty("transform-origin");
    wrapper.style.removeProperty("height");
    wrapper.classList.remove("jobai-mobile-preview-scaled");
  }

  function scalePreview() {
    frame = 0;
    var parts = previewParts();
    var wrapper = parts.wrapper;
    var page = parts.page;
    if (!wrapper || !page) return;

    if (window.innerWidth > MOBILE_MAX || window.matchMedia("print").matches) {
      reset(wrapper, page);
      return;
    }

    var style = window.getComputedStyle(wrapper);
    var horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    var availableWidth = Math.max(1, wrapper.clientWidth - horizontalPadding);
    var scale = Math.min(1, availableWidth / A4_WIDTH);
    var pageHeight = Math.max(page.scrollHeight, page.offsetHeight, 1123);

    page.style.setProperty("transform-origin", "top left", "important");
    page.style.setProperty("transform", "scale(" + scale + ")", "important");
    wrapper.style.setProperty("height", Math.ceil(pageHeight * scale + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)) + "px", "important");
    wrapper.classList.add("jobai-mobile-preview-scaled");
  }

  function scheduleScale() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(scalePreview);
  }

  function start() {
    var parts = previewParts();
    if (!parts.wrapper || !parts.page) return;

    var style = document.createElement("style");
    style.id = "jobaiMobilePreviewScaleStyles";
    style.textContent =
      "@media(max-width:900px){" +
      "#preview .preview-wrapper.jobai-mobile-preview-scaled{overflow:hidden!important;}" +
      "#preview .preview-wrapper.jobai-mobile-preview-scaled #resumePreview{margin:0!important;}" +
      "}" +
      "@media print{" +
      "#preview .preview-wrapper{height:auto!important;}" +
      "#preview #resumePreview{transform:none!important;}" +
      "}";
    if (!document.getElementById(style.id)) document.head.appendChild(style);

    window.addEventListener("resize", scheduleScale, { passive: true });
    window.addEventListener("orientationchange", scheduleScale, { passive: true });
    window.addEventListener("beforeprint", function () { reset(parts.wrapper, parts.page); });
    window.addEventListener("afterprint", scheduleScale);

    if (window.ResizeObserver) {
      new ResizeObserver(scheduleScale).observe(parts.wrapper);
      new ResizeObserver(scheduleScale).observe(parts.page);
    }
    if (window.MutationObserver) {
      new MutationObserver(scheduleScale).observe(parts.page, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    var oldShowTab = window.showTab;
    if (typeof oldShowTab === "function") {
      window.showTab = function (tabName) {
        var result = oldShowTab.apply(this, arguments);
        if (tabName === "preview") window.setTimeout(scheduleScale, 50);
        return result;
      };
    }

    scheduleScale();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
