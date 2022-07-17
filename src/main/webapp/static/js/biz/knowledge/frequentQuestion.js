'use strict';
var App = angular.module('frequentQuestionApp', [], angular.noop);
App.controller('frequentQuestionController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.channelList = [
        // {"channelId": 0, "channelName": "悟空理财APP"},
        {"channelId": 6, "channelName": "玖富商城APP"}
    ];
    self.typeOneList = [];
    self.typeTwoList = [];
    self.updateLogList = [];
    self.moveList = [];
    self.search = {};
    self.add = {};
    self.add.id = null;
    self.questionList = [];
    self.auditorList = [];
    self.search.sortStatus = '0';
    self.search.pageSize = 10;
    self.search.pageNum = 1;
    self.confirmContent = "";
    self.confirmType = "";
    self.confirmId = 0;
    self.currentShowStatus = "";
    $(function () {
        self.queryList(1);
    })

    /**
     * 查询列表
     * @param pageNum
     */
    self.queryList = function (pageNum) {
        if (self.search.pageCount && pageNum > self.search.pageCount) {
            alert("已经是最后一页")
            return;
        }
        if (pageNum < 1) {
            alert("已经是第一页")
            return;
        }
        if (self.search.sortStatus == '1') {
            self.search.sortKey = "create_time";
            self.search.sortDirection = "ASC";
        } else {
            self.search.sortKey = "create_time";
            self.search.sortDirection = "DESC";
        }
        self.search.pageNum = pageNum;
        var url = globalConfig.basePath + "/knowledge/queryQuestionList";
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
                    self.questionList = data.data.resp.result;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 查询一级分类
     */
    self.getTypeOne = function (productChannel) {
        var type = null;
        if (productChannel == '6') {
            type = "sys_question_type_one_shop";
        } else if (productChannel == '0') {
            type = "sys_question_type_one_wk";
        }
        $http.get(globalConfig.basePath + "/rDict/getVersionByType?type=" + type
        ).success(function (data) {
            self.typeOneList = data.resp.result;
        })
    };

    /**
     * 查询二级分类
     */
    self.getTypeTwo = function (productChannel, typeOne) {
        var type = 'sys_question_classify_two';
        var url = globalConfig.basePath + "/rDict/getPositions?productChannel=" + productChannel + "&productVersion=" + typeOne + "&loginStatus=2&resourceType=" + type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            self.typeTwoList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取位置列表失败了....");
        });
    };

    /**
     * 重置
     */
    self.reset = function () {
        self.search = {};
        self.search.sortStatus = '0';
    };

    /**
     * 导入城市
     */
    self.importQuestion = function(){
        self.add.id = null;
        document.getElementById("add-start").style.height = "400px";
        $('#addQuestion').show();
        $("#returnBtn").hide();
        $("#updateLogTab").hide();
        $('#addQuestionTab').hide();
        $('#addAnswerTab').hide();
        $('#uploadQuestion').show();
        self.getAuditorList();
    };

    /**
     * 添加按钮
     */
    self.addQuestion = function () {
        self.add.id = null;
        document.getElementById("add-start").style.height = "620px";
        $("#returnBtn").hide();
        $("#updateLogTab").hide();
        $('#addQuestion').show();
        $('#addQuestionTab').show();
        $('#addAnswerTab').show();
        $('#uploadQuestion').hide();
        self.getAuditorList();
    };

    /**
     * 修改按钮
     */
    self.editQuestion = function (item) {
        document.getElementById("add-start").style.height = "620px";
        $("#returnBtn").hide();
        $("#updateLogTab").hide();
        $('#addQuestionTab').show();
        $('#addAnswerTab').show();
        $('#uploadQuestion').hide();
        self.add.id = item.id;
        self.add.productChannel = item.productChannel;
        self.getTypeOne(self.add.productChannel);
        self.add.typeOne = item.typeOne;
        self.getTypeTwo(self.add.productChannel, self.add.typeOne)
        self.add.typeTwo = item.typeTwo;
        self.add.question = item.question;
        self.add.answer = item.answer;
        self.getAuditorList();
        setTimeout(function () {
            for (var i = 0; i < self.auditorList.length; i++) {
                if (self.auditorList[i].name == item.auditPerson) {
                    $('#addAuditor')[0].selectedIndex = i + 1;
                    self.add.auditor = self.auditorList[i];
                    break;
                }
            }
            $('#addQuestion').show();
        }, 200);
    };

    /**
     * 查看按钮
     * @param item
     */
    self.showQuestion = function (item) {
        self.add.id = item.id;
        self.add.productChannel = item.productChannel;
        self.getTypeOne(self.add.productChannel);
        self.add.typeOne = item.typeOne;
        self.getTypeTwo(self.add.productChannel, self.add.typeOne)
        self.add.typeTwo = item.typeTwo;
        self.add.question = item.question;
        self.add.answer = item.answer;
        $('#addQuestion').show();
        self.getUpdateLog(item.id);
        $('#addProductChannel').attr("disabled", true);
        $('#addTypeOne').attr("disabled", true);
        $('#addTypeTwo').attr("disabled", true);
        $('#addQuestionInput').attr("disabled", true);
        $('#addAnswer').attr("disabled", true);
        document.getElementById("add-start").style.height = "620px";
        $("#auditorTab").hide();
        $("#cancelBtn").hide();
        $("#saveBtn").hide();
        $("#returnBtn").show();
        $("#updateLogTab").show();
        $('#addQuestionTab').show();
        $('#addAnswerTab').show();
        $('#uploadQuestion').hide();
    };

    /**
     * 返回按钮
     */
    self.returnBtn = function () {
        $('#addProductChannel').attr("disabled", false);
        $('#addTypeOne').attr("disabled", false);
        $('#addTypeTwo').attr("disabled", false);
        $('#addQuestionInput').attr("disabled", false);
        $('#addAnswer').attr("disabled", false);
        $("#auditorTab").show();
        $("#cancelBtn").show();
        $("#saveBtn").show();
        $("#returnBtn").hide();
        self.cancelBtn();
    };

    /**
     * 保存按钮
     */
    self.saveBtn = function () {
        if (self.add.productChannel == '' || self.add.typeOne == '' || self.add.typeTwo == ''
            || ((self.add.question == '' || self.add.answer == '') && ($("#uploadQuestionFile").val() == null || $("#uploadQuestionFile").val() == "")) || self.add.auditor == '') {
            alert("请输入必填项")
            return;
        }
        self.add.auditPerson = self.add.auditor.name;
        self.add.auditNo = self.add.auditor.no;
        self.add.auditor = null;
        if (self.add.id == undefined || self.add.id == null) {
            if ($("#uploadQuestionFile").val() == null || $("#uploadQuestionFile").val() == "") {
                self.addQuestionPost();
            } else {
                self.importQuestionPost();
            }
        } else {
            self.updateQuestion();
        }
    };

    /**
     * 确认提示
     */
    self.confirmTips = function(confirmType, questionId, currentShowStatus){
        self.confirmType = confirmType;
        if (self.confirmType == "deleteQuestion") {
            if(currentShowStatus == '1'){
                alert("当前问题处于启用状态，不能进行删除操作。");
                return;
            }
            self.confirmContent = "确认删除";
        } else if (self.confirmType == "enableOrDisable") {
            self.confirmContent = (currentShowStatus == '0' ? '确认启用' : '确认停用');
        } else {
            alert("未定义操作");
            return;
        }
        self.confirmId = questionId;
        self.currentShowStatus = currentShowStatus;
        $("#confirm-modal").show();
    };

    /**
     * 确认提交
     */
    self.confirmCommit = function(){
        if (self.confirmId == 0) {
            alert("未绑定数据");
            return;
        }
        if (self.confirmType == "deleteQuestion") {
            self.deleteQuestion(self.confirmId);
        } else if (self.confirmType == "enableOrDisable") {
            self.enableOrDisable(self.confirmId, self.currentShowStatus)
        } else {
            alert("未定义操作");
        }
        self.confirmContent = "";
        self.confirmType = "";
        self.confirmId = 0;
        self.currentShowStatus = "";
        $("#confirm-modal").hide();
    };

    /**
     * 确认提交
     */
    self.confirmCancel = function(){
        self.confirmContent = "";
        self.confirmType = "";
        self.confirmId = 0;
        self.currentShowStatus = "";
        $("#confirm-modal").hide();
    };

    /**
     * 删除问题
     */
    self.deleteQuestion = function (questionId) {
        var params = {};
        params.id = questionId;
        var url = globalConfig.basePath + "/knowledge/deleteQuestion";
        $http.post(url, params).then(
            function (data) {
                if (data.data.code == '000') {
                    self.queryList(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 修改问题
     */
    self.updateQuestion = function () {
        var url = globalConfig.basePath + "/knowledge/updateQuestion";
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    self.cancelBtn();
                    self.queryList(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 启用或停用
     * @param item
     */
    self.enableOrDisable = function (questionId, currentShowStatus) {
        var params = {};
        params.id = questionId;
        params.showStatus = currentShowStatus == '0' ? '1' : '0';
        var url = globalConfig.basePath + "/knowledge/updateQuestion";
        $http.post(url, params).then(
            function (data) {
                if (data.data.code == '000') {
                    self.queryList(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 导入问题
     */
    self.importQuestionPost = function(){
        var formData = new FormData();
        formData.append("productChannel", self.add.productChannel);
        formData.append("typeOne", self.add.typeOne);
        formData.append("typeTwo", self.add.typeTwo);
        formData.append("auditPerson", self.add.auditPerson);
        formData.append("auditNo", self.add.auditNo);
        formData.append("questionFile", $('#uploadQuestionFile')[0].files[0]);
        $.ajax({
            url: globalConfig.basePath + '/knowledge/importQuestion',
            dataType: 'json',
            type: 'POST',
            async: false,
            data: formData,
            processData: false, // 使数据不做处理
            contentType: false, // 不要设置Content-Type请求头
            success: function (data) {
                if (data.code == '000') {
                    self.cancelBtn();
                    self.queryList(1);
                } else {
                    alert(data.message)
                }

            },
            error: function () {
                alert("请求失败了....");
            }
        });
    };

    /**
     * 添加问题
     */
    self.addQuestionPost = function () {
        var url = globalConfig.basePath + "/knowledge/addQuestion";
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    self.cancelBtn();
                    self.queryList(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 取消按钮
     */
    self.cancelBtn = function () {
        self.add = {};
        if (document.getElementById('uploadQuestionFile').hasOwnProperty("outerHTML")) {
            document.getElementById('uploadQuestionFile').outerHTML = "";
        }
        $('#addQuestion').hide();
    };

    /**
     * 拉取审核人列表
     */
    self.getAuditorList = function () {
        var url = globalConfig.basePath + "/otc/memberEnjoy/getAuditPersionList";
        $http.get(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
                self.auditorList = callback.data.resp;
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
     * 查询更新日志
     * @param questionId
     */
    self.getUpdateLog = function (questionId) {
        var params = {};
        params.id = questionId;
        params.pageNum = 1;
        params.pageSize = 10;
        var url = globalConfig.basePath + "/knowledge/queryQuestionUpdateLog";
        $http.post(url, params).then(
            function (data) {
                if (data.data.code == '000') {
                    self.updateLogList = data.data.resp.result;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 优先级排序
     */
    self.sortQuestion = function () {
        var moveSearchParams = {};
        if (self.search.productChannel == null || self.search.productChannel == "") {
            alert("请先选择渠道");
            return;
        } else {
            moveSearchParams.productChannel = self.search.productChannel;
        }
        if (self.search.typeOne == null || self.search.typeOne == "") {
            alert("请先选择一级分类");
            return;
        } else {
            moveSearchParams.typeOne = self.search.typeOne;
        }
        if (self.search.typeTwo == null || self.search.typeTwo == "") {
            alert("请先选择二级分类");
            return;
        } else {
            moveSearchParams.typeTwo = self.search.typeTwo;
        }
        moveSearchParams.sortKey = "priority";
        moveSearchParams.sortDirection = "ASC";
        moveSearchParams.showStatus="1";
        var url = globalConfig.basePath + "/problem/review/queryQuestionList";
        $http.post(url, moveSearchParams).then(
            function (data) {
                if (data.data.code == '000') {
                    self.moveList = data.data.resp.result;
                    if (self.moveList.length == 0) {
                        alert("此渠道项下暂无审核通过的启用问题配置记录");
                    } else {
                        $('#showPriority').show();
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    /**
     * 上移
     */
    self.moveUp = function (index) {
        if (index == 0) {
            alert("已经是第一个了，无法上移");
            return;
        }
        var tempItem = self.moveList[index - 1];
        self.moveList[index - 1] = self.moveList[index];
        self.moveList[index] = tempItem;
    };

    /**
     * 下移
     */
    self.moveDown = function (index) {
        if (index == self.moveList.length - 1) {
            alert("已经是最后一个了，无法上移");
            return;
        }
        var tempItem = self.moveList[index + 1];
        self.moveList[index + 1] = self.moveList[index];
        self.moveList[index] = tempItem;
    };

    /**
     * 置顶
     */
    self.moveTop = function (index) {
        if (index == 0) {
            alert("已经是第一个了，无法上移");
            return;
        }
        var tempItem = self.moveList[index];
        self.moveList.splice(index, 1);
        self.moveList.unshift(tempItem);
    };

    /**
     * 移动取消
     */
    self.moveCancel = function () {
        $('#showPriority').hide();
    };

    /**
     * 移动提交
     */
    self.moveCommit = function () {
        var moveCommitList = [];
        self.moveList.forEach(function (value, index) {
            var moveItem = {};
            moveItem.id = value.id;
            moveItem.priority = index + 1;
            moveCommitList.push(moveItem);
        })
        var url = globalConfig.basePath + "/knowledge/setQuestionPriority";
        $http.post(url, moveCommitList).then(
            function (data) {
                if (data.data.code == '000') {
                    $('#showPriority').hide();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
        $('#showPriority').hide();
    };


}])