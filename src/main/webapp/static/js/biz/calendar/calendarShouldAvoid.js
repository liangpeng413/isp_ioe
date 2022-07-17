'use strict';

var App = angular.module('shouldAvoidConfig', [], angular.noop);
App.controller('shouldAvoidConfigController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};
    self.search.channel = 'wk';
    self.loginName = globalConfig.userName;
    self.fullYear = new Date().getFullYear();
    self.isShowDetail=0;

    self.getValid = function(year){
        if(parseInt(year)<parseInt(self.fullYear)){
            return "已失效";
        }else if(parseInt(year)==parseInt(self.fullYear)){
            return "生效中";
        }else if(parseInt(year)>parseInt(self.fullYear)){
            return "待生效";
        }
    }

    self.pageQueryShouldAvoid = function(pageNum) {
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
        var url = globalConfig.basePath + "/calendar/pageQueryDayShouldAvoid";
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
                    self.shouldAvoidList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.pageQueryShouldAvoid(1);

    self.checkContent = function(batchId,year,channel){
        self.isShowDetail=1;
        self.detail={};
        self.detail.channel=channel;
        self.detail.year=year;
        self.detail.batchId=batchId;
        self.pageQueryDetail(1);
    }

    self.pageQueryDetail = function(pageNum) {
        if (!pageNum) {
            self.detail.pageNo = self.pageNo;
        } else {
            if (pageNum > self.detail.pageCount && self.detail.pageCount>0) {
                self.detail.pageNo = self.detail.pageCount;
            } else {
                self.detail.pageNo = pageNum;
            }
        }
        self.detail.pageSize=10;
        var url = globalConfig.basePath + "/calendar/pageQueryShouldAvoidDetail";
        $http.post(url, self.detail).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.curPageNumber) {
                        self.detail.pageNo = data.data.resp.curPageNumber;
                    } else {
                        self.detail.pageNo = 1;
                    }
                    self.detail.pageCount = data.data.resp.pageSize;
                    self.detail.perPageRowSize = data.data.resp.perPageRowSize + "";
                    self.detail.totalRowSize = data.data.resp.totalRowSize;
                    self.shouldAvoidDetailList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.returnBatch = function () {
        self.isShowDetail=0;
        self.detail={};
        self.pageQueryShouldAvoid(1);
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

    /**
     * 导入excel
     */
    self.importFile = function (type,param) {
        self.importExcel=type;
        $('#importFile').show();
        self.importParam={};
        self.pullAuditPersons()
        if(type==0){
            self.importParam.channel='wk';
        }else{
            self.importParam.channel = param.channel;
            self.importParam.year = param.year;
        }
    }

    self.commitImportShouldAvoid = function () {
        var xlsfile = $("#shouldAvoidFile").val();
        if (xlsfile == '') {
            alert("请选择需上传的excel文件!");
            return false;
        }
        var filetype = xlsfile.substr(xlsfile.lastIndexOf(".")).toLowerCase();
        if (filetype != '.xls' && filetype != '.xlsx') {
            alert("只支持excel文件上传!");
            return false;
        }
        if (!self.importParam.channel) {
            alert("请选择渠道");
            return;
        }
        if (!self.importParam.year) {
            alert("请选择年份");
            return;
        }
        if(!self.importParam.auditPerson){
            alert("请选择审核人");
            return;
        }
        var paramData = {
            "channel":self.importParam.channel,
            "auditPerson":self.importParam.auditPerson.name,
            "auditNo":self.importParam.auditPerson.no,
            "year":self.importParam.year,
            "requestAuditPerson":self.loginName,
            "createPerson":self.loginName,
            "type":self.importExcel
        }
        // 上传文件
        var url = globalConfig.basePath + '/calendar/importCalendarData';
        $.ajaxFileUpload({
            url:url, //你处理上传文件的服务端
            secureuri: false,
            data:paramData,
            fileElementId: 'shouldAvoidFile',
            success: function (response){
                var str = $(response).find("body").text();//获取返回的字符串
                var json = $.parseJSON(str);//把字符串转化为json对象
                if(json.code=='000'){
                    alert("操作成功");
                    $('#importFile').hide();
                    self.importParam={};
                    self.importExcel=0;
                    $("#updateFileInput").val();
                    self.pageQueryShouldAvoid(1);
                }else{
                    alert("操作失败："+json.message);
                    $('#importFile').hide();
                    self.importParam={};
                    self.importExcel=0;
                    $("#updateFileInput").val();
                }
            }
        })
    }
    
    self.close = function () {
        $('#importFile').hide();
        self.importParam={};
        self.importExcel=0;
    }

    // 修改
    self.upShow = function (param) {
        $('#showDetailUpOrCheck').show();
        self.upOrCheckParam = param;
        self.pullAuditPersons();
    }

    //关闭修改
    self.closeUpdateDetail = function () {
        $('#showDetailUpOrCheck').hide();
        self.upOrCheckParam = {};
        self.pullAuditPersons();
        self.showDetailDisable=null;
    }

    //确定修改
    self.confirmUpdateDetail = function () {
        if(!self.upOrCheckParam.month ||self.upOrCheckParam.month==''){
            alert("请选择月份");
            return;
        }
        if(!self.upOrCheckParam.day ||self.upOrCheckParam.day==''){
            alert("日期不能为空");
            return;
        }
        if(!self.upOrCheckParam.should ||self.upOrCheckParam.should==''){
            alert("宜不能为空");
            return;
        }
        if(!self.upOrCheckParam.avoid ||self.upOrCheckParam.avoid==''){
            alert("忌不能为空");
            return;
        }
        if(!self.upOrCheckParam.saying ||self.upOrCheckParam.saying==''){
            alert("名言不能为空");
            return;
        }
        if(!self.upOrCheckParam.auditPerson ||self.upOrCheckParam.auditPerson==''){
            alert("审核人不能为空");
            return;
        }else {
            //预审核人工号
            self.upOrCheckParam.auditNo = self.upOrCheckParam.auditPerson.no;
            //预审核人
            self.upOrCheckParam.auditPerson = self.upOrCheckParam.auditPerson.name;
        }
        self.upOrCheckParam.requestAuditPersion = self.loginName;
        self.upOrCheckParam.updatePerson = self.loginName;
        var url = globalConfig.basePath + "/calendar/confirmUpdateDetail";
        $http.post(url, self.upOrCheckParam).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功");
                    self.checkContent(self.upOrCheckParam.batchNumber,self.upOrCheckParam.year,self.upOrCheckParam.channel)
                    $('#showDetailUpOrCheck').hide();
                    self.upOrCheckParam = {};
                    self.pullAuditPersons();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //查看详情
    self.checkShowDetail = function (param) {
        self.showDetailDisable=1;
        $('#showDetailUpOrCheck').show();
        self.upOrCheckParam = param;
    }
    
    self.auditDetailShow = function (id) {
        self.auditStatus='1';
        $('#auditDetailShowId').show();
        self.pullAuditPersons();
        self.auditId=id;
    }

    self.confirmDetail = function () {
        self.param={};
        self.param.id=self.auditId;
        self.param.auditStatus = self.auditStatus;
        self.param.auditDescription = self.auditDescription;
        self.param.updatePerson = self.loginName;
        var url = globalConfig.basePath+"/calendar/auditDetail";
        $http.post(url,self.param).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $('#auditDetailShowId').hide();
                alert("操作成功");
                $scope.pageQueryDetail(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("请求失败了....");
        });
    }

    self.batchAudit = function (param) {
        $('#batchAuditShow').show();
        self.auditStatus='1';
        self.batchNumber=param.id;

    }
    self.confirmBatchDetail = function () {
        self.param={};
        self.param.id = self.batchNumber;
        self.param.auditStatus = self.auditStatus;
        self.param.auditDescription = self.auditDescription;
        self.param.updatePerson = self.loginName
        var url = globalConfig.basePath+"/calendar/batchAudit";
        $http.post(url,self.param).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $('#batchAuditShow').hide();
                alert("操作成功");
                self.pageQueryShouldAvoid(1);
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("请求失败了....");
        });
    }

}])

//显示上传文件名
function importData() {
    var xlsfile = $("#shouldAvoidFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    $("#updateFileInput").val(xlsfilename);
}

