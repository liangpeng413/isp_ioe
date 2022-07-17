'use strict';

var App = angular.module('newAbtest', [], angular.noop);
App.controller('newAbtestController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.showTable=1;
    self.search={};
    self.search.channelCode='WK';
    self.select = '1';
    self.daily = {};
    //变量集合
    self.varableList=[];
    /**
     * 初始化服务类型
     */
    self.serviceSelectCreate = function (type,code) {
        var url = globalConfig.basePath + "/operation/init/byKey?type="+type+"&code="+code;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    if(type==12){
                        self.search.serviceCode = '';
                        self.search.userCode = '';
                        self.serviceCodeList = data.data.resp;
                    }else if(type==13){
                        self.search.userCode = '';
                        self.userCodeList = data.data.resp;
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    /**
     * 默认初始化服务类型
     */
    self.serviceSelectCreate(12,self.search.channelCode);

    /**
     * 用户行为查询
     */
    // self.userCodeSelectCreate = function (type,code) {
    //     var url = globalConfig.basePath + "/operation/init/byKey?type="+type+"&code="+code;
    //     $http.get(url).then(
    //         function (data) {
    //             if (data.data.code == '000') {
    //                 self.userCodeList = data.data.resp;
    //             } else {
    //                 alert(data.data.message)
    //             }
    //         }, function errorCallback(response) {
    //             alert("请求失败了....");
    //         }
    //     );
    // }


    /**
     * 分页查询
     */
    self.queryByList = function (pageNum) {
        if (!pageNum) {
            self.search.currentPage = self.search.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.currentPage = self.search.pageCount;
            } else {
                self.search.currentPage = pageNum;
            }
        }
        self.search.pageSize=10;
        var url = globalConfig.basePath + "/abtest/newList";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.perPageRowSize = data.data.resp.pageSize + "";
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.abTestList = data.data.resp.result;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 默认查询第一页
     */
    self.queryByList(1);

    /**
     * 重置
     */
    self.reset = function () {
        self.search={};
        self.search.channelCode='WK';
    }

    /**
     * 审核弹窗显示
     */
    self.examine = {}
    self.showExamine = function (param) {
        self.examine = param;
        $('#chcnkModal').show();
    }
//==============================================================================================================================
    /**
     * 时间转换方法
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    /**
     * 效果分析页面
     * @param x
     */
    self.xiaoguo = function(id){

        self.showTable=6;
        $('#qd').text("渠道:"+self.detail.channelCode);
        $('#servicetype').text("服务类型:"+self.detail.serviceType);
        $('#xw').text("用户行为:"+self.detail.userCode);
        $('#cfjd').text("触发节点:"+self.detail.touchCode);
        $('#strategy').text("触发节点:"+self.detail.touchStrategy);
        $('#serviceId').text("服务id:"+self.detail.id);
        var userTag = self.res.userTag;
       if (self.res.userTag == null){
           self.res.userTag = 0;
       }
        var param = "id=" + self.res.userTag;
        if (!userTag) {
            $.ajax({
                type: 'GET',
                url: globalConfig.basePath + "/ruleConfigAddDetail/queryUserCount?channel=" + self.res.channelCodeKey,
                data: self.res.channelCodeKey,
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $('#rosterName').text("名单名称:全部用户");
                    $('#channelCode1').text("渠道:" + self.res.channelCode);
                    $('#type').text("类型:" + "-");
                    $('#rosterNumber').text("名单人数:" + data.resp);
                },
                error: function (data) {
                    alert(data.message);
                }
            })
        } else {
            $.post(globalConfig.basePath + "/abTest/listname", param, function (data) {
                if (data.code != '000') {
                    alert(data.message);
                    self.location = document.referrer;
                } else {
                    console.log(data);
                    var rosterInfo = data.resp.data;
                    $('#rosterName').text("名单名称:" + rosterInfo.rosterName);
                    if (rosterInfo.channelCode == "WK") {
                        $('#channelCode').text("渠道:悟空理财");
                    } else {
                        $('#channelCode').text("渠道:玖富钱包");
                    }
                    if (rosterInfo.rosterType == "1") {
                        rosterInfo.rosterType = "用户智能画像";
                    } else {
                        rosterInfo.rosterType = "用户名单";
                    }
                    $('#type').text("类型:" + rosterInfo.rosterType);
                    $('#rosterNumber').text("名单人数:" + rosterInfo.rosterCount);
                    var oldTime = (new Date(rosterInfo.createTime)).getTime();
                    var curTime = new Date(oldTime).format("yyyy-MM-dd");
                    var oldTime2 = (new Date(rosterInfo.updateTime)).getTime();
                    var curTime2 = new Date(oldTime2).format("yyyy-MM-dd");
                    $('#createTime').text("创建时间:" + curTime);
                    $('#updateTime').text("更新时间:" + curTime2);
                    $('#createPeople').text("创建人:" + rosterInfo.createUser);

                }
            }, "json");
        }


        self.change(id);

        self.dailyTouch(null,id);


    }



    /**
     * 柱状图显示
     */
    function showBarCharts(id) {
        var process = {};
        process.featureType = self.select;
        process.channel = self.res.channelCodeKey;
        process.rosterId = self.res.userTag;
        process.strategyId = id ;
        var url = globalConfig.basePath + "/abTest/rateofsuccess";
        $.ajax({
                type: 'POST',
                url: globalConfig.basePath + "/abTest/rateofsuccess",
                data: JSON.stringify(process),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code == '000') {
                        var chart = {
                            type: 'column'
                        };
                        var typeName = "";
                        if (self.select == 2) {
                            typeName = "年龄";
                        }else if (self.select == 1) {
                            typeName = "性别";
                        } else if (self.select == 3) {
                            typeName = "手机号地区";
                        } else if (self.select == 4) {
                            typeName = "出借次数";
                        } else if (self.select == 5) {
                            typeName = "出借偏好期限";
                        } else if (self.select == 6) {
                            typeName = "会员等级";
                        } else if (self.select == 7) {
                            typeName = "推广渠道";
                        } else if (self.select == 8) {
                            typeName = "来源渠道";
                        } else if (self.select == 9) {
                            typeName = "可用卡券数";
                        }
                        var title = {
                            text: "用户在不同" + typeName + "的策略成功率"
                        };
                        var subtitle = {
                            text: ''
                        };
                        /**拼装柱形图数据-开始*/
                        var names = [];
                        var values = [];
                        var values2 = [];
                        for (var i = 0; i < data.resp.data.length; i++) {
                            names.push(data.resp.data[i].feature);
                            var param = {};
                            var featureParam = {};
                            param.y = parseInt(data.resp.data[i].successNum);
                            param.total = parseInt(data.resp.data[i].successRate * 100) + "%";
                            values.push(param);
                            featureParam.y = parseInt(data.resp.data[i].featureNum);
                            featureParam.total = parseInt(data.resp.data[i].featureRate * 100) + "%";
                            values2.push(featureParam);
                        }
                        var xAxis = {
                            categories: names,
                            crosshair: true
                        };
                        var yAxis = {
                            min: 0,
                            title: {
                                text: '人（数）'
                            }
                        };
                        // var tooltip = {
                        //     headerFormat: '<span style="font-size:10px;color:{series.color};padding:0">{point.key}</span>',
                        //     pointFormat: '<table><tr><td addyqBankCode="color:{series.color};padding:0">人数:</td>' +
                        //         '<td style="padding:0"><b>{point.y} </b></td></tr>',
                        //     footerFormat: '</table>',
                        //     shared: true,
                        //     useHTML: true
                        // };
                        var tooltip = {
                            headerFormat: '<table><span style="font-size:10px">{point.key}</span>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>({point.y:.1f})&nbsp;&nbsp;{point.total}&nbsp;&nbsp;&nbsp;' +
                                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        };
                        var plotOptions = {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        };
                        var credits = {
                            enabled: false
                        };
                        var series = [{
                            name: "成功数",
                            data: values
                        },
                            {name: "用户数", data: values2}

                        ];
                        var json = {};
                        json.chart = chart;
                        json.title = title;
                        json.subtitle = subtitle;
                        json.tooltip = tooltip;
                        json.xAxis = xAxis;
                        json.yAxis = yAxis;
                        json.series = series;
                        json.plotOptions = plotOptions;
                        json.credits = credits;
                        $('#container').highcharts(json);

                    }

                },
                error: function (data) {
                    alert("请求成功率接口失败!")
                }

            }
        )


    }
    /**
     * 智能分析每日触发数据
     */
    self.dailyTouch = function(pageNum,id){

        if (!pageNum) {
            self.daily.pageNo = 1;
        } else {
            if (pageNum > self.daily.pageCount && self.daily.pageCount > 0) {
                self.daily.pageNo = self.daily.pageCount;
            } else {
               self.daily.pageNo = pageNum;
            }
        }
        if (self.detail.channelCode == '玖富钱包'){
            self.daily.channel = 'QB';
        }else {
            self.daily.channel = 'WK';
        }

        self.daily.strategyId = id;
        if (self.res.userTag&&self.res.userTag!="null") {
            self.daily.rosterId = self.res.userTag;
        }else {
            self.daily.rosterId = 0;
        }

        $.ajax({
            type:'POST',
            url:globalConfig.basePath+"/abTest/dailytouch",
            data:JSON.stringify(self.daily),
            contentType:"application/json",
            dataType:"json",
            success:function (data) {
                console.log(data,"返回的数据");
                if (data.data.code == '000') {
                    if (data.resp.currentPage) {
                        self.daily.pageNo = data.resp.currentPage;
                    } else {
                        self.daily.pageNo = 1;
                    }
                    self.daily.pageSize = data.resp.pageSize + "";
                    self.daily.pageCount = data.resp.pageCount;
                    self.daily.totalRowSize = data.resp.totalRowSize;

                    self.initiativeList = data.resp.result;
                }
            },
            error:function (data) {
                alert(data.message);
            }

        })


    }
    /**
     * 特征改变方法
     */
    self.change = function(id){
        showBarCharts(id);
    }
//===========================================================================================================================================
    /**
     * 挂壁弹窗
     */
    self.closeCheckModal = function () {
        $('#chcnkModal').hide();
    }

    /**
     * 审核通过
     */
    self.check = function (type) {
        var url = globalConfig.basePath + "/abTest/check?testStrategyId="+self.examine.id+"&status="+type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.examine={};
                    alert("操作成功");
                    $('#chcnkModal').hide();
                    self.queryByList(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**++++++++++++++++++++++++++++++++++查看操作@开始++++++++++++++++++++++++++*/

    /**
     * 查看
     */
    self.res={};
    self.re={};
    self.checkShow = function (testStrategy) {
        self.detail = testStrategy;
        self.detail.channelCode = testStrategy.channelCode;
        console.log(self.detail,"列表详细信息");
        self.testStrategyId = testStrategy.id;
        self.queryTagSelectList();
        var url = globalConfig.basePath + "/abTest/detail?testStrategyId="+testStrategy.id;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log("abtest反显数据",data);
                    self.showTable=2;
                    self.res = data.data.resp.testStrategyDto;
                    self.re = data.data.resp.touchVersionDtoList[0].strategyId.toString();
                    self.versionList = data.data.resp.touchVersionDtoList;
                    self.queryinitdata(data);
                    if(self.res.strategyStatus==0){
                        $("#butt1").hide();
                        $("#butt2").hide();
                        $("#butt3").show();
                    }
                    else if(self.res.strategyStatus==3){
                        $("#butt1").hide();
                        $("#butt2").hide();
                        $("#butt3").hide();
                    }
                    else if(self.res.testStatusKey==0){
                        $("#butt1").show();
                        $("#butt2").hide();
                        $("#butt3").hide();
                    }else if(self.res.testStatusKey==1){
                        $("#butt1").hide();
                        $("#butt2").show();
                        $("#butt3").hide();
                    }else if((self.res.testStatusKey==2||self.res.testStatusKey==3)){
                        $("#butt1").hide();
                        $("#butt2").hide();
                        $("#butt3").hide();
                    }
                    self.res.touchStrategyList.forEach(function(value , index , array){
                        if(value.attrKey === "BANK_CODE"){
                            self.realbankcode= value.attrValue;
                        }if(value.attrKey === "IS_EFFECT"){
                            self.IS_EFFECT= value.attrValue;
                        }
                    });

                    if(self.realbankcode!=null){
                        var bankCode = self.realbankcode.split(",");
                        for(var i=0;i<bankCode.length;i++){
                            $(".queryBankCode").each(function () {
                                if(bankCode[i]==$(this).val()){
                                    $(this).prop("checked",true);
                                }
                            })
                        }
                    }
                    //总触发数和总成功数
                    self.chufaCount = 0
                    self.chenggongCount=0;
                    angular.forEach(self.versionList,function (each) {
                        self.chufaCount += Number(each.touchCount);
                        self.chenggongCount += Number(each.successCount);
                    })
                    //受众分组查询
                    if(self.res.userTag != null && self.res.userTag != null&&self.res.userTag != 'undefined'){
                        self.getTagInfo(self.res.userTag);
                    }
                    self.bankschecked(data);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }




    /**
     * 受众分组查询
     */
    self.getTagInfo = function (userTag) {
        var url = globalConfig.basePath + "/abTest/getTagInfo?userTagCode="+userTag;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.rosterName=data.data.resp.rosterName;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    /**
     * 查看返回
     */
    self.returnTable2 = function(){
        self.showTable=1;
        self.bankInfoList();
        $('.query-selewrap').html(null);
        $('.query-seleinfo').html(null);
    }

    /**
     * 返回列表list页
     */
    self.returnTable1 = function () {
        if(confirm("返回后数据将丢失,确认返回吗?")){
            self.ysConfigVersion={};
            self.otherConfigVersionList=[];
            self.isConfigValable=1;
            self.varableTests='';
            self.varableList=[];
            self.canUpdateAttribute=''
            self.abtest={};
            self.add={};
            self.showTable=1;
            self.queryByList(1);
            self.addshow=1;
            $('.s-step0>b>b,.s-step0>p,.s-step0>em').addClass('active');
            $('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active');
        }

    }

    /**
     * 查看操作-开始
     */
    self.begin = function (id,type) {
        var url = globalConfig.basePath+"/abTest/updateTestStatus?testStrategyId="+id+"&testStatus="+type;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功");
                    self.res.testStatusKey=type;
                    self.checkShow(self.detail);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 审核显示
     */
    self.showCheckExamine = function (id) {
        $('#chcnkModal2').show();
    }

    self.closeCheckModal2 = function () {
        $('#chcnkModal2').hide();
    }

    /**
     * 查看审核操作
     * @param type
     */
    self.check2 = function (type) {
        var url = globalConfig.basePath + "/abTest/check?testStrategyId="+self.res.testStrategyId+"&status="+type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作完成");
                    self.res.strategyStatus=type;
                    self.checkShow(self.detail);
                    $('#chcnkModal2').hide();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 查看-结束弹窗显示
     */
    self.stopClick = function (id) {
        self.stopid = id;
        $('#stop').show();
    }

    /**
     * 版本详情
     */
    self.versionDetail = function (versionId) {
        $('#versionDetail').show();
        var url = globalConfig.basePath+"/abTest/versionDetail?versionId="+versionId;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.version = data.data.resp;
                    console.log(self.version,"查询出来的版本详情信息");
                    var jfValue = new Array();
                    var jfRuleId = new Array();
                    var index = new Array();
                    if (self.version.touchContent[0].attrValue=="JIFEN"){
                        for (var i = 0;i < self.version.touchContent.length;i++){
                        if (self.version.touchContent[i].attrKey == "奖励描述"){
                            index.push(i);
                        }
                        if (self.version.touchContent[i].attrKey == "奖励内容（卡券id/积分个数）"){
                            jfValue.push(self.version.touchContent[i].attrValue)
                        }
                        if (self.version.touchContent[i].attrKey=="积分规则id"){
                            jfRuleId.push(self.version.touchContent[i].attrValue);
                            console.log(jfRuleId,"积分规则ID");
                        }

                    }

                    }
                    if (jfValue && jfRuleId){
                        for (var i = 0;i < index.length;i++){
                            $.ajax({
                                url:globalConfig.basePath+"/smart_marketing/initiative/getIntegralId?jfRuleId="+jfRuleId[i],
                                type:"get",
                                dataType:"json",
                                contentType:"text/html;charset=utf-8",
                                data:jfRuleId[i],
                                async: false,
                                success:function (data) {
                                    console.log("校验数据返回",data);
                                    if (data.code=='000' && data.resp.code=='2000'){

                                        self.version.touchContent[index[i]].attrValue  = '积分-'+jfValue[i]+'-剩余额度:'+data.resp.data.availablePoint;

                                    }
                                }

                            })
                        }
                    }


                    self.touchContentList = data.data.resp.touchContent;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 关闭版本详情
     */
    self.versionClose = function () {
        $('#versionDetail').hide();
    }

    /**
     * 发布显示
     */
    self.fabu = {};
    self.fabuShow = function (param) {
        self.fabu = param;
        $('#fabu').show();
        self.findChannelGroups();
    }

    /**
     * 取消发布
     */
    self.noFabuShow = function () {
        $('#fabu').hide();
    }

    /**
     * 确认发布
     */
    self.confirmFabu = function () {
        var validTime = $("#startTime").val();//上线时间
        var invalidTime = $("#endTime").val();//下线时间
        var userTagType = self.memberListName;//名单类型
        var userTag = self.memberListId;//名单id
        if(validTime==null ||validTime==''){
            alert("请输入上线时间");
            return;
        }
        if(invalidTime==null ||invalidTime==''){
            alert("请输入下线时间");
            return;
        }
        if(userTagType==null ||userTagType==''){
            alert("请选择名单");
            return;
        }

        var url = globalConfig.basePath+"/abTest/publishStrategy?validTime="+validTime+
            "&invalidTime="+invalidTime+
            "&strategyVersionId="+ self.fabu.versionId +
            "&testStrategyId=" + self.res.testStrategyId +
            "&userTag=" + userTag +
            "&userTagType=" + userTagType;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    alert(data.data.message);
                    $("#fabu").hide();
                    //重新查询查看页
                    // self.checkShow(self.testStrategyId);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**=================================名单查询@开始========================*/

    /**用户策略类型初始化*/
    self.strategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyList = data.data.resp;
                    self.memberListName= "NO_RULE"
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
        var channelCode = self.search.channelCode;
        if (self.memberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch1').hide();
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.memberListName
            $http.post(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strChannelGroups = data.data.resp;
                        if (self.strChannelGroups.length > 0) {
                            $('#userNameLikeSearch1').show();
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

    /**=================================名单查询@结束========================*/

    /**++++++++++++++++++++++++++++++++++查看操作@结束++++++++++++++++++++++++++*/

    /**++++++++++++++++++++++++++++++++++新增实验操作@开始++++++++++++++++++++++++++*/


    self.queryTagSelectList = function(){
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode=" + self.search.channelCode+"&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if(userData.code!="000"){
                    alert(userData.message)
                    return;
                }
                if(userData.resp.success!=true){
                    alert(userData.resp.message)
                    return;
                }
                self.tagSelectList = userData.resp.data;
            }
        });
    }

    self.addAbTest = function () {
        self.addshow=null;
        self.add={};
        self.add.tabel1={};
        self.add.tabel1.channelCode='WK';
        self.addshow=1;
        self.showTable=3;
        //其他版本集合
        self.otherConfigVersionList=[];
        //原始版本
        self.ysConfigVersion={};

        //默认初始化服务类型
        self.serviceSelectCreateAdd(12,self.add.tabel1.channelCode);
        self.strategyReload2();
        self.showYuQiStatus();
    }

    /**
     * 预期状态展示
     */
    self.showYuQiStatus = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=9";
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel1.expResultStatus = '';
                    self.addExpResultList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 初始化服务类型
     */
    self.serviceSelectCreateAdd = function (type,code) {
        var url = globalConfig.basePath + "/operation/init/byKey?type="+type+"&code="+code;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    if(type==12){
                        self.add.tabel1.serviceCode = '';
                        self.add.tabel1.userCode = '';
                        self.add.tabel1.expResultStatus = '';
                        self.addServiceCodeList = data.data.resp;
                    }else if(type==13){
                        self.add.tabel1.userCode = '';
                        self.add.tabel1.expResultStatus = '';
                        self.addUserCodeList = data.data.resp;
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    /**
     * 添加渠道改变事件
     * @param channelCode
     */
    self.addChannelChange = function (channelCode) {
        self.add.tabel1.memberCount=null;
        self.serviceSelectCreateAdd(12,channelCode)
        self.changePlatformValue2();
        //self.addTagSelectList(channelCode);
        self.tagSelectListChange(channelCode);
    }

    /**
     * 查询名单用户数
     */
    self.queryMemberCount = function () {
        var userTagCode = self.add.tabel1.memberListId;
        var channelCode = self.add.tabel1.channelCode;
        if(null == userTagCode || "" == userTagCode){
            alert("请选择名单");
            return;
        }
        var url = globalConfig.basePath + "/abTest/getTagInfo?userTagCode="+userTagCode+"&channelCode="+channelCode;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel1.memberCount = data.data.resp.rosterCount;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )

    }

    /**
     * 添加用户行为触发事件
     */
    self.xingweiChange = function (userCode) {
        self.chufaQuery();
        self.add.tabel1.triggerNode=null;
        $('#yesInputConfig').prop('checked',false);
        $("#noConfig").prop('checked',true);
        self.add.tabel1.selectParamList =[];
        self.add.tabel1.textParamList =[];
        self.add.tabel1.numberParamList =[];
    }

    /**
     * 进入第二步-场景配置
     */
    self.getInto2 = function () {
        //数据校验
        if(self.add.tabel1.serviceCode=="" || self.add.tabel1.serviceCode==null || self.add.tabel1.serviceCode==0){
            alert("服务类型不能为空");
            return;
        }
        if(self.add.tabel1.userCode=="" || self.add.tabel1.userCode==null || self.add.tabel1.userCode==0){
            alert("用户行为不能为空");
            return;
        }
        if(self.add.tabel1.expResultStatus=="" || self.add.tabel1.expResultStatus==null ||self.add.tabel1.expResultStatus==0){
            alert("预期状态不能为空");
            return;
        }
        if(self.add.tabel1.strategyCycle == null || self.add.tabel1.strategyCycle == '' || self.add.tabel1.strategyCycle < 1 || self.add.tabel1.strategyCycle >7 ){
            alert("执行触达后xxx自然日内有效只能在1到7之间");
            return;
        }
        if(self.add.tabel1.touchTimeCount == null || self.add.tabel1.touchTimeCount == '' || self.add.tabel1.touchTimeCount < 1 || self.add.tabel1.touchTimeCount >30 ){
            alert("限制配置n个自然日只能在1到30之间");
            return;
        }
        if(self.add.tabel1.touchCount == null ||self.add.tabel1.touchCount == '' || self.add.tabel1.touchCount < 1 || self.add.tabel1.touchCount >10 ){
            alert("限制配置最多触发n次只能在1到10之间");
            return;
        }
        // if(self.add.tabel1.memberListId == null || self.add.tabel1.memberListId == ''){
        //     alert("请选择名单");
        //     return;
        // }
        if(self.add.tabel1.memberListId!=null && self.add.tabel1.memberCount!=null && self.add.tabel1.memberCount < 5000){
            alert("用户名单数量："+self.add.tabel1.memberCount + ",小于5000");
            return;
        }
        $('.s-step0>b>b,.s-step0>p,.s-step0>em').removeClass('active');
        $('.s-step1>b>b,.s-step1>p,.s-step1>em').addClass('active');
        self.addshow=2;

        angular.forEach(self.addServiceCodeList,function (each) {
            if(each.key==self.add.tabel1.serviceCode){
                self.add.tabel1.serviceCodeName=each.value;
            }
        })
        angular.forEach(self.addUserCodeList,function (each) {
            if(each.key==self.add.tabel1.userCode){
                self.add.tabel1.userCodeName=each.value;
            }
        })

        if(self.add.tabel1.serviceCode !='QB_USER_DEFINED' && self.add.tabel1.serviceCode !='WK_USER_DEFINED' ){
            if(self.add.tabel1.triggerNode==null || self.add.tabel1.triggerNode==''){
                self.add.tabel1.triggerNode = self.addTriggerNodeList[0].key;
            }
        }
        if(null==self.add.tabel1.IS_EFFECT || '' == self.add.tabel1.IS_EFFECT){
            self.add.tabel1.IS_EFFECT=0;
        }
    }

    /**
     * 上一步
     */
    self.getInto1 = function(){
        self.addshow=1;
        $('.s-step0>b>b,.s-step0>p,.s-step0>em').addClass('active');
        $('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active');
    }



    /**
     * 触发节点查询
     */
    self.chufaQuery = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=1&code=" + self.add.tabel1.userCode;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.addTriggerNodeList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 是配置触发策略
     * @param rad
     */
    self.radioChange = function (rad) {
        if(rad=="0"){
            self.add.tabel1.textParamList =[];
            self.add.tabel1.numberParamList =[];
            self.add.tabel1.numberParamList =[];
            self.add.tabel1.checkboxParamList =[];
            $('#yesInputConfig').prop('checked',false);
            $("#noConfig").prop('checked',true);
        }else{
            $('#noConfig').prop('checked',false);
            $("#yesInputConfig").prop('checked',true);
            self.add.tabel1.IS_EFFECT==1;
            self.add.tabel1.checkboxParamList =[];
            self.bankInfoList();
        }
        self.add.tabel1.IS_EFFECT = rad +'';
        if(self.add.tabel1.IS_EFFECT==1){
            self.queryOkDeploy();
        }
    }


    /**
     * 查询可配置策略
     */

    self.queryOkDeploy = function () {
        self.add.tabel1.selectParamList =[];
        self.add.tabel1.textParamList =[];
        self.add.tabel1.numberParamList =[];
        var url = globalConfig.basePath + "/operation/init/byKey?node="+self.add.tabel1.triggerNode;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    var result = data.data.resp;
                    //所有的头list
                    var noneList = [];
                    angular.forEach(result,function (each) {
                        if(each.type=="none"){
                            noneList.push(each);
                        }
                    })
                    angular.forEach(noneList,function (each) {
                        var dataList = [];
                        angular.forEach(result,function(eachParent){
                            if(each.ownCode == eachParent.parentCode){
                                dataList.push(eachParent);
                            }
                        })
                        if(dataList[0].type=="select"){
                            self.add.tabel1.selectParam ={};
                            self.add.tabel1.selectParam.param = each;
                            self.add.tabel1.selectParam.list = dataList;
                            self.add.tabel1.selectParamList.push(self.add.tabel1.selectParam);
                        }else if(dataList[0].type=="text"){
                            self.add.tabel1.textParam ={};
                            self.add.tabel1.textParam.param = each;
                            self.add.tabel1.textParam.list = dataList;
                            self.add.tabel1.textParamList.push(self.add.tabel1.textParam);
                        }else if(dataList[0].type=="number"){
                            self.add.tabel1.numberParam ={};
                            self.add.tabel1.numberParam.param = each;
                            self.add.tabel1.numberParam.list = dataList;
                            self.add.tabel1.numberParamList.push(self.add.tabel1.numberParam);

                        }

                    })
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 触发节点改变
     */
    self.triggerChange = function(){
        $('#yesInputConfig').prop('checked',false);
        $("#noConfig").prop('checked',true);
        self.add.tabel1.selectParamList =[];
        self.add.tabel1.textParamList =[];
        self.add.tabel1.numberParamList =[];
        self.add.tabel1.checkboxParamList =[];
        self.add.tabel1.IS_EFFECT=0;


    }


    self.addTagSelectList = function(code){
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode=" + self.search.channelCode+"&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if(userData.code!="000"){
                    alert(userData.message)
                    return;
                }
                if(userData.resp.success!=true){
                    alert(userData.resp.message)
                    return;
                }
                self.addtagSelectList = userData.resp.data;
            }
        });
    }
    self.addTagSelectList();
    /**
     * 第二步跳转第三步(下一步)s
     */
    self.getInto3 = function () {
        self.add.tabel1.strategyCondition=[];
        if( !self.valInputIsNull('SUM_MIN_FAIL_COUNT','累计失败次数范围' + '不能为空') ){
            return;
        }else{
            if($('#SUM_MIN_FAIL_COUNT').length>0){
                var param = {};
                param.strategyConditionKey = 'SUM_MIN_FAIL_COUNT';
                param.strategyConditionValue = $('#SUM_MIN_FAIL_COUNT').val();
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if( !self.valInputIsNull('SUM_MAX_FAIL_COUNT','累计失败次数范围' + '不能为空') ){
            return;
        }else{
            if($('#SUM_MAX_FAIL_COUNT').length>0){
                var param = {};
                param.strategyConditionKey = 'SUM_MAX_FAIL_COUNT';
                param.strategyConditionValue = $('#SUM_MAX_FAIL_COUNT').val();
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if( !self.valInputIsNull('SUM_MIN_AMOUNT','累计最小金额' + '不能为空') ){
            return;
        }else{
            if($('#SUM_MIN_AMOUNT').length>0) {
                var param = {};
                param.strategyConditionKey = 'SUM_MIN_AMOUNT';
                param.strategyConditionValue = $('#SUM_MIN_AMOUNT').val();
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if( !self.valInputIsNull('SUM_MAX_AMOUNT','累计最大金额' + '不能为空') ){
            return;
        }else{
            if($('#SUM_MAX_AMOUNT').length>0) {
                var param = {};
                param.strategyConditionKey = 'SUM_MAX_AMOUNT';
                param.strategyConditionValue = $('#SUM_MAX_AMOUNT').val();
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if( !self.valInputIsNull('THIS_MIN_AMOUNT','当此最小金额' + '不能为空') ){
            return;
        }else{
            if($('#THIS_MIN_AMOUNT').length>0) {
                var param = {};
                param.strategyConditionKey = 'THIS_MIN_AMOUNT';
                param.strategyConditionValue = $('#THIS_MIN_AMOUNT').val();
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if( !self.valInputIsNull('THIS_MAX_AMOUNT','当此最大金额' + '不能为空') ){
            return;
        }else{
            if($('#THIS_MAX_AMOUNT').length>0) {
                var param = {};
                param.strategyConditionKey = 'THIS_MAX_AMOUNT';
                param.strategyConditionValue = $('#THIS_MAX_AMOUNT').val();
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if( !self.valInputIsNull('SUM_TIME_COUNT','累计计算有效期 ' + '不能为空') ){
            return;
        }else{
            if($('#SUM_TIME_COUNT').length>0) {
                var param = {};
                param.strategyConditionKey = 'SUM_TIME_COUNT';
                param.strategyConditionValue = 1;
                self.add.tabel1.strategyCondition.push(param);
            }
        }
        if(self.add.tabel1.serviceCode =='QB_USER_DEFINED' || self.add.tabel1.serviceCode =='WK_USER_DEFINED' ){
            //self.add.tabel1.triggerNode = $("#tagSelectListid option:selected").val();
            var data = "";
            var queryInfo = $(".query-info");
            for (var i = 0; i < queryInfo.length; i++) {
                var queryList = queryInfo.eq(i).find(".query-list");
                for (var j = 0; j < queryList.length; j++) {
                    if (queryList.eq(j).find(".inp1 select").val() != null) {
                        var param = {};
                        param.strategyConditionKey = "REALTIME_TAG",
                            param.strategyConditionValue =  queryList.eq(j).find(".inp1 select").val(),
                        self.add.tabel1.strategyCondition.push(param);
                        self.add.tabel1.REALTIME_TAG = queryList.eq(j).find(".inp1 select").val();
                        self.add.tabel1.triggerNode = queryList.eq(j).find(".inp1 select").val();
                        for (let k = 0; k < self.addtagSelectList.length; k++) {
                            if(self.add.tabel1.triggerNode == self.addtagSelectList[k].english){
                                var param1 = {};
                                self.add.tabel1.REALTIME_TYPE = self.addtagSelectList[k].option;
                                param1.strategyConditionKey = "REALTIME_TYPE",
                                param1.strategyConditionValue =self.add.tabel1.REALTIME_TYPE
                                self.add.tabel1.strategyCondition.push(param1);
                            }
                        }
                    }
                    //判断是否存在多选
                    if (queryList.eq(j).find("[type=checkbox]").length > 0) {
                        var checkboxList = queryList.eq(j).find("[type=checkbox]");
                        for (var z = 0; z < checkboxList.length; z++) {
                            data = checkboxList.eq(z).val();
                        }
                    } else {
                        if (queryList.eq(j).find(".inp2 select").val() != null) {
                            var param = {};
                                param.strategyConditionKey= "REALTIME_CRITERIA",
                                    param.strategyConditionValue =queryList.eq(j).find(".inp2 select").val()
                            self.add.tabel1.strategyCondition.push(param);
                            self.add.tabel1.REALTIME_CRITERIA = queryList.eq(j).find(".inp2 select").val();
                        }
                    }
                    //特殊处理between,使用逗号分割
                    if (queryList.eq(j).find(".inp2 select").val() != null) {
                        var param = {};
                        if (queryList.eq(j).find(".inp2 select").val() == "between") {
                            var startTime = queryList.eq(j).find(".dateno1").eq(0).val();//between对应的开始日期
                            var endTime = queryList.eq(j).find(".dateno2").eq(0).val();//between对应的结束日期
                            var param = {};
                                param.strategyConditionKey = "REALTIME_VALUE",
                                    param.strategyConditionValue =  "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime
                            self.add.tabel1.strategyCondition.push(param);
                            self.add.tabel1.REALTIME_VALUE = "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime

                        } else {
                            var param = {};
                                param.strategyConditionKey = "REALTIME_VALUE",
                                    param.strategyConditionValue = queryList.eq(j).find(".inp3 input").val()
                                 self.add.tabel1.strategyCondition.push(param);
                                 self.add.tabel1.REALTIME_VALUE = queryList.eq(j).find(".inp3 input").val();
                        }
                    }
                }
            }
        }

        //预期结果银行
            if(self.add.tabel1.expResultStatus == 'BANK_OPEN_SUCCESS' ||self.add.tabel1.expResultStatus == 'BANK_PAY_SUCCESS'){
                var str = "";
                $(".addyqBankCode").each(function () {
                    if(this.checked==true){
                        str += $(this).val() + ",";
                    }
                })
                var checkdbanks = str.substring(0,str.length-1);
                if (checkdbanks != null) {
                    self.add.tabel1.bankCode  = checkdbanks;
                }else{
                    alert("请添加银行选项");
                    return
                }
        }

        var url = globalConfig.basePath + "/abTest/validate";
        $http.post(url, self.GetValidateJsonData()).then(
            function (data) {
                if (data.data.code == '000') {
                    self.addshow=3;
                    $('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active');
                    $('.s-step2>b>b,.s-step2>p,.s-step2>em').addClass('active');
                    self.showVersion=0;//是否添加了原始版本0否,1是
                    //默认值变量
                    self.isConfigValable=1;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }

     self.GetValidateJsonData = function() {
        var json = {
            "channel": self.add.tabel1.channelCode,				    //渠道
            "serviceTypeCode": self.add.tabel1.serviceCode,		    //服务类型
            "userActionCode": self.add.tabel1.userCode,			    //用户行为
            "strategyResult": self.add.tabel1.expResultStatus,	    //预期结果状态
            "strategyCycle": self.add.tabel1.strategyCycle,		    //执行触达后xxx自然日内有效
            "userTagType": self.add.tabel1.memberListName,		    //名单类型
            "userTag": self.add.tabel1.memberListId,			    //用户名单
            "touchTimeCount": self.add.tabel1.touchTimeCount,	    //限制配置：n个自然日
            "touchCount": self.add.tabel1.touchCount,			    //限制配置：最多触发n次
            "touchCountType": 'NATUREDAY',						    //限制配置：1个自然日内最多触发
            "IS_EFFECT": self.add.tabel1.IS_EFFECT,				    //是否配触发策略
            //"SUM_FAIL_COUNT": $('#SUM_FAIL_COUNT').val(),		    //累计失败次数
            "SUM_MIN_FAIL_COUNT": $('#SUM_MIN_FAIL_COUNT').val(),	//累计失败次数
            "SUM_MAX_FAIL_COUNT": $('#SUM_MAX_FAIL_COUNT').val(),	//累计失败次数
            "SUM_MIN_AMOUNT": $('#SUM_MIN_AMOUNT').val(),		    //累计最小金额
            "SUM_MAX_AMOUNT": $('#SUM_MAX_AMOUNT').val(),		    //累计最大金额
            "THIS_MIN_AMOUNT": $('#THIS_MIN_AMOUNT').val(),		    //当此最小金额
            "THIS_MAX_AMOUNT": $('#THIS_MAX_AMOUNT').val(),		    //当此最大金额
            "SUM_TIME_COUNT": 1,								    //累计计算有效期
            "SUM_TIME_COUNT_TYPE": "NATUREDAY",					    //累计计算有效期单位（NATUREDAY自然日 DAY 天 WEEK周 MONTH 月 YEAR年））
            "touchCode": self.add.tabel1.triggerNode,				//触发节点code
            "REALTIME_TAG":self.add.tabel1.REALTIME_TAG,
            "REALTIME_CRITERIA":self.add.tabel1.REALTIME_CRITERIA,
            "REALTIME_VALUE":self.add.tabel1.REALTIME_VALUE,
            "REALTIME_TYPE":self.add.tabel1.REALTIME_TYPE,
            "bankCode":self.add.tabel1.bankCode
        };
        return json;
    };

     self.valInputIsNull = function(id,msg){
        var result = true;
        if( $('#'+id).length > 0){
            var value = $('#'+id).val();
            if( value == null || value == ''){
                alert(msg);
                result = false;
            }
        }

        return result;
    }

    //=====================================添加1名单查询@开始===============================================
    /**用户策略类型初始化*/
    self.strategyReload2 = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel1.strategyList = data.data.resp;
                    self.add.tabel1.memberListName= "NO_RULE"
                    self.findChannelGroups2();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.findChannelGroups2 = function () {
        var channelCode = self.add.tabel1.channelCode;
        if (self.add.tabel1.memberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch2').hide();
            self.add.tabel1.memberCount=null;
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.add.tabel1.memberListName
            $http.post(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.add.tabel1.strChannelGroups = data.data.resp;
                        if (self.add.tabel1.strChannelGroups.length > 0) {
                            $('#userNameLikeSearch2').show();
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

    self.changePlatformValue2 = function () {
        self.findChannelGroups2();
    }

    self.changeFindChannelGroups2 = function () {
        self.findChannelGroups2();
    }
    //=====================================添加1名单查询@结束===============================================

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%添加第三块@开始%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    /**
     * 第三部
     */
    self.d3b = function () {
        self.addshow=1;
        self.showTable=3;
        self.addshow=3;
        $('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active');
        $('.s-step2>b>b,.s-step2>p,.s-step2>em').addClass('active')
        self.showVersion=0;//是否添加了原始版本0否,1是

    }

    /**
     * 添加原始版本(0原始版本,1其他版本)
     */

    self.addConfig = function (type) {

        self.add.tabel3={};
        //添加版本
        self.add.tabel3.yuanshiVersion={};
        if(self.isConfigValable==1){
            //可修改变量值(用于显示)
            self.varableTests="";
        }

        if(type==0){
            angular.forEach(self.varableList,function (each) {
                if($('#'+each.key).is("select")){
                    $('#'+each.key).removeAttr("disabled");
                }else{
                    $('#'+each.key).removeAttr("readonly");
                }
            })
            //触达类型
            $("#strategyType").removeAttr("disabled");
            //触达方式
            $("#touchWay").removeAttr("disabled");
            self.add.tabel3.yuanshiVersion.verName = '原始版本';
            self.add.tabel3.yuanshiVersion.headVerName = '原始版本';
            // 触达类型
            self.chudaType();
        }else{
            if(self.otherConfigVersionList.length>=20){
                alert("最多可添加20个子版本");
                return;
            }
            if(self.showVersion==0){
                alert("请添加原始版本")
                return;
            }
            angular.copy(self.ysConfigVersion,self.add.tabel3.yuanshiVersion);
            if(self.isConfigValable==2){
                //全部变量只读
                angular.forEach(self.varableList,function (each) {
                    //变量修改
                    if(self.canUpdateAttribute.indexOf(each.key) != -1){
                        if($('#'+each.key).is("select")){
                            $('#'+each.key).removeAttr("disabled");
                        }else{
                            $('#'+each.key).removeAttr("readonly");
                            $('#'+each.key).val("");
                        }
                    }else{
                        if($('#'+each.key).is("select")){
                            $('#'+each.key).attr("disabled", "true");
                        }else{
                            $('#'+each.key).attr("readonly", "readonly");
                        }
                    }

                })

                //触达方式
                $("#touchWay").attr("disabled", true);
            }else{
                //修改触达方式触达方式
                $("#touchWay").attr("disabled", false);
            }

            //触达类型
            $("#strategyType").attr("disabled", true);
            //版本描述置空
            $("#verDesc").val("");
            self.add.tabel3.yuanshiVersion.verDesc=null;
            var number = parseInt(self.otherConfigVersionList.length)+1;
            self.add.tabel3.yuanshiVersion.verName = '版本'+number;
            self.add.tabel3.yuanshiVersion.headVerName = '版本'+number;
        }
        $("#verName").attr("readonly", "readonly");
        $('#chuDaConfigModal').show();
    }

    /**
     * 修改版本type=0  主版本 type==1 other版本
     * @param type
     */
    self.updateConfig = function (type,param) {
        if(type==0){
            //全部变量只读
            angular.forEach(self.varableList,function (each) {
                if($('#'+each.key).is("select")){
                    $('#'+each.key).removeAttr("disabled");
                }else{
                    $('#'+each.key).removeAttr("readonly");
                }
            })
            //触达类型
            $("#strategyType").removeAttr("disabled");
            //触达方式
            $("#touchWay").removeAttr("disabled");
            angular.copy(self.ysConfigVersion,self.add.tabel3.yuanshiVersion);
            self.showVersion=2;
        }else{
            self.index = self.otherConfigVersionList.indexOf(param);
            angular.copy(param,self.add.tabel3.yuanshiVersion);
            self.showVersion=3;
        }
        $('#chuDaConfigModal').show();
    }

    /**
     * 触达类型
     */
    self.chudaType = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=4";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel3.yuanshiVersion.strategyTypeList=data.data.resp;
                    self.add.tabel3.yuanshiVersion.strategyType = self.add.tabel3.yuanshiVersion.strategyTypeList[0].key;
                    self.chudaModeQuery();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 触达类型联动(触达方式)
     */
    self.chudaModeQuery = function () {
        self.add.tabel3.yuanshiVersion.awardContentDto=[];
        var url = globalConfig.basePath + "/operation/init/byKey?type=5&code="+self.add.tabel3.yuanshiVersion.strategyType;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel3.yuanshiVersion.strategyWayList = data.data.resp;
                    self.add.tabel3.yuanshiVersion.touchWay = self.add.tabel3.yuanshiVersion.strategyWayList[0].key;
                    self.tiaoZhuanUrl();
                    self.queryStrategyTime();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 查询跳转链接
     */
    self.tiaoZhuanUrl = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=6";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel3.yuanshiVersion.skipTypeList = data.data.resp;
                    self.add.tabel3.yuanshiVersion.skipType = data.data.resp[0].key;
                    self.bindSkipTypeChange()
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 跳转类型查询
     */
    self.bindSkipTypeChange = function () {
        if(self.add.tabel3.yuanshiVersion.skipType=='URL'){
            return;
        }
        var type = '';
        if(self.add.tabel1.channelCode == 'WK'){
            type=17;
        }
        if(self.add.tabel1.channelCode == 'QB'){
            type=18;
        }
        var url = globalConfig.basePath + "/operation/init/byKey?type="+type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel3.yuanshiVersion.PAGE_TYPEList = data.data.resp;
                    self.add.tabel3.yuanshiVersion.PAGE_TYPE = data.data.resp[0].key;
                    self.bindPageTypeChange();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 根据页面类型绑定原生跳转地址
     */
    self.bindPageTypeChange = function () {
        if(self.add.tabel3.yuanshiVersion.skipType=='URL'){
            return;
        }
        var url = globalConfig.basePath + "/operation/init/byKey?type=19&code="+self.add.tabel3.yuanshiVersion.PAGE_TYPE;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGEList = data.data.resp;
                    self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE = data.data.resp[0].key;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 触达时间查询
     */
    self.queryStrategyTime = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=7";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    var res = data.data.resp
                    var strategyWaySelectVal = self.add.tabel3.yuanshiVersion.touchWay;
                    self.add.tabel3.yuanshiVersion.strategyTimeList=[];
                    for (var i = 0; i < res.length; i++) {
                        if(strategyWaySelectVal!="MESSAGE"&&strategyWaySelectVal!="PUSH"&&strategyWaySelectVal!="PUSH_MAIL"){
                            if(res[i].key=="SMARTTOUCH"){
                                continue ;
                            }
                        }
                        self.add.tabel3.yuanshiVersion.strategyTimeList.push(res[i]);
                    }
                    self.add.tabel3.yuanshiVersion.strategyTime=self.add.tabel3.yuanshiVersion.strategyTimeList[0].key;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 关闭原始版本配置
     */
    self.closeChuDaBtn = function () {
        if(self.showVersion==2){
            self.showVersion=1;
        }else if(self.showVersion==3){
            self.showVersion=1;
        }
        if(self.index != null){
            self.index = null;
        }
        $('#chuDaConfigModal').hide();
    }

    /**
     * 添加奖励
     */
    self.addAction = function () {
        self.addJiangliParam={};
        self.addJiangliParam.awardType='CARD';
        $('#jiangliShow').show();
    }

    /**
     * 关闭奖励
     */
    self.closeJiangli = function () {
        $('#jiangliShow').hide();
    }


    /**
     * 查询积分额度
     * @param x
     * @param updateNumber
     */
    self.selectintegral = function(x){
        var allContent = null;
        if (self.addJiangliParam.awardType=='JIFEN'){
            var jifenValue = x.jifenValue;
            var productChannel=0;
            if(self.add.tabel1.channelCode == 'QB'){
                productChannel=1;
            }else if(self.add.tabel1.channelCode == 'WK'){
                productChannel=2;
            }

                $.ajax({
                    url:globalConfig.basePath+"/smart_marketing/initiative/checkPointRuleId?pointRuleId=" + x.jfRuleId+"&productChannel="+productChannel+"&scene=9",
                    type:"get",
                    dataType:"json",
                    contentType:"text/html;charset=utf-8",
                    data:x.jfRuleId,
                    async: false,
                    success:function (data) {
                        console.log("校验数据返回",data);
                        if (data.code=='000'){
                            if (typeof (data.resp.data) == "undefined" || !data.resp.data){
                                alert("积分规则不存在，请重试!");
                                return;
                            }else if (data.resp.data.status =='0' || data.resp.data.status =='9'){
                                alert("积分规则不在有效期内，请重试!");
                                return;
                            }
                            else if (data.resp.data.status == '2'){
                                alert("该积分规则无法使用，请重试!");
                                return;
                            }else {
                                allContent = '积分-'+jifenValue+'-剩余额度:'+data.resp.data.availablePoint;

                            }
                        }else{
                            alert(data.message);
                            return;
                        }
                    }

                })


            }
        return allContent;
        }

    /**
     * 确认添加奖励
     */

    self.addJiangliParam={};
    self.addJiangli = function () {
        if(self.add.tabel3.yuanshiVersion.awardContentDto.length>=5){
            alert("最多添加五个奖励");
            return;
        }
        var param2 = new Object();
        //卡券
        if(self.addJiangliParam.awardType=='CARD' || self.addJiangliParam.awardType=='newCoupon' || self.addJiangliParam.awardType=='mallCoupon'){
            if(self.addJiangliParam.cardId==null || self.addJiangliParam.cardId==''||self.addJiangliParam.cardId=='undefined'){
                alert("卡券id不能为空")
                return;
            }
            // 奖励类型
            var awardType = self.addJiangliParam.awardType;
            var awardContent = self.addJiangliParam.cardId;
            var param = new Object();
            param.channel = self.add.tabel1.channelCode;
            param.couponId = awardContent;
            param.awardType=awardType;
            var url = globalConfig.basePath + "/prize/getCouponName";
            $http.post(url,param).then(
                function (data) {
                    if (data.data.code == '000') {
                        //卡券名称
                        var couponName = data.data.couponName;
                        //卡券面值
                        var discount = data.data.discount;
                        param2.awardContent=awardContent;
                        param2.awardType=awardType;
                        param2.awardDesc = awardContent+"-"+data.data.resp.couponName+"-"+data.data.resp.couponTypeName+"-"+data.data.resp.discount+"-"+data.data.resp.couponCount;
                        param2.openCardHelp=0;
                        self.add.tabel3.yuanshiVersion.awardContentDto.push(param2);
                        $('#jiangliShow').hide();
                        self.addJiangliParam.cardId=null;
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        }else{

            if ( !self.addJiangliParam.jfRuleId){
                alert("积分规则id不能为空!");
                return;
            }
            if(self.addJiangliParam.jifenValue==null ||self.addJiangliParam.jifenValue==''||self.addJiangliParam.jifenValue=='undefined'){
                alert("积分不能为空")
                return;
            }
            if(self.addJiangliParam.jifenDesc==null ||self.addJiangliParam.jifenDesc==''||self.addJiangliParam.jifenDesc=='undefined'){
                alert("积分描述不能为空")
                return;
            }
            var awardDesc = self.selectintegral(self.addJiangliParam);
            if (!awardDesc){
                return;
            }
            var awardType = self.addJiangliParam.awardType;
            var awardContent = self.addJiangliParam.jifenValue;

                param2.awardContent=awardContent;
                param2.awardType=awardType;
                param2.awardDesc = awardDesc;
                param2.jiFenDesc=self.addJiangliParam.jifenDesc;
                param2.jfRuleId = self.addJiangliParam.jfRuleId;


            self.add.tabel3.yuanshiVersion.awardContentDto.push(param2);
            $('#jiangliShow').hide();
            self.addJiangliParam.jifenValue=null;
            self.addJiangliParam.jifenDesc=null;
        }
        //放入版本
        // self.add.tabel3.yuanshiVersion.awardContentDto = angular.copy(self.add.tabel3.yuanshiVersion.awardContentDto);
        self.addJiangliParam={};
    }

    /**
     * 删除奖励
     */
    self.deleteAction = function (param) {
        var indexOf = self.add.tabel3.yuanshiVersion.awardContentDto.indexOf(param);
        if (confirm('确定要删除吗?')) {
            if (indexOf > -1) {
                self.add.tabel3.yuanshiVersion.awardContentDto.splice(indexOf, 1);
            }
        }
    }

    /**
     * 保存原始版本
     */
    self.saveChuDaBtn = function (type) {

        //region  **版本信息处理
        //版本描述
        if(null == self.add.tabel3.yuanshiVersion.verDesc || '' == self.add.tabel3.yuanshiVersion.verDesc){
           alert("请输入版本描述");
           return;
        }

        //触达类型
        if(null == self.add.tabel3.yuanshiVersion.strategyType || '' == self.add.tabel3.yuanshiVersion.strategyType){
            alert("请选择触达类型");
            return;
        }
        //QA
        if('QA'==self.add.tabel3.yuanshiVersion.strategyType){
            if(null == self.add.tabel3.yuanshiVersion.touchWay || '' == self.add.tabel3.yuanshiVersion.touchWay){
               alert("请选择触达触达方式");
               return;
            }
        }
        //在线客服/电话客服
        else if('CUSTOMER_SERVICE' == self.add.tabel3.yuanshiVersion.strategyType || 'PHONE' == self.add.tabel3.yuanshiVersion.strategyType){
            //触达时间
            if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                alert("请选择触达时间");
                return;
            }
        }
        //奖+自定义
        else if('AWARD'==self.add.tabel3.yuanshiVersion.strategyType || 'USER_DEFINED'==self.add.tabel3.yuanshiVersion.strategyType){
            //奖励时多奖励
            if('AWARD'==self.add.tabel3.yuanshiVersion.strategyType && self.add.tabel3.yuanshiVersion.awardContentDto.length<1){
                alert("请选择奖励类型");
                return;
            }
            //奖励＋软弹窗显示
            if('AWARD'==self.add.tabel3.yuanshiVersion.strategyType && self.add.tabel3.yuanshiVersion.touchWay=='SOFT_POPUP'){
                if(null == self.add.tabel3.yuanshiVersion.POP_PAGE_CONTENT || "" == self.add.tabel3.yuanshiVersion.POP_PAGE_CONTENT){
                    alert("请填写弹窗内容");
                    return;
                }
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.add.tabel3.yuanshiVersion.strategyTime=='SMARTTOUCH'){
                    if(null == self.add.tabel3.yuanshiVersion.muchTime || '' == self.add.tabel3.yuanshiVersion.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }

            }
            //自定义＋软弹窗
            if('USER_DEFINED' == self.add.tabel3.yuanshiVersion.strategyType && self.add.tabel3.yuanshiVersion.touchWay == 'SOFT_POPUP'){
                if(null == self.add.tabel3.yuanshiVersion.skipType || '' == self.add.tabel3.yuanshiVersion.skipType){
                    alert("请选择跳转类型");
                    return;
                }
                if(self.add.tabel3.yuanshiVersion.skipType=='URL'){
                    if(null == self.add.tabel3.yuanshiVersion.SKIP_URL || '' == self.add.tabel3.yuanshiVersion.SKIP_URL){
                        alert("请填写链接地址");
                        return;
                    }
                }
                if(self.add.tabel3.yuanshiVersion.skipType=='PRIMORDIAL'){
                    //面类型
                    if(null == self.add.tabel3.yuanshiVersion.PAGE_TYPE || '' == self.add.tabel3.yuanshiVersion.PAGE_TYPE){
                        alert("请选择页面类型");
                        return;
                    }
                    //跳转页面
                    if(null == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE || '' == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE){
                        alert("请选择跳转页面");
                        return;
                    }
                }
                //弹窗内容
                if(null == self.add.tabel3.yuanshiVersion.POP_PAGE_CONTENT || '' == self.add.tabel3.yuanshiVersion.POP_PAGE_CONTENT){
                    alert("请填写弹窗内容");
                    return;
                }
                //按钮文案
                if(null == self.add.tabel3.yuanshiVersion.BTN_CONTENT || '' == self.add.tabel3.yuanshiVersion.BTN_CONTENT){
                    alert("请填写按钮文案");
                    return;
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
            }
            //弹窗
            if('POPUP'==self.add.tabel3.yuanshiVersion.touchWay){
                //跳转类型
                if(null == self.add.tabel3.yuanshiVersion.skipType || '' == self.add.tabel3.yuanshiVersion.skipType){
                    alert("请选择跳转类型");
                    return;
                }
                //上传图片
                if(null == self.add.tabel3.yuanshiVersion.popPageImg || '' == self.add.tabel3.yuanshiVersion.popPageImg){
                    alert("请上传图片");
                    return;
                }
                //连接地址
                if(self.add.tabel3.yuanshiVersion.skipType=='URL'){
                    if(null == self.add.tabel3.yuanshiVersion.SKIP_URL || '' == self.add.tabel3.yuanshiVersion.SKIP_URL){
                        alert("请填写链接地址");
                        return;
                    }
                }
                if(self.add.tabel3.yuanshiVersion.skipType=='PRIMORDIAL'){
                    //面类型
                    if(null == self.add.tabel3.yuanshiVersion.PAGE_TYPE || '' == self.add.tabel3.yuanshiVersion.PAGE_TYPE){
                        alert("请选择页面类型");
                        return;
                    }
                    //跳转页面
                    if(null == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE || '' == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE){
                        alert("请选择跳转页面");
                        return;
                    }
                }
                //弹窗内容
                if(null == self.add.tabel3.yuanshiVersion.POP_PAGE_CONTENT || '' == self.add.tabel3.yuanshiVersion.POP_PAGE_CONTENT){
                    alert("请填写弹窗内容");
                    return;
                }
                //按钮文案
                if(null == self.add.tabel3.yuanshiVersion.BTN_CONTENT || '' == self.add.tabel3.yuanshiVersion.BTN_CONTENT){
                    alert("请填写按钮文案");
                    return;
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }

            }

            //短信
            if('MESSAGE' == self.add.tabel3.yuanshiVersion.touchWay){
                //短信内容
                if(null == self.add.tabel3.yuanshiVersion.MESSAGE_CONTENT){
                    alert("请填写短信内容");
                    return;
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.add.tabel3.yuanshiVersion.strategyTime=='SMARTTOUCH'){
                    if(null == self.add.tabel3.yuanshiVersion.muchTime || '' == self.add.tabel3.yuanshiVersion.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }
            }

            //站内信
            if('PUSH_MAIL' == self.add.tabel3.yuanshiVersion.touchWay){
                //站内信标题
                if(null == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_TITLE || '' == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_TITLE){
                    alert("请填写站内信标题");
                    return;
                }
                //站内信内容
                if(null == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_CONTENT || '' == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_CONTENT){
                    alert("请填写站内信内容");
                    return;
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.add.tabel3.yuanshiVersion.strategyTime=='SMARTTOUCH'){
                    if(null == self.add.tabel3.yuanshiVersion.muchTime || '' == self.add.tabel3.yuanshiVersion.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }
            }

            //推送
            if('PUSH' == self.add.tabel3.yuanshiVersion.touchWay){
                //跳转类型
                if(null == self.add.tabel3.yuanshiVersion.skipType || '' == self.add.tabel3.yuanshiVersion.skipType){
                    alert("请选择跳转类型");
                    return;
                }
                //连接地址
                if(self.add.tabel3.yuanshiVersion.skipType=='URL'){
                    if(null == self.add.tabel3.yuanshiVersion.SKIP_URL || '' == self.add.tabel3.yuanshiVersion.SKIP_URL){
                        alert("请填写链接地址");
                        return;
                    }
                }
                if(self.add.tabel3.yuanshiVersion.skipType=='PRIMORDIAL'){
                    //面类型
                    if(null == self.add.tabel3.yuanshiVersion.PAGE_TYPE || '' == self.add.tabel3.yuanshiVersion.PAGE_TYPE){
                        alert("请选择页面类型");
                        return;
                    }
                    //跳转页面
                    if(null == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE || '' == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE){
                        alert("请选择跳转页面");
                        return;
                    }
                }
                //标题内容
                if(null == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_TITLE || '' == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_TITLE){
                    alert("请填写标题内容");
                    return;
                }
                //推送内容
                if(null == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_CONTENT || '' == self.add.tabel3.yuanshiVersion.TOUCH_PUSH_CONTENT){
                    alert("请填写推送内容");
                    return;
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.add.tabel3.yuanshiVersion.strategyTime=='SMARTTOUCH'){
                    if(null == self.add.tabel3.yuanshiVersion.muchTime || '' == self.add.tabel3.yuanshiVersion.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }
            }

            //自定义+banner
            if('USER_DEFINED'==self.add.tabel3.yuanshiVersion.strategyType && 'BANNER' == self.add.tabel3.yuanshiVersion.touchWay){
                //banner内容
                if(null == self.add.tabel3.yuanshiVersion.BANNER_CONTENT || '' == self.add.tabel3.yuanshiVersion.BANNER_CONTENT){
                    alert("请填写banner内容");
                    return;
                }
                //按钮文案
                if(null == self.add.tabel3.yuanshiVersion.BANNER_BTN_CONTENT || '' == self.add.tabel3.yuanshiVersion.BANNER_BTN_CONTENT){
                    alert("请填写按钮文案");
                    return;
                }
                //跳转类型
                if(null == self.add.tabel3.yuanshiVersion.skipType || '' == self.add.tabel3.yuanshiVersion.skipType){
                    alert("请选择跳转类型");
                    return;
                }
                //连接地址
                if(self.add.tabel3.yuanshiVersion.skipType=='URL'){
                    if(null == self.add.tabel3.yuanshiVersion.SKIP_URL || '' == self.add.tabel3.yuanshiVersion.SKIP_URL){
                        alert("请填写链接地址");
                        return;
                    }
                }
                if(self.add.tabel3.yuanshiVersion.skipType=='PRIMORDIAL'){
                    //面类型
                    if(null == self.add.tabel3.yuanshiVersion.PAGE_TYPE || '' == self.add.tabel3.yuanshiVersion.PAGE_TYPE){
                        alert("请选择页面类型");
                        return;
                    }
                    //跳转页面
                    if(null == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE || '' == self.add.tabel3.yuanshiVersion.PRIMORDIAL_PAGE){
                        alert("请选择跳转页面");
                        return;
                    }
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
            }

            //奖励+banner
            if('AWARD' == self.add.tabel3.yuanshiVersion.strategyType && 'BANNER' == self.add.tabel3.yuanshiVersion.touchWay){
                //banner内容
                if(null == self.add.tabel3.yuanshiVersion.BANNER_CONTENT || '' == self.add.tabel3.yuanshiVersion.BANNER_CONTENT){
                    alert("请填写banner内容");
                    return;
                }
                //触达时间
                if(null == self.add.tabel3.yuanshiVersion.strategyTime || '' == self.add.tabel3.yuanshiVersion.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
            }
        }
        //endregion
        var versionParam = angular.copy(self.add.tabel3.yuanshiVersion);
        // 原始版本保存
        if(type==0){
            self.showVersion=1;
            self.ysConfigVersion = angular.copy(versionParam);
        }
        ////其他版本
        else if(type==1){
            self.otherConfigVersionList.push(versionParam);
        }
        //修改主版本
        else if(type==2){
            self.showVersion=1;
            if(confirm("是否确认修改原始版本,确认修改将删除其他版本!")){
                self.otherConfigVersionList=[];
                //可修改变量变量key(用于提交)
                self.canUpdateAttribute = "";
                //可修改变量值(用于显示)
                self.varableTests="";
                // 是否配置变量
                self.isConfigValable=1;
                //变量集合
                self.varableList=[];

                self.ysConfigVersion={};
                angular.copy(versionParam,self.ysConfigVersion);
                self.add.tabel3.yuanshiVersion={};
            }

        }
        //其他版本确认修改
        else if(type==3){
            self.otherConfigVersionList[self.index] = self.add.tabel3.yuanshiVersion;
            self.add.tabel3.yuanshiVersion={};
        }
        $('#chuDaConfigModal').hide();
    }

    /**
     * 删除版本
     */
    self.delVersion = function (param) {
        if(param.verName=='原始版本'){
            alert("原始版本不可删除");
            return;
        }
        var indexOf = self.otherConfigVersionList.indexOf(param);
        if(confirm('删除后数据将丢失,您确定要删除吗?')){
            self.otherConfigVersionList.splice(indexOf,1);
        }
    }

    /**
     * 添加变量
     */
    self.addVariable = function () {
        if(self.isConfigValable==1){
            $('#yesSetCdfs').prop('checked',true);
            $("#noSetCdfs").prop('checked',false);
        }else{
            $('#yesSetCdfs').prop('checked',false);
            $("#noSetCdfs").prop('checked',true);
        }
        $('#addVariable').show();

    }

    /**
     * 保存变量弹窗
     */
    self.saveVariableBtn = function () {
        if(confirm("变量修改后其他版本将删除,确认修改吗?")){
            self.otherConfigVersionList=[];
        }


        var variables = "";
        var tests = "";
        $(".checkbox").each(function() {
            if (this.checked == true) {
                var text = $(this).val();
                angular.forEach(self.varableList,function (each) {
                    if(each.key==text){
                        tests += each.value + ";"
                    }
                })
                variables += text+",";
            }
        })
        //可修改变量变量key
        self.canUpdateAttribute = variables.substring(0,variables.length-1);
        //可修改变量值
        self.varableTests = tests;
        $('#addVariable').hide();
    }

    /**
     * 是否改变变量
     */
    self.varableChedkedBtn = function (type) {
        if(type==1 && self.showVersion==1 && self.isConfigValable==2){
            if(confirm("确定修改将删除其他版本信息,确认修改吗?")){
                self.otherConfigVersionList=[];
            }
        }
        self.varableList = [];
        if(type==2 && self.showVersion==0){
            alert('请配置版本');
            $('#yesSetCdfs').prop('checked',true);
            $("#noSetCdfs").prop('checked',false);
            return;
        }
        self.isConfigValable = type;
        if ('QA' == self.ysConfigVersion.strategyType) {
            self.varableList = [];
        }
        //在线客服/电话客服
        else if ('CUSTOMER_SERVICE' == self.ysConfigVersion.strategyType || 'PHONE' == self.ysConfigVersion.strategyType) {
            var param = {};
            param.key = "strategyTime";
            param.value = "触达时间";
            self.varableList.push(param);
        }
        //奖+自定义
        else if ('AWARD' == self.ysConfigVersion.strategyType || 'USER_DEFINED' == self.ysConfigVersion.strategyType) {
            //奖励时多奖励
            if ('AWARD' == self.ysConfigVersion.strategyType && self.ysConfigVersion.awardContentDto.length < 1) {
                var param = {};
                param.key = "strategyType";
                param.value = "奖励类型";
                self.varableList.push(param);
            }
            //奖励＋软弹窗显示
            if ('AWARD' == self.ysConfigVersion.strategyType && self.ysConfigVersion.touchWay == 'SOFT_POPUP') {
                var param = {};
                param.key = "POP_PAGE_CONTENT";
                param.value = "弹窗内容";
                self.varableList.push(param);
                var param2 = {};
                param2.key = "strategyTime";
                param2.value = "触达时间";
                self.varableList.push(param2);
            }
            //自定义＋软弹窗
            if ('USER_DEFINED' == self.ysConfigVersion.strategyType && self.ysConfigVersion.touchWay == 'SOFT_POPUP') {
                var param = {};
                param.key = "skipType";
                param.value = "跳转类型";
                self.varableList.push(param);

                if (self.ysConfigVersion.skipType == 'URL') {
                    var param1 = {};
                    param1.key = "SKIP_URL";
                    param1.value = "链接地址";
                    self.varableList.push(param1);
                }
                if (self.ysConfigVersion.skipType == 'PRIMORDIAL') {
                    //面类型
                    var param2 = {};
                    param2.key = "PAGE_TYPE";
                    param2.value = "页面类型";
                    self.varableList.push(param2);

                    //跳转页面
                    var param3 = {};
                    param3.key = "PRIMORDIAL_PAGE";
                    param3.value = "跳转页面";
                    self.varableList.push(param3);
                }
                //弹窗内容
                var param4 = {};
                param4.key = "POP_PAGE_CONTENT";
                param4.value = "弹窗内容";
                self.varableList.push(param4);

                //按钮文案
                var param5 = {};
                param5.key = "BTN_CONTENT";
                param5.value = "按钮文案";
                self.varableList.push(param5);

                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);

            }

            //弹窗
            if ('POPUP' == self.ysConfigVersion.touchWay) {
                //跳转类型
                var param = {};
                param.key = "skipType";
                param.value = "跳转类型";
                self.varableList.push(param);

                //上传图片
                var param1 = {};
                param1.key = "popPageImg";
                param1.value = "上传图片";
                self.varableList.push(param1);

                //连接地址
                if (self.ysConfigVersion.skipType == 'URL') {
                    //连接地址
                    var param2 = {};
                    param2.key = "SKIP_URL";
                    param2.value = "链接地址";
                    self.varableList.push(param2);
                }

                if (self.ysConfigVersion.skipType == 'PRIMORDIAL') {
                    //面类型
                    var param3 = {};
                    param3.key = "PAGE_TYPE";
                    param3.value = "页面类型";
                    self.varableList.push(param3);

                    //跳转页面
                    var param4 = {};
                    param4.key = "PRIMORDIAL_PAGE";
                    param4.value = "跳转页面";
                    self.varableList.push(param4);
                }

                //弹窗内容
                var param5 = {};
                param5.key = "POP_PAGE_CONTENT";
                param5.value = "弹窗内容";
                self.varableList.push(param5);

                //弹窗内容
                var param6 = {};
                param6.key = "BTN_CONTENT";
                param6.value = "按钮文案";
                self.varableList.push(param6);

                //触达时间
                var param7 = {};
                param7.key = "strategyTime";
                param7.value = "触达时间";
                self.varableList.push(param7);
            }

            //短信
            if('MESSAGE' == self.ysConfigVersion.touchWay){
                //短信内容
                var param1 = {};
                param1.key = "MESSAGE_CONTENT";
                param1.value = "短信内容";
                self.varableList.push(param1);
                //触达时间
                var param2 = {};
                param2.key = "strategyTime";
                param2.value = "触达时间";
                self.varableList.push(param2);

                if(self.ysConfigVersion.strategyTime=='SMARTTOUCH'){
                    ////触达时间
                    var param3 = {};
                    param3.key = "muchTime";
                    param3.value = "时间配置";
                    self.varableList.push(param3);
                }
            }

            //站内信
            if('PUSH_MAIL' == self.ysConfigVersion.touchWay){
                //站内信标题
                var param1 = {};
                param1.key = "TOUCH_PUSH_TITLE";
                param1.value = "站内信标题";
                self.varableList.push(param1);

                //站内信内容
                var param2 = {};
                param2.key = "TOUCH_PUSH_CONTENT";
                param2.value = "站内信内容";
                self.varableList.push(param2);

                //触达时间
                var param3 = {};
                param3.key = "strategyTime";
                param3.value = "择触达时间";
                self.varableList.push(param3);

                if(self.ysConfigVersion.strategyTime=='SMARTTOUCH'){
                    ////触达时间
                    var param4 = {};
                    param4.key = "muchTime";
                    param4.value = "时间配置";
                    self.varableList.push(param4);
                }
            }

            //推送
            if('PUSH' == self.ysConfigVersion.touchWay){
                var param = {};
                param.key = "skipType";
                param.value = "跳转类型";
                self.varableList.push(param);

                //连接地址
                if (self.ysConfigVersion.skipType == 'URL') {
                    var param1 = {};
                    param1.key = "SKIP_URL";
                    param1.value = "链接地址";
                    self.varableList.push(param1);
                }
                if (self.ysConfigVersion.skipType == 'PRIMORDIAL') {
                    //面类型
                    var param2 = {};
                    param2.key = "PAGE_TYPE";
                    param2.value = "页面类型";
                    self.varableList.push(param2);

                    //跳转页面
                    var param3 = {};
                    param3.key = "PRIMORDIAL_PAGE";
                    param3.value = "跳转页面";
                    self.varableList.push(param3);
                }

                //标题内容
                var param4 = {};
                param4.key = "TOUCH_PUSH_TITLE";
                param4.value = "标题内容";
                self.varableList.push(param4);

                //推送内容
                var param5 = {};
                param5.key = "TOUCH_PUSH_CONTENT";
                param5.value = "推送内容";
                self.varableList.push(param5);

                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);

                if(self.ysConfigVersion.strategyTime=='SMARTTOUCH'){
                    ////触达时间
                    var param7 = {};
                    param7.key = "muchTime";
                    param7.value = "时间配置";
                    self.varableList.push(param7);
                }

            }

            if ('USER_DEFINED' == self.ysConfigVersion.strategyType && 'BANNER' == self.ysConfigVersion.touchWay){
                var param = {};
                param.key = "skipType";
                param.value = "跳转类型";
                self.varableList.push(param);

                //连接地址
                if (self.ysConfigVersion.skipType == 'URL') {
                    var param1 = {};
                    param1.key = "SKIP_URL";
                    param1.value = "链接地址";
                    self.varableList.push(param1);
                }
                if (self.ysConfigVersion.skipType == 'PRIMORDIAL') {
                    //面类型
                    var param2 = {};
                    param2.key = "PAGE_TYPE";
                    param2.value = "页面类型";
                    self.varableList.push(param2);

                    //跳转页面
                    var param3 = {};
                    param3.key = "PRIMORDIAL_PAGE";
                    param3.value = "跳转页面";
                    self.varableList.push(param3);
                }

                //banner内容
                var param4 = {};
                param4.key = "BANNER_CONTENT";
                param4.value = "banner内容";
                self.varableList.push(param4);

                //banner文案
                var param5 = {};
                param5.key = "BANNER_BTN_CONTENT";
                param5.value = "banner文案";
                self.varableList.push(param5);

                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);
            }
            if('AWARD' == self.ysConfigVersion.strategyType && 'BANNER' == self.ysConfigVersion.touchWay){
                //banner内容
                var param4 = {};
                param4.key = "BANNER_CONTENT";
                param4.value = "banner内容";
                self.varableList.push(param4);
                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);

            }

        }

    }

    /**
     * 关闭变量弹窗
     */
    self.closeVariableBtn = function () {
        $('#addVariable').hide();
    }



    /**
     * 返回上一步
     */
    self.return2 = function () {
        self.addshow=2;
        $('.s-step2>b>b,.s-step2>p,.s-step2>em').removeClass('active');
        $('.s-step1>b>b,.s-step1>p,.s-step1>em').addClass('active')
    }

    /**
     * 取上传路径
     * @param file
     * @returns {*}
     */
    self.getObjectURL = function (file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    /**
     * 上传照片
     */
    self.uploadPhoto = function () {
        //上传照片
        $("#upload").click();
        $("#upload").on("change", function () {
            var objUrl = self.getObjectURL(this.files[0]);
            if (objUrl) {
                $("#headPic").attr("src", objUrl);
            }
            var file = $("#upload")[0].files[0];
            var formData = new FormData();
            formData.append("file", file);
            $.ajax({
                type: "post",
                url: globalConfig.basePath + "/appconfig/file/uploadPic",
                async: false,
                cache: false,
                data: formData,
                contentType: false,//由于提交的对象是FormData,所以要在这里更改上传参数的类型
                processData: false,//提交对象是FormData,不需要对数据做任何处理
                success: function (data) {
                    if (data.code != "000") {
                        alert("上传失败");
                        return;
                    }
                    console.log(data);
                    $("#fileUrl").val(data.resp);
                    self.ysConfigVersion.popPageImg=data.resp;
                    alert("上传成功");
                }
            });
        })

    }


    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%添加第三块@结束%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


    //-----------------------------添加第四块@开始--------------------------------



    /**
     * 跳转第四步
     */
    self.getInto4 = function(){
        self.add.tabel4 = {};
        if(self.otherConfigVersionList==null || self.otherConfigVersionList.length<1 ){
            alert("必须至少添加一个版本");
            return;
        }
        self.addshow = 4;
        $('.s-step3>b>b,.s-step3>p,.s-step3>em').addClass('active');
        $('.s-step2>b>b,.s-step2>p,.s-step2>em').removeClass('active');

        //显示预期状态
        self.add.tabel4.showExpResultStatusName = $("#expResultStatus").find("option:selected").text();
        //显示用户分组
        self.add.tabel4.showMemberGroup = $("#memberGroup").find("option:selected").text();
        self.auditorList();
    }

    //审核人生成
    self.auditorList = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=10";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.add.tabel4.auditors = data.data.resp;
                    self.add.tabel4.approverId = data.data.resp[0].key;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 返回三层
     */
    self.return3 = function () {
        self.addshow = 3;
        $('.s-step3>b>b,.s-step3>p,.s-step3>em').removeClass('active');
        $('.s-step2>b>b,.s-step2>p,.s-step2>em').addClass('active');
    }


    /**
     * 添加数据保存
     */
    self.commitAdd= function () {
        if(self.add.tabel4.testName== null || self.add.tabel4.testName == ''){
            alert("请填写实验名称");
            return;
        }
        if(self.add.tabel4.approverId == null || self.add.tabel4.approverId == ''){
            alert("请选择审核人!");
            return
        }

        var url = globalConfig.basePath + "/abTest/addNewAbTest";
        $http.post(url,self.getData()).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("添加成功");
                    self.addshow=null;
                    self.add={};
                    self.addshow=1;
                    self.showTable=1;
                    //其他版本集合
                    self.otherConfigVersionList=[];
                    //原始版本
                    self.ysConfigVersion={};
                    // 是否配置变量
                    self.isConfigValable=1;
                    //版本添加修改控制
                    self.showVersion=0;
                    //结果控制
                    self.commitData={};

                    $('.s-step3>b>b,.s-step3>p,.s-step3>em').removeClass('active');
                    $('.s-step0>b>b,.s-step0>p,.s-step0>em').addClass('active');
                    //初始化查询
                    self.queryByList(1);

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );


    }

    /**
     * 添加数据包装
     */
    self.commitData={}
    self.getData = function () {
        //region 基础配置
        self.commitData.aioTestStrategyDtoPara={};
        //理财渠道
        self.commitData.aioTestStrategyDtoPara.channel = self.add.tabel1.channelCode;
        //服务类型
        self.commitData.aioTestStrategyDtoPara.serviceTypeCode = self.add.tabel1.serviceCode;
        //用户行为
        self.commitData.aioTestStrategyDtoPara.userActionCode = self.add.tabel1.userCode;
        //期望结果(预期状态)
        self.commitData.aioTestStrategyDtoPara.strategyResult =self.add.tabel1.expResultStatus
        //周期(执行触达后x日内有效)
        self.commitData.aioTestStrategyDtoPara.strategyCycle = self.add.tabel1.strategyCycle;
        //策略标签
        self.commitData.aioTestStrategyDtoPara.strategyTab = "TRST_STRATEGY";
        //触发节点
        self.commitData.aioTestStrategyDtoPara.touchCode = self.add.tabel1.triggerNode;
        //触发次数(限制配置-次数)
        self.commitData.aioTestStrategyDtoPara.touchCount = self.add.tabel1.touchCount;
        //触发周期天数(限制配置-多少日内触发)
        self.commitData.aioTestStrategyDtoPara.touchTimeCount = self.add.tabel1.touchTimeCount;
        //触发次数时间
        self.commitData.aioTestStrategyDtoPara.touchCountType = "NATUREDAY";
        //触达类型
        self.commitData.aioTestStrategyDtoPara.touchType = self.ysConfigVersion.strategyType;
        //实验名称
        self.commitData.aioTestStrategyDtoPara.testName = self.add.tabel4.testName;
        //名单类型
        self.commitData.aioTestStrategyDtoPara.userTagType = self.add.tabel1.memberListName;
        if(self.add.tabel1.memberListName != 'NO_RULE'){
            //用户标签(用户名单id)
            self.commitData.aioTestStrategyDtoPara.userTag = self.add.tabel1.memberListId;
        }else{
            self.commitData.aioTestStrategyDtoPara.userTag = null;
        }
        //审核人id
        self.commitData.aioTestStrategyDtoPara.auditId = self.add.tabel4.approverId;
        //endregion
        //region 触发策略
        // 策略条件
        self.commitData.aioTestStrategyDtoPara.strategyCondition=[];
        self.commitData.aioTestStrategyDtoPara.strategyCondition=angular.copy(self.add.tabel1.strategyCondition);
        var param={}
        param.strategyConditionKey = 'SUM_TIME_COUNT';
        param.strategyConditionValue = 1;
        self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param);
        var param2 ={};
        param2.strategyConditionKey = 'SUM_TIME_COUNT_TYPE';
        param2.strategyConditionValue = "NATUREDAY";
        self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param2);
        //是否配置策略
        var param3={};
        param3.strategyConditionKey = 'IS_EFFECT';
        param3.strategyConditionValue = self.add.tabel1.IS_EFFECT;
        self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param3);
        //endregion
        //触发策略银行
        if((self.add.tabel1.serviceCode == "WK_BANK_FLOW" && self.add.tabel1.IS_EFFECT==1 )||(self.add.tabel1.serviceCode == "QB_BANK_FLOW" && self.add.tabel1.IS_EFFECT==1 ) ){
            var str = "";
            $(".addBankCode").each(function () {
                if(this.checked==true){
                    str += $(this).val() + ",";
                }
            })
            var checkdbanks = str.substring(0,str.length-1);
            var param4 ={};
            param4.strategyConditionKey = 'BANK_CODE';
            param4.strategyConditionValue = checkdbanks;
            self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param4);
        }
        //预期银行bankCode
            if(self.add.tabel1.expResultStatus =="BANK_OPEN_SUCCESS" || self.add.tabel1.expResultStatus =="BANK_PAY_SUCCESS" ){
                var str = "";
                $(".addyqBankCode").each(function () {
                    if(this.checked==true){
                        str += $(this).val() + ",";
                    }
                })
                var checkdbanks = str.substring(0,str.length-1);
                self.commitData.aioTestStrategyDtoPara.bankCode  = checkdbanks;
        }
        //region 变量配置
        self.commitData.aioTestStrategyConvert={};
        self.commitData.aioTestStrategyConvert.canUpdateAttribute = self.canUpdateAttribute;
        self.commitData.aioTestStrategyConvert.canUpdateTouchWay =self.isConfigValable;
        //endregion

        //region 版本配置
        self.commitData.aioStrategyVersion=[];
        //放入原始版本集合
        self.commitData.aioStrategyVersion.push(self.version2(self.ysConfigVersion));
        angular.forEach(self.otherConfigVersionList,function (each) {
            //放入其他版本集合
            self.commitData.aioStrategyVersion.push(self.version2(each));
        })
        //endregion
        return self.commitData;

    }

    //region  版本操作
    self.version2 = function(param){
        var aioStrategyVersion={};
        //原始版本 param
        if(param.strategyTime=='SMARTTOUCH'){
            //时间配置
            aioStrategyVersion.muchTime=param.muchTime;
        }
        //描述
        aioStrategyVersion.remark = param.verDesc;
        //触达时间
        aioStrategyVersion.touchTimeType = param.strategyTime;
        //触达方式
        aioStrategyVersion.touchWay = param.touchWay;
        //版本名称
        aioStrategyVersion.versionName = param.verName;

        //触达方式
        aioStrategyVersion.parentContentDto={}
        //奖励
        aioStrategyVersion.parentContentDto.awardContentDto=[];
        if('AWARD'==param.strategyType){
            aioStrategyVersion.parentContentDto.awardContentDto = param.awardContentDto;
        }
        // banner实体
        aioStrategyVersion.parentContentDto.bannerContentDto={}
        if('BANNER'==param.touchWay){
            //banneer内容
            aioStrategyVersion.parentContentDto.bannerContentDto.bannerContent = param.BANNER_CONTENT;
            //按钮文案
            aioStrategyVersion.parentContentDto.bannerContentDto.bannerBtnContent = param.BANNER_BTN_CONTENT;
            //跳转类型
            aioStrategyVersion.parentContentDto.bannerContentDto.bannerBtnUrlType = param.skipType;
            if('URL' == param.skipType){
                //按钮url
                aioStrategyVersion.parentContentDto.bannerContentDto.bannerBtnUrl = param.BANNER_BTN_URL;
            }else if('PRIMORDIAL' == param.skipType){
                //页面类型
                aioStrategyVersion.parentContentDto.bannerContentDto.pageType = param.PAGE_TYPE;
                //原生跳转页面
                aioStrategyVersion.parentContentDto.bannerContentDto.primordialPage = param.PRIMORDIAL_PAGE;
            }
        }
        //短信
        aioStrategyVersion.parentContentDto.messageContentDto={};
        if('MESSAGE' == param.touchWay){
            //短信内容
            aioStrategyVersion.parentContentDto.messageContentDto.messageContent = param.MESSAGE_CONTENT;
        }
        //推送
        aioStrategyVersion.parentContentDto.pushContentDto={}
        if('PUSH' == param.touchWay){
            //跳转类型
            aioStrategyVersion.parentContentDto.pushContentDto.skipType = param.skipType;
            if('URL' == param.skipType){
                //按钮url
                aioStrategyVersion.parentContentDto.pushContentDto.skipUrl = param.SKIP_URL;
            }else if('PRIMORDIAL' == param.skipType){
                //页面类型
                aioStrategyVersion.parentContentDto.pushContentDto.pageType = param.PAGE_TYPE;
                //原生跳转页面
                aioStrategyVersion.parentContentDto.pushContentDto.primordialPage = param.PRIMORDIAL_PAGE;
            }
            //推送内容
            aioStrategyVersion.parentContentDto.pushContentDto.touchPushContent = param.TOUCH_PUSH_CONTENT;
            //推送标题
            aioStrategyVersion.parentContentDto.pushContentDto.touchPushTitle = param.TOUCH_PUSH_TITLE;
        }
        //站内信
        aioStrategyVersion.parentContentDto.pushMailContentDto={}
        if('PUSH_MAIL' == param.touchWay){
            //站内信内容
            aioStrategyVersion.parentContentDto.pushMailContentDto.touchPushContent = param.TOUCH_PUSH_CONTENT;
            //站内信标题
            aioStrategyVersion.parentContentDto.pushMailContentDto.touchPushTitle = param.TOUCH_PUSH_TITLE;
        }

        return aioStrategyVersion;
    }
    //endregion

    //-----------------------------添加第四块@结束--------------------------------

    /**++++++++++++++++++++++++++++++++++新增实验操作@结束++++++++++++++++++++++++++*/

    //region 克隆@开始
    /**
     * 克隆
     */
    self.copy = function (param) {
        self.showTable=4;
        self.$broadcast('copyStart',param);
    }

    /**
     * 接收子作用域数据
     */
    self.$on('returnTable1', function() {
        self.showTable=1;
        //初始化查询
        self.queryByList(1);
    })
    //endregion

    /**
     * 修改
     */
    self.updateBtn = function (param) {
        self.showTable=4;
        self.$broadcast('abTestUpdateShow',param);
    }



    self.tagSelectListChange = function () {
            self.initdata();
    }

    //新增时调用实时标签
    self.initdata = function () {
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        self.code = self.add.tabel1.channelCode;
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.code + "&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.initSelectDataList = userData.resp.data
                console.log(self.initSelectDataList, "实时数据log");
                // 1 属性名下拉菜单 option

                $('.query-wrap').html(null);
                $('.query-info').html(null);
                var $this = $(this);
                self.options = $("#tagSelectListid option:selected").val();
                for (var i = 0; i < self.initSelectDataList.length; i++) {
                    if (self.options == self.initSelectDataList[i].english) {
                        self.initQueryNameList += "<option  value='" + self.initSelectDataList[i].english + "'>" + self.initSelectDataList[i].chinese + "</option>"
                        $this.parent().find("span").remove();
                        $this.parent().find(".dateno2").remove();
                        if (self.initSelectDataList[i].option == "date") {//时间格式
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text'>";
                        } else if (self.initSelectDataList[i].option == "number") {//数字格式
                            self.initQueryValue = "<input type='number' class='inp-text'>";
                        } else if (self.initSelectDataList[i].option == "string") {//字符串格式
                            self.initQueryValue = "<input type='text' class='inp-text'>";
                        }
                        // 2 第一个属性的操作符下拉菜单 option
                        for (var j = 0; j < self.initSelectDataList[i].list.length; j++) {
                            self.initQueryCriteriaList += "<option value='" + self.initSelectDataList[i].list[j].code + "'>" + self.initSelectDataList[i].list[j].value + "</option>"
                        }
                    }
                }

            }
        });

        //and初始化
        var  strBigGroup = `<div class="query-info">
		        <div class="add-new-box">
		          <div class="query-list"><span class="circleLetter query-item-name"></span>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`
        //or下拉框初始化
        var strSmallGroupInit = `<div class="query-list"><span class="circleLetter query-item-name"></span>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		              <p class="remove-query-info"><span></span></p>
		          </div>`

        ////////////////实时标签组件
        $('.query-wrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }

        // 小组件 添加 query-wrap
        $(".query-wrap").on("click", " .query-info .add-button", function () {
            $(this).parent().find('.add-new-box').append(strSmallGroupInit)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        });
        // -
        $(".query-wrap").on("click", " .query-info .add-new-box .remove-query-info", function () {
            let $parent = $(this).parent()
            let $parents = $parent.parent()
            if ($parents.children().length >= 2) {
                $parent.remove()
            } else {
                $parents.parent().next().remove();
                $parents.parent().remove();
            }

        });
        // 添加 wrap 分组的
        $('.add-query-info-button').on('click', function () {
            $('.query-wrap').append(strBigGroup)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        })


        $('.query-wrap').on('click', ".remove-query-info, .add-button", function () {
            conditionDesc();
        });

        $('.add-query-info-button').on('click', null, function () {
            conditionDesc();
        });

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }

    }


    //查看调用实时标签
    self.queryinitdata = function (data) {
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode=" + data.data.resp.testStrategyDto.channelCodeKey + "&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.querySelectDataList = userData.resp.data
                self.options = data.data.resp.testStrategyDto.touchStrategyList;
                self.options.forEach(function (value, index, array) {
                    if (value.attrKey === "REALTIME_TAG") {
                        self.realtimeTag = value.attrValue;
                    } else if (value.attrKey === "REALTIME_CRITERIA") {
                        self.realtimeCrteria = value.attrValue;
                    } else if (value.attrKey === "REALTIME_VALUE") {
                        self.realtimeValue = value.attrValue;
                    }
                });
                $('.query-selewrap').html(null);
                $('.query-seleinfo').html(null);
                var $this = $(this);
                // 1 属性名下拉菜单 option
                for (var i = 0; i < self.querySelectDataList.length; i++) {
                    if (self.realtimeTag == self.querySelectDataList[i].english) {
                            self.initQueryNameList += "<option  value='" + self.querySelectDataList[i].english + "'>" + self.querySelectDataList[i].chinese + "</option>"
                        if (self.querySelectDataList[i].option == "date") {//时间格式
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text' value='" + self.realtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "number") {//数字格式
                            self.initQueryValue = "<input type='number' class='inp-text' value='" + self.realtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "string") {//字符串格式
                            self.initQueryValue += "<input type='text' class='inp-text' value='" + self.realtimeValue+"'>";
                        }
                        for (var j = 0; j < self.querySelectDataList[i].list.length; j++) {
                            if (self.querySelectDataList[i].list[j].code == self.realtimeCrteria) {
                                self.initQueryCriteriaList += "<option value='" + self.querySelectDataList[i].list[j].code + "'>" + self.querySelectDataList[i].list[j].value + "</option>"
                            }
                        }
                    }
                }
            }
        });
                //and初始化
                var strBigGroup = `<div class="query-seleinfo">
		        <div class="add-new-box">
		          <div class="query-list"><span class="circleLetter query-item-name"></span>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`

        ////////////////实时标签组件
        $('.query-selewrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }
        // 小组件 添加 query-selewrap
        $(".query-selewrap").on("click", " .query-seleinfo .add-button", function () {
            $(this).parent().find('.add-new-box').append(strSmallGroupInit)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        });
        // -
        $(".query-selewrap").on("click", " .query-seleinfo .add-new-box .remove-query-info", function () {
            let $parent = $(this).parent()
            let $parents = $parent.parent()
            if ($parents.children().length >= 2) {
                $parent.remove()
            } else {
                $parents.parent().next().remove();
                $parents.parent().remove();
            }
        });
        // 添加 wrap 分组的
        $('.add-query-info-button').on('click', function () {
            $('.query-selewrap').append(strBigGroup)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        })


        $('.query-selewrap').on('click', ".remove-query-info, .add-button", function () {
            conditionDesc();
        });

        $('.add-query-info-button').on('click', null, function () {
            conditionDesc();
        });

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }

    }

    /*银行策略获取银行信息*/
    self.bankInfoList = function(){
        self.checkboxParamList= [];
        var url = globalConfig.basePath + "/smart_marketing/initiative/getBankList";
        $http({
            method: 'post',
            url: url,
        }).then(
            function(data) {
                self.checkboxParamList = data.data;
            },function(response) {
                alert("请求失败了....");
            }
        );
    };
    self.bankInfoList();

    //银行修改回显
     self.updbankschecked =function(data){
        $("#updAllchecked").prop("checked", false);//全部
        self.toUpdate.aioActionStrategyDtoPara = data.data.resp.strategyDto;
        self.bankCode = data.data.resp.strategyDto.bankCode;
        self.toUpdate.aioActionStrategyDtoPara.touchStrategyList.forEach(function(value , index , array){
            if(value.attrKey === "BANK_CODE") {
                self.updrealbankcode = value.attrValue;
            }
        });
        self.bankInfoList();
        setTimeout(function () {
            if(self.updrealbankcode!=null){
                var count = 0;
                var bankCode = self.updrealbankcode.split(",");
                for(var i=0;i<bankCode.length;i++){
                    $(".updBankCode").each(function () {
                        if(bankCode[i]==$(this).val()){
                            count++;
                            $(this).prop("checked",true);
                        }
                    })
                }
                if(count == self.add.tabel1.checkboxParamList.length){
                    $("#updAllchecked").prop("checked", true);//全部
                }
            }if(self.bankCode != null){
                var count = 0;
                var bankCode = self.bankCode.split(",");
                for(var i=0;i<bankCode.length;i++){
                    $(".updyqBankCode").each(function () {
                        if(bankCode[i]==$(this).val()){
                            count++;
                            $(this).prop("checked",true);
                        }
                    })
                }
                if(count == self.add.tabel1.checkboxParamList.length){
                    $("#updyqAllchecked").prop("checked", true);//全部
                }
            }
        },800)
    }

    //银行查看回显
    self.bankschecked =function(data){
        $("#allselect").prop("checked", false);//全部
        self.strategyDetail = data.data.resp;
        self.bankCode = self.strategyDetail.testStrategyDto.bankCode;
        self.strategyDetail.testStrategyDto.touchStrategyList.forEach(function(value , index , array){
            if(value.attrKey === "BANK_CODE"){
                self.realbankcode= value.attrValue;
            }
        });
        self.bankInfoList();
        setTimeout(function () {
            if(self.realbankcode!=null){
                var count = 0;
                var bankCode = self.realbankcode.split(",");
                for(var i=0;i<bankCode.length;i++){
                    $(".queryBankCode").each(function () {
                        if(bankCode[i]==$(this).val()){
                            count++;
                            $(this).prop("checked",true);
                        }
                    })
                }
                if(count == self.checkboxParamList.length){
                    $("#allselect").prop("checked", true);//全部
                }
            }
            if(self.bankCode != null){
                var count = 0;
                var bankCode = self.bankCode.split(",");
                for(var i=0;i<bankCode.length;i++){
                    $(".queryyqBankCode").each(function () {
                        if(bankCode[i]==$(this).val()){
                            count++;
                            $(this).prop("checked",true);
                        }
                    })
                }
                if(count == self.checkboxParamList.length){
                    $("#yqallselect").prop("checked", true);//全部
                }
            }
        },800)

    }

    //银行全选
    self.addupdAll = function(val) {
        //  1新增银行  2 预期银行新增  3银行修改  4预取银行修改
        if(val ==1){
            if ($('#addAllchecked').is(":checked") == true) {
                $("[name='addbanks']").prop("checked", true);
            } else {
                $("[name='addbanks']").prop("checked", false);
            }

        }else if(val ==2){
            if ($('#addyqAllchecked').is(":checked") == true) {
                $("[name='addyqbanks']").prop("checked", true);
            } else {
                $("[name='addyqbanks']").prop("checked", false);
            }
        }else if(val ==3){
            if ($('#updAllchecked').is(":checked") == true) {
                $("[name='updbanks']").prop("checked", true);
            } else {
                $("[name='updbanks']").prop("checked", false);
            }
        }else if(val ==4){
            if ($('#updyqAllchecked').is(":checked") == true) {
                $("[name='updyqbanks']").prop("checked", true);
            } else {
                $("[name='updyqbanks']").prop("checked", false);
            }
        }
    }
    self.addupdChangeBank = function(val){
        if(val ==1){
            var checkVal=0;
            $(".addBankCode").each(function () {
                if(this.checked==false){
                    checkVal=1;
                }
            })
            if(checkVal==0){
                $("#addAllchecked").prop("checked", true);
            }else if(checkVal==1){
                $("#addAllchecked").prop("checked", false);
            }
        }else if(val ==2){
            var checkVal=0;
            $(".addyqBankCode").each(function () {
                if(this.checked==false){
                    checkVal=1;
                }
            })
            if(checkVal==0){
                $("#addyqAllchecked").prop("checked", true);
            }else if(checkVal==1){
                $("#addyqAllchecked").prop("checked", false);
            }
        }else if(val ==3){
            var checkVal=0;
            $(".updBankCode").each(function () {
                if(this.checked==false){
                    checkVal=1;
                }
            })
            if(checkVal==0){
                $("#updAllchecked").prop("checked", true);
            }else if(checkVal==1){
                $("#updAllchecked").prop("checked", false);
            }
        }else if(val ==4){
            var checkVal=0;
            $(".updyqBankCode").each(function () {
                if(this.checked==false){
                    checkVal=1;
                }
            })
            if(checkVal==0){
                $("#updyqAllchecked").prop("checked", true);
            }else if(checkVal==1){
                $("#updyqAllchecked").prop("checked", false);
            }
        }
    }



}]);

App.filter("realtimeTagListFilter", function () {
    return function(val){
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode=wk" + "&dataType=2",
            // data: "channelCode="+self.showText.channelCode+"&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.tagSelectList = userData.resp.data;
            }
        });
        var res = "";
        var nodeCodes = val.split(",");
        for (var i = 0; i < nodeCodes.length; i++) {
            for (var j = 0; j < self.tagSelectList.length; j++) {
                if(nodeCodes[i] == self.tagSelectList[j].english){
                    res = self.tagSelectList[j].chinese;
                }
            }
        }
        return res;
    }
})
