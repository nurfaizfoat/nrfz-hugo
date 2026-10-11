document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("[data-thumb]");
    if (!links.length) return;

    const tooltip = document.createElement("div");
    tooltip.className = "work-tooltip";
    tooltip.innerHTML =
        '<img class="work-tooltip-img" alt="">' +
        '<p class="work-tooltip-text"></p>';
    document.body.appendChild(tooltip);

    const tooltipImg = tooltip.querySelector(".work-tooltip-img");
    const tooltipText = tooltip.querySelector(".work-tooltip-text");

    let hideTimer = null;

    function position(link) {
        const gap = 14;
        const rect = link.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();

        let top = rect.bottom + gap;
        if (top + tipRect.height > window.innerHeight - gap) {
            top = rect.top - tipRect.height - gap;
        }

        let left = rect.left + rect.width / 2 - tipRect.width / 2;
        left = Math.max(gap, Math.min(left, window.innerWidth - tipRect.width - gap));

        tooltip.style.top = Math.max(gap, top) + "px";
        tooltip.style.left = left + "px";
    }

    function show(link) {
        clearTimeout(hideTimer);
        tooltipImg.src = link.dataset.thumb;
        tooltipImg.alt = link.dataset.title || "";
        tooltipText.textContent = link.dataset.excerpt || "";
        tooltip.classList.add("is-visible");
        position(link);
    }

    function hide() {
        hideTimer = setTimeout(function () {
            tooltip.classList.remove("is-visible");
        }, 60);
    }

    links.forEach(function (link) {
        link.addEventListener("mouseenter", function () { show(link); });
        link.addEventListener("mouseleave", hide);
        link.addEventListener("focus", function () { show(link); });
        link.addEventListener("blur", hide);
    });
});
