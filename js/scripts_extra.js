var DESKTOP_BILLBOARD_LOADED = false;
var MOBILE_BILLBOARD_LOADED = false;

$(document).ready(function(){

    //These scripts are used for both webviews and the homepage

	// Owl Carousel slider
    if($(".owl-carousel.homepage-desktop-text-slider").length > 0){
        $(".owl-carousel.homepage-desktop-text-slider").owlCarousel({
            loop: true,
            center: true,
            nav: true,
            autoplay: true,
            autoplayHoverPause: true,
            animateOut: 'slideOutDown',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items:1.3
                },

                1600:{
                    items:1.4
                }
            }
        });

        var container = document.querySelector('.owl-carousel.homepage-desktop-text-slider');
        imagesLoaded( container, function() {
            DESKTOP_BILLBOARD_LOADED = true;
        });
    }

    $(".owl-carousel-home-default").hide().delay(3000).fadeOut(400);

    if($(".owl-carousel.store-products").length > 0){
        $(".owl-carousel.store-products").owlCarousel({
            loop: true,
            center: true,
            nav: true,
            dots: false,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            autoplay: true,
            autoplayHoverPause: true,
            responsive:{
                0:{
                    items:1
                }
            }
        });
    }

    if($(".owl-carousel.main-store-products").length > 0){
        $(".owl-carousel.main-store-products").owlCarousel({
            loop: true,
            center: true,
            nav: true,
            dots: true,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            autoplay: true,
            autoplayHoverPause: true,
            responsive:{
                0:{
                    items:1
                },
                600: {
                        items:3
                },
            }
        });
    }

    if($("#home-arcade").length > 0){
        $("#home-arcade").owlCarousel({
                loop: false,
                center: false,
                nav: false,
                dots: false,
                autoplay: false,
                autoplayHoverPause: true,
                margin: 25,
                responsiveClass: true,
                animateOut: 'slideOutDown',
                animateIn: 'flipInX',
                navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
                responsive:{
                0:{
                        items:1.9,
                        center: true,
                        autoplay: true,
                        loop: true,
                        margin: 20
                },
                605: {
                        items:3
                },
                950: {
                        items:4
                }
            }
        });
    }

    // Billboards Mobile Owl Carousel
    if($(".owl-carousel.homepage-mobile-text-slider").length > 0){
        $(".owl-carousel.homepage-mobile-text-slider").owlCarousel({
                loop: true,
                center: true,
                nav: false,
                dots: false,
                autoplay: true,
                autoplayHoverPause: true,
                animateOut: 'slideOutDown',
                animateIn: 'flipInX',
                navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
                responsive:{
                0:{
                        items:1.2
                }
        }
        });

        var container = document.querySelector('.owl-carousel.homepage-mobile-text-slider');
        imagesLoaded( container, function() {
            MOBILE_BILLBOARD_LOADED = true;
        });
    }

    // Remembering Widget Mobile Owl Carousel
    if($(".owl-carousel.owl-theme.mobile-remembering-content-grid.mobile-remembering-content-grid-sample").length > 0){
        $(".owl-carousel.owl-theme.mobile-remembering-content-grid.mobile-remembering-content-grid-sample").owlCarousel({
                loop: false,
                center: false,
                nav: false,
                dots: false,
                autoplay: true,
                margin: 10,
                autoplayHoverPause: true,
                animateOut: 'slideOutDown',
                animateIn: 'flipInX',
                navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
                responsive:{
                    0: {
                        items:1.9,
                        autoplay: true,
                        center: true,
                        loop: true,
                        margin: 10
                    },
                    450: {
                        items: 3.2,
                        loop: true
                    }
                }

        });
    }

    // Homepage Video Widget Mobile Owl Carousel
    if($(".owl-carousel.owl-theme.home-mobile-video-section").length > 0){
        $(".owl-carousel.owl-theme.home-mobile-video-section").owlCarousel({
            loop: true,
            center: false,
            nav: false,
            dots: false,
            autoplay: true,
            margin: 30,
            autoplayHoverPause: true,
            animateOut: 'slideOutDown',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0: {
                    items: 1.2,
                    loop: true
                }
            }
        });
    }

    // Show Page Stories Widget Mobile Owl Carousel
    if($(".owl-carousel.owl-theme.show-mobile-stories-section").length > 0){
        $(".owl-carousel.owl-theme.show-mobile-stories-section").owlCarousel({
            loop: true,
            center: false,
            nav: false,
            dots: false,
            autoplay: true,
            margin: 15,
            autoplayHoverPause: true,
            animateOut: 'slideOutDown',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0: {
                    items: 1.9,
                    loop: true
                }
            }
        });
    }

    // Watch Video Page Widget Mobile Owl Carousel
    if($(".owl-carousel.owl-theme.watch-mobile-video-section").length > 0){
        $(".owl-carousel.owl-theme.watch-mobile-video-section").owlCarousel({
            loop: true,
            center: false,
            nav: false,
            dots: false,
            autoplay: true,
            margin: 15,
            autoplayHoverPause: true,
            animateOut: 'slideOutDown',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0: {
                    items: 1.9,
                    loop: true
                }
            }
        });
    }

    // Mayberry Schedule Carousel
    if($(".owl-carousel.owl-theme.owl-carousel-mayberry-schedule").length > 0){
        $(".owl-carousel.owl-theme.owl-carousel-mayberry-schedule").owlCarousel({
            loop: true,
            center: false,
            items: 7,
            nav: true,
            dots: true,
            dotsEach: true,
            autoplay: false,
            margin: 25,
            autoplayHoverPause: true,
            animateOut: 'slideOutDown',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items: 1.5
                },
                550: {
                    items: 2.6
                }
            }
        });

    }
    
    //Homepage Notable Episode Carousel
    // Mayberry Schedule Carousel
    if($(".owl-carousel.owl-theme.owl-carousel-featured-episodes").length > 0){
        $(".owl-carousel.owl-theme.owl-carousel-featured-episodes").owlCarousel({
            loop: true,
            center: false,
            items: 7,
            nav: true,
            dots: true,
            dotsEach: true,
            autoplay: false,
            margin: 25,
            autoplayHoverPause: true,
            animateOut: 'slideOutDown',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items: 1.5
                },
                550: {
                    items: 3.2
                }
            }
        });

    }

    // Header Visitors Block
    if($(".owl-carousel.owl-theme.owl-carousel-visitor-block").length > 0){
        $(".owl-carousel.owl-theme.owl-carousel-visitor-block").owlCarousel({
            loop: true,
            items: 4,
            nav: false,
            dotsEach: true,
            autoplay: false,
            margin: 25,
            autoplayHoverPause: true,
            animateOut: 'slideOutLeft',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items: 1.2
                }
            }
        });
    }
    if($('.owl-carousel.metv-mall-header').length > 0){
        $('.owl-carousel.metv-mall-header').owlCarousel({
            loop: true,
            items: 4,
            nav: true,
            dots: false,
            margin: 10,
            autoplay:true,
            autoplayTimeout:7000,
            autoplayHoverPause: true,
            animateOut: 'slideOutLeft',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items:2,
                    slideBy: 2
                },

                600:{
                    items:4,
                    slideBy: 4
                },

                900:{
                    items:5,
                    slideBy: 5
                },

                1200:{
                    items:6,
                    slideBy: 6
                }
            }
        });
    }
    if($('.owl-carousel.metv-mall-sidebar').length > 0){
        $('.owl-carousel.metv-mall-sidebar').owlCarousel({
            loop: true,
            items: 1,
            nav: true,
            dots: false,
            autoplay: true,
            autoplayHoverPause: true,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            onTranslated: handleSlideChange,
            responsive:{
                0:{
                    items:1
                }
            }
        });
    }

    if($(".owl-carousel.featured-mall-products").length > 0){
         var owlFeatured = $('.owl-carousel.featured-mall-products').owlCarousel({
            loop: true,
            items: 4,
            nav: true,
            dots: false,
            margin: 30,
            autoHeight: true,
            animateOut: 'slideOutLeft',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items: 2,
                    slideBy: 2,
                    margin: 0
                },

                600:{
                    items: 4,
                    slideBy: 4
                }
            }
        });
    }

    // check if the element is in view
    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        
        if($(elem).length <= 0){
            //doesnt exist don't do anything
            return false;
        }
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    var animate = false;

    // activate autoplay when reaching the carousel element on the page
    $(window).scroll(function() {
        // Check if the element is visible
        if(isScrolledIntoView(".featured-mall-products") && !animate) {
            owlFeatured.trigger('play.owl.autoplay', [10000]);
            animate = true;
        } else if(!isScrolledIntoView(".featured-mall-products") && animate) {
            owlFeatured.trigger('stop.owl.autoplay', [10000]);
            animate = false;
        }
    });

    // Function to update microsite and collectors-header-nav classes and styles based on window width
    function updateNavStyles() {
      const nav = document.querySelector('.collectors-header-nav ul');
      const isWideScreen = window.innerWidth > 900;

      // Remove 'nav-small-metv-collectors' and 'nav-open' classes
      if (nav && nav.classList) {
        nav.classList.remove('nav-small-metv-collectors', 'nav-open');
      }

      // Set display style based on screen width
      if (nav) {
        nav.style.display = isWideScreen ? 'flex' : 'none';
      }
      
    }

    // Call the function on resize
    window.addEventListener('resize', updateNavStyles);

    // Run the function initially
    updateNavStyles();

    $('#tab1').click(function() {
        owlFeatured.trigger('to.owl.carousel', [0, 400]);
    });

    const observer = new IntersectionObserver(intersections => {
      intersections.forEach(({
        target,
        isIntersecting
      }) => {
        target.classList.toggle('shimmer', isIntersecting);
      });
    }, {
      threshold: 0
    });

    document.querySelectorAll('.featured-mall-products .owl-item .item').forEach(div => {
      observer.observe(div);
    });

    if($(".owl-carousel.popular-mall-products").length > 0){
        var owlPopular = $('.owl-carousel.popular-mall-products').owlCarousel({
            loop: true,
            items: 4,
            nav: true,
            dots: false,
            margin: 30,
            autoplay: true,
            autoplayTimeout: 12000,
            autoHeight: true,
            animateOut: 'slideOutLeft',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                0:{
                    items:2,
                    slideBy: 2,
                    margin: 0
                },

                600:{
                    items: 4,
                    slideBy: 4
                }
            }
        });
    }

    $('#tab2').click(function() {
        owlPopular.trigger('to.owl.carousel', [0, 400]);
    });

    if($(".owl-carousel.newest-mall-products").length > 0){
        var owlNewest = $('.owl-carousel.newest-mall-products').owlCarousel({
            loop: true,
            items: 4,
            nav: true,
            dots: false,
            margin: 30,
            autoplay: true,
            autoplayTimeout: 12000,
            autoHeight: true,
            animateOut: 'slideOutLeft',
            animateIn: 'flipInX',
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            responsive:{
                 0:{
                    items: 2,
                    slideBy: 2,
                    margin: 0
                },

                600:{
                    items: 4,
                    slideBy: 4
                }
            }
        });
    }

    $('#tab3').click(function() {
        owlNewest.trigger('to.owl.carousel', [0, 400]);
    });

    // Very Merry Arcade
    if($('.owl-carousel.very-merry-arcade').length > 0){
        $('.owl-carousel.very-merry-arcade').owlCarousel({
        loop:true,
        margin:15,
        nav:true,
        responsive:{
            0:{
                items:1.5
            },
            600:{
                items:2.5
            },
            1000:{
                items:3
            }
        }

        });
    }

    // Function to handle slide change
    function handleSlideChange(event) {
    // Get the active slide index
        var activeSlideIndex = event.item.index;

        // Perform your animation based on the active slide index
        // For example, you can use CSS classes to apply animations
        $(".dropdown-btn").removeClass("contentBoxPrimary");
        $(".dropdown-btn").eq(activeSlideIndex).addClass("contentBoxPrimary");
        $(".dropdown-btn").removeClass("arrowRotate");
        $(".dropdown-btn").eq(activeSlideIndex).addClass("arrowRotate");
        $(".dropdown-menu").removeClass("dropdownExpand");
        $(".dropdown-menu").eq(activeSlideIndex).addClass("dropdownExpand");
    }

    var setFavorite = function(showId, callback){

        $.ajax({
            url:'/ajax_comments/add_user_favorite/?' + new Date().getTime(),
            data:{
                show_id: showId,
                access_token: WEBVIEW.access_token
            },
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data['success'] = 'true'){
                    callback();
                }else{
                   if(WEBVIEW.is_webview){
                       WCS.showModal(data['msg'], "OK", function(){});
                   }else{
                       WEBVIEW.error(data['msg']);
                   }
                }
            }, error : function(data){
                alert("There was an error with your request");
            }
        });
    };

    var removeFavorite = function(showId, callback){

        $.ajax({
            url:'/ajax_comments/remove_favorite/?' + new Date().getTime(),
            data:{
                show_id: showId,
                access_token: WEBVIEW.access_token
            },
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data['success'] = 'true'){
                    callback();
                }else{
                   if(WEBVIEW.is_webview){
                       WCS.showModal(data['msg'], "OK", function(){});
                   }else{
                       WEBVIEW.error(data['msg']);
                   }
                }
            }, error : function(data){
                alert("There was an error with your request");
            }
        });
    };
    
    
    var setUserTag = function(tagLink, callback){

        $.ajax({
            url:'/ajax_comments/add_user_tag/?' + new Date().getTime(),
            data:{
                taglink: tagLink,
                access_token: WEBVIEW.access_token
            },
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data['success'] = 'true'){
                    callback();
                }else{
                   if(WEBVIEW.is_webview){
                       WCS.showModal(data['msg'], "OK", function(){});
                   }else{
                       WEBVIEW.error(data['msg']);
                   }
                }
            }, error : function(data){
                alert("There was an error with your request");
            }
        });
    };    
    
    var removeUserTag = function(tagLink, callback){

        $.ajax({
            url:'/ajax_comments/remove_user_tag/?' + new Date().getTime(),
            data:{
                taglink: tagLink,
                access_token: WEBVIEW.access_token
            },
            dataType:'json',
            type:'POST',
            success:function(data){
                if(data['success'] = 'true'){
                    callback();
                }else{
                   if(WEBVIEW.is_webview){
                       WCS.showModal(data['msg'], "OK", function(){});
                   }else{
                       WEBVIEW.error(data['msg']);
                   }
                }
            }, error : function(data){
                alert("There was an error with your request");
            }
        });
    }; 

    //Add to favorites
    //only for website version... webview handles it differently
    $('.add-favorites').on('click', function(e){
        
        var me = this;
        //console.log("here1");
        console.log(me);
        if (me.hasAttribute("data-show_id")) {
        //console.log("hereshiow");
            
            var showId = $(this).data('show_id');

            if($(this).text().trim() == 'In Favorites'){

                var modalFunction;
                if(WEBVIEW.is_webview){
                    //dont use modal in webviews... it goes to top of page
                    //modalFunction = WEBVIEW.showModal;
                    removeFavorite(showId, function(){
                       $(me).html('<i class="far fa-star"></i></i>&nbsp;Add to Favorites');
                    });  
                    return;
                }else{
                    modalFunction = WCS.showModal;
                }
                modalFunction("Are you sure you want to remove this show from favorites?", "Remove Show", function(doit){
                    if(doit){
                        removeFavorite(showId, function(){
                           $(me).html('<i class="far fa-star"></i></i>&nbsp;Add to Favorites');
                        });
                    }
                });
            }else{                
                var invalidPrompt = false;
                if(WEBVIEW.is_webview){
                    invalidPrompt = WEBVIEW.is_invalid_user("add-user-tag", 'to add a favorite show');
                }else{
                    invalidPrompt = WCS.is_invalid_user('to add a favorite show', "We love that show too!", "Log in now or create an account to personalize MeTV with this show, and be first to see new stories and quizzes about it.");
                }
                if(!invalidPrompt){
                    setFavorite(showId, function(){
                       $(me).html('<i class="fas fa-check"></i>&nbsp;In Favorites');
                    });
                }            
            }            
        }else if(me.hasAttribute('data-taglink')){
        //console.log("here-----tag");
            
            var tagLink = $(this).data('taglink');
            var subscribed = false;
            var subscribedText = $(this).data('subscribed');
            var followButtonText = $(this).data('followbuttontext');
            if(subscribedText == 'yes'){
                subscribed = true;
            }
            if(subscribed){
                let followIcon = 'fa-star';
                if(tagLink.indexOf('blurquiz-') >= 0){
                    followIcon = 'fa-bell';
                }
                
                var modalFunction;
                if(WEBVIEW.is_webview){
                    //dont use modal in webviews... it goes to top of page
                    //modalFunction = WEBVIEW.showModal;
                    removeUserTag(tagLink, function(){
                       $(me).html('<i class="far ' + followIcon + '"></i></i>&nbsp;' + followButtonText);
                       $(me).data('subscribed', 'no');
                    });   
                    return;
                }else{
                    modalFunction = WCS.showModal;
                }                
                modalFunction("Are you sure you want to stop following this topic?", "Unfollow Topic", function(doit){
                    if(doit){
                        removeUserTag(tagLink, function(){
                           $(me).html('<i class="far ' + followIcon + '"></i></i>&nbsp;' + followButtonText);
                           $(me).data('subscribed', 'no');
                        });
                    }
                });            
            }else{
                var invalidPrompt = false;
                if(WEBVIEW.is_webview){
                    invalidPrompt = WEBVIEW.is_invalid_user("add-user-tag", 'to follow a topic');
                }else{
                    invalidPrompt = WCS.is_invalid_user('to follow a topic', "We love that topic too!", "Log in now or create an account to personalize MeTV and follow this topic, and be first to see new stories and quizzes about it.");
                }
                if(!invalidPrompt){
                    setUserTag(tagLink, function(){
                       $(me).html('<i class="fas fa-check"></i>&nbsp;Following');
                       $(me).data('subscribed', 'yes');
                    });
                }            
            }            
        }



    });

    //This is named strange - it's for show favorites on the homepage next episode blocks... those buttons are different than show buttons elsewhere
    $('.add-tag-favorites').on('click', function(e){
        var me = this;
        var showId = $(this).data('show_id');
        if($(this).hasClass('activetag')){
            var modalFunction;
            if(WEBVIEW.is_webview){
                modalFunction = WEBVIEW.showModal;
            }else{
                modalFunction = WCS.showModal;
            }
            modalFunction("Are you sure you want to remove this show from favorites?", "Remove Show", function(doit){
                if(doit){
                    removeFavorite(showId, function(){
                       $(me).removeClass('activetag')
                    });
                }
            });
        }
        var invalidPrompt = false;
        if(WEBVIEW.is_webview){
            invalidPrompt = WEBVIEW.is_invalid_user("add-user-tag", "to add a favorite show");
        }else{
            invalidPrompt = WCS.is_invalid_user('to add a favorite show', "We love that show too!", "Log in now or create an account to personalize MeTV with this show, and be first to see new stories and quizzes about it.");
        }

        if(!invalidPrompt){
            setFavorite(showId, function(){
                 $(me).addClass('activetag');
            });
        }
    });

    // click to enlarge photo to fill window
    $('img.enlarged').click(function(){
        var src = $(this).attr('src');
        var modal;
        function removeModal(){ modal.remove(); $('body').off('keyup.modal-close'); }
        modal = $('<div class="close-container">').css({
            background: 'RGBA(0,0,0,.5) url('+src+') no-repeat center',
            backgroundSize: 'contain',
            width:'100%', 
            height:'100%',
            position:'fixed',
            zIndex:'10000',
            top:'0', 
            left:'0',
        }).click(function(){
            removeModal();
            $('img.enlarged').removeClass('close-container');
        }).appendTo('body');
        //handling ESC
        $('body').on('keyup.modal-close', function(e){
          if(e.key==='Escape'){ removeModal(); } 
        });
    });


});


// Story comments anchor tags
document.addEventListener("DOMContentLoaded", function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
});


function refreshAppAdSizes(){
    var startTopWidth = $('#metvapp_top iframe').first().width();
    var startTop2Width = $('#metvapp_top2 iframe').first().width();
    var startMiddleWidth = $('#metvapp_middle iframe').first().width();
    var startBottomWidth = $('#metvapp_bottom iframe').first().width();    

    if(startTopWidth > 0 && startTopWidth != $('#metvapp_top').css('width')){
       // console.log("changed top width " + startTopWidth);
        $('#metvapp_top').width(startTopWidth);
        var $parent = $('#metvapp_top').parent();
        if($parent.hasClass('header-ad')){
            $('.header-ad').css('width', startTopWidth + "px");
        }
        
        if($('#metvapp_top').css('position') == 'fixed'){
            //calculate left
            var width = window.innerWidth || document.documentElement.clientWidth;
            var leftPos = parseInt((width - startTopWidth) / 2);
            //console.log("left is " + leftPos);
            $('#metvapp_top').css('left', leftPos + "px");                
        }
    }    
    
    if(startTop2Width > 0 && startTop2Width != $('#metvapp_top2').css('width')){
       // console.log("changed top width " + startTopWidth);
        $('#metvapp_top2').width(startTop2Width);
        var $parent = $('#metvapp_top2').parent();
        if($parent.hasClass('header-ad')){
            $('.header-ad').css('width', startTop2Width + "px");
        }
        
        if($('#metvapp_top2').css('position') == 'fixed'){
            //calculate left
            var width = window.innerWidth || document.documentElement.clientWidth;
            var leftPos = parseInt((width - startTop2Width) / 2);
            //console.log("left is " + leftPos);
            $('#metvapp_top2').css('left', leftPos + "px");                
        }
    }      
    
    if(startMiddleWidth > 0 && startMiddleWidth != $('#metvapp_middle').css('width')){
       // console.log("changed top width " + startTopWidth);
        $('#metvapp_middle').width(startMiddleWidth);
        var $parent = $('#metvapp_middle').parent();
        if($parent.hasClass('header-ad')){
            $('.header-ad').css('width', startMiddleWidth + "px");
        }
        
        if($('#metvapp_middle').css('position') == 'fixed'){
            //calculate left
            var width = window.innerWidth || document.documentElement.clientWidth;
            var leftPos = parseInt((width - startMiddleWidth) / 2);
            //console.log("left is " + leftPos);
            $('#metvapp_middle').css('left', leftPos + "px");                
        }
    }    
    
    if(startBottomWidth > 0 && startBottomWidth != $('#metvapp_bottom').css('width')){
       // console.log("changed top width " + startTopWidth);
        $('#metvapp_bottom').width(startBottomWidth);
        var $parent = $('#metvapp_bottom').parent();
        if($parent.hasClass('header-ad')){
            $('.header-ad').css('width', startBottomWidth + "px");
        }
        
        if($('#metvapp_bottom').css('position') == 'fixed'){
            //calculate left
            var width = window.innerWidth || document.documentElement.clientWidth;
            var leftPos = parseInt((width - startBottomWidth) / 2);
            //console.log("left is " + leftPos);
            $('#metvapp_bottom').css('left', leftPos + "px");                
        }
    }        
    
    
       
}