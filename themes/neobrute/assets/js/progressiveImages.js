document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img[data-progressive]").forEach(function (image) {
        function loaded() {
            if (image.naturalWidth > 0) image.classList.add("is-image-loaded");
        }
        image.addEventListener("load", loaded);
        // A cached/eager image may have finished before this script ran.
        if (image.complete) loaded();
    });
});
