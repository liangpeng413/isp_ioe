'use strict';

var App = angular.module('smart_service', [], angular.noop);
App.controller('smart_service_controller', ['$scope', '$http', function ($scope, $http) {

    var self = $scope;
    self.search = {};
    self.search.userCode = null;
    self.search.serviceCode = null;
    self.search.channelCode = 'WK';
    self.manage = {};
    self.daily = {};
    self.manage.nodeCode = null;
    self.manage.resultType = null;
    self.manage.strategyId = null;
    self.manage.strategyResult = null;
    self.manage.strategyStatus = null;
    self.viewPage = '';
    self.showText = {};
    self.add = {};
    self.add.aioTouchWayDtoPara = {};
    self.add.aioTouchWayDtoPara.parentContentDto = {};
    self.add.aioActionStrategyDtoPara = {};
    self.add.aioTouchWayDtoPara.parentContentDto.softPopupContentDto = {};
    self.add.aioActionStrategyDtoPara.userTagType = "NO_RULE";

    self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto = {};
    self.add.aioTouchWayDtoPara.parentContentDto.aioActionStrategyDtoPara = {};
    self.add.aioTouchWayDtoPara.parentContentDto.messageContentDto = {};
    self.add.aioTouchWayDtoPara.parentContentDto.pushMailContentDto = {};
    self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto = {};
    self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto = [];
    self.add.aioTouchWayDtoPara.parentContentDto.popupContentDto = {};
    self.add.reward = {};
    self.add.tabel1 = {};
    self.checkAward = false;
    self.add.aioActionStrategyDtoPara.touchCode = null;
    self.detail = {};
    self.tempCoupon = {};
    self.add.tabel1.IS_EFFECT = '0';
    self.toUpdate = {};
    self.toUpdate.aioActionStrategyDtoPara = {};
    self.toUpdate.aioTouchWayDtoPara = {};
    self.toUpdate.aioActionStrategyDtoPara.userTagType = "NO_RULE";
    self.shenheresult = '1';
    self.search.userCode = "";
    self.search.serviceCode = "";
    self.manage.strategyResult = "";
    self.manage.nodeCode = "";
    self.manage.resultType = "";
    self.testSelect = 1;

    var startTime = laydate({
        elem: '#startTime',
        istime: true,
        format: 'YYYY-mm-DD',
        event: 'click'
    })

    var endTime = laydate({
        elem: '#endTime',
        istime: true,
        format: 'YYYY-mm-DD',
        event: 'click'
    });

    var startTime2 = laydate({
        elem: '#upTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime2 = laydate({
        elem: '#downTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    });

    var startTime2 = laydate({
        elem: '#upTime2',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime2 = laydate({
        elem: '#downTime2',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    });


    self.SmartServiceList = function (pageNum) {

        if (!pageNum) {
            self.search.currentPage = 1;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.currentPage = self.search.pageCount;
            } else {
                self.search.currentPage = pageNum;
            }
        }
        if (!self.search.pageSize) {
            self.search.pageSize = '10';
        }
        if (self.search.pageSize == '0') {
            self.search.pageSize = 10;
        }
        self.viewPage = 'serviceList';
        console.log(self.search, "??????????????????");
        var url = globalConfig.basePath + "/operation/query/levelone";
        $http.post(url, JSON.stringify(self.search)).then(
            function (data) {
                console.log(data, "????????????????????????");
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.currentPage = data.data.resp.currentPage;
                    } else {
                        self.search.currentPage = 1;
                    }

                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;

                    self.serviceList = data.data.resp.result;
                    self.search.serviceCode = "";
                    self.search.userCode = "";
                    $scope.serviceSelectCreate();
                    $('#auditShow').hide();
                }
            }, function errorCallback(data) {
                alert(data.data.message);
            }
        );
    };

    //??????
    self.reset = function () {

        self.search.userCode = null;
        self.search.serviceCode = null;
        self.search.channelCode = 'QB';
    }
    //??????????????????
    self.reset2 = function () {
        self.manage.strategyId = null;
        $('#endTime').val(null);
        $('#startTime').val(null);
        self.manage.nodeCode = null;
        self.manage.resultType = null;
        self.manage.strategyStatus = null;
        self.manage.strategyResult = null;

    };


    self.manageService = function (pageNum, x) {
        if (!pageNum) {
            self.manage.currentPage = 1;
        } else {
            if (pageNum > self.manage.pageCount && self.manage.pageCount > 0) {
                self.manage.currentPage = self.manage.pageCount;
            } else {
                self.manage.currentPage = pageNum;
            }
        }
        if (!self.manage.pageSize) {
            self.manage.pageSize = '5';
        }
        if ($("#startTime").val() != null && $("#startTime").val() != '') {
            self.manage.startTimeDate = $("#startTime").val();
        } else {
            self.manage.startTimeDate = null;
        }
        if ($("#endTime").val() != null && $("#endTime").val() != '') {
            self.manage.endTimeDate = $("#endTime").val();
        } else {
            self.manage.endTimeDate = null;
        }

        if (x) {
            self.manage.userActionCode = x.userActionCode;
            self.showText.show = x.channelName + "-" + x.serviceName + "-" + x.userActionName;
            self.showText.serviceType = x.serviceName;
            self.showText.userActionName = x.userActionName;
            self.showText.userActionCode = x.userActionCode;
            self.showText.channelCode = x.channelCode;
            self.showText.serviceCode = x.serviceCode;
            self.showText.channelName = x.channelName;
            self.showText.userTag = x.userTag;
            $('#spilt').text($('#channel option:selected').text());
        }
        var url = globalConfig.basePath + "/operation/query/leveltwo";
        console.log(self.manage);
        $http.post(url, JSON.stringify(self.manage)).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data, "????????????");
                    self.manageList = data.data.resp.result;
                    self.manage.totalRowSize = data.data.resp.totalRowSize;
                    self.manage.pageCount = data.data.resp.pageCount;
                    self.viewPage = 'pageTwo';
                    $scope.selectToNodeCode();
                    $scope.selectexpectedStatus();
                    $scope.selectToResultType();


                }
            }, function errorCallback(data) {
                alert(data.data.message);
            }
        );
    }

    /**
     * ???????????????
     */
    Date.prototype.format3 = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //??????
            "d+": this.getDate(),                    //???
            "h+": this.getHours(),                   //??????
            "m+": this.getMinutes(),                 //???
            "s+": this.getSeconds(),                 //???
            "q+": Math.floor((this.getMonth() + 3) / 3), //??????
            "S": this.getMilliseconds()             //??????
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
     * ??????????????????
     */
    self.showBar = function (rosterId, strategyId) {
        self.rosterId = rosterId;
        self.strategyId = strategyId;
        console.log(rosterId, "??????id");
        console.log(strategyId, "??????id");
        var process = {};
        process.featureType = self.testSelect;
        process.channel = self.showText.channelCode;

        if (self.rosterId && self.rosterId != "") {
            process.rosterId = self.rosterId;
        } else {
            process.rosterId = 0;

        }
        process.strategyId = strategyId;
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
                    if (self.textSelect == 2) {
                        typeName = "??????";
                    } else if (self.textSelect == 1) {
                        typeName = "??????";
                    } else if (self.textSelect == 3) {
                        typeName = "???????????????";
                    } else if (self.textSelect == 4) {
                        typeName = "????????????";
                    } else if (self.textSelect == 5) {
                        typeName = "??????????????????";
                    } else if (self.textSelect == 6) {
                        typeName = "????????????";
                    } else if (self.textSelect == 7) {
                        typeName = "????????????";
                    } else if (self.textSelect == 8) {
                        typeName = "????????????";
                    } else if (self.textSelect == 9) {
                        typeName = "???????????????";
                    }
                    var title = {
                        text: "???????????????" + typeName + "??????????????????"
                    };
                    var subtitle = {
                        text: ''
                    };
                    /**??????????????????-??????*/
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
                            text: '????????????'
                        }
                    };
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
                        name: "?????????",
                        data: values
                    },
                        {name: "?????????", data: values2}];
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
                alert(data.message);
            }
        })
    }

    /**
     * ????????????
     */
    self.xiaoguo = function (x) {

        self.viewPage = 'effect';
        var strategyId = x.strategyId;
        var rosterId = x.userTag;
        var nodeCode = x.nodeCode;
        var touchStragety = x.touchStrategy;
        var userTagType = x.userTagType;


        $('#cfjd').text("????????????:" + nodeCode);
        $('#qd').text("????????????:" + $('#channel option:selected').text());
        $('#servicetype').text("????????????:" + self.showText.serviceType);
        $('#xw').text("????????????:" + self.showText.userActionName);
        $('#serviceId').text("??????Id:" + strategyId);
        if (touchStragety) {
            touchStragety = touchStragety.replace("/", ";").replace("/", ";").replace("/", ";").replace("/", ";")
                .replace("/", ";").replace("/", ";").replace("/", ";").replace("/", ";");
        }
        $('#strategy').text("????????????:" + touchStragety);
        if (!rosterId || rosterId == "" || rosterId == undefined) {
            rosterId = 0;
        }
        var param = "id=" + rosterId;
        if (userTagType == "????????????") {

            $.ajax({
                type: 'GET',
                url: globalConfig.basePath + "/ruleConfigAddDetail/queryUserCount?channel=" + $('#channel option:selected').val(),
                data: globalConfig.channelCode,
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $('#rosterName').text("????????????:????????????");
                    $('#channelCode').text("??????:" + self.showText.channelName);
                    $('#type').text("??????:" + "-");
                    $('#rosterNumber').text("????????????:" + data.resp);
                },
                error: function (data) {
                    alert(data.message);
                }

            })
        } else {
            $.post(globalConfig.basePath + "/abTest/listname", param, function (data) {
                if (data.code != '000') {
                    alert(data.message)
                    self.location = document.referrer;
                } else {
                    console.log(data);


                    if (data.resp.data) {
                        var rosterInfo = data.resp.data;
                        console.log(rosterInfo, "????????????");
                        $('#rosterName').text("????????????:" + rosterInfo.rosterName);
                        if (rosterInfo.channelCode == "WK") {
                            $('#channelCode').text("??????:????????????");
                        } else {
                            $('#channelCode').text("??????:????????????");
                        }

                        if (rosterInfo.rosterType == "1") {
                            rosterInfo.rosterType = "??????????????????";
                        } else {
                            rosterInfo.rosterType = "????????????";
                        }

                        $('#type').text("??????:" + rosterInfo.rosterType);
                        $('#rosterNumber').text("????????????:" + rosterInfo.rosterCount);
                        var oldTime = (new Date(rosterInfo.createTime)).getTime();
                        var curTime = new Date(oldTime).format3("yyyy-MM-dd");
                        var oldTime2 = (new Date(rosterInfo.updateTime)).getTime();
                        var curTime2 = new Date(oldTime2).format3("yyyy-MM-dd");
                        $('#createTime').text("????????????:" + curTime);
                        $('#updateTime').text("????????????:" + curTime2);
                        $('#createPeople').text("?????????:" + rosterInfo.createUser);

                    }


                }

            }, "json");

        }

        $('#testSelect').val(1);
        self.showBar(rosterId, strategyId);
        self.dailyTouch(null, strategyId, rosterId);

    };


    /**
     * ??????????????????????????????
     */
    self.dailyTouch = function (pageNum, strategyId, rosterId) {

        if (!pageNum) {
            self.daily.pageNo = 1;
        } else {
            if (pageNum > self.daily.pageCount && self.daily.pageCount > 0) {
                self.daily.pageNo = self.daily.pageCount;
            } else {
                self.daily.pageNo = pageNum;
            }
        }
       self.detail.channelCode = $('#channel option:selected').val();

        self.daily.strategyId = strategyId;
        if (rosterId && rosterId != "null") {
            self.daily.rosterId = rosterId;
        } else {
            self.daily.rosterId = 0;
        }

        $.ajax({
            type: 'POST',
            url: globalConfig.basePath + "/abTest/dailytouch",
            data: JSON.stringify(self.daily),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                console.log(data, "???????????????");
                if (data.code == '000') {
                    if (data.resp.currentPage) {
                        self.daily.pageNo = data.resp.currentPage;
                    } else {
                        self.daily.pageNo = 1;
                    }
                    self.daily.pageSize = data.resp.pageSize + "";
                    self.daily.pageCount = data.resp.pageCount;
                    self.daily.totalRowSize = data.resp.totalRowSize;

                    self.initiativeList = data.resp.list;
                }
            },
            error: function (data) {
                alert(data.message);
            }

        })


    }

    $scope.queryTagSelectList = function () {
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.showText.channelCode + "&dataType=2",
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
    }

    $scope.queryTagSelectList();
    self.addStrategy = function () {
        self.add.tabel1.IS_EFFECT = 0;
        $('.query-wrap').html(null);
        $('.query-info').html(null);
        self.abc=null;
        self.viewPage = 'add';
        $('#addtext').text(self.showText.show);
        $('#leixing').text("????????????:" + self.showText.serviceType);
        $('#xingwei').text("????????????:" + self.showText.userActionName);
        self.rosterTypeSelect();
        self.shenheren();
        $scope.queryTagSelectList();
        $('#noConfig').prop("checked", true);
        $('#yesInputConfig').prop("checked", false);
        self.add.tabel1.numberParamList = null;
        self.add.aioActionStrategyDtoPara.strategyResult = null;
        $('#bankallid').hide();
        $('.query-wrap').html(null);
        $('.query-info').html(null);
        if (self.selectNodeCode!=null && self.selectNodeCode.length>0 && self.selectNodeCode[0].value.substr(0, 1) == "???") {
            $('#yesInputConfig').hide();
            $('#ccc').hide();
            self.add.aioActionStrategyDtoPara.touchCode = self.selectNodeCode[0].key;
        } else {
            $('#yesInputConfig').show();
            $('#ccc').show();
        }

    };

    //????????????
    self.checkChannelGroup = function (event) {
        var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + self.showText.channelCode + "&rosterType=" + event;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data);
                    self.strCheckChannelGroups = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        )

    };


    //??????????????????
    self.awardContentList = [];
    self.checkStrategy = function (event) {
        $('#checkText').text(self.showText.show);
        $('#checkService').text("????????????:" + self.showText.serviceType);
        $('#checkUser').text("????????????:" + self.showText.userActionName);
        $http.get(globalConfig.basePath + "/strategy/detail?strategyId=" + event).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyDetail = data.data.resp;
                    self.checkRosterTypeSelect();
                    self.selectToResultType();
                    self.selectexpectedStatus();
                    self.checkToNodeCode();
                    self.shenheren();
                    self.checkSelectPageOne();
                    if (self.strategyDetail.strategyDto.userTagType != 'NO_RULE') {
                        self.checkChannelGroup(self.strategyDetail.strategyDto.userTagType);
                    }
                    if (self.strategyDetail.touchWayDto.touchWay === 'SOFT_POPUP') {
                        self.checkSelectPageTwo(self.strategyDetail.touchWayDto.parentContentDTO.softPopupContentDto.pageType);
                    } else if (self.strategyDetail.touchWayDto.touchWay === 'PUSH') {
                        self.checkSelectPageTwo(self.strategyDetail.touchWayDto.parentContentDTO.pushContentDto.pageType);
                    } else if (self.strategyDetail.touchWayDto.touchWay === 'BANNER') {
                        self.checkSelectPageTwo(self.strategyDetail.touchWayDto.parentContentDTO.bannerContentDto.pageType);
                    }
                    if (self.strategyDetail.strategyDto.touchType === "AWARD") {
                        self.checkAward = true;
                        self.awardContentList = self.strategyDetail.touchWayDto.parentContentDTO.awardContentDto;
                        console.log("????????????", self.awardContentList);
                        for (var i = 0; i < self.awardContentList.length; i++) {
                            if (self.awardContentList[i].awardType == 'JIFEN') {
                                $.ajax({
                                    url: globalConfig.basePath + "/smart_marketing/initiative/getIntegralId?jfRuleId=" + self.awardContentList[i].jfRuleId,
                                    type: "get",
                                    dataType: "json",
                                    contentType: "text/html;charset=utf-8",
                                    data: self.awardContentList[i].jfRuleId,
                                    async: false,
                                    success: function (data) {
                                        console.log("??????????????????", data);
                                        if (data.code == '000' && data.resp.code == '2000') {

                                            self.awardContentList[i].awardDesc = '??????-' + self.awardContentList[i].awardContent + '-????????????:' + data.resp.data.availablePoint;

                                        }
                                    }

                                })
                            }
                        }
                    }
                    self.realtimeTag = "";
                    self.realtimeCrteria = "";
                    self.realtimeValue = "";
                    self.realtimeType = "";
                    $scope.queryTagSelectList();
                    setTimeout(function () {
                        self.touchCode = self.strategyDetail.strategyDto.touchCode;//????????????
                    },100)
                    self.strategyDetail.strategyDto.touchStrategyList.forEach(function (value, index, array) {
                        if (value.attrKey === "IS_EFFECT") {
                            self.isEffect = value.attrValue;
                        } else if (value.attrKey === "SUM_MIN_AMOUNT") {
                            self.sumMinAmount = value.attrValue;
                        } else if (value.attrKey === "SUM_MAX_AMOUNT") {
                            self.sumMaxAmount = value.attrValue;
                        } else if (value.attrKey === "SUM_MIN_FAIL_COUNT") {
                            self.sumMinFailCount = value.attrValue;
                        } else if (value.attrKey === "SUM_MAX_FAIL_COUNT") {
                            self.sumMaxFailCount = value.attrValue;
                        } else if (value.attrKey === "REALTIME_TAG") {
                            self.realtimeTag = value.attrValue;
                        } else if (value.attrKey === "REALTIME_CRITERIA") {
                            self.realtimeCrteria = value.attrValue;
                        } else if (value.attrKey === "REALTIME_VALUE") {
                            self.realtimeValue = value.attrValue;
                        } else if (value.attrKey === "REALTIME_TYPE") {
                            self.realtimeType = value.attrValue;
                        }
                    });
                    bankschecked(data);
                    self.queryinitdata(data);
                    self.viewPage = 'check';
                } else {
                    alert(data.data.message);
                }
            }
        )
    };


    //????????????--??????????????????
    self.checkToNodeCode = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=1&code=" + self.showText.userActionCode;
        $http.get(url).then(function (data) {
                console.log(data);
                if (data.data.code == '000') {
                    self.checkNodeCode = data.data.resp;
                } else {
                    alert(data.data.message);

                }
            }
        )
    };

    //????????????  ??????????????????
    self.checkSelectPageOne = function () {
        var type = '';
        if (self.showText.channelCode == 'WK') {
            type = 17;
        } else if (self.showText.channelCode == 'QB') {
            type = 18;
        }
        //??????original_bd_url
        var url = globalConfig.basePath + "/operation/init/byKey?type=" + type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.checkDictList2 = data.data.resp;
                    //  self.towPageType = data.data.resp[0].key;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );
    };

    //???????????? ??????????????????
    self.checkSelectPageTwo = function (event) {
        var url = globalConfig.basePath + "/operation/init/byKey?type=19&code=" + event;
        $http.get(url).then(
            function (data) {
                console.log(data);
                if (data.data.code == '000') {
                    self.checkPositionDictList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );
    };

    $scope.SmartServiceList();
    //???????????????????????????
    self.userSelectCreate = function () {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=13&code=" + self.search.serviceCode)
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectAction = data.data.resp;
                    } else {
                        alert(data.data.message);

                    }
                }
            )
    };

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

    self.uploadPicture = function () {
        //????????????
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
                contentType: false,//????????????????????????FormData,?????????????????????????????????????????????
                processData: false,//???????????????FormData,?????????????????????????????????
                success: function (data) {
                    if (data.code != "000") {
                        alert("????????????");
                        return;
                    }
                    console.log(data, "????????????");
                    $("#fileUrl1").val(data.resp);
                    self.add.aioTouchWayDtoPara.parentContentDto.popupContentDto.popPageImg = data.resp;
                    alert("????????????");
                }
            });
        })

    }

    //????????????????????????????????????????????????
    self.serviceSelectCreate = function () {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=12&code=" + self.search.channelCode)
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectService = data.data.resp;


                    } else {
                        alert(data.data.message);

                    }
                }
            )
    }

    self.selectToNodeCode = function () {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=1&code=" + self.showText.userActionCode)
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectNodeCode = data.data.resp;
                    } else {
                        alert(data.data.message);

                    }
                }
            )
    }

    self.selectToResultType = function () {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=4")
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectResultType = data.data.resp;
                        self.add.aioActionStrategyDtoPara.touchType = self.selectResultType[0].key;
                        self.add.aioTouchWayDtoPara.touchWay = 'BANNER';
                    } else {
                        alert(data.data.message);

                    }
                }
            )

    }

    self.selectexpectedStatus = function () {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=9")
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectExpectedStatus = data.data.resp;

                    } else {
                        alert(data.data.message);

                    }
                }
            )
    }

    //??????????????????
    self.checkRosterTypeSelect = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyList = data.data.resp;

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );
    };

    self.rosterTypeSelect = function (x) {

        if (x == '1') {
            var url = globalConfig.basePath + "/operation/init/byKey?type=2";
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.strategyList = data.data.resp;
                        self.selectChannelGroup(x);
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("???????????????....");
                }
            );
        } else {
            var url = globalConfig.basePath + "/operation/init/byKey?type=2";
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {

                        self.strategyList = data.data.resp;
                        self.selectChannelGroup(x);
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("???????????????....");
                }
            );
        }
    }
    $scope.selectPageOne = function () {
        var type = '';
        if (self.showText.channelCode == 'WK') {
            type = 17;
        }
        if (self.showText.channelCode == 'QB') {
            type = 18;
        }
        var url = globalConfig.basePath + "/operation/init/byKey?type=" + type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.rDictList2 = data.data.resp;
                    self.add.pageType = data.data.resp[0].key;
                    self.selectPageTwo();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );

    };

    self.selectPageOneforUpdate = function () {
        var type = '';
        if (self.showText.channelCode == 'WK') {
            type = 17;
        }
        if (self.showText.channelCode == 'QB') {
            type = 18;
        }
        var url = globalConfig.basePath + "/operation/init/byKey?type=" + type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.rDictList2 = data.data.resp;
                    self.selectPageTwoforUpdate();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );

    }
    self.selectPageTwoforUpdate = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=19&code=" + self.add.pageType;
        $http.get(url).then(
            function (data) {
                console.log(data);
                if (data.data.code == '000') {
                    self.rPositionDictList = data.data.resp;

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );

    }
    $scope.selectPageTwo = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=19&code=" + self.add.pageType;
        $http.get(url).then(
            function (data) {
                console.log(data);
                if (data.data.code == '000') {
                    self.rPositionDictList = data.data.resp;
                    self.add.jumpPage = data.data.resp[0].key;

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("???????????????....");
            }
        );

    }

    self.selectChannelGroup = function (x) {
        if (x == '1') {
            if (self.toUpdate.aioActionStrategyDtoPara.userTagType == 'NO_RULE') {
                $('#userNameLikeSearch1').hide();
            } else {
                var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + self.showText.channelCode + "&rosterType=" + self.toUpdate.aioActionStrategyDtoPara.userTagType;
                $http.post(url).then(
                    function (data) {
                        if (data.data.code == '000') {
                            console.log(data);
                            self.strChannelGroups = data.data.resp;
                            if (self.strChannelGroups.length > 0) {
                                $('#userNameLikeSearch1').show();

                            }
                        } else {
                            alert(data.data.message)
                        }
                    }, function errorCallback(response) {
                        alert("???????????????....");
                    }
                )
            }
        } else {
            if (self.add.aioActionStrategyDtoPara.userTagType == "NO_RULE") {
                $('#userNameLikeSearch').hide();

            } else {
                var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + self.showText.channelCode + "&rosterType=" + self.add.aioActionStrategyDtoPara.userTagType;
                $http.post(url).then(
                    function (data) {
                        if (data.data.code == '000') {
                            console.log(data);
                            self.strChannelGroups = data.data.resp;
                            if (self.strChannelGroups.length > 0) {
                                $('#userNameLikeSearch').show();

                            }
                        } else {
                            alert(data.data.message)
                        }
                    }, function errorCallback(response) {
                        alert("???????????????....");
                    }
                )
            }
        }

    }
    //??????
    self.auditConfirm = function () {

        var strId = self.shenheId;
        var status = self.shenheresult;

        $.post(globalConfig.basePath + "/operation/strategy/status", "id=" + strId + "&status=" + status, function (data) {
            alert(data.message);
            self.manageService();
            $('#auditShow').hide();
        }, "json")
    }
    //??????????????????
    self.shenpi = function (strategyId) {
        self.shenheId = strategyId;
        $('#auditShow').show();
    }


    //????????????
    self.shixiao = function (strategyId) {
        var strategyId = strategyId;
        if (confirm("??????????????????")) {
            $.post(globalConfig.basePath + "/operation/strategy/status", "id=" + strategyId + "&status=2", function (data) {
                alert(data.message)
                console.log(data, "ssss");
                window.location.reload();
            }, "json")
        } else {
            alert("??????????????????");
        }
    }

    //????????????
    self.shengxiao = function (strategyId) {
        if (confirm("??????????????????")) {
            $.post(globalConfig.basePath + "/operation/strategy/status", "id=" + strategyId + "&status=1", function (data) {
                alert(data.message);
                window.location.reload();
            }, "json")
        } else {
            alert("??????????????????");
        }
    }

    //???????????????
    self.shenheren = function () {
        $.ajax({
            type: 'GET',
            url: globalConfig.basePath + "/operation/init/byKey?type=10",
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code != '000') {
                    alert(data.message);
                    return;
                }
                self.shenheList = data.resp;
            }
        })
    }

    /**
     * ????????????????????????
     * @param rad
     */
    self.radioChange = function (rad, updateNumber) {
        if (rad == "0") {
            self.add.tabel1.selectParamList = [];
            self.add.tabel1.textParamList = [];
            self.add.tabel1.numberParamList = [];
            self.add.tabel1.tagList = [];
            self.add.tabel1.checkboxParamList = [];
            $('#yesInputConfig').prop('checked', false);
            $("#noConfig").prop('checked', true);
            self.add.tabel1.IS_EFFECT = 0;
            self.bankInfoList();
            $('#bankallid').hide();
        } else {
            $('#noConfig').prop('checked', false);
            $("#yesInputConfig").prop('checked', true);
            self.selectNodeCode;
            self.initdata();
            self.bankInfoList();
            $('#bankallid').show();
            self.add.tabel1.IS_EFFECT = 1;
        }
        //self.add.tabel1.IS_EFFECT = rad + '';
        if (self.add.tabel1.IS_EFFECT == 1) {
            self.queryOkDeploy(updateNumber);
        }
    }

    self.queryStrategyCondition = function (update) {
        if (update == '1') {
            if (self.add.tabel1.IS_EFFECT == '0') {
                return;
            } else {
                self.queryOkDeploy(1);
            }
        } else {
            if (self.add.tabel1.IS_EFFECT == '0') {
                return;
            } else {
                self.queryOkDeploy();
            }
        }

    }

    /**
     * ?????????????????????
     */
    self.queryOkDeploy = function (updateNum) {
        self.add.tabel1.selectParamList = [];
        self.add.tabel1.textParamList = [];
        self.add.tabel1.numberParamList = [];
        if (updateNum == '1') {

            var url = globalConfig.basePath + "/operation/init/byKey?node=" + self.toUpdate.aioActionStrategyDtoPara.touchCode;
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        var result = data.data.resp;
                        //????????????list
                        var noneList = [];
                        angular.forEach(result, function (each) {
                            if (each.type == "none") {
                                noneList.push(each);
                            }
                        })
                        angular.forEach(noneList, function (each) {
                            var dataList = [];
                            angular.forEach(result, function (eachParent) {
                                if (each.ownCode == eachParent.parentCode) {
                                    dataList.push(eachParent);
                                }
                            })
                            if (dataList[0].type == "select") {
                                self.add.tabel1.selectParam = {};
                                self.add.tabel1.selectParam.param = each;
                                self.add.tabel1.selectParam.list = dataList;
                                self.add.tabel1.selectParamList.push(self.add.tabel1.selectParam);
                            } else if (dataList[0].type == "text") {
                                self.add.tabel1.textParam = {};
                                self.add.tabel1.textParam.param = each;
                                self.add.tabel1.textParam.list = dataList;
                                self.add.tabel1.textParamList.push(self.add.tabel1.textParam);
                            } else if (dataList[0].type == "number") {
                                self.add.tabel1.numberParam = {};
                                self.add.tabel1.numberParam.param = each;
                                self.add.tabel1.numberParam.list = dataList;
                                self.add.tabel1.numberParamList.push(self.add.tabel1.numberParam);
                                console.log(self.add.tabel1.numberParamList, "??????????????????");
                            }

                        })
                        console.log(self.add.tabel1);
                        for (var a = 0; a < self.add.tabel1.numberParamList.length; a++) {
                            for (var x = 0; x < self.add.tabel1.numberParamList[a].list.length; x++) {
                                for (var y = 0; y < self.toUpdate.aioActionStrategyDtoPara.touchStrategyList.length; y++) {
                                    if (self.add.tabel1.numberParamList[a].list[x].key == self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[y].attrKey) {
                                        self.add.tabel1.numberParamList[a].list[x].value = self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[y].attrValue;
                                    }
                                }
                            }
                        }

                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("???????????????....");
                }
            );
        } else {
            var url = globalConfig.basePath + "/operation/init/byKey?node=" + self.add.aioActionStrategyDtoPara.touchCode;
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        var result = data.data.resp;
                        //????????????list
                        var noneList = [];
                        angular.forEach(result, function (each) {
                            if (each.type == "none") {
                                noneList.push(each);
                            }
                        })
                        angular.forEach(noneList, function (each) {
                            var dataList = [];
                            angular.forEach(result, function (eachParent) {
                                if (each.ownCode == eachParent.parentCode) {
                                    dataList.push(eachParent);
                                }
                            })
                            if (dataList[0].type == "select") {
                                self.add.tabel1.selectParam = {};
                                self.add.tabel1.selectParam.param = each;
                                self.add.tabel1.selectParam.list = dataList;
                                self.add.tabel1.selectParamList.push(self.add.tabel1.selectParam);
                            } else if (dataList[0].type == "text") {
                                self.add.tabel1.textParam = {};
                                self.add.tabel1.textParam.param = each;
                                self.add.tabel1.textParam.list = dataList;
                                self.add.tabel1.textParamList.push(self.add.tabel1.textParam);
                            } else if (dataList[0].type == "number") {
                                self.add.tabel1.numberParam = {};
                                self.add.tabel1.numberParam.param = each;
                                self.add.tabel1.numberParam.list = dataList;
                                self.add.tabel1.numberParamList.push(self.add.tabel1.numberParam);

                            }

                        })
                        console.log(self.add.tabel1);
                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("???????????????....");
                }
            );
        }
    }
    /**
     * ??????????????????
     */
    self.triggerChange = function () {
        $('#yesInputConfig').prop('checked', false);
        $("#noConfig").prop('checked', true);
        self.add.tabel1.selectParamList = [];
        self.add.tabel1.textParamList = [];
        self.add.tabel1.numberParamList = [];
    }
    self.valInputIsNull = function (id, msg) {
        var result = true;
        if ($('#' + id).length > 0) {
            var value = $('#' + id).val();
            if (value == null || value == '') {
                alert(msg);
                result = false;
            }
        }
        return result;
    }
    // "IS_EFFECT": self.add.tabel1.IS_EFFECT,				    //?????????????????????
    //     //"SUM_FAIL_COUNT": $('#SUM_FAIL_COUNT').val(),		    //??????????????????
    //     "SUM_MIN_FAIL_COUNT": $('#SUM_MIN_FAIL_COUNT').val(),	//??????????????????
    //     "SUM_MAX_FAIL_COUNT": $('#SUM_MAX_FAIL_COUNT').val(),	//??????????????????
    //     "SUM_MIN_AMOUNT": $('#SUM_MIN_AMOUNT').val(),		    //??????????????????
    //     "SUM_MAX_AMOUNT": $('#SUM_MAX_AMOUNT').val(),		    //??????????????????
    //     "THIS_MIN_AMOUNT": $('#THIS_MIN_AMOUNT').val(),		    //??????????????????
    //     "THIS_MAX_AMOUNT": $('#THIS_MAX_AMOUNT').val(),		    //??????????????????
    //     "SUM_TIME_COUNT": 1,								    //?????????????????????
    //     "SUM_TIME_COUNT_TYPE": "NATUREDAY",					    //??????????????????????????????NATUREDAY????????? DAY ??? WEEK??? MONTH ??? YEAR?????????


    self.GetValidateJsonData = function () {
        var strategyCondition = [];
        if (self.add.tabel1.numberParamList && self.add.tabel1.numberParamList.length > 0) {
            for (var i = 0; i < self.add.tabel1.numberParamList.length; i++) {
                for (var x = 0; x < self.add.tabel1.numberParamList[i].list.length; x++) {
                    strategyCondition.push({
                        "strategyConditionKey": self.add.tabel1.numberParamList[i].list[x].key,
                        "strategyConditionValue": $('#' + self.add.tabel1.numberParamList[i].list[x].key).val()
                    })
                }

            }
        }
        if (self.add.tabel1.selectParamList && self.add.tabel1.selectParamList.length > 0) {
            for (var i = 0; i < self.add.tabel1.selectParamList.length; i++) {
                for (var x = 0; x < self.add.tabel1.selectParamList[i].list.length; x++) {
                    strategyCondition.push({
                        "strategyConditionKey": self.add.tabel1.selectParamList[i].list[x].key,
                        "strategyConditionValue": $('#' + self.add.tabel1.selectParamList[i].list[x].key).val()
                    })
                }

            }
        }
        if (self.add.tabel1.textParamList && self.add.tabel1.textParamList.length > 0) {
            for (var i = 0; i < self.add.tabel1.textParamList.length; i++) {
                for (var x = 0; x < self.add.tabel1.textParamList[i].list.length; x++) {
                    strategyCondition.push({
                        "strategyConditionKey": self.add.tabel1.textParamList[i].list[x].key,
                        "strategyConditionValue": $('#' + self.add.tabel1.textParamList[i].list[x].key).val()
                    })
                }

            }
        }
        if (self.showText.serviceCode == 'QB_USER_DEFINED' || self.showText.serviceCode == 'WK_USER_DEFINED') {
            var data = "";
            var queryInfo = $(".query-info");
            for (var i = 0; i < queryInfo.length; i++) {
                var queryList = queryInfo.eq(i).find(".query-list");
                for (var j = 0; j < queryList.length; j++) {
                    data = queryList.eq(j).find(".inp1 select").val();
                    if (queryList.eq(j).find(".inp1 select").val() != null) {
                        strategyCondition.push({
                            "strategyConditionKey": "REALTIME_TAG",
                            "strategyConditionValue": queryList.eq(j).find(".inp1 select").val()
                        })
                        self.add.tabel1.triggerNode = queryList.eq(j).find(".inp1 select").val();
                        self.add.aioActionStrategyDtoPara.touchCode = queryList.eq(j).find(".inp1 select").val()
                        for (let k = 0; k < self.tagSelectList.length; k++) {
                            if(self.add.aioActionStrategyDtoPara.touchCode == self.tagSelectList[k].english){
                                self.addrealtimeType = self.tagSelectList[k].option;
                                strategyCondition.push({
                                    "strategyConditionKey": "REALTIME_TYPE",
                                    "strategyConditionValue": self.addrealtimeType
                                })
                            }
                        }
                    }
                    //????????????????????????
                    if (queryList.eq(j).find("[type=checkbox]").length > 0) {
                        var checkboxList = queryList.eq(j).find("[type=checkbox]");
                        for (var z = 0; z < checkboxList.length; z++) {
                            data = checkboxList.eq(z).val();
                        }
                    } else {
                        data = queryList.eq(j).find(".inp2 select").val();
                        if (queryList.eq(j).find(".inp2 select").val() != null) {
                            strategyCondition.push({
                                "strategyConditionKey": "REALTIME_CRITERIA",
                                "strategyConditionValue": queryList.eq(j).find(".inp2 select").val()
                            })
                        }
                    }
                    //????????????between,??????????????????
                    if (queryList.eq(j).find(".inp2 select").val() != null) {
                        if (queryList.eq(j).find(".inp2 select").val() == "between") {
                            var startTime = queryList.eq(j).find(".dateno1").eq(0).val();//between?????????????????????
                            var endTime = queryList.eq(j).find(".dateno2").eq(0).val();//between?????????????????????
                            data += "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime;
                            strategyCondition.push({
                                "strategyConditionKey": "REALTIME_VALUE",
                                "strategyConditionValue": "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime
                            })
                        } else {
                            data = queryList.eq(j).find(".inp3 input").val();
                            strategyCondition.push({
                                "strategyConditionKey": "REALTIME_VALUE",
                                "strategyConditionValue": queryList.eq(j).find(".inp3 input").val()
                            })
                        }
                    }
                }
            }
        }

        if((self.showText.serviceCode == "WK_BANK_FLOW" && self.add.tabel1.IS_EFFECT ==1 )||(self.showText.serviceCode == "QB_BANK_FLOW" && self.add.tabel1.IS_EFFECT==1 ) ){
            var str = "";
            $(".addBankCode").each(function () {
                if(this.checked==true){
                    str += $(this).val() + ",";
                }
            })
            var checkdbanks = str.substring(0,str.length-1);
            if (checkdbanks != null) {
                strategyCondition.push({
                    "strategyConditionKey": "BANK_CODE",
                    "strategyConditionValue": checkdbanks
                })
            }else{
                alert("?????????????????????");
                return
            }
        }
        strategyCondition.push({
            "strategyConditionKey": "IS_EFFECT",
            "strategyConditionValue": self.add.tabel1.IS_EFFECT
        })
        strategyCondition.push({
            "strategyConditionKey": "SUM_TIME_COUNT_TYPE",
            "strategyConditionValue": "NATUREDAY"
        })
        strategyCondition.push({
            "strategyConditionKey": "SUM_TIME_COUNT",
            "strategyConditionValue": '1'
        })
        if (!self.add.aioActionStrategyDtoPara.userTag) {
            self.add.aioActionStrategyDtoPara.userTag = null;
        }

        var json = {
            "channel": self.showText.channelCode,				    //??????
            "serviceTypeCode": self.showText.serviceCode,		    //????????????
            "userActionCode": self.showText.userActionCode,			    //????????????
            "strategyResult": self.add.aioActionStrategyDtoPara.strategyResult,	    //??????????????????
            "strategyCycle": self.add.aioActionStrategyDtoPara.strategyCycle,		    //???????????????xxx??????????????????
            "strategyCondition": strategyCondition,                  //????????????
            "userTagType": self.add.aioActionStrategyDtoPara.userTagType,	    //????????????
            "userTag": self.add.aioActionStrategyDtoPara.userTag,			    //????????????
            "touchTimeCount": self.add.aioActionStrategyDtoPara.touchTimeCount,	    //???????????????n????????????
            "touchCount": self.add.aioActionStrategyDtoPara.touchCount,			    //???????????????????????????n???
            "touchCountType": 'NATUREDAY',						    //???????????????1???????????????????????????
            "status": "UNAUDITED",
            "invalidTime": $('#downTime').val(),
            "validTime": $('#upTime').val(),
            "touchType": self.add.aioActionStrategyDtoPara.touchType,
            "touchCode": self.add.aioActionStrategyDtoPara.touchCode,//????????????code
            "bankCode":self.add.aioActionStrategyDtoPara.bankCode
        };
        return json;
    }

    self.commitAddStrategy = function () {
        if (!self.add.aioTouchWayDtoPara.touchTimeType) {
            alert("??????????????????????????????!");
            return;
        }
        if (!$('#upTime').val()) {
            alert("????????????????????????!");
            return;
        }
        if (!$('#downTime').val()) {
            alert("????????????????????????!");
            return;
        }
        if (self.add.aioTouchWayDtoPara.touchWay == 'BANNER') {

            if (self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.bannerBtnUrlType == 'PRIMORDIAL') {

                self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.pageType = self.add.pageType;
                self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.primordialPage = self.add.jumpPage;
                if (!self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.pageType) {
                    alert("???????????????????????????????????????!");
                    return;
                }


            }
            if (self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.bannerBtnUrlType == 'URL') {
                if (!self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.bannerBtnUrl) {
                    alert("????????????????????????!");
                    return;
                }
            }
            if (!self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.bannerContent) {
                alert("banner??????????????????!");
                return;
            }
            if (!self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto.bannerBtnContent) {
                alert("????????????????????????!");
                return;
            }

        }
        if (self.add.aioTouchWayDtoPara.touchWay == 'SOFT_POPUP') {
            if (self.add.aioTouchWayDtoPara.parentContentDto.softPopupContentDto.skipType == 'PRIMORDIAL') {
                self.add.aioTouchWayDtoPara.parentContentDto.softPopupContentDto.pageType = self.add.pageType;
                self.add.aioTouchWayDtoPara.parentContentDto.softPopupContentDto.primordialPage = self.add.jumpPage;

            }
        }
        if (self.add.aioTouchWayDtoPara.touchWay == 'PUSH') {
            if (self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.skipType == 'PRIMORDIAL') {
                self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.pageType = self.add.pageType;
                self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.primordialPage = self.add.jumpPage;
                if (!self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.pageType) {
                    alert("???????????????????????????????????????!");
                    return;
                }
            }
            if (self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.skipType == 'URL') {
                if (!self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.skipUrl) {
                    alert("????????????????????????!");
                    return;
                }
            }
            if (!self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.touchPushTitle) {
                alert("????????????????????????!");
                return;
            }
            if (!self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto.touchPushContent) {
                alert("????????????????????????!");
                return;
            }
        }
        if (self.add.aioTouchWayDtoPara.touchWay == 'PUSH_MAIL') {
            if (!self.add.aioTouchWayDtoPara.parentContentDto.pushMailContentDto.touchPushContent) {
                alert("???????????????????????????!");
                return;
            }
            if (!self.add.aioTouchWayDtoPara.parentContentDto.pushMailContentDto.touchPushTitle) {
                alert("???????????????????????????!");
                return;
            }
        }
        if (!self.valInputIsNull('SUM_MIN_FAIL_COUNT', '????????????????????????' + '????????????')) {
            return;
        }
        if (!self.valInputIsNull('SUM_MAX_FAIL_COUNT', '????????????????????????' + '????????????')) {
            return;
        }
        if (!self.valInputIsNull('SUM_MIN_AMOUNT', '??????????????????' + '????????????')) {
            return;
        }
        if (!self.valInputIsNull('SUM_MAX_AMOUNT', '??????????????????' + '????????????')) {
            return;
        }
        if (!self.valInputIsNull('THIS_MIN_AMOUNT', '??????????????????' + '????????????')) {
            return;
        }
        if (!self.valInputIsNull('THIS_MAX_AMOUNT', '??????????????????' + '????????????')) {
            return;
        }
        if (!self.valInputIsNull('SUM_TIME_COUNT', '????????????????????? ' + '????????????')) {
            return;
        }
        //??????????????????
        if(self.add.aioActionStrategyDtoPara.strategyResult == 'BANK_OPEN_SUCCESS' ||self.add.aioActionStrategyDtoPara.strategyResult == 'BANK_PAY_SUCCESS'){
                var str = "";
                $(".addyqBankCode").each(function () {
                    if(this.checked==true){
                        str += $(this).val() + ",";
                    }
                })
                var checkdbanks = str.substring(0,str.length-1);
                if (checkdbanks != null) {
                    self.add.aioActionStrategyDtoPara.bankCode  = checkdbanks;
                }else{
                    alert("?????????????????????");
                    return
                }
        }

        self.add.aioTouchWayDtoPara.parentContentDto.popupContentDto.touchPage = null;
        self.add.aioActionStrategyDtoPara = self.GetValidateJsonData();

        if (self.add.aioActionStrategyDtoPara.strategyCycle) {
            if (parseInt(self.add.aioActionStrategyDtoPara.strategyCycle) > 7 || parseInt(self.add.aioActionStrategyDtoPara.strategyCycle) < 1) {
                alert("?????????????????????????????????7???????????????1");
                return;
            }
        }
        if (!self.add.aioActionStrategyDtoPara.strategyCycle) {
            alert("?????????????????????????????????!");
            return;
        }

        if (self.add.aioActionStrategyDtoPara.touchTimeCount) {
            if (parseInt(self.add.aioActionStrategyDtoPara.touchTimeCount) > 30 || parseInt(self.add.aioActionStrategyDtoPara.touchTimeCount) < 1) {
                alert("????????????????????????30???????????????1");
                return;
            }

        }
        if (!self.add.aioActionStrategyDtoPara.touchTimeCount) {
            alert("???????????????????????????!");
            return;
        }

        if (self.add.aioActionStrategyDtoPara.touchCount) {
            if (parseInt(self.add.aioActionStrategyDtoPara.touchCount) > 10 || parseInt(self.add.aioActionStrategyDtoPara.touchCount) < 1) {
                alert("????????????????????????10???????????????1");
                return;
            }
        }
        if (!self.add.aioActionStrategyDtoPara.touchCount) {
            alert("???????????????????????????????????????!");
            return;
        }
        var str = "";
        $(".bankInfoName").each(function () {
            if (this.checked == true) {
                str += $(this).val() + ",";
            }
        })
        if (self.add.aioActionStrategyDtoPara.serviceCode == 'QB_USER_DEFINED' || self.add.aioActionStrategyDtoPara.serviceCode == 'WK_USER_DEFINED') {
            //??????????????????
            for (var i = 0; i < $(".query-wrap .demo-1").length; i++) {
                var $t = $(".query-wrap .demo-1").eq(i);
                if ($t.val() == "" || $t.val() == null || $t.val() == "null") {
                    alert("????????????")
                    return;
                }
            }
            for (var c = 0; c < $('.query-wrap .inp2').length; c++) {
                var value = $('.query-wrap .inp2').eq(c).find('.demo-1').val();

                if ($(".query-wrap .inp-text").eq(c).val() == "") {
                    if (value == 'notnull' || value == 'isnull') {
                        break;
                    } else {
                        alert("????????????????????????!");
                        return;
                    }
                }
            }
        }
        var str = "";
        $(".addBankCode").each(function () {
            if (this.checked == true) {
                str += $(this).val() + ",";
            }
        })
        var checkdbanks = str.substring(0, str.length - 1);
        if (checkdbanks == null) {
            alert("????????????????????????!");
            return
        }
        self.toUpdate = {};
        console.log(self.add, "?????????????????????")
        $http.post(globalConfig.basePath + "/smartStrategy/insert", JSON.stringify(self.add)).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data);
                    alert("????????????!");
                    self.viewPage = 'pageTwo';
                    $scope.manageService();
                    self.add.aioTouchWayDtoPara = {};
                    self.add.aioTouchWayDtoPara.parentContentDto = {};
                    self.add.aioActionStrategyDtoPara = {};
                    self.add.aioTouchWayDtoPara.parentContentDto.softPopupContentDto = {};
                    self.add.aioActionStrategyDtoPara.userTagType = "NO_RULE";
                    self.add.aioTouchWayDtoPara.parentContentDto.bannerContentDto = {};
                    self.add.aioTouchWayDtoPara.parentContentDto.aioActionStrategyDtoPara = {};
                    self.add.aioTouchWayDtoPara.parentContentDto.messageContentDto = {};
                    self.add.aioTouchWayDtoPara.parentContentDto.pushMailContentDto = {};
                    self.add.aioTouchWayDtoPara.parentContentDto.pushContentDto = {};
                    self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto = [];
                    self.add.aioTouchWayDtoPara.parentContentDto.popupContentDto = {};
                    self.add.approverId = null;
                    self.add.approverNote = '';
                    self.add.reward = {};
                    self.add.tabel1 = {};
                    self.add.aioActionStrategyDtoPara.touchCode = null;
                    self.add.tabel1.IS_EFFECT = 0;
                    self.add.aioActionStrategyDtoPara.bankCode = null;

                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(data) {
                alert("????????????!");
            }
        );

    }

    /**
     * ??????????????????
     * @param channel
     * @param couponId
     * @returns {PromiseLike<T | never> | Promise<T | never> | *}
     */
    self.exportPageTwo = function () {
        if (!self.manage.nodeCode) {
            self.manage.nodeCode = null;
        }
        if (!self.manage.resultType) {
            self.manage.resultType = null;
        }

        if (!self.manage.strategyResult) {
            self.manage.strategyResult = null;
        }
        if (!self.manage.strategyStatus) {
            self.manage.strategyStatus = null;
        }
        var form = $('#exportPage2');
        form.attr("action", globalConfig.basePath + "/operation/leveltwo/export");
        form.attr("target", "downloadIframe");
        form.submit();

    }
    /**
     * ??????????????????
     * @param channel
     * @param couponId
     * @returns {PromiseLike<T | never> | Promise<T | never> | *}
     */
    self.updateService = function (strategyId) {
        self.toUpdate = {};
        var url = globalConfig.basePath + "/strategy/detail?strategyId=" + strategyId;
        $http.get(url).then(
            function (data) {
                console.log(data, "??????????????????");
                if (data.data.code == '000') {
                    self.toUpdate.aioActionStrategyDtoPara = data.data.resp.strategyDto;
                    self.updserviceTypeCode = data.data.resp.strategyDto.serviceTypeCode;
                    self.toUpdate.aioActionStrategyDtoPara.touchStrategyList.forEach(function (value, index, array) {
                        if (value.attrKey === "REALTIME_TAG") {
                            self.updrealtimeTag = value.attrValue;
                        } else if (value.attrKey === "REALTIME_CRITERIA") {
                            self.updrealtimeCrteria = value.attrValue;
                        } else if (value.attrKey === "REALTIME_VALUE") {
                            self.updrealtimeValue = value.attrValue;
                        } else if (value.attrKey === "REALTIME_TYPE") {
                            self.updrealtimeType = value.attrValue;
                        }else if (value.attrKey === "IS_EFFECT") {
                            self.updIS_EFFECT = value.attrValue;
                        }
                    });
                    $scope.queryTagSelectList();
                    setTimeout(function () {
                        self.updtouchCode = self.toUpdate.aioActionStrategyDtoPara.touchCode;//????????????
                    },100)
                    self.toUpdate.aioTouchWayDtoPara = data.data.resp.touchWayDto;
                    var yuansheng = data.data.resp.touchWayDto.parentContentDTO;
                    self.toUpdate.approverId = data.data.resp.approverId;
                    self.toUpdate.approverNote = data.data.resp.approverNote;
                    self.selectPageOneforUpdate();
                    self.selectPageTwoforUpdate();
                    self.rosterTypeSelect(1);
                    if (yuansheng.bannerContentDto.pageType && yuansheng.bannerContentDto.primordialPage) {
                        self.add.pageType = yuansheng.bannerContentDto.pageType;
                        self.add.jumpPage = yuansheng.bannerContentDto.primordialPage;
                    }
                    if (yuansheng.pushContentDto.pageType && yuansheng.pushContentDto.primordialPage) {
                        self.add.pageType = yuansheng.pushContentDto.pageType;
                        self.add.jumpPage = yuansheng.pushContentDto.primordialPage;
                    }
                    if (yuansheng.softPopupContentDto.pageType && yuansheng.softPopupContentDto.primordialPage) {
                        self.add.pageType = yuansheng.softPopupContentDto.pageType;
                        self.add.jumpPage = yuansheng.softPopupContentDto.primordialPage;
                    }

                    var index;
                    for (var i = 0; i < self.toUpdate.aioActionStrategyDtoPara.touchStrategyList.length; i++) {
                        if (self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[i].attrKey == 'IS_EFFECT') {
                            index = self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[i].attrValue;
                            break;
                        }
                    }

                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition = [];
                    self.radioChange(self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[i].attrValue, 1);
                    self.viewPage = 'update';


                    if (!self.toUpdate.aioActionStrategyDtoPara.userTag) {
                        self.toUpdate.aioActionStrategyDtoPara.userTag = null;
                    }

                    if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto) {
                        var awardList = self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto;
                        for (var i = 0; i < awardList.length; i++) {
                            if (awardList[i].awardType == 'JIFEN') {
                                $.ajax({
                                    url: globalConfig.basePath + "/smart_marketing/initiative/getIntegralId?jfRuleId=" + awardList[i].jfRuleId,
                                    type: "get",
                                    dataType: "json",
                                    contentType: "text/html;charset=utf-8",
                                    data: awardList[i].jfRuleId,
                                    async: false,
                                    success: function (data) {
                                        console.log("??????????????????", data);
                                        if (data.code == '000' && data.resp.code == '2000') {

                                            awardList[i].awardDesc = '??????-' + awardList[i].awardContent + '-????????????:' + data.resp.data.availablePoint;

                                        }
                                    }

                                })
                            }
                        }

                    }
                    console.log(self.add.tabel1.numberParamList, "???????????????");
                    self.shenheren();
                    self.checkRosterTypeSelect();
                    self.updqueryinitdata(data);
                    if (self.updserviceTypeCode == "WK_BANK_FLOW" || self.updserviceTypeCode == "QB_BANK_FLOW") {
                        updbankschecked(data);
                    }
                } else {
                    alert(data.data.message);
                }
            }
        )


    }

    self.commitUpdate = function () {
        if (self.toUpdate.aioActionStrategyDtoPara.strategyCycle) {
            if (parseInt(self.toUpdate.aioActionStrategyDtoPara.strategyCycle) > 7 || parseInt(self.toUpdate.aioActionStrategyDtoPara.strategyCycle) < 1) {
                alert("?????????????????????????????????7???????????????1");
                return;
            }
        }
        if (!self.toUpdate.aioActionStrategyDtoPara.strategyCycle) {
            alert("?????????????????????????????????!");
            return;
        }

        if (self.toUpdate.aioActionStrategyDtoPara.touchTimeCount) {
            if (parseInt(self.toUpdate.aioActionStrategyDtoPara.touchTimeCount) > 30 || parseInt(self.toUpdate.aioActionStrategyDtoPara.touchTimeCount) < 1) {
                alert("????????????????????????30???????????????1");
                return;
            }

        }
        if (!self.toUpdate.aioActionStrategyDtoPara.touchTimeCount) {
            alert("???????????????????????????!");
            return;
        }

        if (self.toUpdate.aioActionStrategyDtoPara.touchCount) {
            if (parseInt(self.toUpdate.aioActionStrategyDtoPara.touchCount) > 10 || parseInt(self.toUpdate.aioActionStrategyDtoPara.touchCount) < 1) {
                alert("????????????????????????10???????????????1");
                return;
            }
        }
        if (!self.toUpdate.aioActionStrategyDtoPara.touchCount) {
            alert("????????????????????????????????????!");
            return;
        }
        if (self.toUpdate.aioTouchWayDtoPara.touchTimeType == 'SMARTTOUCH' && !self.toUpdate.aioTouchWayDtoPara.muchTime) {
            alert("??????????????????????????????!");
            return;
        }
        if (!$('#upTime2').val()) {
            var day2 = new Date();
            day2.setTime(day2.getTime());
            var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate() + " " + day2.getHours() + ":" + day2.getMinutes() + ":" + day2.getSeconds();
            self.toUpdate.aioActionStrategyDtoPara.validTime = s2;


        }
        if (!$('#downTime2').val()) {
            self.toUpdate.aioActionStrategyDtoPara.invalidTime = "2030-01-01 23:59:59";
        }
        if (self.toUpdate.aioTouchWayDtoPara.touchWay == 'BANNER') {
            if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.bannerContentDto.bannerBtnUrlType == 'PRIMORDIAL') {
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.bannerContentDto.pageType = self.add.pageType;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.bannerContentDto.primordialPage = self.add.jumpPage;
            }
        }
        if (self.toUpdate.aioTouchWayDtoPara.touchWay == 'SOFT_POPUP') {
            if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.softPopupContentDto.skipType == 'PRIMORDIAL') {
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.softPopupContentDto.pageType = self.add.pageType;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.softPopupContentDto.primordialPage = self.add.jumpPage;

            }
        }
        if (self.toUpdate.aioTouchWayDtoPara.touchWay == 'PUSH') {
            if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.pushContentDto.skipType == 'PRIMORDIAL') {
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.pushContentDto.pageType = self.add.pageType;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.pushContentDto.primordialPage = self.add.jumpPage;
            }
        }
        // "touchCountType":'NATUREDAY',						    //???????????????1???????????????????????????
        //     "status":"UNAUDITED",
        //     "invalidTime":$('#upTime').val(),
        //     "validTime":$('#downTime').val(),
        self.toUpdate.aioActionStrategyDtoPara.touchCountType = 'NATUREDAY';
        self.toUpdate.aioActionStrategyDtoPara.invalidTime = $('#downTime2').val();
        self.toUpdate.aioActionStrategyDtoPara.validTime = $('#upTime2').val();
        self.toUpdate.aioActionStrategyDtoPara.status = "UNAUDITED";
        console.log(self.toUpdate);
        self.toUpdate.aioActionStrategyDtoPara.serviceTypeCode = self.showText.serviceCode;
        self.toUpdate.aioActionStrategyDtoPara.userActionCode = self.showText.userActionCode;
        if (self.add.tabel1.numberParamList && self.add.tabel1.numberParamList.length > 0) {
            for (var i = 0; i < self.add.tabel1.numberParamList.length; i++) {
                for (var x = 0; x < self.add.tabel1.numberParamList[i].list.length; x++) {
                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                        "strategyConditionKey": self.add.tabel1.numberParamList[i].list[x].key,
                        "strategyConditionValue": $('#' + "up" + self.add.tabel1.numberParamList[i].list[x].key).val()
                    })
                }

            }
        }
        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
            "strategyConditionKey": "IS_EFFECT",
            "strategyConditionValue": self.add.tabel1.IS_EFFECT
        })

        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
            "strategyConditionKey": "SUM_TIME_COUNT_TYPE",
            "strategyConditionValue": "NATUREDAY"
        })
        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
            "strategyConditionKey": "SUM_TIME_COUNT",
            "strategyConditionValue": '1'
        })

        if (self.toUpdate.aioActionStrategyDtoPara.serviceTypeCode == 'QB_USER_DEFINED' || self.toUpdate.aioActionStrategyDtoPara.serviceTypeCode == 'WK_USER_DEFINED') {
            var data = "";
            var queryInfo = $(".query-updinfo");
            for (var i = 0; i < queryInfo.length; i++) {
                var queryList = queryInfo.eq(i).find(".query-list");
                for (var j = 0; j < queryList.length; j++) {
                    data = queryList.eq(j).find(".inp1 select").val();
                    if (queryList.eq(j).find(".inp1 select").val() != null) {
                        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                            "strategyConditionKey": "REALTIME_TAG",
                            "strategyConditionValue": queryList.eq(j).find(".inp1 select").val()
                        })
                        self.toUpdate.aioActionStrategyDtoPara.touchCode = "REALTIME_TAG";
                        for (let k = 0; k < self.tagSelectList.length; k++) {
                            if(self.toUpdate.aioActionStrategyDtoPara.touchCode == self.tagSelectList[k].english){
                                self.updrealtimeType = self.tagSelectList[k].option;
                                strategyCondition.push({
                                    "strategyConditionKey": "REALTIME_TYPE",
                                    "strategyConditionValue": self.updrealtimeType
                                })
                            }
                        }
                    }
                    //????????????????????????
                    if (queryList.eq(j).find("[type=checkbox]").length > 0) {
                        var checkboxList = queryList.eq(j).find("[type=checkbox]");
                        for (var z = 0; z < checkboxList.length; z++) {
                            data = checkboxList.eq(z).val();
                        }
                    } else {
                        data = queryList.eq(j).find(".inp2 select").val();
                        if (queryList.eq(j).find(".inp2 select").val() != null) {
                            self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                                "strategyConditionKey": "REALTIME_CRITERIA",
                                "strategyConditionValue": queryList.eq(j).find(".inp2 select").val()
                            })
                        }
                    }
                    //????????????between,??????????????????
                    if (queryList.eq(j).find(".inp2 select").val() != null) {
                        if (queryList.eq(j).find(".inp2 select").val() == "between") {
                            var startTime = queryList.eq(j).find(".dateno1").eq(0).val();//between?????????????????????
                            var endTime = queryList.eq(j).find(".dateno2").eq(0).val();//between?????????????????????
                            data += "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime;
                            self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                                "strategyConditionKey": "REALTIME_VALUE",
                                "strategyConditionValue": "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime
                            })
                        } else {
                            data = queryList.eq(j).find(".inp3 input").val();
                            if (queryList.eq(j).find(".inp3 input").val() != null) {
                                self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                                    "strategyConditionKey": "REALTIME_VALUE",
                                    "strategyConditionValue": queryList.eq(j).find(".inp3 input").val()
                                })
                            }
                        }
                    }
                }
            }
        }
        if((self.toUpdate.aioActionStrategyDtoPara.serviceTypeCode == "WK_BANK_FLOW" && self.updIS_EFFECT ==1 )||(self.toUpdate.aioActionStrategyDtoPara.serviceTypeCode == "QB_BANK_FLOW" && self.updIS_EFFECT==1 ) ){
            var str = "";
            $(".updBankCode").each(function () {
                if(this.checked==true){
                    str += $(this).val() + ",";
                }
            })
            var checkdbanks = str.substring(0,str.length-1);
            if (checkdbanks != null) {
                self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                    "strategyConditionKey": "BANK_CODE",
                    "strategyConditionValue": checkdbanks
                })
            }else{
                alert("?????????????????????");
                return
            }
        }

           if(self.toUpdate.aioActionStrategyDtoPara.strategyResult == 'BANK_OPEN_SUCCESS' || self.toUpdate.aioActionStrategyDtoPara.strategyResult == 'BANK_PAY_SUCCESS' ){
                var str = "";
                $(".updyqBankCode").each(function () {
                    if(this.checked==true){
                        str += $(this).val() + ",";
                    }
                })
                var checkdbanks = str.substring(0,str.length-1);
                if (checkdbanks != null) {
                    self.toUpdate.aioActionStrategyDtoPara.bankCode = checkdbanks;
                }else{
                    alert("?????????????????????");
                    return
                }
        }

        console.log(self.toUpdate.aioActionStrategyDtoPara.strategyCondition, "????????????");

        self.toUpdate.aioActionStrategyDtoPara.channel = self.showText.channelCode;
        self.toUpdate.aioTouchWayDtoPara.parentContentDto = self.toUpdate.aioTouchWayDtoPara.parentContentDTO;
        console.log(self.toUpdate, "?????????????????????");
        $http.post(globalConfig.basePath + "/smartStrategy/update", JSON.stringify(self.toUpdate)).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data);
                    alert("????????????!");
                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition = [];
                    self.toUpdate = {};
                    self.viewPage = 'pageTwo';
                    $scope.manageService();

                } else {
                    alert(data.data.message);
                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition = [];
                }
            }, function errorCallback(data) {
                alert("????????????!");
            }
        );


    }


    //==============================??????????????????========================================================
    //??????????????????
    $scope.getCoupon = function (channel, couponId,awardType) {
        var param = new Object();
        param.channel = channel;
        param.couponId = couponId;
        param.awardType=awardType;
        var url = globalConfig.basePath + "/prize/getCouponName";
        var promise = $http.post(url, param);
        return promise.then(function (result) {

            if (result.data.code == '000') {
                console.log("????????????????????????: ", result);
                self.tempCoupon = result.data.resp;
                return result.data.resp;
            }else{
                alert(result.data.message);
                return;
            }
        });
    }

    self.updateCard = function (x) {
        if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto) {
            var length = self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto.length;
        } else {
            self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto = [];
            length = 0;
        }

        if (x.awardType == 'JIFEN') {

            if (!x.awardContent) {
                alert("??????????????????id????????????!");
                return;
            }
            if (!x.jiFenDesc && x.awardType == 'JIFEN') {
                alert("????????????????????????!");
                return;
            }
            if (x.awardType == 'JIFEN' && !x.jfRuleId) {
                alert("????????????ID????????????!");
                return;
            }

            var jfContent = self.selectintegral(x);
            if (!jfContent){
                return;
            }

            console.log("????????????",x.awardDesc);
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto[length] = {
                    "awardType": x.awardType,
                    "awardContent": x.awardContent,
                    "jiFenDesc": x.jiFenDesc,
                    "awardDesc": jfContent,
                    "jfRuleId": x.jfRuleId,
                    "openCardHelp": '0'
                }


        } else {
            self.getCoupon(self.showText.channelCode, x.awardContent,x.awardType);
            setTimeout(function () {

                // console.log("?????????????????? setTimeOut ??? coupon???", coupon);
                console.log("setTImeOut??? Coupon: ", $scope.tempCoupon);
                if (!self.tempCoupon || null == self.tempCoupon || !self.tempCoupon.couponName || !self.tempCoupon.discount) {
                    return;
                }
                x.awardDesc = x.awardContent + "-" + self.tempCoupon.couponName + "-" + self.tempCoupon.couponTypeName + "-" + self.tempCoupon.discount+ "-" + self.tempCoupon.couponCount;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto[length] = {
                    "awardType": x.awardType,
                    "awardContent": x.awardContent,
                    "awardDesc": x.awardDesc,
                    "openCardHelp": '0'

                }

                $scope.tempCoupon = null;
                $scope.$apply();
            }, 1000);


        }
        document.getElementById("s").style.display = "none";
        self.add.reward = {};
    }


    /**
     * ??????????????????
     * @param x
     * @param updateNumber
     */
    self.selectintegral = function(x) {
        var thisChannelCode = self.showText.channelCode == "WK"?2:1;
        var jifenValue = x.awardContent;
        var allContent = null;
        if (x.awardType == 'JIFEN') {
            $.ajax({
                url: globalConfig.basePath + "/smart_marketing/initiative/checkPointRuleId?pointRuleId=" + x.jfRuleId+"&productChannel="+thisChannelCode+"&scene=9",
                type: "get",
                dataType: "json",
                contentType: "text/html;charset=utf-8",
                data: x.jfRuleId,
                async: false,
                success: function (data) {
                    console.log("??????????????????", data);
                    if (data.code == '000') {
                        if (typeof (data.resp.data) == "undefined" || data.resp.data == null || data.resp.data.channel != thisChannelCode) {
                            alert("????????????????????????????????????");
                            return;
                        } else if (data.resp.data == null) {
                            allContent = null;
                        } else if (data.resp.data.status == '0' || data.resp.data.status == '9') {
                            alert("??????????????????????????????????????????!");
                            return;
                        } else if (data.resp.data.status == '2') {
                            alert("???????????????????????????????????????!");
                            return;
                        } else {
                            allContent = '??????-' + jifenValue + '-????????????:' + data.resp.data.availablePoint;

                        }
                    }else{
                        alert(data.message);
                        return;
                    }
                }

            })

            return allContent;
        }
    }


    /**
     * ????????????????????????
     */
    self.closeAddAward = function(){
        $('#s').hide();
        self.add.reward = {};
    }

    self.commitAddAction = function (x,updateNumber) {
        console.log(updateNumber,"???????????????");
        console.log(x);
        if (updateNumber == 'update') {
            self.updateCard(x);
        }
        else {
            if (x.awardType == 'JIFEN') {
                if (!x.awardContent) {
                    alert("??????????????????id????????????!");
                    return;
                }
                if (x.awardType == 'JIFEN' && !x.jfRuleId) {
                    alert("????????????ID????????????!");
                    return;
                }
                if (!x.jiFenDesc && x.awardType == 'JIFEN') {
                    alert("????????????????????????!");
                    return;
                }
                var jfContent = self.selectintegral(x);
                if (!jfContent) {
                    return;
                }
                console.log("????????????", x.awardDesc);
            }
            setTimeout(function () {
                var length = self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto.length;
                if (x.awardType == 'JIFEN' ) {

                        self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto[length] = {
                            "awardType": x.awardType,
                            "awardContent": x.awardContent,
                            "jiFenDesc": x.jiFenDesc,
                            "awardDesc": jfContent,
                            "jfRuleId": x.jfRuleId,
                            "openCardHelp": '0'

                        }

                } else {
                    self.getCoupon(self.showText.channelCode, x.awardContent,x.awardType);
                    setTimeout(function () {

                        // console.log("?????????????????? setTimeOut ??? coupon???", coupon);
                        console.log("setTImeOut??? Coupon: ", $scope.tempCoupon);
                        if (!self.tempCoupon || null == self.tempCoupon || !self.tempCoupon.couponName || !self.tempCoupon.discount) {
                            return;
                        }
                        x.awardDesc = x.awardContent + "-" + self.tempCoupon.couponName + "-" + self.tempCoupon.couponTypeName + "-" + self.tempCoupon.discount+ "-" + self.tempCoupon.couponCount;
                        self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto[length] = {
                            "awardType": x.awardType,
                            "awardContent": x.awardContent,
                            "awardDesc": x.awardDesc,
                            "openCardHelp": '0'

                        }

                        $scope.tempCoupon = null;
                        $scope.$apply();
                    }, 1000);


                }
                document.getElementById("s").style.display = "none";
                console.log(self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto);
                self.add.reward = {};
                $scope.$apply();
            }, 100);
        }

    };


    self.addAction = function () {

        document.getElementById("s").style.display = "block";

    };
    self.deleteAction = function (award,updateNumber) {
        if (updateNumber == '1'){
            var indexOf = self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto.indexOf(award);
            if (confirm('???????????????????')) {
                if (indexOf > -1) {
                    self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto.splice(indexOf, 1);
                }
            }
        } else {
            var indexOf = self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto.indexOf(award);
            if (confirm('???????????????????')) {
                if (indexOf > -1) {
                    self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto.splice(indexOf, 1);
                }
            }
        }
    }



    //???????????????????????????
    self.initdata = function () {
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.showText.channelCode + "&dataType=2",
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
                console.log(self.initSelectDataList, "????????????log");
                // 1 ????????????????????? option
                initQueryNameList = "";
                initQueryCriteriaList = "";
                $('.query-wrap').html(null);
                $('.query-info').html(null);
                var $this = $(this);
                self.options = $("#tagSelectListid option:selected").val();
                for (var i = 0; i < self.initSelectDataList.length; i++) {
                    if (self.options == self.initSelectDataList[i].english) {
                        //?????????????????????inp1
                        initQueryNameList += "<option  value='" + self.initSelectDataList[i].english + "'>" + self.initSelectDataList[i].chinese + "</option>"
                        $this.parent().find("span").remove();
                        $this.parent().find(".dateno2").remove();
                        //?????????inp3
                        if (self.initSelectDataList[i].option == "date") {//????????????
                            initQueryValue = "<input type='datetime-local' step='01' class='inp-text'>";
                        } else if (self.initSelectDataList[i].option == "number") {//????????????
                            initQueryValue = "<input type='number' class='inp-text'>";
                        } else if (self.initSelectDataList[i].option == "string") {//???????????????
                            initQueryValue = "<input type='text' class='inp-text'>";
                        }
                        //??????????????????inp2
                        for (var j = 0; j < self.initSelectDataList[i].list.length; j++) {
                            initQueryCriteriaList += "<option value='" + self.initSelectDataList[i].list[j].code + "'>" + self.initSelectDataList[i].list[j].value + "</option>"
                        }

                    }
                }
                //and?????????
                strBigGroup = `<div class="query-info">
		        <div class="add-new-box">
		          <div class="query-list"><span class="query-item-name"></span>
		          <ul>
		            <li>
		            <div class="inp inp1">
		                <select class="demo-1">` + initQueryNameList + `
		                </select>
		              </div>
		           </li>
		           <LI>
		              <div class="inp inp2">
		                <select class="demo-1">` + initQueryCriteriaList + `
		                </select>
		              </div>
		             </LI>
		             <li>
		              <div class="inp inp3">` + initQueryValue + `
		              </div>
		             </li>
		            </ul>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`
            }
        });


        ////////////////??????????????????
        $('.query-wrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }


        // ????????? ?????? query-wrap
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
        // ?????? wrap ?????????
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


    //????????????????????????
    self.queryinitdata = function (data) {
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.showText.channelCode + "&dataType=2",
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
                self.options = data.data.resp.strategyDto.touchStrategyList;
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
                // 1 ????????????????????? option
                for (var i = 0; i < self.querySelectDataList.length; i++) {
                    if (self.realtimeTag == self.querySelectDataList[i].english) {
                        self.initQueryNameList += "<option  value='" + self.querySelectDataList[i].english + "'>" + self.querySelectDataList[i].chinese + "</option>"
                        if (self.querySelectDataList[i].option == "date") {//????????????
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text' value='" + self.realtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "number") {//????????????
                            self.initQueryValue = "<input type='number' class='inp-text' value='" + self.realtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "string") {//???????????????
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
        //and?????????
        var strBigGroup = `<div class="query-seleinfo">
		        <div class="add-new-box">
		          <div class="query-list"><span class="query-item-name"></span>
		          <ul>
		            <li>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		           </li>
		           <LI>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		             </LI>
		             <li>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		             </li>
		            </ul>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`

        ////////////////??????????????????
        $('.query-selewrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }
        // ????????? ?????? query-selewrap
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
        // ?????? wrap ?????????
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

    //????????????????????????
    self.updqueryinitdata = function (data) {
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.showText.channelCode + "&dataType=2",
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
                self.options = data.data.resp.strategyDto.touchStrategyList;
                self.options.forEach(function (value, index, array) {
                    if (value.attrKey === "REALTIME_TAG") {
                        self.updshowrealtimeTag = value.attrValue;
                    } else if (value.attrKey === "REALTIME_CRITERIA") {
                        self.updshowrealtimeCrteria = value.attrValue;
                    } else if (value.attrKey === "REALTIME_VALUE") {
                        self.updshowrealtimeValue = value.attrValue;
                    }
                });
                $('.query-updwrap').html(null);
                $('.query-updinfo').html(null);
                var $this = $(this);
                // 1 ????????????????????? option
                for (var i = 0; i < self.querySelectDataList.length; i++) {
                    if (self.updshowrealtimeTag == self.querySelectDataList[i].english) {
                        self.initQueryNameList += "<option  value='" + self.querySelectDataList[i].english + "'>" + self.querySelectDataList[i].chinese + "</option>"
                        if (self.querySelectDataList[i].option == "date") {//????????????
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text' value='" + self.updshowrealtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "number") {//????????????
                            self.initQueryValue = "<input type='number' class='inp-text' value='" + self.updshowrealtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "string") {//???????????????
                            self.initQueryValue += "<input type='text' class='inp-text' value='" + self.updshowrealtimeValue+"'>";
                        }
                        for (var j = 0; j < self.querySelectDataList[i].list.length; j++) {
                            if (self.querySelectDataList[i].list[j].code == self.updshowrealtimeCrteria) {
                                self.initQueryCriteriaList += "<option value='" + self.querySelectDataList[i].list[j].code + "'>" + self.querySelectDataList[i].list[j].value + "</option>"
                            }
                        }
                    }
                }
            }
        });
        //and?????????
        var strBigGroup = `<div class="query-updinfo">
		        <div class="add-new-box">
		          <div class="query-list"><span class="query-item-name"></span>
		          <ul>
		            <li>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		           </li>
		           <LI>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		             </LI>
		             <li>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		             </li>
		            </ul>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`

        ////////////////??????????????????
        $('.query-updwrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }
        // ????????? ?????? query-selewrap
        $(".query-updwrap").on("click", " .query-seleinfo .add-button", function () {
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
        $(".query-updwrap").on("click", " .query-updinfo .add-new-box .remove-query-info", function () {
            let $parent = $(this).parent()
            let $parents = $parent.parent()
            if ($parents.children().length >= 2) {
                $parent.remove()
            } else {
                $parents.parent().next().remove();
                $parents.parent().remove();
            }
        });
        // ?????? wrap ?????????
        $('.add-query-info-button').on('click', function () {
            $('.query-updwrap').append(strBigGroup)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        })
        $('.query-updwrap').on('click', ".remove-query-info, .add-button", function () {
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

    self.tagSelectListChange = function () {
        if(self.add.tabel1.IS_EFFECT == '1'){
            self.initdata();
        }
    }
    self.updtagSelectListChange = function () {
        self.updinitdata();
    }

    //???????????????????????????
    self.updinitdata = function(data){
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.showText.channelCode + "&dataType=2",
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
                self.updinitSelectDataList = userData.resp.data
                // 1 ????????????????????? option
                var $this = $(this);
                $('.query-updwrap').html(null);
                $('.query-updinfo').html(null);
                self.checkedupdrealtimeTag = $("#updtagSelectListid option:selected").val();
                for (var i = 0; i < self.updinitSelectDataList.length; i++) {
                    if (self.checkedupdrealtimeTag == self.updinitSelectDataList[i].english) {
                        self.initQueryNameList += "<option  value='" + self.updinitSelectDataList[i].english + "'>" + self.updinitSelectDataList[i].chinese + "</option>"
                        $this.parent().find("span").remove();
                        $this.parent().find(".dateno2").remove();
                        //?????????inp3
                        if (self.updinitSelectDataList[i].option == "date") {//????????????
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text'>";
                        } else if (self.updinitSelectDataList[i].option == "number") {//????????????
                            self.initQueryValue = "<input type='number' class='inp-text'>";
                        } else if (self.updinitSelectDataList[i].option == "string") {//???????????????
                            self.initQueryValue = "<input type='text' class='inp-text'>";
                        }
                        //??????????????????inp2
                        for (var j = 0; j < self.updinitSelectDataList[i].list.length; j++) {
                            self.initQueryCriteriaList += "<option value='" + self.updinitSelectDataList[i].list[j].code + "'>" + self.updinitSelectDataList[i].list[j].value + "</option>"
                        }
                    }
                }
            }
        });
        //and?????????
        var strBigGroup = `<div class="query-updinfo">
		        <div class="add-new-box">
		          <div class="query-list"><span class="query-item-name"></span>
		          <ul>
		            <li>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		           </li>
		           <LI>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		             </LI>
		             <li>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		             </li>
		            </ul>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`

        ////////////////??????????????????
        $('.query-updwrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }
        // ????????? ?????? query-selewrap
        $(".query-updwrap").on("click", " .query-seleinfo .add-button", function () {
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
        $(".query-updwrap").on("click", " .query-updinfo .add-new-box .remove-query-info", function () {
            let $parent = $(this).parent()
            let $parents = $parent.parent()
            if ($parents.children().length >= 2) {
                $parent.remove()
            } else {
                $parents.parent().next().remove();
                $parents.parent().remove();
            }
        });
        // ?????? wrap ?????????
        $('.add-query-info-button').on('click', function () {
            $('.query-updwrap').append(strBigGroup)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        })
        $('.query-updwrap').on('click', ".remove-query-info, .add-button", function () {
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


    function conditionDesc(){
        var andGroupLength = $('.query-updinfo').length;

        var str = "";
        for(var i=0; i<andGroupLength; i++){
            var itemLength = $('.query-updinfo').eq(i).find('.query-list').length;
            str += '(';
            for(var j=0; j<itemLength; j++){
                str += ( groupPrexArray[i] + (j+1) + ' or ');
                $('.query-updinfo').eq(i).find('.query-list').eq(j).find('.query-item-name').html(groupPrexArray[i] + (j+1));
            }
            str = str.substr(0,str.length-4);
            str += ')';
            str += " and ";
        }
        str = str.substr(0,str.length-5);
        $('#showConditon').html(str);
    }
    conditionDesc();

//2 ????????????????????????
    self.queryCriteriaChangeList = function(){
// 	QueryCriteriaList
        $(document).on("change",".inp1 select",function(){
            var $this=$(this);
            QueryCriteriaList="";
            $this.parent().parent().find("input").val("");
            //???????????????????????????
            for (var i = 0; i < initSelectDataList.length; i++) {
                //?????????????????????
                if($this.val() == initSelectDataList[i].english){
                    var node;
                    if(initSelectDataList[i].option!="muilti"){//?????????????????????
                        //???????????????????????????????????????????????????
                        for(var j=0;j<initSelectDataList[i].list.length;j++){
                            QueryCriteriaList+="<option value='"+initSelectDataList[i].list[j].code+"'>"+initSelectDataList[i].list[j].value+"</option>"
                        }
                        QueryCriteriaList="<select class='demo-1'>"+QueryCriteriaList+"</select>";
                    }else{
                        //???????????????????????????
                        for(var j=0;j<initSelectDataList[i].list.length;j++){
                            QueryCriteriaList+=`<div class="checkboxDiv">initSelectDataList[i].list[j]</div><input type="checkbox"  name="" value="`+initSelectDataList[i].list[j]+`">`;
                        }
                    }

                    //???????????????????????????????????????????????????
                    $this.parent().parent().find("span").remove();
                    $this.parent().parent().find(".dateno2").remove();

                    if(initSelectDataList[i].option=="date"){//????????????
                        //globalConfig.dataType==2
                        $this.parent().parent().find("input").prop("type","datetime-local");
                        $this.parent().parent().find("input").prop("step","01");
                    }else if(initSelectDataList[i].option=="number" || initSelectDataList[i].option == "number"){//????????????
                        $this.parent().parent().find("input").prop("type","number");//inp3
                    }else if(initSelectDataList[i].option=="string"){//???????????????
                        $this.parent().parent().find("input").prop("type","text");//inp3
                    }else{//??????
                        $this.parent().parent().remove();
                    }
                    node=$this.parent().parent().next();//inp2
                    node.html(QueryCriteriaList);
                    node.find(".demo-1").selectMania({
                        size: 'small',
                        // themes: ['darkblue'],
                        placeholder: 'Please select me!',
                        removable: true,
                        search: true,
                    });
                    return;
                }
            }
        })
    }
    // 3 ??????????????????????????????????????????????????????????????????
    $(document).on("change",".inp2 select",function(){
        var $this=$(this);
        if($this.val() == "between"){
            $this.parent().parent().next().html("<input type='date' class='inp-text dateno1'>" + "<span> and </span>" + "<input type='date' class='inp-text dateno2'>");
        }else{
            $this.parent().parent().next().find("span").remove();
            $this.parent().parent().next().find(".dateno2").remove();
        }
        if ($this.val()=="isnull" || $this.val()=="notnull"){
            $this.parent().parent().parent().find('.inp3').hide();
            $this.parent().parent().parent().find('.inp3 input').val(null);
        }else {
            $this.parent().parent().parent().find('.inp3').show();
        }
    });

        self.bankInfoList = function(){
            var url = globalConfig.basePath + "/smart_marketing/initiative/getBankList";
            $http({
                method: 'post',
                url: url,
            }).then(
                function(data) {
                   self.add.tabel1.checkboxParamList = data.data;
                },function(response) {
                    alert("???????????????....");
                }
            );
        };
        self.bankInfoList();

        //??????????????????
        function updbankschecked(data){
            $("#updAllchecked").prop("checked", false);//??????
            self.toUpdate.aioActionStrategyDtoPara = data.data.resp.strategyDto;
            self.bankCode = self.toUpdate.aioActionStrategyDtoPara.bankCode;
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
                        $("#updAllchecked").prop("checked", true);//??????
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
                        $("#updyqAllchecked").prop("checked", true);//??????
                    }
                }
            },300)
        }

        //??????????????????
        function bankschecked(data){
            $("#allselect").prop("checked", false);//??????
            self.strategyDetail = data.data.resp;
            self.bankCode = self.strategyDetail.strategyDto.bankCode
            self.strategyDetail.strategyDto.touchStrategyList.forEach(function(value , index , array){
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
                    if(count == self.add.tabel1.checkboxParamList.length){
                        $("#allselect").prop("checked", true);//??????
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
                    if(count == self.add.tabel1.checkboxParamList.length){
                        $("#yqallselect").prop("checked", true);//??????
                    }
                }
            },300)

        }

        //????????????
       self.addupdAll = function(val) {
            //  1????????????  2 ??????????????????  3????????????  4??????????????????
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
            for (var j = 0; j < self.tagSelectList.length; j++) {
                if(val == self.tagSelectList[j].english){
                    res = self.tagSelectList[j].chinese;
                    return res;
                }
             }
        }
})