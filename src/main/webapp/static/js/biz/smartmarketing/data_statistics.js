'use strict';

var App = angular.module('data_statistics', [], angular.noop);
App.controller('data_statistics_controller', ['$scope', '$http', function ($scope, $http) {

    var self = $scope;
    self.search = {};
    self.search.statisticsType ='D';
    self.search.channelCode = 'QB';

    self.reset = function () {
        self.search.channelCode = 'QB';
        // self.search.startTime = '';
        // self.search.endTime = '';

        $('#startTime1').val(null);
        $('#endTime1').val(null);
    }
    // self.lookDataAnalysis = function(x){
    //     self.search.timeStr = x;
    //     var url = globalConfig.basePath+"/smart_marketing/data/list";
    //     $http.post(url,self.search).then(
    //         function (data) {
    //             // alert(data);
    //             console.log("数据分析-项目接口入参：",self.search);
    //             console.log(data);
    //             if (data.data.code == '000') {
    //                 if (data.data.resp.currentPage) {
    //                     self.search.pageNo = data.data.resp.currentPage;
    //                 } else {
    //                     self.search.pageNo = 1;
    //                 }
    //                 self.search.pageSize = data.data.resp.pageSize + "";
    //                 self.search.pageCount = data.data.resp.pageCount;
    //                 self.search.totalRowSize = data.data.resp.totalRowSize;
    //                 self.initiativeList = data.data.resp.result;
    //                 localStorage.setItem('love',self.initiativeList);
    //                 window.location.href = globalConfig.basePath+"/smart_marketing/data/to_page";
    //
    //             } else {
    //                 alert(data.data.message);
    //             }
    //         }, function errorCallback(response) {
    //             alert("请求失败了....");
    //         }
    //     );
    // };
  self.exportOK = function(){
      var form = $('#conditionForm2');
      form.attr("action",globalConfig.basePath + "/smart_marketing/datastatistics/export_datastatistics");
      form.attr("target","downloadIframe");
      form.submit();
  };

    self.queryDataList = function (pageNum) {
        if ($("#startTime1").val()) {
            self.search.startTime = $("#startTime1").val();
        }else {
            self.search.startTime = null;
        }
        if ($("#endTime1").val()) {
            self.search.endTime = $("#endTime1").val();
        }else {
            self.search.endTime = null;
        }
        if (self.search.startTime!=null){
            if (self.search.endTime==null){
                alert("开始起止时间都要输入！");
                return;
            }
        }
        if (self.search.endTime!=null){
            if (self.search.startTime==null){
                alert("开始起止时间都要输入！");
                return;
            }
        }
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        // self.search.onTime = $("#searchonTime").val();
        var url = globalConfig.basePath + "/smart_marketing/datastatistics/list";


        $http.post(url,self.search).then(
            function (data) {
                // alert(data);
                console.log(self.search);
                console.log(data);
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.initiativeList = data.data.resp.result;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.mock = function () {
        self.search.channelCode = 'QB';
        self.search.pageSize = '5';
        self.search.statisticsType = "D";
        self.queryDataList(1);
    }

    $scope.mock();



}]);