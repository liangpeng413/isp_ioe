function smartCommon($scope, $http) {
      var self = $scope;

    /**
     * 拉取审核人列表
     */
    $scope.pullAuditPersons = function (menu) {
        // alert('lalal');
        var url = globalConfig.basePath + "/otc/memberEnjoy/listAuditPerson?menu=" + menu;
        $http.get(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
                $scope.auditPersonList = callback.data.resp;
                // console.log("审核人列表：", $scope.auditPersonList);
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


    /**
     * 渠道
     */
    $scope.getChannelCodeName = function (channelCode) {
        if (channelCode == 'WK') {
            return '悟空理财';
        } else if (channelCode == 'QB') {
            return '玖富钱包';
        }else  if(channelCode == 'SF'){
            return '三方渠道';
        }else  if(channelCode == 'SC'){
            return '玖富商城';
        }
        return '';
    }

    /**
     * 添加动作
     *
     * @param actionType award、message
     * @param actionGroup 动作组
     */
    $scope.addAction = function (actionType, actionGroup) {
        // alert("添加动作");
        $scope.tempAction = {};
        $scope.messageTemplateList = [];
        if (actionGroup.actions && actionGroup.actions.length >= 20) {
            alert("最多可添加20个动作");
            return;
        }
        $scope.tempAction = {};
        // console.log(actionGroup, "addAction --- actionGroup");
        if (actionType == 'award') {
            $('.add-award-Model').show();
        } if(actionType =='informSms'){
                var menu = "aio_marketing_audit"
                $scope.pullAuditPersons(menu);
                self.actionTypeSms = "sms";
        }if(actionType =='messageTemplate') {
            var messageTempActionTypeValue = document.getElementById("select2-uniqueId-container");
            if (messageTempActionTypeValue) {
                messageTempActionTypeValue.title="请选择";
                messageTempActionTypeValue.innerHTML = "请选择";
            }
            $('.add-message-Model').show();
        }
        $(function() {
            $('.js-example-basic-single').select2();
        });
        $scope.currentActionGroup = actionGroup;
    };

    $scope.checkedsms = function(actionGroups,actions) {
        var indexOf = actionGroups.indexOf(actions);
        var count = 0;
        for (var i = 0; i < self.project.actionGroups.length; i++) {
            var id = 'useInformid' + i;
            if($("#"+id)[0].checked ==true){
                count ++;
            }
            if(count>1){
                $("#"+'useInformid'+indexOf).prop("checked",false);
                alert("通知类短信每次只可发送1条短信");
                return;
            }
        }
        for (var j = 0; j < self.project.actionGroups.length; j++) {
            if (indexOf == j) {
                var tempActionGroup = self.project.actionGroups[j];
                var actionid = 'useInformid' + j;
                if ($("#"+actionid)[0].checked == false) {
                    $("#"+actionid).prop("checked", false);
                    self.project.actionGroups[j].useInform = '0';
                    var menu = "aio_marketing_audit"
                    $scope.pullAuditPersons(menu);
                } else {
                    if (tempActionGroup.actionCount > 1) {
                        $("#"+actionid).prop("checked", false);
                        self.project.actionGroups[j].useInform = '0';
                        var menu = "aio_marketing_audit"
                        $scope.pullAuditPersons(menu);
                        alert("通知类短信每次只可发送1条短信");
                    } else {
                        $("#"+actionid).prop("checked", true);
                        var menu = "aio_marketing_audit_sms"
                        $scope.pullAuditPersons(menu);
                        self.project.actionGroups[j].useInform = '1';
                        $('.take-start-box').show();
                    }
                }
            }
        }
    }

    $scope.smsCount = function(){
        var url = globalConfig.basePath + "/smart_marketing/initiative/getSmsCount";
        $http({
           method: 'post',
            url: url,
        }).then(
            function(data) {
                $scope.smsCountValue=data.data.resp.smsCount;
                self.smsCountValue=data.data.resp.smsCount;
           },function(response) {
                alert("请求失败了....");
            }
        );
    };
    $scope.smsCount();


    $scope.divhide = function(){
        $('#informSmshide').hide();
    }
    $scope.divhide();

    /**
     * 添加奖励（积分、卡券） 和 消息（短信、banner等）
     */

    $scope.commitAddAction = function () {
        var obj = new Object();
        self.actionTypeSms = "";
        // console.log($scope.tempAction, "lm add ---- commitAddAction tempAction lm----");
        //奖励情况：project.action.type为jf、coupon，project.action.typeValue为卡券id、积分数值
        //消息情况：project.action为触达对象（包括id、type）
        if (self.tempAction.isUpdate == 1 && (self.tempAction.type == 'sms' || self.tempAction.type == 'banner' || self.tempAction.type == 'push' || self.tempAction.type == 'note')){
            self.tempAction.typeValue = $('#uniqueId').val();
            self.tempAction.typeValue = Number(self.tempAction.typeValue.split(":")[1]);
        }
        if((self.tempAction.type == 'newCoupon' || self.tempAction.type == 'mallCoupon') && !$scope.tempAction.typeValue){
            alert("请正确输入卡券ID");
            return;
        }
        if (!$scope.tempAction.type || !$scope.tempAction.typeValue) {
            alert("请正确填写动作信息");
            return;
        }
        obj.type = $scope.tempAction.type;
        obj.typeValue = $scope.tempAction.typeValue;
        obj.actionPurposeDesc = $scope.tempAction.actionPurposeDesc;

            obj.jfRuleId = $scope.tempAction.jfRuleId;

        if (obj.type=="jf"&&!obj.actionPurposeDesc){
            alert("积分描述为必填项!");
            return;
        }
        if (obj.type=="jf" && !obj.jfRuleId){
            alert("请输入积分规则ID");
            return;
        }
        if (obj.type=="jf"&&!obj.typeValue){
            alert("积分数为必填项!");
            return;
        }

         if (obj.type=="jf"&&obj.actionPurposeDesc.length>20){
             alert("输入的字符不得大于20字符!");
             return;
         }
        $('.add-award-Model').hide();
        $('.add-message-Model').hide();
       var thisChannelCode;
         if (self.channelCodeName=="悟空理财"){
             thisChannelCode = 2;
         }else if(self.channelCodeName=="玖富商城"){
             thisChannelCode = 6;
         }else {
             thisChannelCode = 1;
         }
        switch (obj.type) {

            case "jf":

                    var jfValue = obj.typeValue;
                    $.ajax({
                        url: globalConfig.basePath + "/smart_marketing/initiative/checkPointRuleId?pointRuleId=" + obj.jfRuleId+"&productChannel="+thisChannelCode+"&scene=8",
                        type: "get",
                        dataType: "json",
                        contentType: "text/html;charset=utf-8",
                        data: obj.jfRuleId,
                        async: false,
                        success: function (data) {
                            // console.log("校验数据返回", data);
                            if (data.code == '000') {
                                if (typeof (data.resp.data) == "undefined" ||data.resp.data.channel!=thisChannelCode ) {
                                    alert("积分规则不存在，请重试!");
                                    return;
                                } else if (data.resp.data == null) {
                                    obj.actionDesc = null;
                                    alert("积分规则不存在，请重试!");
                                    return;
                                } else if (data.resp.data.status == '0' || data.resp.data.status == '9') {
                                    alert("积分规则不在有效期内，请重试!");
                                    return;
                                } else if (data.resp.data.status == '2') {
                                    alert("该积分规则无法使用，请重试!");
                                    return;
                                } else {
                                    obj.actionDesc = '积分-' + obj.typeValue + '-剩余额度:' + data.resp.data.availablePoint;

                                }
                            }else{
                                alert(data.message);
                                return;
                            }
                        }

                    })


                if (!obj.actionDesc){
                    return;
                }
                break;

                case 'coupon':

                var channel = thisChannelCode;
                var coupon = new Object();
                obj.actionDesc = $scope.tempAction.typeValue + '-';
                obj.actionPurposeDesc = self.actionPurposeDesc;
                $scope.getCoupon(channel, $scope.tempAction.typeValue, coupon);
                setTimeout(function () {
                    // console.log("返回值处卡券 setTimeOut 内 coupon：", coupon);
                    // console.log("setTImeOut内 Coupon: ", $scope.tempCoupon);
                    if (!$scope.tempCoupon || null == $scope.tempCoupon || !$scope.tempCoupon.couponName || !$scope.tempCoupon.discount) {
                        obj = null;
                        return;
                    }
                    obj.actionDesc = obj.actionDesc + $scope.tempCoupon.couponName + "-" +
                            $scope.tempCoupon.couponTypeName + "-" + $scope.tempCoupon.discount+ "-" + $scope.tempCoupon.couponCount;
                    if (!$scope.currentActionGroup.actions) {
                        $scope.currentActionGroup.actions = new Array();
                    }
                    $scope.currentActionGroup.actions.push(obj);
                    // console.log("setTimeout nei actions: ", $scope.currentActionGroup.actions);
                    $scope.tempCoupon = null;
                    $scope.$apply();
                }, 1000);
                // return;
                break;
            case 'newCoupon':

                var channel = thisChannelCode;
                var coupon = new Object();
                obj.actionDesc = $scope.tempAction.typeValue + '-';
                obj.actionPurposeDesc = self.actionPurposeDesc;
                $scope.getCoupon(channel, $scope.tempAction.typeValue, coupon);
                setTimeout(function () {
                    // console.log("返回值处卡券 setTimeOut 内 coupon：", coupon);
                    // console.log("setTImeOut内 Coupon: ", $scope.tempCoupon);
                    if (!$scope.tempCoupon || null == $scope.tempCoupon || !$scope.tempCoupon.couponName || !$scope.tempCoupon.discount) {
                        obj = null;
                        return;
                    }
                    obj.actionDesc = obj.actionDesc + $scope.tempCoupon.couponName + "-" +
                        $scope.tempCoupon.couponTypeName + "-" + $scope.tempCoupon.discount+ "-" + $scope.tempCoupon.couponCount;
                    if (!$scope.currentActionGroup.actions) {
                        $scope.currentActionGroup.actions = new Array();
                    }
                    $scope.currentActionGroup.actions.push(obj);
                    // console.log("setTimeout nei actions: ", $scope.currentActionGroup.actions);
                    $scope.tempCoupon = null;
                    $scope.$apply();
                }, 1000);
                // return;
                break;

            case 'mallCoupon':

                var channel = thisChannelCode;
                var coupon = new Object();
                obj.actionDesc = $scope.tempAction.typeValue + '-';
                obj.actionPurposeDesc = self.actionPurposeDesc;
                $scope.getCoupon(channel, $scope.tempAction.typeValue, coupon);
                setTimeout(function () {
                    if (!$scope.tempCoupon || null == $scope.tempCoupon || !$scope.tempCoupon.couponName || !$scope.tempCoupon.discount) {
                        obj = null;
                        return;
                    }
                    obj.actionDesc = obj.actionDesc + $scope.tempCoupon.couponName + "-" +
                        $scope.tempCoupon.couponTypeName + "-" + $scope.tempCoupon.discount+ "-" + $scope.tempCoupon.couponCount;
                    if (!$scope.currentActionGroup.actions) {
                        $scope.currentActionGroup.actions = new Array();
                    }
                    $scope.currentActionGroup.actions.push(obj);
                    // console.log("setTimeout nei actions: ", $scope.currentActionGroup.actions);
                    $scope.tempCoupon = null;
                    $scope.$apply();
                }, 1000);
                // return;
                break;
            case 'banner':
                obj.actionDesc = 'banner-' + $scope.getMessageTemplate($scope.tempAction.typeValue).templateName;
                break;
            case 'sms':
                obj.actionDesc = '短信-' + $scope.getMessageTemplate($scope.tempAction.typeValue).templateName;
                break;
            case 'note':
                obj.actionDesc = '站内信-' + $scope.getMessageTemplate($scope.tempAction.typeValue).templateName;
                break;
            case 'push':
                obj.actionDesc = '推送-' + $scope.getMessageTemplate($scope.tempAction.typeValue).templateName;
                break;
            default:
                obj.actionDesc = '其他-';
                break;
        }
        if ($scope.tempAction.type != 'coupon' && $scope.tempAction.type != 'newCoupon' && $scope.tempAction.type != 'mallCoupon') {
            if (!$scope.currentActionGroup.actions) {
                $scope.currentActionGroup.actions = new Array();
            }
            $scope.currentActionGroup.actions.push(obj);
            for (var i = 0; i < self.project.actionGroups.length; i++) {
                var id = 'useInformid' + i;
                var  count = 0;
                if(self.project.actionGroups[i].touchDateType == 'now'||self.project.actionGroups[i].touchDateType =='time'){
                    for (var j = 0; j <self.project.actionGroups[i].actions.length ; j++) {
                        if(self.project.actionGroups[i].actions[j].type == 'sms'){
                            count ++;
                            self.project.actionGroups[i].actionCount = count;
                            self.actionTypeSms  = "sms";
                            if(count > 1){
                                if($("#"+id)[0].checked == true){
                                    $("#"+id).prop("checked",false);
                                    self.project.actionGroups[i].useInform = '0';
                                }
                            }
                        }
                    }

                }
            }
        }

        $scope.tempAction = {};

    }



    //查询卡券信息
    //channel: QB WK SC
    $scope.getCoupon = function (channel, couponId, obj) {
        var param = new Object();
        if(channel=='1'){
            param.channel = 'QB';
        }else if(channel=='2'){
            param.channel = 'WK';
        }else if(channel=='6'){
            param.channel = 'SC';
        }else{
            param.channel = channel;
        }
        param.couponId = couponId;
        param.awardType=$scope.tempAction.type;
        var url = globalConfig.basePath + "/prize/getCouponName";
        var promise = $http.post(url, param);
        return promise.then(function (resut) {
            // var response = resut.data;
            // var total = response.otherData[0];
            // params.total(total);
            // return response.data;
            if (resut.data.code == '000') {
                // $scope.add.name = data.data.resp.couponName;
                //$scope.add.faceValue = data.data.resp.discount;
                // $scope.search.couponId=null;
                // $scope.search.prizeType=null;
                // $scope.search.channel=null;
                // alert("成功啦啦啦 卡券");
                // console.log("调commonjs 的查卡券方法返回: ", resut);
                $scope.tempCoupon = resut.data.resp;
                return resut.data.resp;
            }else{
                alert(resut.data.message);
            }
        });
    }

    //消息模板搜索
    $scope.listMessageTemplate = function (type) {
        // alert("listMessageTemplate");
        $scope.messageTemplateList = [];
        $scope.tempAction.typeValue = 0;
        if (!type) {
            return;
        }
        var paramObj = {};
        paramObj.pageNo = 1;
        paramObj.pageSize = 10000;
        paramObj.channelCode = $('#channelCode').text();
        paramObj.type = type;
        paramObj.statusType = 1; // 为有效的

        var url = globalConfig.basePath + "/smart_marketing/message/list";
        $http.post(url, paramObj).then(
            function (data) {
                // alert(data);
                // console.log("消息模板 list data:");
                // console.log(data);
                if (data.data.code == '000') {
                    $scope.messageTemplateList = data.data.resp.result;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询消息模板，请求失败了....");
            }
        );
    }

    /**
     * 隐藏与显示动作组内容
     */
    $scope.foldActionGroup = function (actionGroup) {
        actionGroup.fold = !actionGroup.fold;
    }

    /**
     * 在list中查找消息模板对象
     */
    $scope.getMessageTemplate = function (id) {
        // alert('get message temp');
        var target = {};
        $.each($scope.messageTemplateList, function (n, messageTemp) {
            if (messageTemp.id === id) {
                target = messageTemp;
                // console.log("ll getMessageTemp ", target);
                return target;
            }
        });
        return target;
    }

    /**
     * 删除action
     */
    $scope.deleteAction = function (actionGroup, action) {
        // alert("公共的删除动作 action0");
        self.actionTypeSms = "";
        var indexOf = actionGroup.actions.indexOf(action);
        if (confirm('确定要删除吗?')) {
            if (indexOf > -1) {
                actionGroup.actions.splice(indexOf, 1);
                actionGroup.actionCount = actionGroup.actionCount-1;
                for (var i = 0; i < self.project.actionGroups.length; i++) {
                    if(self.project.actionGroups[i].touchDateType == 'now'||self.project.actionGroups[i].touchDateType =='time'){
                        for (var j = 0; j <self.project.actionGroups[i].actions.length ; j++) {
                            if(self.project.actionGroups[i].actions[j].type == 'sms'){
                                self.actionTypeSms  = "sms";
                            }
                        }
                    }
                }
            }
        }
        for (var i = 0; i < self.project.actionGroups.length; i++) {
            if(self.project.actionGroups[i].touchDateType == 'now'||self.project.actionGroups[i].touchDateType =='time'){
                for (var j = 0; j <self.project.actionGroups[i].actions.length ; j++) {
                    if(self.project.actionGroups[i].actions[j].type == 'sms'){
                        self.actionTypeSms  = "sms";
                    }
                }
            }
        }
    }



    //查看消息模板
    $scope.checkTemplate = function (id) {
        $('#showCheck').show();
        $http.get(globalConfig.basePath + "/smart_marketing/message/check?id=" + id).success(function (callback) {
            $scope.banner = [];
            $scope.version = [];
            $scope.toupdate = {};
            if (callback.code == '000') {
                $scope.openDetail = callback.resp.data;
                $scope.tclist = callback.resp.data.touchContents;
                $scope.toupdate = {};
                for (var i = 0; i < $scope.tclist.length; i++) {

                    for (var j = 0; j < $scope.tclist[i].touchContent.length; j++) {
                        if ($scope.tclist[i].touchContent[j].touchKey == 'CONTENT') {
                            $scope.toupdate.content = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'NOTE_TYPE') {
                            $scope.toupdate.noteType = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'TITLE') {
                            $scope.toupdate.title = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'JUMP_TYPE') {
                            $scope.toupdate.jumptype = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'PAGE_URL') {
                            $scope.toupdate.pageurl = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'PAGE_TYPE') {
                            $scope.toupdate.pagetype = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'POSITION') {
                            $scope.toupdate.position = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'LAST_TIME') {
                            $scope.toupdate.lasttime = $scope.tclist[i].touchContent[j].touchValue;
                        }
                        if ($scope.tclist[i].touchContent[j].touchKey == 'SHOW_TYPE') {
                            $scope.toupdate.showtype = $scope.tclist[i].touchContent[j].touchValue;
                        }

                        if (i >= 0) {
                            if ($scope.tclist[i].touchContent[j].touchKey == 'BANNER_URL') {
                                $scope.banner[i] = $scope.tclist[i].touchContent[j].touchValue;
                                // $scope.banner[i] = $scope.tclist[i].touchContent[j].touchValue;
                            }
                            if ($scope.tclist[i].touchContent[j].touchKey == 'VERSION') {
                                $scope.version[i] = $scope.tclist[i].touchContent[j].touchValue;
                            }
                        }
                    }
                }
                $scope.selectPage1($scope.openDetail.channelCode, $scope.toupdate.pagetype, $scope.toupdate.jumptype, $scope.toupdate.pageurl);
                // console.log($scope.banner);
                $scope.toupdate.lasttime = parseFloat($scope.toupdate.lasttime).toFixed(2);
                // console.log($scope.toupdate, "查看touchContents里面数据");
                // console.log($scope.banner);
                // console.log($scope.version);
                // console.log(callback);
            }
        }), function errorCallback(response) {
            console.error(response);
            alert("查看消息模板异常");
        }
    }

    /**
     * 查询用户分组中用户数
     */
    $scope.countUserGroupUser = function(actionGroup,channelCode) {
        if (!actionGroup || !actionGroup.userGroupId) {
            alert("请选择用户分组");
            return;
        }
        var url = globalConfig.basePath + "/smart_marketing/initiative/user_group/count_user?id=" + actionGroup.userGroupId + "&channelCode=" +channelCode;
        $http.get(url).then(
            function (data) {
                // console.log("用户分组 查用户数 返回：", data);
                if (data.data.code == '000') {
                    actionGroup.userGroupUserCount = data.data.resp.rosterCount;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询消息模板，请求失败了....");
            }
        );
    }

    /**
     * 查询用户分组中用户数
     */
    $scope.countUserGroupUserUpdate = function(actionGroup,channelCode,index) {
        var userGroupId;
        if(actionGroup.userGroupType == 'RULE_LIST'){
            userGroupId = $('#ruleList'+index).val().substring($('#ruleList'+index).val().indexOf(':')+1);
        }else{
            userGroupId = $('#ruleGroup'+index).val().substring($('#ruleGroup'+index).val().indexOf(':')+1);
        }
        if (!userGroupId || userGroupId == '') {
            alert("请选择用户分组");
            return;
        }
        var url = globalConfig.basePath + "/smart_marketing/initiative/user_group/count_user?id=" + userGroupId + "&channelCode=" +channelCode;
        $http.get(url).then(
            function (data) {
                console.log("用户分组 查用户数 返回：", data);
                if (data.data.code == '000') {
                    $('#userGroupUserCount'+index).html(data.data.resp.rosterCount);
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询消息模板，请求失败了....");
            }
        );
    }

    //查询一级页
    $scope.selectPage1 = function (channelCode, pagetype, jumptype, pageurl) {
        if (channelCode != null) {
            var type;
            if (channelCode == 'WK') {
                type = "wk_protogenesis_page_one";
            }

            else {
                type = "qb_protogenesis_page_one";
            }
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
            ).success(function (data) {
                for (var i = 0; i < data.resp.result.length; i++) {
                    if (data.resp.result[i].value == pagetype) {
                        $scope.toupdate.pagetype = data.resp.result[i].label;
                    }
                }
            });
            if (jumptype == "3") {
                if (channelCode == 'WK') {
                    type = "wk_protogenesis_page_two";
                }
                else {
                    type = "qb_protogenesis_page_two";
                }
                $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + pagetype
                ).success(function (data) {
                    for (var i = 0; i < data.resp.result.length; i++) {
                        if (data.resp.result[i].value == pageurl) {
                            $scope.toupdate.pageurl = data.resp.result[i].label;
                        }
                    }
                });
            }
        }
    }

    /**
     * 营销目的
     */
    $scope.getPurposeName = function (purpose) {
        switch (purpose) {
            case '01':
                return '邀请好友出借';
            case '02':
                return '首投（排除邀请）';
            case '03':
                return '续期';
            case '04':
                return '流失召回';
            case '99':
                return '其他';
            default:
                return '';
        }
    }

    //执行状态（1：待执行 2：执行中 3：完成：4：暂停 5：停止）
    $scope.getRunStatusName = function (runStatus) {
        switch (runStatus) {
            case 1:
                return '待执行';
            case 2:
                return '执行中';
            case 3:
                return '完成';
            case 4:
                return '暂停';
            case 5:
                return '停止';
            default:
                return runStatus;
        }
    }

}

// ============================

function inputDateTime() {
    var args = arguments;
    // console.log("inputDateTime 方法 args：");
    // console.log(args);
    setTimeout(function () {
        Array.from(args).forEach(function (id) {
            laydate({elem: '#' + id, istime: true, format: 'YYYY-mm-DD hh:mm:ss', event: 'click'});
        });
    }, 500);
}

function inputTime() {
    var args = arguments;
    setTimeout(function () {
        Array.from(args).forEach(function (id) {
            laydate({elem: '#' + id, istime: true, format: 'YYYY-mm-DD hh:mm:ss', event: 'click'});
        });
    }, 500);
}

function getCoupon2(channel, couponId, obj) {
    // alert("a lala ");
    var param = new Object();
    param.channel = channel;
    param.couponId = couponId;
    param.awardType=$scope.tempAction.type;
    var url = globalConfig.basePath + "/prize/getCouponName";

    $.ajax({
        type: "post",
        contentType: "application/json;charset=utf-8",
        url: url,
        data: JSON.stringify({channel: channel, couponId: couponId,awardType:obj.type}),
        async: false,
        dataType: "json",
        success: function (data) {
            // console.log("ajax 调卡券接口返回：", data);
            if (data.code == '000') {
                // console.log("查卡券 返回为 000");
                var coupon = data.resp;
                // console.log("ajax 内 coupon 返回 ", coupon);
                // $scope.tempCoupon = coupon;
                obj = coupon;
            } else {
                alert(data.message);
            }
        }
    });
}










