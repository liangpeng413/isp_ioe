'use strict';// 严谨模式
var App = angular.module('handpickWelfareApp', [], angular.noop);
App.controller('handpickWelfareController',['$scope','$http', function($scope,$http) {
	var self = $scope;
    self.search = {};// 查询
    self.search.productChannel='1';
    self.add={};// 添加
    self.updatePopup={};// 修改
    self.showPopup={};// 查看
    self.productList=[];
    self.productListRight=[];
    self.initProductList={};
    self.initTypeleve={};
    self.productsList=[];//适用产品列表
    self.typeleveList=[];
    self.typeleve=[];
    // 全局变量
    self.typeleve00=[];
    self.typeleve01=[];
    self.typeleve10=[];
    self.typeleve11=[];
    self.productList00=[];
    self.productList01=[];
    self.productList10=[];
    self.productList11=[];
    self.continuationTypeInfo="";
    self.detailProductList=[];
    self.vipList=[];
    self.infoAarry = new Array();
    self.addContinuationTypeInfo="";
    self.search.channel="1";
    self.search.effectStatus="";
    self.add.skipType="4";
    self.add.channel="1";
  /*  self.privilegeConfigAll=function(productChannel,continuationTyp){
		if(productChannel==0 && continuationTyp==0){
			self.typeleve=self.typeleve00;
			self.productList=self.productList00;
		}
		if(productChannel==0 && continuationTyp==1){
			self.typeleve=self.typeleve01;
			self.productList=self.productList01;
		}
		if(productChannel==1 && continuationTyp==0){
			self.typeleve=self.typeleve10;
			self.productList=self.productList10;
		}
		if(productChannel==1 && continuationTyp==1){
			self.typeleve=self.typeleve11;
			self.productList=self.productList11;
		}
		
		self.initTypeleve={};
    for(var i in self.typeleve){
    		var key =self.typeleve[i].code;
    		self.initTypeleve[key]=self.typeleve[i];
    }
    
	self.initProductList={};
    for(var i in self.productList){
    		var key =self.productList[i].code;
    		self.initProductList[key]=self.productList[i];
    }
		
}*/
    
    //添加适用上传图片
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
    
    //适用查询
    self.querySplashConfigList = function(pageNum){
    		if(!pageNum){
            self.search.pageNum = self.page.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                self.search.pageNum=self.search.pageCount;
            }else{
                self.search.pageNum = pageNum;
            }
        }
       var onlineTimeStart = $("#onlineTimeStart").val();
       if (onlineTimeStart != null && onlineTimeStart != '') {
    	  self.search.effectStart = $("#onlineTimeStart").val();
       }
       
       var onlineTimeStartEnd = $("#onlineTimeStartEnd").val();
       if (onlineTimeStartEnd != null && onlineTimeStartEnd != '') {
    	   self.search.effectEnd = $("#onlineTimeStartEnd").val();
       }

        var url = globalConfig.basePath+"/vip/handpickWelfare/list";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNum = data.data.resp.currentPage;
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


    //创建时间排序
    self.timeSort=function(field,sortType){
        self.search.orderField=field;
        self.search.orderMethod=sortType;
        var url = globalConfig.basePath+"/vip/handpickWelfare/list";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNum = data.data.resp.currentPage;
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

    }


    //重置
    self.reset = function(){
    	var num = self.search.pageNum;
    	var size = self.search.pageSize;
    	var totalRowSize = self.search.totalRowSize;
    	self.search={};
    	self.search.pageNum = num;
    	self.search.pageSize = size;
    	self.search.totalRowSize = totalRowSize;
        self.search.channel = "1";//理财渠道
        self.search.effectStatus="";
        $("#onlineTimeStart").val("");
        $("#onlineTimeStartEnd").val("");
    }

    /**
     * 获取推荐产品
     */
    self.getRecommendProduct=function(param){
    	
    		var 	list = JSON.parse( param );
    		if(list.length>0)
    			return list[0].productName ;
    		else
    			return "";
    		
    }
    
    self.getTime=function(x,y){
    		if(x==0){
    			return y
    		}else{
    			return "";
    		}
    	
    	
    }
    
 //*************************************Add 适用************************************
    //添加适用
    self.addPrivilege = function(){
    	 	$("#addChannelCode").removeAttr("disabled");  
    	 	$("#addValidType").removeAttr("disabled");  
    	 	$("#profit").removeAttr("disabled");  
    	 	$("#addOnlineTime").removeAttr("disabled");  
    	 	$("#addOfflineTime").removeAttr("disabled");  
    	 	$("#validDays").removeAttr("disabled");  
    		self.addContinuationTypeInfo="";
    		self.add={};
    		self.operationType = 1;
            self.add.skipType="4";
            self.add.channel="1";
    		self.add.validType='1';
    		self.add.labelColor='';
    		self.add.continuationType='x';
    		self.pullPrivilegeproductChannel(1);
    	    self.productList=[];
    	    self.productListRight=[];
    	    self.initProductList={};
    	    self.initTypeleve={};
    	    self.productsList=[];
    	    self.left=[];
    	    self.right=[];
    	    self.typeleveList=[];
    	    self.continuationTypeInfo="";
    	    $scope.isCommitted = false;
        
    }
    
    // 返回值
    self.upBanck = function(){
    	self.pullPrivilegeproductChannel(1);
    	$(".continuationTypeInfoBox").removeAttr("checked");
    		self.operationType = 0;
    		$(".continuationTypeInfoBox").attr("checked",false);
    }
    
    //渠道
    self.pullPrivilegeproductChannel=function(productChannel){
    		// 处理右侧的数据
    		self.productListRight=[];
    		self.add.continuationType='x';
    		$("#continuationType").val('x');
    		// 产品渠道
    		if(!productChannel){
    			productChannel=0;
    		}
    		//self.add.continuationTyp='';
    		$('#continuationType').val('');
    		self.typeleve=[];
    		var url = globalConfig.basePath+"/privilege/getChannelCode?channal="+productChannel;
    		$http({
	            method: 'GET',
	            url: url,
	        }).then(
                function(data){
                		self.productList=[];
                    self.productList =data.data.resp;
                    self.initProductList={};
                    for(var i in self.productList){
                    		var key =self.productList[i].code;
                    		self.initProductList[key]=self.productList[i];
                    }
                    
                },function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
    }
    
	self.addIsSelected = function(id){
		var productChannel = self.add.productChannel;
		if(!productChannel){
			productChannel=0;
		}
		if(productChannel==0){
			$(".continuationTypeInfoBox").attr('disabled','disabled');
			return self.addContinuationTypeInfo.indexOf(id)>=0;
		}else{
			return self.continuationTypeInfo.indexOf(id)>=0;
		}
		return false;   
	} 
    
    self.pullPrivilegeTye=function(continuationTyp){
    		self.addContinuationTypeInfo="";
    		$(".continuationTypeInfoBox").removeAttr("checked");
    		// 
    		var productChannel = self.add.productChannel;
		if(!productChannel){
			productChannel=0;
		}
		if(productChannel==0){
			 $(".continuationTypeInfoBox").attr('disabled','disabled');
		}
		
}
    

    //选中全部权益对象
    var i=0
    $scope.muTexAll = function () {
        if(i==0){
            i=1;
        }else if(i==1){
            i=0;
        }
        if(i==1){
            $('.lvCode').each(function() {
                $(this).prop("checked",true);
            });
        }else if(i==0){
            $('.lvCode').each(function() {
                $(this).prop("checked",false);
            });
        }

    }

    //确认添加权益
    self.commitPrivilege = function(){
    		var updateFlage=0;
    		if(self.add.id){
    			updateFlage=1;//修改
    		}else{
    			if($scope.isCommitted){
    	    		return;
    	    	}
    		}
        if(!self.add.channel){
            alert("渠道不能为空");
            return ;
        }

        if(self.add.prizeType==null ||self.add.prizeType==""){
            alert("请选择权益卡券来源");
            return;
        }
        if(!self.add.contentId){
            alert("权益卡券ID不能为空");
            return ;
        }
        if(!self.add.descImgUrl){
            alert("权益详情图片不能为空");
            return ;
        }
        if(!self.add.masterTitle){
            alert("主标题不能为空");
            return ;
        }
        if(!self.add.subTitle){
            alert("副标题不能为空");
            return ;
        }
         $scope.add.onlineTime = $('#addOnlineTime').val()+"";
         $scope.add.offlineTime = $('#addOfflineTime').val()+"";
         if($scope.add.onlineTime==null||$scope.add.onlineTime==""){
             alert("请选择开始时间");
             return;
         }
         if($scope.add.offlineTime==null||$scope.add.offlineTime==""){
             alert("请选择结束时间");
             return;
         }
         if($scope.add.offlineTime<=$scope.add.onlineTime){
            alert("结束时间必须大于开始时间");
             return;
         }
        self.add.effectStart =$scope.add.onlineTime;
        self.add.effectEnd =$scope.add.offlineTime;
        if(!self.add.imgUrl){
        		alert('权益列表图片链接不能为空');
        		return;
        }

        if(!self.add.skipType){
            alert('跳转类型不能为空');
            return;
        }
        var lvcodes="";
        $(".lvCode").each(function () {
            if (this.checked == true) {
                lvcodes += $(this).val() + ",";
            }
        })	
        	
        if(lvcodes==""){
            alert("权益对象不能为空")
            return;
        }
        self.add.lvcodes=lvcodes;

        if(!self.add.skipUrl){
            alert('跳转地址不能为空');
            return;
        }
        if(self.add.channel==0){
            if(!self.add.headUrl){
              alert("悟空权益对应icon图片链接不能为空");
              return;
            }
            if(!self.add.headName){
                alert("icon名称不能为空");
                return;
            }
        }

        var url = "";
        if(updateFlage==0){
        	 url = globalConfig.basePath+"/vip/handpickWelfare/add";
        	 $scope.isCommitted = true;
        }else{
        	url = globalConfig.basePath+"/vip/handpickWelfare/edit";
        }
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
              if(data.data.code=='000'){
                  $('#addShow').hide();
                  self.pullPrivilegeproductChannel(1);
                  self.add = {};
                  self.operationType = 0;
                  self.querySplashConfigList(1);
              }else{
                  //失败后可重新提交
                  $scope.isCommitted = false;
              }
            },function(response) {
                alert("请求失败了....");
                self.pullPrivilegeproductChannel(1);
            }
        );
       
    } 
    
    
    
 //************************适用查看**************************   
    //查看
    self.check = function(query){
    	 	self.showPopup=query;
        $('#showPopupCheck').show();
    }   
    
    self.checkOKAndNO=function(){
    		$('#showPopupCheck').hide();
    }
    

   
    
   	self.isSelected = function(id){
       return self.continuationTypeInfo.indexOf(id)>=0;
	 } 
   	
   	$scope.detailJX=function(para){
   		alert("请求失败了...."+para);
   		return;
   	}
   //查看详情-new
    $scope.detailShowNew = function(query){
		//self.pullPrivilegeConfigAll();//更新全局配置信息
		self.operationType = 6;
	 	self.detail=angular.copy(query);
	 	self.detail.productChannel=self.edit.productChannel+"";
	 	self.detail.continuationType=self.edit.continuationType+"";

 }
    
   	// 修改
    self.update = function(query){
    		self.operationType = 1;
    		$("#addChannelCode").prop("disabled",true);
    	 	self.add=angular.copy(query);
    	 	self.add.channel=self.add.channel+"";
           self.add.skipType =  self.add.skipType+"";
        var lvcodeStr = self.add.lvcodes;
        var  lvcodes = lvcodeStr.split(",");
        $(".lvCode").each(function () {
            for (var i=0;i<lvcodes.length;i++){
                if ($(this).val() == lvcodes[i]) {
                    $(this).prop("checked",true);
                }
            }

        })

    }

    
    //默认查询
    self.loading = function(){
    		self.search.productChannel='1';
    		self.search.status='';
    		self.operationType = 0;
    		self.search.continuationType='0';
        self.search.auditStatus = "";
        self.search.pageSize = "5";
        self.querySplashConfigList(1);
    }
    self.loading();
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
        	 $('.examine-box').show();
        	 $scope.confirmRecord = angular.copy(record);
        	 $scope.auditStatus = "2";
        	 $scope.auditDescription = "";
        	//$('#confirm').show();
        	
        }
    };
    //审批
    $scope.audit = function(record){
    	if(record.auditStatus != "0"){
    		alert('只能对待审核状态的数据进行操作');
    		return;	
    	 }
    	$scope.auditStatus = "1";
    	$('.take-start-box').show();
    	$scope.confirmRecord = angular.copy(record);
   // 	$scope.auditStatus = "2";
    	$scope.auditDescription = "";
    	
    };
    //快速下线
    $scope.offline = function(record){
    	$('.examine-box').show();	
    	$scope.effectRecord = angular.copy(record);
    };

    //查看详情
    $scope.detailShow = function(record){   	
	    	$scope.operationType=2;	
	    	$scope.detail = angular.copy(record);
	        $scope.detail.productsList = JSON.parse( $scope.detail.productsList );
	        for(var i=0;i<$scope.detail.productsList.length;i++){
	        	 $scope.products += $scope.detail.productsList[i].productName + "  ";
	        }
	    	//self.detailPullPrivilegeTye($scope.detail.productChannel,$scope.detail.continuationType);
	    	var productChannel = $scope.detail.productChannel;
	    	var continuationTyp = $scope.detail.continuationType
	    	if(!productChannel){
	    		productChannel=0;
	    	}
	    	
        
    };

    // 权益失效
    $scope.offlineRecord = function(){
    	$scope.effectRecord.effectStatus = 2;
        var url = globalConfig.basePath+"/vip/handpickWelfare/invalid";
        $http.post(url,$scope.effectRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){   
            	alert("操作成功");
                $scope.querySplashConfigList(1);
                $('.examine-box').hide();
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert(response);
        });
    };

}]);
   



