document.addEventListener("DOMContentLoaded", function () {
    const link = document.querySelector("[data-github-preview]");
    if (!link) return;

    const username = link.dataset.githubPreview;
    const tooltip = document.createElement("div");
    tooltip.id = "github-contribution-preview";
    tooltip.className = "work-tooltip github-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    tooltip.innerHTML =
        '<p class="github-tooltip-title"></p>' +
        '<p class="github-tooltip-status" aria-live="polite"></p>' +
        '<div class="github-tooltip-chart"></div>' +
        '<p class="github-tooltip-note">Live GitHub contributions · Updated hourly</p>';
    document.body.appendChild(tooltip);
    tooltip.querySelector(".github-tooltip-title").textContent = "@" + username + " on GitHub";

    const status = tooltip.querySelector(".github-tooltip-status");
    const chart = tooltip.querySelector(".github-tooltip-chart");
    const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
    let hideTimer;
    let loading = false;
    let loadedAt = 0;

    function position() {
        if (tooltip.hidden) return;
        const gap = 14;
        const rect = link.getBoundingClientRect();
        const tip = tooltip.getBoundingClientRect();
        let top = rect.bottom + gap;
        if (top + tip.height > window.innerHeight - gap) top = rect.top - tip.height - gap;
        const left = Math.max(gap, Math.min(rect.left + rect.width / 2 - tip.width / 2,
            window.innerWidth - tip.width - gap));
        tooltip.style.top = Math.max(gap, top) + "px";
        tooltip.style.left = left + "px";
    }

    function svgElement(name, attributes) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", name);
        Object.entries(attributes).forEach(function ([key, value]) {
            element.setAttribute(key, value);
        });
        return element;
    }

    function render(days) {
        const firstDay = new Date(days[0].date + "T00:00:00Z").getUTCDay();
        const weeks = Math.ceil((firstDay + days.length) / 7);
        const total = days.reduce(function (sum, day) { return sum + day.count; }, 0);
        const summary = total.toLocaleString() + " contributions in the last year";
        const svg = svgElement("svg", { viewBox: "0 0 " + (30 + weeks * 12) + " 110",
            role: "img", "aria-label": summary });
        let previousMonth = -1;

        ["Mon", "Wed", "Fri"].forEach(function (label, index) {
            const text = svgElement("text", { x: 0, y: 34 + index * 24,
                "font-size": 9, fill: "#57606a" });
            text.textContent = label;
            svg.appendChild(text);
        });

        days.forEach(function (day, index) {
            const offset = firstDay + index;
            const week = Math.floor(offset / 7);
            const weekday = offset % 7;
            const date = new Date(day.date + "T00:00:00Z");
            if (weekday === 0 && date.getUTCMonth() !== previousMonth) {
                const text = svgElement("text", { x: 30 + week * 12, y: 10,
                    "font-size": 9, fill: "#57606a" });
                text.textContent = date.toLocaleDateString("en", { month: "short", timeZone: "UTC" });
                svg.appendChild(text);
                previousMonth = date.getUTCMonth();
            }
            const tile = svgElement("rect", { x: 30 + week * 12, y: 18 + weekday * 12,
                width: 9, height: 9, rx: 2, fill: colors[day.level] });
            const title = svgElement("title", {});
            title.textContent = day.count + " contribution" + (day.count === 1 ? "" : "s") + " on " + day.date;
            tile.appendChild(title);
            svg.appendChild(tile);
        });
        chart.replaceChildren(svg);
        status.textContent = summary;
    }

    async function load() {
        if (loading || Date.now() - loadedAt < 60 * 60 * 1000) return;
        loading = true;
        status.textContent = "Loading GitHub contributions…";
        const controller = new AbortController();
        const timeout = window.setTimeout(function () { controller.abort(); }, 10000);
        try {
            const response = await fetch("https://github-contributions-api.jogruber.de/v4/" +
                encodeURIComponent(username) + "?y=last", { signal: controller.signal });
            if (!response.ok) throw new Error("Contribution request failed");
            const data = await response.json();
            if (!Array.isArray(data.contributions) || !data.contributions.length) throw new Error("Missing contributions");
            const days = data.contributions.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
            render(days);
            loadedAt = Date.now();
        } catch (error) {
            status.textContent = "Contributions are unavailable right now. Visit my GitHub profile to see my activity.";
        } finally {
            window.clearTimeout(timeout);
            loading = false;
            position();
        }
    }

    function show() {
        window.clearTimeout(hideTimer);
        tooltip.hidden = false;
        link.setAttribute("aria-describedby", tooltip.id);
        tooltip.classList.add("is-visible");
        load();
        position();
    }

    function dismiss() {
        window.clearTimeout(hideTimer);
        tooltip.classList.remove("is-visible");
        tooltip.hidden = true;
        link.removeAttribute("aria-describedby");
    }

    function hide() {
        hideTimer = window.setTimeout(function () {
            if (!link.matches(":hover") && !tooltip.matches(":hover") && document.activeElement !== link) dismiss();
        }, 120);
    }

    link.addEventListener("mouseenter", show);
    link.addEventListener("mouseleave", hide);
    link.addEventListener("focus", show);
    link.addEventListener("blur", hide);
    tooltip.addEventListener("mouseenter", function () { window.clearTimeout(hideTimer); });
    tooltip.addEventListener("mouseleave", hide);
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") dismiss();
    });
    window.addEventListener("scroll", position, { passive: true });
    window.addEventListener("resize", position, { passive: true });
});
