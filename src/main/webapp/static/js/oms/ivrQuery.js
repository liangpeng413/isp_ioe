'use strict';
var App = angular.module('iverQueryApp', [], angular.noop);
App.controller("IverQueryController", ['$scope','$http',  function ($scope,$http) {
	$scope.isCommitted = true;
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.pageSize = $("#pageSize").val();
    $scope.pageNum = 1;
    $scope.pageList = {};

    $('.input-date').datepicker({
        language: 'zh-CN',
        startView: 3,
        autoclose: true,
        todayBtn: "linked",
        format: "yyyy-mm-dd"
    });

    $('.input-datetime').datetimepicker({
    	 format: 'yyyy-mm-dd hh:ii:ss',
    	language: 'zh-CN',   
    	timeText: '时间',
        hourText: '小时',
        minuteText: '分钟',
        secondText: '秒',
        currentText: '现在',
        closeText: '完成'
    });
    
    //查询
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
        if(globalConfig.wavId!=''){
        	$scope.search.wavId = globalConfig.wavId;
        }
        if(globalConfig.productChannel!=''){
            $scope.search.productChannel = globalConfig.productChannel;
        }
        var onlineTime = $("#queryOnlineTime").val();
        if (onlineTime != null && onlineTime != '') {
            $scope.search.onlineTime = $("#queryOnlineTime").val();
        }

        var url = globalConfig.basePath+"/IvrTask/queryIvrQuery";
        $http.post(url,$scope.search).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.pageList = data.data.resp.result;
                    $scope.total = data.data.resp.totalRowSize;
                    $scope.pages = data.data.resp.pageCount;
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

    $scope.tasksList = {}

    $scope.preOperate =function(opType,record){
        if(opType == 1){
            $("#detailTask").show();
            $scope.detail = angular.copy(record);
        } else if(opType == 2){
            $('#editTask').show();
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord.auditPerson="";
            $scope.editFloat($scope.operationRecord);
        } else if(opType == 3){
            $scope.effectRecord = record;
            $('#effectTask').show();
        } else if(opType == 4){
            $scope.operationRecord = record;
            $('#delTask').show();
        } else if(opType == 5){
            $scope.operationRecord = record;
            $scope.createT= 0;
            $('#createTask').show();
        } else if(opType == 6){
            $scope.operationRecord = record;
            $('#delCache').show();
        }
    }

    $scope.reset = function () {
        $scope.search.phone = '';
    }

}]);

App.filter("statusFilter",function(){
    return function (val) {
        var res="";
        switch (val){
            case 0:
                res="失效"
                break;
            case 1:
                res="队列中"
                break;
            case 2:
                res="进行中"
                break;
            case 3:
                res="已完成"
                break;
        }
        return res;
    }
})
