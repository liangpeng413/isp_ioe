var App = angular.module('myApp', [], angular.noop);
App.controller("rootController",['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var self = $scope;
    self.search={};
    self.search.pageSize = '5';

    self.queryScriptPage = function (pageNum){
        if (pageNum) {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        var url = globalConfig.basePath + "/scripts/queryPage";
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
                    self.scriptList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    self.queryScriptPage(1);

    // self.checkHandle = function (url){
    //     window.open(url,"_blank");
    // }

    self.addShow = function (){
        $('#showAdd').show();
        self.addScript = {};

    }

    self.createScript = function (){
        if(self.addScript.scriptType == null || self.addScript.scriptType == ''){
            alert("请选择脚本类型");
            return;
        }
        if(self.addScript.scriptName == null){
            alert("请输入脚本名称");
            return;
        }
        if(self.addScript.scriptUrl == null){
            alert("请输入脚本链接");
            return;
        }
        if('http://' != self.addScript.scriptUrl.substr(0,7) && 'https://' != self.addScript.scriptUrl.substr(0,8)){
            alert("请输入以http://或者http://开头的脚本链接");
            return;
        }
        if(self.addScript.createUserName == null){
            alert("请输入创建人");
            return;
        }
        var url = globalConfig.basePath + "/scripts/add";
        $http.post(url, self.addScript).then(
            function (data) {
                if (data.data.code == '000') {
                    $('#showAdd').hide();
                    self.addScript = {};
                    alert("脚本创建成功");
                    self.queryScriptPage(1);
                }
            }
        )
    }
    self.checkHandel = function (id){
        var url = globalConfig.basePath + "/scripts/check" + "?id=" + id;
        $http.get(url);
    }

}])
