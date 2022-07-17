'use strict';
var App = angular.module('floatApp', [], angular.noop);
App.controller("floatController", ['$scope','$http',  function ($scope,$http) {
	$scope.isCommitted = true;
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '';
    $scope.search.loginStatus = '';
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

    /*导出数据  黄帅杰（956709820@qq.com） */
    $scope.exportExportTask =function(){
        var productChannel=$scope.search.productChannel;
        var status=$scope.search.status

        window.location.href = globalConfig.basePath + "/smartIVR/exportIvrTaskExcel?productChannel="+productChannel+"&status="+status;
    }
    //开机屏查询
    // $scope.pageQueryFloat = function(pageNum){
    //
    // 	if($scope.pages<pageNum&&pageNum!=1){
    // 	    return;
    // 	}
    //     if(!pageNum){
    //     	$scope.search.pageNum = $scope.page.pageNum;
    //     } else {
    //         $scope.search.pageNum = pageNum;
    //     }
    //     var onlineTime = $("#queryOnlineTime").val();
    //     if (onlineTime != null && onlineTime != '') {
    //     	$scope.search.onlineTime = $("#queryOnlineTime").val();
    //     }
    //     //$scope.search.status=0;
    //     //$scope.search.productChannel=1;
    //     var url = globalConfig.basePath+"/float/list";
    //     $http.post(url,$scope.search).then(
    //         function(data){
    //             if(data.data.code=='000'){
    //             	$scope.pageList = data.data.resp.result;
    //             	$scope.total = data.data.resp.totalRowSize;
    //             	$scope.pages = data.data.resp.pageCount;
    //             	//if($scope.pages<pageNum);
    //             	//$scope.search.pageNum = $scope.pages;
    //             }else{
    //                 alert(data.data.message)
    //             }
    //         },function errorCallback(response) {
    //             alert("请求失败了....");
    //         }
    //     );
    // };


    //$scope.pageQuerytask(1);

    //重置
    $scope.reset = function(){
    	var num = $scope.search.pageNum;
    	var size = $scope.search.pageSize;
    	$scope.search={};
    	$scope.search.pageNum = num;
    	$scope.search.pageSize = size;
    	$scope.search.productChannel = '';
    	$scope.search.loginStatus = '';
    	$scope.search.auditStatus = '';
    	$scope.search.status = '';
    	$scope.getTypeVersionList("sys_product_version_wk_float");
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
            $scope.pageQuerytask(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getSearchTypeVersionList("sys_product_version_wk_float");
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
        $scope.pageQuerytask(1);
    });
    $("#productChannel").change(function(){
    	var channel = $("#productChannel").val();
    	if(channel==0){
    		$scope.getTypeVersionList("sys_product_version_wk_float");
    	}else if(channel==1){
    		$scope.getTypeVersionList("sys_product_version_qb_float");
    	}else{
    		$scope.getTypeVersionList("sys_product_version_wx_float");
    	}
   });
    
   $scope.getTypeVersion = function(channel){
	   	if(channel==0){
   			$scope.getTypeVersionList("sys_product_version_wk_float");
   		}else if(channel==1){
   			$scope.getTypeVersionList("sys_product_version_qb_float");
   		}else{
   			$scope.getTypeVersionList("sys_product_version_wx_float");
   		}
   };
    


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

    $scope.downloadUserListFile = function (fileId, fileName) {
        console.info(fileId);
        console.info(fileName);
        if (fileName && fileName.length > 0) {
            window.open(globalConfig.basePath + "/smartIVR/downloadUserListFile?taskId=" + fileId + "&excelName=" +  encodeURI(encodeURI(fileName)));
        }
        /* alert("下载文件");
         var data = {blackWhiteListId:fileId,blackWhiteListName:fileName};
         DownLoad({
             url:globalConfig.basePath + "/appconfig/file/downloadBlackWhiteFile",
             data:data
         });*/
        /*var form = $('#conditionForm');
        form.attr("action",globalConfig.basePath + "/appconfig/file/downloadBlackWhiteFile");
        $('#conditionForm_blackWhiteListId').val(fileId);
        $('#conditionForm_blackWhiteListName').val(fileName);
        // form.attr("target","_blank");
        form.submit();*/
    };
   //创建外呼任务
    $scope.addIvrTask = function(){
    	$scope.taskId = 0;
        $scope.add = {};
        $scope.add.productChannel = '0';
        $scope.add.startHour='10';
        $scope.add.endHour='18';
        var productChannel=$scope.add.productChannel;
        $http.get(globalConfig.basePath + "/smartIVR/selectAllIvrWav"+"?productChannel="+productChannel
        ).success(function(data) {
            $scope.taskList = data.resp.result;
        })
        $scope.isCommitted = false;
        $('#addIvrTask').show();

    }
    
    //添加
    $scope.closeAddFloat = function(){    
        $('#addFloat').hide();

    }
    


    $scope.u={}
    //修改

    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    

    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperateUptade = function(productChannel,status,record){
        if(status==2 || status==3){
            $("#detailTask").show();
            $scope.detail = angular.copy(record);
        }else{
           // $scope.canUpdate.startHour='10';
          //  $scope.canUpdate.endHour='18';
            var reg=/^[0-9]*$/;

            var id=record.id;
            $scope.canUpdate.id=id;
            $scope.canUpdate.taskName=record.taskName;
            $scope.canUpdate.productChannel=record.productChannel;
            $scope.canUpdate.wavName=record.wavName;
            $scope.canUpdate.excelName=record.excelName;
            $scope.canUpdate.startHour=record.starthour + '';
            console.info("@@@@@startHour="+$scope.canUpdate.startHour);
            
            $scope.canUpdate.endHour=record.endhour + '';
            $scope.canUpdate.runDays=record.runDays;
            if($scope.canUpdate.runDays>0){
            	$scope.runDays = '1';
            }else{
            	$scope.runDays = '0';
            }
            $scope.canUpdate.total=record.qcCount;
            $scope.canUpdate.tiao=record.fkCount;
            $scope.canUpdate.qcDay=record.qcDay;
            var productChannel=$scope.canUpdate.productChannel;
            $http.get(globalConfig.basePath + "/smartIVR/selectAllIvrWav"+"?productChannel="+productChannel
            ).success(function(data) {
                $scope.taskList = data.resp.result;
                $scope.editVideo = record.wavId + '';
            })
            
            $("#editTask").show();
        }
    //任务详情修改 黄帅杰
    $scope.updataNewTask=function () {
        var reg=/^[0-9]*$/;
        var id=$scope.canUpdate.id;
        var startHour=$scope.canUpdate.startHour;
        var endHour=$scope.canUpdate.endHour;
        var dd=$scope.canUpdate.runDays;
        var fkCount=$scope.canUpdate.tiao;
        if(fkCount==""){
            alert("防卡策略不能为空");
            return;
        }

        if(fkCount<1 || fkCount>2000){
            alert("条数必须在1-2000之内")
            return;
        }

        var qcDay=$scope.canUpdate.qcDay;
        console.info(qcDay);
        if(qcDay==""){
            qcDay=0;

        }
        var wavId = $scope.editVideo;
        var wavName = $("#editVideo").find("option:selected").text();
        var runDays;
        if($scope.runDays == '0'){
        	runDays = 0;
        }else{
        	runDays = $scope.canUpdate.runDays;
        }
        if(!reg.test(dd)){
            alert("最多执行天数只能为数字");
            return;
        }
        console.log("!!!!!"+startHour);
        var url = globalConfig.basePath+"/IvrTask/updateTask?id="+id+"&startHour="+startHour+"&endHour="+endHour+"&fkCount="+fkCount+"&qcDay="+qcDay+"&wavId="+wavId+"&wavName="+wavName+"&runDays="+runDays;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if(data.data.code=='000'){
               alert("修改成功");
               $("#editTask").hide();
                window.location.reload();
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("修改失败....");
            $("#editTask").hide();
            window.location.reload();
        });
    }

    };

    $scope.preOperate =function(opType,record){
        if(opType == 1){
            // $scope.operationType = 2;
        	//$('.look-start-box').show()
            $("#detailTask").show();
            $scope.detail = angular.copy(record);
        } else if(opType == 2){
            // $scope.operationType = 1;
            $('#editTask').show();
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord.auditPerson="";
            $scope.editFloat($scope.operationRecord);
        } else if(opType == 3){
            $scope.effectRecord = record;
            $('#effectTask').show();
        } else if(opType == 4){
            $scope.operationRecord = record;
            $('#delTask').show();
        } else if(opType == 5){
            $scope.operationRecord = record;
            $scope.createT= 0;
            $('#createTask').show();
        } else if(opType == 6){
            $scope.operationRecord = record;
            $('#delCache').show();
        }
    }

    $scope.radioChange = function(rad){
    	//$scope.runDays = rad +'';
    };

    // 生效、失效
    $scope.validateRecord = function(){
        // 保存数据
        var url = null;
        if($scope.effectRecord.status==0){
            url = globalConfig.basePath+"/IvrTask/valid";
        } else {
            url = globalConfig.basePath+"/IvrTask/invalid";
        }
        $http.get(url+"?id="+$scope.effectRecord.id).then(function successCallback(callback) {
            $('#effectTask').hide();
            if(callback.data.code == '000'){
                $scope.pageQuerytask(1);
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
    // 删除
    $scope.delTask = function(){
        // 保存数据
        var url = globalConfig.basePath + "/IvrTask/del";
        $http.get(url+"?id="+$scope.operationRecord.id).then(function successCallback(callback) {
            $('#delTask').hide();
            if(callback.data.code == '000'){
                $scope.pageQuerytask(1);
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
    // 清除缓存
    $scope.delCache = function(){
        // 保存数据
        var url = globalConfig.basePath + "/IvrTask/delCache";
        $http.get(url+"?id="+$scope.operationRecord.id).then(function successCallback(callback) {
            $('#delCache').hide();
            if(callback.data.code == '000'){
            	alert("操作成功");
                $scope.pageQuerytask(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
 // 保存重新生成任务
    $scope.createTask = function(){

    	if($scope.createT!=1&&$scope.createT!=2){
    		alert('请选择生成策略');
    		return;
    	}
        $('#add-start-bg1').show();
        var url = globalConfig.basePath + "/IvrTask/createTask";
        $http.get(url+"?type="+$scope.createT+'&taskId='+$scope.operationRecord.id).then(function successCallback(callback) {
            $('#createTask').hide();
            if(callback.data.resp!=null&&callback.data.resp!=undefined){
                $('#add-start-bg1').hide();
            	var res = callback.data.resp;
            	var taskId=res.id;
            	var succCount=res.userCount;
            	var taskName=res.taskName;
            	if(succCount>0){
            	    alert("外呼任务重新生成成功，有效外呼用户数="+succCount+" 重新生成的任务名称是："+taskName);
                }
                //$scope.addIvrTask();
                //$scope.taskId = taskId;
            }else{
                alert(callback.data.message);
                $('#add-start-bg1').hide();
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("msg:"+response);
            $('#add-start-bg1').hide();
        });
    };
    // 生效、失效
    /*$scope.validateRecord = function(x){
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
                $scope.pageQuerytask(1);
                $('.take-start-box').hide();
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };*/
    //优先级排序
    $scope.strotList = {}
    $scope.sort = function(){
   	 	var url = globalConfig.basePath+"/IvrTask/getByStatus";
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
        var url = globalConfig.basePath+"/IvrTask/priority?ids="+ids;
        $http.get(url).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                self.strotList = {};
                $scope.pageQuerytask(1);
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
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/float/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
                $scope.pageQuerytask(1);
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
     * 下载导入模板  黄帅杰（956709820@qq.com）
     */
    $scope.downloadTemplet  = function () {
        window.location.href = globalConfig.basePath + "/smartIVR/downloadTemplet";
    }

    //查询  黄帅杰（956709820@qq.com）
    $scope.pageQuerytask = function(pageNum){
    	if(pageNum==0){
    	    alert("无数据")
    	    return;
        }
        if($scope.pages<pageNum&&pageNum!=1){
            return;
        }
        if(!pageNum){
            $scope.search.pageNum = $scope.page;
        } else {
            $scope.search.pageNum = pageNum;
        }
        if(globalConfig.wavId!=''){
        	$scope.search.wavId = globalConfig.wavId;
        }
        if(globalConfig.productChannel!=''){
            $scope.search.productChannel = globalConfig.productChannel;
        }
        var onlineTime = $("#queryOnlineTime").val();
        if (onlineTime != null && onlineTime != '') {
            $scope.search.onlineTime = $("#queryOnlineTime").val();
        }

        var url = globalConfig.basePath+"/IvrTask/taskList";
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
    $("#pageSize").change(function(){
        $scope.search.pageSize = $("#pageSize").val();
        $scope.pageQuerytask(1);
    });

    $scope.pageQuerytask(1);

    /*排序  黄帅杰（956709820@qq.com） */
    $scope.tasksList = {}
    // $scope.sequence =function () {
    //     console.info($scope.search.status);
    //     var	status=$scope.search.status;
    //     var productChannel=$scope.search.productChannel;
    //     alert(productChannel);
    //     if(status=='' || status==null){
    //         alert("请在任务状态选择状态");
    //         return;
    //     }
    //
    //     var url = globalConfig.basePath+"/IvrTask/getByStatus?status="+status+"&productChannel="+productChannel;
    //     $http({
    //         method: 'GET',
    //         url: url,
    //     }).then(function successCallback(data) {
    //         if(data.data.code=='000'){
    //             // for(var i=0;i<data.data.resp.result.length;i++){
    //             //     data.data.resp.result[i].taskName =i+1;
    //             // }
    //             // self.tasksList = data.data.resp.result;
    //             $scope.tasksList=data.data.resp.result;
    //             $('#showSequence').show();
    //         }
    //     }, function errorCallback(response) {
    //         // 请求失败执行代码
    //         alert("根据id获取对象失败....");
    //     });
    //
    // }

    /*确认排序  黄帅杰（956709820@qq.com） */
    
    /*关闭新增  黄帅杰（956709820@qq.com） */
    $scope.closeAddWav = function () {
        $scope.memberFile2=null;
        $("#addIvrTask").hide();
        $http.get(globalConfig.basePath + "/IvrTask/del"+"?id="+$scope.taskId
        ).success(function(data) {
        	window.location.reload();
        })
        
    }
    $scope.closeUppWav =function(){
        $("#editTask").hide();
        window.location.reload();
    }
    
    $scope.exportExport = function (taskId) {

        window.location.href = globalConfig.basePath + "/smartIVR/reportExport?taskId=" + taskId;
    };

    /**
     * 导出外呼数据
     */
    // $scope.exportExport = function () {
    //     window.location.href = globalConfig.basePath + "/smartIVR/reportExport";
    //     // if(taskId==undefined){
    //     //     alert("无导入数据")
    //     //     return;
    //     // }
    //    // window.location.href = globalConfig.basePath + "/smartIVR/reportExport?taskId=" + taskId;
    // };
    /*导入外呼数据  黄帅杰（956709820@qq.com） */
    // function importOpenMemberData() {
    //     var xlsfile = $("#memberFile").val();
    //     var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    //
    // }



    // $scope.importOpenMemberData=function(){
    //     console.log("waLLL");
    //     var xlsfile = $("#memberFile").val();
    //     console.log(xlsfile);
    //     var filetype = xlsfile.substr(xlsfile.lastIndexOf(".")).toLowerCase();
    //     if (filetype != '.xls' && filetype != '.xlsx') {
    //         // alert("只支持.xls类型的Excel文件!");
    //         alert("只支持excel文件上传!");
    //         return false;
    //     }
    //     var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    //     $("#updateMemberFileInput").val(xlsfilename);
    // }

   // var wavName="";
   //  $scope.selectChange = function(){
   //      //console.log($scope.taskList[$scope.video-1].wavName);
   //      wavName=$scope.taskList[$scope.video-1].wavName;
   //  }
    /*新增外呼数据的保存  黄帅杰（956709820@qq.com） */
    $scope.saveTask = function () {
    	if($scope.isCommitted){
    		return;
    	}
        //var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        var reg=/^[0-9]*$/;
        var taday='';
        var day='';
        var total='';
        var taskName=$scope.add.taskName;
        var productChannel=$scope.add.productChannel;
        var wavId=$scope.video;
        day=$scope.add.day;
        var memberListId = $("#userNames").val();
        var startHour=$scope.add.startHour;
        var endHour=$scope.add.endHour;
        var taskId=$scope.taskId;

        if(taskName==null || taskName==''){
            alert("任务名称不能为空")
            return;
        }
        if(taskName.length>15){
            alert("任务名称不能超过15个字")
            return;
        }
        if(productChannel==null || productChannel==''){
            alert("产品渠道不能为空")
            return;
        }
        if(wavId==null || wavId=='' || wavId ==0){
            alert("请选择此外呼任务对应音频")
            return;
        }
        if(taskId==0){
            if(memberListId==null || memberListId==''){
                alert("名单列表不能为空")
                return;
            }
        }

        if(memberListId==null||memberListId==undefined||memberListId==""){
        	alert("名单列表不能为空")
            return;
        }

        if(startHour==null || startHour==''){
            alert("开始时间不能为空")
            return;
        }
        if(endHour==null || endHour==''){
            alert("结束时间不能为空")
            return;
        }
        if(day==undefined){
            day=0;
        }
        total=$scope.add.total;
        if(total==undefined){
            total=0;
        }
        if(!reg.test(total)){
            alert("次数只能为数字");
            return;
        }
        var tiao=$scope.add.tiao;
        taday=$scope.add.taday;
        if(taday==undefined){
            taday=0;
        }
        if(!reg.test(taday)){
            alert("最多执行天数只能为数字");
            return;
        }

        if(!reg.test(day)){
            alert("去重策略只能为数字");
            return;
        }
        if(tiao==null || tiao==''){
            alert("防卡策略不能为空")
            return;
        }
        if(!reg.test(tiao)){
            alert("防卡策略只能为数字");
            return;
        }

        if(tiao<1 || tiao>2000){
            alert("防卡策略必须在1-2000之内")
            return;
        }
        $('#editBid').show();
        var fileParams = {};
        fileParams['taskName'] = taskName;
        //fileParams['memberFile'] = memberFile;
        fileParams['productChannel'] = productChannel;
        fileParams['wavId'] = wavId;
        //fileParams['wavName'] = wavName;
        fileParams['day'] = day;
        fileParams['total'] = total;
        fileParams['tiao'] = tiao;
        fileParams['taday'] = taday;
        fileParams['startHour'] = startHour;
        fileParams['endHour'] = endHour;
        fileParams['taskId'] = $scope.taskId;
        fileParams['memberListId'] = memberListId;
        $('.ivr-button').hide();
        $('.ivr-processing-status span').text("0%");
        $('.ivr-processing-status').show();
        $scope.isCommitted = true;
        $.ajax({
            //创建外呼任务
            url: globalConfig.basePath + '/smartIVR/createOutBoundTask?' + $.param(fileParams),
            success: function (callback) {
                console.info(callback)
               // var str = $(callback).find("body").text();//获取返回的字符串
               // var json = $.parseJSON(str);//把字符串转化为json对象
                var code= callback.code;
                var resp=callback.resp;
                if(code=="000"){
                    alert("创建外呼任务成功,有效外呼用户数="+resp);
                    $("#addIvrTask").hide();
                    $('#add-start-bg1').hide();
                    window.location.reload();
                }else if(code==1000){
                    alert(callback.message);
                    $('#add-start-bg1').hide();
                    $('#editBid').hide();
                    //$("#addIvrTask").hide();
                    //window.location.reload();
                }
                else {
                    alert(callback.message);
                    $('#add-start-bg1').hide();
                    $('#editBid').hide();
                    //$("#addIvrTask").hide();
                   // window.location.reload();
                }

            },
            error: function (errorRespon) {
                alert("创建外呼任务失败："+errorRespon)
                $('#add-start-bg1').hide();
                $('#editBid').hide();
               // $("#addIvrTask").hide();
               // window.location.reload();
            }
        });
    }
    $scope.changeProChanael=function (productChannel) {
        $http.get(globalConfig.basePath + "/smartIVR/selectAllIvrWav"+"?productChannel="+productChannel
        ).success(function(data) {
            $scope.taskList = data.resp.result;
        })
    }

}]);
function importOpenMemberData() {
    var xlsfile = $("#memberFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    var filetype = xlsfile.substr(xlsfile.lastIndexOf(".")).toLowerCase();
    if (filetype != '.xls' && filetype != '.xlsx') {
        // alert("只支持.xls类型的Excel文件!");
        alert("只支持excel文件上传!");
        return false;
    }
    $("#updateMemberFileInput").val(xlsfilename);
}

App.filter("statusFilter",function(){
    return function (val) {
        var res="";
        switch (val){
            case 0:
                res="失效"
                break;
            case 1:
                res="队列中"
                break;
            case 2:
                res="进行中"
                break;
            case 3:
                res="已完成"
                break;
            case 4:
                res="已删除"
                break;
        }
        return res;
    }
})
