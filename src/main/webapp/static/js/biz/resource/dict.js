'use strict';
var App = angular.module('dictApp', [], angular.noop);
App.controller("dictController", ['$scope','$http',  function ($scope,$http) {
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '0';
    $scope.search.loginStatus = '2';
    $scope.search.auditStatus = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
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
    
    //开机屏查询
    $scope.pageQueryDict = function(pageNum){
 
    	if($scope.pages<pageNum&&pageNum!=1){
    	    return;
    	}
        if(!pageNum){
        	$scope.search.pageNum = $scope.page.pageNum;
        } else {
            $scope.search.pageNum = pageNum;
        }
        var onlineTime = $("#queryOnlineTime").val();
        if (onlineTime != null && onlineTime != '') {
        	$scope.search.onlineTime = $("#queryOnlineTime").val();
        }
        //$scope.search.status=0;
        //$scope.search.productChannel=1;
        var url = globalConfig.basePath+"/dict/list";
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
    	$scope.search.loginStatus = '2';
    	$scope.search.auditStatus = '';
    	$scope.search.status = '';
    	$scope.getTypeVersionList("sys_product_version_wk_dict");
    	$('input[name="queryOnlineTime"]').val('');
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
        //	$scope.search.productVersion = $scope.typeVersionList[0].label;
        $scope.search.productVersion = '';
        	
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
        	//$scope.search.productVersion = $scope.typeVersionList[0].label;
        	$scope.search.productVersion = '';
        	$scope.pageQueryDict(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getSearchTypeVersionList("sys_product_version_wk_dict");
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQueryDict(1);
    });
    $("#productChannel").change(function(){
    	var channel = $("#productChannel").val();
    	if(channel==0){
    		$scope.getTypeVersionList("sys_product_version_wk_dict");
    	}else if(channel==1){
    		$scope.getTypeVersionList("sys_product_version_qb_dict");
    	}else{
    		$scope.getTypeVersionList("sys_product_version_wx_dict");
    	}
   });
    
   $scope.getTypeVersion = function(channel){
	   	if(channel==0){
   			$scope.getTypeVersionList("sys_product_version_wk_dict");
   		}else if(channel==1){
   			$scope.getTypeVersionList("sys_product_version_qb_dict");
   		}else{
   			$scope.getTypeVersionList("sys_product_version_wx_dict");
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
    $scope.addDict = function(x){
    	$scope.add = x;
    	$scope.add.productChannel = $scope.add.productChannel  +  '';
    	$scope.add.loginStatus = $scope.add.loginStatus  +  '';
        $('#addDict').show();
    
    }
    
    //修改
    $scope.editDict = function(x){
    	$scope.operationRecord = x;
    	$scope.operationRecord.productChannel = $scope.operationRecord.productChannel  +  '';
    	$scope.operationRecord.loginStatus = $scope.operationRecord.loginStatus  +  '';
        $('#editDict').show();
    
    }
    
    //添加-关闭窗口
    $scope.closeAddDict = function(){    
        $('#addDict').hide();

    }
    //修改-关闭窗口
    $scope.closeEditDict = function(){    
        $('#editDict').hide();

    }
    
    $scope.saveDict = function(){
        
        var url = globalConfig.basePath+"/dict/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                    $('#addDict').hide();
                    $scope.add = {};
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                }else{
                    alert(data.data.message)
                }
                $scope.pageQueryDict(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.u={}
    
    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    
    //保存修改
    $scope.saveEditDict = function(){
    	
        var url = globalConfig.basePath+"/dict/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                    $('#editDict').hide();
                    $scope.operationRecord = {};
                    $scope.pageQueryDict(1);
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
        	//$('.look-start-box').show()
        	$scope.addDict(record);
        } else if(opType == 2){
            // $scope.operationType = 1;
        	$scope.editDict(record);
        } else if(opType == 3){
            $scope.effectRecord = record;
            $('#takeEffect').show();
        }
    };
    // 生效、失效
    /*$scope.validateRecord = function(){
        // 保存数据
        var url = null;
        if($scope.operationRecord.valid=='0'){
            url = globalConfig.basePath+"/dict/valid";
        } else {
            url = globalConfig.basePath+"/dict/invalid";
        }
        $http.get(url+"?id="+$scope.operationRecord.id).then(function successCallback(callback) {
            $('#takeEffect').hide();
            if(callback.data.code == '000'){
                $scope.pageQueryDict(1);
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
        
        var url = null;
        if($scope.effectRecord.delFlag=='1'){
            url = globalConfig.basePath+"/dict/valid";
        } else {
            url = globalConfig.basePath+"/dict/invalid";
        }
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
            	$scope.pageQueryDict(1);
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
   	 	var url = globalConfig.basePath+"/dict/getPrioritylist";
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
        var url = globalConfig.basePath+"/dict/priority?ids="+ids;
        $http.get(url).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                self.strotList = {};
                $scope.pageQueryDict(1);
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
    	$('#editDict').hide();
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
            $scope.operationRecord.whiteId = '0';
            $scope.operationRecord.blackId = '0';
            $("#baimingdan").attr("checked",false);
            $("#heimingdan").attr("checked",false);
        }
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
   /* $scope.confirm = function(){       
        var url = globalConfig.basePath+"/dict/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
            	$scope.pageQueryDict(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };*/
}]);