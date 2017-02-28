// masonry board setup
$(window).on('load', function(){
  var $container = $('.grid').masonry();

  // layout Masonry again after all images have loaded
  $container.imagesLoaded( function() {

    $container.masonry({
        itemSelector : '.grid-item',
        columnwidth: 300,
        isFitWidth: true,
        isAnimated: true,
        gutter: 10,
        stagger: 30
    });
  });
});

$(window).resize(function () {
  var $container = $('.grid').masonry();
    $container.masonry('bindResize')
});

// check for broken image link
function imgError(image) {
    image.onerror = "";
    image.src = "../imagenotfound.svg";
    return true;
}
