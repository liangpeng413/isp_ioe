'use strict';// 严谨模式
var App = angular.module('popupApp', [], angular.noop);
App.controller('popupController',['$scope','$http', function($scope,$http) {
	var self = $scope;
    self.search = {};// 查询
    self.add={};// 添加
    self.updatePopup={};// 修改
    self.showPopup={};// 查看
    $scope.loginName = globalConfig.loginName;
    self.continuationTypeInfo="";
    
    //按渠道类型获取版本列表
    self.getTypeVersionList = function(productChannel,versions,loginStatus){
    			self.search.productChannel=productChannel+"";
        	 	var parentid	;
            parentid=$('#addproductChannel').val();
            if(parentid)
            		parentid=productChannel;
            if(!versions)
            		versions="";
            if(!loginStatus)
            		loginStatus=1;
            var type;
            if(productChannel==0){
                type = 'sys_product_version_wk_announce';
            }else if(productChannel==2){
                type = 'sys_product_version_wx_announce';
            }else{
                type = 'sys_product_version_qb_announce';
            }
            var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid+"&type=sys_announce&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
            	//	if(data.data.resp.result[0].Version.length>0)
            			self.typeVersionList = data.data.resp.result[0].Version;
            			//self.search.productVersion = self.typeVersionList[0].label;
            			self.search.productVersion = '';
            			self.search.loginStatus='';
            			// self.searchPostionCheck();
            		if(data.data.resp.result[0].Position.length>0){
            			self.positionsList = data.data.resp.result[0].Position;
            			//self.search.position=self.positionsList[0].value;
            		}else{
            			self.positionsList = [];
            			self.search.position='';
            		}
            		 self.loading();	
            		
            			
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取版本列表失败了....");
            });
        };
        
        // 登陆选择
        self.searchPostionCheck = function(){
        		var addproductChannel = $("#searchproductChannel").val();//渠道
        	  	var versions =  $("#searchproductVersion").val();//渠道;// 版本
//	         if(!versions){
//	            alert("请选择产品版本");
//	            return;
//	          }
//              // 登陆状态
              var addLoginStatus = $("#searchLoginStatus").val();//获取选中项的值
//              if(addLoginStatus==null){
//                  alert("请选择弹登陆状态");
//                  return;
//              }
              var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_announce&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
              $http({
                  method: 'GET',
                  url: url,
              }).then(function successCallback(data) {
            	  			if(data.data.resp.result.length==0){
            	  				//self.addPositionsList = data.data.resp.result;
            	  				var obj = new Object();
            	  				var list = new Array();
//            	  				obj.value = "";
//            	  				obj.label ="请选择";
//            	  				list[0]=obj;
            	  				self.positionsList =[];
            	  				self.search.position='';
            	  			}else{
            	  				self.positionsList = data.data.resp.result;
            	  				//self.search.position=self.positionsList[0].value;
            	  			}
            	  				
              }, function errorCallback(response) {
                  // 请求失败执行代码
                  alert("获取公告位置失败了....");
              });
        }    
        
        
    
    //公告查询
    self.querySplashConfigList = function(pageNum){
     	if(self.pages<pageNum&&pageNum!=1){
	    	    return;
	    	}
        if(!pageNum){
        	self.search.pageNum = $scope.page.pageNum;
        } else {
        	self.search.pageNum = pageNum;
        }
        self.search.onTime = $("#searchonTime").val();
        var url = globalConfig.basePath + "/appConfig/announcement/query";//appConfig/announcement
        $http.post(url,self.search).then(
            function(data){
               // if(data.data.code=='000'){
	           // 	self.search.pageList = data.data.resp.result;
            		self.total = data.data.resp.total;
//            		if(data.data.resp.pages)
//            		 	self.pages = data.data.resp.pages;
//            		else{
//            			self.pages = 1;
//            		}
            		self.pages = data.data.resp.pages;
                self.splashConfigList = data.data.resp.list;
//
//                }else{
//                    alert(data.data.message)
//                }
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
        self.search.productVersion="";//产品版本
        self.search.valid="";//是否生效
        self.search.position="";//公告位置
        //self.search.onTime="";//在线时间
        $("#searchTitle").val("");
        $("#searchonTime").val("");
        self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
        self.getTypeVersionListReset(0,"",1);
    }
    
  //按渠道类型获取版本列表
    self.getTypeVersionListReset = function(productChannel,versions,loginStatus){
    			self.search.productChannel=productChannel+"";
        	 	var parentid	;
            parentid=$('#addproductChannel').val();
            if(parentid)
            		parentid=productChannel;
            if(!versions)
            		versions="";
            if(!loginStatus)
            		loginStatus=1;
            var type;
            if(productChannel==0){
                type = 'sys_product_version_wk_announce';
            }else if(productChannel==2){
                type = 'sys_product_version_wx_announce';
            }else{
                type = 'sys_product_version_qb_announce';
            }
            var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid+"&type=sys_announce&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
            	//	if(data.data.resp.result[0].Version.length>0)
            			self.typeVersionList = data.data.resp.result[0].Version;
            			//self.search.productVersion = self.typeVersionList[0].label;
            			self.search.productVersion = '';
            			//self.search.loginStatus='1';
            			// self.searchPostionCheck();
            		if(data.data.resp.result[0].Position.length>0){
            			self.positionsList = data.data.resp.result[0].Position;
            			//self.search.position=self.positionsList[0].value;
            		}else{
            			self.positionsList = [];
            			self.search.position='';
            		}
            		// self.loading();	
            		
            			
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取版本列表失败了....");
            });
        };
    
 //*************************************Add 公告************************************
    //添加公告
    self.addPopup = function(){
     self.add={};
    	 self.addPositionsList =[];
    	 $('#addLoginStatus0').prop("checked", "checked");
    	 
    	 $('#addShow').show();
    	 $("#white").attr('disabled','disabled');
    	 $("#black").attr('disabled','disabled');
    	 $('#all').prop("checked",true);
    	 $("#white").attr("checked",false);
     $("#black").attr("checked",false);
     $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
     $('#selectaddblackId').attr('disabled','disabled');//下拉名单
     $("#selectaddwhiteId").val(""); 
     $("#selectaddblackId").val("");  
    	
        self.add.productChannel = "0";
        $("#selectaddwhiteId").val("");  
        $("#selectaddblackId").val("");
        self.add.valid = "1";
        self.getAddTypeVersionList(0);
        self.add.position="0";
        self.queryWhiteAndBlack();
        //self.addinit();//初始化add页面
       // $('#addShow').show();
    }
    
    //添加按渠道类型获取版本列表
    self.getAddTypeVersionList = function(param){//默认版本
    	 	var parentid	;
        parentid=$('#addproductChannel').val();
        if(parentid)
        		parentid=param;
        var type;
        if(param==0){
            type = 'sys_product_version_wk_announce';
            //$("#addAnnouncementContent").hide();
            $("#addRedirectUrl").show();
        }else if(param==2){
            type = 'sys_product_version_wx_announce';
           // $("#addAnnouncementContent").hide();
            $("#addRedirectUrl").show();
        }else{
            type = 'sys_product_version_qb_announce';
            //$("#addAnnouncementContent").show();
            $("#addRedirectUrl").hide();
        }
        var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        			self.addTypeVersionList = data.data.resp.result[0].Version;
        			//self.addPositionsList = data.data.resp.result[0].Position;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    
    // 选择版本
    self.addversionCheckbox=function(){
//    		$("#addLoginStatus0").prop('checked', false);
//    		$("#addLoginStatus1").prop('checked', false);
//		$("#addLoginStatus0").removeAttr("checked");
//  		$("#addLoginStatus1").removeAttr("checked");
    		self.addPostionCheck();
    }
    
    
     self.addpostion=function(){
    	 	var versions = "";
         $('.versionCheckbox').each(function() {
             if (this.checked == true) { 
            	 if($(this).val()){
            		 versions += $(this).val() + ",";
            	 }
             }
         });
         if(!versions){
             alert("请选择产品版本");
             return;
         }
    	 
    	 
     }
    
     // 登陆选择
     self.addLoginStatus = function(param){
	    	 if(param=='0' || param=='2'){
	 			$("#all").attr('disabled','disabled');
	 			$('#all').prop("checked",true);
	 			$("#white").attr('disabled','disabled');
	 			$('#white').prop("checked",false);
	            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
	            $("#selectaddwhiteId").val("");  
	            $("#black").attr('disabled','disabled');
	            $('#black').prop("checked",false);
	            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
	            $("#selectaddblackId").val(""); 
		            
	 		}else{
	 			$("#all").removeAttr("disabled");  
	 			if($('#all').is(':checked')){
	 	            $("#editwhite").attr('disabled','disabled');
	 	            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	 	            $("#editselectaddwhiteId").val("0");  
	 	            $("#editblack").attr('disabled','disabled');
	 	            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	 	            $("#editselectaddblackId").val("0");  
	 	        }else{
	 	        		
			 		$('#all').prop("checked",true);
			 		$("#white").removeAttr('disabled','disabled');
				    $("#selectaddwhiteId").removeAttr("disabled");  
			        $("#black").removeAttr('disabled','disabled');
			        $("#selectaddblackId").removeAttr("disabled"); 
		 			
	 	        }
	 			
	 		}
    	 
    	 	self.addPostionCheck();
     }
     
    // 登陆选择
    self.addPostionCheck = function(){
    		var addproductChannel = $("#addproductChannel").val();//渠道
    	  	var versions = "";// 版本
          $('.versionCheckbox').each(function() {
              if (this.checked == true) {
                  versions += $(this).val() + ",";
              }
          });
//          if(!versions){
//              alert("请选择产品版本");
//              $("#addLoginStatus0").prop("checked",false);
//  	  		$("#addLoginStatus1").prop("checked",false);
//              return;
//          }
          // 登陆状态
          //var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
          var addLoginStatus =self.add.loginStatus;
          if(!addLoginStatus){
              //alert("请选择弹登陆状态");
              return;
          }
          var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_announce&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
          $http({
              method: 'GET',
              url: url,
          }).then(function successCallback(data) {
        	  			if(data.data.resp.result.length==0){
        	  				//self.addPositionsList = data.data.resp.result;
        	  				var obj = new Object();
        	  				var list = new Array();
//        	  				obj.value = "";
//        	  				obj.label ="请选择";
//        	  				list[0]=obj;
        	  				self.addPositionsList =list;
        	  			}else{
        	  				self.addPositionsList = data.data.resp.result;
        	  			}
        	  				
          }, function errorCallback(response) {
              // 请求失败执行代码
              alert("获取公告位置失败了....");
          });
          
          
    	
    }
    
    
    //确认添加公告
    self.commitScreen = function(){
        if(self.add.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        var versions = "";
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        
        var postions = "";
        $('.postionCheckbox').each(function() {
            if (this.checked == true) {
            		
            		if($(this).val()){
            			postions += $(this).val() + ",";
               	 }
            }
        });
        
        if(postions==null || postions==""|| postions=="请选择"){
            alert("位置不能空");
            return;
        }else{
        	self.add.productPostion = postions;
        }
        
        if(!self.add.title){
        	 	alert("标题不能空");
             return;
        }
        
        // 登陆状态
       // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
        var addLoginStatus =self.add.loginStatus;
        if(addLoginStatus==null){
            alert("请选择弹登陆状态");
            return;
        }
        self.add.loginStatus=addLoginStatus;
        
        
        if(versions==null || versions==""){
            alert("产品版本不能为空");
            return;
        }else{
            self.add.productVersion = versions;
        }
        if(self.add.productPostion==null){
            alert("公告位置不能为空");
            return ;
        }
//        self.add.imageUrl=$('#fileUrl').val()
//        if(self.add.imageUrl==null){
//            alert("公告图片不能为空");
//            return;
//        }
        if(self.add.productChannel != 1 && self.add.redirectUrl==null){
            alert("跳转链接不能为空");
            return;
        }
        // 公告策略
/**     var strategytype = $("input[name='strategy_type']:checked").val();//获取选中项的值
        if(strategytype==null){
            alert("请选择公告策略");
            return;
        }
        self.add.strategyType=strategytype;
        if(self.add.showTimes==null){
            alert("公告次数不能空");
            return;
        }
**/
        
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

        if(self.add.valid==null){
            alert("请选择是否生效");
            return;
        }
       $('.checkbox').each(function () {
           if(this.checked == true){
               self.add.showType = $(this).val();
           }
       })
       
       var all = $("#all").prop("checked");
       if(all){
    	   self.add.showType = 0;
       }else{
       	var white = $("#white").prop("checked");
       	var black = $("#black").prop("checked");
       	if(white&&black){
       		self.add.showType = 3;// 同时选中黑白名单
       		if(!self.add.whiteId){
	             alert("请选择白名单列表");
	             return;
	         }
       		if(!self.add.blackId){
	             alert("请选择黑名单列表");
	             return;
	         }
       	}else{
       		if(white){
       			self.add.showType = 1;
       			if(!self.add.whiteId){
	   	             alert("请选择白名单列表");
	   	             return;
       			}
       		}else if(black){
       			self.add.showType = 2;
       			if(!self.add.blackId){
	   	             alert("请选择黑名单列表");
	   	             return;
       			}
       		}else{
       			alert('请选择展示人群');
           		return;	
       		}
       	}
       }
       if(self.add.productChannel==1){
    	   		self.add.announcementDesc = $('#addAnnouncementDesc').val();
       }else{
    	   		self.add.announcementDesc =self.add.title;
       }
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
       var url = globalConfig.basePath + "/appConfig/announcement/adds";
      // var url = globalConfig.basePath+"/appConfig/Popup/addPopup";
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
                self.querySplashConfigList(1);
                //self.reset();
                //self.loading();
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    } 
    
    
    
    //查询黑白名单列表
    self.queryWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
                self.blackList_qb = data.data.resp.black_qb;
                self.blackList_wk = data.data.resp.black_wk;
                self.whiteList_qb = data.data.resp.white_qb;
                self.whiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    
    
    //添加全部选中事件
    self.completeAll = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#selectaddwhiteId").val("");  
            $("#black").attr('disabled','disabled');
            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
            $("#selectaddblackId").val("");  
        }else {
            $("#white").removeAttr('disabled','disabled');
            $("#selectaddwhiteId").removeAttr("disabled");  
            $("#black").removeAttr('disabled','disabled');
            $("#selectaddblackId").removeAttr("disabled");  
        }
    }  
  
    
    
 //************************公告查看**************************   
    //查看
    self.check = function(query){
    	 	self.showPopup=query;
    	
        $('#showPopupCheck').show();
        
    }   
    
    
    self.checkOKAndNO=function(){
    		$('#showPopupCheck').hide();
    }
    
 
//************************修改*****************************
    
    self.update = function(query){
	    	if(query.productChannel!=1){
		   		query.title=query.announcementDesc;
	    	}
		$('#showUpdate').show();
	 	self.updateScene={};
	 	$("#editselectaddwhiteId").val(""); 
	 	$("#editselectaddblackId").val("");  
	 	$('#editall').prop("checked",false);//默认全部不选择
	 	$("#editwhite").attr("checked",false);
		$("#editblack").attr("checked",false);
		self.updateScene.productChannel=query.productChannel;
		self.updateScene.productVersion=query.productVersion;
		self.updateScene.positions=query.positions;
		$("#editall").removeAttr("disabled");  
		if(query.loginStatus=='0' || query.loginStatus=='2'){
			$("#editall").attr('disabled','disabled');
 			$('#editall').prop("checked",true);
			
		}
		var strategyType  =query.strategyType;
		if(strategyType==0)
			$("#updatestrategytype0").prop("checked",true);
		else
			$("#updatestrategytype1").prop("checked",true);
		//$("#editproductChannel").val(query.productChannel);
		var sequenceId = query.sequenceId;
			//self.queryWhiteAndBlack();
			self.queryEditWhiteAndBlack();
	        query.valid = query.valid+"";
	        query.whiteId = query.whiteId+"";
	        query.blackId = query.blackId+"";
	        self.updateScene = query;
	        self.updateScene.auditPerson="";
	        if(query.showType==0){
	    			$('#editall').prop("checked",true);
	            $('#editwhite').prop("checked",false);
	            $('#editblack').prop("checked",false);
	            $("#editwhite").attr('disabled','disabled');
	            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	            $("#editselectaddwhiteId").val("0");  
	            $("#editblack").attr('disabled','disabled');
	            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	            $("#editselectaddblackId").val("0");  
	            
		    	 }else if(query.showType==1){
		    		 $('#editwhite').prop("checked",true);
		             $('#editblack').prop("checked",false);
		             $('#editall').prop("checked",false);
		    	 }else if(query.showType==2){
		    		 $('#editblack').prop("checked",true);
		             $('#editwhite').prop("checked",false);
		             $('#editall').prop("checked",false); 
		    	 }else if(query.showType==3){
		    		 $('#editblack').prop("checked",true);
		         $('#editwhite').prop("checked",true);
		         $('#editall').prop("checked",false); 
		    	 }
	 	
	}

   
    
    //添加全部选中事件
    self.editAll = function(){
        $("#editwhite").attr("checked",false);
        $("#editblack").attr("checked",false);
        if($('#editall').is(':checked')){
            $("#editwhite").attr('disabled','disabled');
            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");  
            $("#editblack").attr('disabled','disabled');
            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
            $("#editselectaddblackId").val("0");  
        }else {
            $("#editwhite").removeAttr('disabled','disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");  
            $("#editblack").removeAttr('disabled','disabled');
            $("#editselectaddblackId").removeAttr("disabled");  
        }
    }
    
    
    
    //确认修改
    self.confirmUpdate = function(){
       
        if(self.updateScene.productChannel != 1 && !self.updateScene.redirectUrl){
            alert("跳转链接不能为空");
            return;
        }
       
        if(!self.updateScene.title){
        		alert("标题不能为空");
            return;
        }
        
        self.updateScene.onlineTime = $('#updateOnlineTime').val()+"";
        self.updateScene.offlineTime = $('#updateOfflineTime').val()+"";
        if(!self.updateScene.onlineTime || !self.updateScene.offlineTime){
            alert("上线时间下线时间不能为空");
            return;
        }
        if(self.updateScene.offlineTime<=self.updateScene.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
        if(self.updateScene.valid==null){
            alert("请选择是否生效");
            return;
        }
        $('.updateCheckbox').each(function () {
            if(this.checked == true){
                self.updateScene.showType = $(this).val();
            }
        })
        var all = $("#editall").prop("checked");
        if(all){
     	   self.updateScene.showType = 0;
        }else{
        	var white = $("#editwhite").prop("checked");
        	var black = $("#editblack").prop("checked");
        	var editselectaddwhiteId = $("#editselectaddwhiteId").val(); 
        	var editselectaddblackId = $("#editselectaddblackId").val(); 
        	if(white&&black){
        		self.updateScene.showType = 3;
        		if(editselectaddwhiteId=='0'){
    	             alert("请选择白名单列表");
    	             return;
    	         }else{
    	        	 	self.updateScene.whiteId=editselectaddwhiteId;
    	         }
           	if(editselectaddblackId=='0'){
    	             alert("请选择黑名单列表");
    	             return;
    	         }else{
    	        	 	self.updateScene.blackId=editselectaddblackId;
    	         }
        	}else{
        		if(white){
        			self.updateScene.showType = 1;
        			if(editselectaddwhiteId=='0'){
       	             alert("请选择白名单列表");
       	             return;
       	         }else{
       	        	 	self.updateScene.whiteId=editselectaddwhiteId;
       	        	 	self.updateScene.blackId='0';
       	         }
        			
        		}else if(black){
        			self.updateScene.showType = 2;
        			if(editselectaddblackId=='0'){
       	             alert("请选择黑名单列表");
       	             return;
       	         }else{
       	        	 	self.updateScene.blackId=editselectaddblackId;
       	        	 self.updateScene.whiteId='0';
       	         }
        		}else{
        			alert('请选择展示人群');
            		return;	
        		}
        	}
        }
        if(self.updateScene.productChannel != 1){
        	 	self.updateScene.announcementDesc =  self.updateScene.title;
        }else{
        	 // 公告位描述
         self.updateScene.announcementDesc = $('#updateAnnouncementDesc').val();

        }
       
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
       // var url = globalConfig.basePath+"/appConfig/Popup/editPopup";
        var url = globalConfig.basePath+"/appConfig/announcement/updateRAnnounce";
        $http.post(url,self.updateScene).then(
            function(data){
                alert(data.data.message);
                $('#showUpdate').hide();
                self.updateScene = {};
                self.querySplashConfigList(1);
                //self.reset();
                //self.loading();
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    }
    
    
    //取消修改
    self.updateCancel = function(){
        $('#showUpdate').hide();
        self.updateScene = {};
        // self.reset();
        // self.loading();
    }
    
    //查询黑白名单列表
    self.queryEditWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
                self.editblackList_qb = data.data.resp.black_qb;
                self.editblackList_wk = data.data.resp.black_wk;
                self.editwhiteList_qb = data.data.resp.white_qb;
                self.editwhiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    
    //*******************排序**************************
    self.stort = function(){
    		var	searchproductChannel=$("#searchproductChannel").val();
    		var searchproductVersion=$("#searchproductVersion").val();
    		var searchpositions=$("#searchpositions").val();
    		var searchLoginStatus=$("#searchLoginStatus").val();
    		
            if(!searchproductChannel){
            		alert("请在查询条件中选择渠道");
                return;
            }
            if(!searchproductVersion){
               
                alert("请在查询条件中选择产品版本");
                return;
            }
            if(!searchpositions){
                alert("请在查询条件中选择公告位置");
                return;
            }
            if(!searchLoginStatus){
                alert("请在查询条件中选择登陆状态");
                return;
            }
	        $('#showPriority').show();//
	        var url = globalConfig.basePath+"/appConfig/announcement/selectSort?productChannel="+searchproductChannel+"&productVersion="+searchproductVersion+"&positions="+searchpositions+"&loginStatus="+searchLoginStatus;
	        
	        $http({
	            method: 'GET',
	            url: url,
	        }).then(function successCallback(data) {
	        	if(data.data.code=='000'){
	    			for(var i=0;i<data.data.resp.result.length;i++){
	    				data.data.resp.result[i].priority =i+1;			
	    			}
	    			  self.strotList = data.data.resp.result;
	    	     }
	           // self.strotList = data.data.resp.result;
	        }, function errorCallback(response) {
	            // 请求失败执行代码
	            alert("根据id获取对象失败....");
	        });
    }
    
    //移动
    var moveList = new Array();
    self.move = function(type){
        if( $("input[class='moveCheckbox']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
        var length = self.strotList.length;
        
        
        
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
                 if(type=='S'){//上移
                    var me =$(this).val()-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  self.strotList[me];//当前选中的
                    var move1 = self.strotList[me-1];//上一个
                     self.strotList[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                     self.strotList[me] = move1;// 当前选中的
                     self.strotList[me-1].priority =Number($(this).val())-Number(1);
                   self.strotList[me].priority =Number($(this).val());
                 }else if(type=='X'){// 下移
                     var me =$(this).val()-1;
                     if(me==length-1){
                         alert("已经最后了,还要往那移");
                         return;
                     }
                     var move0 = self.strotList[me];// 下一个公告
                     move0.priority=Number($(this).val())+Number(1);
                     
                     var move1 = self.strotList[me+1];// 下一个公告
                     move1.priority=Number($(this).val());
                     self.strotList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                     self.strotList[me] = move1;// 下一个移动到当前的位置
                    
                 }
            }
        })

    }
    
    
    self.moveCommit = function(){
        var url = globalConfig.basePath+"/appConfig/announcement/moveCommit";
        $http.post(url,self.strotList).then(
            function(data){
                alert(data.data.message);
                //self.reset();
               // self.loading();
                self.querySplashConfigList(1);
                $('#showPriority').hide();
                self.strotList = {};
            },function(response) {
                alert("请求失败了....");
            }
        );
    }
    
    //********************失效***************************
    //生效失效公告
    self.start = function(id,valid){
        $('#showStart').show();
        self.start.startValid=valid;
        self.start.id = id;
    }
    //确定失效生效公告
    self.confirmStart = function(id,valid){
        if(valid==0){
            valid=1;
        }else if(valid==1){
            valid=0;
        }
        var url = globalConfig.basePath+"/appConfig/Popup/takeEffectPopup?id="+id+"&valid="+valid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
             //self.reset();
           // self.loading();
             self.querySplashConfigList(1);
            $('#showStart').hide();
           
        }, function errorCallback(response) {
            alert("失败....");
        });
        self.querySplashConfigList(1);
    }

    //取消生效失效公告
    self.cancelStart = function(){
        $('#showStart').hide();
    }
    
    
    
    /**
     * 打开生效弹框
     */
    $scope.startShow = function (id,valid,SequenceId) {
        $('#showStart').show();
        $scope.SequenceId = SequenceId;
        $scope.id = id;
        $scope.isValid = valid;
        
    }
    
    /**
     * 关闭生效弹框
     */
    $scope.cancel = function () {
        $('#showStart').hide();
    }

    /**
     * 进行生效/失效公告
     */
    $scope.start = function (id,valid,SequenceId) {
        var url = "";
        if (valid == 0){
            url =  globalConfig.basePath+"/appConfig/announcement//takeEffect?id="+id+"&SequenceId="+SequenceId;
        }else if (valid == 1){
            url =  globalConfig.basePath+"/appConfig/announcement/failure?id="+id+"&SequenceId="+SequenceId;
        }
        $http({
            method: 'POST',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            $('#showStart').hide();
            //$scope.queryAnnouncement(1);
            self.querySplashConfigList(1);
        }, function errorCallback(response) {
            alert("失败....");
        });
    }
    
    //默认查询
    self.loading = function(){
        //self.search.productChannel = "0";
        
        //self.search.productVersion = "";
        self.search.pageSize = "5";
        
        self.querySplashConfigList(1);
    }
    self.getTypeVersionList(0,"",1);
   // self.loading();
    
    
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
        var url = globalConfig.basePath+"/appConfig/announcement/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {
            
            if(callback.data.code == '000'){
            	  $('.take-start-box').hide();
            	  $scope.querySplashConfigList(1);
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
    
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
    	   record.requestAuditDescription="";
       $scope.effectRecord = record;
       $scope.effectRecord.auditPerson={};
       self.effectRecord.auditPerson.no='';
       $('#takeEffect').show();
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
    	
        if(self.effectRecord.valid=='1'){
			self.effectRecord.valid='0';
		}else{
			self.effectRecord.valid='1';
		}
    		var url = globalConfig.basePath+"/appConfig/announcement/takeEffectNew";
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
    		
    	
    } 
	
}]);
   



