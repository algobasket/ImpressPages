/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpHtml(widgetObject) {
    this.widgetObject = widgetObject;

    this.manageInit = manageInit;
    this.prepareData = prepareData;


    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');
    }

    function prepareData() {

        var data = Object();

        data.html = this.widgetObject.find('textarea').val();
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }

    

};


/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpImage(widgetObject, contentBody) {
    this.widgetObject = widgetObject;
    this.contentBody = contentBody;

    this.prepareData = prepareData;
    this.manageInit = manageInit;

    this.addError = addError;


    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');
        var options = new Object;
        
        if (instanceData.data.imageOriginal) {
            options.image = instanceData.data.imageOriginal;
        }
        if (instanceData.data.cropX1) {
            options.cropX1 = instanceData.data.cropX1;
        }
        if (instanceData.data.cropY1) {
            options.cropY1 = instanceData.data.cropY1;
        }
        if (instanceData.data.cropX2) {
            options.cropX2 = instanceData.data.cropX2;
        }
        if (instanceData.data.cropY2) {
            options.cropY2 = instanceData.data.cropY2;
        }
        if (instanceData.data.imageWindowWidth) {
            options.windowWidth = instanceData.data.imageWindowWidth;
        }
        options.maxWindowWidth = this.contentBody.width();
        options.enableChangeHeight = true;
        options.enableChangeWidth = true;
        options.enableUnderscale = true;

        var $imageUploader = this.widgetObject.find('.ipaImage');
        $imageUploader.ipUploadImage(options);
        this.widgetObject.bind('error.ipUploadImage', {widgetController: this}, this.addError);

    }
    

    function addError(event, errorMessage) {
        $(this).trigger('error.ipContentManagement', errorMessage);
    }
    
    function removeError () {
        this.widgetObject.find('.ipaErrorContainer .ipaError').remove();
    }

    function prepareData() {
        var data = Object();
        var ipUploadImage = this.widgetObject.find('.ipaImage');
        if (ipUploadImage.ipUploadImage('getNewImageUploaded')) {
            var newImage = ipUploadImage.ipUploadImage('getCurImage');
            if (newImage) {
                data.newImage = newImage;
            }
        }
        
        if (ipUploadImage.ipUploadImage('getCropCoordinatesChanged') && ipUploadImage.ipUploadImage('getCurImage') != false) {
            var cropCoordinates = ipUploadImage.ipUploadImage('getCropCoordinates');
            if (cropCoordinates) {
                data.cropX1 = cropCoordinates.x1;
                data.cropY1 = cropCoordinates.y1;
                data.cropX2 = cropCoordinates.x2;
                data.cropY2 = cropCoordinates.y2;
            }
        }
        
        var windowWidth = ipUploadImage.ipUploadImage('getWindowWidth');
        var maxWidth = this.contentBody.width();
        data.maxWidth = this.widgetObject.width();
        data.scale = windowWidth / maxWidth;
        data.imageWindowWidth = windowWidth;
        data.title = this.widgetObject.find('.ipaImageTitle').val();
        
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);        
    }



    

};

/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpText() {
    "use strict";

    this.init = function($widgetObject) {
        var customTinyMceConfig = ipTinyMceConfig();
        customTinyMceConfig.setup = function(ed, l) {ed.on('change', function(e) {
            $widgetObject.save({text: $widgetObject.find('.ipsContent').html()});
        })};

        $widgetObject.find('.ipsContent').tinymce(customTinyMceConfig);
    };


};


/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpTable(widgetObject) {
    this.widgetObject = widgetObject;

    this.manageInit = manageInit;
    this.prepareData = prepareData;


    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');
        this.widgetObject.find('textarea').tinymce(ipTinyMceConfigTable);
    }

    function prepareData() {

        var data = Object();

        data.text = this.widgetObject.find('textarea').html();
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }

    

};

      

/**
 * 
 * IpColumns Widget Controller
 * 
 * @package ImpressPages
 * @copyright Copyright (C) 2011 ImpressPages LTD.
 * @license GNU/GPL, see ip_license.html
 */




function IpWidget_IpColumns(widgetObject) {

    this.widgetObject = widgetObject;
    this.manageInit = manageInit;
    this.prepareData = prepareData;

    function manageInit() {
        //get widget data currently stored in the database
        var instanceData = this.widgetObject.data('ipWidget').data;

        //if widget has been already initialized
        if (instanceData.baseId) {
            //set input value
            this.widgetObject.find('input[name="baseId"]').val(instanceData.baseId);
        } else {
            //leave input empty
        }
    }

    function prepareData() {
        //create simple data object. It will be returned as the data to be stored.
        var data = {};
        data.baseId = this.widgetObject.find('input[name="baseId"]').val();
        data.columns = this.widgetObject.find('input[name="columns"]').val();
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }

}
/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpTextImage(widgetObject) {
    this.widgetObject = widgetObject;

    this.prepareData = prepareData;

    this.addError = addError;

    this.manageInit = function() {
        this.widgetObject.find('.ipwText').tinymce(ipTinyMceConfig());
    }



//    function manageInit() {
//        var instanceData = this.widgetObject.data('ipWidget');
//        var options = new Object;
//
//        if (instanceData.data.imageOriginal) {
//            options.image = instanceData.data.imageOriginal;
//        }
//        if (instanceData.data.cropX1) {
//            options.cropX1 = instanceData.data.cropX1;
//        }
//        if (instanceData.data.cropY1) {
//            options.cropY1 = instanceData.data.cropY1;
//        }
//        if (instanceData.data.cropX2) {
//            options.cropX2 = instanceData.data.cropX2;
//        }
//        if (instanceData.data.cropY2) {
//            options.cropY2 = instanceData.data.cropY2;
//        }
//
//        options.enableChangeHeight = true;
//        options.enableChangeWidth = false;
//        options.enableUnderscale = true;
//
//        this.widgetObject.find('.ipaImage').ipUploadImage(options);
//        this.widgetObject.bind('error.ipUploadImage', {widgetController: this}, this.addError);
//
//
//        this.widgetObject.find('textarea').tinymce(ipTinyMceConfig());
//    }
    


    function prepareData() {
        var data = Object();

        var ipUploadImage = this.widgetObject.find('.ipaImage');
        if (ipUploadImage.ipUploadImage('getNewImageUploaded')) {
            var newImage = ipUploadImage.ipUploadImage('getCurImage');
            if (newImage) {
                data.newImage = newImage;
            }
        }
        
        if (ipUploadImage.ipUploadImage('getCropCoordinatesChanged') && ipUploadImage.ipUploadImage('getCurImage') != false) {
            var cropCoordinates = ipUploadImage.ipUploadImage('getCropCoordinates');
            if (cropCoordinates) {
                data.cropX1 = cropCoordinates.x1;
                data.cropY1 = cropCoordinates.y1;
                data.cropX2 = cropCoordinates.x2;
                data.cropY2 = cropCoordinates.y2;
            }
        }
        

        data.text = $(this.widgetObject).find('textarea').first().val();
        data.title = $(this.widgetObject).find('.ipaImageTitle').first().val();
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }
    
    function addError(event, errorMessage) {
        $(this).trigger('error.ipContentManagement', errorMessage);
    }


    

};


/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpFaq(widgetObject) {
    this.widgetObject = widgetObject;

    this.manageInit = manageInit;
    this.prepareData = prepareData;


    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');
        this.widgetObject.find('textarea').tinymce(ipTinyMceConfig());
    }

    function prepareData() {

        var data = Object();

        data.answer = this.widgetObject.find('.ipAdminTextarea').html();
        data.question = this.widgetObject.find('.ipAdminInput').val();
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }



};

/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpImageGallery(widgetObject) {
    this.widgetObject = widgetObject;

    this.prepareData = prepareData;
    this.manageInit = manageInit;
    this.fileUploaded = fileUploaded;
    
    this.addError = addError;


    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');

        this.widgetObject.find('.ipmBrowseButton').click(function(e){
            e.preventDefault();
            var repository = new ipRepository({preview: 'thumbnails', filter: 'image'});
            repository.bind('ipRepository.filesSelected', $.proxy(fileUploaded, widgetObject));
        });

        
        var container = this.widgetObject.find('.ipWidget_ipImageGallery_container');
        var options = new Object;
        if (instanceData.data.images) {
            options.images = instanceData.data.images;
        } else {
            options.images = new Array();
        }
        options.smallImageWidth = this.widgetObject.find('input[name="smallImageWidth"]').val();
        options.smallImageHeight = this.widgetObject.find('input[name="smallImageHeight"]').val();
        options.imageTemplate = this.widgetObject.find('.ipaImageTemplate');
        container.ipWidget_ipImageGallery_container(options);
        
        
        this.widgetObject.bind('fileUploaded.ipUploadFile', this.fileUploaded);
        this.widgetObject.bind('error.ipUploadImage', {widgetController: this}, this.addError);
        this.widgetObject.bind('error.ipUploadFile', {widgetController: this}, this.addError);
        
    }

    


    function addError(event, errorMessage) {
        $(this).trigger('error.ipContentManagement', [errorMessage]);
    }


    function fileUploaded(event, files) {
        var $this = $(this);

        var container = $this.find('.ipWidget_ipImageGallery_container');
        for(var index in files) {
            container.ipWidget_ipImageGallery_container('addImage', files[index].fileName, '', 'new');
        }
    }


    
    function prepareData() {
        var data = Object();
        var container = this.widgetObject.find('.ipWidget_ipImageGallery_container');
        
        data.images = new Array();
        $images = container.ipWidget_ipImageGallery_container('getImages');
        $images.each(function(index) {
            var $this = $(this);
            var tmpImage = new Object();
            tmpImage.title = $this.ipWidget_ipImageGallery_image('getTitle');
            tmpImage.fileName = $this.ipWidget_ipImageGallery_image('getFileName');
            tmpImage.status = $this.ipWidget_ipImageGallery_image('getStatus');
            var tmpCropCoordinates = $this.ipWidget_ipImageGallery_image('getCropCoordinates');
            tmpImage.cropX1 = tmpCropCoordinates.x1; 
            tmpImage.cropY1 = tmpCropCoordinates.y1; 
            tmpImage.cropX2 = tmpCropCoordinates.x2; 
            tmpImage.cropY2 = tmpCropCoordinates.y2; 
            
            
            data.images.push(tmpImage);

        });


        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }


};




(function($) {

    var methods = {
            
    init : function(options) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('ipWidget_ipImageGallery_container');

            // If the plugin hasn't been initialized yet
            var images = null;
            if (options.images) {
                images = options.images;
            } else {
                images = new Array();
            }
            
            if (!data) {
                $this.data('ipWidget_ipImageGallery_container', {
                    images : images,
                    imageTemplate : options.imageTemplate,
                    smallImageWidth : options.smallImageWidth,
                    smallImageHeight : options.smallImageHeight
                });
                
                for (var i in images) {
                    var coordinates = new Object();
                    coordinates.cropX1 = images[i]['cropX1'];
                    coordinates.cropY1 = images[i]['cropY1'];
                    coordinates.cropX2 = images[i]['cropX2'];
                    coordinates.cropY2 = images[i]['cropY2'];
                    $this.ipWidget_ipImageGallery_container('addImage', images[i]['imageOriginal'], images[i]['title'], 'present', coordinates); 
                }
                $this.bind('removeImage.ipWidget_ipImageGallery', function(event, imageObject) {
                    var $imageObject = $(imageObject);
                    $imageObject.ipWidget_ipImageGallery_container('removeImage', $imageObject);
                });
                
                $( ".ipWidget_ipImageGallery_container" ).sortable();
                $( ".ipWidget_ipImageGallery_container" ).sortable('option', 'handle', '.ipaImageMove');

            }
        });
    },
    
    addImage : function (fileName, title, status, coordinates) {
        var $this = this;
        var data = $this.data('ipWidget_ipImageGallery_container');
        var $newImageRecord = $this.data('ipWidget_ipImageGallery_container').imageTemplate.clone();
        $newImageRecord.ipWidget_ipImageGallery_image({'smallImageWidth' : data.smallImageWidth, 'smallImageHeight' : data.smallImageHeight, 'status' : status, 'fileName' : fileName, 'title' : title, 'coordinates' : coordinates});
        var $uploader = $this.find('.ipmBrowseButton');
        if ($uploader.length > 0) {
            $($uploader).before($newImageRecord);
        } else {
            $this.append($newImageRecord);
        }
    },
    
    removeImage : function ($imageObject) {
        $imageObject.hide();
        $imageObject.ipWidget_ipImageGallery_image('setStatus', 'deleted');
        
    },
    
    getImages : function () {
        var $this = this;
        return $this.find('.ipaImageTemplate');
    }



    };

    $.fn.ipWidget_ipImageGallery_container = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);





(function($) {

    var methods = {
    init : function(options) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('ipWidget_ipImageGallery_image');

            var status = 'new';
            if (options.status) {
                status = options.status;
            }
            
            // If the plugin hasn't been initialized yet
            if (!data) {
                var data = {
                    title : '',
                    fileName : '',
                    status : status,
                    smallImageWidth : options.smallImageWidth,
                    smallImageHeight : options.smallImageHeight
                };
                
                if (options.title) {
                    data.title = options.title;
                }
                if (options.fileName) {
                    data.fileName = options.fileName;
                }
                if (options.status) {
                    data.status = options.status;
                }
                
                $this.data('ipWidget_ipImageGallery_image', {
                    title : data.title,
                    fileName : data.fileName,
                    status : data.status
                });
                $this.find('.ipaImageTitle').val(data.title);
            }
            
            
            
            //$this.find('.ipaImage').attr('src', ipFileUrl(data.fileName));
            var imageOptions = new Object;
            imageOptions.image = data.fileName;
            if (options.coordinates) {
                imageOptions.cropX1 = options.coordinates.cropX1;
                imageOptions.cropY1 = options.coordinates.cropY1;
                imageOptions.cropX2 = options.coordinates.cropX2;
                imageOptions.cropY2 = options.coordinates.cropY2;
            }
            var ratio = options.smallImageWidth / options.smallImageHeight;
            imageOptions.windowWidth = 200;
            imageOptions.windowHeight = imageOptions.windowWidth / ratio;
            imageOptions.enableChangeWidth = false;
            imageOptions.enableChangeHeight = false;

            $this.find('.ipaImage').ipUploadImage(imageOptions);
            
            $this.find('.ipaImageRemove').bind('click', 
                function(event){
                    $this = $(this);
                    $this.trigger('removeClick.ipWidget_ipImageGallery');
                    return false;
                }
            );
            $this.bind('removeClick.ipWidget_ipImageGallery', function(event) {
                $this.trigger('removeImage.ipWidget_ipImageGallery', this);
            });
            return $this;
        });
    },
    
    getTitle : function() {
        var $this = this;
        return $this.find('.ipaImageTitle').val();
    },
    
    getFileName : function() {
        var $this = this;
        var curImage = $this.find('.ipaImage').ipUploadImage('getCurImage');
        return curImage;
    },
    
    getCropCoordinates : function() {
        var $this = this;
        var ipUploadImage = $this.find('.ipaImage');
        var cropCoordinates = ipUploadImage.ipUploadImage('getCropCoordinates');
        return cropCoordinates;
    },
        
    getStatus : function() {
        var $this = this;
        
        var tmpData = $this.data('ipWidget_ipImageGallery_image');
        if (tmpData.status == 'deleted') {
            return tmpData.status;
        }
        
        var ipUploadImage = $this.find('.ipaImage');
        if (tmpData.status == 'new' || ipUploadImage.ipUploadImage('getNewImageUploaded')) {
            return 'new';
        } else {
            if (ipUploadImage.ipUploadImage('getCropCoordinatesChanged') && ipUploadImage.ipUploadImage('getCurImage') != false) {
                return 'coordinatesChanged';
            }
        }
        
        var tmpData = $this.data('ipWidget_ipImageGallery_image');
        //status, set on creation. Usually 'new' or 'present'
        return tmpData.status;
    },
    
    setStatus : function(newStatus) {
        var $this = $(this);
        var tmpData = $this.data('ipWidget_ipImageGallery_image');
        tmpData.status = newStatus;
        $this.data('ipWidget_ipImageGallery_image', tmpData);
    }
    



    };

    $.fn.ipWidget_ipImageGallery_image = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);

/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpLogoGallery(widgetObject) {
    this.widgetObject = widgetObject;

    this.prepareData = prepareData;
    this.manageInit = manageInit;
    this.fileUploaded = fileUploaded;

    this.addError = addError;

    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');

        this.widgetObject.find('.ipmBrowseButton').click(function(e){
            e.preventDefault();
            var repository = new ipRepository({preview: 'thumbnails', filter: 'image'});
            repository.bind('ipRepository.filesSelected', $.proxy(fileUploaded, widgetObject));
        });


        
        var container = this.widgetObject.find('.ipWidget_ipLogoGallery_container');
        var options = new Object;
        if (instanceData.data.logos) {
            options.logos = instanceData.data.logos;
        } else {
            options.logos = new Array();
        }
        options.logoWidth = this.widgetObject.find('input[name="logoWidth"]').val();
        options.logoHeight = this.widgetObject.find('input[name="logoHeight"]').val();
        options.logoTemplate = this.widgetObject.find('.ipaLogoTemplate');
        container.ipWidget_ipLogoGallery_container(options);
        
        
        this.widgetObject.bind('fileUploaded.ipUploadFile', this.fileUploaded);
        this.widgetObject.bind('error.ipUploadImage', {widgetController: this}, this.addError);
        this.widgetObject.bind('error.ipUploadFile', {widgetController: this}, this.addError);
        
        
    }

    function addError(event, errorMessage) {
        $(this).trigger('error.ipContentManagement', [errorMessage]);
    }    
    
    function fileUploaded(event, files) {
        var $this = $(this);

        var container = $this.find('.ipWidget_ipLogoGallery_container');
        for(var index in files) {
            container.ipWidget_ipLogoGallery_container('addLogo', files[index].fileName, '', '');
        }

    }
    

    
    function prepareData() {
        var data = Object();
        var container = this.widgetObject.find('.ipWidget_ipLogoGallery_container');
        
        data.logos = new Array();
        $logos = container.ipWidget_ipLogoGallery_container('getLogos');
        $logos.each(function(index) {
            var $this = $(this);
            var tmpLogo = new Object();
            tmpLogo.title = $this.ipWidget_ipLogoGallery_logo('getTitle');
            tmpLogo.link = $this.ipWidget_ipLogoGallery_logo('getLink');
            tmpLogo.fileName = $this.ipWidget_ipLogoGallery_logo('getFileName');
            tmpLogo.status = $this.ipWidget_ipLogoGallery_logo('getStatus');
            var tmpCropCoordinates = $this.ipWidget_ipLogoGallery_logo('getCropCoordinates');
            tmpLogo.cropX1 = tmpCropCoordinates.x1; 
            tmpLogo.cropY1 = tmpCropCoordinates.y1; 
            tmpLogo.cropX2 = tmpCropCoordinates.x2; 
            tmpLogo.cropY2 = tmpCropCoordinates.y2; 
            
            
            data.logos.push(tmpLogo);

        });


        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }


};




(function($) {

    var methods = {
            
    init : function(options) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('ipWidget_ipLogoGallery_container');

            // If the plugin hasn't been initialized yet
            var logos = null;
            if (options.logos) {
                logos = options.logos;
            } else {
                logos = new Array();
            }

            
            if (!data) {
                $this.data('ipWidget_ipLogoGallery_container', {
                    logos : logos,
                    logoTemplate : options.logoTemplate,
                    logoWidth : options.logoWidth,
                    logoHeight : options.logoHeight
                });

                for (var i in logos) {
                    var coordinates = new Object();
                    coordinates.cropX1 = logos[i]['cropX1'];
                    coordinates.cropY1 = logos[i]['cropY1'];
                    coordinates.cropX2 = logos[i]['cropX2'];
                    coordinates.cropY2 = logos[i]['cropY2'];
                    $this.ipWidget_ipLogoGallery_container('addLogo', logos[i]['logoOriginal'], logos[i]['title'], logos[i]['link'], 'present', coordinates); 
                }
                $this.bind('removeLogo.ipWidget_ipLogoGallery', function(event, logoObject) {
                    var $logoObject = $(logoObject);
                    $logoObject.ipWidget_ipLogoGallery_container('removeLogo', $logoObject);
                });
                
                $( ".ipWidget_ipLogoGallery_container" ).sortable();
                $( ".ipWidget_ipLogoGallery_container" ).sortable('option', 'handle', '.ipaLogoMove');

            }
        });
    },
    
    addLogo : function (fileName, title, link, status, coordinates) {
        var $this = this;
        var data = $this.data('ipWidget_ipLogoGallery_container');
        var $newLogoRecord = $this.data('ipWidget_ipLogoGallery_container').logoTemplate.clone();
        $newLogoRecord.ipWidget_ipLogoGallery_logo({'logoWidth' : data.logoWidth, 'logoHeight' : data.logoHeight, 'status' : status, 'fileName' : fileName, 'title' : title, 'link' : link, 'coordinates' : coordinates});
        var $uploader = $this.find('.ipmBrowseButton');
        if ($uploader.length > 0) {
            $($uploader).before($newLogoRecord);
        } else {
            $this.append($newLogoRecord);
        }
    },
    
    removeLogo : function ($logoObject) {
        $logoObject.hide();
        $logoObject.ipWidget_ipLogoGallery_logo('setStatus', 'deleted');
        
    },
    
    getLogos : function () {
        var $this = this;
        return $this.find('.ipaLogoTemplate');
    }



    };

    $.fn.ipWidget_ipLogoGallery_container = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);





(function($) {

    var methods = {
    init : function(options) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('ipWidget_ipLogoGallery_logo');

            var status = 'new';
            if (options.status) {
                status = options.status;
            }
            
            // If the plugin hasn't been initialized yet
            if (!data) {
                var data = {
                    title : '',
                    link : '',
                    fileName : '',
                    status : status,
                    logoWidth : options.logoWidth,
                    logoHeight : options.logoHeight
                };
                
                if (options.title) {
                    data.title = options.title;
                }
                if (options.link) {
                    data.link = options.link;
                }
                if (options.fileName) {
                    data.fileName = options.fileName;
                }
                if (options.status) {
                    data.status = options.status;
                }
                
                $this.data('ipWidget_ipLogoGallery_logo', {
                    title : data.title,
                    link : data.link,
                    fileName : data.fileName,
                    status : data.status
                });
                $this.find('.ipaLogoTitle').val(data.title);
            }
            
            
            
            //$this.find('.ipaLogo').attr('src', ipFileUrl(data.fileName));
            var logoOptions = new Object;
            logoOptions.image = data.fileName;
            if (options.coordinates) {
                logoOptions.cropX1 = options.coordinates.cropX1;
                logoOptions.cropY1 = options.coordinates.cropY1;
                logoOptions.cropX2 = options.coordinates.cropX2;
                logoOptions.cropY2 = options.coordinates.cropY2;
            }
            var ratio = options.logoWidth / options.logoHeight;
            logoOptions.windowWidth = 200;
            logoOptions.windowHeight = options.logoWidth / ratio;
            logoOptions.enableChangeWidth = false;
            logoOptions.enableChangeHeight = false;
            logoOptions.enableScale = false;
            logoOptions.enableFraming = false;
            logoOptions.enableUnderscale = true;
            logoOptions.autosizeType = 'fit';

            $this.find('.ipaLogo').ipUploadImage(logoOptions);
            
            

            
            
            $this.find('.ipaLogoRemove').bind('click', 
                function(event){
                    $this = $(this);
                    $this.trigger('removeClick.ipWidget_ipLogoGallery');
                    return false;
                }
            );
            $this.find('.ipaLogoLink').bind('click', 
                    function(event){
                        $this = $(this);
                        $this.trigger('linkClick.ipWidget_ipLogoGallery');
                        return false;
                    }
                );
            $this.bind('removeClick.ipWidget_ipLogoGallery', function(event) {
                $this.trigger('removeLogo.ipWidget_ipLogoGallery', this);
            });
            $this.bind('linkClick.ipWidget_ipLogoGallery', function(event) {
                $this = $(this);
                var data = $this.data('ipWidget_ipLogoGallery_logo');
                var newLink;
                newLink = prompt('Where this logo should link?', data.link)
                if (newLink !== null) {
                    data.link = newLink;
                    $this.data('ipWidget_ipLogoGallery_logo', data);
                }
            });
            return $this;
        });
    },
    
    getTitle : function() {
        var $this = this;
        return $this.find('.ipaLogoTitle').val();
    },
    
    
    getLink : function() {
        var $this = this;
        return $this.data('ipWidget_ipLogoGallery_logo').link;
    },
    
    getFileName : function() {
        var $this = this;
        var curImage = $this.find('.ipaLogo').ipUploadImage('getCurImage');
        return curImage;
    },
    
    getCropCoordinates : function() {
        var $this = this;
        var ipUploadLogo = $this.find('.ipaLogo');
        var cropCoordinates = ipUploadLogo.ipUploadImage('getCropCoordinates');
        return cropCoordinates;
    },
        
    getStatus : function() {
        var $this = this;
        
        var tmpData = $this.data('ipWidget_ipLogoGallery_logo');
        if (tmpData.status == 'deleted') {
            return tmpData.status;
        }
        
        var ipUploadLogo = $this.find('.ipaLogo');
        if (tmpData.status == 'new' || ipUploadLogo.ipUploadImage('getNewImageUploaded')) {
            return 'new';
        } else {
            if (ipUploadLogo.ipUploadImage('getCropCoordinatesChanged') && ipUploadLogo.ipUploadImage('getCurImage') != false) {
                return 'coordinatesChanged';
            }
        }
        
        var tmpData = $this.data('ipWidget_ipLogoGallery_logo');
        //status, set on creation. Usually 'new' or 'present'
        return tmpData.status;
    },
    
    setStatus : function(newStatus) {
        var $this = $(this);
        var tmpData = $this.data('ipWidget_ipLogoGallery_logo');
        tmpData.status = newStatus;
        $this.data('ipWidget_ipLogoGallery_logo', tmpData);
    }
    



    };

    $.fn.ipWidget_ipLogoGallery_logo = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);

/**
 * @package ImpressPages
 *
 *
 */
function IpWidget_IpTitle(widgetObject) {
    "use strict";
    this.widgetObject = null;
    this.data = null;

    this.init = function ($widgetObject, data, editMode) {
        this.widgetObject = $widgetObject;
        this.data = data;


        var customTinyMceConfig = ipTinyMceConfig();
        customTinyMceConfig.menubar = false;
        customTinyMceConfig.toolbar = false;
        customTinyMceConfig.setup = function(ed, l) {
            ed.on('change', function(e) {
                $widgetObject.save({title: $widgetObject.find('h1,h2,h3,h4,h5,h6').html()});
            });
        };
        customTinyMceConfig.paste_as_text = true;
        customTinyMceConfig.valid_elements = '';
            customTinyMceConfig.custom_shortcuts = false;

        $widgetObject.find('h1,h2,h3,h4,h5,h6').tinymce(customTinyMceConfig);


        //TODOX refactor this functionality
        var $self = this.widgetObject;
        $self.find('.ipsTitleOptionsButton').on('click', function (e) {
            $self.find('.ipsTitleOptions').toggle();
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        $self.find('.ipsAnchor').on('keydown', $.proxy(updateAnchor, this));
        $self.find('.ipsAnchor').on('change', $.proxy(updateAnchor, this));
        $self.find('.ipsAnchor').on('keyup', $.proxy(updateAnchor, this));

    };

    var updateAnchor = function () {
        var  $preview = this.widgetObject.find('.ipsAnchorPreview');
        var curText = $preview.text();
        var newText = curText.split('#')[0] + '#' + this.widgetObject.find('.ipsAnchor').val();
        $preview.text(newText);
    }

    this.prepareData = function () {
        var widgetInputs = this.widgetObject.find('.ipaBody').find(':input');
        var data = {};
        widgetInputs.each(function (index) {
            data[$(this).attr('name')] = $(this).val();
        });
        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }

};

/**
 * @package ImpressPages
 *
 *
 */

function IpWidget_IpFile(widgetObject) {
    this.widgetObject = widgetObject;

    this.prepareData = prepareData;
    this.manageInit = manageInit;
    this.fileUploaded = fileUploaded;

    this.addError = addError;

    function manageInit() {
        var instanceData = this.widgetObject.data('ipWidget');
        
        var uploader = this.widgetObject.find('.ipaUpload');
        var options = new Object;
        uploader.ipUploadFile(options);
        
        var container = this.widgetObject.find('.ipWidget_ipFile_container');
        var options = new Object;
        if (instanceData.data.files) {
            options.files = instanceData.data.files;
        } else {
            options.files = new Array();
        }
        options.fileTemplate = this.widgetObject.find('.ipaFileTemplate');
        container.ipWidget_ipFile_container(options);
        
        
        this.widgetObject.bind('fileUploaded.ipUploadFile', this.fileUploaded);
        this.widgetObject.bind('error.ipUploadFile', this.addError);

        var widgetObject = this.widgetObject;
        this.widgetObject.find('.ipmBrowseButton').click(function(e){
            e.preventDefault();
            var repository = new ipRepository({preview: 'list'});
            repository.bind('ipRepository.filesSelected', $.proxy(fileUploaded, widgetObject));
        });
        
    }
    
    function addError(event, errorMessage) {
        $(this).trigger('error.ipContentManagement', [errorMessage]);
    }

    
    function fileUploaded(event, files) {
        /* we are in widgetObject context */
        var $this = $(this);

        var container = $this.find('.ipWidget_ipFile_container');
        for(var index in files) {
            container.ipWidget_ipFile_container('addFile', files[index].fileName, files[index].fileName, 'new');
        }
    }
    

    
    function prepareData() {
        var data = Object();
        var container = this.widgetObject.find('.ipWidget_ipFile_container');
        
        data.files = new Array();
        var $files = container.ipWidget_ipFile_container('getFiles');
        $files.each(function(index) {
            var $this = $(this);
            var tmpFile = new Object();
            tmpFile.title = $this.ipWidget_ipFile_file('getTitle');
            tmpFile.fileName = $this.ipWidget_ipFile_file('getFileName');
            tmpFile.status = $this.ipWidget_ipFile_file('getStatus');
            data.files.push(tmpFile);

        });


        $(this.widgetObject).trigger('preparedWidgetData.ipWidget', [ data ]);
    }


};




(function($) {

    var methods = {
            
    init : function(options) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('ipWidget_ipFile_container');

            // If the plugin hasn't been initialized yet
            var files = null;
            if (options.files) {
                files = options.files;
            } else {
                files = new Array();
            }
            
            if (!data) {
                $this.data('ipWidget_ipFile_container', {
                    files : files,
                    fileTemplate : options.fileTemplate
                });
                
                for (var i in files) {
                    $this.ipWidget_ipFile_container('addFile', files[i]['fileName'], files[i]['title'], 'present'); 
                }
                $this.bind('removeFile.ipWidget_ipFile', function(event, fileObject) {
                    var $fileObject = $(fileObject);
                    $fileObject.ipWidget_ipFile_container('removeFile', $fileObject);
                });
                
                $( ".ipWidget_ipFile_container" ).sortable();
                $( ".ipWidget_ipFile_container" ).sortable('option', 'handle', '.ipaFileMove');
                

            }
        });
    },
    
    addFile : function (fileName, title, status) {
        var $this = this;
        var $newFileRecord = $this.data('ipWidget_ipFile_container').fileTemplate.clone();
        $newFileRecord.ipWidget_ipFile_file({'status' : status, 'fileName' : fileName, 'title' : title});
        
        $this.append($newFileRecord);
        
    },
    
    removeFile : function ($fileObject) {
        $fileObject.hide();
        $fileObject.ipWidget_ipFile_file('setStatus', 'deleted');
        
    },
    
    getFiles : function () {
        var $this = this;
        return $this.find('.ipaFileTemplate');
    }



    };

    $.fn.ipWidget_ipFile_container = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);





(function($) {

    var methods = {
    init : function(options) {

        return this.each(function() {

            var $this = $(this);

            var data = $this.data('ipWidget_ipFile_file');

            
            // If the plugin hasn't been initialized yet
            if (!data) {
                var data = {
                    title : '',
                    fileName : '',
                    status : 'new'
                };
                
                if (options.title) {
                    data.title = options.title;
                }
                if (options.fileName) {
                    data.fileName = options.fileName;
                }
                if (options.status) {
                    data.status = options.status;
                }
                
                $this.data('ipWidget_ipFile_file', {
                    title : data.title,
                    fileName : data.fileName,
                    status : data.status
                });
                $this.find('.ipaFileTitle').val(data.title);
            }
            
            $this.find('.ipaFileLink').attr('href', ipFileUrl('file/repository/' + data.fileName));
            $this.find('.ipaFileRemove').bind('click', function(event){
                event.preventDefault();
                $this = $(this);
                $this.trigger('removeClick.ipWidget_ipFile');
            });
            $this.bind('removeClick.ipWidget_ipFile', function(event) {
                $this.trigger('removeFile.ipWidget_ipFile', this);
            });
            return $this;
        });
    },
    
    getTitle : function() {
        var $this = this;
        return $this.find('.ipaFileTitle').val();
    },
    
    getFileName : function() {
        var $this = this;
        var tmpData = $this.data('ipWidget_ipFile_file');
        return tmpData.fileName;
    },
        
    getStatus : function() {
        var $this = this;
        var tmpData = $this.data('ipWidget_ipFile_file');
        return tmpData.status;
    },
    
    setStatus : function(newStatus) {
        var $this = $(this);
        var tmpData = $this.data('ipWidget_ipFile_file');
        tmpData.status = newStatus;
        $this.data('ipWidget_ipFile_file', tmpData);
        
    }
    



    };

    $.fn.ipWidget_ipFile_file = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);

/**
 * @package ImpressPages
 *
 *
 */




/**
 * General Field
 */
(function($) {
    "use strict";
    var methods = {
        init : function(options) {
            if (typeof options !== 'object') {
                options = {};
            }

            return this.each(function() {

                var $this = $(this);

                var data = $this.data('ipWidget_ipForm_field');


                // If the plugin hasn't been initialized yet
                if (!data) {
                    var data = {
                        label : '',
                        type : 'IpText',
                        required : false,
                        status : 'new',
                        options : {}
                    };
                    if (options.label) {
                        data.label = options.label;
                    }
                    if (options.type) {
                        data.type = options.type;
                    }
                    if (options.required && options.required != '0' && options.required != 'false') {
                        data.required = 1;
                    } else {
                        data.required = 0;
                    }
                    if (options.status) {
                        data.status = options.status;
                    }
                    $this.data('ipWidget_ipForm_field', {
                        label : data.label,
                        type : data.type,
                        required : data.required,
                        status : data.status,
                        optionsPopup : options.optionsPopup
                    });

                    $this.find('.ipaFieldLabel').val(data.label);
                    $this.find('.ipaFieldType').val(data.type);
                    $this.find('.ipaFieldType').bind('change', function() {$(this).trigger('changeType.ipWidget_ipForm', [$(this).val()]);});
                    $this.bind('changeType.ipWidget_ipForm', function(e, type) {
                        $(this).ipWidget_ipForm_field('setType', type);
                    });

                    $(this).ipWidget_ipForm_field('setType', data.type);

                    if (options.options) {
                        $this.ipWidget_ipForm_field('setOptions', options.options);
                    }

                    if (options.required && options.required != 0) {
                        $this.find('.ipaFieldRequired').attr('checked', options.required);
                    }
                }

                var $thisForEvent = $this;
                $this.find('.ipaFieldRemove').bind('click', function(event){
                    $thisForEvent.ipWidget_ipForm_field('setStatus', 'deleted');
                    $thisForEvent.hide();
                    event.preventDefault();
                });
                return $this;
            });
        },

        openOptionsPopup : function () {
            var $this = this;
            var data = $this.data('ipWidget_ipForm_field');
            var $thisForEvent = $this;
            data.optionsPopup.bind('saveOptions.ipWidget_ipForm', function(e,options){
                $this = $(this); //we are in popup context
                $this.unbind('saveOptions.ipWidget_ipForm');
                $thisForEvent.ipWidget_ipForm_field('setOptions', options);
            });

            data.optionsPopup.ipWidget_ipForm_options('showOptions', data.type, $this.ipWidget_ipForm_field('getOptions'));
        },

        setOptions : function (options) {
            var $this = this;
            var data = $this.data('ipWidget_ipForm_field');
            if (!data.options) {
                data.options = {};
            }
            data.options[$this.ipWidget_ipForm_field('getType')] = options; //store separte options for each type. Just to avoid accidental removal of options on type change
            $this.data('ipWidget_ipForm_field', data);
        },

        getOptions : function () {
            var $this = $(this);
            var data = $this.data('ipWidget_ipForm_field');
            if (data.options && data.options[$this.ipWidget_ipForm_field('getType')]) {
                //store separte options for each type. Just to avoid accidental removal of options on type change
                //nevertheless only one type options will be stored to the database
                return data.options[$this.ipWidget_ipForm_field('getType')];
            } else {
                return null;
            }
        },

        getLabel : function() {
            var $this = this;
            return $this.find('.ipaFieldLabel').val();
        },

        getType : function() {
            var $this = this;
            return $this.find('.ipaFieldType').val();
        },

        setType : function(type) {
            var $this = this;
            var data = $this.data('ipWidget_ipForm_field');
            if (data.optionsPopup.ipWidget_ipForm_options('optionsAvailable', type)) {
                $this.find('.ipaFieldOptions').css('visibility', 'visible');
                $this.find('.ipaFieldOptions').bind('click', function() {$(this).trigger('optionsClick.ipWidget_ipForm'); return false;});
                $this.bind('optionsClick.ipWidget_ipForm', function() {$(this).ipWidget_ipForm_field('openOptionsPopup');});
            } else {
                $this.find('.ipaFieldOptions').css('visibility', 'hidden');
            }
            data.type = type;
            $this.data('ipWidget_ipForm_field', data);
        },

        getStatus : function() {
            var $this = this;
            var tmpData = $this.data('ipWidget_ipForm_field');
            return tmpData.status;
        },

        setStatus : function(newStatus) {
            var $this = this;
            var tmpData = $this.data('ipWidget_ipForm_field');
            tmpData.status = newStatus;
            $this.data('ipWidget_ipForm_field', tmpData);

        },

        getRequired : function () {
            var $this = $(this);
            return $this.find('.ipaFieldRequired').is(':checked');
        }




    };




    $.fn.ipWidget_ipForm_field = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);


/**
 * @package ImpressPages
 *
 *
 */


/**
 * Widget initialization
 */
function IpWidget_IpForm() {
    "use strict";
    this.data = null;
    this.modal = null;
    this.container = null;
    this.addButton = null;
    this.confirmButton = null;


    this.init = function($widgetObject, data) {
        this.data = data;
        this.widgetObject = $widgetObject;

        var $widgetOverlay = $('<div></div>')
            .css('position', 'absolute')
            .css('z-index', 5)
            .width(this.widgetObject.width())
            .height(this.widgetObject.height());
        this.widgetObject.prepend($widgetOverlay);
        $widgetOverlay.on('click', $.proxy(openPopup, this));
    };



    var openPopup = function ()
    {
        this.modal = $('#ipWidgetFormPopup');
        this.addButton = this.modal.find(".ipaFieldAdd");
        this.container = this.modal.find('.ipWidget_ipForm_container');
        this.confirmButton = this.modal.find('.ipsConfirm');
        this.modal.modal();

        this.modal.on('hidden.bs.modal', $.proxy(cleanup, this));
        this.modal.on('hidden.bs.modal', $.proxy(cleanup, this));
        this.confirmButton.on('click', $.proxy(save, this));

        var instanceData = this.data;

        var options = new Object;
        if (instanceData['fields']) {
            options.fields = instanceData.fields;
        } else {
            options.fields = new Array();
        }

        options.fieldTemplate = this.modal.find('.ipaFieldTemplate');

        options.optionsPopup = this.modal.find(".ipaFieldOptionsPopup").ipWidget_ipForm_options({fieldTypes : instanceData.fieldTypes});
        this.container.ipWidget_ipForm_container(options);


        this.addButton.on('click', $.proxy(addField, this));
//        var customTinyMceConfig = ipTinyMceConfig();
//        customTinyMceConfig.height = 100;
//        this.modal.find(".ipWidgetIpFormSuccess").tinymce(customTinyMceConfig);
    };


    var cleanup = function() {
        this.container.html('');
        this.container.ipWidget_ipForm_container('destroy');
        this.addButton.off();
        this.confirmButton.off();
    }
    
    var addField = function (e) {

        this.container.ipWidget_ipForm_container('addField');
    };
    

    var save = function(e) {console.log('save');
        var data = this.getData();
        this.widgetObject.save(data, 1);
        this.modal.modal('hide');
    };
    
    this.getData = function() {
        var data = Object();

        data.fields = new Array();
        var $fields = this.container.ipWidget_ipForm_container('getFields');
        $fields.each(function(index) {
            var $this = $(this);
            var tmpField = new Object();
            tmpField.label = $this.ipWidget_ipForm_field('getLabel');
            tmpField.type = $this.ipWidget_ipForm_field('getType');
            tmpField.options = $this.ipWidget_ipForm_field('getOptions');
            if ($this.ipWidget_ipForm_field('getRequired')) {
                tmpField.required = 1;
            } else {
                tmpField.required = 0;
            }
            var status = $this.ipWidget_ipForm_field('getStatus');
            if (status != 'deleted') {
                data.fields.push(tmpField);
            }

        });

        data.success = this.widgetObject.find('.ipWidgetIpFormSuccess').html();
        return data;
    };


};




/**
 * @package ImpressPages
 *
 *
 */



/**
 * Fields container
 */
(function($) {
    "use strict";
    var methods = {
        init : function(options) {
            return this.each(function() {
                var $this = $(this);
                var data = $this.data('ipWidget_ipForm_container');
                // If the plugin hasn't been initialized yet
                var fields = null;
                if (options.fields) {
                    fields = options.fields;
                } else {
                    fields = new Array();
                }

                if (!data) {
                    $this.data('ipWidget_ipForm_container', {
                        fields : fields,
                        fieldTemplate : options.fieldTemplate,
                        optionsPopup : options.optionsPopup
                    });

                    if (! fields instanceof Array) {
                        fields = new Array();
                    }

                    for (var i in fields) {
                        $this.ipWidget_ipForm_container('addField', fields[i]);
                    }
                    $this.sortable();
                    $this.sortable('option', 'handle', '.ipaFieldMove');

                }
            });
        },

        addField : function (fieldData) {
            var $this = this;
            if (typeof fieldData !== 'object') {
                fieldData = {};
            }
            var data = fieldData;
            data.optionsPopup = $this.data('ipWidget_ipForm_container').optionsPopup;
            var $newFieldRecord = $this.data('ipWidget_ipForm_container').fieldTemplate.clone();
            $newFieldRecord.ipWidget_ipForm_field(data);

            $this.append($newFieldRecord);

        },



        getFields : function () {
            var $this = this;
            return $this.find('.ipaFieldTemplate');
        },

        destroy : function () {
            return this.each(function() {
                var $this = this;
                $.removeData($this, 'ipWidget_ipForm_container');
            });
        }

    };

    $.fn.ipWidget_ipForm_container = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);
/**
 * @package ImpressPages
 *
 *
 */


/**
 * Options popup
 */
(function($) {
    "use strict";

    var methods = {
        init : function(options) {
            if (!options) {
                options = {};
            }

            return this.each(function() {
                var $this = $(this);
                var data = $this.data('ipWidget_ipForm_options');
                // If the plugin hasn't been initialized yet
                if (!data) {
                    var data = {
                        fieldTypes : options.fieldTypes
                    };
                    $this.data('ipWidget_ipForm_options', data);
                }

                return $this;
            });
        },

        showOptions : function(fieldType, currentOptions) {
            var $this = this;
            var fieldType = $this.ipWidget_ipForm_options('getFieldType', fieldType);
            $this.html(fieldType.optionsHtml);
            $this.dialog({
                modal: true,
                buttons: {
                    "Save": function() {
                        var $this = $(this);
                        eval ('var options = ' + fieldType.optionsSaveFunction + '($this);');
                        $this.dialog( "close" );
                        $this.trigger('saveOptions.ipWidget_ipForm', [options]);
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }

            });
            eval ('' + fieldType.optionsInitFunction + '($this, currentOptions);');
        },



        getFieldType : function (fieldType) {
            var $this = this;
            var data = $this.data('ipWidget_ipForm_options');
            return data.fieldTypes[fieldType];
        },

        optionsAvailable : function (fieldTypeKey) {
            var $this = this;
            var fieldType = $this.ipWidget_ipForm_options('getFieldType', fieldTypeKey);
            return (fieldType && (fieldType.optionsInitFunction || fieldType.optionsHtml));

        }


    };



    $.fn.ipWidget_ipForm_options = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.ipAdminWidgetButton');
        }

    };

})(jQuery);

