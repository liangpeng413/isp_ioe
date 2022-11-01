var App = angular.module('myApp', [], angular.noop);
App.controller("rootController",['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var self = $scope;
    self.search = {};
    self.search.pageSize = '5';

    self.queryRankingPage = function (pageNum){
        if (pageNum) {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        var url = globalConfig.basePath + "/ranking/queryPage";
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
                    self.rankinglist = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.queryRankingPage(1);

    self.updateRanking = function (){
        if(self.search.createName == null || self.search.createName == ''){
            alert("请填写创建人名称");
            return;
        }
        if(self.search.shopId == null || self.search.shopId == ''){
            alert("请填写重建门店");
            return;
        }
        var url = globalConfig.basePath + "/ranking/create";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    alert(self.search.shopId+"门店榜单重建成功");
                    self.search = {};
                    self.search.pageSize = '5';
                    self.queryRankingPage(1);
                }
            }
        )
    }


}])
