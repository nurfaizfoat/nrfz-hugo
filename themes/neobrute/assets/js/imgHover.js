document.addEventListener("DOMContentLoaded", function () {
    const img = document.getElementById("imgHover");
    if (!img) return;

    const frame = img.closest(".avatar-frame");
    if (!frame) return;

    const staticSrc = img.dataset.staticSrc;
    const mouseAvailable = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const directions = ["right", "downright", "down", "downleft", "left", "upleft", "up", "upright"];
    const faces = new Map();
    let pointer = null;
    let animationFrame = null;
    let currentDirection = null;

    function setImage(src) {
        if (img.getAttribute("src") !== src) img.src = src;
    }

    function reset() {
        pointer = null;
        currentDirection = null;
        if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
        setImage(staticSrc);
        img.style.transform = "";
    }

    function update() {
        animationFrame = null;
        if (!pointer || !mouseAvailable.matches) return;

        // Measure the fixed frame, not the translated portrait.
        const rect = frame.getBoundingClientRect();
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < Math.max(12, rect.width * 0.2)) {
            currentDirection = null;
            setImage(staticSrc);
            img.style.transform = "";
            return;
        }

        const angle = Math.atan2(dy, dx);
        const sector = Math.PI / 4;
        const nextDirection = (Math.round(angle / sector) + 8) % 8;
        // Hold a pose an extra five degrees past its boundary to avoid jitter.
        const difference = currentDirection === null ? Infinity :
            Math.abs(Math.atan2(Math.sin(angle - currentDirection * sector), Math.cos(angle - currentDirection * sector)));
        if (difference > sector / 2 + Math.PI / 36) currentDirection = nextDirection;

        const face = faces.get(directions[currentDirection]);
        setImage(face && face.ready ? face.src : staticSrc);
        const shift = reducedMotion.matches ? 0 : Math.min(3, distance / 100);
        img.style.transform = `translate(${dx / distance * shift}px, ${dy / distance * shift}px)`;
    }

    function scheduleUpdate() {
        if (pointer && animationFrame === null) animationFrame = window.requestAnimationFrame(update);
    }

    function preloadFaces() {
        if (!mouseAvailable.matches) return;
        directions.forEach(function (direction) {
            if (faces.has(direction)) return;
            const src = img.dataset["face" + direction[0].toUpperCase() + direction.slice(1)];
            if (!src) return;
            const face = { src, ready: false };
            faces.set(direction, face);
            const image = new Image();
            image.onload = function () {
                face.ready = true;
                scheduleUpdate();
            };
            image.src = src;
        });
    }

    document.addEventListener("pointermove", function (event) {
        if (event.pointerType !== "mouse" || !mouseAvailable.matches) {
            reset();
            return;
        }
        pointer = { x: event.clientX, y: event.clientY };
        scheduleUpdate();
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) reset();
    });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener("change", scheduleUpdate);
    mouseAvailable.addEventListener("change", function () {
        reset();
        preloadFaces();
    });
    img.addEventListener("error", function () {
        faces.forEach(function (face) {
            if (face.src === img.getAttribute("src")) face.ready = false;
        });
        if (img.getAttribute("src") !== staticSrc) setImage(staticSrc);
    });
    preloadFaces();
});
