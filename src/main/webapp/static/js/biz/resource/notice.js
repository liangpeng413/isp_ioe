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
    self.position="";

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



    // 获取位置
    self.getPostionList = function(productChannel,opType){
        //var addproductChannel = $("#searchproductChannel").val();//渠道

        if(productChannel=='3' || productChannel=='6'){
            //机器人使用和悟空理财app一样的公告类型
            productChannel='0';
        }

        var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_announcement&productChannel="+productChannel;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if(data.data.resp.result.length==0){
                self.positionsList =[];
                // self.search.position='';
            }else{
                self.positionsList = data.data.resp.result;
                if(opType==1){
                    self.noticeType="";
                }
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取互动板块位置失败了....");
        });
    }
    self.getPostionList(0,0);


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
        self.search.onTime = $("#searchonTime").val()+"";
        self.search.offTime = $("#searchoffTime").val()+"";
        if(self.search.onTime!="" && self.search.offTime!=""){
            if(self.search.offTime<=self.search.onTime){
                alert("下线时间必须大于上线时间");
                return;
            }
        }


        var url = globalConfig.basePath + "/appConfig/announcementNew/query";//appConfig/announcement
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
    self.reset2 = function(){
        // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.status="";//上线状态
        self.search.valid="";//是否生效
        self.search.position="";//公告位置
        self.search.priority="";
        self.search.auditStatus="";
        self.search.type="";
        //self.search.onTime="";//在线时间
        $("#searchonTime").val("");
        $("#searchoffTime").val("");
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

   // self.selctPageOne= function(){
   //     if(self.noticeType=='1' && self.add.productChannel=='0'){
   //         var jummpType=self.jumpType;
   //         var type="gonggao_onePage";
   //         if(jummpType=='3'){
   //             $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
   //             ).success(function(data) {
   //                 $scope.rDictList = data.resp.result;
   //             })
   //         }
   //     }
   //
   // }
    $scope.selctPageOne =function(){
        if(self.jumpType=='3'){
        	 var type="wk_protogenesis_page_one"
                 //原生original_bd_url
                 $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
                 ).success(function(data) {
                     $scope.rDictList = data.resp.result;
                 })
           /* var type="gonggao_onePage"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })*/
        }

    }
    $scope.selctPageOne2 =function(){
        if(self.jumpType=='3'){
        	 var type="wk_protogenesis_page_one"
                 //原生original_bd_url
                 $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
                 ).success(function(data) {
                     $scope.rDictList = data.resp.result;
                 })
         /*   var type="gonggao_onePage"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })*/
        }
    }

    $scope.updateSelctPageOne = function(){
        if(self.redirectType=='3'){
            self.updatePageOne='';
            self.updataePageTwo='';
            	  var type="wk_protogenesis_page_one"
                      //原生original_bd_url
                      $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
                      ).success(function(data) {
                    	  $scope.updateRDictList = data.resp.result;
                      })
            	
           /* $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.updateRDictList = data.resp.result;
            })*/
        }
    }
    //添加公告 根据一级页面查询二级页面
    $scope.selectPageOneByRDict = function(pageOneByRDict){
    	  var type = "wk_protogenesis_page_two";
          $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+pageOneByRDict
          ).success(function(data) {
        	  $scope.rPositionDictList = data.resp.result;
              if($scope.rPositionDictList.length=='1'){
            	  $scope.notpaType=data.resp.result[0].value;
              }else{
            	  $scope.notpaType=data.resp.result[0].value;
              }
          })
    	
       /* $http.get(globalConfig.basePath + "/dict/getByResourceType"+"?resourceType="+pageOneByRDict
        ).success(function(data) {
            $scope.rPositionDictList = data.resp.result;
            if($scope.rPositionDictList.length=='1'){
                $scope.notpaType=data.resp.result[0].value;
            }else{
                $scope.notpaType=data.resp.result[0].value;
            }
        })*/

    }
    //添加公告
    self.addPopup = function(){
        self.pageOneByRDict='';
        self.notpaType='';
        self.add={};
        self.addPositionsList =[];
        $('#addLoginStatus0').prop("checked", "checked");
        var productVersion=$("#addproductChannel").val();
        // if(productVersion=="0"){
        //     $scope.dd.productVersion="2.2";
        // }
        //
        // self.add.productVersion="1";
        $scope.add.productVersion='3.8及以上';
        $scope.add.productVersion2='4.8.3及以上';
        $scope.add.productVersion3='1.0及以上';
        if(self.noticeType=='1' && self.jumpType=='2'){
            var type="gonggao_onePage"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }
        self.firstPage='';
        self.myPage='';
        self.noticeType='1';
        $('#addShow').show();


        self.add.productChannel = "0";
        self.add.valid = "1";
        //self.getAddTypeVersionList(0);
        self.add.position="0";
        self.queryWhiteAndBlack();
        self.getPostionList(0,0)
    }

    
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

    // $scope.selectPageTwoInDict(type){
    //
    // }
    //确认添加公告
    $scope.commitScreen = function(){
         //平台公告校验
        if(self.noticeType!='2' && self.noticeType!='7' && self.noticeType!='8' && self.noticeType!='9' && self.noticeType!='10'){
            if(!self.add.title){
                alert("公告标题不能为空");
                return;
            }

        }else{

            if(!self.add.zxtitle){
                alert("咨询标题不能为空");
                return;
            }
            self.add.title = self.add.zxtitle;

        }








        if(self.add.productChannel==null){
            alert("渠道不能为空");
            return ;
        }
        var productVersion=self.add.productVersion;

        var firstPage=self.firstPage;
        var myPage=self.myPage;
        var position = "";
        var addPositionHome = $('input:checkbox[id="firstPage"]:checked').val();
        if (addPositionHome != null && addPositionHome != '') {
            position = position + addPositionHome;
        }
        var addPositionJFB = $('input:checkbox[id="myPage"]:checked').val();
        if (addPositionJFB != null && addPositionJFB != '') {
            if (position != "") {
                position = position + "," + addPositionJFB;
            }else {
                position = position + addPositionJFB;
            }
        }
        var addPositionLife = $('input:checkbox[id="lifePage"]:checked').val();
        if (addPositionLife != null && addPositionLife != '') {
            if (position != "") {
                position = position + "," + addPositionLife;
            }else {
                position = position + addPositionLife;
            }
        }
        var addPositionRight = $('input:checkbox[id="rightPage"]:checked').val();
        if (addPositionRight != null && addPositionRight != '') {
            if (position != "") {
                position = position + "," + addPositionRight;
            }else {
                position = position + addPositionRight;
            }
        }
        var addPositionBank = $('input:checkbox[id="bankSelect"]:checked').val();
        if (addPositionBank != null && addPositionBank != '') {
            if (position != "") {
                position = position + "," + addPositionBank;
            }else {
                position = position + addPositionBank;
            }
        }
        var addPositionMine = $('input:checkbox[id="minePage"]:checked').val();
        if (addPositionMine != null && addPositionMine != '') {
            if (position != "") {
                position = position + "," + addPositionMine;
            }else {
                position = position + addPositionMine;
            }
        }
        var addPositionConfirmOrder = $('input:checkbox[id="confirmOrderPage"]:checked').val();
        if (addPositionConfirmOrder != null && addPositionConfirmOrder != '') {
            if (position != "") {
                position = position + "," + addPositionConfirmOrder;
            }else {
                position = position + addPositionConfirmOrder;
            }
        }
        var addPositionCashier = $('input:checkbox[id="cashierPage"]:checked').val();
        if (addPositionCashier != null && addPositionCashier != '') {
            if (position != "") {
                position = position + "," + addPositionCashier;
            }else {
                position = position + addPositionCashier;
            }
        }
        var addPosition9fb = $('input:checkbox[id="9fbPage"]:checked').val();
        if (addPosition9fb != null && addPosition9fb != '') {
            if (position != "") {
                position = position + "," + addPosition9fb;
            }else {
                position = position + addPosition9fb;
            }
        }
       /* var addNoCarousel = $('input:checkbox[id="noCarousel"]:checked').val();
        if (addNoCarousel != null && addNoCarousel != '') {
            if (position != "") {
                position = position + "," + addNoCarousel;
            }else {
                position = position + addNoCarousel;
            }
        }*/
       // 高高类型为月月回款时，位置默认传4
        if((self.add.productChannel==0 && self.noticeType==12) || (self.add.productChannel==1 && self.noticeType==11)){
            if (position != "") {
                position = position +",4";
            }else {
                position = position +"4";
            }
        }

        var type;//公告类型
        type=self.noticeType;
        self.add.type=type;

        var addpositionsText = $("#addOpType").find("option:selected").text();
        if(!addpositionsText||addpositionsText=='全部'){
            alert("公告类型不能为空");
            return ;
        }
        self.add.typeName = addpositionsText;
        /*if(self.add.productChannel==0 &&  self.add.type!=11){
            if (position == ""){
                alert("请选择轮播位置");
                return;
            }
        }else if(self.add.type==1){
            if (position == ""){
                alert("平台公告需选择轮播位置");
                return;
            }
        }*/
        if(self.add.type==1) {
            if (self.add.productChannel != 3) {
                if (position == "") {
                    alert("平台公告需选择轮播位置");
                    return;
                }

            }

        }
        //公告正文
        var announcementDesc;
        announcementDesc=self.add.announcementDesc;
        if(announcementDesc==null || announcementDesc==''){
            alert("公告正文不能为空");
            return;
        }
        if(announcementDesc.length>5000){
            alert("公告正文不能大于5000");
            return;
        }
        //跳转类型
        var redirectType;
        if(self.noticeType=='1' && self.add.productChannel=='0'){
            redirectType=self.jumpType;
        }else if(self.noticeType=='2' && self.add.productChannel=='0'){
            redirectType=self.pxzxJump;
        }else if(self.add.productChannel=='1' && self.noticeType=='1'){
            redirectType=self.ptggJumpType;
        } else if (self.add.productChannel == '1' || self.add.productChannel == '6') {
            redirectType=self.ppzxJumpType;
        }
        console.log("redirectType" + redirectType)
        console.log("productChannel" + self.add.productChannel)
        console.log("noticeType" + self.noticeType)
        self.add.redirectType=redirectType;

        //跳转链接
        var redirectUrl;
        // if(self.jumpType=='2' && self.noticeType=='1' && self.add.productChannel=='0'){
        //     redirectUrl=self.jumpTypeAddress;
        // }else if(self.pxzxJump=='2' && self.noticeType=='2' && self.add.productChannel=='0'){
        //     redirectUrl=self.pxzxJumpAddress;
        // }else if(self.ppzxJumpType=='2' && self.add.productChannel=='1' && self.noticeType=='2'){
        //     redirectUrl=self.pxzxJumpAddress;
        // }
        if(self.jumpType=='2' && self.noticeType=='1' && self.add.productChannel=='0'){
            redirectUrl=$("#jumpTypeAddress").val();
        }else if(self.pxzxJump=='2' && self.noticeType=='2' && self.add.productChannel=='0'){
            redirectUrl=$("#pxzxJumpAddress3").val();
            //redirectUrl=self.pxzxJumpAddress;
        } else if (self.ppzxJumpType == '2' && (self.add.productChannel == '1' || self.add.productChannel == '6')) {
            redirectUrl=$("#pxzxJumpAddress4").val();
           // redirectUrl=self.pxzxJumpAddress;
        }
        if(self.add.productChannel == '0' && self.jumpType == '3'){
            if(!self.pageOneByRDict){
                alert("页面类型不能为空");
                return;
            }
            if(!self.notpaType){
                alert("跳转页面不能为空");
                return;
            }
        }

        if(redirectUrl!=undefined){
            if(redirectUrl==null || redirectUrl==''){
                alert("跳转链接不能为空");
                return;
            }
        }

        self.add.redirectUrl=redirectUrl;
        //二级页面
        var pageOneId=self.pageOneByRDict;
        var pageTwo=self.notpaType;
        self.add.pageTwo=pageTwo;
        self.add.pageOne=pageOneId;
        //是否生效
        var valid=self.shengxiao;
        self.add.valid=valid;
        //上线时间  下线时间
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
        /*var offlineTime =self.add.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime="23:59:59";
        self.add.offlineTime = offlineTimes[0]+" "+miniTime;*/
        self.add.position=position;
        //审核人
        var requestAuditPersio =self.add.auditPerson;
        //提审说明
        var auditDescription=self.add.requestAuditDescription;
        // 审核人
        if(!requestAuditPersio){
            alert("审核人不能为空");
            return ;
        }else{
            self.add.auditNo=self.add.auditPerson.no;
            self.add.auditPerson=self.add.auditPerson.name;
        }
        if(auditDescription!=null){
            if(auditDescription.length>18){
                alert("审核说明不能超过18个子");
                return;
            }
        }
        var url = globalConfig.basePath + "/appConfig/announcementNew/adds";
        // var url = globalConfig.basePath+"/appConfig/Popup/addPopup";
        $http.post(url,self.add).then(
            function(data){
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
               // self.querySplashConfigList(1);
                window.location.reload();
            },function(response) {
                alert("请求失败了....");
                window.location.reload();
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
        var pageOne=query.pageOne;
        var pageTwo=query.pageTwo;
        var pageOneType="wk_protogenesis_page_one";
      
        $http.get(globalConfig.basePath + "/rDict/getByid?pageOne="+pageOne+"&pageType="+pageOneType
        ).success(function(data) {
            //self.showPopup.pageOne= data.resp.description;
        	self.showPopup.pageOne= data.resp.label;
        })
        
       self.getTwoValue(pageTwo);
        $('#showPopupCheck').show();

    }

    self.getTwoValue = function(pageTwo){
    	  var pageTwoType="wk_protogenesis_page_two"
    		  $http.get(globalConfig.basePath + "/rDict/getByid?pageOne="+pageTwo+"&pageType="+pageTwoType
    	        ).success(function(data) {
    	          
    	        	  self.wakkk=data.resp;
    	        })
    } 
    
    self.checkOKAndNO=function(){
        $('#showPopupCheck').hide();
        window.location.reload();
    }

    //修改取消按钮
    $scope.hsjgonto = function(){
        $('.upCk').each(function() {
            $(this).prop("checked",false);
        });
        $("#upateNotice").hide();
    }
//************************修改*****************************
    self.updatePageOneByRDict = function (updatePageOne){
        $http.get(globalConfig.basePath + "/dict/getByResourceType"+"?resourceType="+updatePageOne
        ).success(function(data) {
            $scope.upatePositionDictList = data.resp.result;
            $scope.updataePageTwo=data.resp.result[0].value;
        })

    }

    self.update = function(query){
        self.updatePageOne='';
        self.updataePageTwo='';
        $scope.detail = angular.copy(query);
        self.productChannel=query.productChannel+'';
        var position=query.position;
        var positStr = position.split(",");
        for(var i=0;i<positStr.length;i++){
            $('.upCk').each(function() {
                if ($(this).val() == positStr[i]) {
                    $(this).prop("checked",true);
                }
            });
        }
        /*if(position=='1'){
            self.firstPage=1;
        }else{
            self.myPage=2;
        }*/
        //self.position=query.position;
        console.info($scope.detail);
        self.redirectType=query.redirectType+'';
        self.updateOnlineTime=query.onlineTime+'';
        self.updateOfflineTime=query.offlineTime+'';
        self.requestAuditPersion2=query.requestAuditPersion+'';
        self.updatePageOne=$scope.detail.pageOne+"";
        self.updataePageTwo=$scope.detail.pageTwo+"";
        if(self.redirectType=='3' && self.productChannel=='0'){
        	
        	 var type="wk_protogenesis_page_one"
                 //原生original_bd_url
                 $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
                 ).success(function(data) {
                	 $scope.updateRDictList = data.resp.result;
                 })
        }
        
        if(self.updatePageOne!=null && self.updatePageOne!=''){
        	var type = "wk_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList"+"?type="+type+"&value="+self.updatePageOne
            ).success(function(data) {
                $scope.upatePositionDictList = data.resp.result;
            })
        }


        $('#upateNotice').show();

        self.requestAuditPersion2 = null;
        //self.updateScene.productChannel=query.productChannel;
       // self.updateScene.positions=query.positions;
        //$("#editproductChannel").val(query.productChannel);
        //self.queryWhiteAndBlack();
        //self.queryEditWhiteAndBlack();
        //self.updateScene = query;
        //self.updateScene.auditPerson="";



        if(query.showType==0){


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

 self.updateSure =function() {
     var id = $scope.detail.id;
      var position = "";
     // var addPositionHome = $('input:checkbox[id="firstPage2"]:checked').val();
     // if (addPositionHome != null && addPositionHome != '') {
     //     position = position + addPositionHome;
     // }
     // var addPositionJFB = $('input:checkbox[id="myPage2"]:checked').val();
     // if (addPositionJFB != null && addPositionJFB != '') {
     //     if (position != "") {
     //         position = position + "," + addPositionJFB;
     //     } else {
     //         position = position + addPositionJFB;
     //     }
     // }
     // if (position == "") {
     //     alert("请选择产品位置");
     //     return;
     // }
     var title;
     title = self.detail.title;//公告标题
     if (title == undefined || title == null) {
         title = self.adetail.title2;
     }
     if (title == null || title == "") {
         alert("标题不能为空");
         return;
     }
     if (title.length > 30) {
         alert("标题不能大于30");
         return;
     }

     var announcementDesc = $scope.detail.announcementDesc;
     if (announcementDesc == null || announcementDesc == "") {
         alert("正文不能为空");
         return;
     }
     if (announcementDesc.length > 5000) {
         alert("公告正文不能大于5000");
         return;
     }
     var redirectUrl;
     var redirectType = self.redirectType;
     if(redirectType=='1' || redirectType=='3') {
         redirectUrl = "";
     }else{
         redirectUrl=self.detail.redirectUrl;
             if( redirectUrl==null || redirectUrl == ""){
                 alert("跳转链接不能为空");
                 return;
             }
     }
     if(self.redirectType == '3'){
         if(!self.updatePageOne){
             alert("页面类型不能为空");
             return;
         }
         if(!self.updataePageTwo){
             alert("跳转页面不能为空");
             return;
         }
     }

     var pageTwo = self.updataePageTwo;
     var pageOne=self.updatePageOne;
     var valid = self.detail.valid+'';
     var onlineTime = $('#updateOnlineTime').val() + '';
     var offlineTime = $('#updateOfflineTime').val()+ '';


     var auditNo;
     var requestAuditPersonEmail;
     var auditPerson;
     if(!self.requestAuditPersion2){
         alert("审核人不能为空");
         return ;
     }else{
      	auditNo=self.requestAuditPersion2.no;
      	requestAuditPersonEmail=self.requestAuditPersion2.email;
      	auditPerson=self.requestAuditPersion2.name;
     }
     if( onlineTime==null || !offlineTime==null){
         alert("上线时间下线时间不能为空");
         return;
     }

     if(offlineTime<=onlineTime){
         alert("下线时间必须大于上线时间");
         return;
     }
     // var url = globalConfig.basePath+"/appConfig/announcementNew?id="+id+"&title="+title+"&announcementDesc="+announcementDesc+"&redirectType="+redirectType+"&pageTwo="+updataePageTwo+"&valid="+valid+"&onlineTime="+onlineTime+"&offlineTime="+offlineTime+
     //     "requestAuditPersion="+requestAuditPersion+"&requestAuditDescription="+requestAuditDescription;

     $http.post(globalConfig.basePath + '/appConfig/announcementNew/updateRAnnounce', {
         id: id
         , title:title
         , announcementDesc:announcementDesc
         , redirectType: redirectType
         , pageTwo: pageTwo
         ,pageOne:pageOne
         , valid: valid
         , position: position
         , onlineTime: onlineTime
         , offlineTime: offlineTime
         , auditNo:auditNo
         ,redirectUrl:redirectUrl
         , requestAuditPersonEmail: requestAuditPersonEmail
         , auditPerson: auditPerson
     }).then(function successCallback(data) {
         if (data.data.code == '000') {
             alert("修改成功");
             $("#editTask").hide();
             window.location.reload();
         }
     }), function errorCallback(response) {

     }
         //     // 请求失败执行代码
         //     alert("修改失败....");
         //     $("#upateNotice").hide();
         //     window.location.reload();
         // });

         // $http({
         //     method: 'GET',
         //     url: url,
         // }).then(function successCallback(data) {
         //     if(data.data.code=='000'){
         //         alert("修改成功");
         //         $("#editTask").hide();
         //         window.location.reload();
         //     }
         // }, function errorCallback(response) {
         //     // 请求失败执行代码
         //     alert("修改失败....");
         //     $("#upateNotice").hide();
         //     window.location.reload();
         // });

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
        var url = globalConfig.basePath+"/appConfig/announcementNew/updateRAnnounce";
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
    $scope.updateCancel = function(){
        $('#showUpdate').hide();

    }

    /*self.isSelected = function(id){

   		if(self.position){
   			if(self.position=="1,2"){
   	    		return true;
   	    	}
   			if(self.position==id){
   				return true;
   			}
   		}
   		return false;
 	 }*/

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
        var url = globalConfig.basePath+"/appConfig/announcementNew/selectSort?productChannel="+searchproductChannel+"&productVersion="+searchproductVersion+"&positions="+searchpositions+"&loginStatus="+searchLoginStatus;

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
        var url = globalConfig.basePath+"/appConfig/announcementNew/moveCommit";
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
            url =  globalConfig.basePath+"/appConfig/announcementNew/takeEffect?id="+id+"&SequenceId="+SequenceId;
        }else if (valid == 1){
            url =  globalConfig.basePath+"/appConfig/announcementNew/failure?id="+id+"&SequenceId="+SequenceId;
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
        var url = globalConfig.basePath+"/appConfig/announcementNew/auditing";
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
        var url = globalConfig.basePath+"/appConfig/announcementNew/takeEffectNew";
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
    $scope.openTopTip = function(x){
    	self.topRecord = x;
    	$('#moveTop').show();
    }
    $scope.moveTop = function(){
        var url = globalConfig.basePath+"/appConfig/announcementNew/moveTop";
        $http.post(url,self.topRecord).then( function(data){
                $('#moveTop').hide();
                alert('置顶成功');
                $scope.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );


    };
    $scope.moveTopCancel = function(){
    	$('#moveTop').hide();
    }

}]);

App.filter("priorityFilter",function(){
    return function (val) {
        var res="";
        switch (val){
            case 0:
                res="正常"
                break;
            case 1:
                res="置顶"
                break;
        }
        return res;
    }
})

App.filter("positionFilter",function(){
    return function (val) {
        var res="";
        switch (val){
            case '1':
                res="首页"
                break;
            case '2':
                res="我的页"
                break;
            case '1,2':
                res="首页/我的页"
                break;
            case '1,2,3':
                res="首页/我的页/不轮播"
                break;
            case '3':
                res = "不轮播"
                break;
            case '2,4':
                res = "我的页"
                break;
            case '1,4':
                res = "首页"
                break;
        }

        if(res == "" && val != undefined && val != null){
            var map = new Map();
            var arr = val.split(',');
            if(arr!=null && arr.length>0){
                for(var index in arr) {
                    if(arr[index]!=null && arr[index]!=''){
                        map.set(arr[index],"1");
                    }
                }

                if(map.has("1")){
                    res = "首页";
                }

                if(map.has("2")){
                    if(res != ""){
                        res += "/我的页";
                    }else{
                        res = "我的页";
                    }
                }

                if(map.has("3")){
                    if(res != ""){
                        res += "/不轮播";
                    }else{
                        res = "不轮播";
                    }
                }

                if(map.has("6001")){
                    if(res != ""){
                        res += "/生活页";
                    }else{
                        res = "生活页";
                    }
                }

                if(map.has("6002")){
                    if(res != ""){
                        res += "/权益页";
                    }else{
                        res = "权益页";
                    }
                }

                if(map.has("6003")){
                    if(res != ""){
                        res += "/银行精选";
                    }else{
                        res = "银行精选";
                    }
                }

                if(map.has("6004")){
                    if(res != ""){
                        res += "/我的页";
                    }else{
                        res = "我的页";
                    }
                }

                if(map.has("6005")){
                    if(res != ""){
                        res += "/确认订单页";
                    }else{
                        res = "确认订单页";
                    }
                }

                if(map.has("6006")){
                    if(res != ""){
                        res += "/收银台页";
                    }else{
                        res = "收银台页";
                    }
                }

                if(map.has("6007")){
                    if(res != ""){
                        res += "/玖富宝页";
                    }else{
                        res = "玖富宝页";
                    }
                }
            }
        }
        return res;
    }
})

App.filter("positionViewFilter",function(){
    return function (val) {
        var res="";
        var map = new Map();
        if (val == undefined || val == null) {
            return res;
        }
        var arr = val.split(',');
        if(arr!=null && arr.length>0){
            for(var index in arr) {
                if(arr[index]!=null && arr[index]!=''){
                    map.set(arr[index],"1");
                }
            }

            if(map.has("1")){
                res = "首页";
            }

            if(map.has("2")){
                if(res != ""){
                    res += "&我的页";
                }else{
                    res = "我的页";
                }
            }

            if(map.has("3")){
                if(res != ""){
                    res += "&不轮播";
                }else{
                    res = "不轮播";
                }
            }

            if(map.has("6001")){
                if(res != ""){
                    res += "&生活页";
                }else{
                    res = "生活页";
                }
            }

            if(map.has("6002")){
                if(res != ""){
                    res += "&权益页";
                }else{
                    res = "权益页";
                }
            }

            if(map.has("6003")){
                if(res != ""){
                    res += "&银行精选";
                }else{
                    res = "银行精选";
                }
            }

            if(map.has("6004")){
                if(res != ""){
                    res += "&我的页";
                }else{
                    res = "我的页";
                }
            }

            if(map.has("6005")){
                if(res != ""){
                    res += "&确认订单页";
                }else{
                    res = "确认订单页";
                }
            }

            if(map.has("6006")){
                if(res != ""){
                    res += "&收银台页";
                }else{
                    res = "收银台页";
                }
            }

            if(map.has("6007")){
                if(res != ""){
                    res += "&玖富宝页";
                }else{
                    res = "玖富宝页";
                }
            }
        }

        if(res == ""){
            res = "-";
        }
        return res;
    }
})
