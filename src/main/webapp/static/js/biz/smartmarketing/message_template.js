'use strict';

var App = angular.module('message_template', [], angular.noop);
App.controller('message_template_controller', ['$scope', '$http', function ($scope, $http) {

    var shixiaoid;
    var imageid;
    var fileid;
    var lasttime;
    var upid;

    var startTime = laydate({
        elem: '#startTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime = laydate({
        elem: '#createTimeEnd',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })
    var self = $scope;
    self.add = {};
    self.search = {};

    self.search.channelCode = 'QB';
    self.search.type = 'sms';
    self.add.smsType='MARKETING';
    self.add.noteType='1';
    self.add.pageTwo = {};
    self.add.touchContents = [];
    self.shixiao = {};
    self.openDetail = {};
    self.updateScene = {};
    self.updateScene.touchContents = [];
    self.search.pageNo = '';
    self.search.pageSize = '';
    self.tclist = '';
    self.uplist = [];
    self.upid = [];
    self.toupdate = {};
    self.banner = [];
    self.version = [];
    self.bannerObj = {};
    self.hour = '';
    self.minutes = '';
    self.presetFieldList = [];

    var insertPresetFieldBoxId = '';
    var insertPresetFieldBoxIndex = '';

    //模板搜索
    self.querySmartList = function (pageNum) {
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }

        self.search.createTimeEnd = $("#createTimeEnd").val();
        if (self.search.pageSize == '') {
            self.search.pageSize = '5';
        }
        if (self.search.pageNo == '') {
            self.search.pageNo = "1";
        }
        if ($("#startTime").val() != null && $("#startTime").val() != '') {
            self.search.createTimeBe = $("#startTime").val();
        }
        else {
            self.search.createTimeBe = null;
        }
        if ($("#createTimeEnd").val() != null && $("#createTimeEnd").val() != '') {
            self.search.createTimeEnd = $("#createTimeEnd").val();
        }
        else {
            self.search.createTimeEnd = null;
        }
        // console.log(self.search);


        if (self.search.channelCode == 'SF'){
                  self.search.channelCode='SF';
        } else if(self.search.channelCode == 'SC'){
            self.search.channelCode='SC';
        }else {

            if (self.search.channelCode != 'QB') {
                if (self.search.channelCode != null && self.search.channelCode != '') {
                    self.search.channelCode = 'WK';
                }
            } else {

                self.search.channelCode = 'QB';
            }

            if (self.search.type != 'sms') {
                var c = self.search.type;
                self.search.type = c;
            } else {

                self.search.type = 'sms';
            }
        }

        var url = globalConfig.basePath + "/smart_marketing/message/list";
        $http.post(url, self.search).then(
            function (data) {
                // alert(data);

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

                    self.initiativeList = data.data.resp.result;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    //获取mock数据
    self.checkMockData = function () {

        self.search.pageSize = "5";
        self.querySmartList(1);
    };

    //根据渠道位置查出所有对应的版本
    self.getAddPositionVersion = function (productChannel, value, loginstatus) {
        var index=document.getElementById("addposition").selectedIndex;
        document.getElementById("addposition").options[index].text;
        var obj=document.getElementById("addposition");
        var label;
        for(var i=0;i<obj.length;i++) {//下拉框的长度就是它的选项数.
            if(obj[i].selected==true) {
                label=obj[i].text;//获取当前选择项的文本.

            }
        }
        if (value == "") {
            value = null;
        }
        if (productChannel=="WK"){
            productChannel = "0";
        }
        if(productChannel=="QB"){
            productChannel = "1";
        }
        var url = globalConfig.basePath + "/smart_marketing/message/getPositionAndVersion?productChannel=" + productChannel + "&value=" + value + "&loginStatus=" + loginstatus+"&label="+label;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            // console.log(data);
            //pv = position + version
            self.pvList = data.data;


        })
    }

    self.updatePositionVersion = function (productChannel, value, loginstatus) {
        if (value == "") {
            value = null;
        }
        self.version = [];
        var url = globalConfig.basePath + "/smart_marketing/message/getPositionAndVersion?productChannel=" + productChannel + "&value=" + value + "&loginStatus=" + loginstatus;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //pv = position + version
            for (var i = 0; i < data.data.length; i++) {
                self.version[i] = data.data[i].productVersion;

            }


        })
    };

    $scope.checkMockData();


    self.shixiao1 = function (id, statusname) {
        if (statusname == '失效') {
            alert("模板不可重复失效！");
            return;
        }
        $('.take-start-box').show();
        shixiaoid = id;


    }

    self.confirmshixiao = function () {
        self.shixiao.updateUserName = globalConfig.loginName;
        self.shixiao.updateUserId = globalConfig.loginId;
        self.shixiao.id = shixiaoid;
        // console.log(self.shixiao);
        var url = globalConfig.basePath + "/smart_marketing/message/invaild";
        $http.post(url, self.shixiao).then(function successCallback(callback) {

            if (callback.data.code == '000') {

                // console.log(callback);
                if (callback.data.resp.code == '1002') {
                    var message = callback.data.resp.message;
                    alert("此模板已被" + message.toString().replace("|", ",") + "使用！");
                    $('.take-start-box').hide();
                    return;
                }
                if (callback.data.resp.code == '0000') {
                    alert("失效成功！");
                }
                self.initiativeList = callback.data.resp;

                $('.take-start-box').hide();
                self.querySmartList(1);
            } else {
                alert("失效消息模板失败");
            }
        }, function errorCallback(response) {
            console.error(response);
            alert("失效消息模板异常");
        })

    }


    //点击添加消息模板
    self.addTemplate = function () {

        $('#addShow').show();
        self.add.touchContents = [];
        self.add.channelCode = 'QB';
        self.add.productPosition = '';
        self.add.notecontent = '';
        self.add.type = 'sms';
        self.add.redirectType = '2';
        self.add.channelName = '';
        self.add.jumpTypeAddress = '';
        self.add.pageType = '';
        self.add.createUserId = globalConfig.loginId;
        self.add.createUserName = globalConfig.loginName;
        self.add.bannerurl = '';
        self.add.hour = '';
        self.add.minutes = '';
        self.add.typeName = '';

        self.add.presetField  = "";
        self.queryPresetFieldList();
    }

    $scope.selectPageOne = function () {
        var type = "wk_protogenesis_page_one"
        //原生original_bd_url
        $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
        ).success(function (data) {
            // console.log("查看页面类型data返回");
            // console.log(data);
            self.rDictList = data.resp.result;
        })


    }
    $scope.selectPageOne2 = function () {

        var type = "qb_protogenesis_page_one"
        //原生original_bd_url
        $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
        ).success(function (data) {
            // console.log(data, "查询钱包一级页面");
            self.rDictList2 = data.resp.result;
        })


    }


    //修改banner 根据一级页面查询二级页面
    $scope.selectPageOneByRDict = function (v) {
        if (self.add.redirectType == '3') {
            var type = "wk_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + v
            ).success(function (data) {
                // console.log("查看页面类型data返回");
                // console.log(data);
                $scope.rPositionDictList = data.resp.result;
                if ($scope.rPositionDictList.length == '1') {
                    $scope.add.pageTwo = data.resp.result[0].value;
                } else {
                    $scope.add.pageTwo = data.resp.result[0].value;
                }
            })
        }
    }

    $scope.selectPage1 = function (channelCode, pagetype, jumptype, pageurl) {

        if (channelCode != null) {
            var type;
            if (channelCode == 'WK') {
                type = "wk_protogenesis_page_one";
            }

            else {
                type = "qb_protogenesis_page_one";
            }
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
            ).success(function (data) {
                for (var i = 0; i < data.resp.result.length; i++) {
                    if (data.resp.result[i].value == pagetype) {
                        self.toupdate.pagetype = data.resp.result[i].label;
                    }
                }
            });

            if (jumptype == "3") {
                if (channelCode == 'WK') {
                    type = "wk_protogenesis_page_two";
                }
                else {
                    type = "qb_protogenesis_page_two";
                }
                $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + pagetype
                ).success(function (data) {
                    for (var i = 0; i < data.resp.result.length; i++) {
                        if (data.resp.result[i].value == pageurl) {
                            self.toupdate.pageurl = data.resp.result[i].label;
                        }
                    }
                });
            }
        }
    }


    //钱包查询二级页面
    $scope.selectPageOneByRDict2 = function (v) {
        if (self.add.redirectType == '3') {

            var type = "qb_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + v
            ).success(function (data) {

                // console.log(data);
                $scope.rPositionDictList2 = data.resp.result;
                if ($scope.rPositionDictList2.length == '1') {
                    $scope.add.pageTwo = data.resp.result[0];
                } else {
                    $scope.add.pageTwo = data.resp.result[0];
                }

            })
        }

    }

    $scope.selectPageOneByRDict3 = function (v) {
        if (self.toupdate.jumptype == '3') {
            var type = "wk_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + v
            ).success(function (data) {
                // console.log(data);
                $scope.rPositionDictList3 = data.resp.result;
                if ($scope.rPositionDictList3.length == '1') {
                    $scope.add.pageTwo = data.resp.result[0].value;
                } else {
                    $scope.add.pageTwo = data.resp.result[0].value;
                }

            })
        }

    }
    $scope.selectPageOneByRDict4 = function (v) {
        if (self.toupdate.jumptype == '3') {
            var type = "qb_protogenesis_page_two";
            $http.get(globalConfig.basePath + "/dict/findSceneTwoList" + "?type=" + type + "&value=" + v
            ).success(function (data) {
                // console.log(data);
                $scope.rPositionDictList4 = data.resp.result;
                if ($scope.rPositionDictList4.length == '1') {
                    $scope.add.pageTwo = data.resp.result[0].value;
                } else {
                    $scope.add.pageTwo = data.resp.result[0].value;
                }

            })
        }

    }

    self.refresh = function () {
        self.add.content = '';
        self.add.title = '';
    }

    //点击确认添加消息模板
    self.commitAdd = function () {
        if (self.add.channelCode == null) {
            alert("理财渠道不能为空");
            return;
        }
        if (self.add.type == null) {
            alert("触达方式不能为空");
            return;
        }
        if (self.add.templateName == null) {
            alert("模板名称不能为空");
            return;
        }
        if (self.add.type == 'sms') {
            if (self.add.content == null || self.add.content == '' || self.add.content.length < 1) {
                alert("请输入短信内容");
                return;
            }
        }

        if (self.add.type == 'note') {
            if (self.add.channelCode!='SC' && (self.add.title == null || self.add.title == '' || self.add.title.length < 1)) {
                alert("请输入站内信标题");
                return;
            }
            if (self.add.redirectType == '2') {
                if (self.add.jumpTypeAddress == null || self.add.jumpTypeAddress == '' || self.add.jumpTypeAddress.length < 1) {
                    alert("链接地址不能为空");
                    return;
                }
            }
            if (self.add.notecontent == null || self.add.notecontent == '') {
                alert("请输入内容");
                return;
            }
            if (self.add.notecontent.length > 100) {
                alert("内容太长重新输入！")
                return;
            }
        }
        if (self.add.type == 'push') {
            if (self.add.title == null || self.add.title.length < 1 || self.add.title == '') {
                alert("请输入推送标题");
                return;
            }
            if (self.add.notecontent == null || self.add.notecontent.length < 1 || self.add.notecontent == '') {
                alert("推送内容不能为空");
                return;
            }
            if (self.add.redirectType == null || self.add.redirectType.length < 1 || self.add.redirectType == '') {
                alert("跳转类型不能为空");
                return;

            }
            if (self.add.redirectType == '2') {
                if (self.add.jumpTypeAddress == null || self.add.jumpTypeAddress == '' || self.add.jumpTypeAddress.length < 1) {
                    alert("链接地址不能为空");
                    return;
                }
            }
            if (self.add.redirectType == '3') {
                if (self.add.pageType == null || self.add.pageType == '' || self.add.pageType.length < 1) {
                    alert("页面类型不能为空");
                    return;
                }
                if (self.add.pageTwo == null || self.add.pageTwo == '' || self.add.pageTwo.length < 1) {
                    alert("页面类型不能为空");
                    return;
                }
            }

        }

        if (self.add.type == 'banner') {
            if (self.add.productPosition != null && self.add.productPostion != "") {

            }else{
                alert("banner位置不能为空");
                return;
            }
            if (self.add.redirectType != null || self.add.redirectType != "") {

                if (self.add.redirectType == '2') {
                    if (self.add.jumpTypeAddress == null) {
                        alert("跳转链接不能为空");
                        return;
                    }
                }

                if (self.add.redirectType == '3') {
                    if (self.add.pageType == null || self.add.pageType == '' || self.add.pageType.length < 1) {
                        alert("页面类型不能为空");
                        return;
                    }
                    if (self.add.pageTwo == null || self.add.pageTwo == '' || self.add.pageTwo.length < 1) {
                        alert("跳转页面不能为空！");
                        return;
                    }
                }
            }
            if (!self.add.productPosition) {
                alert("请选择位置");
                return;
            }
            if (!self.add.showType) {
                alert("显示时间不能为空");
                return;
            }
            if (self.add.redirectType == '2') {
                if (!self.add.jumpTypeAddress || self.add.jumpTypeAddress == null) {
                    alert("跳转链接不能为空");
                    return;
                }
            }
            if (self.add.minutes > 59 && self.add.hour > 720) {
                alert("输入不得大于720小时和大于59分钟");
                return;
            }
            if (self.add.minutes > 59) {
                alert("输入不得大于59分钟");
                return;
            }
            if (self.add.hour > 720) {
                alert("输入不得大于720小时");
                return;
            }
            if (!self.add.hour){
                alert("小时不能为空!");
                return;
            }
            if (!self.add.minutes){
                alert("分钟不能为空!");
                return;
            }

        }
        if (self.add.templateName.length > 50) {
            alert("你输入的长度过大！");
            return;
        }


        if (self.add.type == 'sms') {
            self.add.typeName = '短信';
        }

        if (self.add.type == 'banner') {
            self.add.typeName = 'banner';
        }
        if (self.add.type == 'note') {
            self.add.typeName = '站内信';
        }
        if (self.add.type == 'push') {
            self.add.typeName = '推送';
        }


        if (self.add.channelCode == 'QB') {
            self.add.channelName = '玖富钱包';
        }

        if (self.add.channelCode == 'WK') {
            self.add.channelName = '悟空理财';
        }
        if (self.add.channelCode == 'SF'){
            self.add.channelName = '三方渠道';
        }

        if (self.add.channelCode == 'SC'){
            self.add.channelName = '玖富商城';
        }
        if ($('#tjCdMethod').val() == 'sms') {
            var touchContent = {
                touchContent: new Array()
            };
            self.add.touchContents.push(touchContent);
            touchContent.touchContent[0] = (
                {touchKey: 'CONTENT', touchValue: self.add.content}
            );
            if (self.add.smsType != null && self.add.smsType != undefined && self.add.smsType != "") {
                touchContent.touchContent[1] = (
                    {touchKey: 'SMS_TYPE', touchValue: self.add.smsType}
                );
            }

        }
        if ($('#tjCdMethod').val() == 'note') {
            var touchContent = {
                touchContent: new Array()
            };
            self.add.touchContents.push(touchContent);
            touchContent.touchContent[0] = (
                {touchKey: 'TITLE', touchValue: self.add.title}
            );
            touchContent.touchContent[1] = (
                {touchKey: 'CONTENT', touchValue: self.add.notecontent}
            );
            touchContent.touchContent[2] = (
                {touchKey: 'NOTE_TYPE', touchValue: self.add.noteType}
            );
            touchContent.touchContent[3] = (
                {touchKey: 'JUMP_TYPE', touchValue: self.add.redirectType}
            );

            if (self.add.redirectType == '2') {

                touchContent.touchContent[4] = (
                    {touchKey: 'PAGE_URL', touchValue: self.add.jumpTypeAddress}
                );
            }

        }
        if ($('#tjCdMethod').val() == 'push') {


            var touchContent = {
                touchContent: new Array()
            };
            self.add.touchContents.push(touchContent);
            touchContent.touchContent[0] = (
                {touchKey: 'TITLE', touchValue: self.add.title}
            );
            touchContent.touchContent[1] = (
                {touchKey: 'CONTENT', touchValue: self.add.notecontent}
            );

            touchContent.touchContent[2] = (
                {touchKey: 'JUMP_TYPE', touchValue: self.add.redirectType}
            );

            if (self.add.redirectType == '2') {

                touchContent.touchContent[3] = (
                    {touchKey: 'PAGE_URL', touchValue: self.add.jumpTypeAddress}
                );
            }
            if (self.add.redirectType == '3') {
                touchContent.touchContent[3] = (
                    {
                        touchKey: 'PAGE_URL', touchValue: self.add.pageTwo
                    }

                );

                touchContent.touchContent[4] = (
                    {
                        touchKey: 'PAGE_TYPE', touchValue: self.add.pageType
                    }

                )


            }


        }
        if ($('#tjCdMethod').val() == 'banner') {
            var elementsByName = document.getElementsByName("check");
            var checked_counts = 0;
            for(var i=0;i<elementsByName.length;i++) {
                if (elementsByName[i].checked) {         //被选中的checkbox
                    checked_counts++;
                }
            }
            if (!self.pvList){
                if (checked_counts==0){
                    alert("请勾选中复选框进行选择2222！");
                    return;
                }
            }

            self.add.touchContents = [];
            for (var i = 0; i < checked_counts; i++) {
                var touchContent = {
                    touchContent: new Array()
                }
                self.add.touchContents.push(touchContent);
                touchContent.touchContent[0] = (
                    {touchKey: 'POSITION', touchValue: self.add.productPosition}
                );
                touchContent.touchContent[1] = (
                    {touchKey: 'VERSION', touchValue: $('#' + "version" + self.pvList[i].id).val()}
                );
                touchContent.touchContent[2] = (

                    {
                        touchKey: 'BANNER_URL', touchValue: $('#' + "file" + self.pvList[i].id).val()

                    }
                );


                touchContent.touchContent[3] = (
                    {touchKey: 'SHOW_TYPE', touchValue: self.add.showType}
                );
                touchContent.touchContent[4] = (
                    {
                        touchKey: 'LAST_TIME',
                        touchValue: parseInt(self.add.hour)*60 + parseInt(self.add.minutes)
                    }
                );
                touchContent.touchContent[5] = (
                    {touchKey: 'JUMP_TYPE', touchValue: self.add.redirectType}
                );

                if (self.add.redirectType == '2') {

                    touchContent.touchContent[6] = (
                        {touchKey: 'PAGE_URL', touchValue: self.add.jumpTypeAddress}
                    );
                } else if (self.add.redirectType == '3') {
                    touchContent.touchContent[6] = (

                        {
                            touchKey: 'PAGE_URL', touchValue: self.add.pageTwo
                        }

                    );
                    touchContent.touchContent[7] = (
                        {
                            touchKey: 'PAGE_TYPE', touchValue: self.add.pageType
                        }

                    )


                }


            }


        };
        // console.log(self.add.touchContents);
        var url = globalConfig.basePath + "/smart_marketing/message/add";
        // console.log(self.add);
        $http.post(url, JSON.stringify(self.add)).then(function successCallback(callback) {


            if (callback.data.code == '000') {
                $('#addShow').hide();
                alert("添加成功！");
                self.search.channelCode = self.add.channelCode;
                self.querySmartList(1);
                self.add = {};


            }
            else {
                alert("添加消息模板失败！！");
                $('#addShow').hide();
            }


        }, function errorCallback(response) {
            console.error(response);
            alert("添加消息模板异常");
        });
    };



    //查看消息模板
    self.checkTemplate = function (id) {
        $('#showCheck').show();
        $http.get(globalConfig.basePath + "/smart_marketing/message/check?id=" + id).success(function (callback) {
            self.banner = [];
            self.version = [];
            self.toupdate = {};
            if (callback.code == '000') {
                // console.log(callback);
                self.openDetail = callback.resp.data;
                self.tclist = callback.resp.data.touchContents;
                self.toupdate = {};
                for (var i = 0; i < self.tclist.length; i++) {

                    for (var j = 0; j < self.tclist[i].touchContent.length; j++) {

                        if (self.tclist[i].touchContent[j].touchKey == 'SMS_TYPE') {
                            self.toupdate.smsType = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'NOTE_TYPE') {
                            self.toupdate.noteType = self.tclist[i].touchContent[j].touchValue;
                        }

                        if (self.tclist[i].touchContent[j].touchKey == 'CONTENT') {
                            self.toupdate.content = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'TITLE') {
                            self.toupdate.title = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'JUMP_TYPE') {
                            self.toupdate.jumptype = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'PAGE_URL') {
                            self.toupdate.pageurl = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'PAGE_TYPE') {
                            self.toupdate.pagetype = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'POSITION') {
                            self.toupdate.position = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'LAST_TIME') {
                            self.toupdate.lasttime = self.tclist[i].touchContent[j].touchValue;
                        }
                        if (self.tclist[i].touchContent[j].touchKey == 'SHOW_TYPE') {
                            self.toupdate.showtype = self.tclist[i].touchContent[j].touchValue;
                        }

                        if (i >= 0) {
                            if (self.tclist[i].touchContent[j].touchKey == 'BANNER_URL') {
                                self.banner[i] = self.tclist[i].touchContent[j].touchValue;
                                // self.banner[i] = self.tclist[i].touchContent[j].touchValue;


                            }
                            if (self.tclist[i].touchContent[j].touchKey == 'VERSION') {
                                self.version[i] = self.tclist[i].touchContent[j].touchValue;

                            }
                        }


                    }

                }
                self.selectPage1(self.openDetail.channelCode, self.toupdate.pagetype, self.toupdate.jumptype, self.toupdate.pageurl);
                // console.log(self.banner);
                self.toupdate.lasttime = parseInt(self.toupdate.lasttime/60)+"时"+parseInt(self.toupdate.lasttime)%60+"分";
                // console.log(self.toupdate, "查看touchContents里面数据");
                // console.log(self.banner);
                // console.log(self.version);
                // console.log(callback);
            }


        }), function errorCallback(response) {
            console.error(response);
            alert("查看消息模板异常");
        }

    }

    //打开修改页面回显
    self.update = function (data) {
        var hour;
        self.add.presetField  = "";
        self.queryPresetFieldList();
        $('#showUpdate').show();
        $http.get(globalConfig.basePath + "/smart_marketing/message/check?id=" + data.id).success(function (callback) {

            if (callback.code == '000') {
                self.updateScene = callback.resp.data;
                // console.log(self.updateScene);
                var c = 0;
                self.uplist = callback.resp.data.touchContents;
                self.toupdate = {};

                for (var i = 0; i < self.uplist.length; i++) {
                    for (var j = 0; j < self.uplist[i].touchContent.length; j++) {
                        if (self.uplist[i].touchContent[j].touchKey == 'SMS_TYPE') {
                            self.toupdate.smsType = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'NOTE_TYPE') {
                            self.toupdate.noteType = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'CONTENT') {
                            self.toupdate.content = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'TITLE') {
                            self.toupdate.title = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'JUMP_TYPE') {
                            self.toupdate.jumptype = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'PAGE_URL') {
                            self.toupdate.pageurl = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'PAGE_TYPE') {
                            self.toupdate.pagetype = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'POSITION') {
                            self.toupdate.position = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'LAST_TIME') {
                            self.toupdate.lasttime = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (self.uplist[i].touchContent[j].touchKey == 'SHOW_TYPE') {
                            self.toupdate.showtype = self.uplist[i].touchContent[j].touchValue;
                        }
                        if (i >= 0) {
                            if (self.uplist[i].touchContent[j].touchKey == 'BANNER_URL') {

                                if (self.uplist[i].touchContent[j].touchValue!=null&&self.uplist[i].touchContent[j].touchValue!='') {
                                    self.bannerObj.imgValue = self.uplist[i].touchContent[j].touchValue;
                                    c = c + 1;
                                    self.bannerObj.id = c;
                                    self.banner[i] = {"img":self.bannerObj.imgValue, "id":self.bannerObj.id}


                                }


                            }
                            if (self.uplist[i].touchContent[j].touchKey == 'VERSION') {
                                self.version[i] = self.uplist[i].touchContent[j].touchValue;

                            }
                        }


                    }

                }
                // console.log(self.toupdate, "修改回显的touchcontents对象");
                // console.log(self.banner,"数据数据数据");
                lasttime = self.toupdate.lasttime;
                self.hour = parseInt(self.toupdate.lasttime/60);
                self.minutes = parseInt(self.toupdate.lasttime)%60;

                // lasttime = parseFloat(lasttime)*60;
                // console.log(lasttime);
                // self.hour = ((lasttime/60).toString()).split(".")[0];
                // console.log(self.hour);
                // self.minutes = 60/parseInt(((lasttime/60).toString()).split(".")[1]);
                $('#updateproductChannel').val(self.updateScene.channelCode);
                $('#uptempname').val(self.updateScene.templateName);
                $('#updesc').val(self.updateScene.desc);
                $('#xgCdMethod').val(self.updateScene.type);

                if (self.updateScene.channelCode == 'WK') {
                    self.selectPageOne();

                } else {
                    self.selectPageOne2();

                }
                if (self.updateScene.channelCode == 'WK') {

                    self.selectPageOneByRDict3(self.toupdate.pagetype);
                }
                else {

                    self.selectPageOneByRDict4(self.toupdate.pagetype);
                }


            }


        }), function errorCallback(response) {
            console.error(response);
            alert("查看消息模板异常");
        }


    }

    self.commitScreen = function () {
        self.updateScene.updateUserName = globalConfig.loginName;
        self.updateScene.updateUserId = globalConfig.loginId;
        if (self.updateScene.type == 'sms') {
            self.updateScene.typeName = '短信';
        }

        if (self.updateScene.type == 'banner') {
            self.updateScene.typeName = 'banner';
        }
        if (self.updateScene.type == 'note') {
            self.updateScene.typeName = '站内信';
        }
        if (self.updateScene.type == 'push') {
            self.updateScene.typeName = '推送';
        }


        if (self.updateScene.channelCode == 'QB') {
            self.updateScene.channelName = '玖富钱包';
        }

        if (self.updateScene.channelCode == 'WK') {
            self.updateScene.channelName = '悟空理财';
        }

        if (self.updateScene.channelCode == 'SC') {
            self.updateScene.channelName = '玖富商城';
        }

        if (self.hour > 720) {
            alert("不得大于720小时！");
            return;
        }
        if (self.minutes > 59) {
            alert("不得大于59分钟！");
            return;
        }

        if (self.updateScene.type == 'sms') {
            if (!self.toupdate.content){
                alert("短信内容不能为空!");
                return;
            }
            var touchContent = {
                touchContent: new Array()
            };

            self.updateScene.touchContents = [];
            self.updateScene.touchContents.push(touchContent);

            touchContent.touchContent[0] = (
                {
                    touchKey: 'CONTENT', touchValue: self.toupdate.content
                }
            );

            if (self.toupdate.smsType != null && self.toupdate.smsType != undefined && self.toupdate.smsType != "") {
                touchContent.touchContent[1] = (
                    {touchKey: 'SMS_TYPE', touchValue: self.toupdate.smsType}
                );
            }

        }
        if (self.updateScene.type == 'note') {
            if (self.updateScene.channelCode!='SC' && !self.toupdate.title){
                alert("站内信标题不能为空!");
                return;
            }
            if (!self.toupdate.content){
                alert("站内信内容不能为空!");
                return;
            }
            if (self.toupdate.jumptype == '2') {
                if (self.toupdate.pageurl == null || self.toupdate.pageurl == '' || self.toupdate.pageurl.length < 1) {
                    alert("链接地址不能为空");
                    return;
                }
            }

            var touchContent = {
                touchContent: new Array()
            };
            self.updateScene.touchContents = [];
            self.updateScene.touchContents.push(touchContent);
            touchContent.touchContent[0] = (
                {touchKey: 'TITLE', touchValue: self.toupdate.title}
            );
            touchContent.touchContent[1] = (
                {touchKey: 'CONTENT', touchValue: self.toupdate.content}
            );

            touchContent.touchContent[2] = (
                {touchKey: 'NOTE_TYPE', touchValue: self.toupdate.noteType}
            );
            touchContent.touchContent[3] = (
                {touchKey: 'JUMP_TYPE', touchValue: self.toupdate.jumptype}
            );

            touchContent.touchContent[4] = (
                {touchKey: 'PAGE_URL', touchValue: self.toupdate.pageurl}
            );
        }


        if (self.updateScene.type == 'push') {
            if (!self.toupdate.title){
                alert("推送标题不能为空!");
                return;
            }
            if (!self.toupdate.content){
                alert("推送内容不能为空!");
                return;
            }
            if (!self.toupdate.jumptype){
                alert("跳转类型不能为空!");
                return;
            }
            var touchContent = {
                touchContent: new Array()
            };
            self.updateScene.touchContents = [];
            self.updateScene.touchContents.push(touchContent);
            touchContent.touchContent[0] = (
                {touchKey: 'TITLE', touchValue: self.toupdate.title}
            );
            touchContent.touchContent[1] = (
                {touchKey: 'CONTENT', touchValue: self.toupdate.content}
            );
            if (self.updateScene.channelCode == 'WK') {
                touchContent.touchContent[2] = (
                    {touchKey: 'PAGE_TYPE', touchValue: self.toupdate.pagetype}
                );
                touchContent.touchContent[3] = (
                    {touchKey: 'JUMP_TYPE', touchValue: self.toupdate.jumptype}
                );

                touchContent.touchContent[4] = (
                    {touchKey: 'PAGE_URL', touchValue: self.toupdate.pageurl}
                );
            }
            else {
                touchContent.touchContent[2] = (
                    {touchKey: 'PAGE_TYPE', touchValue: self.toupdate.pagetype}
                );
                touchContent.touchContent[3] = (
                    {touchKey: 'JUMP_TYPE', touchValue: self.toupdate.jumptype}
                );

                touchContent.touchContent[4] = (
                    {touchKey: 'PAGE_URL', touchValue: self.toupdate.pageurl}
                );
            }

        }
        if (self.updateScene.type == 'banner') {

            for (var i = 0; i < self.version.length; i++) {
                var touchContent = {
                    touchContent: new Array()
                };
                self.updateScene.touchContents = [];
                self.updateScene.touchContents.push(touchContent);

                touchContent.touchContent[0] = (
                    {touchKey: 'POSITION', touchValue: self.toupdate.position}
                );
                touchContent.touchContent[1] = (
                    {touchKey: 'VERSION', touchValue: $('#' + "upversion" + i).val()}
                );
                touchContent.touchContent[2] = (
                    {touchKey: 'BANNER_URL', touchValue: $('#' + "upfile" + self.banner[i].id).val()}
                );
                touchContent.touchContent[3] = (
                    {touchKey: 'SHOW_TYPE', touchValue: self.toupdate.showtype}
                );
                touchContent.touchContent[4] = (
                    {
                        touchKey: 'LAST_TIME', touchValue: parseInt(self.hour)*60 + parseInt(self.minutes)
                    }
                );
                touchContent.touchContent[5] = (
                    {touchKey: 'JUMP_TYPE', touchValue: self.toupdate.jumptype}
                );

                if (self.toupdate.jumptype == '2') {
                    touchContent.touchContent[6] = (
                        {touchKey: 'PAGE_URL', touchValue: self.toupdate.pageurl}
                    );
                } else if (self.toupdate.jumptype == '3') {
                    touchContent.touchContent[6] = (
                        {touchKey: 'PAGE_TYPE', touchValue: self.toupdate.pagetype}
                    );
                    touchContent.touchContent[7] = (
                        {touchKey: 'PAGE_URL', touchValue: self.toupdate.pageurl}
                    );
                }
            }

        }
        if (self.updateScene.templateName.length>50){
            alert("模板名称不能大于50字!");
            return;
        }
        if (!self.updateScene.templateName){
            alert("模板名称不能为空！");
            return;
        }
        var url = globalConfig.basePath + "/smart_marketing/message/update";
        // console.log(JSON.stringify(self.updateScene));
        $http.post(url, JSON.stringify(self.updateScene)).then(function successCallback(callback) {

            if (callback.data.code == '000') {
                $('#showUpdate').hide();
                alert("修改成功！");


                self.search.channelCode = self.updateScene.channelCode;
                self.search.type = self.updateScene.type;
                self.updateScene = {};
                self.querySmartList(1);
            } else if(callback.data.code == '1002'){
                var message = "此模板正在被 " + callback.data.message + " 使用，不允许修改!";
                alert(message);
            }
            else {
                alert("修改消息模板失败！！");
                $('#showUpdate').hide();
            }


        }, function errorCallback(response) {
            console.error(response);
            alert("添加消息模板异常");
        });


    }

    //重置
    self.reset = function(){
        self.search.channelCode = 'QB';
        self.search.type = 'sms';
        self.search.templateName = '';
        self.search.createTimeBe = '';
        self.search.createTimeEnd = '';
        $("#startTime").val("");
        $("#createTimeEnd").val("");
    }

    self.close = function () {
        $('#addShow').hide();
        self.add = {};
    }


    self.aaa = function (id) {
        fileid = "file" + id;
        upid = "up" + id;
        imageid = "image" + id;
        $('#' + imageid).click();
        var url = globalConfig.basePath + "/appconfig/file/uploadPic";
        $('#' + imageid).fileupload({
            autoUpload: true,
            url: url,
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {
                // console.log(data.result);
                var fileUrl = data.result.resp;
                $('#' + fileid).prop("value", fileUrl);
                $('#' + upid).prop("src", fileUrl);
                alert("上传成功");

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }
        });

    }

    self.upaaa = function (id) {

        fileid = "upfile" + id;
        upid = "upd" + id;
        imageid = "upimage" + id;
        $('#' + imageid).click();
        var url = globalConfig.basePath + "/appconfig/file/uploadPic";
        $('#' + imageid).fileupload({
            autoUpload: true,
            url: url,
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {
                alert(fileid)
                alert(upid)
                // console.log(data.result);
                var fileUrl = data.result.resp;
                $('#' + fileid).prop("value", fileUrl);
                $('#' + upid).prop("src", fileUrl);
                alert("上传成功");

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }
        });
    };

    self.queryPresetFieldList = function () {
        var url = globalConfig.basePath + "/smart_marketing/message/queryPresetFieldList";
        $http.post(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
                // console.log(JSON.stringify(callback.data));
                self.presetFieldList = callback.data.resp;
            } else {
                alert("查询预设字段失败！！");
            }
        }, function errorCallback(response) {
            console.error(response);
            alert("查询预设字段异常");
        });
    };

    self.insertPresetField = function () {
        var options = "";
        if (insertPresetFieldBoxId == "messageContent" || insertPresetFieldBoxId == "addcontent") {
            options = $('#selectPresetField option:selected');
        } else if (insertPresetFieldBoxId == "upcontent" || insertPresetFieldBoxId == "upnote") {
            options = $('#updateSelectPresetField option:selected');
        } else {
            alert("只能在内容输入框插入预设字段");
            return;
        }
        var textContent = $('#' + insertPresetFieldBoxId + '').val();
        var insertText = "{{" + options.val().split(":")[1] + "-" + options.text() + "}}";
        textContent = textContent.slice(0, insertPresetFieldBoxIndex) + insertText + textContent.slice(insertPresetFieldBoxIndex);
        if (insertPresetFieldBoxId == "messageContent") {
            if (textContent.length > 140) {
                alert("超出字数限制，最大长度为140字");
                return;
            }
            self.add.content = textContent;
        } else if (insertPresetFieldBoxId == "addcontent") {
            if (textContent.length > 100) {
                alert("超出字数限制，最大长度为100字");
                return;
            }
            self.add.notecontent = textContent;
        } else if (insertPresetFieldBoxId == "upcontent") {
            if (textContent.length > 140) {
                alert("超出字数限制，最大长度为140字");
                return;
            }
            self.toupdate.content = textContent;
        } else if (insertPresetFieldBoxId == "upnote") {
            if (textContent.length > 100) {
                alert("超出字数限制，最大长度为100字");
                return;
            }
            self.toupdate.content = textContent;
        }
        insertPresetFieldBoxIndex += insertText.length;
        $('#' + insertPresetFieldBoxId + '').val(textContent);
    };

    self.leaveInputBox = function (inputBoxId) {
        var oTxt1 = document.getElementById(inputBoxId);
        var cursorIndex = 0;
        if (document.selection) {
            // IE Support
            oTxt1.focus();
            var range = document.selection.createRange();
            range.moveStart('character', -oTxt1.value.length);
            cursorIndex = range.text.length;
        } else if (oTxt1.selectionStart || oTxt1.selectionStart==0) {
            // another support
            cursorIndex = oTxt1.selectionStart;
        }
        insertPresetFieldBoxId = inputBoxId;
        insertPresetFieldBoxIndex = cursorIndex;
    };

    self.smsCheckSpecialChar = function (inputBoxId) {
        if (inputBoxId == 'messageContent') {
            if (self.add.content.indexOf("【") >= 0) {
                alert("短信内容禁止输入【");
                self.add.content =self.add.content.replace("【","");
            } else if (self.add.content.indexOf("】") >= 0) {
                self.add.content =self.add.content.replace("】","");
                alert("短信内容禁止输入】");
            }
        } else if(inputBoxId == 'upcontent'){
            if (self.toupdate.content.indexOf("【") >= 0) {
                self.toupdate.content =self.toupdate.content.replace("【","");
                alert("短信内容禁止输入【");
            } else if (self.toupdate.content.indexOf("】") >= 0) {
                self.toupdate.content =self.toupdate.content.replace("】","");
                alert("短信内容禁止输入】");
            }
        }

    };
}]);
