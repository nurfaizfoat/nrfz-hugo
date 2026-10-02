document.addEventListener("DOMContentLoaded", function() {
    const img = document.getElementById('imgHover');

    if (!img) {
        return;
    }

    const staticSrc = img.dataset.staticSrc;
    const animatedSrc = img.dataset.animatedSrc;

    img.addEventListener('mouseover', () => {
        img.src = animatedSrc;
    });

    img.addEventListener('mouseout', () => {
        img.src = staticSrc;
    });
});
