'use strict';
var app = angular.module('myApp', [], angular.noop);
app.controller("rootController", ['$scope','$http', function ($scope,$http) {

    $scope.searchCondition = {pageSize:10};
    $scope.operationType = 0;
    $scope.loginName = globalConfig.loginName;

    // 分页参数
    $scope.page = window.defaultPageParam?window.defaultPageParam:{};
    $scope.page.fetchPageContent = submitSearch;


    function submitSearch(){
        $scope.pageQueryVipEnjoy($scope.page.currPage);
    }
    $scope.pageQueryVipEnjoy = function(currentPage){
        $scope.searchCondition.currentPage = currentPage;
        $scope.searchCondition.pageSize = $scope.page.perPageRowSize;
        var url = globalConfig.basePath+"/otc/memberEnjoy/pageQuery";
        $http.post(url,$scope.searchCondition).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $scope.vipEnjoyList = callback.data.resp.list;

                $scope.page.currPage = callback.data.resp.pageNum;
                $scope.page.lastPage = callback.data.resp.pages;
                $scope.page.totalRowSize = callback.data.resp.total;
                $scope.page.perPageRowSize = callback.data.resp.pageSize+'';
                $scope.page.startRow = callback.data.resp.startRow+'';
                $scope.page.endRow = callback.data.resp.endRow+'';
            } else {
                alert("error");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    $scope.pageQueryVipEnjoy(1);
    $scope.resetVipEnjoy = function(){
        $scope.searchCondition = {
            productChannel:'0',
            auditStatus:'',
            lcProductId:'',
            isEnable:'',
            productName:''
        };
    };
    /**
     * 获取审核状态
     * @param auditStatus
     * @returns {string}
     */
    $scope.getAuditStatusStr = function(auditStatus){
        var auditStatusStr = "";
        if(auditStatus == 0) {
            auditStatusStr = "待审核";
        } else if(auditStatus == 1) {
            auditStatusStr = "审核通过";
        } else if(auditStatus == 2){
            auditStatusStr = "审核不通过";
        }
        return auditStatusStr;
    };

    /**
     * 获取会员等级的加息利率
     * @param memberLevelDetail
     * @param type 会员等级
     * @returns {string}
     */
    $scope.getRateIncreasedStr = function(memberLevelDetail,type){
        var rateIncreasedStr = "";
        var memberLevelDetailP = angular.fromJson(memberLevelDetail);
        if(memberLevelDetailP['lv'+type]){
            rateIncreasedStr = memberLevelDetailP['lv'+type]['expandProfit'];
            return rateIncreasedStr+'%';
        }
        return rateIncreasedStr;
    };

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

    /**
     * 拉去后台产品列表
     */
    $scope.pullProductInfo = function(){
        if($.trim($scope.operationRecord.lcProductId)!=''){
            var url = globalConfig.basePath+"/otc/memberEnjoy/getProductInfo?productChannel="+$scope.operationRecord.productChannel+"&lcProductId="+$scope.operationRecord.lcProductId;
            $http.get(url).then(function successCallback(callback) {
                if(callback.data.code == '000'){
                    $scope.operationRecord.productName = callback.data.resp.productName;
                    $scope.operationRecord.productPeriod = callback.data.resp.holdDay;
                    $scope.operationRecord.standardProfit = callback.data.resp.profit;
                } else if (callback.data.code == '103'){
                    console.error(callback.data);
                    $scope.cleanProductInfo();
                    swalMsg("接口服务器异常");
                } else if(callback.data.code == '104'){
                    $scope.cleanProductInfo();
                    swalMsg("不是该渠道的后台产品ID");
                } else if(callback.data.code == '105'){
                    $scope.cleanProductInfo();
                    swalMsg("已添加，不可再次添加");
                } else {
                    console.error(callback);
                }
            }, function errorCallback(response) {
                $scope.cleanProductInfo();
                // 请求失败执行代码
                swalMsg(response);
            });
        } else {
            $scope.cleanProductInfo();
        }
    };
    /**
     * 清楚产品信息
     */
    $scope.cleanProductInfo = function(){
        $scope.operationRecord.productName = '';
        $scope.operationRecord.productPeriod = '';
        $scope.operationRecord.standardProfit = '';
    }

    // TODO 预增加逻辑 和 增加逻辑
    $scope.preAdd = function(){
        $scope.operationType = 1;
        $scope.operationRecord={productChannel:'0',isEnable:'1'};
        $scope.memberLevelDetailP = {};
        $scope.auditPerson = '';
    };

    /**
     * 报错或者修改逻辑
     */
    $scope.updateRecord = function(){
        // 验证参数
        if(!$scope.checkParam())  return;
        // 保存数据
        var url = null;
        if(!$scope.operationRecord.id){
            url = globalConfig.basePath+"/otc/memberEnjoy/add";
        } else {
            url = globalConfig.basePath+"/otc/memberEnjoy/update";
            $scope.operationRecord.updateTime = null;
            $scope.operationRecord.createTime = null;
            $scope.operationRecord.requestAuditTime = null;
            $scope.operationRecord.auditTime = null;
        }
        $http.post(url,$scope.operationRecord).then(function successCallback(callback) {
            $('#add-start-bg1').hide();
            if(callback.data.code == '000'){
                alert("保存成功");
                $scope.pageQueryVipEnjoy(1);
                $scope.operationType = 0;
                // swalMsg("保存成功");
                // $scope.preAdd();
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    /**
     * 验证参数
     * @returns {boolean}
     */
    $scope.checkParam = function(){
        var result = false;
        if(!$scope.operationRecord.productChannel){
            swalMsg("后台产品不能为空");
            return result;
        }
        if(!$scope.operationRecord.lcProductId
            || !$scope.operationRecord.productName
            || !$scope.operationRecord.productPeriod
            || !$scope.operationRecord.standardProfit){
            swalMsg("请输入正确的后台产品ID");
            return result;
        }

        var isFlag = true;// 是否验证通过,默认通过
        var memberLevel = [];
        var memberLevelDetail = {};
        $.each($scope.memberLevelDetailP,function(index,element){
            if(element.selected == '1'){
                if(!element.expandProfit || $.trim(element.expandProfit) == ''){
                    swalMsg(index+"会员加息利率不能为空");
                    isFlag = false;
                    return false;
                } else if(angular.isNumber(element.expandProfit)){
                    swalMsg(index+"会员加息利率只能为数字");
                    isFlag = false;
                    return false;
                }else if(element.expandProfit>5 || element.expandProfit<0){
                    swalMsg(index+"会员加息利率不能小于0或者大于5");
                    isFlag = false;
                    return false;
                } else {
                    var minInvestExist = false;
                    if(element.minInvest && $.trim(element.minInvest) != ''){ // 如果已经填写
                        if(angular.isNumber(element.minInvest)){
                            swalMsg(index+" 起投金额只能为数字");
                            isFlag = false;
                            return false;
                        }
                        var num = Number(element.minInvest);
                        if(num < 0){
                            swalMsg(index+" 起投金额不能小于0");
                            isFlag = false;
                            return false;
                        }
                        if(num %100 != 0){
                            swalMsg(index+" 起投金额为100的整数倍");
                            isFlag = false;
                            return false;
                        }
                        minInvestExist = true;
                    }
                    var maxInvestExist = false;
                    if(element.maxInvest && $.trim(element.maxInvest) != ''){ // 如果已经填写
                        if(angular.isNumber(element.maxInvest)){
                            swalMsg(index+" 出借上限只能为数字");
                            isFlag = false;
                            return false;
                        }
                        var num = Number(element.maxInvest);
                        if(num < 0){
                            swalMsg(index+" 出借上限不能小于0");
                            isFlag = false;
                            return false;
                        }
                        if(num %100 != 0){
                            swalMsg(index+" 出借上限为100的整数倍");
                            isFlag = false;
                            return false;
                        }
                        if(minInvestExist && num < Number(element.minInvest)){
                            swalMsg(index+"出借上限不能小于起投金额");
                            isFlag = false;
                            return false;
                        }
                        maxInvestExist = true;
                    }
                    var maxDailyExist = false;
                    if(element.maxDaily && $.trim(element.maxDaily) != ''){ // 如果已经填写
                        if(angular.isNumber(element.maxDaily)){
                            swalMsg(index+" 单日上限只能为数字");
                            isFlag = false;
                            return false;
                        }
                        var num = Number(element.maxDaily);
                        if(num < 0){
                            swalMsg(index+" 单日上限不能小于0");
                            isFlag = false;
                            return false;
                        }
                        if(num %100 != 0){
                            swalMsg(index+" 单日上限为100的整数倍");
                            isFlag = false;
                            return false;
                        }
                        if(minInvestExist && num < Number(element.minInvest)){
                            swalMsg(index+"单日上限不能小于起投金额");
                            isFlag = false;
                            return false;
                        }
                        maxDailyExist = true;
                        // 如果出借上限 和 单日上限不为空，出借上限不能小于单日上限
                        if(maxInvestExist && maxDailyExist){
                            if(Number(element.maxInvest) < Number(element.maxDaily)){
                                swalMsg(index+"出借上限不能小于单日上限");
                                isFlag = false;
                                return false;
                            }
                        }
                    }
                }
                memberLevel.push(index);
                memberLevelDetail[index] = element;
            }
        });
        if(isFlag){// 验证通过
            // $scope.operationRecord.memberLevel = memberLevel.join(",");
            $scope.operationRecord.memberLevel = angular.toJson(memberLevel);
            $scope.operationRecord.memberLevelDetail = angular.toJson(memberLevelDetail);
        } else{
            return result;
        }
        if(memberLevel.length == 0){
            swalMsg("请设置会员详情信息");
            return result;
        }

        // 背景图片位置
        if(!$scope.operationRecord.bgImgUrl){
            swalMsg("请填写背景图链接");
            return result;
        }
        // 分享图片位置
        if(!$scope.operationRecord.shareImgUrl){
            swalMsg("请填写分享图链接");
            return result;
        }
        // 是否有效
        if(!$scope.operationRecord.isEnable){
            swalMsg("请选择是否生效");
            return result;
        }
        // 审核人
        if(!$scope.auditPerson){
            swalMsg("请选择审核人");
            return result;
        } else {
            // TODO 获取审核人信息
            $scope.operationRecord.auditPerson = $scope.auditPerson.name;
            $scope.operationRecord.auditNo = $scope.auditPerson.loginName;
            $scope.operationRecord.requestAuditPersonEmail =$scope.auditPerson.email;// 备用字段
        }
        return result = true;
    };
    /**
     * 会员加息加息利率-验证两位小数
     * @param level
     */
    $scope.checkExpandProfit = function(level) {
        var expandProfit = $scope.memberLevelDetailP[level].expandProfit;
        $scope.memberLevelDetailP[level].expandProfit = numKeepTwoPoint(expandProfit);
        var num = Number(expandProfit);
        if(num>5 || num<0){
            swalMsg("请输入0~5之间的数字");
        }
    }
    /**
     * 过滤数字，返回保留两位小数的数字
     * @param v
     * @returns {string|XML|*}
     */
    /*function numKeepTwoPoint(v) {
        v = v.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
        v = v.replace(/^\./g,""); //验证第一个字符是数字
        v = v.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
        v = v.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
        return v;
    }*/
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(record,opType){
        if(opType == 1){// 展示
            $scope.operationType = 2;
            $scope.showRecord = angular.copy(record);

            $scope.memberLevelDetailP = angular.fromJson($scope.showRecord.memberLevelDetail);
        } else if(opType == 2){ // 修改
            $scope.operationType = 1;
            $scope.operationRecord = angular.copy(record);
            $scope.operationRecord.productChannel +='';

            $scope.memberLevelDetailP = angular.fromJson($scope.operationRecord.memberLevelDetail);
            // $scope.auditPerson = '';
        } else if(opType == 3){// 审核
            $scope.operationRecord = record;

            $("#examine_auditStatus").val('1');
            $("#examine_auditDescription").val('');
            $('#examine_box_div').show();
            // $('.examine-box').show()
        } else if(opType == 4){// 生效、失效
            $('#take_start_box_div').show();
            // $('.take-start-box').show()

            $scope.operationRecord = record;
            $scope.auditPerson = '';
        }
    };
    /**
     * 生效、失效
     */
    $scope.validateRecord = function(){
        // 审核人
        if(!$scope.auditPerson){
            swalMsg("请选择审核人");
            return false;
        }
        // 保存数据
        var take_requestAuditDescription = $.trim($("#take_requestAuditDescription").val());
        var isEnable = $scope.operationRecord.isEnable=='1'?"0":"1";
        var param = {
            id:$scope.operationRecord.id,
            isEnable:isEnable,
            requestAuditDescription:take_requestAuditDescription,
            // TODO 获取审核人信息
            auditPerson:$scope.auditPerson.name,
            auditNo:$scope.auditPerson.loginName,
            requestAuditPersonEmail:$scope.auditPerson.email
        };

        var url = globalConfig.basePath+"/otc/memberEnjoy/processingEffective";
        $http.post(url,param).then(function successCallback(callback) {
            $('#take_start_box_div').hide();
            if(callback.data.code == '000'){
                // swalMsg("提交"+(isEnable=='1'?"生效":"失效")+"处理成功");
                alert("操作成功");
                $scope.pageQueryVipEnjoy($scope.page.currPage);
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    /**
     * 审核操作
     */
    $scope.checkRecord = function(){
        var examine_auditStatus = $("#examine_auditStatus").val();
        if(!examine_auditStatus){
            swalMsg("请选择审核状态");
            return false;
        }
        // 保存数据
        var param = {
            id:$scope.operationRecord.id,
            auditStatus:examine_auditStatus,
            auditDescription:$.trim($("#examine_auditDescription").val())
        };
        var url = globalConfig.basePath+"/otc/memberEnjoy/auditing";
        $http.post(url,param).then(function successCallback(callback) {
            $('#examine_box_div').hide();
            if(callback.data.code == '000'){
                alert("操作成功");
                $scope.pageQueryVipEnjoy($scope.page.currPage);
            } else if(callback.data.code == '105'){
                swalMsg("该记录已经审核过。");
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
}]);