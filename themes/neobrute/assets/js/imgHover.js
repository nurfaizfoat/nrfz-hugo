document.addEventListener("DOMContentLoaded", function() {  
    const img = document.getElementById('imgHover'); // Make sure this ID matches your image  

    img.addEventListener('mouseover', () => {  
        img.src = './images/nrfz_avatar.gif'; // Change to GIF  
    });  

    img.addEventListener('mouseout', () => {  
        img.src = './images/nrfz_avatar.png'; // Change back to static image  
    });  
});  