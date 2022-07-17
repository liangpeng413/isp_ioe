'use strict';

var App = angular.module('noticeConfig', [], angular.noop);
App.controller('noticeConfigController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};
    self.search.channel = 'wk';
    self.loginName = globalConfig.loginName;
    //信息类型查询
    self.queryCustomType = function () {
        var url = globalConfig.basePath + "/calendar/queryCustomType?channel="+self.search.channel;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                   self.customList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    self.queryCustomType();

    self.pageQueryCustomType = function(pageNum) {
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        self.search.pageSize=10;
        self.search.startTime=$('#stickStartTime').val();
        self.search.endTime =$('#stickEndTime').val();
        var url = globalConfig.basePath + "/calendar/pageQueryCustomType";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.curPageNumber) {
                        self.search.pageNo = data.data.resp.curPageNumber;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageCount = data.data.resp.pageSize;
                    self.search.perPageRowSize = data.data.resp.perPageRowSize + "";
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.customTypeList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.pageQueryCustomType(1);

    /**重置*/
    self.reset = function () {
        var pageNo = 1;
        var pageCount = 0;
        var perPageRowSize = 10;
        var totalRowSize =0;
        var pageSize = 10;
        self.search = {};
        self.search.channel = 'qb';
        self.search.pageNo = pageNo;
        self.search.pageCount = pageCount;
        self.search.perPageRowSize = perPageRowSize;
        self.search.totalRowSize = totalRowSize;
        self.search.pageSize = pageSize;
    }

    self.addShow = function () {
        $('#showAddNoticePopup').show();
        self.showAddOrUpType = 0;
        self.noticeParam = {};
        self.noticeParam.channel='qb';
        self.completeAll();
        self.queryMsgType(self.noticeParam.channel);
        self.pullAuditPersons();
    }

    //添加修改查询信息类型
    self.queryMsgType = function (channel) {
        var url = globalConfig.basePath + "/calendar/queryCustomType?channel="+channel;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.addOrUpCustomList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
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
            $("#black").attr('disabled','disabled');

            self.noticeParam.whiteMemberListName= "NO_RULE"
            self.strategyReload();
            $('#userNameLikeSearch').hide();
            self.noticeParam.blackMemberListName= "NO_RULE"
            self.blackStrategyReload();
            $('#userNameLikeBlackSearch').hide();
        }else {
            $("#white").removeAttr('disabled','disabled');
            $("#black").removeAttr('disabled','disabled');

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
        }
    }
    //黑名单选中事件 type 0 添加
    self.blackClick = function(type){
        if(type == 0){
            if(!$('#black').prop("checked")){
                self.blackStrategyReload();
                $('#userNameLikeBlackSearch').hide();
            }
        }
    }

    //取消添加或修改
    self.cancelAddOrUp = function(){
        self.showAddOrUpType = 0;
        $('#showAddNoticePopup').hide();
        self.noticeParam = {};
        self.noticeParam.channel='qb';
        self.completeAll();
    }

    //确定添加或者修改
    self.addOrUpCommit = function(){
        if(!self.noticeParam.channel || self.noticeParam.channel ==''){
            alert("请选择渠道");
            return;
        }
        if(!self.noticeParam.eventTypeId || self.noticeParam.eventTypeId ==''){
            alert("请选择信息类型");
            return;
        }
        if(!self.noticeParam.eventTitle || self.noticeParam.eventTitle ==''){
            alert("请填写标题");
            return;
        }
        if(!self.noticeParam.eventDesc || self.noticeParam.eventDesc ==''){
            alert("请填写描述文案");
            return;
        }
        if(!self.noticeParam.eventLabel || self.noticeParam.eventLabel ==''){
            alert("请填写标签");
            return;
        }
        if(!self.noticeParam.redirectUrl || self.noticeParam.redirectUrl ==''){
            alert("请填写链接地址");
            return;
        }
        $scope.noticeParam.beginTime = $('#stickStartTime2').val()+"";
        $scope.noticeParam.endTime = $('#stickEndTime2').val()+"";
        if(!self.noticeParam.beginTime || self.noticeParam.beginTime ==''){
            alert("请填写开始时间");
            return;
        }
        if(!self.noticeParam.endTime || self.noticeParam.endTime ==''){
            alert("请填写结束时间");
            return;
        }
        if(new Date(self.noticeParam.beginTime).getTime()>new Date(self.noticeParam.endTime).getTime()){
            alert("开始时间不能大于结束时间");
            return;
        }
        //名单选择
        var all = $("#all").prop("checked");
        var white = $("#white").prop("checked");
        var black = $("#black").prop("checked");
        var whiteId =  $('#memberId').val();
        var blackId = $('#memberBlackId').val();
        if(all){
            self.noticeParam.showType = 0;
        }else{
            if (white && black) {
                self.noticeParam.showType = 3;// 同时选中黑白名单
                if (!whiteId || whiteId == ''|| whiteId == '0'||whiteId.indexOf("?")!=-1) {
                    alert("请选择白名单列表");
                    return;
                }else{
                    self.noticeParam.whiteId=whiteId;
                }

                if (!blackId  ||blackId == ''||blackId == '0'||blackId.indexOf("?")!=-1) {
                    alert("请选择黑名单列表");
                    return;
                }else{
                    self.noticeParam.blackId = blackId;
                }
            }else{
                if (white) {
                    self.noticeParam.showType = 1;
                    if (!whiteId || whiteId == '' || whiteId == '0'|| whiteId.indexOf("?")!=-1) {
                        alert("请选择白名单列表");
                        return;
                    }else{
                        self.noticeParam.whiteId=whiteId;
                    }
                } else if (black) {
                    self.noticeParam.showType = 2;
                    if (!blackId || blackId == '' || blackId == '0'|| blackId.indexOf("?")!=-1) {
                        alert("请选择黑名单列表");
                        return;
                    }else{
                        self.noticeParam.blackId = blackId;
                    }
                } else {
                    alert('请选择展示人群');
                    return;
                }
            }
        }

        var auditPerson = self.noticeParam.auditPerson;
        if (!self.noticeParam.auditPerson) {
            alert("审核人不能为空");
            return;
        } else {
            //预审核人工号
            self.noticeParam.auditNo = self.noticeParam.auditPerson.no;
            //预审核人
            self.noticeParam.auditPerson = self.noticeParam.auditPerson.name;
        }

        var url = globalConfig.basePath + "/calendar/addOrUpNoticeConfig";
        $http.post(url, self.noticeParam).then(
            function (data) {
                if(data.data.code=='000'){
                    alert("操作成功")
                    $('#showAddNoticePopup').hide();
                    self.showAddOrUpType=0;
                    self.noticeParam = {};
                    self.noticeParam.channel='qb';
                    self.completeAll();
                    self.pullAuditPersons();
                    self.pageQueryCustomType(1);
                }else{
                    alert(data.data.message)
                }
            }, function (response) {
                alert("请求失败了....");
            }
        );

    }

    /**
     * 拉取审核人列表
     */
    self.pullAuditPersons = function(){
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

    //查看
    self.checkOrUp = function(param,type){
        self.showAddOrUpType = type;
        $('#showAddNoticePopup').show();
        self.noticeParam = {};
        self.queryMsgType(param.channel);
        self.pullAuditPersons();
        var data = angular.copy(param);
        self.noticeParam = param;
        if( param.whiteId!=null){
            self.noticeParam.whiteId = param.whiteId.toString();
        }
        if(param.blackId!=null){
            self.noticeParam.blackId = param.blackId.toString();
        }
        self.noticeParam.eventTypeId=param.eventTypeId+"";
        if(type==2){
            self.noticeParam.auditPerson = null;
        }
        //展示人群全部
        if(self.noticeParam.showType == 0){
            $('#all').prop("checked",true);
            $('#white').prop("checked",false);
            $('#black').prop("checked",false);

            self.strategyReload();
            setTimeout(function () {
                self.noticeParam.whiteMemberListName=data.whiteMemberListName;
                self.noticeParam.whiteId = null;
                $('#userNameLikeSearch').hide();
            },500)

            self.blackStrategyReload();
            setTimeout(function () {
                self.noticeParam.blackMemberListName=data.blackMemberListName;
                self.noticeParam.blackId = null;
                $('#userNameLikeBlackSearch').hide();
            },500)
        }else if(self.noticeParam.showType == 1){
            $('#all').prop("checked",false);
            $('#white').prop("checked",true);
            $('#black').prop("checked",false);

            //修改名单那类型查询
            self.strategyReload();
            setTimeout(function () {
                self.noticeParam.whiteMemberListName=data.whiteMemberListName;
                self.noticeParam.whiteId = data.whiteId.toString();
            },500)

            self.blackStrategyReload();
            setTimeout(function () {
                self.noticeParam.blackMemberListName=data.blackMemberListName;
                self.noticeParam.blackId = null;
                $('#userNameLikeBlackSearch').hide();
            },500)
        }else if(self.noticeParam.showType == 2){
            $('#all').prop("checked",false);
            $('#white').prop("checked",false);
            $('#black').prop("checked",true);

            self.strategyReload();
            setTimeout(function () {
                self.noticeParam.whiteMemberListName=data.whiteMemberListName;
                self.noticeParam.whiteId = null;
                $('#userNameLikeSearch').hide();
            },500)

            self.blackStrategyReload();
            setTimeout(function () {
                self.noticeParam.blackMemberListName=data.blackMemberListName;
                self.noticeParam.blackId = data.blackId.toString();
            },500)
        }else if(self.noticeParam.showType == 3){
            $('#all').prop("checked",false);
            $('#white').prop("checked",true);
            $('#black').prop("checked",true);

            self.strategyReload();
            setTimeout(function () {
                self.noticeParam.whiteMemberListName=data.whiteMemberListName;
                self.noticeParam.whiteId = data.whiteId.toString();
            },500)
            self.blackStrategyReload();
            setTimeout(function () {
                self.noticeParam.blackMemberListName=data.blackMemberListName;
                self.noticeParam.blackId = data.blackId.toString();
            },500)
        }

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
                    self.noticeParam.strategyList = data.data.resp;
                    if(self.showAddOrUpType==0){
                        self.noticeParam.whiteMemberListName= "NO_RULE"
                    }
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
        if(self.noticeParam.channel=='wk'||self.noticeParam.channel=='jq'){
            channelCode='WK';
        }else if(self.noticeParam.channel=='qb'){
            channelCode='QB';
        }
        if(channelCode == null){
            alert("请选择渠道");
            return;
        }
        if (self.noticeParam.whiteMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
            self.noticeParam.whiteId='0';
            $('#memberId').val('0')
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.noticeParam.whiteMemberListName
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
                    self.noticeParam.blackStrategyList = data.data.resp;
                    if(self.showAddOrUpType==0){
                        self.noticeParam.blackMemberListName= "NO_RULE";
                    }
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
        if(self.noticeParam.channel=='wk' ||self.noticeParam.channel=='jq'){
            channelCode='WK';
        }else if(self.noticeParam.channel=='qb'){
            channelCode='QB';
        }
        if(channelCode == null){
            alert("请选择渠道");
            return;
        }
        if (self.noticeParam.blackMemberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeBlackSearch').hide();
            self.noticeParam.blackId='0';
            $('#memberBlackId').val('0');
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.noticeParam.blackMemberListName
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

    //生效失效
    self.validOperation = function (type,id) {
        self.effectType = type;
        self.effectId = id;
        $('#showValidPopup').show();
    }

    //生效失效取消
    self.cancelValid = function () {
        $('#showValidPopup').hide();
        self.effectType=null;
        self.effectId=null;
    }

    //确定生效失效
    self.commitValid = function (type,id) {
        var url = globalConfig.basePath + "/calendar/eventNoticeValid?id="+id+"&type="+type;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功！")
                    $('#showValidPopup').hide();
                    self.effectType=null;
                    self.effectId=null;
                    self.pageQueryCustomType(1);
                } else {
                    alert(data.data.message)
                    $('#showValidPopup').hide();
                    self.effectType=null;
                    self.effectId=null;
                    self.pageQueryCustomType(1);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    //审核显示
    self.auditShowButton = function (id) {
        self.auditStatus = '1';
        self.auditId=id;
        $('#auditShow').show();
    }

    // 审核
    self.confirm = function(){
        self.confirmRecord={};
        self.confirmRecord.id=self.auditId
        self.confirmRecord.auditStatus = self.auditStatus
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath+"/calendar/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $('#auditShow').hide();
                alert("操作成功");
                $scope.pageQueryCustomType(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("请求失败了....");
        });
    };
    


}])

