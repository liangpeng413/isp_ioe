'use strict';

var App = angular.module('callTask', [], angular.noop);
App.controller('callTaskController', ['$scope', '$http', function ($scope, $http) {
    var self =$scope;
    self.search={};
    /**分页查询*/
    self.pageQueryCallTask = function(pageNum) {
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
        var url = globalConfig.basePath + "/call_callTask/pageList";
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
                    self.callTasktList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.pageQueryCallTask(1);

    /**重置*/
    self.reset = function () {
        var pageNo = 1;
        var pageCount = 0;
        var perPageRowSize = 10;
        var totalRowSize =0;
        var pageSize = 10;
        self.search={};
        self.search.pageNo = pageNo;
        self.search.pageCount = pageCount;
        self.search.perPageRowSize = perPageRowSize;
        self.search.totalRowSize = totalRowSize;
        self.search.pageSize = pageSize;
    }

    /**删除显示*/
    self.del={};
    self.delButton = function (id) {
        $('#delShow').show();
        self.del.id = id;
    }

    /**删除*/
    self.delSubmit = function () {
        var id=self.del.id;
        $http.get(globalConfig.basePath + "/call_callTask/del?id="+id)
            .then(
                function (data) {
                    if (data.data.code == '000') {
                        self.del={};
                        self.pageQueryCallTask(1);
                        $('#delShow').hide();
                        alert("操作成功");
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
    }

    /** 取消删除*/
    self.closeDel = function () {
        self.del={};
        $('#delShow').hide();
    }

    self.add={};

    /**添加显示*/
    self.showAddTab = function () {
        self.showDiv = 0;
        self.add={};
        self.add.platform='1';
        $(".checkOne").each(function(){
            $(this).attr("checked",false);
        });
        $("#all").attr("checked",false);
        self.add.memberListName= "NO_RULE"
        $('#userNameLikeSearch').hide();
        $('#showAdd').show();
    }


    /**确认添加*/
    self.saveTask = function () {
        var keys = "";
        $(".checkOne").each(function() {
            if (this.checked == true) {
                keys += $(this).val()+",";
            }
        })
        if(''==self.add.taskName||null==self.add.taskName){
            alert("请填写任务名称");
            return false;
        }
        // 获取序号对应的id
        if(''==keys||null==keys){
            alert("请选择R3外呼系统字段");
            return false;
        }
        if(''==self.add.platform||null==self.add.platform){
            alert("请选择渠道");
            return false;
        }
        self.add.lastSendTime = $('#stickStartTime').val();
        if(''==self.add.lastSendTime||null==self.add.lastSendTime){
            alert("请选择分发日期");
            return false;
        }else{
            var currentDate = new Date();
            var inputDate = new Date(self.add.lastSendTime);

            if(inputDate<currentDate){
                alert("输入时间需大于当前时间");
                return false;
            }else{
                var dateDay=(inputDate.getTime()-currentDate.getTime())/(1000*60*60*24);
                if(dateDay>10){
                    alert("输入时间不可大于当前时间10天")
                    return false;
                }
            }
        }
        self.add.chooseR3Option = keys;
        if(''==self.add.chooseR3Option||null==self.add.chooseR3Option){
            alert("请选择R3外呼系统字段");
            return false;
        }
       if(self.add.chooseR3Option.indexOf("user_phone") == -1 ){
           alert("手机号为必选字段");
           return false;
       }
         var memberListName = self.add.memberListName;//用户策略类型
        if(memberListName!="NO_RULE"){
            var memberListId = $('#memberId').val();//用户名单
            if(memberListId == '? undefined:undefined ?'||memberListId==""||memberListId=="null"||memberListId==0||memberListId==null||memberListId=='0'){
                alert("用户名单为空");
                return;
            }
        }else{
            alert("请选择用户名单");
            return;
        }

        var lastSendTime = $('#stickStartTime').val();
        self.add.lastSendTime = lastSendTime;
        self.add.memberListName = memberListName;
        self.add.memberListId = parseInt(memberListId);
        var url = globalConfig.basePath + "/call_callTask/saveTask";
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add={};
                    self.add.platform="1";
                    self.pageQueryCallTask(1);
                    $('#showAdd').hide();
                    alert("操作成功");
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**关闭添加*/
    self.closeAddWav = function () {
        self.add={};
        self.add.platform='1';
        self.add.memberListName='NO_RULE';
        $(".checkOne").each(function(){
            $(this).attr("checked",false);
        });
        $('#showAdd').hide();
    }

    /**修改显示*/
    self.updateTaskShow = function(param){
        self.showDiv = 1;
        self.add={};
        self.add.id=param.id;
        self.add.platform=param.platform+'';
        self.add.taskName=param.taskName;
        self.add.memberListName = param.memberListName;
        self.add.lastSendTime = param.lastSendTime;
        self.add.chooseR3Option = param.chooseR3Option;
        self.add.recommendTalk = param.recommendTalk;
        self.add.taskStatus = param.taskStatus;
        self.add.remark = param.remark;
        $(".checkOne").each(function(){
            $(this).attr("checked",false);
        });
        if(self.add.chooseR3Option != null){
            var chooseR3Option = [];
            chooseR3Option = self.add.chooseR3Option.split(",");
            angular.forEach(chooseR3Option,function(choose){
                $('#'+choose).prop("checked",true);
            })
            if(chooseR3Option.length==22){
                $("#all").prop("checked",true);
            }else{
                $("#all").prop("checked",false);
            }
        }
        self.findChannelGroups();
        self.add.memberListId = param.memberListId+"";
        $('#showAdd').show();
    }

    /**
     * 确认修改
     * @returns {boolean}
     */
    self.updaeTask = function () {
        var keys = "";
        $(".checkOne").each(function() {
            if (this.checked == true) {
                keys += $(this).val()+",";
            }
        })
        // 获取序号对应的id
        if(''==keys||null==keys){
            alert("请选择R3外呼系统字段");
            return false;
        }
        if(''==self.add.platform||null==self.add.platform){
            alert("请选择渠道");
            return false;
        }
        if(''==self.add.taskName||null==self.add.taskName){
            alert("任务名称不能为空");
            return false;
        }
        self.add.lastSendTime = $('#stickStartTime').val();
        if(''==self.add.lastSendTime||null==self.add.lastSendTime){
            alert("请选择分发日期");
            return false;
        }else{
            var currentDate = new Date();
            var inputDate = new Date(self.add.lastSendTime);

            if(inputDate<currentDate){
                alert("输入时间需大于当前时间");
                return false;
            }else{
                var dateDay=(inputDate.getTime()-currentDate.getTime())/(1000*60*60*24);
                if(dateDay>10){
                    alert("输入时间不可大于当前时间10天")
                    return false;
                }
            }
        }
        self.add.chooseR3Option = keys;
        if(''==self.add.chooseR3Option||null==self.add.chooseR3Option){
            alert("请选择R3外呼系统字段");
            return false;
        }
        if(self.add.chooseR3Option.indexOf("user_phone") == -1 ){
            alert("手机号为必选字段");
            return false;
        }
        var memberListName = self.add.memberListName;//用户策略类型
        if(memberListName!="NO_RULE"){
            var memberListId =  $('#memberId').val();//用户名单
            if(memberListId == '? undefined:undefined ?'||memberListId==""||memberListId=="null"||memberListId==0||memberListId==null||memberListId=='0'){
                alert("用户名单为空");
                return;
            }
        }else{
            alert("请选择用户名单");
            return;
        }
        self.add.chooseR3Option = keys;
        var lastSendTime = $('#stickStartTime').val();
        self.add.lastSendTime = lastSendTime;
        self.add.memberListName = memberListName;
        self.add.memberListId = parseInt(memberListId);
        var url = globalConfig.basePath + "/call_callTask/updateTask";
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add={};
                    self.pageQueryCallTask(1);
                    $('#showAdd').hide();
                    alert("操作成功");
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**用户策略类型初始化*/
    self.strategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url, self.strate).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyList = data.data.resp;
                    self.add.memberListName= "NO_RULE"
                    self.findChannelGroups();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.strategyReload();

    /** 查询渠道现有分组*/
    self.findChannelGroups = function () {
        var channelCode;
        if(self.add.platform==1){
            channelCode='WK';
        }else if(self.add.platform==2){
            channelCode='QB';
        }else if(self.add.platform==3){
            channelCode='SF';
        }
        if(channelCode == null){
            channelCode='WK';
        }
        if (self.add.memberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.add.memberListName
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

    self.changePlatformValue = function () {
        self.findChannelGroups();
    }

    self.changeFindChannelGroups = function () {
        self.findChannelGroups();
    }

    self.currentTime = function (inputTime) {
        // var xhr = null;
        // if(window.XMLHttpRequest){
        //     xhr = new window.XMLHttpRequest();
        // }else{ // ie
        //     xhr = new ActiveObject("Microsoft")
        // }
        // xhr.open("GET","/",false)//false不可变
        // xhr.send(null);
        // var date = xhr.getResponseHeader("Date");
        //获取当前系统时间
        var currentDate = new Date();
        var inputDate = new Date(inputTime);

        if(inputDate<currentDate){
            return false;
        }else{
            var dateDay=(inputDate.getTime()-currentDate.getTime())/(1000*60*60*24);
            if(dateDay>10){
                return false;
            }
            return true;
        }
    }

}])

