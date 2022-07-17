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
    $scope.versionList = {};
    $scope.add = {};
    $scope.up = {};
    $scope.add.productVersion = [];
    $scope.showSql=0;
    $scope.sqlStr="";
    $scope.checkSqlBut=1;
    $scope.shureBut=0;
    $scope.numKeepTwoPoint = function(v) {
        v = v.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        v = v.replace(/^\./g,""); //验证第一个字符是数字
        v = v.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
        v = v.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
        return v;
    }


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


   //显示
    $scope.addHelpRaise = function(){
    	$scope.add = {};
        $scope.add.productChannel = '0';
        $('#addHelpRaise').show();

    }

    //显示
    $scope.versionUp = function(){
    	$scope.up = {};
        $scope.up.productChannel = '0';
        $('#versionUp').show();
        $scope.versionList={};
    }

    //显示
    $scope.showVer = function(){
        $scope.verUp = {};
        $scope.verUp.productChannel = "";
        $('#verUp').show();

    }
    //显示
    $scope.addPosition = function(){
    	$scope.po = {};
        $scope.po.productChannel = '0';
        $('#addPosition').show();

    }

    //关闭
    $scope.closeVersionUp = function(){
    	$scope.sqlStr="";
    	$scope.showSql=0;
    	$scope.checkSqlBut=1;
        $scope.shureBut=0;
        $('#versionUp').hide();
        $('#upcheckBox').prop("checked",false);
        $scope.versionTypeList={};
       
    }
    //关闭
    $scope.closeVerUp = function(){
        $('#verUp').hide();
        $('#verUpBox').prop("checked",false);
        $scope.versionList={};
    }

    //关闭
    $scope.closeAddHelpRaise = function(){    
        $('#addHelpRaise').hide();
        $('#adcheckBox').prop("checked",false);
        $scope.versionList={};
    }
    
    //关闭
    $scope.closeAddPosition = function(){    
        $('#addPosition').hide();
        $('#positionCheckbox').prop("checked",false);
        $scope.versionList={};
    }
    

    //获取渠道下的版本
    //根据类型获取资源位版本号
    $scope.getUpVersion = function(){
        var prChannel = $scope.verUp.productChannel;
        if(prChannel==""){
            $scope.versionList={};
          return ;
        }
        var url = globalConfig.basePath+"/appConfig/version/getVersionType?productChannel="+prChannel;
        $http.get(url).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.versionList = data.data.resp.result;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求资源位版本失败了....");
            }
        );
    }


    //升级资源位版本
    $scope.saveVerUp = function(){
        if($scope.verUp.productChannel==null || $scope.verUp.productChannel==""){
            alert("理财渠道不能为空");
            return;
        }
        var versions = "";// 版本
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(!versions){
            alert("请选择需要升级的版本");
            return;
        }
        $scope.verUp.productVersion = versions;
        if($scope.verUp.positions==null||$scope.verUp.positions==""){
            alert("请填写需要升级到的版本号");
            return ;
        }
        if(!$scope.verUp.positions.match("~")){
            alert("请输入正确的的版本号");
            return;
        }

        var version= versions.split(",")[0];
        var vers = version.split("~");
        if(vers.length==1){
            var minVer = vers[0];
            var maxVer= vers[0];
        }else{
            var minVer = vers[0];
            var maxVer= vers[1];
        }

        var positions =$scope.verUp.positions.split("~");
        var minPos = positions[0];
        var maxPos = positions[1];

        if(minVer!=minPos ){
            alert("最小版本号必须等于选中的最小版本号");
            return;
        }
        if(maxVer>=maxPos){
            alert("最大版本号必须大于选中的最大版本号");
            return;
        }

        var url = globalConfig.basePath+"/appConfig/version/upVersion";
        $http.post(url,$scope.verUp).then(
            function(data){
                if(data.data.code=='000'){
                    alert('修改版本成功');
                    $('#verUp').hide();
                    $scope.verUp = {};
                }else{
                    alert(data.data.message);
                    $scope.verUp.auditPerson = auditPerson;
                }

            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };







    //升级资源位版本
    $scope.saveHelpRaise = function(){
    	if($scope.add.productChannel==null||$scope.add.productChannel==""){
            alert("理财渠道不能为空");
            return;
        } 
        if($scope.add.positionName==""){
            alert("请选择资源位");
            return;
        }
        
    	var versions = "";// 版本
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(!versions){
            alert("请选择需要升级的版本");
            return;
        }
        $scope.add.productVersion = versions;
        if($scope.add.positions==null||$scope.add.positions==""){
            alert("请填写需要升级到的版本号");
            return ;
        }
        
        var url = globalConfig.basePath+"/appConfig/version/updateVersion";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改版本成功');
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
	
	//根据类型获取资源位版本号
	$scope.getProductVersion = function(resourceType){
		var prChannel = $scope.add.productChannel;
		  var url = globalConfig.basePath+"/appConfig/version/getVersionType?resourceType="+resourceType+"&productChannel="+prChannel;
	        $http.get(url).then(
	            function(data){
	                if(data.data.code=='000'){
	                	$scope.versionList = data.data.resp.result;
	                }else{
	                    alert(data.data.message)
	                }
	            },function errorCallback(response) {
	                alert("请求资源位版本失败了....");
	            }
	        );
	}
	
	//根据type获取字典表版本
	$scope.getVersion = function(type){
	
		  var url = globalConfig.basePath+"/appConfig/version/getVersion?type="+type;
	        $http.get(url).then(
	            function(data){
	                if(data.data.code=='000'){
	                	$scope.versionTypeList = data.data.resp.result;
	                }else{
	                    alert(data.data.message)
	                }
	            },function errorCallback(response) {
	                alert("请求资源位版本失败了....");
	            }
	        );
	}
	
	 //升级资源位版本
    $scope.saveVersionUp = function(){
    	if($scope.up.productChannel==null||$scope.up.productChannel==""){
            alert("理财渠道不能为空");
            return;
        } 
    	if($scope.up.upgradeType==""){
    		 alert("请选择升级方式");
             return;
    	}
        if($scope.up.type==""){
            alert("请选择资源位");
            return;
        }
        
    	var versions = "";// 版本
        $('.versionCheckboxUp').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(!versions){
            alert("请选择需要升级的版本");
            return;
        }
        $scope.up.label = versions;
        if($scope.up.value==null||$scope.up.value==""){
            alert("请填写需要升级到的版本号");
            return ;
        }
        
        var url = globalConfig.basePath+"/appConfig/version/updateDictVersion";
        $http.post(url,$scope.up).then(
            function(data){
                if(data.data.code=='000'){
                	alert('修改版本成功');
                    $('#versionUp').hide();
                    $scope.up = {};
                    $scope.versionTypeList={};
                    $scope.sqlStr="";
                	$scope.showSql=0;
                	$scope.checkSqlBut=1;
                    $scope.shureBut=0;
                }else{
                    alert(data.data.message);
                    $scope.up.auditPerson = auditPerson;
                }
                $scope.pageQueryHelpRaise(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    
    
    
    
    //检验sql
    $scope.checkSql = function(){
    	
    	if($scope.up.productChannel==null||$scope.up.productChannel==""){
            alert("理财渠道不能为空");
            return;
        } 
    	if($scope.up.upgradeType==""){
   		 alert("请选择升级方式");
            return;
   	}
        if($scope.up.type==""){
            alert("请选择资源位");
            return;
        }
        
    	var versions = "";// 版本
        $('.versionCheckboxUp').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(!versions){
            alert("请选择需要升级的版本");
            return;
        }
        $scope.up.label = versions;
        if($scope.up.value==null||$scope.up.value==""){
            alert("请填写需要升级到的版本号");
            return ;
        }
        var sqlStr="";
      var vers = versions.split(",");
        for(var i in vers){
         if(vers[i]!=""){
        	 if($scope.up.upgradeType==0){
        		 sqlStr+="UPDATE r_dict SET label='"+$scope.up.value+"', `value`='"+$scope.up.value
        		 +"' WHERE type='"+$scope.up.type+"' AND `value`='"+vers[i]+"' AND label='"+vers[i]+"' AND del_flag=0;"+'\r\n\r\n';
        	 }else if($scope.up.upgradeType==1){
        		 sqlStr+="UPDATE r_dict SET del_flag=1 WHERE type='"+$scope.up.type
        		 +"' AND `value`='"+vers[i]+"' AND label='"+vers[i]+"';"+'\r\n\r\n';
        	 }
         }	
        }
        if($scope.up.upgradeType==1){
        	 sqlStr+="INSERT INTO r_dict SET label='"+$scope.up.value+"', `value`='"+$scope.up.value
    		 +"', type='"+$scope.up.type+"',del_flag=0; ";
   	  }
        $scope.showSql=1;
        $scope.sqlStr=sqlStr;
        $scope.checkSqlBut=0;
        $scope.shureBut=1;
    };
    
    
}]);