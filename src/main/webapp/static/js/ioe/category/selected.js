var App = angular.module('myApp', [], angular.noop);
App.controller("rootController",['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var self = $scope;
    self.search={};
    self.search.pageSize = '5';


    self.searchPage = function (pageNum){
        if (pageNum) {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        var url = globalConfig.basePath + "/categorySelected/getList";
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
                    self.categorys = data.data.resp.resultList;
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
        self.category = {};
        $('#addCategoryShow').show();
    }

    self.createCategoryData = function (){
        if(self.category.memberId == null || self.category.memberId == ''){
            alert("请输入关联用户id");
            return;
        }
        if(self.category.shopid == null || self.category.shopid == ''){
            alert("请输入门店id");
            return;
        }
        if(self.category.sellerid == null || self.category.sellerid == ''){
            alert("请输入业态id");
            return;
        }
        if(self.category.sku == null || self.category.sku == ''){
            alert("请输入带业态商品编码");
            return;
        }
        if(self.category.createUser == null || self.category.createUser == ''){
            alert("创建人不能为空");
            return;
        }
        var url = globalConfig.basePath + "/categorySelected/createSelected";
        $http.post(url, self.category).then(
            function (data) {
                if (data.data.code == '000') {
                    $('#addCategoryShow').hide();
                    self.category = {};
                    alert("数据关联成功");
                    self.searchPage(1);
                }
            }
        )


    }


}])
