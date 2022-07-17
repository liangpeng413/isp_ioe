'use strict';
var App = angular.module('floatApp', [], angular.noop);
App.controller("floatController", ['$scope','$http',  function ($scope,$http) {
	$scope.isCommitted = true;
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '';
    $scope.search.loginStatus = '';
    $scope.search.auditStatus = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
   

    //重置
    $scope.reset = function(){
    	var num = $scope.search.pageNum;
    	var size = $scope.search.pageSize;
    	
    	
    	//$scope.search.productVersion = $scope.typeVersionList[0].label;
    }
  
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
        $scope.pageQuerytask(1);
    });
   

    $scope.editPrivilege = function(record){
    	$scope.operationRecord = record;
        $scope.operationRecord.status = $scope.operationRecord.status + "";
        $('#addIvrTask').show();
    }
    
    $scope.getCache = function(record){

        $('#getCache').show();
    }
    
    $scope.delCache = function(record){
        $('#delCache').show();
    }
    
    $scope.closeDelCache = function(){    
        $('#delCache').hide();

    }
    $scope.closeGetCache = function(){    
        $('#getCache').hide();

    }
    
    //添加
    $scope.closeAddFloat = function(){    
        $('#addFloat').hide();

    }
    $scope.u={}
    //修改

    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    

   

   
    $scope.pageQuerytask = function(pageNum){
    	if(pageNum==0){
    	    alert("无数据")
    	    return;
        }
        if($scope.pages<pageNum&&pageNum!=1){
            return;
        }
        if(!pageNum){
            $scope.search.pageNum = $scope.page;
        } else {
            $scope.search.pageNum = pageNum;
        }
       
        $scope.search.privilegeId = "";
        var url = globalConfig.basePath+"/memberList/list";
        $http.post(url,$scope.search).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.pageList = data.data.resp.result;
                    $scope.total = data.data.resp.totalRowSize;
                    $scope.pages = data.data.resp.pageCount;
                    //if($scope.pages<pageNum);
                    //$scope.search.pageNum = $scope.pages;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $("#pageSize").change(function(){
        $scope.search.pageSize = $("#pageSize").val();
        $scope.pageQuerytask(1);
    });

    $scope.pageQuerytask(1);
    $scope.closeAdd = function () {
        $scope.memberFile2=null;
        $("#addIvrTask").hide();
       
        
    }
   

    $scope.saveTask = function () {
    	var url = globalConfig.basePath+"/memberList/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                	$("#addIvrTask").hide();
                    $scope.operationRecord = {};
                    $scope.pageQuerytask(1);
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    
    $scope.saveGetCache = function () {
    	var url = globalConfig.basePath+"/memberList/getCache";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('查询成功');
                	$scope.cache = data.data.resp;
                	
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    
    $scope.saveDelCache = function () {
    	var url = globalConfig.basePath+"/memberList/delCache";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('删除成功');
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    

}]);


