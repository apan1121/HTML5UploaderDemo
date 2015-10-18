# HTML5UploaderDemo
><pre>
   option= {
           resize: {"file":1024},
           preview_size:100,
           drop_info:'&lt;p class="dropfiletext"&gt;Drop files here&lt;/p&gt;&lt;p&gt;or&lt;/p&gt;',
           select_bt:'&lt;input type="button" value="Select Files" in_option/&gt;',
           submit_bt:'&lt;input type="button" value="upload" in_option/&gt;',
           loading_info:'&lt;img src="/images/loader_128x15.gif"&gt;',
           loading_preview:'&lt;img src="/images/loading_old.gif"&gt;',
           filter : /image/i,
           ajax_parallel:false,
           ajax_prefix:'',
           ajax_type:'POST',
           ajax_url:'upload.php',
           ajax_data:{},
           ajax_success:{},
           ajax_finish:{},
           int_error:function(err){alert(err);},
           delay:1000,
           lang:{   "selectBTShowName":'select file',
                    "submitBTShowName":'upload',
                    "file_not_supported":'*{file_name}:Selected file format not supported!',
                    "create_preview": '{file_name}:create preview',
                    "upload_success": '{file_name}:upload success',
                    "upload_finsih": 'upload finsih.',
                    "not_multiple": 'only can upload one file.',
                    "init_error":"init error",
                    "support_input_file_error":"input file can't support",
                    "support_html5_canvas_error":"html5 canvas can't support",
                    "support_html5_filereader_api_error":"html5 FileReader API can't support",
                    "options_preview_set_error": 'preview size is not number',
                    "options_resize_error_no": 'please set option->resize',
                    "options_resize_set_error": 'resize \'{resizeKey}\' is not number'},
           multiple :true,
           process_info:true
         };
    $(document).ready(function(){
        DropHtml5Upload = new DropHtml5Upload("#droparea",option);
    });
<pre>

- resize (array): set you need size and data name  
  ex: resize:{"b":1024,"n":460,"m":200,"s":50}
- preview_size (int):   preview pic size  
  ex: preview_size:100
- drop_info (html): drop area show text
- select_bt (html): select pic button.  
  ex:  select_bt:'&lt;input type="button" value="Select Files" in_option/&gt;'  
  or  
  select_bt:'&lt;div class='select_bt' &gt; select &lt;/div&gt;'
- submit_bt (html): select pic button.  
  ex:  submit_bt:'&lt;input type="button" value="Upload to server" in_option/&gt;' 
  or  
  submit_bt:'&lt;div class='select_bt' &gt; Upload to server &lt;/div&gt;'  
- loading_info (html): when process,show Loading UI.    
  ex:   loading_info:'&lt;img src="/images/loader_128x15.gif"&gt;'
- loading_preview (html): when create preview, Loading UI.  
  ex:   loading_preview:'&lt;img src="/images/loading_old.gif"&gt;'
- filter (html): need upload file type.  
  ex:   filter : /image/i
- ajax_parallel (boolean): ajax to server parallel or sequencial.  
  ex:   ajax_parallel:true
- ajax_prefix (string): ajax DropHtml5Upload default data prefix.  
  ex:   ajax_prefix:'DropHtml5Upload_'
- ajax_type (string): upload to server method.  
  ex:   ajax_type:'POST'
- ajax_url (string):    server url.  
  ex:'upload.php'
- ajax_data (array): Extended input data to server.  
  ex:   ajax_data:{lib:100,pageid:100}
- ajax_success (function): when one file upload finish callback.  
  ex:  
  ajax_success:function(server_return_data){
     alert(server_return_data);
  }
- ajax_finish (function): when all files upload finish callback.  
  ex:  
  ajax_finish:function(){    
    alert("finish");  
  }  
- int_error (function): when init error callback.  
  ex:
  int_error:function(err){  
    alert(err);  
    location.href='';  
  }  
- delay (int): set time out delay time
- lang (array): custom process info laguage or button show name.  
  ex: 
  lang:{selectBTShowName:"選擇檔案",  
      init_error:"初始化錯誤"}  
- multiple (boolean): single file or multiple files.  
  ex:   multiple:true
- process_info (boolean): show process info.  
  ex: process_info:true
