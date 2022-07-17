'use strict';
var App = angular.module('zljxApp', [], angular.noop);
App.controller("zljxController", ['$scope','$http',  function ($scope,$http) {
	$scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.productChannel = '0';
    $scope.search.loginStatus = '';
    $scope.search.auditStatus = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    $scope.numKeepTwoPoint = function(v) {
        v = v.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        v = v.replace(/^\./g,""); //验证第一个字符是数字
        v = v.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
        v = v.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
        return v;
    }
    $scope.checkExpandProfit = function() {
        var ruleProfit = $scope.add.ruleProfit;
        $scope.add.ruleProfit = $scope.numKeepTwoPoint(ruleProfit);
        var num = Number(ruleProfit);
        if(num<0.2||num>2){
            alert("请输入0.20~2.00之间的数字");
        }
    }
    $scope.editCheckExpandProfit = function() {
        var ruleProfit = $scope.operationRecord.ruleProfit;
        $scope.operationRecord.ruleProfit = $scope.numKeepTwoPoint(ruleProfit);
        var num = Number(ruleProfit);
        if(num<0.2||num>2){
            alert("请输入0.20~2.00之间的数字");
        }
    }
    
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
	};    
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
   
    $scope.checkNum = function (str){
    	  var r = /^\+?[1-9][0-9]*$/;　　//正整数
    	  return r.test(str);
    }
   
    
    //开机屏查询
    $scope.pageQueryHelpRaise = function(pageNum){
 
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
        var url = globalConfig.basePath+"/helpRaise/list";
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
    	$scope.search.ruleProduct = '';
    	$scope.search.auditStatus = '';
    	$scope.search.status = '';
    	//$scope.search.productVersion = $scope.typeVersionList[0].label;
    }
    
   
    $("#pageSize").change(function(){
    	 $scope.search.pageSize = $("#pageSize").val();
    	 $scope.pageQueryHelpRaise(1);
    });
    
    
   
    
   
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
    $scope.addHelpRaise = function(){
    	$scope.add = {};
        $scope.add.productChannel = '0';
        $scope.add.valid = '1';
        $('#addHelpRaise').show();      
        $('#addOnlineTime').val('');
        $('#addOfflineTime').val('');
    }
    
    //添加
    $scope.closeAddHelpRaise = function(){    
        $('#addHelpRaise').hide();

    }
    
    $scope.saveHelpRaise = function(){
    	if($scope.add.productChannel==null||$scope.add.productChannel==""){
            alert("渠道不能为空");
            return;
        } 
        if($scope.add.ruleProduct==""){
            alert("请选择产品类型");
            return;
        }
        
        if($scope.add.ruleName==null||$scope.add.ruleName==""){
            alert("请填写活动名称");
            return ;
        }
        if($scope.add.ruleProfit==null||$scope.add.ruleProfit==""){
            alert("请填写助力加息利率");
            return ;
        }else{
        	if($scope.add.ruleProfit<0.2||$scope.add.ruleProfit>2){
        		alert("助力加息利率必须再0.20~2.00范围内");
                return ;
        	}
        }
        if($scope.checkNum($scope.add.ruleAssistNums)){
        	if($scope.add.ruleAssistNums<=0||$scope.add.ruleAssistNums>20){
        		alert("需助力人数必须是大于0小于等于20的整数");
        		return ;
        	}
        }else{
        	if($scope.add.ruleAssistNums==null||$scope.add.ruleAssistNums==undefined||$scope.add.ruleAssistNums==""){
        		alert("请填写需助力人数");
        		return ;
        	}else{
        		alert("需助力人数必须是大于0小于等于20的整数");
            	return ;
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
        var offlineTime =$scope.add.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime="23:59:59";
        $scope.add.offlineTime = offlineTimes[0]+" "+miniTime;
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
        
        var url = globalConfig.basePath+"/helpRaise/add";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('添加成功');
                    $('#addHelpRaise').hide();
                    $scope.add = {};
                }else{
                    alert(data.data.message);
                    $scope.add.auditPerson = auditPerson;
                }
                $scope.pageQueryHelpRaise(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    
    //修改
    $scope.editHelpRaise = function(helpRaise){
       	 helpRaise.valid = helpRaise.valid+"";
       	 helpRaise.ruleProduct = helpRaise.ruleProduct;
       	 helpRaise.productChannel=helpRaise.productChannel+"";
       	 $("#upProductChannel").val(helpRaise.productChannel);
    	
    }
    $scope.checkVer = function(ob){
    	ob.checked = true;
    }
    
    //保存修改
    $scope.saveEditHelpRaise = function(){
    	 if($scope.operationRecord.ruleProduct==""){
             alert("请选择产品类型");
             return;
         }
         
         if($scope.operationRecord.ruleName==null||$scope.operationRecord.ruleName==""){
             alert("请填写活动名称");
             return ;
         }
         if($scope.operationRecord.ruleProfit==null||$scope.operationRecord.ruleProfit==""){
             alert("请填写助力加息利率");
             return ;
         }else{
         	if($scope.operationRecord.ruleProfit<0.2||$scope.operationRecord.ruleProfit>2){
         		alert("助力加息利率必须再0.20~2.00范围内");
                 return ;
         	}
         }
         if($scope.checkNum($scope.operationRecord.ruleAssistNums)){
         	if($scope.operationRecord.ruleAssistNums<=0||$scope.operationRecord.ruleAssistNums>20){
         		alert("需助力人数必须是大于0小于等于20的整数");
         		return ;
         	}
         }else{
         	if($scope.operationRecord.ruleAssistNums==null||$scope.operationRecord.ruleAssistNums==undefined||$scope.operationRecord.ruleAssistNums==""){
         		alert("请填写需助力人数");
         		return ;
         	}else{
         		alert("需助力人数必须是大于0小于等于20的整数");
             	return ;
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
    	
        var url = globalConfig.basePath+"/helpRaise/edit";
        $http.post(url,$scope.operationRecord).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改成功');
                    $('#editHelpRaise').hide();
                    $scope.operationRecord = {};
                    $scope.pageQueryHelpRaise(1);
                }else{
                    alert(data.data.message);
                    $scope.operationRecord.auditPerson = auditPerson;
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
            $("#detailHelpRaise").show();
            $scope.detail = angular.copy(record);
        } else if(opType == 2){
            // $scope.operationType = 1;
            $('#editHelpRaise').show();
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord.auditPerson="";
            $scope.editHelpRaise($scope.operationRecord);
        } else if(opType == 3){
            $scope.effectRecord = record;
            $('#takeEffect').show();
        }
    };
   
    // 生效、失效
    $scope.validateRecord = function(x){
        // 保存数据
    	
        var url = null;
        if($scope.effectRecord.valid=='0'){
            url = globalConfig.basePath+"/helpRaise/valid";
        } else {
            url = globalConfig.basePath+"/helpRaise/invalid";
        }
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
            	$scope.pageQueryHelpRaise(1);
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
  

    
   //取消修改
    $scope.updateCancel = function(){
    	$('#editHelpRaise').hide();
        $scope.u={};
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
        var url = globalConfig.basePath+"/helpRaise/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	$('.examine-box').hide();
            	alert("操作成功");
            	$scope.pageQueryHelpRaise(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    


    $scope.editCheck = function(label){
		var productVersion = $scope.operationRecord.productVersion;
		if(productVersion==label){
			return true;
		}
		return false;   
	};
	$scope.pageQueryHelpRaise(1);
}]);