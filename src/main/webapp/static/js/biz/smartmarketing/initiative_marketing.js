'use strict';
var App = angular.module('initiative_marketing', [], angular.noop);
App.controller('initiative_marketing_controller', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.viewPage = 'query';
    self.search = {};
    self.search.channelCode = 'QB';
    self.userRosterTypeFlag=true;
    //查询执行记录参数对象
    self.searchExe = {};
    self.searchExe.pageSize = 10;
    self.search.projectName = '';
    self.search.configType = 1;
    self.add = {};
    self.continuationTypeInfo = "";
    self.loginName = globalConfig.loginName;
    self.editpositions = '';
    //添加的触达动作（短信、站内信、积分等）
    self.actions = [];
    self.userQuery = {};
    self.checkProjectObj = {};
    self.updateProjectObj = {};
    // 当前操作的动作组
    self.currentActionGroup = {};
    self.tempAction = {};
    self.touchReport = {};
    self.stopOrRestore = {};
    self.UserEmail = globalConfig.email;


    // self.inputTime("createTimeBe", "createTimeEnd");

    smartCommon($scope, $http);
    // 消息模板查看相关
    $scope.openDetail = {};
    $scope.tclist = '';
    // 消息模板查看相关 end



    /**
     * 拉取审核人列表
     */
    $scope.pullAuditPersons = function (menu) {
        if(menu!=null){
            var url = globalConfig.basePath + "/otc/memberEnjoy/listAuditPerson?menu=" + menu;
        }else{
            var url = globalConfig.basePath + "/otc/memberEnjoy/listAuditPerson?menu=intelligent_operation_audit";
        }
        $http.get(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
                $scope.auditPersonList = callback.data.resp;
                // console.log("审核人list，，，", self.auditPersonList);
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


    //查询
    self.list = function (pageNum) {
        $('#excuteLog').hide();
        // alert("线下活动查询list方法");
        self.viewPage = 'query';
        inputDateTime('createTimeStart', 'createTimeEnd');
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        self.search.createTimeStart = $("#createTimeStart").val();
        self.search.createTimeEnd = $("#createTimeEnd").val();

        // console.log('查询列表的参数对象，，，', self.search);
        var url = globalConfig.basePath + "/smart_marketing/initiative/list";
        $http.post(url, self.search).then(
            function (data) {
                // alert(data);
                // console.log("主动营销 list data:");
                // console.log(data);
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    var initiativeList = data.data.resp.result;
                    if (initiativeList){
                    var len = initiativeList.length;

                        for (var i = 0; i < len; i++) {
                            if (initiativeList[i]) {
                                initiativeList[i].auditUserId = initiativeList[i].auditUserId + '';
                            }
                        }
                    }
                    self.initiativeList = initiativeList
                    // console.log("主动营销list处理后的: ", self.initiativeList);
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    //重置
    self.reset = function () {
        // self.search={};
        self.search.productChannel = "QB";//理财渠道
        self.search.pageSize = "5";
        self.search.pageNo = 1;
        self.search.auditStatus = "";
        self.search.projectName = "";
        self.search.createTimeStart = "";
        self.search.createTimeEnd = "";
        self.search.runStatus = "";
        $('#createTimeStart').val("");
        $('#createTimeEnd').val("");
    }

    self.addChannelCode = function () {

        self.add = {};
        self.add.channelCode = "WK";
        $("#addChannelShow").show();
    }

    self.hideAddChannelShow = function () {
        $("#addChannelShow").hide();
    }

    //创建页面弹出展示
    self.addInitiative = function () {
        self.hideAddChannelShow();
        // self.viewPage = 'add';

    }

    self.closeExcuteLog = function(){
        self.viewPage = 'check';
    }

    //查看执行记录
    self.listRunLog = function (pageNo) {
        self.viewPage = 'excute';
        // alert(pageNo + projectId);
        // projectId = 55;
        // pageNo = 1;
        if (!pageNo) {
            pageNo = 1;
            self.searchExe.pageNo = pageNo;
        } else {
            if (pageNo > self.searchExe.pageCount && self.searchExe.pageCount > 0) {
                self.searchExe.pageNo = self.searchExe.pageCount;
            } else {
                self.searchExe.pageNo = pageNo;
            }
        }
        // alert(self.searchExe.pageNo);
        // console.log(self.searchExe,"执行记录入参");
        // console.log(self.checkProjectObj.id,"项目id");
        var url = globalConfig.basePath + "/smart_marketing/initiative/execute_log?pageNo=" + pageNo + "&pageSize="+self.searchExe.pageSize+"&projectId=" + self.checkProjectObj.id;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            // console.log("执行记录查询。。。");
            // console.log(data);
            if (data.data.code == '000') {
                if (data.data.resp.currentPage) {
                    self.searchExe.pageNo = data.data.resp.currentPage;
                } else {
                    self.searchExe.pageNo = 1;
                }
                self.searchExe.pageSize = data.data.resp.pageSize + "";
                self.searchExe.pageCount = data.data.resp.pageCount;
                self.searchExe.totalRowSize = data.data.resp.totalRowSize;
                self.executeLogList = data.data.resp.result;
                $('#showRunLog').show();
            } else {
                alert(data.data.message);
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("查询失败了....");
        });
    }


    //查看执行记录确定和取消
    self.listRunLogOkAndNo = function () {
        $('#showRunLog').hide();
    }

    //用户查询小工具弹出窗
    self.showUserQuery = function () {
        $('#showUserQuery').show();
        self.userQuery.pageNo = 1;
        self.userQuery.pageCount = 0;
        $('#x1').text(0);
        $('#x2').text(0);

    }

    //隐藏
    self.hideUserQuery = function () {
        $('#showUserQuery').hide();
    }


    /**
     * 用户查询小工具
     *
     * @param pageNo
     * @param projectId
     */
    self.listUserQuery = function (pageNo) {
        if(!self.userQuery.mobile&&!self.userQuery.userId){
            alert("必须输入一个条件!");
            return;
        }
        // alert(pageNo + projectId);
        // pageNo = 1;
        if (!pageNo) {
            pageNo = 1;
            self.userQuery.pageNo = pageNo;
        } else {
            if (pageNo > self.userQuery.pageCount && self.userQuery.pageCount > 0) {
                self.userQuery.pageNo = self.userQuery.pageCount;
            } else {
                self.userQuery.pageNo = pageNo;
            }
        }
        self.userQuery.pageSize = 5;
        // console.log(self.userQuery);
        var url = globalConfig.basePath + "/smart_marketing/initiative/user_query";
        $http.post(url, self.userQuery).then(function successCallback(data) {
            // console.log("用户查询小工具。。。");
            // console.log(data);
            if (data.data.code == '000') {
                if (data.data.resp.currentPage) {
                    self.userQuery.pageNo = data.data.resp.currentPage;
                } else {
                    self.userQuery.pageNo = 1;
                }
                self.userQuery.pageSize = data.data.resp.pageSize;
                self.userQuery.pageCount = data.data.resp.pageCount;
                self.userQuery.totalRowSize = data.data.resp.totalRowSize;
                self.userQueryList = data.data.resp.result;
            } else {
                alert(data.data.message);
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("查询失败了....");
        });
    }


    self.isSelected = function (id) {
        if (self.continuationTypeInfo) {
            var versions = self.continuationTypeInfo.split(",");
            for (var i = 0; i < versions.length; i++) {
                if (id.length == versions[i].length && versions[i].indexOf(id) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

    self.getUserNameList = function (id) {
        var target = {};

        if (self.ruleGroup) {
            var ruleGroupLen = self.ruleGroup.length;
            for (var i = 0; i < ruleGroupLen; i++) {
                if (self.ruleGroup[i].rosterId == id) {
                    target = self.ruleGroup[i];
                    return target;
                }
            }
        }
        if (self.ruleList) {
            var ruleListLen = self.ruleList.length;
            for (var i = 0; i < ruleListLen; i++) {
                if (self.ruleList[i].rosterId == id) {
                    target = self.ruleList[i];
                    return target;
                }
            }
        }
        return target;
    }

    //确认修改
    self.updateCommit = function () {
        if (!self.updateProjectObj.update.projectName){
            alert("请填写项目名称!");
            return;
        }
        //审核人
        if (!self.updateProjectObj.update.auditUserId) {
            alert("请选择审核人！");
            return;
        }
        if (!self.updateProjectObj.update.validTime){
            alert("统计有效期不能为空!");
            return;
        }
        if (self.channelCode!='SF' && self.channelCode!='SC' && !self.updateProjectObj.update.productType){
            alert("产品类型不能为空!");
            return;
        }

        self.updateProjectObj.update.projectId = self.updateProjectObj.update.id;
        var url = globalConfig.basePath + "/smart_marketing/initiative";

        // console.log(JSON.stringify(self.updateProjectObj.update));
        for (var i =0;i<self.updateProjectObj.update.actionGroups.length;i++){
            self.updateProjectObj.update.actionGroups[i].endTime = $('#'+"endTime"+(i+1)).val();
            self.updateProjectObj.update.actionGroups[i].runTime = $('#'+"runTime"+(i+1)).val();
            var actionGroupName = "营销动作组" + (i + 1);
            if (!self.updateProjectObj.update.actionGroups[i].userGroupType) {
                alert(actionGroupName + "，请添加名单");
                return;
            } else if (self.updateProjectObj.update.actionGroups[i].userGroupType == 'RULE_GROUP') {
                var ruleGroup = document.getElementById("ruleGroup" + i);
                var ruleGroupId = ruleGroup.options[ruleGroup.selectedIndex].value;
                self.updateProjectObj.update.actionGroups[i].userGroupId = ruleGroupId;
            } else if (self.updateProjectObj.update.actionGroups[i].userGroupType == 'RULE_LIST') {
                var ruleList = document.getElementById("ruleList" + i);
                var ruleListId = ruleList.options[ruleList.selectedIndex].value;
                self.updateProjectObj.update.actionGroups[i].userGroupId = ruleListId;
            }
            if (!self.updateProjectObj.update.actionGroups[i].percent) {
                alert(actionGroupName + "，请添加达到多少百分比");
                return;
            }
            if (self.updateProjectObj.update.actionGroups[i].userGroupType == 'RULE_LIST'){
                self.updateProjectObj.update.actionGroups[i].userGroupId = Number($('#'+'ruleList'+i).val().toString().split(":")[1]);
            }
            if (self.updateProjectObj.update.actionGroups[i].userGroupType == 'RULE_GROUP'){
                self.updateProjectObj.update.actionGroups[i].userGroupId = Number($('#'+'ruleGroup'+i).val().toString().split(":")[1]);

            }
            self.updateProjectObj.update.actionGroups[i].userGroupName = self.getUserNameList(self.updateProjectObj.update.actionGroups[i].userGroupId).rosterName;

        }

        // console.log(self.updateProjectObj.update,"要修改的对象");
        var actionGroupsArray=self.updateProjectObj.update.actionGroups;
        for(var i=0;i<actionGroupsArray.length;i++){
            if(actionGroupsArray[i].touchDateType!="now"){
                if(actionGroupsArray[i].touchDateType=="time"){
                    if(!actionGroupsArray[i].runTime){
                        alert(actionGroupsArray[i].actionGroupName + "，请添加日期");
                        return;
                    }
                }else {
                    if(!actionGroupsArray[i].runTime  || !actionGroupsArray[i].endTime){
                        alert(actionGroupsArray[i].actionGroupName + "，请添加时间范围");
                        return;
                    }
                }
                if(actionGroupsArray[i].touchDateType=="realtime"){
                    if(!actionGroupsArray[i].limitDay) {
                        alert(actionGroupsArray[i].actionGroupName + "，请添加限制配置自然日");
                        return;
                    }else if(!actionGroupsArray[i].limitCount){
                        alert(actionGroupsArray[i].actionGroupName + "，请添加限制配置次数");
                        return;
                    }else if(actionGroupsArray[i].limitDay<=0){
                        alert(actionGroupsArray[i].actionGroupName + "，限制配置自然日不能小于等于0");
                        return;
                    }else if(actionGroupsArray[i].limitCount<=0){
                        alert(actionGroupsArray[i].actionGroupName + "，限制配置次数不能小于等于0");
                        return;
                    }
                }
            }
        }
        $http.put(url, self.updateProjectObj.update).then(
            function (data) {
                alert(data.data.message);
                if (data.data.code == '000') {
                    self.list(1);
                }
            }, function (data) {
                alert("请求失败了....");
                self.list(1);
            }
        );
    }

    //取消修改
    self.updateCancel = function () {
        $('#showUpdate').hide();
        // self.updateBankQuota = {};
        // self.reset();
        // self.loading();
        self.list(1);
    }



    /**
     * 查看触达报告
     */
    self.lookTouchReport = function(executeInformation){
        // console.log(executeInformation,"执行记录信息");
         self.touchReport =  executeInformation;
         self.recordId = executeInformation.recordId;
         self.report = 1;
         //调用触达统计详情接口进行查询
        var url = globalConfig.basePath+"/smart_marketing/initiative/touchDetail?actionTeamId="+executeInformation.recordId;
         $http.get(url).then(
             function (data) {
                 // console.log(data,"触达统计详情");
                 if (data.data.code=='000'){

                     self.touchDetailInfo = data.data.resp.data.touchList;
                 }else {
                     alert("接口返回失败!");
                 }
                 
             }
             )

    }


    //默认查询主动营销
    self.loading = function () {

        // outPut(5);
        // self.search.pageSize = "5";
        self.search.configType = "1";
        // self.list(1);
        setTimeout(function () {
            var channelCode = $('#projectChannelCodeDiv').text();
            if (channelCode) {
                self.search.channelCode = channelCode;
            }
            var pageNo = $('#projectPageNoDiv').text();
            if (pageNo) {
                self.search.pageNo = pageNo;
            }else{
                pageNo = 1;
                self.search.pageNo =1;
            }

            self.search.projectName = $('#projectProjectNameDiv').text();
            self.search.runStatus = $('#projectRunStatusDiv').text();
            self.search.auditStatus = $('#projectAuditStatusDiv').text();
            self.search.createTimeStart = $('#projectCreateTimeStartDiv').text();
            self.search.createTimeEnd = $('#projectCreateTimeEndDiv').text();
            self.search.pageSize = $('#projectPageSizeDiv').text();


            self.list(pageNo);
        }, 500);
        setTimeout(function () {
            var id = $('#projectIdDiv').text();
            if (id > 0) {
                self.checkProject(id);
            }
        }, 1000);
    }
    self.loading();


    // self.getTypeVersionList(0, "", 1);

// **************************审核********************************
    /**
     * 审批
     */
    self.audit = function (record) {
        //审核状态（1: 待审核 2：审核通过 3：审核不通过）
        if (record.auditStatus != 1) {
            alert('只能对待审核状态的数据进行操作');
            return;
        }
        self.auditStatus = "2";
        $('#auditShow').show();
        self.confirmRecord = angular.copy(record);
        // 	self.auditStatus = "2";
        self.auditDescription = "";

    };
    // 确认审核 点确定即调此方法
    self.confirm = function () {
        self.confirmRecord.auditStatus = self.auditStatus;
        // self.confirmRecord.auditDescription = self.auditDescription;
        var obj = new Object();
        obj.projectId = self.confirmRecord.id;
        obj.auditStatus = self.confirmRecord.auditStatus;
        obj.auditPerson = globalConfig.name;
        obj.auditorId = globalConfig.loginName;
        obj.auditDescription = $('#auditStatus option:selected').text();

        var url = globalConfig.basePath + "/smart_marketing/initiative/audit";
        $http.post(url, obj).then(function successCallback(callback) {
            var code = callback.data.resp.split(",");
            for (var i = 0; i < code.length; i++) {
                if (code[0] == '0000') {
                    $('.take-start-box').hide();
                    alert(callback.data.message);
                    $scope.list(1);
                    break;
                } else {
                    // console.error(callback.data);
                    alert(code[1]);
                    $scope.list(1);
                    break;
                }
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };


    /**
     * 暂停营销项目组
     * @param recordId
     * @param type
     */
    self.stopProjectGroup = function(actionTeamId){

        self.stopOrRestore.operate = 1;
        self.stopOrRestore.projectTeamId = actionTeamId;
        self.stopOrRestore.updateUserId = globalConfig.loginName;
        self.stopOrRestore.updateUserName = globalConfig.name;
        $('#zt').show();
    }

    /**
     * 恢复营销项目组
     * @param recordId
     * @param type
     */
    self.restoreProjectGroup = function(actionTeamId){

        self.stopOrRestore.operate = 2;
        self.stopOrRestore.projectTeamId = actionTeamId;
        self.stopOrRestore.updateUserId = globalConfig.loginName;
        self.stopOrRestore.updateUserName = globalConfig.name;
        $('#hf').show();
    }

    self.commitStopOrRestore = function(){
        var url = globalConfig.basePath+"/smart_marketing/initiative/stopOrRestore";
        // console.log(self.stopOrRestore,"修改状态操作");
        $http.post(url,self.stopOrRestore).then(
            function (data) {
                if (data.data.code == '000'){
                    alert("操作成功!");
                    $('#zt').hide();
                    $('#hf').hide();
                    self.checkProject(self.stopOrRestore.projectId);
                } else {
                   alert(data.data.message);
                    $('#zt').hide();
                    $('#hf').hide();
                }

            },function errorCallback() {
                alert("请求失败!");
            }
        )
    }

    $scope.addAction = function (actionType, actionGroup) {
        // alert("添加动作");
        $scope.tempAction = {};
        $scope.messageTemplateList = [];
        if (actionGroup.actions && actionGroup.actions.length >= 20) {
            alert("最多可添加20个动作");
            return;
        }
        $scope.tempAction = {};
        self.tempAction.isUpdate = 1;
        // console.log(actionGroup, "addAction --- actionGroup");
        if (actionType == 'award') {
            $('.add-award-Model').show();
        } if(actionType =='informSms'){
            if($('#useInformid')[0].checked == false){
                $('#useInformid').prop("checked",false);
                actionGroup.useInform = '0';
                $scope.pullAuditPersons();
            }else{
                $scope.smsShow();
                if(self.count > 1){
                    $('#useInformid').prop("checked",false);
                    actionGroup.useInform = '0';
                    $scope.pullAuditPersons();
                    alert("通知类短信每次只可发送1条短信");
                }else{
                    $('#informSmshide').show();
                    $('#useInformid').prop("checked",true);
                    actionGroup.useInform = '1';
                    var menu = "aio_marketing_audit_sms"
                    $scope.pullAuditPersons(menu);
                }
            }
        }if(actionType =='message') {
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

    $scope.divhide = function(){
        $('#informSmshide').hide();
    }
    $scope.divhide();

    self.addActionGroup = function () {
        if (self.updateProjectObj.update.actionGroups.length >= 10) {
            alert("最多只能添加10个");
            return;
        }
        var actionGroupsLength = self.updateProjectObj.update.actionGroups.length;
        var lastActionGroup = self.updateProjectObj.update.actionGroups[actionGroupsLength - 1];
        lastActionGroup.runTime = $("#runTime" + actionGroupsLength).val();
        lastActionGroup.endTime = $("#endTime" + actionGroupsLength).val();
        lastActionGroup.time = $("#time" + actionGroupsLength).val();
        var actionGroupDefault = new Object();
        actionGroupDefault.actionGroupName = "营销动作组"+(actionGroupsLength+1);
        actionGroupDefault.removal = '1';
        actionGroupDefault.continueSend = '1';
        actionGroupDefault.touchDateType = 'now';
        actionGroupDefault.blackListLimit = '2';
        actionGroupDefault.mailAddress = self.UserEmail;
        actionGroupDefault.fold = false;
        self.updateProjectObj.update.actionGroups.push(actionGroupDefault);
        var nextSerial = actionGroupsLength + 1;
        inputDateTime('runTime' + nextSerial, 'endTime' + nextSerial);
        inputTime('time' + nextSerial);
        // console.log("动作组集合list，，，", self.updateProjectObj.update.actionGroups);
    }



    /**
     * 删除动作组
     *
     * @param actionGroup
     */
    self.deleteActionGroup = function (actionGroup) {
        if (self.project.actionGroups.length <= 1) {
            alert('仅有一个，不可删除');
            return;
        }
        var indexOf = self.project.actionGroups.indexOf(actionGroup);
        self.actionType = "";
        if(confirm('确定要删除吗?')) {
            if (indexOf > -1) {
                self.project.actionGroups.splice(indexOf, 1);
                self.smsShow();
            }
        }
    }

    $scope.exportFailedListData = function (recordId,type) {
        // alert("导出。。。" + self.exportObj.key);
      /*  var key = self.exportObj.key;
        if (key.length < 4 || key.length > 8) {
            alert("请正确输入附件密码长度,长度为4~8");
            return false;
        }*/
        if (!type || type==undefined){
            var url = globalConfig.basePath + "/smart_marketing/initiative/exportFailureList?recordId=" + recordId;
        } else {
            var url = globalConfig.basePath + "/smart_marketing/initiative/exportFailureList?recordId=" + self.recordId+"&type="+type;
        }

        window.open(url);
    };





    /**
     * 执行添加动作（奖励、消息模板）
     */
    // self.addActionCommit = function () {
    //     self.actions.push({typeValue: 5, actionDesc: "动作描述积分", type: "jf"});
    // }

    /**
     * 改状态
     *
     * @param id
     * @param operate 1暂定，2恢复，3终止
     */
    self.updateStatus = function (id, operate) {
        var reminder = '确定要执行此操作吗？';
        if (operate == 1) {
            reminder = '是否确认暂停该项目，暂停将中断执行和正在发放的项目';
        } else if (operate == 2) {
            reminder = '是否恢复暂停项目的执行？';
        } else if (operate == 3) {
            reminder = '是否确认停止该项目，停止后不可恢复执行';
        }
        var obj = new Object();
        obj.projectId = id;
        obj.operate = operate;
        obj.updateUserId = globalConfig.loginName;
        obj.updateUserName = globalConfig.name;
        if (confirm(reminder)) {
            // alert('lalala 已执行');
            var url = globalConfig.basePath + "/smart_marketing/initiative/status";
            $http.put(url, obj).then(function successCallback(data) {
                if (data.data.code == '000') {
                    alert("操作成功");
                    self.list(1);
                } else {
                    alert("操作失败");
                }
            }, function errorCallback(data) {
                alert("请求失败！")
            });
        }
    }

    //-----------------------------

    /**
     * 查看 和修改的返回
     *
     * @param x
     */
    self.checkProject = function (id) {

        self.stopOrRestore.projectId = id;
        // alert('check 。。。');
        var url = globalConfig.basePath + "/smart_marketing/initiative/detail?id=" + id;
        $http.post(url, self.search).then(
            function (data) {
                // alert(data);
                // console.log("主动营销详情 data:");
                // console.log(data);
                if (data.data.code == '000') {
                    $scope.pullAuditPersons();
                    data.data.resp.auditUserId = data.data.resp.auditUserId + "";
                    self.checkProjectObj = data.data.resp;
                    var arrayObject=self.checkProjectObj.actionGroups;
                    for(var j=0;j<arrayObject.length;j++){
                        self.listUserNameList2(arrayObject[j].userGroupType);
                    }
                    for (var i = 0;i < self.checkProjectObj.actionGroups.length;i++){
                        for (var y = 0;y < self.checkProjectObj.actionGroups[i].actions.length;y++){
                            if (self.checkProjectObj.actionGroups[i].actions[y].type == 'jf'){
                                $.ajax({
                                    url:globalConfig.basePath+"/smart_marketing/initiative/getIntegralId?jfRuleId="+self.checkProjectObj.actionGroups[i].actions[y].jfRuleId,
                                    type:"get",
                                    dataType:"json",
                                    contentType:"text/html;charset=utf-8",
                                    data:self.checkProjectObj.actionGroups[i].actions[y].jfRuleId,
                                    async: false,
                                    success:function (data) {
                                        // console.log("校验数据返回",data);
                                        if (data.code=='000' && data.resp.code=='2000'){

                                                self.checkProjectObj.actionGroups[i].actions[y].actionDesc  = '积分-'+self.checkProjectObj.actionGroups[i].actions[y].typeValue+'-剩余额度:'+data.resp.data.availablePoint;

                                        }
                                    }

                                })

                            }
                        }
                    }

                    self.updateProjectObj.update = self.checkProjectObj;
                    // console.log(self.updateProjectObj,"回显的数据对象");
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
        // console.log(self.checkProjectObj, 'checkProjectObj ...');
        setTimeout(function () {
            self.listUserNameList("RULE_GROUP",self.checkProjectObj.channelCode);
            self.listUserNameList("RULE_LIST",self.checkProjectObj.channelCode);
        }, 2000);
        self.viewPage = 'check';
    }

    /**
     * 修改
     *
     * @param id
     */
    self.updateProject = function (id,channelCode) {
        if (channelCode == 'WK') {
            self.channelCodeName = '悟空理财';
        } else if (channelCode == 'QB') {
            self.channelCodeName = '玖富钱包';
        } else if (channelCode == 'SC') {
            self.channelCodeName = '玖富商城';
        }
        self.checkProject(id);
        // self.listUserNameList("QB", "RULE_GROUP");
        self.pullAuditPersons();
        self.channelCode = channelCode;
        self.viewPage = 'update';
        setTimeout(function () {
            // console.log("修改得到的回显对象：",self.updateProjectObj);
            if (self.updateProjectObj.update && self.updateProjectObj.update.actionGroups) {
                var length = self.updateProjectObj.update.actionGroups.length;
                for (var i = 0; i < length; i++) {
                    // console.log("for i " + i);
                    var inputIdSerial = i + 1;
                    inputDateTime('runTime' + inputIdSerial, 'endTime' + inputIdSerial);
                    // inputTime('time' + inputIdSerial);
                }
            }
            self.smsShow();
            if(self.useInformValue == '1'){
                $("#useInformid").prop("checked",true);
            }
        }, 1000);

    }

    self.actionType = "";
    self.smsShow = function(){
        self.count = 0;
        for (var i = 0; i < self.updateProjectObj.update.actionGroups.length; i++) {
            if(self.updateProjectObj.update.actionGroups[i].touchDateType =="now"||self.updateProjectObj.update.actionGroups[i].touchDateType =="time") {
                for (var j = 0; j < self.updateProjectObj.update.actionGroups[i].actions.length; j++) {
                    if(self.updateProjectObj.update.actionGroups[i].actions[j].type == "sms"){
                        self.count ++;
                        self.actionType = "sms";
                        self.useInformValue = 1;
                    }
                }
            }
        }
    }

    $scope.deleteActionUpdate = function(action){
        if (self.updateProjectObj.update.actionGroups.length==1){
            alert("必须保留一个动作组!");
            return;
        }
        var indexOf = self.updateProjectObj.update.actionGroups.indexOf(action);
        if (confirm('确定要删除吗?')){
            if (indexOf > -1) {
                self.updateProjectObj.update.actionGroups.splice(indexOf, 1);
                self.smsShow();
            }
        }
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
        paramObj.channelCode = self.channelCode;
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
    $scope.deleteAction = function (actionGroup, action) {
        // alert("公共的删除动作 action0");
        self.actionType = "";
        var indexOf = actionGroup.actions.indexOf(action);
        if (confirm('确定要删除吗?')) {
            if (indexOf > -1) {
                actionGroup.actions.splice(indexOf, 1);
                self.smsShow();
            }
        }
        self.smsShow();
    }


    self.userRosterType=function(userRosterType,userGroupId){
        var flag=false;
        userRosterType.actionGroup.userRosterTypeFlag=true;
        if (userRosterType.actionGroup.userGroupType == 'RULE_GROUP') {
            var ruleGroupArray=self.ruleGroup;
            for(var i=0;i<ruleGroupArray.length;i++){
                if(ruleGroupArray[i].dataType==2 && ruleGroupArray[i].rosterId==userGroupId){
                    flag=true;
                    break;
                }else if(ruleGroupArray[i].dataType==1 && ruleGroupArray[i].rosterId==userGroupId){
                    flag=false;
                    break;
                }
            }
        }
        if(userRosterType.actionGroup.userGroupType == 'RULE_GROUP'){
            var actionArray=self.checkProjectObj.actionGroups;
            for(var i=0;i<actionArray.length;i++){
                if(actionArray[i].userGroupId==userGroupId){
                    if(!flag){
                        actionArray[i].touchDateType="now";
                        userRosterType.actionGroup.userRosterTypeFlag=false;
                        break;
                    }
                }
            }
        }
    };

    /**
     * 查用户分组名单数据
     */
    self.listUserNameList = function (userGroupType) {
        // alert("查用户分组名单数据, channel: " + channelCode);
        if(userGroupType==""){
            self.userRosterTypeFlag=true;
        }
        var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + self.checkProjectObj.channelCode + "&rosterType=" + userGroupType;
        $http.post(url).then(
            function (data) {
                // console.log("ll 查用户分组名单数据 ", data);
                if (data.data.code == '000') {
                    if (userGroupType == 'RULE_GROUP') {
                        self.ruleGroup = data.data.resp;
                        // console.log("ruleGroup赋值后: ", self.ruleGroup);
                    } else {
                        self.ruleList = data.data.resp;
                        // console.log("ruleList赋值后：", self.ruleList);
                    }
                    $('.fuzzy_search').select2();
                    // self.userNameListList = data.data.resp;
                    // console.log("userNameListList 赋值后。。", self.userNameListList);
                    // if(userGroupType=="RULE_LIST"){
                    //     var actionArray=self.checkProjectObj.actionGroups;
                    //     for(var i=0;i<actionArray.length;i++) {
                    //         if(actionArray[i].userGroupType=="RULE_LIST" && actionArray[i].touchDateType=="realtime"){
                    //             actionArray[i].touchDateType="now"
                    //         }
                    //     }
                    // }
                    // if(userGroupType=="RULE_GROUP"){
                    //     var actionArray=self.checkProjectObj.actionGroups;
                    //     for(var i=0;i<actionArray.length;i++){
                    //         var ruleGroupArray=self.ruleGroup;
                    //         for(var j=0;j<ruleGroupArray.length;j++){
                    //             if(ruleGroupArray[j].dataType==2 && ruleGroupArray[j].rosterId==actionArray[i].userGroupId){
                    //                 actionArray[i].touchDateType="realtime";
                    //                 self.userRosterTypeFlag=true;
                    //                 break;
                    //             }else if(ruleGroupArray[j].dataType==1 && ruleGroupArray[j].rosterId==actionArray[i].userGroupId){
                    //                 actionArray[i].touchDateType="now";
                    //                 self.userRosterTypeFlag=false;
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询用户分组名单数据，请求失败了 lala ....");
            }
        );
    }

    self.listUserNameList2 = function (userGroupType) {
        // alert("查用户分组名单数据, channel: " + channelCode);
        if(userGroupType==""){
            self.userRosterTypeFlag=true;
        }
        var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + self.checkProjectObj.channelCode + "&rosterType=" + userGroupType;
        $http.post(url).then(
            function (data) {
                // console.log("ll 查用户分组名单数据 ", data);
                if (data.data.code == '000') {
                    if (userGroupType == 'RULE_GROUP') {
                        self.ruleGroup = data.data.resp;
                        // console.log("ruleGroup赋值后: ", self.ruleGroup);
                    } else {
                        self.ruleList = data.data.resp;
                        // console.log("ruleList赋值后：", self.ruleList);
                    }
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询用户分组名单数据，请求失败了 lala ....");
            }
        );
    }


    //执行状态（1：待执行 2：执行中 3：完成：4：暂停 5：停止）
    self.getRunStatusName = function (runStatus) {
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

    //审核状态（1: 待审核 2：审核通过 3：审核不通过）
    self.getAuditStatusName = function (auditStatus) {
        switch (auditStatus) {
            case 1:
                return '待审核';
            case 2:
                return '审核通过';
            case 3:
                return '审核不通过';
            default:
                return '';
        }
    }

    self.toCheckProject = function (id) {
        self.hideUserQuery();
        // $('#showUserQuery').hide();
        self.checkProject(id);
    }

    self.closeUpdateTemplate = function(){
        self.tempAction = {};
        $('.add-message-Model').hide()
    }

    self.getAioMqRunStatusName = function (runStatus) {
        switch (runStatus) {
            case 0:
                return '未执行';
            case 1:
                return '接受名单数据';
            case 2:
                return '接受名单成功';
            case 4:
                return '接受名单数据失败';
            case 7:
                return '分包数据结束';
            case 13:
                return '触达结束';
            default:
                return runStatus;
        }
    }
    
    
    

}]);

