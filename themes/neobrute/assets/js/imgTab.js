function showImage(imageId) {
    // Hide all images within the specific container
    document.querySelectorAll('.column .image').forEach(function(image) {
        image.style.display = 'none';
    });

    // Show the selected image
    document.getElementById(imageId + '-image').style.display = 'block';

    // Update the active tab
    document.querySelectorAll('.tabs li').forEach(function(tab) {
        tab.classList.remove('is-active');
    });
    document.querySelector('li[onclick="showImage(\'' + imageId + '\')"]').classList.add('is-active');
}
