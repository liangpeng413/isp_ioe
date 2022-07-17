'use strict';

var App = angular.module('splashApp', [], angular.noop);
App.controller('splashController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};
    self.search.showType='';
    self.add={};
    self.updateScene={};
    self.continuationTypeInfo="";
    $scope.loginName = globalConfig.loginName;
    self.editpositions='';
    self.isUpdateRoster = 'N';
    
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


    //添加Banner上传图片
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {

        $('#addPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpeg|png|txt)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                console.log(e);
                var fileUrl = data.result.resp;
                $('#fileUrl').prop("value",fileUrl);
                $('#image_prew').prop("src",fileUrl);
                $('#fileUrl1').prop("value",fileUrl);
                $('#image_prew1').prop("src",fileUrl);
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

        //图片2x上传
        $('#addPictureTwo').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrlTwo').prop("value",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //图片3x上传
        $('#addPictureThree').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrlThree').prop("value",fileUrl);
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

        $('#editPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl1').prop("value",fileUrl);
                $('.aaaaST').prop("value",fileUrl);
                $('#image_prew1').prop("src",fileUrl);
                $('#fileUrl2').prop("value",fileUrl);
                $('#image_prew2').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });
        $('#editPicture2').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl10').prop("value",fileUrl);

                $('#image_prew10').prop("src",fileUrl);
                self.updateScene.imageUrl = $('#fileUrl10').val();
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //图片2x修改上传
        $('#editPictureTwo').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#editFileUrlTwo').prop("value",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //图片3x修改上传
        $('#editPictureThree').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#editFileUrlThree').prop("value",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //添加普通状态地址
        $('#addUsualStatusPic').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl3').prop("value",fileUrl);
                $('#image_prew3').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //添加提醒状态地址
        $('#addRemindStatusPic').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl4').prop("value",fileUrl);
                $('#image_prew4').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //添加矮视频封面
        $('#addShortPic').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl5').prop("value",fileUrl);
                $('#image_prew5').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });



        //修改普通状态地址
        $('#editUsualStatusPic').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl6').prop("value",fileUrl);
                $('#image_prew6').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //修改提醒状态地址
        $('#editRemindStatusPic').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl7').prop("value",fileUrl);
                $('#image_prew7').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        //修改矮视频封面
        $('#editShortPic').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl8').prop("value",fileUrl);
                $('#image_prew8').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });

        /**
         * 添加视频
         */
         $('#addVideo').fileupload({
                autoUpload: true,//是否自动上传
                url: url,//上传地址
                dataType: 'json',
                acceptFileTypes: /(\.|\/)(mp4|avi|mov|mkv|wmv|m4v|mpeg|ogv|3gp|flv|f4v|swf)$/i,
                maxFileSize: 1024 * 1024 * 20,
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
         /**
          * 修改视频
          */
         $('#editVideo').fileupload({
             autoUpload: true,//是否自动上传
             url: url,//上传地址
             dataType: 'json',
             acceptFileTypes: /(\.|\/)(mp4|avi|mov|mkv|wmv|m4v|mpeg|ogv|3gp|flv|f4v|swf)$/i,
             maxFileSize: 1024 * 1024 * 20,
             messages: {
                 maxFileSize: '视频文件的最大支持上传 20MB',
                 acceptFileTypes: '此文件是不支持的视频格式'
             },
             done: function (e, data) {//设置文件上传完毕事件的回调函数
                 console.log(data.result);
                 var videoUrl = data.result.resp;
                 $('#videoUrl1').prop("value",videoUrl);
                 $('#video_prew1').prop("src",videoUrl);
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
         
    });
    //Banner查询
    self.querySplashConfigList = function(pageNum){
    		if(!pageNum){
            self.search.pageNo = self.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                self.search.pageNo=self.search.pageCount;
            }else{
                self.search.pageNo = pageNum;
            }
        }
        if(self.search.pageNo==0){
            self.search.pageNo=  1;
        }
    		self.search.onTime = $("#searchonTime").val();
            self.search.onTime = $("#searchonTime").val();
        var url = globalConfig.basePath+"/appConfig/banner/queryBannerConfigList";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                		if(data.data.resp.currentPage)
                			self.search.pageNo = data.data.resp.currentPage;
                		else
                			self.search.pageNo =1;
                    self.search.pageSize = data.data.resp.pageSize+"";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.splashConfigList = data.data.resp.result;

                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    $scope.selctPageOne =function(){
        if(self.add.redirectType=='3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }

    }
    $scope.selctPageOne2 =function(){
        if(self.u_redirectType=='3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList2 = data.resp.result;
            })
        }

    }
    //添加banner 根据一级页面查询二级页面
    $scope.selectPageOneByRDict = function(v){
        var type = "wk_protogenesis_page_two";
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.rPositionDictList = data.resp.result;
            if($scope.rPositionDictList.length=='1'){
                $scope.add.pageTwo=data.resp.result[0].value;
            }else{
                $scope.add.pageTwo=data.resp.result[0].value;
            }
        })

    }

    //修改banner 根据一级页面查询二级页面
    $scope.selectPageOneByRDict2 = function(v){
        var type = "wk_protogenesis_page_two";
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.rPositionDictList2 = data.resp.result;
            if($scope.rPositionDictList2.length=='1'){
                $scope.updateScene.pageTwo=data.resp.result[0].value;
            }else{
                $scope.updateScene.pageTwo=data.resp.result[0].value;
            }
        })

    }

    //添加banner 根据一级场景查询二级场景
    $scope.selectSceneOneByRDict = function(v){
        var type;
        if(self.add.positions == "40"){
            type = "wk_loan_scenario_two";
        }
        if(self.add.positions == "41"){
              type = "wk_continue_invest_scenario_two";
        }

        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.sceneTwoDictList = data.resp.result;
            if($scope.sceneTwoDictList.length=='1'){
                self.add.sceneTwo=data.resp.result[0].value;
            }else{
                self.add.sceneTwo=data.resp.result[0].value;
            }
        })

    }

    //修改banner 根据一级场景查询二级场景
    $scope.selectSceneOneByRDict2 = function(v){
        var type;
        if(self.updateScene.positions == "40"){
            type = "wk_loan_scenario_two";
        }
        if(self.updateScene.positions == "41"){
            type = "wk_continue_invest_scenario_two";
        }
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.sceneTwoDictList2 = data.resp.result;
            if($scope.sceneTwoDictList2.length=='1'){
                self.updateScene.sceneTwo=data.resp.result[0].value;
            }else{
                self.updateScene.sceneTwo=data.resp.result[0].value;
            }
        })

    }

    //重置
    self.reset = function(){
        // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.status="";//上线状态
        self.search.productVersion="";//产品版本
        self.search.valid="";//是否生效
        self.search.positions="";//Banner位置
        self.search.desce="";
        self.search.auditStatus = '';
        self.search.showType='';
        self.search.desc='';
       // $("#searchDesc").val("");
        $("#searchonTime").val("");
        self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
        self.getTypeVersionListRest(0,"",1);
    }

    //按渠道类型获取版本列表
    self.getTypeVersionListRest = function(productChannel,versions,loginStatus){
        self.search.productChannel=productChannel+"";
        var parentid	;
        parentid=$('#addproductChannel').val();
        if(parentid)
            parentid=productChannel;
        if(!versions)
            versions="";
        if(!loginStatus)
            loginStatus=1;
        var type ;//= getType(productChannel,'banner');
        if(productChannel==0){
            type = 'sys_product_version_wk_banner';
        }else if(productChannel==2){
            type = 'sys_product_version_wx_banner';
        }else if(productChannel==1){
            type = 'sys_product_version_qb_banner';
        }else if(productChannel==3){
            type = 'sys_product_version_hyplus_banner';
        }else if(productChannel==4){
            type = 'sys_product_version_applet_banner';
        }else if(productChannel==5){
            type = 'sys_product_version_qb_m_banner';
        } else if (productChannel == 6) {
            type = 'sys_product_version_shop_banner';
        }
        var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_banner_position&versiontype="+type+"&parentid="+parentid+"&type=sys_banner&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //	if(data.data.resp.result[0].Version.length>0)
            self.typeVersionList = data.data.resp.result[0].Version;
            //self.search.productVersion = self.typeVersionList[0].label;
            //self.search.loginStatus='1';
            self.search.loginStatus='';
            // self.searchPostionCheck();
            if(data.data.resp.result[0].Position.length>0){
                self.positionsList = data.data.resp.result[0].Position;
                self.search.position=self.positionsList[0].value;
            }else{
                self.positionsList = [];
                self.search.position='';
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };


    //添加Banner
    self.addScreen = function(){
        self.add={};
        $('#addShow').show();
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        $('#all').prop("checked",true);
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
        $('#selectaddblackId').attr('disabled','disabled');//下拉名单
        $("#selectaddwhiteId").val("");
        $("#selectaddblackId").val("");

        self.add.productChannel = "0";
        self.add.loginStatus='';
        self.jumpTypeAddress = '';
        $("#selectaddwhiteId").val("");  
        $("#selectaddblackId").val("");
        self.add.valid = "1";
        self.getAddTypeVersionList(0);
        self.add.positions="";
        self.queryWhiteAndBlack();
        self.add.type="1";
        self.typeShow=false;
        self.videoShow=false;	
        self.showPicer=true;
        self.add.usualStatusUrl="";
        self.add.remindStatusUrl="";
        self.add.shortVideoUrl="";
        //self.addinit();//初始化add页面
       // $('#addShow').show();
        //金融属性开关
        self.add.financialStyle = 'Y';
        //前置鉴权
        self.add.preAuth = '0';
        //黑白名单显示
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
    }

    //添加按渠道类型获取版本列表
    self.getAddTypeVersionList = function(param){
        var parentid	;
        parentid=$('#addproductChannel').val();
        if(parentid)
            parentid=param;
        var type ;//= getType(productChannel,'banner');
        if(param != '0'){
            self.borrowing_investment_type = false;
        }
        if(param==0){
            type = 'sys_product_version_wk_banner';
        }else if(param==2){
            type = 'sys_product_version_wx_banner';
        }else if(param==1){
            type = 'sys_product_version_qb_banner';
        }else if(param==3){
            type = 'sys_product_version_hyplus_banner';
        }else if(param==4){
            type = 'sys_product_version_applet_banner';
        }else if(param==5){
            type = 'sys_product_version_qb_m_banner';
        } else if (param == 6) {
            type = 'sys_product_version_shop_banner';
        }
        var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_banner_position&versiontype="+type+"&parentid="+parentid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //	if(data.data.resp.result[0].Version.length>0)
            self.addTypeVersionList = data.data.resp.result[0].Version;
            //		if(data.data.resp.result[0].Position.length>0)
            //self.addPositionsList = data.data.resp.result[0].Position;
            var obj = new Object();
            var list = new Array();
            obj.value = "";
            obj.label ="请选择";
            list[0]=obj;
            self.addPositionsList =list;

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });

        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
    }


        // 选择版本
        self.isH5=0;
        self.addversionCheckbox=function(){
            if(self.add.productChannel==6){
                var versions;
                $('.versionCheckbox').each(function () {
                    if (this.checked == true) {
                        versions = $(this).val();
                    }
                });
                if(versions=='h5'){
                    self.isH5 = 1;
                }else{
                    self.isH5 = 0;
                }
                $('.addBannerCheck').each(function () {
                    $(this).prop("checked",false);
                });
                self.checkType=0;
                self.checkTypeH5=0;
            }

            self.addPostionCheck();
        }

        // 选择版本
        self.editversionCheckbox=function(){
                if(self.updateScene.productChannel==6){
                    var versions;
                    $('.updateVersionCheckbox').each(function () {
                        if (this.checked == true) {
                            versions = $(this).val();
                        }
                    });
                    self.updateScene.productVersion=versions;
                    $('.updateCheckALL').each(function () {
                        $(this).prop("checked",false);
                    });
                    self.upCheckType = 0;
                    self.upCheckTypeH5=0;
                }
        		self.editPostionCheck();
        }
        
        // 登陆选择
        self.addLoginStatus = function(param){
        		if(param==''){
        			alert("非法操作!");
        			return false;
        		}
        		if(param=='0' || param=='2'){
        			$("#all").attr('disabled','disabled');
        			$('#all').prop("checked",true);
        			$("#white").attr('disabled','disabled');
        			$('#white').prop("checked",false);
    	            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
    	            $("#selectaddwhiteId").val("");  
    	            $("#black").attr('disabled','disabled');
    	            $('#black').prop("checked",false);
    	            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
    	            $("#selectaddblackId").val(""); 
    	            
        		}else{
        			$("#all").removeAttr("disabled");  
    	 			if($('#all').is(':checked')){
    	 	            $("#editwhite").attr('disabled','disabled');
    	 	            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
    	 	            $("#editselectaddwhiteId").val("0");  
    	 	            $("#editblack").attr('disabled','disabled');
    	 	            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
    	 	            $("#editselectaddblackId").val("0");  
    	 	        }else{
	        			//$("#all").removeAttr("disabled");  
	        			$('#all').prop("checked",true);
	        			$("#white").removeAttr('disabled','disabled');
	    	            $("#selectaddwhiteId").removeAttr("disabled");  
	    	            $("#black").removeAttr('disabled','disabled');
	    	            $("#selectaddblackId").removeAttr("disabled"); 
    	 	        }
        			
        		}

            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();

       	 	self.addPostionCheck();
        }
        
        // 登陆选择
        self.editLoginStatus = function(param){
        		if(param==''){
        			alert("非法操作!");
        			return false;
        		}
        		if(param=='0' || param=='2'){
        			$("#editall").attr('disabled','disabled');
        			$('#editall').prop("checked",true);
        			$("#editwhite").attr('disabled','disabled');
        			$('#editwhite').prop("checked",false);
    	            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
    	            $("#selectaddwhiteId").val("");  
    	            $("#editblack").attr('disabled','disabled');
    	            $('#editblack').prop("checked",false);
    	            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
    	            $("#selectaddblackId").val(""); 
    	            
        		}else{
        			$("#editall").removeAttr("disabled");  
    	 			if($('#editall').is(':checked')){
    	 	            $("#editwhite").attr('disabled','disabled');
    	 	            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
    	 	            // $("#editselectaddwhiteId").val("0");
    	 	            $("#editblack").attr('disabled','disabled');
    	 	            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
    	 	            // $("#editselectaddblackId").val("0");
    	 	        }else{
	        			//$("#editall").removeAttr("disabled");  
	        			$('#editall').prop("checked",true);
	        			$("#editwhite").removeAttr('disabled','disabled');
	    	            $("#selectaddwhiteId").removeAttr("disabled");  
	    	            $("#editblack").removeAttr('disabled','disabled');
	    	            $("#editselectaddblackId").removeAttr("disabled"); 
    	 	        }
        			
        		}

            //黑白名单操作
            self.updateScene.whiteMemberListName= "NO_RULE"
            self.updateScene.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();


            self.updateScene.blackMemberListName= "NO_RULE"
            self.updateScene.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();

       	 	self.editPostionCheck();
        }
        
        self.checkVersion="";
        // 登陆选择
        self.addPostionCheck = function(){
        		var addproductChannel = $("#addproductChannel").val();//渠道
        	  	var versions = "";// 版本
              $('.versionCheckbox').each(function() {
                  if (this.checked == true) {
                      versions = $(this).val() ;
                  }
              });
              self.checkVersion=versions;
              self.checkVersion=self.checkVersion.split(",")[0];
              if(!versions){
                  //alert("请选择产品版本");
                  $("#addLoginStatus0").prop("checked",false);
      	  		$("#addLoginStatus1").prop("checked",false);
                  return;
              }
              // 登陆状态
             // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
              var addLoginStatus =self.add.loginStatus;
              if(!addLoginStatus){
                  //alert("请选择弹登陆状态");
                  return;
              }
              //var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
              var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
              
              $http({
                  method: 'GET',
                  url: url,
              }).then(function successCallback(data) {
            	  			if(data.data.resp.result.length==0){
            	  				//self.addPositionsList = data.data.resp.result;
            	  				var obj = new Object();
            	  				var list = new Array();
            	  				obj.value = "0";
            	  				obj.label ="请选择";
            	  				list[0]=obj;
            	  				self.addPositionsList =list;
            	  				self.editPositionsList =list;
            	  			}else{
            	  				self.addPositionsList = data.data.resp.result;
            	  				self.editPositionsList = data.data.resp.result;
            	  				self.add.positions ="";
            	  				//self.add.positions ="";
            	  				//updateScene.productVersion
            	  			}
            	  				
              }, function errorCallback(response) {
                  // 请求失败执行代码
                  alert("获取弹窗位置失败了....");
              });
        }

    //确认添加Banner
    self.commitScreen = function() {
        if (self.add.productChannel == null) {
            alert("渠道不能为空");
            return;
        }
        var versions = "";
        $('.versionCheckbox').each(function () {
            if (this.checked == true) {
                versions = $(this).val() ;
            }
        });
        if (versions == null || versions == "") {
            alert("产品版本不能为空");
            return;
        } else {
            self.add.productVersion = versions;
        }

        if(self.add.productChannel==6){
            // 投放客户端
            var preList="";
            if(self.add.productVersion=='h5'){
                $('.preCheckboxH5').each(function () {
                    if (this.checked == true) {
                        preList += $(this).val() + ",";
                    }
                });
            }else{

                $('.preCheckbox').each(function () {
                    if (this.checked == true) {
                        preList += $(this).val() + ",";
                    }
                });

            }
            if (preList == null || preList == "") {
                alert("投放客户端不能为空");
                return;
            } else {
                self.add.putAddress = preList.slice(0,preList.length-1);
            }
        }

        var label = $("#addpositions").find("option:selected").text();  //获取Select选择的Text
        if (label == "请选择") {
            alert("对应的版本和登陆状态下banner位置不存在，请重新选择");
            return;
        } else if (label == "") {
            alert("请选择版本状态");
            return;
        }



        // 登陆状态
        // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
        var addLoginStatus = self.add.loginStatus;
        if (!addLoginStatus) {
            alert("请选择banner登陆状态");
            return;
        }
        self.add.loginStatus = addLoginStatus;

        if (!self.add.positions) {
            alert("Banner位置不能为空");
            return;
        }
        var addpositionsText = $("#addpositions").find("option:selected").text();
        if (!addpositionsText) {
            alert("Banner位置不能为空");
            return;
        }
        self.add.positionName = addpositionsText;
        self.add.type = $("#type").val();
        if ($("#type").val() == "2") {
            self.add.imageUrl = $('#fileUrl').val();
            self.add.videoUrl = $("#videoUrl").val();
        } else {
            self.add.imageUrl = $('#fileUrl').val();
        }

        self.add.remindStatusUrl = $("#fileUrl4").val();
        self.add.usualStatusUrl = $("#fileUrl3").val();
        self.add.imageUrlTwo = $("#fileUrlTwo").val();
        self.add.imageUrlThree = $("#fileUrlThree").val();
        self.add.imageUrl=$('#fileUrl').val()
        if (self.add.productChannel == 0 && self.add.positions==208) {
            if (!self.add.imageUrl) {
                alert("Banner图片不能为空");
                return;
            }
        }

        if ($("#type").val() == "2") {
            self.add.videourl = $("#videoUrl").val();
        } else {
            self.add.videourl = "";
        }

        if (self.add.positions == "40" && self.add.productChannel == '0') {
            if (self.add.sceneOne == null || self.add.sceneOne == "" || self.add.sceneOne == undefined) {
                alert("1级场景不能为空")
                return;
            }
            if (self.add.sceneTwo == null || self.add.sceneTwo == "" || self.add.sceneTwo == undefined) {
                alert("2级场景选项不能为空")
                return;
            }
        }
        if (self.add.positions == "41" && self.add.productChannel == '0') {
            if (self.add.sceneOne == null || self.add.sceneOne == "" || self.add.sceneOne == undefined) {
                alert("从选项不能为空")
                return;
            }
            if (self.add.sceneTwo == null || self.add.sceneTwo == "" || self.add.sceneTwo == undefined) {
                alert("续期至选项不能为空")
                return;
            }
        }
        if ((self.add.productChannel == '0' && self.add.positions!=206 && self.add.positions!=207 && self.add.positions != 215 && self.add.positions != 216 && self.add.positions != 217 && self.add.positions != 218 && self.add.positions!=219 && self.add.positions != 3020 && self.add.positions != 212)|| (self.add.productChannel == '2' && self.add.positions != 2005)) {
            if (!self.add.redirectType && self.add.positions!=213) {
                alert("跳转类型不能为空")
                return;
            }
            if (self.add.redirectType == '2' && !self.jumpTypeAddress) {
                alert("跳转链接不能为空")
                return;
            }
            if (self.add.redirectType == '3' && !self.add.pageOne) {
                alert("页面类型不能为空")
                return;
            }
            if (self.add.redirectType == '3' && !self.add.pageTwo) {
                alert("跳转页面不能为空")
                return;
            }

        }
        if (self.add.positions == 212 && self.add.productChannel == 0 && self.add.type == 1 && !self.add.redirectType){
            alert("跳转类型不能为空!");
            return;
        }

        if ((self.add.productChannel == '0' && self.add.positions=='14')||(self.add.productChannel == '2' && self.add.positions=='14')) {
            if(!self.add.colorNum){
                alert("色号不能为空")
                return;
            }

        }

        if (self.add.productChannel == '1' && self.add.positions=='226') {
            if(self.add.imageUrlTwo==null||self.add.imageUrlTwo==''){
                alert("2x图片不能为空")
                return;
            }
            if(self.add.imageUrlThree==null||self.add.imageUrlThree==''){
                alert("3x图片不能为空")
                return;
            }
        }


        if (self.add.productChannel == '1' && self.add.positions=='229') {
            if(self.add.type==2 && (self.add.videourl==null||self.add.videourl=='' || self.add.imageUrl == null || self.add.imageUrl=="")){
                alert("视频或图片不能为空");
                return;
            }
            if(self.add.type==1 && (self.add.imageUrl==null||self.add.imageUrl=='')){
                alert("图片不能为空")
                return;
            }

            if(!self.jumpTypeAddress && self.add.type==1){
                alert("跳转链接不能空");
                return;
            }

        }
        if(!self.jumpTypeAddress && self.add.positions==10001){
            alert("跳转链接不能空");
            return;
        }


        self.add.onlineTime = $('#queryOnlineTime').val() + "";
        self.add.offlineTime = $('#queryOfflineTime').val() + "";
        if (!self.add.onlineTime || !self.add.offlineTime) {
            alert("上线时间下线时间不能为空");
            return;
        }

        if (self.add.offlineTime <= self.add.onlineTime) {
            alert("下线时间必须大于上线时间");
            return;
        }


        if(self.add.valid==null){
            alert("请选择是否生效");
            return;
        }


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
        var auditPerson = self.add.auditPerson;
        if (!self.add.auditPerson) {
            alert("审核人不能为空");
            return;
        } else {
            self.add.auditNo = self.add.auditPerson.no;
            self.add.requestAuditPersonEmail = self.add.auditPerson.email;
            self.add.auditPerson = self.add.auditPerson.name;
        }
        self.add.redirectUrl = self.jumpTypeAddress;
        if (self.add.productChannel == '6') {
            self.add.redirectUrl = encodeURI(self.add.redirectUrl);
        }
        var url = globalConfig.basePath + "/appConfig/banner/addBanner";
        $http.post(url, self.add).then(
            function (data) {
                console.log("---")
                console.log(data)
                alert(data.data.message);
                $(".upstatus").html("");
                $('#addShow').hide();
                self.add = {};
                $('.addBannerCheck').each(function () {
                    $(this).prop("checked",false);
                });
                self.checkType=0;
                self.checkTypeH5=0;
                //self.reset();
                //self.loading();
                self.querySplashConfigList(1);
            }, function (response) {
                alert("请求失败了....");
            }
        );
    }

    //查询黑白名单列表
    self.queryWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
                self.blackList_qb = data.data.resp.black_qb;
                self.blackList_wk = data.data.resp.black_wk;
                self.whiteList_qb = data.data.resp.white_qb;
                self.whiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    
    //查询黑白名单列表
    self.queryEditWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
                self.editblackList_qb = data.data.resp.black_qb;
                self.editblackList_wk = data.data.resp.black_wk;
                self.editwhiteList_qb = data.data.resp.white_qb;
                self.editwhiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    
    //按渠道类型获取版本列表
    self.getTypeVersionList = function(productChannel,versions,loginStatus){
        self.search.productChannel=productChannel+"";
        var parentid	;
        parentid=$('#addproductChannel').val();
        if(parentid)
            parentid=productChannel;
        if(!versions)
            versions="";
        if(!loginStatus)
            loginStatus=1;
        var type ;//= getType(productChannel,'banner');
        if(productChannel==0){
            type = 'sys_product_version_wk_banner';
        }else if(productChannel==2){
            type = 'sys_product_version_wx_banner';
        }else if(productChannel==1){
            type = 'sys_product_version_qb_banner';
        }else if(productChannel==3){
            type = 'sys_product_version_hyplus_banner';
        }else if(productChannel==4){
            type = 'sys_product_version_applet_banner';
        }else if(productChannel==5){
            type = 'sys_product_version_qb_m_banner';
        } else if (productChannel == 6) {
            type = 'sys_product_version_shop_banner';
        }
        var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_banner_position&versiontype="+type+"&parentid="+parentid+"&type=sys_banner&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //	if(data.data.resp.result[0].Version.length>0)
            self.typeVersionList = data.data.resp.result[0].Version;
            //self.search.productVersion = self.typeVersionList[0].label;
            //self.search.loginStatus='1';
            self.search.loginStatus='';
            // self.searchPostionCheck();
            if(data.data.resp.result[0].Position.length>0){
                self.positionsList = data.data.resp.result[0].Position;
                self.search.position=self.positionsList[0].value;
            }else{
                self.positionsList = [];
                self.search.position='';
            }
            self.loading();

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };

    //按渠道类型获取版本列表
    self.getEditTypeVersion = function(productChannel,versions,loginStatus){
        self.search.productChannel=productChannel+"";
        var parentid	;
        parentid=$('#addproductChannel').val();
        if(parentid)
            parentid=productChannel;
        if(!versions)
            versions="";
       /* if(loginStatus==null ||loginStatus==""){
            loginStatus=1;
        }*/
        var type ;//= getType(productChannel,'banner');
        if(productChannel==0){
            type = 'sys_product_version_wk_banner';
        }else if(productChannel==2){
            type = 'sys_product_version_wx_banner';
        }else if(productChannel==1){
            type = 'sys_product_version_qb_banner';
        }else if(productChannel==3){
            type = 'sys_product_version_hyplus_banner';
        }else if(productChannel==4){
            type = 'sys_product_version_applet_banner';
        }else if(productChannel==5){
            type = 'sys_product_version_qb_m_banner';
        } else if (productChannel == 6) {
            type = 'sys_product_version_shop_banner';
        }
        var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_banner_position&versiontype="+type+"&parentid="+parentid+"&type=sys_banner&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //	if(data.data.resp.result[0].Version.length>0)
            self.typeVersionList = data.data.resp.result[0].Version;
            if(data.data.resp.result[0].Position.length>0){
                self.positionsList = data.data.resp.result[0].Position;
            }else{
                self.positionsList = [];
            }
            self.updateScene.positions =self.editpositions;

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };

    //获取一二级场景下拉框
    self.getSceneAndPageListByParam = function(positions,sceneOne,sceneTwo,redirectType,pageOne,pageTwo){
        //场景
        var type=positions=="40"?"wk_loan_scenario_one":"wk_continue_invest_scenario_one";
        $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
        ).success(function(data) {
            $scope.sceneOneDictList2 = data.resp.result;
        })
        var typeTwo;
        if(positions == "40"){
            typeTwo = "wk_loan_scenario_two";
        }
        if(positions == "41"){
            typeTwo = "wk_continue_invest_scenario_two";
        }
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+typeTwo+"&value="+sceneOne
        ).success(function(data) {
            $scope.sceneTwoDictList2 = data.resp.result;
            if ($scope.sceneTwoDictList2.length == '1') {
                self.updateScene.sceneTwo = data.resp.result[0].value;
            } else {
                self.updateScene.sceneTwo = data.resp.result[0].value;

            }
            self.updateScene.sceneTwo = sceneTwo;
        })


    }

    //获取一二原生页面下拉框
    self.loadPageData = function(redirectType,pageOne,pageTwo){
        //页面
        if(redirectType=='3'){
            var type="wk_protogenesis_page_one"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList2 = data.resp.result;
            })
        }

        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type=wk_protogenesis_page_two&value="+pageOne
        ).success(function(data) {
            $scope.rPositionDictList2 = data.resp.result;
            if ($scope.rPositionDictList2.length == '1') {
                self.updateScene.pageTwo = data.resp.result[0].value;
            } else {
                self.updateScene.pageTwo = data.resp.result[0].value;

            }
            self.updateScene.pageTwo = pageTwo;
        })
    }
        
        // 登陆选择
        self.searchPostionCheck = function(){
        		var addproductChannel = $("#searchproductChannel").val();//渠道
        	  	var versions =  $("#searchproductVersion").val();//渠道;// 版本
//	         if(!versions){
//	            alert("请选择产品版本");
//	            return;
//	          }
//              // 登陆状态
              var addLoginStatus = $("#searchLoginStatus").val();//获取选中项的值
              if(addLoginStatus==null || addLoginStatus==""){
            	  //默认全部
            	  addLoginStatus="2";
              }
//              if(addLoginStatus==null){
//                  alert("请选择弹登陆状态");
//                  return;
//              }
              var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
              $http({
                  method: 'GET',
                  url: url,
              }).then(function successCallback(data) {
            	  			if(data.data.resp.result.length==0){
            	  				//self.addPositionsList = data.data.resp.result;
            	  				var obj = new Object();
            	  				var list = new Array();
//            	  				obj.value = "";
//            	  				obj.label ="请选择";
//            	  				list[0]=obj;
            	  				self.positionsList =[];
            	  				self.search.position='';
            	  			}else{
            	  				self.positionsList = data.data.resp.result;
            	  				self.search.position=self.positionsList[0].value;
            	  			}
            	  				
              }, function errorCallback(response) {
                  // 请求失败执行代码
                  alert("获取公告位置失败了....");
              });
        }    
     
    


    //查看
    self.check = function(id){
        $('#showCheck').show();
        var url = globalConfig.basePath+"/appConfig/banner/selectByPrimaryKey?id="+id;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            self.openScreen = data.data.resp;
            if (self.openScreen.productChannel == '6') {
                self.openScreen.redirectUrl = decodeURI(self.openScreen.redirectUrl);
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    }

    //查看确定和取消
    self.checkOKAndNO = function () {
        $('#showCheck').hide();
    }

    
   	self.isSelected = function(id){
   		if(self.continuationTypeInfo){
   			var versions =self.continuationTypeInfo.split(",");
   	   		for(var i=0;i<versions.length;i++){
   	   			if(id.length==versions[i].length && versions[i].indexOf(id)>=0){
   	   	   			return true;
   	   	   		}
   	   		}
   		}
   		return false;
 	 } 
 // *****************************************
 // 登陆选择
    self.editPostionCheck = function(editproductChannel,versions,editLoginStatus){
    		if(!editproductChannel){
    			if(editproductChannel!=0){
    				editproductChannel = $("#editproductChannel").val();//渠道
    			}
    		}
    		
    		if(!versions){
    			versions = "";// 版本
    	          $('.updateVersionCheckbox').each(function() {
    	              if (this.checked == true) {
    	                  versions += $(this).val() + ",";
    	              }
    	          });
    		}
    	  	
    		self.updateCheckVersion=versions.split(",")[0];
          if(!versions){
              //alert("请选择产品版本");
             // $("#addLoginStatus0").prop("checked",false);
  	  		//$("#addLoginStatus1").prop("checked",false);
              return;
          }
          // 登陆状态
         // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
          if(!editLoginStatus){
	        	  if(editLoginStatus!=0){
	        			editLoginStatus =self.updateScene.loginStatus;
	  			}
        	  
          }
          
          if(editLoginStatus==null){
              //alert("请选择弹登陆状态");
              return;
          }
          //var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
          var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion="+versions+"&productChannel="+editproductChannel+"&loginStatus="+editLoginStatus;
          
          $http({
              method: 'GET',
              url: url,
          }).then(function successCallback(data) {
        	  			if(data.data.resp.result.length==0){
        	  				//self.addPositionsList = data.data.resp.result;
        	  				var obj = new Object();
        	  				var list = new Array();
        	  				obj.value = "";
        	  				obj.label ="请选择";
        	  				list[0]=obj;
        	  				//self.addPositionsList =list;
        	  				self.editPositionsList =list;
        	  			}else{
        	  				//self.addPositionsList = data.data.resp.result;
        	  				self.editPositionsList = data.data.resp.result;
        	  				//self.updateScene.positions = data.data.resp.result[0].value;
        	  				//updateScene.productVersion
        	  			}
        	  				
          }, function errorCallback(response) {
              // 请求失败执行代码
              alert("获取弹窗位置失败了....");
          });
    }

    self.queryEditWhiteAndBlack();
    //修改回显
    self.updateCheckVersion="";
    self.update = function(query){
        self.isUpdateRoster = 'N';
        self.updateCheckVersion= query.productVersion
        console.log(query.positions)
        self.videoShow=false;
        self.typeShow=false;
        $('#upPicture').show();
        $('#upVideo').show();
        // console.log(query.auditStatus+'aa')
        if(query.auditStatus == '1'){
            $("#sceneDisableId1").attr("disabled","disabled");
            $("#sceneDisableId2").attr("disabled","disabled");
            $("#editpositions").attr("disabled","disabled");
        }else{
            $("#sceneDisableId1").attr("disabled",false);
            $("#sceneDisableId2").attr("disabled",false);
            $("#editpositions").attr("disabled",false);
        }
        self.editPostionCheck(query.productChannel,query.productVersion,query.loginStatus);// 获取位置
        self.getEditTypeVersion(query.productChannel,query.productVersion,query.loginStatus);//刷线产品列表
        if((query.productChannel=='0' || query.productChannel=='2') && (query.positions=="40" || query.positions=="41")){
            self.borrowing_investment_type2 = true;
        }else{
            self.borrowing_investment_type2 = false;
        }
        //获取一二级场景下拉框
        if(query.productChannel == 0 && (query.positions=="40" || query.positions=="41")){
            self.getSceneAndPageListByParam(query.positions,query.sceneOne,query.sceneTwo,query.redirectType,query.pageOne,query.pageTwo);
            self.uSceneOne = query.sceneOne;
        }
        //获取原生页面下拉框
        if(query.redirectType == '3'){
            self.loadPageData(query.redirectType,query.pageOne,query.pageTwo);
        }
        if(query.productChannel == 1 && query.positions=="226" ){
            $scope.updateScene.imageUrlTwo = query.imageUrlTwo;
            $scope.updateScene.imageUrlThree = query.imageUrlThree;
        }
        self.u_redirectType = query.redirectType+'';
        self.continuationTypeInfo="";
        self.continuationTypeInfo=query.productVersion;
        if(query.positions=="0" || query.positions=="14"
            || query.positions=="231"|| query.positions=="212"
            ||(query.positions=="229" && query.productChannel == 1) || (query.positions=="2001" && query.productChannel == 2) || (query.positions=="2002" && query.productChannel == 2) || (query.positions=="2001" && query.productChannel == 2) || (query.positions=="2003" && query.productChannel == 2)
        || (query.positions == 215 && query.productChannel == 0) || (query.positions == 216 && query.productChannel == 0) || (query.positions == 217 && query.productChannel == 0) || (query.positions == 218 && query.productChannel == 0) || (query.positions == 219 && query.productChannel == 0) || (query.positions == 236 && query.productChannel == 1) || (query.positions == 237 && query.productChannel == 1) || (query.positions == 238 && query.productChannel == 1) || (query.positions == 239 && query.productChannel == 1) || (query.positions == 240 && query.productChannel == 1)){
            self.typeShow=true;
        }
        if(query.type=="2"){
            if (query.positions == 238 || query.positions == 217){
                $('#upPicture').hide();
            }
            self.videoShow=true;
            self.showPicer=false;
            self.imageUrl=query.imageUrl;
            self.videourl=query.videourl;
        }else{
            if (query.positions == 239 || query.positions == 237 || query.positions == 216 || query.positions == 240){
                $('#upVideo').hide();
            }
            self.videoShow=false;
            self.showPicer=true;
            self.imageUrl=query.imageUrl;
        }
        $('#showUpdate').show();
        self.updateScene={};
        query.productChannel=query.productChannel+"";
        query.loginStatus = query.loginStatus+"";
        query.positions = query.positions+"";
        self.editpositions="";
        self.editpositions = query.positions;
        if(query.putAddress != null && query.putAddress != '0'){
            if(query.productVersion=='h5'){
                $('.upPreCheckboxH5').each(function () {
                    var thisValue = $(this).val();
                    if(query.putAddress.indexOf(thisValue)!=-1){
                        $(this).prop("checked",true);
                    }
                })
            }else{
                $('.upPreCheckbox').each(function () {
                    var thisValue = $(this).val();
                    if(query.putAddress.indexOf(thisValue)!=-1){
                        $(this).prop("checked",true);
                    }
                })
            }
        }
        //self.updateScene={};
        query.auditPerson="";
        query.type= query.type+"";
        $("#editselectaddwhiteId").val("");
        $("#editselectaddblackId").val("");
        $('#editall').prop("checked",false);//默认全部不选择
        $("#editwhite").attr("checked",false);
        $("#editblack").attr("checked",false);
        var sequenceId = query.sequenceId;
        $("#editall").removeAttr("disabled");
        if(query.loginStatus=='0'  || query.loginStatus=='2'){
            $("#editall").attr('disabled','disabled');
            $('#editall').prop("checked",true);

        }

	    query.valid = query.valid+"";
	    query.whiteId = query.whiteId+"";
	    query.blackId = query.blackId+"";

	    
	    //self.updateScene = query;
	    self.updateScene=angular.copy(query);
        if (self.updateScene.productChannel == '6') {
            self.updateScene.redirectUrl = decodeURI(self.updateScene.redirectUrl);
        }
	    if(query.showType==0){
				$('#editall').prop("checked",true);
	        $('#editwhite').prop("checked",false);
	        $('#editblack').prop("checked",false);
	        $("#editwhite").attr('disabled','disabled');
	        $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	        $("#editselectaddwhiteId").val("0");
	        $("#editblack").attr('disabled','disabled');
	        $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	        $("#editselectaddblackId").val("0");

            self.strategyReloadUpdate();
            setTimeout(function () {
            self.updateScene.whiteMemberListName=query.whiteMemberListName;
            self.updateScene.whiteId = null;
            $('#userNameLikeSearchUpdate').hide();
            },300)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
            self.updateScene.blackMemberListName=query.blackMemberListName;
            self.updateScene.blackId = null;
            $('#userNameLikeBlackSearchUpdate').hide();
            },300)

	    	 }else if(query.showType==1){
	    		 $('#editwhite').prop("checked",true);
	             $('#editblack').prop("checked",false);
	             $('#editall').prop("checked",false);
                $("#editwhite").removeAttr("disabled");
                $("#editblack").removeAttr("disabled");

                //修改名单那类型查询
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.whiteMemberListName=query.whiteMemberListName;
                    self.updateScene.whiteId = query.whiteId;
                },300)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },300)
	    	 }else if(query.showType==2){
	    		 $('#editblack').prop("checked",true);
	             $('#editwhite').prop("checked",false);
	             $('#editall').prop("checked",false);
                $("#editwhite").removeAttr("disabled");
                $("#editblack").removeAttr("disabled");

                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.whiteMemberListName=query.whiteMemberListName;
                    self.updateScene.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },300)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = query.blackId;
                },300)
	    	 }else if(query.showType==3){
	    		 $('#editblack').prop("checked",true);
                 $('#editwhite').prop("checked",true);
                 $('#editall').prop("checked",false);
                $("#editwhite").removeAttr("disabled");
                $("#editblack").removeAttr("disabled");
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.whiteMemberListName=query.whiteMemberListName;
                    self.updateScene.whiteId = query.whiteId
                },300)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = query.blackId;
                },300)

            }

        //修改禁用名单
        $("#editall").attr('disabled','disabled');
        $("#editwhite").attr("disabled",'disabled');
        $("#editblack").attr("disabled",'disabled');
        //展示黑白名单数量
        if($scope.updateScene.whiteId != null && $scope.updateScene.whiteId != ''
            && $scope.updateScene.whiteId != undefined && $scope.updateScene.whiteId != 0){
            $scope.findChannelGroupCount($scope.updateScene.productChannel,$scope.updateScene.whiteId);
        }
        if($scope.updateScene.blackId != null && $scope.updateScene.blackId != ''
            && $scope.updateScene.blackId != undefined && $scope.updateScene.blackId != 0){
            $scope.findBlackChannelGroupCount($scope.updateScene.productChannel,$scope.updateScene.blackId);
        }
}
   	
    
    
    self.update_older = function(query){
    		self.continuationTypeInfo="";
    		self.continuationTypeInfo=query.productVersion;
    		$('#showUpdate').show();
	 	self.updateScene={};
	 	query.productChannel=query.productChannel+"";
	 	query.loginStatus = query.loginStatus+"";
	 	query.positions = query.positions+"";
	 	self.updateScene=angular.copy(query);
	 	$("#editselectaddwhiteId").val(""); 
	 	$("#editselectaddblackId").val("");  
	 	$('#editall').prop("checked",false);//默认全部不选择
	 	$("#editwhite").attr("checked",false);
		$("#editblack").attr("checked",false);
		//$("#editproductChannel").val(query.productChannel);
		var sequenceId = query.sequenceId;
		$("#editall").removeAttr("disabled");  
		if(query.loginStatus=='0'){
			$("#editall").attr('disabled','disabled');
 			$('#editall').prop("checked",true);
			
		}
		//var url = globalConfig.basePath+"/appConfig/banner/getVersionAndPosition?sequenceIde="+sequenceId;
/***	    var url = globalConfig.basePath+"/appConfig/banner/getVersionAndPosition?sequenceId="+sequenceId;
		$.ajax({
			   type: "GET",
			   dataType: 'json',
			   async:false,
			   url: url ,
			   success: function(data){
				   console.log(data);
//				   if(data.resp.result[0].Version.length>0){
//	        			self.typeVersionList = data.resp.result[0].Version;
				   if(data.code='000'){
					   var productVersion='';
					   for(var i=0;i<data.resp.result.length;i++){
						   productVersion=productVersion+data.resp.result[0].productVersion+",";
					   }
					   self.updateScene.productVersion=productVersion;
				   }
			   }
			});**/
			//self.queryWhiteAndBlack();
			self.queryEditWhiteAndBlack();
	        query.valid = query.valid+"";
	        query.whiteId = query.whiteId+"";
	        query.blackId = query.blackId+"";
	        self.updateScene = query;
	        if(query.showType==0){
	    			$('#editall').prop("checked",true);
	            $('#editwhite').prop("checked",false);
	            $('#editblack').prop("checked",false);
	            $("#editwhite").attr('disabled','disabled');
	            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	            $("#editselectaddwhiteId").val("0");  
	            $("#editblack").attr('disabled','disabled');
	            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	            $("#editselectaddblackId").val("0");  
	            
		    	 }else if(query.showType==1){
		    		 $('#editwhite').prop("checked",true);
		             $('#editblack').prop("checked",false);
		             $('#editall').prop("checked",false);
		    	 }else if(query.showType==2){
		    		 $('#editblack').prop("checked",true);
		             $('#editwhite').prop("checked",false);
		             $('#editall').prop("checked",false); 
		    	 }else if(query.showType==3){
		    		 $('#editblack').prop("checked",true);
		         $('#editwhite').prop("checked",true);
		         $('#editall').prop("checked",false); 
		    	 }
    }
    
    
    
    //修改
    self.update_old = function(query){
    		$('#showUpdate').show();
    	 	self.updateScene={};
    	 	 $("#editselectaddwhiteId").val(""); 
    	 	 $("#editselectaddblackId").val("");  
    	 	$('#editall').prop("checked",false);//默认全部不选择
    	 	$("#editwhite").attr("checked",false);
    		$("#editblack").attr("checked",false);
    	    var aa=0;
        
        var	param =query.productChannel;
		var parentid	;
	    parentid=$('#editproductChannel').val();
	    if(parentid)
	    		parentid=query.productChannel;
	    var type;
	    if(param==0||param==2){
	        type = 'sys_product_version_wk';
	    }else{
	        type = 'sys_product_version_qb';
	    }
	    var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_banner_position&versiontype="+type+"&parentid="+parentid;
	    $http({
	        method: 'GET',
	        url: url,
	    }).then(function successCallback(data) {
    	        console.log(aa);
    	        if(aa==0){
	    	        	if(data.data.resp.result[0].Version.length>0){
	    	    			self.typeVersionList = data.data.resp.result[0].Version;
	    	    			//self.updateScene.productVersion = self.typeVersionList[0].label;
	    	    			
	    	    		}
    	        }
    	        if(data.data.resp.result[0].Position.length>0){
	    			self.editPositionsList = data.data.resp.result[0].Position;
	    			console.log(query);
	    		}
    		
    			
    }, function errorCallback(response) {
        // 请求失败执行代码
        alert("获取版本列表失败了....");
    });
     aa=2; 
        //self.getEditTypeVersionList(query);
        query.productChannel=query.productChannel+"";
        self.queryWhiteAndBlack();
        query.valid = query.valid+"";
        query.whiteId = query.whiteId+"";
        query.blackId = query.blackId+"";
        self.updateScene = query;
       
        var versions = query.productVersion.split(",");
        $('.updateVersionCheckbox').each(function(){
            var v= $(this).val();
            var a = 1;
            for (var i=0;i<versions.length;i++){
                if(v==versions[i]){
                    a = 0;
                }
            }
            if(a==0){
                $(this).attr("checked","checked");
            }
        })

        
        if(query.showType == 0){
            $('#editall').prop("checked",true);
            $('#editblack').prop("checked",false);
            $('#editblack').prop("checked",false);
            $('#editwhite').attr('disabled','disabled');
            $('#editblack').attr('disabled','disabled');
            $("#editwhite").val(""); 
            $("#editblack").val(""); 
        }else if(query.showType == 1){
        		$("#editwhite").removeAttr("disabled");  
        		$("#editblack").removeAttr("disabled");  
        	    $('#editall').prop("checked",false);
            $('#editwhite').prop("checked",true);
            $("#editblack").val(""); 
        }else if(query.showType == 2){
        	    $('#editall').prop("checked",false);
        	    $('#editblack').prop("checked",true);
            $("#editwhite").val(""); 
        }else if(query.showType == 3){
        		$("#editwhite").removeAttr("disabled");  
        		$("#editblack").removeAttr("disabled");  
        	 	$("#editwhite").removeAttr("disabled");  
        		$("#editblack").removeAttr("disabled");  
        	    $('#editall').prop("checked",false);
        	    $('#editwhite').prop("checked",true);
        	    $('#editblack').prop("checked",true);
        }
    }
    
    
    
    self.getEditTypeVersionList = function(param){
    		self.updateScene.positions = '0';
    		var parentid	;
        parentid=$('#editproductChannel').val();
        if(parentid)
        		parentid=param;
        var type;
        if(param==0||param==2){
            type = 'sys_product_version_wk';
        }else{
            type = 'sys_product_version_qb';
        }
        if(param != '0'){
            self.borrowing_investment_type2 = false;
        }
        var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_banner_position&versiontype="+type+"&parentid="+parentid;
        $.ajax({
			   type: "GET",
			   dataType: 'json',
			   async:false,
			  // data:{id:id},
			   //data:redJson,
			   url: url ,
			   success: function(data){
				   console.log(data);
				   if(data.resp.result[0].Version.length>0){
	        			self.typeVersionList = data.resp.result[0].Version;
	        			
	        		if(data.resp.result[0].Position.length>0){
	        			self.editPositionsList = data.resp.result[0].Position;
	        			//console.log(query);
	        		} }
			   }
			});
};



    //确认修改
    self.confirmUpdate = function(){
    	 if(self.updateScene.productChannel==null){
             alert("渠道不能为空");
             return ;
         }
         var versions = "";
         $('.updateVersionCheckbox').each(function() {
             if (this.checked == true) {
                 versions = $(this).val();
             }
         });
         if(versions==null || versions==""){
             alert("产品版本不能为空");
             return;
         }else{
             self.updateScene.productVersion = versions;
         }

        if(self.updateScene.productChannel==6){
            // 投放客户端
            var preList="";
            if(self.updateScene.productVersion=='h5'){
                $('.upPreCheckboxH5').each(function () {
                    if (this.checked == true) {
                        preList += $(this).val() + ",";
                    }
                });
            }else{

                $('.upPreCheckbox').each(function () {
                    if (this.checked == true) {
                        preList += $(this).val() + ",";
                    }
                });

            }
            if (preList == null || preList == "") {
                alert("投放客户端不能为空");
                return;
            } else {
                self.updateScene.putAddress = preList.slice(0,preList.length-1);
            }
        }
         
         var label = $("#editpositions").find("option:selected").text();  //获取Select选择的Text
         if(label=="请选择"){
             alert("对应的版本和登陆状态下banner位置不存在，请重新选择");
             return;
         }
         var type =self.updateScene.type;
         self.updateScene.type=type;
         if(type=="2"){
         	self.updateScene.videourl=$("#videoUrl1").val();
         }else{
         	self.updateScene.videourl="";
         }
         // 登陆状态
        // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
         var addLoginStatus =self.updateScene.loginStatus;
         if(addLoginStatus==null){
             alert("请选择banner登陆状态");
             return;
         }
         self.add.loginStatus=addLoginStatus;
         
         if(!self.updateScene.positions){
             alert("Banner位置不能为空");
             return ;
         }
         /*var addpositionsText = $("#editpositions").find("option:selected").text();
         if(!addpositionsText){
             alert("Banner位置不能为空");
             return ;
         }

         self.updateScene.positionName =addpositionsText;*/

         if(type=="2"){
        	 var url = $('#fileUrl2').val();
        	 self.updateScene.imageUrl = url==""?self.updateScene.imageUrl:url;
        	 self.updateScene.videourl = $("#videoUrl1").val();
         }else{
        	 var url = $('#fileUrl1').val();
        	 self.updateScene.imageUrl = url==""?self.updateScene.imageUrl:url;
         }
   		 
         self.updateScene.remindStatusUrl=$("#fileUrl7").val();
         self.updateScene.usualStatusUrl=$("#fileUrl6").val();
         self.updateScene.shortVideoUrl=$("#fileUrl8").val();
        if(self.updateScene.positions == 208 && self.updateScene.productChannel==0) {
            var url = $('#fileUrl1').val();
            self.updateScene.imageUrl = url == "" ? self.updateScene.imageUrl : url;
            if (!self.updateScene.imageUrl) {
                alert("请选择上传Banner图片");
                return;
            }
        }

         self.updateScene.imageUrlTwo = $("#editFileUrlTwo").val();
         self.updateScene.imageUrlThree = $("#editFileUrlThree").val();
    /*	if(type=="2"){
    		var url = $('#fileUrl2').val();
   		    self.updateScene.imageUrl = url==""?self.updateScene.imageUrl:url;
    		if(!self.updateScene.imageUrl){
    			alert("请选择上传视频封面");
    			return;
    		}
    		self.updateScene.videourl = $("#videoUrl1").val();
    		if(!self.updateScene.videourl){
    			alert("请选择上传视频");
    			return;
    		}
    		
    	}else{
    		var url = $('#fileUrl1').val();
    		 self.updateScene.imageUrl = url==""?self.updateScene.imageUrl:url;
    		if(!self.updateScene.imageUrl){
    			alert("请选择上传Banner图片");
    			return;
    		}
    	}*/
        /*if(!self.updateScene.redirectUrl){
            alert("跳转链接不能为空");
            return;
        }*/
        /*if(self.updateScene.productChannel == '1'){
            if(!self.updateScene.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
        }*/
        if(self.updateScene.productChannel == '0' || self.updateScene.productChannel == '2'){

            if(self.updateScene.positions == '40'){
                if(self.u_redirectType == '3'){
                    if(self.uSceneOne == null || self.uSceneOne == '' || self.uSceneOne == undefined){
                        alert("1级场景选项不能为空")
                        return;
                    }
                    if(self.updateScene.sceneTwo == null || self.updateScene.sceneTwo == '' || self.updateScene.sceneTwo == undefined){
                        alert("2级场景选项不能为空")
                        return;
                    }
                }

            }
            if(self.updateScene.positions == '41' && self.updateScene.productChannel == '0'){
                if(self.u_redirectType == '3'){
                    if(self.uSceneOne == null || self.uSceneOne == '' || self.uSceneOne == undefined){
                        alert("从选项不能为空")
                        return;
                    }
                    if(self.updateScene.sceneTwo == null || self.updateScene.sceneTwo == '' || self.updateScene.sceneTwo == undefined){
                        alert("续期至选项不能为空")
                        return;
                    }
                }

            }

            if(self.updateScene.productChannel == '0' && self.updateScene.positions != 206 && self.updateScene.positions != 207 && self.updateScene.positions != 217 && self.updateScene.positions != 218  && self.updateScene.positions != 215) {
                if ((!self.u_redirectType || self.u_redirectType == '0') ) {
                    alert("跳转类型不能为空")
                    return;
                }
            }
            if(self.u_redirectType == '2' && self.updateScene.type=='1'&& !self.updateScene.redirectUrl ){
                alert("跳转链接不能为空")
                return;
            }
            if(self.u_redirectType == '3' && self.updateScene.type=='1' && !self.updateScene.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if(self.u_redirectType == '3' && self.updateScene.type=='1' && !self.updateScene.pageTwo){
                alert("跳转页面不能为空")
                return;
            }

        }
        if((self.updateScene.productChannel == '0' && self.updateScene.positions=='14')||(self.updateScene.productChannel == '2' && self.updateScene.positions=='14')){
            if(!self.updateScene.colorNum){
                alert("色号不能为空")
                return;
            }
        }
        if (self.updateScene.productChannel == '1' && self.updateScene.positions=='226') {
            if(self.updateScene.imageUrlTwo==null||self.updateScene.imageUrlTwo==''){
                alert("2x图片不能为空")
                return;
            }
            if(self.updateScene.imageUrlThree==null||self.updateScene.imageUrlThree==''){
                alert("3x图片不能为空")
                return;
            }
        }

        if (self.updateScene.productChannel == '1' && self.updateScene.positions=='229') {
            if(self.updateScene.type==2 && (self.updateScene.videourl==null||self.updateScene.videourl=='' || !self.updateScene.imageUrl)){
                alert("视频或图片不能为空")
                return;
            }
            if(self.updateScene.type==1 && (self.updateScene.imageUrl==null||self.updateScene.imageUrl=='')){
                alert("图片不能为空")
                return;
            }

            if(!self.updateScene.redirectUrl && self.updateScene.type == 1){
                alert("跳转链接不能空");
                return;
            }

        }
        if((!self.updateScene.redirectUrl && self.updateScene.positions == 10001)){
            alert("跳转链接不能空");
            return;
        }

        self.updateScene.onlineTime = $('#updateOnlineTime').val()+"";
        self.updateScene.offlineTime = $('#updateOfflineTime').val()+"";
        if(!self.updateScene.onlineTime ||!self.updateScene.offlineTime){
            alert("上线时间下线时间不能为空");
            return;
        }
        if(self.updateScene.offlineTime<=self.updateScene.onlineTime){
            alert("下线时间必须大于上线时间");
            return;
        }
        if(self.updateScene.valid==null){
            alert("请选择是否生效");
            return;
        }
       /* $('.updateCheckbox').each(function () {
            if(this.checked == true){
                self.updateScene.showType = $(this).val();
            }
        })*/


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
                self.updateScene.showType = 3;
            }

            if (!whiteId && !blackId){
                self.updateScene.showType = 0;
            }
            if (whiteId && whiteId != 0 && !blackId){
                self.updateScene.showType = 1;
            }
            if (blackId && blackId!=0 && !whiteId){
                self.updateScene.showType = 2;
            }
            if (self.updateScene.whiteMemberListName != 'NO_RULE'){
                self.updateScene.whiteTrue=true;
            }

            if (self.updateScene.blackMemberListName != 'NO_RULE'){
                self.updateScene.blackTrue = true;
            }


            if(self.updateScene.whiteTrue == true){
                var whiteId =  $('#memberIdUpdate').val();
                if(whiteId==null || whiteId=="" || whiteId=="0" || whiteId.indexOf("?")!=-1){
                    alert('请选择具体白名单!');
                    return;
                }else{
                    self.updateScene.whiteId = whiteId;
                    self.updateScene.whiteName = $('#memberIdUpdate option:selected').text();
                }
            }
            if(self.updateScene.blackTrue == true){
                var blackId =  $('#memberBlackIdUpdate').val();
                if(blackId == null || blackId=="" || blackId=="0"|| blackId.indexOf("?")!=-1){
                    alert('请选择具体黑名单!');
                    return;
                }else{
                    self.updateScene.blackId = blackId;
                    self.updateScene.blackName = $('#memberBlackIdUpdate option:selected').text();
                }
            }
        }

        if(!self.updateScene.blackId){
            self.updateScene.blackId = 0;
        }
        if(!self.updateScene.whiteId){
            self.updateScene.whiteId = 0;
        }

        // 审核人
        var auditPerson = self.updateScene.auditPerson;
        if(!self.updateScene.auditPerson){
            alert("审核人不能为空");
            return ;
        }else{
         	self.updateScene.auditNo=self.updateScene.auditPerson.no;
         	self.updateScene.requestAuditPersonEmail=self.updateScene.auditPerson.email;
         	self.updateScene.auditPerson=self.updateScene.auditPerson.name;
        }
        self.updateScene.sceneOne = self.uSceneOne;
        self.updateScene.redirectType = self.u_redirectType;
        if (self.updateScene.productChannel == '6') {
            self.updateScene.redirectUrl = encodeURI(self.updateScene.redirectUrl);
        }
        var url = globalConfig.basePath+"/appConfig/banner/editBanner";
        console.info(JSON.stringify(self.updateScene));
        $http.post(url,self.updateScene).then(
            function(data){
                alert(data.data.message);
                $(".upstatus").html("");
                $('#showUpdate').hide();
                $('#fileUrl2').prop("value","");
                $('#fileUrl1').prop("value","");
                self.updateScene = {};

                $('.updateCheckALL').each(function () {
                    $(this).prop("checked",false);
                });
                self.upCheckType = 0;
                self.upCheckTypeH5=0;
               // self.reset();
                //self.loading();
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    }

    //取消修改
    self.updateCancel = function(){
        $('#showUpdate').hide();
        self.updateScene = {};
        $('.updateCheckALL').each(function () {
            $(this).prop("checked",false);
        });
        self.upCheckType = 0;
        self.upCheckTypeH5=0;
       // self.reset();
       // self.loading();
        self.querySplashConfigList(1);
    }

    //生效失效Banner
    self.start = function(id,valid){
        $('#showStart').show();
        self.start.startValid=valid;
        self.start.id = id;
    }

    //确定失效生效Banner
    self.confirmStart = function(id,valid){
        if(valid==0){
            valid=1;
        }else if(valid==1){
            valid=0;
        }
        var url = globalConfig.basePath+"/appConfig/banner/takeEffectBanner?id="+id+"&valid="+valid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
             //self.reset();
            //self.loading();
            self.querySplashConfigList(1);
            $('#showStart').hide();
           
        }, function errorCallback(response) {
            alert("失败....");
        });
        self.querySplashConfigList(1);
    }

    //取消生效失效Banner
    self.cancelStart = function(){
        $('#showStart').hide();
    }


    //排序
    self.stort = function(){
    		var	searchproductChannel=$("#searchproductChannel").val();
    		var searchproductVersion=$("#searchproductVersion").val();
    		var searchpositions=$("#searchpositions").val();
    		var searchLoginStatus=$("#searchLoginStatus").val();
    		
            if(!searchproductChannel){
            		alert("请在查询条件中选择渠道");
                return;
            }
            if(!searchproductVersion){
               
                alert("请在查询条件中选择产品版本");
                return;
            }
            if(!searchpositions){
                alert("请在查询条件中Banner位置");
                return;
            }
            if(!searchLoginStatus){
	        		alert("请在查询条件中选择登陆状态");
	            return;
            }
            
//           if(searchLoginStatus=='0'){
//        		alert("只有已登陆状态才可以进行排序。");
//            return;
//        }
            if(searchproductChannel==0){
            	var type="";
            	if($scope.search.positions==13){
            		type="sys_wk_banner_value_13";
            	}else if($scope.search.positions==12){
            		type="sys_wk_banner_value_12";
            	}else if($scope.search.positions==0){
            		type="sys_wk_banner_value_0";
            	}else if($scope.search.positions==14){
            		type="sys_wk_banner_value_14";
            	}else if($scope.search.positions==38){
            		type="sys_wk_banner_value_38";
            	}else if($scope.search.positions==40){
            		type="sys_wk_banner_value_4";
            	}else if($scope.search.positions==41){
            		type="sys_wk_banner_value_41";
            	}else if($scope.search.positions==36){
            		type="sys_wk_banner_value_36";
            	}else if($scope.search.positions==37){
            		type="sys_wk_banner_value_37";
            	}else if($scope.search.positions==42){
            		type="sys_wk_banner_value_42";
            	}
            	$scope.getShowValue(type);
            }


	        $('#showPriority').show();
	        var url = globalConfig.basePath+"/appConfig/banner/selectSort?productChannel="+searchproductChannel+"&productVersion="+searchproductVersion+"&positions="+searchpositions+"&loginStatus="+searchLoginStatus;
	        $http({
	            method: 'GET',
	            url: url,
	        }).then(function successCallback(data) {
	        	if(data.data.code=='000'){
	    			for(var i=0;i<data.data.resp.result.length;i++){
	    				data.data.resp.result[i].priority =i+1;			
	    			}
	    			  self.strotList = data.data.resp.result;
	    	     }
	           // self.strotList = data.data.resp.result;
	        }, function errorCallback(response) {
	            // 请求失败执行代码
	            alert("根据id获取对象失败....");
	        });
    }
    
    $scope.rDict="";
    $scope.getShowValue = function(type){
    	  var url = globalConfig.basePath+"/rDict/getShowPageValue?resourceType="+type;
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
    //优先级排序
    self.stort_old = function(){
        var ids="";
        $('.listChecked').each(function(){
            if(this.checked == true){
                ids += $(this).val() + ",";
            }
        })
        if(ids == "" ||ids == null){
            alert("请选择要排序的对象");
            return;
        }
        $('#showPriority').show();
        var url = globalConfig.basePath+"/appConfig/banner/selectByPrimaryIds?ids="+ids;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        	if(data.data.code=='000'){
			for(var i=0;i<data.data.resp.result.length;i++){
				data.data.resp.result[i].priority =i+1;			
			}
			  self.strotList = data.data.resp.result;
	     }
	        		
        	
          
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
    }

    
    self.readcolor=function(count){
    	 	var length = self.strotList.length;
    	 	if(count=1){
    	 		$("#downMove").addClass("smalla-red");
    	 		$("#upMove").removeClass("smalla-red");
    	 	}
    	 	if(count=length){
    	 		$("#upMove").addClass("smalla-red");
    	 		$("#downMove").removeClass("smalla-red");
    	 	}
    		
    	
    	
    	
    }
    //移动
    var moveList = new Array();
    self.move = function(type){
        if( $("input[class='moveCheckbox']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
        var length = self.strotList.length;
        
        
        
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
                 if(type=='S'){//上移
                    var me =$(this).val()-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  self.strotList[me];//当前选中的
                    var move1 = self.strotList[me-1];//上一个
                     self.strotList[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                     self.strotList[me] = move1;// 当前选中的
//                     self.strotList[me-1].priority = self.strotList[me-1].priority-1;
//                     self.strotList[me].priority =self.strotList[me].priority+1;
//                     self.strotList[me-1].priority =$(this).val()+1;
//                     self.strotList[me].priority =$(this).val()-1;
                     self.strotList[me-1].priority =Number($(this).val())-Number(1);
                   self.strotList[me].priority =Number($(this).val());
                 }else if(type=='X'){// 下移
                     var me =$(this).val()-1;
                     if(me==length-1){
                         alert("已经最后了,还要往那移");
                         return;
                     }
                     var move0 = self.strotList[me];// 下一个banner
                     move0.priority=Number($(this).val())+Number(1);
                     var move1 = self.strotList[me+1];// 下一个banner
                     move1.priority=Number($(this).val());
                     self.strotList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                     self.strotList[me] = move1;// 下一个移动到当前的位置
                 }
            }
        })
    }

    //排序删除
    self.remove = function(){
        var length = self.strotList.length;
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
               var me =$(this).val()-1;
                self.strotList.splice(me,1);
            }
        })
        for(var i=0;i<length-1;i++){
                self.strotList[i].priority = i+1;
        }
    }

    //确定排序
    self.moveCommit = function(){
        var url = globalConfig.basePath+"/appConfig/banner/moveCommit";
        $http.post(url,self.strotList).then(
            function(data){
                alert(data.data.message);
                //self.reset();
                //self.loading();
                self.querySplashConfigList(1);
                $('#showPriority').hide();
                self.strotList = {};
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //排序取消
    self.moveCancel = function(){
        $('#showPriority').hide();
        self.strotList={};
    }
    
    
    //添加全部选中事件
    self.completeAll = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#selectaddwhiteId").val("");  
            $("#black").attr('disabled','disabled');
            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
            $("#selectaddblackId").val("");

            self.add.whiteMemberListName= "NO_RULE"
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.add.blackMemberListName= "NO_RULE"
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }else {
            $("#white").removeAttr('disabled','disabled');
            $("#selectaddwhiteId").removeAttr("disabled");  
            $("#black").removeAttr('disabled','disabled');
            $("#selectaddblackId").removeAttr("disabled");

            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }
    }
    
    //添加全部选中事件
    self.editAll = function(){
        $("#upWhite").attr("checked",false);
        $("#upBlack").attr("checked",false);
        if($('#editall').is(':checked')){
            $("#upWhite").attr('disabled','disabled');
            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");  
            $("#upBlack").attr('disabled','disabled');
            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
            $("#editselectaddblackId").val("0");

            //黑白名单操作
            self.updateScene.whiteMemberListName= "NO_RULE"
            self.updateScene.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();


            self.updateScene.blackMemberListName= "NO_RULE"
            self.updateScene.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
        }else {
            $("#upWhite").removeAttr('disabled','disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");  
            $("#upBlack").removeAttr('disabled','disabled');
            $("#editselectaddblackId").removeAttr("disabled");
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
                self.updateScene.whiteMemberListName= "NO_RULE"
                self.updateScene.whiteId=null;
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
                $("#blackListType").attr('disabled',false);
            }else{
                $("#blackListType").attr('disabled','disabled');
            }
        }else{
            if(!$('#editblack').prop("checked")){
                self.updateScene.blackMemberListName= "NO_RULE"
                self.updateScene.blackId=null;
                self.blackStrategyReloadUpdate();
                $('#userNameLikeBlackSearchUpdate').hide();
                $("#blackListType").attr('disabled',false);
            }else{
                $("#blackListType").attr('disabled','disabled');
            }
        }
    }
    
    

    //默认查询
    self.loading = function(){
       // self.search.productChannel = "0";
        self.search.productVersion = "";
        self.search.pageSize = "5";
        self.querySplashConfigList(1);
    }
    

    self.getTypeVersionList(0,"",1);
    
// **************************审核********************************
    /**
     * 审批
     */
    self.audit = function(record){
	    	if(record.auditStatus != "0"){
	    		alert('只能对待审核状态的数据进行操作');
	    		return;	
	    	 }
	    	self.auditStatus = "1";
	    	$('#auditShow').show();
	    	self.confirmRecord = angular.copy(record);
	   // 	self.auditStatus = "2";
	    	self.auditDescription = "";
    	
    };
    // 审核
    self.confirm = function(){       
        self.confirmRecord.auditStatus = self.auditStatus;
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath+"/appConfig/banner/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {
            
            if(callback.data.code == '000'){
            	 $('.take-start-box').hide();
            	alert("操作成功");
            	$scope.querySplashConfigList(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    
    
    //生效失效
    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
    	   record.requestAuditDescription="";
       $scope.effectRecord = record;
       $scope.effectRecord.auditPerson={};
       $scope.effectRecord.auditPerson.no='';
       $('#takeEffect').show();
    };
    
    
    $scope.validateRecord = function(){
    	  // 审核人
        //var auditPerson = self.effectRecord.auditPerson;
        if(!self.effectRecord.auditPerson.no){
            alert("审核人不能为空");
            return ;
        }else{
         	self.effectRecord.auditNo=self.effectRecord.auditPerson.no;
         	self.effectRecord.requestAuditPersonEmail=self.effectRecord.auditPerson.email;
         	self.effectRecord.auditPerson=self.effectRecord.auditPerson.name;
        }
    	
		if(self.effectRecord.valid==1){
			self.effectRecord.valid=0;
		}else{
			self.effectRecord.valid=1;
		}
        
    		var url = globalConfig.basePath+"/appConfig/banner/effectBanner";
        $http.post(url,self.effectRecord).then( function(data){
        	 $('#takeEffect').hide();
            	if(data.data.code == '000'){   
            		 alert(data.data.message);
            	}else if(data.data.code == '009'){
                    alert(data.data.message);
                }else if(data.data.code == '008'){
                    alert(data.data.message);
                }
                $scope.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    		
    	
    };
    
    /**
     *是否显示类型 
     */
    self.onShowValueType = function(positions){
        if(positions=="0" || positions=="42" || positions=="47" || positions=="48"
            || (positions=="231" && self.add.productChannel==1)|| (positions=="212" && self.add.productChannel==0)|| (positions=="214" && self.add.productChannel==2)
            || (positions=="229" && self.add.productChannel==1) || (positions=="235" && self.add.productChannel==1) || (positions=="236" && self.add.productChannel==1) || (positions == "237" && self.add.productChannel == 1) ||
            (positions == "238" && self.add.productChannel == 1) ||(positions == "239" && self.add.productChannel == 1) || (positions == "240" && self.add.productChannel == 1)
            || (positions == "215" && self.add.productChannel == 0) || (positions == "216" && self.add.productChannel == 0) || (positions == "217" && self.add.productChannel == 0) || (positions == "218" && self.add.productChannel == 0)
            || (positions == "3020" && self.add.productChannel == 0)
            || (positions == "219" && self.add.productChannel == 0 || (positions == '2003' && self.add.productChannel == 2)
            || (positions == '2005' && self.add.productChannel == 2)
            || (positions == '2001' && self.add.productChannel == 2) || (positions == '2002' && self.add.productChannel == 2))){
            self.typeShow=true;
            if ((positions == "237" && self.add.productChannel == 1) || (positions == "239" && self.add.productChannel == 1) || (positions == "240" && self.add.productChannel == 1)
            || (positions == "216" && self.add.productChannel == 0) || (positions == '2003' && self.add.productChannel == 2)){
                $('#isVideo').hide();
                $('#isPicture').show();
                self.add.type = "1";
                self.videoShow = false;
                self.showPicer = true;
            }
            if ((positions == "238" && self.add.productChannel == 1) || (positions == "217" && self.add.productChannel == 0)|| (positions == "218" && self.add.productChannel == 0)){
                self.showPicer = false;
                self.add.type = "2";
                $('#isPicture').hide();
                $('#isVideo').show();
                self.videoShow = true;
            }
            if ((positions == "218" && self.add.productChannel == 0) || (positions == "219" && self.add.productChannel == 0) || (positions == "215" && self.add.productChannel == 0) || (positions == "236" && self.add.productChannel == 1)
                || (positions == '2001' && self.add.productChannel == 2) || (positions == '2002' && self.add.productChannel == 2) || (positions == "212" && self.add.productChannel == 0) || (positions == "3020" && self.add.productChannel == 0)){
                $('#isPicture').show();
                $('#isVideo').show();
                if (self.add.type == 2){
                    self.videoShow = true;
                }
            }
        }else{
            self.typeShow=false;
            self.videoShow=false;
            self.add.type="1";
        }
        if((self.add.productChannel=='0' && self.add.loginStatus == '0' && positions=="14")||
            (self.add.productChannel=='2' && self.add.loginStatus == '0' && positions=="14")||
            (self.add.productChannel=='5' && self.add.loginStatus == '0' && positions == "1005")){
            self.typeShow=true;
        }
        if(self.add.productChannel=='0' && (positions=="40" || positions=="41")){
            var type=positions=="40"?"wk_loan_scenario_one":"wk_continue_invest_scenario_one";
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.sceneOneDictList = data.resp.result;
            })
            self.borrowing_investment_type=true;
        }
        else{
            self.borrowing_investment_type=false;
        }
    };

    /**
     *是否显示场景-修改banner
     */
    self.onShowValueType2 = function(positions){


        if(positions=="0" || positions=="42" || positions=="47"
            || positions=="48" || (positions=="231" && self.updateScene.productChannel==1)|| (positions=="212" && self.updateScene.productChannel==0)
            || ((positions=="214" && self.updateScene.productChannel==2))
            || (positions=="229" && self.updateScene.productChannel==1) || (positions=="235" && self.updateScene.productChannel==1) || (positions=="236" && self.updateScene.productChannel==1) || (positions == "237" && self.updateScene.productChannel == 1) ||
            (positions == "238" && self.add.productChannel == 1) ||(positions == "239" && self.updateScene.productChannel == 1) || (positions == "240" && self.updateScene.productChannel == 1)
            || (positions == "215" && self.add.productChannel == 0) || (positions == "216" && self.updateScene.productChannel == 0) || (positions == "217" && self.updateScene.productChannel == 0) || (positions == "218" && self.updateScene.productChannel == 0)
            || (positions == "219" && self.add.productChannel == 0) || (positions == '2003' && self.updateScene.productChannel == 2) || (positions == '2001' && self.updateScene.productChannel == 2) || (positions == '2002' && self.updateScene.productChannel == 2)
            || (self.updateScene.productChannel =='5' && self.updateScene.positions == '1005')){
            self.typeShow=true;
        }else{
            self.typeShow=false;
            self.videoShow=false;
            self.add.type="1";
            self.updateScene.type="1";
            self.showPicer=true;
        }
        if(self.updateScene.productChannel=='0' && (positions=="40" || positions=="41")){
            var type=positions=="40"?"wk_loan_scenario_one":"wk_continue_invest_scenario_one";
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.sceneOneDictList2 = data.resp.result;
            })
            self.borrowing_investment_type2=true;
        }else{
            self.borrowing_investment_type2=false;
        }
    };
    /**
     * 是否显示视频
     */
    self.changeValueType = function (type){
        if(type=="2"){
            self.videoShow=true;
            self.showPicer=false;
            $('#fileUrl').prop("value","");
            $('#image_prew').prop("src","");
            $('#fileUrl1').prop("value","");
            $('#image_prew1').prop("src","");
        }else{
            self.videoShow=false;
            self.showPicer=true;
            $('#fileUrl').prop("value","");
            $('#image_prew').prop("src","");
            $('#fileUrl1').prop("value","");
            $('#image_prew1').prop("src","");
        }
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
        if(self.add.productChannel==0 || self.add.productChannel==2 || self.add.productChannel==3){
            channelCode='WK';
        }else if(self.add.productChannel==1 || self.add.productChannel==4){
            channelCode='QB';
        }else if(self.add.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.add.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
            self.add.whiteId='0';
            $('#memberId').val('0')
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
        if(self.add.productChannel==0 || self.add.productChannel==2 || self.add.productChannel==3){
            channelCode='WK';
        }else if(self.add.productChannel==1 || self.add.productChannel==4){
            channelCode='QB';
        }else if(self.add.productChannel==6){
            channelCode='SC';
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
                    self.updateScene.strategyList = data.data.resp;
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
                    self.updateScene.blackStrategyList = data.data.resp;
                    self.findBlackChannelGroupsUpdate();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    self.changeBlackFindChannelGroupsUpdate = function () {
        self.findBlackChannelGroupsUpdate();
    }
    //endregion

    /** 查询白名单渠道分组数量*/
    self.findChannelGroupCount = function (channelCode,rosterId) {
        var url = globalConfig.basePath + "/ruleConfig/queryMemberCount?channelCode="+channelCode+"&rosterId="+rosterId
        $http.post(url, self.strate).then(
            function (data) {
                if (data.data.code == '000') {
                    self.memberUpdateCount = data.data.resp.rosterCount;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )
    }

    /** 查询黑名单渠道分组数量*/
    self.findBlackChannelGroupCount = function (channelCode,rosterId) {
        var url = globalConfig.basePath + "/ruleConfig/queryMemberCount?channelCode="+channelCode+"&rosterId="+rosterId
        $http.post(url, self.strate).then(
            function (data) {
                if (data.data.code == '000') {
                    self.memberBlackUpdateCount = data.data.resp.rosterCount;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )
    }


    //region 修改白名单查询
    /**
     * 用户策略类型初始化
     */
    self.strategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.updateScene.strategyList = data.data.resp;
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
        if(self.updateScene.productChannel==0 ||self.updateScene.productChannel==2){
            channelCode='WK';
        }else if(self.updateScene.productChannel==1){
            channelCode='QB';
        }else if(self.updateScene.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.updateScene.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterLikeSearch').hide();
            self.updateScene.whiteId='0';
            $('#memberIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.updateScene.whiteMemberListName
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
                    self.updateScene.blackStrategyList = data.data.resp;
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
        if(self.updateScene.productChannel==0 ||self.updateScene.productChannel==2){
            channelCode='WK';
        }else if(self.updateScene.productChannel==1){
            channelCode='QB';
        }else if(self.updateScene.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.updateScene.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.updateScene.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.updateScene.blackMemberListName
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






  // banner修改，修改名单
    self.toUpdateRoster = function () {
        self.isUpdateRoster = 'Y';
        $("#editall").attr('disabled',false);
        self.memberUpdateCount="";
        self.memberBlackUpdateCount="";
        $('#editall').prop("checked",true);//默认全部不选择
        $("#upWhite").attr('checked',false);
        $("#upBlack").attr('checked',false);
        $("#upWhite").attr('disabled','disabled');
        $("#upBlack").attr('disabled','disabled');
        $("#whitListType").attr('disabled','disabled');
        $("#blackListType").attr('disabled','disabled');
        self.beforeWhiteMemberListName = self.updateScene.whiteMemberListName;
        self.beforeBlackMemberListName = self.updateScene.blackMemberListName;
        self.beforeWhiteId = self.updateScene.whiteId;
        self.beforeBlackId = self.updateScene.blackId;
        if (self.updateScene.whiteName && self.updateScene.whiteName != ''){
            self.beforeWhiteName = self.updateScene.whiteName;
        }
        if (self.updateScene.blackName && self.updateScene.blackName != ''){
            self.beforeBlackName = self.updateScene.blackName;
        }
        self.updateScene.whiteId = '';
        self.updateScene.blackId = '';
        self.updateScene.blackMemberListName = 'NO_RULE';
        self.updateScene.whiteMemberListName = 'NO_RULE';

        $('#upUserRosterLikeSearch').hide();

        $('#upUserRosterBlackLikeSearch').hide();

    }

  //点击白名单复选框
    self.upWhiteClick = function () {
        if(!$("#upWhite").prop("checked")){
            self.updateScene.whiteMemberListName= "NO_RULE"
            self.updateScene.whiteId=null;
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

    self.decodeURIStr = function (urlStr) {
        return decodeURI(urlStr)
    };


    /**投放客户端显示*/
    self.showAddress = function(values){
        var address = values.split(",");
        var names="";
        angular.forEach(address,function (param) {
            if(param=="JFWK_IOS"){
                names += "玖富万卡ios"+",";
            }else if(param=="JFWK_ANDROID"){
                names += "玖富万卡安卓"+",";
            }else if(param=="JFWK_H5"){
                names += "玖富万卡H5"+",";
            }else if(param=="PHJR_IOS"){
                names += "普惠金融ios"+",";
            }else if(param=="PHJR_ANDROID"){
                names += "普惠金融安卓"+",";
            }else if(param=="JFQB_IOS"){
                names += "玖富钱包ios"+",";
            }else if(param=="JFQB_ANDROID"){
                names += "玖富钱包安卓"+",";
            }else if(param=="JFSC_IOS"){
                names += "玖富商城ios"+",";
            }else if(param=="JFSC_ANDROID"){
                names += "玖富商城安卓"+",";
            }else if(param=="JFSC_H5"){
                names += "玖富商城H5"+",";
            }
        })
        return names;
    }

    /**投放客户端全选中*/
    self.checkType=0;
    self.checkTypeH5=0;
    self.upCheckType = 0;
    self.upCheckTypeH5=0;
    self.preAllCheck = function(type){
        if(type==0){
            if(self.checkTypeH5==0){
                self.checkTypeH5=1;
            }else if(self.checkTypeH5==1){
                self.checkTypeH5=0;
            }
            if(self.checkTypeH5==1){
                $('.preCheckboxH5').each(function() {
                    $(this).prop("checked",true);
                });
            }else if(self.checkTypeH5==0){
                $('.preCheckboxH5').each(function() {
                    $(this).prop("checked",false);
                });
            }
        }else if(type==1){
            if(self.checkType==0){
                self.checkType=1;
            }else if(self.checkType==1){
                self.checkType=0;
            }
            if(self.checkType==1){
                $('.preCheckbox').each(function() {
                    $(this).prop("checked",true);
                });
            }else if(self.checkType==0){
                $('.preCheckbox').each(function() {
                    $(this).prop("checked",false);
                });
            }
        }
        else if(type==2){
            if(self.upCheckTypeH5==0){
                self.upCheckTypeH5=1;
            }else if(self.upCheckTypeH5==1){
                self.upCheckTypeH5=0;
            }
            if(self.upCheckTypeH5==1){
                $('.upPreCheckboxH5').each(function() {
                    $(this).prop("checked",true);
                });
            }else if(self.upCheckTypeH5==0){
                $('.upPreCheckboxH5').each(function() {
                    $(this).prop("checked",false);
                });
            }
        }
        else if(type==3){
            if(self.upCheckType==0){
                self.upCheckType=1;
            }else if(self.upCheckType==1){
                self.upCheckType=0;
            }
            if(self.upCheckType==1){
                $('.upPreCheckbox').each(function() {
                    $(this).prop("checked",true);
                });
            }else if(self.upCheckType==0){
                $('.upPreCheckbox').each(function() {
                    $(this).prop("checked",false);
                });
            }
        }
    }
}]);
