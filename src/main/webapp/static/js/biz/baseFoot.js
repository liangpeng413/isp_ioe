$(document).ready(function(){
    /* 调整左侧的菜单 */
    var cur_path = window.location.pathname.substring(window.location.pathname.lastIndexOf("/")+1);
    $("#"+cur_path+"_menus").addClass("active");
    $("#"+cur_path+"_menus").parents('li').addClass("active");
    $("#"+cur_path+"_menus").parents('ul').addClass("in");
    $("#"+cur_path+"_menus").addClass("active");

    // 日期插件
    $('.input-date').datepicker({
        language: 'zh-CN',
        startView: 3,
        autoclose: true,
        todayBtn: "linked",
        format: "yyyy-mm-dd"
    });
});

function getType(productChannel,name){
	var type;
	 if(productChannel==0){
         type = 'sys_product_version_wk_'+name;
     }else if(productChannel==2){
         type = 'sys_product_version_wx_'+name;
     }else  if(productChannel==1){
         type = 'sys_product_version_qb_'+name;
     }
	 if(productChannel==3){
         type = 'sys_product_version_qb_'+name;
     }
	
	 return type;
}