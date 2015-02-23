
function handleTOCLinks() {
  // prevent TOC links from changing the location hash
  $('#tocContainer a, .tocBackLink').on(
    'click',
    function(e) {
      console.log('TOC link clicked ' + e.currentTarget.hash);
      e.preventDefault();
      e.stopPropagation();
      $('body, html').animate(
        { 'scrollTop': $(e.currentTarget.hash).offset().top - 33 },
        500
      );
    }
  )
}
