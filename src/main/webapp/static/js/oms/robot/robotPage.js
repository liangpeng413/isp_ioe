'use strict';

var App = angular.module('robot_Controller', [], angular.noop);
App.controller('robot_controller', ['$scope', '$http', function ($scope, $http) {
    var self;
    self = $scope;
    self.add = {};
    self.add.tabPosition = null;
    self.search = {};
    self.search.valid = "";
    self.search.tabPosition = "";
    self.tabDetail = {};
    self.effectOrInvalid = {};
    self.allTabTopConfig = {};

    self.addTab = function () {
          self.add={};
          $("#file").val("");
          $('#addShow').show();


        }

        self.close = function () {
            $('#addShow').hide();
        }
    self.sortList2 = function(list){
        for(var i=0; i < list.length; i++) {
            list[i].sort = i + 1;
        }
        $scope.sortList = list;
    }
    self.getPriority = function () {

        self.add.tabPosition=self.search.tabPosition;
        var url = globalConfig.basePath+"/robot_tabConfig/getSortByTab";
        $http.post(url,self.add).then(
            function (data) {
                if (data.data.code == '000'){
                  console.log(data,"排序返回的数据");
                  self.sortList2(data.data.resp);
                }else {
                    alert(data.data.message);
                }
            }
        )
        $('#showPriority').show();

    }



    self.moveCancel = function () {
        $('#showPriority').hide();
    }

    $scope.move = function(type) {
        if($("input[class='moveCheckbox iptCheck']:checked").length <=0){
            alert("请选择一个进行移动");
            return;
        }
        var length = $scope.sortList.length;
        $('.moveCheckbox').each(function() {
            if(this.checked == true) {
                if(type=='S') {//上移
                    var me =$(this).val() - 1;
                    if(me==0) {
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  $scope.sortList[me];//当前选中的
                    var move1 = $scope.sortList[me-1];//上一个
                    $scope.sortList[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                    $scope.sortList[me] = move1;// 当前选中的
                    $scope.sortList[me-1].sort =Number($(this).val())-Number(1);
                    $scope.sortList[me].sort =Number($(this).val());
                }else if(type=='X'){// 下移
                    var me =$(this).val()-1;
                    if(me==length-1){
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = $scope.sortList[me];// 下一个banner
                    move0.sort=Number($(this).val())+Number(1);
                    var move1 = $scope.sortList[me+1];// 下一个banner
                    move1.sort=Number($(this).val());
                    $scope.sortList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    $scope.sortList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }



    self.uploadIcon = function () {
        $('#image').click();
        var url = globalConfig.basePath + "/api/file/upload";
        $('#image').fileupload({
            autoUpload: true,
            url: url+"?fileType="+"img",
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpg|jpeg|png|tiff|pdf)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {
                console.log(data.result);
                if(data.result.code=='000'){
                    var fileUrl = data.result.resp.url;
                    $('#file').prop("value", fileUrl);
                    $('#up').prop("src", fileUrl);
                    alert("上传成功");
                }else{
                    alert("上传失败:"+data.result.message);
                }

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    data.files.error=null;
                    return;
                }
            }
        });
    }



    self.uploadUpdateIcon = function () {
        $('#updateImage').click();
        var url = globalConfig.basePath + "/api/file/upload";
        $('#updateImage').fileupload({
            autoUpload: true,
            url: url+"?fileType="+"img",
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpg|jpeg|png|tiff|pdf)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {
                console.log(data.result);
                if(data.result.code=='000'){
                    var fileUrl = data.result.resp.url;
                    $('#updateFile').prop("value", fileUrl);
                    $('#updateFile').prop("src", fileUrl);
                    self.tabDetail.tabIcon=fileUrl;
                    alert("上传成功");
                }else{
                    alert("上传失败:"+data.result.message);
                }

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    data.files.error=null;
                    return;
                }
            }
        });
    }




    self.commitAdd = function () {
        if(self.checktabInfoParam()){
            return;
        }
        var url = globalConfig.basePath+"/robot_tabConfig/add"
        if (self.add.associationTab == 1){
            self.add.associationTabName = '热门';
        }else if(self.add.associationTab == 2){
            self.add.associationTabName = '常规';
        }
        if ($('#file').val()){
            self.add.tabIcon = $('#file').val();
        }
        $http.post(url,self.add).then(
            function (data) {
                if (data.data.code == '000'){
                    alert("添加成功!");
                    self.add = {};
                    self.add.tabPosition = 'COMMENT_TOP';
                    self.querySmartRobotList(1);
                    self.getAllTopConfig();
                    $('#addShow').hide();

                }
            }
        )

    }

    self.checkRobotTabInfo = function(tabObject){
        self.tabDetail = tabObject;
        if(tabObject.associationTopTab){
            var url = globalConfig.basePath+"/robot_tabConfig/getTabInfo?id="+self.tabDetail.associationTopTab;
            $http.get(url).then(function (data) {
                console.log(data,"查看tab详情");
                if (data.data.code == '000'){
                    self.tabDetail.associationTopTabName = data.data.resp.tabName;


                }else {
                    //alert(data.data.message);
                }
            })

        }
        $('#lookUp').show();
    }


    self.querySmartRobotList = function (pageNum) {

        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                alert("已经是最后一页了");
                self.search.pageNo = self.search.pageCount;
                return;
            } else {
                self.search.pageNo = pageNum;
            }
        }


        if (!self.search.pageSize) {
            self.search.pageSize = '5';
        }
        if (!self.search.pageNo) {
            self.search.pageNo = "1";
        }
        if(self.search.tabPosition==""){
            self.search.tabPosition=null;
        }
        if(self.search.valid==""){
            self.search.valid=null;
        }


        console.log(self.search);

        var url = globalConfig.basePath + "/robot_tabConfig/tabConfigList";
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
                    self.search.pageNo = data.data.resp.pageNum;

                    self.initiativeList = data.data.resp.list;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    self.querySmartRobotList(1);

    self.closeCheck = function () {
        $('#lookUp').hide();
    }

    self.effectStatus = function (id,valid) {
        self.effectOrInvalid.id = id;
        self.effectOrInvalid.valid = valid;
        $('#showInvalid').show();

    }

   self.confirmInvalid = function () {
        var url = globalConfig.basePath+"/robot_tabConfig/updateValid";
        $http.post(url,self.effectOrInvalid).then(
            function (data) {
                if (data.data.code == '000'){
                    alert("操作成功!");
                    $('#showInvalid').hide();
                    self.querySmartRobotList(1);
                }else{
                    alert(data.data.message);
                }
            }
        )

   }


   self.updateTabConfig = function (id,number) {
       var url = globalConfig.basePath+"/robot_tabConfig/getTabInfo?id="+id;
       $http.get(url).then(function (data) {
               console.log(data,"查看tab详情");
               if (data.data.code == '000'){
                   self.tabDetail = data.data.resp;
                   if(self.tabDetail.associationTopTab){
                       var url = globalConfig.basePath+"/robot_tabConfig/getTabInfo?id="+self.tabDetail.associationTopTab;
                       $http.get(url).then(function (data) {
                           console.log(data,"查看tab详情");
                           if (data.data.code == '000'){
                               self.tabDetail.associationTopTabName = data.data.resp.tabName;


                           }else {
                               //alert(data.data.message);
                           }
                       })

                   }


                       $('#updateShow').show();

               }else {
                   alert(data.data.message);
               }
           }

       )
   }

   self.closeUpdate = function () {
       $('#updateShow').hide();
   }

   self.commitUpdate = function (updateTabConfig) {
        if(!self.tabDetail.tabName){
            alert("tab不能为空");
            return;
        }
        var url = globalConfig.basePath+"/robot_tabConfig/updateTabInfo";
        $http.post(url,updateTabConfig).then(
            function (data) {
                if (data.data.code == '000'){
                    alert("修改成功!");
                    $('#updateShow').hide();
                    self.querySmartRobotList(1);
                }else {
                    alert(data.data.message);
                }

            }
        )

   }

    $scope.moveCommit = function() {
        for (var i = 0; i < self.sortList.length; i++) {
             self.sortList[i].priority = self.sortList[i].sort;
        }
        var url = globalConfig.basePath + "/robot_tabConfig/moveCommit";
        $http.post(url,$scope.sortList).then(
            function(data){
                console.log("排序返回");
                console.log(data);
                alert(data.data.message);
                //self.reset();
                //self.loading();
                // $scope.querySplashConfigList(1);
                $('#showPriority').hide();
                $scope.sortList = data.data.resp;
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

   self.getAllTopConfig = function () {
        var url = globalConfig.basePath+"/robot_tabConfig/getAllTopTabConfig";
       $http.get(url).then(
           function (data) {
               if (data.data.code == '000'){
                   console.log(data,"所有顶部tab");
                   self.allTabTopConfig = data.data.resp;
               }else {
                   alert(data.data.message);
               }
           }
       )
   }

   self.getAllTopConfig();

    self.changeTabPosition = function () {
        if (self.add.tabPosition == 'CONTENT_TOP'){
            self.add.associationTopTabName = null;
            self.add.associationTopTab = null;
        }else if (self.add.tabPosition == 'CONTENT_RECOMMAND'){
            self.add.associationTabName = null;
            self.add.associationTab = null;
        }else {
            self.add.associationTopTabName = null;
            self.add.associationTopTab = null;
            self.add.associationTabName = null;
            self.add.associationTab = null;
        }

    }

    self.reset = function () {
        self.search.tabPosition = "";
        self.search.valid = "";
    }
     //添加修改参数校验
    self.checktabInfoParam=function () {
        if(!self.add.tabPosition){
            alert("tab位置必选");
            return true;
        }
        if (self.add.tabPosition == 'CONTENT_TOP' ){
            if (!self.add.associationTab){
                alert("关联页面不能类型为空!");
                return true;
            }
        }
        if(!self.add.tabName){
            alert("tab名称不能为空")
            return true;
        }
        if (self.add.tabPosition == 'CONTENT_RECOMMAND' && !self.add.associationTopTab){
            alert("关联顶部tab不能为空!");
            return true;
        }




    }


}])
