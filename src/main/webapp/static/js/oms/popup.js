'use strict';// 严谨模式
var App = angular.module('popupApp', [], angular.noop);
App.controller('popupController',['$scope','$http', function($scope,$http) {
	
	
	
	var self = $scope;
    self.search = {};// 查询
    self.search.showType='';
    self.add={};// 添加
    self.updatePopup={};// 修改
    self.showPopup={};// 查看
    $scope.loginName = globalConfig.loginName;
    self.isUpdateRoster = 'N';
    
    //添加弹框上传图片
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
                    alert("上传图片失败：系统暂不支持该类型图片上传");
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
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });
    });
    
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
                type = 'sys_product_version_wk_popup';
            }else if(productChannel==2){
                type = 'sys_product_version_wx_popup';
            } else if (productChannel == 6) {
                type = 'sys_product_version_shop_popup';
            } else {
                type = 'sys_product_version_qb_popup';
            }
            var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid+"&type=sys_popup&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
            	//	if(data.data.resp.result[0].Version.length>0)
            			self.typeVersionList = data.data.resp.result[0].Version;
            			self.search.productVersion = self.typeVersionList[0].label;
            			self.search.loginStatus='';
            			// self.searchPostionCheck();
            		if(data.data.resp.result[0].Position.length>0){
            			self.positionsList = data.data.resp.result[0].Position;
            			self.search.position=self.positionsList[0].value;
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
//	            //alert("请选择产品版本");
//	            return;
//	          }
              // 登陆状态
              var addLoginStatus = $("#searchLoginStatus").val();//获取选中项的值
              if(addLoginStatus==null || addLoginStatus==""){
            	  //默认全部
            	  addLoginStatus="2";
              }
//              if(addLoginStatus==null){
//                  alert("请选择弹登陆状态");
//                  return;
//              }
              var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_popup&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
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
            	  				self.search.position=self.positionsList[0].value;
            	  			}
            	  				
              }, function errorCallback(response) {
                  // 请求失败执行代码
                  alert("获取公告位置失败了....");
              });
        }    
       
        
    //按渠道类型获取版本列表
    self.getTypeVersionListOld = function(param){
        	 	var parentid	;
            parentid=$('#addproductChannel').val();
            if(parentid)
            		parentid=param;
            var type;
            if(param==0){
                type = 'sys_product_version_wk_popup';
            }else if(param==2){
                type = 'sys_product_version_wx_popup';
            } else if (param == 6) {
                type = 'sys_product_version_shop_popup';
            }else{
                type = 'sys_product_version_qb_popup';
            }
            var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
            	//	if(data.data.resp.result[0].Version.length>0)
            			self.typeVersionList = data.data.resp.result[0].Version;
            //		if(data.data.resp.result[0].Position.length>0)
            			self.positionsList = data.data.resp.result[0].Position;
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取版本列表失败了....");
            });
        };
        
        
    //弹框查询
    self.querySplashConfigList = function(pageNum){
    		if(!pageNum){
            self.search.pageNo = self.page.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                self.search.pageNo=self.search.pageCount;
            }else{
                self.search.pageNo = pageNum;
            }
        }
        if(self.search.pageNo==null||self.search.pageNo==''||self.search.pageNo<1){
            self.search.pageNo = 1;
        }
    		self.search.onTime = $("#searchonTime").val();
        var url = globalConfig.basePath+"/appConfig/Popup/pagePopupList";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNo = data.data.resp.currentPage;
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
        self.search.productVersion="";//产品版本
        self.search.valid="";//是否生效
        self.search.positions="";//弹框位置
        self.search.type="";//弹框类型
        //self.search.onTime="";//在线时间
        self.search.auditStatus = '';
        self.search.showType='';
        $("#searchDesc").val("");
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
                type = 'sys_product_version_wk_popup';
            }else if(productChannel==2){
                type = 'sys_product_version_wx_popup';
            } else if (productChannel == 6) {
                type = 'sys_product_version_shop_popup';
            }else{
                type = 'sys_product_version_qb_popup';
            }
            var url = globalConfig.basePath+"/rDict/getSearchVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid+"&type=sys_popup&productVersion="+versions+"&productChannel="+productChannel+"&loginStatus="+loginStatus;;
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
            			self.search.position=self.positionsList[0].value;
            		}else{
            			self.positionsList = [];
            			self.search.position='';
            		}
            			
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取版本列表失败了....");
            });
        };
    

    
 //*************************************Add 弹框************************************
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
    //添加弹框
    self.addPopup = function(){
    		$scope.loginStatus = 1;
    		self.add={};
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
        self.add.positions="";
        self.add.type="";
        self.queryWhiteAndBlack();
        self.add.sceneOne="";
        self.add.sceneTwo="";
        self.add.redirectType="2";
        self.redirectType0="2";
        //self.addinit();//初始化add页面
       // $('#addShow').show();

        //黑白名单显示
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
    };

    //添加按渠道类型获取版本列表
    self.getAddTypeVersionList = function(param){//默认版本
    	 	var parentid	;
        parentid=$('#addproductChannel').val();
        if(parentid)
        		parentid=param;
        var type;
        if(param==0){
            type = 'sys_product_version_wk_popup';
        }else if(param==2){
            type = 'sys_product_version_wx_popup';
        } else if (param == 6) {
            type = 'sys_product_version_shop_popup';
        }else{
            type = 'sys_product_version_qb_popup';
        }
        if(param != '0'){
            self.borrowing_investment_type = false;
        }
        var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        			self.addTypeVersionList = data.data.resp.result[0].Version;
        			//self.addPositionsList = data.data.resp.result[0].Position;
        			var obj = new Object();
  				var list = new Array();
  				obj.value = "";
  				obj.label ="请选择";
  				list[0]=obj;
  				self.addPositionsList =list;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });

        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();


    };
    
    // 登陆选择
    self.editLoginStatus = function(param){
    		if(param==''){
    			alert("非法操作!");
    			return false;
    		}
    		if(param=='0' || param=='2'){
    			$("#editall").attr('disabled','disabled');
    			$('#editall').prop("checked",true);
    			$("#editwhite").attr('disabled','disabled');
    			$('#editwhite').prop("checked",false);
            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#selectaddwhiteId").val("");  
            $("#editblack").attr('disabled','disabled');
            $('#editblack').prop("checked",false);
            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
            $("#selectaddblackId").val(""); 
	            
    		}else{
    			$("#editall").removeAttr("disabled");  
                if($('#editall').is(':checked')){
                    $("#editwhite").attr('disabled','disabled');
                    $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
                    $("#editselectaddwhiteId").val("0");
                    $("#editblack").attr('disabled','disabled');
                    $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
                    $("#editselectaddblackId").val("0");
                }else{
                    //$("#editall").removeAttr("disabled");
                    $('#editall').prop("checked",true);
                    $("#editwhite").removeAttr('disabled','disabled');
                    $("#selectaddwhiteId").removeAttr("disabled");
                    $("#editblack").removeAttr('disabled','disabled');
                    $("#editselectaddblackId").removeAttr("disabled");
                }
    		}

        //黑白名单操作
        self.updateScene.whiteMemberListName= "NO_RULE"
        self.updateScene.whiteId=null;
        self.strategyReloadUpdate();
        $('#userNameLikeSearchUpdate').hide();


        self.updateScene.blackMemberListName= "NO_RULE"
        self.updateScene.blackId=null;
        self.blackStrategyReloadUpdate();
        $('#userNameLikeBlackSearchUpdate').hide();

   	 	self.editPostionCheck();
    }
    
 // 登陆选择
    self.editPostionCheck = function(editproductChannel,versions,editLoginStatus){
    		if(!editproductChannel){
    			editproductChannel = $("#editproductChannel").val();//渠道
    		}
    		
    		if(!versions){
    			versions = "";// 版本
    	          $('.updateVersionCheckbox').each(function() {
    	              if (this.checked == true) {
    	                  versions += $(this).val() + ",";
    	              }
    	          });
    		}
          if(!versions){
             // $("#addLoginStatus0").prop("checked",false);
  	  		//$("#addLoginStatus1").prop("checked",false);
              return;
          }
          // 登陆状态
         // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
          if(!editLoginStatus){
        	  	editLoginStatus =self.updateScene.loginStatus;
          }
          
          if(editLoginStatus==null){
              alert("请选择弹登陆状态");
              return;
          }
          //var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_popup&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
          var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_popup&productVersion="+versions+"&productChannel="+editproductChannel+"&loginStatus="+editLoginStatus;
          
          $http({
              method: 'GET',
              url: url,
          }).then(function successCallback(data) {
        	  			if(data.data.resp.result.length==0){
        	  				//self.addPositionsList = data.data.resp.result;
        	  				var obj = new Object();
        	  				var list = new Array();
        	  				obj.value = "0";
        	  				obj.label ="请选择";
        	  				list[0]=obj;
        	  				//self.addPositionsList =list;
        	  				self.editPositionsList =list;
        	  			}else{
        	  				//self.addPositionsList = data.data.resp.result;
        	  				self.editPositionsList = data.data.resp.result;
        	  				self.updateScene.positions = data.data.resp.result[0].value;
        	  				//updateScene.productVersion
        	  			}
        	  				
          }, function errorCallback(response) {
              // 请求失败执行代码
              alert("获取弹窗位置失败了....");
          });
    }
    
    // 选择版本
    self.addversionCheckbox=function(){
//    	$("#addLoginStatus0").prop('checked', false);
//    	$("#addLoginStatus1").prop('checked', false);
//		$("#addLoginStatus0").removeAttr("checked");
//  		$("#addLoginStatus1").removeAttr("checked");
    		self.addPostionCheck();
    }
    
    
     self.addpostion=function(){
    	 	var versions = "";
         $('.versionCheckbox').each(function() {
             if (this.checked == true) {
                 versions += $(this).val() + ",";
             }
         });
         if(!versions){
             alert("请选择产品版本");
             return;
         }
     }
     self.changeScene=function(scene){
    	 if(scene=='3'){
    		 self.add.sceneTwo = '3';
    	 } else {
    		 self.add.sceneTwo = '';
    	 }
     }
     self.editChangeScene=function(scene){
    	 if(scene=='3'){
    		 self.updateScene.sceneTwo = '3';
    	 } else {
    		 self.updateScene.sceneTwo = '';
    	 }
     }
    
     // 登陆选择
     self.loginStatus = {};
     self.addLoginStatus = function(param){
	    	 if(param=='0' || param=='2'){
	    		$scope.loginStatus = param;
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
			$scope.loginStatus = 1;
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

         //黑白名单操作
         self.strategyReload();
         $('#userNameLikeSearch').hide();
         self.blackStrategyReload();
         $('#userNameLikeBlackSearch').hide();

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
          if(addLoginStatus==null){
              //alert("请选择弹登陆状态");
              return;
          }
          
          var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_popup&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
          $http({
              method: 'GET',
              url: url,
          }).then(function successCallback(data) {
        	  			if(data.data.resp.result.length==0){
        	  				//self.addPositionsList = data.data.resp.result;
        	  				var obj = new Object();
        	  				var list = new Array();
        	  				obj.value = "";
        	  				obj.label ="--请选择--";
        	  				list[0]=obj;
        	  				self.addPositionsList =list;
        	  				self.add.positions =list[0].value;
        	  			}else{
        	  				self.addPositionsList = data.data.resp.result;
        	  				self.add.positions =data.data.resp.result[0].value;
        	  			}
        	  				
          }, function errorCallback(response) {
              // 请求失败执行代码
              alert("获取弹框位置失败了....");
          });
          
          
    	
    }
    
    
    //确认添加弹框
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
        
        var label = $("#addpositions").find("option:selected").text();  //获取Select选择的Text
        if(label=="请选择"){
            alert("对应的版本和登陆状态下弹框位置不存在，请重新选择");
            return;
        }
        if(self.add.type==""||self.add.type==null){
            alert("请选择弹框类型");
            return;
        }
        
        // 登陆状态
        //var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
        var addLoginStatus =self.add.loginStatus;
        if(!addLoginStatus){
            alert("请选择弹登陆状态");
            return;
        }
        self.add.loginStatus=addLoginStatus;
        
        
        if(!versions){
            alert("产品版本不能为空");
            return;
        }else{
            self.add.productVersion = versions;
        }
        if(!self.add.positions){
            alert("弹框位置不能为空");
            return ;
        }
        self.add.positions=self.position;
       var addpositionsText = $("#addpositions").find("option:selected").text();
        self.add.positionName =addpositionsText;
        
        
        self.add.imageUrl=$('#fileUrl').val()
        if(!self.add.imageUrl){
            alert("弹框图片不能为空");
            return;
        }
        if(self.add.productChannel=='0' && (self.position=='3')){
            if(self.add.sceneOne=="" || self.add.sceneOne==null || self.add.sceneOne==undefined){
                alert("请选择1级场景");
                return;
            }
            if(self.add.sceneTwo=="" || self.add.sceneTwo==null || self.add.sceneTwo==undefined){
                alert("请选择2级场景");
                return;
            }
        }
        if(self.add.productChannel=='0' && (self.position=='4')){
            if(self.add.sceneOne=="" || self.add.sceneOne==null || self.add.sceneOne==undefined){
                alert("从选项不能为空");
                return;
            }
            if(self.add.sceneTwo=="" || self.add.sceneTwo==null || self.add.sceneTwo==undefined){
                alert("续期至选项不能为空");
                return;
            }
        }
        if(self.add.productChannel=='0' || self.add.productChannel=='2'){
            if(self.redirectType0=="" || self.redirectType0==null || self.redirectType0==undefined){
                alert("请选择跳转类型");
                return;
            }
            if(self.redirectType0 == '2' && !self.add.redirectUrl){
                alert("跳转链接不能为空")
                return;
            }
        }
        if (self.add.productChannel == '1' || self.add.productChannel == '6') {
        	if(self.add.redirectType==""){
        		alert("请选择跳转类型");
                return;
        	}
            if(!self.add.redirectUrl){
                alert("跳转链接不能为空");
                return;
            }
        }

        if(self.add.productChannel=='0') {
         if(self.redirectType0 == 3) {
            if (self.add.pageOne == null || self.add.pageOne == "" || self.add.pageOne == undefined) {
                alert("页面类型不能为空");
                return;
            }
            if (self.add.pageTwo == null || self.add.pageTwo == "" || self.add.pageTwo == undefined) {
                alert("跳转页面不能为空");
                return;
            }
          }
        }
        // 弹框策略
       /** var strategytype = $("input[name='strategy_type']:checked").val();//获取选中项的值
        if(!strategytype){
            alert("请选择弹框策略");
            return;
        }
        self.add.strategyType=strategytype;
        if(strategytype=='0'&&self.add.showTimes==null){
            alert("弹框次数不能空");
            return;
        }**/
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
        if(self.add.productChannel=='0'){
            self.add.redirectType = self.redirectType0;
            self.add.positions = self.position;
        }
       var url = globalConfig.basePath+"/appConfig/Popup/addPopup";
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
               // self.reset();
               // self.loading();
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    }

    /**
     *是否显示类型
     */
    self.onShowValueType = function(position){
        debugger
        if(self.add.productChannel=='0'&&(position=="3" || position=="4" || position=="1" || position=="2")){
            var type=position=="3"?"wk_loan_scenario_one":"wk_continue_invest_scenario_one";
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.sceneOneDictList = data.resp.result;
            })
            self.borrowing_investment_type=true;
        }else{
            self.borrowing_investment_type=false;
        }
    };

    //添加弹窗 根据一级场景查询二级场景
    $scope.selectSceneOneByRDict = function(v){
        var type;
        if(self.position == "3"){
            type = "wk_loan_scenario_two";
            //v = v=="ONE_WK_BORROW_SUCCES_ALL"?"":v;
        }
        if(self.position == "4"){
            type = "wk_continue_invest_scenario_two";
            //v = v=="ONE_WK_INVEST_SUCCES_ALL"?"":v;
        }
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.sceneTwoDictList = data.resp.result;
            if($scope.sceneTwoDictList.length=='1'){
                self.add.sceneTwo=data.resp.result[0].value;
            }else{
                self.add.sceneTwo=data.resp.result[0].value;
            }
        })

    }

    $scope.selctPageOne =function(){
        if(self.redirectType0=='3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }

    }

    //修改弹框-
    $scope.selctPageOne2 =function(){
        if(self.u_redirectType=='3'){
            var type="wk_protogenesis_page_one"
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList2 = data.resp.result;
            })
        }

    }

    //修改弹框 根据一级页面查询二级页面
    $scope.selectPageOneByRDict2 = function(v){
        var type = "wk_protogenesis_page_two";
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.rPositionDictList2 = data.resp.result;
            if($scope.rPositionDictList2.length=='1'){
                $scope.updateScene.pageTwo=data.resp.result[0].value;
            }else{
                $scope.updateScene.pageTwo=data.resp.result[0].value;
            }
        })

    }

    //添加弹框 根据一级页面查询二级页面
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


    /**
     *是否显示场景-修改弹框
     */
    self.onShowValueType2 = function(positions){
        console.log(positions)
        if(self.updateScene.productChannel == '0' && (positions=="3" || positions=="4")){
            var type=positions=="3"?"wk_loan_scenario_one":"wk_continue_invest_scenario_one";
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.sceneOneDictList2 = data.resp.result;
            })
            self.borrowing_investment_type2=true;
        }else{
            self.borrowing_investment_type2=false;
        }
    };

    //修改弹框 根据一级场景查询二级场景
    $scope.selectSceneOneByRDict2 = function(v){
        var type;
        if(self.updateScene.positions == "3"){
            type = "wk_loan_scenario_two";
        }
        if(self.updateScene.positions == "4"){
            type = "wk_continue_invest_scenario_two";
        }
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+v
        ).success(function(data) {
            $scope.sceneTwoDictList2 = data.resp.result;
            if($scope.sceneTwoDictList2.length=='1'){
                self.updateScene.sceneTwo=data.resp.result[0].value;
            }else{
                self.updateScene.sceneTwo=data.resp.result[0].value;
            }
        })

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
            // $("#selectaddwhiteId").val("");
            $("#black").attr('disabled','disabled');
            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
            // $("#selectaddblackId").val("");

            self.add.whiteMemberListName= "NO_RULE"
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.add.blackMemberListName= "NO_RULE"
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }else {
            $("#white").removeAttr('disabled','disabled');
            $("#selectaddwhiteId").removeAttr("disabled");  
            $("#black").removeAttr('disabled','disabled');
            $("#selectaddblackId").removeAttr("disabled");

            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }
    }

    //白名单选中事件 type 0 添加 1修改
    self.whiteClick = function(type){
        if(type==0){
            if(!$("#white").prop("checked")){
                self.strategyReload();
                $('#userNameLikeSearch').hide();
            }
        }else{
            if(!$("#editwhite").prop("checked")){
                self.updateScene.whiteMemberListName= "NO_RULE"
                self.updateScene.whiteId=null;
                self.strategyReloadUpdate();
                $('#userNameLikeSearchUpdate').hide();
            }
        }
    }
    //黑名单选中事件 type 0 添加 1修改
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
    
 //************************弹框查看**************************   
    //查看
    self.check = function(query){

        var isContinue;
        if(query.positions == '4'){
            isContinue = "1";
        }
        if(query.positions == '3'){
            isContinue = "0";
        }
        var param = {
            'isContinue':isContinue,
            'sceneOne':query.sceneOne,
            'sceneTwo':query.sceneTwo,
            'pageOne':query.pageOne,
            'pageTwo':query.pageTwo
        }
        if(query.productChannel == 0){
            var url = globalConfig.basePath+"/rDict/getLabelByValue";
            $http({
                method: 'GET',
                url: url,
                cache:false,
                params:param,
            }).then(function successCallback(data) {
                var d = data.data.resp;
                self.lableSceneOne = d.lableSceneOne+'';
                self.lableSceneTwo = d.lableSceneTwo+'';
                self.lablePageOne = d.lablePageOne;
                self.lablePageTwo = d.lablePageTwo;
                // query.sceneOne = d.lableSceneOne+'';
                // query.sceneTwo = d.lableSceneTwo+'';
            }, function errorCallback(response) {
                alert("获取版本列表失败了....");
            });
        }
        self.showPopup=query;
    	
        $('#showPopupCheck').show();
        
    }   
    
    
    self.checkOKAndNO=function(){
    		$('#showPopupCheck').hide();
    }
    
 
//************************修改*****************************
   	self.isSelected = function(id){
   		if(self.continuationTypeInfo){
   			var versions =self.continuationTypeInfo.split(",");
   	   		for(var i=0;i<versions.length;i++){
   	   			if(id.length==versions[i].length && versions[i].indexOf(id)>=0){
   	   	   			return true;
   	   	   		}
   	   		}
   		}
   		return false;
 	 }
    // 选择版本
    self.editversionCheckbox=function(){
    		self.editPostionCheck();
    }

    self.update = function(query){
    		//self.editPostionCheck(query.productChannel,query.productVersion,query.loginStatus);// 获取位置
        self.isUpdateRoster = 'N';
        $('#showUpdate').show();
	 	self.updateScene={};
	 	$("#editselectaddwhiteId").val("");
	 	$("#editselectaddblackId").val("");
	 	$('#editall').prop("checked",false);//默认全部不选择
	 	$("#editwhite").attr("checked",false);
		$("#editblack").attr("checked",false);
		self.continuationTypeInfo="";
		self.continuationTypeInfo=query.productVersion;
	 	self.updateScene={};
	 	query.productChannel=query.productChannel+"";
	 	query.loginStatus = query.loginStatus+"";
	 	query.auditPerson="";
	 	query.sceneOne = query.sceneOne+"";
	 	query.sceneTwo = query.sceneTwo+"";
	 	self.u_redirectType = query.redirectType+"";
        if(query.auditStatus == '1'){
            $("#sceneDisableId1").attr("disabled","disabled");
            $("#sceneDisableId2").attr("disabled","disabled");
            $("#editpositions").attr("disabled","disabled");
        }else{
            $("#sceneDisableId1").attr("disabled",false);
            $("#sceneDisableId2").attr("disabled",false);
            $("#editpositions").attr("disabled",false);
        }
        debugger
        if(query.productChannel == 0 && (query.positions=="3" || query.positions=="4" || query.positions=="1" || query.positions=="2")){
            self.borrowing_investment_type2 = true;
        }else {
            self.borrowing_investment_type2 = false;
        }
        console.log(query)
        //获取一二级场景下拉框
        if(query.productChannel == 0){
            self.getSceneAndPageListByParam(query.positions,query.sceneOne,query.sceneTwo,query.redirectType,query.pageOne,query.pageTwo);

        }
        //获取一二级原生页面下拉框
        if(query.redirectType == '3'){
            self.loadPageData(query.redirectType,query.pageOne,query.pageTwo);
        }
        self.u_redirectType = query.redirectType+'';

        $('#editall').prop("checked",false);//默认全部不选择
        $("#editwhite").attr("checked",false);
        $("#editblack").attr("checked",false);
        $("#editall").removeAttr("disabled");
		if(query.loginStatus=='0' || query.loginStatus=='2'){
			$("#editall").attr('disabled','disabled');
 			$('#editall').prop("checked",true);
		}
/**		var strategyType  =query.strategyType;
		if(strategyType==0)
			$("#updatestrategytype0").prop("checked",true);
		else
			$("#updatestrategytype1").prop("checked",true);**/
		var sequenceId = query.sequenceId;
	        query.valid = query.valid+"";
	        query.whiteId = query.whiteId+"";
	        query.blackId = query.blackId+"";
	        self.updateScene=angular.copy(query);
	        if(query.showType==0){
                $('#editall').prop("checked",true);
	            $('#editwhite').prop("checked",false);
	            $('#editblack').prop("checked",false);
	            $("#editwhite").attr('disabled','disabled');
	            // $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
	            // $("#editselectaddwhiteId").val("0");
	            $("#editblack").attr('disabled','disabled');
	            // $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
	            // $("#editselectaddblackId").val("0");

                self.strategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.whiteMemberListName=query.whiteMemberListName;
                    self.updateScene.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();
                },500)
                self.blackStrategyReloadUpdate();
                setTimeout(function () {
                    self.updateScene.blackMemberListName=query.blackMemberListName;
                    self.updateScene.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();
                },500)
		    	 }else if(query.showType==1){
		             $('#editall').prop("checked",false);
		    		 $('#editwhite').prop("checked",true);
		             $('#editblack').prop("checked",false);
                    $("#editwhite").removeAttr("disabled");
                    $("#editblack").removeAttr("disabled");
                //修改名单那类型查询
                    self.strategyReloadUpdate();
                    setTimeout(function () {
                        self.updateScene.whiteMemberListName=query.whiteMemberListName;
                        self.updateScene.whiteId = query.whiteId
                    },500)

                    self.blackStrategyReloadUpdate();
                    setTimeout(function () {
                        self.updateScene.blackMemberListName=query.blackMemberListName;
                        self.updateScene.blackId = null;
                        $('#userNameLikeBlackSearchUpdate').hide();
                    },500)
		    	 }else if(query.showType==2){
		             $('#editall').prop("checked",false);
		             $('#editwhite').prop("checked",false);
		    		 $('#editblack').prop("checked",true);
                    $("#editwhite").removeAttr("disabled");
                    $("#editblack").removeAttr("disabled");
                    self.strategyReloadUpdate();
                    setTimeout(function () {
                        self.updateScene.whiteMemberListName=query.whiteMemberListName;
                        self.updateScene.whiteId = null;
                        $('#userNameLikeSearchUpdate').hide();
                    },500)


                    self.blackStrategyReloadUpdate();
                    setTimeout(function () {
                        self.updateScene.blackMemberListName=query.blackMemberListName;
                        self.updateScene.blackId = query.blackId;
                    },500)
		    	 }else if(query.showType==3){
                     $('#editall').prop("checked",false);
		    		 $('#editblack').prop("checked",true);
                     $('#editwhite').prop("checked",true);

                    $("#editwhite").removeAttr("disabled");
                    $("#editblack").removeAttr("disabled");
                    self.strategyReloadUpdate();
                    setTimeout(function () {
                        self.updateScene.whiteMemberListName=query.whiteMemberListName;
                        self.updateScene.whiteId = query.whiteId
                    },500)
                    self.blackStrategyReloadUpdate();
                    setTimeout(function () {
                        self.updateScene.blackMemberListName=query.blackMemberListName;
                        self.updateScene.blackId = query.blackId;
                    },500)

            }
        //修改禁用名单
        $("#editall").attr('disabled','disabled');
        $("#editwhite").attr("disabled",'disabled');
        $("#editblack").attr("disabled",'disabled');
        //展示黑白名单数量
        if($scope.updateScene.whiteId != null && $scope.updateScene.whiteId != ''
            && $scope.updateScene.whiteId != undefined && $scope.updateScene.whiteId != 0){
            $scope.findChannelGroupCount($scope.updateScene.productChannel,$scope.updateScene.whiteId);
        }
        if($scope.updateScene.blackId != null && $scope.updateScene.blackId != ''
            && $scope.updateScene.blackId != undefined && $scope.updateScene.blackId != 0){
            $scope.findBlackChannelGroupCount($scope.updateScene.productChannel,$scope.updateScene.blackId);
        }
	       // self.editPostionCheck(query.productChannel,query.productVersion,query.loginStatus);// 获取位置
	      var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_popup&productVersion="+query.productVersion+"&productChannel="+query.productChannel+"&loginStatus="+query.loginStatus;
	      $http({
              method: 'GET',
              url: url,
          }).then(function successCallback(data) {
        	  			if(data.data.resp.result.length==0){
        	  				var obj = new Object();
        	  				var list = new Array();
        	  				obj.value = "0";
        	  				obj.label ="请选择";
        	  				list[0]=obj;
        	  				self.editPositionsList =list;
        	  				self.updateScene = self.updateScene;
        	  			}else{
        	  				self.editPositionsList = data.data.resp.result;
        	  				self.updateScene = self.updateScene;
        	  			}

          }, function errorCallback(response) {
              // 请求失败执行代码
              alert("获取弹窗位置失败了....");
          });

	}

    self.loadPageData = function(redirectType,pageOne,pageTwo){
        //页面
        if(redirectType=='3'){
            var type="wk_protogenesis_page_one"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList2 = data.resp.result;
            })
        }

        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type=wk_protogenesis_page_two&value="+pageOne
        ).success(function(data) {
            $scope.rPositionDictList2 = data.resp.result;
            if ($scope.rPositionDictList2.length == '1') {
                self.updateScene.pageTwo = data.resp.result[0].value;
            } else {
                self.updateScene.pageTwo = data.resp.result[0].value;
            }
            self.updateScene.pageTwo = pageTwo;
        })
    }
    //获取一二级场景、原生页面下拉框
    self.getSceneAndPageListByParam = function(positions,sceneOne,sceneTwo,redirectType,pageOne,pageTwo){
        //场景
        var type=positions=="3"?"wk_loan_scenario_one":"wk_continue_invest_scenario_one";
        $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
        ).success(function(data) {
            $scope.sceneOneDictList2 = data.resp.result;
            self.uSceneOne = sceneOne+'';
        })
        var typeTwo;
        if(positions == "3"){
            typeTwo = "wk_loan_scenario_two";
        }
        if(positions == "4"){
            typeTwo = "wk_continue_invest_scenario_two";
        }
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+typeTwo+"&value="+sceneOne
    ).success(function(data) {
            $scope.sceneTwoDictList2 = data.resp.result;
            if(data.resp.result!=null && data.resp.result[0]!=null && data.resp.result[0]!=''){
                if ($scope.sceneTwoDictList2.length == '1') {
                    self.updateScene.sceneTwo = data.resp.result[0].value;
                } else {
                    self.updateScene.sceneTwo = data.resp.result[0].value;
                }
            }

            self.updateScene.sceneTwo = sceneTwo+'';
        })


    }

    self.getEditTypeVersionList = function(param){
		self.updateScene.positions = '0';
		var parentid;
	    parentid=$('#editproductChannel').val();
	    if(parentid)
	    		parentid=param;
	    var type;
	    if(param==0){
	        type = 'sys_product_version_wk_popup';
	    }else if(param==2){
	        type = 'sys_product_version_wx_popup';
        } else if (param == 6) {
            type = 'sys_product_version_shop_popup';
        }else{
	        type = 'sys_product_version_qb_popup';
	    }
	    var url = globalConfig.basePath+"/rDict/getVersionAndPosition?positiontype=sys_popup_position&versiontype="+type+"&parentid="+parentid;
	    $.ajax({
		   type: "GET",
		   dataType: 'json',
		   async:false,
		  // data:{id:id},
		   //data:redJson,
		   url: url ,
		   success: function(data){
			   console.log(data);
			   if(data.resp.result[0].Version.length>0){
        			self.typeVersionList = data.resp.result[0].Version;
        			
        		if(data.resp.result[0].Position.length>0){
        			self.editPositionsList = data.resp.result[0].Position;
        			//console.log(query);
        		} }
		   }
		});
};
   
    
    //添加全部选中事件
    self.editAll = function(){
        $("#upWhite").attr("checked",false);
        $("#upBlack").attr("checked",false);
        if($('#editall').is(':checked')){
            $("#upWhite").attr('disabled','disabled');
            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
            // $("#editselectaddwhiteId").val("0");
            $("#upBlack").attr('disabled','disabled');
            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
            // $("#editselectaddblackId").val("0");

            //黑白名单操作
            self.updateScene.whiteMemberListName= "NO_RULE"
            self.updateScene.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();


            self.updateScene.blackMemberListName= "NO_RULE"
            self.updateScene.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
        }else {
            $("#upWhite").removeAttr('disabled','disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");  
            $("#upBlack").removeAttr('disabled','disabled');
            $("#editselectaddblackId").removeAttr("disabled");  
        }
    }
    
    //确认修改
    self.confirmUpdate = function(){
    	if(self.updateScene.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        var versions = "";
        $('.updateVersionCheckbox').each(function() {
            if (this.checked == true) {
                versions += $(this).val() + ",";
            }
        });
        if(versions==null || versions==""){
            alert("产品版本不能为空");
            return;
        }else{
            self.updateScene.productVersion = versions;
        }
        
        var label = $("#editpositions").find("option:selected").text();  //获取Select选择的Text

        if(label=="请选择"){
            alert("对应的版本和登陆状态下banner位置不存在，请重新选择");
            return;
        }
        self.label=label;
        if(self.label){
          self.updateScene.positionName =label;
        }

        // 登陆状态
       // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
        var addLoginStatus =self.updateScene.loginStatus;
        if(addLoginStatus==null){
            alert("请选择banner登陆状态");
            return;
        }
        self.add.loginStatus=addLoginStatus;
        self.updateScene.imageUrl = $('#fileUrl1').val();
        if(!self.updateScene.imageUrl){
            alert("请选择上传弹框图片");
            return;
        }
        if(self.updateScene.productChannel==1&&self.updateScene.positions==3){
        	if(self.updateScene.sceneOne==""){
        		alert("请选择一级场景");
                return;
        	}
        	if(self.updateScene.sceneTwo==""){
        		alert("请选择二级场景");
                return;
        	}
        }
        if(self.updateScene.productChannel== '0' || self.updateScene.productChannel=='2'){
            var sceneDisableId1 = $("#sceneDisableId1").val();
            var sceneDisableId2 = $("#sceneDisableId2").val();
            if(self.updateScene.positions=='3'){
                if(!sceneDisableId1){
                    alert("请选择1级场景");
                    return;
                }
                if(!sceneDisableId2){
                    alert("请选择2级场景");
                    return;
                }
            }
            if(self.updateScene.positions=='4'){
                if(!sceneDisableId1){
                    alert("从选项不能为空");
                    return;
                }
                if(!sceneDisableId2){
                    alert("续期至选项不能为空");
                    return;
                }
            }
            if(self.updateScene.productChannel== '0') {
                if (self.u_redirectType == '3' && !self.updateScene.pageOne) {
                    alert("页面类型不能为空");
                    return;
                }
                if (self.u_redirectType == '3' && !self.updateScene.pageTwo) {
                    alert("跳转页面不能为空");
                    return;
                }
            }

        }
        if(self.updateScene.productChannel=='1'){
        	if(self.updateScene.redirectType==""){
        		alert("请选择跳转类型");
                return;
        	}
        }
        
        if(self.u_redirectType!='3'&&!self.updateScene.redirectUrl&&!(self.updateScene.productChannel=='1'&&self.updateScene.redirectType=='1')){
            alert("跳转链接不能为空");
            return;
        }
        
        // 弹框策略
       /** var strategytype = $("input[name='updatestrategy_type']:checked").val();//获取选中项的值
        if(strategytype==null){
            alert("请选择弹框策略");
            return;
        }
        self.updateScene.strategyType=strategytype;
        if(strategytype=='0'&&self.updateScene.showTimes==null){
            alert("弹框次数不能空");
            return;
        }
        **/
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
                self.updateScene.showType = 3;
            }

            if (!whiteId && !blackId){
                self.updateScene.showType = 0;
            }
            if (whiteId && whiteId != 0 && !blackId){
                self.updateScene.showType = 1;
            }
            if (blackId && blackId!=0 && !whiteId){
                self.updateScene.showType = 2;
            }
            if (self.updateScene.whiteMemberListName != 'NO_RULE'){
                self.updateScene.whiteTrue=true;
            }

            if (self.updateScene.blackMemberListName != 'NO_RULE'){
                self.updateScene.blackTrue = true;
            }


            if(self.updateScene.whiteTrue == true){
                var whiteId =  $('#memberIdUpdate').val();
                if(whiteId==null || whiteId=="" || whiteId=="0" || whiteId.indexOf("?")!=-1){
                    alert('请选择具体白名单!');
                    return;
                }else{
                    self.updateScene.whiteId = whiteId;
                    self.updateScene.whiteName = $('#memberIdUpdate option:selected').text();
                }
            }
            if(self.updateScene.blackTrue == true){
                var blackId =  $('#memberBlackIdUpdate').val();
                if(blackId == null || blackId=="" || blackId=="0"|| blackId.indexOf("?")!=-1){
                    alert('请选择具体黑名单!');
                    return;
                }else{
                    self.updateScene.blackId = blackId;
                    self.updateScene.blackName = $('#memberBlackIdUpdate option:selected').text();
                }
            }
        }


        /*$('.updateCheckbox').each(function () {
            if(this.checked == true){
                self.updateScene.showType = $(this).val();
            }
        })
        var all = $("#editall").prop("checked");
        var white = $("#editwhite").prop("checked");
        var black = $("#editblack").prop("checked");
        if(all){
     	   self.updateScene.showType = 0;
        }else{
        	// var editselectaddwhiteId = $("#editselectaddwhiteId").val();
        	// var editselectaddblackId = $("#editselectaddblackId").val();
            var whiteId =  $('#memberIdUpdate').val();
            var blackId =  $('#memberBlackIdUpdate').val();
            if(white&&black) {
                self.updateScene.showType = 3;
                if(whiteId == null || whiteId=='' || whiteId.indexOf("?")!=-1) {
                    alert("请选择白名单列表");
                    return;
                }else{
                    self.updateScene.whiteId = whiteId;
                }
                if(blackId == null || blackId=="" || blackId.indexOf("?")!=-1) {
                    alert("请选择黑名单列表");
                    return;
                }else{
                    self.updateScene.blackId = blackId;
                }
            }else{
                if(white){
                    self.updateScene.showType = 1;
                    if(whiteId == null || whiteId=='' || whiteId.indexOf("?")!=-1) {
                        alert("请选择白名单列表");
                        return;
                    }else{
                        self.updateScene.whiteId = whiteId;
                    }
                }else if(black){
                    self.updateScene.showType = 2;
                    if(blackId == null || blackId=="" || blackId.indexOf("?")!=-1) {
                        alert("请选择黑名单列表");
                        return;
                    }else{
                        self.updateScene.whiteId = 0;
                        self.updateScene.blackId = blackId;
                    }
                }else{
                    alert('请选择展示人群');
                    return;
                }
            }
        }*/
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
        if(self.updateScene.productChannel=='0'){
            self.updateScene.redirectType = self.u_redirectType+'';
        }
       // self.updateScene.sceneOne  = self.uSceneOne;
        var url = globalConfig.basePath+"/appConfig/Popup/editPopup";
        console.info(self.updateScene);
        $http.post(url,self.updateScene).then(
            function(data){
                alert(data.data.message);
                $('#showUpdate').hide();
                self.updateScene = {};
               // self.reset();
               // self.loading();
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    }
    
    
    //取消修改
    self.updateCancel = function(){
        $('#showUpdate').hide();
        self.updateScene = {};
       //self.reset();
        //self.loading();
        self.querySplashConfigList(1);
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
    self.queryEditWhiteAndBlack();    
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
                alert("请在查询条件中选择弹框位置");
                return;
            }
//            if(!searchLoginStatus){
//                alert("请在查询条件中选择登陆状态");
//                return;
//            }
            var searchLoginStatus=$("#searchLoginStatus").val();
//            if(searchLoginStatus=='0'){
//         		alert("只有已登陆状态才可以进行排序。");
//             return;
//         }
            if(searchproductChannel==0){
            	var type="";
            	if($scope.search.positions==0){
            		type="sys_wk_popup_value_0";	
            	}else if($scope.search.positions==3){
            		type="sys_wk_popup_value_1";
            	}else if($scope.search.positions==4){
            		type="sys_wk_popup_value_4";
            	}else if($scope.search.positions==5){
            		type="sys_wk_popup_value_5";
            	}
            	$scope.getShowValue(type);
            }
            
	        $('#showPriority').show();
	        var url = globalConfig.basePath+"/appConfig/Popup/selectSort?productChannel="+searchproductChannel+"&productVersion="+searchproductVersion+"&positions="+searchpositions+"&loginStatus="+searchLoginStatus;
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
                     var move0 = self.strotList[me];// 下一个弹框
                     move0.priority=Number($(this).val())+Number(1);
                     
                     var move1 = self.strotList[me+1];// 下一个弹框
                     move1.priority=Number($(this).val());
                     self.strotList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                     self.strotList[me] = move1;// 下一个移动到当前的位置
                    
                 }
            }
        })

    }
    
    
    self.moveCommit = function(){
        var url = globalConfig.basePath+"/appConfig/Popup/moveCommit";
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
    //生效失效弹框
    self.start = function(id,valid){
        $('#showStart').show();
        self.start.startValid=valid;
        self.start.id = id;
    }
    //确定失效生效弹框
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
             self.reset();
            self.loading();
            $('#showStart').hide();
           
        }, function errorCallback(response) {
            alert("失败....");
        });
        self.querySplashConfigList(1);
    }

    //取消生效失效弹框
    self.cancelStart = function(){
        $('#showStart').hide();
    }
    
    //默认查询
    self.loading = function(){
        //self.search.productChannel = "";
        self.search.productVersion = "";
        self.search.pageSize = "5";
        self.querySplashConfigList(1);
    }
   // self.loading();
   // self.getTypeVersionList(0);
    self.getTypeVersionList(0,"",1);
    
    
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
        var url = globalConfig.basePath+"/appConfig/Popup/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
            	 $('.take-start-box').hide();
            	alert("操作成功");
            	$scope.querySplashConfigList(1);
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
        if(self.effectRecord.valid==1){
			self.effectRecord.valid=0;
		}else{
			self.effectRecord.valid=1;
		}
    		var url = globalConfig.basePath+"/appConfig/Popup/effectPopup";
        $http.post(url,self.effectRecord).then( function(data){
        	 	$('#takeEffect').hide();
            	if(data.data.code == '000'){
            		alert(data.data.message);
            	}else if(data.data.code == '009'){
                    alert(data.data.message);
                }else if(data.data.code == '008'){
                    alert(data.data.message);
                }
            $scope.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    		
    	
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
        }else if(self.add.productChannel==1){
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
        }else if(self.add.productChannel==1){
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
                    self.updateScene.strategyList = data.data.resp;
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
                    self.updateScene.blackStrategyList = data.data.resp;
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

    //region 修改白名单查询
    /**
     * 用户策略类型初始化
     */
    self.strategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.updateScene.strategyList = data.data.resp;
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
        if(self.updateScene.productChannel==0 ||self.updateScene.productChannel==2){
            channelCode='WK';
        }else if(self.updateScene.productChannel==1){
            channelCode='QB';
        }else if(self.updateScene.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.updateScene.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterLikeSearch').hide();
            self.updateScene.whiteId='0';
            $('#memberIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.updateScene.whiteMemberListName
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
                    self.updateScene.blackStrategyList = data.data.resp;
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
        if(self.updateScene.productChannel==0 ||self.updateScene.productChannel==2){
            channelCode='WK';
        }else if(self.updateScene.productChannel==1){
            channelCode='QB';
        }else if(self.updateScene.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.updateScene.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.updateScene.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.updateScene.blackMemberListName
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






    // banner修改，修改名单
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
        self.beforeWhiteMemberListName = self.updateScene.whiteMemberListName;
        self.beforeBlackMemberListName = self.updateScene.blackMemberListName;
        self.beforeWhiteId = self.updateScene.whiteId;
        self.beforeBlackId = self.updateScene.blackId;
        if (self.updateScene.whiteName && self.updateScene.whiteName != ''){
            self.beforeWhiteName = self.updateScene.whiteName;
        }
        if (self.updateScene.blackName && self.updateScene.blackName != ''){
            self.beforeBlackName = self.updateScene.blackName;
        }
        self.updateScene.whiteId = '';
        self.updateScene.blackId = '';
        self.updateScene.blackMemberListName = 'NO_RULE';
        self.updateScene.whiteMemberListName = 'NO_RULE';

        $('#upUserRosterLikeSearch').hide();

        $('#upUserRosterBlackLikeSearch').hide();

    }

    //点击白名单复选框
    self.upWhiteClick = function () {
        if(!$("#upWhite").prop("checked")){
            self.updateScene.whiteMemberListName= "NO_RULE"
            self.updateScene.whiteId=null;
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




}]);
   



