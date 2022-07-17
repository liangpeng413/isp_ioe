


'use strict';
var App = angular.module('financialApp', [], angular.noop);
App.controller("financialController", ['$scope','$http',  function ($scope,$http) {
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '0';
    $scope.search.productType = '0';
	$scope.search.sellStatus = '2';
	$scope.search.auditStatus = '';
	$scope.search.delFlag = '';
	$scope.operationType = 0;
    $("#takeEffect").hide();
    $("#confirm").hide();
    //开机屏查询
    $scope.dataList = [];
    $scope.queryList = function(){
        var url = globalConfig.basePath+"/otProductQuotaAudit/list";
        $http.post(url,$scope.search).then(
            function(data){
                if(data.data.code=='000'){
                	$scope.dataList = data.data.resp;
                	if($scope.dataList!=null){
                		$scope.total = $scope.dataList.length;
                	}else{
                		$scope.total = 0;
                	}
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.queryList();
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
    //重置
    $scope.reset = function(){
    	$scope.search={};
    	$scope.search.productChannel = '0';
    	$scope.search.sellStatus = '2';
    	$scope.search.auditStatus = '';
    	$scope.search.delFlag = '';
    }
    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
        if(opType == 1){
        	// 展示
            //$("#detailDiv").show();
            $scope.detail = angular.copy(record);
            $scope.operationType = 1;
        } else if(opType == 2){
        	// 修改
            //$('#editDiv').show();
        	if(record.auditStatus == "1"){
        		alert('无法对待审核状态的数据进行修改');
        		return;	
        	}
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord .memberListName=$scope.operationRecord .memberListName+"";
            $scope.operationRecord .memberListId=$scope.operationRecord .memberListId+"";
            $scope.strategyReload($scope.operationRecord.memberListName);
        	/*alert($scope.operationRecord .memberListName);
            alert($scope.operationRecord .memberListId);*/
           /* if($scope.operationRecord.productChannel==1){
       		 	$scope.operationRecord.productChannel = "1";
       	 	}else{
       	 		$scope.operationRecord.productChannel = "0";
       	 	}*/
       	 
            $scope.operationType = 2;
            $scope.editConfirmUser = "";
            $scope.requestAuditDescription = "";
        } else if(opType == 3){
        	 if(record.auditStatus == "1"){
        		alert('无法对待审核状态的数据进行生效失效操作');
        		return;	
        	 }
        	 $('.take-start-box').show(); 	
        	 $scope.effectRecord = angular.copy(record);
        	 $scope.validConfirmUser = "";
        	 $scope.requestAuditDescription = "";
        } else if(opType == 4){
        	 if(record.auditStatus != "1"){
        		alert('只能对待审核状态的数据进行操作');
        		return;	
        	 }
        	 $('#confirm').show();
        	 $scope.confirmRecord = angular.copy(record);
        	 $scope.auditStatus = "2";
        	 $scope.auditDescription = "";
        	//$('#confirm').show();
        	
        }
    };
    $scope.myFunc = function() {
        var list=$scope.strChannelGroups;
        var id=$scope.operationRecord.memberListId;
        for (var i = 0; i < list.length; i++) {
            if(list[i].rosterId == id){
                $scope.operationRecord.memberPortrayalName=list[i].rosterName;
            }
        }

    };

    $scope.updateSynchronous = function(){
        $('#synchronous').show();
        var url = globalConfig.basePath+"/otProductQuotaAudit/updateSynchronous";
        $http.post(url,$scope.search).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $scope.queryList();
                $('#synchronous').hide();
            } else if(callback.data.code == '1111'){
            	alert(callback.data.message);
                $('#synchronous').hide();
            }else{
                alert("操作失败");
                $('#synchronous').hide();
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };

    /**用户策略类型初始化*/
    $scope.strategyReload = function (param1) {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url, $scope.strate).then(
            function (data) {
                if (data.data.code == '000' && (param1==null || param1 == 0)) {
                    $scope.strategyList = data.data.resp;
                    $scope.operationRecord.memberListName= "NO_RULE"
                    $scope.findChannelGroups();
                } else if (data.data.code == '000' && param1!=null) {
                    $scope.strategyList = data.data.resp;
                    $scope.operationRecord.memberListName= param1
                    $scope.findChannelGroups();
                } else{
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    /** 查询渠道现有分组*/
    $scope.findChannelGroups = function () {
        var channelCode;
        if($scope.operationRecord.productChannel==0){
            channelCode='WK';
        }else if($scope.operationRecord.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if ($scope.operationRecord.memberListName=="NO_RULE") {
           /* $('#userNames').searchableSelect();*/
            $('#userNameLikeSearch').hide();
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+$scope.operationRecord.memberListName
            $http.post(url, $scope.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        $scope.strChannelGroups = data.data.resp;
                        if ($scope.strChannelGroups.length > 0) {
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
    $scope.changePlatformValue = function () {
        $scope.findChannelGroups();
    }

    $scope.changeFindChannelGroups = function () {
        $scope.findChannelGroups();
    }

    // 保存修改
    $scope.saveEdit = function(){
    	$scope.operationRecord.upLineTime = $('#operationOnlineTime').val()+"";
        $scope.operationRecord.downLineTime = $('#operationOfflineTime').val()+"";
        if($scope.operationRecord.upLineTime==null||$scope.operationRecord.upLineTime==""){
            alert("请选择上线时间");
            return;
        }
        if($scope.operationRecord.downLineTime==null||$scope.operationRecord.downLineTime==""){
            alert("请选择下线时间");
            return;
        }
        
        if($scope.operationRecord.downLineTime<=$scope.operationRecord.upLineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
        // 保存数据
    	if($scope.editConfirmUser==""||$scope.editConfirmUser==null||$scope.editConfirmUser==undefined){
    		alert('请选择审核人');
    		return;
    	}else{
    		$scope.operationRecord.auditPerson = $("#editConfirmUser").find("option:selected").text();
    		var array = $scope.editConfirmUser.split('-')
    		//$scope.operationRecord.auditEmail = array[1];
    		$scope.operationRecord.auditNo = array[0];
    	}
    	if( $scope.operationRecord.productTypeDescribe.indexOf("万元宝")==-1) {
            if ($scope.operationRecord.minInvest != "" && $scope.operationRecord.minInvest != null && $scope.operationRecord.minInvest != undefined && $scope.operationRecord.minInvest != 0) {
                var str = $scope.operationRecord.minInvest % 100;
                if (str != 0) {
                    alert('起投金额只能是100的整数倍');
                    return;
                }
            } else {
                alert('起投金额必须填写大于0的整数');
                return;
            }
        }
    	if($scope.operationRecord.maxInvest!=""&&$scope.operationRecord.maxInvest!=null&&$scope.operationRecord.maxInvest!=undefined&&$scope.operationRecord.maxInvest!=0){
    		var str = $scope.operationRecord.maxInvest%100;
    		if(str!=0){
    			alert('出借上限只能是100的整数倍');
        		return;
    		}
    		if($scope.operationRecord.minInvest!=""&&$scope.operationRecord.minInvest!=null&&$scope.operationRecord.minInvest!=undefined&&$scope.operationRecord.minInvest!=0 &&  $scope.operationRecord.productTypeDescribe.indexOf("万元宝")==-1){
    		   if(Number($scope.operationRecord.maxInvest)<Number($scope.operationRecord.minInvest)){
    			   alert('出借上限必须大于等于起投金额');
           		   return; 
    		   }
    		}
    	}else{
    		alert('出借上限必须填写大于0的整数');
    		return;
    		
    		
    	}
    	if($scope.operationRecord.maxDaily!=""&&$scope.operationRecord.maxDaily!=null&&$scope.operationRecord.maxDaily!=undefined&&$scope.operationRecord.maxDaily!=0){
    		var str = $scope.operationRecord.maxDaily%100;
    		if(str!=0){
    			alert('单日上限只能是100的整数倍');
        		return;
    		}
    		if($scope.operationRecord.minInvest!=""&&$scope.operationRecord.minInvest!=null&&$scope.operationRecord.minInvest!=undefined&&$scope.operationRecord.minInvest!=0 &&  $scope.operationRecord.productTypeDescribe.indexOf("万元宝")==-1){
    			 if(Number($scope.operationRecord.maxDaily)<Number($scope.operationRecord.minInvest)){
      			   alert('单日上限必须大于等于起投金额');
             		   return; 
      		     }
    		}
    		if($scope.operationRecord.maxInvest!=""&&$scope.operationRecord.maxInvest!=null&&$scope.operationRecord.maxInvest!=undefined&&$scope.operationRecord.maxInvest!=0){
    			if(Number($scope.operationRecord.maxDaily)>Number($scope.operationRecord.maxInvest)){
       			   alert('出借上限必须大于等于单日上限');
              	   return; 
       		     }
    		}
    	}
        var memberListName = $scope.operationRecord.memberListName;//用户策略类型
        if($scope.operationRecord.whiteListStatus==1) {
            if (memberListName != "NO_RULE") {
                var memberListId = $('#memberId').val();//用户名单
                if (memberListId == '? undefined:undefined ?' || memberListId == "" || memberListId == "null" || memberListId == 0 || memberListId == null || memberListId == '0' || memberListId.indexOf('?') != -1) {
                    alert("选择名单为空");
                    return;
                }
            } else {
                alert("请选择名单类型");
                return;
            }
        }
        $scope.operationRecord.memberListName = memberListName;
        $scope.operationRecord.memberListId = parseInt(memberListId);
        var url = globalConfig.basePath+"/otProductQuotaAudit/edit";
        $http.post(url,$scope.operationRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $scope.queryList();
                alert("操作成功");
                $scope.operationType = 0;
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    //如果是正整数
    function isNumber(str){
    	var r = /^\+?[1-9][0-9]*$/;　　    
    	return r.test(str);
    }
    
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
        if($scope.effectRecord.isEnable=='0'){
            url = globalConfig.basePath+"/otProductQuotaAudit/valid";
        } else {
            url = globalConfig.basePath+"/otProductQuotaAudit/invalid";
        }
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
                $scope.queryList();
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
    
    // 审核
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/otProductQuotaAudit/confirm";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
                $scope.queryList();
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
   /* 
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
    $scope.getTypeVersionList("sys_product_version_wk");
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQueryFloat(1);
    });
    $("#productChannel").change(function(){
    	var channel = $("#productChannel").val();
    	if(channel==0){
    		$scope.getTypeVersionList("sys_product_version_wk");
    	}else if(channel==1){
    		$scope.getTypeVersionList("sys_product_version_qb");
    	}else{
    		$scope.getTypeVersionList("sys_product_version_wx");
    	}
   });
    
   $scope.getTypeVersion = function(channel){
	   	if(channel==0){
   			$scope.getTypeVersionList("sys_product_version_wk");
   		}else if(channel==1){
   			$scope.getTypeVersionList("sys_product_version_qb");
   		}else{
   			$scope.getTypeVersionList("sys_product_version_wx");
   		}
   };
    
    //获取全部版本列表
    $scope.getAllVersionList = function(type){
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
    $scope.getAllVersionList();
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
        $scope.getTypeVersionList('sys_product_version_wk');
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
        
        var login = $("#login").prop("checked");
        var logout = $("#logout").prop("checked");
        if(!login&&!logout){
        	alert('请选择登录状态');
    		return;	
        }
        if(login){
        	$scope.add.loginStatus = 1;
        }else{
        	$scope.add.loginStatus = 0;
        }
        
        $scope.add.imageUrl = $('#fileUrl').val();
        if($scope.add.imageUrl==null||$scope.add.imageUrl==""){
            alert("请选上传图片");
            return ;
        }
        if($scope.add.redirectUrl==null||$scope.add.redirectUrl==""){
            alert("请填写跳转链接");
            return ;
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
        $('.checkbox').each(function () {
            if(this.checked == true){
            	$scope.add.showType = $(this).val();
            }
        })
    	if($scope.add.showType==null||$scope.add.showType==""){
    		alert('请选择黑白明白');
    		return;	
    	}
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
    $scope.u={}
    //修改
    $scope.editFloat = function(float){
    	 $scope.u={}
    	 if(float.showType==0){
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
    	 }
    	 float.valid = float.valid+"";
    	 float.whiteId = float.whiteId+"";
    	 float.blackId = float.blackId+"";
    	
    	 $scope.queryWhiteAndBlack();
    	 var type;
    	 if(float.productChannel==0||float.productChannel==2){
    	    type = "sys_product_version_wk";
    	 }
    	 if(float.productChannel==1){
    	   	type = "sys_product_version_qb";
    	 }
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
    	
    }
    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    
    //保存修改
    $scope.saveEditFloat = function(){
    	if($scope.operationRecord.productChannel==null){
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
        }
        
   
    	var loginEdit = $("#loginEdit").prop("checked");
        var logoutEdit = $("#logoutEdit").prop("checked");
        if(!loginEdit&&!logoutEdit){
          alert('请选择登录状态');
      	  return;	
        }
        if(loginEdit){
          $scope.operationRecord.loginStatus = 1;
        }else{
          $scope.operationRecord.loginStatus = 0;
        }
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
        var count = 0;
        $('.updateCheckbox').each(function () {
            if(this.checked == true){
            	$scope.operationRecord.showType = $(this).val();
            	count++;
            }
        })
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
    
    *//**
     * 操作前的预处理
     * @param opType
     * @param record
     *//*
    $scope.preOperate = function(opType,record){
        if(opType == 1){
            // $scope.operationType = 2;
        	//$('.look-start-box').show()
            $("#detailFloat").show();
            $scope.detail = angular.copy(record);
        } else if(opType == 2){
            // $scope.operationType = 1;
            $('#editFloat').show();
            $scope.operationRecord = angular.copy(record);
            $scope.editFloat($scope.operationRecord);
        } else if(opType == 3){
            $scope.operationRecord = record;
            $('#effectFloat').show();
        }
    };
    // 生效、失效
    $scope.validateRecord = function(){
        // 保存数据
        var url = null;
        if($scope.operationRecord.valid=='0'){
            url = globalConfig.basePath+"/float/valid";
        } else {
            url = globalConfig.basePath+"/float/invalid";
        }
        $http.get(url+"?id="+$scope.operationRecord.id).then(function successCallback(callback) {
            $('#effectFloat').hide();
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
   	 	var url = globalConfig.basePath+"/float/getPrioritylist";
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
    	$scope.strotList = [];
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
        }
       
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
    	if($scope.strotList.length<2){
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
    */

}]);