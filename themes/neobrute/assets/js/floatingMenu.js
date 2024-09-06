document.addEventListener('DOMContentLoaded', function() {
    const floatNav = document.querySelector('.float-nav');
    const mainNav = document.querySelector('.main-nav');
    const menuBtn = document.querySelector('.menu-btn');

    floatNav.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the anchor tag
        mainNav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });
});
