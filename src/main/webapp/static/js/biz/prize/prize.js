'use strict';// 严谨模式
var App = angular.module('myApp', [], angular.noop);
App.controller('prizeController',['$scope','$http', function($scope,$http) {
	var self = $scope;
    self.search = {};// 查询
    self.add={};// 添加
    self.updatePopup={};// 修改
    self.showPopup={};// 查看

    //奖品列表查询
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
        var url = globalConfig.basePath+"/prize/pageQueryPrizeList";
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
        self.search.prizeType=null;
        self.search.couponId = null;
        self.search.name=null;
        self.search.activityCode=null;
        self.search.pageSize = "5";
    }

 //*************************************Add 奖品************************************
    //添加奖品
    self.addPrize = function(){
        self.add={};
        self.operationType = 1;
        $("#addChannel").prop("disabled",false);
        $("#activityCode").prop("disabled",false);
        $("#addPrizeType").prop("disabled",false);
        $("#addCouponId").prop("disabled",false);
        $("#addName").prop("disabled",true);
        $("#prizeValue").prop("disabled",false);
        $("#prizeValue2").prop("disabled",false);
        $("#prizeDesc").prop("disabled",false);

    }
    
    // 返回值
    self.upBanck = function(){
        self.reset();
        self.operationType = 0;
    }

    self.openActivityName=function(){
        self.search.channel=self.add.channel;
        if(self.search.channel==null){
            alert("渠道不能为空");
            return ;
        }
        self.pullActivityList();
        $("#openActivityName").show();
    }
    self.closeActivityName=function(){
        self.search.activityName=null;
        $("#openActivityName").hide();
    }
    /**
     * 拉取活动列表
     */
    self.pullActivityList = function(){
        var url = globalConfig.basePath+"/prize/getActivityList";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.activityList = data.data.resp;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    //$scope.pullActivityList();
    /**
     * 拉取奖品类型列表
     */
    $scope.pullPrizeType = function(){
        var url = globalConfig.basePath+"/prize/getPrizeTypeList";
        $http.get(url).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $scope.prizeTypeList = callback.data.resp;
            } else {
               console.error(callback.data);
                alert("查询奖品类型列表信息失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            console.error(response);
            alert("查询奖品类型列表信息异常");
        });
    };
    $scope.pullPrizeType();
    self.clickPrizeType = function(){
        if(self.add.prizeType==7 || self.add.prizeType==9 || self.add.prizeType==17){
            $("#addCouponId").prop("disabled",true);
            $("#addName").prop("disabled",false);
            self.add.couponId=null;
            self.add.name=null;
        }else {
            $("#addCouponId").prop("disabled",false);
            $("#addName").prop("disabled",true);
        }
    }
    /**
     * 获取卡券名称
     */
    self.getCouponName = function(){
        self.search.couponId=self.add.couponId;
        self.search.prizeType=self.add.prizeType;
        self.search.channel = self.add.channel;

        if(self.search.channel==null){
            alert("渠道不能为空");
            return ;
        }
        //卡券ID
        /*if(self.search.couponId==null){
            alert("卡券ID不能为空");
            return ;
        }
        //奖品类型
        if(self.search.prizeType==null){
            self.add.couponId=null;
            alert("奖品类型不能为空");
            return ;
        }*/
        var url = globalConfig.basePath+"/prize/getCouponName";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.add.name = data.data.resp.couponName;
                    //self.add.faceValue = data.data.resp.discount;
                    self.search.couponId=null;
                    self.search.prizeType=null;
                    self.search.channel=null;
                }else{
                    self.add.name=null;
                    self.search.couponId=null;
                    self.search.prizeType=null;
                    self.search.channel=null;
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    
    /**
     * 去掉空格
     */
    function removeAllSpace(str) {
        return str.replace(/\s+/g, "");
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
    //确认添加奖品
    self.commitPrize = function(){
        if(self.add.channel==null){
            alert("渠道不能为空");
            return ;
        }
        //活动
        if(!self.add.activityCode){
            alert("活动ID不能为空");
            return ;
        }
        //奖品类型
        if(self.add.prizeType==null){
            alert("奖品类型不能为空");
            return ;
        }
       // 奖品名称
        if(!self.add.name){
            alert("奖品名称不能为空");
            return ;
        }
        if(self.add.prizeType==17){
            if(self.add.prizeValue==null){
                alert("步值不能为空");
                return ;
            }
        }
        if(self.add.prizeType==7){
            if(self.add.prizeValue==null){
                alert("积分数值不能为空");
                return ;
            }
            if(self.add.prizeDesc==null){
                alert("奖品类型为积分，奖品描述必填");
                return ;
            }
        }/*else {
            if(self.add.couponId==null){
                alert("卡券ID不能为空");
                return ;
            }
        }*/
    		var url = "";
            url = globalConfig.basePath+"/prize/addPrize";
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
                self.operationType = 0;
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
       
    }

  //查看详情
    $scope.detailShowNew = function(id){
        self.operationType = 6;
        var url = globalConfig.basePath+"/prize/getPrizeDetail?id="+id;
        $http.get(url).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                self.edit = callback.data.resp;
            } else {
                console.error(callback.data);
                alert("查询奖品详细信息失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            console.error(response);
            alert("查询奖品详细信息异常");
        });
    }


   	// 修改
    self.update = function(query){
        self.operationType = 1;
        self.add=angular.copy(query);
        if(self.add.isAddPrizePool=='true'){
            $("#addChannel").prop("disabled",true);
            $("#activityCode").prop("disabled",true);
            $("#addPrizeType").prop("disabled",true);
            $("#addCouponId").prop("disabled",true);
            $("#addName").prop("disabled",true);
            $("#prizeValue").prop("disabled",true);
            $("#prizeValue2").prop("disabled",true);
            $("#prizeDesc").prop("disabled",true);
        }else {
            $("#addChannel").prop("disabled",false);
            $("#activityCode").prop("disabled",false);
            $("#addPrizeType").prop("disabled",false);
            if(self.add.prizeType==7 || self.add.prizeType==9 || self.add.prizeType==17){
                $("#addCouponId").prop("disabled",true);
                $("#addName").prop("disabled",false);
            }else {
                $("#addCouponId").prop("disabled",false);
                $("#addName").prop("disabled",true);
            }
            $("#prizeValue").prop("disabled",false);
            $("#prizeValue2").prop("disabled",false);
            $("#prizeDesc").prop("disabled",false);
        }

	}

    
    //默认查询
    self.loading = function(){
        self.search.prizeType=null;
        self.search.couponId = null;
        self.search.name=null;
        self.search.activityCode=null;
        self.search.pageSize = "5";
        self.operationType = 0;
        self.search.pageSize = "5";
        self.querySplashConfigList(1);
    }
    self.loading();

    // 添加奖品至奖池
    self.addPrizeToJackpot = function(query){
        self.operationType = 2;
        self.add=angular.copy(query);
        self.add.probability=100;

    }
    //确认添加奖品至奖池
    self.commitToJackpot = function(){
        //渠道
        if(self.add.channel==null){
            alert("渠道不能为空");
            return ;
        }

        //活动ID
        if(!self.add.activityCode){
            alert("活动ID不能为空");
            return ;
        }
        //奖品Id
        if(self.add.id==null){
            alert("奖品Id不能为空");
            return ;
        }
        // 奖池名称
       /* if(!self.add.prizePoolName){
            alert("奖品名称不能为空");
            return ;
        }*/
       //中奖概率
        if(self.add.probability==null){
            alert("中奖概率不能为空");
            return ;
        }
        if(!checkNum(self.add.probability)){
            alert("中奖概率不是数字");
            return ;
        }
        if (self.add.probability>100) {
            alert("中奖概率不能大于100");
            return ;
        }
        var url = "";
        url = globalConfig.basePath+"/prize/addPrizeToJackpot";
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
                self.operationType = 0;
                self.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );

    }
    
    //截取字符串
    self.CutStr = function(pStr, pLen){
    	 self.add.faceValue = cutString(pStr, pLen);
    }
    
    /* 
     * 取得指定长度的字符串 
     * 注：半角长度为1，全角长度为2 
     *  
     * pStr:字符串 
     * pLen:截取长度 
     *  
     * return: 截取后的字符串 
     */  
    function cutString(pStr, pLen) {  
      
        // 原字符串长度  
        var _strLen = pStr.length;  
      
        var _tmpCode;  
      
        var _cutString;  
      
        // 默认情况下，返回的字符串是原字符串的一部分  
        var _cutFlag = "1";  
      
        var _lenCount = 0;  
      
        var _ret = false;  
      
        if (_strLen <= pLen/2) {  
            _cutString = pStr;  
            _ret = true;  
        }  
      
        if (!_ret) {  
            for (var i = 0; i < _strLen ; i++ ) {  
                if (isFull(pStr.charAt(i))) {  
                    _lenCount += 2;  
                } else {  
                    _lenCount += 1;  
                }  
      
                if (_lenCount > pLen) {  
                    _cutString = pStr.substring(0, i);  
                    _ret = true;  
                    break;  
                } else if (_lenCount == pLen) {  
                    _cutString = pStr.substring(0, i + 1);  
                    _ret = true;  
                    break;  
                }  
            }  
        }  
          
        if (!_ret) {  
            _cutString = pStr;  
            _ret = true;  
        }  
      
        if (_cutString.length == _strLen) {  
            _cutFlag = "0";  
        }  
      
        return _cutString;  
    }  
      
    /* 
     * 判断是否为全角 
     *  
     * pChar:长度为1的字符串 
     * return: true:全角 
     *          false:半角 
     */  
    function isFull (pChar) {  
        if ((pChar.charCodeAt(0) > 128)) {  
            return true;  
        } else {  
            return false;  
        }  
    } 


}]);
   



