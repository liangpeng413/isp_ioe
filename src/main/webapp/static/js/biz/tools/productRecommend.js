'use strict';// 严谨模式
var App = angular.module('xvtouApp', [], angular.noop);
App.controller('productRecommendController',['$scope','$http', function($scope,$http) {
	$scope.loginName = globalConfig.loginName;
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
    self.fundYBBase={
    	"tenthou_unit_incm":"万份收益",//	string	只有货币基金返回
		"unit_net_chng_pct_7_day":"七日年化",
    	"unit_net_chng_pct_1_mon":"近一月",//	string	只有非货币基金返回
    	"unit_net_chng_pct_1_year":"近一年",//	string	只有非货币基金返回
    	"unit_net_chng_pct_2_year":"近两年",//	string	只有非货币基金返回
    	"unit_net_chng_pct_3_mon":"近三月",//	string	只有非货币基金返回
    	"unit_net_chng_pct_3_year":"近三年",//	string	只有非货币基金返回
    	"unit_net_chng_pct_5_year":"近五年",//	string	只有非货币基金返回
    	"unit_net_chng_pct_6_mon":"近六月",//	string	只有非货币基金返回
    	"unit_net_chng_pct_base":"成立以来",//	string	只有非货币基金返回
    	"unit_net_chng_pct_tyear":"今年以来"
};
    self.fundYieldHBBase=[
    		{"code" :"tenthou_unit_incm","label":"万份收益"},//	string	只有货币基金返回
    		{"code" :"unit_net_chng_pct_7_day","label":"七日年化"}
    ];
    self.fundYieldFHBBase=[
    	{"code" :"unit_net_chng_pct_1_mon","label":"近一月"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_1_year","label":"近一年"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_2_year","label":"近两年"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_3_mon","label":"近三月"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_3_year","label":"近三年"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_5_year","label":"近五年"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_6_mon","label":"近六月"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_base","label":"成立以来"},//	string	只有非货币基金返回
    	{"code" :"unit_net_chng_pct_tyear","label":"今年以来"}
    ];
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

    self.queryWhiteAndBlack();


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
  // *****************************产品推荐************************************************

 //    var self = $scope;
    self.copy={};// 全局copy模块
    self.openCopy=function(){
    	$('.pop_zl').css({"display":"block"});
    	// $('#copyUrl').show();
    	 self.copy.productChannel="1";
    	 $("#copymultipleUrl").removeAttr('disabled');
     	 $("#copynetUrl").removeAttr('disabled');
    	 self.changeUrl(self.copy.productChannel);
    }


    self.changeUrl = function(productChannel){
    	 self.copy.productChannel=productChannel;
    	 var url = globalConfig.basePath+"/product/getCopyUrl";
    	 $http.post(url,self.copy).then(
 	            function(data){
 	            	$('.span_lh').text(data.data.resp.mltipleUrl);
  	                $('.span_zl').text(data.data.resp.netUrl);
 	            },function(response) {
 	                alert("请求失败了....");
 	            }
 	        );
    }

    /**
     * 关闭复制弹窗
     */
    self.closeCopy= function(){
    	 $('#copyUrl').hide();
    }

    /**
     * 拷贝内容到剪贴板
     */
    self.copyContext=function(flage){
    	if(flage==1){
    		// 复制
    		new Clipboard('.btn_zl')
    		alert("复制成功！");
    	}else{
    		// 复制
    		 new Clipboard('.headleCopy')
    		 alert("复制成功！");

    	}

    }


    self.search={};
    self.search.productChannel='1';

    self.searchproductChannel=function(){
    	self.search.producttype="";
    	self.search.auditStatus="";
    	self.search.position="";
    }

    self.searchproducttype=function(){
    	self.search.auditStatus="";
    	self.search.position="";
    }

    // 重置
    self.reset=function(){
    	 self.search.productChannel="1";//渠道产品
    	 self.search.status="";
    	 self.search.producttype="";
    	 self.search.auditStatus="";
    	 self.search.position="";
         self.search.valid="";
         self.search.showType="";
    }




    /**
     * 查询推荐
     */
    self.searchProduct = function(pageNum){

    		if(!pageNum){
            self.search.pageNo = self.page.pageNo==0?1:self.page.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                self.search.pageNo=self.search.pageCount==0?1:self.search.pageCount;
            }else{
                self.search.pageNo = pageNum==0?1:pageNum;
            }
        }
    	self.search.pageNum = self.search.pageNo==0?1:self.search.pageNo;
        var url = globalConfig.basePath+"/product/list";
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

    //默认查询
    self.loading = function(){
		self.search.productChannel='1';
		self.search.status='';
		self.operationType = 0;
		self.search.continuationType='0';
		self.search.auditStatus = "";
        self.search.pageSize = "5";
        self.searchProduct(1);
    }
    self.loading();


  //******************下线***************************
    self.effectRecord={};
    self.offline=function(x){
    	 //$('#showStart').show();
    	 $('#takeEffect').show();
         self.effectRecord.valid=x.valid;
         self.effectRecord.id = x.id;
         self.effectRecord.auditStatus = x.auditStatus;
        self.effectRecord.recommend = x.recommend;
    }

    //确定失效生效公告
    self.confirmStart = function(id,valid,auditStatus){
        if(valid==0){
            valid=1;
        }else if(valid==1){
            valid=0;
        }
        var url = globalConfig.basePath+"/product/takeEffect";
        $http.post(url, self.start).then(
            function(data){
            	alert(data.data.message);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
        self.searchProduct(1);
    }


    $scope.validateRecord = function(id,valid,auditStatus){
  	  // 审核人
      //var auditPerson = self.effectRecord.auditPerson;
   /*   if(!self.effectRecord.auditPerson.no){
          alert("审核人不能为空");
          return ;
      }else{
       	self.effectRecord.auditNo=self.effectRecord.auditPerson.no;
       	self.effectRecord.requestAuditPersonEmail=self.effectRecord.auditPerson.email;
       	self.effectRecord.auditPerson=self.effectRecord.auditPerson.name;
      }*/

		if(self.effectRecord.valid==1){
			self.effectRecord.valid=0;
		}else{
			self.effectRecord.valid=1;
		}

  		var url = globalConfig.basePath+"/product/takeEffect";
      $http.post(url,self.effectRecord).then( function(data){
      	 $('#takeEffect').hide();
          	if(data.data.code == '000'){
          		 alert(data.data.message);
          		 $scope.searchProduct(1);
          	}
          },function(response) {
              alert("请求失败了....");
          }
      );


  };

    //取消生效失效公告
    self.cancelStart = function(){
        $('#showStart').hide();
    }

    self.add={};
  //******************添加***************************
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    //添加提醒状态地址
    $('#addHeadimageurl').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
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

    // 网贷
    $('#addNetButtonimageurl').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#addNetfileUrl1').prop("value",fileUrl);
            $('#addNetimage_prew1').prop("src",fileUrl);
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

    // 基金
    $('#addFundButtonimageurl').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#addFundfileUrl1').prop("value",fileUrl);
            $('#addFundimage_prew1').prop("src",fileUrl);
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

    // 保险
    $('#addInsuranceimageurl').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#addInsurancefileUrl1').prop("value",fileUrl);
            $('#addInsuranceImage_prew1').prop("src",fileUrl);
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

    // 银行精选
    $('#addBankimageurl').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 5,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#addBankfileUrl1').prop("value",fileUrl);
            $('#addBankImage_prew1').prop("src",fileUrl);
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

    // 返回
    self.addBack=function(){
    	self.operationType=0;
     	self.add.position="";
    	self.addRight=[];
	    self.addLeft=[];
	    self.addProductListRight=[];// 添加的右侧栏框
	    // 排序数据
	    self.addSortIdList=[];
	    self.addProductListBelow=[];
	    $("#searchShop").val("");
    }
    //
    self.addProducttype=function(operationType){
    	self.add.position="";
    	self.addRight=[];
	    self.addLeft=[];
	    self.addProductListRight=[];// 添加的右侧栏框
	    // 排序数据
	    self.addSortIdList=[];
	    self.addProductListBelow=[];
	    $("#searchShop").val("");

    }


    self.addproduct= function(){
    	 self.add={};

    	 self.add.productChannel='1';
    	 self.add.producttype='';

    	 self.add.showType="0";
    	 // 初始化数据
	     self.addRight=[];
	     self.addLeft=[];
	     self.addProductListRight=[];// 添加的右侧栏框
	     // 排序数据
	     self.addSortIdList=[];
	     self.addProductListBelow=[];
	     self.addSearchProductList=[];
	     self.operationType=1;
	     // 晴空之前的数据
	     self.netList=[];
	     self.fundList=[];
	     self.insuranceList=[];
	     self.bankList=[];
        self.add.rosterType= "NO_RULE";
        $('#userNameLikeSearch').hide();
        $('#showAdd').show();
    }

    // 更改位置
    self.addChangePosition=function(postion,kind,cloneType){

    	if(cloneType!=2){
            if( !self.add.productChannel){
                alert("渠道不能为空");
                return;
            }
            if( !self.add.producttype){
                alert("产品类型不能为空");
                return;
            }
            if( !self.add.position){
                alert("推荐位置不能为空");
                return;
            }
        }else{
            if( !self.edit.productChannel){
                alert("渠道不能为空");
                return;
            }
            if( !self.edit.producttype){
                alert("产品类型不能为空");
                return;
            }
            if( !self.edit.position){
                alert("推荐位置不能为空");
                return;
            }
        }

    	if(!kind){
    		if(postion==2 || postion==3 || postion==5 || postion==6001){
    			 self.add.kind=1+'';
        	}else if(postion==4){
                self.add.kind=3+'';
            }
    	}else{
    		//$("#searchShop").val("");
    		self.add.productInfo=""
    		return;
    	}

    	//self.add.productInfo="210012";
    	if(!self.add.productInfo){
    		 return;
    	}


  		var url = globalConfig.basePath+"/product/productDetail";
    	//var url = globalConfig.basePath+URIStr;
        $http.post(url,self.add).then( function(data){
        	if(data.data.code == '000'){
        	    //网贷
        		if(postion==1){
        			 self.addSearchProductList=data.data.resp.data;
        		}
        		//多资产或玖富商城多资产位置
        		if(postion==2 || postion==6001){
                    //基金
        			if(kind==1){
        				if(data.data.resp.resCode=='0000'){
        					var listtem=[];
            				listtem.push(data.data.resp.data);
            				 self.addSearchProductList=listtem;
	        			}else{
	        				alert(data.data.resp.resMsg);
	        			}
        			}
        			if(kind==2){// 保险
        				if(data.data.code=='000'){
        					self.addSearchProductList=data.data.resp;
        				}else{
        					alert(data.data.message);
        				}
    				}
                    if(kind==3){// 银行精选
                        if(data.data.code=='000'){
                            self.addSearchProductList=data.data.resp;
                        }else{
                            alert(data.data.message);
                        }
                    }
       		}

        	}else{
        		alert(data.data.message);
        	}
        },function(response) {
            alert("请求失败了....");
        }
      );

    }

    //排序操作开始
    self.stort = function(){
        var	searchproductChannel=$("#searchproductChannel").val();
        if(!searchproductChannel){
            alert("请在查询条件中选择渠道");
            return;
        }
      var producttype = $("#producttype").val();
        if(!producttype){
           alert("请选择产品类型");
           return;
        }

        var position =$("#position").val();
        if(!position){
            alert("请选择推荐位置");
            return;
        }
        $('#showPriority').show();
        var url = globalConfig.basePath+"/product/selectProductSort?productChannel="+searchproductChannel+"&producttype="+producttype+"&position="+position;
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
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
    }


    //确定排序
    self.moveCommit = function(){
        var url = globalConfig.basePath+"/product/moveProductCommit";
        $http.post(url,self.strotList).then(
            function(data){
                alert(data.data.message);
                self.searchProduct(1);
                $('#showPriority').hide();
                self.strotList = {};
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    //排序取消
    self.moveCancel = function(){
        $('#showPriority').hide();
        self.strotList={};
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
                    var move0 = self.strotList[me];// 下一个banner
                    move0.priority=Number($(this).val())+Number(1);
                    var move1 = self.strotList[me+1];// 下一个banner
                    move1.priority=Number($(this).val());
                    self.strotList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    self.strotList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }

    //排序删除
    self.remove = function(){
        var length = self.strotList.length;
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
                var me =$(this).val()-1;
                self.strotList.splice(me,1);
            }
        })
        for(var i=0;i<length-1;i++){
            self.strotList[i].priority = i+1;
        }
    }
/****************** 排序操作结束*****************************/

    // 查询
    self.addSearchProduct=function(){

    	if( !self.add.productChannel){
    		alert("渠道不能为空");
            return;
    	}
    	if( !self.add.producttype){
    		alert("产品类型不能为空");
            return;
    	}
    	if( !self.add.position){
    		alert("推荐位置不能为空");
            return;
    	}
    	var postion=self.add.position;
    	var kind=self.add.kind;

    	//self.add.productInfo="210012";
    	if( !self.add.productInfo){
    		alert("请输入查询条件");
            return;
    	}
    	if((self.add.position==2 || self.add.position==5) &&kind==1 && self.add.productInfo.length!=6 && self.add.productChannel != 0){
    		alert("请正确输入6位数基金代码");
            return;
    	}


  		var url = globalConfig.basePath+"/product/productDetail";
        $http.post(url,self.add).then( function(data){
        	if(data.data.code == '000'){
        	    //网贷位置
        		if(postion==1 || postion==6 || postion==7 || (postion==2 && self.add.productChannel==0)){
        			if(data.data.resp.code=='000000'){
        				 self.addSearchProductList=data.data.resp.data;
            			 if(!self.addSearchProductList ||self.addSearchProductList.length<=0){
            				 alert("未查到相应的结果");
            			 }
        			}else{
        				alert("网贷接口返回状态码:"+data.data.resp.code+" 信息:"+data.data.resp.message);
        			}

        		}
        		if(((postion==2 || postion==5)&& self.add.productChannel!=0) || postion==3 || postion==4 || postion==6001){
        			if(kind==1){
        				if(data.data.resp.resCode=='0000'){
        					var listtem=[];
            				listtem.push(data.data.resp.data);
            				 self.addSearchProductList=listtem;
            				 if(self.addSearchProductList.length<=0){
                				 alert("未查到相应的结果");
                			 }
	        			}else{
	        				alert("基金接口返回状态码:"+data.data.resp.resCode+" 信息:"+data.data.resp.resMsg);
	        			}
        			}
        			if(kind==2){// 保险
        				if(data.data.code=='000'){
        					self.addSearchProductList=data.data.resp;
        					if(!self.addSearchProductList ||self.addSearchProductList.length<=0){
               				 	alert("未查到相应的结果");
               			 	}
        				}else{
        					alert(data.data.message);
        				}

    				}

    				if(kind==3){ //银行精选
        			    if(data.data.code=='000'){
                            self.addSearchProductList=data.data.resp;
                            if(!self.addSearchProductList ||self.addSearchProductList.length<=0){
                                alert("未查到相应的结果");
                            }
                        }else{
                            alert(data.data.message);
                        }
                    }
       		}

        	}else{
        		alert(data.data.message);
        	}
        },function(response) {
            alert("请求失败了....");
        }
      );

    }




    self.addRight=[];
    self.addLeft=[];
    self.addProductListRight=[];// 添加的右侧栏框
    // 排序数据
    self.addSortIdList=[];
    // 右边移动
    self.addSuerRight=function(){
    	$('.productListLeft').each(function() {// 获取选中的数据
	    	if(this.checked == true) {
	    	  	var key = $(this).val();
	    	  	var obj={};
	    	  	//obj.id=key;
	    	  	var nameStr=$(this).context.labels[0].innerText;
	    	  	if(self.add.producttype==1){
	    	  		// 处理ID
	    	  		var keyObj =JSON.parse(key);
	    	  		obj.id=self.showValue(keyObj,self.add.productChannel);// ID或者类型
	    	  		obj.productCat=keyObj.productCat;//第一大类
	    	  		obj.productSecondCat=keyObj.productSecondCat;// 第二大类
                    if(keyObj.productCat=='6' || keyObj.productCat=='8'){
                        obj.name=nameStr;
                    }else{
	    	  		// 名称处理
                    if(self.add.productChannel==0){
	    	  		    nameStr=nameStr.substr(0,nameStr.length-14);
                    } else{
                        nameStr=nameStr.substr(0,nameStr.length-4);
                    }
	    	  		var ns = nameStr.split("-");
		    	  	if(ns.length>2){
		    	  		obj.name=ns[1]+"-"+ns[2];;
		    	  	}else{
		    	  		obj.name=nameStr;
		    	  	}
                   }
                    obj.productPeriod=keyObj.productPeriod;
                    //银行精选
	    	  	}else if(self.add.kind==3){
                    var bankObj =JSON.parse(key);
                    var bankNa = nameStr.split("-");
                    obj.name= bankNa[1]+"-"+bankNa[2];
                    obj.bankCode = bankObj.bankCode;
                    obj.bankProductId = bankObj.bankProductId;
                   // obj.id=bankObj.id;
                    obj.id = bankObj.bankCode+"-"+bankObj.bankProductId;
                }else{
	    	  		obj.id=key;
	    	  		obj.name=nameStr;
	    	  	}

	    	  	//设置产品期限
	    	  	obj.type=self.add.producttype;
	    	  	obj.kind=self.add.kind;
	    	  	obj.recommendation="--";
	    	  	obj.buttonText="--";
	    	  	obj.buttonImageUrl="--";
	    	  	obj.onlinetime ="";
	    	  	obj.offlinetime ="";
	    	  	//$(this).context.nextSibling.style.backgroundColor="white";
	    	  	this.parentNode.parentNode.style.backgroundColor="white";
	    	  	this.checked=false;

	    	  	//obj.name=
	    	  	var count=0;
	    	  	if(self.addRight.length<=0){
	    	  		self.addRight.push(obj);
	    	  		self.addSortIdList.push(obj.id);
	    	  	}else{
	    	  		var len = self.addRight.length;
	    	  		for(var i=0;i<len;i++){// 去重
	        	  		count++;
	        	  		//if(self.addRight[i].id==obj.id && obj.name==self.addRight[i].name){
	        	  		if(self.addRight[i].id==obj.id){
	        	  			alert(obj.name+"-"+obj.id+"已存在该推荐产品");
	        	  			break;
	        	  		}else{
	        	  			if(count==len){
	        	  				 self.addRight.push(obj);
	        	  				 self.addSortIdList.push(obj.id);
	        	  			}
	        	  		}

	        	  	}
	    	  	}
	      }
      self.addProductListRight = self.addRight;
     });

    }


    // 左边移动
    self.addSuerLeft=function(){
    	$('.productListRight').each(function() {// 获取选中的数据
	    	if(this.checked == true) {

	    		var key = $(this).val();
	    	  	var obj={};
	    	  	obj.id=key;
	    	  	obj.name=$(this).context.labels[0].innerText;
	    		var count=0;
	    		var len = self.addRight.length;
    	  		for(var i=0;i<len;i++){// 去重
        	  		count++;
        	  		if(self.addRight[i].id==obj.id && obj.name==self.addRight[i].name){
        	  			self.addRight.splice(i,1);// 删除该元素
        	  			self.addSortIdList.splice(i,1);// 移除数据
        	  			break;
        	  		}
        	  	}
    	 /**
                //TODO 处理网贷
                var lennet = self.netList.length;
                for(var i=0;i<lennet;i++){// 去重
                    if(self.netList[i].productSecondCat==obj.id){
                        self.netList.splice(i,1);// 删除该元素
                        break;
                    }
                }

                //TODO 处理基金
                var lenfound = self.fundList.length;
                for(var i=0;i<lenfound;i++){// 去重
                    if(self.fundList[i].sortid==obj.id ){
                        self.fundList.splice(i,1);// 删除该元素
                        break;
                    }
                }

                //TODO 处理保险
                var lenin = self.insuranceList.length;
                for(var i=0;i<lenin;i++){// 去重
                    count++;
                    if(self.insuranceList[i].sortid==obj.id){
                        self.insuranceList.splice(i,1);// 删除该元素
                        break;
                    }
                }
                **/

	    	}
    	});
    }

    /**
     * 排序向上移动
     */
    self.addSortUp=function(){
    	var count=0;
    	var obj={};
    	$('.productListRight').each(function() {// 获取选中的数据
	    	if(this.checked == true) {

	    		var key = $(this).val();
	    	  	obj.id=key;
	    	  	obj.name=$(this).context.labels[0].innerText;
	    	  	count++;
	    	}
    	});
    	if(count<=0){
    		alert("请选择排序数据!!");
    		return false;
    	}
    	if(count>1){
    		alert("请勿多选排序!!");
    		return false;
    	}

		var len = self.addRight.length;
  		for(var i=0;i<len;i++){// 去重
	  		if(self.addRight[i].id==obj.id && obj.name==self.addRight[i].name){
	  			//self.addRight.splice(i,1);// 删除该元素
	  			if(i==0){
	  				alert("哎妈呀到顶了!");
    	  			break;
	  			}else{
	  				var curobj =self.addRight[i];//当前的选中的
	  				var curUp =self.addRight[i-1];//选中上面的
	  				self.addRight.splice(i-1,1,curobj);
	  				self.addRight.splice(i,1,curUp);
	  				// 排序
	  				self.addSortIdList.splice(i-1,1,curobj.id);// 更新
	  				self.addSortIdList.splice(i,1,curUp.id);// 更新
	  				break;
	  			}
	  		}
	  	}
    }

    /**
     * 排序乡下移动
     */
    self.addSortDown=function(){
    	var obj={};
    	var count=0;
    	$('.productListRight').each(function() {// 获取选中的数据
	    	if(this.checked == true) {

	    		count++;
	    		var key = $(this).val();
	    	  	obj.id=key;
	    	  	obj.name=$(this).context.labels[0].innerText;
	    	}
    	});
    	if(count<=0){
    		alert("请选择排序数据!!");
    		return false;
    	}
    	if(count>1){
    		alert("请勿多选排序!!");
    		return false;
    	}


		var len = self.addRight.length;
  		for(var i=0;i<len;i++){// 去重

	  		if(self.addRight[i].id==obj.id && obj.name==self.addRight[i].name){
	  			if(i==(len-1)){
	  				alert("我是有底线的!!");
    	  			break;
	  			}else{
	  				var curobj =self.addRight[i];//当前的选中的
	  				var curDown =self.addRight[i+1];//选中上面的
	  				self.addRight.splice(i+1,1,curobj);
	  				self.addRight.splice(i,1,curDown);

	  			// 排序
	  				self.addSortIdList.splice(i+1,1,curobj.id);// 更新
	  				self.addSortIdList.splice(i,1,curDown.id);// 更新
	  				break;
	  			}
	  		}
	  	}

    }




    // 确认操作
    self.addProductListBelow=[];
    self.addOption=function(){
    	/**
    	 * 主要是清除网贷的数据,如果出现多款相同类型的产品,而利率却不相同.
    	 */
    	//if( self.add.producttype==1 && self.add.position==1){
    	//	self.netList=[];
    	//}
    	self.addProductListBelow=[];
    	self.addProductListBelow=angular.copy(self.addProductListRight);

    }




    // 操作按钮
   self.addNet={};
   self.addNetTemp={};
   self.addFundTemp={};
   self.addFundYieldBO={};
   self.addInsuranceTemp={};
   self.addBankTemp={};
   self.indexMg=1;
   self.labelMasg=1;
    self.upLabelMasg=1;
   self.upIndexMsg=1;
   var detail_divLabel=1;
   self.addOptionProduct=function(x,editType){
	   if(self.add.producttype==1){// 网贷

		   if(editType!=2){
               $('.popups').css({ 'display': 'block' });
               $('.Peer-to-peer').css({ 'display': 'block' });
               $('.fund').css({ 'display': 'none' });
               $('.Insurance').css({ 'display': 'none' });
               $('#bankClass').css({ 'display': 'none' });
           }

           self.addNet={};
           self.addNetTemp={};
           self.addNetTemp=x;
           self.addNet=angular.copy(x);
           self.addNet.recommendation='';
           self.addNet.productChannel=self.add.productChannel;
           self.addNet.producttype=self.add.producttype;
           self.addNet.onlyId=x.id;
           self.addNet.position =self.add.position;
         /* if(self.add.position==1){
              if(x.label!=undefined && x.label!=null && x.label!="" ){
                  var lb =  x.label.split(",");
                  self.addNet.label1=lb[0];
                  self.addNet.label2=lb[1];
              }
          }*/

     		var url = globalConfig.basePath+"/product/productDetail";
            $http.post(url,self.addNet).then( function(data){
           	if(data.data.code == '000'){
           		 //alert(data.data.message);
           		// $scope.searchProduct(1);

           		 //self.addSearchProductList=data.data.resp.data;
           		 for(var i=0;i<data.data.resp.data.length;i++){
           			 if (data.data.resp.data[i].productCat=='T' || data.data.resp.data[i].productCat=='Z'|| data.data.resp.data[i].productCat=='W' || data.data.resp.data[i].productCat=='B' || data.data.resp.data[i].productCat=='A' || data.data.resp.data[i].productCat=='D' || (data.data.resp.data[i].productCat=='V' && self.addNet.productChannel==0)){// 产品ID--&& self.addNet.productChannel==0
           			//	 if(x.id==data.data.resp.data[i].productId){
           				if(x.id==data.data.resp.data[i].lcProductId){
           					self.addNet =data.data.resp.data[i];
               				self.addNet.additional=self.addNet.productCat
               				self.addNet.maxholdamount=data.data.resp.data[i].maxInvest;
               				self.addNet.serialnotype=1;
               				break;
           				 }
           			 }else{
           			     // 产品类型一致并且期限一致时
           				if(x.id==data.data.resp.data[i].productSecondCat && x.productPeriod==data.data.resp.data[i].productPeriod && data.data.resp.data[i].productCat!='C' && data.data.resp.data[i].productCat!='6' && data.data.resp.data[i].productCat!='8'){
           					self.addNet =data.data.resp.data[i];
               				self.addNet.additional=self.addNet.productCat;
               				self.addNet.maxholdamount=data.data.resp.data[i].maxInvest;
               				self.addNet.serialnotype=0;
               				break; 
           				}else if(x.id==data.data.resp.data[i].productSecondCat && x.productPeriod==data.data.resp.data[i].productPeriod && data.data.resp.data[i].productCat=='C'){
                            self.addNet =data.data.resp.data[i];
                            self.addNet.additional=self.addNet.productCat;
                            self.addNet.maxholdamount=data.data.resp.data[i].maxInvest;
                            self.addNet.serialnotype=2;
                            break;
                        }else if(data.data.resp.data[i].productCat=='6' || data.data.resp.data[i].productCat=='8'){
           				    if(x.productSecondCat==data.data.resp.data[i].productSecondCat && x.productPeriod==data.data.resp.data[i].productPeriod){
                                self.addNet =data.data.resp.data[i];
                                self.addNet.additional=self.addNet.productCat;
                                self.addNet.maxholdamount=data.data.resp.data[i].maxInvest;
                                self.addNet.serialnotype=3;
                                break;
                            }
                        }
           			 }
           		 }
           		 // 处理显示倒计时
           		self.addNet.showtime=false;
           		for(var i=0;i<self.netList.length;i++){
           		 if (self.netList[i].productCat=='T' || self.netList[i].productCat=='Z' || self.netList[i].productCat=='W' || self.netList[i].productCat=='B' || self.netList[i].productCat=='A' || self.netList[i].productCat=='D'  || (self.netList[i].productCat=='V' && self.add.productChannel==0)){// 产品ID--&& self.add.productChannel==0
           		//	if(self.addNet.productId==self.netList[i].productId){
           			if(self.addNet.lcProductId==self.netList[i].lcProductId){
           				self.addNet=self.netList[i];
           				break;
           			}
           		 }else{
           			if(self.addNet.productSecondCat==self.netList[i].productSecondCat
                        && self.addNet.productPeriod == self.netList[i].productPeriod){
           				self.addNet=self.netList[i];
           				break;
           			}
           		 }
           		}
                self.addNet.onlinetime = x.onlinetime;
                self.addNet.offlinetime = x.offlinetime;

           	}
           },function(response) {
               alert("请求失败了....");
           }
         );
	   }

	   if((self.add.producttype==2|| self.add.producttype==3) && x.kind==1){// 基金

           if(editType!=2) {
               $('.popups').css({'display': 'block'});
               $('.Peer-to-peer').css({'display': 'none'});
               $('.fund').css({'display': 'block'});
               $('.Insurance').css({'display': 'none'});
               $('#bankClass').css({'display': 'none'});
           }
           self.addFund={};
           self.addFundTemp={};
           self.addFundTemp=x;
           self.addFund=angular.copy(x);
           self.addFund.recommendation='';
           self.addFund.productInfo=x.id;
           self.addFund.productChannel=self.add.productChannel;
           self.addFund.producttype=self.add.producttype;

           self.addFund.onlyId=x.id;

       	   var url = globalConfig.basePath+"/product/productDetail";
            $http.post(url,self.addFund).then( function(data){
           	if(data.data.code == '000'){
           		 //alert(data.data.message);
           		// $scope.searchProduct(1);

           		if(data.data.resp.resCode=='0000'){
           			self.addFund={};
              		self.addFund=data.data.resp.data;
          			self.addFund=angular.copy(x);
          			self.addFund =data.data.resp.data;
          			self.addFund.urltype=1;
          			self.addFund.url=self.addFund.detailUrl;
          			for(var i=0;i<self.fundList.length;i++){ // 数据回显
    	            	if(self.fundList[i].fundCode==self.addFund.fundCode){
                            self.fundList[i].onlinetime = x.onlinetime;
                            self.fundList[i].offlinetime = x.offlinetime;
    	            		self.addFund=angular.copy(self.fundList[i]);
    	            		break;
    	            	}
    	            }
          			self.addFundYieldBO=data.data.resp.data.fundYieldBO;
          			self.addFund.fundYieldHBBase=[];
          			if(data.data.resp.data.fundTypeFlag==0){// 货币
          				self.addFund.fundYieldHBBase= self.fundYieldHBBase;
          			 }else{
          				self.addFund.fundYieldHBBase= self.fundYieldFHBBase;
          			 }
          			//self.fundYieldBase;
          			 // fundYieldHBBase
           		}else{
           			alert("接口返回信息:"+data.data.resp.resMsg);
           		}
           		if(!self.addFund.recommendationRate){
           			self.addFund.recommendationRate=1+'';
           		}
                self.addFund.onlinetime = x.onlinetime;
                self.addFund.offlinetime = x.offlinetime;
                if(!self.addFund.templateType && !self.addFund.yearEarnings){
                    self.addFund.templateType=1+"";
                    self.addFund.yearEarnings=0;
                }

                if(self.addFund.label!=undefined && self.addFund.label!=""){
                    var labelStr = self.addFund.label.split(",");
                    for(var i=0;i<labelStr.length;i++){
                        if(i==0){
                            var label = "label"+[i+1]
                            self[label] = labelStr[i];
                        }else{
                            detail_divLabel++;
                            var ids="messageLabel"+detail_divLabel;
                            var html="<div id='"+ids+"'><br/><div>"
                                +"<span>标签"+detail_divLabel+"</span>"
                                +"<input  type='text' id='label"+detail_divLabel+"' value="+labelStr[i]+">"
                                +"</div>"
                            $('#labelhtml').append(html);
                        }
                        self.labelMasg=detail_divLabel;
                    }

                }



           	}else{
           		alert(data.data.message);
           	}
           },function(response) {
               alert("请求失败了....");
           }
         );
	   }

	   if(self.add.producttype==2 && x.kind==2){// 保险

           if(editType!=2) {
               $('.popups').css({'display': 'block'});
               $('.Peer-to-peer').css({'display': 'none'});
               $('.fund').css({'display': 'none'});
               $('.Insurance').css({'display': 'block'});
               $('#bankClass').css({'display': 'none'});
           }
           self.addInsurance={};
           self.addInsuranceTemp={};
           self.addInsuranceTemp=x;

           self.addInsurance=angular.copy(x);
           self.addInsurance.recommendation='';
           self.addInsurance.productInfo=x.name;
           self.addInsurance.productChannel=self.add.productChannel;
           self.addInsurance.producttype=self.add.producttype;
           self.addInsurance.sort= self.addInsurance.id;
           self.addInsurance.productid= self.addInsurance.id;

           self.addInsurance.onlyId=x.id;

     		var url = globalConfig.basePath+"/product/productDetail";
            $http.post(url,self.addInsurance).then( function(data){
           	if(data.data.code == '000'){

	   			self.addInsurance={};
	      		self.addInsurance=data.data.resp[0];
	      		self.addInsurance.sortid= self.addInsuranceTemp.id;
	            self.addInsurance.productid= self.addInsuranceTemp.id;
	            for(var i=0;i<self.insuranceList.length;i++){
	            	if(self.insuranceList[i].sortid==self.addInsurance.sortid){
                        self.insuranceList[i].onlinetime = x.onlinetime;
                        self.insuranceList[i].offlinetime =x.offlinetime;
	            		self.addInsurance=angular.copy(self.insuranceList[i]);
	            		self.addInsurance.recommendation=self.insuranceList[i].recommendation;
	            		self.addInsurance.buttonimageurl=self.insuranceList[i].buttonimageurl;
	            		self.addInsurance.url=self.insuranceList[i].url;
	            		self.addInsurance.imageurl=self.insuranceList[i].imageurl;
	            		break;
	            	}

	            }
                self.addInsurance.onlinetime = x.onlinetime;
                self.addInsurance.offlinetime = x.offlinetime;
           	}else{
           		alert(data.data.message);
           	}
           },function(response) {
               alert("请求失败了....");
           }
         );
	   }

       if(self.add.producttype==2 && x.kind==3){//银行精选

           if(editType!=2) {
               $('.popups').css({'display': 'block'});
               $('.Peer-to-peer').css({'display': 'none'});
               $('.fund').css({'display': 'none'});
               $('.Insurance').css({'display': 'none'});
               $('#bankClass').css({'display': 'block'});

           }
           self.addBank={};
           self.addBankTemp={};
           self.addBankTemp=x;

           self.addBank=angular.copy(x);
           self.addBank.recommendation='';
           self.addBank.productInfo=x.name;
           self.addBank.productChannel=self.add.productChannel;
           self.addBank.producttype=self.add.producttype;
           self.addBank.sort= self.addBank.bankCode+"-"+self.addBank.bankProductId;
           self.addBank.productid= self.addBank.bankProductId;

           self.addBank.bankCode = x.bankCode
           self.addBank.bankProductId = x.bankProductId;
           self.addBank.onlyId=x.id;

           var url = globalConfig.basePath+"/product/productDetail";
           $http.post(url,self.addBank).then( function(data){
                   if(data.data.code == '000'){

                       self.addBank={};
                       self.addBank=data.data.resp;
                       self.addBank.redictUrl=self.addBank.detailsUrl;
                       self.addBank.redictType=1;
                       self.addBank.sortid= self.addBankTemp.bankCode+"-"+self.addBankTemp.bankProductId;
                       self.addBank.productid= self.addBankTemp.bankProductId;
                       for(var i=0;i<self.bankList.length;i++){
                           if(self.bankList[i].sortid==self.addBank.sortid){
                               self.bankList[i].onlinetime =x.onlinetime;
                               self.bankList[i].offlinetime=x.offlinetime;
                               self.addBank=angular.copy(self.bankList[i]);
                               self.addBank.reasonText=self.bankList[i].reasonText;
                               self.addBank.buttonimageurl=self.bankList[i].buttonimageurl;
                               self.addBank.redictUrl=self.bankList[i].redictUrl;
                               self.addBank.imageurl=self.bankList[i].imageurl;
                               break;
                           }

                       }
                       self.addBank.onlinetime = x.onlinetime;
                       self.addBank.offlinetime = x.offlinetime;
                   }else{
                       alert(data.data.message);
                   }
               },function(response) {
                   alert("请求失败了....");
               }
           );
       }


   }

   var detail_div=1;
   //增加资讯
   self.addMsg=function(){
	   detail_div++;
	   if(detail_div>5){
		   alert("资讯最多添加5条！");
		   return;
	   }
	   var ids="message"+detail_div;
	   var html="<div id='"+ids+"'><br/><div>"
//	   var html='<br/><div id="message"+><div>'
         +"<span>标题"+detail_div+"</span>"
         +"<input  type='text' id='informationTitle"+detail_div+"'>"
         +"</div><br/>"
         +"<div>"
         +"<span>链接"+detail_div+"</span>"
         +"<input  type='text' id='informationUrl"+detail_div+"'>"
         +"</div></div>"
       $('#msg').append(html);

    self.indexMg=detail_div;
   }


    //增加标签
    self.addLabel=function(){
        detail_divLabel++;
        if(detail_divLabel>3){
            alert("标签最多添加3条！");
            return;
        }
        var ids="messageLabel"+detail_divLabel;
        var html="<div id='"+ids+"'><br/><div>"
            +"<span>标签"+detail_divLabel+"</span>"
            +"<input  type='text' id='label"+detail_divLabel+"'>"
            +"</div></div>"
        $('#labelhtml').append(html);

        self.labelMasg=detail_divLabel;
    }

   self.removeMsg =function(){
	   if(detail_div<=1){
		  alert("资讯至少填一条");
		  return;
	   }
	   //detail_div = detail_div - 1;
	   var idMsg = "message" + (detail_div).toString();
      $("#"+idMsg).remove();
      detail_div--;
      self.indexMg=detail_div;
   }


    self.removeLabel =function(){
        if(detail_divLabel<=1){
            alert("标签至少填一条");
            return;
        }
        var idMsg = "messageLabel" + (detail_divLabel).toString();
        $("#"+idMsg).remove();
        detail_divLabel--;
        self.labelMasg=detail_divLabel;
    }

    //计算收益
    self.earningsalculate=function(saveType){
        self.calculateData={};
        if(saveType==0){
            self.calculateData.saveMoneyAmount=self.addFund.saveMoneyAmount;
            self.calculateData.fundCode = self.addFund.fundCode;
        }else if(saveType==1){
            self.calculateData.saveMoneyAmount=self.editFund.saveMoneyAmount;
            self.calculateData.fundCode = self.editFund.fundcode;

        }

         if(!self.calculateData.saveMoneyAmount){
            alert("请输入计算金额");
            return;
         }

        var url = globalConfig.basePath+"/product/calculateEarnings";
        $http.post(url,self.calculateData).then( function(data){
            if(data.data.code == '000'){
                if(saveType==0){
                    self.addFund.yearEarnings = data.data.resp;
                }else if(saveType==1){
                    self.editFund.yearEarnings = data.data.resp;
                }

            }else{
                if(saveType==0){
                    self.addFund.saveMoneyAmount="";
                }else if(saveType==1){
                    self.editFund.saveMoneyAmount="";
                }
                alert(data.data.message);
            }
        },function(response) {
            alert("请求失败了....");
        })

    }
   /**
    * 基金的类型改变
    */
   self.addFundTypeChange=function(fundType){

	   self.addFund.fundrate=self.addFundYieldBO[fundType];

   }

   self.fundList=[];
   self.fundConfirm=function(){

	   if(self.add.producttype==2 && self.add.position==2 && self.add.kind==1){
		   if(!self.addFund.recommendation){
			   alert("网贷推荐语不能为空");
			   return false;
		   }
		   if(!self.addFund.reasonup){
			   alert("推荐理由上不能为空");
			   return false;
		   }
		   if(!self.addFund.reasonleft){
			   alert("推荐理由左不能为空");
			   return false;
		   }
		   if(!self.addFund.reasonright){
			   alert("推荐理由右不能为空");
			   return false;
		   }
	 }else if(self.add.producttype==2 && self.add.position==3 && self.add.kind==1){
		 if(!self.addFund.labelOne){
			 alert("个性标签1不能为空");
			 return false;
		 }
		 if(!self.addFund.labelTwo){
			 alert("个性标签2不能为空");
			 return false;
		 }
		 if(!self.addFund.buttonText){
			alert("按钮文案不能为空");
			return false;
		 }

	 }

	 if(self.add.position==5){
	     if(!self.addFund.templateType){
	         alert("模板类型不能空");
	         return false;
         }

         if(!self.addFund.recommendation){
             alert("推荐语不能为空");
             return false;
         }
         if(!self.addFund.topLeftLabel){
	        alert("左上角标签不能为空");
	        return false;
         }

         if(!self.addFund.buttonText){
             alert("按钮文案不能为空");
             return false;
         }

         if(self.addFund.templateType==2 || self.addFund.templateType==3){
             var label = "";
             for(var i=1;i<=self.labelMasg;i++){
                 var labelStr = $("#label"+i).val();
                 label+=","+labelStr;
             }
             self.addFund.label= label.substring(1);

             if(!self.addFund.label){
              alert("标签至少填写一个！")
                 return;
             }
         }



         if(self.addFund.templateType==3){
             if(!self.addFund.saveMoneyAmount){
                 alert("存钱金额不能为空");
                 return false;
             }

             if(!self.addFund.yearEarnings){
                 alert("预计收益不能为空");
                 return false;
             }
         }
     }

	   if(!self.addFund.fundType){
		   alert("基金类型不能为空");
		   return false;
	   }
	   self.addFund.fundtype=self.addFund.fundType;
	   if(!self.addFund.fundName){
		   alert("基金名称不能为空");
		   return false;
	   }
	   self.addFund.fundname=self.addFund.fundName;
	   self.addFund.fundid=self.addFund.fundCode;
	   self.addFund.fundcode=self.addFund.fundCode;
	   if(!self.addFund.ratetype){
		   alert("利率类型不能为空");
		   return false;
	   }

	   if(!self.addFund.urltype){
		   alert("链接类型不能为空");
		   return false;
	   }

	   if(self.add.producttype==2 && self.add.position==3 && self.add.kind==1){

		   if(!self.addFund.informationTitle1){
			   alert("资讯标题至少填写一条");
			   return false;
		   }

		   if(!self.addFund.informationUrl1){
			   alert("资讯链接至少填写一条");
			   return false;
		   }
		   var content = "";
		  for(var i=1;i<=self.indexMg;i++){
			  var informationTitle = $("#informationTitle"+i).val();
			  var informationUrl = $("#informationUrl"+i).val();
			   content+=',{"informationUrl":"' + informationUrl +'","informationTitle":"' + informationTitle +'"}';
		  }
		  self.addFund.informationUrl= "[" + content.substring(1) + ']';
	 }

	   if(self.addFund.urltype==1){
		   self.addFund.url=angular.copy(self.addFund.detailUrl);
	   }
	   self.addFund.buttonimageurl=$("#addFundfileUrl1").val();
	   self.addFund.sortid=self.addFund.fundCode;

	   // 在添加页面回显
	   //self.addFundTemp=angular.copy(self.addFund);
	   //self.addFundTemp=self.addFund;
	   self.addFundTemp.recommendation=self.addFund.recommendation;
	   self.addFundTemp.buttonImageUrl=self.addFund.buttonimageurl;
	   self.addFundTemp.buttonText = self.addFund.buttonText;
	   if(self.fundList.length<=0){
		   self.fundList.push(self.addFund);
	   }else{
		   var count=0;
		   var len =self.fundList.length;
		   for(var i=0;i<len;i++){// 去重
		  		count++;
		  		if(self.fundList[i].sortid==self.addFund.fundCode){
		  			self.fundList.splice(i,1,self.addFund);//替换相同的网贷产品
		  			break;
		  		}else{
		  			if(count==len){
		  				 self.fundList.push(self.addFund);
		  			}
		  		}
		  	}
	   }

	   $('.popups').css({ 'display': 'none' });
       $('.Peer-to-peer').css({ 'display': 'none' });
       $('.fund').css({ 'display': 'none' });
       $('.Insurance').css({ 'display': 'none' });
       $("#bankClass").css({ 'display': 'none' });
       detail_divLabel=1;
       $('#labelhtml').empty();
   }

   //************************网贷******************************
   // 网贷关闭
   self.netClose=function(){
        $('.popups').css({ 'display': 'none' });
        $('.Peer-to-peer').css({ 'display': 'none' });
        $('.fund').css({ 'display': 'none' });
        $('.Insurance').css({ 'display': 'none' });
        $("#bankClass").css({ 'display': 'none' });
    }
// 基金关闭
    self.fundClose=function(){
        $('.popups').css({ 'display': 'none' });
        $('.Peer-to-peer').css({ 'display': 'none' });
        $('.fund').css({ 'display': 'none' });
        $('.Insurance').css({ 'display': 'none' });
        $("#bankClass").css({ 'display': 'none' });
        $("#labelhtml").empty();
        detail_divLabel=1;

    }
   self.netList=[];
   self.netConfirm=function(){

	   if(!self.addNet.recommendation && self.add.position!=7){
		   alert("网贷推荐语不能为空");
		   return false;
	   }


       if(self.add.position==6){
           if(!self.addNet.rightTopLabel){
               alert("右上角标签不能为空");
               return false;
           }
           if(!self.addNet.buttonName){
               alert("按钮文案不能为空");
               return false;
           }
       }
       if(self.add.position==7 ){

           if(!self.addNet.buttonName){
               alert("按钮文案不能为空");
               return false;
           }

           if(self.add.productChannel==1){
               if(!self.addNet.label){
                   alert("标签文案不能为空");
                   return false;
               }
           }
       }

	   /*if(self.add.position==1){
           self.addNet.label =  self.addNet.label1+","+ self.addNet.label2;
       }*/


	   self.addNet.buttonimageurl=$("#addNetfileUrl1").val();

	   self.addNet.productyield=self.addNet.basicYield;
	   self.addNet.extrayield="0";
	//   self.addNet.serialnotype=1+"";//产品唯一标识类型（0：产品类型，1：理财产品id）
	   if(self.addNet.serialnotype==1){
//		   self.addNet.productserialno=self.addNet.productId;//产品唯一标识（取决于serialNoType）
//		   self.addNet.sortid=self.addNet.productId;// 排序id
		   self.addNet.productserialno=self.addNet.lcProductId;//产品唯一标识（取决于serialNoType）
		   self.addNet.sortid=self.addNet.lcProductId;// 排序id
	   }else if(self.addNet.serialnotype==0){
		   self.addNet.productserialno=self.addNet.productSecondCat;//产品唯一标识（取决于serialNoType）
		   self.addNet.sortid=self.addNet.productSecondCat;// 排序id
	   }else if(self.addNet.serialnotype==2){
           self.addNet.productserialno=self.addNet.productCat;//产品唯一标识（取决于serialNoType）
           self.addNet.sortid=self.addNet.productCat;// 排序id
       }else if(self.addNet.serialnotype==3){
           self.addNet.productserialno=self.addNet.productSecondCat+"-"+self.addNet.productPeriod;//产品唯一标识（取决于serialNoType）
           self.addNet.sortid=self.addNet.productSecondCat+"-"+self.addNet.productPeriod;// 排序id
           self.addNet.grade = self.addNet.creditRating;
           self.addNet.termUnit = self.addNet.productPeriodUnit;
       }
	   
	   self.addNet.term= self.addNet.productPeriod;//期限
	   self.addNet.onlinetime= self.addNet.onlinetime;//期限
	   self.addNet.offlinetime= self.addNet.offlinetime;//期限
	   self.addNet.productname= self.addNet.productName;
	   self.addNet.productyield=self.addNet.basicYield;
	   // 在添加页面回显
	   self.addNetTemp.recommendation=self.addNet.recommendation;
	   self.addNetTemp.buttonImageUrl=self.addNet.buttonimageurl;
	   if(self.netList.length<=0){
		   self.netList.push(self.addNet);
	   }else{
		   var count=0;
		   var len =self.netList.length;
		   for(var i=0;i<len;i++){// 去重
		  		count++;
		  		 if (self.netList[i].productCat=='T' || self.netList[i].productCat=='Z'  || self.netList[i].productCat=='W' || self.netList[i].productCat=='B' || self.netList[i].productCat=='A' || self.netList[i].productCat=='D'  || (self.netList[i].productCat=='V' && self.addNet.productChannel ==0)){// 产品ID---&& self.addNet.productChannel ==0
		  			//if(self.netList[i].productId==self.addNet.productId){
		  			if(self.netList[i].lcProductId==self.addNet.lcProductId){
			  			self.netList.splice(i,1,self.addNet);//替换相同的网贷产品
			  			break;
			  		}
		  		 }else{
		  			if(self.addNet.productSecondCat==self.netList[i].productSecondCat
                    && self.addNet.productPeriod==self.netList[i].productPeriod){
           				self.addNet=self.netList[i];
           				break;
           			}
		  		 }
	  			if(count==len){
	  				 self.netList.push(self.addNet);
	  			}

		  	}
	   }

	   $('.popups').css({ 'display': 'none' });
       $('.Peer-to-peer').css({ 'display': 'none' });
       $('.fund').css({ 'display': 'none' });
       $('.Insurance').css({ 'display': 'none' });
       $("#bankClass").css({ 'display': 'none' });
   }

   //*********************保险添加***************************
   self.insuranceList=[];
   self.insuranceConfirm=function(){

	   self.addInsurance.imageurl=$("#addInsurancefileUrl1").val();
	   if(!self.addInsurance.recommendation){
		   alert("推荐语不能为空");
		   return false;
	   }
	   if(!self.addInsurance.imageurl){
		   alert("推荐图片不能为空");
		   return false;
	   }
	   if(!self.addInsurance.productname){
		   alert("产品名称不能为空");
		   return false;
	   }
	   if(!self.addInsurance.premium){
		   alert("保费不能为空");
		   return false;
	   }
	   if(!self.addInsurance.company){
		   alert("保险公司不能为空");
		   return false;
	   }
	   if(!self.addInsurance.url){
		   alert("链接地址不能为空");
		   return false;
	   }

	   // 在添加页面回显
	   self.addInsuranceTemp.recommendation=self.addInsurance.recommendation;
	   self.addInsuranceTemp.buttonImageUrl=self.addInsurance.imageurl;

	   if(self.insuranceList.length<=0){
		   self.insuranceList.push(self.addInsurance);
	   }else{
		   var count=0;
		   var len =self.insuranceList.length;
		   for(var i=0;i<len;i++){// 去重
		  		count++;
		  		if(self.insuranceList[i].sortid==self.addInsurance.productid){
		  			self.insuranceList.splice(i,1,self.addInsurance);//替换相同的网贷产品
		  			break;
		  		}else{
		  			if(count==len){
		  				 self.insuranceList.push(self.addInsurance);
		  			}
		  		}

		  	}
	   }

	   $('.popups').css({ 'display': 'none' });
       $('.Peer-to-peer').css({ 'display': 'none' });
       $('.fund').css({ 'display': 'none' });
       $('.Insurance').css({ 'display': 'none' });
       $("#bankClass").css({ 'display': 'none' });
   }

   /***************添加银行精选*****************/
   self.bankList=[];
   self.bankConfirm = function(){

       if(self.add.productChannel==1){

       if(!self.addBank.reasonText){
           alert("银行精选推荐语不能为空");
           return false;
       }
       if(!self.addBank.reasonUp){
           alert("推荐理由上不能为空");
           return false;
       }
       if(!self.addBank.reasonLeft){
           alert("推荐理由左不能为空");
           return false;
       }
       if(!self.addBank.reasonRight){
           alert("推荐理由右不能为空");
           return false;
       }
     }
       if(!self.addBank.productName){
           alert("产品名称不能为空");
           return false;
       }

    self.addBank.buttonPicUrl = $("#addBankfileUrl1").val();
    self.addBank.bankProductId = self.addBank.bankProductId;
    self.addBank.bankname =self.addBank.bankName;
    self.addBank.bankcode = self.addBank.bankCode;
       self.addBank.reasontext =self.addBank.reasonText;
       self.addBank.reasonleft = self.addBank.reasonLeft;
       self.addBank.reasonright =self.addBank.reasonRight;
       self.addBank.reasonup = self.addBank.reasonUp;
       self.addBank.buttonpicurl =self.addBank.buttonPicUrl;
       self.addBank.bankproductid = self.addBank.bankProductId;
       self.addBank.productname =self.addBank.productName;
       self.addBank.rate = self.addBank.profit;
       self.addBank.deadline =self.addBank.period;
       self.addBank.ratetype = self.addBank.profitDesc;
       self.addBank.redicttype =self.addBank.redictType;
       self.addBank.redicturl = self.addBank.redictUrl;
       self.addBank.onlinetime =self.addBank.onlineTime;
       self.addBank.offlinetime =self.addBank.offlineTime;
       self.addBank.timeunit = self.addBank.timeUnit;
       self.addBank.deadlinedesc = self.addBank.periodDesc;
       // 在添加页面回显
       if(self.add.productChannel==1){
           self.addBankTemp.recommendation=self.addBank.reasonText;
           self.addBankTemp.buttonImageUrl=self.addBank.buttonPicUrl;
       }else{
           self.addBankTemp.recommendation=self.addBank.labelOne;
           self.addBankTemp.buttonImageUrl="--";
       }


       if(self.bankList.length<=0){
           self.bankList.push(self.addBank);
       }else{
           var count=0;
           var len =self.bankList.length;
           for(var i=0;i<len;i++){// 去重
               count++;
               if(self.bankList[i].sortid==self.addBank.sortid){
                   self.bankList.splice(i,1,self.addBank);//替换相同的银行精选产品
                   break;
               }else{
                   if(count==len){
                       self.bankList.push(self.addBank);
                   }
               }

           }
       }
       $('.popups').css({ 'display': 'none' });
       $('.Peer-to-peer').css({ 'display': 'none' });
       $('.fund').css({ 'display': 'none' });
       $('.Insurance').css({ 'display': 'none' });
       $("#bankClass").css({ 'display': 'none' });
    }
/******************银行精选添加结束***********************/

 self.addShowType=function(type){

       if(type==2) {
           if ( self.edit.showType == '2') {
               $('.isshowClone').css({ 'display': 'block' })
           } else {
               $('.isshowClone').css({ 'display': 'none' })
           }
       }else{
           if (self.add.showType == '2') {
               $('.isshow').css({ 'display': 'block' })
           } else {
               $('.isshow').css({ 'display': 'none' })
           }
       }

   }


   /**
    * 保存添加
    */
   self.addSubmit=function(){
	   if( !self.add.productChannel){
   		alert("渠道不能为空");
           return;
   	}
   	if( !self.add.producttype){
   		alert("产品类型不能为空");
           return;
   	}
   	if( !self.add.position){
   		alert("推荐位置不能为空");
           return;
   	}

   	if( !self.add.recommend){
   		alert("推荐名称不能为空");
        return false;
   	}


    self.add.headimageurl=$("#fileUrl1").val();
    if(self.add.productChannel==1 && self.add.position==3 && self.add.producttype==2){
    	if(!self.add.headimageurl){
    		alert("页面头图不能为空");
    		return;
    	}
    }

    self.add.whiteId=$("#addSelectaddwhiteId").val();
    if(self.add.showType==2){
    	if(!self.add.whiteId){
        	alert("白名单不能为空");
            return;
        }
    }else{
    	self.add.whiteId="";
    }

    if(self.add.showType==2 && self.add.rosterType=="NO_RULE"){
     alert("请选择名单策略");
     return;
    }
   	//self.add.showType='0';
    // 上线时间，下线时间
   	self.add.onlinetime = $('#addonlinetime').val()+"";
	self.add.offlinetime = $('#addOfflineTime').val()+"";
    if(!self.add.onlinetime|| !self.add.offlinetime){
        alert("上线时间下线时间不能为空");
        return;
    }

    if(self.add.offlinetime<=self.add.onlinetime){
    	alert("下线时间必须大于上线时间");
        return;
    }


   	if(self.addProductListBelow.length<=0){
   	 alert("请添加要配置的推荐产品");
     return ;
   	}

    // 验证推荐产品的相关的配置
    for(var i=0;i< self.addProductListBelow.length;i++){
    	if(self.add.position!=3 && self.add.position!=4 && self.add.position!=7){
    		if(self.addProductListBelow[i].recommendation=='--' || self.addProductListBelow[i].recommendation==''){
    			alert("产品:"+self.addProductListBelow[i].name+"配置信息不能为空");
    			return ;
    		}
    	}else if(self.add.position==3){
    		if(self.addProductListBelow[i].buttonText=='--'|| self.addProductListBelow[i].buttonText==''){
    			alert("产品:"+self.addProductListBelow[i].name+"配置信息不能为空");
    			return ;
    		}
    	}
    }

        if(self.strChannelGroups!=null && self.strChannelGroups!='undefined'){
            for (var i = 0; i <self.strChannelGroups.length ; i++) {
                if (self.strChannelGroups[i].rosterId == self.add.whiteId){
                    self.add.rosterName = self.strChannelGroups[i].rosterName;
                    break;
                }
            }
        }

   console.log(self.strChannelGroups,"数组元素");

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

	// 处理排序字段问题
   	var productsort="";
//   	for(var j=0;j<self.addSortIdList.length;j++){
//   		productsort=productsort+self.addSortIdList[j];
//   		if(j<self.addSortIdList.length-1 && productsort){
//   			productsort=productsort+",";
//   		}
//   	}
   	for(var j=0;j<self.addProductListBelow.length;j++){
   	  /*  if(self.addProductListBelow[j].productCat=='6'){
            productsort=productsort+self.addProductListBelow[j].id+"-"+self.addProductListBelow[j].productPeriod;
        }else{
            productsort=productsort+self.addProductListBelow[j].id;
        }*/
        productsort=productsort+self.addProductListBelow[j].id;
   		if(j<self.addProductListBelow.length-1 && productsort){
   			productsort=productsort+",";
   		}
   	}



   	self.add.productsort=productsort;
   	// 封装数据
   	self.addList={};
   	self.addList.recommend=	self.add;
   	if(self.add.producttype==1){
   		self.addList.netLoanList= self.netList; //网贷
   	}else{
   		// 基金
   	   	self.addList.fundList= self.fundList; // 基金
   		// 保险
   	   	self.addList.insuranceList= self.insuranceList; // 保险

        //银行
        self.addList.bankHandpickList = self.bankList;// 银行

   	}

		var url = globalConfig.basePath+"/product/add";
        $http.post(url,self.addList).then( function(data){
       	if(data.data.code == '000'){
       		self.operationType='0';
       		self.searchProduct(1);
       	 	alert(data.data.message);
       	 	self.searchProduct(1);
       	 self.addProductListBelow=[];
       	}else{
       		alert(data.data.message);
       	}
       	self.add.auditPerson="";
       },function(response) {
           alert("请求失败了....");
           self.add.auditPerson="";
       }
     );
   }

   /**************初始化名单类型 START*******************/
    /**用户策略类型初始化*/
   // self.edit={};
    self.strategyReload = function (showType,operationType,editType) {

        if(showType==2){

        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url, self.strate).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyList = data.data.resp;
                    self.strategyList = self.strategyList.splice(1,2);
                    if(operationType==1){
                        self.add.rosterType= "RULE_GROUP";
                    }else if(operationType==2 && editType!=3){
                        self.edit.rosterType= "RULE_GROUP";
                    }
                    if (operationType == 1){
                        self.findChannelGroups(operationType);
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
       }
    }

    //self.strategyReload();

    /** 查询渠道现有分组*/
    self.findChannelGroups = function (operationType) {

        var channelCode;
        self.rosterType="";
        if(operationType==1){
            if(self.add.productChannel==0){
                channelCode='WK';
            }else if(self.add.productChannel==1){
                channelCode='QB';
            }else if(self.add.productChannel==6){
                channelCode='SC';
            }
            if(channelCode == null){
                channelCode='QB';
            }
            if (self.add.rosterType=="NO_RULE") {
                $('#userNameLikeSearch').hide();
            }
            self.rosterType = self.add.rosterType;
        } else if(operationType==2){
            if(self.edit.productChannel==0){
                channelCode='WK';
            }else if(self.edit.productChannel==1){
                channelCode='QB';
            }else if(self.add.productChannel==6){
                channelCode='SC';
            }
            if(channelCode == null){
                channelCode='QB';
            }
            if (self.edit.rosterType=="NO_RULE") {

                $("#editUserNameLikeSearch").hide();
            }
            self.rosterType = self.edit.rosterType;
        }else if(operationType==3){
            if(self.detail.productChannel==0){
                channelCode='WK';
            }else if(self.detail.productChannel==1){
                channelCode='QB';
            }else if(self.add.productChannel==6){
                channelCode='SC';
            }
            if(channelCode == null){
                channelCode='QB';
            }
            if (self.detail.rosterType=="NO_RULE") {
                $("#detailNameSearch").hide();
            }
            self.rosterType = self.detail.rosterType;
        }
      if(self.rosterType!="NO_RULE"){

            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.rosterType
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strChannelGroups = data.data.resp;

                        if (self.strChannelGroups.length > 0) {
                            if(operationType==1){
                                $('#userNameLikeSearch').show();
                            }else if(operationType==2){
                                $("#editUserNameLikeSearch").show();
                                $("#editNameSearch").show();
                            }else if(operationType==3){
                                $("#detailNameSearch").show();
                            }

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


    self.changePlatformValue = function (operationType) {
        self.findChannelGroups(operationType);
    }

    self.changeFindChannelGroups = function (operationType) {
        self.findChannelGroups(operationType);
    }

   /**************初始化名单类型 END************************/

    $scope.datilInfo ="";
   self.checkType="";
   /*************单产品添加上下线时间打开弹窗******************/
   self.addOfTime=function(record,checkType){
       self.checkType= checkType;
       $scope.datilInfo =  record;
      //添加--添加单产品上下线时间
       if(checkType==1){
           if($("#addonlinetime").val()=="" || $("#addOfflineTime").val()==""){
               alert("请先填写产品包的上下线时间！");
               return;
           }else{
               if($scope.datilInfo.onlinetime=="" || $scope.datilInfo.offlinetime==""){
                   $scope.datilInfo.onlinetime = $("#addonlinetime").val();
                   $scope.datilInfo.offlinetime = $("#addOfflineTime").val();
               }

               if( $scope.datilInfo.onlinetime<$("#addonlinetime").val()){
                   $scope.datilInfo.onlinetime = $("#addonlinetime").val();
               }
               if( $scope.datilInfo.offlinetime >$("#addOfflineTime").val() || $scope.datilInfo.offlinetime < $("#addonlinetime").val()){
                   $scope.datilInfo.offlinetime = $("#addOfflineTime").val();
               }
               $("#addSingleOnlinetime").val( $scope.datilInfo.onlinetime);
               $("#addSingleOfflineTime").val( $scope.datilInfo.offlinetime);
           }
       }
       //查看
       if(checkType==3){
           $("#checkSingleOnlinetime").val($scope.datilInfo.onlinetime);
           $("#checkSingleOfflineTime").val($scope.datilInfo.offlinetime);
       }
    //修改活克隆添加但产品上下线时间
     if(checkType==2){
           //克隆
         if(self.type==2){

             if($("#upOnlinetime").val()=="" || $("#upOfflineTime").val()==""){
                 alert("请先填写产品包的上下线时间！");
                 return;
             }else{
                 if($scope.datilInfo.onlinetime=="" || $scope.datilInfo.offlinetime==""){
                     $scope.datilInfo.onlinetime = $("#upOnlinetime").val();
                     $scope.datilInfo.offlinetime = $("#upOfflineTime").val();
                 }

                 if( $scope.datilInfo.onlinetime<$("#upOnlinetime").val()){
                     $scope.datilInfo.onlinetime = $("#upOnlinetime").val();
                 }
                 if( $scope.datilInfo.offlinetime >$("#upOfflineTime").val() || $scope.datilInfo.offlinetime < $("#upOnlinetime").val()){
                     $scope.datilInfo.offlinetime = $("#upOfflineTime").val();
                 }
                 $("#addSingleOnlinetime").val( $scope.datilInfo.onlinetime);
                 $("#addSingleOfflineTime").val( $scope.datilInfo.offlinetime);
             }

         }else{
            /* if($scope.edit.showType==0){
                 if( $scope.datilInfo.onlinetime<$("#upOnlinetime").val()){
                     $scope.datilInfo.onlinetime = $("#upOnlinetime").val();
                 }
                 if( $scope.datilInfo.offlinetime >$("#upOfflineTime").val() || $scope.datilInfo.offlinetime < $("#upOnlinetime").val()){
                     $scope.datilInfo.offlinetime = $("#upOfflineTime").val();
                 }

             }*/
             if($scope.datilInfo.onlinetime=="" || $scope.datilInfo.offlinetime==""){
                 $scope.datilInfo.onlinetime = $("#upOnlinetime").val();
                 $scope.datilInfo.offlinetime = $("#upOfflineTime").val();
             }
             if( $scope.datilInfo.onlinetime<$("#upOnlinetime").val()){
                 $scope.datilInfo.onlinetime = $("#upOnlinetime").val();
             }
             if( $scope.datilInfo.offlinetime >$("#upOfflineTime").val() || $scope.datilInfo.offlinetime < $("#upOnlinetime").val()){
                 $scope.datilInfo.offlinetime = $("#upOfflineTime").val();
             }
             //修改
             $("#addSingleOnlinetime").val( $scope.datilInfo.onlinetime);
             $("#addSingleOfflineTime").val( $scope.datilInfo.offlinetime);


         }
     }
       $('#timePopup').css({ 'display': 'block' });
       $('#timePeer').css({ 'display': 'block' });


   }


   /*************确定添加上下时间*******************/
   self.timeConfirm = function(){
      var singleOonlineTime =  $("#addSingleOnlinetime").val();
       var singleOfflineTime =  $("#addSingleOfflineTime").val();

       if($("#addSingleOnlinetime").val()=="" || $("#addSingleOfflineTime").val()==""){
           alert("上下线时间不能为空");
           return;
       }

       if(singleOfflineTime<=singleOonlineTime){
           alert("下线时间必须大于上线时间");
           return;
       }

       $scope.datilInfo.onlinetime = $("#addSingleOnlinetime").val();
       $scope.datilInfo.offlinetime = $("#addSingleOfflineTime").val();
       //添加确认单产品上下线时间
       if(self.checkType==1){
           if($scope.datilInfo.onlinetime<$("#addonlinetime").val()){
                   $scope.datilInfo.onlinetime = $("#addonlinetime").val();
               }
           if($scope.datilInfo.offlinetime>$("#addOfflineTime").val() || $scope.datilInfo.offlinetime<$("#addonlinetime").val()){
                 $scope.datilInfo.offlinetime =$("#addOfflineTime").val();
              }
           self.addOptionProduct($scope.datilInfo,2);

        }else
            //修改确认单产品上下线时间
        if(self.checkType==2){
           if($scope.edit.showType==0 ||  self.type==2){
               if($scope.datilInfo.onlinetime<$("#upOnlinetime").val()){
                   $scope.datilInfo.onlinetime = $("#upOnlinetime").val();
               }
               if($scope.datilInfo.offlinetime>$("#upOfflineTime").val() || $scope.datilInfo.offlinetime<$("#upOnlinetime").val()){
                   $scope.datilInfo.offlinetime =$("#upOfflineTime").val();
               }
           }else{

               if($scope.datilInfo.onlinetime<$scope.edit.onlinetime){
                   $scope.datilInfo.onlinetime = $scope.edit.onlinetime;
               }
               if( $scope.datilInfo.offlinetime>$scope.edit.offlinetime){
                   $scope.datilInfo.offlinetime =$scope.edit.offlinetime;
               }
           }
         self.editOptionProduct($scope.datilInfo,2);

        }
       $('#timePopup').css({'display': 'none'});
       $('#timePeer').css({'display': 'none'});

   }

/***********************关闭时间弹窗***********************************/
    self.timeClose = function(){
        $('#timePopup').css({ 'display': 'none' });
        $('#timePeer').css({ 'display': 'none' });
    }

// *************************产品推荐审核*************************************    
   self.audit=function(record){

	   if(record.auditStatus != "0"){
   		alert('只能对待审核状态的数据进行操作');
   		return;
   	 }
   	$scope.auditStatus = "1";
    $('#auditProduct').show();
   	$scope.confirmRecord = angular.copy(record);
  // 	$scope.auditStatus = "2";
   	$scope.auditDescription = "";
	   
   }
   
   
   // 保存审核
   $scope.submitAudit = function(){       
       var url = globalConfig.basePath+"/product/auditing";
       $scope.confirmRecord.auditStatus = $scope.auditStatus;
       $scope.confirmRecord.auditDescription = $scope.auditDescription;
       $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
           
           if(callback.data.code == '000'){
           	$('#auditProduct').hide();
           	alert("操作成功");
           	$scope.searchProduct(1);
           } else {
               console.log(callback.data);
               alert(callback.data.message);
           }
       }, function errorCallback(response) {
           // 请求失败执行代码
           swalMsg(response);
       });
   };
    
    
// ****************************************************************************************************    
// *************************************查看******************************************************** 
   self.detailProductListBelow=[];
   self.detailShowNew=function(record){

	   self.appKey=true;
	   self.operationType=2;
	   self.detail=angular.copy(record);
       self.strategyReload(2,3,3);
	   var url = globalConfig.basePath+"/product/detail";
		$http.post(url,$scope.detail).then(function (callback) {

           if(callback.data.code == '000'){
        	   self.detailProductListBelow=[];//初始化
        	   self.detail=callback.data.resp.recommend;
        	   self.detail.whiteId=self.detail.whiteId+"";
        	   var bean=callback.data.resp.recommend;
        	   var sortStr=bean.productsort;
        	   var sortList=sortStr.split(",");
        	   // 
        	   if(bean.producttype==1){
        		   //网贷
        		   var netList=callback.data.resp.netLoanList;
        		   for(var i=0;i<netList.length;i++){
        			   for(var j=0;j<netList.length;j++){// 基金
        				   if(netList[j].sortid==sortList[i]){
        					   var obj=netList[j];
        					   obj.type=bean.producttype;
        					   obj.kind=1;
        					   obj.name=obj.productname;
        					   obj.recommendation=obj.recommendation;
        					   obj.buttonImageUrl=obj.buttonimageurl;
        					   self.detailProductListBelow.push(obj) 
        					   break;
        				   }
        			   }
        		   }
        	   }else{ //多资产
        		   var fundList=callback.data.resp.fundList;// 基金
        		   var insuranceList=callback.data.resp.insuranceList;// 保险
                   var bankList=callback.data.resp.bankHandpickList;// 保险
        		   for(var i=0;i<sortList.length;i++){
        			   for(var j=0;j<fundList.length;j++){// 基金
        				   if(fundList[j].sortid==sortList[i]){
        					   var obj=fundList[j];
        					   obj.type=bean.producttype;
        					   obj.kind=1;
        					   obj.name=obj.fundname;
        					   obj.recommendation=obj.recommendation;
        					   obj.buttonImageUrl=obj.buttonimageurl;
        					   self.detailProductListBelow.push(obj) 
        					   break;
        				   }
        			   }
        			   

        			   for(var j=0;j<insuranceList.length;j++){//保险
        				  // TODO 保险
        				   if(insuranceList[j].sortid==sortList[i]){
        					   var obj=insuranceList[j];
        					   obj.type=bean.producttype;
        					   obj.kind=2;
        					   obj.name=obj.productname;
        					   obj.recommendation=obj.recommendation;
        					   obj.buttonImageUrl=obj.imageurl;
        					   self.detailProductListBelow.push(obj) 
        					   break;
        				   }
        			   }


                       for(var j=0;j<bankList.length;j++){//银行精选
                           //TODO 银行精选
                           if(bankList[j].sortid==sortList[i]){
                               var obj=bankList[j];
                               obj.type=bean.producttype;
                               obj.kind=3;
                               obj.name=obj.productname;
                               if(record.productChannel==1 || record.productChannel==6){
                                   obj.recommendation=obj.reasontext;
                                   obj.buttonImageUrl=obj.buttonpicurl;
                               }else{
                                   obj.recommendation=obj.labelOne;
                                   obj.buttonImageUrl="--";
                               }
                               self.detailProductListBelow.push(obj)
                               break;
                           }


                       }

        		   }
        	   }
        	   
           } else {
               console.log(callback.data);
               alert(callback.data.message);
           }
       }, function errorCallback(response) {
           // 请求失败执行代码
           swalMsg(response);
       });
			   
	   
   }
      
  // 产看产品
   self.infoUrl="";
   self.infoTil="";
   self.detailOptionProduct=function(record){

	   // x.type==1 && '网贷' || (x.type==2 && x.kind==1) && '基金'
	   
	   if(record.type==1){
		   $("#deltailNet").show();
		   self.deltailNet=angular.copy(record);
           self.addNet.productChannel=self.add.productChannel;
           self.addNet.producttype=self.add.producttype;
           /*if(self.detail.position==1){
               if(record.label!=undefined && record.label!=null && record.label!="" ){
                   var lb =  record.label.split(",");
                   self.deltailNet.label1=lb[0];
                   self.deltailNet.label2=lb[1];
               }
           }*/

	   }
	   if((record.type==2 ||record.type==3)&& record.kind==1){
		   $("#deltailFund").show();
		   self.deltailFund=angular.copy(record);
         if(self.detail.position==3){
		  var urlStr = self.deltailFund.informationUrl;
		  var jsonAry = eval(urlStr);
			  for(var i=0;i<jsonAry.length;i++){
				  var infoUrl = "infoUrl"+[i+1]
				  var infoTil = "infoTil"+[i+1]
				  self[infoUrl] = jsonAry[i].informationUrl;  
				  self[infoTil]=jsonAry[i].informationTitle;
				  if(i>0){
					  var j= i+1;
					  var html="<span >标题"+j+"：</span>"+jsonAry[i].informationTitle+"<br/>"
					  +"<span >链接"+j+"：</span>"+jsonAry[i].informationUrl+"<br/><br/>"
					  $('#detailMsg').append(html);
				  }
			  }
           }else if(self.detail.position==5){
             var labelStr = self.deltailFund.label;
             var jsonAryLabel = labelStr.split(",");
             for(var i=0;i<jsonAryLabel.length;i++){
                 var infoUrl = "label"+[i+1]
                 self[infoUrl] = jsonAryLabel[i];
                 if(i>0){
                     var j= i+1;
                     var html="<span >标签"+j+"：</span>"+jsonAryLabel[i]+"<br/>"
                     $('#detailLabelMsg').append(html);
                 }
             }
           }
		   self.deltailFund.ratetype=self.fundYBBase[record.ratetype]
	   }
	   //保险
	   if(record.type==2 && record.kind==2){
		   $("#deltailInsurance").show();
		   self.deltailInsurance=angular.copy(record);
           self.deltailInsurance.productChannel=self.add.productChannel;
           self.deltailInsurance.producttype=self.add.producttype;
	   }
	   //银行精选
       if(record.type==2 && record.kind==3){
           $("#deltailBank").show();
           self.deltailBank=angular.copy(record);
           self.deltailBank.productChannel=self.add.productChannel;
           self.deltailBank.producttype=self.add.producttype;
       }

   }
   
   // 关闭网贷弹窗
   self.deltailNetClose=function(){
	   self.deltailNet=[]; 
	   self.deltailFund=[];
	   $('#deltailNet').css({ 'display': 'none' });
	   $("#deltailFund").css({ 'display': 'none' });
       $("#deltailBank").css({ 'display': 'none' });

   }
   
   self.deltailNetClose=function(){
	   self.deltailNet=[];
	   $('#deltailNet').css({ 'display': 'none' });
	   $("#deltailFund").css({ 'display': 'none' });
	   $("#deltailInsurance").css({ 'display': 'none' });
       $("#deltailBank").css({ 'display': 'none' });
	   // TODO 保险
	   
   }
   //关闭基金
   self.deltailFunClose = function(){
	   self.deltailNet=[];
	   $('#deltailNet').css({ 'display': 'none' });
	   $("#deltailFund").css({ 'display': 'none' });
	   $("#deltailInsurance").css({ 'display': 'none' });
       $("#deltailBank").css({ 'display': 'none' });
	   $("#detailMsg").empty();
       $("#detailLabelMsg").empty();
   }
 
   
// ****************************************修改*************************************************************
   //添加提醒状态地址
   $('#editHeadimageurl').fileupload({
       autoUpload: true,//是否自动上传
       url: url,//上传地址
       dataType: 'json',
       acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
       maxFileSize: 1 * 1024 * 1024 * 30,
       done: function (e, data) {//设置文件上传完毕事件的回调函数
           console.log(data.result);
           var fileUrl = data.result.resp;
           $('#editfileUrl1').prop("value",fileUrl);
           $('#editimage_prew1').prop("src",fileUrl);
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
   
   
   // 修改网贷
   $('#editNetButtonimageurl').fileupload({
       autoUpload: true,//是否自动上传
       url: url,//上传地址
       dataType: 'json',
       acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
       maxFileSize: 1 * 1024 * 1024 * 30,
       done: function (e, data) {//设置文件上传完毕事件的回调函数
           console.log(data.result);
           var fileUrl = data.result.resp;
           $('#editNetfileUrl1').prop("value",fileUrl);
           $('#editNetImage_prew1').prop("src",fileUrl);
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
   
   
   // 修改基金
   $('#editFundButtonimageurl').fileupload({
       autoUpload: true,//是否自动上传
       url: url,//上传地址
       dataType: 'json',
       acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
       maxFileSize: 1 * 1024 * 1024 * 30,
       done: function (e, data) {//设置文件上传完毕事件的回调函数
           console.log(data.result);
           var fileUrl = data.result.resp;
           $('#editFundfileUrl1').prop("value",fileUrl);
           $('#editFundImage_prew1').prop("src",fileUrl);
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

   //修改银行精选
    // 修改基金
    $('#editBankButtonimageurl').fileupload({
        autoUpload: true,//是否自动上传
        url: url,//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data.result);
            var fileUrl = data.result.resp;
            $('#editBankfileUrl1').prop("value",fileUrl);
            $('#editBankImage_prew1').prop("src",fileUrl);
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




    // 保险
   
   // 修改基金
   $('#editInsuranceButtonimageurl').fileupload({
       autoUpload: true,//是否自动上传
       url: url,//上传地址
       dataType: 'json',
       acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
       maxFileSize: 1 * 1024 * 1024 * 30,
       done: function (e, data) {//设置文件上传完毕事件的回调函数
           console.log(data.result);
           var fileUrl = data.result.resp;
           $('#editInsurancefileUrl1').prop("value",fileUrl);
           $('#editInsuranceImage_prew1').prop("src",fileUrl);
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
   
   
   self.editChangeKind=function(kind){
	   self.edit.productInfo="";
   }
   
   
   
   
   
   
   // 返回
   self.edit={};
   self.editRight=[];
   self.editBack=function(){
	   self.operationType=0;
	   self.edit={};
   }
   
   self.editProductListRight=[];
   // 打开修改
   // self.cloneType=0;
   self.editSortIdList=[];// 排序的
     self.type = "";
   self.update=function(record,type){
       self.type = type;
	   self.edit={};
       self.cloneType=0;
	   self.editProductListRight=[];
	   self.editNetList=[];
	   self.editFundList=[];
	   self.editInsuranceList=[];
       self.editBankList=[];

       self.edit=angular.copy(record);
       self.operationType=3;

     if(type==1 || type==2){
         self.strategyReload(2,2,3);
     }

	   self.edit.kind="1";
	   
	   // 初始化排序
	   	self.editSortIdList=[];
	   	self.editSortIdList=self.edit.productsort.split(",");
	   
	   var url = globalConfig.basePath+"/product/detail";
		$http.post(url,$scope.edit).then(function (callback) {


           if(callback.data.code == '000'){
        	   self.editProductListBelow=[];//初始化
        	   self.edit=callback.data.resp.recommend;
        	   self.edit.whiteId=self.edit.whiteId+"";
        	   self.edit.auditPerson="";
        	   self.edit.kind="1";
        	   console.log("待修改信息",self.edit);
        	   var bean=callback.data.resp.recommend;
        	   var sortStr=bean.productsort;
        	   var sortList=sortStr.split(",");
        	   // 
        	   if(bean.producttype==1){
        		   self.editNetList=[];
        		   //网贷

        		   var netList=callback.data.resp.netLoanList;
                   console.log(netList);
        		   for(var i=0;i<netList.length;i++){
        			   for(var j=0;j<netList.length;j++){// 基金
        				   if(netList[j].sortid==sortList[i]){

        					   var obj=netList[j];
        					   obj.type=bean.producttype;
        					   //obj.kind=1;
        					   obj.id=obj.sortid;
        					   obj.productCat=obj.additional;
        					   if(obj.additional=='T' || obj.additional=='Z'  || obj.additional=='W' || obj.additional=='B' || obj.additional=='A' || obj.additional=='D' || (obj.additional=='V' && self.edit.productChannel ==0 )){// self.edit.productChannel ==0
        						   //产品ID
        						   netList[j].lcProductId=netList[j].sortid;
        					   }else{
        					       if(obj.productCat!='6' && obj.productCat!='8'){
                                       obj.productSecondCat= obj.sortid;
                                   }
        					   }
        					   obj.name=obj.productname;
        					   obj.recommendation=obj.recommendation;
        					   obj.buttonImageUrl=obj.buttonimageurl;
        					   if(type==2){
        					       obj.onlinetime="";
        					       obj.offlinetime="";
                               }
        					   self.editProductListBelow.push(obj);
        					   self.editProductListRight.push(obj);
        					   //回显右侧的数据
//        			    	  	editobj.id=obj.sortid;
//        			    	  	self.editProductListRight.push(editobj);
        						var temNet=angular.copy(netList[j]);
        						temNet.id='';
        					   self.editNetList.push(temNet);
        					   break;
        				   }
        			   }
        		   }
        	   }else{ //多资产
        		   var fundList=callback.data.resp.fundList;// 基金
        		   self.editFundList=[];
        		   var insuranceList=callback.data.resp.insuranceList;// 保险
                   var bankList=callback.data.resp.bankHandpickList;// 银行精选

        		   for(var i=0;i<sortList.length;i++){
        			   for(var j=0;j<fundList.length;j++){// 基金
        				   if(fundList[j].sortid==sortList[i]){
                               self.edit.kind=1+"";
        					   var obj=fundList[j];
        					   obj.type=bean.producttype;
        					   obj.kind=1;
        					   obj.id=obj.sortid;
        					   obj.name=obj.fundname;
        					   obj.recommendation=obj.recommendation;
        					   obj.buttonImageUrl=obj.buttonimageurl;
                               if(type==2){
                                   obj.onlinetime="";
                                   obj.offlinetime="";
                               }
        					   self.editProductListBelow.push(obj)
        					   self.editProductListRight.push(obj);
        					   //回显右侧的数据
        					   self.editFundList.push(fundList[j]);
        					   break;
        				   }
        			   }

        			   for(var j=0;j<insuranceList.length;j++){//保险
        				   if(insuranceList[j].sortid==sortList[i]){
                               self.edit.kind=2+"";
        					   var obj=insuranceList[j];
        					   obj.type=bean.producttype;
        					   obj.kind=2;
        					   obj.id=obj.sortid;
        					   obj.name=obj.productname;
        					   obj.recommendation=obj.recommendation;
        					   obj.buttonImageUrl=obj.imageurl;
                               if(type==2){
                                   obj.onlinetime="";
                                   obj.offlinetime="";
                               }
        					   self.editProductListBelow.push(obj)
        					   self.editProductListRight.push(obj);
        					   //回显右侧的数据
        					   self.editInsuranceList.push(insuranceList[j]);
        					   break;
        				   }
        			   }

                       for(var j=0;j<bankList.length;j++){//银行精选
                           if(bankList[j].sortid==sortList[i]){
                               self.edit.kind=3+"";
                               var obj=bankList[j];
                               obj.type=bean.producttype;
                               obj.kind=3;
                               obj.id=obj.sortid;
                               obj.name=obj.productname;
                               if(record.productChannel==1 || record.productChannel==6){
                                   obj.recommendation=obj.reasontext;
                                   obj.buttonImageUrl=obj.buttonpicurl;
                               }else{
                                   obj.recommendation=obj.labelOne;
                                   obj.buttonImageUrl="--";
                               }

                               if(type==2){
                                   obj.onlinetime="";
                                   obj.offlinetime="";
                               }
                               self.editProductListBelow.push(obj)
                               self.editProductListRight.push(obj);
                               //回显右侧的数据
                               self.editBankList.push(bankList[j]);
                               break;
                           }
                       }

        		   }
        	   }

           } else {
               console.log(callback.data);
               alert(callback.data.message);
           }

            if(type==2){

                self.edit.recommend ="";
                self.edit.productChannel = self.edit.productChannel+"";
                self.edit.producttype = self.edit.producttype+"";
                self.edit.showType = self.edit.showType+"";
                self.edit.rosterType = self.edit.rosterType+"";
                self.edit.whiteId = self.edit.whiteId;
                self.edit.onlinetime ="";
                self.edit.offlinetime="";
                self.edit.id ="";
                self.cloneType=1;
               $("#addSingleOnlinetime").val('');
               $("#addSingleOfflineTime").val('');
            }
       }, function errorCallback(response) {
           // 请求失败执行代码
           swalMsg(response);
       });
	self.edit.auditPerson="";

   }
   
  
   // 上移动
   self.editSortUp=function(){

	   self.editRight=self.editProductListRight;
	   	var count=0;
		var obj={};
		$('.editproductListRight').each(function() {// 获取选中的数据
    	if(this.checked == true) {

    		var key = $(this).val();
    	  	obj.id=key;
    	  	obj.name=$(this).context.labels[0].innerText;
    	  	count++;
    	}
	});
	if(count<=0){
		alert("请选择排序数据!!");
		return false;
	}
	if(count>1){
		alert("请勿多选排序!!");
		return false;
	}
	
	var len = self.editRight.length;
		for(var i=0;i<len;i++){// 去重
  		if(self.editRight[i].id==obj.id && obj.name==self.editRight[i].name){
  			//self.editRight.splice(i,1);// 删除该元素
  			if(i==0){
  				alert("哎妈呀到顶了!");
	  			break;
  			}else{
  				var curobj =self.editRight[i];//当前的选中的
  				var curUp =self.editRight[i-1];//选中上面的
  				self.editRight.splice(i-1,1,curobj);
  				self.editRight.splice(i,1,curUp);
  				// 排序
  				self.editSortIdList.splice(i-1,1,curobj.id);// 更新
  				self.editSortIdList.splice(i,1,curUp.id);// 更新
  				break;
  			}
  		}
  	}
	   
	   
   }
   
   // 下移动
   self.editSortDown=function(){

	   self.editRight=self.editProductListRight;
	   
	   	var obj={};
		var count=0;
		$('.editproductListRight').each(function() {// 获取选中的数据
	    	if(this.checked == true) {

	    		count++;
	    		var key = $(this).val();
	    	  	obj.id=key;
	    	  	obj.name=$(this).context.labels[0].innerText;
	    	}
		});
		if(count<=0){
			alert("请选择排序数据!!");
			return false;
		}
		if(count>1){
			alert("请勿多选排序!!");
			return false;
		}
		
		var len = self.editRight.length;
			for(var i=0;i<len;i++){// 去重
	  		
	  		if(self.editRight[i].id==obj.id && obj.name==self.editRight[i].name){
	  			if(i==(len-1)){
	  				alert("我是有底线的!!");
		  			break;
	  			}else{
	  				var curobj =self.editRight[i];//当前的选中的
	  				var curDown =self.editRight[i+1];//选中上面的
	  				self.editRight.splice(i+1,1,curobj);
	  				self.editRight.splice(i,1,curDown);
	  				
	  			// 排序
	  				self.editSortIdList.splice(i+1,1,curobj.id);// 更新
	  				self.editSortIdList.splice(i,1,curDown.id);// 更新
	  				break;
	  			}
	  		}
	  	}
   }
   
   // 编辑左移
   self.editSuerLeft=function(){
	   self.editRight=self.editProductListRight;
	   $('.editproductListRight').each(function() {// 获取选中的数据
    	if(this.checked == true) {

    		var key = $(this).val();
    	  	var obj={};
    	  	obj.id=key;
    	  	obj.name=$(this).context.labels[0].innerText;
    		var count=0;
    		var len = self.editRight.length;
	  		for(var i=0;i<len;i++){// 去重
    	  		count++;
    	  		if(self.editRight[i].id==obj.id && obj.name==self.editRight[i].name){
    	  			self.editRight.splice(i,1);// 删除该元素
    	  			self.editSortIdList.splice(i,1);// 移除数据
    	  			break;
    	  		}
    	  	}
	  		
  /**          //TODO 处理网贷
            var lennet = self.editNetList.length;
            for(var i=0;i<lennet;i++){// 去重
                if(self.editNetList[i].productSecondCat==obj.id){
                    self.editNetList.splice(i,1);// 删除该元素
                    break;
                }
            }
            
            //TODO 处理基金
            var lenfound = self.editFundList.length;
            for(var i=0;i<lenfound;i++){// 去重
                if(self.editFundList[i].sortid==obj.id ){
                    self.editFundList.splice(i,1);// 删除该元素
                    break;
                }
            }
            
            //TODO 处理保险
            var lenin = self.editInsuranceList.length;
            for(var i=0;i<lenin;i++){// 去重
                if(self.editInsuranceList[i].sortid==obj.id){
                    self.editInsuranceList.splice(i,1);// 删除该元素
                    break;
                }
            }
    		**/
    	}
	});
	   
   }
   
   // 右移动
   self.editSuerRight=function(){
	   self.editRight=self.editProductListRight;
	   
   	$('.editProductListLeft').each(function() {// 获取选中的数据

    	if(this.checked == true) {
    	  	var key = $(this).val();
    	  	var obj={};
    	  	//obj.id=key;
    	  	var nameStr=$(this).context.labels[0].innerText;
    	  	if(self.edit.producttype==1){
                // 处理ID
                var keyObj =JSON.parse(key);
                obj.id=self.showValue(keyObj,self.edit.productChannel);// ID或者类型
                obj.productCat=keyObj.productCat;//第一大类
                obj.productSecondCat=keyObj.productSecondCat;// 第二大类
                obj.productPeriod = keyObj.productPeriod;
                // 名称处理
                if(keyObj.productCat=='6' || keyObj.productCat=='8'){
                    obj.name=nameStr;
                }else{

                if(self.edit.productChannel==0){
                    nameStr=nameStr.substr(0,nameStr.length-14);
                } else{
                    nameStr=nameStr.substr(0,nameStr.length-4);
                }
	    	  	var ns = nameStr.split("-");
	    	  	if(ns.length>2){
	    	  		obj.name=ns[1]+"-"+ns[2];;
	    	  	}else{
	    	  		obj.name=nameStr;
	    	  	}
              }
    	  	}else if(self.edit.kind==3){
                var bankObj =JSON.parse(key);
                var bankNa = nameStr.split("-");
                obj.name= bankNa[1]+"-"+bankNa[2];
                obj.bankcode = bankObj.bankCode;
                obj.bankproductid = bankObj.bankProductId;

                // obj.id=bankObj.id;
                obj.id = bankObj.bankCode+"-"+bankObj.bankProductId;
            }else{
    	  		obj.id=key;
    	  		obj.name=nameStr;
    	  	}

    	  	obj.type=self.edit.producttype;
    	  	obj.kind=self.edit.kind;
    	  	obj.recommendation="--";
    	  	obj.buttonImageUrl="--";
            obj.onlinetime ="";
            obj.offlinetime ="";
    	  	//$(this).context.nextSibling.style.backgroundColor="white";
    	  	this.parentNode.parentNode.style.backgroundColor="white";
    	  	this.checked=false;

    	  	//obj.name=
    	  	var count=0;
    	  	if(self.editRight.length<=0){
    	  		self.editRight.push(obj);
    	  		self.editSortIdList.push(obj.id);
    	  	}else{
    	  		var len = self.editRight.length;
    	  		for(var i=0;i<len;i++){// 去重
        	  		count++;
        	  		//if(self.editRight[i].id && obj.id && self.editRight[i].id==obj.id){
        	  		if(self.editRight[i].id == obj.id){
        	  			alert(obj.name+"-"+obj.id+"已存在该推荐产品");
        	  			break;
        	  		}else{
        	  			if(count==len){
        	  				 self.editRight.push(obj);
        	  				 self.editSortIdList.push(obj.id);
        	  			}
        	  		}
        	  		
        	  	}
    	  	}
      }
  self.editProductListRight = self.editRight;
 });
	
	   
	   
   }
   
   
   // 确认操作
   self.editProductListBelow=[];
   self.editOption=function(){


		self.addProductListBelow=[];
	   	self.editProductListBelow=angular.copy(self.editProductListRight);


       /*if(self.edit.producttype==1){
           //网贷
           if(self.editProductListBelow.length<self.editNetList.length){
               for(var i=0;i < self.editNetList.length;i++){
                   for (var j=0;j < self.editProductListBelow.length;j++){
                       if(self.editNetList[i].productSecondCat!=self.editProductListBelow[j].productSecondCat){
                           self.editNetList.splice(i,1);
                       }
                   }

               }
           }

       }else{
           // 基金
           if(self.editProductListBelow.length < self.editFundList.length){
               for(var i=0;i < self.editFundList.length;i++){
                   for (var j=0;j < self.editProductListBelow.length;j++){
                       if(self.editFundList[i].id!=self.editProductListBelow[j].id){
                           self.editFundList.splice(i,1);
                       }
                   }
               }

           }

           // 保险
           if(self.editProductListBelow.length<self.editInsuranceList.length){
               for(var p=0;p < self.editInsuranceList.length;p++){
                   for (var q=0;q < self.editProductListBelow.length;q++){
                       if(self.editInsuranceList[p].id!=self.editProductListBelow[q].id){
                           self.editInsuranceList.splice(p,1);
                       }
                   }
               }
           }


           if(self.edit.kind==3){// 银行
               // TODO 银行
           }
       }*/

       // 同步数据
       // 网贷同步数据
   }
   

   
   // 关闭网贷弹窗
   self.editOptionClose=function(){
	   //self.editNet=[]; 
	   //self.editFund=[];
	   $('#editNet').css({ 'display': 'none' });
	   $("#editFund").css({ 'display': 'none' });
	   $("#editInsurance").css({ 'display': 'none' });
       $("#editBank").css({ 'display': 'none' });
   }
   //关闭基金
   var up_detail_div = 1;
    var up_detail_div_label=1;
   self.forCreatKey=true;
   self.editFundClose =function(){
	   $('#editNet').css({ 'display': 'none' });
	   $("#editFund").css({ 'display': 'none' });
	   $("#editInsurance").css({ 'display': 'none' });
       $("#editBank").css({ 'display': 'none' });
	   $("#upMsg").empty();
       $("#upLabelMsg").empty();
	   up_detail_div=1;
       up_detail_div_label=1;
	   self.forCreatKey=true;
   }
   
   self.editFundYieldBO={};
   // 编辑产品
   self.editNetTemp={};
   self.editFundTemp={};
   self.editInsuranceTemp={};
   self.editBankTemp={};
   self.infoMsg="";
   self.editType="";
    self.newEditFund={};
    self.newEditFundList=[];
   self.editOptionProduct=function(record,editType){
	   self.editFund={};
	   self.editType=editType;

	   if(record.type==1){
	       if(editType!=2){
               $("#editNet").show();
           }
		   self.editNet=angular.copy(record);
		   self.editNetTemp={};
           self.editNetTemp=record;
           self.editNet=angular.copy(record);
           self.editNet.productChannel=self.edit.productChannel;
           self.editNet.producttype=self.edit.producttype;
           self.editNet.onlyId=record.id;

     		var url = globalConfig.basePath+"/product/productDetail";
            $http.post(url,self.editNet).then( function(data){
           	if(data.data.code == '000'){   

           		 //self.editSearchProductList=data.data.resp.data;
           		 for(var i=0;i<data.data.resp.data.length;i++){
           		  if (data.data.resp.data[i].productCat=='T' || data.data.resp.data[i].productCat=='Z'  || data.data.resp.data[i].productCat=='W' || data.data.resp.data[i].productCat=='B' || data.data.resp.data[i].productCat=='A' || data.data.resp.data[i].productCat=='D'|| (data.data.resp.data[i].productCat=='V' &&  self.editNet.productChannel==0 )){// 产品ID--&&  self.editNet.productChannel==0
           		//	 if(record.id==data.data.resp.data[i].productId){lcProductId
           			if(record.id==data.data.resp.data[i].lcProductId){           			  
           				self.editNet =data.data.resp.data[i];
           				self.editNet.productname=self.editNet.productName?self.editNet.productName:self.editNet.productname;
           				self.editNet.productyield=self.editNet.basicYield?self.editNet.basicYield:self.editNet.productyield;
           				self.editNet.additional=data.data.resp.data[i].productCat;
           				self.editNet.maxholdamount=data.data.resp.data[i].maxInvest;
           				self.editNet.serialnotype=1;
           				break;
           			 }
           		  }else{
           		      // 产品类型与产品期限一致时
           			if(record.id==data.data.resp.data[i].productSecondCat && record.productPeriod==data.data.resp.data[i].productPeriod && data.data.resp.data[i].productCat!='C' && data.data.resp.data[i].productCat!='6' && data.data.resp.data[i].productCat!='8'){
           				self.editNet =data.data.resp.data[i];
           				self.editNet.productname=self.editNet.productName?self.editNet.productName:self.editNet.productname;
           				self.editNet.productyield=self.editNet.basicYield?self.editNet.basicYield:self.editNet.productyield;
           				self.editNet.additional=data.data.resp.data[i].productCat;
           				self.editNet.maxholdamount=data.data.resp.data[i].maxInvest;
           				self.editNet.serialnotype=0;
           				break;
           			 }else if(record.id==data.data.resp.data[i].productSecondCat && record.productPeriod==data.data.resp.data[i].productPeriod && data.data.resp.data[i].productCat=='C'){
                        self.editNet =data.data.resp.data[i];
                        self.editNet.productname=self.editNet.productName?self.editNet.productName:self.editNet.productname;
                        self.editNet.productyield=self.editNet.basicYield?self.editNet.basicYield:self.editNet.productyield;
                        self.editNet.additional=data.data.resp.data[i].productCat;
                        self.editNet.maxholdamount=data.data.resp.data[i].maxInvest;
                        self.editNet.serialnotype=2;
                        break;
                    }else if(data.data.resp.data[i].productCat=='6' || data.data.resp.data[i].productCat=='8'){
           			     if(!record.term){
                             record.term =record.productPeriod;
                         }
           			     if(record.productSecondCat==data.data.resp.data[i].productSecondCat && record.term==data.data.resp.data[i].productPeriod ){
                             self.editNet =data.data.resp.data[i];
                             self.editNet.productname=self.editNet.productName?self.editNet.productName:self.editNet.productname;
                             self.editNet.productyield=self.editNet.basicYield?self.editNet.basicYield:self.editNet.productyield;
                             self.editNet.additional=data.data.resp.data[i].productCat;
                             self.editNet.maxholdamount=data.data.resp.data[i].maxInvest;
                             self.editNet.serialnotype=3;
                             break;
                         }
                    }
           		  }
           		 }
           		 var tem={};
           		tem=angular.copy(self.editNet);
           		 // 处理显示倒计时
           		self.editNet.showtime=false;
           		for(var i=0;i<self.editNetList.length;i++){
           			if (self.editNetList[i].productCat=='T' || self.editNetList[i].productCat=='Z' || self.editNetList[i].productCat=='W' || self.editNetList[i].productCat=='B' || self.editNetList[i].productCat=='A' || self.editNetList[i].productCat=='D' || (self.editNetList[i].productCat=='V' && self.editNet.productChannel==0)){// 产品ID--&& self.editNet.productChannel==0
	           			if(self.editNet.lcProductId==self.editNetList[i].productserialno){
	           				self.editNet=self.editNetList[i];
	           				self.editNet.productId=tem.productId;
	           				self.editNet.productName=tem.productName;
	           				self.editNet.basicYield=tem.basicYield;
	           				self.editNet.productPeriod=tem.productPeriod;
	           				break;
	           			}
           			}else{// 类型
           				if(self.editNet.productSecondCat==self.editNetList[i].productserialno){
	           				self.editNet=self.editNetList[i];
	           				self.editNet.productId=tem.productId;
	           				self.editNet.productName=tem.productName;
	           				self.editNet.basicYield=tem.basicYield;
	           				self.editNet.productPeriod=tem.productPeriod;
	           				break;
	           			}else if((self.editNet.productSecondCat+"-"+self.editNet.productPeriod)==self.editNetList[i].productserialno){
                            self.editNet=self.editNetList[i];
                            self.editNet.productId=tem.productId;
                            self.editNet.productName=tem.productName;
                            self.editNet.basicYield=tem.basicYield;
                            self.editNet.productPeriod=tem.productPeriod;
                            self.editNet.creditRating=tem.creditRating;
                            self.editNet.productPeriodUnit=tem.productPeriodUnit;
                            break;
                        }
           			}
           		}
                self.editNet.onlinetime = record.onlinetime;
                self.editNet.offlinetime = record.offlinetime;
                /*if(self.edit.position==1){
                    var lb="";
                    if(self.editNet.label!=undefined && self.editNet.label!=null && self.editNet.label!=""){
                         lb = self.editNet.label
                    }else if(record.label!=undefined && record.label!=null && record.label!="" ){
                         lb =  record.label;
                    }

                    if(lb!=""){
                        var lbs = lb.split(",");
                        self.editNet.label1=lbs[0];
                        self.editNet.label2=lbs[1];
                    }
                }*/
           	}
           },function(response) {
               alert("请求失败了....");
           }
         );
          
	   }
	   
	   
	   if(record.type==2 && record.kind==2){// 保险
           if(self.editType!=2){
               $("#editInsurance").show();
           }
		   self.editInsurance=angular.copy(record);
		   self.editInsuranceTemp={};
           self.editInsuranceTemp=record;
           
           self.editInsurance={};
           self.editInsuranceTemp={};
           self.editInsuranceTemp=record;
           self.editInsurance=angular.copy(record);
           self.editInsurance.productInfo=record.name;
           self.editInsurance.productChannel=self.edit.productChannel;
           self.editInsurance.producttype=self.edit.producttype;
           self.editInsurance.sort= self.editInsurance.id;
           self.editInsurance.productid= self.editInsurance.id;
           
           self.editInsurance.onlyId=record.id;
       	
     		var url = globalConfig.basePath+"/product/productDetail";
            $http.post(url,self.editInsurance).then( function(data){
           	if(data.data.code == '000'){ 

	   			self.editInsurance={};
	      		self.editInsurance=data.data.resp[0];
	      		self.editInsurance.sortid= self.editInsuranceTemp.id;
	            self.editInsurance.productid= self.editInsuranceTemp.id;

	            for(var i=0;i<self.editInsuranceList.length;i++){// 回显数据
	            	if(self.editInsuranceList[i].sortid==self.editInsurance.sortid){
	            		self.editInsurance=angular.copy(self.editInsuranceList[i]);
	            		self.editInsurance.recommendation=self.editInsuranceList[i].recommendation;
	            		self.editInsurance.buttonimageurl=self.editInsuranceList[i].buttonimageurl;
	            		self.editInsurance.url=self.editInsuranceList[i].url;
	            		self.editInsurance.imageurl=self.editInsuranceList[i].imageurl;
	            		break;
	            	}
	            	
	            }

                self.editInsurance.onlinetime = record.onlinetime;
                self.editInsurance.offlinetime = record.offlinetime;
           	}else{
           		alert(data.data.message);
           	}
           },function(response) {
               alert("请求失败了....");
           }
         );
	   }

       if(record.type==2 && record.kind==3){//银行精选

           if(editType!=2) {
               $("#editBank").show();
           }

           self.editBank={};
           self.editBankTemp={};
           self.editBankTemp=record;
           self.editBank=angular.copy(record);
           self.editBank.recommendation=record.reasontext;
           self.editBank.productInfo=record.name;
           self.editBank.productChannel=self.edit.productChannel;
           self.editBank.producttype=self.edit.producttype;
           self.editBank.sort= self.editBank.bankCode+"-"+self.editBank.bankProductId;
           self.editBank.productid= self.editBank.bankProductId;
           self.editBank.bankCode = record.bankcode
           self.editBank.bankProductId = record.bankproductid;
           self.editBank.onlyId=record.id;

           var url = globalConfig.basePath+"/product/productDetail";
           $http.post(url,self.editBank).then( function(data){
                   if(data.data.code == '000'){

                       self.editBank={};
                       self.editBank=data.data.resp;
                       self.editBank.bankproductid = self.editBank.bankProductId;
                       self.editBank.bankname = self.editBank.bankName;
                       self.editBank.bankcode = self.editBank.bankCode;
                       self.editBank.rate = self.editBank.profit;
                       self.editBank.ratetype = self.editBank.profitDesc;
                       self.editBank.deadline = self.editBank.period;
                       self.editBank.redicturl = self.editBank.detailsUrl;
                       self.editBank.redicttype =1;
                       self.editBank.productname = self.editBank.productName;
                       self.editBank.timeunit = self.editBank.timeUnit;
                       self.editBank.deadlinedesc = self.editBank.periodDesc;

                       self.editBank.redictUrl=self.editBank.detailsUrl;
                       self.editBank.redictType=record.redictType;
                       self.editBank.sortid= self.editBankTemp.bankcode+"-"+self.editBankTemp.bankproductid;
                       self.editBank.productid= self.editBankTemp.bankproductid;
                       for(var i=0;i<self.editBankList.length;i++){
                           if(self.editBankList[i].sortid==self.editBank.sortid){
                               self.editBankList[i].onlinetime =record.onlinetime;
                               self.editBankList[i].offlinetime=record.offlinetime;
                               self.editBank=angular.copy(self.editBankList[i]);
                               self.editBank.reasonText=self.editBankList[i].reasonText;
                               self.editBank.buttonimageurl=self.editBankList[i].buttonimageurl;
                               self.editBank.redicturl=self.editBankList[i].redicturl;
                               self.editBank.imageurl=self.editBankList[i].imageurl;

                               break;
                           }
                       }
                       self.editBank.onlinetime = record.onlinetime;
                       self.editBank.offlinetime = record.offlinetime;
                   }else{
                       alert(data.data.message);
                   }
               },function(response) {
                   alert("请求失败了....");
               }
           );
       }


	  //修改基金详情
	   if((record.type==2 || record.type==3)&& record.kind==1){// 基金
           if(self.editType!=2){
               $("#editFund").show();
           }

		   self.editFund=angular.copy(record);
		   self.editFundTemp={};
           self.editFundTemp=record;
           self.editFund.recommendation='';
	   if(self.forCreatKey && self.edit.position==3){
	       if(self.editFund.recommendationRate===undefined){
               self.editFund.recommendationRate ='1';
           }
		   var urlStr="";
		   if(!self.infoMsg){
			   urlStr= self.editFund.informationUrl;
		   }else{
			   urlStr = self.infoMsg;
		   }
 		  var jsonAry = eval(urlStr);
		   if(jsonAry!="" && jsonAry!=undefined){
              for(var i=0;i<jsonAry.length;i++){
                  if(i==0){
                      var enditInfoUrl = "enditInfoUrl"+[i+1]
                      var enditInfoTitle = "enditInfoTitle"+[i+1]
                      self[enditInfoUrl] = jsonAry[i].informationUrl;
                      self[enditInfoTitle] = jsonAry[i].informationTitle;
                  }else{
                     up_detail_div++;
                      var ids="upMessage"+up_detail_div;
                       var html="<div id='"+ids+"'><br/><div>"
                         +"<span>标题"+up_detail_div+"</span>"
                         +"<input  type='text' id='enditInfoTitle"+up_detail_div+"' value="+jsonAry[i].informationTitle+">"
                         +"</div><br/>"
                         +"<div>"
                         +"<span>链接"+up_detail_div+"</span>"
                         +"<input  type='text' id='enditInfoUrl"+up_detail_div+"' value="+jsonAry[i].informationUrl+">"
                         +"</div></div>"
                       $('#upMsg').append(html);
                  }
                  self.upIndexMsg=up_detail_div;
                }
            }
		   }

		   if(self.forCreatKey && self.edit.position==5){
               $('#upLabelMsg').empty();
               for(var i=0;i<self.newEditFundList.length;i++){
                   if(self.newEditFundList[i].fundid==self.editFund.fundid){
                       self.editFund.label = self.newEditFundList[i].label;
                   }
               }

             var labelStr = self.editFund.label;
               var labelAry ="";
             if(labelStr!=null){
                  labelAry =labelStr.split(",");
             }
               if(labelAry!="" && labelAry!=undefined){

                   for(var i=0;i<labelAry.length;i++){
                       if(i==0){
                           var enditLabel = "label"+[i+1]
                           self[enditLabel] = labelAry[i];
                       }else{
                           up_detail_div_label++;
                           var ids="upMessageLabel"+up_detail_div_label;
                           var html="<div id='"+ids+"'><br/><div>"
                               +"<span>标签"+up_detail_div_label+"</span>"
                               +"<input  type='text' id='upLabel"+up_detail_div_label+"' value="+labelAry[i]+">"
                               +"</div>"
                           $('#upLabelMsg').append(html);
                       }
                       self.upLabelMasg=up_detail_div_label;
                   }
               }

           }

           self.editFund.productInfo=self.editFund.id;
           self.editFund.productChannel=self.edit.productChannel;
           self.editFund.producttype=self.edit.producttype;
     		var url = globalConfig.basePath+"/product/productDetail";
            $http.post(url,self.editFund).then( function(data){
           	if(data.data.code == '000'){   
           		 //alert(data.data.message);
           		// $scope.searchProduct(1);

           		if(data.data.resp.resCode=='0000'){
           			self.editFund.ratetype=self.editFundTemp.ratetype;
           			self.editFund.urltype=self.editFundTemp.urltype;
           			self.editFund.fundrate=self.editFundTemp.fundrate;
           			if(!self.editFund.urltype){
           				self.editFund.urltype=1;
           			}
           			if(!self.editFund.fundcode){
           				self.editFund.fundcode=data.data.resp.data.fundCode
           			}
           			if(!self.editFund.fundname){
           				self.editFund.fundname=data.data.resp.data.fundName
           			}
           			if(!self.editFund.fundtype){
           				self.editFund.fundtype=data.data.resp.data.fundType
           			}
          			self.editFundYieldBO=data.data.resp.data.fundYieldBO;
          			for(var i=0;i<self.editFundList.length;i++){ // 数据回显
    	            	if(self.editFundList[i].fundcode==self.editFund.fundcode){
    	            		self.editFund=angular.copy(self.editFundList[i]);
    	            		break;
    	            	}
    	            }
          			self.editFund.detailUrl=data.data.resp.data.detailUrl;
          			self.editFund.fundYieldHBBase=[];
          			if(data.data.resp.data.fundTypeFlag==0){// 货币
          				self.editFund.fundYieldHBBase= self.fundYieldHBBase;
          			 }else{
          				self.editFund.fundYieldHBBase= self.fundYieldFHBBase; 
          			 }
           		}else{
           			alert("接口返回信息:"+data.data.resp.resMsg);
           		}

                self.editFund.onlinetime = record.onlinetime;
                self.editFund.offlinetime = record.offlinetime;
                if(self.edit.position==5){
                    if(self.editFund.templateType==undefined){
                        self.editFund.templateType=1+"";
                    }else{
                        self.editFund.templateType=self.editFund.templateType+"";
                    }
                    if(self.editFund.templateType==3){
                        $("#saveMoneyAmount").val(self.editFund.saveMoneyAmount);

                    }
                }
           	}else{
           		alert(data.data.message);
           	}
           },function(response) {
               alert("请求失败了....");
           }
         );


	   }
   }
   
   //修改增加资讯
   self.upMsg=function(){
	   up_detail_div++;
	   if(up_detail_div>5){
		   alert("资讯最多添加5条！");
		   return;
	   }
	   var ids="upMessage"+up_detail_div;
		   var html="<div id='"+ids+"'><br/><div>"
	         +"<span>标题"+up_detail_div+"</span>"
	         +"<input  type='text' id='enditInfoTitle"+up_detail_div+"' value=''>"
	         +"</div><br/>"
	         +"<div>"
	         +"<span>链接"+up_detail_div+"</span>"
	         +"<input  type='text' id='enditInfoUrl"+up_detail_div+"' value=''>"
	         +"</div></div>"
	       $('#upMsg').append(html);
	  
    self.upIndexMsg=up_detail_div;
    
   }

    //修改标签
    self.updatLabel=function(){
        up_detail_div_label++;
        if(up_detail_div_label>3){
            alert("标签最多添加3条！");
            return;
        }
        var ids="upMessageLabel"+up_detail_div_label;
        var html="<div id='"+ids+"'><br/><div>"
            +"<span>标签"+up_detail_div_label+"</span>"
            +"<input  type='text' id='upLabel"+up_detail_div_label+"'>"
            +"</div></div>"
        $('#upLabelMsg').append(html);

        self.upLabelMasg=up_detail_div_label;
    }

   //修改删除增加的资讯
   self.removeUpMsg =function(){
	   if(up_detail_div<=1){
		  alert("资讯至少填一条"); 
		  return;
	   }
	   //detail_div = detail_div - 1;
	   var idUpMsg = "upMessage" + (up_detail_div).toString();
      $("#"+idUpMsg).remove();
      up_detail_div--;
      self.upIndexMsg=up_detail_div;
   }


    //修改删除增加的标签
    self.removeUpdateLabel =function(){
        if(up_detail_div_label<=1){
            alert("标签至少填一条");
            return;
        }
        //detail_div = detail_div - 1;
        var idUpMsg = "upMessageLabel" + (up_detail_div_label).toString();
        $("#"+idUpMsg).remove();
        up_detail_div_label--;
        self.upLabelMasg=up_detail_div_label;
    }
   /**
    * 基金的类型改变
    */
   self.editFundTypeChange=function(fundType){
	   self.editFund.fundrate=self.editFundYieldBO[fundType];
   }  
   
   
   
   
   /**
    * 修改网贷保存
    */
   self.editNetList=[];
   self.editNetConfirm=function(){

	   if(!self.editNet.recommendation && self.edit.position!=7){
		   alert("网贷推荐语不能为空");
		   return false;
	   }

       if(self.edit.position==6){
	       if(!self.editNet.rightTopLabel){
               alert("右上角标签不能为空");
               return false;
           }
           if(!self.editNet.buttonName){
               alert("按钮文案不能为空");
               return false;
           }
       }
       if(self.edit.position==7 ){

           if(!self.editNet.buttonName){
               alert("按钮文案不能为空");
               return false;
           }

          if(self.edit.productChannel==1){
              if(!self.editNet.label){
                  alert("标签文案不能为空");
                  return false;
              }
          }
       }

      /* if(self.edit.position==1){
           self.editNet.label=  self.editNet.label1+","+ self.editNet.label2;
       }*/
	   
	   self.editNet.productyield=self.editNet.basicYield;
	   self.editNet.extrayield="0";
	   //self.editNet.serialnotype=1+"";//产品唯一标识类型（0：产品类型，1：理财产品id）
	  // self.editNet.productserialno=self.editNet.productId;//产品唯一标识（取决于serialNoType）
	  // self.editNet.sortid=self.editNet.productId;// 排序id
	   
	   if(self.editNet.serialnotype==1){
//		  self.editNet.productserialno=self.editNet.productId;//产品唯一标识（取决于serialNoType）
//		  self.editNet.sortid=self.editNet.productId;// 排序id  
		self.editNet.productserialno=self.editNet.lcProductId;//产品唯一标识（取决于serialNoType）
		self.editNet.sortid=self.editNet.lcProductId;// 排序id   
	   }else if(self.editNet.serialnotype==0){
		   self.editNet.productserialno=self.editNet.productSecondCat;//产品唯一标识（取决于serialNoType）
		   self.editNet.sortid=self.editNet.productSecondCat;// 排序id
	   }else if(self.editNet.serialnotype==2){
           self.editNet.productserialno=self.editNet.productCat;//产品唯一标识（取决于serialNoType）
           self.editNet.sortid=self.editNet.productCat;// 排序id
       }else if(self.editNet.serialnotype==3){
           self.editNet.productserialno=self.editNet.productSecondCat+"-"+self.editNet.productPeriod;//产品唯一标识（取决于serialNoType）
           self.editNet.sortid=self.editNet.productSecondCat+"-"+self.editNet.productPeriod;// 排序id
           self.editNet.grade = self.editNet.creditRating;
           self.editNet.termUnit = self.editNet.productPeriodUnit;
       }
	   
	   
	  
	   self.editNet.term= self.editNet.productPeriod;//期限
	   self.editNet.onlinetime= self.editNet.onlinetime;//期限
	   self.editNet.offlinetime= self.editNet.offlinetime;//期限
	   self.editNet.productname= self.editNet.productName;
	   self.editNet.productyield=self.editNet.basicYield;
	   // 在添加页面回显
	   // 在添加页面回显
	   self.editNetTemp.recommendation=self.editNet.recommendation;
	   self.editNetTemp.buttonImageUrl=self.editNet.buttonimageurl;
	   self.editNet.id="";
	   if(self.editNetList.length<=0){
		   self.editNetList.push(self.editNet);
	   }else{
		   var count=0;
		   var len =self.editNetList.length;
		   for(var i=0;i<len;i++){// 去重
		  		count++;
		  		//if (self.editNetList[i].productCat=='T' || self.editNetList[i].productCat=='Z' || self.editNetList[i].productCat=='W' || self.editNetList[i].productCat=='B' || self.editNetList[i].productCat=='A'){// 产品ID
               if(self.checkFlag(self.editNetList[i],self.editNet.productChannel)){
			  		//if(self.editNetList[i].productId==self.editNet.productId){lcProductId
		  			if(self.editNetList[i].lcProductId==self.editNet.lcProductId){
			  			self.editNetList.splice(i,1,self.editNet);//替换相同的网贷产品
			  			break;
			  		}
		  		}else{
                   if(self.editNetList[i].productCat=='6' || self.editNetList[i].productCat=='8'){
                       if(self.editNetList[i].productSecondCat==self.editNet.productSecondCat && self.editNetList[i].productPeriod==self.editNet.productPeriod ){
                           self.editNetList.splice(i,1,self.editNet);//替换相同的网贷产品
                           break;
                       }
                   }else{
                       if(self.editNetList[i].productSecondCat==self.editNet.productSecondCat){
                           self.editNetList.splice(i,1,self.editNet);//替换相同的网贷产品
                           break;
                       }
                   }
		  		}
		  		if(count==len){
	  				 self.editNetList.push(self.editNet);
	  			}
		  	}
	   }
	   self.editOptionClose();
   }

   // 修改基金
   self.editFundList=[];
   self.editFundConfirm=function(){
	   

	 if(self.edit.position!=3 && self.edit.position!=5){
		   
	   if(!self.editFund.recommendation){
		   alert("网贷推荐语不能为空");
		   return false;
	   }
	   if(!self.editFund.reasonup){
		   alert("推荐理由上不能为空");
		   return false;
	   }
	   if(!self.editFund.reasonleft){
		   alert("推荐理由左不能为空");
		   return false;
	   }
	   if(!self.editFund.reasonright){
		   alert("推荐理由右不能为空");
		   return false;
	   }
	 }


       if(self.edit.position==5){
           if(!self.editFund.templateType){
               alert("模板类型不能空");
               return false;
           }
           if(!self.editFund.recommendation){
               alert("推荐语不能为空");
               return false;
           }

           if(!self.editFund.topLeftLabel){
               alert("左上角标签不能为空");
               return false;
           }

           if(!self.editFund.buttonText){
               alert("按钮文案不能为空");
               return false;
           }


           if(self.editFund.templateType==2 || self.editFund.templateType==3){
               var upLabel = "";
               for(var i=1;i<=self.upLabelMasg;i++){
                   var labelStr = $("#upLabel"+i).val();
                   upLabel+=","+labelStr;
               }
               self.editFund.label=  upLabel.substring(1);
           }

           if(self.editFund.templateType==3){
               if(!self.editFund.saveMoneyAmount){
                   alert("存钱金额不能为空");
                   return false;
               }

               if(!self.editFund.yearEarnings){
                   alert("预计收益不能为空");
                   return false;
               }
           }
       //    self.forCreatKey = false;
           up_detail_div_label=1;
       }

	 if(self.edit.position==3){
		 if(!self.editFund.labelOne){
			 alert("个性标签1不能为空");
			 return false;
		 }
		 if(!self.editFund.labelTwo){
			 alert("个性标签2不能为空");
			 return false;
		 }
		 if(!self.editFund.buttonText){
			alert("按钮文案不能为空"); 
			return false;
		 }
	 }
	   if(!self.editFund.fundtype){
		   alert("基金类型不能为空");
		   return false;
	   }
	   //self.editFund.fundtype=self.editFund.fundType;
	   if(!self.editFund.fundname){
		   alert("基金名称不能为空");
		   return false;
	   }
//	   self.editFund.fundname=self.editFund.fundName;
	   self.editFund.fundid=self.editFund.fundCode;
//	   self.editFund.fundcode=self.editFund.fundCode;
	   if(!self.editFund.ratetype){
		   alert("利率类型不能为空");
		   return false;
	   }
	   
	   if(!self.editFund.urltype){
		   alert("链接类型不能为空");
		   return false;
	   }
	   if(self.editFund.urltype==1){
		   self.editFund.url=angular.copy(self.editFund.detailUrl);
	   }
	   
	   if(self.edit.position==3){
	      var enditInfoTitle1 =  $("#enditInfoTitle1").val();
           var enditInfoUrl1 =  $("#enditInfoUrl1").val();
		   if(!enditInfoTitle1){
			   alert("资讯标题至少填写一条");
			   return false;
		   }
		   
		   if(!enditInfoUrl1){
			   alert("资讯链接至少填写一条");
			   return false;
		   }
	   
	   var content = "";
		  for(var i=1;i<=self.upIndexMsg;i++){
			  var informationTitle = $("#enditInfoTitle"+i).val();
			  var informationUrl = $("#enditInfoUrl"+i).val();
			   content+=',{"informationUrl":"' + informationUrl +'","informationTitle":"' + informationTitle +'"}';
		  } 
		  self.editFund.informationUrl = "[" + content.substring(1) + ']';
		  self.infoMsg =  self.editFund.informationUrl;
	     self.forCreatKey = false;
	 }
	   
	   
	   self.editFund.sortid=self.editFund.fundcode;
	   self.editFund.fundid=self.editFund.fundcode;
	   // 在添加页面回显
	   //self.editFundTemp=angular.copy(self.editFund);
	   //self.editFundTemp=self.editFund;
	   self.editFundTemp.recommendation=self.editFund.recommendation;
	   self.editFundTemp.buttonImageUrl=self.editFund.buttonimageurl;
	   self.editFundTemp.buttonText = self.editFund.buttonText;
	   self.newEditFund = self.editFund;
	   if(self.editFundList.length<=0){
		   self.editFundList.push(self.editFund);
	   }else{
		   var count=0;
		   var len =self.editFundList.length;
		   for(var i=0;i<len;i++){// 去重
		  		count++;
		  		if(self.editFundList[i].sortid==self.editFund.fundcode){
		  			self.editFundList.splice(i,1,self.editFund);//替换相同的网贷产品
		  			break;
		  		}else{
		  			if(count==len){
		  				 self.editFundList.push(self.editFund);
		  			}
		  		}
		  	}
	   }
       self.newEditFundList = self.editFundList;
	   self.editOptionClose();
   }
   
   /**
    * 修改网贷保存
    */
   self.editInsuranceList=[];
   self.editInsuranceConfirm=function(){

	   if(!self.editInsurance.recommendation){
		   alert("网贷推荐语不能为空");
		   return false;
	   }
	   if(!self.editInsurance.imageurl){
		   alert("推荐图片不能为空");
		   return false;
	   }
	   if(!self.editInsurance.productname){
		   alert("产品名称不能为空");
		   return false;
	   }
	   if(!self.editInsurance.premium){
		   alert("保费不能为空");
		   return false;
	   }
	   if(!self.editInsurance.company){
		   alert("保险公司不能为空");
		   return false;
	   }
	   if(!self.editInsurance.url){
		   alert("链接地址不能为空");
		   return false;
	   }
	   
	   // 在添加页面回显
	   // 在添加页面回显
	   self.editInsuranceTemp.recommendation=self.editInsurance.recommendation;
	   self.editInsuranceTemp.buttonImageUrl=self.editInsurance.imageurl;
	   if(self.editInsuranceList.length<=0){
		   self.editInsuranceList.push(self.editInsurance);
	   }else{
		   var count=0;
		   var len =self.editInsuranceList.length;
		   for(var i=0;i<len;i++){// 去重
		  		count++;
		  		if(self.editInsuranceList[i].sortid==self.editInsurance.sortid){
		  			self.editInsuranceList.splice(i,1,self.editInsurance);//替换相同的网贷产品
		  			break;
		  		}else{
		  			if(count==len){
		  				 self.editInsuranceList.push(self.editInsurance);
		  			}
		  		}
		  	}
	   }
	   self.editOptionClose();
   }

   /***修改保存银行精选****/
    self.editBankList=[];
    self.editBankConfirm = function () {

        if(self.edit.productChannel==1) {
            if (!self.editBank.reasontext) {
                alert("银行精选推荐语不能为空");
                return false;
            }
            if (!self.editBank.reasonup) {
                alert("推荐理由上不能为空");
                return false;
            }
            if (!self.editBank.reasonleft) {
                alert("推荐理由左不能为空");
                return false;
            }
            if (!self.editBank.reasonright) {
                alert("推荐理由右不能为空");
                return false;
            }
        }
        if(!self.editBank.productname){
            alert("产品名称不能为空");
            return false;
        }
        self.editBank.buttonpicurl = $("#editBankfileUrl1").val();
      /*  self.addBank.bankProductId = self.addBank.bankProductId;
        self.addBank.bankname =self.addBank.bankName;
        self.addBank.bankcode = self.addBank.bankCode;
        self.addBank.reasontext =self.addBank.reasonText;
        self.addBank.reasonleft = self.addBank.reasonLeft;
        self.addBank.reasonright =self.addBank.reasonRight;
        self.addBank.reasonup = self.addBank.reasonUp;
        self.addBank.buttonpicurl =self.addBank.buttonPicUrl;
        self.addBank.bankproductid = self.addBank.bankProductId;
        self.addBank.productname =self.addBank.productName;
        self.addBank.rate = self.addBank.profit;
        self.addBank.deadline =self.addBank.period;
        self.addBank.ratetype = self.addBank.profitDesc;
        self.addBank.redicttype =self.addBank.redictType;
        self.addBank.redicturl = self.addBank.redictUrl;
        self.addBank.onlinetime =self.addBank.onlineTime;
        self.addBank.offlinetime =self.addBank.offlineTime;*/
        //self.editBank.id="";
        // 在添加页面回显
        if(self.edit.productChannel==1 ||self.edit.productChannel==6){
            self.editBankTemp.recommendation=self.editBank.reasontext;
            self.editBankTemp.buttonImageUrl=self.editBank.buttonpicurl;
        }else{
            self.editBankTemp.recommendation=self.editBank.labelOne;
            self.editBankTemp.buttonImageUrl="--";
        }


        if(self.editBankList.length<=0){
            self.editBankList.push(self.editBank);
        }else{
            var count=0;
            var len =self.editBankList.length;
            for(var i=0;i<len;i++){// 去重
                count++;
                if(self.editBankList[i].sortid==self.editBank.sortid){
                    self.editBankList.splice(i,1,self.editBank);//替换相同的银行精选产品
                    break;
                }else{
                    if(count==len){
                        self.editBankList.push(self.editBank);
                    }
                }
            }
        }
        self.editOptionClose();
   }


   /**
    * 查询产品
    */
   self.editSearchProduct=function(){

	 if( !self.edit.productChannel && self.edit.productChannel!=0){
   		alert("渠道不能为空");
           return;
   	}
   	if( !self.edit.producttype){
   		alert("产品类型不能为空");
           return;
   	}
   	if( !self.edit.position){
   		alert("推荐位置不能为空");
        return;
   	}
   	if(!self.edit.productInfo){
   		alert("请输入查询条件");
        return;
   	}
   	var position= self.edit.position;
   	var kind=self.edit.kind;
   	if((self.edit.position==2 ||self.edit.position==5) &&kind==1 && self.edit.productInfo.length!=6 && self.edit.productChannel != 0){
   		alert("请正确输入6位数基金代码");
           return;
   	}

 	var url = globalConfig.basePath+"/product/productDetail";
   	//var url = globalConfig.basePath+URIStr;
       $http.post(url,self.edit).then( function(data){
       	if(data.data.code == '000'){  
       		if(position==1 || position==6 || position==7 || (position==2 && self.add.productChannel==0) ){
       			if(data.data.resp.code=='000000'){
	       			 self.editSearchProductList=data.data.resp.data;
	 				 if(!self.editSearchProductList || self.editSearchProductList.length<=0){
	    				 	alert("未查到相应的结果");
	    			 	}
	       		}else{
	       			alert("网贷接口返回状态码:"+data.data.resp.code+" 信息:"+data.data.resp.message);
	       		}
       			
       		}
       		if((position==2 && self.add.productChannel!=0) || position==3 || position==4 || position==5){
       			if(kind==1){// 基金
       				if(data.data.resp.resCode=='0000'){
           				var listtem=[];
           				listtem.push(data.data.resp.data);
           				 self.editSearchProductList=listtem;
           			}else{
           				alert("基金接口返回状态码:"+data.data.resp.resCode+" 信息:"+data.data.resp.resMsg);
           			}
       			}
       			if(kind==2){// 保险
       			 self.editSearchProductList=data.data.resp;
       			if(!self.editSearchProductList ||self.editSearchProductList.length<=0){
   				 	alert("未查到相应的结果");
   			 	}
       			}
                if(kind==3){// 银行精选
                    self.editSearchProductList=data.data.resp;
                    if(!self.editSearchProductList ||self.editSearchProductList.length<=0){
                        alert("未查到相应的结果");
                    }
                }
      			
      		}
       		
       	}else{
       		alert(data.data.message);
       	}
       },function(response) {
           alert("请求失败了....");
       }
     );
	   
   }
 
   
   /**
    * 保存修改
    */
   self.editSubmit=function(cloneType){

	   if(!self.edit.productChannel && self.edit.productChannel!=0){
   		alert("渠道不能为空");
           return;
   	}
   	if(!self.edit.producttype){
   		alert("产品类型不能为空");
           return;
   	}
   	if(!self.edit.position){
   		alert("推荐位置不能为空");
           return;
   	}
       if(!self.edit.recommend){
           alert("推荐名称不能为空");
           return;
       }

   	self.edit.headimageurl=$("#editfileUrl1").val();

    // 验证推荐产品的相关的配置
    for(var i=0;i< self.editProductListBelow.length;i++){
    	if(self.edit.position!=3 && self.edit.position!=4 && self.edit.position!=7){
    		if(self.editProductListBelow[i].recommendation=='--' || self.editProductListBelow[i].recommendation==''){
    			alert("产品:"+self.editProductListBelow[i].name+"配置信息不能为空");
    			return
    		}
    	}else if(self.edit.position==3){
    		if(self.editProductListBelow[i].buttonText=='--' || self.editProductListBelow[i].buttonText==''){
    			alert("产品:"+self.editProductListBelow[i].name+"配置信息不能为空");
    			return ;
    		}
    	}
    	
    }

    if(self.edit.showType==0 || cloneType==2){
        // 上线时间，下线时间
        self.edit.onlinetime = $('#upOnlinetime').val()+"";
        self.edit.offlinetime = $('#upOfflineTime').val()+"";
        if(!self.edit.onlinetime|| !self.edit.offlinetime){
            alert("上线时间下线时间不能为空");
            return;
        }

        if(self.edit.offlinetime<=self.edit.onlinetime){
            alert("下线时间必须大于上线时间");
            return;
        }
    }
    if(self.edit.showType==0){
        self.edit.whiteId="";
    }

    var auditPerson = self.edit.auditPerson;
    if(!self.edit.auditPerson){
        alert("审核人不能为空");
        return ;
    }else{
     	self.edit.auditNo=self.edit.auditPerson.no;
     	self.edit.requestAuditPersonEmail=self.edit.auditPerson.email;
     	self.edit.auditPerson=self.edit.auditPerson.name;
    }
   
   	
	// 处理排序字段问题
   	var productsort="";
//   	self.editSortIdList=[];
//   	self.editSortIdList=self.edit.productsort.split(",");
//   	for(var j=0;j<self.editSortIdList.length;j++){
//   		productsort=productsort+self.editSortIdList[j];
//   		if(j<self.editSortIdList.length-1 && productsort){
//   			productsort=productsort+",";
//   		}
//   	}
   	
   	for(var j=0;j<self.editProductListBelow.length;j++){
   	    /*if(self.editProductListBelow[j].productCat=='6'){
            productsort=productsort+self.editProductListBelow[j].id+"-"+self.editProductListBelow[j].productPeriod;
        }else{
            productsort=productsort+self.editProductListBelow[j].id;
        }*/
        productsort=productsort+self.editProductListBelow[j].id;
   		if(j<self.editProductListBelow.length-1 && productsort){
   			productsort=productsort+",";
   		}
   	}
   	self.edit.productsort=productsort;
       if(self.edit.showType==0){
           self.edit.whiteId="";
       }

	debugger
   	// 封装数据
   	self.editList={};
   	self.editList.recommend=self.edit;
   	if(self.edit.producttype==1){
   		self.editList.netLoanList= self.editNetList; //网贷
   	}else{
   		// 基金
   	   	self.editList.fundList= self.editFundList; // 基金
   		// 保险
   		self.editList.insuranceList= self.editInsuranceList; // 基金

        // 银行
        self.editList.bankHandpickList = self.editBankList;

   	}

        if(cloneType==2){
            var url = globalConfig.basePath+"/product/add";
        }else{
            var url = globalConfig.basePath+"/product/edit";
         }
       self.editList.recommend.whiteId = self.editList.recommend.whiteId.toString();
        $http.post(url,self.editList).then( function(data){
       	if(data.data.code == '000'){   
       		self.operationType='0';
       		self.searchProduct(1);
       	 	alert(data.data.message);
       	 	
       	}else{
       	    alert(data.data.message)
        }
       },function(response) {
           alert("请求失败了....");
       }
     );
   }
    
 
   

   
   self.showName=function(x,productChannel){
//	   季账户-3个月、季账户-6个月、季账户-9个月
//	   年账户-1年、年账户-2年、年账户-3年、年账户-4年
//	   保贝计划-3个月、保贝计划-6个月、保贝计划-1年 、万元宝100天、万元宝300天
//	   新手专享+期限
//	   自由计划+期限
//	   会员尊享
//	   
//	   id+类型
//		   产品ID+限时特供+期限
//		   产品ID+专属产品+期限
	   var name="";
	   
	   if(x.productCat=='M'){
		   name= "月账户"+x.productPeriod +"天";
	   }
	   if(x.productCat=='Q'){
		   if( x.productSecondCat=='Q3'){
			   name= "季账户-3个月";
			}
		   if( x.productSecondCat=='Q6'){
			   name= "季账户-6个月";
			}
		   if( x.productSecondCat=='Q9'){
			   name= "季账户-9个月";
			}
	   }
	   if(x.productCat=='Y'){
		   if( x.productSecondCat=='Y'){
			   name= "年账户-1年";
			}
		   if( x.productSecondCat=='Y12'){
			   name= "年账户-1年";
			}
//		   if( x.productSecondCat=='24Y'){
//			   name= "年账户-2年";
//			}
//		   if( x.productSecondCat=='36Y'){
//			   name= "年账户-3年";
//			}
//		   if( x.productSecondCat=='48Y'){
//			   name= "年账户-4年";
//			}
		   if( x.productSecondCat=='Y24'){
			   name= "年账户-2年";
			}
		   if( x.productSecondCat=='Y36'){
			   name= "年账户-3年";
			}
		   if( x.productSecondCat=='Y48'){
			   name= "年账户-4年";
			}

	   }

       if(x.productCat=='A' && productChannel == 0) {
           name= x.lcProductId+"-万元宝-"+x.productPeriod +"天";
           /* if (x.productSecondCat == 'A100') {
               name = "万元宝100天";
           }
           if (x.productSecondCat == 'A300') {
               name = "万元宝300天";
           }*/
       }

       if(x.productCat=='C'){
           name="十点取金";
       }

       if(x.productCat=='D' && productChannel == 0){
           name= x.lcProductId+"-如意保-"+x.productPeriod +"天";
       }

       if(x.productCat=='B' && productChannel == 1){
           name= x.lcProductId+"-保贝计划-"+x.productPeriod +"天";
       }

	   if(x.productCat=='ZY'){
		   name= "自由计划-"+x.productPeriod +"天";
	   }
	   if(x.productCat=='V' && productChannel == 1){
		   name="会员尊享-"+x.productPeriod +"天";;
	   }

       if(x.productCat=='V' && productChannel == 0){
           name=x.lcProductId+"-会员尊享-"+x.productPeriod +"天";;
       }

	   if(x.productCat=='X'){
		   name= "新手标-"+x.productPeriod +"天";
	   }
	   if(x.productCat=='T'){
		   //name= x.productId+"-限时特供-"+x.productPeriod +"天";
		   name= x.lcProductId+"-限时特供-"+x.productPeriod +"天";
	   }
	   if(x.productCat=='Z'){
		   //name= x.productId+"-专属产品-"+x.productPeriod +"天";
		   name= x.lcProductId+"-专属产品-"+x.productPeriod +"天";
	   }
	   if(x.productCat=='R'){
		   name= "自由计划-"+x.productPeriod +"天";
	   }
	   if(x.productCat=='W'){
		   name= x.lcProductId+"-万元宝-"+x.productPeriod +"天";
	   }
	   //10:预售, 20:在售
//	  if(x.sellStatus==20){
//		  name=name+"(在售)";
//	  }
	  if(x.sellStatus=='10'){
		  name=name+"(预售)";
	  }else{
		  name=name+"(在售)";
	  }
	  if(productChannel == 0){
          if(x.productCat=='C' || x.productCat=='D'){
              name=name+"-4.0.3以上显示";
          }else{
              name=name+"-4.0.0以上显示";
          }
      }
       //判断散标显示
       if(x.productCat=='6' || x.productCat=='8'){
           var unitStr="天";
           if(x.productPeriodUnit=='D'){
               unitStr="天";
           }else if(x.productPeriodUnit=='M'){
               unitStr="月";
           }else if(x.productPeriodUnit=='Y'){
               unitStr="年";
           }
           if(x.productSecondCat=='ZHSA' || x.productSecondCat=='ZHSC'){
               name=x.productName;
           }

           if(x.productSecondCat=='ZHST' || x.productSecondCat=='ZHSE' || x.productSecondCat=='ZHTWODEBT'){
               name = x.productName+"-"+x.productPeriod+unitStr;
           }

       }

	   return name;
   }


   // 获取值
   self.showValue=function(x,productChannel){
//	   季账户-3个月、季账户-6个月、季账户-9个月
//	   年账户-1年、年账户-2年、年账户-3年、年账户-4年
//	   保贝计划-3个月、保贝计划-6个月、保贝计划-1年
//	   新手专享+期限
//	   自由计划+期限
//	   会员尊享
//	   
//	   id+类型
//		   产品ID+限时特供+期限
//		   产品ID+专属产品+期限
	   var valueStr="";
	   
//	   if(x.productCat=='M' || x.productCat=='Q' || x.productCat=='Y' || x.productCat=='X' || x.productCat=='R' ||  x.productCat=='V'){
//		   valueStr= x.productSecondCat;
//	   }
	   
	   if(x.productCat=='T' || x.productCat=='Z' || x.productCat=='W' || x.productCat=='B' || x.productCat=='A'  || x.productCat=='D'  || (x.productCat=='V' && productChannel==0)){
		   valueStr= x.lcProductId;
	   }else{
	       if(x.productCat=='6' || x.productCat=='8'){
               valueStr= x.productSecondCat+"-"+x.productPeriod;
           }else{
               valueStr= x.productSecondCat;
           }

	   }
     /*  if(x.productCat=='T' || x.productCat=='Z'){
           valueStr= x.lcProductId;
       }else{
           valueStr= x.productSecondCat;
       }*/
	   return valueStr;
   }

   self.showBnakName = function(x){
       var bankValueStr="";
       if(x.bankProductId!=undefined && x.bankName!=undefined){
           bankValueStr=x.bankProductId+"-"+x.bankName+"-"+x.productName+"-"+x.period+"-(在售)";
       }
       return bankValueStr;
   }

   // 导出excel
   self.downFile=function(record){
	   window.open(globalConfig.basePath + "/product/downFile?productpushid=" +record.id);
   }

    self.checkFlag=function(para,productChannel){

       if(para.productCat=='T' || para.productCat=='Z' || para.productCat=='W' || para.productCat=='B' || para.productCat=='A'  || para.productCat=='D'  || (para.productCat=='V' &&  productChannel ==0)){
          return true;
       }
       return false;
    }


}]);
   



function addOption(){
	// 通过controller来获取Angular应用
	var appElement = document.querySelector('[ng-controller=productRecommendController]');
	// 获取$scope变量
	var self = angular.element(appElement).scope();
	self.addProductListBelow=[];
	self.addProductListBelow=angular.copy(self.addProductListRight);
	self.$apply();
}



function netSclose(){
	 $('.popups').css({ 'display': 'none' });
     $('.Peer-to-peer').css({ 'display': 'none' });
     $('.fund').css({ 'display': 'none' });
     $('.Insurance').css({ 'display': 'none' });
}


