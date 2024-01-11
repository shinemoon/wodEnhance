console.log('WoDEnhancement Injection Start!');
$('html').hide();

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

function otherRefinement() {
  //Remove the action of top tools
  $('img[src*="images/icons/inf.gif"]').css('border-radius', '8px').css('margin-left', '5px');
  $('img[src*="images/icons/gem_.gif"]').css('border-radius', '8px').css('margin-left', '5px');

  //Gold
  $('.gold').css('margin-top', '10px').css('padding-top', '10px').css('border-top', '1px solid #aaa');
  $('.gold .image').hide();
  // fetch ep/fame
  var epinfo = $('.ep .bar').attr('onmouseover');
  var fameinfo = $('.fame .bar').attr('onmouseover');

  // Extract the values using a regular expression
  var totalExp = extractValue(epinfo, '总共:');
  var usableExp = extractValue(epinfo, '可使用:');
  var nextLevelExp = extractValue(epinfo, '到下一级别需要<b使用</b>:');
  $('div.ep .image').hide();
  $('div.ep .bar').hide();

  $('div.ep').append('<div style="display:flex;align-items: center;margin-top:5px;"><div style="margin-right:8px;">Exp: <u>' + usableExp + ' </u></div></div><div class="experience-bar" style="margin-top:5px;"><div class="filled-bar" ></div></div>')
  updateExperienceBar(usableExp, nextLevelExp, '.experience-bar');
  // Extract the values using regular expressions
  var totalFame = extractValue(fameinfo, '荣誉总数（含奖励值）:');
  var originalFame = extractValue(fameinfo, '荣誉（原始值）:');
  var nextTitleFame = extractValue(fameinfo, '下一头衔:');
  var missingFame = extractValue(fameinfo, '缺少:');
  $('div.fame .image').hide();
  $('div.fame .bar').hide();
  $('div.fame').append('<div style="display:flex;align-items: center;margin-top:5px;margin-bottom:0px;"><div style="margin-right:0px;">Fame: <u>' + originalFame + '</u></div></div><div class="fame-bar" style="margin-top:5px;margin-bottom:20px;" ><div class="filled-bar"></div></div>')
  updateExperienceBar(originalFame, nextTitleFame, '.fame-bar');

  $('textarea').on('mouseover', function () {
    // Remove resizer:
    $('textarea').off('mouseover');
    $('textarea').removeAttr('onmouseover');
    $('textarea').parent().removeClass('resizeable');
  });

  $('span[style*=paleturquoise]').attr("style", "color:#147fcb!important");
}

// Function to extract value based on the label
function extractValue(htmlString, label) {
  try {
    var regex = new RegExp(label + '</td><td>([\\d,]+)');
    var match = htmlString.match(regex);
    if (match && match.length === 2) {
      return match[1].replace(',', ''); // Remove commas from the number
    };
  } catch {
    return null;
  };
  return null;
}

// Function to update the experience bar
function updateExperienceBar(currentExp, nextLevelExp, hdlstr) {
  var percentage = (currentExp / nextLevelExp) * 100;
  $(hdlstr + ' .filled-bar').css('width', percentage + '%');
  // Update tooltip text
  var tooltipText = `Current: ${currentExp}\nNext Level: ${nextLevelExp}`;
  $(hdlstr).attr('title', tooltipText);
}


replaceCssFile();
//replaceImageUrls();
otherRefinement();


// To replace the logo with Avator
$('.gadget.logo .gadget_body').append("<img style='width:120px;height:120px;' src='" + $('.hero_avatar.image img').attr('src') + "'>");
$('.hero_avatar.image img').hide();

console.log('WoDEnhancement Basical Injection Done!');
$('html').show();