'use strict';
var App = angular.module('setEquityApp', [], angular.noop);
App.controller("setEquityController", ['$scope','$http',  function ($scope,$http) {
	$scope.loginName = globalConfig.loginName;
	$scope.levelId = globalConfig.levelId;
	$scope.investChannel = globalConfig.investChannel;
    $scope.search = {};
    $scope.editable = false;
    $scope.editables = false;
    $scope.fileEditable = false;
    $scope.canBeTopp = false;
    $scope.editableBox =false;
    $scope.canBeTopping ='F';
    $scope.iconUrl = "";
    $scope.priType = "";
    $scope.params = {};
    $scope.pageList={};
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
    	$('#addPicture').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            //console.log(data.result);
        	//$scope.changePicStatus();
             var fileUrl = data.result.resp;
             $scope.iconUrl = fileUrl;
             $('#img'+ $scope.priType).prop("src",fileUrl);
             $('#fileUrl'+ $scope.priType).prop("value",fileUrl);
             $('#pew'+ $scope.priType).prop("src",fileUrl);
             
             swal("上传成功")
        }
    	}).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                swal("出错了", "请上传图片文件", "error");
                return;
            }
        }
    	});
    	
    });
  
  //查询会员权益集合
    $scope.queryVipEquity = function(){
     var levelId = $scope.levelId;
     var investChannel = $scope.investChannel;
     var url = globalConfig.basePath+"/vip/level/vipEquityList?levelId="+levelId+"&investChannel="+investChannel;
        $http.get(url).then(
            function(data){
                if(data.data.code=='000'){
                	var equityList = [];
                   // $scope.pageList = data.data.resp.result;
                    $.each(data.data.resp.result, function (an, v){
                    	if(v.canBeTopping == 'T'){
                    		v.top=true;
                    	}
                    	if(v.initialization == 'F'){
                    		v.init=true;
                    	}
                    	if(""==v.priIcon){
                    		v.picStatus=1;
                    	}
                    	equityList.push(v);
                    })
                    $scope.pageList = equityList;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.queryVipEquity();
    
    //是否可编辑
    $scope.changeEdit = function(status){
    	 $scope.editable = status; 
    	 $scope.editableBox = status;
    	 $scope.fileEditable = status;
    	 if('T'== $scope.canBeTopping){
    		 $scope.canBeTopp = status;
    	 }
    } 
    
    //显示图片
    $scope.showUrl = function(value){
    	if("" == $scope.iconUrl){
    		$scope.imgUrl = value.x.priIcon;
    	}else if(""==$('#fileUrl'+value.x.priType).val()){
    		$scope.imgUrl = value.x.priIcon;
    	}else{
    		$scope.imgUrl= $('#fileUrl'+value.x.priType).val();
    	}
    	 $("#showImg").prop("src",$scope.imgUrl);
    	 $('#addSort').show();
    }
    
    //上传icon图片
    $scope.addIcon = function(v){
    	 $scope.priType = v.priType;
    	 $('#addPicture').click();
    	 $.each($scope.pageList, function (an, k){
    		  if(v.priType==k.priType){
    			  k.picStatus=2;
    		  }
    	  })
    	 
    }
   //关闭图片弹框
    $scope.moveCancel = function(){
        $('#addSort').hide();
    }
    
   /* $scope.changePicStatus=function(){
    	$.each($scope.pageList, function (an, k){
     		  if($scope.priType==k.priType){
     			  k.picStatus=2;
     		  }
     	  })
    }*/
    
    //保存权益设置
    $scope.saveVipEquity = function(){
    	var idTypes="";
    	 $("#dataContent").find("input[name='box']").each(
    	     function(){
    	    	 if($(this).attr("checked") == "checked"){
    	    		 idTypes+=$(this).val()+","
    	    	 }
    	     })
    	     
    	     if(idTypes==""){
    	      alert("请至少选择一条权益进行设置！")
    	       return;
    	     }
    	 idTypes =idTypes.substring(0,idTypes.lastIndexOf(","));
    	 var  sp = idTypes.split(",");
    	 var equityList =[];
    	 for (var i=0;i<sp.length ;i++ ){ 
    		 $scope.param = {};
    	         var type = sp[i];
    	        
    	         if((undefined ==$("#pIcon"+type).val() || ""==$("#pIcon"+type).val())&& ""==$("#fileUrl"+type).val()){
    	        	 alert("请上传亮起的icon图标")
    	        	 return;
    	         }
    	         if($("#hot"+type).attr("checked") == "checked"){
    	        	 $scope.param.hot ="T";
    	         }else{
    	        	 $scope.param.hot ="F";
    	         }
    	         $scope.param.icon = $("#fileUrl"+type).val();
    	         if($("#priMain"+type).attr("checked") == "checked"){
    	        	 $scope.param.priMain ="T";
    	         }else{
    	        	 $scope.param.priMain ="F";
    	         }
    	         $scope.param.equityName=$("#priName"+type).val();
    	         $scope.param.priType=type;
    	         equityList.push($scope.param);
    	 } 
    	 $scope.params.levelId = $scope.levelId;
    	 $scope.params.platform = $scope.investChannel;
    	 $scope.params.equityList = equityList;
    	var url = globalConfig.basePath+"/vip/level/setEquity";
    	 $http.post(url,$scope.params).then(
    	            function(data){
    	                alert(data.data.message);
    	            },function(response) {
    	                alert("请求失败了....");
    	            });
    	
    }
    //改变勾选状态
    $scope.changeStatus=function(v){
    	var enjoy="";
	    	if("T"==v.whetherToEnjoy){
	    		enjoy="F";
	    	}else{
	    		enjoy="T";
	    	}
    	  $.each($scope.pageList, function (an, k){
    		  if(v.priType==k.priType){
    			  k.whetherToEnjoy=enjoy;
    		  }
    	  })
    }
    //勾选改变热门
    $scope.changeHot=function(h){
    	var hotStr="";
    	if("T"==h.hot){
    		hotStr="F";
    	}else{
    		hotStr="T";
    	}
    	 $.each($scope.pageList, function (an, k){
   		  if(h.priType==k.priType){
   			  k.hot=hotStr;
   		  }
   	  })
    }
    
    //勾选改变置顶
    $scope.changePri=function(p){
    	$.each($scope.pageList,function(an,j){
    		if("T"==j.priMain){
    			j.priMain="F";
    		}
    		
    	})
    
    	 $.each($scope.pageList, function (an, k){
      		  if(p.priType==k.priType){
      			  k.priMain="T";
      		  }
      	  })
    }
    
}]);

