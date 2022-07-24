var App = angular.module('myApp', [], angular.noop);
App.controller("rootController",['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var self = $scope;
    self.search={};
    self.search.pageSize = '5';
    self.cookbookTypeList = [
        {"key":"1","value":"商品关联菜谱"},
        {"key":"2","value":"用户关联菜谱"},
        {"key":"3","value":"首页瀑布流菜谱关联"},
        {"key":"4","value":"创建搜索词与菜谱关系"}
        ]

    self.searchPage = function (pageNum){
        if (pageNum) {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        var url = globalConfig.basePath + "/cookbook/getList";
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
                    self.cookbookList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.searchPage(1);

    self.addShow = function (){
        self.addCookbook={}
        $('#addCookbookShow').show();
    }

    self.createCookbookData = function (){
        if(self.addCookbook.associationType == null || self.addCookbook.associationType == ''){
            alert("请选择菜谱类型");
            return;

        }
        if(self.addCookbook.skuCode == null || self.addCookbook.skuCode == ''){
            alert("请输入要关联的商品skuCode");
            return;

        }
        if(self.addCookbook.associationType == '2'){
            if(self.addCookbook.memberId == null || self.addCookbook.memberId == ''){
                alert("请输入要关联的用户memberId");
                return;

            }
        }
        if(self.addCookbook.cookbookIds == null || self.addCookbook.cookbookIds == ''){
            alert("请输入要关联的菜谱ID以','号分割");
            return;
        }
        if(self.addCookbook.createUserName == null || self.addCookbook.createUserName == ''){
            alert("请输入要关联的菜谱ID以','号分割");
            return;
        }
        var url = globalConfig.basePath + "/cookbook/createCookbook";
        $http.post(url, self.addCookbook).then(
            function (data) {
                if (data.data.code == '000') {
                    $('#addCookbookShow').hide();
                    self.addCookbook = {};
                    alert("菜谱创建成功");
                    self.searchPage(1);
                }
            }
        )

    }


}])
