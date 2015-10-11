$(document).ready(function() {
  $('.background-image').on('webkitAnimationEnd', function(e) {
    $(this).addClass('visible');
  });
});