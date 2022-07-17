'use strict';
var App = angular.module('problemReviewApp', [], angular.noop);
App.controller("problemReviewController", ['$scope','$http',  function ($scope,$http,$compile) {
    var self = $scope;
    $scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '6';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.problem = {};
    $scope.add.productVersion = [];
    $scope.searchTypeOneList = [];
    $scope.searchTypeTwoList = [];
    $scope.search.createTimeSort = '1';

    //初始化
    $scope.load = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.searchTypeOneList = data.data.resp.result;
            $scope.search.typeOne = '';
            $scope.searchTypeTwoList = [];
            $scope.search.typeTwo = '';
            $scope.pageQueryTab(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取一级分类列表失败了....");
        });
    };

    $scope.load("sys_question_type_one_shop");

    // 按渠道类型一级分类列表
    $scope.getTypeOneList = function(productChannel){
        var type = '';
        if(productChannel == '6'){
            type = 'sys_question_type_one_shop';
        }
        if(type==''){
            return;
        }
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.searchTypeOneList = data.data.resp.result;
            $scope.search.typeOne = '';
            $scope.searchTypeTwoList = [];
            $scope.search.typeTwo = '';
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };

    // 按渠道类型和一级分类获取二级分类列表
    $scope.getTypeTwoList = function(typeOne){
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.search.productChannel + "&productVersion=" + typeOne + "&loginStatus=2" + "&resourceType=sys_question_classify_two";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.searchTypeTwoList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取二级分类列表失败了....");
        });
    };

    //常见问题待审核列表查询
    $scope.pageQueryTab = function(pageNum){
        $('#allList').prop("checked",false);
        if($scope.pages<pageNum&&pageNum!=1){
            return;
        }
        if(!pageNum){
            $scope.search.pageNum = $scope.pageNum;
        } else {
            $scope.search.pageNum = pageNum;
        }
        $scope.search.sortKey = 'create_time';
        if($scope.search.createTimeSort=='2'){
            $scope.search.sortDirection = 'asc';
        }else{
            $scope.search.sortDirection = 'desc';
        }
        var url = globalConfig.basePath+"/problem/review/list";
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
        $scope.pageQueryTab(1);
    });

    //重置
    $scope.reset = function(){
        var num = $scope.search.pageNum;
        var size = $scope.search.pageSize;
        $scope.search={};
        $scope.search.pageNum = num;
        $scope.search.pageSize = size;
        $scope.search.productChannel = '6';
        $scope.getTypeOneList($scope.search.productChannel);
        $scope.search.operator = '';
        $scope.search.keyword = '';
    }

    //排序
    $scope.sortByCreateTime = function(){
        $scope.pageQueryTab(1);
    }

    //查看
    self.look = function(query){
        self.detail=query;
        $('#problemReviewDetail').show();
    }

    //批量通过展示
    self.batchPass = function(){
        var ids = '';
        var flag = false;
        $("input[name='problemReview']").each(function(){
            if($(this).is(":checked"))
            {
                var obj = $(this).val();
                var arry = obj.split('-');
                var id = arry[0];
                var auditStatus = arry[1];
                if(auditStatus!=0){
                    flag = true;
                    return false;
                }
                ids += id+',';
            }
        });

        if(flag){
            alert("有审核过的记录请重新选择！");
            return;
        }

        if(ids==''){
            alert("请选择待审核记录！");
            return;
        }
        self.problem.ids= ids;
        self.problem.tip= '确定批量通过？';
        self.problem.flag= '1';
        $('#batchShow').show();
    }

    //批量拒绝展示
    self.batchRefuse = function(){
        var ids = '';
        var flag = false;
        $("input[name='problemReview']").each(function(){
            if($(this).is(":checked"))
            {
                var obj = $(this).val();
                var arry = obj.split('-');
                var id = arry[0];
                var auditStatus = arry[1];
                if(auditStatus!=0){
                    flag = true;
                    return false;
                }
                ids += id+',';
            }
        });

        if(flag){
            alert("有审核过的记录请重新选择！");
            return;
        }

        if(ids==''){
            alert("请选择待审核记录！");
            return;
        }
        self.problem.ids= ids;
        self.problem.tip= '确定批量拒绝？';
        self.problem.flag= '2';
        $('#batchShow').show();
    }

    //批量通过
    self.confirmBatch = function(){
        var ids = $('#problemIds').val();
        var flag = $('#problemFlag').val();
        if(flag=='1'){
            $http.post(globalConfig.basePath + "/problem/review/batchPass", {
                ids: ids}).then(function (result) {
                if(result.data.code=='000'){
                    alert("操作成功！");
                    $scope.pageQueryTab(1);
                }else{
                    alert(result.data.message);
                }
                $('#batchShow').hide();
            });
        }else{
            $http.post(globalConfig.basePath + "/problem/review/batchRefuse", {
                ids: ids}).then(function (result) {
                if(result.data.code=='000'){
                    alert("操作成功！");
                    $scope.pageQueryTab(1);
                }else{
                    alert(result.data.message);
                }
                $('#batchShow').hide();
            });
        }
    }

    //全选
    self.allListClick = function(){
        if($('#allList').is(":checked")){
            $("input[name='problemReview']").each(function(){
                $(this).prop("checked",true);
            });
        }else{
            $("input[name='problemReview']").each(function(){
                $(this).prop("checked",false);
            });
        }
    }

    /**
     * 审批
     */
    self.check = function(record){
        if(record.auditStatus != "0"){
            alert('只能对待审核状态的数据进行操作');
            return;
        }
        self.auditStatus = "1";
        $('.examine-box').show();
        self.confirmRecord = angular.copy(record);
        self.auditDescription = "";
    };

    // 审核
    self.confirm = function(){
        self.confirmRecord.auditStatus = self.auditStatus;
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath+"/problem/review/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {

            if(callback.data.code == '000'){
                $('.examine-box').hide();
                $scope.pageQueryTab(1);
                alert("操作成功");
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
}]);