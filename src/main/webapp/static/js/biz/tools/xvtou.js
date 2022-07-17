'use strict';// 严谨模式
var App = angular.module('xvtouApp', [], angular.noop);
App.controller('xvtouController',['$scope','$http', function($scope,$http) {
	var self = $scope;
    self.search = {};// 查询
    self.add={};// 添加
    self.updatePopup={};// 修改
    self.showPopup={};// 查看
    self.productList=[];
    self.productListRight=[];
    self.initProductList={};
    self.initTypeleve={};
    self.productsList=[];//续投产品列表
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
    self.sourceUserList=[];
    //self.sourceUserList=[{sourceCode:"ALL",sourceName:"全部"},{sourceCode:"JJ",sourceName:"玖加"},{sourceCode:"JC",sourceName:"玖超"},{sourceCode:"JYH",sourceName:"玖耀汇"}];
    self.initSourceUserList={};
    self.dataInfo="";
    self.deShow=0;
    /*for(var i in self.sourceUserList){
		var key =self.sourceUserList[i].sourceCode;
		self.initSourceUserList[key]=self.sourceUserList[i];
      }*/
  self.sourceUserListRight=[];
  self.sourceUsersList=[];
  self.title ="";
  self.sourceCode="";
  self.rateProductList=[];
    self.xvtouConfigAll=function(channelCode,continuationTyp){
		if(channelCode==0 && continuationTyp==0){
			self.typeleve=self.typeleve00;
			self.productList=self.productList00;
		}
		if(channelCode==0 && continuationTyp==1){
			self.typeleve=self.typeleve01;
			self.productList=self.productList01;
		}
		if(channelCode==1 && continuationTyp==0){
			self.typeleve=self.typeleve10;
			self.productList=self.productList10;
		}
		if(channelCode==1 && continuationTyp==1){
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
    
    //添加续投上传图片
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
                    console.log("上传图片失败：系统暂不支持该类型图片上传")
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
    
    //续投查询
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
        if(self.search.pageNo==null||self.search.pageNo==''||self.search.pageNo==0){
            self.search.pageNo = 1;
        }
        var url = globalConfig.basePath+"/xvtou/pageAuditConfigProductXutouList";
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
        self.search.positions="";//续投位置
        self.search.type="";//续投类型
        self.search.continuationType="0";
        self.search.auditStatus="";
        //self.search.onTime="";//在线时间
        $("#searchonTime").val("");
        //self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
        //self.getTypeVersionListReset(0,"",1);
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
    
 //*************************************Add 续投************************************
    self.initSourceList = function(){
    	 self.sourceUserList=[{sourceCode:"ALL",sourceName:"全部"},{sourceCode:"JJ",sourceName:"玖加"},{sourceCode:"JC",sourceName:"玖超"},{sourceCode:"JYH",sourceName:"玖耀汇"}];
 	    for(var i in self.sourceUserList){
 			var key =self.sourceUserList[i].sourceCode;
 			self.initSourceUserList[key]=self.sourceUserList[i];
 	      }
    }
    
    //添加续投
    self.addXvtou = function(){
    	  self.initSourceList();
    	
    		self.addContinuationTypeInfo="";
    		self.add={};
    		self.operationType = 1;
    		self.add.channelCode='0';
    		self.add.continuationType='x';
    		self.pullXvtouchannelCode(0);
    	    self.productList=[];
    	    self.productListRight=[];
    	    self.initProductList={};
    	    self.initTypeleve={};
    	    self.productsList=[];
    	    self.left=[];
    	    self.right=[];
    	    self.typeleveList=[];
    	    self.continuationTypeInfo="";
    	    //针对钱包
    	    //self.sourceUserList=[];
    	    //self.initSourceUserList={};
    	    self.sourceUserListRight=[];
    	    self.sourceUsersList=[];
    	    self.rateProductList=[];
    	    self.dataInfo="";
    	    self.deShow=0;
    	    $("#addChannelCode").removeAttr("disabled");  
        $("#continuationType").removeAttr('disabled');
        // 处理修改状态后页面复选问题
        $(".continuationTypeInfoBox").attr("checked",false);
//     	$('.continuationTypeInfoBox').each(function() {
//            if(this.checked == true) {
//          	  	var key = $(this).val();
//          	  tyeLeve.push( self.initTypeleve[key]);
//            }
//	    	});
        
        
    }
    
    // 返回值
    self.upBanck = function(){
    	$(".continuationTypeInfoBox").removeAttr("checked");
    		self.operationType = 0;
    		$(".continuationTypeInfoBox").attr("checked",false);
    }
    
    //渠道
    self.pullXvtouchannelCode=function(channelCode){
    		// 处理右侧的数据
    		self.productListRight=[];
    		self.add.continuationType='x';
    		$("#continuationType").val('x');
    		// 产品渠道
    		if(!channelCode){
    			channelCode=0;
    		}
    		//self.add.continuationTyp='';
    		$('#continuationType').val('');
    		self.typeleve=[];
    		var url = globalConfig.basePath+"/xvtou/getChannelCode?channal="+channelCode;
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
		var channelCode = self.add.channelCode;
		if(!channelCode){
			channelCode=0;
		}
		if(channelCode==0){
			$(".continuationTypeInfoBox").attr('disabled','disabled');
			return self.addContinuationTypeInfo.indexOf(id)>=0;
		}else{
			return self.continuationTypeInfo.indexOf(id)>=0;
		}
		return false;   
	} 
    
    self.pullXvtouTye=function(continuationTyp){
    		self.addContinuationTypeInfo="";
    		$(".continuationTypeInfoBox").removeAttr("checked");
    		// 
    		var channelCode = self.add.channelCode;
		if(!channelCode){
			channelCode=0;
		}
		if(channelCode==0){
			 $(".continuationTypeInfoBox").attr('disabled','disabled');
		}
		// 续投类型
		//var continuationTyp = self.add.continuationTyp;
		if(!continuationTyp){
			continuationTyp=0;
		}
		var url = globalConfig.basePath+"/xvtou/getContinuationTyp?channal="+channelCode+"&type="+continuationTyp;
		$http({
            method: 'GET',
            url: url,
        }).then(
            function(data){
            		self.typeleve =[];
                self.typeleve =data.data.resp;
                if(self.add.channelCode){
                	self.typeleveList =[];
                		self.typeleveList =data.data.resp;
                }
                self.initTypeleve={};
                for(var i in self.typeleve){
                		var key =self.typeleve[i].code;
                		self.initTypeleve[key]=self.typeleve[i];
                		self.addContinuationTypeInfo=self.addContinuationTypeInfo+key+",";
                }
                $(".continuationTypeInfoBox").attr("checked",false);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
}
    
    // 获取续投类型的详情
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
    // 添加续投产品
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
        		alert("请选择续期产品");
        		return false;
        }
        if(param==0 && right.length>1){
			alert("只能选择一条续期产品");
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
        // 续投产品列表
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
    
    //添加用户来源
    self.addSuerRight = function(param){
		var left = [];// 获取左侧的选中的
		var right=[];
    $('.sourceUserListLeft').each(function() {
      if(this.checked == true) {
    	  	var key = $(this).val();
    	  	right.push(self.initSourceUserList[key]);
      }else{
    	  	var key = $(this).val();
  	  	left.push( self.initSourceUserList[key]);
      }
     });
    if(right.length<1){
    		alert("请选择用户来源");
    		return false;
    }
    if(param==0 && right.length>1){
		alert("只能选择单条用户来源");
		return false;
	}
    $('.sourceUserListRight').each(function() {//多次添加记录右侧数据
    		var key = $(this).val();
    		key=key.split("_")[1];
    		if(key){
    			right.push(self.initSourceUserList[key]);
    		}
       });
    //数据渲染
    self.sourceUserListRight =right;
    self.sourceUserList =left;
    
    // 用户来源列表
    var tem=[];
    for(var i in right){
        	var obj={};
        	obj['sourceType']=right[i].sourceCode;
        	obj['sourceName']=right[i].sourceName;
        	tem.push(obj);
    }
    self.sourceUsersList=tem;
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
	    		alert("请选择要移除续期产品");
	    		return false;
	    }
	    if(param==0 && left.length>1){
			alert("只能选择单条要移除续期产品");
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
    
    //删除用户来源
    self.delSureLeft = function(param){
   		var left = [];// 左侧数据
		var right=[];// 右侧数据
	    $('.sourceUserListRight').each(function() {
	      if(this.checked == true) {
	    	  	var key = $(this).val();
	    	  	key=key.split("_")[1];
	    	  	left.push( self.initSourceUserList[key]);
	      }else{
	    	  	var key = $(this).val();
	    	  	key=key.split("_")[1];
	    	  	right.push( self.initSourceUserList[key]);
	      }
	     });
	    if(left.length<1){
	    		alert("请选择要移除用户来源");
	    		return false;
	    }
	    if(param==0 && left.length>1){
			alert("只能选择单条要移除用户来源");
			return false;
		}
	    $('.sourceUserListLeft').each(function() {//多次添加记录右侧数据
		    	var key = $(this).val();
	    		left.push( self.initSourceUserList[key]);
	       });
	    //数据渲染
	    self.sourceUserListRight =right;
	    self.sourceUserList =left;
	    // 用户来源列表
	    var tem=[];
	    for(var i in right){
	        	var obj={};
	        	obj['sourceType']=right[i].sourceCode;
	        	obj['sourceName']=right[i].sourceName;
	        	tem.push(obj);
	    }
	    self.sourceUsersList=tem;
	    self.getContinuationTypeInfo();
    }
    
    //根据用户来源配置利率
    self.showdDeploy = function(par){
    	//处理添加的利率配置
    	self.title = par.sourceName;
    	self.sourceCode = par.sourceCode;
    	var flag=1;
    	for(var z in  self.rateProductList){
         	if(self.rateProductList[z].sourceUser!=self.sourceCode){
         		flag=0;
         	}else{
         		flag=1;
         		break;
         	}
         }

    	if(!self.dataInfo){
    		if(flag==0){
    			self.add.qbRecommendMarkingText="";
    			for(var i in self.productsList){
    				for(var j in self.typeleveList){
    					var key=self.productsList[i].productType + self.typeleveList[j].code+"";
    					$("#"+key).val("");
    				}
    			}
    		}else{
    			for(var i in self.rateProductList){
    				var obj= self.rateProductList[i];
    				var sur = obj.sourceUser;
    				if(sur==par.sourceCode){
    					self.add.qbRecommendMarkingText=obj.recomLable;
    					var rateList = obj.rateDeployList;
    					for(var r in rateList){
    						var rl = rateList[r];
    						for(var key in rl){
    							var value = rl[key];
    							for(var k in value){
    								var v = value[k];
    								var selector = key+k+"";
    								$("#"+selector).val(v);
    								self[selector]=v;
    							}
    						}
    					}
    				}
    			}
    		}
    		
    	}
    	 //修改回显弹框配置的加息利率
    	 if(self.dataInfo && self.dataInfo.channelCode==1){
    		 var url = globalConfig.basePath+"/xvtou/getContinuationTyp?channal="+ self.dataInfo.channelCode+"&type="+self.dataInfo.continuationType;
    	    	$http({
    	            method: 'GET',
    	            url: url,
    	        }).then(
    	            function(data){
    	                self.typeleve =data.data.resp;
    	                self.initTypeleve={};
    	                for(var i in self.typeleve){
    	                		var key =self.typeleve[i].code;
    	                		self.initTypeleve[key]=self.typeleve[i];
    	                }
    	                var extendProfitInfo =JSON.parse(self.dataInfo.extendProfitInfo);
    	                for(var i in extendProfitInfo){
    	               	 	var obj= extendProfitInfo[i];
    	               	 	var sur = obj.sourceUser;
    	               	 	if(sur==par.sourceCode){
    	               	 		self.add.qbRecommendMarkingText=obj.recomLable;
    	               	 		var rateList = obj.rateDeployList;
    	               	 		for(var r in rateList){
    	               	 			var rl = rateList[r];
    	               	 			for(var key in rl){
    	               	 				var value = rl[key];
    	               	 				for(var k in value){
    	               	 					var v = value[k];
    	               	 					var selector = key+k+"";
    	               	 					$("#"+selector).val(v);
    	               	 					self[selector]=v;
    	               	 				}
    	               	 			}
    	               	 		}
    	               	 		break;
    	               	 	}else{
    	               	 	self.add.qbRecommendMarkingText="";
    	                	var  pros = JSON.parse(self.dataInfo.productsList);
    	        			for(var i in pros){
    	        				for(var j in self.typeleveList){
    	        					var key = pros[i].productType + self.typeleveList[j].code+"";
    	        					$("#"+key).val("");
    	        				}
    	        			}
    	               	  }
    	                }
    	                $('#detailLog').show();
    	            },function errorCallback(response) {
    	                alert("请求失败了....");
    	            }
    	        );
    	 }else{
    		 $('#detailLog').show();
    	 }    	 
    }
    
    
    //移动
    var moveList = new Array();
    self.xvtouConfigAll(self.add.channelCode,self.add.continuationType);
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
                     var move1 = self.right[me+1];// 下一个续投
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
    
    //钱包加息利率配置
    self.qbRateDeploy=function(){
    	 //推荐标签
        if(!self.add.qbRecommendMarkingText){
           alert("推荐标签不能为空");
           return ;
        }
    	 //  续投加息:
        //var extendProfitInfo=[];
        var qbRateContinueObj={};
        var rateDeployList=[];
        
        for(var i in self.productsList){
        		var objproject={};
        		var objleve={};
        		for(var j in self.typeleveList){
        			var key=self.productsList[i].productType + self.typeleveList[j].code+"";
        			var value = $("#"+key).val();
        			value = removeAllSpace(value);// 去掉多余空格
        			
        				if(!value){
            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续期加息必填")
            				return false;
            			}

        			//验证数字：
        			if(!checkNum(value)){
        				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续期加息格式不对")
        				return false;
        			}

        				if(value>3 || value<0){
	            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续期加息在0~3之间")
	            				return false;
	            		           //swalMsg("请输入0~5之间的数字");
	            		  }

        				if(!checknumKeepTwoPoint(value)){
            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续期加息最多支持2位小数")
            				return false;
                 			// swalMsg("最多支持2位小数");
                 	}
       			
        			objleve[self.typeleveList[j].code]=value;
        		}
        		objproject[self.productsList[i].productType]=objleve;
        		
        		rateDeployList.push(objproject);
        }
        for(var i in  self.rateProductList){
        	if(self.rateProductList[i].sourceUser==self.sourceCode){
        		self.rateProductList.splice(i,1);
        	}
        }
        qbRateContinueObj['recomLable']=self.add.qbRecommendMarkingText;
        qbRateContinueObj['sourceUser']=self.sourceCode;
        qbRateContinueObj['rateDeployList']= rateDeployList;
       // extendProfitInfo.push(qbRateContinueObj);
        self.rateProductList.push(qbRateContinueObj);
        console.log(self.rateProductList);
        $('#detailLog').hide();
    }
    
    
    
    //确认添加续投
    self.commitXvTou = function(){
    		var updateFlage=0;
    		if(self.add.id){
    			updateFlage=1;//修改
    		}
        if(self.add.channelCode==null){
            alert("渠道不能为空");
            return ;
        }
        //续投类型
        if(self.add.continuationType=='x'){
            alert("续期类型不能为空");
            return ;
        }
        
        var tyeLeve="";
	    	$('.continuationTypeInfoBox').each(function() {
	        if(this.checked == true) {
	      	  	var key = $(this).val();
	      	  	tyeLeve=tyeLeve+","+key;
	        }
	    	});
        
	    	//续投类型
        if(!tyeLeve){
            alert("续投类型详情不能为空");
            return ;
        }
        self.add.continuationTypeInfo=tyeLeve.slice(1);
        // TODO 续投类型选项
        
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
        		alert("续期产品不能为空，请选择对应的续期产品");
            return ;
        }
        self.add.productsList=JSON.stringify(temproductsList);
        
        
        //处理用户来源
      if(self.add.channelCode==1){
        var temSourcesList=[];
        var sourceUserName="";
        if(updateFlage==0){
        	temSourcesList=self.sourceUsersList
         		//self.add.productsList=JSON.stringify(self.productsList);
        }else{
        	var sourceUserListRight = [];
         $('.sourceUserListRight').each(function() {//多次添加记录右侧数据
 	    		var key = $(this).val();
 	    		key=key.split("_")[1];
 	    		sourceUserListRight.push(self.initSourceUserList[key]);
         });
         var tem=[];
         for(var i in sourceUserListRight){
 	        	var obj={};
 	        	obj['sourceType']=sourceUserListRight[i].sourceCode;
	        	obj['sourceName']=sourceUserListRight[i].sourceName;
	        	sourceUserName=sourceUserName+sourceUserListRight[i].sourceName;
 	        	tem.push(obj);
         }
         self.sourceUsersList=tem;
         temSourcesList=self.sourceUsersList
        
        }
       
         if(temSourcesList.length<=0){
         		alert("用户来源不能为空，请选择用户来源");
             return ;
         }
         self.add.sourceUsersList=JSON.stringify(temSourcesList);
         self.add.sourceUserName=sourceUserName;
        }
        
      //悟空
      if(self.add.channelCode==0){
        //  续投加息:
        var extendProfitInfo=[];
        for(var i in self.productsList){
        		var objproject={};
        		var objleve={};
        		for(var j in self.typeleveList){
        			var key=self.productsList[i].productType + self.typeleveList[j].code+"";
        			var value = $("#"+key).val();
        			value = removeAllSpace(value);// 去掉多余空格
        			/*if(self.add.channelCode==1){
        				if(!value){
            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续投加息必填")
            				return false;
            			}
        			}else{
        				if(!value){
        					value=-1;
            			}
        			}*/
        			if(!value){
    					value=-1;
        			}
        			//验证数字：
        			if(!checkNum(value)){
        				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续期加息格式不对")
        				return false;
        			}
        			/*if(self.add.channelCode==1){
        				if(value>3 || value<0){
	            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续投加息在0~3之间")
	            				return false;
	            		           //swalMsg("请输入0~5之间的数字");
	            		  }
        				if(!checknumKeepTwoPoint(value)){
            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续投加息最多支持2位小数")
            				return false;
                 			// swalMsg("最多支持2位小数");
                 	}
        			} else{
        				if(value>3 || value<-1){
            				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续投加息在-1~3之间")
            				return false;
            		           //swalMsg("请输入0~5之间的数字");
            		  }
          		}*/

        			if(value>3 || value<-1){
        				alert(self.productsList[i].productName+"的" +self.typeleveList[j].name+"续期加息在-1~3之间")
        				return false;
        		           //swalMsg("请输入0~5之间的数字");
        		  }  
        			objleve[self.typeleveList[j].code]=value;
        		}
        		objproject[self.productsList[i].productType]=objleve;
        		extendProfitInfo.push(objproject);
        }
        
      //   self.add.extendProfitInfo=JSON.stringify(extendProfitInfo);
        
         //推荐标签
         if(!self.add.recommendMarkingText){
            alert("推荐标签不能为空");
            return ;
         }
        
         self.add.extendProfitInfo=JSON.stringify(extendProfitInfo);
      }else{
    	  var sourceUser="";
    	  for(var i in self.sourceUserListRight){
    		  sourceUser=sourceUser+self.sourceUserListRight[i].sourceCode+",";
    	  }
    	  self.add.sourceUser=sourceUser;
    	  if(self.rateProductList.length==0 && updateFlage==0){
    		  alert("利率配置不能为空!");
    		  return;
    	  }
    	  if(self.sourceUserListRight.length!=self.rateProductList.length){
    		  alert("利率配置不能为空！");
			  return;
    	  }/*else{
    		  for(var i in self.rateProductList){
    			  var su = self.rateProductList[i].recomLable;
    			  var ra = self.rateProductList[i].rateDeployList;
    			  if(su==""|| ra.length==0){
    				  alert("利率配置不能为空！");
    				  return;
    			  }
    		  }
    	  }*/
    	 /* if(updateFlage==1){
    		  var extendProfitInfo =JSON.parse(self.dataInfo.extendProfitInfo);
              for(var i in extendProfitInfo){
             	 	var obj= extendProfitInfo[i];
             	 	for(var j in self.rateProductList){
             	 	  var  su =	self.rateProductList[j].sourceUser;
             	 	  if(obj.sourceUser!=su){
             	 		  self.rateProductList.push(obj);
             	 	  }
             	 	}
              }
    	  }*/
    	 self.add.extendProfitInfo=JSON.stringify(self.rateProductList);
    	  
      }
        // 上线时间，下线时间
        self.add.onlineTime = $('#addOnlineTime').val()+"";
        self.add.offlineTime = $('#addOfflineTime').val()+"";
        if(!self.add.onlineTime || !self.add.offlineTime){
            alert("上线时间下线时间不能为空");
            return;
        }
        
        var offlineTime =self.add.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime="23:59:59";
        /**
        var miniTime=offlineTimes[1].replace("00","23");// 将第一个00替换成23
        miniTime = miniTime.replace('00',"59").replace('00',"59");
        **/
        self.add.offlineTime = offlineTimes[0]+" "+miniTime;
        
        if(self.add.offlineTime<=self.add.onlineTime){
        	alert("下线时间必须大于上线时间");
            return;
        }
       // 续投描述
        if(!self.add.desc){
            alert("续期描述不能为空");
            return ;
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
        	 url = globalConfig.basePath+"/xvtou/addXvTou";
        }else{
        	url = globalConfig.basePath+"/xvtou/editXvTou";
        }
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
               // self.reset();
                //self.loading();
                self.operationType = 0;
                self.querySplashConfigList(1);
                
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    } 
    
    
    
 //************************续投查看**************************   
    //查看
    self.check = function(query){
    	 	self.showPopup=query;
        $('#showPopupCheck').show();
    }   
    
    self.checkOKAndNO=function(){
    		$('#showPopupCheck').hide();
    }
    
 
//************************修改*****************************
    self.pullXvtouConfigAll=function(){
	var url = globalConfig.basePath+"/xvtou/getLevelAll";
	$http({
        method: 'GET',
        url: url,
    }).then(
        function(data){
        	if(data.data.code=="000"){
        		self.typeleve00 =data.data.resp['00'].leve;
        		self.typeleve10 =data.data.resp['10'].leve;
        		self.typeleve01 =data.data.resp['01'].leve;
        		self.typeleve11 =data.data.resp['11'].leve;
        		self.productList00 =data.data.resp['00'].productList;
        		self.productList01 =data.data.resp['01'].productList;
        		self.productList10 =data.data.resp['10'].productList;
        		self.productList11 =data.data.resp['11'].productList;
        	}else{
        		alert(data.data.message);
        	}
//            self.initProductList={};
//            for(var i in self.productList){
//            		var key =self.productList[i].code;
//            		self.initProductList[key]=self.productList[i];
//            }
        },function errorCallback(response) {
            alert("请求失败了....");
        }
    		);
    }

   self.pullXvtouConfigAll();//全局配置信息
    
   
    
   	self.isSelected = function(id){
       return self.continuationTypeInfo.indexOf(id)>=0;
	 } 
   	
   	$scope.detailJX=function(para){
   		alert("请求失败了...."+para);
   		return;
   	}
  //查看详情
    $scope.detailShowNew = function(query){
    	self.deShow=1;
    	self.initSourceList();
   	    self.dataInfo = query;
		self.pullXvtouConfigAll();//更新全局配置信息
		self.operationType = 6;
		//self.add={};
	 	self.edit=angular.copy(query);
		//self.pullXvtouConfigAll(query.channelCode,query.continuationType);
	 	self.xvtouConfigAll(query.channelCode,query.continuationType);
   
	 	//self.edit.auditPerson="";
	 	self.edit.channelCode=self.edit.channelCode+"";
	 	self.edit.continuationType=self.edit.continuationType+"";
 	
	 	// 处理下拉框问题
	 	$("#editChannelCode").attr('disabled','disabled');
	 	$("#editcontinuationType").attr('disabled','disabled');
 	
 	// 处理类型详情
	 	var tpyeinfo=self.edit.continuationTypeInfo;
	 	self.continuationTypeInfo=self.edit.continuationTypeInfo;
  	
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
	
   //处理钱包的用户来源
     if(query.channelCode==1){
    		var userRight=[];
    	  	var sourceUsersList =JSON.parse(query.sourceUsersList);
    	  	for(var i in sourceUsersList){
    	  		var obj={};
    	  		
            	obj['sourceCode']=sourceUsersList[i].sourceType;
            	obj['sourceName']=sourceUsersList[i].sourceName;
    	  		userRight.push(obj);
    	  	}
    	  	
    	  	var userTem= self.sourceUserList;
    	  	var userLeft=[];
    	  	for(var j in userTem){
    	  		for(var i in userRight){
    		  		if(userRight[i].sourceCode==userTem[j].sourceCode){
    		  			userTem.splice(j,1);
    		  			//left.push(tem);
    		  		}
    		  	}
    	  	}
    	  	self.sourceUserListRight=userRight;
    	  	self.sourceUsersList=tem;
     }
 if(query.channelCode==0){ 
	// 续投加息
 var url = globalConfig.basePath+"/xvtou/getContinuationTyp?channal="+ query.channelCode+"&type="+query.continuationType;
	$http({
        method: 'GET',
        url: url,
    }).then(
        function(data){
            self.typeleve =data.data.resp;
            self.initTypeleve={};
           
            for(var i in self.typeleve){
            		var key =self.typeleve[i].code;
            		self.initTypeleve[key]=self.typeleve[i];
            }
            var extendProfitInfo =JSON.parse(self.edit.extendProfitInfo);
            for(var i in extendProfitInfo){
           	 	var objs= extendProfitInfo[i];
           	 	for(var key in objs ){
           	 		var value = objs[key];
           	 		for(var k in value){
           	 			var v = value[k];
           	 			var selector = key+k+"";
           	 			$("#edit"+selector).val(v);
           	 			self[selector]=v;
           	 		}
           	 	}
            }
        },function errorCallback(response) {
            alert("请求失败了....");
        }
    );
  }
}
    
   	// 修改
    self.update = function(query){
    	self.deShow=0;
    	self.initSourceList();
    	 self.dataInfo = query;
    		self.pullXvtouConfigAll();//更新全局配置信息
    		if(query.channelCode==0){
    			self.pullXvtouTye(query.continuationType);
    		}
    		self.operationType = 1;
    		//self.add={};
    	 	self.add=angular.copy(query);
    		//self.pullXvtouConfigAll(query.channelCode,query.continuationType);
    	 	self.xvtouConfigAll(query.channelCode,query.continuationType);
       
    	 	self.add.auditPerson="";
     	self.add.channelCode=self.add.channelCode+"";
     	self.add.continuationType=self.add.continuationType+"";
     	//if(query.operationType!=0){//非添加状态
     		if(query.offlineTimeTmp)
     			self.add.offlineTime=query.offlineTimeTmp;
     		if(query.onlineTimeTmp)
     			self.add.onlineTime=query.onlineTimeTmp;
     //	}
     	
     	// 处理下拉框问题
     	 $("#addChannelCode").attr('disabled','disabled');
     	 $("#continuationType").attr('disabled','disabled');
     	
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
    	//处理钱包的用户来源
         if(query.channelCode==1){
        		var userRight=[];
        	  	var sourceUsersList =JSON.parse(query.sourceUsersList);
        	  	for(var i in sourceUsersList){
        	  		var obj={};
        	  		
                	obj['sourceCode']=sourceUsersList[i].sourceType;
                	obj['sourceName']=sourceUsersList[i].sourceName;
        	  		userRight.push(obj);
        	  	}
        	  	
        	  	var userTem= self.sourceUserList;
        	  	var userLeft=[];
        	  	for(var p in userTem){
        	  		for(var q in userRight){
        	  		//	console.log(p+"=="+userTem[p].sourceCode+"=="+userRight[q].sourceCode);
        		  		if(userTem[p].sourceCode==userRight[q].sourceCode){
        		  			userTem.splice(p,1);
        		  			//userLeft.push(userTem[p])
        		  		}
        		  	}
        	  	}
        	  	self.sourceUserListRight=userRight;
        	  	self.sourceUserList=userTem;
         }
   if(query.channelCode==0){
    	// 续投加息
     var url = globalConfig.basePath+"/xvtou/getContinuationTyp?channal="+ query.channelCode+"&type="+query.continuationType;
    	$http({
            method: 'GET',
            url: url,
        }).then(
            function(data){
                self.typeleve =data.data.resp;
                self.initTypeleve={};
               
                for(var i in self.typeleve){
                		var key =self.typeleve[i].code;
                		self.initTypeleve[key]=self.typeleve[i];
                }
                var extendProfitInfo =JSON.parse(self.add.extendProfitInfo);
                for(var i in extendProfitInfo){
               	 	var objs= extendProfitInfo[i];
               	 	for(var key in objs ){
               	 		var value = objs[key];
               	 		for(var k in value){
               	 			var v = value[k];
               	 			var selector = key+k+"";
               	 			$("#"+selector).val(v);
               	 			self[selector]=v;
               	 		}
               	 	}
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    	
       }
	}

    
    //默认查询
    self.loading = function(){
    		self.search.channelCode='0';
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
	    	//self.detailPullXvtouTye($scope.detail.channelCode,$scope.detail.continuationType);
	    	var channelCode = $scope.detail.channelCode;
	    	var continuationTyp = $scope.detail.continuationType
	    	if(!channelCode){
	    		channelCode=0;
	    	}
	    	// 续投类型
	    	//var continuationTyp = self.add.continuationTyp;
	    	if(!continuationTyp){
	    		continuationTyp=0;
	    	}
	    	self.xvtouConfigAll(channelCode,continuationTyp);
	    	var url = globalConfig.basePath+"/xvtou/getContinuationTyp?channal="+channelCode+"&type="+continuationTyp;
	    	$http({
	            method: 'GET',
	            url: url,
        }).then(
            function(data){
                self.typeleve =data.data.resp;
                self.initTypeleve={};
               
                for(var i in self.typeleve){
                		var key =self.typeleve[i].code;
                		self.initTypeleve[key]=self.typeleve[i];
                }
                var continuationTypeInfo = $scope.detail.continuationTypeInfo;
            	var vipLevels = continuationTypeInfo.split(",");
            	var vipList;
            	for(var i = 0; i < vipLevels.length; i++) {
            		var vipCode = vipLevels[i];
            		self.vipList[i] = self.initTypeleve[vipCode].name;
            	}
            	var extendProfitInfoList = JSON.parse( $scope.detail.extendProfitInfo );
            	for(var i = 0; i < extendProfitInfoList.length; i++) {
            		var extendProfitInfo = extendProfitInfoList[i];
            		var proType = $scope.detail.productsList[i].productType;
            		var info = extendProfitInfo[proType];
            		self.infoAarry[i]=new Array();
            		for(var j=0;j<vipLevels.length;j++){
            			var vipCode = vipLevels[j]+"";
            			self.infoAarry[i][j] = info[vipCode];
            		}
            	}
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
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
        var url = globalConfig.basePath+"/xvtou/offline";
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
            swalMsg(response);
        });
    };
    
    // 审核
    $scope.confirm = function(){       
        var url = globalConfig.basePath+"/xvtou/auditing";
        $scope.confirmRecord.auditStatus = $scope.auditStatus;
        $scope.confirmRecord.auditDescription = $scope.auditDescription;
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            
            if(callback.data.code == '000'){
            	 $('.take-start-box').hide();
            	alert("操作成功");
            	$scope.querySplashConfigList(1);
            } else {
                console.log(callback.data);
                alert(callback.data.message);
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    
    //查看拉取产品
    self.detailPullXvtouTye=function(channelCode,continuationTyp){
	if(!channelCode){
		channelCode=0;
	}
	// 续投类型
	//var continuationTyp = self.add.continuationTyp;
	if(!continuationTyp){
		continuationTyp=0;
	}
	var url = globalConfig.basePath+"/xvtou/getContinuationTyp?channal="+channelCode+"&type="+continuationTyp;
	$http({
        method: 'GET',
        url: url,
    }).then(
        function(data){
            self.typeleve =data.data.resp;
            self.initTypeleve={};
            for(var i in self.typeleve){
            		var key =self.typeleve[i].code;
            		self.initTypeleve[key]=self.typeleve[i];
            }
        },function errorCallback(response) {
            alert("请求失败了....");
        }
    );
  }
}]);
   



