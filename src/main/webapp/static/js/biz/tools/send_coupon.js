'use strict';
var app = angular.module('couponBatchControllerApp', [], angular.noop);
app.controller("couponBatchController", ['$scope','$http', function ($scope,$http) {
    var self = $scope;
    self.search = {};// 查询
    self.loginName=globalConfig.loginName;
    self.operType=111;
    self.search.batchStatus="";
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

    //条件查询
    self.queryCouponGiveBatchList = function(pageNum){

        if(!pageNum){
            self.search.pageNo = self.page.pageNo;
        } else {
            if(pageNum > self.search.pageCount){
                if(self.search.pageCount==0){
                    self.search.pageNo=1;
                }else {
                    self.search.pageNo = self.search.pageCount;
                }
            }else{
                self.search.pageNo = pageNum;
            }
        }
        var url = globalConfig.basePath+"/issue/coupon/queryCouponGiveBatchByCondition";
        $http.post(url,self.search).then(
            function(data){
                if(data.data.code=='000'){
                    self.search.pageNo = data.data.resp.currentPage;
                    self.search.pageSize = data.data.resp.pageSize+"";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.sendCouponList = data.data.resp.result;

                }else{
                    alert("查询失败："+data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    //重置
    self.reset = function(){
        self.search={};
        self.search.pageNo = "1";
        self.search.pageSize = "5";
    }

    //审批
    $scope.audit = function(record){
        $scope.auditStatus = "1";
        $('.examine-box').show();
        $scope.confirmRecord = angular.copy(record);

    };

    // 审核
    $scope.confirm = function(){
        if (!self.chooseAuditStatus) {
            alert("请选择审核结果");
            return;
        }
        var url = globalConfig.basePath+"/issue/coupon/auditing";
        $scope.confirmRecord.auditStatus = $scope.chooseAuditStatus;
        $('.examine-box').hide();
        alert("审核申请操作提交成功,请稍候留意发放批次是否发放成功！");
        $http.post(url,$scope.confirmRecord).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                self.search.pageNo = "1";
                self.search.pageSize = "5";
                self.queryCouponGiveBatchList(1);
            } else {
                console.error(callback.data);
                alert("请勿重复审核批次！");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };

    //发送端按钮
    self.detailShowNew = function (param) {
        self.operType=222;
        self.couponGiveBatchNo=param.batchNo;
        self.search.memberId="";
        self.search.status="";
        self.search.couponId="";
        self.search.issueDesc="";
        self.$broadcast('couponDetailsShow',self.couponGiveBatchNo);
    }

    self.$on('couponBatchPageShow', function() {
        //初始化查询
        self.operType=111;
        self.queryCouponGiveBatchList(1);
    })

    //批量卡券-弹窗显示
    self.SendCouponTan = function(value){
        self.sendType=value;
        self.cashCouponId="";
        self.batchNameApply="";
        $("#OpenBatchPoint").show();
        $("#memberFile").val("");
        $("#updateMemberFileInput").val("");
    }

    //数据导出
/*    self.importList = function () {
        var form = $('#conditionForm');
        form.attr("action",globalConfig.basePath + "/issue/coupon/importList");
        form.attr("target","downloadIframe");
        form.submit();
    }*/


    //初始化加载
    self.queryCouponGiveBatchList(1);


    //上传文件-发放现金券
    self.submitCashUserData=function () {

        var couponId = self.cashCouponId;
        var batchNameApply = self.batchNameApply;
        if(!self.cashCouponId ){
            alert("请输入现金券Id");
            return false;
        }
        var re = /^[0-9]+.?[0-9]*$/;
        if (!re.test(couponId)) {
            alert("请输入数字");
            document.getElementById("couponId").value = "";
            return false;
        }
        var xlsfile = $("#memberFile").val();
        if (xlsfile == '') {
            alert("请选择需上传的excel文件!");
            return false;
        }
        var filetype = xlsfile.substr(xlsfile.lastIndexOf(".")).toLowerCase();
        if (filetype != '.xls' && filetype != '.xlsx') {
            // alert("只支持.xls类型的Excel文件!");
            alert("只支持excel文件上传!");
            return false;
        }

        // 审核人
        if (!self.chooseAuditPerson) {
            alert("审核人不能为空");
            return;
        }

        $("#OpenBatchPoint").hide();
        $("#editBid").show();
        var reqParamData ={"batchName":batchNameApply,"couponId":couponId,"auditPersonNo":self.chooseAuditPerson.no,"auditPersonName":self.chooseAuditPerson.name};
        // 上传文件
        var url = globalConfig.basePath + '/issue/coupon/importCashCouponData';
        $.ajaxFileUpload({
            url:url, //你处理上传文件的服务端
            secureuri: false,
            data:reqParamData,
            fileElementId: 'memberFile',
            success: function (response){
                var str = $(response).find("body").text();//获取返回的字符串
                var json = $.parseJSON(str);//把字符串转化为json对象
                $("#editBid").hide();
                self.cashCouponId="";
                self.batchNameApply="";
                self.chooseAuditPerson="";
                if(json.code=='000'){
                    alert("现金卡券批次发放申请成功");
                    self.search.pageNo = "1";
                    self.search.pageSize = "5";
                    self.queryCouponGiveBatchList(1);
                    self.loading();
                }else{
                    alert("现金卡券批次发放失败："+json.message);
                    $("#editBid").hide();
                }

            }
        })
    }



    //上传文件-发放普通券
    self.submitCommonUserData=function () {

        var xlsfile = $("#memberFile").val();
        if (xlsfile == '') {
            alert("请选择需上传的excel文件!");
            return false;
        }
        var filetype = xlsfile.substr(xlsfile.lastIndexOf(".")).toLowerCase();
        if (filetype != '.xls' && filetype != '.xlsx') {
            // alert("只支持.xls类型的Excel文件!");
            alert("只支持excel文件上传!");
            return false;
        }
        // 审核人
        if (!self.chooseAuditPerson) {
            alert("审核人不能为空");
            return;
        }

        $("#OpenBatchPoint").hide();
        $("#editBid").show();
        var batchNameApply = self.batchNameApply;
        var reqParamData ={"batchName":batchNameApply,"auditPersonNo":self.chooseAuditPerson.no,"auditPersonName":self.chooseAuditPerson.name};

        // 上传文件
        var url = globalConfig.basePath + '/issue/coupon/importCommonCouponData';
        $.ajaxFileUpload({
            url:url, //你处理上传文件的服务端
            secureuri: false,
            data:reqParamData,
            fileElementId: 'memberFile',
            success: function (response){
                var str = $(response).find("body").text();//获取返回的字符串
                var json = $.parseJSON(str);//把字符串转化为json对象
                $("#editBid").hide();
                self.cashCouponId="";
                self.batchNameApply="";
                self.chooseAuditPerson="";
                if(json.code=='000'){
                    alert("普通卡券批次发放申请成功");
                    self.search.pageNo = "1";
                    self.search.pageSize = "5";
                    self.queryCouponGiveBatchList(1);
                    self.loading();
                }else{
                    alert("普通卡券批次发放失败:"+json.message);
                    $("#editBid").hide();
                }
            }
        })
    }

}]);

//显示上传文件名
function importOpenMemberData() {
    var xlsfile = $("#memberFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    $("#updateMemberFileInput").val(xlsfilename);
}
