
/**
 *
 *  $Id: DropHtml5Upload3.js,v 1.2 2013-07-12 07:21:13 apan1121 Exp $
 *  $Date: 2013-07-12 07:21:13 $
 *  $Author: apan1121 $
 *  $Revision: 1.2 $
 *
**/
var  DropHtml5Upload= function(element, options){

    var init_flag=true;
    var init_error="";

    var Tmp_Select_File={};

    var DEFAULTS= {
        resize: {"file":1024},
        preview_size:100,
        drop_info:'<p class="dropfiletext">Drop files here</p><p>or</p>',

        select_bt:'<input type="button" value="Select Files" in_option/>',
        submit_bt:'<input type="button" value="upload" in_option/>',

        loading_info:'<img src="/images/loader_128x15.gif">',
        loading_preview:'<img src="/images/loading_old.gif">',
        filter : /image/i,

        ajax_parallel:true,
        ajax_prefix:'',

        ajax_type:'POST',
        ajax_url:'upload.php',
        ajax_data:{},
        ajax_success:{},
        ajax_finish:{},

        int_error:function(err){
            alert(err);
        },
        delay:1000,
        lang:{},
        multiple :true,
        process_info:true
    };

    //default language
    var Lang = {
        "selectBTShowName":'select file',
        "submitBTShowName":'upload',
        "file_not_supported":'*{file_name}:Selected file format not supported!',
        "create_preview": '{file_name}:create preview',
        "upload_success": '{file_name}:upload success',
        "upload_finsih": 'upload finsih.',
        "not_multiple": 'only can upload one file.',
        "del_item":'delete item {key}',
        "init_error":"init error",
        "support_input_file_error":"input file can't support",
        "support_html5_canvas_error":"html5 canvas can't support",
        "support_html5_filereader_api_error":"html5 FileReader API can't support",
        "options_preview_set_error": 'preview size is not number',
        "options_resize_error_no": 'please set option->resize',
        "options_resize_set_error": 'resize \'{resizeKey}\' is not number',
    };

    //default class name
    var DropHtml5Upload='DropHtml5Upload';
    var dropareainner_name = "dropareainner";
    var select_bt_name='uploadbtn';
    var upload_file_name = "DropHtml5Upload_upload";
    var preview_name = 'preview';
    var submit_file_bt_name ='now_upload';
    var submit_file_name='submit_file';
    var loading_name='droparea_loading';
    var process_info_name='process_info_div';
    var process_info_data='process_info_data';
    var imageholder_name='imageholder';

    //default Template;
    var default_select_bt='<input type="button" value="Select Files"/>';
    var upload_file_tpl ='<input class="'+upload_file_name+'" type="file" style="display:block;width:0px;height:0px;"  accept="image/*" capture="camera" multiple/>';
    var preview_tpl= '<div class="'+preview_name+'"></div>';
    var default_submit_bt='<input type="button" value="upload">';
    var submit_file_tpl = '<div class="'+submit_file_name+'"></div>';
    var loading_tpl= '<div class="'+loading_name+'"> \
                        <table width="100%" height="100%">\
                            <tr>\
                                <td align="center" class="info"></td>\
                            </tr>\
                        </table>\
                      </div>';

    var process_info_tpl='<div class="'+process_info_name+'"><textarea class="'+process_info_data+'" readonly></textarea></div>';

    var tpl_imageholder='	<div> \
                                <div class="image">\
                                    <img src="{filePath}" alt="{fileName}"/>\
                                </div>\
                                <div class="filename">{fileName}</div>\
                                <div class="del"> </div>\
                                <div class="process"><p class="bar"></p></div>\
                            </div>';


    var dropzone=null;
    var preview=null;
    var defaultUploadBtn=null;
    var droparea_loading=null;
    var dropareainner=null;
    var submit_file=null;
    var submit_file_bt=null;

    var processFlag={count:0,flag:{}};
    var processFlag_default={count:0,flag:{}};

    var uploadData_count = 0;
    var uploadData = {} ;//save user upload org file data.
    var ajax_token = "";

    //initialization
    var init=function(){
        init_error="";

        options = $.extend({}, DEFAULTS, options || {});
        //set Lang custom Langauge.
        if(Object.keys(options.lang).length>0){
            for(var lang_key in options.lang){
                if(typeof(Lang[lang_key])!="undefined"){
                    Lang[lang_key]=options.lang[lang_key];
                }
            }
        }

        dropzone = $(element).eq(0);
        dropzone.attr({"unselectable":"no"});
        dropzone.data({"loading":false});
        dropzone.addClass(DropHtml5Upload);

        dropzone.html(  $("<div></div").addClass(dropareainner_name).html(dropzone.html()));
        dropareainner = dropzone.find("."+ dropareainner_name);
        dropareainner.append(options.drop_info);

        /* START : set select file buton */
        var select_bt_tpl = options.select_bt;
        if(select_bt_tpl=="" || $(select_bt_tpl).html()==null){
            select_bt_tpl=default_select_bt;
        }
        select_bt_tpl = $(select_bt_tpl).addClass(select_bt_name)
                                        .val(Lang.selectBTShowName)
                                        .html(Lang.selectBTShowName)
                                        .css({"cursor":"pointer"});
        dropareainner.append(select_bt_tpl);
        /* END : set select file buton */

        dropareainner.append(upload_file_tpl); //set input file button.
        dropzone.prepend(preview_tpl);	//set preview area;

        /* START : set submit button */
        var submit_bt_tpl = options.submit_bt;
        if(submit_bt_tpl=="" || $(submit_bt_tpl).html()==null){
            submit_bt_tpl = default_submit_bt;
        }
        submit_bt_tpl =$(submit_bt_tpl).addClass(submit_file_bt_name)
                                       .val(Lang.submitBTShowName)
                                       .html(Lang.submitBTShowName)
                                       .css({"cursor":"pointer"});
        submit_file_tpl=$(submit_file_tpl).html(submit_bt_tpl);
        dropzone.append(submit_file_tpl);
        /* END : set submit button */

        dropzone.append(loading_tpl).find('.info').html(options.loading_info); //set Loading page.


        preview = dropzone.find('.'+preview_name);
        defaultUploadBtn = dropzone.find('.'+upload_file_name);
        droparea_loading = dropzone.find('.'+loading_name);
        select_bt = dropzone.find("."+select_bt_name);
        submit_file = dropzone.find("."+submit_file_name);
        submit_file_bt = dropzone.find("."+submit_file_bt_name);

        /* START : Set input file multiple */
        if(options.multiple){
            defaultUploadBtn.attr("multiple");
        }else{
            defaultUploadBtn.removeAttr("multiple");
        }
        /* END : Set input file multiple */

        /* START : set process info */
        if(options.process_info ==true){
            dropzone.append(process_info_tpl);
        }
        /* END : set process info */


        /* START : check custom option resize info */
        if(Object.keys(options.resize).length<=0){
            var text=Lang.options_resize_error_no;
            input_process_data(text);
            init_flag=false;
            init_error+=text+";";
        }else{
            for(var resizeKey in option.resize){
                if(isNaN(option.resize[resizeKey])){
                    var text = Lang.options_resize_set_error.replace(/{resizeKey}/gi,resizeKey);
                    input_process_data(text);
                    init_flag=false;
                    init_error+=text+";";
                }
            }
        }
        /* END : check custom option resize info */

        /* START : check custom option preview resize */
        if(isNaN(options.preview_size)){
            var text = Lang.options_preview_set_error;
            input_process_data(text);
            init_flag=false;
            init_error+=text+";";
        }
        /* END : check custom option preview resize */

        /* START : check custom option setTimeout delay */
        if(isNaN(options.delay)){
            option.delay=1000;
        }
        /* END : check custom option setTimeout delay */

        /* START : check custom option ajax type */
        options.ajax_type = options.ajax_type.toUpperCase();
        if( !(options.ajax_type=="POST" || options.ajax_type=="GET" ) ){
            options.ajax_type="POST";
        }
        /* END : check custom option ajax type */


        /* START : check browser support input file */
        if(!isInputTypeFileImplemented()){
            var text = Lang.support_input_file_error;
            input_process_data(text);
            init_flag=false;
            init_error=text;
        }
        /* END : check browser support input file */

        /* START : check browser support html5 canvas */
        if(!isCanvasSupported()){
            var text = Lang.support_html5_canvas_error;
            input_process_data(text);
            init_flag=false;
            init_error=text;
        }
        /* END : check browser support html5 canvas */

        /* START : check browser support html5 File Reader API */
        if(!isFileReaderSupported()){
            var text = Lang.support_html5_filereader_api_error;
            input_process_data(text);
            init_flag=false;
            init_error=text;
        }
        /* END : check browser support html5 File Reader API */


        /* START : set UI action */
        dropzone.bind('dragover', function() {
            //add hover class when drag over
            if(dropzone.data("loading")!==true){
                dropzone.addClass('hover');
            }
            return false;
        });

        dropzone.bind('dragleave', function() {
            //remove hover class when drag out
            dropzone.removeClass('hover');
            return false;
        });

        dropzone.bind('drop', function(e) {
            //drop in proccess
            e.stopPropagation();
            e.preventDefault();
            if(dropzone.data("loading")!==true){
                if(init_flag){
                    //prevent browser from open the file when drop off
                    dropzone.removeClass('hover');
                    checkProcessShow();
                    //retrieve uploaded files data
                    var files = e.originalEvent.dataTransfer.files;
                    processFiles(files);
                }else{
                    input_process_data(Lang.init_error);
                }
            }
            return false;
        });

        select_bt.bind('click',function(e){
            UploadFileClick(e);
        });

        defaultUploadBtn.bind('change',function(){
            var files = $(this)[0].files;
            $(this)[0].files=null;
            processFiles(files);
            return false;
        });

        submit_file_bt.bind('click',function(){
            var rand = String(Math.random());
            rand = rand.substring(rand.length-9,rand.length);

            ajax_token= rand+String(new Date().getTime());
            ajax_token = ajax_token.toString(36);

            submitFileProcess();
        });

        preview.delegate("."+imageholder_name,"click",function(){
            var imageholder = dropzone.find("."+imageholder_name);
            var index = imageholder.index($(this));
            imageholder.not( $(this)).removeClass("focus").find(".del").fadeOut();

            $(this).addClass("focus").find(".del").fadeIn();
            $(this).find(".del").unbind('click').bind('click',function(){
                var del_key=$(this).parents("."+imageholder_name).attr("key");
                removeImageItem(del_key,"");
            });
        });

        preview.delegate("."+imageholder_name,"mouseover",function(){
            $(this).addClass("hover");
        });

        preview.delegate("."+imageholder_name,"mouseout",function(){
            $(this).removeClass("hover");
        });


        /*  END  : set UI action */

    };



    /* START : Process FileList */
    var processFiles =function(files){
        checkProcessShow();
        processFlag = processFlag_default;

        setTimeout(function(){
            if(files && typeof FileReader !== "undefined") {
                //process each files only if browser is supported
                processFlag.count = files.length;
                for(var i=0; i<files.length; i++) {
                    processFlag.flag[i]=false;
                    readFile(files , i);
                }
            }else {
                checkProcessHide();
                checkDropareaType();
            }
        },options.delay);
    };
    /*  END  : Process FileList */

    /* START : Read the File Object */
    var readFile = function(files,processkey) {
        var file = files[processkey];
        if(!checkCanUpload()){
            processFlag.flag[processkey]=true;
            checkProcessHide();
            checkDropareaType();

            input_process_data( Lang.not_multiple );
        }else{
            if( (options.filter).test(file.type) ) {
                uploadData_count = uploadData_count+1;
                uploadData[uploadData_count]=file;
                preview.append($("<div></div>").addClass(imageholder_name).attr({"key":uploadData_count}).html(options.loading_preview));
                createPreview( file , uploadData_count , processkey);
            } else {
                //some message for wrong file format
                processFlag.flag[processkey]=true;
                checkProcessHide();
                checkDropareaType();

                var text = Lang.file_not_supported.replace(/{file_name}/gi,file.name);
                input_process_data(text);
            }
        }
    };
    /*  END  : Read the File Object */


    /* START : Draw Image Preview */
    var createPreview = function(file,key,processkey) {
        canvasResize(file, {
            width: options.preview_size,
            height: options.preview_size,
            crop: false,
            quality: 100,
            rotate: 0,
            callback: function(data, width, height) {
                var imageObj = {};
                imageObj.filePath = data;
                imageObj.fileName = file.name.substr(0, file.name.lastIndexOf('.')); //subtract file extension
                var tpl=tpl_imageholder;
                tpl = tpl.replace(/\{filePath\}/gi,imageObj.filePath);
                tpl = tpl.replace(/\{fileName\}/gi,imageObj.fileName);

                preview.find("."+imageholder_name+"[key='"+key+"']").html(tpl);
                preview.find("."+imageholder_name+"[key='"+key+"'] .image img").load(function(){
                    processFlag.flag[processkey]=true;
                    checkProcessHide();
                    checkDropareaType();

                    var text = Lang.create_preview.replace(/{file_name}/gi,file.name);
                    input_process_data(text);
                });

            }
        });
    };
    /*  END  : Draw Image Preview */



    /* START : submit file to server :step1 - check file  */
    var submitFileProcess=function(){

        if(!options.ajax_parallel){
            //sequencial
            var uploadData_key ="";
            if(Object.keys(uploadData).length>0){
                for(var key in uploadData){
                    if(uploadData[key]!=null){
                        uploadData_key=key;
                        break;
                    }
                }
            }
            if(uploadData_key!=""){
                checkSubmitProcessShow();
                upload_to_server_one(uploadData_key);
            }else{
                checkSubmitProcessHide();
            }
        }else{
            //parallel
            var flag =true;
            if(Object.keys(uploadData).length>0){
                for(var key in uploadData){
                    if(uploadData[key]==null){
                        flag =false;
                        break;
                    }
                }
            }else{
                flag =false;
            }
            if(flag){
                checkSubmitProcessShow();
                for(var uploadData_key in uploadData){
                    upload_to_server_one(uploadData_key);
                }
            }
        }
    };
    /*  END  : submit file to server :step1 - check file  */


    /* START : submit file to server :step2 - upload to server one  */
    var upload_to_server_one = function(key){
        file = uploadData[key];
        if(file != null){
            var uploadFile={};
            for(var resize_key in options.resize){
                uploadResize(uploadFile,resize_key,key);
            }
        }
    };
    /*  END  : submit file to server :step2 - upload to server one  */

    /* START : submit file to server :step3 - resize and save;  */
    var uploadResize = function(uploadFile,resize_key,key){
        file = uploadData[key];
        canvasResize(file, {
                            width: options.resize[resize_key],
                            height: options.resize[resize_key],
                            crop: false,
                            quality: 100,
                            rotate: 0,
                            callback: function(data, width, height) {
                                uploadFile[resize_key]=data;
                                upload_to_server(uploadFile,key);
                            }
                    });
    };
    /*  END  : submit file to server :step3 - resize and save;  */


    /* START : submit file to server :step4 - submit to server */
    var upload_to_server=function(uploadFile,key){
        var uploadflag=true;
        for(var resize_key in options.resize){
            if(typeof(uploadFile[resize_key])=="undefined"){
                uploadflag=false;
                break;
            }
        }

        if(uploadflag){
            var fd = new FormData();
            var file = uploadData[key];
            var fileName = file.name;
            fd.append(options.ajax_prefix+"filename", fileName);
            fd.append(options.ajax_prefix+"token", ajax_token);
            fd.append(options.ajax_prefix+"key", key);

            if(typeof(options.ajax_data)=="object"){
                if(options.ajax_data!={}){
                    for(var ajax_data_one in options.ajax_data){
                        fd.append(ajax_data_one, options.ajax_data[ajax_data_one]);
                    }
                }
            }

            for(var resize_key in options.resize){
                uploadFile[resize_key] = canvasResize('dataURLtoBlob', uploadFile[resize_key]);
                uploadFile[resize_key].name = fileName;
                fd.append(resize_key, uploadFile[resize_key]);
            }

            var xhr = new XMLHttpRequest();
            xhr.open(options.ajax_type, options.ajax_url, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("pragma", "no-cache");

            //Upload progress
            xhr.upload.addEventListener("progress", function(e) {
                if (e.lengthComputable) {
                    var loaded = Math.ceil((e.loaded / e.total) * 100);
                    dropzone.find("."+imageholder_name+"[key='"+key+"'] .process .bar").width(loaded+"%");
                }
            }, false);

            //Upload error
            xhr.upload.addEventListener("error", function(e) {
            },false);

            //Upload abort
            xhr.upload.addEventListener("abort", function(e) {
            },false);

            // File uploaded
            xhr.addEventListener("load", function(e) {
                input_process_data(file.name+"->status:"+e.target.status);
                if(!options.ajax_parallel){
                    //sequencial
                    removeImageItem(key,submitFileProcess);
                }else{
                    //parallel
                    removeImageItem(key,checkSubmitProcessHide);
                }

                responseText  = e.target.responseText;

                var text = Lang.upload_success.replace(/{file_name}/gi,file.name);
                input_process_data(text);

                if(typeof(options.ajax_success)=="function"){
                    options.ajax_success(responseText);
                }
            }, false);

            xhr.send(fd);
        }
    };
    /*  END  : submit file to server :step4 - submit to server */







    /* START : check multiple or not can upload. */
    var checkCanUpload=function(){
        var flag = true;
        if(options.multiple!==true){
            if(Object.keys(uploadData).length>0){
                flag =false;
            }
        }
        return flag;
    }
    /*  END  : check multiple or not can upload. */

    /* START : show submit Loading */
    var checkSubmitProcessShow=function(){
        droparea_loading.show();
        dropzone.data({"loading":true});
    };
    /*  END  : show submit Loading */

    /* START : hide submit Loading */
    var checkSubmitProcessHide=function(){
        if(Object.keys(uploadData).length==0){
            if(typeof(options.ajax_finish)=="function"){
                options.ajax_finish();
            }
            setTimeout(function(){
                var text = Lang.upload_finsih;
                input_process_data(text);
            },options.delay);

            droparea_loading.hide();
            dropzone.data({"loading":false});
        }
    };
     /*  END  : hide submit Loading */


    /* START : when select file ,show loading */
    var checkProcessShow=function(){
        droparea_loading.show();
        dropzone.data({"loading":true});
    };
    /*  END  : when select file ,show loading */


    /* START : when select file end ,show loading */
    var checkProcessHide=function(){
        var count = processFlag.count;
        var flag = true;
        if(count>0){
            for(var i=0; i<count; i++) {
                if(!processFlag.flag[i]){
                    flag=false;
                    break;
                }
            }
        }
        if(flag){
            droparea_loading.hide();
            dropzone.data({"loading":false});
        }
    }
    /*  END  : when select file end ,show loading */



    /* START : check Droparea show or hiden */
    var checkDropareaType =function(){
        if($('.'+DropHtml5Upload+" ."+imageholder_name).length<=0){
            preview.hide();
            dropareainner.show();
            submit_file.hide();
        }else{
            preview.show();
            submit_file.show();
            dropareainner.hide();
        }
    };
    /*  END  : check Droparea show or hiden */


    /* START : check Droparea show or hiden */
    var removeImageItem=function(ImageItem_key,callback){
        preview.find(".imageholder[key='"+ImageItem_key+"']").fadeOut(function(){
            $(this).remove();
            checkDropareaType();
        });

        uploadData[ImageItem_key]=null;
        delete uploadData[ImageItem_key];

        var txt= Lang.del_item;
        txt = txt.replace(/\{key\}/gi,ImageItem_key);
        input_process_data(txt);

        if(typeof(callback)=="function"){
            callback();
        }

    };
    /*  END  : check Droparea show or hiden */



    /* START : action : click upload file button */
    var UploadFileClick=function(e){
        e.stopPropagation();
        e.preventDefault();
        if(init_flag){
            checkProcessShow();
            defaultUploadBtn.focus().trigger('click');
        }else{
            input_process_data(Lang.init_error);
        }


        $(window).bind('focus',Listener);
        window.addEventListener('touchend',Listener,false);
    }

    this.UploadFileClick=function(e){
        UploadFileClick(e);
    }

    var Listener=function(){
        if(defaultUploadBtn.val()==""){
            checkProcessHide();
        }
        $(window).unbind('focus');
        window.removeEventListener('touchend', Listener, false);
    }
    /*  END  : action : click upload file button */



    /* START : input error data */
    var input_process_data=function(text){
        var target = dropzone.find("."+process_info_name+" ."+process_info_data );
        if(target.val()!=""){
            text="\r\n"+text ;
        }
        target.val(target.val() + text );
        target.scrollTop(target.scrollTop()+100);
    }

    this.input_process_data=function(text){
        input_process_data(text);
    }
    /*  END  : input error data */


    /* START : check browser support input file. */
    function isInputTypeFileImplemented(){
         var elem = document.createElement("input");
         elem.type = "file";
         if (elem.disabled) return false;
         try {
             elem.value = "Test"; //Throws error if type=file is implemented
             return elem.value != "Test";
         } catch(e) {
             return elem.type == "file";
         }
     }
    /*  END  : check browser support input file. */


    /* START : check browser support html5 canvas. */
    function isCanvasSupported(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
    /*  END  : check browser support html5 canvas. */

    /* START : check browser support html5 File Reader API */
    function isFileReaderSupported(){
        if(typeof FileReader !== "undefined"){
            return true;
        }else{
            return false;
        }
    }
    /*  END  : check browser support html5 File Reader API */


    /* START : action : checkupdateData */
    this.checkupdateData=function(e){
        return uploadData;
    };
    /*  END  : action : checkupdateData */

    init(); //action initialization
};
