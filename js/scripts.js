var WADS = WADS || {};

$(document).ready(function(){

	changeBackground();

    WADS.sendbeacon = function(action, nonInteraction, value, eventLabel) {
        var eventCategory = 'click';
        if (window.gtag) {
            gtag('event', action, {
                'event_category': eventCategory,
                'event_label': eventLabel,
                'value': value,
                'non_interaction': nonInteraction
            });
        }
    };

	// Scrolling anchor links
	$('.scroll_to').click(function(e) {
		e.preventDefault();
		window.location.hash = '#' + $(this).data('target');
	});

	/*$(window).hashchange(function(e) {
		e.preventDefault();
		var new_hash = window.location.hash.replace('#!', '');
		var aTag = $("a[name='" + new_hash + "']");

		if (new_hash && aTag.length) {
			$('body,html,document').animate({
				scrollTop: aTag.offset().top - $('.header-inner-wrap').outerHeight()
			}, 'slow', function() {

			});
		}
	});
	$(window).hashchange();*/

	// banner slider
	if ($('.banner-slider ul img').length > 1) {
		var bannerSlideNum = $('.banner-slide-num');
		var bannerSlideRelated = $('.banner-slide-related-wrap');

		var bannerSlider = $('.banner-slider ul').bxSlider({
			adaptiveHeight: true,
			auto: true,
			autoHover: true,
			//controls: false,
			nextText: '<span class="banner-next-slide"><i class="fa fa-angle-right" aria-hidden="true"></i></span>',
			//hideControlOnEnd: true,
			//infiniteLoop: false,
			pager: false,
			pause: 8000,
			prevText: '<span class="banner-prev-slide"><i class="fa fa-angle-left" aria-hidden="true"></i></span>',
			onSliderLoad: function(currentIndex){
				bannerSlideNum.text(currentIndex+1);
				$('.billboard-slide-hidden').css('visibility', 'visible');
			},
			onSlideBefore: function ($slideElement, oldIndex, newIndex){
				bannerSlideNum.text(newIndex + 1);
				bannerSlideRelated.addClass('banner-slide-related-hidden');
				var num = newIndex + 1;
				$('#sliderelated-' + num).removeClass('banner-slide-related-hidden');
			}
		});

		$('.banner-slide-count').append('/'+(bannerSlider.getSlideCount()));
	}

	// Collector's Call banner slider
	if ($('.collectors-banner-slider ul img').length > 1) {
		var collectorsSlideNum = $('.collectors-banner-slide-num');

		var collectorsSlider = $('.collectors-banner-slider ul').bxSlider({
			adaptiveHeight: true,
			auto: false,
			autoHover: true,
			//controls: false,
			nextText: '<span class="collectors-banner-next-slide"><i class="fa fa-angle-right" aria-hidden="true"></i></span>',
			//hideControlOnEnd: true,
			//infiniteLoop: false,
			pager: false,
			pause: 8000,
			prevText: '<span class="collectors-banner-prev-slide"><i class="fa fa-angle-left" aria-hidden="true"></i></span>',
			onSliderLoad: function(currentIndex){
				collectorsSlideNum.text(currentIndex+1);
				$('.billboard-slide-hidden').css('visibility', 'visible');
			},
			onSlideBefore: function ($slideElement, oldIndex, newIndex){
				collectorsSlideNum.text(newIndex + 1);
			}
		});
        if($('.collectors-banner-slide-count').length > 0){
    		$('.collectors-banner-slide-count').append('/'+(collectorsSlider.getSlideCount()));
        }
    }

	// Disqus
	var disqus_shortname = 'metvnetwork';

        //only embed disqus if div container exists
        if($('#disqus_thread').length > 0){
            (function(){
                    var dsq = document.createElement('script');
                    dsq.type = 'text/javascript';
                    dsq.async = true;
                    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();
        }

	// Smooth anchor link scrolling
	/*$(function(){
		$('a[href*=#]:not([href=#])').click(function(){
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname){
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length){
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
				}
			}
		});
	});*/

	// Hide / show default input value on focus
	$('input:text').each(function(){
		if(!$(this).hasClass('schedPicker') && !$(this).hasClass('episode-vote-input')){
			var txtval = $(this).val();
			$(this).focus(function(){
				if($(this).val() == txtval){
					$(this).val('')
				}
			});
			$(this).blur(function(){
				if($(this).val() == ""){
					$(this).val(txtval);
				}
			});
		}
	});

	// Open/Close Collectors Call MeTV header
	var headerNavMeTVCollectors = $(".collectors-metv-header-nav ul");

	// Make header sticky
	var collectorsSearchBar = $('.microsite-search-bar');
	var searchBar = $('.search-bar');
	var headerNav = $(".header-nav");
	var navMenu = $('.header-nav ul');
	var CollectorsNav = $('.collectors-header-nav');
	var CollectorsMenu = $('.collectors-header-nav ul');
	var socialShare = $('.content-social-scroll');

	function navSmall(){
		if($(window).width() <= 900){
		/*if($(window).width() <= 1000){*/
			navMenu.addClass('nav-small nav-closed');
			CollectorsMenu.addClass('nav-small-collectors nav-closed');
			searchBar.addClass('search-small');
		}else{
			navMenu.removeClass('nav-small');
			CollectorsMenu.removeClass('nav-small-collectors nav-closed');
			searchBar.removeClass('search-small');
		}
	}

	// set on load if nav is narrow version
	navSmall();

 	// Make content social buttons sticky

       if($(window).width() > 700 && $('.content-social-scroll').length > 0){
          var headerHeight = $('.header-nav').outerHeight()+20;
          $(".content-social-scroll").stick_in_parent({
                  parent: '.content-inner',
                  offset_top: headerHeight,
                  topSpacing: 40
           });
      }

      $(window).on('resize', function(){

       if($(".content-social").length > 0){
            if($(window).width() > 700){
               var headerHeight = $('.header-nav').outerHeight()+20;
                    $(".content-social-scroll").stick_in_parent({
                        parent: '.content-inner',
                         offset_top: headerHeight
                    });
            }else{
          }
      	}
     })

	// set on window resize if nav is narrow version
	$(window).resize(function(){
		navSmall();
	});

	headerNav.sticky({topSpacing:0});

	CollectorsNav.sticky({topSpacing:0});

	CollectorsNav.on('sticky-start', function(){
		CollectorsMenu.removeClass('nav-open').addClass('nav-stuck nav-closed');
	});

	CollectorsNav.on('sticky-end', function(){
		CollectorsMenu.removeClass('nav-stuck nav-open').addClass('nav-closed');
	});

	// Hide/show search bar
	$('.header-nav-search').click(function(){
		var me = $(this);
		var searchBarInput = $('.search-bar input[type="text"]');
		if(searchBar.hasClass('closed')){
			me.addClass('selected');
			searchBar.removeClass('closed').addClass('open');
			searchBarInput.focus();
			if(navMenu.hasClass('nav-open')){
				navMenu.removeClass('nav-open').addClass('nav-closed');
				$('.header-nav-menu-tab').removeClass('selected');
			}
		}else{
			me.removeClass('selected');
			searchBar.removeClass('open').addClass('closed');
		}
	});

	// Hide/show Collector's Call search bar
	$('.collectors-header-nav-search').click(function(){
		var me = $(this);
		var searchBarInput = $('.microsite-search-bar input[type="text"]');
		if(collectorsSearchBar.hasClass('closed')){
			me.addClass('selected');
			collectorsSearchBar.removeClass('closed').addClass('open');
			collectorsSearchBar.focus();
			if(navMenu.hasClass('nav-open')){
				navMenu.removeClass('nav-open').addClass('nav-closed');
				$('.header-nav-menu-tab').removeClass('selected');
			}
		}else{
			me.removeClass('selected');
			collectorsSearchBar.removeClass('open').addClass('closed');
		}
	});

	// Hide/show main nav
	$('.header-nav-menu-tab').click(function(){
		var me = $(this);
		console.log(navMenu);
		if(navMenu.hasClass('nav-closed')){
			me.addClass('selected');
			navMenu.removeClass('nav-closed').addClass('nav-open');
			 $(this).find('i.fa').removeClass('fa-bars').addClass('fa-times');
			if(!searchBar.hasClass('closed')){
				searchBar.removeClass('open').addClass('closed');
				$('.header-nav-search').removeClass('selected');
			}
		}else{
			me.removeClass('selected');
			navMenu.removeClass('nav-open').addClass('nav-closed');
			 $(this).find('i.fa').removeClass('fa-times').addClass('fa-bars');
		}
	});

	// Hide/show Collectors Call nav
	$('.collectors-header-nav-menu-tab').click(function(){
		var me = $(this);
		if(navMenu.hasClass('nav-closed')){
			me.addClass('selected');
			navMenu.removeClass('nav-closed').addClass('nav-open');
			if(!searchBar.hasClass('closed')){
				searchBar.removeClass('open').addClass('closed');
				$('.header-nav-search').removeClass('selected');
			}
		}else{
			me.removeClass('selected');
			navMenu.removeClass('nav-open').addClass('nav-closed');
		}
	});

	// Open/Close Collectors Call MeTV Header
	var open = false;
	$('.collectors-metv-header-menu-tab').click(function(){
		var me = $(this);
		if(open == false){
			me.addClass('selected');
			headerNavMeTVCollectors.removeClass('nav-closed').addClass('nav-open').addClass('nav-small-metv-collectors');
			headerNavMeTVCollectors.css({'display' : 'block'});
			open = true;
		}else{
			me.removeClass('selected');
			headerNavMeTVCollectors.removeClass('nav-open').addClass('nav-closed');
			headerNavMeTVCollectors.css({'display' : 'none'});
			open = false;
		}
	});

	// Open/Close Collectors Call Header
	var open = false;
	$('.collectors-header-nav-menu-tab').click(function(){
		var me = $(this);
		if(open == false){
			me.addClass('selected');
			CollectorsMenu.removeClass('nav-closed').addClass('nav-open').addClass('nav-small-metv-collectors');
			CollectorsMenu.css({'display' : 'block'});
			open = true;
		}else{
			me.removeClass('selected');
			CollectorsMenu.removeClass('nav-open').addClass('nav-closed');
			CollectorsMenu.css({'display' : 'none'});
			open = false;
		}
	});

	// Input filter
	var filter, filtered;
	function inputFilter(filter,filtered,filteredTitle){
		$(filter).on('keyup', function(e) {
			var text;
			var search = $(this).val().toLowerCase();
			//var count = 1;
			$(filtered).each(function(index, item) {
				var me = $(this);
				text = me.find(filteredTitle).html().toLowerCase();
				//me.removeClass('content-grid-no-spacer content-grid-right');
				if (text.indexOf(search) === -1) {
					me.addClass('hidden').fadeOut('fast');
				} else {
					//special case for #title# template on stories page
					if(text == '#title#'){
						return;
					}
					me.removeClass('hidden').fadeIn('fast');
					/*if($(window).width() > 600){
						if(count%3==0 && me.hasClass('content-grid-item')){
							me.addClass('content-grid-no-spacer');
						}
					}else{
						if(count%2==0 && me.hasClass('content-grid-item')){
							me.addClass('content-grid-right');
						}
					}
					count++;*/
				}

			});
		});
	}

	// Shows filter
	inputFilter('.shows-filter input','.content-grid-item','.content-grid-item-title');

	// Stories filter
	//inputFilter('.content-filter input','.category-list-item','.category-list-desc h2 a');

	// Sidebar "popular/lastest" tabs
	$('.side-tab-links a').on('click', function(e){
		var currentAttrValue = $(this).attr('href');

		// Show/Hide Tabs
		$('.side-tabs ' + currentAttrValue).show().siblings().hide();

		// Change/remove current tab to active
		$(this).parent('li').addClass('side-tab-link-active').siblings().removeClass('side-tab-link-active');

		e.preventDefault();
	});

	// Tabbed Section for MeTV Mall Ad Unit
    $(".tab").click(function () {
    	var tab_id = $(this).attr("data-tab");
    	$(".tab").removeClass("active");
		$("section").removeClass("active");
		$(this).addClass("active");
		$("#" + tab_id).addClass("active");
    });

	if ($('#metvmusic_floater').length > 0) {
			var FLOATER_DISPLAYED = false;
			var pageHeight = window.innerHeight || document.documentElement.clientHeight;
			var displayMusicFloater = function()
			{
				FLOATER_DISPLAYED = true;
				$('.metvmusic-floater').animate({
					bottom: "0px"
				}, 1500);
			}

			var hideMusicFloater = function(){
				$('.metvmusic-floater').animate({
					bottom: "-350px"
				}, 1500);
                                $.ajax({
                                    url: '/ajax/set_metvmusic_scroll_cookie/',
                                    data: {
                                        days: 7
                                    },
                                    type: 'POST',
                                    dataType: 'json',
                                    success: function(data)
                                    {
                                        console.log("MeTV music widget will be hidden");
                                    },
                                    error : function(response)
                                    {
                                        //alert('Error');
                                       console.log("not recorded");
                                       console.log(response);
                                    }
                                });
			};
			$(window).on('scroll', function(){

				if ($('.metvmusic-floater').length > 0) {
					var currTop = $(window).scrollTop();

					var targetHeight = $('.main-content').offset().top + ($('.main-content').height() / 3);

					if(currTop > targetHeight && !FLOATER_DISPLAYED){
						displayMusicFloater();
					}
				}
			});

			$('#metvmusic_widget_close').on('click', function(){
				hideMusicFloater();
			});
        }


	// Video season drop down
	$('.video-season-picker').click(function(){
		 $(this).toggleClass('open');
	});

	$('.video-season-picker span').click(function(){
		var seasonTabs = $('.video-season-picker ul');
		if(seasonTabs.hasClass('season-tabs-open')){
			seasonTabs.removeClass('season-tabs-open').slideUp('400');
		}else{
			seasonTabs.addClass('season-tabs-open').slideDown('400');
		}
	});

    $('.video-season-picker li, .show-airing ul li a').on('click', function(){
		var theSeason = $(this).data('season');

		$('.content-grid-seasons, .show-season-wrap').addClass('season-hidden');
		$('#seasonvideos_' + theSeason).removeClass('season-hidden');
		var seasonTabs = $('.video-season-picker ul');
		$('.video-season-picker span').html("Season " + theSeason + " <i class='fa fa-chevron-down' aria-hidden='true'></i>");
		seasonTabs.removeClass('season-tabs-open').slideUp('fast');
    });

    // show/hide episode synopsis (show pages)
    $('.show-airing-title').on('click', function(){
    	var me = $(this);

    	if(me.next('.show-airing-synopsis').hasClass('show-airing-synopsis-hidden')) {
    		$('.show-airing-synopsis').addClass('show-airing-synopsis-hidden');
    		me.next('.show-airing-synopsis').removeClass('show-airing-synopsis-hidden');
    	} else {
    		me.next('.show-airing-synopsis').addClass('show-airing-synopsis-hidden');
    	}
    })

	// Collector's Call header image rotation
	var changeImage = function(id, image){
		$(id).css('background-image', "url(/images/collectorscall/" + image + ")");
	}

	function changeBackground() {
		$("#wrapper-bottom").animate({opacity: 1}, 1000, function(){
			changeImage('#header-image-wrapper', images[i], 1);
			if (++i >= images.length) { i = 0; }
			$("#wrapper-bottom").css("opacity", 0);
			changeImage('#wrapper-bottom', images[i]);
		});
	}

	var images = ["CollectorsCall_header1.jpg", "CollectorsCall_header2.jpg", "CollectorsCall_header3.jpg", "CollectorsCall_header5.jpg", "CollectorsCall_header4.jpg"];
	var i = 0;

	$("#wrapper-bottom").css("opacity", 0);
	changeImage("#wrapper-bottom", images[i]);
	changeBackground();

	setInterval(changeBackground, 3000);

	// Email Reminder checkbox

        var signupProcessing = false;
	$("#email-reminder").click(function(e) {
        if(WCS.USER_ID <= 0){
            if(!WEBVIEW.only_content){
                WCS.loadSidebarTemplate('login');
                WCS.setupProfileForm('login');                     
            }else{
                WEBVIEW.is_invalid_user("memadness-vote", "to sign up for reminders");
            }         
            e.preventDefault();
            return false;
        }
            if(signupProcessing){
                e.preventDefault();
                return false;
            }
            signupProcessing = true;
            var isSubscribed = 0;
            if (this.checked) {
                isSubscribed = 1;
            }
            $("#email-reminder-success").html("<i class='fas fa-spinner fa-spin'></i>");
            $("#email-reminder-success").css("visibility", "visible");
            $.ajax({
                url: WEBVIEW.full_url + 'me_madness/email_reminders/',
                data: {
                    is_subscribed: isSubscribed,
                    access_token: WEBVIEW.access_token
                },
                type: 'POST',
                dataType: 'json',
                success: function(data)
                {
                    if (isSubscribed) {
                        isSubscribed = 1;
                        $("#email-reminder-success").html("You are now signed up for email reminders!");
                    }
                    else {
                        $("#email-reminder-success").html("You are now unsubscribed from reminders.");
                    }
                    signupProcessing = false;

                },
                error : function(response)
                {
                    //alert('Error');
                   console.log("not successful");
                   console.log(response);
                }
            });

	});

	// Triggers stats fade in on selection of vote

	$('.memadness-vote-item').on('click touchstart', function() {
        $(".voting-stats-col").addClass("active-stats");
	} );


	// Privacy Policy banner toggle


    $('.close-btn').on('click touchstart', function(e) { 
        $('.privacy-banner-wrapper').fadeOut("200");
        $.ajax({
            url: '/ajax/set_privacypolicy_message_cookie/',
            data: {
                days: ''
            },
            type: 'POST',
            dataType: 'json',
            success: function(data)
            {
                console.log("Cookies Accepted");
                window.location.reload();
            },
            error : function(response)
            {
                //alert('Error');
               console.log("not recorded");
               console.log(response);
            }
        });            
    });

    //sticky ads    
    var width = window.innerWidth || document.documentElement.clientWidth;
    
    // if(width > 900){
    //     //there is a sidebar and the sidebar you stick it by the anchor, but because it becomes absolute add float_spacer that has extra 800 pixels
    //     $("#metv_float").sticky({topSpacing:53});
    //     $(window).scroll(sticky_sidebar);
    //     sticky_sidebar();        
    //     $('#float_spacer').css('height', '800px');
    // }else{
    //     //728x90 need at least that space
    //     $('#float_spacer').css('height', '90px');
    //     //no sidebar, the add sticks to the bottom of the page on page load
    //     //$("#start_float").sticky({bottomSpacing:0});
    //     $(window).scroll(sticky_footer);
    //     sticky_footer();              
    // }
    
    // refreshAdSizes();
    
    $('#app_take_photo').on('click', function(){
         WEBVIEW.toony_cam();
    });

    // Allows the share native button in embedded sweepstakes to work
    window.addEventListener('message', function(event) {
        // For security, check event.origin if needed.
        // const allowedOrigins = [
        //     'http://dev.weigelbroadcasting.com.localhost',
        //     'https://dev.weigelbroadcasting.com',
        //     'https://www.weigelbroadcasting.com',
        //     'https://lwadmin.weigelbroadcasting.com'
        // ];
    
        // if (!allowedOrigins.includes(event.origin)) {
        //     alert("Origin not allowed: " + event.origin);
        //     return; // Ignore messages from untrusted sources.
        // }
    
        if (event.data && event.data.type === 'shareRequest') {
            const shareData = event.data.data;
            // Override the URL with the parent's URL.
            shareData.url = window.location.href;
    
            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => console.log('Share successful from parent'))
                    .catch(err => console.error('Share failed from parent:', err));
            } else {
                // Optionally, provide a fallback here.
            }
        }
    });
    
    //new sharing button
    $('body').on('click touch', '.share-btn', function(e){
        e.preventDefault();
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const shareData = {
          title: ogTitle,  
          text: '', 
          url: window.location.href 
        };
        
        if (navigator.share) {
          // Web Share API is supported: use native share dialog
          navigator.share(shareData)
            .then(() => {
                console.log('Share successful');
                WADS.sendbeacon("Share-Native-click", true, 1, 'shareClick');
            })   
            .catch(err => console.error('Share failed:', err));
        } else {
          // Web Share API not supported: fallback copy to clipboard
          const url = shareData.url;
          if (navigator.clipboard && window.isSecureContext) {
            // Use Clipboard API if available (modern browsers)
            navigator.clipboard.writeText(url)
              .then(() => {
                  alert('Link copied to clipboard!');
                })
              .catch(err => {
                console.error('Clipboard error:', err);
                alert('Copy failed. Please copy the link manually.');
              });
          } else {
            // Clipboard API not available: use older execCommand method
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';   // avoid scrolling to bottom
            textArea.style.left = '-9999px';     // move off-screen
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              alert('Native Sharing not available - popup that says Link Copied?');
            } catch (err) {
              //alert('Please copy this link: ' + url);
            }
            document.body.removeChild(textArea);
          }
        }
    });    
    
    $('body').on('click touch', '.quiz-share-btn', function(e){
        e.preventDefault();
        var ogTitle = QUIZ_TITLE;
        if(CURRENT_OUTCOME !== ""){
            ogTitle += " - " + SOCIAL_PREFIX + " " + CURRENT_OUTCOME + ".";
        }  
        
        const shareData = {
          title: ogTitle,  
          text: '', 
          url: SHARE_URL
        };
        
        console.log("share data: ");
        console.log(shareData);
        
        if (navigator.share) {
          // Web Share API is supported: use native share dialog
          navigator.share(shareData)
            .then(() => {
                console.log('Share successful');
                WADS.sendbeacon("Share-Native-click", true, 1, 'shareClick');
            })   
            .catch(err => console.error('Share failed:', err));
        } else {
          // Web Share API not supported: fallback copy to clipboard
          const url = shareData.url;
          if (navigator.clipboard && window.isSecureContext) {
            // Use Clipboard API if available (modern browsers)
            navigator.clipboard.writeText(url)
              .then(() => {
                  alert('Link copied to clipboard!');
                })
              .catch(err => {
                console.error('Clipboard error:', err);
                alert('Copy failed. Please copy the link manually.');
              });
          } else {
            // Clipboard API not available: use older execCommand method
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';   // avoid scrolling to bottom
            textArea.style.left = '-9999px';     // move off-screen
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              alert('Native Sharing not available - popup that says Link Copied?');
            } catch (err) {
              //alert('Please copy this link: ' + url);
            }
            document.body.removeChild(textArea);
          }
        }
    });        

}); /* end $(document).ready() */

// Display item on click
$(document).ready(function() {
  $(this).on("click", ".slide-down-display", function() {
    $(this).parent().find(".slide-down-hidden").toggle();
    $(this).parent().find(".fa-chevron-down").toggleClass('active');
  });
});

// function sticky_sidebar() {
//     refreshAdSizes();
//     var window_top = $(window).scrollTop();
//     var footer_top = 99999999999999999;
//     if($('#float_anchor').length <= 0){
//                 console.log("no floaterrr");

//         //console.log("exiting... ");
//         return;
//     }
//     var floatAnchorOffset = 50;
//     if(WADS.IS_STICKING){       
//         floatAnchorOffset = 50 + 90;
//     }
    
//     var anchorTop = parseInt($('#float_anchor').offset().top);
    
//     var div_top = parseInt($('#float_anchor').offset().top) - floatAnchorOffset;
//     var div_height = $('#metv_float').height();
//     //console.log("windowtop " + window_top + " divtop " + div_top);
//     //console.log("anchorTop " + anchorTop);
    
//     if (window_top > div_top && anchorTop > 100) {
//         $('#metv_float').addClass('stick');
//         $('#metv_float').css({top: floatAnchorOffset, position: 'fixed'});
//     } else {
//         $('#metv_float').css({position: 'static'});
//         $('#metv_float').removeClass('stick');
//     }
// }

function sticky_footer() {
    if(WADS.USE_NEXT_MILLENNIUM){
        return;
    }
    refreshAdSizes();
    
    var width = window.innerWidth || document.documentElement.clientWidth;
    var adWidth = 320;
    var adHeight = 50;
    if(width >= 730){
        adWidth = 728;
        adHeight = 90;        
    }
    else if(width > 470){
        adWidth = 468;
        adHeight = 60;        
    }
    
    if($('#float_anchor').length <= 0){
        console.log("no floaterrr");
        return;
    }

    //console.log("blah3");
    var scrollPos = parseInt($(window).scrollTop() + window.innerHeight - adHeight);
    var scrollTop = $(window).scrollTop();
    var startFloat = 100;
    if($('.header-nav').length > 0){
        var headTop = parseInt($('header').offset().top) - 10;        
        if(headTop > 100){
            startFloat = headTop;
        }
    }
    //console.log("viewport height " + window.innerHeight);
    //console.log("ad width " + adWidth);
    
    //console.log("orig pos " + $('#float_anchor').offset().top);
    //console.log("scroll pos " + scrollPos);
    
    var div_top = parseInt($('#float_anchor').offset().top);
    if(scrollPos > div_top){
        $('#metv_float').css('position', 'static');
        $('#metv_float').css('margin', '0 auto 7.894736842105263%'); 
        $('#metv_float').css('width', adWidth + "px"); 
    }        
    //console.log("scrollpos " + scrollPos + " vs " + div_top);
    //console.log("scrolltop: " + scrollTop + " vs " + startFloat);
    if(scrollPos < div_top && scrollTop > startFloat){
        $('#metv_float').css('position', 'fixed'); 

        $('#metv_float').css('bottom', '-55px');
        $('#metv_float').css('z-index', '9999'); 
        setTimeout(function(){
            $('#metv_float').addClass('float-transition');
            
        }, 500);
        
        if(!WADS.IS_STICKING){
            
        }else{
            //$('#metv_float').css('bottom', '120px');                        
        }
        
        var leftPos = parseInt((width - adWidth) / 2);
        $('#metv_float').css('left', leftPos + "px"); 
        $('#metv_float').css('margin', '0px'); 
        $('#float_spacer').css('height', adHeight + 'px');        
        
    }
}

function refreshAdSizes(){
    var startTopWidth = $('#metv_top iframe').first().width();
    var startTopHeight = $('#metv_top iframe').first().height();
    var startSideWidth = $('#metv_side iframe').first().width();
    var startMiddleWidth = $('#metv_middle iframe').first().width();

    
    //console.log("start middle iframe width " + startMiddleWidth);
    //console.log("css width " + $('#metv_middle').css('width'));
    //console.log("jquery width " + $('#metv_middle').width());
    if(startTopWidth > 0 && startTopWidth != $('#metv_top').css('width')){
       // console.log("changed top width " + startTopWidth);
        $('#metv_top').width(startTopWidth);
        if($('#metv_top').css('position') == 'fixed'){
            //calculate left
            var width = window.innerWidth || document.documentElement.clientWidth;
            var leftPos = parseInt((width - startTopWidth) / 2);
            //console.log("left is " + leftPos);
            $('#metv_top').css('left', leftPos + "px");                
        }
        if(WADS.IS_SVENGOOLIE){
            var $parent = $('#metv_top').parent();
            var parentWidth = parseInt($parent.width());
            var parentHeight = parseInt($parent.height());
            
            if($parent.children().length == 1 && parentWidth > 0 && parentWidth != startTopWidth){
                $parent.width(startTopWidth);
            }           
            if($parent.children().length == 1 && parentHeight > 0 && parentHeight != startTopHeight){
                $parent.height(startTopHeight);
            }                      
        }
		if(WADS.IS_COLLECTORS_CALL){
            var $parent = $('#metv_top').parent();
            var parentWidth = parseInt($parent.width());
            var parentHeight = parseInt($parent.height());
            
            if($parent.children().length == 1 && parentWidth > 0 && parentWidth != startTopWidth){
                $parent.width(startTopWidth);
            }           
            if($parent.children().length == 1 && parentHeight > 0 && parentHeight != startTopHeight){
                $parent.height(startTopHeight);
            }                      
        }
    }        
    
    if(startMiddleWidth > 0 && startMiddleWidth != $('#metv_middle').css('width')){
        //console.log("changed middle width " + startMiddleWidth);
        $('#metv_middle').width(startMiddleWidth);
        var $parent = $('#metv_middle').parent();
        var parentWidth = parseInt($parent.width());
        if($parent.children().length == 1 && parentWidth > 0 && parentWidth != startMiddleWidth){
            $parent.width(startMiddleWidth);
        }
    }

    if(startSideWidth > 0 && startSideWidth != $('#metv_side').css('width')){
        //console.log("changed side width " + startSideWidth);
        $('#metv_side').width(startSideWidth);       
    }    
    var $parent = $('#metv_side').parent();        
    var parentWidth = parseInt($parent.width());
    if($parent.children().length == 1 && parentWidth > 0 && parentWidth != startMiddleWidth){
        $parent.width(startMiddleWidth);
    }     
    
    if(!WADS.USE_NEXT_MILLENNIUM){
        var startFloatWidth = $('#metv_float iframe').first().width();
        if(startFloatWidth > 0 && startFloatWidth != $('#metv_float').css('width')){
            //console.log("changed float width " + startFloatWidth);
            $('#metv_float').width(startFloatWidth);
            if($('#metv_float').css('position') == 'fixed'){
                //calculate left
                var width = window.innerWidth || document.documentElement.clientWidth;
                var leftPos = parseInt((width - startFloatWidth) / 2);
                $('#metv_top').css('left', leftPos + "px !important");                
            }        
        }       
    }        
}
