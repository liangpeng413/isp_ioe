'use strict';
var App = angular.module('cityManageApp', [], angular.noop);
App.controller('cityManageController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};
    self.search.enableStatus = "1";
    self.search.pageNo = 1;
    self.search.pageSize = "10";
    self.result = {};
    self.add = {};
    self.edit = {};
    var isAdd = true;
    $(function () {
        self.queryCityList(1);
    })

    /**
     * 添加城市
     */
    self.addCity = function () {
        self.add.id = null;
        isAdd = true;
        document.getElementById("add-start-title").innerHTML="添加城市";
        $('#addCity').show();
        $('#addCityNameTab').show();
        $('#addCityCodeTab').show();
        $('#uploadCity').hide();
    };

    /**
     * 导入城市
     */
    self.importCity = function () {
        self.add.id = null;
        isAdd = false;
        document.getElementById("add-start-title").innerHTML="导入城市";
        $('#addCity').show();
        $('#addCityNameTab').hide();
        $('#addCityCodeTab').hide();
        $('#uploadCity').show();
    };

    /**
     * 取消添加
     */
    self.cancelBtn = function () {
        self.add.city = "";
        self.add.cityCode = "";
        var uploadCityFile = document.getElementById('uploadCityFile');
        uploadCityFile.outerHTML = uploadCityFile.outerHTML;
        $('#addCity').hide();
    };


    /**
     * 确认添加
     */
    self.commitBtn = function () {
        if (self.add.id == undefined || self.add.id == null) {
            var formData = new FormData();
            if (isAdd) {
                if (self.add.city == null || self.add.city == "") {
                    alert("城市不能为空");
                    return;
                }
                if (self.add.cityCode == null || self.add.cityCode == "") {
                    alert("编码不能为空");
                    return;
                }
                formData.append("city", self.add.city);
                formData.append("cityCode", self.add.cityCode);
            } else {
                if ($("#uploadCityFile").val() == null || $("#uploadCityFile").val() == "") {
                    alert("请选择要导入的文件");
                    return;
                }
                formData.append("cityFile", $('#uploadCityFile')[0].files[0]);
            }
            $.ajax({
                url: globalConfig.basePath + '/appConfig/city/addCity',
                dataType: 'json',
                type: 'POST',
                async: false,
                data: formData,
                processData: false, // 使数据不做处理
                contentType: false, // 不要设置Content-Type请求头
                success: function (data) {
                    if (data.code == '000') {
                        self.add.city = "";
                        self.add.cityCode = "";
                        var uploadCityFile = document.getElementById('uploadCityFile');
                        uploadCityFile.outerHTML = uploadCityFile.outerHTML;
                        $('#addCity').hide();
                        self.queryCityList(self.search.pageNo);
                    } else {
                        alert(data.message)
                    }

                },
                error: function () {
                    alert("请求失败了....");
                }
            });
        } else {
            if (self.add.city == null || self.add.city == "") {
                alert("城市不能为空");
                return;
            }
            if (self.add.cityCode == null || self.add.cityCode == "") {
                alert("编码不能为空");
                return;
            }
            var url = globalConfig.basePath + "/appConfig/city/editCity";
            $http.post(url, self.add).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.add.city = "";
                        self.add.cityCode = "";
                        $('#addCity').hide();
                        self.queryCityList(self.search.pageNo);
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        }
    };

    /**
     * 查询城市列表
     * @param pageNum 页码
     */
    self.queryCityList = function (pageNum) {
        if($("#timeStart").val() != null && $("#timeStart").val() != ""){
            self.search.operationTimeStart = $("#timeStart").val();
        }
        if($("#timeEnd").val() != null && $("#timeEnd").val() != ""){
            self.search.operationTimeEnd = $("#timeEnd").val();
        }
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        if (self.search.pageNo == 0) {
            self.search.pageNo = 1;
        }
        var url = globalConfig.basePath + "/appConfig/city/queryCityList";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.result.pageCount = data.data.resp.pageCount;
                    self.result.totalRowSize = data.data.resp.totalRowSize;
                    self.cityList = data.data.resp.result;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 重置
     */
    self.reset = function () {
        self.search = {};
        self.search.enableStatus = "1";
        self.search.pageNo = 1;
        self.search.pageSize = "10";
    };

    /**
     * 更新城市
     */
    self.updateCity = function (theCity) {
        self.add.id = theCity.id;
        self.add.city = theCity.city;
        self.add.cityCode = theCity.cityCode;
        self.add.enableStatus = theCity.enableStatus;
        document.getElementById("add-start-title").innerHTML="修改城市";
        $('#addCityNameTab').show();
        $('#addCityCodeTab').show();
        $('#uploadCity').hide();
        $('#addCity').show();
    };

    /**
     * 启用或停用
     * @param id 城市表Id
     * @param enableStatus 城市当前状态
     */
    self.enableOrDisable = function (id, enableStatus) {
        var url = globalConfig.basePath + "/appConfig/city/editCity";
        var param = {};
        param.id = id;
        param.enableStatus = enableStatus == "0" ? "1" : "0";
        $http.post(url, param).then(
            function (data) {
                if (data.data.code == '000') {
                    self.queryCityList(self.search.pageNo);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     *删除城市
     * @param id
     */
    self.deleteCity = function (id) {
        var url = globalConfig.basePath + "/appConfig/city/deleteCity";
        var param = {};
        param.id = id;
        $http.post(url, param).then(
            function (data) {
                if (data.data.code == '000') {
                    self.queryCityList(self.search.pageNo);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
}])
