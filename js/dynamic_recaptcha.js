
$(document).ready(function () {
  $('body').on('change', '[name="terms"]', function () {
      console.log("terms box checked");
    if ($(this).is(':checked')) {
        console.log("is checked");
      // Check if the reCAPTCHA API is already loaded
      if (typeof grecaptcha === 'undefined') {
          console.log("undefined captcha script");
        // Create a script element to load reCAPTCHA dynamically
        var recaptchaScript = document.createElement('script');
        recaptchaScript.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        recaptchaScript.async = true;
        recaptchaScript.defer = true;
        $('head').append(recaptchaScript);
        var me = this;
        setTimeout(function(){
            if($(me).parents('.contact-form').length > 0){
                console.log('reloading contact');
                grecaptcha.render('recaptcha_contact', {
                    'sitekey' : WCS.CAPTCHA_SITE_KEY
                });            
            }
            else if($(me).parents('.wcs-profile-settings-form').length > 0){
                console.log('reloading wcs');                
                grecaptcha.render('recaptcha_site', {
                    'sitekey' : WCS.CAPTCHA_SITE_KEY
                });            
            }
            
        }, 1000);
        WCS.CAPTCHA_INCLUDED = true;
      } else {
        // If already loaded, re-render the widget if necessary.
        console.log("already loaded");
        WCS.CAPTCHA_INCLUDED = true;
      }
    }
  });
});


