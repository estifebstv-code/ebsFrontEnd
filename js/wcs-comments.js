var WCS = WCS || {};

//CODE COPIED FROM
//https://gist.github.com/poeticninja/0e4352bc80bc34fad6f7
WCS.dataURItoBlob = function(dataURI) {
    // convert base64 to raw binary data held in a string
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}    

    
WCS.doS3Upload = function(fileData, callBack){
    var theFile;
    var fileType;
    
    var forceSquare = false;
    var maxWidth = 900;
    var maxHeight = 680;
    if(fileData)
    {
        if(fileData == "avatar"){
            var imageUploader = $('#avatar_uploader').get(0);
            theFile = imageUploader.files[0];        
            fileType = theFile.type;      
            maxWidth = 200;
            maxHeight = 200;
            forceSquare = true;
        }
        else if(fileData == 'fan_upload'){
            var imageUploader = $('#upload_file_input').get(0);
            theFile = imageUploader.files[0];        
            fileType = theFile.type;      
            maxWidth = 2000;
            maxHeight = 2000;
            
        }
        else{
            theFile = WCS.dataURItoBlob(fileData);
            fileType = theFile.type;
            theFile.name = "userupload";
            if(fileType == 'image/jpg' || fileType == 'image/jpeg'){
                theFile.name += ".jpg";
            }
            if(fileType == 'image/png'){
                theFile.name += ".png";
            }
            if(fileType == 'image/gif'){
                theFile.name += ".gif";
            }            
        }
        //console.log("thefile type ");
        //console.log(fileType);
        //console.log("thefile.... ");
        //console.log(theFile);        
    }else{    
        var imageUploader = $('.wcs-selected-textarea').parent().find('.image_uploader').get(0);
        theFile = imageUploader.files[0];        
        fileType = theFile.type;     
    }    
    
    var theFilename = theFile.name;    
    //console.log("the filename");
    //console.log(theFilename);

    var dfd = new $.Deferred();    
     
    WCS.getImageDimensions(theFile, function(wt, ht, upimage){
        if(wt > maxHeight || ht > maxWidth || forceSquare){
            
            if(forceSquare && (wt < maxWidth || ht < maxHeight)){
                callBack(null, "Your avatar must be at least 200x200.  All images will be forced to be square.");        
                return;    
            }
            else if(fileType == 'image/gif' && (wt > maxWidth || ht > maxHeight)){
                callBack(null, "The uploaded gif is too big.  Please try againj with a smaller file.");
                return;
            }
            var aFile = WCS.resizeTooBigImage(upimage, maxWidth, maxHeight, forceSquare);
            
            if(aFile !== null){
                theFile = WCS.dataURItoBlob(aFile);
                fileType = 'image/png';
            }else{
                //failure?????
            }
        }  
        $.ajax({ 
            url: '/ajax_comments/get_s3_upload_signature/', 
            data: {mime_type: fileType, filename: theFilename}, 
            dataType: 'json',
            type: 'POST',
            ContentType : 'application/json',            
            success: function(reply)  
            { 
                console.log("Got Reply...");
                if(reply.success == 'true'){

                    console.log("uid " + reply.uid);
                    console.log("type " + fileType);  
                    console.log("policy " + reply.policybase64);
                    console.log("credentials " + reply.access_key + '/' + reply.short_date + '/' + reply.region + '/s3/aws4_request');
                    console.log("expires " + reply.presigned_url_expiry);
                    console.log("signature " + reply.signature);                  
                    /*
    <form action="https://weigel-comments.s3.us-east-1.amazonaws.com" method="post" id="aws_upload_form"  enctype="multipart/form-data">
    <input type="hidden" name="acl" value="public-read">
    <input type="hidden" name="success_action_status" value="201">
    <input type="hidden" name="policy" value="<?=$policybase64?>">
    <input type="hidden" name="X-amz-credential" value="<?=$access_key?>/<?=$short_date?>/<?=$region?>/s3/aws4_request">
    <input type="hidden" name="X-amz-algorithm" value="AWS4-HMAC-SHA256">
    <input type="hidden" name="X-amz-date" value="<?=$iso_date?>">
    <input type="hidden" name="X-amz-expires" value="<?=$presigned_url_expiry?>">
    <input type="hidden" name="X-amz-signature" value="<?=$signature?>">
    <input type="hidden" name="key" value="">
    <input type="hidden" name="Content-Type" value="">
    <input type="file" name="file" />
    <input type="submit" value="Upload File" />
    </form>
    */
                    var formdata = new FormData();
                    formdata.append('acl', 'public-read');    
                    formdata.append('success_action_status', "201");
                    formdata.append('policy', reply.policybase64);
                    formdata.append('X-amz-credential', reply.access_key + '/' + reply.short_date + '/' + reply.region + '/s3/aws4_request');
                    formdata.append('X-amz-algorithm', "AWS4-HMAC-SHA256");
                    formdata.append('X-amz-date', reply.iso_date);
                    formdata.append('X-amz-expires', reply.presigned_url_expiry);
                    formdata.append('X-amz-signature', reply.signature);
                    formdata.append('key', reply.uid);                
                    formdata.append('Content-Type', fileType);                  

                    //formdata.append('AWSAccessKeyId', reply.AWSAccessKeyId);
                    formdata.append("file", theFile);              

                    //var xhr = getXMLHTTPObject();
                    var xhr = new XMLHttpRequest();
                    //xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", function(){                        
                        //Do ajax to save the
                        callBack(reply.uid);                    
                        console.log("uploaded file: " + 'https://weigel-comments.s3.us-east-1.amazonaws.com/' + reply.uid);
                        dfd.resolve("Uploaded!");
                    }, false);
                    xhr.addEventListener("error", function(e){
                        alert("Your image could not be uploaded");
                        console.log(e);
                    }, false);


                    xhr.open('POST', 'https://weigel-comments.s3.us-east-1.amazonaws.com', true); //MUST BE LAST LINE BEFORE YOU SEND 
                    xhr.send(formdata);  

                }
                else {
                    console.log(reply);
                    alert(reply.msg);
                }
            },
            error : function(msg){
                alert("Error");
                console.log(msg);                
            } 
        });	           
        
    });        
    
    return dfd.promise();
};

WCS.readfiles = function(files, mycallback) {
  for (var i = 0; i < files.length; i++) {
    WCS.DROP_FILE_NAME = files[i].name;
    WCS.DROP_FILE_TYPE = files[i].type;            
    reader = new FileReader();
    reader.onload = function(event) {
      //alert("doing s3 upload");
      WCS.doS3Upload(event.target.result, function(theid, msg){
          mycallback(theid, msg);
      });
    }
    reader.readAsDataURL(files[i]);
  }
}

WCS.getImageDimensions = function(file, callback) {
    var aFileReader = new FileReader();
    aFileReader.onload = function(evt) {
        var image = new Image();
        image.onload = function(evt) {
            var width = this.width;
            var height = this.height;
            if (callback) {
                callback(width, height, image);
            }
        };
        
        image.onerror = function(evt){
            alert("Invalid image");
            return;
        }
        
        image.src = evt.target.result; 
    };
    aFileReader.readAsDataURL(file);
}; 

WCS.resizeTooBigImage = function(imgObject, maxWidth, maxHeight, forcesquare){
    
    var cvs = null;
    var maxTries = 10;
    var newWidth = imgObject.naturalWidth;
    var newHeight = imgObject.naturalHeight;
    
    var reduced = false;
    while((newHeight > maxHeight || newWidth > maxWidth) && maxTries > 0){
        newWidth = Math.floor(0.8 * newWidth);
        newHeight = Math.floor(0.8 * newHeight);      
        maxTries--;
        reduced = true;
    }
    
    var type= 'image/png';         
    if(forcesquare){
       	var imgSize = Math.min(imgObject.naturalWidth, imgObject.naturalHeight);
    	var left = (imgObject.naturalWidth - imgSize) / 2;
    	var top = (imgObject.naturalHeight - imgSize) / 2;
        cvs = document.createElement('canvas');
        cvs.width = 200;
        cvs.height = 200;
        var ctx = cvs.getContext('2d');             
    	ctx.drawImage(imgObject, left, top, imgSize, imgSize, 0, 0, 200, 200);        
    }    
    else if(reduced){        
        cvs = document.createElement('canvas');
        cvs.width = newWidth;
        cvs.height = newHeight;
        var ctx = cvs.getContext('2d');                
        ctx.clearRect(0,0,newWidth, newHeight);
        ctx.drawImage(imgObject, 0, 0, imgObject.naturalWidth, imgObject.naturalHeight, 0, 0, newWidth, newHeight);                      
    }
    else{
        return null;
    }
    
    var finalFile = cvs.toDataURL("image/png");    
    return finalFile;    
};


// settings menu button open/close popout for responsive view
var settingsMenuBtn = $('.wcs-post-comment-user-profile-controls-menu-btn');
var menuWrap = $('.wcs-post-comment-user-profile-controls-menu');

settingsMenuBtn.on('click', function() {
    if(menuWrap.hasClass('wcs-post-comment-controls-closed')) {
        menuWrap.removeClass('wcs-post-comment-controls-closed');
        menuWrap.addClass('wcs-post-comment-controls-open');
    } else {
        menuWrap.addClass('wcs-post-comment-controls-closed');
        menuWrap.removeClass('wcs-post-comment-controls-open');
    }
});

$(window).on('click', function(e) {
    if(settingsMenuBtn.has(e.target).length === 0 && !settingsMenuBtn.is(e.target) && menuWrap.has(e.target).length === 0 && !menuWrap.is(e.target)) {
        menuWrap.addClass('wcs-post-comment-controls-closed');
        menuWrap.removeClass('wcs-post-comment-controls-open');
    } else {
        return;
    }
})



