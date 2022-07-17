var touchCount = 0;
var isJson = 0;
'use strict';// 严谨模式
var App = angular.module('popupApp', [], angular.noop);
App.controller('popupController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};// 查询
    self.search.showType='';
    self.add = {};// 添加
    self.updatePopup = {};// 修改
    self.showPopup = {};// 查看
    $scope.loginName = globalConfig.loginName;
    self.search.productChannel = '0';
    self.add.tabObject = "";
    self.detail = {};
    self.labels = [{labelName:"",labelContent:""}]
    self.isUpdateRoster = 'N';
    //内容推荐查询
    self.querycontentConfigList = function (paegNum2) {
        if (self.pages < paegNum2 && paegNum2 != 1) {
            return;
        }
        if (!paegNum2) {
            self.search.pageNum = 1;
        } else {
            self.search.pageNum = paegNum2;
        }

        var url = globalConfig.basePath + "/appConfig/content/queryContentConfigList";
        $http.post(url, self.search).then(
            function (data) {
                console.log(data.data.resp.result,"内容推荐列表");
                self.total = data.data.resp.totalRowSize;
                self.pages = data.data.resp.pageCount;
                self.contentConfigList = data.data.resp.result;
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    $scope.getTabList = function (position,productChannel) {
        if (position == 304 && productChannel==1) {
            $http.get(globalConfig.basePath + "/dict/getByvalue" + "?value=" + position
            ).success(function (data) {
                var tabNameJson = data.resp.extend1;
                $scope.nameList = JSON.parse(tabNameJson);
            })
        }
    }

    // 获取位置
    $scope.getPostionList = function(productChannel,opType){
        var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_content&productChannel="+productChannel;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if(data.data.resp.result.length==0){
                self.positionsList =[];
                // self.search.position='';
            }else{
                self.positionsList = data.data.resp.result;
                if(opType==1){
                    self.add.positions="0";
                }
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取内容推荐置失败了....");
        });
    }
    $scope.getPostionList(0,0);

    /*self.dropData = function(){
        // self.add.positions = null;
        $scope.getPostionList($scope.add.productChannel,1);

        //self.getPostionList(self.add.productChannel,1);
    }*/
   //重置
    self.reset2 = function () {
        // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.status = "";//上线状态
        self.search.valid = "";//是否生效
        self.search.position = "";//内容推荐位置
        self.search.priority = "";
        self.search.auditStatus = "";
        self.search.type = "";
        self.search.showType = "0";
        //self.search.onTime="";//在线时间
        $("#searchonTime").val("");
        $("#searchoffTime").val("");
        self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
    }

    self.addLabel = function(index,isUpdate){
        if (isUpdate == 1){
            if (self.detail.labels.length == 3){
                alert("最多只能添加三个呢,亲~");
                return;
            }
        }else {
            if (self.labels.length == 3){
                alert("最多只能添加三个呢,亲~");
                return;
            }
        }
        if (isUpdate == 1){
            self.detail.labels.push({"labelName":"","labelContent":""});
        } else {
            self.labels.push({"labelName":"","labelContent":""});
        }

    }

    self.lessLabel = function(index,isUpdate){
          if (isUpdate == 1){
              if (self.detail.labels.length == 1){
                  alert("最少要保留一个呢,亲~");
                  return;
              }
          }else {
              if (self.labels.length == 1){
                  alert("最少要保留一个呢,亲~");
                  return;
              }
          }

        if (isUpdate == 1){
            self.detail.labels.splice(index,1);
        }else {
            self.labels.splice(index,1);
        }

    }

    //*************************************Add 内容推荐************************************

    $scope.selctPageOne = function () {
        if (self.jumpType == '3') {
            var type = "gonggao_onePage"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
            ).success(function (data) {
                $scope.rDictList = data.resp.result;
            })
        }

    }

    //内容推荐Box
    self.addContentBox = function () {
        self.add = {};
        self.labels = [{labelName:"",labelContent:""}];
        $('#addShow').show();

        $("#white").attr('disabled', 'disabled');
        $("#black").attr('disabled', 'disabled');
        $('#all').prop("checked", true);
        $("#white").attr("checked", false);
        $("#black").attr("checked", false);
        $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
        $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
        $("#selectaddwhiteId").val("");
        $("#selectaddblackId").val("");

        self.add.productChannel = "0";
        self.add.positions = "0";
        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
        self.getPostionList(0,1);

    }



    $(function () {

        $('#addVideoPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpeg|png|txt)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                console.log(e);
                var fileUrl = data.result.resp;
                $('#fileUrl1').prop("value", fileUrl);
                $('#image_prew').prop("src", fileUrl);
                $('#fileUrl1').prop("value", fileUrl);
                $('#image_prew1').prop("src", fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }

        });

        $('#addIcon').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpeg|png|txt)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                console.log(e);
                var fileUrl = data.result.resp;
                $('#iconUrl').prop("value", fileUrl);
                $('#image_prew8').prop("src", fileUrl);
                alert("上传成功");
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }

        });
        $('#addVideoPicture2').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpeg|png|txt)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                console.log(e);
                var fileUrl = data.result.resp;
                $('#fileUrl3').prop("value", fileUrl);
                $('#image_prew3').prop("src", fileUrl);
                self.detail.imageUrl = $('#fileUrl3').val();
                alert("上传成功");
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }

        });

        $('#addVideo').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(mp4|avi|mov|mkv|wmv|m4v|mpeg|ogv|3gp|flv|f4v|swf)$/i,
            maxFileSize: 1024 * 1024 * 30,
            messages: {
                maxFileSize: '视频文件的最大支持上传 20MB',
                acceptFileTypes: '此文件是不支持的视频格式'
            },
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                var videoUrl = data.result.resp;
                $('#videoUrl').prop("value",videoUrl);
                $('#video_prew').prop("src",videoUrl);
                $(".upstatus").html("上传成功");
                alert("上传成功")

            },
            progress: function (e, data) {//上传进度
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $(".progress .bar").css("width", progress + "%");
                $(".upstatus").html("正在上传...");
            }

        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error == true) {
                alert(data.files[0].error);
                return;
            }
        });

        $('#addVideo2').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(mp4|avi|mov|mkv|wmv|m4v|mpeg|ogv|3gp|flv|f4v|swf)$/i,
            maxFileSize: 1024 * 1024 * 30,
            messages: {
                maxFileSize: '视频文件的最大支持上传 20MB',
                acceptFileTypes: '此文件是不支持的视频格式'
            },
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                var videoUrl = data.result.resp;
                $('#videoUrl2').prop("value",videoUrl);
                $('#video_prew2').prop("src",videoUrl);
                $(".upstatus").html("上传成功");
                alert("上传成功");
                self.detail.videoUrl = $('#videoUrl2').val();

            },
            progress: function (e, data) {//上传进度
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $(".progress .bar").css("width", progress + "%");
                $(".upstatus").html("正在上传...");
            }

        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error == true) {
                alert(data.files[0].error);
                return;
            }
        });
    })



        //渠道切换
    self.updateChannelType = function(){
        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
    }


    // 选择版本
    self.addversionCheckbox = function () {
        self.addPostionCheck();
    }


    self.addpostion = function () {
        var versions = "";
        $('.versionCheckbox').each(function () {
            if (this.checked == true) {
                if ($(this).val()) {
                    versions += $(this).val() + ",";
                }
            }
        });
        if (!versions) {
            alert("请选择产品版本");
            return;
        }


    }

    // 登陆选择
    self.addLoginStatus = function (param) {
        if (param == '0' || param == '2') {
            $("#all").attr('disabled', 'disabled');
            $('#all').prop("checked", true);
            $("#white").attr('disabled', 'disabled');
            $('#white').prop("checked", false);
            $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            $("#selectaddwhiteId").val("");
            $("#black").attr('disabled', 'disabled');
            $('#black').prop("checked", false);
            $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
            $("#selectaddblackId").val("");

        } else {
            $("#editall").removeAttr("disabled");
            $("#all").removeAttr("disabled");
            if ($('#all').is(':checked')) {
                $("#editwhite").attr('disabled', 'disabled');
                $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
                $("#editselectaddwhiteId").val("0");
                $("#editblack").attr('disabled', 'disabled');
                $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
                $("#editselectaddblackId").val("0");
            } else {
                $('#editall').prop("checked", true);
                $("#editwhite").removeAttr('disabled', 'disabled');
                $("#editblack").removeAttr('disabled', 'disabled');
                $("#editselectaddblackId").removeAttr("disabled");
                $('#all').prop("checked", true);
                $("#white").removeAttr('disabled', 'disabled');
                $("#selectaddwhiteId").removeAttr("disabled");
                $("#black").removeAttr('disabled', 'disabled');
                $("#selectaddblackId").removeAttr("disabled");

            }

        }

        self.addPostionCheck();
    }
    $scope.titleList = {};
    $scope.add.tabTextId = "";
    var position="";
    $scope.data={};
    $scope.getTitleList = function (positions, productChannel) {
        if ((productChannel == 1 && (positions == 308 ||positions ==310 ||positions ==311)) || (positions == 309 && productChannel == 0)) {
            if(positions == 308 ){
                position = 10;
            }else  if(positions ==310){
                position = 13;
            }else  if(positions ==311){
                position = 14;
            }
            if (productChannel == 0 && positions == 309){
                position =17;
            }
            $scope.data.positions = position;
            $scope.data.productChannel = productChannel;
            var url = globalConfig.basePath + "/appConfig/content/getTextTitleList";
            $http.post(url, $scope.data).then(
                function (data) {
                    if (data.data.code == "000") {
                        $scope.titleList = data.data.resp.result;
                        if ($scope.titleList.length <= 0) {
                            alert("暂无文案标题，请移步文案配置！");
                            return;
                        }
                        for (var i = 0; i < $scope.titleList.length; i++) {
                            if ($scope.titleList[i].loginStatus == 0) {

                                $scope.titleList[i].title = $scope.titleList[i].title + "-(未登录)";
                            } else {
                                $scope.titleList[i].title = $scope.titleList[i].title + "-(已登录)";
                            }
                        }
                        $scope.add.tabTextId = $scope.titleList[0].id + "";
                    } else {
                        alert(data.data.message);
                        return;
                    }

                }, function (response) {
                    alert("请求失败了....");
                    return;
                }
            );
        }
        if (productChannel == 1 && positions == 304) {
            $scope.getTabList(positions,productChannel);
        }

    }

    /**
     *推荐内容查询
     */
    self.remommendClassifiCation = function(){
        var url = globalConfig.basePath+"/appConfig/content/getRecommendedClassification?positions="+309+"&productChannel="+1;
        $http.get(url).then(
            function (data) {
                console.log(data,"推荐分类返回的数据");
                self.recommendClassification = data.data.resp;
            }
        )
    }

    $scope.remommendClassifiCation();

    //确认添加内容推荐
    $scope.saveContent = function () {
        self.add.imageUrl = $('#fileUrl').val();
        if (self.add.positions == 309 && self.add.productChannel == 1) {
            self.add.title = $('#title').val();
            self.add.desc = $('#twotitle').val();
        }
        if((self.add.positions == 10001 &&  self.add.productChannel == 1)||(self.add.positions == 20001 && self.add.productChannel == 0 ) ){
            self.add.title = $("#title").val();
            if (!self.add.bizCode){
                alert("任务id不能为空!");
                return;
            }
            if (!self.add.title){
                alert("任务标题不能为空!");
                return;
            }else if(self.add.title.length>50){
                alert("标题最多50个字符");
                return ;
            }
            if(!self.add.buttonName){
                alert("按钮名称不能为空");
                return;
            }


        }

        //309：内容推荐信用卡加油站位置关联任务中心
        if ((self.add.positions == 309 || self.add.positions == 312)&& self.add.productChannel ==1){
            self.add.title = $("#title").val();
            if (!self.add.title){
                alert("任务标题不能为空!");
                return;
            }
            if (self.add.positions == 309 && (!self.add.tabObject || self.add.tabObject == "" || self.add.tabObject == null)){
                alert("推荐分类不能为空!");
                return;
            }
            if (!$('#ccc').val()){
                alert("活动代码不能为空!");
                return;
            }
            self.add.desc = $("#twotitle").val();
        }

        if ((306 == self.add.positions && self.add.productChannel==0) || ( 307 == self.add.positions && self.add.productChannel==1)) {
            if (self.add.title != null) {
                if (self.add.title.length > 10) {
                    alert("标题不能超过10个字符");
                    return;
                }
            }
        }
        if ((306 == self.add.positions && self.add.productChannel==0)|| (307 == self.add.positions && self.add.productChannel==1)) {
            if (self.add.desc != null) {
                if (self.add.desc.length > 20) {
                    alert("内容不能超过20个字符");
                    return;
                }
            }
        }

        if ((self.add.positions == 310 || self.add.positions == 311 || self.add.positions ==313)&& self.add.productChannel ==1 ){
            if(!self.add.imageUrl){
               alert("图片地址不能为空");
               return ;
            }

            if(!self.add.title){
                alert("标题不能为空");
                return ;
            }

            if(self.add.title.length>60){
                alert("标题标题最多60个字符");
                return ;
            }
            if(!self. add.redirectUrl){
                alert("跳转地址不能为空");
                return ;
            }

            if(self.add.positions ==313){
                if(!self.add.desc){
                    alert("内容不能为空");
                    return ;
                }
            }
        }
        var titleId="";
        if(((self.add.positions == 310 || self.add.positions == 311 || self.add.positions ==308)&& self.add.productChannel ==1) || (self.add.positions == 309 && self.add.productChannel == 0)){

          /*  $('.titleCheckbox').each(function() {
                if (this.checked == true) {
                    titleId  = titleId + $(this).val()+",";
                }
            });*/

            for(var i=0;i < self.add.tabTextId.length;i++){
                if(self.add.tabTextId[i]!=""){
                    titleId  =titleId + self.add.tabTextId[i]+",";
                }
            }

           if(titleId==""){
               alert("tab位置不能为空！");
               return;
           }
        }


        if (!self.add.productChannel) {
            alert("渠道不能为空");
            return;
        }

        if (!self.add.positions || self.add.positions == 0) {
            alert("位置不能为空");
            return;
        }
        var addpositionsText = $("#addPositions").find("option:selected").text();
        if(!addpositionsText){
            alert("位置不能为空");
            return ;
        }
        self.add.positionName =addpositionsText;


        self.add.imageUrl = $('#fileUrl').val();
        if (310 ==self.add.positions && self.add.productChannel == 1){
            if (!self.add.desc){
                alert("内容是必须项喔~");
                return;
            }
        }
        if (303 != self.add.positions && 304 != self.add.positions && 314 != self.add.positions) {
            if (!self.add.desc && !self.add.imageUrl && 1001 != self.add.positions && 315 != self.add.positions && 316 != self.add.positions && 317 != self.add.positions  && 306 != self.add.positions && 307 != self.add.positions && 308 != self.add.positions && 309 != self.add.positions && 318!= self.add.positions && 310!= self.add.positions && 301!= self.add.positions && 10002!= self.add.positions && 10003!= self.add.positions && 20002!= self.add.positions && 20003!= self.add.positions && 20004!= self.add.positions && 10004!= self.add.positions ) {
                alert("图片和内容必须选择一项!");
                return;
            }
            if (!self.add.desc && !self.add.imageUrl && (307 == self.add.positions || 308 == self.add.positions || 309 == self.add.positions)&& self.add.productChannel == 1) {
                alert("图片和内容必须选择一项!");
                return;
            }
            if (!self.add.title && self.add.positions == 318) {
                alert("标题不能为空");
                return;
            }
            if (!self.add.title && self.add.positions != 318 &&  self.add.positions != 306 && self.add.positions != 307) {
                alert("标题不能为空");
                return;
            }
            if (!self.add.title  && self.add.productChannel == 0 && self.add.positions == 307) {
                alert("标题不能为空");
                return;
            }

            if(self.add.title != null){
                if (self.add.title.length > 60) {
                    alert("标题标题最多60个字符");
                    return;
                }
            }

            if (303!= self.add.positions && 308 != self.add.positions && 304 != self.add.positions && 309 != self.add.positions && 315 != self.add.positions && 316 != self.add.positions && 307!= self.add.positions && 317!= self.add.positions && 318!= self.add.positions && 310!= self.add.positions  && 10001!= self.add.positions && 20001!= self.add.positions && 10002!= self.add.positions && 10003!= self.add.positions && 20002!= self.add.positions  && 20003!= self.add.positions && 20004!= self.add.positions && 10004!= self.add.positions && !self.add.imageUrl) {
                alert("图片不能为空");
                return;
            }
            if (309 == self.add.positions && self.add.positions != 10001 && self.add.productChannel == 1){
                if (!self.add.imageUrl){
                    alert("图片不能为空!");
                    return;
                }
            }

            if (!self.add.redirectUrl && (self.add.productChannel != 1 && self.add.positions!=309 && self.add.positions!=1001)
                && (((self.add.positions != 307 && self.add.positions != 308 && self.add.positions != 20001 && self.add.positions != 20002 && self.add.positions != 20003 && self.add.positions !=20004) && self.add.productChannel == 0) || ((self.add.positions != 315 && self.add.positions != 316 && self.add.positions != 318 && self.add.positions != 316  && self.add.positions != 10001  && self.add.positions != 10002  && self.add.positions != 10003 && self.add.positions !=10004) && self.add.productChannel == 1))) {
                alert("跳转地址不能为空");
                return;
            }
            if (!self.add.redirectUrl && self.add.productChannel == 1 && self.add.positions == 317){
                alert("跳转链接不能为空!");
                return;
            }
            if (!self.add.redirectUrl && self.add.productChannel == 1 && self.add.positions == 307){
                alert("跳转地址不能为空!");
                return;
            }
        }

        if(314== self.add.positions){
             if(!self.add.crunchiesType){
                 alert("榜单类型不能为空!");
                 return;
             }
            if(!self.add.title){
                alert("标题不能为空");
                return ;
            }
            if (!self.add.desc) {
                alert("内容不能为空!");
                return;
            }
            if (!self.add.imageUrl) {
                alert("图片不能为空!");
                return;
            }

        }

        if ((self.add.positions == 310 && self.add.productChannel == 0) || (self.add.positions == 318 && self.add.productChannel == 1)){
            if (!self.add.actionText){
                alert("请输入动作文案呢,亲~");
                return;
            }
            if (!self.add.redirectUrl){
                alert("请输入跳转链接呢,亲~");
                return;
            }
        }



        if(!self.add.desc && self.add.positions != 310 && self.add.positions != 315 && self.add.positions != 316 && self.add.positions != 306 && self.add.positions != 307 && self.add.positions != 318 && self.add.positions != 309 && self.add.positions != 308 && 10001 != self.add.positions && 20001 != self.add.positions && 10002 != self.add.positions && 10003 != self.add.positions && 20002 != self.add.positions && 20003 != self.add.positions && 20004 != self.add.positions && 10004 != self.add.positions){
            alert("内容不能为空");
            return ;
        }
        if(!self.add.desc && (self.add.positions == 310||self.add.positions == 317) && self.add.productChannel == 1){
            alert("内容不能为空");
            return ;
        }
        if (!self.add.desc && self.add.positions == 309){
         alert("内容不能为空!");
         return;
        }

        if (self.add.label != null) {
            if (self.add.label.length > 4) {
                alert("角标不能超过4个字符");
                return;
            }
        }

            if (304 == self.add.positions && self.add.productChannel==1) {
                if (!self.add.imageUrl && !self.add.desc) {
                    alert("图片和内容必须填写一个");
                    return;
                }
            }

            if (304 == self.add.positions && self.add.productChannel==1) {
                if ($scope.add.tabNameKey == null || $scope.add.tabNameKey == "") {
                    alert("请选择Tab名称");
                    return;
                }

                $scope.add.tabName = $("#tabName").find("option:selected").text();
            }
            if (310 == self.add.positions && 0 == self.add.positions && !self.add.title){
                alert("标题不能为空!");
                return;
            }

            if((10002 == self.add.positions || 10003 == self.add.positions)&& self.add.productChannel==1 || (20002 == self.add.positions || 20003 == self.add.positions)&& self.add.productChannel==0 ){
                if(!self.add.subTitle){
                    alert("副标题不能为空!");
                    return;
                }
                if(!self.add.buttonName){
                    alert("按钮文案不能为空!");
                    return;
                }
            }
            //上线时间  下线时间
            self.add.onlineTime = $('#queryOnlineTime').val() + "";
            self.add.offlineTime = $('#queryOfflineTime').val() + "";
            self.add.contentTab = $('#addContentTab').val() + "";
            if (!self.add.onlineTime || !self.add.offlineTime) {
                alert("上线时间下线时间不能为空");
                return;
            }

        if (self.add.offlineTime <= self.add.onlineTime) {
            alert("下线时间必须大于上线时间");
            return;
        }
        var offlineTime = self.add.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime = "23:59:59";
        self.add.offlineTime = offlineTimes[0] + " " + miniTime;
        //审核人
        var requestAuditPersio = self.add.auditPerson;
        //提审说明
        var auditDescription = self.add.requestAuditDescription;

        //判断名单
        var whiteId = $('#memberId').val();
        var blackId = $('#memberBlackId').val();
        if(isNaN(whiteId)){
            whiteId=0;
        }
        if(isNaN(blackId)){
            blackId=0;
        }
        if (whiteId && whiteId != 0 && blackId && blackId!=0){
            self.add.showType = 3;
        }

        if (!whiteId && !blackId){
            self.add.showType = 0;
        }
        if (whiteId && whiteId != 0 && !blackId){
            self.add.showType = 1;
        }
        if (blackId && blackId!=0 && !whiteId){
            self.add.showType = 2;
        }
        if (self.add.whiteMemberListName != 'NO_RULE'){
            self.add.whiteTrue=true;
        }

        if (self.add.blackMemberListName != 'NO_RULE'){
            self.add.blackTrue = true;
        }


        if(self.add.whiteTrue==true){
            var whiteId =  $('#memberId').val();
            if(!whiteId || whiteId=='0' || whiteId=="" || whiteId.indexOf("?") != -1){
                alert('请选择具体白名单!');
                return;
            }else{
                self.add.whiteId = whiteId;
                self.add.whiteName = $('#memberId option:selected').text();
            }
        }
        if(self.add.blackTrue==true){
            var blackId = $('#memberBlackId').val();
            if(!blackId || blackId=='0' || blackId=="" || blackId.indexOf("?") != -1){
                alert('请选择具体黑名单!');
                return;
            }else{
                self.add.blackId = blackId;
                self.add.blackName = $('#memberBlackId option:selected').text();
            }
        }


        // 审核人
        if (!requestAuditPersio) {
            alert("审核人不能为空");
            return;
        } else {
            self.add.auditNo = self.add.auditPerson.no;
            self.add.auditPerson = self.add.auditPerson.name;
        }
        if (auditDescription != null) {
            if (auditDescription.length > 18) {
                alert("审核说明不能超过18个字符");
                return;
            }
        }
        if (self.add.tabObject!=null){
            var obj = JSON.parse(self.add.tabObject);
            self.add.tabName = obj.tab_name;
            self.add.tabNameKey = obj.tab_name_key;
        }

        if((self.add.positions == 310 || self.add.positions == 311 || self.add.positions ==308)&& self.add.productChannel ==1 ) {
            self.add.tabTextId = titleId;
          }
        if(self.add.positions == 309 && self.add.productChannel == 0) {
            self.add.tabTextId = titleId;
          }
        if (((self.add.positions == 307 || self.add.positions == 308 ||self.add.positions == 20004 ) && self.add.productChannel == 0) || ((self.add.positions == 315 || self.add.positions == 316 || self.add.positions == 10004) && self.add.productChannel == 1)){
            self.add.imageUrl = $('#fileUrl1').val();
            self.add.videoUrl = $('#videoUrl').val();
            for (var i = 0; i < self.labels.length; i++) {
                if(self.add.positions == 20004 || self.add.positions ==10004 ){
                    self.labels[i].labelName = $('#'+'nameTwelve'+i).val();
                }else{
                    self.labels[i].labelName = $('#'+'name'+i).val();
                }
                self.labels[i].labelContent = $('#'+'content'+i).val();
            }
            self.add.labels = JSON.stringify(self.labels);
        }

        console.log(JSON.stringify(self.add),"要添加的内容");
        if (!self.isJSON(self.add.tabTextId) && typeof (self.add.tabTextId) != "undefined"){
            self.add.tabTextId = JSON.stringify(self.add.tabTextId);
            self.add.tabTextId = self.add.tabTextId.toString().replace("\"","").replace("\"","");
        }
            var url = globalConfig.basePath + "/appConfig/content/addContentRecommendation";
            $http.post(url, self.add).then(
                function (data) {
                    if(data.data.code=='000'){
                        alert(data.data.message);
                        $('#addShow').hide();
                        self.add = {};
                        self.labels = [{labelName:"",labelContent:""}];
                        window.location.reload();
                    }else{
                        alert(data.data.message);
                        return;
                    }

                }, function (response) {
                    alert("请求失败了....");
                    window.location.reload();
                }
            );

        }


        //添加弹框上传图片
        var url = globalConfig.basePath + "/appconfig/file/uploadPic";
        $(function () {
            $('#addPicture').fileupload({
                autoUpload: true,//是否自动上传
                url: url,//上传地址
                dataType: 'json',
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
                maxFileSize: 1 * 1024 * 1024 * 30,
                done: function (e, data) {//设置文件上传完毕事件的回调函数
                    console.log(data.result);
                    var fileUrl = data.result.resp;
                    $('#fileUrl').prop("value", fileUrl);
                    $('#image_prew').prop("src", fileUrl);
                    alert("上传成功")
                }
            }).on('fileuploadprocessalways', function (e, data) {
                if (data.files.error) {
                    if (data.files[0].error == 'File type not allowed') {
                        alert("上传图片失败：系统暂不支持该类型图片上传");
                        console.log("上传图片失败：系统暂不支持该类型图片上传")
                        return;
                    }
                }
            });
        });

        $(function () {
            $('#editPicture').fileupload({
                autoUpload: true,//是否自动上传
                url: url,//上传地址
                dataType: 'json',
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
                maxFileSize: 1 * 1024 * 1024 * 30,
                done: function (e, data) {//设置文件上传完毕事件的回调函数
                    console.log(data.result);
                    var fileUrl = data.result.resp;
                    $('#fileUrl2').prop("value", fileUrl);
                    $('#image_prew2').prop("src", fileUrl);
                    alert("上传成功")
                }
            }).on('fileuploadprocessalways', function (e, data) {
                if (data.files.error) {
                    if (data.files[0].error == 'File type not allowed') {
                        alert("上传图片失败：系统暂不支持该类型图片上传");
                        return;
                    }
                }
            });


            $('#editPicture3').fileupload({
                autoUpload: true,//是否自动上传
                url: url,//上传地址
                dataType: 'json',
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
                maxFileSize: 1 * 1024 * 1024 * 30,
                done: function (e, data) {//设置文件上传完毕事件的回调函数
                    console.log(data.result);
                    var fileUrl = data.result.resp;
                    $('#fileUrl3').prop("value", fileUrl);
                    $('#image_prew5').prop("src", fileUrl);
                    self.detail.imageUrl = $('#fileUrl3').val();
                    alert("上传成功")
                }
            }).on('fileuploadprocessalways', function (e, data) {
                if (data.files.error) {
                    if (data.files[0].error == 'File type not allowed') {
                        alert("上传图片失败：系统暂不支持该类型图片上传");
                        return;
                    }
                }
            });
        });

        //添加弹框上传图片
        var url = globalConfig.basePath + "/appconfig/file/uploadPic";
        $(function () {
            $('#addButtonPicture').fileupload({
                autoUpload: true,//是否自动上传
                url: url,//上传地址
                dataType: 'json',
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
                maxFileSize: 1 * 1024 * 1024 * 30,
                done: function (e, data) {//设置文件上传完毕事件的回调函数
                    console.log(data.result);
                    var fileUrl = data.result.resp;
                    $('#buttonFileUrl').prop("value", fileUrl);
                    $('#button_image_prew').prop("src", fileUrl);
                    alert("上传成功")
                }
            }).on('fileuploadprocessalways', function (e, data) {
                if (data.files.error) {
                    if (data.files[0].error == 'File type not allowed') {
                        alert("上传图片失败：系统暂不支持该类型图片上传");
                        return;
                    }
                }
            });
        });

    //添加全部选中事件
    self.completeAll = function () {
        $("#white").attr("checked", false);
        // self.queryWhiteAndBlack();
        $("#black").attr("checked", false);
        if ($('#all').is(':checked')) {
            $("#white").attr('disabled', 'disabled');
            $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            // $("#selectaddwhiteId").val("");
            $("#black").attr('disabled', 'disabled');
            $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
            // $("#selectaddblackId").val("");

            self.add.whiteMemberListName= "NO_RULE"
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.add.blackMemberListName= "NO_RULE"
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        } else {
            $("#white").removeAttr('disabled', 'disabled');
            $("#selectaddwhiteId").removeAttr("disabled");
            $("#black").removeAttr('disabled', 'disabled');
            $("#selectaddblackId").removeAttr("disabled");

            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }
    }

    //白名单选中事件 type 0 添加 1修改
    self.whiteClick = function(type){
        if(type==0){
            if(!$("#white").prop("checked")){
                self.strategyReload();
                $('#userNameLikeSearch').hide();
            }
        }else{
            if(!$("#editwhite").prop("checked")){
                self.detail.whiteMemberListName= "NO_RULE"
                self.detail.whiteId=null;
                self.strategyReloadUpdate();
                $('#userNameLikeSearchUpdate').hide();
            }
        }
    }

    //黑名单选中事件 type 0 添加 1修改
    self.blackClick = function(type){
        if(type == 0){
            if(!$('#black').prop("checked")){
                self.blackStrategyReload();
                $('#userNameLikeBlackSearch').hide();
            }
        }else{
            if(!$('#upBlack').prop("checked")){
                self.detail.blackMemberListName= "NO_RULE"
                self.detail.blackId=null;
                self.blackStrategyReloadUpdate();
                $('#userNameLikeBlackSearchUpdate').hide();
                $("#blackListType").attr('disabled','disabled');
            }else{
                $("#blackListType").attr('disabled',false);

            }
        }
    }


        //查询黑白名单列表
        self.queryWhiteAndBlack = function () {
            $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
                function (data) {
                    self.blackList_qb = data.data.resp.black_qb;
                    self.blackList_wk = data.data.resp.black_wk;
                    self.whiteList_qb = data.data.resp.white_qb;
                    self.whiteList_wk = data.data.resp.white_wk;
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );

        }

        //查询黑白名单列表
        self.queryEditWhiteAndBlack = function () {
            $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
                function (data) {

                    self.editblackList_qb = data.data.resp.black_qb;
                    self.editblackList_wk = data.data.resp.black_wk;
                    self.editwhiteList_qb = data.data.resp.white_qb;
                    self.editwhiteList_wk = data.data.resp.white_wk;
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );

        }
        self.queryEditWhiteAndBlack();


        //************************内容推荐查看**************************
        //查看
        self.toView = function (query) {
            self.showPopup = query;
            if (self.isJSON(self.showPopup.labels)){
                self.showPopup.labels = JSON.parse(self.showPopup.labels);
            }
            console.log(self.showPopup,"查看内容");
            self.showPopup.tabTextId = self.showPopup.tabTextId + "";
            if (($scope.showPopup.productChannel == 1 && ($scope.showPopup.positions == '308' || $scope.showPopup.positions =='310' ||$scope.showPopup.positions =='311' || self.showPopup.positions == '317')) || (self.showPopup.positions == '309' && self.showPopup.productChannel == 0)) {
                self.getTitleList(self.showPopup.positions, self.showPopup.productChannel);
                setTimeout(function(){
                    var sel = "#0000FF";
                    $('.dealTitleCheckbox').each(function() {
                        var val=$(this).val();
                        var codes =  self.showPopup.tabTextId.split(",");
                        for(var i=0;i<codes.length;i++){
                            var code=codes[i];
                            if(val==code){
                                $(this).prop("selected",'selected');
                                $(this).bgColor = sel;
                            }
                        }
                    });
                },500)
            }


            $('#showContentView').show();






        }


        //修改取消按钮
        $scope.hsjgonto = function () {
            $("#upateContent").hide();
        }
//************************修改*****************************
        self.updatePageOneByRDict = function (updatePageOne) {
            $http.get(globalConfig.basePath + "/dict/getByResourceType" + "?resourceType=" + updatePageOne
            ).success(function (data) {
                $scope.upatePositionDictList = data.resp.result;
                $scope.updataePageTwo = data.resp.result[0].value;
            })

        }

    /**
     * 判断是否是json
     * @param str
     * @returns {boolean}
     */
    self.isJSON = function(str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch(e) {
                console.log(e);
                return false;
            }
        }
        console.log('It is not a string!')
    }

        self.update = function (query) {
            query.valid = query.valid + "";
            query.whiteId = query.whiteId + "";
            query.blackId = query.blackId + "";
            self.isUpdateRoster = 'N';
        $scope.detail = angular.copy(query);
        if (self.isJSON(self.detail.labels)){
            self.detail.labels = JSON.parse(self.detail.labels);
        }

        if( $scope.detail.positions==314){
            $scope.detail.crunchiesType = $scope.detail.crunchiesType+"";
        }

        if (query.showType == 0) {
            $('#editall').prop("checked", true);
            $('#editwhite').prop("checked", false);
            $('#editblack').prop("checked", false);
            $("#editwhite").attr('disabled', 'disabled');
            $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            // $("#editselectaddwhiteId").val("0");
            $("#editblack").attr('disabled', 'disabled');
            $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
            // $("#editselectaddblackId").val("0");

            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = null;
                $('#userNameLikeSearchUpdate').hide();
            },300)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = null;
                $('#userNameLikeBlackSearchUpdate').hide();
            },300)

        } else if (query.showType == 1) {
            $('#editwhite').prop("checked", true);
            $('#editblack').prop("checked", false);
            $('#editall').prop("checked", false);
            $('#editwhite').removeAttr("disabled");
            $('#editblack').removeAttr("disabled");

            //修改名单那类型查询
            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = query.whiteId;
            },300)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = null;
                $('#userNameLikeBlackSearchUpdate').hide();
            },300)
        } else if (query.showType == 2) {
            $('#editblack').prop("checked", true);
            $('#editwhite').prop("checked", false);
            $('#editall').prop("checked", false);
            $('#editwhite').removeAttr("disabled");
            $('#editblack').removeAttr("disabled");

            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = null;
                $('#userNameLikeSearchUpdate').hide();
            },300)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = query.blackId;
            },300)
        } else if (query.showType == 3) {
            $('#editblack').prop("checked", true);
            $('#editwhite').prop("checked", true);
            $('#editall').prop("checked", false);
            $('#editwhite').removeAttr("disabled");
            $('#editblack').removeAttr("disabled");
            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = query.whiteId
            },300)
            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = query.blackId;
            },300)
        }
            self.productChannel = query.productChannel + '';
            self.detail.auditPerson = '';
            self.detail.tabTextId = self.detail.tabTextId + "";
            if (($scope.detail.productChannel == 1 && ($scope.detail.positions == '308' || $scope.detail.positions =='310' ||$scope.detail.positions =='311')) || (self.detail.positions == 309 && self.detail.productChannel == 0)) {
                self.getTitleList($scope.detail.positions, self.productChannel);
                setTimeout(function(){
                    var sel = "#0000FF";
                    $('.upTitleCheckbox').each(function() {
                        var val=$(this).val();
                        var codes =  self.detail.tabTextId.split(",");
                            for(var i=0;i<codes.length;i++){
                                var code=codes[i];
                                if(val==code){
                                    $(this).prop("selected",'selected');
                                    $(this).bgColor = sel;
                                }
                            }
                    });
                },500)
            }

            setTimeout(function () {
                self.getPostionList($scope.detail.productChannel);
            },500)
            $('#upateContent').show();


            if ($scope.detail.positions == 304) {
                var position = $scope.detail.positions;
                $http.get(globalConfig.basePath + "/dict/getByvalue" + "?value=" + position
                ).success(function (data) {
                    var tabNameJson = data.resp.extend1;
                    $scope.nameList = JSON.parse(tabNameJson);
                })
            }

            //修改禁用名单
            $("#editall").attr('disabled','disabled');
            $("#editwhite").attr("disabled",'disabled');
            $("#editblack").attr("disabled",'disabled');
        }
        //确认修改
        self.updateSure = function () {
            self.detail.imageUrl = $('#fileUrl2').val();
            if (self.detail.positions == 309 && self.detail.productChannel ==1){
                self.detail.title = $('#tt').val();
                self.detail.desc = $('#recontent').val();
            }
            if((self.detail.positions == 10001 &&  self.detail.productChannel == 1)||(self.detail.positions == 20001 && self.detail.productChannel == 0 ) ){
                self.detail.title = $("#tt").val();
                if (!self.detail.bizCode){
                    alert("任务id不能为空!");
                    return;
                }
                if (!self.detail.title){
                    alert("任务标题不能为空!");
                    return;
                }
                if (!self.detail.buttonName){
                    alert("按钮名称不能为空!");
                    return;
                }
            }
            if (self.detail.positions == 309 && self.detail.productChannel ==1){
                if (!self.detail.title){
                    alert("任务标题不能为空!");
                    return;
                }
                if (!self.detail.tabNameKey || self.detail.tabNameKey == "" || self.detail.tabNameKey == null){
                    alert("推荐分类不能为空!");
                    return;
                }
                if (!$('#bbb').val()){
                    alert("活动代码不能为空!");
                    return;
                }
            }

            if (((self.detail.positions == 318 && self.detail.productChannel == 1) ||(self.detail.positions == 310 && self.detail.productChannel == 0) ) && !self.detail.actionText){
                alert("请输入动作文案!")
                return;
            }
            if (self.detail.positions!=303 && self.detail.positions!=309 && self.detail.positions!=312 && self.detail.positions!=1001 && 314!= self.detail.positions  && self.detail.positions != 307 && self.detail.positions != 308 && self.detail.positions != 315 && self.detail.positions != 316
                && 20001!= self.detail.positions && 10001!= self.detail.positions && 10002!= self.detail.positions && 10003!= self.detail.positions && 20002!= self.detail.positions && 20003!= self.detail.positions && 10004!= self.detail.positions && 20004!= self.detail.positions){
                if (!self.detail.redirectUrl){
                    alert("跳转地址不能为空!");
                    return;
                }
            }
            if (!self.detail.positions || self.detail.positions == '0') {
                alert("请选择位置");
                return;
            }

            var addpositionsText = $("#editPostiotion").find("option:selected").text();
            if(!addpositionsText){
                alert("互动位置不能为空");
                return ;
            }
            self.detail.positionName = addpositionsText;

            self.detail.imageUrl = $('#fileUrl2').val();
            if (303 != self.detail.positions && 20001!= self.detail.positions && 10001!= self.detail.positions  && 10002!= self.detail.positions && 10003!= self.detail.positions && 20002!= self.detail.positions && 20003!= self.detail.positions) {
                if (308 != self.detail.positions && 304 != self.detail.positions && 309 != self.detail.positions && 315 != self.detail.positions && 316 != self.detail.positions && 307!= self.detail.positions && 317!= self.detail.positions && 318!= self.detail.positions && 310!= self.detail.positions && 20004!= self.detail.positions && 10004!= self.detail.positions && !self.detail.imageUrl) {
                    alert("图片不能为空");
                    return;
                }
                if ((307 == self.detail.positions || 308 == self.detail.positions || 309 == self.detail.positions || 310 == self.detail.positions) && self.detail.productChannel == 1){
                    if (!self.detail.imageUrl){
                        alert("图片不能为空!");
                        return;
                    }
                }

                if(!self.detail.title && self.detail.positions != 306 &&  self.detail.positions != 307){
                    alert("标题不能为空");
                    return ;
                }
                if(!self.detail.title && self.detail.productChannel ==0  &&  self.detail.positions == 307){
                    alert("标题不能为空");
                    return ;
                }
                if(self.detail.title != null){
                    if(self.detail.title.length>60){
                        alert("标题标题最多60个字符");
                        return ;
                    }
                }
                if(!self.detail.desc && self.detail.positions != 310 && self.detail.positions != 315 && self.detail.positions != 316  && self.detail.positions != 306 && self.detail.positions != 318 && self.detail.positions != 10002 && self.detail.positions != 10003  && self.detail.positions != 20002  && self.detail.positions != 20003 && ( self.detail.positions != 308 && self.detail.positions != 307 && self.detail.positions != 20004 && self.detail.productChannel == 0 )){
                    alert("内容不能为空");
                    return ;
                }
                if(!self.detail.desc && (self.detail.positions == 310||self.detail.positions == 317) && self.detail.productChannel == 1){
                    alert("内容不能为空");
                    return ;
                }


                if ((self.detail.positions!=309  && self.detail.productChannel != 1) && 1001!= self.detail.positions && 314!= self.detail.positions && self.detail.positions != 307 && self.detail.positions != 308 && self.detail.positions != 10004 && self.detail.positions != 20004){
                    if (!self.detail.redirectUrl){
                        alert("跳转地址不能为空!");
                        return;
                    }
                }
                if ((self.detail.positions== 307 || self.detail.positions == 308 || self.detail.positions == 317) && self.detail.productChannel == 1){
                    if (!self.detail.redirectUrl){
                        alert("跳转地址不能为空!");
                        return;
                    }
                }
            }


            if ((310 == self.detail.positions || 311 == self.detail.positions || self.detail.positions ==313) && self.detail.productChannel ==1) {
               if(!self.detail.imageUrl){
                   alert("图片不能为空");
                   return;
                }
                if (!self.detail.desc) {
                    alert("内容不能为空");
                    return;
                }
                if (!self.detail.desc.length>50) {
                    alert("内容不能超过50个字符");
                    return;
                }

                if (!self.detail.title) {
                    alert("标题不能为空");
                    return;
                }

                if(self.detail.title.length>60){
                    alert("标题最多60个字符");
                    return;
                }

                if(self.detail.positions ==313){
                    if(!self.detail.desc){
                        alert("内容不能为空");
                        return ;
                    }
                }
            }
            var titleId="";
            if((self.detail.positions == 310 || self.detail.positions == 311 || self.detail.positions ==308)&& self.detail.productChannel ==1 ){


                var selectedItem = [];

                $('#multiple option:selected').each(function (){
                    selectedItem.push($(this).val());

                })

                for(var j=0;j<selectedItem.length;j++){
                    if(selectedItem[j]!=""){
                        titleId=titleId+selectedItem[j]+",";
                    }
                }

                if(titleId==""){
                    alert("tab位置不能为空！");
                    return;
                }
            }



            if (((304 == self.detail.positions || 10001 == self.detail.positions) && self.detail.productChannel==1)|| (20001 == self.detail.positions && self.detail.productChannel==0) ) {
                self.detail.desc = $('#recontent').val();
                if (!self.detail.imageUrl && !self.detail.desc) {
                    alert("图片和内容必须填写一个");
                    return;
                }
            }

            if (309 == self.detail.positions && self.detail.productChannel==1) {
                if (!self.detail.imageUrl && !self.detail.desc) {
                    alert("图片和内容必须填写一个");
                    return;
                }
            }
            if (10002 == self.detail.positions || 10003 == self.detail.positions || 20002 == self.detail.positions || 20003 == self.detail.positions) {
                if (!self.detail.title) {
                    alert("标题不能为空");
                    return;
                }
                if(!self.detail.subTitle){
                    alert("副标题不能为空!");
                    return;
                }
                if(!self.detail.buttonName){
                    alert("按钮文案不能为空!");
                    return;
                }
            }

        /*self.detail.whiteId=$('#editselectaddwhiteId').val();
         self.detail.blackId=$('#editselectaddblackId').val();*/


            if (304 == self.detail.positions  && self.detail.productChannel==1) {
                if ($scope.detail.tabNameKey == null || $scope.detail.tabNameKey == "") {
                    alert("请选择Tab名称");
                    return;
                }
                $scope.detail.tabName = $("#editTabName").find("option:selected").text();
            }

            //上线时间  下线时间
            self.detail.onlineTime = $('#editOnlineTime').val() + "";
            self.detail.offlineTime = $('#editOfflineTime').val() + "";
            self.detail.contentTab = $('#updateContentTab').val() + "";

            if (!self.detail.onlineTime || !self.detail.offlineTime) {
                alert("上线时间下线时间不能为空");
                return;
            }

            if (self.detail.offlineTime <= self.detail.onlineTime) {
                alert("下线时间必须大于上线时间");
                return;
            }


            // 处理名单
            if (self.isUpdateRoster == 'Y'){
                var whiteId = $('#memberIdUpdate').val();
                var blackId = $('#memberBlackIdUpdate').val();
                if(isNaN(whiteId)){
                    whiteId=0;
                }
                if(isNaN(blackId)){
                    blackId=0;
                }
                if (whiteId && whiteId != 0 && blackId && blackId!=0){
                    self.detail.showType = 3;
                }

                if (!whiteId && !blackId){
                    self.detail.showType = 0;
                }
                if (whiteId && whiteId != 0 && !blackId){
                    self.detail.showType = 1;
                }
                if (blackId && blackId!=0 && !whiteId){
                    self.detail.showType = 2;
                }
                if (self.detail.whiteMemberListName != 'NO_RULE'){
                    self.detail.whiteTrue=true;
                }

                if (self.detail.blackMemberListName != 'NO_RULE'){
                    self.detail.blackTrue = true;
                }


                if(self.detail.whiteTrue == true){
                    var whiteId =  $('#memberIdUpdate').val();
                    if(whiteId==null || whiteId=="" || whiteId=="0" || whiteId.indexOf("?")!=-1){
                        alert('请选择具体白名单!');
                        return;
                    }else{
                        self.detail.whiteId = whiteId;
                        self.detail.whiteName = $('#memberIdUpdate option:selected').text();
                    }
                }
                if(self.detail.blackTrue == true){
                    var blackId =  $('#memberBlackIdUpdate').val();
                    if(blackId == null || blackId=="" || blackId=="0"|| blackId.indexOf("?")!=-1){
                        alert('请选择具体黑名单!');
                        return;
                    }else{
                        self.detail.blackId = blackId;
                        self.detail.blackName = $('#memberBlackIdUpdate option:selected').text();
                    }
                }
            }


            //审核人
            var requestAuditPersio = self.detail.auditPerson;
            //提审说明
            var auditDescription = self.detail.requestAuditDescription;
            // 审核人
            if (!requestAuditPersio) {
                alert("审核人不能为空");
                return;
            } else {
                self.detail.auditNo = self.detail.auditPerson.no;
                self.detail.auditPerson = self.detail.auditPerson.name;
            }
            if (auditDescription != null) {
                if (auditDescription.length > 18) {
                    alert("审核说明不能超过18个字符");
                    return;
                }
            }

            if ((306 == self.detail.positions && self.detail.productChannel==0)|| (307 == self.detail.positions && self.detail.productChannel==1)) {
                if (self.detail.label != null) {
                    if (self.detail.label.length > 4) {
                        alert("角标不能超过4个字符");
                        return;
                    }
                }
            }

            if((306 == self.detail.positions && self.detail.productChannel==0)|| (307 == self.detail.positions && self.detail.productChannel==1)) {
                if (self.detail.title != null) {
                    if (self.detail.title.length > 10) {
                        alert("标题不能超过10个字符");
                        return;
                    }
                }
            }

            if ((306 == self.detail.positions && self.detail.productChannel==0)|| (307 == self.detail.positions && self.detail.productChannel==1))  {
                if (self.detail.desc != null) {
                    if (self.detail.desc.length > 20) {
                        alert("内容不能超过20个字符");
                        return;
                    }
                }
            }

            if((self.detail.positions == 310 || self.detail.positions == 311 || self.detail.positions ==308)&& self.detail.productChannel ==1 ){
                self.detail.tabTextId = titleId;
            }

            var url = globalConfig.basePath + '/appConfig/content/updateContentRecommendation';
            console.log(self.detail,"待修改的数据");
            if (self.detail.labels){
                self.detail.labels = JSON.stringify(self.detail.labels);
            }
            $http.post(url, self.detail).then(function successCallback(data) {
                if (data.data.code == '000') {
                    alert("修改成功");
                    self.detail = {};
                    $("#editTask").hide();
                    window.location.reload();
                }
            }), function errorCallback(response) {

            }

    }
    //添加全部选中事件
    self.editAll = function () {
        // self.queryEditWhiteAndBlack();
        $("#upWhite").attr("checked",false);
        $("#upBlack").attr("checked",false);
        if ($('#editall').is(':checked')) {
            $("#upWhite").attr('disabled', 'disabled');
            $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            // $("#editselectaddwhiteId").val("0");
            $("#upBlack").attr('disabled', 'disabled');
            $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
            // $("#editselectaddblackId").val("0");

            //黑白名单操作
            self.detail.whiteMemberListName= "NO_RULE"
            self.detail.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();


            self.detail.blackMemberListName= "NO_RULE"
            self.detail.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
        } else {
            $("#upWhite").removeAttr('disabled', 'disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");
            $("#upBlack").removeAttr('disabled', 'disabled');
            $("#editselectaddblackId").removeAttr("disabled");
        }
    }


        //取消修改
        $scope.updateCancel = function () {
            $('#showUpdate').hide();

        }

        self.isSelected = function (id) {

            if (self.positions) {
                if (self.positions == "1,2") {
                    return true;
                }
                if (self.positions == id) {
                    return true;
                }
            }
            return false;
        }

        //*******************排序**************************
        self.stort = function () {
            touchCount++;
            if (!self.search.productChannel) {
                alert("请在查询条件中选择渠道");
                return;
            }
            if (!self.search.positions) {
                alert("请在查询条件中选择位置");
                return;
            }
            if (self.search.productChannel == 1 && self.search.positions == 309 && touchCount==1) {
                self.search.tabNameKey = self.recommendClassification[0].tab_name_key;
            }

            if (self.search.productChannel == 0) {
                var type = "";
                if (self.search.positions == 301) {
                    type = "sys_wk_consult_value_301";
                }
                self.getShowValue(type);

            }
            if (self.search.productChannel == 1 && $scope.search.positions == '304') {
                $scope.getTabList($scope.search.positions,$scope.search.productChannel);
                /* $http.get(globalConfig.basePath + "/dict/getByvalue" + "?value=" + $scope.search.positions
                 ).success(function (data) {
                 var tabNameJson = data.resp.extend1;
                 $scope.nameList = JSON.parse(tabNameJson);
                 })*/

            }

            if ($scope.search.productChannel == 1 && $scope.search.position == '10-') {
                $scope.rDictList = ""
                var type = "sys_service_center_qb_type"
                //原生original_bd_url
                $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
                ).success(function (data) {
                    $scope.rDictList = data.resp.result;
                })

                if ($("#typeValue").val() != "" && $("#typeValue").val() != null) {
                    $scope.getTypeList($("#typeValue").val());
                }

            }
            $('#showPriority').show();
            var url = globalConfig.basePath + "/appConfig/content/selectSort?productChannel=" + self.search.productChannel + "&positions=" + self.search.positions + "&tabNameKey="+self.search.tabNameKey;

            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
                if (data.data.code == '000') {
                    for (var i = 0; i < data.data.resp.result.length; i++) {
                        data.data.resp.result[i].priority = i + 1;
                    }
                    self.strotList = data.data.resp.result;
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("根据id获取对象失败....");
            });
        }
            $scope.rDict = "";
        $scope.getShowValue = function (type) {
            var url = globalConfig.basePath + "/rDict/getShowPageValue?resourceType=" + type;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
                $scope.rDict = data.data.resp;
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取数据失败....");
            });
        }

        //根基类型获取数据
        $scope.getTypeList = function (search) {
            /*var url = globalConfig.basePath + "/appConfig/content/selectSort?productChannel=" + $scope.search.productChannel + "&positions=" + $scope.search.positions + "&contentTab=" + $scope.search.tabNameKey;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
                if (data.data.code == '000') {
                    self.strotList = data.data.resp.result;
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("根据id获取对象失败....");
            });*/

            var url = globalConfig.basePath + "/appConfig/content/selectSort?productChannel=" + self.search.productChannel + "&positions=" + self.search.positions + "&tabNameKey="+ $scope.search.tabNameKey;

            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
                if (data.data.code == '000') {
                    for (var i = 0; i < data.data.resp.result.length; i++) {
                        data.data.resp.result[i].priority = i + 1;
                    }
                    self.strotList = data.data.resp.result;
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("根据id获取对象失败....");
            });
        }


        //移动
        self.move = function (type) {
            if ($("input[class='moveCheckbox']:checked").length > 1) {
                alert("请选择一个进行移动");
                return;
            }
            var length = self.strotList.length;


            $('.moveCheckbox').each(function () {
                if (this.checked == true) {
                    if (type == 'S') {//上移
                        var me = $(this).val() - 1;
                        if (me == 0) {
                            alert("已经第一了你还要往那移");
                            return;
                        }
                        var move0 = self.strotList[me];//当前选中的
                        var move1 = self.strotList[me - 1];//上一个
                        self.strotList[me - 1] = move0;//self.strotList[me];//当前选中的上移一个
                        self.strotList[me] = move1;// 当前选中的
                        self.strotList[me - 1].priority = Number($(this).val()) - Number(1);
                        self.strotList[me].priority = Number($(this).val());
                    } else if (type == 'X') {// 下移
                        var me = $(this).val() - 1;
                        if (me == length - 1) {
                            alert("已经最后了,还要往那移");
                            return;
                        }
                        var move0 = self.strotList[me];// 下一个内容推荐
                        move0.priority = Number($(this).val()) + Number(1);

                        var move1 = self.strotList[me + 1];// 下一个内容推荐
                        move1.priority = Number($(this).val());
                        self.strotList[me + 1] = move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                        self.strotList[me] = move1;// 下一个移动到当前的位置

                    }
                }
            })

        }


        self.moveCommit = function () {
            var url = globalConfig.basePath + "/appConfig/content/moveCommit";
            debugger

            var aa = {};
            aa = self.strotList;
            $http.post(url, aa).then(
                function (data) {
                    alert(data.data.message);
                    self.querycontentConfigList(1);
                    $('#showPriority').hide();
                    self.strotList = {};
                }, function (response) {
                    alert("请求失败了....");
                }
            );
        }

        //********************失效***************************
        //生效失效内容推荐
        self.quickOffline = function (id, valid) {
            $('#showStart').show();
            self.start.startValid = valid;
            self.start.id = id;
        }
        //确定失效生效内容推荐
        self.confirmStart = function (id, valid) {
            if (valid == 0) {
                valid = 1;
            } else if (valid == 1) {
                valid = 0;
            }
            var url = globalConfig.basePath + "/appConfig/Popup/takeEffectPopup?id=" + id + "&valid=" + valid;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
                alert(data.data.message)
                //self.reset();
                // self.loading();
                self.querycontentConfigList(1);
                $('#showStart').hide();

            }, function errorCallback(response) {
                alert("失败....");
            });
            self.querycontentConfigList(1);
        }

        //取消生效失效内容推荐
        self.cancelStart = function () {
            $('#showStart').hide();
        }


        /**
         * 打开生效弹框
         */
        $scope.startShow = function (id, valid, SequenceId) {
            $('#showStart').show();
            $scope.SequenceId = SequenceId;
            $scope.id = id;
            $scope.isValid = valid;

    }

        /**
         * 关闭生效弹框
         */
        $scope.cancel = function () {
            $('#showStart').hide();
        }

        /**
         * 进行生效/失效内容推荐
         */
        $scope.start = function (id, valid, SequenceId) {
            var url = "";
            if (valid == 0) {
                url = globalConfig.basePath + "/appConfig/announcementNew/takeEffect?id=" + id + "&SequenceId=" + SequenceId;
            } else if (valid == 1) {
                url = globalConfig.basePath + "/appConfig/announcementNew/failure?id=" + id + "&SequenceId=" + SequenceId;
            }
            $http({
                method: 'POST',
                url: url,
            }).then(function successCallback(data) {
                alert(data.data.message)
                $('#showStart').hide();
                //$scope.queryAnnouncement(1);
                self.querycontentConfigList(1);
            }, function errorCallback(response) {
                alert("失败....");
            });
        }

        //默认查询
        self.loading = function () {
            self.search.pageSize = "5";

            self.querycontentConfigList(1);
        }
        self.loading();
        // self.loading();


        /**
         * 拉取审核人列表
         */
        $scope.pullAuditPersons = function () {
            var url = globalConfig.basePath + "/otc/memberEnjoy/getAuditPersionList";
            $http.get(url).then(function successCallback(callback) {
                if (callback.data.code == '000') {
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
        // **************************审核********************************
        /**
         * 审核box
         */
        self.audit = function (record) {
            if (record.auditStatus != "0") {
                alert('只能对待审核状态的数据进行操作');
                return;
            }
            self.auditStatus = "1";
            $('#auditShow').show();
            self.confirmRecord = angular.copy(record);
            self.auditDescription = "";

        };

        /**
         * 审核操作
         */
        self.confirm = function () {
            self.confirmRecord.auditStatus = self.auditStatus;
            self.confirmRecord.auditDescription = self.auditDescription;
            var url = globalConfig.basePath + "/appConfig/content/auditing";
            $http.post(url, self.confirmRecord).then(function successCallback(callback) {

                if (callback.data.code == '000') {
                    $('.take-start-box').hide();
                    $scope.querycontentConfigList(1);
                    alert("操作成功");
                } else {
                    console.error(callback.data);
                    alert("操作失败");
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                swalMsg(response);
            });
        };

        /**
         * 操作前的预处理
         * @param opType
         * @param record
         */
        $scope.preOperate = function (opType, record) {
            record.requestAuditDescription = "";
            $scope.effectRecord = record;
            $scope.effectRecord.auditPerson = {};
            self.effectRecord.auditPerson.no = '';
            $scope.effectRecord.id = record.id;
            $('#takeEffect').show();
        };


        $scope.fastOffline = function () {

            if (!self.effectRecord.auditPerson.no) {
                alert("审核人不能为空");
                return;
            } else {
                self.effectRecord.auditNo = self.effectRecord.auditPerson.no;
                self.effectRecord.requestAuditPersonEmail = self.effectRecord.auditPerson.email;
                self.effectRecord.auditPerson = self.effectRecord.auditPerson.name;
            }
            self.effectRecord.valid = '0';
            var url = globalConfig.basePath + "/appConfig/content/fastOffline";
            $http.post(url, self.effectRecord).then(function (data) {
                    $('#takeEffect').hide();
                    if (data.data.code == '000') {
                        alert(data.data.message);

                        $scope.querycontentConfigList(1);
                    }
                }, function (response) {
                    alert("请求失败了....");
                }
            );


        };


        $scope.validateRecord = function () {
            // 审核人
            //var auditPerson = self.effectRecord.auditPerson;
            if (!self.effectRecord.auditPerson.no) {
                alert("审核人不能为空");
                return;
            } else {
                self.effectRecord.auditNo = self.effectRecord.auditPerson.no;
                self.effectRecord.requestAuditPersonEmail = self.effectRecord.auditPerson.email;
                self.effectRecord.auditPerson = self.effectRecord.auditPerson.name;
            }
            self.effectRecord.valid = '0';
            /*if(self.effectRecord.valid=='1'){
             self.effectRecord.valid='0';
             }else{
             self.effectRecord.valid='1';
             }*/
            var url = globalConfig.basePath + "/appConfig/content/takeEffectNew";
            $http.post(url, self.effectRecord).then(function (data) {
                    $('#takeEffect').hide();
                    if (data.data.code == '000') {
                        alert(data.data.message);
                        $scope.querycontentConfigList(1);
                    }
                }, function (response) {
                    alert("请求失败了....");
                }
            );


        };
        $scope.openTopTip = function (x) {
            self.topRecord = x;
            $('#moveTop').show();
        }
        $scope.moveTop = function () {
            var url = globalConfig.basePath + "/appConfig/announcementNew/moveTop";
            $http.post(url, self.topRecord).then(function (data) {
                    $('#moveTop').hide();
                    alert('置顶成功');
                    $scope.querycontentConfigList(1);
                }, function (response) {
                    alert("请求失败了....");
                }
            );
        };
        $scope.moveTopCancel = function () {
            $('#moveTop').hide();
        }

    //region 添加白名单查询
    /**
     * 用户策略类型初始化
     */
    self.strategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.strategyList = data.data.resp;
                    self.add.whiteMemberListName= "NO_RULE"
                    self.findChannelGroups();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /** 查询渠道现有分组*/
    self.findChannelGroups = function () {
        var channelCode;
        if(self.add.productChannel==0){
            channelCode='WK';
        }else if(self.add.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.add.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
            self.add.whiteId='0';
            $('#memberId').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.add.whiteMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strChannelGroups = data.data.resp;
                        if (self.strChannelGroups.length > 0) {
                            $('#userNameLikeSearch').show();
                        }
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            )
        }
    }

    self.changeFindChannelGroups = function () {
        self.findChannelGroups();
    }
    //endregion


    //region 添加黑名单查询
    /**
     * 用户策略类型初始化
     */
    self.blackStrategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.blackStrategyList = data.data.resp;
                    self.add.blackMemberListName= "NO_RULE"
                    self.findBlackChannelGroups();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /** 查询渠道现有分组*/
    self.findBlackChannelGroups = function () {
        var channelCode;
        if(self.add.productChannel==0){
            channelCode='WK';
        }else if(self.add.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.add.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeBlackSearch').hide();
            self.add.blackId='0';
            $('#memberBlackId').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.add.blackMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strBlackChannelGroups = data.data.resp;
                        if (self.strBlackChannelGroups.length > 0) {
                            $('#userNameLikeBlackSearch').show();
                        }
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            )
        }
    }


    self.changeBlackFindChannelGroups = function () {
        self.findBlackChannelGroups();
    }
    //endregion


    //region 修改白名单查询
    /**
     * 用户策略类型初始化
     */
    self.strategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.detail.strategyList = data.data.resp;
                    self.findChannelGroupsUpdate();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    self.changeFindChannelGroupsUpdate = function () {
        self.findChannelGroupsUpdate();
    }
    //endregion


    //region 修改黑名单查询
    /**
     * 用户策略类型初始化
     */
    self.blackStrategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.detail.blackStrategyList = data.data.resp;
                    self.findBlackChannelGroupsUpdate();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /** 查询渠道现有分组*/
    self.findBlackChannelGroupsUpdate = function () {
        var channelCode;
        if(self.detail.productChannel==0){
            channelCode='WK';
        }else if(self.detail.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.detail.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeBlackSearchUpdate').hide();
            self.detail.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.detail.blackMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strBlackChannelGroups = data.data.resp;
                        if (self.strBlackChannelGroups.length > 0) {
                            $('#userNameLikeBlackSearchUpdate').show();
                        }
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            )
        }
    }

     self.selectTaskTitle =  function(number){
            if (number == 1) {
                var channel;
                if ($('#cn').text()=="悟空理财APP"){
                    channel = "0";
                }else {
                    channel = "1";
                }
                $scope.detail.title = "";
                $scope.detail.desc = "";
                $.ajax({
                    type: 'GET',
                    url: globalConfig.basePath + "/appConfig/content/selectTaskTitle?channel=" + channel + "&activityCode=" + $('#bbb').val(),
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        console.log(data, "任务id返回值");
                        if (data.code == "QUERY_ACTIVITY_DETAIL_DAO_EXCEPTION"){
                            alert("活动Code无效!");
                            $('#bbb').val(null);
                            return;
                        }
                        if (data.code != '000') {
                            if(data.data != null){
                               $scope.detail.title = data.data.title;
                               $scope.detail.desc = data.data.subTitle;
                            }
                        }
                    }
                })
            } else {
                $.ajax({
                    type: 'GET',
                    url: globalConfig.basePath + "/appConfig/content/selectTaskTitle?channel=" + $('#channel option:selected').val() + "&activityCode=" + $('#ccc').val(),
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        console.log(data, "任务id返回值");
                        if (data.code == "QUERY_ACTIVITY_DETAIL_DAO_EXCEPTION"){
                            alert("活动Code无效!");
                            $('#ccc').val(null);
                            return;
                        }
                        if (data.code != '000') {
                            $('#title').val(data.data.title);
                            $('#twotitle').val(data.data.subTitle);

                        }
                    }
                })
            }
        }



    self.changeBlackFindChannelGroupsUpdate = function () {
        self.findBlackChannelGroupsUpdate();
    }
    //endregion



    //新增修改名单逻辑
    //region 修改白名单查询
    /**
     * 用户策略类型初始化
     */
    self.strategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.detail.strategyList = data.data.resp;
                    // self.findChannelGroupsUpdate();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /** 查询渠道现有分组*/
    self.findChannelGroupsUpdate = function () {
        var channelCode;
        if(self.detail.productChannel==0 ||self.detail.productChannel==2){
            channelCode='WK';
        }else if(self.detail.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.detail.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterLikeSearch').hide();
            self.detail.whiteId='0';
            $('#memberIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.detail.whiteMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strChannelGroups = data.data.resp;
                        if (self.strChannelGroups.length > 0) {
                            $('#upUserRosterLikeSearch').show();
                        }
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            )
        }
    }

    self.changeFindChannelGroupsUpdate = function () {
        self.findChannelGroupsUpdate();
    }
    //endregion


    //region 修改黑名单查询
    /**
     * 用户策略类型初始化
     */
    self.blackStrategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.detail.blackStrategyList = data.data.resp;
                    // self.findBlackChannelGroupsUpdate();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /** 查询渠道现有分组*/
    self.findBlackChannelGroupsUpdate = function () {
        var channelCode;
        if(self.detail.productChannel==0 ||self.detail.productChannel==2){
            channelCode='WK';
        }else if(self.detail.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.detail.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.detail.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.detail.blackMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strBlackChannelGroups = data.data.resp;
                        if (self.strBlackChannelGroups.length > 0) {
                            $('#upUserRosterBlackLikeSearch').show();
                        }
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            )
        }
    }


    self.changeBlackFindChannelGroupsUpdate = function () {
        self.findBlackChannelGroupsUpdate();
    }
    //endregion






    //修改，修改名单
    self.toUpdateRoster = function () {
        self.isUpdateRoster = 'Y';
        $("#editall").attr('disabled',false);

        $('#editall').prop("checked",true);//默认全部不选择
        $("#upWhite").attr('checked',false);
        $("#upBlack").attr('checked',false);
        $("#upWhite").attr('disabled','disabled');
        $("#upBlack").attr('disabled','disabled');
        $("#whitListType").attr('disabled','disabled');
        $("#blackListType").attr('disabled','disabled');
        self.beforeWhiteMemberListName = self.detail.whiteMemberListName;
        self.beforeBlackMemberListName = self.detail.blackMemberListName;
        self.beforeWhiteId = self.detail.whiteId;
        self.beforeBlackId = self.detail.blackId;
        if (self.detail.whiteName && self.detail.whiteName != ''){
            self.beforeWhiteName = self.detail.whiteName;
        }
        if (self.detail.blackName && self.detail.blackName != ''){
            self.beforeBlackName = self.detail.blackName;
        }
        self.detail.whiteId = '';
        self.detail.blackId = '';
        self.detail.blackMemberListName = 'NO_RULE';
        self.detail.whiteMemberListName = 'NO_RULE';

        $('#upUserRosterLikeSearch').hide();

        $('#upUserRosterBlackLikeSearch').hide();

    }

    //点击白名单复选框
    self.upWhiteClick = function () {
        if(!$("#upWhite").prop("checked")){
            self.detail.whiteMemberListName= "NO_RULE"
            self.detail.whiteId=null;
            $("#whitListType").attr('disabled','disabled');
            $('#upUserRosterLikeSearch').hide();
        }else{
            $("#whitListType").attr('disabled',false);
        }
    }

    // 修改操作 修改名单
    self.upFindChannelGroups = function () {
        self.findChannelGroupsUpdate();
    }
    self.upBlackFindChannelGroups = function () {
        self.findBlackChannelGroupsUpdate();
    }



}])

    App.filter("priorityFilter", function () {
        return function (val) {
            var res = "";
            switch (val) {
                case 0:
                    res = "正常"
                    break;
                case 1:
                    res = "置顶"
                    break;
            }
            return res;
        }
    })
