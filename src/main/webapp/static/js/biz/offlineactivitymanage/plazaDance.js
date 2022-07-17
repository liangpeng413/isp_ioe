'use strict';

var App = angular.module('plazaDance', [], angular.noop);
App.controller('plazaDanceController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};

    self.pageQueryDanceList = function (pageNum) {
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        self.search.pageSize=10;
        var url = globalConfig.basePath + "/audit_plaza_dance/pageList";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.curPageNumber) {
                        self.search.pageNo = data.data.resp.curPageNumber;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageCount = data.data.resp.pageSize;
                    self.search.perPageRowSize = data.data.resp.perPageRowSize + "";
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.auditPlazaDanceList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.pageQueryDanceList(1);

    self.reset = function () {
        self.search = {};
        self.search.pageNo=1;

    }

    self.audit={};
    self.showAudit= function (param) {
        self.auditParam = param;
        self.audit.status="1";
        $("#auditShow").show();
    }

    self.confirm = function () {
        self.audit.teamId = self.auditParam.teamId;
        if("2"==self.audit.status && null==self.audit.cause){
            alert("请输入失败原因");
            return;
        }
        var url = globalConfig.basePath + "/audit_plaza_dance/audit";
        $http.post(url, self.audit).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功");
                    $("#auditShow").hide();
                    self.audit={};
                    self.pageQueryDanceList(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.cancel = function () {
        $('.take-start-box').hide();
        self.audit={};
    }


    //排序功能
    self.searchCallRecordsSort =function(name){
        self.search.sortName = name;
        self.search.sort =self.search.sort== 'asc'?'desc':'asc';
        $('.img-sort').attr('src',globalConfig.basePath+'/static/img/sort.png');
        var imgName =self.search.sort== 'asc'?'asc':'desc';
        $('.img-sort'+'.'+self.search.sortName).attr('src',globalConfig.basePath+'/static/img/sort_'+imgName+'.png');
        self.pageQueryDanceList(1);
    }

    //图片预览
    self.showImg =function(picUrl){
        $("#imgShow").show();
        $("#urlImg").attr("src",picUrl);
    }

}])
