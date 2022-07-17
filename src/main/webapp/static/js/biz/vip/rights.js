'use strict';
var App = angular.module('rightsApp', [], angular.noop);
App.controller("rightsController", ['$scope','$http',  function ($scope,$http) {
	$scope.operationType = 0;
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '0';
    $scope.search.pageSize = $("#pageSize").val();
   // $scope.search.status = '2';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    $scope.qbRights = [{"val":"0","text":"lv0"},{"val":"1","text":"lv1"},{"val":"2","text":"lv2"},{"val":"3","text":"lv3"},{"val":"4","text":"lv4"},{"val":"5","text":"lv5"}];
    $scope.wkRights = [{"val":"100","text":"lv0"},{"val":"101","text":"lv1"},{"val":"102","text":"lv2"},{"val":"103","text":"lv3"},{"val":"104","text":"lv4"},{"val":"105","text":"lv5"}];
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
    	$('#addPicture1').fileupload({
        autoUpload: true,// 是否自动上传
        url: url,// 上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {// 设置文件上传完毕事件的回调函数
            console.log(data.result);
             var fileUrl = data.result.resp;
            $('#fileUrl1').prop("value",fileUrl);
             $('#image_prew1').prop("src",fileUrl);
             swal("上传成功")
        }
    	}).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                swal("出错了", "请上传图片文件", "error");
                return;
            }
        }
    	});
    	
    	$('#addPicture2').fileupload({
            autoUpload: true,// 是否自动上传
            url: url,// 上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {// 设置文件上传完毕事件的回调函数
                console.log(data.result);
                 var fileUrl = data.result.resp;
                $('#fileUrl2').prop("value",fileUrl);
                 $('#image_prew2').prop("src",fileUrl);
                 swal("上传成功")
            }
        	}).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    swal("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });
    	
    	$('#addPicture3').fileupload({
            autoUpload: true,// 是否自动上传
            url: url,// 上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {// 设置文件上传完毕事件的回调函数
                console.log(data.result);
                 var fileUrl = data.result.resp;
                $('#fileUrl3').prop("value",fileUrl);
                 $('#image_prew3').prop("src",fileUrl);
                 swal("上传成功")
            }
        	}).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    swal("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });
    });
    
    
   
    $scope.radioChange = function(rad){
    	$scope.add.whitelist = rad +'';
    	if(rad=="T"){
    		$('#whiteID').removeAttr('disabled','disabled');
    		document.getElementById("white").checked=true
    	}else{
    		$('#whiteID').attr('disabled','disabled');
    		$scope.add.whiteId = "";
    		document.getElementById("quanbu").checked=true
    	}
    };
    // 开机屏查询
    $scope.pageQueryRights = function(pageNum){
    	$scope.auditStatus = $scope.search.status;
    	/*
		 * if($scope.pages<pageNum&&pageNum!=1){ return; }
		 */
        if(!pageNum){
        	$scope.search.pageNum = $scope.pageNum;
        } else {
            $scope.search.pageNum = pageNum;
        }
        var url = globalConfig.basePath+"/vip/Rights/list";
        $http.post(url,$scope.search).then(
            function(data){
                if(data.data.code=='000'){
                	$scope.pageList = data.data.resp.result;
                	$scope.total = data.data.resp.totalRowSize;
                	$scope.pages = data.data.resp.pageCount;
                	// if($scope.pages<pageNum);
                	// $scope.search.pageNum = $scope.pages;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    

    // 重置
    $scope.reset = function(){
    	var num = $scope.search.pageNum;
    	var size = $scope.search.pageSize;
    	$scope.search={};
    	$scope.search.pageNum = num;
    	$scope.search.pageSize = size;
    	$scope.search.productChannel = '0';
    	$scope.search.status = '';
    	// $scope.getSearchVersionList("sys_product_version_wk_float");
    	$('input[name="queryOnlineTime"]').val('');
    	// $scope.search.productVersion = $scope.typeVersionList[0].label;
    }
    
    // 按渠道类型获取版本列表
    $scope.getTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeVersionList = data.data.resp.result;
        // $scope.search.productVersion = $scope.typeVersionList[0].label;
        $scope.search.productVersion = '';
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    // 按渠道类型获取版本列表-查询
/*
 * $scope.getSearchTypeVersionList = function(type){ var url =
 * globalConfig.basePath+"/rDict/getVersionByType?type="+type; $http({ method:
 * 'GET', url: url, }).then(function successCallback(data) {
 * 
 * $scope.typeVersionList = data.data.resp.result;
 * //$scope.search.productVersion = $scope.typeVersionList[0].label;
 * $scope.search.productVersion = ''; $scope.pageQueryRights(1); }, function
 * errorCallback(response) { // 请求失败执行代码 alert("获取版本列表失败了...."); }); };
 */   
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQueryRights(1);
    });
    
   /*
	 * $("#searchProductChannel").change(function(){ var channel =
	 * $("#searchProductChannel").val(); if(channel==0){
	 * $scope.getSearchTypeVersionList("sys_product_version_wk_float"); }else
	 * if(channel==1){
	 * $scope.getSearchTypeVersionList("sys_product_version_qb_float"); }else{
	 * $scope.getSearchTypeVersionList("sys_product_version_wx_float"); } });
	 */
    
    /*
	 * $("#addProductChannel").change(function(){ var channel =
	 * $("#addProductChannel").val(); if(channel==0){
	 * $scope.getAddTypeVersionList("sys_product_version_wk_float"); }else
	 * if(channel==1){
	 * $scope.getAddTypeVersionList("sys_product_version_qb_float"); }else{
	 * $scope.getAddTypeVersionList("sys_product_version_wx_float"); } });
	 */
    
   /*
	 * $scope.getTypeVersion = function(channel){ if(channel==0){
	 * $scope.getTypeVersionList("sys_product_version_wk_float"); }else
	 * if(channel==1){
	 * $scope.getTypeVersionList("sys_product_version_qb_float"); }else{
	 * $scope.getTypeVersionList("sys_product_version_wx_float"); } };
	 * 
	 * $scope.getSearcjTypeVersion = function(channel){ if(channel==0){
	 * $scope.getTypeVersionList("sys_product_version_wk_float"); }else
	 * if(channel==1){
	 * $scope.getTypeVersionList("sys_product_version_qb_float"); }else{
	 * $scope.getTypeVersionList("sys_product_version_wx_float"); } };
	 */
    // 获取全部版本列表
    /*
	 * $scope.getAllVersionList = function(type){ var url =
	 * globalConfig.basePath+"/rDict/getAllVersion"; $http({ method: 'GET', url:
	 * url, }).then(function successCallback(data) {
	 * 
	 * $scope.allVersionList = data; }, function errorCallback(response) { //
	 * 请求失败执行代码 alert("获取版本列表失败了...."); }); }; $scope.getAllVersionList();
	 */
    $scope.selected = [] ;  
    
    $scope.isChecked = function(id){  
        return $scope.add.productVersion.indexOf(id) >= 0 ;  
    } ;  
      
    $scope.updateSelection = function($event,id){  
        var checkbox = $event.target ;  
        var checked = checkbox.checked ;  
        if(checked){  
            $scope.add.productVersion.push(id) ;  
        }else{  
            var idx = $scope.add.productVersion.indexOf(id) ;  
            $scope.add.productVersion.splice(idx,1) ;  
        }  
    } ;
    $scope.wbSelected = [] ;  
    
    $scope.isWbChecked = function(id){  
        return $scope.wbSelected.indexOf(id) >= 0 ;  
    } ;  
      
    $scope.updateWbSelection = function($event,id){  
        var checkbox = $event.target;  
        var checked = checkbox.checked;  
        if(checked){  
        	$scope.wbSelected.push(id);
        	
        }else{  
            var idx = $scope.wbSelected.indexOf(id);  
            $scope.wbSelected.splice(idx,1);
        }
       
    } ; 
    // 查询黑白名单列表
    $scope.queryWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
            	$scope.blackList_qb = data.data.resp.black_qb;
            	$scope.blackList_wk = data.data.resp.black_wk;
            	$scope.whiteList_qb = data.data.resp.white_qb;
            	$scope.whiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    
    $scope.queryWhiteAndBlack();
   // 添加
    $scope.addRights = function(){
    	$scope.add = {};
        $scope.add.whitelist='F';
        $scope.add.productChannel='0';
        $scope.operationType=2;



    }
    
    // 添加
    $scope.closeAddRights = function(){    
        $('#addRights').hide();

    }
    
    $scope.saveRights = function(){
    	if($scope.add.productChannel==null||$scope.add.productChannel==""){
            alert("渠道不能为空");
            return;
        }
    	$scope.add.icon = $('#fileUrl1').val();
        if($scope.add.icon==null||$scope.add.icon==""){
            alert("请上传未登录icon图片");
            return ;
        }
        $scope.add.grayDisplayImg = $('#fileUrl2').val();
        if($scope.add.grayDisplayImg==null||$scope.add.grayDisplayImg==""){
            alert("请上传未亮起icon图片");
            return ;
        }
        if($scope.add.priName==null||$scope.add.priName==""){
            alert("请填写权益主标题");
            return ;
        }
        if($scope.add.priSubName==null||$scope.add.priSubName==""){
            alert("请填写权益副标题");
            return ;
        }
        if($scope.add.jumpLink==null||$scope.add.jumpLink==""){
            alert("请填写跳转链接");
            return ;
        }
        var level = "";
        if($scope.add.productChannel!=1){
        	 $('.rightsCheckbox').each(function() {
                 if (this.checked == true) {
                 	level += $(this).val() + ",";
                 }
             });
        	 if(level!=""){
        		 level = level.substr(0,level.length-1);
        	 }
        }else{
        	level = $("input[name='vipLevel']:checked").val();
        }
            
       
        if(level==""){
            alert("请选择权益对象");
            return;
        }else{
        	$scope.add.equityObject = level;
        }
        if($scope.add.introduction==null||$scope.add.introduction==""){
            alert("请填写权益介绍");
            return ;
        }
        if($scope.add.toppingTitle==null||$scope.add.toppingTitle==""){
            alert("请填写置顶权益主标题");
            return ;
        }
        if($scope.add.toppingSubTitile==null||$scope.add.toppingSubTitile==""){
            alert("请填写置顶权益副标题");
            return ;
        }
        $scope.add.toppingImg = $('#fileUrl3').val();
        if($scope.add.toppingImg==null||$scope.add.toppingImg==""){
            alert("请上传icon图片");
            return ;
        }
    	if($scope.add.whitelist=="T"){
    		if($scope.add.whitelistId==null||$scope.add.whitelistId==""){
    		    alert("请选择白名单");
    			return;
    		}
    	}
    	// alert($scope.add.whitelistId);
        // alert($scope.add.whitelist);
        
        // TODO 续投类型选项
        var auditPerson = $scope.add.auditPerson;
        // 审核人
        if(!$scope.add.auditPerson||$scope.add.auditPerson==""||$scope.add.auditPerson==undefined){
            alert("审核人不能为空");
            return ;
        }else{
        	$scope.add.auditNo=$scope.add.auditPerson.no;
        	$scope.add.requestAuditPersonEmail=$scope.add.auditPerson.email;
        	$scope.add.auditPerson=$scope.add.auditPerson.name;
        }
        
        var url = globalConfig.basePath+"/vip/Rights/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                	$scope.operationType=0;
                    $scope.add = {};
                    $scope.add.whitelist='F';
                    $scope.add.productChannel='0';
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                }else{
                    alert(data.data.message)
                }
                $scope.pageQueryRights(1); 
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    
  // 修改-按渠道类型版本登陆状态获取位置列表
    $scope.getEditPositionList = function(){
    	if($scope.operationRecord.productVersion==undefined){
    		return;
    	}
    	var versions = "";
        $('.updateVersionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(versions==""){
        	$scope.editPositionsList = [];
   		    $scope.operationRecord.position = '';
            return;
        }
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.operationRecord.productChannel + "&productVersion=" + versions + "&loginStatus=" + $scope.operationRecord.loginStatus + "&resourceType=sys_float";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.editPositionsList = data.data.resp.result;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取位置列表失败了....");
        });
        
    };
    $scope.u={}
    // 修改
    $scope.editRights = function(float){
    	 $scope.u={}
    	 /*
			 * if(float.showType==0){ $('#allBox').prop("checked",true);
			 * $('#whiteBox').prop("checked",false);
			 * $('#blackBox').prop("checked",false); }else
			 * if(float.showType==1){ $('#whiteBox').prop("checked",true);
			 * $('#blackBox').prop("checked",false);
			 * $('#allBox').prop("checked",false); }else if(float.showType==2){
			 * $('#blackBox').prop("checked",true);
			 * $('#whiteBox').prop("checked",false);
			 * $('#allBox').prop("checked",false); }else if(float.showType==3){
			 * $('#blackBox').prop("checked",true);
			 * $('#whiteBox').prop("checked",true);
			 * $('#allBox').prop("checked",false); }
			 */
    	 var type;
    	 if(float.productChannel==0||float.productChannel==2){
    	    type = "sys_product_version_wk_float";
    	 }
    	 if(float.productChannel==1){
    	   	type = "sys_product_version_qb_float";
    	 }
    	 var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
         $http({
             method: 'GET',
             url: url,
         }).then(function successCallback(data) {
         
         	$scope.editTypeVersionList = data.data.resp.result;
         	// $scope.search.productVersion = $scope.typeVersionList[0].label;
         	var versions = float.productVersion.split(",");
       	 for(var i=0;i<versions.length;i++){
       		 $('.updateVersionCheckbox').each(function() {
                    if ($(this).val() == versions[i]) {
                   	 $(this).prop("checked",true);
                    }
               });
       	 }
       	 float.valid = float.valid+"";
       	 float.whiteId = float.whiteId+"";
       	 float.blackId = float.blackId+"";
       	 float.loginStatus = float.loginStatus+"";
       	 float.position = float.position + '';
       	 $scope.queryWhiteAndBlack();
       	
       	 float.productChannel=float.productChannel+"";
       	 $("#upProductChannel").val(float.productChannel);
       	 if(float.loginStatus == 1){
       		$scope.logoutEdit = false;
            	$scope.loginEdit =  true;
       	 }else{
       		$("#quanbu").attr('disabled','disabled');
       		$scope.logoutEdit = true;
            	$scope.loginEdit =  false;
       	 }	 
       	 var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
            if(float.showType == 0){
                $scope.u.quanbuClick = true;
                $("#baimingdan").attr('disabled','disabled');
                $("#heimingdan").attr('disabled','disabled');
                $('#quanbu').attr('disabled','disabled');
                if(float.loginStatus == 1){
               	 $('#quanbu').removeAttr('disabled','disabled');
                }
                $("#bDropDown").attr('disabled','disabled');
                $("#heiSelect").attr('disabled','disabled');
            }else if(float.showType == 1){
           	 $("#baimingdan").removeAttr('disabled','disabled');
           	 $("#heimingdan").removeAttr('disabled','disabled');
           	 $("#bDropDown").removeAttr('disabled','disabled');
                $scope.u.baimingdClick = true;
            }else if(float.showType == 2){
            	 $("#baimingdan").removeAttr('disabled','disabled');
           	 $("#heimingdan").removeAttr('disabled','disabled');
           	 $("#heiSelect").removeAttr('disabled','disabled');
                $scope.u.heimingdanClick = true;
            }else if(float.showType == 3){
           	 $("#baimingdan").removeAttr('disabled','disabled');
           	 $("#heimingdan").removeAttr('disabled','disabled');
           	 $("#bDropDown").removeAttr('disabled','disabled');
                $("#heiSelect").removeAttr('disabled','disabled');
                $scope.u.baimingdClick = true;
                $scope.u.heimingdanClick = true;
            }
           
            var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.operationRecord.productChannel + "&productVersion=" + $scope.operationRecord.productVersion + "&loginStatus=" + $scope.operationRecord.loginStatus + "&resourceType=sys_float";
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
            
            	$scope.editPositionsList = data.data.resp.result;
            	
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取位置列表失败了....");
            });
         	
         }, function errorCallback(response) {
             // 请求失败执行代码
             alert("获取版本列表失败了....");
         });
    	
    }
    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    
    // 保存修改
    $scope.saveEditRights = function(){
    	/*
		 * if($scope.operationRecord.productChannel==null){ alert("渠道不能为空");
		 * return; }
		 */
    	var versions = "";
        $('.updateVersionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(versions==""){
            alert("产品版本不能为空");
            return;
        }else{
        	$scope.operationRecord.productVersion = versions;
        }
        
        if($scope.operationRecord.position==""){
            alert("请选择浮标位置");
            return;
        }else{
        	$scope.operationRecord.positionName = $('#editPosition').find("option:selected").text();
        }
    	/*
		 * var loginEdit = $("#loginEdit").prop("checked"); var logoutEdit =
		 * $("#logoutEdit").prop("checked"); if(!loginEdit&&!logoutEdit){
		 * alert('请选择登录状态'); return; } if(loginEdit){
		 * $scope.operationRecord.loginStatus = 1; }else{
		 * $scope.operationRecord.loginStatus = 0; }
		 */
        $scope.operationRecord.imageUrl = $('#fileUrl1').val();
        if($scope.operationRecord.imageUrl==null||$scope.operationRecord.imageUrl==""){
            alert("请选上传图片");
            return ;
        }
        if($scope.operationRecord.redirectUrl==null){
            alert("请填写跳转链接");
            return ;
        }
        $scope.operationRecord.onlineTime = $('#operationOnlineTime').val()+"";
        $scope.operationRecord.offlineTime = $('#operationOfflineTime').val()+"";
        if($scope.operationRecord.onlineTime==null||$scope.operationRecord.onlineTime==""){
            alert("请选择上线时间");
            return;
        }
        if($scope.operationRecord.offlineTime==null||$scope.operationRecord.offlineTime==""){
            alert("请选择下线时间");
            return;
        }
        if($scope.operationRecord.offlineTime<=$scope.operationRecord.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
        var offlineTime =$scope.operationRecord.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime="23:59:59";
        $scope.operationRecord.offlineTime = offlineTimes[0]+" "+miniTime;
        /*
		 * var count = 0; $('.updateCheckbox').each(function () {
		 * if(this.checked == true){ $scope.operationRecord.showType =
		 * $(this).val(); count++; } })
		 */
        var all = $("#quanbu").prop("checked");
        if(all){
            $scope.operationRecord.showType = 0;
        }else{
            var white = $("#baimingdan").prop("checked");
            var black = $("#heimingdan").prop("checked");
            if(white&&black){
                $scope.operationRecord.showType = 3;
                if(($scope.operationRecord.blackId==""||$scope.operationRecord.blackId==undefined||$scope.operationRecord.blackId==0)||($scope.operationRecord.whiteId==""||$scope.operationRecord.whiteId==undefined||$scope.operationRecord.whiteId==0)){
        			alert('请选择黑白名单');
            		return;	
        		}
            }else{
                if(white){
                    $scope.operationRecord.showType = 1;
                    if($scope.operationRecord.whiteId==""||$scope.operationRecord.whiteId==undefined||$scope.operationRecord.whiteId==0){
            			alert('请选择白名单');
                		return;	
            		}
                }else if(black){
                    $scope.operationRecord.showType = 2;
                    if($scope.operationRecord.blackId==""||$scope.operationRecord.blackId==undefined||$scope.operationRecord.blackId==0){
            			alert('请选择黑名单');
                		return;	
            		}
                }else{
                    alert('请选择展示人群');
                    return;
                }
            }
        }
        // TODO 续投类型选项
        var auditPerson = $scope.operationRecord.auditPerson;
        // 审核人
        if(!$scope.operationRecord.auditPerson){
            alert("审核人不能为空");
            return ;
        }else{
        	$scope.operationRecord.auditNo=$scope.operationRecord.auditPerson.no;
        	$scope.operationRecord.requestAuditPersonEmail=$scope.operationRecord.auditPerson.email;
        	$scope.operationRecord.auditPerson=$scope.operationRecord.auditPerson.name;
        }
    	
        var url = globalConfig.basePath+"/float/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                    $('#editRights').hide();
                    $scope.operationRecord = {};
                    $scope.pageQueryRights(1);
                    $scope.u={};
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    
    /**
	 * 操作前的预处理
	 * 
	 * @param opType
	 * @param record
	 */
    $scope.preOperate = function(opType,record){
        if(opType == 1){
            // $scope.operationType = 2;
        	// $('.look-start-box').show()
            $("#detailRights").show();
            $scope.detail = angular.copy(record);
        } else if(opType == 2){
            // $scope.operationType = 1;
            $('#editRights').show();
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord.auditPerson="";
            $scope.editRights($scope.operationRecord);
        } else if(opType == 3){
            $scope.effectRecord = record;
            $('#takeEffect').show();
        }
    };
   
    // 生效、失效
    $scope.validateRecord = function(x){
        // 保存数据
    	if($scope.validConfirmUser==""||$scope.validConfirmUser==null||$scope.validConfirmUser==undefined){
    		alert('请选择审核人');
    		return;
    	}else{
    		$scope.effectRecord.auditPerson = $("#validConfirmUser").find("option:selected").text();
    		var array = $scope.validConfirmUser.split('-')
    		// $scope.effectRecord.auditEmail = array[1];
    		$scope.effectRecord.auditNo = array[0];
    	}
    	$scope.effectRecord.requestAuditDescription = $scope.requestAuditDescription;
        var url = null;
        url = globalConfig.basePath+"/vip/Rights/invalid";
        /*
		 * if($scope.effectRecord.delFlag=='T'){ url =
		 * globalConfig.basePath+"/vip/Rights/valid"; } else { url =
		 * globalConfig.basePath+"/vip/Rights/invalid"; }
		 */
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
            	$scope.pageQueryRights(1);
                $('.take-start-box').hide();
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
   

    
    $('.input-date').datepicker({
        language: 'zh-CN',
        startView: 3,
        autoclose: true,
        todayBtn: "linked",
        format: "yyyy-mm-dd"
    });
    $('.input-datetime').datetimepicker({
    	 format: 'yyyy-mm-dd hh:ii:ss',
    	language: 'zh-CN',   
    	timeText: '时间',
        hourText: '小时',
        minuteText: '分钟',
        secondText: '秒',
        currentText: '现在',
        closeText: '完成'
    });
    
    $scope.queryUserList = function(){
        var url = globalConfig.basePath+"/otc/memberEnjoy/getAuditPersionList";
        $http.get(url).then(
            function(data){
                if(data.data.code=='000'){
                	$scope.userList = data.data.resp;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求审核人列表失败了....");
            }
        );
    };
    $scope.queryUserList();
    // 审批
    $scope.audit = function(record){
    	if(record.auditStatus != "0"){
    		alert('只能对待审核状态的数据进行操作');
    		return;	
    	 }
    	$scope.auditStatus = "1";
    	$('.examine-box').show();
    	$scope.confirmRecord = angular.copy(record);
    // $scope.auditStatus = "2";
    	$scope.auditDescription = "";
    	
    };

    // 审核
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/vip/Rights/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
            	$scope.pageQueryRights(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    
	$scope.pageQueryRights();
	 // $scope.getSearchTypeVersionList("sys_product_version_wk_float");
}]);