document.addEventListener("DOMContentLoaded", function () {
  var SELECTOR = "img.is-rounded-img, img[data-lightbox]";

  var images = Array.prototype.slice.call(document.querySelectorAll(SELECTOR)).filter(function (img) {
    return !img.closest("a");
  });

  if (!images.length) {
    return;
  }

  var overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML =
    '<div class="lightbox__backdrop" data-lightbox-close></div>' +
    '<button type="button" class="lightbox__close" aria-label="Close image">&times;</button>' +
    '<figure class="lightbox__figure">' +
    '<img class="lightbox__img" alt="">' +
    '<figcaption class="lightbox__caption"></figcaption>' +
    "</figure>";

  document.body.appendChild(overlay);

  var overlayImg = overlay.querySelector(".lightbox__img");
  var overlayCaption = overlay.querySelector(".lightbox__caption");
  var closeButton = overlay.querySelector(".lightbox__close");
  var lastFocused = null;
  var isOpen = false;

  function getCaption(img) {
    if (img.dataset.caption) {
      return img.dataset.caption.trim();
    }
    var figure = img.closest("figure");
    var figcaption = figure ? figure.querySelector("figcaption") : null;
    return figcaption ? figcaption.textContent.trim() : "";
  }

  function open(img) {
    lastFocused = document.activeElement;
    overlayImg.src = img.currentSrc || img.src;
    overlayImg.alt = img.alt || "";
    var caption = getCaption(img);
    overlayCaption.textContent = caption;
    overlayCaption.hidden = !caption;

    isOpen = true;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function close() {
    if (!isOpen) {
      return;
    }
    isOpen = false;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    window.setTimeout(function () {
      if (!isOpen) {
        overlayImg.removeAttribute("src");
      }
    }, 300);

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  images.forEach(function (img) {
    img.classList.add("lightbox-trigger");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");

    img.addEventListener("click", function () {
      open(img);
    });

    img.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(img);
      }
    });
  });

  overlay.querySelector(".lightbox__backdrop").addEventListener("click", close);
  closeButton.addEventListener("click", close);

  document.addEventListener("keydown", function (event) {
    if (isOpen && event.key === "Escape") {
      close();
    }
  });

  var touchStartY = null;
  overlay.addEventListener(
    "touchstart",
    function (event) {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );
  overlay.addEventListener(
    "touchend",
    function (event) {
      if (touchStartY === null) {
        return;
      }
      var deltaY = event.changedTouches[0].clientY - touchStartY;
      touchStartY = null;
      if (Math.abs(deltaY) > 80) {
        close();
      }
    },
    { passive: true }
  );
});
