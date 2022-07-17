'use strict';
var App = angular.module('myApp', [], angular.noop);
App.controller("rootController", ['$scope','$http',  function ($scope,$http) {
    
    $scope.search = {};
    $scope.search.productChannel = '0';
    $scope.search.type = '1';
    $scope.search.loginStatus = '1';
    $scope.search.status = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.prioritylist = {};
    $scope.add = {};
    $scope.audit={};
    $scope.valid={}
    $scope.add.productVersion = [];
    $scope.loginName = globalConfig.loginName;
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
             swal("上传成功")
        }
    	}).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                swal("上传图片失败：系统暂不支持该类型图片上传");
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
    
    //$scope.queryWhiteAndBlack();
    //营销打标
    $scope.pageQueryMark = function(pageNum){
     	$scope.search.productVersion ="";
	    	if($scope.pages<pageNum&&pageNum!=1){
	    	    return;
	    	}
        if(!pageNum){
        	$scope.search.pageNum = $scope.pageNum;
        } else {
            $scope.search.pageNum = pageNum;
        }
        //$scope.search.status=0;
        //$scope.search.productChannel=1;
        var onlineTime = $("#queryOnlineTime").val();
        if (onlineTime != null && onlineTime != '') {
        	$scope.search.onlineTime = $("#queryOnlineTime").val();
        }
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/list";
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
    	$scope.search.loginStatus = '1';
    	$scope.search.status = '';
        $scope.search.type='1';
    	$scope.getTypeVersionList("sys_product_version_wk_marking");
    	$('input[name="queryOnlineTime"]').val('');
    	//$scope.search.productVersion = $scope.typeVersionList[0].label;
    }
    //获取悟空和微信产品名称列表
    $scope.getProductList = function(){
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/wkProductList";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        	if(data.data.code=='200'){
        		$scope.productList = data.data.data.productList;
        	}else{
        		alert("获取悟空产品名称列表失败了....");
        	}
        	
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取悟空产品名称列表失败了....");
        });
    };
    $scope.getProductList();

    //获取悟空APP产品名称列表
    $scope.getwkProductListAPP = function(){
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/wkProductListAPP";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if(data.data.code=='200'){
                $scope.wkProductListAPP = data.data.data.wkProductListAPP;
            }else{
                alert("获取悟空产品名称列表失败了....");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取悟空产品名称列表失败了....");
        });
    };
    $scope.getwkProductListAPP();
    
    //获取钱包产品名称列表
    $scope.getQbProductList = function(){
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/qbProductList";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        	if(data.data.code=='200'){
        		$scope.qbProductList = data.data.data.productList;
        	}else{
        		alert("获取钱包产品名称列表失败了....");
        	}
        	
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取钱包产品列表失败了....");
        });
    };
    $scope.getQbProductList();
    
    //按渠道类型获取版本列表
    $scope.getTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeVersionList = data.data.resp.result;
        	$scope.search.productVersion = $scope.typeVersionList[0].label;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
   //按渠道类型获取版本列表-查询
    $scope.getSearchTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeVersionList = data.data.resp.result;
        	$scope.search.productVersion = $scope.typeVersionList[0].label;
        	$scope.pageQueryMark(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getSearchTypeVersionList("sys_product_version_wk_marking");
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQueryMark(1);
    });
    $("#productChannel").change(function(){
    	var channel = $("#productChannel").val();
    	if(channel==0){
    		$scope.getTypeVersionList("sys_product_version_wk_marking");
    	}else if(channel==1){
    		$scope.getTypeVersionList("sys_product_version_qb_marking");
    	}else{
    		$scope.getTypeVersionList("sys_product_version_wx_marking");
    	}
   });
    
   $scope.getTypeVersion = function(channel){
	if(channel==0){
   		$scope.getTypeVersionList("sys_product_version_wk_marking");
   	}else if(channel==1){
   		$scope.getTypeVersionList("sys_product_version_qb_marking");
   	}else{
   		$scope.getTypeVersionList("sys_product_version_wx_marking");
   	}
       $scope.add.type='1';
       $scope.search.type='1';
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
    $scope.addBid = function(){
    	$scope.login = false;
    	$scope.logout = false;   
    	$scope.wbSelected = [] ; 
    	$scope.selected = [] ;
    	$scope.add = {};
        $scope.add.productVersion = [];
        $scope.add.productChannel = '0';
        $scope.add.type = '1';
        $scope.add.valid = '1';
        $scope.add.productNameType = '';
        $scope.add.position = '';
        $scope.getTypeVersionList('sys_product_version_wk_marking');
        $('#addBid').show();
        $scope.queryWhiteAndBlack();
        $scope.allxx =true;
        $scope.whitexx =false;
        $scope.blackxx =false;
        $('#fileUrl').val('');
        $('#addOnlineTime').val('');
        $('#addOfflineTime').val('');
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        $scope.add.whiteId = '';
        $("#whiteID").attr('disabled','disabled');
        $scope.add.blackId = '';
        $("#blackSelect").attr('disabled','disabled');

    }
    
    //添加
    $scope.closeAddBid = function(){    
        $('#addBid').hide();

    }
    
    
    $scope.checkAddOnlineTime = function(){
    	 $scope.add.onlineTime = $('#addOnlineTime').val()+"";
         var onlineTime = $scope.add.onlineTime;
         onlineTime = onlineTime.substring(0,10);
         //alert(onlineTime);
         if(onlineTime==getToday()){
         	$('#checkShow').show();
         } else {
        	 $scope.saveBid();
         }
    }
    
    $scope.checkEditOnlineTime = function(){
   	 $scope.operationRecord.onlineTime = $('#operationOnlineTime').val()+"";
        var onlineTime = $scope.operationRecord.onlineTime;
        onlineTime = onlineTime.substring(0,10);
        //alert(onlineTime);
        if(onlineTime==getToday()){
        	$('#editCheckShow').show();
        } else {
       	    $scope.saveEditBid();
        }
   }
    
    $scope.saveBid = function(){
    	if($scope.add.productChannel==null){
            alert("渠道不能为空");
            return;
        }
    	if($scope.add.type==null){
            alert("产品类型不能为空");
            return;
        }
    	 /**var versions = "";
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
        }**/
        $scope.add.productVersion ='';
      /*  var login = $("#login").prop("checked");
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
        /*if($scope.add.productChannel==0||$scope.add.productChannel==2){
    		var nameType = $scope.add.productNameType;
    		nameType = nameType.split('-');
    		$scope.add.productNameType = nameType[0];
    		$scope.add.productName = nameType[1];null
    	}
        if($scope.add.productChannel==1){
        	$scope.add.productName = $scope.add.productNameType;
    	}*/
        if($scope.add.productNameType==null||$scope.add.productNameType==""){
            alert("请选择产品");
            return ;
        }
        $scope.add.markingImageUrl = $('#fileUrl').val();
       /* if($scope.add.type=='1'&&($scope.add.markingImageUrl==null||$scope.add.markingImageUrl=="") && $scope.add.productChannel==1){
            alert("请选上传图片");
            return ;
        }*/
        /*if($scope.add.type=='1'&&($scope.add.profit==null||$scope.add.profit==""||$scope.add.profit<=0)&&$scope.add.productChannel!=1){
            alert("请填写标准回报率");
            return ;
        }
        if($scope.add.type=='1'&&($scope.add.expandProfit==null||$scope.add.expandProfit=="")&&$scope.add.productChannel!=1){
            alert("请填写扩展回报率");
            return ;
        }*/
        if($scope.add.productChannel==0&&($scope.add.markingLabel==null||$scope.add.markingLabel=="")){
            alert("请填写打标标签");
            return ;
        }
        /*if(null!=$scope.add.profit||null!=$scope.add.expandProfit){
            if($scope.add.type=='1'&&$scope.add.productChannel==1){
                var productName = $scope.add.productNameType.split('-');
                var standProfit = productName[2];
                if(standProfit!=addNum(Number($scope.add.profit),Number($scope.add.expandProfit))){
                    alert("标准回报加扩展回报之和不等于" + standProfit);
                    return;
                }
            }
        }*/
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
        // if($scope.add.productChannel==1&&($scope.add.markingText==null||$scope.add.markingText=="")){
        //     alert("请填写打标文案");
        //     return ;
        // }
        if($scope.add.type=='2'&&($scope.add.color==null||$scope.add.color=="")){
            alert("请填写背景色值");
            return ;
        }
        $('.checkbox').each(function () {
            if(this.checked == true){
            	$scope.add.showType = $(this).val();
            }
        })
        // 黑白名单默认处理
        $scope.add.showType = 0;
        $scope.add.blackId==0;
        	$scope.add.whiteId==0;
       /** var all = $("#all").prop("checked");
        if(all){
            $scope.add.showType = 0;
        }else{
            var white = $("#white").prop("checked");
            var black = $("#black").prop("checked");
            if(white&&black){
                $scope.add.showType = 3;
                if(($scope.add.blackId==""||$scope.add.blackId==undefined)||($scope.add.whiteId==""||$scope.add.whiteId==undefined)){
        			alert('请选择黑白名单');
            		return;	
        		}
            }else{
                if(white){
                    $scope.add.showType = 1;
                    if($scope.add.whiteId==""||$scope.add.whiteId==undefined){
            			alert('请选择白名单');
                		return;	
            		}
                }else if(black){
                    $scope.add.showType = 2;
                    if($scope.add.blackId==""||$scope.add.blackId==undefined){
            			alert('请选择黑名单');
                		return;	
            		}
                }else{
                    alert('请选择展示人群');
                    return;
                }
            }
        }**/
        var auditPersion = $scope.add.auditPersion;
        if($scope.add.auditPersion==null || $scope.add.auditPersion==""){
            alert("请选择审核人");
            return ;
        }else{
            $scope.add.auditPerson=$scope.add.auditPersion.name;
            $scope.add.requestAuditPersonEmail=$scope.add.auditPersion.email;
            $scope.add.auditNo=$scope.add.auditPersion.no;
        }
    	
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                    $('#addBid').hide();
                    $scope.add = {};
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                }else{
                    alert(data.data.message)
                }
                $('#checkShow').hide();
                $scope.pageQueryMark(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.u={}
    //修改
    $scope.editBid = function(bid){
    	 $scope.u={};
    	/* if(bid.showType==0){
    		$('#allBox').prop("checked",true);
            $('#whiteBox').prop("checked",false);
            $('#blackBox').prop("checked",false);
    	 }else if(bid.showType==1){
    		 $('#whiteBox').prop("checked",true);
             $('#blackBox').prop("checked",false);
             $('#allBox').prop("checked",false);
    	 }else if(bid.showType==2){
    		 $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",false);
             $('#allBox').prop("checked",false); 
    	 }else if(bid.showType==3){
    		 $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",true);
             $('#allBox').prop("checked",false); 
    	 }*/
    	 bid.valid = bid.valid+"";
    	 bid.whiteId = bid.whiteId+"";
    	 bid.blackId = bid.blackId+"";
    	
    	 $scope.queryWhiteAndBlack();
    	 var type;
    	 var date = new Date(bid.startTime);
    	 if(bid.productChannel==0||bid.productChannel==2){
    		if(bid.type=='1'){
                var lcProductId = bid.lcProductId;
                var productSecondCat = bid.productSecondCat;
                if (lcProductId!=null&&lcProductId!=""&&lcProductId!=0) {
                    var name = bid.productNameType;
                    var splits = name.split("-");
                    bid.productNameType=splits[0]+"-IdLogo-"+splits[1]+"-"+splits[2];
                }
                if (productSecondCat!=null&&productSecondCat!=""&&productSecondCat!=0){
                    var name=bid.productNameType;
                    var splits = name.split("-");
                    if(productSecondCat.indexOf("C") == -1) {
                        bid.productNameType = bid.productSecondCat + "-" + splits[0] + "-" + splits[1];
                    }else{
                        bid.productNameType = bid.productSecondCat + "-" + splits[0];
                    }
                    }
    		}
    	    type = "sys_product_version_wk_marking";
    	 }
    	 if(bid.productChannel==1){
    		if(bid.type=='1'){
    			bid.productNameType = bid.productNameType + '-' + bid.period + '-' + date.getTime();
    		}
    	   	type = "sys_product_version_qb_marking";
    	 }
    	 bid.productChannel=bid.productChannel+"";
    	 $("#upProductChannel").val(bid.productChannel);
    	 if(bid.loginStatus == 1){
     		$scope.logoutEdit = false;
          	$scope.loginEdit =  true;
     	 }else{
     		$("#quanbu").attr('disabled','disabled');
     		$scope.logoutEdit = true;
          	$scope.loginEdit =  false;
     	 }	 
    	 var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;        
         if(bid.showType == 0){
        	 $scope.u.quanbuClick = true;
             $("#baimingdan").attr('disabled','disabled');
             $("#heimingdan").attr('disabled','disabled');
             if(bid.loginStatus == 1){
            	 $('#quanbu').removeAttr('disabled','disabled');
             }
             $("#bDropDown").attr('disabled','disabled');
             $("#heiSelect").attr('disabled','disabled');
         }else if(bid.showType == 1){
        	 $("#baimingdan").removeAttr('disabled','disabled');
        	 $("#heimingdan").removeAttr('disabled','disabled');
        	 $("#bDropDown").removeAttr('disabled','disabled');
             $scope.u.baimingdClick = true;
         }else if(bid.showType == 2){
        	 $("#baimingdan").removeAttr('disabled','disabled');
        	 $("#heimingdan").removeAttr('disabled','disabled');
        	 $("#heiSelect").removeAttr('disabled','disabled');
             $scope.u.heimingdanClick = true;
         }else if(bid.showType == 3){
        	 $("#baimingdan").removeAttr('disabled','disabled');
        	 $("#heimingdan").removeAttr('disabled','disabled');
        	 $("#bDropDown").removeAttr('disabled','disabled');
             $("#heiSelect").removeAttr('disabled','disabled');
             $scope.u.baimingdClick = true;
             $scope.u.heimingdanClick = true;
         }

    	
    }
    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    
    //保存修改
    $scope.saveEditBid = function(){
    	/*if($scope.operationRecord.productChannel==null){
            alert("渠道不能为空");
            return;
        }
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
        }*/
        /*if($scope.operationRecord.productChannel==0||$scope.operationRecord.productChannel==2){
    		var nameType = $scope.operationRecord.productNameType;
    		nameType = nameType.split('-');
    		$scope.operationRecord.productNameType = nameType[0];
    		$scope.operationRecord.productName = nameType[1];
    	}
        if($scope.operationRecord.productChannel==1){
        	$scope.operationRecord.productName = $scope.operationRecord.productNameType;
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
        if($scope.operationRecord.productNameType==null||$scope.operationRecord.productNameType==""){
            alert("请选择产品");
            return ;
        }
        if($scope.operationRecord.type==null){
            alert("产品类型不能为空");
            return;
        }
        $scope.operationRecord.markingImageUrl = $('#fileUrl1').val();
        /*if($scope.operationRecord.type=='1'&&($scope.operationRecord.markingImageUrl==null||$scope.operationRecord.markingImageUrl=="")&& $scope.operationRecord.productChannel==1){
            alert("请选上传图片");
            return ;
        }*/
        /*if($scope.operationRecord.type=='1'&&($scope.operationRecord.profit==""||$scope.operationRecord.profit<=0)&& $scope.operationRecord.productChannel!=1){
            alert("请填写标准回报率");
            return ;
        }
        if($scope.operationRecord.type=='1'&&($scope.operationRecord.expandProfit==null||$scope.operationRecord.expandProfit=="")&& $scope.operationRecord.productChannel!=1){
            alert("请填写扩展回报率");
            return ;
        }*/
        // if($scope.operationRecord.type=='1'&&$scope.operationRecord.productChannel==1){
        // 	var productName = $("#editProductNameType").find("option:selected").text();
        // 	productName = productName.split('-');
        // 	var standProfit = productName[2];
        // 	if(standProfit!=addNum(Number($scope.operationRecord.profit),Number($scope.operationRecord.expandProfit))){
        // 		alert("标准回报加扩展回报之和不等于" + standProfit);
        // 		return;
        // 	}
        // }
        if($scope.operationRecord.productChannel==0&&($scope.operationRecord.markingLabel==null||$scope.operationRecord.markingLabel=="")){
            alert("请填写打标标签");
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
        // if($scope.operationRecord.productChannel==1 && ($scope.operationRecord.markingText==null||$scope.operationRecord.markingText=="")){
        //     alert("请填写打标文案");
        //     return ;
        // }
        if($scope.operationRecord.type=='2'&&($scope.operationRecord.color==null||$scope.operationRecord.color=="")){
            alert("请填写背景色值");
            return ;
        }
        // 黑白名单默认处理
        $scope.operationRecord.showType = 0;
        $scope.operationRecord.blackId==0;
        	$scope.operationRecord.whiteId==0;
        
//        var all = $("#quanbu").prop("checked");
//        if(all){
//            $scope.operationRecord.showType = 0;
//        }else{
//            var white = $("#baimingdan").prop("checked");
//            var black = $("#heimingdan").prop("checked");
//            if(white&&black){
//                $scope.operationRecord.showType = 3;
//                if(($scope.operationRecord.blackId==""||$scope.operationRecord.blackId==undefined||$scope.operationRecord.blackId==0)||($scope.operationRecord.whiteId==""||$scope.operationRecord.whiteId==undefined||$scope.operationRecord.whiteId==0)){
//        			alert('请选择黑白名单');
//            		return;	
//        		}
//            }else{
//                if(white){
//                    $scope.operationRecord.showType = 1;
//                    if($scope.operationRecord.whiteId==""||$scope.operationRecord.whiteId==undefined||$scope.operationRecord.whiteId==0){
//            			alert('请选择白名单');
//                		return;	
//            		}
//                }else if(black){
//                    $scope.operationRecord.showType = 2;
//                    if($scope.operationRecord.blackId==""||$scope.operationRecord.blackId==undefined||$scope.operationRecord.blackId==0){
//            			alert('请选择黑名单');
//                		return;	
//            		}
//                }else{
//                    alert('请选择展示人群');
//                    return;
//                }
//            }
//        }
        var update_auditPersion = $scope.operationRecord.auditPersion;
        if($scope.operationRecord.auditPersion==null || $scope.operationRecord.auditPersion==""){
            alert("请选择审核人");
            return ;
        }else{
            $scope.operationRecord.auditPerson=$scope.operationRecord.auditPersion.name;
            $scope.operationRecord.auditNo=$scope.operationRecord.auditPersion.no;
        }
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                		alert('修改成功');
                    $('#editBid').hide();
                    $('#editCheckShow').hide();
                    $scope.operationRecord = {};
                    $scope.pageQueryMark(1);
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
    $scope.preOperate = function(opType,record){
        if(opType == 1){
            // $scope.operationType = 2;
            $("#detailBid").show();
            $scope.detail = angular.copy(record);
        } else if(opType == 2){
            // $scope.operationType = 1;
            $scope.operationRecord={};
            $scope.operationRecord = angular.copy(record);
            $scope.editBid($scope.operationRecord);
            if(record.productChannel==0 || record.productChannel==2){
                var lcProductId = record.lcProductId;
                var productSecondCat = record.productSecondCat;
                var valueSet;
                if (lcProductId!=null&&lcProductId!=""&&lcProductId!=0) {
                    var name = record.productNameType;
                    var splits = name.split("-");
                    //修改页面的下拉框对应的value值
                    valueSet = splits[0]+"-IdLogo-"+splits[1]+"-"+splits[2];
                }
                if (productSecondCat!=null&&productSecondCat!=""&&productSecondCat!=0){
                    var name=record.productNameType;
                    var splits = name.split("-");
                    //修改页面的下拉框对应的value值
                    if(productSecondCat.indexOf("C") == -1) {
                        valueSet = record.productSecondCat + "-" + splits[0] + "-" + splits[1];
                    }else{
                        valueSet = record.productSecondCat + "-" + splits[0];
                    }
                }
                //获取select下拉框的所有值
                var numbers = $("#operationRecordproductNameType").find("option");
                for (var j = 0; j < numbers.length; j++) {
                    if ($(numbers[j]).val() == valueSet) {
                        $(numbers[j]).prop("selected","selected");
                    };
                }
            }
            $('#editBid').show();
        } else if(opType == 3){
            $scope.operationRecord = record;
            $('#effectBid').show();
        } else if(opType == 4){
            $('#auditShow').show();
            $scope.audit.id=record.id;
            $scope.audit.auditStatus='1';
        }
    };
    // 生效、失效
    $scope.validateRecord = function(){
        // 保存数据
        var url = null;
        if($scope.operationRecord.valid=='0'){
            url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/valid";
        } else {
            url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/invalid";
        }
        var bean = $scope.valid.auditPersion;
        if(bean==null){
            swalMsg("请选择审核人");
            return;
        }
        var auditPerson=bean.name;
        var requestAuditPersonEmail=bean.email;
        var auditNo=bean.no;

        $http.get(url+"?id="+$scope.operationRecord.id+"&auditPerson="+auditPerson+"&requestAuditPersonEmail="+
            requestAuditPersonEmail+"&auditNo="+auditNo+"&auditDescription="+$scope.operationRecord.auditDescription).then(function successCallback(callback) {
            $('#effectBid').hide();
            if(callback.data.code == '000'){
                $scope.valid={};
                $scope.pageQueryMark(1);
                swalMsg("操作成功");
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };

    $scope.cancelValidateRecord=function(){
        $scope.valid={};
    }
    //优先级排序
    $scope.sort = function(){	
    	var	searchproductChannel=$("#productChannel").val();
		//var searchproductVersion=$("#productVersion").val();
		if(searchproductChannel==null||searchproductChannel==""||searchproductChannel==undefined){
        	alert("请在查询条件中选择渠道");
            return;
        }
//        if(searchproductVersion==null||searchproductVersion==""||searchproductVersion==undefined){
//            alert("请在查询条件中选择产品版本");
//            return;
//        }
    	 var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/getPrioritylist";
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
        /*$('.listChecked').each(function(){
            if(this.checked == true){
                ids += $(this).val() + ",";
            }
        })
        if(ids == "" ||ids == null){
            alert("请选择要排序的对象");
            return;
        }*/
        ;
       /* var idArray = ids.split(',');
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
    	if($scope.strotList.length<2){
    		alert('操作成功');
    		$('#addSort').hide();
    		return;
    	}
    	var ids = "";
    	for(var i=0;i<$scope.strotList.length;i++){
    		ids = ids + $scope.strotList[i].id + ",";
    	}
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/priority?ids="+ids;
        $http.get(url).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                $scope.strotList = {};
                $scope.pageQueryMark(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    }
    

    //取消排序
    $scope.moveCancel = function(){
        $('#addSort').hide();
        $scope.strotList={};
    }
    //声明对象
    function ObjSort(id,desc) 
    {
        this.id = id;
        this.markingDesc= desc;  
    }
    
    //添加全部选中事件
   /* $scope.complete = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
        }else {
            $("#white").removeAttr('disabled','disabled');
            $("#black").removeAttr('disabled','disabled');
        }
    }

    //添加白名单
    $scope.whiteClick = function(){
        if($('#white').is(':checked')){
            $('#whiteId').removeAttr('disabled','disabled');
        }else{
        	$scope.add.whiteId = '';
            $("#whiteId").attr('disabled','disabled');
        }
    }
    //添加黑名单
    $scope.blackClick = function(){
        if($('#black').is(':checked')){
            $('#blackId').removeAttr('disabled','disabled');
        }else{
        	$scope.add.blackId = '';
            $("#blackId").attr('disabled','disabled');
        }
    }
    */
    
   /* //修改全部选中事件
    $scope.upComplete = function(){
        $("#whiteBox").attr("checked",false);
        $("#blackBox").attr("checked",false);
        if($('#allBox').is(':checked')){
            $("#whiteBox").attr('disabled','disabled');
            $("#blackBox").attr('disabled','disabled');
        } else {
            $("#whiteBox").removeAttr('disabled','disabled');
            $("#blackBox").removeAttr('disabled','disabled');
        }
    }

    //修改白名单
    $scope.upWhiteClick = function(){
        if($('#whiteBox').is(':checked')){
            $('#upWhiteId').removeAttr('disabled','disabled');
        }else{
        	$scope.operationRecord.whiteId = '';
            $("#upWhiteId").attr('disabled','disabled');
        }
    }
    //修改黑名单
    $scope.upBlackClick = function(){
        if($('#blackBox').is(':checked')){
            $('#upBlackId').removeAttr('disabled','disabled');
        }else{
        	$scope.operationRecord.blackId = '';
            $("#upBlackId").attr('disabled','disabled');
        }
    }*/
    //修改全部选中事件
    $scope.allSelect = function(){
        $("#baimingdan").attr("checked",false);
        $("#heimingdan").attr("checked",false);
        if($('#quanbu').is(':checked')){
            $("#baimingdan").attr('disabled','disabled');
            $("#heimingdan").attr('disabled','disabled');
            $("#bDropDown").attr('disabled','disabled');
            $("#heiSelect").attr('disabled','disabled');
            $scope.operationRecord.whiteId = '0';
            $scope.operationRecord.blackId = '0';
        }
        else {
            $("#baimingdan").removeAttr('disabled','disabled');
            $("#heimingdan").removeAttr('disabled','disabled');
        }
    }

    //修改白名单
    $scope.baiClick = function(){
        if($('#baimingdan').is(':checked')){
            $('#bDropDown').removeAttr('disabled','disabled');
        }else{
            $scope.operationRecord.whiteId = '0';
            $("#bDropDown").attr('disabled','disabled');
        }
    }
    //修改黑名单
    $scope.heiClick = function(){
        if($('#heimingdan').is(':checked')){
            $('#heiSelect').removeAttr('disabled','disabled');
        }else{
            $scope.operationRecord.blackId = '0';
            $("#heiSelect").attr('disabled','disabled');
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
        }
        else {
            $("#white").removeAttr('disabled','disabled');
            $("#black").removeAttr('disabled','disabled');
        }
    }

    //添加白名单
    $scope.baiChecked = function(){
        if($('#white').is(':checked')){
            $('#whiteID').removeAttr('disabled','disabled');
        }else{
            $scope.add.whiteId = '';
            $("#whiteID").attr('disabled','disabled');
        }
    }
    //添加黑名单
    $scope.blackClick = function(){
        if($('#black').is(':checked')){
            $('#blackSelect').removeAttr('disabled','disabled');
        }else{
            $scope.add.blackId = '';
            $("#blackSelect").attr('disabled','disabled');
        }
    }
    
   //取消修改
    $scope.updateCancel = function(){
    	$('#editBid').hide();
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
    
    //获取钱包和悟空出借页产品列表
    $scope.getInvestProductList = function(type){
        var url = globalConfig.basePath+"/rDict/getByType?type=wk_mark_tz_product";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        	$scope.wkInvestProductList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取悟空出借页产品列表失败了....");
        });
        url = globalConfig.basePath+"/rDict/getByType?type=qb_mark_tz_product";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        	$scope.qbInvestProductList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取钱包出借页产品列表失败了....");
        });
    };
    $scope.getInvestProductList();

    //审核
    $scope.confirm = function(){
        var url = globalConfig.basePath+"/appConfig/rMarketingMarkConfig/audit";
        $http.post(url,$scope.audit).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.audit={};
                    swalMsg("审核成功");
                    $('#auditShow').hide();
                    $scope.pageQueryMark(1);
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
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
    function addNum (num1, num2) {  
        var sq1,sq2,m;  
        try {  
            sq1 = num1.toString().split(".")[1].length;  
        }  
        catch (e) {  
            sq1 = 0;  
        }  
        try {  
            sq2 = num2.toString().split(".")[1].length;  
        }  
        catch (e) {  
            sq2 = 0;  
        }  
        m = Math.pow(10,Math.max(sq1, sq2));  
        return (num1 * m + num2 * m) / m;  
    }
    
    function getToday(){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
   }

}]);