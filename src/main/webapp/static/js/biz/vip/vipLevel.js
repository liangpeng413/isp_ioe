'use strict';
var App = angular.module('vipLevelApp', [], angular.noop);
App.controller("vipLevelController", ['$scope','$http',  function ($scope,$http) {
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.investChannel = '';
    $scope.vipLevelNum="";
    $scope.investChannel="";
    $scope.param={};
    $scope.search.investChannel='0';
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
    	$('#addPicture').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
             var fileUrl = data.result.resp;
            $('#fileUrl').prop("value",fileUrl);
             $('#image_prew').prop("src",fileUrl);
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


    //重置
    $scope.reset = function(){
    	$scope.search={};
    	$scope.search.investChannel = '';
    }
    

    $scope.moveUp = function(){
    	var indexStr = "";
    	$('.sort').each(function(){
            if(this.checked == true){
            	indexStr += $(this).val() + ",";
            }
        })
        if(indexStr==""){
        	alert('请选中其中一项进行操作');
        	return;
        }
        var indexs = indexStr.split(',');
    	if(indexs.length>2){
    		alert('只能选中其中一项进行操作');
    		return;
    	}
    	var index = parseInt(indexs[0]);
    	if(index==0){
    		return;
    	}else{
    		var pre = $scope.strotList[index-1];
    		$scope.strotList[index-1] = $scope.strotList[index];
    		$scope.strotList[index] = pre;
    	}  	
    	
    }
    
    $scope.moveDown = function(){
    	var indexStr = "";
    	$('.sort').each(function(){
            if(this.checked == true){
            	indexStr += $(this).val() + ",";
            }
        })
        if(indexStr==""){
        	alert('请选中其中一项进行操作');
        	return;
        }
        var indexs = indexStr.split(',');
    	if(indexs.length>2){
    		alert('只能选中其中一项进行操作');
    		return;
    	}
    	var index = parseInt(indexs[0]);
    	if(index==$scope.strotList.length-1){
    		return;
    	}else{
    		var after = $scope.strotList[index+1];
    		$scope.strotList[index+1] = $scope.strotList[index];
    		$scope.strotList[index] = after;
    	}  	
    	
    }
    
    //优先级排序
    $scope.strotList = {}
    $scope.sort = function(vipLevelNum,investChannel){
    	 $scope.vipLevelNum=vipLevelNum;
    	 $scope.investChannel=investChannel;
   	 	var url = globalConfig.basePath+"/vip/level/sortEquityList?levelId="+vipLevelNum+"&"+"investChannel="+investChannel;
   	 	$http.get(url).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp.result;
            	 console.log($scope.strotList);
            	 $('#addSort').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
    	
    }
    
    //保存排序
    $scope.moveSave = function(){
    	var ids="";
    	if($scope.strotList.length<1){
    		//alert('请至少保留其中两项进行保存');
    		alert('操作成功');
    		$('#addSort').hide();
    		return;
    	}
    	for(var i=0;i<$scope.strotList.length;i++){
    		ids = ids + $scope.strotList[i].priType+ ",";
    	}
    	   ids =ids.substring(0,ids.lastIndexOf(","));
    	    $scope.param.levelId = $scope.vipLevelNum;
    	    $scope.param.investChannel = $scope.investChannel;
    	    $scope.param.ids = ids;
        var url = globalConfig.basePath+"/vip/level/prioritySort";
        $http.post(url,$scope.param).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                self.strotList = {};
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //取消排序
    $scope.moveCancel = function(){
        $('#addSort').hide();
        self.strotList={};
    }
    //声明对象
    function ObjSort(id,desc) 
    {
        this.id = id;
        this.desc= desc;  
    }
  
    
  //查询会员等级列表
    $scope.queryVipLevel = function(){
    	var channel=  $scope.search.investChannel;
        var url = globalConfig.basePath+"/vip/level/levelList?investChannel="+channel;
        $http.get(url).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.pageList = data.data.resp.result;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
  
    $scope.queryVipLevel();

   //查看log日志
    $scope.logtList = {}
    $scope.lookLog = function(vipLevelNum,investChannel){
    	var url = globalConfig.basePath+"/vip/level/vipLevelLogList?levelId="+vipLevelNum+"&"+"investChannel="+investChannel;
   	 	$http.get(url).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.logtList = data.data.resp.result;
            	 $('#detailLog').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
    	
    }
    
    //跳转权益设置页面
    $scope.toSetEquity =function(levelId,investChannel){
    	 window.location.href=globalConfig.basePath+'/vip/setEquity?levelId='+levelId+"&investChannel="+investChannel;
    }

}]);

