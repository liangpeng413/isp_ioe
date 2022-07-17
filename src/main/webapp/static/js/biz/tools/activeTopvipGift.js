'use strict';

var App = angular.module('splashApp', [], angular.noop);
App.controller('splashController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};
    self.search.configType=1;
    self.add={};
    self.updateScene={};
    self.openScreen={};
    $scope.loginName = globalConfig.loginName;
    
    
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


    //节日礼查询
    self.querySplashConfigList = function(pageNum){
    		if(!pageNum){
            self.search.pageNo = self.pageNo;
        } else {
            if(pageNum > self.search.pageCount && self.search.pageCount>0){
                self.search.pageNo=self.search.pageCount;
            }else{
                self.search.pageNo = pageNum;
            }
        }
    		self.search.onTime = $("#searchonTime").val();
        var url = globalConfig.basePath+"/festival/otAuditActiveTopvipGiftlist";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                		if(data.data.resp.currentPage)
                			self.search.pageNo = data.data.resp.currentPage;
                		else
                			self.search.pageNo =1;
                    self.search.pageSize = data.data.resp.pageSize+"";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.splashConfigList = data.data.resp.result;

                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };
    
    //重置
    self.reset = function(){
       // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.status="";//上线状态
        self.search.status="";
        self.search.delFlag="";//产品版本
        self.search.auditStatus="";//是否生效
        self.search.desce="";
        $("#searchDesc").val("");
        $("#searchonTime").val("");
       // self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
        //self.getTypeVersionListRest(0,"",1);
    }
    
    //默认查询
    self.loading = function(){
        self.search.productChannel = "0";
        self.search.productVersion = "";
        self.search.pageSize = "5";
        self.search.configType="1";
        self.querySplashConfigList(1);
    }
    self.loading();	
    
//******************增*******************************
    //添加弹窗
    self.addScreen = function(){
     	$('#addShow').show();
     	self.add={};
     	self.add.productChannel='0';
     	self.add.configType="1";
	    	self.add.giftType=1;
    }
    

    //确认添加
    self.commitScreen = function(){
        if(self.add.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        if(!self.add.configType){// 
            alert("配置类型不能为空");
            return;
        }
        
        if(!self.add.title){
            alert("名称不能为空");
            return ;
        }
        if(!self.add.rule){
            alert("领取规则不能为空");
            return ;
        }
        if(!self.add.giftType){
            alert("奖励类型不能为空");
            return ;
        }
        if(!self.add.giftValue){
            alert("奖励不能为空");
            return ;
        }
        if(self.add.giftType==1){
        		if(!(self.add.giftValue>=1 && self.add.giftValue<=9999999)){
        			alert("积分值范围：1-9999999,超出范围了");
        			return ;
        		}
        }
        if(!self.add.maxCount){
            alert("可领总数不能为空");
            return ;
        }
       
        self.add.onlineTime = $('#queryOnlineTime').val()+"";
        self.add.offlineTime = $('#queryOfflineTime').val()+"";
        if(!self.add.onlineTime || !self.add.offlineTime){
            alert("上线时间下线时间不能为空");
            return;
        }

        if(self.add.offlineTime<=self.add.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
        var offlineTime =self.add.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime="23:59:59";
        self.add.offlineTime = offlineTimes[0]+" "+miniTime;
       // 审核人
       var auditPerson = self.add.auditPerson;
       if(!self.add.auditPerson){
           alert("审核人不能为空");
           return ;
       }else{
        	self.add.auditNo=self.add.auditPerson.no;
        	self.add.requestAuditPersonEmail=self.add.auditPerson.email;
        	self.add.auditPerson=self.add.auditPerson.name;
       }
       if(!self.add.requestAuditDescription){
           alert("提审说明不能为空");
           return ;
       }
       if(self.add.giftType>=2){
	    	   var url = globalConfig.basePath+"/festival/checkInfo";
           $http.post(url,self.add).then(
               function(data){
            	   if(data.data.code == '000'){
                	   var url = globalConfig.basePath+"/festival/addActiveTopvipGift";
                     $http.post(url,self.add).then(
                         function(data){
                             $('#addShow').hide();
                             self.add = {};
                             self.querySplashConfigList(1);
                             alert(data.data.message);
                         },function(response) {
                             alert("请求失败了....");
                         }
                     );
	            	   }else{
	            		   alert("卡券/奖池验证失败....状态码:"+data.data.code+"返回信息"+data.data.message);
	            	   }
               },function(response) {
            	   		alert("卡券/奖池验证失败....状态码:"+response.data.code+"返回信息"+response.data.message);
               }
           );
       }else{
         var url = globalConfig.basePath+"/festival/addActiveTopvipGift";
         $http.post(url,self.add).then(
             function(data){
                 alert(data.data.message);
                 $(".upstatus").html("");
                 $('#addShow').hide();
                 self.add = {};
                 //self.reset();
                 //self.loading();
                 self.querySplashConfigList(1);
             },function(response) {
                 alert("请求失败了....");
             }
         );
       }
    }

  //******************改*******************************
    //修改回显
    self.update = function(query){
	    	console.log(query);
		$('#showUpdate').show();
	 	self.updateScene={};
	 	query.productChannel=query.productChannel+"";
	 	query.loginStatus = query.loginStatus+"";
	 	query.positions = query.positions+"";
	 	query.auditPerson="";
	 	 query.type= query.type+"";
	    self.updateScene=angular.copy(query);
    }
   	
    //确认修改
    self.confirmUpdate = function(){
	    	 if(self.updateScene.productChannel==null){
	             alert("渠道不能为空");
	             return ;
	         }
	    	 if(self.updateScene.productChannel==null){
             alert("渠道不能为空");
             return ;
         }
         if(!self.updateScene.configType){// 
             alert("配置类型不能为空");
             return;
         }
         
         if(!self.updateScene.title){
             alert("名称不能为空");
             return ;
         }
         if(!self.updateScene.rule){
             alert("领取规则不能为空");
             return ;
         }
         if(!self.updateScene.giftType){
             alert("奖励类型不能为空");
             return ;
         }
         if(!self.updateScene.giftValue){
             alert("奖励不能为空");
             return ;
         }
         if(self.updateScene.giftType==1){
         		if(!(self.updateScene.giftValue>=1 && self.updateScene.giftValue<=9999999)){
         			alert("积分值范围：[1-9999999],超出范围了");
         			return ;
         		}
         }
         if(!self.updateScene.maxCount){
             alert("可领总数不能为空");
             return ;
         }
         if(!self.updateScene.onlineTime || !self.updateScene.offlineTime){
             alert("上线时间下线时间不能为空");
             return;
         }

         if(self.updateScene.offlineTime<=self.updateScene.onlineTime){
         	alert("下线时间必须大于上线时间");
             return;
         }
         var offlineTime =self.updateScene.offlineTime;
         var offlineTimes = offlineTime.split(" ");
         var miniTime="23:59:59";
         self.updateScene.offlineTime = offlineTimes[0]+" "+miniTime;
        // 审核人
        var auditPerson = self.updateScene.auditPerson;
        if(!self.updateScene.auditPerson){
            alert("审核人不能为空");
            return ;
        }else{
         	self.updateScene.auditNo=self.updateScene.auditPerson.no;
         	self.updateScene.requestAuditPersonEmail=self.updateScene.auditPerson.email;
         	self.updateScene.auditPerson=self.updateScene.auditPerson.name;
        }
        if(!self.updateScene.requestAuditDescription){
            alert("提审说明不能为空");
            return ;
        }
        if(self.updateScene.giftType>=2){
        		var url = globalConfig.basePath+"/festival/checkInfo";
            $http.post(url,self.updateScene).then(
                function(data){
             	   if(data.data.code == '000'){
                 	   var url = globalConfig.basePath+"/festival/editActiveTopvipGift";
                 	  $http.post(url,self.updateScene).then(
                              function(data){
                                  self.updateScene = {};
                                  alert(data.data.message);
                                  $('#showUpdate').hide();
                                  self.querySplashConfigList(1);
                              },function(response) {
                                  alert("请求失败了....");
                              }
                          );
 	            	   }else{
 	            		   alert("卡券/奖池验证失败....状态码:"+data.data.code+"返回信息"+data.data.message);
 	            	   }
                },function(response) {
             	   		alert("卡券/奖池验证失败....状态码:"+response.data.code+"返回信息"+response.data.message);
                }
            );
        }else{
        		var url = globalConfig.basePath+"/festival/editActiveTopvipGift";
            console.info(self.updateScene);

            $http.post(url,self.updateScene).then(
                function(data){
                    self.updateScene = {};
                    alert(data.data.message);
                    $('#showUpdate').hide();
                    self.querySplashConfigList(1);
                },function(response) {
                    alert("请求失败了....");
                }
            );
        }
        
       
    }

    //取消修改
    self.updateCancel = function(){
        $('#showUpdate').hide();
        self.updateScene = {};
        self.querySplashConfigList(1);
    }
    
  //******************查*******************************    
  //查看
    self.check = function(query){
       var url = globalConfig.basePath+"/festival/getActiveTopvipGiftInfo";
       self.updateScene={};
       self.updateScene=query;
        console.info(self.updateScene);

        $http.post(url,self.updateScene).then(
            function(data){
	            	var curCount = data.data.resp;
	        	 	$('#showCheck').show();
	             self.openScreen={};
	           	 console.log(query);
	     	     self.openScreen=angular.copy(query);
	     	     self.openScreen.curCount=curCount;
            },function(response) {
             	$('#showCheck').show();
	    	        self.openScreen={};
	    	        console.log(query);
	    	        self.openScreen.curCount="服务端查询接口出错了!";
	    	    	    self.openScreen=angular.copy(query);
	                // 请求失败执行代码
	    	    	    alert("服务端查询接口出问题了.");
            }
        );
    }

    //查看确定和取消
    self.checkOKAndNO = function () {
        $('#showCheck').hide();
    }

// **************************审核********************************
    /**
     * 审批
     */
    self.audit = function(record){
	    	if(record.auditStatus != "0"){
	    		alert('只能对待审核状态的数据进行操作');
	    		return;	
	    	 }
	    	self.auditStatus = "1";
	    	$('#auditShow').show();
	    	self.confirmRecord = angular.copy(record);
	   // 	self.auditStatus = "2";
	    	self.auditDescription = "";
    	
    };
    // 审核
    self.confirm = function(){       
        self.confirmRecord.auditStatus = self.auditStatus;
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath+"/festival/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	 $('.take-start-box').hide();
            	alert(callback.data.resp.message);
            	$scope.querySplashConfigList(1);
            } else {
                console.error(callback.data);
                alert("操作失败"+"状态码:"+callback.data.code+"接口返回消息:"+callback.data.message);
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
        	alert(response);
        });
    };
    
  //******************生效/失效*******************************    
    //生效失效
    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
       record.requestAuditDescription="";
       $scope.effectRecord = record;
       $scope.effectRecord.auditPerson={};
       $scope.effectRecord.auditPerson.no='';
       $('#takeEffect').show();
    };
    
    
    $scope.cancelTakeEffect= function(){
   	 $('#takeEffect').hide();
   	 $scope.effectRecord.auditPerson="";
   	
   };
   
   $scope.cancelAuditShow= function(){
  	 	$('#auditShow').hide();
  	 	$scope.auditStatus="1";
  	 	$scope.auditDescription="";
  };
    
    $scope.validateRecord = function(){
    	  // 审核人
        //var auditPerson = self.effectRecord.auditPerson;
        if(!self.effectRecord.auditPerson.no){
            alert("审核人不能为空");
            return ;
        }else{
         	self.effectRecord.auditNo=self.effectRecord.auditPerson.no;
         	self.effectRecord.requestAuditPersonEmail=self.effectRecord.auditPerson.email;
         	self.effectRecord.auditPerson=self.effectRecord.auditPerson.name;
        }
    	
		if(self.effectRecord.delFlag=='T'){
			self.effectRecord.delFlag='F';
		}else{
			self.effectRecord.delFlag='T';
		}
        
    		var url = globalConfig.basePath+"/festival/effect";
        $http.post(url,self.effectRecord).then( function(data){
        	 $('#takeEffect').hide();
            	if(data.data.code == '000'){   
            		 alert(data.data.message);
            		 $scope.querySplashConfigList(1);
            	}
            },function(response) {
                alert("请求失败了....");
            }
        );
    };
    
    
}]);
