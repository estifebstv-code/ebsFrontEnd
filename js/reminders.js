var REMINDER_TYPE = "series";
        function setReminderEvents(elem){
            var $reminder = $('.reminder-popout');
            var $block_reminder = $(elem);
            $('a.reminder-cancel').off('click');
            $('a.reminder-cancel').on('click', function(e) {                    
                    e.preventDefault();
                    if(WEBVIEW.is_webview){
                        WEBVIEW.close_reminder();
                    }else{
                        $reminder.hide();
                        $block_reminder.show();                        
                    }
            });
            $('#reminder-form').off('submit');
            $('#reminder-form').on('submit', function(e) {
                    e.preventDefault();
                    var $reminder_save = $('.reminder-save');
                    $reminder_save.val('SAVING').attr('disabled', true);
                    var scheduleId = $('#reminder-schedule_id').val();
                    var reminderType = $('#reminder-type').val();
                    var reminder = {
                            type : 'series',
                            schedule_id : scheduleId,                                
                            show_id : $('#reminder-show_id').val(),                                
                            text : $('#reminder-type-text').val(),
                            alert_type :  $('#reminder-type-alert').val()
                    };

                    if(reminderType == -1){
                        reminder.type = 'all';
                        reminder.house_num = "all"
                    }
                    else if(reminderType == 'episode' || reminderType == 'house'){
                        reminder.type = 'episode';
                        reminder.house_num = $('#reminder-house_num').val();
                    }
                    else{
                        //series
                        reminder.type = 'series';
                        reminder.house_num = reminderType;
                    }

                    if(WEBVIEW.is_webview){
                        reminder.access_token = WEBVIEW.access_token;
                    }

                    if(reminder.type == 'all'){
                        $.ajax({
                            url : '/reminder/set_schedule_reminder',
                            data : reminder,
                            dataType : 'json',
                            type : 'POST',
                            success : function(response) {
                                if (response.errors) {
                                    alert(response.errors.join('\n'));
                                    if(WEBVIEW.is_webview){
                                        $('.reminder-cancel').remove();
                                        $('.reminder-save').remove();
                                        $('.reminder-form').append('<h3 class="webview-reminder-success">' + response.errors.join('\n') + '</h3>');                                                                        
                                    }
                                    $reminder_save.val('SAVE').removeAttr('disabled');                                    
                                } else {
                                    if(WEBVIEW.is_webview){           
                                        $('.reminder-cancel').remove();
                                        $('.reminder-save').remove();
                                        $('.reminder-form').append('<h3 class="webview-reminder-success">Reminder Set!</h3>');
                                        setTimeout(function(){
                                             WEBVIEW.close_reminder();                                            
                                        }, 1000);
                                    }else{
                                        $reminder.hide();                                       
                                    }
                                    $block_reminder.show();
                                    $reminder_save.val('SAVE').removeAttr('disabled');
                                    reset_reminder();           
                                    alert('Reminder Set!');
                                }
                            },
                            error : function(qXHR, textStatus, errorThrown) {
                                alert(errorThrown);
                                $reminder_save.val('SAVE').removeAttr('disabled');
                            }
                        });                      
                    }else{
                        $.ajax({
                            url : '/reminder/set',
                            data : reminder,
                            dataType : 'json',
                            type : 'POST',
                            success : function(response) {
                                if (response.errors) {
                                    alert(response.errors.join('\n'));
                                    $reminder_save.val('SAVE').removeAttr('disabled');
                                } else {
                                    if(WEBVIEW.is_webview){                                
                                        $('.reminder-cancel').remove();
                                        $('.reminder-save').remove();
                                        $('.reminder-form').append('<h3 class="webview-reminder-success">Reminder Set!</h3>');
                                        setTimeout(function(){
                                             WEBVIEW.close_reminder();                                            
                                        }, 1000);
                                    }else{
                                        $reminder.hide();                                       
                                    }
                                    $block_reminder.show();
                                    $reminder_save.val('SAVE').removeAttr('disabled');
                                    reset_reminder();
                                    if(!WEBVIEW.is_webview){
                                        alert('Reminder Set!');
                                    }
                                }
                            },
                            error : function(qXHR, textStatus, errorThrown) {
                                alert(errorThrown);
                                $reminder_save.val('SAVE').removeAttr('disabled');
                            }
                        });                     
                    }

                    console.log(reminder);


                    /*
                    if(REMINDER_TYPE == "house" || reminder.schedule_id == -1){
                            reminder.type = 'house';
                            if(REMINDER_TYPE !== "house"){
                                    reminder.house_num = "all";  //ALL THE HOUSE NUMS MEANS ALL UPCOMING EPISODES
                            }else{
                                    reminder.house_num = $('#reminder-housenum').val();
                            }

                    }
                    else{

                    }
                */

            });

            $('.schedule-entry').hover(function(){
                    if($(this).find('.remindme-logo').length > 0){
                            $(this).find('.remindme-logo').addClass('animated swing');
                    }
            }, function(){
                    if($(this).find('.remindme-logo').length > 0){                    
                            $(this).find('.remindme-logo').removeClass('animated swing');
                    }
            });      
            $('.wcs-slideout-close-btn').off('click');
            $('.wcs-slideout-close-btn').on('click', function(){
                WCS.CLOSE_SIDEBAR();
            });
        };
        
$(document).ready(function() {
        var $reminder = $('.reminder-popout');
        var $block_reminder;
        $(document).on('click', '.show-reminder', function(e) {
            $block_reminder = $(this);
            var me = this;
                e.preventDefault(); 
            //not a reminder - button to watch livestream
            if(this.id == 'app_watch_live'){
                if(WEBVIEW.is_webview){
                    WEBVIEW.watch_livestream();
                }
                
                return;
            }
                var invalidPrompt;
                if(WEBVIEW.is_webview){                    
                    invalidPrompt = WEBVIEW.is_invalid_user("set-reminder", "to set a reminder");
                }else{
                    invalidPrompt = WCS.is_invalid_user('to set a reminder', "We can remind you when this show is on MeTV!", "Log in now or create an account to receive show reminders by text, email or mobile app alerts.");
                }                        
                if(invalidPrompt){     
                    return false;
                }         
                
                if(WEBVIEW.is_webview || WCS.ONLY_CONTENT){
                    
                    /*
                    //do not do this
                    $('.reminder-popout ').remove();
                    WCS.loadSidebarTemplate('reminders');
                    setTimeout(function(){   
                        WCS.OPEN_SIDEBAR();
                        setReminderData(me);       
                        setReminderEvents(me);
                    }, 500);
                    */
                   var showId = $(me).data('show_id');                   
                   var fullUrl = 'https://dev.metv.com/webview/' + '?key=set-reminder&access_token=' + WEBVIEW.access_token + '&show_id=' + showId + '&affiliate_id=' + WEBVIEW.market_id;
                   WEBVIEW.open_reminder(fullUrl);
                }else{
                    //USE POPPER INSTEAD FOR REMINDER MODAL                                            
                    $reminder.toggle();
                    setReminderData(me); 
                    if(WEBVIEW.is_webview){
                        $('.reminder-popout.slider').toggleClass('open');                    
                        var popper = document.querySelector('.reminder-popout.slider');
                        var me = this;
                        setTimeout(function(){
                            var popperInstance = new Popper(me, popper, {
                                placement: 'left',
                                positionFixed: true
                            });                        
                        }, 200);
                    }
                    else {
                        $('.reminder-popout.slider').toggleClass('open');        

                        var popper = document.querySelector('.reminder-popout');
                        var me = this;
                        setTimeout(function(){ 
                            var popperInstance = new Popper(me, popper, {
                                placement: 'left',
                                positionFixed: true
                            });        
                        }, 200);
                    }                                   
                    setReminderEvents(me);
                    $reminder.fadeIn();    
                    
                }
        });
        
        
        var setReminderData = function(elem){
            $('#timeperiod-container').show();
            $('#episode-description-container').hide();
            $('#reminder-show_id').val($(elem).data('show_id'));                    

            $('.reminder-show-title').html($(elem).data('title'));
            $('#reminder-schedule_id').val($(elem).data('schedule_id'));
            $('#reminder-house_num').val($(elem).data('house_num'));
            
            

            var timeslots = $(elem).data('timeslots');
            var timeslotData = new Array();
            if(timeslots){
                timeslotData = timeslots.split("*");                    
            }
            $('#reminder-type').empty();
            console.log("element");
            console.log(elem);
            console.log('PQOIWJERPOAJSDFPOIJQPWOIEJFPQOIWJEFPOQIJWE');
            if (elem.hasAttribute("data-schedule_id")) {
                var theVal = parseInt($(elem).data('schedule_id'));
                if(theVal > 0){
                    $('#reminder-type').append('<option value="episode">Just this episode</option>');
                }
            }
            
            if(elem.hasAttribute('data-remindtype')){
                var remindType = $(elem).data('remindtype');    
                if(remindType == 'house'){
                    $('#reminder-house_num').val($(elem).data('house_num'));
                    $('#reminder-type').append('<option value="house">Just this episode</option>');
                }
            }
            
            try{
                for(var x = 0; x < timeslotData.length; x++){
                    var tsData = timeslotData[x];
                    if(tsData.length > 3){
                        var timeData = tsData.split('|');
                        var house = timeData[0];
                        var slots = timeData[1];
                        $('#reminder-type').append('<option value="' + house + '">' + slots + '</option>');
                    }
                }
            }catch(ex){
                console.log("bad timeslots");
            }
            if(elem.hasAttribute('data-house_num')){
                $('#reminder-type').append('<option value="-1">All future episodes</option>'); 
            }

        }
        
}); 
/* Custom Select Box for Reminder Pop-Out */
//$('.reminder-timeslot').dropkick();

var msg="";
var reminder_type_text = $('input#reminder-type-text');
$('.reminder-type-alert').change(function(){
        //var placeholder = reminder_type_text.attr();
        if ($(this).val() == 'email') {
                msg = 'Enter your email address';
                reminder_type_text.attr('placeholder', msg);// : reminder_type_text.val(msg);
                if(WCS.USER_EMAIL !== ''){
                    reminder_type_text.val(WCS.USER_EMAIL);
                }
                $('.reminder-phone-container').css('display', 'block');
        } 
        else if($(this).val() == 'apppush'){
            $('.reminder-phone-container').css('display', 'none');
        }
        else {
            msg = 'Enter your phone number';
            reminder_type_text.attr('placeholder', msg);// : reminder_type_text.val(msg);
             $('.reminder-phone-container').css('display', 'block');
        }
});

function reset_reminder() {
        $('#reminder-type').val('');
        $('#reminder-type-text').val(''); 
        $('#reminder-type-alert').val();
        //never reset show id
        //$('#reminder-schedule_id').val('');
                        //$('#reminder-show_id').val('');
}



