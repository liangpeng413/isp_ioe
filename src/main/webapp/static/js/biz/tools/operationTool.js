'use strict';
var app = angular.module('myApp', [], angular.noop);
app.controller("rootController", ['$scope','$http', function ($scope,$http) {
    var self = $scope;
    self.search = {};// 查询
    self.add={};//添加
    self.btnShow = 1;
    self.importMemberDiv=1;
    $scope.sendIntegtal = function(){
        var mobile=$scope.add.memberId;
        if(mobile==null || mobile=="" ){
            alert("手机号码不能为空！");
            return;
        }
        if(!(/^[0-9]*$/.test(mobile))){
            alert("用户ID有误，请重填！");
            return;
        }
        if($scope.add.point==null || $scope.add.point==""){
            alert("积分数量不能为空！");
            return;
        }
        if($scope.add.desc==null || $scope.add.desc==""){
            alert("描述不能为空！");
            return;
        }
        $("#OpenSsinglePoint").hide();
        var url = globalConfig.basePath+"/operation/tool/sendIntegral";
        $http.post(url,$scope.add).then(
            function successCallback(callback) {
                if(callback.data.code == '000'){
                    alert("操作成功");
                    self.loading();
                }else if(callback.data.code == '007'){
                    alert(callback.data.message);
                } else {
                    alert("操作失败");
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert(response);
            });
    };


    $scope.bind={};
    $scope.addBindRelation = function(){
        var memberId = $scope.bind.memberId;
        if(memberId == null || memberId == ""){
            swalMsg("用户ID不能为空！");
            return;
        }

        if($scope.bind.inviteMemberId==null || $scope.bind.inviteMemberId==""){
            swalMsg("邀请人不能为空！");
            return;
        }

        var url = globalConfig.basePath+"/operation/tool/addBindRelation";
        $http.post(url,$scope.bind).then(
            function successCallback(callback) {
                if(callback.data.code == '000'){
                    swalMsg("操作成功");
                }else {
                    swalMsg("操作失败");
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                swalMsg(response);
            });
    };

    //模板下载
    $scope.downloadTemplate = function () {
        window.open(globalConfig.basePath + "/operation/tool/downloadTemplate");
    };

    //积分列表查询
    self.querySplashConfigList = function(pageNum){
        if(!pageNum){
            self.search.pageNo = self.page.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                self.search.pageNo=self.search.pageCount;
            }else{
                self.search.pageNo = pageNum;
            }
        }
        self.search.startTime = $("#startTime").val();
        self.search.endTime = $("#endTime").val();
        var url = globalConfig.basePath+"/operation/tool/pagePointsExtendList";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNo = data.data.resp.currentPage;
                    self.search.pageSize = data.data.resp.pageSize+"";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.splashConfigList = data.data.resp.result;

                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    //默认查询
    self.loading = function(){
        self.search.memberId = "";//手机号码
        self.search.status="";//发放状态
        self.search.desc="";//描述
        self.search.point="";//积分数量
        self.search.type="";//类型
        $("#startTime").val("");
        $("#endTime").val("");
        self.search.pageNo = "1";
        self.search.pageSize = "5";
        self.querySplashConfigList(1);
    };
    self.loading();
    //重置
    self.reset = function(){
        // self.search={};
        self.search.memberId = "";//手机号码
        self.search.status="";//发放状态
        self.search.desc="";//描述
        self.search.point="";//积分数量
        self.search.type="";//类型
        self.search.batchid="";
        $("#startTime").val("");
        $("#endTime").val("");
        self.search.pageNo = "1";
        self.search.pageSize = "5";
    };
    // 发放积分
    $scope.OpenSsinglePoint = function () {
        $("#OpenSsinglePoint").show();
    }
    $scope.CloseSsinglePoint = function () {
        self.add.memberId = "";//手机号码
        self.add.desc="";//描述
        self.add.point="";//积分数量
        $("#OpenSsinglePoint").hide();
    }

    // 批量发放积分
    $scope.OpenBatchPoint = function () {
        self.totalCount = "";
        self.maxPoint = "";
        self.sumPoint = "";
        self.batchNo = "";
        self.btnShow=1;
        self.importMemberDiv=1;

        $("#OpenBatchPoint").show();
        $("#memberFile").val("");
        $("#updateMemberFileInput").val("");
    }


    //校验用户上传excel数据是否超出限额
    self.checkPointData =function() {

        var xlsfile = $("#memberFile").val();
        if (xlsfile == '') {
            alert("请选择需上传的excel文件!");
            return;
        }
        var filetype = xlsfile.substr(xlsfile.lastIndexOf(".")).toLowerCase();
        if (filetype != '.xls' && filetype != '.xlsx') {
            // alert("只支持.xls类型的Excel文件!");
            alert("只支持excel文件上传!");
            return ;
        }
        $("#OpenBatchPoint").hide();
        $("#editBid").show();
        self.importMemberDiv=2;
        // 上传文件
        var url = globalConfig.basePath + '/operation/tool/checkPointData';
        $.ajaxFileUpload({
            url:url, //你处理上传文件的服务端
            secureuri: false,
            fileElementId: 'memberFile',
            success: function (response){
                $("#editBid").hide();
                $("#OpenBatchPoint").show();
                var str = $(response).find("body").text();//获取返回的字符串
                var json = $.parseJSON(str);//把字符串转化为json对象
                if(json.code=='000') {
                    self.totalCount = json.resp.totalCount;
                    self.maxPoint = json.resp.maxPoint;
                    self.sumPoint = json.resp.sumPoint;
                    self.batchNo = json.resp.batchNo;
                    //1000 表示校验通过
                    if (json.resp.code == '1000') {
                        self.btnShow = 2;
                    }else if(json.resp.code == '9999'){
                        //超出限额
                        self.btnShow = 3;
                    }
                    self.loading();
                }else{
                    alert(json.message);
                    $("#OpenBatchPoint").hide();
                }
            },
            error: function (errorRespon) {
                $("#editBid").hide();
            }
        })
    }


    self.confirmGivePoint = function(){
        $("#editBid").show();
        var url = globalConfig.basePath+"/operation/tool/confirmGivePoint";
        $http.post(url,self.batchNo).then(
            function successCallback(callback) {
                $("#editBid").hide();
                if(callback.data.code == '000'){
                    alert("批量发放积分申请成功，请稍候查询明细发放结果");
                }else {
                    alert("批量发放积分申请失败");
                }
                $("#OpenBatchPoint").hide();
            }, function errorCallback(response) {
                $("#editBid").hide();
                // 请求失败执行代码
                swalMsg(response);
            });
    };




}]);
function importOpenMemberData() {
    var xlsfile = $("#memberFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    $("#updateMemberFileInput").val(xlsfilename);
}



