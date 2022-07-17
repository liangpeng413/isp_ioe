'use strict';
var App = angular.module('tabApp', [], angular.noop);
App.controller("tabController", ['$scope','$http',  function ($scope,$http,$compile) {
    var self = $scope;
	$scope.continuationTypeInfo = "";
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.showType='';
    $scope.search.productChannel = '0';
    $scope.postionShow = '1';
    $scope.search.loginStatus = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '';
    $scope.search.auditStatus = '';
    $scope.search.position = '';
    $scope.search.tabNameKey = '';
    $scope.search.isShowBubble = '';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    $scope.positions = [];
    $scope.serviceCode="";
    $scope.search.tabNameKey="";
    $scope.upPositionValue="";
    self.isUpdateRoster = 'N';
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
                $('#fileUrl').prop("value",fileUrl);
                $('#image_prew').prop("src",fileUrl);
                alert("上传成功")
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
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
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
    	
    	$('#editPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                 var fileUrl = data.result.resp;
                $('#fileUrl1').prop("value",fileUrl);
                 $('#image_prew1').prop("src",fileUrl);
                 alert("上传成功!");
            }
        	}).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    swal("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });
    	$('#editPicture2').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
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
    
    $scope.subValue = function(positonTempVal){
    	var str = positonTempVal + "";
    	return str.substring(0,1);
    };
    //tab查询
    $scope.pageQueryTab = function(pageNum){
 
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

        if($scope.search.position=='10-0'||$scope.search.position=='104-0'||$scope.search.position=='10001-0'){
        	$scope.search.tabNameKey="";
        }else{
        	$scope.search.typeId="";
        }
        //$scope.search.status=0;
        //$scope.search.productChannel=1;
        var url = globalConfig.basePath+"/tab/list";
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
    	$scope.nameList = [];
    	$scope.search={};
    	$scope.search.pageNum = num;
    	$scope.search.pageSize = size;
    	$scope.search.productChannel = '0';
    	$scope.search.loginStatus = '';
    	$scope.search.auditStatus = '';
    	$scope.search.status = '';
    	$scope.search.showType = '';
    	$scope.getSearchTypeVersionList("sys_product_version_wk_tab");
    	$('input[name="queryOnlineTime"]').val('');
    	$scope.getSearchPositionList();
    	//$scope.search.productVersion = $scope.typeVersionList[0].label;
    }
    

    //按渠道类型获取版本列表
    $scope.getTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeVersionList = data.data.resp.result;
        	//$scope.search.productVersion = $scope.typeVersionList[0].label;
        	//$scope.getSearchPositionList();
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
  //按渠道类型获取版本列表
    $scope.getSearchTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.searchTypeVersionList = data.data.resp.result;
        //	$scope.search.productVersion = $scope.searchTypeVersionList[0].label;
        	$scope.search.productVersion = '';
        	$scope.getSearchPositionList();
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
   //初始化
    $scope.load = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.searchTypeVersionList = data.data.resp.result;
        //	$scope.search.productVersion = $scope.searchTypeVersionList[0].label;
        	$scope.search.productVersion = '';
        	if($scope.search.productVersion==undefined){
        		return;
        	}
            var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.search.productChannel + "&productVersion=" + $scope.search.productVersion + "&loginStatus=" + $scope.search.loginStatus + "&resourceType=sys_tab";
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
            
            	$scope.searchPositionsList = data.data.resp.result;
            	if($scope.searchPositionsList.length==0){
            		$scope.nameList = {};
            		$scope.pageQueryTab(1);
            		return;
            	}
            	
            	$scope.search.position = $scope.searchPositionsList[0].value + "-" + $scope.searchPositionsList[0].extend1;
            	$scope.getSearchNameList($scope.searchPositionsList[0].value + "-" + $scope.searchPositionsList[0].extend1);
            	$scope.pageQueryTab(1);
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取版本列表失败了....");
            });
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.load("sys_product_version_wk_tab");

    // 选择版本
    self.isH5=0;
    //添加-按渠道类型版本登陆状态获取位置列表
    $scope.getPositionList = function(){
    	var versions = "";
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val();
            }
        });
        if(versions==""){
        	$scope.nameList = [];
        	$scope.positionsList = [];
        	$scope.add.tabNameKey = '';
   		    $scope.add.position = '';
            return;
        }
        $scope.add.productVersion=versions;
       /* var login = $scope.login;
        var logout = $scope.logout;
        if(!login&&!logout){
    		return;	
        }
        if(login){
        	$scope.add.loginStatus = 1;
        }else{
        	$scope.add.loginStatus = 0;
        }*/
        
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.add.productChannel + "&productVersion=" + versions + "&loginStatus=" + $scope.add.loginStatus + "&resourceType=sys_tab";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.positionsList = data.data.resp.result;
        	$scope.add.position = '';
        	//$scope.search.productVersion = $scope.positionsList[0].label;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    //查询-按渠道类型版本登陆状态获取位置列表
    $scope.getSearchPositionList = function(){
    	if($scope.search.productVersion==undefined){
    		return;
    	}
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.search.productChannel + "&productVersion=" + $scope.search.productVersion + "&loginStatus=" + $scope.search.loginStatus + "&resourceType=sys_tab";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.searchPositionsList = data.data.resp.result;
        	if($scope.searchPositionsList.length==0){
        		$scope.nameList = {};
        		return;
        	}
        	
        	$scope.search.position = $scope.searchPositionsList[0].value + "-" + $scope.searchPositionsList[0].extend1;
        	$scope.getSearchNameList($scope.searchPositionsList[0].value + "-" + $scope.searchPositionsList[0].extend1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    //修改-按渠道类型版本登陆状态获取位置列表回显用
    $scope.getEditPositionListShow = function(){
        if($scope.operationRecord.productVersion==undefined){
            return;
        }
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.operationRecord.productChannel + "&productVersion=" + $scope.operationRecord.productVersion + "&loginStatus=" + $scope.operationRecord.loginStatus + "&resourceType=sys_tab";

        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.editPositionsList = data.data.resp.result;
            if($scope.editPositionsList.length==0){
                $scope.nameList = {};
                return;
            }else{
                for(var i=0;i<$scope.editPositionsList.length;i++){
                    var index = $scope.editPositionsList[i].value;
                    $scope.positions[index] = $scope.editPositionsList[i].extend1;
                }
            }
            var position = $scope.operationRecord.position;
            //$scope.operationRecord.position = $scope.editPositionsList[0].value + "-" + $scope.editPositionsList[0].extend1;
            $scope.operationRecord.position = position + "-" + $scope.positions[position];
            $scope.getEditNameListShow($scope.operationRecord.position);
            if ($scope.operationRecord.position.substring(0,3) == '108' && self.operationRecord.productChannel == 1){
                $('#isShowPop').hide();
            }
            if ($scope.operationRecord.position.substring(0,3) == '103' && self.operationRecord.productChannel == 0){
                $('#isShowPop').hide();
            }
            }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    //修改回显用
    $scope.getEditNameListShow = function(position){
        if(position!=null&&position!="" && position!='10-0'){
            var names = position.split('-');
            var tabNameJson = names[1];
            $scope.editNameList = JSON.parse(tabNameJson);
            //$scope.operationRecord.tabNameKey = $scope.editNameList[0].tab_name_key;
        }else if(position=='10-0'){
            var type="sys_service_center_qb_type"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }else{
            $scope.editNameList = [];
            $scope.operationRecord.tabNameKey = '';
        }

    }



    //修改-按渠道类型版本登陆状态获取位置列表
    $scope.getEditPositionList = function(){
        if($scope.operationRecord.productVersion==undefined){
            return;
        }
        var versions = "";
        $('.updateVersionCheckbox').each(function() {
            if (this.checked == true) {
                versions = $(this).val();
            }
        });
        if(versions==""){
            $scope.nameList = [];
            $scope.positionsList = [];
            $scope.operationRecord.tabNameKey = '';
            $scope.operationRecord.position = '';
            return;
        }
        var url = globalConfig.basePath+"/rDict/getPositions?productChannel="+$scope.operationRecord.productChannel + "&productVersion=" + versions + "&loginStatus=" + $scope.operationRecord.loginStatus + "&resourceType=sys_tab";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {

            $scope.editPositionsList = data.data.resp.result;
            if($scope.editPositionsList.length==0){
                $scope.nameList = {};
                return;
            }

            $scope.operationRecord.position = $scope.editPositionsList[0].value + "-" + $scope.editPositionsList[0].extend1;
            $scope.getEditNameList($scope.editPositionsList[0].value + "-" + $scope.editPositionsList[0].extend1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getSearchPositionList();

    //$scope.getSearchTypeVersionList("sys_product_version_wk_tab");
    $("#pageSize").change(function(){
        $scope.search.pageSize = $("#pageSize").val();
        $scope.pageQueryTab(1);
    });
    $("#productChannel").change(function(){
        var channel = $("#productChannel").val();
        if(channel==0){
            $scope.getTypeVersionList("sys_product_version_wk_tab");
        }else if(channel==1){
            $scope.getTypeVersionList("sys_product_version_qb_tab");
        }else if(channel==4){
            $scope.getTypeVersionList("sys_product_version_applet_tab");
        }else if(channel==5){
            $scope.getTypeVersionList("sys_product_version_qb_m_tab");
        }else if(channel==6){
            $scope.getTypeVersionList("sys_product_version_shop_tab");
        }else{
            $scope.getTypeVersionList("sys_product_version_wx_tab");
        }
    });

    $scope.getTypeVersion = function(channel){
        if(channel==0){
            $scope.getTypeVersionList("sys_product_version_wk_tab");
        }else if(channel==1){
            $scope.getTypeVersionList("sys_product_version_qb_tab");
        }else if(channel==4){
            $scope.getTypeVersionList("sys_product_version_applet_tab");
        }else if(channel==5){
            $scope.getTypeVersionList("sys_product_version_applet_tab");
        }else if(channel==6){
            $scope.getTypeVersionList("sys_product_version_shop_tab");
        }else{
            $scope.getTypeVersionList("sys_product_version_wx_tab");
        }
        $scope.getPositionList();
    };

    $scope.getSearchTypeVersion = function(channel){
        if(channel==0){
            $scope.getSearchTypeVersionList("sys_product_version_wk_tab");
        }else if(channel==1){
            $scope.getSearchTypeVersionList("sys_product_version_qb_tab");
        }else if(channel==4){
            $scope.getSearchTypeVersionList("sys_product_version_applet_tab");
        }else if(channel==5){
            $scope.getSearchTypeVersionList("sys_product_version_qb_m_tab");
        }else if(channel==6){
            $scope.getSearchTypeVersionList("sys_product_version_shop_tab");
        }else{
            $scope.getSearchTypeVersionList("sys_product_version_wx_tab");
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
    $scope.addTab = function(){
    	$scope.nameList = [];
     	$scope.positionsList = [];
    	$scope.login = false;
    	$scope.logout = false;
    	$scope.wbSelected = [] ; 
    	$scope.selected = [] ;
    	$scope.add = {};
        $scope.add.productVersion = [];
        $scope.add.productChannel = '0';
        $scope.add.valid = '1';
        $scope.add.position = '';
        $scope.add.tabNameKey = '';
        $scope.add.loginStatus = '2';
        $scope.add.showWay=''
        $scope.add.isHomeShow='0';
        $scope.add.isShowBubble='0';
        //金融属性开关
        self.add.financialStyle = 'Y';
        //前置鉴权
        self.add.preAuth = '0';
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
        $scope.getTypeVersionList('sys_product_version_wk_tab');
        $('#addTab').show();
        $scope.queryWhiteAndBlack();
        $scope.allxx =true;
        $scope.whitexx =false;
        $scope.blackxx =false;
        $('#fileUrl').val('');
        $('#fileUrl2').val('');
        $('#addOnlineTime').val('');
        $('#addOfflineTime').val('');
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        // $scope.add.whiteId = '';
        $("#whiteID").attr('disabled','disabled');
        // $scope.add.blackId = '';
        //黑白名单显示
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();

        $("#blackSelect").attr('disabled','disabled');
        var html = '<h2>产品版本： <span ng-repeat="v in typeVersionList"><input type="checkbox" onclick="versionClick()" class="versionCheckbox checkAll" value="{{v.label}}"/>{{v.label}}</span></h2>'
        //用$compile进行编译   
        var $html = $compile(html)($scope); 

        $('#append').append($html);
       

    }
    
    //添加
    $scope.closeAddTab = function(){    
        $('#addTab').hide();

    }
    
    $scope.saveTab = function(){
    	if($scope.add.productChannel==null||$scope.add.productChannel==""){
            alert("渠道不能为空");
            return;
        }
    	var versions = "";
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions= $(this).val();
            }
        });
        if(versions==""){
            alert("产品版本不能为空");
            return;
        }else{
        	$scope.add.productVersion = versions;
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


        var login = $("#login").prop("checked");
        var logout = $("#logout").prop("checked");
        /*if(!login&&!logout){
        	alert('请选择登录状态');
    		return;	
        }
        if(login){
        	$scope.add.loginStatus = 1;
        }else{
        	$scope.add.loginStatus = 0;
        }*/
        if($scope.add.position==null||$scope.add.position==""){
            alert("请选择位置");
            return ;
        }
        
        $scope.add.positionName = $("#positionName").find("option:selected").text();


        if($scope.add.tabNameKey==null||$scope.add.tabNameKey==""){
            alert("请选择Tab名称");
            return ;
        }
        if($scope.add.productChannel==1 && ($scope.add.position=='104-0'|| $scope.add.position=='10001-0' )){
            $scope.add.tabName= $scope.add.tabNameKey;
        }else{
            $scope.add.tabName = $("#tabName").find("option:selected").text();
        }

        $scope.add.preImageUrl = $('#fileUrl').val();
        if(101!=$scope.add.position.substring(0,3)&&(105!=$scope.add.position.substring(0,3)&&$scope.add.productChannel==1)){
            if($scope.add.preImageUrl==null||$scope.add.preImageUrl==""){
                alert("请上传点击前图片");
                return ;
            }
        }

        var positionValue = '';
        if($scope.add.position!=null&&$scope.add.position!=''){
            positionValue = $scope.add.position.split('-');
        }
        $scope.add.postImageUrl = $('#fileUrl2').val();
//        if($scope.add.postImageUrl==null||$scope.add.postImageUrl==""){
//            alert("请上传点击后图片");
//            return ;
//        }



        if( $scope.add.productChannel==1&&104==$scope.add.position.substring(0,3)&&(105!=$scope.add.position.substring(0,3)&&$scope.add.productChannel==1)){
            if($scope.add.postImageUrl==null||$scope.add.postImageUrl==""){
                alert("请上传点击后图片");
                return ;
            }
        }

        if($scope.add.productChannel == '6' || ($scope.add.productChannel == '1' && $scope.add.position == '104-0')||($scope.add.productChannel == '1' && $scope.add.redirectType == '2')||( $scope.add.positionValue=='101' && $scope.add.redirectType == '2') || ($scope.add.positionValue=='102' && $scope.add.redirectType == '2') || ($scope.add.positionValue=='103'&& $scope.add.redirectType == '2')&& $scope.positionValue!=8 || $scope.add.productChannel == '4'){
            if(!$scope.add.redirectUrl){
                alert("跳转链接不能为空,请输入!")
                return;
            }
        }
        
        if($scope.add.productChannel == '0' && $scope.positionValue!=8){
            if(!$scope.add.redirectType){
                alert("跳转类型不能为空")
                return;
            }
            if($scope.add.redirectType == '2' && !$scope.add.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
            if($scope.add.redirectType == '3' && !$scope.add.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if($scope.add.redirectType == '3' && !$scope.add.pageTwo){
                alert("跳转页面不能为空")
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

        var names = $scope.add.position.split('-');
        $scope.add.position = names[0];
        if($scope.add.position=='104'&&$scope.add.productChannel=='1'&&$scope.add.showWay!='1'&&$scope.add.showWay!='2'){
            alert('请选择显示方式');
            return;
        }
        if($scope.add.position=='1'&&$scope.add.productChannel=='1'&&$scope.add.isShowBubble!='1'&&$scope.add.isShowBubble!='0'){
        	alert('请选择是否显示气泡');
            return;
        }
        if(($scope.add.position=='1'&&$scope.add.productChannel=='1'&&$scope.add.isShowBubble=='1'&&($scope.add.bubbleText==''||$scope.add.bubbleText==undefined))|| ($scope.add.productChannel=='4'&&$scope.add.isShowBubble=='1'&&($scope.add.bubbleText==''||$scope.add.bubbleText==undefined))
            || ($scope.add.productChannel=='5'&&$scope.add.isShowBubble=='1'&&($scope.add.bubbleText==''||$scope.add.bubbleText==undefined))){
            alert('请填写气泡文字');
            return;
        }
        var auditPerson = $scope.add.auditPerson;
        // 审核人
        if($scope.add.auditPerson==""||$scope.add.auditPerson==undefined){
            alert("审核人不能为空");
            return ;
        }else{
        	$scope.add.auditNo=$scope.add.auditPerson.no;
        	$scope.add.requestAuditPersonEmail=$scope.add.auditPerson.email;
        	$scope.add.auditPerson=$scope.add.auditPerson.name;
        }
        if ($scope.add.productChannel == '6') {
            $scope.add.redirectUrl = encodeURI($scope.add.redirectUrl);
        }
        console.log($scope.add);
        var url = globalConfig.basePath+"/tab/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                    $('#addTab').hide();
                    $scope.add = {};
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                    $('.addTabCheck').each(function () {
                        $(this).prop("checked",false);
                    });
                    self.checkType=0;
                    self.checkTypeH5=0;

                }else{
                    alert(data.data.message)
                }
                $scope.pageQueryTab(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.u={}
    //修改
    $scope.editTab = function(tab){
         self.isUpdateRoster = 'N';
    	 $scope.selctPageOne(tab.redirectType);
    	 $scope.selectPageOneByRDict2(tab.pageOne,tab.pageTwo);
    	 $scope.continuationTypeInfo="";
    	 $scope.continuationTypeInfo=tab.productVersion;
    	 $scope.u={}
    	 /*if(tab.showType==0){
    		$('#allBox').prop("checked",true);
            $('#whiteBox').prop("checked",false);
            $('#blackBox').prop("checked",false);
    	 }else if(tab.showType==1){
    		 $('#whiteBox').prop("checked",true);
             $('#blackBox').prop("checked",false);
             $('#allBox').prop("checked",false);
    	 }else if(tab.showType==2){
    		 $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",false);
             $('#allBox').prop("checked",false); 
    	 }else if(tab.showType==3){
    		 $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",true);
             $('#allBox').prop("checked",false); 
    	 }*/
        var type;
        if(tab.productChannel==0){
            type = "sys_product_version_wk_tab";
        }else if(tab.productChannel==1){
            type = "sys_product_version_qb_tab";
        }else if(tab.productChannel==4){
            type ="sys_product_version_applet_tab";
        }else if(tab.productChannel==5){
            type ="sys_product_version_qb_m_tab";
        }else if(tab.productChannel==6){
            type ="sys_product_version_shop_tab";
        }else{
            type = "sys_product_version_wx_tab";
        }
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
         $http({
             method: 'GET',
             url: url,
         }).then(function successCallback(data) {
         
         	$scope.typeVersionList = data.data.resp.result;
         	/*var html = '<h2>产品版本： <span ng-repeat="v in typeVersionList"><input type="checkbox" onclick="editVersionClick()" class="updateVersionCheckbox checkAll" value="{{v.label}}"/>{{v.label}}</span></h2>'
                //用$compile进行编译   
                var $html = $compile(html)($scope); 

                $('#append2').append($html); */
         	$('#editTab').show();
         	var versions = tab.productVersion.split(",");
       	 for(var i=0;i<versions.length;i++){
       		 $('.updateVersionCheckbox').each(function() {
                    if ($(this).val() == versions[i]) {
                   	 $(this).prop("checked",true);
                   	$(this).attr("checked","checked");
                    }
               });
       	 }
       	 tab.valid = tab.valid+"";
       	 tab.whiteId = tab.whiteId+"";
       	 tab.blackId = tab.blackId+"";
       	 tab.loginStatus = tab.loginStatus+"";
       	 tab.tabNameKey = tab.tabNameKey+"";
    	
       	 tab.redirectType = tab.redirectType+"";
    	 tab.pageOne =  tab.pageOne+"";
    	 tab.pageTwo =  tab.pageTwo+"";
       	 //tab.
       	 $scope.queryWhiteAndBlack();
       	 var type;
       	 if(tab.productChannel==0||tab.productChannel==2){
       	    type = "sys_product_version_wk_tab";
       	 }
       	 if(tab.productChannel==1){
       	   	type = "sys_product_version_qb_tab";
       	 }
             if(tab.productChannel==4){
                 type = "sys_product_version_applet_tab";
             }
       	 tab.productChannel=tab.productChannel+"";
       	 $("#upProductChannel").val(tab.productChannel);
       	 /*if(tab.loginStatus == 1){
        		$scope.logoutEdit = false;
             	$scope.loginEdit =  true;
        	 }else{
        		$("#quanbu").attr('disabled','disabled');
        		$scope.logoutEdit = true;
             	$scope.loginEdit =  false;
        	 }	*/ 
       	 
       	 var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
            if(tab.showType == 0){
               /* $scope.u.quanbuClick = true;
                $("#baimingdan").attr('disabled','disabled');
                $("#heimingdan").attr('disabled','disabled');
                $('#quanbu').attr('disabled','disabled');
                if(tab.loginStatus == 1){
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
                    self.operationRecord.whiteMemberListName=tab.whiteMemberListName;
                    self.operationRecord.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },300)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=tab.blackMemberListName;
                    self.operationRecord.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },300)

            }else if(tab.showType == 1){
           /*	 $("#baimingdan").removeAttr('disabled');
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
                    self.operationRecord.whiteMemberListName=tab.whiteMemberListName;
                    self.operationRecord.whiteId = tab.whiteId
                },300)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=tab.blackMemberListName;
                    self.operationRecord.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },300)
            }else if(tab.showType == 2){
            	 /*$("#baimingdan").removeAttr('disabled');
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
                    self.operationRecord.whiteMemberListName=tab.whiteMemberListName;
                    self.operationRecord.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },300)

                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=tab.blackMemberListName;
                    self.operationRecord.blackId = tab.blackId;
                },300)
            }else if(tab.showType == 3){
               /*  $("#baimingdan").removeAttr('disabled');
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
                    self.operationRecord.whiteMemberListName=tab.whiteMemberListName;
                    self.operationRecord.whiteId = tab.whiteId
                },300)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.operationRecord.blackMemberListName=tab.blackMemberListName;
                    self.operationRecord.blackId = tab.blackId;
                },300)
            }
             //修改禁用名单
             $("#editall").attr('disabled','disabled');
             $("#editwhite").attr("disabled",'disabled');
             $("#editblack").attr("disabled",'disabled');
         	//$scope.search.productVersion = $scope.typeVersionList[0].label;
         	//$scope.getSearchPositionList();
            //$scope.getEditPositionList();
         	
         }, function errorCallback(response) {
             // 请求失败执行代码
             alert("获取版本列表失败了....");
         });
         
    	
    }
    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    
    //保存修改
    $scope.saveEditTab = function(){

    	var versions = "";
        $('.updateVersionCheckbox').each(function() {
            if (this.checked == true) {
                versions= $(this).val();
            }
        });
        if(versions==""){
            alert("产品版本不能为空");
            return;
        }else{
        	$scope.operationRecord.productVersion = versions;
        }


        if($scope.operationRecord.productChannel==6){
            // 投放客户端
            var preList="";
            if($scope.operationRecord.productVersion=='h5'){
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
                $scope.operationRecord.putAddress = preList.slice(0,preList.length-1);
            }
        }

        if($scope.operationRecord.position==null||$scope.operationRecord.position==""){
            alert("请选择位置");
            return ;
        }


        if($scope.operationRecord.tabNameKey==null||$scope.operationRecord.tabNameKey==""){
            alert("请选择Tab名称");
            return ;
        }
        if($scope.operationRecord.productChannel == '1' &&$scope.operationRecord.position== '104'&&($scope.operationRecord.showWay==null||$scope.operationRecord.showWay=="")){
            alert("请选择显示方式");
            return ;
        }

    	$scope.operationRecord.preImageUrl = $('#fileUrl1').val();
        if(101!=$scope.operationRecord.position.substring(0,3)&&(105!=$scope.operationRecord.position.substring(0,3)&&$scope.operationRecord.productChannel==1)){
            if($scope.operationRecord.preImageUrl==null||$scope.operationRecord.preImageUrl==""){
                alert("请上传点击前图片");
                return ;
            }
        }
        var positionValue = '';
        if($scope.operationRecord.position!=null&&$scope.operationRecord.position!=''){

            positionValue = $scope.operationRecord.position.split('-');
        }
        $scope.operationRecord.postImageUrl = $('#fileUrl3').val();

        if(($scope.operationRecord.productChannel == '6' && !$scope.operationRecord.redirectUrl) || ($scope.operationRecord.productChannel == '1' && !$scope.operationRecord.redirectUrl&&$scope.operationRecord.position=='104-0')||($scope.operationRecord.productChannel == '1' && !$scope.operationRecord.redirectUrl && $scope.upPositionValue!=8 && $scope.operationRecord.redirectType == '2') || ($scope.operationRecord.productChannel == '4' && !$scope.operationRecord.redirectUrl) ){
            alert("跳转链接不能为空,请输入")
            return;
        }
        if($scope.operationRecord.productChannel == '0'){
            if(!$scope.operationRecord.redirectType){
                alert("跳转类型不能为空")
                return;
            }
            if($scope.operationRecord.redirectType == '2' && !$scope.operationRecord.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
            if($scope.operationRecord.redirectType == '3' && !$scope.operationRecord.pageOne){
                alert("页面类型不能为空")
                return;
            }
            if($scope.operationRecord.redirectType == '3' && !$scope.operationRecord.pageTwo){
                alert("跳转页面不能为空")
                return;
            }
        }
        if((($scope.operationRecord.productChannel=='4'||$scope.operationRecord.productChannel=='5')&&$scope.operationRecord.isShowBubble=='1'&&($scope.operationRecord.bubbleText==''||$scope.operationRecord.bubbleText==undefined))){
            alert('请填写气泡文字');
            return;
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
//        var offlineTime =$scope.operationRecord.offlineTime;
//        var offlineTimes = offlineTime.split(" ");
//        var miniTime="23:59:59";
//        $scope.operationRecord.offlineTime = offlineTimes[0]+" "+miniTime;
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




        var auditPerson = $scope.operationRecord.auditPerson;
        // 审核人
        if($scope.operationRecord.auditPerson==""||$scope.operationRecord.auditPerson==undefined){
            alert("审核人不能为空");
            return ;
        }else{
        	$scope.operationRecord.auditNo=$scope.operationRecord.auditPerson.no;
        	$scope.operationRecord.requestAuditPersonEmail=$scope.operationRecord.auditPerson.email;
        	$scope.operationRecord.auditPerson=$scope.operationRecord.auditPerson.name;
        }
        
        $scope.operationRecord.positionName = $("#editPositionName").find("option:selected").text();
        var names = $scope.operationRecord.position.split('-');
        $scope.operationRecord.position = names[0];
        //$scope.operationRecord.positNa = names[1];
        if($scope.operationRecord.productChannel==1 &&  ($scope.operationRecord.position=='10'||$scope.operationRecord.position=='104' || $scope.operationRecord.position=='10001')){
        	$scope.operationRecord.tabName = $scope.operationRecord.tabNameKey;
        }else{
        	$scope.operationRecord.tabName = $("#editTabName").find("option:selected").text();
        }
        if ($scope.operationRecord.productChannel == '6') {
            $scope.operationRecord.redirectUrl = encodeURI($scope.operationRecord.redirectUrl);
        }
        var url = globalConfig.basePath+"/tab/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                    $('#editTab').hide();
                    $scope.operationRecord = {};
                    $scope.pageQueryTab(1);
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
     * @param opType
     * @param record
     */
    $scope.positonTemp = "";
    $scope.preOperate = function(opType,record){
        console.log(opType,"11",record,"22");
        if (record.productChannel == '6') {
            record.redirectUrl = decodeURI(record.redirectUrl);
        }
        if(opType == 1){
            // $scope.operationType = 2;
            //$('.look-start-box').show()
            record.redirectType=record.redirectType+"";
            $scope.selctPageOne(record.redirectType);
            $scope.selectPageOneByRDict(record.pageOne);
            $scope.detail = angular.copy(record);
            $scope.positonTemp = $scope.subValue($scope.detail.position);
            $("#detailTab").show();
            if (self.detail.productChannel == 1 && self.detail.position.toString().substring(0,3) == '108'){
                $('#checkPop').hide();
            }
            if (self.detail.productChannel == 0 && self.detail.position.toString().substring(0,3) == '103'){
                $('#checkPop').hide();
            }


        } else if(opType == 2){
            // $scope.operationType = 1;
            //$('#editTab').show();
            //$scope.getTypeVersion(record.productChannel);

            $scope.operationRecord = angular.copy(record);
            $scope.upPositionValue= $scope.operationRecord.position;
            $scope.operationRecord.typeValue= $scope.operationRecord.typeId+"-"+$scope.operationRecord.typeName;
            $scope.operationRecord.auditPerson="";
            $scope.editTab($scope.operationRecord);
            $scope.positonTemp = $scope.subValue($scope.operationRecord.position);
            // alert($scope.subValue($scope.operationRecord.position));
            $scope.getEditPositionListShow();
            //展示黑白名单数量
            if($scope.operationRecord.whiteId != null && $scope.operationRecord.whiteId != ''
                && $scope.operationRecord.whiteId != undefined && $scope.operationRecord.whiteId != 0){
                $scope.findChannelGroupCount($scope.operationRecord.productChannel,$scope.operationRecord.whiteId);
            }
            if($scope.operationRecord.blackId != null && $scope.operationRecord.blackId != ''
                && $scope.operationRecord.blackId != undefined && $scope.operationRecord.blackId != 0){
                $scope.findBlackChannelGroupCount($scope.operationRecord.productChannel,$scope.operationRecord.blackId);
            }
            if($scope.operationRecord.putAddress != null && $scope.operationRecord.putAddress != '0'){
                if($scope.operationRecord.productVersion=='h5'){
                    $('.upPreCheckboxH5').each(function () {
                        var thisValue = $(this).val();
                        if($scope.operationRecord.putAddress.indexOf(thisValue)>=0){
                            $(this).attr("checked","checked");
                        }
                    })
                }else{
                    $('.upPreCheckbox').each(function () {
                        var thisValue = $(this).val();
                        if($scope.operationRecord.putAddress.indexOf(thisValue)>=0){
                            $(this).attr("checked","checked");
                        }
                    })
                }
            }
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
    		//$scope.effectRecord.auditEmail = array[1];
    		$scope.effectRecord.auditNo = array[0];
    	}
    	$scope.effectRecord.requestAuditDescription = $scope.requestAuditDescription;
        var url = null;
        if($scope.effectRecord.valid=='0'){
            url = globalConfig.basePath+"/tab/valid";
        } else {
            url = globalConfig.basePath+"/tab/invalid";
        }
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
            	$scope.pageQueryTab(1);
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
    	var	searchproductChannel=$("#productChannel").val();
    
		var searchproductVersion=$("#productVersion").val();

        if(searchproductChannel==null||searchproductChannel==""||searchproductChannel==undefined){
        	alert("请在查询条件中选择渠道");
            return;
        }
        if(searchproductVersion==null||searchproductVersion==""||searchproductVersion==undefined){
            alert("请在查询条件中选择产品版本");
            return;
        }

        $scope.positValue="";
        if(searchproductChannel==0 || searchproductChannel==2){
        	var type="";
        	 var posit = $scope.search.position.split('-');
        	 $scope.positValue=posit[0];
        	if(posit[0]==8){
        		type="sys_wk_tab_value_8";
        	}else if(posit[0]==9){
        		type="sys_wk_tab_value_9";
        	}
        	$scope.getShowValue(type);
        }

        if(searchproductChannel==1 && $scope.search.position=='10-0'){
        	$scope.rDictList=""
        	var type="sys_service_center_qb_type"
	            //原生original_bd_url
	            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
	            ).success(function(data) {
	                $scope.rDictList = data.resp.result;
	            })

	          if($("#typeValue").val()!="" && $("#typeValue").val()!=null){
	        	  $scope.getTypeList($("#typeValue").val());
	        	}

        }

        $scope.strotList="";
        $scope.serviceCode=0;
        $scope.search.isHomeShow="";
        if($scope.search.position=='104-0'){
            $scope.search.tabNameKey="";
            $scope.search.position=$scope.search.position.split('-')[0];
        }
        if($scope.search.position=='105-[{"tab_name_key":"700" , "tab_name":"会员"},{"tab_name_key":"701" , "tab_name":"趣玩"},{"tab_name_key":"702" , "tab_name":"社区"}]'){
            $scope.search.position=$scope.search.position.split('-')[0];
        }
     if($scope.search.position!='10-0'){

   	 	var url = globalConfig.basePath+"/tab/getPrioritylist";
   	 	$http.post(url,$scope.search).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp;
            	 $('#addSort').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
      }else{
    	  $('#addSort').show();
      }
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

    //根基类型获取数据
    $scope.getTypeList = function(typeValue){
    	$scope.search.typeId=typeValue;
    	$scope.search.tabNameKey="";
    	var url = globalConfig.basePath+"/tab/getPrioritylist";

   	 	$http.post(url,$scope.search).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp;
            	 $('#addSort').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
    }
    //服务中心首页
    $scope.serviceSort = function(){
    	$scope.sort.showLine='2';
    	var	searchproductChannel=$("#productChannel").val();

		var searchproductVersion=$("#productVersion").val();

		 var position = $scope.search.position;

        if(searchproductChannel==null||searchproductChannel==""||searchproductChannel==undefined || searchproductChannel=='0'){

        		alert("请在查询条件中选择渠道为玖富钱包APP");

            return;
        }
        if(searchproductVersion==null||searchproductVersion==""||searchproductVersion==undefined){
            alert("请在查询条件中选择产品版本");
            return;
        }

        if(position==null||position==""||position==undefined || position!='10-0'){
            alert("请选择tab位置为服务中心！");
            return;
        }
        $scope.search.typeId="";
        $scope.search.isHomeShow=1;
        $scope.serviceCode=1;
   	 	var url = globalConfig.basePath+"/tab/getPrioritylist";
   	 	$http.post(url,$scope.search).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp;
            	 $('#addSort').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
    }
    //服务中心类型排序
    $scope.serTypeSort = function(){
    	var	searchproductChannel=$("#productChannel").val();

		var searchproductVersion=$("#productVersion").val();

		 var position = $scope.search.position;

        if(searchproductChannel==null||searchproductChannel==""||searchproductChannel==undefined || searchproductChannel=='0'){

        		alert("请在查询条件中选择渠道为玖富钱包APP");

            return;
        }
        if(searchproductVersion==null||searchproductVersion==""||searchproductVersion==undefined){
            alert("请在查询条件中选择产品版本为494");
            return;
        }

        if(position==null||position==""||position==undefined || position!='10-0'){
            alert("请选择tab位置为服务中心！");
            return;
        }
        $scope.search.typeId="";
      //  $scope.search.isHomeShow=1;
        $scope.serviceCode=2;
   	 	var url = globalConfig.basePath+"/tab/getServiceType";
   	 	$http.post(url,$scope.search).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp;
            	 $('#addSort').show();
             }else{
                 alert(data.data.message)
             }
         },function errorCallback(response) {
             alert("请求失败了....");
         }
   	 	);
    }

    //
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
    	$scope.showLine="";
    	if($scope.serviceCode==1){
    		$scope.showLine=$scope.sort.showLine;
    	}
    	
        var url = globalConfig.basePath+"/tab/priority?ids="+ids+"&showLine="+$scope.showLine+"&serviceSode="+$scope.serviceCode;
        $http.get(url).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                self.strotList = {};
                $scope.pageQueryTab(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //取消排序
    $scope.moveCancel = function(){
        $('#addSort').hide();
        self.strotList={};
        self.rDictList={};
       // self.ser.typeValue="";
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
            // $scope.operationRecord.whiteId = '0';
            // $scope.operationRecord.blackId = '0'

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
          /*  $("#baimingdan").removeAttr('disabled','disabled');
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
    $scope.heiClick = function(){
        if($('#heimingdan').is(':checked')){
            $('#heiSelect').removeAttr('disabled','disabled');
        }else{
            $("#heiSelect").attr('disabled','disabled');
            self.operationRecord.blackMemberListName= "NO_RULE"
            self.operationRecord.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
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
            // $scope.add.whiteId = '';
            // $scope.add.blackId = '';
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
            $("#whiteID").attr('disabled','disabled');
            self.strategyReload();
            $('#userNameLikeSearch').hide();
        }
    }
    //添加黑名单
    //黑名单选中事件 type 1 添加 0修改
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



    //取消修改
    $scope.updateCancel = function(){
    	$('#editTab').hide();
        $scope.u={};
    }
    
    //改变登录状态已登录
    $scope.loginClick = function(){
        if($('#login').is(':checked')){
        	$scope.logout = false;
        	$scope.login =  true;
        	$("#all").removeAttr('disabled','disabled');
        }
        $scope.getPositionList();
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
    	$scope.getPositionList();
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
    $scope.versionClick = function(){
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
        }
        $('.addTabCheck').each(function () {
            $(this).prop("checked",false);
        });
        self.checkType=0;
        self.checkTypeH5=0;
    	$scope.getPositionList();
    }
    
    $scope.editVersionClick = function(){
    	$scope.getEditPositionList();
    }
  
    $scope.positionValue="";
    $scope.getNameList = function(position){
        var arr =position.split("-");
        self.add.pos=arr[0];
        if((arr[0]=='8' && $scope.add.productChannel=='0')||arr[0]=='8' && $scope.add.productChannel=='2'){
            $scope.addressTypeShow=false;
        }else{
            $scope.addressTypeShow=true;
        }
    	 $scope.positionValue = position.split('-')[0];
    	if(position!=null&&position!="" && position!='10-0'){
    		var names = position.split('-');
    		var valueTab = names[0];
    		var tabNameJson = names[1];
    		if(valueTab == '8'){
    		    $scope.postionShow = 0;
            }else{
                $scope.postionShow = 1;
            }
    		$scope.nameList = JSON.parse(tabNameJson);
    	}else if(position=='10-0'){
    		 var type="sys_service_center_qb_type"
    	            //原生original_bd_url
    	            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
    	            ).success(function(data) {
    	                $scope.rDictList = data.resp.result;
    	            })
    	}else{
    		$scope.nameList = [];
    	    $scope.add.tabNameKey = '';
    	}
    	 
    } 
    
    $scope.getSearchNameList = function(position){
        if(position==null || position==""){
             $scope.search.tabNameKey="";
        }
    	if(position!=null&&position!="" && position!='10-0'){
    		var names = position.split('-');
    		var tabNameJson = names[1];
    		$scope.searchNameList = JSON.parse(tabNameJson);
    		$scope.search.tabNameKey = $scope.searchNameList[0].tab_name_key;
    	}else if(position=='10-0'){
   		 var type="sys_service_center_qb_type"
	            //原生original_bd_url
	            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
	            ).success(function(data) {
	                $scope.rDictList = data.resp.result;
	            })
	}else{
    		$scope.searchNameList = [];
    		$scope.add.tabNameKey = '';
    	}
    	 
    }
    
    $scope.getEditNameList = function(position){
    	 $scope.upPositionValue = position.split('-')[0];
    	if(position!=null&&position!="" && position!='10-0'){
    		var names = position.split('-');
    		var valuesTab = names[0];
    		var tabNameJson = names[1];
    		if(valuesTab=='8'){
                $scope.postionShow = 1;
            }else{
                $scope.postionShow = 0;
            }
    		$scope.editNameList = JSON.parse(tabNameJson);
    		$scope.operationRecord.tabNameKey = $scope.editNameList[0].tab_name_key;
    	}else if(position=='10-0'){
   		 var type="sys_service_center_qb_type"
	            //原生original_bd_url
	            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
	            ).success(function(data) {
	                $scope.rDictList = data.resp.result;
	            })
    	}else{
    		$scope.editNameList = [];
    		$scope.operationRecord.tabNameKey = '';
    	}
    	 
    }
    $scope.changeStatus = function(){
    	$scope.getSearchPositionList();
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
        var url = globalConfig.basePath+"/tab/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
            	$scope.pageQueryTab(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    
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
    	$scope.getPositionList();

        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
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
            $scope.operationRecord.whiteId = '0';
            $scope.operationRecord.blackId = '0';
            $("#baimingdan").attr("checked",false);
            $("#heimingdan").attr("checked",false);
        }
    	$scope.getEditPositionList();

        //黑白名单操作
        self.operationRecord.whiteMemberListName= "NO_RULE"
        self.operationRecord.whiteId=null;
        self.strategyReloadUpdate();
        $('#userNameLikeSearchUpdate').hide();


        self.operationRecord.blackMemberListName= "NO_RULE"
        self.operationRecord.blackId=null;
        self.blackStrategyReloadUpdate();
        $('#userNameLikeBlackSearchUpdate').hide();
    };
    
    
    $scope.isSelected = function(id){
   		if($scope.continuationTypeInfo){
   			var versions =$scope.continuationTypeInfo.split(",");
   	   		for(var i=0;i<versions.length;i++){
   	   			if(id.length==versions[i].length && versions[i].indexOf(id)>=0){
   	   	   			return true;
   	   	   		}
   	   		}
   		}
   		return false;
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

    //获取二级页面-edit
    $scope.selectPageOneByRDict2 = function(v,pageTwo){
        var type = "wk_protogenesis_page_two";
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.rPositionDictList2 = data.resp.result;
            if($scope.rPositionDictList2.length=='1'){
                $scope.operationRecord.pageTwo=data.resp.result[0].value;
            }else{
                $scope.operationRecord.pageTwo=data.resp.result[0].value;
            }
            if(pageTwo!='' && pageTwo != null){
                $scope.operationRecord.pageTwo = pageTwo;
            }
        })

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
        }
        self.addPostionCheck();
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
        if(self.add.productChannel==0 || self.add.productChannel==2){
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
        if(self.add.productChannel==0 || self.add.productChannel==2){
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

    self.decodeURIStr = function (urlStr) {
        return decodeURI(urlStr)
    };

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
    /**显示投放客户端*/
    self.showAddress = function (values) {
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


}]);