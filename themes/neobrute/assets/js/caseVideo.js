document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".case-video-load").forEach(function (link) {
        function loadVideo(event) {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const iframe = document.createElement("iframe");
            iframe.src = link.dataset.videoSrc;
            iframe.title = link.dataset.videoTitle;
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.tabIndex = 0;
            link.closest(".case-video").querySelector(".case-video-player").replaceChildren(iframe);
            iframe.focus();
            link.removeEventListener("click", loadVideo);
        }
        link.addEventListener("click", loadVideo);
    });
});
