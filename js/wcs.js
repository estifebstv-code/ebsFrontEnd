WCS.OPEN_SIDEBAR = function(){
    $('#wcs-overlay-sidebar').addClass('wcs-overlay-open');
    $('#wcs-slideout-wrapper').addClass('wcs-slideout-open');
    $('body').addClass('wcs-no-scroll');

    //dont set WCS.PROFILE_OPEN yet...
    //sometimes have to wait for events to be done or it will close immediated
};

WCS.CLOSE_SIDEBAR = function(){
    $('#wcs-overlay-sidebar').removeClass('wcs-overlay-open');
    $('#wcs-slideout-wrapper').removeClass('wcs-slideout-open');
    $('#wcs-overlay-sidebar').removeClass('wcs-overlay-open');

    $('body').removeClass('wcs-no-scroll');
    WCS.PROFILE_USER_ID = -1;
    WCS.PROFILE_OPEN = false;
};

(function(){
    /****** USERNAME - SHOW SIDEBAR ********/
    $('body').on("mousedown", function(e) {
        if(WCS.PROFILE_OPEN){
            if ($(e.target).closest('#wcs-slideout-wrapper').length === 0 &&
                $(e.target).closest('#wcs-overlay-modal').length === 0) {
                //alert("closing because " + $(e.target).closest('#wcs-slideout-wrapper').length);
                //console.log(e.target);
                WCS.CLOSE_SIDEBAR();
            }
        }
        if(WCS.POPUP_OPEN){
            if(e.target && $(e.target).closest('.wcs-post-comment-media-btns').length <= 0 &&
                    $(e.target).closest('.wcs-profile-header-user-avatar').length <= 0 &&
                    $(e.target).closest('.wcs-popout-wrapper').length <= 0){
                $('.wcs-popout').removeClass('wcs-popout-active');
                WCS.POPUP_OPEN = false;
            }else{

            }
        }
        if(WCS.MODAL_OPEN){
            //close the modal if click is on background... meaning on wcs-overlay-modal
            if(e.target && e.target.id == 'wcs-overlay-modal'){
                if(WCS.MODAL_CALLBACK !== null){
                    WCS.MODAL_CALLBACK(false, true);
                }
                $('#wcs-overlay-modal').removeClass('wcs-overlay-open');
                WCS.MODAL_OPEN = false;
            }
        }
    });
    $('body').on('click', '.wcs-user-trigger', function(e){
        //closes automatically if don't set this first
        e.preventDefault();
        var me = this;
        if($(this).data('userid') == 'deleted'){
            return false;
        }
        if(WEBVIEW.is_webview || WCS.ONLY_CONTENT){
            var userId = $(this).data('userid');
            if(WCS.USER_ID == userId){
                window.location.href = '/webview/?key=notfication-settings&access_token=' + WEBVIEW.access_token;
            }else{
                window.location.href = '/webview/?key=comments&user_id=' + userId;
            }
            return false;
        }


        var openSettings = false;
        var hideSettings = false;
        var userId = parseInt($(this).data('userid'));
        if(userId == WCS.PROFILE_USER_ID){
            //do nothing because the same user
            return false;
        }
        if(isNaN(userId)){
            //shouldn't happen
            //alert("User could not be found");
            return;
        }
        WCS.PROFILE_OPEN = false;
        WCS.loadSidebarTemplate('loading');



        if(!$('#wcs-overlay-sidebar').hasClass('wcs-overlay-open')){
            WCS.OPEN_SIDEBAR();
        }
        if($(me).hasClass('wcs-post-comment-user-settings')){
            openSettings = true;
        }else{
            if(parseInt(WCS.USER_ID) !== userId){
                hideSettings = true;
            }
        }
        var notifications_tab = false;
        if($(me).hasClass('wcs-post-comment-user-notifications')){
            notifications_tab = true;
        }else{
            if(parseInt(WCS.USER_ID) !== userId){
                hideSettings = true;
            }
        }
        var endpoint = 'get_user_public_profile';
        if(!hideSettings){
            endpoint = 'get_user_private_profile';
        }
        $.ajax({
            url: '/ajax_comments/' + endpoint,
            data: {
                 user_id: userId,
                 get_comments: 1,
                 is_svengoolie: WCS.IS_SVENGOOLIE
            },
            type: 'POST',
            dataType: 'json',
            success: function(resp)
            {

                WCS.PROFILE_USER_ID = userId;
                WCS.PROFILE_OPEN = true;
                //if not logged in hide settings tab
                if($(me).hasClass('wcs-post-comment-user-settings')){
                    if(WCS.termsAccepted == 1){
                        WCS.loadSidebarTemplate('profile_user');
                    }else{
                        WCS.force_action('accept_terms', true);
                        return;
                    }
                }else{
                    if(parseInt(WCS.USER_ID) !== userId){
                        WCS.loadSidebarTemplate('profile_other');
                    }else{
                        if(WCS.termsAccepted == 1){
                            WCS.loadSidebarTemplate('profile_user');
                        }else{
                            WCS.force_action('accept_terms', true);
                            return;
                                                    }
                    }
                }
                setTimeout(function(){
                console.log(resp);
                var user = resp['user'];
                var comments = resp['comments'];
                if(user['is_admin'] == 1){
                    $('.wcs-profile-header-fullname').text(user['short_name']);
                    $('.wcs-profile-header-fullname').addClass('wcs-verified-user');
                }else{
                    $('.wcs-profile-header-fullname').removeClass('wcs-verified-user');
                }
                //use profile_url because two people from different services could have same name, but not same profile url
                $('.wcs-profile-header-username').text("@" + user['display_name']);
                $('.wcs-profile-header-user-avatar .wcs-avatar').attr('src', user['profile_image']);
                $('.wcs-comment-count').text(user['comment_count']);
                $('.wcs-user-karma-number').text(user['karma']);

                //$('.wcs-profile-header-likes span').text(user['total_likes']);
                //$('.wcs-profile-nav a.wcs-comments-total span').text();
                $('.wcs-profile-comments-wrap .wcs-profile-comments-item').remove();
                WCS.appendProfileComments(comments, resp['has_more']);
                WCS.PROFILE_COMMENT_PAGE = 0;
                WCS.PROFILE_COMMENT_USER = userId;

                var settings_wrapper = document.getElementById('wcs_notifications_settings');
                //var notifications_settings = resp.notifications;

                if(resp['email_notifications'] == 1){
                    $("#enable_email_alerts").attr('checked', 'checked');
                }

                if(resp['app_notifications'] == 1){
                    $("#enable_app_alerts").attr('checked', 'checked');
                }

                if(resp['browser_notifications'] == 1){
                    $("#enable_browser_alerts").attr('checked', 'checked');
                }

                console.log("notification refresh comments");
                WCS.refreshNotifications(resp['email_notifications'], 
                    resp['app_notifications'], resp['browser_notifications'], 
                    resp['notification_settings']);   
                    
                WCS.refreshReminderList(resp['user_reminders']);
                
                $('.wcs-profile-nav-tab').removeClass('wcs-profile-nav-active');
                if(openSettings){
                    $('.wcs-profile-comments-wrap').hide();
                    $('.wcs-profile-notifications-wrap').hide();
                    $('.wcs-profile-settings-wrap').show();
                    $('.wcs-profile-nav-tab').eq(1).addClass('wcs-profile-nav-active');
                }else if(notifications_tab){
                            
                    $('.wcs-profile-comments-wrap').hide();
                    $('.wcs-profile-settings-wrap').hide();
                    $('.wcs-post-comment-user-notifications').show();
                    $('.wcs-profile-nav-tab').eq(2).addClass('wcs-profile-nav-active');
                }else{
                    $('.wcs-profile-comments-wrap').show();
                    $('.wcs-profile-settings-wrap').hide();
                    $('.wcs-profile-notifications-wrap').hide();
                    $('.wcs-profile-nav-tab').eq(0).addClass('wcs-profile-nav-active');
                }
                if(hideSettings){
                    $('.wcs-profile-nav-tab').eq( 1 ).hide();
                    $('.wcs-update-avatar-trigger').hide();
                }else{
                    $('.wcs-profile-header-logout').show();
                    $('.wcs-profile-header').addClass('wcs-profile-header-logged-in')
                    $('.wcs-profile-nav-tab').eq( 1 ).show();
                }
                var isSocial = false;
                if(user['service'] == 'google' || user['service'] == 'facebook' || user['service'] == 'twitter'){
                    isSocial = true;
                }
 WCS.setupProfileForm('settings', isSocial);
                if(!hideSettings){
                    //hide terms because registration is already done
                    $('.wcs-profile-settings-terms-container').hide();
                    $('input[name="is_update"]').val(1);
                    WCS.fillSettingsData(user);
                    //ugh, need to save this for the password update form
                    WCS.SETTINGS_DATA = user;
                }
                }, 50);
            },
            error: function(response)
            {
                console.log(response.responseText);
                console.log(response);
            }
        });

    });

    $('#wcs-main-wrapper').on('click', '.wcs-comment-flag', function(e){
        var me = this;
        if($(this).hasClass("wcs-comment-flag-active")){
            WCS.showModal("This comment is already flagged and will be reviewed by our staff.", "OK", function(){});
            return false;
        }
        e.preventDefault();
        WCS.showModal("Are you sure you want to flag this comment?", "Flag", function(doit){
            if(!doit){
                return false;
            }
            var $commentObj = $(me).closest('.wcs-comment-item');
            var commentId = $commentObj.data('id');

            $.ajax({
                url: '/ajax_comments/flag_comment',
                data: {
                     comment_id: commentId,
                     access_token: WEBVIEW.access_token,
                     is_svengoolie: WCS.IS_SVENGOOLIE
                },
                type: 'POST',
                dataType: 'json',
                success: function(resp)
                {
                    if(resp['success'] == 'true'){
                        $(me).addClass('wcs-comment-flag-active');
                    }else{
                        WCS.showModal(resp['msg'], "OK", function(){});
                    }
                },
                error: function(response)
                {
                    alert("Error");
                    console.log(response.responseText);
                    console.log(response);
                }
            });


        });


    });


    /** LIKE REPLY SHARE DELETE  **/
    $('#wcs-main-wrapper').on('click', '.wcs-like-trigger', function(e){
        e.preventDefault();
        var $commentObj = $(this).closest('.wcs-comment-item');
        var commentId = $commentObj.data('id');
        var replyInfo = $commentObj.data('replyinfo');
        var posterId = replyInfo.split('|')[0];
        var me = this;
        var isLike = 1;
        if($(this).text().trim().indexOf('Unlike') === 0){
            isLike = 0;
        }
        if(WCS.IS_LIKING){
            return;
        }
        WCS.IS_LIKING = true;

        $.ajax({
            url: '/ajax_comments/do_upvote',
            data: {
                 comment_id: commentId,
                 thread_id: WCS.THREAD_ID,
                 poster_id : posterId,
                 like_it : isLike,
                 access_token: WEBVIEW.access_token,
                 is_svengoolie: WCS.IS_SVENGOOLIE
            },
            type: 'POST',
            dataType: 'json',
            success: function(resp)
            {
                WCS.IS_LIKING = false;
                if(resp['success'] == 'false'){
                    if(resp['action']){
                        WCS.force_action(resp['action']);
                    }else{
                        WCS.showModal(resp['msg'], "OK", function(){});
                    }
                    return;
                }
                var totalText = "";
                if(resp['total'] > 0){
                    totalText = " (" + resp['total'] + ')';
                }
                if(isLike == 1){
                    $(me).html('<i class="fas fa-heart"></i>' + " Unlike" + totalText);
                    $(me).addClass('wcs-like-btn-active');
                }else{
                    $(me).html('<i class="fas fa-heart"></i>' + " Like" + totalText);
                    $(me).removeClass('wcs-like-btn-active');
                }
            },
            error: function(response)
            {

            }
        });
    });

     //assumes reply comments are expanded
    var getLevel = function(cid, level){

        if($('#comment_' + cid).hasClass('wcs-comment-item-parent')){
            return level;
        }
        var replyInfo = $('#comment_' + cid).data('replyinfo');
        console.log("replyinfo");
        console.log(replyInfo);
        if(!replyInfo){
            return level;
        }
        var parentId = replyInfo.split('|')[2];
        level++;
        getLevel(parentId, level);
    };

$('#wcs-main-wrapper').on('click', '.wcs-reply-trigger', function(e){
        //console.log(this);
        e.preventDefault();
        if(WCS.USER_ID < 0){
            WCS.showModal("Please login to reply to this comment", "OK", function(){});
            return false;
        }

        $('.wcs-reply-container').removeClass('wcs-reply-container-open');
        var $topComment = $(this).closest('.wcs-comment-item-parent');
        var $parentComment = $(this).closest('.wcs-comment-item');
        var replyInfo = $parentComment.data('replyinfo');
        var isAdmin = $parentComment.data('isadmin');
        var parentId =  $parentComment.data('id');
        var parentUserid = replyInfo.split('|')[0];
        var parentName = replyInfo.split('|')[1];
        var ancestorId = $topComment.data('id');
        var commentId = $parentComment.data('id');

        //var replyHtml = $('#template_reply_container').html();
        WCS.REPLY_ANCESTOR_ID = ancestorId;
        WCS.REPLY_PARENT_ID = commentId;
        WCS.REPLY_PARENT_NAME = parentName;
        WCS.REPLY_PARENT_ADMIN = isAdmin;
        //do we even need a level?  probably not unless we change the structure again
        WCS.REPLY_LEVEL = getLevel(commentId, 1);
        var $replyBox = $topComment.find('.wcs-reply-container');

        $replyBox.addClass('wcs-reply-container-open');

        // scroll to reply block
        var itemTop = $replyBox.offset().top;
        console.log('Scroll top: ', itemTop);
        $('html,body').stop().animate({
            scrollTop: itemTop-100
        }, 800, function(){
            $replyBox.children('textarea').focus();
        });

        //$replyBox.children('textarea').focus();

 $replyBox.find('.wcs-reply-username').text(parentName);
        $replyBox.find('.wcs-reply-username').attr('data-userid', parentUserid);
        if(isAdmin == 1){
            $replyBox.find('.wcs-reply-username').addClass('wcs-verified-user');
        }
        else{
            $replyBox.find('.wcs-reply-username').removeClass('wcs-verified-user');
        }
        //WCS.REPLY_BOX = $replyBox;

    });
    $('#wcs-main-wrapper').on('click', '.wcs-share-trigger', function(e){
        e.preventDefault();
        $(this).next().addClass('wcs-popout-active');
        var $commentObj = $(this).closest('.wcs-comment-item');
        var shareId = $commentObj.data('id');
       // WCS.POPUP_OPEN = true;
        var text = $commentObj.find('.wcs-comment-item-text').text().trim();
        var cutString = function(s, n){
            var cut= s.indexOf(' ', n);
            if(cut== -1) return s;
            return s.substring(0, cut)
        }
        text = cutString(text, 150)
        WCS.FACEBOOK_SHARE = 'https://www.facebook.com/sharer/sharer.php?u=' + WCS.THREAD_URL + "#comment_" + shareId;
        WCS.TWITTER_SHARE = 'https://twitter.com/home?status=' + text + "... " + WCS.THREAD_URL + "#comment_" + shareId;
        $(this).next().find('.wcs-popout-share-btn-facebook').attr('href', WCS.FACEBOOK_SHARE);
        $(this).next().find('.wcs-popout-share-btn-twitter').attr('href', WCS.TWITTER_SHARE);

        WCS.THREAD_TITLE = WCS.THREAD_TITLE.replaceAll('&#039;', "'");
        WCS.THREAD_TITLE = WCS.THREAD_TITLE.replaceAll('&quot;', "'");
        WCS.THREAD_TITLE = WCS.THREAD_TITLE.replaceAll('&amp;', "&");

        var mailData = "subject=" + encodeURIComponent("Svengoolie - " + WCS.THREAD_TITLE) + "&body=" + encodeURIComponent(text);
        var mailShare = "mailto:?" + mailData;
        $(this).next().find('.wcs-popout-share-btn-email').attr('href', mailShare);

        $(this).next().find('.wcs-popout-share-btn-facebook').prop("target","_blank");
        $(this).next().find('.wcs-popout-share-btn-twitter').prop("target","_blank");

        WCS.POPUP_OPEN = true;
    });
    $('#wcs-main-wrapper').on('click', '.wcs-popout-share-btn', function(e){
        e.preventDefault();
        $('.wcs-popout').removeClass('wcs-popout-active');
        WCS.POPUP_OPEN = false;
    });
$('#wcs-main-wrapper').on('click', '.wcs-delete-trigger', function(e){
        e.preventDefault();
        var me = this;
        WCS.showModal("Are you sure you want to delete this comment?", "Delete", function(doit){
            if(!doit){
                return false;
            }

            var $commentObj = $(me).closest('.wcs-comment-item');
            var deleteId = $commentObj.data('id');
            $.ajax({
                url: '/ajax_comments/delete_comment',
                data: {
                     comment_id: deleteId,
                     access_token: WEBVIEW.access_token,
                     is_svengoolie: WCS.IS_SVENGOOLIE
                },
                type: 'POST',
                dataType: 'json',
                success: function(resp)
                {
                    if(resp['success'] == 'true'){
                        if(resp['delete_type'] == 2){
                            var $elem = $('#comment_' + deleteId);
                            $elem.addClass('wcs-comment-item-deleted');
                            setTimeout(function(){
                                $elem.remove();
                            }, 500);
                        }else{
                            WCS.setDeleted(deleteId);
                        }
                    }else{
                        WCS.showModal(resp['msg'], "OK", function(){});
                    }
                },
                error: function(response)
                {
                    alert("Error");
                    console.log(response.responseText);
                    console.log(response);
                }
            });
        });
    });
        /******** Profile Avatar Select Popup ***********/
    $('#wcs-main-wrapper').on('click', '.wcs-update-avatar-trigger', function(e){
        e.preventDefault();
        $(this).next().addClass('wcs-popout-active');
        WCS.POPUP_OPEN = true;
    });

    $('#wcs-main-wrapper').on('click', '.selectmoji', function(e){
        e.preventDefault();
        var currEmoji = $(this).data('emoji');
        $.ajax({
            url: '/ajax_comments/update_emoji',
            data: {
                 emoji_file: currEmoji,
                 access_token: WEBVIEW.access_token,
                 is_svengoolie: WCS.IS_SVENGOOLIE
            },
            type: 'POST',
            dataType: 'json',
            success: function(resp)
            {
                console.log("emokiji arespoinse");
                console.log(resp);
                if(resp['success'] == 'false'){
                    WCS.showModal(resp['msg'], "OK", function(){});
                }else{
                    $('.wcs-popout').removeClass('wcs-popout-active');
                    WCS.POPUP_OPEN = false;
                    //go through each comment, activate delete if user matches
                    $('.wcs-comment-item-reply').each(function(){
                        var replyInfo = $(this).data('replyinfo');
                        var userId = replyInfo.split('|')[0];
                        //console.log("comment userid " + userId + " vs " + WCS.USER_ID);
                        if(WCS.USER_ID == userId){
                            //console.log("setting avatar1 " + resp['profile_image']);
                            $(this).find('.wcs-avatar').attr('src', resp['profile_image']);
                            //new Date().getTime()
                        }
                    });
                    $('.wcs-comment-item-parent').each(function(){
                        var replyInfo = $(this).data('replyinfo');
                        var userId = replyInfo.split('|')[0];
                        //console.log("comment userid " + userId + " vs " + WCS.USER_ID);
                        if(WCS.USER_ID == userId){
                            //console.log("setting avatar2 " + resp['profile_image']);
                            $(this).find('.wcs-avatar').first().attr('src', resp['profile_image']);
                        }
                    });
                    //loggedinDisplay(resp);
                    loginSuccess(resp, true, true);
                }
            },
            error: function(response)
            {
                alert("Error");
                console.log(response.responseText);
                console.log(response);
            }
        });
    });
    /******** emoji, youtube, image embed **********/

    $('#wcs-main-wrapper').on('click', '.wcs-post-comment-media-emoji,.wcs-post-comment-media-video,.wcs-post-comment-media-image', function(e){

        //add wcs-selected-textarea to the area we want to insert emoji
        var $topComment = $(this).closest('.wcs-comment-item-parent');
        $('.wcs-selected-textarea').removeClass('wcs-selected-textarea');
        var $textarea = $('#topcomment_text');
        if($topComment.length > 0){
            $textarea = $topComment.find('.wcs-reply-textarea');
        }
        $textarea.addClass('wcs-selected-textarea');
        //display the popup
        $('.wcs-popout').removeClass('wcs-popout-active');
        $(this).next().addClass('wcs-popout-active');
        WCS.POPUP_OPEN = true;
        console.log("this is");
        console.log(this);
        var me = this;
        //only add these events when popup is open
        if($(this).hasClass('wcs-post-comment-media-image')){
            var holder = $(this).next().find('.wcs-popout-file-upload-dropzone').get(0);

            holder.ondragenter = function(e) { holder.textContent = 'Or drag a file here to upload';
                         e.stopPropagation(); e.preventDefault();};
            holder.ondragover = function (e) { e.stopPropagation(); e.preventDefault(); return false; };
            holder.ondragend = function () {
                //this.className = '';
                return false;
            };
            holder.ondrop = function (e) {
              //this.className = '';
              e.preventDefault();
              e.stopPropagation();
              $(this).closest('.wcs-post-comment-media-btns').find('.wcs-popout-file-upload-dropzone').html('<i class="fa fa-sync fa-spin fa-3x"></i>');

              WCS.readfiles(e.dataTransfer.files, function(theid, msg){
                if(theid === null){
                    WCS.showModal(msg, "OK", function(){});
                    return;
                }
                var imageUrl = 'https://weigel-comments.s3.us-east-1.amazonaws.com/' + theid;
                $('.wcs-selected-textarea').val($('.wcs-selected-textarea').val() + "[image=" + imageUrl + "]");
                $(me).closest('.wcs-post-comment-media-btns').find('.wcs-popout-file-upload-dropzone').html('Or drag a file here to upload');
                $('.wcs-popout').removeClass('wcs-popout-active');
                WCS.POPUP_OPEN = false;
              });
            }
        }
          e.preventDefault();
        return false;
    });

    $('#wcs-main-wrapper').on('click', '.selectemoji', function(e){
        e.preventDefault();
        var elem =$('#talkums_text').get(0);
        var theEmoji = $(this).data('emoji');
        $('.wcs-selected-textarea').val($('.wcs-selected-textarea').val() + ":" + theEmoji + ":");

        $('.wcs-popout').removeClass('wcs-popout-active');
        WCS.POPUP_OPEN = false;
    });

    $('#wcs-main-wrapper').on('click', '.youtube-add', function(e){
        e.preventDefault();
       var theUrl = $(this).closest('.wcs-post-comment-media-btns').find('.youtube_url').val();
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var youtubeId = "";
        var match = theUrl.match(regExp);
        if (match && match[2].length == 11) {
          youtubeId = match[2];
        } else {
            WCS.showModal("Please enter a valid youtube url", "OK", function(){});
            return false;
        }
        var myUrl = "https://www.youtube.com/watch?v=" + youtubeId;
       $('.wcs-selected-textarea').val($('.wcs-selected-textarea').val() + "[youtube=" + myUrl + "]");
       $('.wcs-popout').removeClass('wcs-popout-active');
       WCS.POPUP_OPEN = false;
    });

     $('#wcs-main-wrapper').on('change', '.image_uploader', function(){
        var me = this;
        $(this).closest('.wcs-post-comment-media-btns').find('.wcs-popout-file-upload-dropzone').html('<i class="fa fa-sync fa-spin fa-3x"></i>');
        WCS.doS3Upload(null, function(theid, msg){
            if(theid === null){
                WCS.showModal(msg, "OK", function(){});
                return;
            }
            var imageUrl = 'https://weigel-comments.s3.us-east-1.amazonaws.com/' + theid;
            $('.wcs-selected-textarea').val($('.wcs-selected-textarea').val() + "[image=" + imageUrl + "]");
            $(me).closest('.wcs-post-comment-media-btns').find('.wcs-popout-file-upload-dropzone').html('Or drag a file here to upload');
            $('.wcs-popout').removeClass('wcs-popout-active');
            WCS.resetFormElement($(me));

            WCS.POPUP_OPEN = false;
        });
    });

    $('#wcs-main-wrapper').on('change', '#avatar_uploader', function(){
        $(this).closest('.wcs-popout-avatar').find('#avatar_upload_notice').html('<i class="fa fa-sync fa-spin"></i>');
        var me = this;
        WCS.doS3Upload('avatar', function(theid, msg){
            if(theid === null){
                WCS.resetFormElement($(me));
                $(me).closest('.wcs-popout-avatar').find('#avatar_upload_notice').html('');
                WCS.CLOSE_SIDEBAR();
                WCS.showModal(msg, "OK", function(){});
                return;
            }
            var imageUrl = 'https://weigel-comments.s3.us-east-1.amazonaws.com/' + theid;

            console.log(imageUrl);
            $.ajax({
                url: '/ajax_comments/update_avatar',
                data: {
                     user_upload: imageUrl,
                     access_token: WEBVIEW.access_token,
                     is_svengoolie: WCS.IS_SVENGOOLIE
                },
                type: 'POST',
                dataType: 'json',
                success: function(resp)
                {
                    WCS.resetFormElement($(me));
                    $(me).closest('.wcs-popout-avatar').find('#avatar_upload_notice').html('');
                    if(resp['success'] == 'true'){
                        //close avatar window
                        //go through each comment, activate delete if user matches
                        $('.wcs-comment-item-reply').each(function(){
                            var replyInfo = $(this).data('replyinfo');
                            var userId = replyInfo.split('|')[0];
                            //console.log("comment userid " + userId + " vs " + WCS.USER_ID);
                            if(WCS.USER_ID == userId){
                                $(this).find('.wcs-avatar').attr('src', resp['profile_image'] + "?" + new Date().getTime());
                            }
                        });
                        $('.wcs-comment-item-parent').each(function(){
                            var replyInfo = $(this).data('replyinfo');
                            var userId = replyInfo.split('|')[0];
                            //console.log("comment userid " + userId + " vs " + WCS.USER_ID);
                            if(WCS.USER_ID == userId){
                                $(this).find('.wcs-avatar').first().attr('src', resp['profile_image'] + "?" + new Date().getTime());
                            }
                        });
                        //loggedinDisplay(resp);
                        loginSuccess(resp, true, true);
                    }else{
                         if(resp['msg']){
                            WCS.showModal(resp['msg'], "OK", function(){});
                        }
                    }
                },
                error: function(response)
                {
                    alert("Error");
                    console.log(response.responseText);
                    console.log(response);
                }
            });

        });

    });

    $('#wcs-main-wrapper').on('click', '.wcs-post-comment-button', function(e){
        var text = $('#topcomment_text').val();
        var isReply = $(this).closest('.wcs-reply-container').length > 0 ? true : false;
        if(isReply){
            var $textarea = $(this).closest('.wcs-reply-container').find('.wcs-reply-textarea');
            text = $textarea.val();
            $textarea.addClass('wcs-reply-textarea-submitting');
        }
        WCS.doComment(isReply, text);
        e.preventDefault();
        return;
    });
 // $('#wcs-main-wrapper').on('click', '.wcs-login-google', function(e){
    //     e.preventDefault();
    //     alert('Please follow the instructions to set a password');
    //     WCS.loadSidebarTemplate('forgot_password');
    //     WCS.setupProfileForm('forgot_password');
    //     return false;

    // });
    // $('#wcs-main-wrapper').on('click', '.wcs-login-twitter', function(e){
    //     e.preventDefault();
    //     alert('Please follow the instructions to set a password');
    //     WCS.loadSidebarTemplate('forgot_password');
    //     WCS.setupProfileForm('forgot_password');
    //     return false;
    // });
    // $('#wcs-main-wrapper').on('click', '.wcs-login-facebook', function(e){
    //     e.preventDefault();
    //     alert('Please follow the instructions to set a password');
    //     WCS.loadSidebarTemplate('forgot_password');
    //     WCS.setupProfileForm('forgot_password');
    //     return false;
    // });
    $('.wcs-login-email').on('click', function(e){
        /*
        if(WCS.RETURN_USER){
            WCS.loadSidebarTemplate('login')
            WCS.setupProfileForm('login');
        }else{
            //WCS.loadSidebarTemplate('register')
            //WCS.setupProfileForm('register');
            WCS.loadSidebarTemplate('login')
            WCS.setupProfileForm('login');            
        }
        */
    });

    $('.wcs-force-login').on('click', function(e){
        /*
        if(WEBVIEW.is_webview){
            var isValid = WEBVIEW.is_invalid_user("add-user-tag", "to add a favorite show");
            if(isValid){
                $('.wcs-favorites-login').html("Thank you for logging in.  Click 'Add to Favorites' to receive personalized content related to that show.")
            }
        }else{
            WCS.loadSidebarTemplate('login')
            WCS.setupProfileForm('login');
        }
        */
    });


    $('.wcs-login-app').on('click', function(e){
        //WEBVIEW.is_invalid_user('comment', "to make a comment");
    });

    $('.wcs-comment-filter-trigger').on('click', function(e){
        e.preventDefault();
        $('.wcs-comment-filter-trigger').removeClass('wcs-comments-filter-active');
        var newFilterType = this.id.split('-')[2];
        if(newFilterType == WCS.FILTER_TYPE){
            //do nothing, we're using the same filter
            $(this).addClass('wcs-comments-filter-active');
            return false;
        }
        WCS.FILTER_TYPE = newFilterType;
        WCS.FILTER_PAGE = 0;

        $(this).addClass('wcs-comments-filter-active');

        WCS.refreshAllComments();
    });

    $('#wcs-main-wrapper').on('click', '.view-more-btn', function(e){
         e.preventDefault();
         if($(this).hasClass('view-more-topcomment')){
            WCS.FILTER_PAGE++;
            WCS.refreshAllComments();
         }else if($(this).hasClass('view-more-newcomment')){
            WCS.LOADING_NEW_COMMENTS = true;
            WCS.loadNewComments();
            var html = $('#template_loadinganimation').html();
            $('.view-more-newcomment').after(html);
            $('.view-more-newcomment').hide();
         }else if($(this).hasClass('view-more-profilecomment')){
            WCS.PROFILE_COMMENT_PAGE++;
            //WCS.PROFILE_COMMENT_USER = userId;
            WCS.loadMoreProfileComments();
         }
     });

     if(!WCS.IS_ONLYREGISTRATION){
        var comCheckInterval;
        function startCheck(){
            console.log("focus");
            WCS.checkNewComments();
            comCheckInterval = window.setInterval(WCS.checkNewComments,120000);
        }
        function stopCheck(){
           console.log('blur');
           window.clearInterval(comCheckInterval);
        }

        window.addEventListener('focus', startCheck);
        window.addEventListener('blur', stopCheck);

        comCheckInterval = setInterval(function(){
           WCS.checkNewComments();
        }, 120000);
     }

    $('#wcs-main-wrapper').on('click', '.view-prev-replies', function(e){
        e.preventDefault();
        var ancestorId = $(this).data('ancestorid');
        var $container = $('#comment_' + ancestorId);
        var loadingHtml = $('#template_loadinganimation').html();

        $container.find('.view-more-subcomment').before(loadingHtml);
        $container.find('.view-more-subcomment').remove();
        $.ajax({
            url: '/ajax_comments/get_all_children_comments',
            data: {
                 ancestor_id: ancestorId,
                 thread_id: WCS.THREAD_ID,
                 is_svengoolie: WCS.IS_SVENGOOLIE
            },
            type: 'POST',
            dataType: 'json',
            success: function(data)
            {
                if(data.length <= 0){
                    return;
                }
                $container.find('.wcs-loading-animation-overlay').remove();
                console.log("children");

                //alert("adding child to " + '#comment_' + resp['parent_id']);
                var $futureComment = $container.find('.wcs-comment-item-reply').first();

                $(data).each(function(i, resp){
                    console.log("adding child ");
                    console.log(resp);
                    var $comment = $($('#template_acomment').html());

                    $comment.find('.wcs-user-trigger img').attr('src', resp['profile_image']);
                    $comment.find('.wcs-user-trigger').attr('data-userid', resp['user_id']);

                    $comment.find('.wcs-other-user').attr('data-userid', resp['parent_userid']);
                    $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name']  + "|" + resp['parent_id']);
                    $comment.attr('data-isadmin', resp['is_admin']);

                    $comment.find('.wcs-other-user').html(resp['parent_username']);
                    $comment.find('.wcs-user-displayname').html(resp['display_name']);
                    $comment.find('.wcs-comment-item-date').html(resp['timeago']);
                    $comment.find('.wcs-comment-item-text').html(resp['generated_comment']);
                     var totalText = "";
                    if(resp['upvotes'] > 0){
                        totalText = " (" + resp['upvotes'] + ')';
                    }
                    var html = "";
                    if(resp['upvoted']){
                        html = '<i class="fas fa-heart"></i>' + " Unlike" + totalText;
                        $comment.find('.wcs-like-trigger').addClass('wcs-like-btn-active');
                    }else{
                        html = '<i class="fas fa-heart"></i>' + " Like" + totalText;
                    }
                    $comment.find('.wcs-like-trigger').html(html);

                    $comment.attr('data-id', resp['id']);
                    $comment.attr('id',  "comment_" + resp['id']);
                    if(WCS.USER_ID != resp['user_id']){
                        $comment.find('.wcs-delete-trigger').attr('style', 'display:none');
                    }
                    $comment.addClass('wcs-comment-item-reply');
                    $futureComment.before($comment);
                });
            },
            error: function(response)
            {
                alert("Error");
                console.log(response.responseText);
                console.log(response);
            }
        });
     });
setTimeout(function(){
        if(window.location.href.indexOf('#') > 0){
           var possibleComment = window.location.href.split('#')[1];
           if(possibleComment.indexOf('comment_') === 0){
              var commentId = parseInt(possibleComment.split('_')[1]);

              WCS.loadNewComments(commentId, function(){
                  setTimeout(function(){
                      //so we can add the hash here... otherwise it will be same and not move to location
                      var elem = document.getElementById(possibleComment);
                      elem.scrollIntoView();
                      $(elem).css('background', 'rgb(253 251 235)');
                      //hash doesn't work if you already have the hash
                      //window.location.href = origUrl + "#" + possibleComment;
                  }, 2000);
              });
           }
           else if(possibleComment == 'settings'){
               $('.wcs-post-comment-user-notifications').trigger('click');
               //alert("show settings");
           }else if(possibleComment == 'register'){
                //WCS.loadSidebarTemplate('register');
                //WCS.setupProfileForm('register');
                WCS.loadSidebarTemplate('login');
                WCS.setupProfileForm('login');                
           }
           else if(possibleComment == 'login'){
                WCS.loadSidebarTemplate('login');
                WCS.setupProfileForm('login');
           }
       }
    if(WEBVIEW.is_webview && WCS.NOTIFICATION_SETTINGS_PAGE){

            $.ajax({
                url: '/ajax_comments/get_user_private_profile',
                data: {
                     access_token: WEBVIEW.access_token,
                     get_comments: 0,
                     is_svengoolie: WCS.IS_SVENGOOLIE
                },
                type: 'POST',
                dataType: 'json',
                success: function(resp)
                {
                    //alert("email  " + resp['email_notifications']);
                    //alert("app " + resp['app_notifications']);
                    var enableEmail = 0;

                    if(resp['email_notifications'] == 1){
                        enableEmail = 1;
                        DG.switches['#enable_email_alerts'].check();
                    }else{
                        DG.switches['#enable_email_alerts'].uncheck();
                    }

                    var enablePush = 0;
                    if(resp['app_push_notifications'] == 1){
                        //alert("enabling check");
                        enablePush = 1;
                        DG.switches['#enable_app_alerts'].check();
                    }else{
                        DG.switches['#enable_app_alerts'].uncheck();
                    }
                    console.log("notification refreshwebviewstart");

                    WCS.refreshNotifications(enableEmail,
                        enablePush, 0,
                        resp['notification_settings']);

                    WCS.refreshReminderList(resp['user_reminders']);
                },
                error: function(err){

                }
            });

        }


     }, 2000);
     console.log("creating handler for delte account");
    $('body').on('click', '#delete-account-btn', function() {
        console.log("deleting account...");
        $.ajax({
            url: '/ajax/delete_my_account',
            type: 'POST',
            data: {
                 access_token: WEBVIEW.access_token
            },                    
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    WCS.showModal("Your account has been deleted. Reloading page...", "OK|", function() {
                        window.location.href = '/ajax/logout';
                    });
                    setTimeout(function(){
                        window.location.href = '/ajax/logout';
                    }, 3000);
                } else {                            
                    WCS.showModal("Error deleting account: " + response.message, "OK|");
                }
            },
            error: function() {
                WCS.showModal("An error occurred while deleting your account. Please try again later.", "OK");
            }
        });
    });
})();

WCS.loadSidebarTemplate = function(theType, isSocial){
    return;
    /*
    $('#wcs-slideout-wrapper').empty();
    
   if(theType == 'register'){
        var $container = $('<div class="wcs-profile-registration-wrap wcs-profile-settings-wrap">');
        var innerHtml = $('#template_registration_header_email').html() + $('#template_profile_form').html();
        if(isSocial){
            WCS.SOCIAL_REGISTRATION_FORM = true;
            innerHtml = $('#template_registration_header_social').html() + $('#template_profile_form').html();
        }

        $container.append(innerHtml);
        
        $('#wcs-slideout-wrapper').append($container);
        if(WCS.DESIRED_ACTION !== ""){
            setTimeout(function(){
                $('.desired_action').html(WCS.DESIRED_ACTION);
            }, 20);
        }
        if(WCS.DESIRED_TITLE !== ""){
            setTimeout(function(){
                $('.desired_title').html(WCS.DESIRED_TITLE);
            }, 30);
        }
        if(WCS.DESIRED_DESCRIPTION !== ""){
            setTimeout(function(){
                $('.desired_description').html(WCS.DESIRED_DESCRIPTION);
            }, 40);
        }
        if(WCS.DESIRED_TITLE == "" && WCS.DESIRED_DESCRIPTION == ""){
            setTimeout(function(){
                $('.desired_title').html("Create an Account");
                $('.desired_description').html("");
            });
        }
   }
   else if(theType == 'login'){
              var $container = $('<div class="wcs-profile-settings-wrap">');
       var innerHtml = $('#template_login_header').html() + $('#template_login_form').html();
       $container.append(innerHtml);
       $('#wcs-slideout-wrapper').append($container);
       if(WCS.DESIRED_ACTION !== ""){
            setTimeout(function(){
                $('.desired_action').html(WCS.DESIRED_ACTION);
                //not sure why but this used to be .desirect_action?
                //directory search showed nothing with a class of desirect so i'm assuming it was a typo
                //and was supposed to be desired????
            }, 20);
       }
       if(WCS.DESIRED_TITLE !== ""){
        setTimeout(function(){
            $('.desired_title').html(WCS.DESIRED_TITLE);
        }, 30);
       }
        if(WCS.DESIRED_DESCRIPTION !== ""){
            setTimeout(function(){
                $('.desired_description').html(WCS.DESIRED_DESCRIPTION);
            }, 40);
        }
        if(WCS.DESIRED_TITLE == "" && WCS.DESIRED_DESCRIPTION == ""){
            setTimeout(function(){
                $('.desired_title').html("Login");
                $('.desired_description').html("");
            });
        }
   }
   else if(theType == 'profile_user'){
       console.log("loading profile user");
       var headerHtml = $('#template_profile_header').html();
       var formHtml = $('#template_profile_form').html();
       var notificationsHtml = $('#template_notifications').html();
       var $settingsBody = $($('#template_profile_display_wrapper').html());
       $settingsBody.find('.wcs-profile-settings-wrap').append(formHtml);
       $settingsBody.find('.wcs-profile-notifications-wrap').append(notificationsHtml);
       
       $('#wcs-slideout-wrapper').append(headerHtml);

       $('#wcs-slideout-wrapper').append($settingsBody);
       
       setTimeout(function(){
           $('.wcs-profile-settings-delete-account').css('display', 'block');
       }, 50);
   }
   else if(theType == 'profile_other'){
              var headerHtml = $('#template_profile_header').html();
       var wrapper = $('#template_profile_display_wrapper').html();


       $('#wcs-slideout-wrapper').append(headerHtml + wrapper);
   }
   else if(theType == 'forgot_password'){
       var wrapper = $('#template_forgotpass_form').html();
       $('#wcs-slideout-wrapper').append(wrapper);
   }
   else if(theType == 'update_password'){
       var wrapper = $('#template_update_password').html();
       $('#wcs-slideout-wrapper').append(wrapper);
   }
   else if(theType == 'loading'){
        var html = $('#template_loadinganimation').html();
       $('#wcs-slideout-wrapper').append(html);
   }
   else if(theType == 'reminders'){
        var html = $('#template_reminder_form').html();
        //console.log("template");
        //console.log(html);
       $('#wcs-slideout-wrapper').append(html);
   }*/
};


WCS.doAuthWindow  = function(authType){
    var windowWidth = 600;
    var windowHeight = 360;
    if(authType == 'facebook'){
        windowWidth = 800;
        windowHeight = 480;
    }else if(authType == 'twitter'){
        windowWidth = 500;
        windowHeight = 700;
    }
    var authWindow = window.open(WCS.SITE_URL + 'iframelogin/social_login?service=' + authType, '_blank', 'toolbars=0,width=' + windowWidth + ',height=' + windowHeight + ',left=200,top=200,scrollbars=1,resizable=1,location=no');
};

WCS.doComment = function(isReply, theText){

    var parentId = 0;
    var parentAdmin = 0;
    var ancestorId = 0;
    var replyLevel = 0;
    if(isReply){
        parentId = WCS.REPLY_PARENT_ID;
        parentAdmin = WCS.REPLY_PARENT_ADMIN;
        ancestorId = WCS.REPLY_ANCESTOR_ID;
        replyLevel = parseInt(WCS.REPLY_LEVEL);
        replyLevel++;
    }

    if(WCS.IS_POSTING){
        return false;
    }
    //Decrement counter, so user's own comment doesn't show up as 'new'
    newCommentCount = newCommentCount - 1;

    WCS.IS_POSTING = true;
    $.ajax({
        url: '/ajax_comments/post_comment',
        data: {
             thread_id: WCS.THREAD_ID,
             thread_url: WCS.THREAD_URL,
             site_id: WCS.TALKUMS_SITE_ID,
             ancestor_id : ancestorId,
             parent_id : parentId,
             parent_admin: parentAdmin,
             level : replyLevel,
             post_text: theText,
             access_token: WEBVIEW.access_token,
             is_svengoolie: WCS.IS_SVENGOOLIE
        },
        type: 'POST',
        dataType: 'json',
        success: function(resp)
 {
            console.log("post comment data");
            console.log(resp);
            if(resp['success'] == 'false'){
                if(resp['action']){
                    WCS.force_action(resp['action']);
                }
                else if(resp['msg']){
                    WCS.showModal(resp['msg'], "OK", function(){});
                }
                WCS.IS_POSTING = false;
                return;
            }
            if(parentId > 0){
                $('.subcomment_text').val("");
            }else{
                $('#topcomment_text').val("");
            }
            //$('.wcs-reply-container').remove();
            WCS.IS_POSTING = false;
            var $comment = $($('#template_acomment').html());


            $comment.find('.wcs-user-trigger img').attr('src', resp['profile_image']);
            $comment.find('.wcs-user-trigger').attr('data-userid', resp['user_id']);

            if(resp['parent_userid']){
                $comment.find('.wcs-other-user').attr('data-userid', resp['parent_userid']);
                $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name'] + "|" + parentId);
                $comment.attr('data-isadmin', resp['is_admin']);
                if(resp['parent_admin'] == 1){
                    $comment.find('.wcs-other-user').addClass('wcs-verified-user');
                }else{
                    $comment.find('.wcs-other-user').removeClass('wcs-verified-user');
                }
                $comment.find('.wcs-other-user').html(resp['parent_username']);
            }else{
                $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name'] + "|" + parentId);
                $comment.attr('data-isadmin', resp['is_admin']);

                $comment.addClass('wcs-comment-item-parent');
                $comment.find('.wcs-other-user').remove();
                $comment.find('.wcs-comment-item-username i').remove();
                //need to add reply box
                var replyBox = $('#template_reply_container').html();
                $comment.append(replyBox);
            }
            $comment.find('.wcs-user-displayname').html(resp['display_name']);
            if(resp['is_admin'] == 1){
                $comment.find('.wcs-user-displayname').addClass('wcs-verified-user');
            }else{
                $comment.find('.wcs-user-displayname').removeClass('wcs-verified-user');
            }
            $comment.find('.wcs-user-displayname').attr('data-userid', WCS.USER_ID);
            $comment.find('.wcs-user-displayname').attr('data-isadmin', resp['is_admin']);
            $comment.find('.wcs-comment-item-date').html('Just Now');
            $comment.find('.wcs-comment-item-text').html(resp['post_html']);
            $comment.find('.wcs-like-trigger').html('<i class="fas fa-heart"></i>' + " Like ");
            $comment.attr('data-id', resp['insert_id']);
            $comment.attr('id',  "comment_" + resp['insert_id']);

            if(parentId > 0){
                $comment.addClass('wcs-comment-item-reply');
                var $container = $('#comment_' + ancestorId);
                $container.find('.wcs-reply-container').before($comment);
            }
            else{
                $('.wcs-comment-container').prepend($comment);
            }

            // adds/removes class to animate entrance
            $comment.addClass('wcs-comment-item-added');
            setTimeout(function() {
                $comment.removeClass('wcs-comment-item-added');
            }, 500);

            if($('.wcs-comments-no-comments').length > 0){
                $('.wcs-comments-no-comments').remove();
            }
            WEBVIEW.log_stats('comment_posted', WCS.THREAD_URL + "#comment_" + resp['insert_id']);
            if(WCS.socket !== null){
                WCS.socket.publish('thread' + WCS.TALKUMS_THREADID, {user: 'user456',
                    message: 'Hi!'});
            }
        },
error: function(response)
        {
            //Set new comment count back up if error (no actual commment)
            newCommentCount++;
            alert("Error");
            console.log(response.responseText);
            console.log(response);
        }
    });



};
WCS.setupProfileForm = function(formType, isSocial){
    /*
    WCS.SIDEBAR_PAGE = formType;

    //bind evends
    if(formType == 'register' || formType == 'settings'){
        $('#wcs-zipcode').on('keypress', function(ev) {
            var keyCode = window.event ? ev.keyCode : ev.which;
            //codes for 0-9
            if (keyCode < 48 || keyCode > 57) {
                //codes for backspace, delete, enter
                if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
                    ev.preventDefault();
                }
            }
        });
        $('#wcs_zipcode').change(function(){
           WCS.load_providers();
        });

        $("#wcs_zipcode").keyup(function(){
            WCS.load_providers();
        });

        $('#wcs_provider').on('change', function(){
           var aProvider = $(this).val();

           //alert("channelDisplay: " + channelDisplay);
           if(aProvider == 'provider not listed'){
               $('.wcs-profile-settings-other-provider').show();
           }
           else if(aProvider == ''){

           }else{
               $('.wcs-profile-settings-other-provider').hide();
               var $option = $(this).find('option:selected');
               var channelDisplay = $option.data('display');
               var aChannel = $option.data('channelid');
               var aMarket = $option.data('marketid');


               $('#wcs_provider_display').val(channelDisplay);
               //$('channelDisplay').find('selector');
               $('#wcs_market_id').val(aMarket);
               $('#wcs_channel_id').val(aChannel);
           }
        });
if(formType == 'register'){
            $('#username').on('keyup', function(ev) {
                //codes for 0-9
                var newVal = $(this).val();
                var code, i, len;
                var isAlphanumeric = true;
                 for (i = 0, len = newVal.length; i < len; i++) {
                   code = newVal.charCodeAt(i);
                   if (!(code > 47 && code < 58) && // numeric (0-9)
                       !(code > 64 && code < 91) && // upper alpha (A-Z)
                       !(code > 96 && code < 123) && // lower alpha (a-z)
                       !(code == 95)        ) {  // underscore
                     isAlphanumeric = false;
                   }
                 }
                if(!isAlphanumeric){
                    $('.wcs-settings-form-err-username').html("Username Invalid: spaces, hyphens and special characters are NOT allowed.");
                }else{
                    $('.wcs-settings-form-err-username').html("");
                }
            });
        }

    }
    if(formType == "register"){
        $('.wcs-profile-settings-form').attr('id', 'wcs-registration-form');
        if(WCS.CAPTCHA_INCLUDED){
            grecaptcha.render('recaptcha_site', {
                'sitekey' : WCS.CAPTCHA_SITE_KEY
            });
        }
        $('.wcs-profile-settings-email-username').hide();
        $('.wcs-profile-signup-username').show();
        $('.wcs-profile-signup-password').show();
    }else if(formType == "settings"){
        $('.wcs-profile-settings-form').attr('id', 'wcs-edit-form');
        $('input[name="social_username"]').attr('readonly', 'readonly');
        $('input[name="social_username"]').addClass("wcs-profile-settings-form-readonly");
        $('input[name="username1"]').attr('readonly', 'readonly');
        $('input[name="username1"]').addClass("wcs-profile-settings-form-readonly");
        $('input[name="password"]').attr('readonly', 'readonly');
        $('input[name="password"]').addClass("wcs-profile-settings-form-readonly");
        if(isSocial){
            $('input[name="social_username"]').after('<span class="wcs-settings-form-disclaimer">Your username can' +
                    "'" + 't be edited</span>');
        }else{
            $('input[name="username1"]').after('<span class="wcs-settings-form-disclaimer">Your username can' +
                    "'" + 't be edited</span>');

            $('.wcs-settings-form-password-container').remove();
            $('.wcs-settings-form-password-updater').show();
            //$('.wcs-settings-form-password-updater').hide();

        }
        if(WCS.termsAccepted == 1){
            $('.wcs-profile-registration-terms').remove();
        }

        WCS.setupNotificationHandlers(false);

    }else if(formType == "login"){
        $('.wcs-profile-settings-form').attr('id', 'wcs-login-form');
    }
    else if(formType == "forgot_password"){
        $('.wcs-profile-settings-form').attr('id', 'wcs-forgotpass-form');
        if(WCS.CAPTCHA_INCLUDED){
            grecaptcha.render('recaptcha_site', {
                'sitekey' : WCS.CAPTCHA_SITE_KEY
            });
        }
    }
    else if(formType == 'update_password'){
        $('.wcs-profile-settings-form').attr('id', 'wcs-updatepass-form');
        if(WCS.CAPTCHA_INCLUDED){
            grecaptcha.render('recaptcha_site', {
                'sitekey' : WCS.CAPTCHA_SITE_KEY
            });
        }
    }else if(formType == 'set_reminder'){
        $('.wcs-profile-settings-form').attr('id', 'wcs-reminder-form');
    }

    $('.wcs-cancel-btn').on('click', function(e){
        e.preventDefault();
        if(WCS.SOCIAL_REGISTRATION_FORM){
            window.location.href = '/ajax/logout';
        }
        WCS.CLOSE_SIDEBAR();
    });
 //ugly - delay to allow dom to update, so can bind events
    setTimeout(function(){
        if(formType == "register"){
            WCS.setupRegistrationForm();
        }else if (formType == "login"){
            WCS.setupLoginForm();
        }else if(formType == "settings"){
            WCS.setupSettingsForm();
        }
        else if(formType == "forgot_password"){
            WCS.setupForgotPass();
        }
        else if(formType == 'update_password'){
            WCS.setupUpdatePass();
        }else if(formType == 'reminder_form'){
             WCS.setupSetReminder();
        }
        if(!$('#wcs-overlay-sidebar').hasClass('wcs-overlay-open')){
            WCS.OPEN_SIDEBAR();
            WCS.PROFILE_OPEN = true;
        }

    }, 10);
    */
};
WCS.refreshReminderList = function(userReminders){
        console.log("in refresh reminders ");
        console.log(userReminders);
        $('.reminders-list').empty();
        if(!userReminders || userReminders.length <= 0){
            $('.reminders-list').append("<li style='padding-left:0px;margin-left:0px;'><p >You have no reminders set.</p></li>");
            return;
        }
        console.log(userReminders);
        for(var x = 0; x < userReminders.length; x++){
            var rem = userReminders[x];
            var textSelected = "";
            var emailSelected = "";
            var browserSelected = "";
            var appSelected = "";

            if(rem['alert_type'] == 'text'){
                textSelected = "selected='selected'";
            }
            if(rem['alert_type'] == 'email'){
                emailSelected = "selected='selected'";
            }
            if(rem['alert_type'] == 'browser'){
                browserSelected = "selected='selected'";
            }
            if(rem['alert_type'] == 'apppush'){
                appSelected = "selected='selected'";
            }
            console.log(rem);
            //alert("alert type " + rem['alert_type']);
            var selectControl = '<select  data-remindid="' + rem['id'] + '" data-remindtype="' + rem['type'] +
                        '" id="notifications_reminder_type" class="reminder-changetype">';
            if(WEBVIEW.is_webview || rem['alert_type'] == 'apppush'){
                selectControl += '<option value="apppush" ' + appSelected + '>Push Notification</option>';
            }
            if(!WEBVIEW.is_webview || rem['alert_type'] == 'text'){
                selectControl += '<option value="text" ' + textSelected + '>Text</option>';
            }
            selectControl += '<option value="email" ' + emailSelected + '>Email</option>';
            if(!WEBVIEW.is_webview || rem['alert_type'] == 'browser'){
                  selectControl += '<option value="browser" ' + browserSelected + '>Browser Notification</option>';
            }
            selectControl += '</select>';

            var remHtml = '<li id="uremind_' + rem['id'] + '">' +
                    '<button data-remindid="' + rem['id'] + '" data-remindtype="' + rem['type'] + '" class="reminder-remove">' +
                        'Remove</button>' +
                    selectControl +
                                     '<div>' + rem['display'] + '</div>' +
                    '</li>';

            $('.reminders-list').append(remHtml);

        }
    };

    WCS.refreshNotifications = function(enableEmail, enableBrowser, enableApp, notificationSettings){

        if(notificationSettings == null){
            console.log("empty data for notficationsettings update");
            return;
        }
        console.log("refreshing notification settings...");
        console.log(notificationSettings);
        for(var notificationId in notificationSettings){

            var notificationVal = notificationSettings[notificationId];


            if(notificationId == 'noteworthy_send_time'){
                $('#noteworthy_send_time').val(notificationVal);
                continue;
            }


            var disabledType = false;
            if(notificationId.indexOf('_email_') >= 0){
                if(enableEmail == 0){
                    disabledType = true;
                }
            }
            if(notificationId.indexOf('_app_') >= 0){
                if(enableBrowser == 0){
                    disabledType = true;
                }
            }
            if(notificationId.indexOf('_browser_') >= 0){
                if(enableApp == 0){
                    disabledType = true;
                }
            }
           if(notificationVal == 'yes' && !disabledType){
                $('#' + notificationId).attr('checked', 'checked');
                $('#' + notificationId).removeAttr('disabled');
                $('#' + notificationId).parent().removeClass("disabled_check");
            }else if(!disabledType){
                $('#' + notificationId).removeAttr('disabled');
                $('#' + notificationId).removeAttr('checked');
                $('#' + notificationId).parent().removeClass("disabled_check");
            }
            else{
                $('#' + notificationId).removeAttr('checked');
                $('#' + notificationId).attr('disabled', true);
                $('#' + notificationId).parent().addClass("disabled_check");
            }

        }



    };

WCS.setupRegistrationForm = function(){
    /*
    //WCS.PROFILE_OPEN = true;
    $('#wcs-signin-link').on('click', function(e){
        e.preventDefault();
        WCS.loadSidebarTemplate('login');
        WCS.setupProfileForm('login');

        return false;
    });
    $('input[name="wcs_zipcode"]').val(WCS.DEFAULT_SIGNUP_ZIPCODE);
    WCS.load_providers();

    $('#wcs-registration-form').submit(function(e){
       // alert("submitting");
       e.preventDefault();
        var html = $('#template_loadinganimation').html();
        $('#wcs-overlay-sidebar').append(html);

       //lets try HTML5 formdata object...
       var formData = new FormData(document.getElementById("wcs-registration-form"));

       var xhr = new XMLHttpRequest();
       xhr.open('POST', '/ajax_comments/register_update_site_user/', true);
       xhr.onload = function () {
            if (xhr.status === 200)
          {
              var result = JSON.parse(xhr.responseText);
              $('#wcs-overlay-sidebar').find('.wcs-loading-animation-overlay').remove();
              if(result['success'] == "true"){
                    //do modal
                   // alert("do modal close");
                  var successHtml = $('#template_registration_header_success').html();
                  $('.wcs-profile-registration-wrap').empty();
                  $('.wcs-profile-registration-wrap').html(successHtml);
                  loginSuccess(result, true, true);
                  WCS.termsAccepted = 1;
                    var defaultComment = $('#topcomment_text').val();
                    if(defaultComment.trim().length > 0)
                    $.ajax({
                        url: '/ajax_comments/set_default_comment_text',
                        data: {
                             default_comment: defaultComment
                        },
                        type: 'POST',
                        dataType: 'json',
                        success: function(resp)
                        {
                        },
                        error: function(response)
                        {
                        }
                    });



              } else if (result['success'] == "ip_error") {
                alert('Registration is not allowed from your IP address.');
              }
              else{
                  if(WCS.CAPTCHA_INCLUDED){
                      grecaptcha.reset();
                  }
                  //alert("failure: " + );
                  var setError = function(errorName){
                      if(result['errors'][errorName]){
                          $('.wcs-settings-form-err-' + errorName).html(result['errors'][errorName]);
                      }
                      else{
                          $('.wcs-settings-form-err-' + errorName).html("");
                      }

                  };

                  setError('full-name');
                  setError('email');
                  setError('username');
                  setError('password');
                  setError('social-username');
                  setError('dob');
                  setError('gender');
                  setError('zipcode');
                  setError('provider');
                  setError('other-provider');
                  //setError('terms-of-service');
                  setError('captcha');
                  if(result['msg']){
                      alert(result['msg']);
                  }

              }
          }
          else
          {
             alert('An error occurred!');
          }
       };

       xhr.send(formData);
   });
    */

}
WCS.setupForgotPass = function(){
    /*
    $('#wcs-login-link').on('click', function(e){
        e.preventDefault();
        WCS.loadSidebarTemplate('login');
        WCS.setupProfileForm('login');
        return false;
    });

    $('#wcs-forgotpass-form').submit(function(e){
       e.preventDefault();
       var html = $('#template_loadinganimation').html();
       $('#wcs-overlay-sidebar').append(html);
       var formData = new FormData(document.getElementById("wcs-forgotpass-form"));
       var xhr = new XMLHttpRequest();
       xhr.open('POST', '/ajax_comments/reset_password/', true);
       xhr.onload = function () {
          if (xhr.status === 200)
          {
              var result = JSON.parse(xhr.responseText);
              console.log("results")
              console.log(result);
              $('#wcs-overlay-sidebar').find('.wcs-loading-animation-overlay').remove();
              if(result['success'] == "true"){
                var successHtml = $('#template_forgotpass_success').html();
                $('.wcs-profile-settings-wrap').empty();
                $('.wcs-profile-settings-wrap').html(successHtml);
              }
              else{
                  if(WCS.CAPTCHA_INCLUDED){
                      grecaptcha.reset();
                  }
                  //alert("failure: " + );
                  var setError = function(errorName){
                      if(result['errors'][errorName]){
                          $('.wcs-settings-form-err-' + errorName).html(result['errors'][errorName]);
                      }
                      else{
                          $('.wcs-settings-form-err-' + errorName).html("");
                      }

                  };
                  setError('email');
                  setError('captcha');
              }
          }
          else
          {
             alert('An error occurred!');
          }
       };

       xhr.send(formData);

       return false;
    });
    */
};

WCS.setupUpdatePass = function(){
    $('.wcs-update-password-settings-link').on('click', function(e){
        e.preventDefault();
        //Just reload with ajax call - otherwise this would get really messy
        WCS.PROFILE_USER_ID = -1;
        $('.wcs-post-comment-user-settings').trigger('click');
        return false;
    });

    $('#wcs-updatepass-form').submit(function(e){
       e.preventDefault();
       var html = $('#template_loadinganimation').html();
       $('#wcs-overlay-sidebar').append(html);
       var formData = new FormData(document.getElementById("wcs-updatepass-form"));
       var xhr = new XMLHttpRequest();
       xhr.open('POST', '/ajax_comments/update_password/', true);
       xhr.onload = function () {
          if (xhr.status === 200)
          {
              var result = JSON.parse(xhr.responseText);
              console.log("results")
              console.log(result);
              $('#wcs-overlay-sidebar').find('.wcs-loading-animation-overlay').remove();
              if(result['success'] == "true"){
                var successHtml = $('#template_updatepass_success').html();
                $('.wcs-profile-settings-wrap').empty();
                $('.wcs-profile-settings-wrap').html(successHtml);
              }
              else{
                  if(WCS.CAPTCHA_INCLUDED){
                      grecaptcha.reset();
                  }
                  //alert("failure: " + );
                  var setError = function(errorName){
                      if(result['errors'][errorName]){
                          $('.wcs-settings-form-err-' + errorName).html(result['errors'][errorName]);
                      }
                      else{
                          $('.wcs-settings-form-err-' + errorName).html("");
                      }
                 };
                  setError('password');
                  setError('password1');
                  setError('captcha');
              }
          }
          else
          {
             alert('An error occurred!');
          }
       };

       xhr.send(formData);

       return false;
    });

};

WCS.setupSetReminder = function(){

};

WCS.setupLoginForm = function(){

    $('#wcs-register-link').on('click', function(e){
        e.preventDefault();
        WCS.loadSidebarTemplate('login');
        WCS.setupProfileForm('login');
        return false;
    });

    $('.wcs-login-forgot-un-pw').on('click', function(e){
        e.preventDefault();
        WCS.loadSidebarTemplate('forgot_password');
        WCS.setupProfileForm('forgot_password');
        return false;
    });

    $('#wcs-login-form').submit(function(e){
       e.preventDefault();
       var html = $('#template_loadinganimation').html();
       $('#wcs-overlay-sidebar').append(html);

       var formData = new FormData(document.getElementById("wcs-login-form"));
       var xhr = new XMLHttpRequest();
       xhr.open('POST', '/ajax_comments/login_site_user/', true);
       xhr.onload = function () {
          if (xhr.status === 200)
          {
              var result = JSON.parse(xhr.responseText);
              console.log("result");
              console.log(result);
              $('#wcs-overlay-sidebar').find('.wcs-loading-animation-overlay').remove();

              if(result['success'] == "true"){
                  //make user do the things
                  loginSuccess(result, true, false);
                    //do modal
                  //$('#wcs-edit-form').after("<h1 class='wcs-edit-success'>Thank you for updating your information!</h1>");

                  ////This forces a page reload after 1 second so that the comment textarea will appear again (it is currently hidden if not logged in)
                  setTimeout(location.reload.bind(location), 1000);
              }
              else{
                  //alert("failure: " + );
                  var setError = function(errorName){
                      if(result['errors'][errorName]){
                          $('.wcs-settings-form-err-' + errorName).html(result['errors'][errorName]);
                      }
                      else{
                          $('.wcs-settings-form-err-' + errorName).html("");
                           }

                  };

                  setError('username');
                  setError('password');
                  setError('generic');
                  //if(result['msg']){
                  //   WCS.showModal(result['msg'], "OK", function(){});
                  //}
              }
          }
          else
          {
             alert('An error occurred!');
          }
       };

       xhr.send(formData);

       return false;
    });


}

WCS.setupSettingsForm = function(){

    $('.wcs-profile-nav-tab').on('click', function(e){
        e.preventDefault();
        $('.wcs-profile-nav-tab').removeClass('wcs-profile-nav-active');
        $(this).addClass('wcs-profile-nav-active');
        if($(this).text() == 'Settings'){
            $('.wcs-profile-settings-wrap').show();
            $('.wcs-profile-comments-wrap').hide();
            $('.wcs-profile-notifications-wrap').hide();
        }else if($(this).text() == 'Notifications'){
            $('.wcs-profile-notifications-wrap').show();
            $('.wcs-profile-comments-wrap').hide();
            $('.wcs-profile-settings-wrap').hide();
        }else{
            $('.wcs-profile-comments-wrap').show();
            $('.wcs-profile-settings-wrap').hide();
            $('.wcs-profile-notifications-wrap').hide();
        }
    });

    $('.wcs-view-in-discussion-trigger').on('click', function(e){
        e.preventDefault();
        var viewUrl = $(this).data('url');
        var vus = viewUrl.split('#');
        var baseUrl = vus[0];
        var commentDomId = vus[1];
        if(WCS.BASE_THREAD_URL == baseUrl && $('#' + commentDomId).length <= 0){
            var commentParts = commentDomId.split('_');
            var commentId = commentParts[1];
            var ancestorId = parseInt($(this).data('ancestorid'));
            if(ancestorId > 0){
                //fetch ancestor and it will pull in child
                commentId = ancestorId;
            }
            WCS.loadNewComments(commentId, function(){
                setTimeout(function(){
                    var elem = document.getElementById(commentDomId);
                    elem.scrollIntoView();
                    WCS.CLOSE_SIDEBAR();
                }, 100);
            });

        }else{
                window.location.href = viewUrl;

            setTimeout(function(){
                WCS.CLOSE_SIDEBAR();
            }, 250);
        }
    });

    //WCS.PROFILE_OPEN = true;
    $('#wcs-signin-link').on('click', function(e){
        e.preventDefault();
        WCS.loadSidebarTemplate('login');
        WCS.setupProfileForm('login');

        return false;
    });

    $('.wcs-profile-settings-update-password').on('click', function(e){
        e.preventDefault();
        WCS.loadSidebarTemplate('update_password');
        WCS.setupProfileForm('update_password');

        return false;
    });

    //alert("setting up settings form");
    $('#wcs-edit-form').submit(function(e){
       e.preventDefault();
       //lets try HTML5 formdata object...
       var formData = new FormData(document.getElementById("wcs-edit-form"));

        var html = $('#template_loadinganimation').html();
        $('#wcs-overlay-sidebar').append(html);


       var xhr = new XMLHttpRequest();
       xhr.open('POST', '/ajax_comments/register_update_site_user/', true);
       xhr.onload = function () {
          if (xhr.status === 200)
          {
              var result = JSON.parse(xhr.responseText);
              $('#wcs-overlay-sidebar').find('.wcs-loading-animation-overlay').remove();
              if(result['success'] == "true"){
                    //do modal
                   // alert("do modal close");
                  //alert("Some success message will display in some location");
                  $('.wcs-profile-settings-edit-message').html("<div class='wcs-profile-settings-edit-success'>Your settings have updated successfully!</div>");
              }
              else{
                  //alert("failure: " + );
                  var setError = function(errorName){
                      if(result['errors'][errorName]){
                          $('.wcs-settings-form-err-' + errorName).html(result['errors'][errorName]);
                      }
                      else{
                          $('.wcs-settings-form-err-' + errorName).html("");
                      }

                  };

                  setError('full-name');
                  setError('email');
                  setError('username');
                  setError('password');
                  setError('social-username');
                  setError('dob');
                  setError('gender');
                  setError('zipcode');
                  setError('provider');
                  setError('other-provider');
                  //setError('terms-of-service');
                  setError('captcha');
                  if(result['errors']['msg']){
                      alert(result['errors']['msg']);
                  }

              }
          }
          else
          {
             alert('An error occurred!');
          }
       };

       xhr.send(formData);
    });

    $('.manage-notifications').on('change', 'input', function(e){


        //manage notification checkboxs here
    });

};
WCS.force_action = function(theAction, skipQuestion){
   if(theAction == 'accept_terms'){
       var res = false;
       if(!skipQuestion){
           WCS.showModal("You have not completed registration.  Do you want to complete registration to perform this action?", "Yes",
           function(doit)
           {
               if(!doit){
                   return false;
               }

               WCS.loadSidebarTemplate('register', true);
                WCS.setupProfileForm('register', true);
                $.ajax({
                     url: '/ajax_comments/get_user_private_profile',
                     data: {
                          private: 'true'
                     },
                     type: 'POST',
                     dataType: 'json',
                     success: function(resp)
                     {
                         var user = resp['user'];
                         user['newsletter_signup'] = 1;
                         WCS.fillSettingsData(user);
                     }
                });
           });
       }else{
           //it must be social registration... because you can't be logged in otherwise
           WCS.loadSidebarTemplate('register', true);
           WCS.setupProfileForm('register', true);
           $.ajax({
                url: '/ajax_comments/get_user_private_profile',
                data: {
                     private: 'true'
                },
                type: 'POST',
                dataType: 'json',
                success: function(resp)
                {
                    var user = resp['user'];
                    user['newsletter_signup'] = 1;
                    WCS.fillSettingsData(user);
                }
           });

       }
   }
   else if(theAction == 'confirm_email'){
        WCS.showModal("You have not confirmed your email.  Do you want to resend the registration email?", "Yes", function(doit)
        {
            if(doit){
                $.ajax({
                    url: '/ajax_comments/resend_registration_email',
                    data: {
                        send: 1,
                        access_token: WEBVIEW.access_token,
                        is_svengoolie: WCS.IS_SVENGOOLIE
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function(resp)
                    {

                    },
                    error: function(response)
                    {

                    }
                });
            }
        });
   }
};

WCS.fillSettingsData = function(user){
    $('input[name="wcs_email"]').val(user['email']);
    $('input[name="fullName"]').val(user['name']);

    //is social
    if(user['service'] == 'google' || user['service'] == 'facebook' || user['service'] == 'twitter'){
        $('input[name="social_username"]').val(user['display_name']);
        $('input[name="is_social"]').val(1);
        $('.wcs-profile-settings-email-username').hide();
        $('.wcs-profile-signup-username').hide();
        $('.wcs-profile-signup-password').hide();
        $('.wcs-profile-settings-social-username').show();
        if(user['email'] && user['email'].length > 3){
            $('input[name="wcs_email"]').addClass("wcs-profile-settings-form-readonly");
            $('input[name="wcs_email"]').attr('readonly', 'readonly');
            $('input[name="wcs_email"]').after('<span class="wcs-settings-form-disclaimer">This email address is tied to your ' + user['service'] +
                    ' account and can' + "'" + 't be edited</span>');

        }
    }
    else{
        $('.wcs-profile-settings-email-username').show();
        $('.wcs-profile-signup-username').hide();
        $('.wcs-profile-signup-password').hide();
        $('input[name="username"]').val(user['display_name']);
        $('input[name="username1"]').val(user['display_name']);
        $('input[name="wcs_email"]').addClass("wcs-profile-settings-form-readonly");
        if(user['email'] && user['email'].length > 3){
            $('input[name="wcs_email"]').attr('readonly', 'readonly');
            $('input[name="wcs_email"]').after('<span class="wcs-settings-form-disclaimer">This email address is tied to your ' + user['service'] +
                    ' account and can' + "'" + 't be edited</span>');
        }
    }

    $('input[name="wcs_zipcode"]').val(user['zipcode']);
    var option = '';
    if(user['provider']){
        if(user['provider'].substring(0, 6) == "Other:"){
            $('input[name="other_provider"]').val(user['provider'].substring(7));
            $('.wcs-profile-settings-other-provider').show();
            option = 'provider not listed';
        }else{
            $('.wcs-profile-settings-other-provider').hide();
            option = user['provider'];
        }
    }

    WCS.load_providers(option);

    $('select[name="gender"]').val(user['gender']);

    if(user['dob']){
        var dobSplit = user['dob'].split('-');
        if(dobSplit.length == 3){
            var year = parseInt(dobSplit[0].replace(/\b0+/g, '')).toString();
            var month = parseInt(dobSplit[1].replace(/\b0+/g, '')).toString();
            var day = parseInt(dobSplit[2].replace(/\b0+/g, '')).toString();
            $('select[name="dobYear"]').val(year);
            $('select[name="dobMonth"]').val(month);
            $('select[name="dobDay"]').val(day);
        }
    }
};
WCS.showModal = function(msg, buttonText, callback, hasInput){

        $('#wcs-overlay-modal').addClass('wcs-overlay-open');
        var cancelText = "Cancel";
        if(buttonText.indexOf("|") >= 0){
            var buttonParts = buttonText.split('|');
            buttonText = buttonParts[0];
            cancelText = buttonParts[1];
        }
        var getInput = hasInput;
        if(hasInput){
            msg += '<br><br><input type="text" id="showmodal_input" value="" />';
        }

        $('.wcs-modal-innertext').html(msg);
        $('.wcs-modal-btns-cancel').off('click');
        $('.wcs-modal-btns-cancel').on('click', function(){
            callback(false);
            $('#wcs-overlay-modal').removeClass('wcs-overlay-open');
            WCS.MODAL_OPEN = false;
        });

        $('.wcs-modal-btns-submit').html(buttonText);
        $('.wcs-modal-btns-submit').off('click');
        $('.wcs-modal-btns-submit').on('click', function(){
            if(getInput){
               var retVal = $('#showmodal_input').val();
               callback(retVal);
            }else{
                callback(true);
            }
            $('#wcs-overlay-modal').removeClass('wcs-overlay-open');
            WCS.MODAL_OPEN = false;
        });
        WCS.MODAL_CALLBACK = callback;
        setTimeout(function(){
            WCS.MODAL_OPEN = true;
        }, 500);

    $('.wcs-modal-btns-submit').html(buttonText);
    if(cancelText == ''){
        $('#wcs-overlay-modal .wcs-modal-btns-cancel').hide();
    }else{
        $('#wcs-overlay-modal .wcs-modal-btns-cancel').show();
        $('#wcs-overlay-modal .wcs-modal-btns-cancel').html(cancelText);
    }
    /*
    $('.wcs-modal-btns-submit').off('click');
    $('.wcs-modal-btns-submit').on('click', function(){
        callback(true);
        $('#wcs-overlay-modal').removeClass('wcs-overlay-open');
        WCS.MODAL_OPEN = false;
    });
    WCS.MODAL_CALLBACK = callback;
    setTimeout(function(){
        WCS.MODAL_OPEN = true;
    }, 500);
      */

};
WCS.setDeleted = function(commentId){
    var $comment = $('#comment_' + commentId);
    var dateHtml = $comment.find('.wcs-comment-item-date').html();
    $comment.find('.wcs-comment-flag').first().remove();
    $comment.find('.wcs-comment-item-header').first().remove();
    $comment.find('.wcs-comment-item-text').first().remove();
    $comment.find('.wcs-comment-item-footer').first().remove();

    var $deleteHeader = $($('#template_deleted_comment').html()).find('.wcs-comment-item-header').unwrap();
    var $deleteText = $($('#template_deleted_comment').html()).find('.wcs-comment-item-text-removed').unwrap();
    $comment.prepend($deleteText);
    $comment.prepend($deleteHeader);
    setTimeout(function(){
        $comment.find('.wcs-comment-item-date').html(dateHtml);
    }, 10);
};

var newCommentCount = 0;
var conn;
if (window["WebSocket"]) {
    conn = new ReconnectingWebSocket("wss://socket2me.weigelbroadcasting.com:8080/metvthread/"+WCS.THREAD_ID);
    conn.onmessage = function (evt) {
        newCommentCount++;
        if(newCommentCount>0){
            $('.view-more-newcomment').html("Load " + newCommentCount + " new comments <i class='fas fa-angle-down'></i>");
            $('.view-more-newcomment').show();
        }
        //var data = JSON.parse(evt.data);
        //var song = data[0];
    };
} else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
}

var commentsLastChecked = Date.now();
WCS.checkNewComments = function(){
    //console.log("checking");
    return;
    nownow = Date.now();
    timediff = nownow - commentsLastChecked;
    if(timediff < 60000){
        //console.log("too soon");
        return;
    }
    commentsLastChecked = nownow;
   $.ajax({
        url: '/ajax_comments/get_new_comment_count',
        data: {
             max_id: WCS.MAX_ID,
             thread_id: WCS.THREAD_ID,
             is_svengoolie: WCS.IS_SVENGOOLIE
        },
        type: 'POST',
        dataType: 'json',
        success: function(data)
        {
            var newTotal = parseInt(data['new_total']);
            if(newTotal > 0){
                //already updated button
                if(WCS.NEW_COMMENT_TOTAL == newTotal){
                    return;
                }
                WCS.NEW_COMMENT_TOTAL = newTotal;
                //alert("has new comments");
                $('.view-more-newcomment').html("Load " + newTotal + " new comments <i class='fas fa-angle-down'></i>");
                $('.view-more-newcomment').show();
            }
        },
        error: function(response)
        {
            console.log(response.responseText);
            console.log(response);
        }
    });

};

WCS.loadNewComments = function(specificId, callback){
    var requestUrl = '/ajax_comments/get_specific_topcomment';
    if(!specificId){
        requestUrl = '/ajax_comments/get_new_comments';
    }
    $.ajax({
        url: requestUrl,
        data: {
             max_id: WCS.MAX_ID,
             thread_id: WCS.THREAD_ID,
             comment_id : specificId,
             is_svengoolie : WCS.IS_SVENGOOLIE
        },
        type: 'POST',
        dataType: 'json',
        success: function(data)
        {
            var total = parseInt(data['new_total']);
            if(total > 0){
                if(data['new_max'] > 0){
                    WCS.MAX_ID = parseInt(data['new_max']);
                    WCS.NEW_COMMENT_TOTAL = 0;
                }


                var topComments = data['topcomments'];
                var subComments = data['subcomments'];

                $(topComments).each(function(i, resp){
                    var $comment = $($('#template_acomment').html());
                    if(resp['active'] == 0){
                        $comment = $($('#template_deleted_comment').html());
                        if(!resp['has_children']){
                            return;
                        }
                    }

                    $comment.find('.wcs-user-trigger img').attr('src', resp['profile_image']);
                    $comment.find('.wcs-user-trigger').attr('data-userid', resp['user_id']);

                    $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name'] + "|" + resp['parent_id']);
                    $comment.attr('data-isadmin', resp['is_admin']);
                                       $comment.addClass('wcs-comment-item-parent');
                    //need to add reply box
                    var replyBox = $('#template_reply_container').html();
                    $comment.append(replyBox);
                    $comment.find('.wcs-user-displayname').html(resp['display_name']);
                    $comment.find('.wcs-comment-item-date').html(resp['timeago']);
                    if(resp['active'] == 0){
                        $comment.find('.wcs-comment-item-text').html('<span class="wcs-comment-item-text-removed">This comment has been removed.</span>');
                    }else{
                        $comment.find('.wcs-comment-item-text').html(resp['generated_comment']);
                    }
                    if(WCS.USER_ID != resp['user_id']){
                        $comment.find('.wcs-delete-trigger').attr('style', 'display:none');
                    }
                    if(resp.parent_id == 0){
                        $comment.find('.wcs-other-user').remove();
                        $comment.find('.wcs-comment-item-username i').remove();
                    }else{
                        $comment.find('.wcs-other-user').attr('data-userid', resp.parent_userid);
                        $comment.find('.wcs-other-user').html(resp.parent_username);
                    }

                    //xxxxxxxxxxxxxxxx
                    if(resp.is_admin == 1){
                       $comment.find('.wcs-user-displayname').addClass('wcs-verified-user');
                    }else{
                        $comment.find('.wcs-user-displayname').removeClass('wcs-verified-user');
                    }

                    var totalText = "";
                    if(resp['upvotes'] > 0){
                        totalText = " (" + resp['upvotes'] + ')';
                    }
                    var html = "";
                    if(resp['upvoted']){
                        html = '<i class="fas fa-heart"></i>' + " Unlike" + totalText;
                        $comment.find('.wcs-like-trigger').addClass('wcs-like-btn-active');
                    }else{
                        html = '<i class="fas fa-heart"></i>' + " Like" + totalText;
                    }

                  $comment.find('.wcs-like-trigger').html(html);
                    $comment.attr('data-id', resp['id']);
                    $comment.attr('id',  "comment_" + resp['id']);
                    if($('.wcs-comment-container').find('#comment_' + resp['id']).length <= 0){
                        if(data['new_max'] > 0){
                            $('.wcs-comment-container').prepend($comment);
                        }else{
                            $('.wcs-comment-container').append($comment);
                        }
                    }
                });
                setTimeout(function(){

                    $(subComments).each(function(i, resp){
                        console.log("adding child ");
                        console.log(resp);
                        var $comment = $($('#template_acomment').html());

                        $comment.find('.wcs-user-trigger img').attr('src', resp['profile_image']);
                        $comment.find('.wcs-user-trigger').attr('data-userid', resp['user_id']);


                        $comment.find('.wcs-other-user').attr('data-userid', resp['parent_userid']);
                        $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name'] + "|" + resp['parent_id']);
                        $comment.attr('data-isadmin', resp['is_admin']);

                        $comment.find('.wcs-other-user').html(resp['parent_username']);
                        $comment.find('.wcs-user-displayname').html(resp['display_name']);
                        $comment.find('.wcs-comment-item-date').html(resp['timeago']);
                        $comment.find('.wcs-comment-item-text').html(resp['generated_comment']);
                        if(resp.is_admin == 1){
                           $comment.find('.wcs-user-displayname').addClass('wcs-verified-user');
                        }else{
                            $comment.find('.wcs-user-displayname').removeClass('wcs-verified-user');
                        }

                        var totalText = "";
                        if(resp['upvotes'] > 0){
                            totalText = " (" + resp['upvotes'] + ')';
                        }
                        var html = "";
                        if(resp['upvoted']){
                            html = '<i class="fas fa-heart"></i>' + " Unlike" + totalText;
                            $comment.find('.wcs-like-trigger').addClass('wcs-like-btn-active');
                        }else{
                            html = '<i class="fas fa-heart"></i>' + " Like" + totalText;
                        }
                        $comment.find('.wcs-like-trigger').html(html);

                        $comment.attr('data-id', resp['id']);
                        $comment.attr('id',  "comment_" + resp['id']);
                        if(WCS.USER_ID != resp['user_id']){
                            $comment.find('.wcs-delete-trigger').attr('style', 'display:none');
                        }

                        $comment.addClass('wcs-comment-item-reply');
                        var $container = $('#comment_' + resp['ancestor_id']);

                        if($('.wcs-comment-container').find('#comment_' + resp['id']).length <= 0){
                            $container.find('.wcs-reply-container').before($comment);
                        }
                    });
                    setTimeout(function(){
                        callback();
                    }, 50);
                }, 500);
                WCS.LOADING_NEW_COMMENTS = false;
                $('.wcs-comments .wcs-loading-animation-overlay').remove();
            }
        },
        error: function(response)
        {
            console.log(response.responseText);
            console.log(response);
        }
    });
};
WCS.loadMoreProfileComments = function(){
    $.ajax({
        url:'/ajax_comments/load_more_profile_comments/',
        data:{
            page: WCS.PROFILE_COMMENT_PAGE,
            user_id: WCS.PROFILE_COMMENT_USER,
            is_svengoolie: WCS.IS_SVENGOOLIE 
        },
        dataType:'json',
        type:'POST',
        success:function(resp){
            var comments = resp['comments'];
            var hasMore = resp['has_more'];
            WCS.appendProfileComments(comments, hasMore);
        },
        error: function(response)
        {
            console.log(response.responseText);
            console.log(response);
        }
    });
}

WCS.appendProfileComments = function(comments, has_more){
    $(comments).each(function(){
        console.log("comment");
        console.log(this);
        //{"op":"do_navigation","key":"favorites",
        //"type":"quiz","fullurl":"https://local.metv.com//quiz/do-you-know-who-sings-these-flintstones-songs?contentview=2",
        //"itemurl":"do-you-know-who-sings-these-flintstones-songs",
        //"services":"https://services.weigelbroadcasting.com/metv/quiz/1717"}        
        let myViewUrl = this.thread_viewurl;
        let myThreadUrl = this.thread_url;
        //console.log("this is the check for svengoolie" + WCS.IS_SVENGOOLIE);
        if(WCS.IS_SVENGOOLIE == 1){
            myViewUrl = '/svengoolie' + this.thread_viewurl;
            myThreadUrl = '/svengoolie' + this.thread_url;
        }
        
        var $comment = $($('#template_listcomment').html());
        //$comment.find('.wcs-comment-post-title a').attr('href', myThreadUrl);
        $comment.find('.wcs-comment-post-title').html(this.thread_title);

        
        
        $comment.find('.wcs-avatar-img').attr('src', this.profile_image);
        $comment.find('.wcs-user-displayname').html(this.display_name);
        $comment.find('.wcs-user-displayname').attr('data-userid', this.user_id);
        if(this.parent_id == 0){
            $comment.find('.wcs-other-user').remove();
            $comment.find('.wcs-comment-item-username i').remove();
        }else{
            $comment.find('.wcs-other-user').attr('data-userid', this.parent_userid);
            $comment.find('.wcs-other-user').html(this.parent_username);
            if(this.parent_admin == 1){
                $comment.find('.wcs-other-user').addClass('wcs-verified-user');
            }else{
                $comment.find('.wcs-other-user').removeClass('wcs-verified-user');
            }
        }
        $comment.find('.wcs-comment-item-date').html(this.timeago);
        $comment.find('.wcs-comment-item-text').html(this.generated_comment);
        /*
        $comment.find('.wcs-view-in-discussion-trigger').attr('data-url', myViewUrl);
        $comment.find('.wcs-view-in-discussion-trigger').attr('data-ancestorid', this.ancestor_id);
        */
        
if(WEBVIEW.is_webview){
            var contentId = "";
            var theType = 'stories';
            if(this.thread_url.indexOf('quiz') > 0){
                theType = 'quiz';
            }
            else if(this.thread_url.indexOf('list') > 0){
                theType = 'lists';                
            }
            /*
            $comment.find('.wcs-view-in-discussion-trigger').attr('href', 'javascript:void(0);');
            $comment.find('.wcs-view-in-discussion-trigger').attr('data-key', 'comment-profile');
            $comment.find('.wcs-view-in-discussion-trigger').attr('data-type', theType);
            $comment.find('.wcs-view-in-discussion-trigger').attr('data-fullurl', 'https://www.metv.com' + myThreadUrl + '?contentview=2#comment_' + this.id);
            $comment.find('.wcs-view-in-discussion-trigger').attr('data-itemurl', myThreadUrl + '#comment_' + this.id);
            $comment.find('.wcs-view-in-discussion-trigger').attr('data-services', 'https://services.weigelbroadcasting.com/metv/' + theType + '/' + this.parent_id);   
            
            $comment.find('.wcs-comment-post-title a').attr('href', 'javascript:void(0);');
            $comment.find('.wcs-comment-post-title a').attr('data-key', 'comment-profile');
            $comment.find('.wcs-comment-post-title a').attr('data-type', theType);
            $comment.find('.wcs-comment-post-title a').attr('data-fullurl', 'https://www.metv.com' + myThreadUrl + '?contentview=2');
            $comment.find('.wcs-comment-post-title a').attr('data-itemurl', myThreadUrl);
            $comment.find('.wcs-comment-post-title a').attr('data-services', 'https://services.weigelbroadcasting.com/metv/' + theType + '/' + this.parent_id);            
            */
        }        
        if(this.is_liked){
            $comment.find('.wcs-like-trigger').addClass('wcs-like-btn-active');
        }
        if(this.is_admin == 1){
            $comment.find('.wcs-user-displayname').addClass('wcs-verified-user');
        }else{
            $comment.find('.wcs-user-displayname').removeClass('wcs-verified-user');
        }

        //actually prepend so before loadmore
        $('.wcs-profile-comments-wrap .wcs-profile-comments-load-more').before($comment);
    });
    if(has_more){
        $('.wcs-profile-comments-load-more').show();
    }else{
        $('.wcs-profile-comments-load-more').hide();
    }

};

WCS.refreshAllComments = function(){
    if(WCS.FILTER_PAGE == 0){
        var html = $('#template_loadinganimation').html();
        $('.wcs-comment-container').html(html);
        $('.view-more-topcomment').hide();
    }

    $.ajax({
        url:'/ajax_comments/reload_comments/?' + new Date().getTime(),
        data:{
            filter_type: WCS.FILTER_TYPE,
            filter_page: WCS.FILTER_PAGE,
            thread_id: WCS.THREAD_ID,
            is_svengoolie: WCS.IS_SVENGOOLIE
        },
        dataType:'json',
        type:'POST',
        success:function(allData){
            if(WCS.FILTER_PAGE == 0){
                $('.wcs-comment-container').html("");
            }
            var data = allData['comments'];
            var totalTop = allData['total_topcomments'];
            var hasMore = allData['has_more'];
            var hasExtraMore = allData['has_extra_more'];
            var commentsLeft = allData['comments_left'];
            //just do top comments for now
            $(data).each(function(i, resp){
                var $comment = $($('#template_acomment').html());
                if(resp['active'] == 0){
                    $comment = $($('#template_deleted_comment').html());
                    if(!resp['has_children']){
                        return;
                    }
                }

                $comment.find('.wcs-user-trigger img').attr('src', resp['profile_image']);
                $comment.find('.wcs-user-trigger').attr('data-userid', resp['user_id']);

                $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name'] + "|" + resp['parent_id']);
                $comment.attr('data-isadmin', resp['is_admin']);

                $comment.addClass('wcs-comment-item-parent');
                //need to add reply box
                var replyBox = $('#template_reply_container').html();
                $comment.append(replyBox);
                $comment.find('.wcs-user-displayname').html(resp['display_name']);
                $comment.find('.wcs-comment-item-date').html(resp['timeago']);
                if(resp['active'] == 0){
                    $comment.find('.wcs-comment-item-text').html('<span class="wcs-comment-item-text-removed">This comment has been removed.</span>');
                }else{
                    $comment.find('.wcs-comment-item-text').html(resp['generated_comment']);
                }
                if(WCS.USER_ID != resp['user_id']){
                    $comment.find('.wcs-delete-trigger').attr('style', 'display:none');
                }
                if(resp.parent_id == 0){
                    $comment.find('.wcs-other-user').remove();
                    $comment.find('.wcs-comment-item-username i').remove();
                }else{
                    $comment.find('.wcs-other-user').attr('data-userid', resp.parent_userid);
                    $comment.find('.wcs-other-user').html(resp.parent_username);
                }

                var totalText = "";
                if(resp['upvotes'] > 0){
                    totalText = " (" + resp['upvotes'] + ')';
                }
                var html = "";
                if(resp['upvoted']){
                    html = '<i class="fas fa-heart"></i>' + " Unlike" + totalText;
                    $comment.find('.wcs-like-trigger').addClass('wcs-like-btn-active');
                }else{
                    html = '<i class="fas fa-heart"></i>' + " Like" + totalText;
                }


                $comment.find('.wcs-like-trigger').html(html);
                $comment.attr('data-id', resp['id']);
                $comment.attr('id',  "comment_" + resp['id']);
                $('.wcs-comment-container').append($comment);

            });
            setTimeout(function(){
                $(data).each(function(i, parentComment){

                    if(parentComment['has_more']){
                        var moreHtml = '<a class="view-prev-replies view-more-subcomment" data-ancestorid="' + parentComment['id'] + '" href="#!">Load previous comments <i class="fas fa-angle-down"></i></a>';
                        var $container = $('#comment_' + parentComment['id']);
                        $container.find('.wcs-reply-container').before(moreHtml);
                    }
                    console.log("parent comment " + parentComment['id']);
                    console.log("has children " + parentComment['children'].length);
                    $(parentComment['children']).each(function(i, resp){
                        console.log("adding child ");
                        console.log(resp);
                        var $comment = $($('#template_acomment').html());

                        $comment.find('.wcs-user-trigger img').attr('src', resp['profile_image']);
                        $comment.find('.wcs-user-trigger').attr('data-userid', resp['user_id']);


                        $comment.find('.wcs-other-user').attr('data-userid', resp['parent_userid']);
                        $comment.attr('data-replyinfo', resp['user_id'] + "|" + resp['display_name'] + "|" + resp['parent_id']);
                        $comment.attr('data-isadmin', resp['is_admin']);

                        $comment.find('.wcs-other-user').html(resp['parent_username']);
                        $comment.find('.wcs-user-displayname').html(resp['display_name']);
                        $comment.find('.wcs-comment-item-date').html(resp['timeago']);
                        $comment.find('.wcs-comment-item-text').html(resp['generated_comment']);
                        var totalText = "";
                        if(resp['upvotes'] > 0){
                            totalText = " (" + resp['upvotes'] + ')';
                        }
                        var html = "";
                        if(resp['upvoted']){
                            html = '<i class="fas fa-heart"></i>' + " Unlike" + totalText;
                            $comment.find('.wcs-like-trigger').addClass('wcs-like-btn-active');
                        }else{
                            html = '<i class="fas fa-heart"></i>' + " Like" + totalText;
                        }
                        $comment.find('.wcs-like-trigger').html(html);

                        $comment.attr('data-id', resp['id']);
                        $comment.attr('id',  "comment_" + resp['id']);
                        if(WCS.USER_ID != resp['user_id']){
                            $comment.find('.wcs-delete-trigger').attr('style', 'display:none');
                        }
  $comment.addClass('wcs-comment-item-reply');
                        var $container = $('#comment_' + resp['ancestor_id']);
                        //alert("adding child to " + '#comment_' + resp['parent_id']);
                        $container.find('.wcs-reply-container').before($comment);
                    });
                });
            }, 500);

            if(hasMore && commentsLeft > 0){
                if(hasExtraMore){
                    var text = "Load more comments <i class='fas fa-angle-down'></i>"; //"Load next 10 out of " + commentsLeft + " comments left ";
                    $('.view-more-topcomment').html(text);
                     $('.view-more-topcomment').show();
                }else{
                    var text = "Load more comments <i class='fas fa-angle-down'></i>"; //"Load next " + commentsLeft + " comments";
                    $('.view-more-topcomment').html(text);
                     $('.view-more-topcomment').show();
                }
            }else{
                //hide button completely
                $('.view-more-topcomment').hide();
            }

        }, error : function(data){

        }
    });

};

WCS.resetFormElement = function(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
};


String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

WCS.load_providers = function(exactText)
{
    var zipcode = $("#wcs_zipcode").val();
    var selbox = $("#wcs_provider");
    //$('#dk_container_channel').remove();

    if(zipcode.length > 4){
        WCS.provider_status("Searching providers...");

        $.ajax({
            url:'/ajax_comments/zipsearch/',
            data:{zipcode:zipcode},
            dataType:'json',
            type:'POST',
            success:function(data){
                console.log("locators");
                console.log(data);
                var locators = data.channels;
                var count = data.count;
                console.log(locators);
                var val;
                if(count){
                    WCS.provider_status("");

                    selbox.empty();
                    selbox.append('<option value="">-- Select from this list --</option>');
                    //$("#provider_input_select").fadeIn();

 if(exactText){
                        exactText = exactText.replaceAll(" ","_").replaceAll('/','').replaceAll('\/','');
                        exactText = exactText.replaceAll(" ", '').replaceAll('_', '');
                        exactText = exactText.replace(/(?:\r\n|\r|\n)/g, '');
                    }else{
                        exactText = "";
                    }
                    $.each(locators,function(index,channels){
                        if(index){
                            var key = index.replaceAll(" ","_").replaceAll('/','');
                            key = key.replace(" ", '');
                            key = key.replace(/(?:\r\n|\r|\n)/g, '');
                            selbox.append('<optgroup label="'+index+'" id="wcs-'+key+'"></optgroup>');
                            $.each(channels,function(c,channel){
                                if(channel.position.indexOf('-') !== -1){
                                    channel.position = channel.position.split('-')[0];
                                }
                                val = channel.id+'|' + index + '|' +channel.name+'|'+channel.position;
                                val = val.replaceAll(" ","").replaceAll('/','');
                                val = val.replaceAll(" ", '').replaceAll('_', '');
                                val = val.replace(/\//g, '');
                                val = val.replace(/(?:\r\n|\r|\n)/g, '');
                                var displayChannel = channel.broadcaster + " " + channel.position;
                                if(exactText != '' && exactText == val){
                                   $("#wcs-"+key).append('<option data-marketid="' + channel.marketid + '" data-channelid="' + channel.channelid + '" data-display="' + displayChannel + '" value="'+val+'" selected>'+channel.name+': '+channel.position+'</option>');
                                   $('#wcs_provider_display').val(displayChannel);
                                }else{
                                   $("#wcs-"+key).append('<option data-marketid="' + channel.marketid + '" data-channelid="' + channel.channelid + '" data-display="' + displayChannel + '" value="'+val+'">'+channel.name+': '+channel.position+'</option>');
                                }
                             });
                        }
                    });
                            if(exactText == 'provider not listed'){
                        selbox.append('<option selected="selected" value="provider not listed">Provider not listed</option>');
                    }else{
                        selbox.append('<option value="provider not listed">Provider not listed</option>');
                    }
                } else {
                    WCS.provider_status("");
                    selbox.empty();
                    selbox.append('<option value=""></option>');
                    if(exactText == 'provider not listed'){
                        selbox.append('<option selected="selected" value="provider not listed">Provider not listed</option>');
                    }else{
                        selbox.append('<option value="provider not listed">Provider not listed</option>');
                    }
                }
            },
            error:function(packet){


            }
        });
    }
}

WCS.provider_status = function(){

}

WCS.setupNotificationHandlers = function(isApp){

        var switches = document.querySelectorAll('.custom-switch');
        for(let i = 0; i < switches.length; i++){
            var switchId = switches[i].id;
            //var use_this_class = switches[i].className.split(" ")[2];
            //use_this_class = "." + use_this_class;

            new DG.OnOffSwitchAuto({
                cls: '#' + switchId,
                height: 24,
                trackColorOn:'#F9F9F9',
                trackColorOff:'#222',
                textColorOn: '#222',
                textColorOff: '#222',
                textOn:'On',
                textOff:'Off',
                listener:function(name, checked){
                    var setDisabled = 0;
                    if(!checked){
                        setDisabled = 1;
                    }
                    var activateNotification = function(name){
                        $.ajax({
                            url: '/ajax_comments/manage_notification_settings',
                            data: {
                                 is_disabled: setDisabled,
                                 is_single: false,
                                 name: name,
                                 access_token: WEBVIEW.access_token
                            },
                            type: 'POST',
                            dataType: 'json',
                            success: function(data)
                            {
                                //console.log("refreshing notifications with ");
                                //console.log(data);
                                //WCS.enable_notification_type(data.id, data.name, data.disabled);
                                console.log("notification refresh setup");

                                WCS.refreshNotifications(data['enable_email_alerts'],
                                    data['enable_push_alerts'], data['enable_browser_alerts'],
                                    data['notification_settings']);
                            },
                            error: function(response)
{
                                alert("Error - updating notification settings");
                                console.log(response.responseText);
                                console.log(response);
                            }

                        });

                    }
                    if(name == 'enable_email_alerts'){
                        //check email is confirmed... if not show
                        if(WCS.emailConfirmed == 0){
                            WCS.force_action('confirm_email');
                            return false;
                        }
                        activateNotification(name);
                    }else if(name == 'enable_browser_alerts'){
                        if(setDisabled == 0){
                            console.log("requesting permission");
                            if ("Notification" in window) {
                                WCS.requestBrowserNotificationPermission(function(success){
                                    if(!success){
                                        DG.switches['#' + name].uncheck();
                                    }else{
                                        //it worked?
                                        //this turns on browser notifications
                                        activateNotification(name);
                                    }
                                });
                            }else{
                                WCS.showModal("We're sorry, you're browser doesn't seem to allow browser notifications!", "OK", function(){});
                                DG.switches['#' + name].uncheck();
                            }
                        }else{
                            //this turns off browser notifications
                            activateNotification(name);
                        }
                        console.log("done");

 }else if(name == 'enable_app_alerts'){
                        if(!WEBVIEW.is_webview){
                            WCS.showModal("Please Download the MeTV app on iOS or Android to receive notifications as push alerts!", "OK", function(){});
                            DG.switches['#' + name].uncheck();
                        }else{
                            //alert("name is " + name);
                            //Do some message
                            if(setDisabled == 1){
                                DG.switches['#' + name].uncheck();
                                WEBVIEW.change_push_notifications(false);
                            }else{
                                appUpdatePushNotifications(true);
                                WEBVIEW.change_push_notifications(true);
                            }
                        }
                    }
                }
            });

        }

$('.manage-notifications').on('change', 'input', function(e){

        var id = $(this).data('id');
        var name = $(this).data('name');
        var val = "no";
        if($(this).is(':checked')){
            val = "yes";
        }

        $.ajax({
            url: '/ajax_comments/manage_notification_settings',
            data: {
                id: id,
                name: name,
                is_single: true,
                value: val,
                access_token: WEBVIEW.access_token
            },
            type: 'POST',
            dataType: 'json',
            success: function(data){

            },
            error: function(response){
                alert('Error updating settings');
                console.log(response.responseText);
            }
        });

    });

$('#noteworthy_send_time').on('change', function(e){

        var id = $(this).data('id');
        var name = $(this).data('name');
        var value = $(this).val();

        $.ajax({
            url: '/ajax_comments/manage_notification_settings',
            data: {
                id: id,
                name: name,
                is_single: true,
                value: value
            },
            type: 'POST',
            dataType: 'json',
            success: function(data){

            },
            error: function(response){
                alert('Error updating settings');
                console.log(response.responseText);
            }
        });

    });

 $('.reminders-list').on('click', '.reminder-remove', function(){
         var remindId = $(this).data('remindid');
         var remindType = $(this).data('remindtype');
        $.ajax({
            url: '/ajax_comments/remove_user_reminder',
            data: {
                reminder_id: remindId,
                remind_type: remindType,
                access_token: WEBVIEW.access_token
            },
            type: 'POST',
            dataType: 'json',
            success: function(data){
                if(data['success'] == 'true'){
                    $('#uremind_' + remindId).remove();
                    WCS.showModal("Your reminder has been deleted", "OK", function(){});
                }else{
                    WCS.showModal(data['msg'], "OK", function(){});
                }
            },
            error: function(response){
                alert('Error updating settings');
                console.log(response.responseText);
            }
        });
    });

 $('.reminders-list').on('change', '.reminder-changetype', function(){
         var remindId = $(this).data('remindid');
         var remindType = $(this).data('remindtype');
         var alertType = $(this).val();

        $.ajax({
            url: '/ajax_comments/changetype_user_reminder',
            data: {
                reminder_id: remindId,
                remind_type: remindType,
                alert_type:  alertType
            },
            type: 'POST',
            dataType: 'json',
            success: function(data){
                console.log("change result");
                console.log(data);
                if(data['success'] == 'true'){
                    if(data['needs_phone']){
                       WCS.showModal("Please Enter your Phone Number", "OK", function(val){
                            $.ajax({
                                url: '/ajax_comments/update_user_reminder_phone',
                                data: {
                                    reminder_id: remindId,
                                    remind_type: remindType,
                                    reminder_phone: val
                                },
                                type: 'POST',
                                dataType: 'json',
                                success: function(data){

                                },
                                error: function(response){
                                    alert('Error updating settings');
                                    console.log(response.responseText);
                                }
                            });
                       }, true);
                    }
                }else{
                    WCS.showModal("The reminder could not be updated", "OK", function(){});
                }
            },
            error: function(response){
                alert('Error updating settings');
                console.log(response.responseText);
            }

                    });
    });

}

WCS.is_invalid_user = function(msg, title, desc){
    /*
    WCS.DESIRED_ACTION = msg;
    WCS.DESIRED_TITLE = title;
    WCS.DESIRED_DESCRIPTION = desc;
    if(WCS.USER_ID <= 0){
        if(WCS.RETURN_USER){
            WCS.loadSidebarTemplate('login')
            WCS.setupProfileForm('login');
        }else{
            WCS.loadSidebarTemplate('login');
            WCS.setupProfileForm('login');
        }
        return true;
    }
    if(WCS.termsAccepted == 0){
        WCS.force_action('accept_terms', true);
        return true;
    }else if(WCS.emailConfirmed == 0){
        WCS.force_action('confirm_email');
        return true;
    }

    return false;
    */
}
function loginSuccess(loggeduser, noParse, skipDialogs){

    //need to have
    //id, display_name, profile_image, terms_accepted, email_confirmed

    var userData;
    if(noParse){
        userData = loggeduser;
    }else{
        userData = JSON.parse(loggeduser);
    }
    //console.log("user data");
    //console.log(userData);
    WCS.USER_ID = userData['id'];

    //if just registered shouldn't close the sidebar
    //could be on login page...
    if(WCS.SIDEBAR_PAGE != 'register'){
        WCS.CLOSE_SIDEBAR();
    }
    $('.wcs-post-comment-header .wcs-user-displayname').html(userData['display_name']);
    $('.wcs-post-comment-header .wcs-user-displayname').data('userid', WCS.USER_ID);
    $('.wcs-post-comment-user-settings').data('userid', WCS.USER_ID);
    $('.wcs-post-comment-header .wcs-avatar').attr('src', userData['profile_image']);
    $('.wcs-post-comment-header .wcs-avatar').data('userid', WCS.USER_ID);
    $('.wcs-profile-header-user-avatar .wcs-avatar').attr('src', userData['profile_image']);
    $('.wcs-post-comment-login').hide();
    $('.wcs-post-comment-header').show();

    //go through each comment, activate delete if user matches
    $('.wcs-comment-item-reply').each(function(){
        var replyInfo = $(this).data('replyinfo');
        var userId = replyInfo.split('|')[0];
        //console.log("comment userid " + userId + " vs " + WCS.USER_ID);
        if(WCS.USER_ID == userId){
            //console.log("activating delete for subcomment " + this.id);
            $(this).find('.wcs-delete-trigger').show();
        }
    });
    $('.wcs-comment-item-parent').each(function(){
        var replyInfo = $(this).data('replyinfo');
        var userId = replyInfo.split('|')[0];
        //console.log("comment userid " + userId + " vs " + WCS.USER_ID);
        if(WCS.USER_ID == userId){
            //console.log("activating delete for topcomment " + this.id);
            $(this).find('.wcs-delete-trigger').first().show();
        }
    });
     //header login / notifications
    $('#header-login-avatar').attr('src', userData['profile_image']);
    $('#header-login-avatar').data('userid', WCS.USER_ID);
    $('.logged-in').css('display', 'flex');
    $('.logged-out').css('display', 'none');
    $('.logged-in .user-login').data('userid', WCS.USER_ID);
    $('.logged-in .user-login').html('<a href="javascript:void(0);">' + userData['display_name'] + '</a>');

    //should hide the other one
    //    $('.wcs-post-comment-header').show();
    $('.wcs-post-comment-header-loggedout').hide();

    $('.wcs-post-comment-logged-in-btns').show();
    /*
    if(userData['new_notifications'] == 1){

        $('.no-notifications').html('');
        $('.no-notifications').append('<a href="/notifications"><span class="notifications"><img class="" src="images/notifications.svg" width="27"></a></span></a>');
         } else {

        $('.no-notifications').html('');
        $('.no-notifications').append('<a href="/notifications"><i class="fas fa-bell"></i></a>');

    }
    */
    WCS.termsAccepted = userData['terms_accepted'];
    WCS.emailConfirmed = userData['email_confirmed'];
    if(!skipDialogs){
        if(WCS.termsAccepted == 0){
            WCS.force_action('accept_terms', true);
            return false;
        }else if(WCS.emailConfirmed == 0){
            WCS.force_action('confirm_email');
            return false;
        }
    }
};

function appUpdatePushNotifications(isActive){

    var setDisabled = 0;
    if(!isActive){
        setDisabled = 1;
        DG.switches['#enable_app_alerts'].uncheck();
    }else{
        DG.switches['#enable_app_alerts'].check();
    }

    $.ajax({
        url: '/ajax_comments/manage_notification_settings',
        data: {
             is_disabled: setDisabled,
             is_single: false,
             name: 'enable_app_alerts',
             access_token: WEBVIEW.access_token
        },
        type: 'POST',
        dataType: 'json',
        success: function(data)
        {
            //WCS.enable_notification_type(data.id, data.name, data.disabled);
            console.log("notification refresh app_update");

            WCS.refreshNotifications(data['enable_email_alerts'],
                data['enable_push_alerts'], data['enable_browser_alerts'],
                data['notification_settings']);
        },
        error: function(response)
        {
            alert("Error - updating notification settings");
            console.log(response.responseText);
            console.log(response);
        }

    });
}

/* Number counter for Sven blog comments on night of airing */

function inVisible(element) {

// Check if the element is visible in the viewport
    var WindowTop = $(window).scrollTop();
    var WindowBottom = WindowTop + $(window).height();
    var ElementTop = element.offset().top;
    var ElementBottom = ElementTop + element.height();

    //animate the element if it is visible in the viewport
    if ((ElementBottom <= WindowBottom) && ElementTop >= WindowTop)
    animate(element);
}

function animate(element) {
    // start the count up animation if not yet animated
    if (!element.hasClass('animated')) {
        var maxval = element.data('max');
        var minval = element.data('min');

        element.addClass("animated").innerHTML;

        $({countNum: element.html()}).animate({countNum: maxval}, {
            duration: 6000,
            easing: 'swing',
            step: function() {
                element.html(Math.floor(this.countNum) + minval);
            },
            complete: function() {
                element.html(this.countNum + minval);
            }
        });
    }
}

// check if counter is in view //
$(window).scroll(function() {
    $("span[data-max]").each(function() {
        inVisible($(this));
    });
})

// start animation when in view //
const observer = new IntersectionObserver(intersections => {
    intersections.forEach(({
        target,isIntersecting }) =>
        {target.classList.toggle('start', isIntersecting);
    });
}, {
  threshold: 0
});

document.querySelectorAll('.pulse').forEach(item => {
  observer.observe(item);

});

