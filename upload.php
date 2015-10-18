<?php
set_time_limit(0);

$file = $_FILES;
$time=time();
print_R($_POST);
foreach($file AS $key => $file_one){
    $file = isset($_POST["filename"])?$_POST["filename"] :"" ;

    $file = explode(".",$file);
    $file[0]=str_replace(" ","_",$file[0]);
    $dataPath = "/upload/".$time.$file[0]."_".$key.".".$file[1];

    if(move_uploaded_file($file_one["tmp_name"], dirname(__FILE__).$dataPath)) {
        echo $dataPath."#success \r\n";
    } else {
        echo $dataPath.'#Fail \r\n';
    }

}
//print_R($_FILES['file']);
//    if(isset($_FILES['file'])) {
//        echo "zzz";
//        if(move_uploaded_file($_FILES["file"]["tmp_name"], "upload/".$_POST["filename"])) {
//            echo 'Upload Success';
//        } else {
//            echo '#Fail';
//        }
//    } else {
//        header("Location: http://www.inwebson.com/html5/html5-drag-and-drop-file-upload-with-canvas");
//    }
?>
