'use strict';// 严谨模式
var App = angular.module('logistics', [], angular.noop);
App.controller('logisticsController',['$scope','$http', function($scope,$http) {

   var self = $scope;
   self.search = {};
   self.add = {};
   self.add.productChannel = '0';
   self.add.type = 'GIFT_VOUCHER';
   self.add.uploadUser = globalConfig.loginName;

    /**
     * 拉取审核人列表
     */
    $scope.pullAuditPersons = function(){
        var url = globalConfig.basePath+"/otc/memberEnjoy/getAuditPersionList";
        $http.get(url).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $scope.auditPersionList = callback.data.resp;
            } else {
                console.error(callback.data);
                swalMsg("查询审核人列表信息失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            console.error(response);
            swalMsg("查询审核人列表信息异常");
        });
    };
    $scope.pullAuditPersons();


   self.uploadTemplate = function () {
       var url = globalConfig.basePath+"/logistics/downLoadTemplate";
       window.open(url);
   }

    $(function () {
        $('#memberFile').fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath+"/logistics/uploadToAliYun",//上传地址
            dataType: 'json',
            acceptFileTypes:/(\.|\/)(xls|xlsx)$/i,
            maxFileSize: 1024 * 1024 * 500,
            done: function (e, data) {
                console.log(data,"我获取到的数据");
                //设置文件上传完毕事件的回调函数
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;
                }
                $('#updateMemberFileInput').prop("value", data.result.resp.url);
                alert("上传成功");


            },
            progress: function (e, data) {//上传进度
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $(".progress .bar").css("width", progress + "%");
                $(".progress .bar").html("正在上传...");
            }

        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error == true) {
                alert("上传失败：文件格式错误");
                data.files.error=null;
                return;
            }
        });
    })

    self.queryLogisticsList = function (pageNum) {
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }

        if (self.search.pageSize == '' || !self.search.pageSize) {
            self.search.pageSize = '5';
        }
        if (self.search.pageNo == '' || !self.search.pageNo) {
            self.search.pageNo = "1";
        }

        var url = globalConfig.basePath + "/logistics/getLogisticsList";
        $http.post(url, self.search).then(
            function (data) {
                // alert(data);

                console.log(data);
                if (data.data.code == '000') {
                    if (data.data.resp.pageNum) {
                        self.search.pageNo = data.data.resp.pageNum;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pages;
                    self.search.totalRowSize = data.data.resp.total;

                    self.initiativeList = data.data.resp.list;
                    for (var i = 0; i < self.auditPersionList.length; i++) {
                        for (var j = 0; j < self.initiativeList.length; j++) {
                            if (self.auditPersionList[i].no == self.initiativeList[j].uploadUser){
                                self.initiativeList[j].uploadUserName = self.auditPersionList[i].name;
                            }
                        }
                    }
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }



   self.addLogistics = function () {
       self.isUpdate = 1;
       $('#addLogisticsShow').show();
   }



   self.commitAdd = function () {
       console.log(self.add,"待添加的对象");
       self.add.fileUrl = $('#updateMemberFileInput').val();
       self.add.uploadUser = globalConfig.loginName;
       var url;
       if (self.isUpdate == 0){
           url = globalConfig.basePath+"/logistics/updateRecord";
       }else {
           url = globalConfig.basePath+"/logistics/addLogisticsRecord";
       }

       $http.post(url,self.add).then(
           function (data) {
               console.log(data,"返回结果");
               if (data.data.code == '000'){
                   alert(data.data.message);
                   $('#addLogisticsShow').hide();
                   self.add = {};
                   self.add.productChannel = '0';
                   self.add.type = 'GIFT_VOUCHER';
                   self.queryLogisticsList(1);
                   setTimeout(function () {
                       self.queryLogisticsList(1);
                   },8000)

               }else {
                   alert(data.data.message);
               }
           }
       )

   }

   self.close = function () {
       $('#addLogisticsShow').hide();
       self.add = {};
       $('#updateMemberFileInput').val(null);
       self.add.productChannel = '0';
       self.add.type = 'GIFT_VOUCHER';
       self.add.uploadUser = globalConfig.loginName;
   }

   self.exportData = function (fileUrl) {
       window.open(fileUrl);
   }

   self.reUpload = function(LogisticsObject){
       self.isUpdate = 0;
       self.add = LogisticsObject;
       self.add.productChannel = self.add.productChannel.toString();
       $('#addLogisticsShow').show();
   }

    self.queryLogisticsList(1);

}]);