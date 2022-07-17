'use strict';

var App = angular.module('splashApp', [], angular.noop);
App.controller('splashController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};
    self.search.showType='';
    self.add={};
    self.search.loginStatus = '';
    $scope.search.status = '';
    $scope.loginName = globalConfig.loginName;
    self.isUpdateRoster = 'N';
    self.continuationTypeInfo="";
    //添加开机屏上传图片
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
        $('#addPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            add: function (e, data) {

                var acceptFileTypes = /(\.|\/)(gif|jpe?g|png)$/i;

                //文件类型判断
                if(data.originalFiles[0].type.length && !acceptFileTypes.test(data.originalFiles[0].type)) {
                    alert('请上传gif、jpg、jpeg或png格式的文件');
                    return false;
                }
                //文件大小判断
                if(data.originalFiles[0].size > (2*1024*1024)) {
                    alert('请上传不超过2M的文件');
                    return false;
                }
                data.submit();
            },
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl').prop("value",fileUrl);
                $('#image_prew').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了,请上传图片文件");
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
            add: function (e, data) {

                var acceptFileTypes = /(\.|\/)(gif|jpe?g|png)$/i;

                //文件类型判断
                if(data.originalFiles[0].type.length && !acceptFileTypes.test(data.originalFiles[0].type)) {
                    alert('请上传gif、jpg、jpeg或png格式的文件');
                    return false;
                }
                //文件大小判断
                if(data.originalFiles[0].size > (2*1024*1024)) {
                    alert('请上传不超过2M的文件');
                    return false;
                }
                data.submit();
            },
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl1').prop("value",fileUrl);
                $('#image_prew1').prop("src",fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了,请上传图片文件");
                    return;
                }
            }
        });
    $('#addIphonexPicture').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        add: function (e, data) {

            var acceptFileTypes = /(\.|\/)(gif|jpe?g|png)$/i;

            //文件类型判断
            if(data.originalFiles[0].type.length && !acceptFileTypes.test(data.originalFiles[0].type)) {
                alert('请上传gif、jpg、jpeg或png格式的文件');
                return false;
            }
            //文件大小判断
            if(data.originalFiles[0].size > (2*1024*1024)) {
                alert('请上传不超过2M的文件');
                return false;
            }
            data.submit();
        },
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#addIphonexFileUrl').prop("value",fileUrl);
            $('#image_prew_Iphonex').prop("src",fileUrl);
            alert("上传成功")
        }
    }).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                alert("出错了,请上传图片文件");
                return;
            }
        }
    });

    $('#editIphonexPicture').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        add: function (e, data) {

            var acceptFileTypes = /(\.|\/)(gif|jpe?g|png)$/i;

            //文件类型判断
            if(data.originalFiles[0].type.length && !acceptFileTypes.test(data.originalFiles[0].type)) {
                alert('请上传gif、jpg、jpeg或png格式的文件');
                return false;
            }
            //文件大小判断
            if(data.originalFiles[0].size > (2*1024*1024)) {
                alert('请上传不超过2M的文件');
                return false;
            }
            data.submit();
        },
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#editIphonexFileUrl').prop("value",fileUrl);
            $('#image_prew1w_Iphonex').prop("src",fileUrl);
            alert("上传成功")
        }
    }).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                alert("出错了,请上传图片文件");
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
            acceptFileTypes: /(\.|\/)(mp4)$/i,
            maxFileSize: 1024 * 1024 * 2,
            messages: {
                maxFileSize: '视频文件最大支持上传2MB',
                acceptFileTypes: '不支持的视频格式'
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
            acceptFileTypes: /(\.|\/)(mp4)$/i,
            maxFileSize: 1024 * 1024 * 2,
            messages: {
                maxFileSize: '视频文件的最大支持上传 2MB',
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

    //开机屏查询
    self.querySplashConfigList = function(pageNum){
        if(!pageNum){
            self.search.pageNo = self.page.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                if(self.search.pageCount==0){
                    self.search.pageNo=1;
                }else{
                    self.search.pageNo=self.search.pageCount;
                }
            }else{
                self.search.pageNo = pageNum;
            }
        }
        self.search.onlineTime = $("#time").val();
        var url = globalConfig.basePath+"/splash/querySplashConfigList";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNo = data.data.resp.currentPage;
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

    //重置
    self.reset = function(){
        var totalRowSize = self.search.totalRowSize;
        var pageNo = self.search.pageNo;
        self.search={};
        self.search.productChannel = "0";
        self.search.loginStatus = '';
        self.search.pageSize = "5";
        $scope.search.status = '';
        self.search.showType='';
        self.search.totalRowSize=totalRowSize;
        self.search.pageNo=pageNo;
        self.getTypeVersionList(0);
    }

    //添加开机屏
    self.addScreen = function(){
        self.add={};
    	self.login = false;
    	self.logout = false;
        self.add.productChannel = "0";
        self.add.valid = "1";
        self.add.mediaType = "1";
        self.add.startType = "1";
        //金融属性开关
        self.add.financialStyle = 'Y';
        //前置鉴权
        self.add.preAuth = '0';
        self.pictureShow = true;
        self.xPictureShow = true;
        self.mediaTypeShow = false;
        self.videoShow = false;
        self.getTypeVersionList(0);
        $('#addShow').show();
        self.queryWhiteAndBlack();
        self.allxx =true;
        $('#all').prop("disabled","disabled");//默认全部不选择
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        self.add.whiteId = '';
        $("#whiteID").attr('disabled','disabled');
        self.add.blackId = '';
        $("#blackSelect").attr('disabled','disabled');

        //黑白名单显示
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();


    }

    //确认添加开机屏
    self.commitScreen = function(){
        if(self.add.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        var versions = "";
        var length = $('.versionCheckbox:checked').length;
        var is = 0;
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                if(is==length-1){
                    versions += $(this).val();
                }else{
                    versions += $(this).val() + ",";
                }
                is++;
            }
        });
        if(versions==null || versions==""){
            alert("产品版本不能为空");
            return;
        }else{
            self.add.productVersion = versions;
        }
        
//        var login = $("#login").prop("checked");
//        var logout = $("#logout").prop("checked");
        var addLoginStatus =self.add.loginStatus;
        
        if(!addLoginStatus){
	        	alert('请选择登录状态');
	    		return;	
        }
       
        self.add.imageUrl=$('#fileUrl').val()
        self.add.imageUrlIphonex = $('#addIphonexFileUrl').val();
        if($("#mediaType").val() == "2") {
            // self.add.imageUrl=$('#fileUrl').val();
            // if(!self.add.imageUrl) {
            //     alert("视频封面不能为空");
            //     return;
            // }
            self.add.videoUrl = $("#videoUrl").val();
            if(!self.add.videoUrl) {
                alert("视频不能为空");
                return;
            }
        } else {
            if(self.add.imageUrl==null||self.add.imageUrl==""){
                alert("开机屏图片不能为空");
                return;
            }
            if(!self.add.imageUrlIphonex){
                alert("Iphonex开机屏图片不能为空");
                return;
            }
        }
        if(self.add.productChannel == '0' && self.add.redirectType == '2'){
            if(!self.add.redirectUrl){
                alert("跳转链接不能为空");
                return;
            }
        }
        var a_address = $("#a_address").val();
        if(self.add.productChannel == '0'){
            if(!self.add.redirectType){
                alert("跳转类型不能为空")
                return;
            }
            /*if(self.add.redirectType == '2' && (a_address == null || a_address == '' || a_address == undefined)){
                alert("跳转链接不能为空")
                return;
            }*/
            if(self.add.redirectType == '3' && !self.add.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if(self.add.redirectType == '3' && !self.add.pageTwo){
                alert("跳转页面不能为空")
                return;
            }

        }
        self.add.onlineTime = $('#queryOnlineTime').val()+"";
        self.add.offlineTime = $('#queryOfflineTime').val()+"";
        if(self.add.onlineTime==null||self.add.onlineTime==""){
            alert("请选择上线时间");
            return;
        }
        if(self.add.offlineTime==null||self.add.offlineTime==""){
            alert("请选择下线时间");
            return;
        }
        if(self.add.offlineTime<=self.add.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
        
        if(self.add.displayPeriod != null && self.add.displayPeriod != "" ){
            var number = Number(self.add.displayPeriod);
            if(number == null || number < 0 || number > 10 ){
                alert("设置开机屏的展示时间，最长10秒");
                return;
            }
        }else{
            alert("开机屏的展示时间不能为空")
            return;
        }
        if(self.add.valid==null){
            alert("请选择是否生效");
            return;
        }
       // $('.checkbox').each(function () {
       //     if(this.checked == true){
       //         self.add.showType = $(this).val();
       //     }
       // })

        var whiteId = $('#memberId').val();
        var blackId = $('#memberBlackId').val();

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


        // var all = $("#all").prop("checked");
        // if(all){
        //     $scope.add.showType = 0;
        // }else{
        //     var white = $("#white").prop("checked");
        //     var black = $("#black").prop("checked");
        //     if(white&&black){
        //         $scope.add.showType = 3;
        //         self.add.whiteTrue=true;
        //         self.add.blackTrue=true;
        //     }else{
        //         if(white){
        //             $scope.add.showType = 1;
        //             self.add.whiteTrue=true;
        //             self.add.blackTrue=false;
        //         }else if(black){
        //             $scope.add.showType = 2;
        //             self.add.whiteTrue=false;
        //             self.add.blackTrue=true;
        //         }else{
        //             alert('请选择展示人群');
        //             return;
        //         }
        //     }
        // }

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
        // if (self.add.whiteId && self.add.whiteId != ''){
        //     self.add.whiteName = $('#whiteName').html();
        // }
        // if (self.add.blackId && self.add.blackId != ''){
        //     self.add.blackName = $('#blackName').html();
        // }
        // 审核人
        var auditPerson = self.add.auditPerson;
        if(!self.add.auditPerson){
            alert("审核人不能为空");
            return ;
        }else{
         	self.add.auditNo=self.add.auditPerson.no;
         	self.add.requestAuditPersonEmail=self.add.auditPerson.email;
         	self.add.auditPerson=self.add.auditPerson.name;
        }
        var url = globalConfig.basePath+"/splash/addSplashConfig";
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                self.search.productChannel = self.add.productChannel;
                self.add = {};
                $('#addShow').hide();
                $scope.rDictList="";
                $scope.rPositionDictList="";
                //$("#all").attr("checked",false);
                $('#all').attr("checked","checked");
                $("#white").attr("checked",false);
                $("#black").attr("checked",false);
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    }
    //添加开机屏取消
    self.quxiaoScene = function(){
        self.search.productChannel = self.add.productChannel;
        self.add = {};
        $('#addShow').hide();
        $("#all").attr("checked","checked");
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        self.add.onlineTime=null;
        self.add.offlineTime=null;
        self.add.imageUrl=null;
        $scope.rDictList="";
        $scope.rPositionDictList="";
        self.querySplashConfigList(1);
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

    //按渠道类型获取版本列表
    self.getTypeVersionList = function(param){
        self.mediaTypeShow = false;
        self.videoShow = false;
        self.pictureShow = true;
        self.xPictureShow = true;
        var type;
        if(param==0){
            type = 'sys_product_version_wk_start';
        }else if(param==1){
            type = 'sys_product_version_qb_start';
        }else if(param==6){
            type = 'sys_product_version_shop_start';
        }else{
            type = 'sys_product_version_wx_start';
        }
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {

            self.typeVersionList = data.data.resp.result;
            //self.search.productVersion = self.typeVersionList[0].label;
            self.search.productVersion = '';
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });

        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
    };
    
   


    //查看
    self.check = function(id){
        $('#showCheck').show();
        var url = globalConfig.basePath+"/splash/selectByPrimaryKey?id="+id;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        	$scope.selctPageOne(data.data.resp.redirectType);
       	    $scope.selectPageOneByRDict(data.data.resp.pageOne);
       	    /*if(data.data.resp.redirectUrl!=null && data.data.resp.redirectUrl!=""){
       	     data.data.resp.redirectType =2+"";
       	    }*/
       	 data.data.resp.redirectType = data.data.resp.redirectType+"";
            self.openScreen = data.data.resp;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    }

    //查看确定和取消
    self.checkOKAndNO = function () {
        $('#showCheck').hide();
    }

    //修改
    self.update = function(query){
    	 $scope.selctPageOne(query.redirectType);
    	 $scope.selectPageOneByRDict(query.pageOne);
    	self.getEditTypeVersionList(query.productChannel);
        self.videoShow = false;
        self.mediaTypeShow = false;
        self.getEditTypeVersionList(query.productChannel);
        // if(query.productChannel == "1") {
        //     // alert("query.productChannel 1"); 弹窗生效
        //     self.mediaTypeShow = true;
        // }
        self.isMediaTypeShow(query.productChannel, query.productVersion);
        // alert("meiti " + query.mediaType);
        if(query.mediaType == "2") {
            self.videoShow = true;
            self.pictureShow = false;
            self.xPictureShow = false;
            self.imageUrl = query.imageUrl;
            self.videourl = query.videourl;
        } else {
            self.videoShow = false;
            self.pictureShow = true;
            self.xPictureShow = true;
            self.imageUrl=query.imageUrl;
        }
        $('#showUpdate').show();
        self.continuationTypeInfo="";
		self.continuationTypeInfo=query.productVersion;
		$('#showUpdate').show();
	 	self.updateScene={};
	 	query.productChannel=query.productChannel+"";
	 	query.loginStatus = query.loginStatus+"";
	 	query.mediaType = query.mediaType + "";
	 	//self.updateScene={};
	 	query.auditPerson="";
	 	query.redirectType = query.redirectType+"";
	 	query.pageOne = query.pageOne+"";
	 	query.pageTwo = query.pageTwo+"";
	 	self.updateScene=angular.copy(query);
	 	// $("#editselectaddwhiteId").val("");
	 	// $("#editselectaddblackId").val("");
	 	$('#editall').prop("checked",false);//默认全部不选择
	 	$("#editwhite").attr("checked",false);
		$("#editblack").attr("checked",false);
		var sequenceId = query.sequenceId;
		$("#editall").removeAttr("disabled");

		if(query.loginStatus=='0' || query.loginStatus=='2'){
			$("#editall").attr('disabled','disabled');
				$('#editall').prop("checked",true);
			
		}
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
	        // $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	        // $("#editselectaddwhiteId").val("0");
	        $("#editblack").attr('disabled','disabled');
	        // $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	        // $("#editselectaddblackId").val("0");

            self.strategyReloadUpdate();
            setTimeout(function () {
                self.updateScene.whiteMemberListName=query.whiteMemberListName;
                self.updateScene.whiteId = null;
                $('#userNameLikeSearchUpdate').hide();
            },500)
            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.updateScene.blackMemberListName=query.blackMemberListName;
                self.updateScene.blackId = null;
                $('#userNameLikeBlackSearchUpdate').hide();
            },500)
	        
	    	 }else if(query.showType==1){
	    		 $('#editwhite').prop("checked",true);
	             $('#editblack').prop("checked",false);
	             $('#editall').prop("checked",false);
                $('#editblack').removeAttr("disabled");
                $("#editwhite").removeAttr("disabled");
                //修改名单那类型查询
                self.strategyReloadUpdate();
                setTimeout(function () {
	                self.updateScene.whiteMemberListName=query.whiteMemberListName;
	                self.updateScene.whiteId = query.whiteId
                },500)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },500)
	    	 }else if(query.showType==2){
	    		 $('#editblack').prop("checked",true);
	             $('#editwhite').prop("checked",false);
	             $('#editall').prop("checked",false);
                $('#editblack').removeAttr("disabled");
                $("#editwhite").removeAttr("disabled");
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.whiteMemberListName=query.whiteMemberListName;
                    self.updateScene.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },500)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = query.blackId;
                },500)
	    	 }else if(query.showType==3){
	    		 $('#editblack').prop("checked",true);
                 $('#editwhite').prop("checked",true);
                 $('#editall').prop("checked",false);
                $('#editblack').removeAttr("disabled");
                $("#editwhite").removeAttr("disabled");
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.whiteMemberListName=query.whiteMemberListName;
                    self.updateScene.whiteId = query.whiteId
                },500)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = query.blackId;
                },500)


        }

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


    //确认修改
    self.confirmUpdate = function(){
        if(self.updateScene.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        
        var versions = "";
        var length = $('.editversionCheckbox:checked').length;
        var is = 0;
        $('.editversionCheckbox').each(function() {
            if (this.checked == true) {
                if(is==length-1){
                    versions += $(this).val();
                }else{
                    versions += $(this).val() + ",";
                }
                is++;
            }
        });
        if(versions==null || versions==""){
            alert("产品版本不能为空");
            return;
        }else{
            self.updateScene.productVersion = versions;
        }
        

        self.updateScene.imageUrl = $('#fileUrl1').val();
        self.updateScene.imageUrlIphonex = $('#editIphonexFileUrl').val();
        self.updateScene.videoUrl = $("#videoUrl1").val();
        // alert("媒体类型 " + self.updateScene.mediaType);
        if(self.updateScene.mediaType == "2") {
            // self.add.imageUrl=$('#fileUrl').val();
            // if(!self.add.imageUrl) {
            //     alert("视频封面不能为空");
            //     return;
            // }
            if(!self.updateScene.videoUrl) {
                alert("视频不能为空");
                return;
            }
        } else {
            if(self.updateScene.imageUrl==null||self.updateScene.imageUrl==""){
                alert("请选择上传开机屏图片");
                return;
            }
            if(!self.updateScene.imageUrlIphonex){
                alert("请选择上传IphoneX开机屏图片");
                return;
            }
        }


        if(self.updateScene.productChannel == '0' && self.updateScene.redirectType == '2'){
            if(!self.updateScene.redirectUrl){
                alert("跳转链接不能为空");
                return;
            }
        }

        if(self.updateScene.productChannel == '0'){
            if(!self.updateScene.redirectType){
                alert("跳转类型不能为空")
                return;
            }
            /*if(self.updateScene.redirectType == '2' && !self.updateScene.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }*/
            if(self.updateScene.redirectType == '3' && !self.updateScene.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if(self.updateScene.redirectType == '3' && !self.updateScene.pageTwo){
                alert("跳转页面不能为空")
                return;
            }

        }
        self.updateScene.onlineTime = $('#updateOnlineTime').val()+"";
        self.updateScene.offlineTime = $('#updateOfflineTime').val()+"";
        if(self.updateScene.onlineTime==null||self.updateScene.onlineTime==""){
            alert("请选择上线时间");
            return;
        }
        if(self.updateScene.offlineTime==null||self.updateScene.offlineTime==""){
            alert("请选择下线时间");
            return;
        }
        if(self.updateScene.offlineTime<=self.updateScene.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
        if(self.updateScene.displayPeriod != null && self.updateScene.displayPeriod != ""){
            var number = Number(self.updateScene.displayPeriod);
            if(number == null || number < 0 || number > 10 ){
                alert("设置开机屏的展示时间，最长10秒");
                return;
            }
        }else{
            alert("开机屏的展示时间不能为空")
            return;
        }
        if(self.updateScene.valid==null){
            alert("请选择是否生效");
            return;
        }
        /*$('.updateCheckbox').each(function () {
            if(this.checked == true){
                self.updateScene.showType = $(this).val();
            }
        })*/

        if (self.isUpdateRoster == 'Y'){
            var whiteId = $('#memberIdUpdate').val();
            var blackId = $('#memberBlackIdUpdate').val();
            if(isNaN(whiteId)){
                whiteId=null;
            }
            if(isNaN(blackId)){
                blackId=null;
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

        if (self.updateScene.whiteId && self.updateScene.whiteId != ''){
            self.updateScene.whiteName = $("#memberIdUpdate").find("option:selected").text();
        }
        if (self.updateScene.blackId && self.updateScene.blackId != ''){
            self.updateScene.blackName = $("#memberBlackIdUpdate").find("option:selected").text();
        }
        var url = globalConfig.basePath+"/splash/updateByPrimaryKeySelective";
        $http.post(url,self.updateScene).then(
            function(data){
                alert(data.data.message);
                $('#showUpdate').hide();
                $scope.rDictList="";
                $scope.rPositionDictList="";
                if (self.isUpdateRoster == 'Y'){
                    self.isUpdateRoster = 'N';
                }
                self.search.productChannel=self.updateScene.productChannel;
                self.updateScene = {};
                self.querySplashConfigList(1);
                self.u={};
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //取消修改
    self.updateCancel = function(){
        $('#showUpdate').hide();
        if (self.beforeBlackMemberListName && self.beforeBlackMemberListName != ''){
            self.updateScene.blackMemberListName = self.beforeBlackMemberListName;
        }
        if (self.beforeWhiteMemberListName && self.beforeWhiteMemberListName != ''){
            self.updateScene.whiteMemberListName = self.beforeWhiteMemberListName;
        }
        if (self.beforeBlackId && self.beforeBlackId != 0){
            self.updateScene.blackId = self.beforeBlackId;
        }
        if (self.beforeWhiteId && self.beforeWhiteId != 0){
            self.updateScene.whiteId = self.beforeWhiteId;
        }
        if (self.beforeBlackName && self.beforeBlackName != ''){
            self.updateScene.blackName = self.beforeBlackName;
        }
        if (self.beforeWhiteName && self.beforeWhiteName != ''){
            self.updateScene.whiteName = self.beforeWhiteName;
        }
        if (self.isUpdateRoster == 'Y'){
            self.isUpdateRoster = 'N';
        }


        self.search.productChannel=self.updateScene.productChannel;
        self.updateScene = {};
        self.querySplashConfigList(1);
        $scope.rDictList="";
        $scope.rPositionDictList="";
        self.u={};
    }

    //生效失效开机屏
    self.start = function(id,valid){
        $('#showStart').show();
        self.start.startValid=valid;
        self.start.id = id;
    }

    //确定失效生效开机屏
    self.confirmStart = function(id,valid){
        if(valid==0){
            valid=1;
        }else if(valid==1){
            valid=0;
        }
        var url = globalConfig.basePath+"/splash/takeEffect?id="+id+"&valid="+valid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            $('#showStart').hide();
            self.querySplashConfigList(1);
        }, function errorCallback(response) {
            alert("失败....");
        });
    }

    //取消生效失效开机屏
    self.cancelStart = function(){
        $('#showStart').hide();
        self.querySplashConfigList(1);
    }


    //优先级排序
    self.stort = function(){
        // var ids="";
        // $('.listChecked').each(function(){
        //     if(this.checked == true){
        //         ids += $(this).val() + ",";
        //     }
        // })
        // if(ids == "" ||ids == null){
        //     alert("请选择要排序的对象");
        //     return;
        // }
        var productChannel = self.search.productChannel;
        var productVersion = self.search.productVersion;
        var loginStatus = self.search.loginStatus;
        var status = self.search.status;//上线状态
        if(!productVersion){
            
            alert("请在查询条件中选择产品版本");
            return;
        }
        if(productChannel=="0"){
        	var type = "sys_wk_splash_value";
        	self.getShowValue(type);
        }
        
        $('#showPriority').show();
        var url = globalConfig.basePath+"/splash/selectByPrimaryIds?productChannel="+productChannel+"&productVersion="+productVersion+"&status="+status+"&loginStatus="+loginStatus;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            self.strotList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
    }

    self.rDict="";
    self.getShowValue = function(type){
    	  var url = globalConfig.basePath+"/rDict/getShowPageValue?resourceType="+type;
          $http({
              method: 'GET',
              url: url,
          }).then(function successCallback(data) {
        	  self.rDict = data.data.resp;
          }, function errorCallback(response) {
              // 请求失败执行代码
              alert("获取数据失败....");
          });
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
                 if(type=='S'){
                    var me =$(this).val()-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move1 = self.strotList[me-1];
                     self.strotList[me-1] = self.strotList[me];
                     self.strotList[me] = move1;
                     self.strotList[me-1].priority = self.strotList[me-1].priority-1;
                     self.strotList[me].priority =self.strotList[me].priority+1;
                 }else if(type=='X'){
                     var me =$(this).val()-1;
                     if(me==length-1){
                         alert("已经最后了,还要往那移");
                         return;
                     }
                     var move1 = self.strotList[me+1];
                     self.strotList[me+1] = self.strotList[me];
                     self.strotList[me] = move1;
                     self.strotList[me+1].priority = self.strotList[me+1].priority+1;
                     self.strotList[me].priority =self.strotList[me].priority-1;
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
        var url = globalConfig.basePath+"/splash/moveCommit";
        $http.post(url,self.strotList).then(
            function(data){
                alert(data.data.message);
                $('#showPriority').hide();
                self.strotList = {};
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //排序取消
    self.moveCancel = function(){
        $('#showPriority').hide();
        self.checked.id = false;
        $('.listChecked').each(function () {
            this.checked = false;
        });
        self.strotList={};
    }

    //默认查询
    self.loading = function(){
        self.search.productChannel = "0";
        // self.search.productVersion = "3.0";
        self.search.pageSize = "5";
        self.querySplashConfigList(1);
    }

    //全选
    self.checkALL = function () {
        if (self.checked.id) {
            $('.listChecked').each(function () {
                this.checked = true;
            });
        } else {
            $('.listChecked').each(function () {
                this.checked = false;
            });

        }

    }

    //修改全部选中事件
    self.allSelect = function(){
        $("#baimingdan").attr("checked",false);
        $("#heimingdan").attr("checked",false);
        if($('#quanbu').is(':checked')){
            $("#baimingdan").attr('disabled','disabled');
            $("#heimingdan").attr('disabled','disabled');
            self.updateScene.whiteId = '0';
            self.updateScene.blackId = '0';
        }
        else {
            $("#baimingdan").removeAttr('disabled','disabled');
            $("#heimingdan").removeAttr('disabled','disabled');
        }
    }

    //修改白名单
    self.baiClick = function(){
    	$("select option").removeClass("ng-hide");
        if($('#baimingdan').is(':checked')){
            $('#bDropDown').removeAttr('disabled','disabled');
        }else{
            self.updateScene.whiteId = '0';
            $("#bDropDown").attr('disabled','disabled');
        }
    }
    //修改黑名单
    self.heiClick = function(){
    	$("select option").removeClass("ng-hide");
        if($('#heimingdan').is(':checked')){
            $('#heiSelect').removeAttr('disabled','disabled');
        }else{
            self.updateScene.blackId = '0';
            $("#heiSelect").attr('disabled','disabled');
        }
    }

    //添加全部选中事件
    self.complete = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
        }
        else {
            $("#white").removeAttr('disabled','disabled');
            $("#black").removeAttr('disabled','disabled');
        }
    }

    //添加白名单
    self.baiChecked = function(){
        if($('#white').is(':checked')){
            $('#whiteID').removeAttr('disabled','disabled');
        }else{
            self.add.whiteId = '';
            $("#whiteID").attr('disabled','disabled');
        }
    }
    //添加黑名单
    self.blackClick = function(){
        if($('#black').is(':checked')){
            $('#blackSelect').removeAttr('disabled','disabled');
        }else{
            self.add.blackId = '';
            $("#blackSelect").attr('disabled','disabled');
        }
    }


    //按渠道类型获取版本列表
    self.getSearchTypeVersionList = function(param){
        var type;
        if(param==0){
            type = 'sys_product_version_wk_start';
        }else if(param==1){
            type = 'sys_product_version_qb_start';
        }else{
            type = 'sys_product_version_wx_start';
        }
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {

            self.typeVersionList = data.data.resp.result;
           // self.search.productVersion = self.typeVersionList[0].label;
            self.search.productVersion = '';
            self.loading();
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    self.getSearchTypeVersionList(0);
    //self.getTypeVersionList(0);
    //self.loading();
    
    //改变登录状态已登录
    self.loginClick = function(){
        if($('#login').is(':checked')){
        	self.logout = false;
        	self.login =  true;
        	$("#all").removeAttr('disabled','disabled');
        }
    }
    //改变登录状态未登录
    self.logoutClick = function(){
    	if($('#logout').is(':checked')){
    		self.login = false;
    		self.logout = true;
    		self.allxx = true;
    		self.add.whiteTrue = false;
    		self.add.blackTrue = false;
            $("#all").attr('disabled','disabled');
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
            self.add.whiteId = '';
            $("#whiteID").attr('disabled','disabled');
            self.add.blackId = '';
            $("#blackSelect").attr('disabled','disabled');
            
           /* $('#white').prop("checked",false);
            $('#black').prop("checked",false);*/
        }
    }
    
    //修改改变登录状态已登录
    self.loginEditClick = function(){
        if($('#loginEdit').is(':checked')){
        	$scope.logoutEdit = false;
        	$scope.loginEdit =  true;
        	$("#quanbu").removeAttr('disabled','disabled');
        }
    }
    //修改改变登录状态未登录
    self.logoutEditClick = function(){
    	if($('#logoutEdit').is(':checked')){
        	$scope.loginEdit = false;
        	$scope.logoutEdit = true;
        	$scope.u.quanbuClick = true;
        	$("#quanbu").attr('disabled','disabled');
        	$("#baimingdan").attr('disabled','disabled');
            $("#heimingdan").attr('disabled','disabled');
            $("#bDropDown").attr('disabled','disabled');
            $("#heiSelect").attr('disabled','disabled');
            $scope.updateScene.whiteId = '0';
            $scope.updateScene.blackId = '0';
            $("#baimingdan").attr("checked",false);
            $("#heimingdan").attr("checked",false);


        }
    }
    
    // 登陆选择
    self.addLoginStatus = function(param){
    		if(param==''){
    			alert("非法操作!");
    			return false;
    		}

        var addVersionLabel = $("#addVersionLabel").val();
        if(self.add.productChannel == '0' && addVersionLabel =='4.0' && self.add.loginStatus == '2'){
            self.mediaTypeShow = true;
        }else{
            self.mediaTypeShow = false;
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
            }
        }
    }
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
        var url = globalConfig.basePath+"/splash/auditing";
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
    
    
    //****************修改*******************
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
    self.getEditTypeVersionList = function(param){
        var type;
        if(param==0){
            type = 'sys_product_version_wk_start';
        }else if(param==1){
            type = 'sys_product_version_qb_start';
        }else if(param==6){
            type = 'sys_product_version_shop_start';
        }else{
            type = 'sys_product_version_wx_start';
        }
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {

            self.edittypeVersionList = data.data.resp.result;
            self.updateScene.productVersion = self.typeVersionList[0].label;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };

    
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
   	
   	
    // 登陆选择
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
            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");  
            $("#editblack").attr('disabled','disabled');
            $('#editblack').prop("checked",false);
            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
            $("#editselectaddblackId").val("0");
	            
    		}else{
    			$("#editall").removeAttr("disabled");  
	 			if($('#editall').is(':checked')){
	 	            $("#editwhite").attr('disabled','disabled');
	 	            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	 	            $("#editselectaddwhiteId").val("0");  
	 	            $("#editblack").attr('disabled','disabled');
	 	            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	 	            $("#editselectaddblackId").val("0");  
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

    }
    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
    	   record.requestAuditDescription="";
       $scope.effectRecord = record;
       
       $scope.effectRecord.auditPerson={};
       self.effectRecord.auditPerson.no='';
       $('#takeEffect').show();
    };
    
    
    $scope.validateRecord = function(){
    	  // 审核人
       // var auditPerson = self.effectRecord.auditPerson;
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
    	
    		var url = globalConfig.basePath+"/splash/takeEffectNew";
        $http.post(url,self.effectRecord).then( function(data){
        	 $('#takeEffect').hide();
            	if(data.data.code == '000'){   
            		alert(data.data.message);
            		$scope.querySplashConfigList(1);
            	}
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //获取一级页面
    $scope.selctPageOne =function(rType){
        if(rType=='3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }
    }

    //获取二级页面-add
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

    //获取二级页面-update
    $scope.selectPageOneByRDict2 = function(v){
        var type = "wk_protogenesis_page_two";
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.rPositionDictList = data.resp.result;
            if($scope.rPositionDictList.length=='1'){
                $scope.updateScene.pageTwo=data.resp.result[0].value;
            }else{
                $scope.updateScene.pageTwo=data.resp.result[0].value;
            }
        })

    }

    //点击选择版本
    $scope.clickVersionCheckbox = function(productVersion, obj) {
        self.isMediaTypeShow(obj.productChannel, productVersion);
        self.videoShow = false;
        self.pictureShow = true;
        self.xPictureShow = true;
        obj.mediaType = "1";
    }

    /**
     * 是否显示 mediaType
     *
     * @param productChannel
     * @param version
     */
    self.isMediaTypeShow = function (productChannel, productVersion) {
        if (productChannel == "0") {
            self.mediaTypeShow = true;
        } else {
            self.mediaTypeShow = false;
        }
    }

    /**
     * 是否显示视频
     */
    self.changeMediaType = function (mediaType) {
        if (mediaType == "2") {
            self.videoShow = true;
            self.pictureShow = false;
            self.xPictureShow = false;
            $('#fileUrl').prop("value", "");
            $('#image_prew').prop("src", "");
            $('#fileUrl1').prop("value", "");
            $('#image_prew1').prop("src", "");
        } else {
            self.videoShow = false;
            self.pictureShow = true;
            self.xPictureShow = true;
            $('#fileUrl').prop("value", "");
            $('#image_prew').prop("src", "");
            $('#fileUrl1').prop("value", "");
            $('#image_prew1').prop("src", "");
        }
    }


    //region 白名单查询
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
        if(self.add.productChannel==0 || self.add.productChannel==2){
            channelCode='WK';
        }else if(self.add.productChannel==1){
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
            $('#memberId').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.add.whiteMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strChannelGroups = data.data.resp;
                        console.log(self.strChannelGroups,"名单集合");
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


    //region 黑名单查询
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
        if(self.add.productChannel==0 || self.add.productChannel==2){
            channelCode='WK';
        }else if(self.add.productChannel==1){
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

    self.toUpdateRoster = function () {
        self.isUpdateRoster = 'Y';
        self.memberUpdateCount="";
        self.memberBlackUpdateCount="";
        $("#editall").attr('disabled',false);

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

    self.upFindChannelGroups = function () {
        self.findChannelGroupsUpdate();
    }

    self.upBlackFindChannelGroups = function () {
        self.findBlackChannelGroupsUpdate();
    }





}]);
