'use strict';
var App = angular.module('textApp', [], angular.noop);
App.controller("textController", ['$scope','$http','$compile','$log',  function ($scope,$http,$compile,$log) {
    var self = $scope;
    $scope.loginName = globalConfig.loginName;
    $scope.search = {};
    $scope.search.showType = '';
    $scope.detailContentList = [];
    $scope.search.productChannel = '1';
    $scope.search.loginStatus = '2';
    $scope.search.auditStatus = '';
    $scope.search.pageSize = $("#pageSize").val();
    $scope.search.status = '';
    $scope.pageNum = 1;
    $scope.pageList = {};
    $scope.add = {};
    $scope.add.productVersion = [];
    $scope.lineCount = 0;
    $scope.updateScene={};
    self.isUpdateRoster = 'N';
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
                swal("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    swal("出错了", "请上传图片文件", "error");
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
                swal("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    swal("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });
    });

    //开机屏查询
    $scope.pageQueryText = function(pageNum){

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
        var url = globalConfig.basePath+"/text/list";
        if($scope.search.loginStatus==2){
            $scope.search.loginStatus="";
        }
        $http.post(url,$scope.search).then(
            function(data){
                if(data.data.code=='000'){
                    $scope.pageList = data.data.resp.result;
                    for (var a in $scope.pageList) {
                        var c = $scope.pageList[a].content;
                        if($scope.isJSON(c)){
                            var o = JSON.parse(c);
                            var str = o[0].text;
                            if(str.length > 30){
                                var newText = str.substring(0,30)+"...";
                                $scope.pageList[a].content2 = newText;
                            }
                        }else{
                            $scope.pageList[a].content2=$scope.pageList[a].content;
                        }
                    }
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


    // 获取位置
    self.getPostionList = function(productChannel,opType,loginStatus){
       if(loginStatus==""){
           loginStatus=2;
       }
        var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_text&productChannel="+productChannel+"&loginStatus="+loginStatus;
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
                    self.add.positions="";
                }else if(opType==2){
                    self.operationRecord.position="";
                }
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取文案置失败了....");
        });
    }
    self.getPostionList(1,0,2);

    //重置
    $scope.reset = function(){
        var num = $scope.search.pageNum;
        var size = $scope.search.pageSize;
        $scope.search={};
        $scope.search.pageNum = num;
        $scope.search.pageSize = size;
        $scope.search.productChannel = '1';
        $scope.search.loginStatus = '';
        $scope.search.auditStatus = '';
        $scope.search.status = '';
        $scope.search.showType = '';
        //$scope.getTypeVersionList("sys_product_version_wk_text");
        $('input[name="queryOnlineTime"]').val('');
        //$scope.search.productVersion = $scope.typeVersionList[0].label;
        self.getPostionList(1,0,2);
    }

    //按渠道类型获取版本列表
    $scope.getTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {

            $scope.typeVersionList = data.data.resp.result;
            $scope.search.productVersion = $scope.typeVersionList[0].label;

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };

    //按渠道类型获取版本列表-查询
    $scope.getSearchTypeVersionList = function(type){
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {

            $scope.typeVersionList = data.data.resp.result;
            $scope.search.productVersion = $scope.typeVersionList[0].label;
            $scope.pageQueryText(1);
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    // $scope.getSearchTypeVersionList("sys_product_version_wk_text");
    $("#pageSize").change(function(){
        $scope.search.pageSize = $("#pageSize").val();
        $scope.pageQueryText(1);
    });
    /*$("#productChannel").change(function(){
     var channel = $("#productChannel").val();
     if(channel==0){
     $scope.getTypeVersionList("sys_product_version_wk_text");
     }else if(channel==1){
     $scope.getTypeVersionList("sys_product_version_qb_text");
     }else{
     $scope.getTypeVersionList("sys_product_version_wx_text");
     }
     });*/

    /* $scope.getTypeVersion = function(channel){
     if(channel==0){
     $scope.getTypeVersionList("sys_product_version_wk_text");
     }else if(channel==1){
     $scope.getTypeVersionList("sys_product_version_qb_text");
     }else{
     $scope.getTypeVersionList("sys_product_version_wx_text");
     }
     };
     */
    //获取全部版本列表
    /*$scope.getAllVersionList = function(type){
     var url = globalConfig.basePath+"/rDict/getAllVersion";
     $http({
     method: 'GET',
     url: url,
     }).then(function successCallback(data) {

     $scope.allVersionList = data;

     }, function errorCallback(response) {
     // 请求失败执行代码
     alert("获取版本列表失败了....");
     });
     };
     $scope.getAllVersionList();*/
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
    //查询黑白名单列表
    $scope.queryWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
                $scope.blackList_qb = data.data.resp.black_qb;
                $scope.blackList_wk = data.data.resp.black_wk;
                $scope.whiteList_qb = data.data.resp.white_qb;
                $scope.whiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    //添加
    $scope.addText = function(){
        $scope.lineCount = 0;
        $scope.login = false;
        $scope.logout = false;
        $scope.wbSelected = [] ;
        $scope.selected = [] ;
        $scope.add = {};
        $scope.add.productVersion = [];
        $scope.add.productChannel = '1';
        $scope.add.valid = '1';
        $scope.add.loginStatus='2';
        $scope.content1 ="";
        $('#addAnnouncementDesc').val('');
        $scope.completeAll();
        $('#addText').show();
        $scope.queryWhiteAndBlack();
        $('#fileUrl').val('');
        $('#addOnlineTime').val('');
        $('#addOfflineTime').val('');
        $("input[name='content']").each(
            function(){
                $(this).val('');
            }
        );
        $('#biaoQianWenAn').val('');
        $('#biaoQianWenAn1').val('');
        $('#biaoQianWenAn2').val('');

        //黑白名单显示
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
        self.getPostionList(1,1,2);

    }

    //添加
    $scope.closeAddText = function(){
        $scope.fchat.replies = [{key: 0, value: ""},{key: 0, value: ""}];
        $scope.fchat.marketReplies = [{key: 0, value: ""},{key: 0, value: ""}];
        $scope.ridictUrl="";
        $scope.completeAll();
        $('#addText').hide();

    }
    /**
     * 初始化文案内容
     */
    $scope.initContent = function(){

        if (self.add.position == '27' || self.add.position == '18'){
            $scope.fchat.replies = [{key: 0, value: ""},{key:1,value:""}];
        }else {
            $scope.fchat.replies = [{key: 0, value: ""}];
        }
        /*营销文案*/
        if (self.add.position == '20003' || self.add.position == '10003') {
            $scope.fchat.marketReplies = [{key: 0, value: ""}];
        }
        /*商品标签*/
        if (self.add.position == '20004' || self.add.position == '10004') {
            $scope.fchat.replies = [{key: 0, value: ""},{key:1,value:""}];
        }
        $scope.fchat.canDescReply = false;
    //初始化用户数据
        if($scope.add.productChannel=='1' && $scope.add.loginStatus == '1' && $scope.add.position=='12'){
            $scope.add.userDataCode="1";
        }
    }

    /**
     * 验证文案内容
     */
    $scope.checkTextContent = function(type){
        var replies = $scope.fchat.replies;
        var flag = true;
        var contentJsonArray =[]
        jQuery.each(replies, function(i, val) {
            if(type == 1){
                if(val.value == null || val.value ==''){
                    flag = false;
                }else{
                    contentJsonArray.push({text:val.value})
                }
            }
            if(type == 2){
                if(val.text == null || val.text ==''){
                    flag = false;
                }else{
                    contentJsonArray.push({text:val.text})
                }
            }

        });
        var content = JSON.stringify(contentJsonArray)
        $scope.textContentArray = content;

            if(flag == false){
                alert("请填写和补全文案内容");
                return false;
            }

        }
    /**
     * 验证营销文案
     */
    $scope.checkmarketContent = function(type){

        var replies = $scope.fchat.marketReplies;
        var flag = true;
        var marketContentJsonArray =[]
        jQuery.each(replies, function(i, val) {
            if(type == 1){
                if(val.marketValue == null || val.marketValue ==''){
                    flag = false;
                }else{
                    marketContentJsonArray.push({text:val.marketValue})
                }
            }
            if(type == 2){
                if(val.text == null || val.text ==''){
                    flag = false;
                }else{
                    marketContentJsonArray.push({text:val.text})
                }
            }

        });
        var marketContent = JSON.stringify(marketContentJsonArray)
        $scope.marketContentArray = marketContent;

        if(flag == false){
            alert("请填写和补全营销文案");
            return false;
        }

    }



    //确认添加
    $scope.saveText = function() {
        if ($scope.add.productChannel == null || $scope.add.productChannel == "") {
            alert("渠道不能为空");
            return;
        }
        if ($scope.add.position == null || $scope.add.position == "") {
            alert("请选择文案位置");
            return;
        }
        var addpositionsText = $("#addPositions").find("option:selected").text();
        if(!addpositionsText){
            alert("文案置不能为空");
            return ;
        }
        $scope.add.positionName =addpositionsText;


        if ($scope.add.productChannel == '0' && $scope.add.position == '5') {
            if ($scope.add.firstText == null || $scope.add.secondText == "") {
                alert("第一行不能为空");
                return;
            }
            if ($scope.add.secondText == null || $scope.add.secondText == "") {
                alert("第二行不能为空");
                return;
            }
        }
        var content = "";
        if ($scope.add.position != '10' && $scope.add.position != '7' && $scope.add.position != '8' && $scope.add.position != '6'
            && $scope.add.position != '11'  && $scope.add.position != '13'  && $scope.add.position != '14'
            && $scope.add.position != '16' && $scope.add.position != '17' && $scope.add.position != '18'
            && $scope.add.position != '19' && $scope.add.position != '20' && $scope.add.position != '21'
            && self.add.position != '17' && self.add.position != '12' && self.add.position !='22' && self.add.position !='13'
            && self.add.position !='23' && self.add.position != '25' && self.add.position !='15' &&
            self.add.position != '24' && self.add.position != '14' && self.add.position !='16' && self.add.position !='26'
            && self.add.position !='20001' && self.add.position !='10001' && self.add.position !='10005' && self.add.position !='20005' && self.add.position !='10006' && self.add.position !='20006' && self.add.position !='6001'
            && self.add.position !='6002' && self.add.position !='6003' && self.add.position !='6004' && self.add.position !='6005' && self.add.position !='6006'){
            if ($scope.checkTextContent(1) == false) {
                return;
            }
        }
        if($scope.add.position == '18' && $scope.add.productChannel == '0'){
            if ($scope.checkTextContent(1) == false) {
                return;
            }
        }
        var marketContent = "";
        if ($scope.add.position == '10003' || $scope.add.position == '20003') {
            if ($scope.checkmarketContent(1) == false) {
                return;
            }
        }
        $scope.add.content = $scope.textContentArray;
        if ($scope.add.productChannel == '6' || ($scope.add.productChannel == '0' && $scope.add.position == '6')) {
            if ($scope.content1 == null || $scope.content1 == '') {
                alert("文案内容不能为空");
                return;
            } else {
                var contentJson = []
                contentJson.push({text: $scope.content1})
                var content = JSON.stringify(contentJson)
                $scope.add.content = content;
            }
        }
        if($scope.add.productChannel == '0' && $scope.add.position == '17'){
            if($scope.add.title == null || $scope.add.title == ""){
                alert("tab文案不能为空");
                return;
            }
        }
        $scope.add.marketContent = $scope.marketContentArray;
        if (($scope.add.productChannel == '1' && $scope.add.position == '11') ||$scope.add.position=='20001'||$scope.add.position=='10001') {
            if ($scope.content1 == null || $scope.content1 == '') {
                alert("标签文案不能为空");
                return;
            }
        }
        $scope.title = $('#title').val();
        if ($scope.add.position == '8' || $scope.add.position == '7') {
            if ($scope.add.title == null || $scope.add.title == '') {
                alert("标题不能为空");
                return;
            }
            if ($scope.add.title != null && $scope.add.title.length > 25) {
                alert("标题最多只能输入25字符");
                return;
            }
        }
        if ($scope.add.position == '13' || $scope.add.position == '14') {
            if ($scope.add.title == null || $scope.add.title == '') {
                alert("标题不能为空");
                return;
            }

        }

        if($scope.add.position=='8' || $scope.add.position=='7' || $scope.add.position=='11') {
            if ($scope.content1 == null || $scope.content1 == '') {
                alert("文案内容不能为空");
                return;
            }
        }
        if($scope.add.position=='8' || $scope.add.position=='7'|| $scope.add.position=='11'|| $scope.add.position=='20001'|| $scope.add.position=='10001' || $scope.add.position=='20005'|| $scope.add.position=='10005'|| $scope.add.position=='20006'|| $scope.add.position=='10006' ){

            $scope.add.content = $scope.content1;


        }

        var redirectUrl = $scope.add.redirectUrl;
        if ((!$scope.add.redirectType && $scope.add.position != '5' && $scope.add.position != '6') && $scope.add.position != '2' && $scope.add.productChannel == '0' && $scope.add.position != '7' && $scope.add.position != '8' && self.add.position != '12' && self.add.position != '13'
            && self.add.position != '14' && self.add.position != '15' && self.add.position != '16' && self.add.position != '17' && self.add.position != '18'
            && self.add.position != '20001' && self.add.position != '20002' && self.add.position != '20003' && self.add.position != '20004' && self.add.position != '20005' && self.add.position != '20006') {
            alert("跳转类型不能为空");
            return;
        }

        if ($scope.add.productChannel == '0') {
            if ($scope.add.redirectType == '3' && !$scope.add.pageOne) {
                alert("页面类型不能为空")
                return;
            }
            if ($scope.add.redirectType == '3' && !$scope.add.pageTwo) {
                alert("跳转页面不能为空")
                return;
            }
        }
        if ($scope.add.position=='10003' || $scope.add.position=='10004'|| $scope.add.position=='20003'|| $scope.add.position=='20004') {
            if (!$scope.add.recommended) {
                alert("推荐语不能为空")
                return;
            }
        }
        if ($scope.add.productChannel == '1' && $scope.add.position == '9') {
            if (!$scope.add.title) {
                alert("文案标题不能为空！");
                return;
            }
            if ($("#fileUrl").val() == "") {
                alert("icon不能为空");
                return;
            }
            $scope.add.iconUrl = $("#fileUrl").val();

            }
        if(!$scope.add.title && ($scope.add.position=='10005'|| $scope.add.position=='20005' || $scope.add.position=='10006'|| $scope.add.position=='20006')){
            alert("主标题不能为空")
            return;
        }
            $scope.add.onlineTime = $('#addOnlineTime').val() + "";
            $scope.add.offlineTime = $('#addOfflineTime').val() + "";
            if ($scope.add.onlineTime == null || $scope.add.onlineTime == "") {
                alert("请选择上线时间");
                return;
            }
            if ($scope.add.offlineTime == null || $scope.add.offlineTime == "") {
                alert("请选择下线时间");
                return;
            }
            if ($scope.add.offlineTime <= $scope.add.onlineTime) {
                alert("下线时间必须大于上线时间");
                return;
            }

            if($scope.add.productChannel == '1' && $scope.add.position=='12'){
                $scope.add.userDataDesc = $("#dataSle").find("option:selected").text();
                redirectUrl =  $scope.add.redirectUrl;
            }

            var valid = $scope.add.valid;

            $scope.add.valid = valid;
            if (redirectUrl != undefined) {
                $scope.add.redirectUrl = redirectUrl;
            }

        //判断名单
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


            var auditPerson = $scope.add.auditPerson;
            // 审核人
            if (!$scope.add.auditPerson) {
                alert("审核人不能为空");
                return;
            } else {
                $scope.add.auditNo = $scope.add.auditPerson.no;
                $scope.add.requestAuditPersonEmail = $scope.add.auditPerson.email;
                $scope.add.auditPerson = $scope.add.auditPerson.name;
            }
            if ($scope.add.productChannel == '0' && $scope.add.redirectType == '2') {
                $scope.add.redirectUrl = $scope.add.redirectUrl2 + '';
            }
            var url = globalConfig.basePath + "/text/add";
            if ($scope.add.redirectUrl2 != undefined) {
                $scope.add.redirectUrl = $scope.add.redirectUrl2 + '';
            }
            $http.post(url, $scope.add).then(
                function (data) {
                    if (data.data.code == '000') {
                        alert('添加成功');
                        $('#addText').hide();
                        $scope.add = {};
                    } else {
                        alert(data.data.message)
                    }
                    $scope.pageQueryText(1);
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        }

        $scope.u = {}

        //添加全部选中事件
        $scope.completeAll = function () {
            $("#white").attr("checked", false);
            $("#black").attr("checked", false);
            if ($('#all').is(':checked')) {
                $("#white").attr('disabled', 'disabled');
                $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
                $("#selectaddwhiteId").val("");
                $("#black").attr('disabled', 'disabled');
                $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
                $("#selectaddblackId").val("");

                self.add.whiteMemberListName= "NO_RULE"
                self.strategyReload();
                $('#userNameLikeSearch').hide();
                self.add.blackMemberListName= "NO_RULE"
                self.blackStrategyReload();
                $('#userNameLikeBlackSearch').hide();
            } else {
                $("#white").removeAttr('disabled', 'disabled');
                $("#selectaddwhiteId").removeAttr("disabled");
                $("#black").removeAttr('disabled', 'disabled');
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
                self.operationRecord.whiteMemberListName= "NO_RULE"
                self.operationRecord.whiteId=null;
                self.strategyReloadUpdate();
                $('#userNameLikeSearchUpdate').hide();
            }
        }
    }
    //黑名单选中事件 type 0 添加 1修改
    self.blackClick2 = function(type){
        if(type == 0){
            if(!$('#black').prop("checked")){
                self.blackStrategyReload();
                $('#userNameLikeBlackSearch').hide();
            }
        }else{
            if(!$('#upBlack').prop("checked")){
                self.operationRecord.blackMemberListName= "NO_RULE"
                self.operationRecord.blackId=null;
                self.blackStrategyReloadUpdate();
                $('#userNameLikeBlackSearchUpdate').hide();
                $("#blackListType").attr('disabled','disabled');
            }else{
                $("#blackListType").attr('disabled',false);
            }
        }
    }

        //修改
        $scope.editText = function (text) {
            $scope.u = {}
            /*if(text.showType==0){
             $('#allBox').prop("checked",true);
             $('#whiteBox').prop("checked",false);
             $('#blackBox').prop("checked",true);
             $('#whiteBox').prop("checked",true);
             $('#allBox').prop("checked",false);
             }*/


            text.valid = text.valid + "";
            text.loginStatus = text.loginStatus + "";
            //$scope.queryWhiteAndBlack();
            var type;
            if (text.productChannel == 0 || text.productChannel == 2) {
                type = "sys_product_version_wk_text";
            }
            if (text.productChannel == 1) {
                type = "sys_product_version_qb_text";
            }
            text.productChannel = text.productChannel + "";
            text.position = text.position + "";

            $("#upProductChannel").val(text.productChannel);
            if (text.loginStatus == 1) {
                $scope.logoutEdit = false;
                $scope.loginEdit = true;
            } else {
                $("#quanbu").attr('disabled', 'disabled');
                $scope.logoutEdit = true;
                $scope.loginEdit = false;
            }
            var url = globalConfig.basePath + "/rDict/getVersionByType?type=" + type;
            // if(text.showType == 0){
            //     $scope.u.quanbuClick = true;
            //     $("#baimingdan").attr('disabled','disabled');
            //     $("#heimingdan").attr('disabled','disabled');
            //     $('#quanbu').attr('disabled','disabled');
            //     if(text.loginStatus == 1){
            //         $('#quanbu').removeAttr('disabled','disabled');
            //     }
            //     $("#bDropDown").attr('disabled','disabled');
            //     $("#heiSelect").attr('disabled','disabled');
            // }else if(text.showType == 1){
            //     $("#baimingdan").removeAttr('disabled','disabled');
            //     $("#heimingdan").removeAttr('disabled','disabled');
            //     $("#bDropDown").removeAttr('disabled','disabled');
            //     $scope.u.baimingdClick = true;
            // }else if(text.showType == 2){
            //     $("#baimingdan").removeAttr('disabled','disabled');
            //     $("#heimingdan").removeAttr('disabled','disabled');
            //     $("#heiSelect").removeAttr('disabled','disabled');
            //     $scope.u.heimingdanClick = true;
            // }else if(text.showType == 3){
            //     $("#baimingdan").removeAttr('disabled','disabled');
            //     $("#heimingdan").removeAttr('disabled','disabled');
            //     $("#bDropDown").removeAttr('disabled','disabled');
            //     $("#heiSelect").removeAttr('disabled','disabled');
            //     $scope.u.baimingdClick = true;
            //     $scope.u.heimingdanClick = true;
            // }

    }
    $scope.checkVer = function (ob) {
        ob.checked = true;
    }

    //保存修改
    $scope.saveEditText = function () {
        if ($scope.operationRecord.position == null || $scope.operationRecord.position == "") {
            alert("请选择文案位置");
            return;
        }
        var addpositionsText = $("#editPosition").find("option:selected").text();
        /*if(!addpositionsText){
            alert("互动位置不能为空");
            return ;
        }*/
        if(addpositionsText){
        self.operationRecord.positionName = addpositionsText;

        }

        if ($scope.operationRecord.position != '10' && $scope.operationRecord.position != '7'
            && $scope.operationRecord.position != '8' && $scope.operationRecord.position != '6'
            && $scope.operationRecord.position != '11'  && $scope.operationRecord.position != '13'
            && $scope.operationRecord.position != '14'  && $scope.operationRecord.position != '15'
            && $scope.operationRecord.productChannel != '5' && $scope.operationRecord.position != '16'
            && $scope.operationRecord.position != '17' && $scope.operationRecord.position != '18'
            && $scope.operationRecord.position != '19'&& $scope.operationRecord.position != '20'
            && $scope.operationRecord.position != '21'
            && self.operationRecord.position != '17' && self.operationRecord.position != '12'
            && self.operationRecord.position !='22' && self.operationRecord.position !='13'
            && self.operationRecord.position !='23' && self.operationRecord.position != '25'
            && self.operationRecord.position !='15' && self.operationRecord.position != '24'
            && self.operationRecord.position != '14' && self.operationRecord.position !='16'
            && self.operationRecord.position !='26' && self.operationRecord.position !='20001'
            && self.operationRecord.position !='10001' && self.operationRecord.position !='20005'
            && self.operationRecord.position !='10005'&& self.operationRecord.position !='10006'
            && self.operationRecord.position !='20006'&& self.operationRecord.position !='6001'
            && self.operationRecord.position !='6002' && self.operationRecord.position !='6003'
            && self.operationRecord.position !='6004' && self.operationRecord.position !='6005'
            && self.operationRecord.position !='6006') {

            if ($scope.checkTextContent(2) == false) {
                return;
            }

        }
        if (self.operationRecord.position == '18' && self.operationRecord.productChannel == 0

        ){
            if ($scope.checkTextContent(2) == false) {
                return;
            }
        }
        if(self.operationRecord.position == '10003' || self.operationRecord.position == '20003'){
            if ($scope.checkmarketContent(2) == false) {
                return;
            }
        }
        if ((!$scope.operationRecord.redirectType && $scope.operationRecord.position != '5' && $scope.operationRecord.position != '6' && $scope.operationRecord.position != '2' && self.operationRecord.position != '12' && self.operationRecord.position != '13'
            && self.operationRecord.position != '14' && self.operationRecord.position != '15' && self.operationRecord.position != '16' && self.operationRecord.position != '17' && self.operationRecord.position != '18') && $scope.operationRecord.productChannel == '0') {
            alert("跳转类型不能为空");
            return;
        }

        if ($scope.operationRecord.redirectType == 2) {
            if ($scope.operationRecord.productChannel == '0' && $scope.operationRecord.position != '5' && $scope.operationRecord.position != '6' && $scope.operationRecord.position != '7' && $scope.operationRecord.position != '8' && $scope.operationRecord.position != '2' && self.operationRecord.position != '18'&& self.operationRecord.position != '12'&& self.operationRecord.position != '13'&& self.operationRecord.position != '14'&& self.operationRecord.position != '15'&& self.operationRecord.position != '16') {
                if ($scope.operationRecord.redirectUrl == null || $scope.operationRecord.redirectUrl == '') {
                    alert("跳转链接不能为空");
                    return;
                }
            }
        }
        if ($scope.operationRecord.productChannel == '1' && $scope.operationRecord.position != '7'
            && $scope.operationRecord.position != '8' && $scope.operationRecord.position != '2'
            && $scope.operationRecord.position != '9' && $scope.operationRecord.position != '12'
            && $scope.operationRecord.position != '13'&& $scope.operationRecord.position != '14'
            && $scope.operationRecord.position != '15' && $scope.operationRecord.position != '16'
            && $scope.operationRecord.position != '17' && $scope.operationRecord.position != '18'
            && $scope.operationRecord.position != '19' && $scope.operationRecord.position != '20'
            && $scope.operationRecord.position != '21' && self.operationRecord.position != '27' && self.operationRecord.position != '26' && self.operationRecord.position != '25' && self.operationRecord.position != '24' && self.operationRecord.position != '23' && self.operationRecord.position != '22'
            && $scope.operationRecord.position != '20001' && $scope.operationRecord.position != '20002' && $scope.operationRecord.position != '20003' && $scope.operationRecord.position != '20004'
            && $scope.operationRecord.position != '10001' && $scope.operationRecord.position != '10002' && $scope.operationRecord.position != '10003' && $scope.operationRecord.position != '10004' && $scope.operationRecord.position != '10005' && $scope.operationRecord.position != '10006') {
            if (!$scope.operationRecord.redirectUrl) {
                alert("跳转链接不能为空");
                return;
            }
        }
        if ($scope.operationRecord.productChannel == '0') {
            if ($scope.operationRecord.redirectType == '3' && !$scope.operationRecord.pageOne) {
                alert("页面类型不能为空")
                return;
            }
            if ($scope.operationRecord.redirectType == '3' && !$scope.operationRecord.pageTwo) {
                alert("跳转页面不能为空")
                return;
            }
        }

        if($scope.operationRecord.productChannel == '1' && $scope.operationRecord.position=='12'){
            $scope.operationRecord.userDataDesc = $("#upSel").find("option:selected").text();
        }
        if (self.updateContent1 == []){
            self.updateContent1 = null;
        }
        $scope.operationRecord.content = $scope.textContentArray;
        $scope.operationRecord.marketContent = $scope.marketContentArray;
        if ($scope.operationRecord.productChannel == '0' && $scope.operationRecord.position == '6' || $scope.operationRecord.productChannel == '5') {
            if ($scope.updateContent1 == null || $scope.updateContent1 == '') {
                alert("文案内容不能为空");
                return;
            } else {
                var contentJson = []
                contentJson.push({text: $scope.updateContent1})
                var content = JSON.stringify(contentJson)
                $scope.operationRecord.content = content;
            }
        }
        if (self.operationRecord.productChannel == '6' || (self.operationRecord.productChannel == '1' && self.operationRecord.position == '15')){
            if ($scope.updateContent1 == null || $scope.updateContent1 == '') {
                alert("文案内容不能为空");
                return;
            } else {
                var contentJson = []
                contentJson.push({text: $scope.updateContent1})
                var content = JSON.stringify(contentJson)
                $scope.operationRecord.content = content;
            }
        }
        if ($scope.operationRecord.position == '7' || $scope.operationRecord.position == '8') {
            if ($scope.operationRecord.title == null || $scope.operationRecord.title == '') {
                alert("标题不能为空");
                return;
            }
            if ($scope.updateContent1 == null || $scope.updateContent1 == '') {
                alert("文案内容不能为空");
                return;
            }
            $scope.operationRecord.content = $scope.updateContent1;
        }
        if($scope.operationRecord.productChannel == '0' && $scope.operationRecord.position == '17'){
            if(!$scope.operationRecord.title){
                alert("tab文案不能为空");
                return;
            }
        }
        if($scope.operationRecord.productChannel=='1' && ($scope.operationRecord.position=='9' || $scope.operationRecord.position=='10' || $scope.operationRecord.position=='13'|| $scope.operationRecord.position=='14')){
            if (!$scope.operationRecord.title){
                alert("标题不能为空!");
                return;
            }
        }

        if (($scope.operationRecord.productChannel == '1' && ($scope.operationRecord.position == '11' ||$scope.operationRecord.position == '10001')) ||($scope.operationRecord.productChannel == '0' && ($scope.operationRecord.position == '20001')) ) {
            if ($scope.updateContent1 == null || $scope.updateContent1 == '') {
                alert("标签文案不能为空");
                return;
            } else {
                $scope.operationRecord.content = $scope.updateContent1;
            }
        }
        if (($scope.operationRecord.productChannel == '1' && ($scope.operationRecord.position == '10005'|| $scope.operationRecord.position == '10006')) ||($scope.operationRecord.productChannel == '0' && ($scope.operationRecord.position == '20005'||$scope.operationRecord.position == '20006' )) ) {
            if ($scope.updateContent1 != null) {
                $scope.operationRecord.content = $scope.updateContent1;
            }
        }
        if ($scope.operationRecord.position=='10003' || $scope.operationRecord.position=='10004'|| $scope.operationRecord.position=='20003'|| $scope.operationRecord.position=='20004') {
            if (!$scope.operationRecord.recommended) {
                alert("推荐语不能为空")
                return;
            }
        }
        if($scope.operationRecord.position=='10005'|| $scope.operationRecord.position=='20005' || $scope.operationRecord.position=='10006'|| $scope.operationRecord.position=='20006'){
           if(!$scope.operationRecord.title ){
               alert("主标题不能为空")
               return;
           }
        }
        $scope.operationRecord.redirectUrl = $scope.operationRecord.redirectUrl;
        $scope.operationRecord.onlineTime = $('#operationOnlineTime').val() + "";
        $scope.operationRecord.offlineTime = $('#operationOfflineTime').val() + "";
        if ($scope.operationRecord.onlineTime == null || $scope.operationRecord.onlineTime == "") {
            alert("请选择上线时间");
            return;
        }
        if ($scope.operationRecord.offlineTime == null || $scope.operationRecord.offlineTime == "") {
            alert("请选择下线时间");
            return;
        }
        if ($scope.operationRecord.offlineTime <= $scope.operationRecord.onlineTime) {
            alert("下线时间必须大于上线时间");
            return;
        }
        if ($scope.operationRecord.productChannel == '1' && $scope.operationRecord.position == '9') {
            if (!$scope.operationRecord.title) {
                alert("文案标题不能为空！");
                return;
            }
            if ($("#fileUrl1").val() == "") {
                alert("icon不能为空");
                return;
            }
            $scope.operationRecord.iconUrl;
        }
//        var offlineTime =$scope.operationRecord.offlineTime;
//        var offlineTimes = offlineTime.split(" ");
//        var miniTime="23:59:59";
//        $scope.operationRecord.offlineTime = offlineTimes[0]+" "+miniTime;

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
                self.operationRecord.showType = 3;
            }

            if (!whiteId && !blackId){
                self.operationRecord.showType = 0;
            }
            if (whiteId && whiteId != 0 && !blackId){
                self.operationRecord.showType = 1;
            }
            if (blackId && blackId!=0 && !whiteId){
                self.operationRecord.showType = 2;
            }
            if (self.operationRecord.whiteMemberListName != 'NO_RULE'){
                self.operationRecord.whiteTrue=true;
            }

            if (self.operationRecord.blackMemberListName != 'NO_RULE'){
                self.operationRecord.blackTrue = true;
            }


            if(self.operationRecord.whiteTrue == true){
                var whiteId =  $('#memberIdUpdate').val();
                if(whiteId==null || whiteId=="" || whiteId=="0" || whiteId.indexOf("?")!=-1){
                    alert('请选择具体白名单!');
                    return;
                }else{
                    self.operationRecord.whiteId = whiteId;
                    self.operationRecord.whiteName = $('#memberIdUpdate option:selected').text();
                }
            }
            if(self.operationRecord.blackTrue == true){
                var blackId =  $('#memberBlackIdUpdate').val();
                if(blackId == null || blackId=="" || blackId=="0"|| blackId.indexOf("?")!=-1){
                    alert('请选择具体黑名单!');
                    return;
                }else{
                    self.operationRecord.blackId = blackId;
                    self.operationRecord.blackName = $('#memberBlackIdUpdate option:selected').text();
                }
            }
        }


        var auditPerson = $scope.operationRecord.auditPerson;
            // 审核人
            if (!$scope.operationRecord.auditPerson) {
                alert("审核人不能为空");
                return;
            } else {
                $scope.operationRecord.auditNo = $scope.operationRecord.auditPerson.no;
                $scope.operationRecord.requestAuditPersonEmail = $scope.operationRecord.auditPerson.email;
                $scope.operationRecord.auditPerson = $scope.operationRecord.auditPerson.name;
            }



            // $scope.operationRecord.blackId = $scope.updateScene.blackId;
            // $scope.operationRecord.whiteId = $scope.updateScene.whiteId;
            console.log("传过去的参数为：{}", JSON.stringify($scope.operationRecord))
            var url = globalConfig.basePath + "/text/edit";
            $http.post(url, $scope.operationRecord).then(
                function (data) {
                    if (data.data.code == '000') {
                        alert('修改成功');
                        $('#editText').hide();
                        $scope.operationRecord = {};
                        $scope.pageQueryText(1);
                        $scope.u = {};
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        };

        //查询黑白名单列表
        $scope.queryEditWhiteAndBlack = function () {
            $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
                function (data) {
                    $scope.editblackList_qb = data.data.resp.black_qb;
                    $scope.editblackList_wk = data.data.resp.black_wk;
                    $scope.editwhiteList_qb = data.data.resp.white_qb;
                    $scope.editwhiteList_wk = data.data.resp.white_wk;
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );

        }

    $scope.queryEditWhiteAndBlack();
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function (opType, record) {
        $scope.textContentArray = '';
        $scope.marketContentArray = '';
        $scope.updateContent1 = "";
        var url = globalConfig.basePath + "/text/selectOneText?id=" + record.id;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.openScreen = data.data.resp;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
        setTimeout(function () {
            $scope.getPostionList(record.productChannel,0,record.loginStatus);
        },300)


        if (opType == 1) {
            // $scope.operationType = 2;
            //$('.look-start-box').show()
            record.redirectType = record.redirectType + "";
            $scope.detailContentList = [];
            $scope.detailMarketContentList = [];
            $scope.selctPageOne(record.redirectType);
            $scope.selectPageOneByRDict(record);
            $("#detailText").show();
            $scope.detail = angular.copy(record);
            console.log(self.detail,"文案详细信息");
            if (self.detail.productChannel == 0 && (self.detail.position == '12' || self.detail.position == '13' ||self.detail.position == '14' || self.detail.position == '15' || self.detail.position == '16')){
                $('#textContent').hide();
            }
            if ($scope.detail.content != null && $scope.isJSON($scope.detail.content)) {
                var array = JSON.parse($scope.detail.content);
                for (var i in array) {
                    var t = array[i].text;
                        $scope.detailContentList.push('内容' + (Number(i) + 1) + '：' + t);

                }
            }
            if ($scope.detail.marketContent != null && $scope.isJSON($scope.detail.marketContent)) {
                var array = JSON.parse($scope.detail.marketContent);
                for (var i in array) {
                    var t = array[i].text;
                    $scope.detailMarketContentList.push('营销内容' + (Number(i) + 1) + '：' + t);

                }
            }
        } else if (opType == 2) {
            self.isUpdateRoster = 'N';
            $scope.fchat.replies = [{key: 0, value: ""}];
            $scope.selctPageOne(record.redirectType);
            $scope.selectPageOneByRDict(record);
            $scope.operationRecord.pageTwo = record.pageTwo + '';

            var productChanner = record.productChannel;
            var position = record.position;
            //设置回显文案内容
            if (record.content != null && record.content != '') {
                var flag = $scope.isJSON(record.content);
                if ((record.loginStatus == '1' && record.position == '6') || (record.productChannel == '1' && record.position == '11') || record.position == '7' || record.position == '8' ||  record.position == '15' || record.productChannel == '5' || record.productChannel == '6' ) {
                    if (flag) {
                        var obj = JSON.parse(record.content);
                        $scope.updateContent1 = obj[0].text;
                    } else {
                        $scope.updateContent1 = record.content;
                    }
                } else {
                    if (flag) {
                        var contentStr = record.content;
                        var textC = JSON.parse(contentStr);
                        $scope.fchat.replies = textC;
                        if (textC.length > 0) {
                            $scope.fchat.canDescReply = true;
                        }
                    } else {
                        $scope.updateContent1 = record.content;
                    }
                }
            }
            //设置回显营销文案
            if (record.marketContent != null && record.marketContent != '') {
                var flag = $scope.isJSON(record.marketContent);
                if ((record.loginStatus == '1' && record.position == '6') || (record.productChannel == '1' && record.position == '11') || record.position == '7' || record.position == '8' ||  record.position == '15' || record.productChannel == '5'  ) {
                    if (flag) {
                        var obj = JSON.parse(record.marketContent);
                        $scope.updmarketContent1 = obj[0].marketText;
                    } else {
                        $scope.updmarketContent1 = record.marketContent;
                    }
                } else {
                    if (flag) {
                        var contentStr = record.marketContent;
                        var textC = JSON.parse(contentStr);
                        $scope.fchat.marketReplies = textC;
                        if (textC.length > 0) {
                            $scope.fchat.canDescReply = true;
                        }
                    } else {
                        $scope.updmarketContent1 = record.marketContent;
                    }
                }
            }

            // $scope.operationType = 1;
            $('#editText').show();
            console.log("record为:{}", JSON.stringify(record))
            record.redirectType = record.redirectType + "";
            record.pageOne = record.pageOne + "";
            record.pageTwo = record.pageTwo + "";
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord.userDataCode = $scope.operationRecord.userDataCode+'';
            $scope.operationRecord.auditPerson = "";
            $scope.editText($scope.operationRecord);
            //$scope.operationRecord.content = eval($scope.operationRecord.content);
            //$scope.first = $scope.operationRecord.content[0].text;
            /*var content = $scope.operationRecord.content;
             $("#editContent").children().remove();
             $scope.lineCount = 1;
             if(content.length>1){
             for(var i=1;i<content.length;i++){
             $scope.editShowLine(content[i].text);
             }
             }
             console.log("循环得到:{}", JSON.stringify($scope.editblackList_qb));

             //黑白名单
             $scope.updateScene={};
             record.productChannel=record.productChannel+"";
             record.loginStatus = record.loginStatus+"";
             record.positions = record.positions+"";
             $scope.editpositions="";
             $scope.editpositions = record.positions;
             //self.updateScene={};
             record.auditPerson="";
             record.type= record.type+"";
             $scope.queryEditWhiteAndBlack();
             $("#editselectaddwhiteId").val("");
             $("#editselectaddblackId").val("");
             $('#editall').prop("checked",false);//默认全部不选择
             $("#editwhite").attr("checked",false);
             $("#editblack").attr("checked",false);
             var sequenceId = record.sequenceId;
             $("#editall").removeAttr("disabled");
             if(record.loginStatus=='0'  || record.loginStatus=='2'){
             $("#editall").attr('disabled','disabled');
             $('#editall').prop("checked",true);
             }
             record.valid = record.valid+"";
             record.whiteId = record.whiteId+"";
             record.blackId = record.blackId+"";
             //self.updateScene = query;
             $scope.updateScene=angular.copy(record);
             }*/
            //展示黑白名单数量
            if($scope.operationRecord.whiteId != null && $scope.operationRecord.whiteId != ''
                && $scope.operationRecord.whiteId != undefined && $scope.operationRecord.whiteId != 0){
                $scope.findChannelGroupCount($scope.operationRecord.productChannel,$scope.operationRecord.whiteId);
            }
            if($scope.operationRecord.blackId != null && $scope.operationRecord.blackId != ''
                && $scope.operationRecord.blackId != undefined && $scope.operationRecord.blackId != 0){
                $scope.findBlackChannelGroupCount($scope.operationRecord.productChannel,$scope.operationRecord.blackId);
            }
                if (record.showType == 0) {
                    console.log("进入全选中··············");
                    $('#editall').prop("checked", true);
                    $('#editwhite').prop("checked", false);
                    $('#editblack').prop("checked", false);
                    $("#editwhite").attr('disabled', 'disabled');
                    $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
                    // $("#editselectaddwhiteId").val("0");
                    $("#editblack").attr('disabled', 'disabled');
                    $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
                    // $("#editselectaddblackId").val("0");


                    self.strategyReloadUpdate();
                    self.operationRecord.whiteMemberListName=record.whiteMemberListName;
                    self.operationRecord.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();

                    self.blackStrategyReloadUpdate();
                    self.operationRecord.blackMemberListName=record.blackMemberListName;
                    self.operationRecord.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();


                } else if (record.showType == 1) {

                    console.log("进入白名单选中··············");
                    $('#editwhite').prop("checked", true);
                    $('#editblack').prop("checked", false);
                    $('#editall').prop("checked", false);
                    $('#editwhite').removeAttr("disabled");
                    $('#editblack').removeAttr("disabled");

                    //修改名单那类型查询
                    self.strategyReloadUpdate();
                    self.operationRecord.whiteMemberListName=record.whiteMemberListName;
                    self.operationRecord.whiteId = record.whiteId.toString();

                    self.blackStrategyReloadUpdate();
                    self.operationRecord.blackMemberListName=record.blackMemberListName;
                    self.operationRecord.blackId = null;
                    $('#userNameLikeBlackSearchUpdate').hide();

                } else if (record.showType == 2) {
                    console.log("进入黑名单选中··············");
                    $('#editblack').prop("checked", true);
                    $('#editwhite').prop("checked", false);
                    $('#editall').prop("checked", false);
                    $('#editwhite').removeAttr("disabled");
                    $('#editblack').removeAttr("disabled");

                    self.strategyReloadUpdate();
                    self.operationRecord.whiteMemberListName=record.whiteMemberListName;
                    self.operationRecord.whiteId = null;
                    $('#userNameLikeSearchUpdate').hide();

                    self.blackStrategyReloadUpdate();
                    self.operationRecord.blackMemberListName=record.blackMemberListName;
                    self.operationRecord.blackId = record.blackId.toString();

                } else if (record.showType == 3) {
                    console.log("进入黑白名单选中··············");
                    $('#editblack').prop("checked", true);
                    $('#editwhite').prop("checked", true);
                    $('#editall').prop("checked", false);
                    $('#editwhite').removeAttr("disabled");
                    $('#editblack').removeAttr("disabled");


                    self.strategyReloadUpdate();
                    self.operationRecord.whiteMemberListName=record.whiteMemberListName;
                    self.operationRecord.whiteId = record.whiteId.toString();

                    self.blackStrategyReloadUpdate();
                    self.operationRecord.blackMemberListName=record.blackMemberListName;
                    self.operationRecord.blackId = record.blackId.toString();

                }
            } else if (opType == 3) {
                $scope.effectRecord = record;
                $('#takeEffect').show();
            }

        //修改禁用名单
        $("#editall").attr('disabled','disabled');
        $("#editwhite").attr("disabled",'disabled');
        $("#editblack").attr("disabled",'disabled');
        };

        // 生效、失效
        /*$scope.validateRecord = function(){
         // 保存数据
         var url = null;
         if($scope.operationRecord.valid=='0'){
         url = globalConfig.basePath+"/text/valid";
         } else {
         url = globalConfig.basePath+"/text/invalid";
         }
         $http.get(url+"?id="+$scope.operationRecord.id).then(function successCallback(callback) {
         $('#takeEffect').hide();
         if(callback.data.code == '000'){
         $scope.pageQueryText(1);
         swalMsg("操作成功");
         } else {
         console.error(callback.data);
         swalMsg("操作失败");
         }
         }, function errorCallback(response) {
         // 请求失败执行代码
         swalMsg(response);
         });
         };*/
        //添加全部选中事件
        $scope.editAll = function () {
            $("#upWhite").attr("checked",false);
            $("#upBlack").attr("checked",false);
            if ($('#editall').is(':checked')) {
                $("#upWhite").attr('disabled', 'disabled');
                $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
                // $("#editselectaddwhiteId").val("0");
                $("#upBlack").attr('disabled', 'disabled');
                $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
                // $("#editselectaddblackId").val("0");
                //黑白名单操作
                self.operationRecord.whiteMemberListName= "NO_RULE"
                self.operationRecord.whiteId=null;
                self.strategyReloadUpdate();
                $('#userNameLikeSearchUpdate').hide();


                self.operationRecord.blackMemberListName= "NO_RULE"
                self.operationRecord.blackId=null;
                self.blackStrategyReloadUpdate();
                $('#userNameLikeBlackSearchUpdate').hide();

            } else {
                $("#upWhite").removeAttr('disabled', 'disabled');
                $("#editselectaddwhiteId").removeAttr("disabled");
                $("#upBlack").removeAttr('disabled', 'disabled');
                $("#editselectaddblackId").removeAttr("disabled");
            }
        }

        // 生效、失效
        $scope.validateRecord = function (x) {
            // 保存数据
            if ($scope.validConfirmUser == "" || $scope.validConfirmUser == null || $scope.validConfirmUser == undefined) {
                alert('请选择审核人');
                return;
            } else {
                $scope.effectRecord.auditPerson = $("#validConfirmUser").find("option:selected").text();
                var array = $scope.validConfirmUser.split('-')
                //$scope.effectRecord.auditEmail = array[1];
                $scope.effectRecord.auditNo = array[0];
            }
            $scope.effectRecord.requestAuditDescription = $scope.requestAuditDescription;
            var url = null;
            if ($scope.effectRecord.valid == '0') {
                url = globalConfig.basePath + "/text/valid";
            } else {
                url = globalConfig.basePath + "/text/invalid";
            }
            $http.post(url, $scope.effectRecord).then(function successCallback(callback) {
                if (callback.data.code == '000') {
                    alert("操作成功");
                    $scope.pageQueryText(1);
                    $('#takeEffect').hide();
                } else {
                    console.error(callback.data);
                    alert("操作失败");
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                swalMsg(response);
            });
        };
        //优先级排序
        $scope.strotList = {}
        $scope.sort = function () {
            var searchproductChannel = $("#productChannel").val();

            var searchPosition = $("#searchPosition").val();

            if (searchproductChannel == null || searchproductChannel == "" || searchproductChannel == undefined) {
                alert("请在查询条件中选择渠道");
                return;
            }
            if (searchPosition == null || searchPosition == "" || searchPosition == undefined) {
                alert("请在查询条件中选择位置");
                return;
            }
            if (searchproductChannel == 0) {
                var type = "";
                /*if($scope.search.position==6){
                 type="sys_wk_text_value_6";
                 }else */
                if ($scope.search.position == 5) {
                    type = "sys_wk_text_value_5";
                }
                $scope.getShowValue(type);
            }
            var url = globalConfig.basePath + "/text/getPrioritylist";
            $http.post(url, $scope.search).then(
                function (data) {
                    if (data.data.code == '000') {
                        $scope.strotList = data.data.resp;
                        $('#addSort').show();
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
            /*$scope.strotList = [];
             var ids="";
             $('.listChecked').each(function(){
             if(this.checked == true){
             ids += $(this).val() + ",";
             }
             })
             if(ids == "" ||ids == null){
             alert("请选择要排序的对象");
             return;
             }
             $('#addSort').show();
             var idArray = ids.split(',');
             for(var i=0;i<idArray.length-1;i++){
             var temp = idArray[i].split('-');
             $scope.strotList.push(new ObjSort(temp[0],temp[1]));
             }*/

        }

        $scope.rDict = "";
        $scope.getShowValue = function (type) {
            var url = globalConfig.basePath + "/rDict/getShowPageValue?resourceType=" + type;
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
        $scope.moveUp = function () {
            var indexStr = "";
            $('.sort').each(function () {
                if (this.checked == true) {
                    indexStr += $(this).val() + ",";
                }
            })
            if (indexStr == "") {
                alert('请选中其中一项进行操作');
                return;
            }
            var indexs = indexStr.split(',');
            if (indexs.length > 2) {
                alert('只能选中其中一项进行操作');
                return;
            }
            var index = parseInt(indexs[0]);
            if (index == 0) {
                return;
            } else {
                var pre = $scope.strotList[index - 1];
                $scope.strotList[index - 1] = $scope.strotList[index];
                $scope.strotList[index] = pre;
            }

        }
        $scope.moveDown = function () {
            var indexStr = "";
            $('.sort').each(function () {
                if (this.checked == true) {
                    indexStr += $(this).val() + ",";
                }
            })
            if (indexStr == "") {
                alert('请选中其中一项进行操作');
                return;
            }
            var indexs = indexStr.split(',');
            if (indexs.length > 2) {
                alert('只能选中其中一项进行操作');
                return;
            }
            var index = parseInt(indexs[0]);
            if (index == $scope.strotList.length - 1) {
                return;
            } else {
                var after = $scope.strotList[index + 1];
                $scope.strotList[index + 1] = $scope.strotList[index];
                $scope.strotList[index] = after;
            }

        }
        $scope.del = function () {
            var indexStr = "";
            $('.sort').each(function () {
                if (this.checked == true) {
                    indexStr += $(this).val() + ",";
                }
            })
            if (indexStr == "") {
                alert('请选中其中一项进行操作');
                return;
            }
            var indexs = indexStr.split(',');
            if (indexs.length > 2) {
                alert('只能选中其中一项进行操作');
                return;
            }
            var index = parseInt(indexs[0]);
            $scope.strotList.splice(index, 1);
        }
        //保存排序
        $scope.moveSave = function () {
            var ids = "";
            if ($scope.strotList.length < 1) {
                //alert('请至少保留其中两项进行保存');
                alert('操作成功');
                $('#addSort').hide();
                return;
            }
            for (var i = 0; i < $scope.strotList.length; i++) {
                ids = ids + $scope.strotList[i].id + ",";
            }
            var url = globalConfig.basePath + "/text/priority?ids=" + ids;
            $http.get(url).then(
                function (data) {
                    alert(data.data.message);
                    $('#addSort').hide();
                    self.strotList = {};
                    $scope.pageQueryText(1);
                }, function (response) {
                    alert("请求失败了....");
                }
            );
        }

        //取消排序
        $scope.moveCancel = function () {
            $('#addSort').hide();
            self.strotList = {};
        }

        //声明对象
        function ObjSort(id, desc) {
            this.id = id;
            this.desc = desc;
        }


        //修改全部选中事件
        $scope.allSelect = function () {
            $("#baimingdan").attr("checked", false);
            $("#heimingdan").attr("checked", false);
            if ($('#quanbu').is(':checked')) {
                $("#baimingdan").attr('disabled', 'disabled');
                $("#heimingdan").attr('disabled', 'disabled');
                $("#bDropDown").attr('disabled', 'disabled');
                $("#heiSelect").attr('disabled', 'disabled');
                $scope.operationRecord.whiteId = '0';
                $scope.operationRecord.blackId = '0';
            }
            else {
                $("#baimingdan").removeAttr('disabled', 'disabled');
                $("#heimingdan").removeAttr('disabled', 'disabled');
            }
        }

        //修改白名单
        $scope.baiClick = function () {
            if ($('#baimingdan').is(':checked')) {
                $('#bDropDown').removeAttr('disabled', 'disabled');
            } else {
                $scope.operationRecord.whiteId = '0';
                $("#bDropDown").attr('disabled', 'disabled');
            }
        }
        //修改黑名单
        $scope.heiClick = function () {
            if ($('#heimingdan').is(':checked')) {
                $('#heiSelect').removeAttr('disabled', 'disabled');
            } else {
                $scope.operationRecord.blackId = '0';
                $("#heiSelect").attr('disabled', 'disabled');
            }
        }

        //添加全部选中事件
        $scope.complete = function () {
            $("#white").attr("checked", false);
            $("#black").attr("checked", false);
            if ($('#all').is(':checked')) {
                $("#white").attr('disabled', 'disabled');
                $("#black").attr('disabled', 'disabled');
                $("#whiteID").attr('disabled', 'disabled');
                $("#blackSelect").attr('disabled', 'disabled');
                $scope.add.whiteId = '';
                $scope.add.blackId = '';
            }
            else {
                $("#white").removeAttr('disabled', 'disabled');
                $("#black").removeAttr('disabled', 'disabled');
            }
        }

        // //添加白名单
        // $scope.baiChecked = function () {
        //     if ($('#white').is(':checked')) {
        //         $('#whiteID').removeAttr('disabled', 'disabled');
        //     } else {
        //         $scope.add.whiteId = '';
        //         $("#whiteID").attr('disabled', 'disabled');
        //     }
        // }
        // //添加黑名单
        // $scope.blackClick = function () {
        //     if ($('#black').is(':checked')) {
        //         $('#blackSelect').removeAttr('disabled', 'disabled');
        //     } else {
        //         $scope.add.blackId = '';
        //         $("#blackSelect").attr('disabled', 'disabled');
        //     }
        // }

        //取消修改
        $scope.updateCancel = function () {
            $('#editText').hide();
            $scope.u = {};
        }
//查看
        $scope.check = function (id) {
            $('#showCheck').show();
            var url = globalConfig.basePath + "/text/selectOneText?id=" + id;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(data) {
                $scope.openScreen = data.data.resp;
            }, function errorCallback(response) {
                // 请求失败执行代码
                alert("获取版本列表失败了....");
            });
        }

        //改变登录状态已登录
        $scope.loginClick = function () {
            if ($('#login').is(':checked')) {
                $scope.logout = false;
                $scope.login = true;
                $("#all").removeAttr('disabled', 'disabled');
            }
        }
        //改变登录状态未登录
        $scope.logoutClick = function () {
            if ($('#logout').is(':checked')) {
                $scope.login = false;
                $scope.logout = true;
                $scope.allxx = true;
                $scope.whitexx = false;
                $scope.blackxx = false;
                $("#all").attr('disabled', 'disabled');
                $("#white").attr('disabled', 'disabled');
                $("#black").attr('disabled', 'disabled');
                $scope.add.whiteId = '';
                $("#whiteID").attr('disabled', 'disabled');
                $scope.add.blackId = '';
                $("#blackSelect").attr('disabled', 'disabled');
            }
        }

        //渠道修改联动
        $scope.updateChannelType = function(){
            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }

        //添加浮标登录状态改变
        $scope.loginChange = function (loginStatus,opType,productChannel) {
            $scope.add.position = '';
            $("#editPosition").attr('checked', 'checked');
            if (loginStatus == '1') {
                $("#all").removeAttr('disabled', 'disabled');
            } else {
                $scope.allxx = true;
                $scope.whitexx = false;
                $scope.blackxx = false;
                $("#all").attr('disabled', 'disabled');
                $("#white").attr('disabled', 'disabled');
                $("#black").attr('disabled', 'disabled');
                // $scope.add.whiteId = '';
                $("#whiteID").attr('disabled', 'disabled');
                // $scope.add.blackId = '';
                $("#blackSelect").attr('disabled', 'disabled');
            }

            //黑白名单操作
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
            self.getPostionList(productChannel,opType,loginStatus);
        }

        //修改改变登录状态已登录
        $scope.loginEditClick = function () {
            if ($('#loginEdit').is(':checked')) {
                $scope.logoutEdit = false;
                $scope.loginEdit = true;
                $("#quanbu").removeAttr('disabled', 'disabled');
            }
        }
        //修改改变登录状态未登录
        $scope.logoutEditClick = function () {
            if ($('#logoutEdit').is(':checked')) {
                $scope.loginEdit = false;
                $scope.logoutEdit = true;
                $scope.u.quanbuClick = true;
                $("#quanbu").attr('disabled', 'disabled');
                $("#baimingdan").attr('disabled', 'disabled');
                $("#heimingdan").attr('disabled', 'disabled');
                $("#bDropDown").attr('disabled', 'disabled');
                $("#heiSelect").attr('disabled', 'disabled');
                $scope.operationRecord.whiteId = '0';
                $scope.operationRecord.blackId = '0';
                $("#baimingdan").attr("checked", false);
                $("#heimingdan").attr("checked", false);
            }
        }

        //修改浮标登录状态改变
        $scope.loginChangeEdit = function (loginStatus) {
            $scope.operationRecord.position = '';
            if (loginStatus == '1') {
                $("#quanbu").removeAttr('disabled', 'disabled');
            } else {
                $scope.u.quanbuClick = true;
                $("#quanbu").attr('disabled', 'disabled');
                $("#baimingdan").attr('disabled', 'disabled');
                $("#heimingdan").attr('disabled', 'disabled');
                $("#bDropDown").attr('disabled', 'disabled');
                $("#heiSelect").attr('disabled', 'disabled');
                // $scope.operationRecord.whiteId = '0';
                // $scope.operationRecord.blackId = '0';
                $("#baimingdan").attr("checked", false);
                $("#heimingdan").attr("checked", false);
            }

            //黑白名单操作
            self.operationRecord.whiteMemberListName= "NO_RULE"
            self.operationRecord.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();


            self.operationRecord.blackMemberListName= "NO_RULE"
            self.operationRecord.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
            self.getPostionList(self.operationRecord.productChannel,2,loginStatus);

        }


        $('.input-date').datepicker({
            language: 'zh-CN',
            startView: 3,
            autoclose: true,
            todayBtn: "linked",
            format: "yyyy-mm-dd"
        });
        $('.input-datetime').datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            language: 'zh-CN',
            timeText: '时间',
            hourText: '小时',
            minuteText: '分钟',
            secondText: '秒',
            currentText: '现在',
            closeText: '完成'
        });

        $scope.queryUserList = function () {
            var url = globalConfig.basePath + "/otc/memberEnjoy/getAuditPersionList";
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        $scope.userList = data.data.resp;
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求审核人列表失败了....");
                }
            );
        };
        $scope.queryUserList();
        //审批
        $scope.audit = function (record) {
            if (record.auditStatus != "0") {
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
        $scope.confirm = function () {
            var url = globalConfig.basePath + "/text/auditing";
            $scope.confirmRecord.auditStatus = $scope.auditStatus;
            $scope.confirmRecord.auditDescription = $scope.auditDescription;
            $http.post(url, $scope.confirmRecord).then(function successCallback(callback) {
                if (callback.data.code == '000') {
                    $('.examine-box').hide();
                    alert("操作成功");
                    $scope.pageQueryText(1);
                } else {
                    console.error(callback.data);
                    alert("操作失败");
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                swalMsg(response);
            });
        };

        $scope.deleteLine = function (id) {
            $scope.lineId = id;
            $("#deleteLine").show();
        };

        $scope.tipDel = function (id) {
            $("#content" + id).remove();
            $("#deleteLine").hide();
        };

        //内容回复加减
        $scope.addOrSubtract = function ($scope, $log) {
            $scope.fchat = new Object();
            $scope.fchat.replies = [{key: 0, value: ""}];
            // 初始化时由于只有1条内容，所以不允许删除
            $scope.fchat.canDescReply = false;

            // 增加内容数
            $scope.fchat.incrReply = function ($index,isBeiXuanText) {
                if (isBeiXuanText == 1 && self.fchat.replies.length == 10){
                    alert("备选文案最多只能添加十条喔~");
                    return;
                }
                if (isBeiXuanText == 2 && self.fchat.replies.length == 3){
                    alert("商品标签最多只能添加三条喔~");
                    return;
                }
                if (isBeiXuanText == 3 && self.fchat.replies.length == 3){
                    alert("标签文案最多只能添加三条喔~");
                    return;
                }
                if (isBeiXuanText == 4 && self.fchat.marketReplies.length == 3){
                    alert("营销文案最多只能添加三条喔~");
                    return;
                }
                if(isBeiXuanText == 4){
                    $scope.fchat.marketReplies.splice($index + 1, 0,
                        {key: new Date().getTime(), value: ""});   // 用时间戳作为每个item的key
                }else{
                    $scope.fchat.replies.splice($index + 1, 0,
                        {key: new Date().getTime(), value: ""});   // 用时间戳作为每个item的key
                }
                // 增加新的内容后允许删除
                $scope.fchat.canDescReply = true;
            }

            // 减少内容数
            $scope.fchat.decrReply = function ($index,isBeiXuanText) {
                if (isBeiXuanText == 1 && self.fchat.replies.length == 2){
                    alert("备选文案最少需要添加两条喔~");
                    return;
                }
                if (isBeiXuanText == 2 && self.fchat.replies.length == 2){
                    alert("商品标签最少需要添加两条喔~");
                    return;
                }

                // 如果内容数大于1，删除被点击内容
                if(isBeiXuanText ==4){
                    if ($scope.fchat.marketReplies.length > 1) {
                        $scope.fchat.marketReplies.splice($index, 1);
                    }
                }else{
                    if ($scope.fchat.replies.length > 1) {
                        $scope.fchat.replies.splice($index, 1);
                    }
                }
                // 如果内容数为1，不允许删除
                if ($scope.fchat.replies.length == 1 && $scope.fchat.marketReplies.length ==1) {
                    $scope.fchat.canDescReply = false;
                }
            }

            $scope.fchat.combineReplies = function () {
                var cr = "";
                for (var i = 0; i < $scope.fchat.replies.length; i++) {
                    cr += "#" + $scope.fchat.replies[i].value;
                }
                cr = cr.substring(1);
                $log.debug("Combined replies: " + cr);

                return cr;
            }
        }
        $scope.addOrSubtract($scope, $log);

        $scope.pageQueryText(1);

        //获取一级页面
        $scope.selctPageOne = function (rType) {
            if (rType == '3') {
                var type = "wk_protogenesis_page_one"
                //原生original_bd_url
                $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
                ).success(function (data) {
                    $scope.rDictList = data.resp.result;
                })
            }
        }

        //获取二级页面
        $scope.selectPageOneByRDict = function (v) {
            var type = "wk_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + v.pageOne
            ).success(function (data) {
                $scope.rPositionDictList = data.resp.result;
                if ($scope.rPositionDictList.length == '1') {
                    $scope.add.pageTwo = data.resp.result[0].value;
                } else {
                    $scope.add.pageTwo = data.resp.result[0].value;
                }
                $scope.operationRecord.pageTwo = data.resp.result[0].value;
                $scope.operationRecord.pageTwo = v.pageTwo;
            })

        }

        //获取二级页面-编辑
        $scope.selectPageOneByRDict2 = function (pageOne) {
            var type = "wk_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + pageOne
            ).success(function (data) {
                $scope.rPositionDictList = data.resp.result;
                if ($scope.rPositionDictList.length == '1') {
                    $scope.add.pageTwo = data.resp.result[0].value;
                } else {
                    $scope.add.pageTwo = data.resp.result[0].value;
                }
                $scope.operationRecord.pageTwo = data.resp.result[0].value;
            })

        }

        $scope.isJSON = function (str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    if (str.indexOf('{') > -1) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (e) {
                    console.log(e);
                    return false;
                }
            }
            return false;
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
        if(self.add.productChannel==0){
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
        if(self.add.productChannel==0){
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
                    self.operationRecord.strategyList = data.data.resp;
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
                    self.operationRecord.blackStrategyList = data.data.resp;
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

    //region 修改黑名单查询
    /**
     * 用户策略类型初始化
     */
    self.blackStrategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.operationRecord.blackStrategyList = data.data.resp;
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
        if(self.operationRecord.productChannel==0 ||self.operationRecord.productChannel==2){
            channelCode='WK';
        }else if(self.operationRecord.productChannel==1){
            channelCode='QB';
        }else if(self.operationRecord.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.operationRecord.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.operationRecord.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.operationRecord.blackMemberListName
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


    //region 修改黑名单查询
    /**
     * 用户策略类型初始化
     */
    self.blackStrategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.operationRecord.blackStrategyList = data.data.resp;
                    self.findBlackChannelGroupsUpdate();
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
        if(self.operationRecord.productChannel==0 || self.operationRecord.productChannel==2){
            channelCode='WK';
        }else if(self.operationRecord.productChannel==1 || self.operationRecord.productChannel==4){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.operationRecord.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeBlackSearchUpdate').hide();
            self.operationRecord.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.operationRecord.blackMemberListName
            $http.post(url, self.strate).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strBlackChannelGroups = data.data.resp;
                        if (self.strBlackChannelGroups.length > 0) {
                            $('#userNameLikeBlackSearchUpdate').show();
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


    //新增修改名单逻辑
    //region 修改白名单查询
    /**
     * 用户策略类型初始化
     */
    self.strategyReloadUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.operationRecord.strategyList = data.data.resp;
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
        if(self.operationRecord.productChannel==0 ||self.operationRecord.productChannel==2){
            channelCode='WK';
        }else if(self.operationRecord.productChannel==1){
            channelCode='QB';
        }else if(self.operationRecord.productChannel==6){
            channelCode='SC';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.operationRecord.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterLikeSearch').hide();
            self.operationRecord.whiteId='0';
            $('#memberIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.operationRecord.whiteMemberListName
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
                    self.operationRecord.blackStrategyList = data.data.resp;
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
        if(self.operationRecord.productChannel==0 ||self.operationRecord.productChannel==2){
            channelCode='WK';
        }else if(self.operationRecord.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.operationRecord.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.operationRecord.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.operationRecord.blackMemberListName
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






    //修改，修改名单
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
        self.beforeWhiteMemberListName = self.operationRecord.whiteMemberListName;
        self.beforeBlackMemberListName = self.operationRecord.blackMemberListName;
        self.beforeWhiteId = self.operationRecord.whiteId;
        self.beforeBlackId = self.operationRecord.blackId;
        if (self.operationRecord.whiteName && self.operationRecord.whiteName != ''){
            self.beforeWhiteName = self.operationRecord.whiteName;
        }
        if (self.operationRecord.blackName && self.operationRecord.blackName != ''){
            self.beforeBlackName = self.operationRecord.blackName;
        }
        self.operationRecord.whiteId = '';
        self.operationRecord.blackId = '';
        self.operationRecord.blackMemberListName = 'NO_RULE';
        self.operationRecord.whiteMemberListName = 'NO_RULE';

        $('#upUserRosterLikeSearch').hide();

        $('#upUserRosterBlackLikeSearch').hide();

    }

    //点击白名单复选框
    self.upWhiteClick = function () {
        if(!$("#upWhite").prop("checked")){
            self.operationRecord.whiteMemberListName= "NO_RULE"
            self.operationRecord.whiteId=null;
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
