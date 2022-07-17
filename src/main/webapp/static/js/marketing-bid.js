'use strict';
var App = angular.module('myApp', [], angular.noop);
App.controller("rootController", ['$scope', function ($scope) {

    $scope.searchCondition = {};
    // TODO 分页条件查询
    $scope.pageQueryBlackWhite = function(curpage){
        var url = globalConfig.basePath+"/appconfig/WhiteBlankList/query";
        /*var requestData={pageNo:pageNo,showType:$scope.showType};
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            console.log(data);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("请求失败了....");
        });*/
    };
    $scope.pageQueryBlackWhite();
    // TODO 预增加逻辑
    // TODO 增加逻辑
    // TODO 更新逻辑
    // TODO 查看逻辑
    // TODO 操作逻辑

    // post使用方式一
    /*$http({
        method:'post',
        url:url,
        data:data,
        param:"",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(obj) {
            if(angular.isObject(obj) && String(obj) !== '[object File]'){
                var str = [];
                for (var s in obj) {
                    str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                }
                return str.join("&");
            }
            return obj;
        }
    }).then(function successCallback(data) {
        console.log(data);
    }, function errorCallback(response) {
        // 请求失败执行代码
        alert("请求失败了....");
    });*/

    // post使用方式二
    /*$http.post(url,data)
        .then(
            function(response){
                if (response.data.success) {
                    deferred.resolve(response.data.content);
                } else {
                    deferred.reject(response.data.errorMsg);
                }
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );*/
    //post使用方式三，config，参见http://blog.csdn.net/web1504/article/details/53125779
    // $http.post('/someUrl', data, config).then(successCallback, errorCallback);

}]);