var touchCount = 0;
'use strict';// 严谨模式
var App = angular.module('interactionPlateApp', [], angular.noop);
App.controller('interactionPlateController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};// 查询
    self.add = {};// 添加
    self.updatePopup = {};// 修改
    self.showPopup = {};// 查看
    $scope.loginName = globalConfig.loginName;
    $scope.userInfo = globalConfig.name+"   "+globalConfig.loginName;
    self.search.productChannel = '0';
    self.add.tabObject = "";
    self.detail = {};
    self.isUpdateRoster = 'N';
    //内容推荐查询
    self.querycontentConfigList = function (paegNum2) {
        if (self.pages < paegNum2 && paegNum2 != 1) {
            return;
        }
        if (!paegNum2) {
            self.search.pageNum = 1;
        } else {
            self.search.pageNum = paegNum2;
        }

        var url = globalConfig.basePath + "/apConfig/interaction/queryInteractionPlateList";
        $http.post(url, self.search).then(
            function (data) {
                self.total = data.data.resp.totalRowSize;
                self.pages = data.data.resp.pageCount;
                self.contentConfigList = data.data.resp.result;
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };


    //

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


    // 获取位置
    self.getPostionList = function(productChannel,opType){
        //var addproductChannel = $("#searchproductChannel").val();//渠道

        var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_interaction&productChannel="+productChannel;
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
                    self.add.positions="0";
                }
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取互动板块位置失败了....");
        });
    }
    self.getPostionList(0,0);



    //重置
    self.reset2 = function () {
        // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.status = "";//上线状态
        self.search.valid = "";//是否生效
        self.search.positions = "";//内容推荐位置
        self.search.priority = "";
        self.search.auditStatus = "";
        self.search.type = "";
        self.search.interactionType="";
        //self.search.onTime="";//在线时间
        $("#searchonTime").val("");
        $("#searchoffTime").val("");
        self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
    }


    //*************************************Add 内容推荐************************************

    $scope.selctPageOne = function () {
        if (self.jumpType == '3') {
            var type = "gonggao_onePage"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
            ).success(function (data) {
                $scope.rDictList = data.resp.result;
            })
        }

    }

    //内容推荐Box
    self.addInteraction= function () {
        self.add = {};

        $('#addShow').show();

        $("#white").attr('disabled', 'disabled');
        $("#black").attr('disabled', 'disabled');
        $('#all').prop("checked", true);
        $("#white").attr("checked", false);
        $("#black").attr("checked", false);
        $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
        $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
        $("#selectaddwhiteId").val("");
        $("#selectaddblackId").val("");

        self.add.productChannel = "0";
        self.add.positions = "0";
        self.add.interactionType='1';
        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
        self.getPostionList(0,1)

    }

    //渠道切换
    self.updateChannelType = function(){
        //黑白名单操作
        self.strategyReload();
        $('#userNameLikeSearch').hide();
        self.blackStrategyReload();
        $('#userNameLikeBlackSearch').hide();
        self.getPostionList(self.add.productChannel,1)
    }


    // 选择版本
    self.addversionCheckbox = function () {
        self.addPostionCheck();
    }


    self.addpostion = function () {
        var versions = "";
        $('.versionCheckbox').each(function () {
            if (this.checked == true) {
                if ($(this).val()) {
                    versions += $(this).val() + ",";
                }
            }
        });
        if (!versions) {
            alert("请选择产品版本");
            return;
        }


    }

    // 登陆选择
    self.addLoginStatus = function (param) {
        if (param == '0' || param == '2') {
            $("#all").attr('disabled', 'disabled');
            $('#all').prop("checked", true);
            $("#white").attr('disabled', 'disabled');
            $('#white').prop("checked", false);
            $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            $("#selectaddwhiteId").val("");
            $("#black").attr('disabled', 'disabled');
            $('#black').prop("checked", false);
            $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
            $("#selectaddblackId").val("");

        } else {
            $("#editall").removeAttr("disabled");
            $("#all").removeAttr("disabled");
            if ($('#all').is(':checked')) {
                $("#editwhite").attr('disabled', 'disabled');
                $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
                $("#editselectaddwhiteId").val("0");
                $("#editblack").attr('disabled', 'disabled');
                $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
                $("#editselectaddblackId").val("0");
            } else {
                $('#editall').prop("checked", true);
                $("#editwhite").removeAttr('disabled', 'disabled');
                $("#editblack").removeAttr('disabled', 'disabled');
                $("#editselectaddblackId").removeAttr("disabled");
                $('#all').prop("checked", true);
                $("#white").removeAttr('disabled', 'disabled');
                $("#selectaddwhiteId").removeAttr("disabled");
                $("#black").removeAttr('disabled', 'disabled');
                $("#selectaddblackId").removeAttr("disabled");

            }

        }

        self.addPostionCheck();
    }


    /**
     *推荐内容查询
     */
    self.remommendClassifiCation = function(){
        var url = globalConfig.basePath+"/appConfig/content/getRecommendedClassification?positions="+309+"&productChannel="+1;
        $http.get(url).then(
            function (data) {
                console.log(data,"推荐分类返回的数据");
                self.recommendClassification = data.data.resp;
            }
        )
    }

    $scope.remommendClassifiCation();

    //确认添加内容推荐
    $scope.saveInteraction = function () {

        if (!self.add.productChannel) {
            alert("渠道不能为空");
            return;
        }

        if (!self.add.positions || self.add.positions == 0) {
            alert("位置不能为空");
            return;
        }
        var addpositionsText = $("#addPositions").find("option:selected").text();
        if(!addpositionsText){
            alert("互动位置不能为空");
            return ;
        }
        self.add.positionName =addpositionsText;


        if (!self.add.interactionName) {
                alert("互动名称不能为空");
                return;
        }

        if (!self.add.topicTitle) {
                alert("话题标题不能为空");
                return;

        }

        if ($("#addComId").val()=="") {
                alert("社区ID不能为空");
                return;
        }

        //上线时间  下线时间
        self.add.onlineTime = $('#queryOnlineTime').val() + "";
        self.add.offlineTime = $('#queryOfflineTime').val() + "";
        self.add.contentTab = $('#addContentTab').val() + "";
        if (!self.add.onlineTime || !self.add.offlineTime) {
            alert("上线时间下线时间不能为空");
            return;
        }

        if (self.add.offlineTime <= self.add.onlineTime) {
            alert("下线时间必须大于上线时间");
            return;
        }
        var offlineTime = self.add.offlineTime;
        var offlineTimes = offlineTime.split(" ");
        var miniTime = "23:59:59";
        self.add.offlineTime = offlineTimes[0] + " " + miniTime;
        //审核人
        var requestAuditPersio = self.add.auditPerson;
        //提审说明
        var auditDescription = self.add.requestAuditDescription;

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


        // 审核人
        if (!requestAuditPersio) {
            alert("审核人不能为空");
            return;
        } else {
            self.add.auditNo = self.add.auditPerson.no;
            self.add.auditPerson = self.add.auditPerson.name;
        }
        if (auditDescription != null) {
            if (auditDescription.length > 18) {
                alert("审核说明不能超过18个字符");
                return;
            }
        }

        var url = globalConfig.basePath + "/apConfig/interaction/addInteractionPlate";
        $http.post(url, self.add).then(
            function (data) {
                alert(data.data.message);
                $('#addShow').hide();
                self.add = {};
                window.location.reload();
            }, function (response) {
                alert("请求失败了....");
                window.location.reload();
            }
        );

    }



    //添加全部选中事件
    self.completeAll = function () {
        $("#white").attr("checked", false);
        // self.queryWhiteAndBlack();
        $("#black").attr("checked", false);
        if ($('#all').is(':checked')) {
            $("#white").attr('disabled', 'disabled');
            $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            // $("#selectaddwhiteId").val("");
            $("#black").attr('disabled', 'disabled');
            $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
            // $("#selectaddblackId").val("");

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

    //查询黑白名单列表
    self.queryWhiteAndBlack = function () {
        $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
            function (data) {
                self.blackList_qb = data.data.resp.black_qb;
                self.blackList_wk = data.data.resp.black_wk;
                self.whiteList_qb = data.data.resp.white_qb;
                self.whiteList_wk = data.data.resp.white_wk;
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }

    //查询黑白名单列表
    self.queryEditWhiteAndBlack = function () {
        $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
            function (data) {
                self.editblackList_qb = data.data.resp.black_qb;
                self.editblackList_wk = data.data.resp.black_wk;
                self.editwhiteList_qb = data.data.resp.white_qb;
                self.editwhiteList_wk = data.data.resp.white_wk;
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    self.queryEditWhiteAndBlack();


    //************************内容推荐查看**************************
    //查看
    self.toView = function (query) {
        self.showInteraction = query;
        $('#showContentView').show();

    }


    //修改取消按钮
    $scope.hsjgonto = function () {
        $("#upateContent").hide();
    }
//************************修改*****************************
    self.updatePageOneByRDict = function (updatePageOne) {
        $http.get(globalConfig.basePath + "/dict/getByResourceType" + "?resourceType=" + updatePageOne
        ).success(function (data) {
            $scope.upatePositionDictList = data.resp.result;
            $scope.updataePageTwo = data.resp.result[0].value;
        })

    }

    self.update = function (query) {
        query.valid = query.valid + "";
        query.whiteId = query.whiteId + "";
        query.blackId = query.blackId + "";
        self.isUpdateRoster = 'N';
        $scope.detail = angular.copy(query);
        $scope.detail.interactionType = $scope.detail.interactionType+'';
        if (query.showType == 0) {
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
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = null;
                $('#userNameLikeSearchUpdate').hide();
            },500)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = null;
                $('#userNameLikeBlackSearchUpdate').hide();
            },500)

        } else if (query.showType == 1) {
            $('#editwhite').prop("checked", true);
            $('#editblack').prop("checked", false);
            $('#editall').prop("checked", false);
            $('#editwhite').removeAttr("disabled");
            $('#editblack').removeAttr("disabled");

            //修改名单那类型查询
            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = query.whiteId;
            },500)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = null;
                $('#userNameLikeBlackSearchUpdate').hide();
            },500)
        } else if (query.showType == 2) {
            $('#editblack').prop("checked", true);
            $('#editwhite').prop("checked", false);
            $('#editall').prop("checked", false);
            $('#editwhite').removeAttr("disabled");
            $('#editblack').removeAttr("disabled");

            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = null;
                $('#userNameLikeSearchUpdate').hide();
            },500)

            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = query.blackId;
            },500)
        } else if (query.showType == 3) {
            $('#editblack').prop("checked", true);
            $('#editwhite').prop("checked", true);
            $('#editall').prop("checked", false);
            $('#editwhite').removeAttr("disabled");
            $('#editblack').removeAttr("disabled");
            self.strategyReloadUpdate();
            setTimeout(function () {
                self.detail.whiteMemberListName=query.whiteMemberListName;
                self.detail.whiteId = query.whiteId
            },500)
            self.blackStrategyReloadUpdate();
            setTimeout(function () {
                self.detail.blackMemberListName=query.blackMemberListName;
                self.detail.blackId = query.blackId;
            },500)
        }
        self.productChannel = query.productChannel + '';
        self.detail.auditPerson = '';
        self.detail.tabTextId = self.detail.tabTextId + "";
        if (self.productChannel == 1 && $scope.detail.positions == '308') {
            self.getTitleList($scope.detail.positions, self.productChannel);
        }
        setTimeout(function () {
            self.getPostionList( $scope.detail.productChannel)
        },300)

        //修改禁用名单
        $("#editall").attr('disabled','disabled');
        $("#editwhite").attr("disabled",'disabled');
        $("#editblack").attr("disabled",'disabled');
        $('#upateContent').show();



    }

    self.updateSure = function () {


        if (!self.detail.positions || self.detail.positions == 0) {
            alert("位置不能为空");
            return;
        }
        var addpositionsText = $("#editPositions").find("option:selected").text();
        if(!addpositionsText){
            alert("互动位置不能为空");
            return ;
        }
        self.detail.positionName = addpositionsText;

        if (!self.detail.interactionName) {
            alert("互动名称不能为空");
            return;
        }

        if (!self.detail.topicTitle) {
            alert("话题标题不能为空");
            return;

        }

        if ($("#upComId").val()=="") {
            alert("社区ID不能为空");
            return;
        }

        //上线时间  下线时间
        self.detail.onlineTime = $('#editOnlineTime').val() + "";
        self.detail.offlineTime = $('#editOfflineTime').val() + "";
        self.detail.contentTab = $('#updateContentTab').val() + "";

        if (!self.detail.onlineTime || !self.detail.offlineTime) {
            alert("上线时间下线时间不能为空");
            return;
        }

        if (self.detail.offlineTime <= self.detail.onlineTime) {
            alert("下线时间必须大于上线时间");
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
                self.detail.showType = 3;
            }

            if (!whiteId && !blackId){
                self.detail.showType = 0;
            }
            if (whiteId && whiteId != 0 && !blackId){
                self.detail.showType = 1;
            }
            if (blackId && blackId!=0 && !whiteId){
                self.detail.showType = 2;
            }
            if (self.detail.whiteMemberListName != 'NO_RULE'){
                self.detail.whiteTrue=true;
            }

            if (self.detail.blackMemberListName != 'NO_RULE'){
                self.detail.blackTrue = true;
            }


            if(self.detail.whiteTrue == true){
                var whiteId =  $('#memberIdUpdate').val();
                if(whiteId==null || whiteId=="" || whiteId=="0" || whiteId.indexOf("?")!=-1){
                    alert('请选择具体白名单!');
                    return;
                }else{
                    self.detail.whiteId = whiteId;
                    self.detail.whiteName = $('#memberIdUpdate option:selected').text();
                }
            }
            if(self.detail.blackTrue == true){
                var blackId =  $('#memberBlackIdUpdate').val();
                if(blackId == null || blackId=="" || blackId=="0"|| blackId.indexOf("?")!=-1){
                    alert('请选择具体黑名单!');
                    return;
                }else{
                    self.detail.blackId = blackId;
                    self.detail.blackName = $('#memberBlackIdUpdate option:selected').text();
                }
            }
        }



        //审核人
        var requestAuditPersio = self.detail.auditPerson;
        //提审说明
        var auditDescription = self.detail.requestAuditDescription;
        // 审核人
        if (!requestAuditPersio) {
            alert("审核人不能为空");
            return;
        } else {
            self.detail.auditNo = self.detail.auditPerson.no;
            self.detail.auditPerson = self.detail.auditPerson.name;
        }
        if (auditDescription != null) {
            if (auditDescription.length > 18) {
                alert("审核说明不能超过18个字符");
                return;
            }
        }

        var url = globalConfig.basePath + '/apConfig/interaction/updateInteractionPlate';
        $http.post(url, self.detail).then(function successCallback(data) {
            if (data.data.code == '000') {
                alert("修改成功");
                $("#editTask").hide();
                window.location.reload();
            }
        }), function errorCallback(response) {

        }

    }
    //添加全部选中事件
    self.editAll = function () {
        // self.queryEditWhiteAndBlack();
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
            self.detail.whiteMemberListName= "NO_RULE"
            self.detail.whiteId=null;
            self.strategyReloadUpdate();
            $('#userNameLikeSearchUpdate').hide();


            self.detail.blackMemberListName= "NO_RULE"
            self.detail.blackId=null;
            self.blackStrategyReloadUpdate();
            $('#userNameLikeBlackSearchUpdate').hide();
        } else {
            $("#upWhite").removeAttr('disabled', 'disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");
            $("#upBlack").removeAttr('disabled', 'disabled');
            $("#editselectaddblackId").removeAttr("disabled");
        }
    }


    //取消修改
    $scope.updateCancel = function () {
        $('#showUpdate').hide();

    }

    self.isSelected = function (id) {

        if (self.positions) {
            if (self.positions == "1,2") {
                return true;
            }
            if (self.positions == id) {
                return true;
            }
        }
        return false;
    }

    //*******************排序**************************
    self.stort = function () {
        touchCount++;
        if (!self.search.productChannel) {
            alert("请在查询条件中选择渠道");
            return;
        }
        if (!self.search.positions) {
            alert("请在查询条件中选择位置");
            return;
        }
        self.search.interactionType = $("#interactionType").val();
        $('#showPriority').show();
        var url = globalConfig.basePath + "/apConfig/interaction/selectSort?productChannel=" + self.search.productChannel + "&positions=" + self.search.positions + "&interactionType="+self.search.interactionType;

        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.code == '000') {
                for (var i = 0; i < data.data.resp.result.length; i++) {
                    data.data.resp.result[i].priority = i + 1;
                }
                self.strotList = data.data.resp.result;
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
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

    //根基类型获取数据
    $scope.getTypeList = function (search) {
        /*var url = globalConfig.basePath + "/appConfig/content/selectSort?productChannel=" + $scope.search.productChannel + "&positions=" + $scope.search.positions + "&contentTab=" + $scope.search.tabNameKey;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.code == '000') {
                self.strotList = data.data.resp.result;
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });*/

        var url = globalConfig.basePath + "/appConfig/content/selectSort?productChannel=" + self.search.productChannel + "&positions=" + self.search.positions + "&tabNameKey="+ $scope.search.tabNameKey;

        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.code == '000') {
                for (var i = 0; i < data.data.resp.result.length; i++) {
                    data.data.resp.result[i].priority = i + 1;
                }
                self.strotList = data.data.resp.result;
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
    }


    //移动
    self.move = function (type) {
        if ($("input[class='moveCheckbox']:checked").length > 1) {
            alert("请选择一个进行移动");
            return;
        }
        var length = self.strotList.length;


        $('.moveCheckbox').each(function () {
            if (this.checked == true) {
                if (type == 'S') {//上移
                    var me = $(this).val() - 1;
                    if (me == 0) {
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 = self.strotList[me];//当前选中的
                    var move1 = self.strotList[me - 1];//上一个
                    self.strotList[me - 1] = move0;//self.strotList[me];//当前选中的上移一个
                    self.strotList[me] = move1;// 当前选中的
                    self.strotList[me - 1].priority = Number($(this).val()) - Number(1);
                    self.strotList[me].priority = Number($(this).val());
                } else if (type == 'X') {// 下移
                    var me = $(this).val() - 1;
                    if (me == length - 1) {
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = self.strotList[me];// 下一个内容推荐
                    move0.priority = Number($(this).val()) + Number(1);

                    var move1 = self.strotList[me + 1];// 下一个内容推荐
                    move1.priority = Number($(this).val());
                    self.strotList[me + 1] = move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    self.strotList[me] = move1;// 下一个移动到当前的位置

                }
            }
        })

    }


    self.moveCommit = function () {
        var url = globalConfig.basePath + "/apConfig/interaction/moveCommit";
        var aa = {};
        aa = self.strotList;
        $http.post(url, aa).then(
            function (data) {
                alert(data.data.message);
                self.querycontentConfigList(1);
                $('#showPriority').hide();
                self.strotList = {};
            }, function (response) {
                alert("请求失败了....");
            }
        );
    }

    //********************失效***************************
    //生效失效内容推荐
    self.quickOffline = function (id, valid) {
        $('#showStart').show();
        self.start.startValid = valid;
        self.start.id = id;
    }
    //确定失效生效内容推荐
    self.confirmStart = function (id, valid) {
        if (valid == 0) {
            valid = 1;
        } else if (valid == 1) {
            valid = 0;
        }
        var url = globalConfig.basePath + "/appConfig/Popup/takeEffectPopup?id=" + id + "&valid=" + valid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            //self.reset();
            // self.loading();
            self.querycontentConfigList(1);
            $('#showStart').hide();

        }, function errorCallback(response) {
            alert("失败....");
        });
        self.querycontentConfigList(1);
    }

    //取消生效失效内容推荐
    self.cancelStart = function () {
        $('#showStart').hide();
    }


    /**
     * 打开生效弹框
     */
    $scope.startShow = function (id, valid, SequenceId) {
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
     * 失效内容推荐
     */
    $scope.start = function (id) {
        var url = globalConfig.basePath + "/apConfig/interaction/takeEffect?id=" + id;
        $http({
            method: 'POST',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            $('#showStart').hide();
            //$scope.queryAnnouncement(1);
            self.querycontentConfigList(1);
        }, function errorCallback(response) {
            alert("失败....");
        });
    }

    //默认查询
    self.loading = function () {
        self.search.pageSize = "5";

        self.querycontentConfigList(1);
    }
    self.loading();
    // self.loading();


    /**
     * 拉取审核人列表
     */
    $scope.pullAuditPersons = function () {
        var url = globalConfig.basePath + "/otc/memberEnjoy/getAuditPersionList";
        $http.get(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
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
     * 审核box
     */
    self.audit = function (record) {
        if (record.auditStatus != "0") {
            alert('只能对待审核状态的数据进行操作');
            return;
        }
        self.auditStatus = "1";
        $('#auditShow').show();
        self.confirmRecord = angular.copy(record);
        self.auditDescription = "";

    };

    /**
     * 审核操作
     */
    self.confirm = function () {
        self.confirmRecord.auditStatus = self.auditStatus;
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath + "/apConfig/interaction/auditing";
        $http.post(url, self.confirmRecord).then(function successCallback(callback) {

            if (callback.data.code == '000') {
                $('.take-start-box').hide();
                $scope.querycontentConfigList(1);
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
    $scope.preOperate = function (opType, record) {
        record.requestAuditDescription = "";
        $scope.effectRecord = record;
        $scope.effectRecord.auditPerson = {};
        self.effectRecord.auditPerson.no = '';
        $scope.effectRecord.id = record.id;
        $('#takeEffect').show();
    };


    $scope.fastOffline = function () {

        if (!self.effectRecord.auditPerson.no) {
            alert("审核人不能为空");
            return;
        } else {
            self.effectRecord.auditNo = self.effectRecord.auditPerson.no;
            self.effectRecord.requestAuditPersonEmail = self.effectRecord.auditPerson.email;
            self.effectRecord.auditPerson = self.effectRecord.auditPerson.name;
        }
        self.effectRecord.valid = '0';
        var url = globalConfig.basePath + "/appConfig/content/fastOffline";
        $http.post(url, self.effectRecord).then(function (data) {
                $('#takeEffect').hide();
                if (data.data.code == '000') {
                    alert(data.data.message);
                    $scope.querycontentConfigList(1);
                }
            }, function (response) {
                alert("请求失败了....");
            }
        );


    };


    $scope.validateRecord = function () {
        // 审核人
        if (!self.effectRecord.auditPerson.no) {
            alert("审核人不能为空");
            return;
        } else {
            self.effectRecord.auditNo = self.effectRecord.auditPerson.no;
            self.effectRecord.requestAuditPersonEmail = self.effectRecord.auditPerson.email;
            self.effectRecord.auditPerson = self.effectRecord.auditPerson.name;
        }
        self.effectRecord.valid = '0';

        var url = globalConfig.basePath + "/appConfig/content/takeEffectNew";
        $http.post(url, self.effectRecord).then(function (data) {
                $('#takeEffect').hide();
                if (data.data.code == '000') {
                    alert(data.data.message);
                    $scope.querycontentConfigList(1);
                }
            }, function (response) {
                alert("请求失败了....");
            }
        );


    };
    $scope.openTopTip = function (x) {
        self.topRecord = x;
        $('#moveTop').show();
    }
    $scope.moveTop = function () {
        var url = globalConfig.basePath + "/appConfig/announcementNew/moveTop";
        $http.post(url, self.topRecord).then(function (data) {
                $('#moveTop').hide();
                alert('置顶成功');
                $scope.querycontentConfigList(1);
            }, function (response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.moveTopCancel = function () {
        $('#moveTop').hide();
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
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.add.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
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
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.add.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeBlackSearch').hide();
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
                    self.detail.strategyList = data.data.resp;
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
                    self.detail.blackStrategyList = data.data.resp;
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
                    self.detail.strategyList = data.data.resp;
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
        if(self.detail.productChannel==0 ||self.detail.productChannel==2){
            channelCode='WK';
        }else if(self.detail.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.detail.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterLikeSearch').hide();
            self.detail.whiteId='0';
            $('#memberIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.detail.whiteMemberListName
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
                    self.detail.blackStrategyList = data.data.resp;
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
        if(self.detail.productChannel==0 ||self.detail.productChannel==2){
            channelCode='WK';
        }else if(self.detail.productChannel==1){
            channelCode='QB';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.detail.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#upUserRosterBlackLikeSearch').hide();
            self.detail.blackId='0';
            $('#memberBlackIdUpdate').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.detail.blackMemberListName
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

        $('#editall').prop("checked",true);//默认全部不选择
        $("#upWhite").attr('checked',false);
        $("#upBlack").attr('checked',false);
        $("#upWhite").attr('disabled','disabled');
        $("#upBlack").attr('disabled','disabled');
        $("#whitListType").attr('disabled','disabled');
        $("#blackListType").attr('disabled','disabled');
        self.beforeWhiteMemberListName = self.detail.whiteMemberListName;
        self.beforeBlackMemberListName = self.detail.blackMemberListName;
        self.beforeWhiteId = self.detail.whiteId;
        self.beforeBlackId = self.detail.blackId;
        if (self.detail.whiteName && self.detail.whiteName != ''){
            self.beforeWhiteName = self.detail.whiteName;
        }
        if (self.detail.blackName && self.detail.blackName != ''){
            self.beforeBlackName = self.detail.blackName;
        }
        self.detail.whiteId = '';
        self.detail.blackId = '';
        self.detail.blackMemberListName = 'NO_RULE';
        self.detail.whiteMemberListName = 'NO_RULE';

        $('#upUserRosterLikeSearch').hide();

        $('#upUserRosterBlackLikeSearch').hide();

    }

    //点击白名单复选框
    self.upWhiteClick = function () {
        if(!$("#upWhite").prop("checked")){
            self.detail.whiteMemberListName= "NO_RULE"
            self.detail.whiteId=null;
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

    //黑名单选中事件 type 0 添加 1修改
    self.blackClick = function(type){

        if(type==1){
            if(!$('#editblack').prop("checked")){
                self.detail.blackMemberListName= "NO_RULE"
                self.detail.blackId=null;
                self.blackStrategyReloadUpdate();
                $('#userNameLikeBlackSearchUpdate').hide();
                $("#blackListType").attr('disabled','disabled');
            }else{
                $("#blackListType").attr('disabled',false);

            }
        }else{
            if(!$('#black').prop("checked")){
                self.blackStrategyReload();
                $('#userNameLikeBlackSearch').hide();
            }
        }
    }


}])

App.filter("priorityFilter", function () {
    return function (val) {
        var res = "";
        switch (val) {
            case 0:
                res = "正常"
                break;
            case 1:
                res = "置顶"
                break;
        }
        return res;
    }
})

App.filter("positionFilter", function () {
    return function (val) {
        var res = "";
        switch (val) {
            case '1':
                res = "首页互动板块"
                break;
            case '302':
                res = "生活服务入口"
                break;

        }
        return res;
    }

})
