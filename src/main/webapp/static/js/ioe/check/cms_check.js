var App = angular.module('myApp', [], angular.noop);
App.controller("rootController",['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var self = $scope;
    self.search={};
    self.search.isSit = 'sit';
    self.search.version = '9.2.0';
    self.upCheck = function (){
        var url = globalConfig.basePath + "/check/cdp";
        if(self.search.shopId == null || self.search.shopId == ''){
            xiaoY("请输入shopId");
            return;
        }
        if(self.search.sellerId == null || self.search.sellerId == ''){
            xiaoY("请输入sellerId");
            return;
        }
        if(self.search.version == null || self.search.version == ''){
            xiaoY("请输入version");
            return;
        }
        if(self.search.memberId == null || self.search.memberId == ''){
            xiaoY("请输入memberId");
            return;
        }
        if(self.search.cityId == null || self.search.cityId == ''){
            xiaoY("请输入cityId");
            return;
        }
        if(self.search.isSit == null || self.search.isSit == ''){
            xiaoY("请选择环境");
            return;
        }
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if('' == data.data.resp || data.data.resp == null){
                        swalMsg(self.search.shopId+"门店无异常模型");
                    }else{
                        alert(self.search.shopId+"门店异常模型如下"+data.data.resp);
                    }
                } else {
                    swalMsg(data.data.message)
                }
            }, function errorCallback(response) {
                swalMsg("请求失败了....");
            }
        );
    }
}])
