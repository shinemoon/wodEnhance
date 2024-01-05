console.log('WoDEnhancement Injection Start!');

//Force to 'Office Skin'
// Function to replace the CSS file
function replaceCssFile() {
  const links = document.head.querySelectorAll('link[rel="stylesheet"][href*="/wod/css//skins/skin-"]');

  links.forEach(link => {
    // Use a regular expression to replace "skin-x" with "skin-5"
    link.href = link.href.replace(/\/wod\/css\/\/skins\/skin-\d+/, '/wod/css//skins/skin-1');
  });
}

// Function to replace the image URLs
function replaceImageUrls() {
  const images = document.querySelectorAll('img[src*="/wod/css//skins/skin-"]');

  images.forEach(image => {
    // Use a regular expression to replace "/wod/css//skins/skin-x/images/" with "/wod/css//skins/skin-1/images/"
    image.src = image.src.replace(/\/wod\/css\/\/skins\/skin-\d+\/images\//, '/wod/css//skins/skin-1/images/');
  });
}

replaceCssFile();
replaceImageUrls();


// To replace the logo with Avator
$('.gadget.logo .gadget_body').append("<img style='width:120px;height:120px;' src='"+$('.hero_avatar.image img').attr('src')+"'>");
$('.hero_avatar.image img').hide();