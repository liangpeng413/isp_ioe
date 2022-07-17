'use strict';
var App = angular.module('pushApp', [], angular.noop);
App.controller("pushController", ['$scope','$http',  function ($scope,$http) {
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '0';
    $scope.search.loginStatus = '1';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '0';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    $scope.operationType = 0;
    //开机屏查询
    $scope.pageQuery = function(pageNum){
 
    	if($scope.pages<pageNum&&pageNum!=1){
    	    return;
    	}
        if(!pageNum){
        	$scope.search.pageNum = $scope.page.pageNum;
        } else {
            $scope.search.pageNum = pageNum;
        }
     
        //$scope.search.status=0;
        //$scope.search.productChannel=1;
        var url = globalConfig.basePath+"/otProductPush/list";
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
    $scope.pageQuery(1);
    
   //按渠道类型获取版本列表
    $scope.getPositionList = function(type){
        var url = globalConfig.basePath+"/rDict/getByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.positionList = data.data.resp.result;
        	//$scope.search.pushPosition = $scope.positionList[0].value;
        	
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getPositionList('push_position');
    

    //重置
    $scope.reset = function(){
    	var num = $scope.search.pageNum;
    	var size = $scope.search.pageSize;
    	$scope.search={};
    	$scope.search.pageNum = num;
    	$scope.search.pageSize = size;
    	$scope.search.productChannel = '0';
    	$scope.search.status = '0';
    	$scope.search.valid = "";
    	$scope.getPositionList('push_position');
    
    }
    
   
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQuery(1);
    });
    
    
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
    $scope.addPush = function(){   	
    	$scope.wbSelected = [] ; 
    	$scope.selected = [] ;
    	$scope.add = {};
        $scope.add.productChannel = '0';
        $scope.add.valid = '1';
        $scope.queryWhiteAndBlack();
        $scope.addConfirmUser = "";
        $scope.allxx =true;
        $scope.whitexx =false;
        $scope.blackxx =false;
        $("#white").attr('disabled','disabled');
        $("#black").attr('disabled','disabled');
        $scope.add.whiteId = '';
        $("#whiteID").attr('disabled','disabled');
        $scope.add.blackId = '';
        $("#blackSelect").attr('disabled','disabled');
        $(".position").attr("checked",false);
    }
    
    //添加
    $scope.closeAddPush = function(){    
        $('#addFloat').hide();

    }
    

    $scope.checkAddOnlineTime = function(){
    	 $scope.add.startTime = $('#startTime').val()+"";
         var startTime = $scope.add.startTime;
         startTime = startTime.substring(0,10);
         //alert(onlineTime);
         if(startTime==getToday()){
         	$('#checkShow').show();
         } else {
        	 $scope.savePush();
         }
    }
    
    $scope.checkEditOnlineTime = function(){
   	 $scope.operationRecord.startTime = $('#editStartTime').val()+"";
        var startTime = $scope.operationRecord.startTime;
        startTime = startTime.substring(0,10);
        //alert(onlineTime);
        if(startTime==getToday()){
        	$('#editCheckShow').show();
        } else {
       	    $scope.saveEditPush();
        }
   }
    
    $scope.savePush = function(){
    	if($scope.add.productChannel==null||$scope.add.productChannel==""){
            alert("渠道不能为空");
            return;
        }
    	/*var positions = "";
        $('.position').each(function() {
            if (this.checked == true) {
            	positions += $(this).val() + ",";
            }
        });*/
    	if($scope.add.productNameType==null||$scope.add.productNameType==""){
            alert("请选择产品类型");
            return;
        }
        if($scope.add.expandProfit!=null&&$scope.add.expandProfit!=""){
        	if($scope.add.expandProfit>5){
        		alert("加息利率最高为5");
                return ;
        	}
        }
       /* if(positions==""){
            alert("推荐位不能为空");
            return;
        }else{
        	$scope.add.pushPosition = positions;
        }   */ 
        
        
       
        /*if($scope.add.lcProductId==null||$scope.add.lcProductId==""){
            alert("请填写后台产品ID");
            return ;
        }
        if($scope.add.productName==null||$scope.add.productName==""){
            alert("请填写正确的后台产品ID");
            return ;
        }*/
        $scope.add.startTime = $('#startTime').val()+"";
        $scope.add.overTime = $('#overTime').val()+"";
        if($scope.add.startTime==null||$scope.add.startTime==""){
            alert("请选择活动开始时间");
            return;
        }
        if($scope.add.overTime==null||$scope.add.overTime==""){
            alert("请选择活动结束时间");
            return;
        }
        var startTime = (new Date($scope.add.startTime)).getTime();
        var endTime = (new Date($scope.add.overTime)).getTime();
        var onlineTime = (new Date($scope.startTime)).getTime();
        var offlineTime = (new Date($scope.endTime)).getTime();
        if(startTime<onlineTime){
        	alert("活动开始时间必须不能小于产品上线时间");
            return;
        }
        if(endTime>offlineTime ){
        	alert("活动结束时间必须不能大于产品下线时间");
            return;
        }
        if(endTime<=startTime){
        	alert("活动结束时间必须大于活动开始时间");
            return;
        }
        /*$('.checkbox').each(function () {
            if(this.checked == true){
            	$scope.add.showType = $(this).val();
            }
        })
    	if($scope.add.showType==null||$scope.add.showType==""){
    		alert('请选择黑白明白');
    		return;	
    	}*/
        var all = $("#all").prop("checked");
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
        }
        if($scope.addConfirmUser==""||$scope.addConfirmUser==null||$scope.addConfirmUser==undefined){
    		alert('请选择审核人');
    		return;
    	}else{
    		$scope.add.auditPerson = $("#addConfirmUser").find("option:selected").text();
    		//var array = $scope.addConfirmUser.split('-')
    		//$scope.add.auditEmail = array[1];
    		$scope.add.auditNo = $scope.addConfirmUser;
    	}
        var url = globalConfig.basePath+"/otProductPush/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                    //$('#addDiv').hide();
                    $scope.operationType = 0;
                    $scope.add = {};
                    $('#all').attr("checked","checked");
                    $("#white").attr("checked",false);
                    $("#black").attr("checked",false);
                }else{
                    alert(data.data.message)
                }
                $('#checkShow').hide();
                $scope.pageQuery(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.u={}
    //修改
    $scope.editPush = function(push){
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
    	/* $('.editPosition').each(function(){
            	 this.checked = false;
         });
    	 var positions = push.pushPosition.split(',');
    	 for(var i=0;i<positions.length;i++){
    		 $('.editPosition').each(function(){
                 if(this.value == positions[i]){
                	 this.checked = true;
                 }
             });
    	 }*/
    	 //var date = new Date(push.startTime);
    	 if(push.productChannel==0||push.productChannel==2){
    		 push.productNameType=	push.productNameType+'_'+	push.productName+'_'+	push.productCode+'_'+	push.period + '_' + push.onlineTimeTimestamp + '_' + push.standardProfit;
     	 }
     	 if(push.productChannel==1){
     		push.productNameType = push.productNameType + '_' + push.period + '_' + push.standardProfit + '_' + push.onlineTimeTimestamp;
     	 }
    	 $scope.editConfirmUser = $scope.operationRecord.auditNo;
    	 push.valid = push.valid+"";
    	 push.whiteId = push.whiteId+"";
    	 push.blackId = push.blackId+"";
    	
    	 $scope.queryWhiteAndBlack();
    	 
    	 push.productChannel=push.productChannel+"";
    	 $("#upProductChannel").val(push.productChannel);
    	  
    	 //var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
         if(push.showType == 0){
             $scope.u.quanbuClick = true;
             $("#baimingdan").attr('disabled','disabled');
             $("#heimingdan").attr('disabled','disabled');
             /*if(float.loginStatus == 1){
            	 $('#quanbu').removeAttr('disabled','disabled');
             }*/
             $("#bDropDown").attr('disabled','disabled');
             $("#heiSelect").attr('disabled','disabled');
         }else if(push.showType == 1){
        	 $("#baimingdan").removeAttr('disabled','disabled');
        	 $("#heimingdan").removeAttr('disabled','disabled');
        	 $("#bDropDown").removeAttr('disabled','disabled');
             $scope.u.baimingdClick = true;
         }else if(push.showType == 2){
         	 $("#baimingdan").removeAttr('disabled','disabled');
        	 $("#heimingdan").removeAttr('disabled','disabled');
        	 $("#heiSelect").removeAttr('disabled','disabled');
             $scope.u.heimingdanClick = true;
         }else if(push.showType == 3){
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
    $scope.saveEditPush = function(){
    	if($scope.operationRecord.productChannel==null||$scope.operationRecord.productChannel==""){
            alert("渠道不能为空");
            return;
        }
    	/*var positions = "";
        $('.editPosition').each(function() {
            if (this.checked == true) {
            	positions += $(this).val() + ",";
            }
        });*/
    	if($scope.operationRecord.productNameType==null||$scope.operationRecord.productNameType==""){
            alert("请选择产品类型");
            return;
        }
        if($scope.operationRecord.expandProfit!=null&&$scope.operationRecord.expandProfit!=""){
        	if($scope.operationRecord.expandProfit>5){
        		alert("加息利率最高为5");
                return ;
        	}
        }
        /*if(positions==""){
            alert("推荐位不能为空");
            return;
        }else{
        	$scope.operationRecord.pushPosition = positions;
        }    */ 
       
        /*if($scope.operationRecord.lcProductId==null||$scope.operationRecord.lcProductId==""){
            alert("请填写后台产品ID");
            return ;
        }
        if($scope.operationRecord.productName==null||$scope.operationRecord.productName==""){
            alert("请填写正确的后台产品ID");
            return ;
        }*/
        $scope.operationRecord.startTime = $('#editStartTime').val()+"";
        $scope.operationRecord.overTime = $('#editOverTime').val()+"";
        if($scope.operationRecord.startTime==null||$scope.operationRecord.startTime==""){
            alert("请选择活动开始时间");
            return;
        }
        if($scope.operationRecord.overTime==null||$scope.operationRecord.overTime==""){
            alert("请选择活动结束时间");
            return;
        }
        var startTime = (new Date($scope.operationRecord.startTime)).getTime();
        var endTime = (new Date($scope.operationRecord.overTime)).getTime();
        var onlineTime = (new Date($scope.startTime)).getTime();
        var offlineTime = (new Date($scope.endTime)).getTime();
        if(startTime<onlineTime){
        	alert("活动开始时间必须不能小于产品上线时间");
            return;
        }
        if(endTime>offlineTime ){
        	alert("活动结束时间必须不能大于产品下线时间");
            return;
        }
        if(endTime<=startTime){
        	alert("活动结束时间必须大于活动开始时间");
            return;
        }
        /*$('.checkbox').each(function () {
            if(this.checked == true){
            	$scope.add.showType = $(this).val();
            }
        })
    	if($scope.add.showType==null||$scope.add.showType==""){
    		alert('请选择黑白明白');
    		return;	
    	}*/
       
        
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
      
        if($scope.editConfirmUser==""||$scope.editConfirmUser==null||$scope.editConfirmUser==undefined){
    		alert('请选择审核人');
    		return;
    	}else{
    		$scope.operationRecord.auditPerson = $("#editConfirmUser").find("option:selected").text();
    		//var array = $scope.editConfirmUser.split('-')
    		//$scope.add.auditEmail = array[1];
    		$scope.operationRecord.auditNo = $scope.editConfirmUser;
    	}
        var url = globalConfig.basePath+"/otProductPush/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                	$scope.operationType = 0;
                    $scope.operationRecord = {};
                    $('#editCheckShow').hide();
                    $scope.pageQuery(1);
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
             $scope.operationType = 1;
        	//$('.look-start-box').show()
            $("#detailDiv").show();
            $scope.detail = angular.copy(record);
            var positions = $scope.detail.pushPosition.split(',');
            var positionNames = '';
            for(var i=0;i<positions.length;i++){
            	if(positions[i]!=''){
            		var positionValueAndName = positions[i].split('-');
            		if(positionValueAndName.length>1){
            			positionNames += positionValueAndName[1] + ',';
            		}
            		
            	}
            }
            $scope.detail.pushPosition = positionNames.substring(0,positionNames.length-1);
        } else if(opType == 4){
        	
        	
        	
            // $scope.operationType = 1;
        	$scope.operationRecord = angular.copy(record);
            /* if($scope.operationRecord.productChannel==1){
        		 	$scope.operationRecord.productChannel = "1";
        	 	}else{
        	 		$scope.operationRecord.productChannel = "0";
        	 	}*/
        	 
             $scope.operationType = 2;
             $scope.editConfirmUser = "";
             $scope.requestAuditDescription = "";
             $scope.editPush($scope.operationRecord);
        } else if(opType == 3){
        	$scope.operationType = 3;
        	$scope.addPush();
        	//$("#addDiv").show();
        } else if(opType == 5){
        	$('#confirm').show();
        	 $scope.confirmRecord = angular.copy(record);
        	 $scope.auditStatus = "1";
        	 $scope.auditDescription = "";
        } else if(opType == 6){
        	 /*if(record.auditStatus == "1"){
         		alert('无法对待审核状态的数据进行生效失效操作');
         		return;	
         	 }*/
         	 $('#takeEffect').show(); 	
         	 $scope.effectRecord = angular.copy(record);
         	 $scope.validConfirmUser = "";
         	 $scope.requestAuditDescription = "";
        }
    };
    // 生效、失效
    $scope.validateRecord = function(){
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
            url = globalConfig.basePath+"/otProductPush/valid";
        } else {
            url = globalConfig.basePath+"/otProductPush/invalid";
        }
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
                $scope.pageQuery(1);
                $('#takeEffect').hide();
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
    	//var	searchPosition=$("#position").val();

        if(searchproductChannel==null||searchproductChannel==""||searchproductChannel==undefined){
        	alert("请在查询条件中选择渠道");
            return;
        }
       /* if(searchPosition==null||searchPosition==""||searchPosition==undefined){
        	alert("请在查询条件中选择推荐位");
            return;
        }*/

   	 	var url = globalConfig.basePath+"/otProductPush/getPrioritylist";
   	 	$http.post(url,$scope.search).then(
         function(data){
             if(data.data.code=='000'){
            	 $scope.strotList = data.data.resp;
            	 if($scope.strotList==null||$scope.strotList.length==0){
            		 alert("无符合条件的排序数据");
            		 return;
            	 }
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
        var url = globalConfig.basePath+"/otProductPush/priority?ids="+ids;
        $http.get(url).then(
            function(data){
                alert(data.data.message);
                $('#addSort').hide();
                self.strotList = {};
                $scope.pageQuery(1);
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
    
    /**
     * 清除产品信息
     */
    $scope.cleanProductInfo = function(){
        $scope.add.productName = '';
        $scope.add.productPeriod = '';
        $scope.add.standardProfit = '';
        $scope.operationRecord.productName = '';
        $scope.operationRecord.productPeriod = '';
        $scope.operationRecord.standardProfit = '';
        $scope.startTime = 0;
        $scope.endTime = 0;
    }
    
    /**
     * 拉去后台产品列表
     */
    $scope.pullProductInfo = function(){
        if($.trim($scope.add.lcProductId)!=''){
            var url = globalConfig.basePath+"/otc/memberEnjoy/getProductInfo?productChannel="+$scope.add.productChannel+"&lcProductId="+$scope.add.lcProductId;
            $http.get(url).then(function successCallback(callback) {
                if(callback.data.code == '000'){
                    $scope.add.productName = callback.data.resp.productName;
                    $scope.add.productPeriod = callback.data.resp.holdDay;
                    $scope.add.standardProfit = callback.data.resp.profit;
                    if($scope.operationRecord!=null&&$scope.operationRecord!=undefined){
                    	$scope.operationRecord.productName = callback.data.resp.productName;
                        $scope.operationRecord.productPeriod = callback.data.resp.holdDay;
                        $scope.operationRecord.standardProfit = callback.data.resp.profit;
                    }
                    $scope.startTime = callback.data.resp.upLineTime;
                    $scope.endTime = callback.data.resp.downLineTime;
                } else if (callback.data.code == '103'){
                    console.error(callback.data);
                    $scope.cleanProductInfo();
                    swalMsg("接口服务器异常");
                } else if(callback.data.code == '104'){
                    $scope.cleanProductInfo();
                    swalMsg("不是该渠道的后台产品ID");
                } else if(callback.data.code == '105'){
                    $scope.cleanProductInfo();
                    swalMsg("已添加，不可再次添加");
                } else {
                    console.error(callback);
                }
            }, function errorCallback(response) {
                $scope.cleanProductInfo();
                // 请求失败执行代码
                swalMsg(response);
            });
        } else {
            $scope.cleanProductInfo();
        }
    };
    
    /**
     * 会员加息加息利率-验证两位小数
     * @param level
     */
    $scope.checkExpandProfit = function() {
        var expandProfit = $scope.add.expandProfit;
        $scope.add.expandProfit = numKeepTwoPoint(expandProfit);
        var num = Number(expandProfit);
        if(num>5 || num<0){
            swalMsg("请输入0~5之间的数字");
        }
    }
    
    $scope.checkExpandProfitEdit = function() {
        var expandProfit = $scope.operationRecord.expandProfit;
        $scope.operationRecord.expandProfit = numKeepTwoPoint(expandProfit);
        var num = Number(expandProfit);
        if(num>5 || num<0){
            swalMsg("请输入0~5之间的数字");
        }
    }
    
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
 // 审核
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/otProductPush/confirm";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            
            if(callback.data.code == '000'){
            	$('#confirm').hide();
            	alert("操作成功");
                $scope.pageQuery(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    
    $scope.clearNoNum = function (obj){
		//修复第一个字符是小数点 的情况.
		if(obj.value !=''&& obj.value.substr(0,1) == '.'){
			obj.value="";
		}
		obj.value = obj.value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
		obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
		obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的     
		obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");    
		obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数     
		if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
			if(obj.value.substr(0,1) == '0' && obj.value.length == 2){
				obj.value= obj.value.substr(1,obj.value.length);	
			}
		}    
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

    $scope.addChannelChange = function(){
    	$scope.add.productNameType = "";
    }
    
    $scope.editChannelChange = function(){
    	$scope.operationRecord.productNameType = "";
    }
    
    $scope.searchChannelChange = function(){
    	$scope.search.productNameType = "";
    }
    
    $scope.productChange = function(product){
    	var info = product.split('_');
    	if($scope.add.productChannel==1){
    		$scope.add.standardProfit = info[info.length-2];
    	}else{
    		$scope.add.standardProfit = info[info.length-1];
    	}
    }
    
    $scope.editProductChange = function(product){
    	var info = product.split('_');
    	if($scope.operationRecord.productChannel==1){
    		$scope.operationRecord.standardProfit = info[info.length-2];
    	}else{
    		$scope.operationRecord.standardProfit = info[info.length-1];
    	}
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