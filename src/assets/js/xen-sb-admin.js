(function($) {
  "use strict"; // Start of use strict
 
  // Toggle the side navigation
  $("#sidebarToggle").on('click',function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });
 
 
 
  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });
 
 
  // Scroll to top button appear
  $(document).on('scroll',function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });
 
 
  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });


 
 
 
 
// ================================
//    Print Popup
// ================================
  // custom collapser
  $('.pp-sidebar-collapes-header').on('click',function(){
        $(this).next('.pp-sidebar-collapes-body').slideToggle();
  });
 
  // custom tabs for print tabs
  $('.print-tog').on('click',function(){
        $('.web-tog').removeClass('active');
        $('.web-tog').removeClass('active');
        $(this).addClass('active');
        $('.web-tab').hide();
        $('.print-tab').show();
  });
  $('.web-tog').on('click',function(){
        $('.print-tog').removeClass('active');
        $('.print-tog').removeClass('active');
        $(this).addClass('active');
        $('.print-tab').hide();
        $('.web-tab').show();
  });
 
  $('.orientation-tick').on('click',function(){
        $('.orientation-tick').removeClass('active');
        $(this).addClass('active');
  });
  $('.print-default-size').on('click',function(){
        $('.print-default-size').removeClass('active');
        $(this).addClass('active');
  });
  // ========
  // main wrap
  $('.print-popup-toggler').on('click',function(){
        $('.print-popup-wrap').fadeIn();
  });
  $('.print-popup-wrap').on('click',function(){
        $(this).fadeOut();
  });
 
  $('.print-popup-container').on('click', function(e){
     e.stopPropagation();
  });
 
 
  // Mobile Tabs on click Toggle
    $(document).ready(function() {
      //  var actived_nav_tabs = $('.ic-tools-tab-content');  
 
      //  $('.nav-tabs > li > a').click(function(event){
      //     event.preventDefault();
      //     actived_nav_tabs.addClass('active');
      //  });
        // Mb Header Tools 
        $('.icentra-tools-toggler').on('click',function(e){
              $('.mb-editer-header-tool').toggleClass('in');
              e.stopPropagation();
        });
        $('.icentra-text-toggler').on('click',function(e){
              $('.ic-editor-workarea-sidebar').toggle();
              e.stopPropagation();
        });
        // Remover
         $('.sidebar-left, .activity-opner, .close-stream').on("click", function () {
            //$('.ic-editor-workarea-sidebar').toggle();
          });
         $('.ic-editor-workarea, .sidebar-left, .activity-opner, .ic-editor-header').on("click", function () {
            $('.ic-tools-tab-content').removeClass('active');
            if (!$(event.target).hasClass('icentra-tools-toggler')) {
                $('.mb-editer-header-tool').removeClass('in');
            }
        });
     
});
})(jQuery); // End of use strict