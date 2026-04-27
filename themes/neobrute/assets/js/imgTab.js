function showImage(imageId) {
    // Get all images within the image container
    const images = document.querySelectorAll('.image-container .image');
    const targetImage = document.getElementById(imageId + '-image');
    
    // Fade out all images except the target
    images.forEach(function(image) {
        if (image !== targetImage) {
            image.style.opacity = '0';
        }
    });
    
    // Fade in the selected image
    targetImage.style.opacity = '1';

    // Update the active tab
    document.querySelectorAll('.tabs li').forEach(function(tab) {
        tab.classList.remove('is-active');
    });
    document.querySelector('li[onclick="showImage(\'' + imageId + '\')"]').classList.add('is-active');
}
