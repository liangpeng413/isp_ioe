'use strict';
var App = angular.module('floatApp', [], angular.noop);
App.controller("floatController", ['$scope','$http',  function ($scope,$http) {
    var self = $scope;
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.showType='';
    $scope.search.productChannel = '0';
    $scope.search.loginStatus = '';
    $scope.search.auditStatus = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    $scope.redirectType0 = '';
    self.isUpdateRoster = 'N';
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
    	$('#addPicture').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|avi)$/i,
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
            alert("上传成功");
        }
    	}).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                alert("出错了", "请上传图片文件", "error");
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
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        	});
    });
    
    //开机屏查询
    $scope.pageQueryFloat = function(pageNum){
 
    	if($scope.pages<pageNum&&pageNum!=1){
    	    return;
    	}
        if(!pageNum){
        	$scope.search.pageNum = $scope.pageNum;
        } else {
            $scope.search.pageNum = pageNum;
        }
        var onlineTime = $("#queryOnlineTime").val();
        if (onlineTime != null && onlineTime != '') {
        	$scope.search.onlineTime = $("#queryOnlineTime").val();
        }
        //$scope.search.status=0;
        //$scope.search.productChannel=1;
        var url = globalConfig.basePath+"/float/list";
        $http.post(url,$scope.search).then(
            function(data){
                if(data.data.code=='000'){
                	$scope.pageList = data.data.resp.result;
                	$scope.total = data.data.resp.totalRowSize;
                	$scope.pages = data.data.resp.pageCount;
                	//if($scope.pages<pageNum);
                	//$scope.search.pageNum = $scope.pages;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    

    //重置
    $scope.reset = function(){
    	var num = $scope.search.pageNum;
    	var size = $scope.search.pageSize;
    	$scope.search={};
    	$scope.search.pageNum = num;
    	$scope.search.pageSize = size;
    	$scope.search.productChannel = '0';
    	$scope.search.loginStatus = '';
    	$scope.search.auditStatus = '';
    	$scope.search.status = '';
        $scope.search.showType='0'
    	$scope.getSearchVersionList("sys_product_version_wk_float");
    	$('input[name="queryOnlineTime"]').val('');
    	//$scope.search.productVersion = $scope.typeVersionList[0].label;
    }



    $scope.selctPageOne =function(){
        if($scope.redirectType0 == '3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }

    }

    //添加浮标 根据一级页面查询二级页面
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
    
    //按渠道类型获取版本列表
    $scope.getTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeVersionList = data.data.resp.result;
        //	$scope.search.productVersion = $scope.typeVersionList[0].label;
        $scope.search.productVersion = '';
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    //按渠道类型获取版本列表-查询
/*    $scope.getSearchTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeVersionList = data.data.resp.result;
        	//$scope.search.productVersion = $scope.typeVersionList[0].label;
        	$scope.search.productVersion = '';
        	$scope.pageQueryFloat(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
*/   
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQueryFloat(1);
    });
    $("#searchProductChannel").change(function(){
    	var channel = $("#searchProductChannel").val();
    	if(channel==0){
    		$scope.getSearchTypeVersionList("sys_product_version_wk_float");
    	}else if(channel==1){
    		$scope.getSearchTypeVersionList("sys_product_version_qb_float");
        } else if (channel == 6) {
            $scope.getSearchTypeVersionList("sys_product_version_shop_float");
        }else{
    		$scope.getSearchTypeVersionList("sys_product_version_wx_float");
    	}
   });
    
    $("#addProductChannel").change(function(){
    	var channel = $("#addProductChannel").val();
    	if(channel==0){
    		$scope.getAddTypeVersionList("sys_product_version_wk_float");
    	}else if(channel==1){
    		$scope.getAddTypeVersionList("sys_product_version_qb_float");
        } else if (channel == 6) {
            $scope.getAddTypeVersionList("sys_product_version_shop_float");
        }else{
    		$scope.getAddTypeVersionList("sys_product_version_wx_float");
    	}

        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();

   });
    
   $scope.getTypeVersion = function(channel){
	   	if(channel==0){
   			$scope.getTypeVersionList("sys_product_version_wk_float");
   		}else if(channel==1){
   			$scope.getTypeVersionList("sys_product_version_qb_float");
        } else if (channel == 6) {
            $scope.getTypeVersionList("sys_product_version_shop_float");
        } else {
   			$scope.getTypeVersionList("sys_product_version_wx_float");
   		}
   };
   
   $scope.getSearcjTypeVersion = function(channel){
	   	if(channel==0){
  			$scope.getTypeVersionList("sys_product_version_wk_float");
  		}else if(channel==1){
  			$scope.getTypeVersionList("sys_product_version_qb_float");
        } else if (channel == 6) {
            $scope.getTypeVersionList("sys_product_version_shop_float");
        }else{
  			$scope.getTypeVersionList("sys_product_version_wx_float");
  		}
  };
    
    //获取全部版本列表
    /*$scope.getAllVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getAllVersion";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.allVersionList = data;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getAllVersionList();*/
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
    //查询黑白名单列表
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
   //添加
    $scope.addFloat = function(){
    	$scope.login = false;
    	$scope.logout = false;   	
    	$scope.wbSelected = [] ; 
    	$scope.selected = [] ;
    	$scope.add = {};
        $scope.add.productVersion = [];
        $scope.add.productChannel = '0';
        $scope.add.valid = '1';
        $scope.add.loginStatus='2';
        //
        $scope.allxx = true;
        $scope.whitexx = false;
        $scope.blackxx = false;
        $("#all").attr('disabled','disabled');
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        $scope.add.whiteId = '';
        $("#whiteID").attr('disabled','disabled');
        $scope.add.blackId = '';
        $("#blackSelect").attr('disabled','disabled');
        //
        $scope.getAddTypeVersionList('sys_product_version_wk_float');
        $('#addFloat').show();
        $scope.queryWhiteAndBlack();
        $('#fileUrl').val('');
        $('#addOnlineTime').val('');
        $('#addOfflineTime').val('');
        $scope.allxx =true;
        $scope.whitexx =false;
        $scope.blackxx =false;
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        $scope.add.whiteId = '';
        $("#whiteID").attr('disabled','disabled');
        $scope.add.blackId = '';
        $("#blackSelect").attr('disabled','disabled');

        //黑白名单显示
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();

    }
    
    //添加
    $scope.closeAddFloat = function(){    
        $('#addFloat').hide();

    }
    
    $scope.saveFloat = function(){
    	if($scope.add.productChannel==null||$scope.add.productChannel==""){
            alert("渠道不能为空");
            return;
        }
    	var versions = "";
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(versions==""){
            alert("产品版本不能为空");
            return;
        }else{
        	$scope.add.productVersion = versions;
        }
        if($scope.add.position==null||$scope.add.position==""){
            alert("请选择浮标位置");
            return;
        }else{
        	$scope.add.positionName = $('#addPosition').find("option:selected").text();
        }
        
       /* var login = $("#login").prop("checked");
        var logout = $("#logout").prop("checked");
        if(!login&&!logout){
        	alert('请选择登录状态');
    		return;	
        }
        if(login){
        	$scope.add.loginStatus = 1;
        }else{
        	$scope.add.loginStatus = 0;
        }*/
        
        $scope.add.imageUrl = $('#fileUrl').val();
        if($scope.add.imageUrl==null||$scope.add.imageUrl==""){
            alert("请选上传图片");
            return ;
        }
        if(($scope.add.productChannel == '0' || $scope.add.productChannel == '2') && $scope.add.position != '8' && $scope.add.position != '10'){
            if(!$scope.redirectType0){
                alert("跳转类型不能为空")
                return;
            }
            if($scope.redirectType0 == '2' && !$scope.add.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
            if($scope.redirectType0 == '3' && !$scope.add.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if($scope.redirectType0 == '3' && !$scope.add.pageTwo){
                alert("跳转页面不能为空")
                return;
            }

        }
        if($scope.add.productChannel != '0' && $scope.add.productChannel != '2' && $scope.add.position!=15){
            if(!$scope.add.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
        }
        $scope.add.onlineTime = $('#addOnlineTime').val()+"";
        $scope.add.offlineTime = $('#addOfflineTime').val()+"";
        if($scope.add.onlineTime==null||$scope.add.onlineTime==""){
            alert("请选择上线时间");
            return;
        }
        if($scope.add.offlineTime==null||$scope.add.offlineTime==""){
            alert("请选择下线时间");
            return;
        }
        if($scope.add.offlineTime<=$scope.add.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }

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





        // TODO 续投类型选项
        var auditPerson = $scope.add.auditPerson;
        // 审核人
        if(!$scope.add.auditPerson){
            alert("审核人不能为空");
            return ;
        }else{
        	$scope.add.auditNo=$scope.add.auditPerson.no;
        	$scope.add.requestAuditPersonEmail=$scope.add.auditPerson.email;
        	$scope.add.auditPerson=$scope.add.auditPerson.name;
        }
        $scope.add.redirectType = $scope.redirectType0;
        var url = globalConfig.basePath+"/float/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                    $('#addFloat').hide();
                    $scope.add = {};
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                }else{
                    alert(data.data.message)
                }
                $scope.pageQueryFloat(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    
  //修改-按渠道类型版本登陆状态获取位置列表
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
    //修改
    $scope.editFloat = function(float){
        self.isUpdateRoster = 'N';
    	 $scope.u={}
    	 /*if(float.showType==0){
    		$('#allBox').prop("checked",true);
            $('#whiteBox').prop("checked",false);
            $('#blackBox').prop("checked",false);
    	 }else if(float.showType==1){
    		 $('#whiteBox').prop("checked",true);
             $('#blackBox').prop("checked",false);
             $('#allBox').prop("checked",false);
    	 }else if(float.showType==2){
    		 $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",false);
             $('#allBox').prop("checked",false); 
    	 }else if(float.showType==3){
    		 $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",true);
             $('#allBox').prop("checked",false); 
    	 }*/
    	 var type;
    	 if(float.productChannel==0 ){
    	    type = "sys_product_version_wk_float";
    	 }
    	 if(float.productChannel==1){
    	   	type = "sys_product_version_qb_float";
    	 }
    	 if(float.productChannel==2){
    	   	type = "sys_product_version_wx_float";
    	 }
         if (float.productChannel == 6) {
            type = "sys_product_version_shop_float";
         }
    	 var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
         $http({
             method: 'GET',
             url: url,
         }).then(function successCallback(data) {
         
         	$scope.editTypeVersionList = data.data.resp.result;
         	debugger
         	//	$scope.search.productVersion = $scope.typeVersionList[0].label;
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
                /*$scope.u.quanbuClick = true;
                $("#baimingdan").attr('disabled','disabled');
                $("#heimingdan").attr('disabled','disabled');
                $('#quanbu').attr('disabled','disabled');
                if(float.loginStatus == 1){
               	 $('#quanbu').removeAttr('disabled');
                }
                $("#bDropDown").attr('disabled','disabled');
                $("#heiSelect").attr('disabled','disabled');*/
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
                    self.operationRecord.whiteMemberListName=float.whiteMemberListName;
                    self.operationRecord.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },300)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=float.blackMemberListName;
                    self.operationRecord.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },300)

            }else if(float.showType == 1){
                /* $("#baimingdan").removeAttr('disabled');
                 $("#heimingdan").removeAttr('disabled');
                 $("#bDropDown").removeAttr('disabled');
                 $scope.u.baimingdClick = true;*/
                $('#editwhite').prop("checked",true);
                $('#editblack').prop("checked",false);
                $('#editall').prop("checked",false);
                $("#editwhite").removeAttr("disabled");
                $("#editblack").removeAttr("disabled");
                //修改名单那类型查询
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.whiteMemberListName=float.whiteMemberListName;
                    self.operationRecord.whiteId = float.whiteId
                },300)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=float.blackMemberListName;
                    self.operationRecord.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },300)
            }else if(float.showType == 2){
               /* $("#baimingdan").removeAttr('disabled');
           	    $("#heimingdan").removeAttr('disabled');
           	    $("#heiSelect").removeAttr('disabled');
                $scope.u.heimingdanClick = true;*/
                $('#editblack').prop("checked",true);
                $('#editwhite').prop("checked",false);
                $('#editall').prop("checked",false);
                $("#editwhite").removeAttr("disabled");
                $("#editblack").removeAttr("disabled");
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.whiteMemberListName=float.whiteMemberListName;
                    self.operationRecord.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },300)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=float.blackMemberListName;
                    self.operationRecord.blackId = float.blackId;
                },300)
            }else if(float.showType == 3){
           /*      $("#baimingdan").removeAttr('disabled');
                 $("#heimingdan").removeAttr('disabled');
                 $("#bDropDown").removeAttr('disabled');
                 $("#heiSelect").removeAttr('disabled');
                 $scope.u.baimingdClick = true;
                 $scope.u.heimingdanClick = true;*/
                $('#editblack').prop("checked",true);
                $('#editwhite').prop("checked",true);
                $('#editall').prop("checked",false);
                $("#editwhite").removeAttr("disabled");
                $("#editblack").removeAttr("disabled");
                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.whiteMemberListName=float.whiteMemberListName;
                    self.operationRecord.whiteId = float.whiteId
                },300)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=float.blackMemberListName;
                    self.operationRecord.blackId = float.blackId;
                },300)
            }
             //修改禁用名单
             $("#editall").attr('disabled','disabled');
             $("#editwhite").attr("disabled",'disabled');
             $("#editblack").attr("disabled",'disabled');
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
    
    //保存修改
    $scope.saveEditFloat = function(){
    	/*if($scope.operationRecord.productChannel==null){
            alert("渠道不能为空");
            return;
        }*/
    	var versions = "";
        $('.updateVersionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        versions = versions.substring(0, versions.lastIndexOf(','));
        if(versions==""){
            alert("产品版本不能为空");
            return;
        }else{
        	$scope.operationRecord.productVersion = versions;
        }
        
        /*if($scope.operationRecord.position==""){
            alert("请选择浮标位置");
            return;
        }else{
        	$scope.operationRecord.positionName = $('#editPosition').find("option:selected").text();
        }*/
    	/*var loginEdit = $("#loginEdit").prop("checked");
        var logoutEdit = $("#logoutEdit").prop("checked");
        if(!loginEdit&&!logoutEdit){
          alert('请选择登录状态');
      	  return;	
        }
        if(loginEdit){
          $scope.operationRecord.loginStatus = 1;
        }else{
          $scope.operationRecord.loginStatus = 0;
        }*/
        $scope.operationRecord.imageUrl = $('#fileUrl1').val();
        if($scope.operationRecord.imageUrl==null||$scope.operationRecord.imageUrl==""){
            alert("请选上传图片");
            return ;
        }

        if(($scope.operationRecord.productChannel==0 && $scope.operationRecord.position != '8')||$scope.operationRecord.productChannel==2 && $scope.operationRecord.position != '10'){
            if(!$scope.u_redirectType){
                alert("跳转类型不能为空")
                return;
            }
            if($scope.u_redirectType == '2' && !$scope.operationRecord.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
            if($scope.u_redirectType == '3' && !$scope.operationRecord.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if($scope.u_redirectType == '3' && !$scope.operationRecord.pageTwo){
                alert("跳转页面不能为空")
                return;
            }
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
        /*var count = 0;
        $('.updateCheckbox').each(function () {
            if(this.checked == true){
            	$scope.operationRecord.showType = $(this).val();
            	count++;
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
                self.operationRecord.showType = 3;
            }

            if (!whiteId && !blackId){
                self.operationRecord.showType = 0;
            }
            if (whiteId && whiteId != 0 && !blackId){
                self.operationRecord.showType = 1;
            }
            if (blackId && blackId!=0 && !whiteId){
                self.operationRecord.showType = 2;
            }
            if (self.operationRecord.whiteMemberListName != 'NO_RULE'){
                self.operationRecord.whiteTrue=true;
            }

            if (self.operationRecord.blackMemberListName != 'NO_RULE'){
                self.operationRecord.blackTrue = true;
            }


            if(self.operationRecord.whiteTrue == true){
                var whiteId =  $('#memberIdUpdate').val();
                if(whiteId==null || whiteId=="" || whiteId=="0" || whiteId.indexOf("?")!=-1){
                    alert('请选择具体白名单!');
                    return;
                }else{
                    self.operationRecord.whiteId = whiteId;
                    self.operationRecord.whiteName = $('#memberIdUpdate option:selected').text();
                }
            }
            if(self.operationRecord.blackTrue == true){
                var blackId =  $('#memberBlackIdUpdate').val();
                if(blackId == null || blackId=="" || blackId=="0"|| blackId.indexOf("?")!=-1){
                    alert('请选择具体黑名单!');
                    return;
                }else{
                    self.operationRecord.blackId = blackId;
                    self.operationRecord.blackName = $('#memberBlackIdUpdate option:selected').text();
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
        debugger
    	if($scope.operationRecord.productChannel == '0'){
            $scope.operationRecord.redirectType = $scope.u_redirectType;
        }
        var url = globalConfig.basePath+"/float/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                    $('#editFloat').hide();
                    $scope.operationRecord = {};
                    $scope.pageQueryFloat(1);
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

    //修改浮标-获取一级原生页面
    $scope.selctPageOne2 =function(){
        if($scope.u_redirectType=='3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList2 = data.resp.result;
            })
        }

    }

    //修改浮标 根据一级页面查询二级页面
    $scope.selectPageOneByRDict2 = function(v){
        var type = "wk_protogenesis_page_two";
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.rPositionDictList2 = data.resp.result;
            if($scope.rPositionDictList2.length=='1'){
                $scope.operationRecord.pageTwo=data.resp.result[0].value;
            }else{
                $scope.operationRecord.pageTwo=data.resp.result[0].value;
            }
        })

    }
    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
        if(opType == 1){
            // $scope.operationType = 2;
        	//$('.look-start-box').show()

            var param = {
                'pageOne':record.pageOne,
                'pageTwo':record.pageTwo
            }
            if(record.productChannel == 0){
                var url = globalConfig.basePath+"/rDict/getLabelByValue";
                $http({
                    method: 'GET',
                    url: url,
                    cache:false,
                    params:param,
                }).then(function successCallback(data) {
                    var d = data.data.resp;
                    $scope.lablePageOne = d.lablePageOne;
                    $scope.lablePageTwo = d.lablePageTwo;
                }, function errorCallback(response) {
                    alert("获取版本列表失败了....");
                });
            }
            $("#detailFloat").show();
            $scope.detail = angular.copy(record);
            debugger
        } else if(opType == 2){
            // $scope.operationType = 1;
            $('#editFloat').show();
            $scope.operationRecord = angular.copy(record);
            //获取一二级场景、原生页面下拉框
            if(record.productChannel != 1){
                $scope.getSceneAndPageListByParam(record.redirectType,record.pageOne,record.pageTwo);
                $scope.uSceneOne = $scope.uSceneOne;
                $scope.u_redirectType = record.redirectType+'';
            }
            $scope.operationRecord.auditPerson="";
            $scope.editFloat($scope.operationRecord);
            //展示黑白名单数量
            if($scope.operationRecord.whiteId != null && $scope.operationRecord.whiteId != ''
                && $scope.operationRecord.whiteId != undefined && $scope.operationRecord.whiteId != 0){
                $scope.findChannelGroupCount($scope.operationRecord.productChannel,$scope.operationRecord.whiteId);
            }
            if($scope.operationRecord.blackId != null && $scope.operationRecord.blackId != ''
                && $scope.operationRecord.blackId != undefined && $scope.operationRecord.blackId != 0){
                $scope.findBlackChannelGroupCount($scope.operationRecord.productChannel,$scope.operationRecord.blackId);
            }
        } else if(opType == 3){
            $scope.effectRecord = record;
            $('#takeEffect').show();
        }
    };

    //获取一二级场景、原生页面下拉框
    $scope.getSceneAndPageListByParam = function(redirectType,pageOne,pageTwo){
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
                $scope.operationRecord.pageTwo = data.resp.result[0].value;
            } else {
                $scope.operationRecord.pageTwo = data.resp.result[0].value;

            }
            $scope.operationRecord.pageTwo = pageTwo;
        })

    }
    // 生效、失效
    /*$scope.validateRecord = function(){
        // 保存数据
        var url = null;
        if($scope.operationRecord.valid=='0'){
            url = globalConfig.basePath+"/float/valid";
        } else {
            url = globalConfig.basePath+"/float/invalid";
        }
        $http.get(url+"?id="+$scope.operationRecord.id).then(function successCallback(callback) {
            $('#takeEffect').hide();
            if(callback.data.code == '000'){
                $scope.pageQueryFloat(1);
                swalMsg("操作成功");
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };*/
    // 生效、失效
    $scope.validateRecord = function(x){
        // 保存数据
    	if($scope.validConfirmUser==""||$scope.validConfirmUser==null||$scope.validConfirmUser==undefined){
    		alert('请选择审核人');
    		return;
    	}else{
    		$scope.effectRecord.auditPerson = $("#validConfirmUser").find("option:selected").text();
    		var array = $scope.validConfirmUser.split('-')
    		//$scope.effectRecord.auditEmail = array[1];
    		$scope.effectRecord.auditNo = array[0];
    	}
    	$scope.effectRecord.requestAuditDescription = $scope.requestAuditDescription;
        var url = null;
        if($scope.effectRecord.valid=='0'){
            url = globalConfig.basePath+"/float/valid";
        } else {
            url = globalConfig.basePath+"/float/invalid";
        }
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
            	$scope.pageQueryFloat(1);
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
    //优先级排序
    $scope.strotList = {}
    $scope.sort = function(){
    	var	searchproductChannel=$("#searchProductChannel").val();
    
		var searchproductVersion=$("#productVersion").val();

		 var searchPosition= $("#searchPosition").val();
		 
        if(searchproductChannel==null||searchproductChannel==""||searchproductChannel==undefined){
        	alert("请在查询条件中选择渠道");
            return;
        }
        if(searchproductVersion==null||searchproductVersion==""||searchproductVersion==undefined){
            alert("请在查询条件中选择产品版本");
            return;
        }
        if(searchPosition==null||searchPosition==""||searchPosition==undefined){
            alert("请在查询条件中选择浮标位置");
            return;
        }
        
   	 	var url = globalConfig.basePath+"/float/getPrioritylist";
   	 	$http.post(url,$scope.search).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp;
            	 console.info("!!!!!!$scope.strotList"+$scope.strotList);
            	 $('#addSort').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
    	/*$scope.strotList = [];
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
        $('#addSort').show();
        var idArray = ids.split(',');
        for(var i=0;i<idArray.length-1;i++){
        	var temp = idArray[i].split('-');
        	$scope.strotList.push(new ObjSort(temp[0],temp[1]));
        }*/
       
    }
    
    $scope.moveUp = function(){
    	var indexStr = "";
    	$('.sort').each(function(){
            if(this.checked == true){
            	indexStr += $(this).val() + ",";
            }
        })
        if(indexStr==""){
        	alert('请选中其中一项进行操作');
        	return;
        }
        var indexs = indexStr.split(',');
    	if(indexs.length>2){
    		alert('只能选中其中一项进行操作');
    		return;
    	}
    	var index = parseInt(indexs[0]);
    	if(index==0){
    		return;
    	}else{
    		var pre = $scope.strotList[index-1];
    		$scope.strotList[index-1] = $scope.strotList[index];
    		$scope.strotList[index] = pre;
    	}  	
    	
    }
    $scope.moveDown = function(){
    	var indexStr = "";
    	$('.sort').each(function(){
            if(this.checked == true){
            	indexStr += $(this).val() + ",";
            }
        })
        if(indexStr==""){
        	alert('请选中其中一项进行操作');
        	return;
        }
        var indexs = indexStr.split(',');
    	if(indexs.length>2){
    		alert('只能选中其中一项进行操作');
    		return;
    	}
    	var index = parseInt(indexs[0]);
    	if(index==$scope.strotList.length-1){
    		return;
    	}else{
    		var after = $scope.strotList[index+1];
    		$scope.strotList[index+1] = $scope.strotList[index];
    		$scope.strotList[index] = after;
    	}  	
    	
    }
    $scope.del = function(){
    	var indexStr = "";
    	$('.sort').each(function(){
            if(this.checked == true){
            	indexStr += $(this).val() + ",";
            }
        })
        if(indexStr==""){
        	alert('请选中其中一项进行操作');
        	return;
        }
        var indexs = indexStr.split(',');
    	if(indexs.length>2){
    		alert('只能选中其中一项进行操作');
    		return;
    	}
    	var index = parseInt(indexs[0]);
    	$scope.strotList.splice(index,1);
    }
    //保存排序
    $scope.moveSave = function(){
    	var ids = "";
    	if($scope.strotList.length<1){
    		//alert('请至少保留其中两项进行保存');
    		alert('操作成功');
    		$('#addSort').hide();
    		return;
    	}
    	for(var i=0;i<$scope.strotList.length;i++){
    		ids = ids + $scope.strotList[i].id + ",";
    	}
        var url = globalConfig.basePath+"/float/priority?ids="+ids;
        $http.get(url).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                self.strotList = {};
                $scope.pageQueryFloat(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //取消排序
    $scope.moveCancel = function(){
        $('#addSort').hide();
        self.strotList={};
    }
    //声明对象
    function ObjSort(id,desc) 
    {
        this.id = id;
        this.desc= desc;  
    }
    
  

    //修改全部选中事件
    $scope.allSelect = function(){
        $("#upWhite").attr("checked",false);
        $("#upBlack").attr("checked",false);
        if($('#editall').is(':checked')){
            /*$("#baimingdan").attr('disabled','disabled');
            $("#heimingdan").attr('disabled','disabled');
            $("#bDropDown").attr('disabled','disabled');
            $("#heiSelect").attr('disabled','disabled');*/
            $("#upWhite").attr('disabled','disabled');
            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");
            $("#upBlack").attr('disabled','disabled');
            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
            $("#editselectaddblackId").val("0");
            //黑白名单操作
            self.operationRecord.whiteMemberListName= "NO_RULE"
            self.operationRecord.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();

            self.operationRecord.blackMemberListName= "NO_RULE"
            self.operationRecord.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
        }
        else {
           /* $("#baimingdan").removeAttr('disabled','disabled');
            $("#heimingdan").removeAttr('disabled','disabled');*/
            $("#upWhite").removeAttr('disabled','disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");
            $("#upBlack").removeAttr('disabled','disabled');
            $("#editselectaddblackId").removeAttr("disabled");
        }
    }

    //修改白名单
    $scope.baiClick = function(){
        if($('#baimingdan').is(':checked')){
            $('#bDropDown').removeAttr('disabled','disabled');
        }else{
            $("#bDropDown").attr('disabled','disabled');
            self.operationRecord.whiteMemberListName= "NO_RULE"
            self.operationRecord.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();
        }
    }
    //修改黑名单
    //黑名单选中事件 type 0 添加 1修改
    self.blackClick = function(type){
        if(type == 0){
            if(!$('#upBlack').prop("checked")){
                self.blackStrategyReload();
                $('#userNameLikeBlackSearch').hide();

                $("#blackListType").attr('disabled','disabled');
            }else{
                $("#blackListType").attr('disabled',false);
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

    //添加全部选中事件
    $scope.complete = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
            $("#whiteID").attr('disabled','disabled');
            $("#blackSelect").attr('disabled','disabled');      
            $scope.add.whiteId = '';
            $scope.add.blackId = '';

            self.add.whiteMemberListName= "NO_RULE"
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.add.blackMemberListName= "NO_RULE"
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }
        else {
            $("#white").removeAttr('disabled','disabled');
            $("#black").removeAttr('disabled','disabled');

            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }
    }

    //添加白名单
    $scope.baiChecked = function(){
        if($('#white').is(':checked')){
            $('#whiteID').removeAttr('disabled','disabled');
        }else{
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            $("#whiteID").attr('disabled','disabled');
        }
    }

   //取消修改
    $scope.updateCancel = function(){
    	$('#editFloat').hide();
        $scope.u={};
    }
    
    //改变登录状态已登录
    $scope.loginClick = function(){
        if($('#login').is(':checked')){
        	$scope.logout = false;
        	$scope.login =  true;
        	$("#all").removeAttr('disabled','disabled');
        }
    }
    //改变登录状态未登录
    $scope.logoutClick = function(){
    	if($('#logout').is(':checked')){
        	$scope.login = false;
        	$scope.logout = true;
        	$scope.allxx = true;
            $scope.whitexx = false;
            $scope.blackxx = false;
            $("#all").attr('disabled','disabled');
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
            $scope.add.whiteId = '';
            $("#whiteID").attr('disabled','disabled');
            $scope.add.blackId = '';
            $("#blackSelect").attr('disabled','disabled');
        }
    }
    
    //添加浮标登录状态改变
    $scope.loginChange = function(loginStatus){
    	if(loginStatus=='1'){
        	$("#all").removeAttr('disabled','disabled');
        }else{
        	$scope.allxx = true;
            $scope.whitexx = false;
            $scope.blackxx = false;
            $("#all").attr('disabled','disabled');
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
            $scope.add.whiteId = '';
            $("#whiteID").attr('disabled','disabled');
            $scope.add.blackId = '';
            $("#blackSelect").attr('disabled','disabled');
        }

        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();

        $scope.getAddPositionList();
    }
    
    //修改改变登录状态已登录
    $scope.loginEditClick = function(){
        if($('#loginEdit').is(':checked')){
        	$scope.logoutEdit = false;
        	$scope.loginEdit =  true;
        	$("#quanbu").removeAttr('disabled','disabled');
        }
    }
    //修改改变登录状态未登录
    $scope.logoutEditClick = function(){
    	if($('#logoutEdit').is(':checked')){
        	$scope.loginEdit = false;
        	$scope.logoutEdit = true;
        	$scope.u.quanbuClick = true;
        	$("#quanbu").attr('disabled','disabled');
        	$("#baimingdan").attr('disabled','disabled');
            $("#heimingdan").attr('disabled','disabled');
            $("#bDropDown").attr('disabled','disabled');
            $("#heiSelect").attr('disabled','disabled');
            $scope.operationRecord.whiteId = '0';
            $scope.operationRecord.blackId = '0';
            $("#baimingdan").attr("checked",false);
            $("#heimingdan").attr("checked",false);
        }
    }
    
    //修改浮标登录状态改变
    $scope.loginChangeEdit = function(loginStatus){
    	if(loginStatus=='1'){
    		$("#quanbu").removeAttr('disabled','disabled');
        }else{
        	$scope.u.quanbuClick = true;
        	$("#quanbu").attr('disabled','disabled');
        	$("#baimingdan").attr('disabled','disabled');
            $("#heimingdan").attr('disabled','disabled');
            $("#bDropDown").attr('disabled','disabled');
            $("#heiSelect").attr('disabled','disabled');
            $("#baimingdan").attr("checked",false);
            $("#heimingdan").attr("checked",false);
        }

        //黑白名单操作
        self.operationRecord.whiteMemberListName= "NO_RULE"
        self.operationRecord.whiteId=null;
        self.strategyReloadUpdate();
        $('#userNameLikeSearchUpdate').hide();


        self.operationRecord.blackMemberListName= "NO_RULE"
        self.operationRecord.blackId=null;
        self.blackStrategyReloadUpdate();
        $('#userNameLikeBlackSearchUpdate').hide();

        $scope.getEditPositionList();
    }
    

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
    //审批
    $scope.audit = function(record){
    	if(record.auditStatus != "0"){
    		alert('只能对待审核状态的数据进行操作');
    		return;	
    	 }
    	$scope.auditStatus = "1";
    	$('.examine-box').show();
    	$scope.confirmRecord = angular.copy(record);
    // 	$scope.auditStatus = "2";
    	$scope.auditDescription = "";
    	
    };

    // 审核
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/float/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
            	$scope.pageQueryFloat(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    
    //查询-按渠道类型版本登陆状态获取位置列表
    $scope.getSearchPositionList = function(){
    	if($scope.search.productVersion==undefined){
    		return;
    	}
    	var loginStatu = $scope.search.loginStatus;
    	if($scope.search.loginStatus==undefined || $scope.search.loginStatus==""){
    		 loginStatu ="2";
    	}
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.search.productChannel + "&productVersion=" + $scope.search.productVersion + "&loginStatus=" + loginStatu + "&resourceType=sys_float";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.searchPositionsList = data.data.resp.result;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取位置列表失败了....");
        });
    };
    
    //添加-按渠道类型版本登陆状态获取位置列表
    $scope.getAddPositionList = function(){
    	var versions = "";
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(versions==""){
   		    $scope.add.position = '';
            return;
        }
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.add.productChannel + "&productVersion=" + versions + "&loginStatus=" + $scope.add.loginStatus + "&resourceType=sys_float";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.addPositionsList = data.data.resp.result;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取位置列表失败了....");
        });
        
    };
    
  
    
    //搜索-按渠道类型获取版本列表
    $scope.getSearchTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.searchTypeVersionList = data.data.resp.result;
        	//	$scope.search.productVersion = $scope.typeVersionList[0].label;
        	$scope.search.productVersion = '';
        	$scope.getSearchPositionList();
        	$scope.pageQueryFloat(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    //添加-按渠道类型获取版本列表
    $scope.getAddTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.addTypeVersionList = data.data.resp.result;
        	//	$scope.search.productVersion = $scope.typeVersionList[0].label;
        	$scope.add.productVersion = '';
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    //修改-按渠道类型获取版本列表
    $scope.getEditTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.editTypeVersionList = data.data.resp.result;
        	//	$scope.search.productVersion = $scope.typeVersionList[0].label;
        	$scope.operationRecord.productVersion = '';
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    $scope.changeStatus = function(){
    	$scope.getSearchPositionList();
    };
    $scope.editCheck = function(label){
		var productVersion = $scope.operationRecord.productVersion;
		if(productVersion==label){
			return true;
		}
		return false;   
	};
	 $scope.getSearchTypeVersionList("sys_product_version_wk_float");



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
                    self.operationRecord.strategyList = data.data.resp;
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
                    self.operationRecord.blackStrategyList = data.data.resp;
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
                    self.operationRecord.strategyList = data.data.resp;
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
        if(self.operationRecord.productChannel==0 ||self.operationRecord.productChannel==2){
            channelCode='WK';
        }else if(self.operationRecord.productChannel==1){
            channelCode='QB';
        }else if(self.operationRecord.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.operationRecord.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterLikeSearch').hide();
            self.operationRecord.whiteId='0';
            $('#memberIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.operationRecord.whiteMemberListName
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
                    self.operationRecord.blackStrategyList = data.data.resp;
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
        if(self.operationRecord.productChannel==0 ||self.operationRecord.productChannel==2){
            channelCode='WK';
        }else if(self.operationRecord.productChannel==1){
            channelCode='QB';
        }else if(self.operationRecord.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.operationRecord.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.operationRecord.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.operationRecord.blackMemberListName
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
        self.memberUpdateCount="";
        self.memberBlackUpdateCount="";
        $('#editall').prop("checked",true);//默认全部不选择
        $("#upWhite").attr('checked',false);
        $("#upBlack").attr('checked',false);
        $("#upWhite").attr('disabled','disabled');
        $("#upBlack").attr('disabled','disabled');
        $("#whitListType").attr('disabled','disabled');
        $("#blackListType").attr('disabled','disabled');
        self.beforeWhiteMemberListName = self.operationRecord.whiteMemberListName;
        self.beforeBlackMemberListName = self.operationRecord.blackMemberListName;
        self.beforeWhiteId = self.operationRecord.whiteId;
        self.beforeBlackId = self.operationRecord.blackId;
        if (self.operationRecord.whiteName && self.operationRecord.whiteName != ''){
            self.beforeWhiteName = self.operationRecord.whiteName;
        }
        if (self.operationRecord.blackName && self.operationRecord.blackName != ''){
            self.beforeBlackName = self.operationRecord.blackName;
        }
        self.operationRecord.whiteId = '';
        self.operationRecord.blackId = '';
        self.operationRecord.blackMemberListName = 'NO_RULE';
        self.operationRecord.whiteMemberListName = 'NO_RULE';

        $('#upUserRosterLikeSearch').hide();

        $('#upUserRosterBlackLikeSearch').hide();

    }

    //点击白名单复选框
    self.upWhiteClick = function () {
        if(!$("#upWhite").prop("checked")){
            self.operationRecord.whiteMemberListName= "NO_RULE"
            self.operationRecord.whiteId=null;
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









}]);