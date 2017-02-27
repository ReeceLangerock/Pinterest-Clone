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

function imgError(image) {
    image.onerror = "";
    image.src = "../imagenotfound.svg";
    return true;
}

/*function loadImages(pins) {
    var $grid = $('.grid');



    imagesLoaded($grid, function() {
        // init Isotope after all images have loaded
        $grid = $('.grid').masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            fitWidth: true
        });

    });

    for (let i = 0; i < pins.length; i++) {
        var $content = $( getItemElement(pins[i]) );
        // add jQuery object
        $grid.append( $content ).masonry( 'appended', $content );
    }
};

// create <div class="grid-item"></div>
function getItemElement(pin) {

    var div = `<div id = 'grid-item'>
    <img src = ${pin.pinUrl}>
    <h1>${pin.pinOwner}</h1>
    </div>`

    return div;
}
*/
