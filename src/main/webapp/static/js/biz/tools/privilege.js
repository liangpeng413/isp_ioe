'use strict';// 严谨模式
var App = angular.module('privilegeApp', [], angular.noop);
App.controller('privilegeController',['$scope','$http', function($scope,$http) {
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
    
    self.privilegeConfigAll=function(productChannel,continuationTyp){
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
		
}
    
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
       var onlineTimeStart = $("#queryOnlineTime").val();
       if (onlineTimeStart != null && onlineTimeStart != '') {
    	   $scope.search.onlineTimeStart = $("#onlineTimeStart").val();
       }
       
       var onlineTimeStartEnd = $("#onlineTimeStartEnd").val();
       if (onlineTimeStartEnd != null && onlineTimeStartEnd != '') {
    	   $scope.search.onlineTimeStartEnd = $("#onlineTimeStartEnd").val();
       }
       
       var offlineTimeStart = $("#offlineTimeStart").val();
       if (offlineTimeStart != null && offlineTimeStart != '') {
    	   $scope.search.offlineTimeStart = $("#offlineTimeStart").val();
       }
       
       var offlineTimeStartEnd = $("#offlineTimeStartEnd").val();
       if (offlineTimeStartEnd != null && offlineTimeStartEnd != '') {
    	   $scope.search.offlineTimeStartEnd = $("#offlineTimeStartEnd").val();
       }
        var url = globalConfig.basePath+"/privilege/list";
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

    //重置
    self.reset = function(){
    	var num = self.search.pageNum;
    	var size = self.search.pageSize;
    	var totalRowSize = self.search.totalRowSize;
    	self.search={};
    	self.search.pageNum = num;
    	self.search.pageSize = size;
    	self.search.totalRowSize = totalRowSize;
        self.search.productChannel = "1";//理财渠道
        self.search.validType='1';
        self.search.valid="";//是否生效
        self.search.type="";
        //self.search.onTime="";//在线时间
        $("#onlineTimeStart").val("");
        $("#onlineTimeStartEnd").val("");
        $("#offlineTimeStart").val("");
        $("#offlineTimeStartEnd").val("");
       
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
    		self.add.productChannel='1';
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
//     	$('.continuationTypeInfoBox').each(function() {
//            if(this.checked == true) {
//          	  	var key = $(this).val();
//          	  tyeLeve.push( self.initTypeleve[key]);
//            }
//	    	});
        
        
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
    
    // 获取适用类型的详情
    self.getContinuationTypeInfo=function(){
    		var tyeLeve=[];
    	 	self.typeleveList=[];
	    	$('.continuationTypeInfoBox').each(function() {
            if(this.checked == true) {
          	  	var key = $(this).val();
          	  tyeLeve.push( self.initTypeleve[key]);
            }
	    	});
	    	self.typeleveList=tyeLeve;
    }
    
    
    
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
    
    /**
     * 去掉空格
     */
    function removeAllSpace(str) {
        return str.replace(/\s+/g, "");
   }
    // 添加
    self.addRight = function(param){
    		var left = [];// 获取左侧的选中的
    		var right=[];
        $('.productListLeft').each(function() {
          if(this.checked == true) {
        	  	var key = $(this).val();
        	  	right.push( self.initProductList[key]);
          }else{
        	  	var key = $(this).val();
      	  	left.push( self.initProductList[key]);
          }
         });
        if(right.length<1){
        		alert("请选择适用产品");
        		return false;
        }
        if(param==0 && right.length>1){
			alert("只能选择单挑适用产品");
			return false;
		}
        $('.productListRight').each(function() {//多次添加记录右侧数据
        		var key = $(this).val();
        		key=key.split("_")[1];
        		if(key){
        			right.push(self.initProductList[key]);
        		}
           });
        //数据渲染
        self.productListRight =right;
        self.productList =left;
        // 适用产品列表
        var tem=[];
        for(var i in right){
	        	var obj={};
	        	obj['productType']=right[i].code;
	        	obj['productName']=right[i].name;
	        	tem.push(obj);
        }
        self.productsList=tem;
        self.getContinuationTypeInfo();
    }
    
    // 删除操作
    self.delLeft = function(param){
   		var left = [];// 左侧数据
		var right=[];// 右侧数据
	    $('.productListRight').each(function() {
	      if(this.checked == true) {
	    	  	var key = $(this).val();
	    	  	key=key.split("_")[1];
	    	  	left.push( self.initProductList[key]);
	      }else{
	    	  	var key = $(this).val();
	    	  	key=key.split("_")[1];
	    	  	right.push( self.initProductList[key]);
	      }
	     });
	    if(left.length<1){
	    		alert("请选择要移除适用产品");
	    		return false;
	    }
	    if(param==0 && left.length>1){
			alert("只能选择单条要移除适用产品");
			return false;
		}
	    $('.productListLeft').each(function() {//多次添加记录右侧数据
		    	var key = $(this).val();
	    		left.push( self.initProductList[key]);
	       });
	    //数据渲染
	    self.productListRight =right;
	    self.productList =left;
        var tem=[];
        for(var i in right){
	        	var obj={};
	        	obj['productType']=right[i].code;
	        	obj['productName']=right[i].name;
	        	tem.push(obj);
        }
        self.productsList=tem;
        self.getContinuationTypeInfo();
    }
    
    
    //移动
    var moveList = new Array();
    self.privilegeConfigAll(self.add.productChannel,self.add.continuationType);
    self.move = function(type){
        if( $("input[class='productListRight']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
       
        self.right=[];
        $('.productListRight').each(function() {//多次添加记录右侧数据
	    		var key = $(this).val();
	    		key=key.split("_")[1];
	    		self.right.push( self.initProductList[key]);
       });
        var length = self.right.length;
        $('.productListRight').each(function(){
            if(this.checked == true){
                 if(type=='S'){//上移
                    var key = $(this).val();
                    key=key.split("_")[0];
                    var me =key-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  self.right[me];//当前选中的
                    var move1 = self.right[me-1];//上一个
                     self.right[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                     self.right[me] = move1;// 当前选中的
                 }else if(type=='X'){// 下移
                	 	var key = $(this).val();
                     key=key.split("_")[0];
                     var me =key-1;
                     if(me==length-1){
                         alert("已经最后了,还要往那移");
                         return;
                     }
                     var move0 = self.right[me];// 当前的
                     var move1 = self.right[me+1];// 下一个适用
                     self.right[me+1] =move0; // 当前的选中的放到移动的位置，
                     self.right[me] = move1;// 下一个移动到当前的位置
                 }
            }
        })
        self.productListRight =self.right;
        
        var tem=[];
        for(var i in self.right){
	        	var obj={};
	        	obj['productType']=self.right[i].code;
	        	obj['productName']=self.right[i].name;
	        	tem.push(obj);
        }
        self.productsList=tem;
        self.getContinuationTypeInfo();
    }   
    
    /**
     * 验证是否是两位小数
     */
    function checknumKeepTwoPoint(expandProfit){
    		var patt1=new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
    		return patt1.test(expandProfit);
    }
    
    function checkNum(expandProfit){
		var patt1=new RegExp(/^(\-|\+)?\d+(\.\d+)?$/);
		return patt1.test(expandProfit);
}
    //确认添加根特权
    self.commitPrivilege = function(){
    		var updateFlage=0;
    		if(self.add.id){
    			updateFlage=1;//修改
    		}else{
    			if($scope.isCommitted){
    	    		return;
    	    	}
    		}
        if(self.add.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        if(self.add.type==""||self.add.type==undefined){
            alert("请选择特权类型");
            return ;
        }
        if(self.add.name==""||self.add.name==null){
            alert("请填写特权名称");
            return ;
        }
        if(self.add.productsDesc==""||self.add.productsDesc==null){
            alert("请填写适用产品描述");
            return ;
        }
        
        if(self.add.profit==""||self.add.profit==null){
            alert("请填写期望年化回报率");
            return ;
        }else{
        	if(self.add.profit<0.1||self.add.profit>3){
        		alert("期望年化回报率必须再0.1~3.0范围内");
                return ;
        	}
        }
        if(self.add.validType==1){
        	 $scope.add.onlineTime = $('#addOnlineTime').val()+"";
             $scope.add.offlineTime = $('#addOfflineTime').val()+"";
             if($scope.add.onlineTime==null||$scope.add.onlineTime==""){
                 alert("请选择生效时间");
                 return;
             }
             if($scope.add.offlineTime==null||$scope.add.offlineTime==""){
                 alert("请选择失效时间");
                 return;
             }
             if($scope.add.offlineTime<=$scope.add.onlineTime){
             	alert("失效时间必须大于生效时间");
                 return;
             }
             var offlineTime =$scope.add.offlineTime;
             var offlineTimes = offlineTime.split(" ");
             var onlineTime =$scope.add.onlineTime;
             var onlineTimes = onlineTime.split(" ");
             var start="00:00:00";
             var end="23:59:59";
             $scope.add.offlineTime = offlineTimes[0] + " " + end;
             $scope.add.onlineTime =  onlineTimes[0] + " " + start;
        }else{
        	if($scope.add.validDays==null||$scope.add.validDays==""){
                alert("请选择生效天数");
                return;
            }else{

                if (!(/(^[1-9]\d*$)/.test($scope.add.validDays))) {
                    alert('生效天数必须1~9999的整数');
                    return ;
                }
                if ($scope.add.validDays<1||$scope.add.validDays>9999) {
                    alert('生效天数必须1~9999的整数');
                    return;
                }
            }
        }
        
        
        
       var auditPerson = self.add.auditPerson;
        
       var temproductsList=[];
       if(updateFlage==0){
    	   		temproductsList=self.productsList
        		//self.add.productsList=JSON.stringify(self.productsList);
       }else{
       	var productListRight = [];
        $('.productListRight').each(function() {//多次添加记录右侧数据
	    		var key = $(this).val();
	    		key=key.split("_")[1];
	    		productListRight.push( self.initProductList[key]);
        });
        var tem=[];
        for(var i in productListRight){
	        	var obj={};
	        	obj['productType']=productListRight[i].code;
	        	obj['productName']=productListRight[i].name;
	        	tem.push(obj);
        }
        self.productsList=tem;
        temproductsList=self.productsList
       
       }
        
        if(temproductsList.length<=0){
        		alert("请选择适用产品");
            return ;
        }
        var products = '';
        for(var i=0;i<temproductsList.length;i++){
        	if(i<temproductsList.length-1){
        		products += temproductsList[i].productType + ',';
        		
        	}else{
        		products += temproductsList[i].productType;
        	}
        }
        //alert(products);
        self.add.productsList=JSON.stringify(temproductsList);
        self.add.products = products;
        if(self.add.labelText!=null&&self.add.labelText!=""){
        	if(self.add.labelColor==null||self.add.labelColor==""){
        		alert('请选择标签底图色');
        		return;
        	}
        }
        if(self.add.labelColor!=null&&self.add.labelColor!=""){
        	if(self.add.labelText==null||self.add.labelText==""){
        		alert('请填写标签文字');
        		return;
        	}
        }
        
        // 审核人
        if(!self.add.auditPerson){
            alert("审核人不能为空");
            return ;
        }else{
         	self.add.auditNo=self.add.auditPerson.no;
         	self.add.requestAuditPersonEmail=self.add.auditPerson.email;
         	self.add.auditPerson=self.add.auditPerson.name;
        }
        
        
        // 提审说明
//        if(self.add.requestAuditDescription==null){
//            alert("提审说明不能为空");
//            return ;
//        }
    		var url = "";
        if(updateFlage==0){
        	 url = globalConfig.basePath+"/privilege/add";
        	 $scope.isCommitted = true;
        }else{
        	url = globalConfig.basePath+"/privilege/edit";
        }
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.pullPrivilegeproductChannel(1);
                self.add = {};
               // self.reset();
                //self.loading();
                self.operationType = 0;
                self.querySplashConfigList(1);
                
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
    
 
//************************修改*****************************
    /*self.pullPrivilegeConfigAll=function(){
	var url = globalConfig.basePath+"/privilege/getLevelAll";
	$http({
        method: 'GET',
        url: url,
    }).then(
        function(data){
            self.typeleve00 =data.data.resp['00'].leve;
            self.typeleve10 =data.data.resp['10'].leve;
            self.typeleve01 =data.data.resp['01'].leve;
            self.typeleve11 =data.data.resp['11'].leve;
            self.productList00 =data.data.resp['00'].productList;
            self.productList01 =data.data.resp['01'].productList;
            self.productList10 =data.data.resp['10'].productList;
            self.productList11 =data.data.resp['11'].productList;
//            self.initProductList={};
//            for(var i in self.productList){
//            		var key =self.productList[i].code;
//            		self.initProductList[key]=self.productList[i];
//            }
        },function errorCallback(response) {
            alert("请求失败了....");
        }
    		);
    }*/

   //self.pullPrivilegeConfigAll();//全局配置信息
    
   
    
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
		//self.add={};
	 	self.edit=angular.copy(query);
		//self.pullPrivilegeConfigAll(query.productChannel,query.continuationType);
	 	self.privilegeConfigAll(query.productChannel,query.continuationType);
   
	 	//self.edit.auditPerson="";
	 	self.edit.productChannel=self.edit.productChannel+"";
	 	self.edit.continuationType=self.edit.continuationType+"";
 	
	 	// 处理下拉框问题
	 	$("#editChannelCode").attr('disabled','disabled');
	 	$("#editcontinuationType").attr('disabled','disabled');
 	
 	// 处理类型详情
	 	var tpyeinfo=self.edit.continuationTypeInfo;
	 	self.continuationTypeInfo=self.edit.continuationTypeInfo;
  	
  	var right=[];
  	var productList =JSON.parse(query.productsList);
  	$scope.products = "";
  	for(var i=0;i<productList.length;i++){
  		 if(i<productList.length-1){
  			$scope.products += productList[i].productName + ",";
  		 }else{
  			$scope.products += productList[i].productName;
  		 }
    	 
    }
  	for(var i in productList){
  		var obj={};
  		obj['code']=productList[i].productType;
  		obj['name']=productList[i].productName;
  		right.push(obj);
  	}
  	
  	var tem= self.productList;
  	var left=[];
  	for(var j in tem){
  		for(var i in right){
	  		if(right[i].code==tem[j].code){
	  			tem.splice(j,1);
	  			//left.push(tem);
	  		}
	  	}
  	}
  	self.productListRight=right;
  	self.productList=tem;
  	var tpyeinfoList = []
    for(var i in self.typeleve){
     		var key =self.typeleve[i].code;
     		if(tpyeinfo.indexOf(key)>=0){
     			tpyeinfoList.push(self.typeleve[i]);
     		}
     }
     self.typeleveList=tpyeinfoList;
     
}
    
   	// 修改
    self.update = function(query){
    	 
    	 var url = globalConfig.basePath+"/privilege/isAuditSuccess";
    	 $http.post(url,query).then(function successCallback(callback) {
             if(callback.data.code == '000'){   
            	 if(callback.data.resp.flag){
            		 $("#addChannelCode").attr('disabled','disabled');
            		 $("#addValidType").attr('disabled','disabled');
            		 $("#profit").attr('disabled','disabled');
            		 $("#addOnlineTime").attr('disabled','disabled');
            		 $("#addOfflineTime").attr('disabled','disabled');
            		 $("#validDays").attr('disabled','disabled');
            	 }else{
            		 $("#addChannelCode").removeAttr("disabled");  
            		 $("#addValidType").removeAttr("disabled");  
            		 $("#profit").removeAttr("disabled");  
            		 $("#addOnlineTime").removeAttr("disabled");  
            		 $("#addOfflineTime").removeAttr("disabled");  
            		 $("#validDays").removeAttr("disabled");  
            	 }
             } else {
                 console.error(callback.data);
                 alert("操作失败");
             }
         }, function errorCallback(response) {
             // 请求失败执行代码
             swalMsg(response);
         });
    		//self.pullPrivilegeConfigAll();//更新全局配置信息
    		if(query.productChannel==0){
    			self.pullPrivilegeTye(query.continuationType);
    		}
    		self.operationType = 1;
    		//self.add={};
    	 	self.add=angular.copy(query);
    		//self.pullPrivilegeConfigAll(query.productChannel,query.continuationType);
    	 	//self.privilegeConfigAll(query.productChannel,query.continuationType);
       
    	 	self.add.auditPerson="";
     	self.add.productChannel=self.add.productChannel+"";
     	self.add.continuationType=self.add.continuationType+"";
     	//if(query.operationType!=0){//非添加状态
     		if(query.offlineTimeTmp)
     			self.add.offlineTime=query.offlineTimeTmp;
     		if(query.onlineTimeTmp)
     			self.add.onlineTime=query.onlineTimeTmp;
     //	}
     	
     	// 处理下拉框问题
     	 //$("#addChannelCode").attr('disabled','disabled');
     	 //$("#continuationType").attr('disabled','disabled');
     	
     	// 处理类型详情
 	 	var tpyeinfo=self.add.continuationTypeInfo;
 	 	self.continuationTypeInfo=self.add.continuationTypeInfo;
 	 	self.addContinuationTypeInfo=self.add.continuationTypeInfo;	
 	 	
	  	var right=[];
	  	var productList =JSON.parse(query.productsList);
	  	for(var i in productList){
	  		var obj={};
	  		obj['code']=productList[i].productType;
	  		obj['name']=productList[i].productName;
	  		right.push(obj);
	  	}
	  	
	  	var tem= self.productList;
	  	var left=[];
	  	var proLength =  tem.length;
	  	/*do{
	  		if(right.length+tem.length==proLength){
	  			break;
	  		}
	  		for(var j in tem){
		  		for(var i in right){
			  		if(right[i].code==tem[j].code){
			  			tem.splice(j,1);
			  		}
			  	}
		  	}
	  	}while(true);*/
	  	/*for(var j in tem){
	  		for(var i in right){
		  		if(right[i].code==tem[j].code){
		  			tem.splice(j,1);
		  			j=j-1;
		  			//left.push(tem);
		  		}
		  	}
	  	}*/
	  	
	  	/*for (var i = 0; i < tem.length; i++) {
	  		for(var j in right){
	  	　　		if (right[j].code==tem[i].code) {
	  	　　　　	  tem.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
	  	　　　　	  if(i>0){
	  	　　　　		 i--; // 如果不减，将漏掉一个元素 
	  	　　　　	  }else{
	  	　　　　		  if(i==0){
	  	　　　　			 if(tem.length>0){
	  	　　　　				 for(var z in right){
	  	　　　　					 if (right[z].code==tem[0].code) {
	  	　　　　						  tem.splice(i, 1);
	  	　　　　					 }
	  	　　　　			    }
	  	　　　　				 
	  	　　　　			 } 
	  	　　　　		  }
	  	　　　　			 
	  	　　　　	  }
	  	　　　　	  i=0;
	  	　　　　	  j=0;
	  	　　　　	
	  	　　　　	  
	  	　　		}
	  	　　	}*/
	  	for (var i = 0; i < tem.length; i++) {
            if(tem.length==1){
            	alert();
            }
            var count = 0;
	  		for(var j in right){
	  			console.log(i +"----"+ j);
	  			console.log(tem.length);
	  			if(tem[i]==undefined){
	  				break;
	  		    }
	  	　　		if (right[j].code==tem[i].code) {
	  	　　　　	  tem.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
	  	　　　　	  count=1;　　　　			 
	  	　　　　	 }  	　　　　	  
	  	　　	}
	  		
	  		i=i-count;
	  		if(i<0){
	  			i=0;
	  		}
	  	}
	  	if(tem.length!=0){
	  		for(var j in right){
	  			
	  			if(tem[0]==undefined){
	  				break;
	  		    }
	  	　　		if (right[j].code==tem[0].code) {
	  	　　　　	  tem.splice(0, 1); // 将使后面的元素依次前移，数组长度减1　　　			 
	  	　　　　	 }  	　　　　	  
	  	　　	}
	  	}
	 
	  	self.productListRight=right;
	  	self.productList=tem;
	  	var tpyeinfoList = []
        for(var i in self.typeleve){
         		var key =self.typeleve[i].code;
         		if(tpyeinfo.indexOf(key)>=0){
         			tpyeinfoList.push(self.typeleve[i]);
         		}
         }
         self.typeleveList=tpyeinfoList;
    	
         self.add.validType=self.add.validType+"";
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
    	if(record.auditStatus == "0"){
    		alert('无法对待审核状态的数据进行快速下线操作');
    		return;	
    	 }
    	$('.examine-box').show();	
    	$scope.effectRecord = angular.copy(record);
    	$scope.validConfirmUser = "";
    	$scope.requestAuditDescription = "";
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
    $scope.loginName = globalConfig.loginName;

    // 快速下线
    $scope.offlineRecord = function(){
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
    	$scope.effectRecord.delFlag = 'T';
        var url = globalConfig.basePath+"/privilege/invalid";
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
    
    // 审核
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/privilege/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            
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
            alert(response);
        });
    };
    
    //查看拉取产品
    self.detailPullPrivilegeTye=function(productChannel,continuationTyp){
	if(!productChannel){
		productChannel=0;
	}
	// 适用类型
	//var continuationTyp = self.add.continuationTyp;
	if(!continuationTyp){
		continuationTyp=0;
	}
	
  }
    
  //修改-按渠道类型版本登陆状态获取位置列表
    $scope.getTypeList = function(){
        var url = globalConfig.basePath+"/rDict/getPrivlegeTypePositions?productChannel="+ 1 +  "&resourceType=privilege_products";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
        
        	$scope.typeList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getTypeList();
    self.pullPrivilegeproductChannel(1);
    $scope.otMemberList = function (privilegeId) {
  	  window.location.href = globalConfig.basePath + '/tools/otMemberList?privilegeId=' +  privilegeId;
  };
  
  
  //导出
  self.exportExcel = function(){
		
	  var onlineTimeStart = $("#queryOnlineTime").val();
 	if (onlineTimeStart != null && onlineTimeStart != '') {
	   $scope.search.onlineTimeStart = $("#onlineTimeStart").val();
 	}
 
 	var onlineTimeStartEnd = $("#onlineTimeStartEnd").val();
 	if (onlineTimeStartEnd != null && onlineTimeStartEnd != '') {
	   $scope.search.onlineTimeStartEnd = $("#onlineTimeStartEnd").val();
 	}
 
 	var offlineTimeStart = $("#offlineTimeStart").val();
 	if (offlineTimeStart != null && offlineTimeStart != '') {
	   $scope.search.offlineTimeStart = $("#offlineTimeStart").val();
 	}
 
 	var offlineTimeStartEnd = $("#offlineTimeStartEnd").val();
 	if (offlineTimeStartEnd != null && offlineTimeStartEnd != '') {
	   $scope.search.offlineTimeStartEnd = $("#offlineTimeStartEnd").val();
 	}
 	
 	$scope.searchTemp = angular.copy($scope.search);
    if($scope.search.name==undefined){
    	$scope.searchTemp.name = "";
 	}
 	//$scope.searchTemp.name =  encodeURI($scope.search.name);
  	var url = globalConfig.basePath+"/privilege/exportExcel";
  	var jsonStr = JSON.stringify($scope.searchTemp);
  	jsonStr = jsonStr.replace('{','');
  	jsonStr = jsonStr.replace('}','');
  	window.location.href = url + "?jsonStr=" + encodeURI(encodeURI(jsonStr));
  };
}]);
   



