'use strict';
var App = angular.module('frequentQuestionApp', [], angular.noop);
App.controller('frequentQuestionController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};
    self.add = {};
    self.update = {};
    self.detail = {};
    self.feedback = {};
    self.singleton = {};
    self.search.pageSize = 10;
    self.search.pageNum = 1;
    $scope.search.productChannel = '6';
    $scope.search.createTimeSort = '1';
    $(function () {
        self.queryList(1);
    })

    /**
     * 查询列表
     * @param pageNum
     */
    self.queryList = function (pageNum) {
        $('#allList').prop("checked",false);
        if (self.search.pageCount && pageNum > self.search.pageCount) {
            alert("已经是最后一页");
            return;
        }
        if (pageNum < 1) {
            alert("已经是第一页");
            return;
        }
        $scope.search.sortKey = 'create_time';
        if($scope.search.createTimeSort=='2'){
            $scope.search.sortDirection = 'asc';
        }else{
            $scope.search.sortDirection = 'desc';
        }
        self.search.pageNum = pageNum;
        var url = globalConfig.basePath + "/feedback/queryFeedbackList";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNum = data.data.resp.currentPage;
                    } else {
                        self.search.pageNum = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.feedbackList = data.data.resp.result;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 重置
     */
    self.reset = function () {
        self.search.keyword = '';
        self.search.showStatus = '';
    };

    /**
     * 新增按钮
     */
    self.addFeedback = function () {
        $scope.add.productChannel = '6';
        $scope.add.typeName = '';
        var html = '<div class="start-a">' +
            '                <p>&nbsp;&nbsp;问题选项:</p>\n' +
            '                <input style="width:400px;" type="text" placeholder="选项1(非必填)" name="addQuestionOption" maxlength="100">' +
            '            </div>' +
            '            <br>' +
            '            <div class="start-a">' +
            '                <p></p>' +
            '                <input style="width:400px;" type="text" placeholder="选项2" name="addQuestionOption" maxlength="100">' +
            '            </div>' +
            '            <br>' +
            '            <div class="start-a">' +
            '                <p></p>' +
            '                <input style="width:400px;" type="text" placeholder="选项3" name="addQuestionOption" maxlength="100">' +
            '            </div>';
        $('#addQuestions').html(html);
        $('#addFeedback').show();
    };

    /**
     * 保存按钮
     */
    self.saveBtn = function (flag) {
        if(flag == '1'){
            self.confirmContent = "确认提交？";
            self.confirmFlag = "1";
        }else{
            self.confirmContent = "确认修改？";
            self.confirmFlag = "2";
        }
        $("#confirm-modal").show();
    };

    /**
     * 确认提交
     */
    self.confirmCommit = function(){
        var confirmFlag = $('#confirmFlag').val();
        if(confirmFlag == '1'){
            self.saveFeedback();
        }else{
            self.updateFeedback();
        }
    };

    /**
     * 取消按钮
     */
    self.cancelBtn = function (flag) {
        if(flag == '1'){
            $('#addFeedback').hide();
        }else{
            $('#updateFeedback').hide();
        }
    };

    /**
     * 取消提交
     */
    self.confirmCancel = function(){
        self.confirmContent = "";
        $("#confirm-modal").hide();
    };

    /**
     * 添加意见反馈
     */
    self.saveFeedback = function () {
        if (self.add.productChannel == undefined || self.add.productChannel == '') {
            alert("渠道不能为空");
            return;
        }
        if (self.add.typeName == undefined || self.add.typeName == '') {
            alert("反馈类型不能为空");
            return;
        }
        self.add.questionOptions = [];
        $("input[name='addQuestionOption']").each(function(i,item){
            if(item.value != undefined && item.value != ''){
                self.add.questionOptions.push(item.value);
            }
        });
        var url = globalConfig.basePath + "/feedback/saveFeedback";
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    $("#confirm-modal").hide();
                    $('#addFeedback').hide();
                    self.queryList(1);
                } else {
                    $("#confirm-modal").hide();
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
                $("#confirm-modal").hide();
            }
        );
    };

    /**
     * 修改意见反馈
     */
    self.updateFeedback = function () {
        if (self.update.productChannel == undefined || self.update.productChannel == '') {
            alert("渠道不能为空");
            return;
        }
        if (self.update.typeName == undefined || self.update.typeName == '') {
            alert("反馈类型不能为空");
            return;
        }

        self.update.questionOptions = [];
        $("input[name='modifyQuestionOption']").each(function(i,item){
            if(item.value != undefined && item.value != ''){
                self.update.questionOptions.push(item.value);
            }
        });
        var url = globalConfig.basePath + "/feedback/updateFeedback";
        $http.post(url, self.update).then(
            function (data) {
                if (data.data.code == '000') {
                    $("#confirm-modal").hide();
                    $('#updateFeedback').hide();
                    self.queryList(1);
                } else {
                    $("#confirm-modal").hide();
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
                $("#confirm-modal").hide();
            }
        );
    };

    /**
     * 继续添加按钮
     */
    self.keepAddQuestion = function (flag,name) {
        var size = $("input[name='"+name+"']").length;
        var placeholder = '选项'+(size+1);
        var html = "<br><div class='start-a'><p></p>&nbsp;<input style='width:400px;' type='text' placeholder='"+placeholder+"' name='"+name+"' maxlength='100'></div>";
        if(flag == '1'){
            $("#addQuestions").append(html);
        }else{
            $("#updateQuestions").append(html);
        }
    };

    //排序
    $scope.sortByCreateTime = function(){
        $scope.queryList(1);
    }

    /**
     * 修改按钮
     */
    self.editFeedback = function (item) {
        var initHtml = '<div class="start-a">' +
            '                <p>&nbsp;&nbsp;问题选项:</p>' +
            '                <input style="width:400px;" type="text" id="modifyQuestionOption1" placeholder="选项1(非必填)" name="modifyQuestionOption" maxlength="100">' +
            '            </div>' +
            '            <br>' +
            '            <div class="start-a">' +
            '                <p></p>' +
            '                <input style="width:400px;" type="text" id="modifyQuestionOption2" placeholder="选项2" name="modifyQuestionOption" maxlength="100">' +
            '            </div>' +
            '            <br>' +
            '            <div class="start-a">' +
            '                <p></p>' +
            '                <input style="width:400px;" type="text" id="modifyQuestionOption3" placeholder="选项3" name="modifyQuestionOption" maxlength="100">' +
            '            </div>';
        self.update.productChannel = item.productChannel + "";
        self.update.typeName = item.typeName;
        self.update.id = item.id;
        $('#updateQuestions').html(initHtml);
        for(var i=0;i<item.questionOptionList.length;i++){
            if(i<3){
                $('#modifyQuestionOption'+(i+1)).val(item.questionOptionList[i].optionName);
            }else{
                var placeholder = '选项'+(i+1);
                var html = "<br><div class='start-a'><p></p>&nbsp;<input style='width:400px;' type='text' placeholder='"+placeholder+"' value='"+item.questionOptionList[i].optionName+"' name='modifyQuestionOption'  maxlength='100'></div>";
                $('#updateQuestions').append(html);
            }
        }
        $('#updateFeedback').show();
    };

    /**
     * 查看详情
     */
    self.showFeedback = function (item) {
        var initHtml = '';
        self.detail.productChannel = item.productChannel + "";
        self.detail.typeName = item.typeName;
        self.detail.operator = item.operator;
        if(item.questionOptionList.length>0){
            initHtml = '<tr style="height: 45px;">' +
                '            <td style="text-align: right;" width="70px" valign="top">问题选项：</td>' +
                '            <td valign="top">1.'+item.questionOptionList[0].optionName+'<td></tr>';
        }else{
            initHtml = '<tr style="height: 45px;">' +
                '            <td style="text-align: right;" width="70px" valign="top">问题选项：</td>' +
                '            <td></td></tr>';
        }
        $('#showQuestions').html(initHtml);
        for(var i=1;i<item.questionOptionList.length;i++){
            var html = "<tr style='height: 45px;'><td style='text-align: right;' width='70px'></td><td valign='top'>"+(i+1)+"."+item.questionOptionList[i].optionName+"<td></tr>";
            $('#showQuestions').append(html);
        }
        $('#feedbackDetail').show();
    };

    //批量启用/停用展示
    self.batchAble = function(status){
        var ids = '';
        var flag = false;
        //批量启用
        if(status=='1'){
            $("input[name='feedbackManage']").each(function(){
                if($(this).is(":checked"))
                {
                    var obj = $(this).val();
                    var arry = obj.split('-');
                    var id = arry[0];
                    var showStatus = arry[1];
                    if(showStatus!=0){
                        flag = true;
                        return false;
                    }
                    ids += id+',';
                }
            });

            if(flag){
                alert("有启用状态的记录请重新选择！");
                return;
            }

            if(ids==''){
                alert("请选择记录！");
                return;
            }
            self.feedback.ids= ids;
            self.feedback.tip= '确定启用？';
            self.feedback.flag= '1';
        }else{
            $("input[name='feedbackManage']").each(function(){
                if($(this).is(":checked"))
                {
                    var obj = $(this).val();
                    var arry = obj.split('-');
                    var id = arry[0];
                    var showStatus = arry[1];
                    if(showStatus!=1){
                        flag = true;
                        return false;
                    }
                    ids += id+',';
                }
            });

            if(flag){
                alert("有停用状态的记录请重新选择！");
                return;
            }

            if(ids==''){
                alert("请选择记录！");
                return;
            }
            self.feedback.ids= ids;
            self.feedback.tip= '确定停用？';
            self.feedback.flag= '0';
        }
        $('#batchShow').show();
    };

    //批量确认
    self.confirmBatch = function(){
        var ids = $('#feedbackIds').val();
        var flag = $('#feedbackFlag').val();
        if(flag == '2'){//批量删除
            $http.post(globalConfig.basePath + "/feedback/batchDelete", {
                ids: ids}).then(function (result) {
                if(result.data.code=='000'){
                    alert("操作成功！");
                    $scope.queryList(1);
                }else{
                    alert(result.data.message);
                }
                $('#batchShow').hide();
            });
        }else{//批量启用/停用
            $http.post(globalConfig.basePath + "/feedback/batchAble", {
                ids: ids,flag: flag}).then(function (result) {
                if(result.data.code=='000'){
                    alert("操作成功！");
                    $scope.queryList(1);
                }else{
                    alert(result.data.message);
                }
                $('#batchShow').hide();
            });
        }
    }

    //全选
    self.allListClick = function(){
        if($('#allList').is(":checked")){
            $("input[name='feedbackManage']").each(function(){
                $(this).prop("checked",true);
            });
        }else{
            $("input[name='feedbackManage']").each(function(){
                $(this).prop("checked",false);
            });
        }
    }

    //批量删除展示
    self.batchDelete = function(){
        var ids = '';
        var flag = false;
        $("input[name='feedbackManage']").each(function(){
            if($(this).is(":checked"))
            {
                var obj = $(this).val();
                var arry = obj.split('-');
                var id = arry[0];
                var showStatus = arry[1];
                if(showStatus!=0){
                    flag = true;
                    return false;
                }
                ids += id+',';
            }
        });

        if(flag){
            alert("当前类型是在启用状态，暂不能进行删除操作!");
            return;
        }

        if(ids==''){
            alert("请选择记录！");
            return;
        }
        self.feedback.ids= ids;
        self.feedback.tip= '确定删除？';
        self.feedback.flag= '2';
        $('#batchShow').show();
    };

    //停用/启用
    self.updateShowStatus = function(id,showStatus){
        if(showStatus=='0'){
            self.singleton.tip= '确定启用？';
            self.singleton.status = '1';
        }else{
            self.singleton.tip= '确定停用？';
            self.singleton.status = '0';
        }
        self.singleton.id= id;
        self.singleton.flag= '1';
        $('#singletonShow').show();
    }

    //删除
    self.deleteById = function(item){
        self.singleton.tip= '确定删除？';
        self.singleton.id= item.id;
        self.singleton.flag= '2';
        self.singleton.showStatus= item.showStatus;
        $('#singletonShow').show();
    }

    //单个确认
    self.confirmSingle = function(){
        var id = $('#singletonId').val();
        var flag = $('#singletonFlag').val();
        var status = $('#singletonStatus').val();
        if(flag == '2'){//删除
            if (self.singleton.showStatus == '1') {
                alert("当前类型是在启用状态，暂不能进行删除操作!");
                return;
            } else {
                $http.post(globalConfig.basePath + "/feedback/batchDelete", {
                    ids: id}).then(function (result) {
                    if(result.data.code=='000'){
                        // alert("操作成功！");
                        $scope.queryList(1);
                    }else{
                        alert(result.data.message);
                    }
                    $('#singletonShow').hide();
                });
            }
        }else{//启用/停用
            $http.post(globalConfig.basePath + "/feedback/updateShowStatus", {
                id: id,showStatus: status}).then(function (result) {
                if(result.data.code=='000'){
                    // alert("操作成功！");
                    $scope.queryList(1);
                }else{
                    alert(result.data.message);
                }
                $('#singletonShow').hide();
            });
        }
    }
}])