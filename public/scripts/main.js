var fixBrokenImages = function(url){
    var img = document.getElementsByTagName('img');
    var i=0, l=img.length;
    for(;i<l;i++){
        var t = img[i];
        if(t.naturalWidth === 0){
            //this image is broken
            t.src = url;
        }
    }
};

fixBrokenImages('http://kaashivinfotech.com/images/course/course.jpg');
