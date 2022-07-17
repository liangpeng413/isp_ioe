'use strict';

var App = angular.module('robot_configController', [], angular.noop);
App.controller('robot_configController', ['$scope', '$http', function ($scope, $http) {

    var self = $scope;
    self.add = {};
    self.viewPage = 'one';
    self.add.welcomeText = [[]];
    self.search = {};
    self.loginName = globalConfig.loginName;
    self.add.rosterType = 'NO_RULE';
    self.effectAndInvalid = {};
    self.hotPage = '';
    self.add.typeList = [];
    self.configObject = {};
    self.configHotObject = {};
    self.configObject.productCode = '';
    self.configObject.fileObject = [];
    self.configHotObject.hotFileObject = [];
    self.fileType = '';
    self.singleContent = {};
    //热门 期数	文件名	更新时间	操作  遍历回显
    self.addHotfileObject = [];

    self.projectType = '';
    self.titleName = '';
    self.flagBackGround = 0;


    //1是显示添加的按钮，2就是显示修改的按钮
    self.isAdd = '1';
    self.isUpdate = '1';
    self.shenhe = {};
    self.add.createPerson = globalConfig.userName;
    self.AssociatedTabId = '';


    self.backGround = '';
    self.file = {};

    self.fundYieldFHBBase = [
        {"code": "unit_net_chng_pct_1_mon", "label": "近一月"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_1_year", "label": "近一年"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_2_year", "label": "近两年"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_3_mon", "label": "近三月"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_3_year", "label": "近三年"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_5_year", "label": "近五年"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_6_mon", "label": "近六月"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_base", "label": "成立以来"},//	string	只有非货币基金返回
        {"code": "unit_net_chng_pct_tyear", "label": "今年以来"},
        {"code": "tenthou_unit_incm", "label": "万份收益"},//	string	只有货币基金返回
        {"code": "unit_net_chng_pct_7_day", "label": "七日年化"}
    ];

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


    var startTime = laydate({
        elem: '#upTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime = laydate({
        elem: '#downTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var startTime2 = laydate({
        elem: '#olineTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime2 = laydate({
        elem: '#offTime',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    self.addText = function () {
        if (self.add.welcomeText.length == 3) {
            alert("最多只能添加三个");
            return;
        }
        self.add.welcomeText.push([])
    }

    self.lessText = function (TextIndexOf) {

        for (var i = 0; i < self.add.welcomeText.length; i++) {
            self.add.welcomeText[i] = $('#' + "wel" + (i + 1)).val();
        }
        if (self.add.welcomeText.length == 1) {
            alert("最少要添加一个");
            return;
        }
        //var indexOf = self.add.welcomeText.indexOf(Text);
        self.add.welcomeText.splice(TextIndexOf, 1);

        for (var i = 0; i <self.add.welcomeText.length ; i++) {
            var indexId= i+1;
            var data = self.add.welcomeText[i];
            $("#wel"+indexId).val(data);

        }

    }

    self.addLabel = function () {
        if (self.configObject.introLabel.length == 3) {
            alert("最多只能添加三个");
            return;
        }
        self.configObject.introLabel.push([])
    }

    self.lessLabel = function (label) {
        for (var i = 0; i < self.configObject.introLabel.length; i++) {
            self.configObject.introLabel[i] = $('#' + "int" + (i + 1)).val();
        }

        if (self.configObject.introLabel.length == 1) {
            alert("最少要添加一个");
            return;
        }
        //var indexOf = self.configObject.introLabel.indexOf(label);
        self.configObject.introLabel.splice(label,1)
        for (var i = 0; i <self.configObject.introLabel.length ; i++) {
           var indexId= i+1;
            var data = self.configObject.introLabel[i];
                $("#int"+indexId).val(data);


        }
        console.log("删除后:",self.configObject.introLabel);
    }

    self.hideAddConfigShow = function () {
        $('#addConfigShow').hide();
    }

    self.priorityManager = function () {
        if (!self.search.pageCode || !self.search.positionNo) {
            alert("请选择页面和位置");
            return;
        }

        if ((self.search.pageCode=='liCai' && self.search.positionNo=='5')||(self.search.pageCode=='life' && self.search.positionNo=='5') || self.search.positionNo == '6'){
            var positionNo;
            if (self.search.pageCode=='liCai' && self.search.positionNo=='5'){
                positionNo = 'LI_CAI_RECOMMAND';
            }
            if (self.search.pageCode=='life' && self.search.positionNo=='5'){
                positionNo = 'LIFE_RECOMMAND';
            }
            if (self.search.positionNo == '6'){
                positionNo = 'CONTENT_RECOMMAND';
            }

            var url = globalConfig.basePath + "/robot_tabConfig/getTabByPositionNo?positionNo=" + positionNo;
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        console.log(data, "此位置的所有tab");
                        self.priorityTabList = data.data.resp;
                        $('#configPriority').show();

                    } else {
                        alert(data.data.message);

                    }
                }
            )
        }
       else {

            var url = globalConfig.basePath + "/robot_Config/selectConfigBySort";
            $http.post(url, self.search).then(
                function (data) {
                    if (data.data.code == '000') {
                        console.log(data, "排序的返回");
                        var list = data.data.resp;
                        for (var i = 0; i < list.length; i++) {
                            list[i].sort = i + 1;
                        }
                        $scope.sortList = list;
                        $('#configPriority').show();
                    } else {
                        alert(data.data.message);

                    }
                }
            )


        }

        if(self.AssociatedTabId){

            self.selectConfigByTabId(self.AssociatedTabId)
        }



    }


    self.selectConfigByTabId = function (tabId) {

        var url = globalConfig.basePath+"/robot_Config/getAllConfigByTabId?tabId="+tabId;
        $http.get(url).then(
            function (data) {
                if (data.data.code=='000'){
                    console.log(data, "排序的返回");
                    var list = data.data.resp;
                    for (var i = 0; i < list.length; i++) {
                        list[i].sort = i + 1;
                    }
                    $scope.sortList = list;
                }
            }
        )


    }


    self.moveCancel = function () {
        self.hotSortList=angular.copy(self.hotSortListRollBack);
        $('#configPriority').hide();
        $('#hotPriority').hide();
    }

    self.hotManager = function () {
       var tabId =$("#searchContentTab").val();
        if(tabId){
            var url = globalConfig.basePath + "/robot_Config/getHotListByTabId?tabId=" + tabId;
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        if(!data.data.resp){
                            $scope.hotSortList="";
                            return;
                        }
                        var list = JSON.parse(data.data.resp);
                        console.log("list,", list)
                        for (var i = 0; i < list.length; i++) {
                            list[i].sort = i + 1;
                            console.info("list[i]:", list[i]);
                        }
                        $scope.hotSortList = list;
                        self.hotSortListRollBack=angular.copy(list);
                        console.log("$scope.hotSortList:", $scope.hotSortList);
                    }
                }
            )
        }


        $('#hotPriority').show();
    }

    self.getHotTab = function () {
        var url = globalConfig.basePath + "/robot_Config/getAllHotTab";
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data, "关联页面的数据");
                    self.hotTabList = data.data.resp;
                }
            }
        )
    }

    self.getHotTab();


    self.showAddPage = function () {
        self.backGround="1"
        self.isUpdate="1";
        self.add.showType=null;
        $('#tonglan').attr('checked', false);
        $('#zhongtui').attr('checked', false);
        $('#xiaotuijian').attr('checked', false);
        $('#radioImg').prop('checked', true);

        if(!self.add.pageCode){
            alert("页面必选");
            return;
        }
        if(!self.add.positionNo){
            alert("位置必选");
            return;
        }
        if(!self.add.resourceType){
            alert("资源位类型必选");
            return;
        }
        self.isUpdate = '1';
        if(self.add.pageCode!='liCai'&&self.add.pageCode!='life'&&self.add.pageCode!='configPage'&&self.add.pageCode!='launcher'){
            var url = globalConfig.basePath + "/robot_tabConfig/getTabInfo?id=" + self.add.pageCode;
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                cache: false,
                dataType: "json",
                success: function (data) {
                    console.log("获取tabConfig接口返回:", data);
                    if (data.code == '000') {
                        console.log("data.data.resp:", data.resp.tabName);
                        self.add.tabName = data.resp.tabName;
                    } else {
                        console.log("后台接口返回非正常状态:", data);
                    }

                },
                error: function () {
                    console.log("发生错误")
                },
                complete: function () {
                }
            });
        }
        self.viewPage = 'two';
        self.configObject = {};
        self.add.welcomeText=[[]];
        $('#addConfigShow').hide();
        if (self.add.positionNo == '6') {
            self.positionNo = 'CONTENT_RECOMMAND';
        }
        if (self.add.positionNo == '5' && self.add.pageCode == 'life') {
            self.positionNo = 'LIFE_RECOMMAND';
        }
        if (self.add.positionNo == '5' && self.add.pageCode == 'liCai') {
            self.positionNo = 'LI_CAI_RECOMMAND';
        }
        if (self.add.positionNo == '6' || (self.add.positionNo == '5' && self.add.pageCode == 'life') || (self.add.positionNo == '5' && self.add.pageCode == 'liCai')) {
            var url = globalConfig.basePath + "/robot_tabConfig/getTabByPositionNo?positionNo=" + self.positionNo;
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        console.log(data, "此位置的所有tab");
                        self.tabList = data.data.resp;
                    } else {
                        alert(data.data.message);

                    }
                }
            )
        }

    }

    self.backGroundType2=function(){
        if(self.flagBackGround==1){
            $("#fileUrl").val("");
        }
        self.flagBackGround=2;
        self.backGround='2';


    }

    self.backGroundType1=function(){
        if(self.flagBackGround==2){
            $("#fileUrl").val("");
        }
        self.flagBackGround=1;
        self.backGround='1';

    }


    self.returnPageOne = function(){
        self.add = {};
        self.viewPage = 'one';
    }

    self.upLoadBackGround = function () {

        var check = $("input[name='backGround']:checked").val();
        if (!check) {
            alert("请选则背景图片类型!");
            return;
        }
        var url = globalConfig.basePath + "/api/file/upload";
        if (self.backGround == "1") {
            $('#addPicture').click();
            $('#addPicture').fileupload({
                autoUpload: true,//是否自动上传
                url: url + "?fileType=img",//上传地址
                dataType: 'json',
                acceptFileTypes: self.getCode('4'),
                maxFileSize: 1 * 1024 * 1024 * 30,
                done: function (e, data) {//设置文件上传完毕事件的回调函数
                    console.log("上传接口返回:", data);
                    if (data.result.code != '000') {
                        alert("上传失败:" + data.result.message);
                        return;
                    }
                    var fileUrl = data.result.resp.url;
                    $('#fileUrl').prop("value", fileUrl);
                    $('#image_prew').prop("src", fileUrl);
                    alert("上传成功")
                }
            }).on('fileuploadprocessalways', function (e, data) {
                if (data.files.error) {
                    if (data.files[0].error == 'File type not allowed') {
                       alert("上传失败：文件格式错误");
                        data.files.error=null;
                        return;
                    }
                }
            });
        } else {
            $('#addVideo').click();
            $('#addVideo').fileupload({
                autoUpload: true,//是否自动上传
                url: url + "?fileType=video",//上传地址
                dataType: 'json',
                acceptFileTypes: self.getCode('2'),
                maxFileSize: 1024 * 1024 * 500,
                done: function (e, data) {
                    //设置文件上传完毕事件的回调函数
                    if (data.result.code != '000') {
                        alert("上传失败:" + data.result.message);
                        return;
                    }
                    $('#fileUrl').prop("value", data.result.resp.url);
                    $('#image_prew').prop("src", data.result.resp.url);
                    $(".upstatus").html("上传成功");
                    alert("上传成功")


                },
                progress: function (e, data) {//上传进度
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $(".progress .bar").css("width", progress + "%");
                    $(".progress .bar").html("正在上传...");
                }

            }).on('fileuploadprocessalways', function (e, data) {
                if (data.files.error == true) {
                    alert("上传失败：文件格式错误");
                    data.files.error=null;
                    return;
                }
            });

        }

    }


    $scope.pullAuditPersons = function () {
        var url = globalConfig.basePath + "/otc/memberEnjoy/listAuditPerson?menu=intelligent_operation_audit";
        $http.get(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
                $scope.auditPersonList = callback.data.resp;
                console.log("审核人list，，，", self.auditPersonList);
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

    self.pullAuditPersons();


    self.checkAllConventionalPage = function () {
        var url = globalConfig.basePath + "/robot_Config/getAllConventionalPage";
        $http.get(url).then(
            function (data) {
                console.log(data, "所有的资讯页面");
                if (data.data.code == '000') {
                    self.conventionalList = data.data.resp;
                }
            }
        )

    }

    self.checkAllConventionalPage();

    self.addCommit = function () {
        var checkConfionInfo = self.checkConfionInfo();
        if(checkConfionInfo){
            return;
        }
        if (self.add.typeList && self.add.typeList.length > 0) {
            var list = self.add.typeList;
            self.add.typeList = JSON.stringify(self.add.typeList);
        }else{
            self.add.typeList=null;
        }

        var rosterId = $('#memberId').val();
        if ( rosterId&& !isNaN(rosterId)) {
            self.add.rosterId = rosterId;
        } else {
            self.add.rosterId = null;
        }
        self.add.createPerson = self.loginName;
        self.add.showType = $('input[name="showType"]:checked').val();
        console.log(self.add, "要添加的对象");
        if (self.add.welcomeText && self.add.welcomeText.length >= 1) {
            self.add.welcomeText = JSON.stringify(self.add.welcomeText);
        }else{
            self.add.welcomeText=null;
        }

        var url = globalConfig.basePath + "/robot_Config/insert";
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("添加成功!");
                    self.add = {};

                    self.add.rosterType = 'NO_RULE';
                    self.add.welcomeText = [];
                    self.queryRobotConfigList(1);
                    self.configObject = {};
                    self.viewPage = 'one';
                } else {
                    alert(data.data.message);
                    self.add.typeList = list;
                }

            }
        )


    }

    /**
     * 页面列表
     * @param pageNum
     */
    self.queryRobotConfigList = function (pageNum) {

        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                alert("已经是最后一页了");
                self.search.pageNo = self.search.pageCount;
                return;
            } else {
                self.search.pageNo = pageNum;
            }
        }


        if (!self.search.pageSize) {
            self.search.pageSize = '5';
        }
        if (!self.search.pageNo) {
            self.search.pageNo = "1";
        }


        console.log(self.search);

        var url = globalConfig.basePath + "/robot_Config/getRobotConfigList";
        $http.post(url, self.search).then(
            function (data) {
                console.log(data);
                if (data.data.code == '000') {
                    if (data.data.resp.pageNum) {
                        self.search.pageNo = data.data.resp.pageNum;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pages;
                    self.search.totalRowSize = data.data.resp.total;
                    self.search.pageNo = data.data.resp.pageNum;
                    var list = data.data.resp.list;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                       if (item.pageCode != 'launcher'  && item.pageCode != 'liCai' && item.pageCode != 'life'){
                           var url = globalConfig.basePath+"/robot_tabConfig/getTabInfo?id="+item.pageCode;
                           $.ajax({
                               type:"GET",
                               url:url,
                               async:false,
                               cache:false,
                               dataType:"json",
                               success:function(data){
                                   console.log("获取tabConfig接口返回:",data);
                                   if(data.code=='000'){
                                       if(data.resp&&data.resp.tabName){
                                           list[i].tabName=data.resp.tabName;
                                       }
                                   }else{
                                       console.log("后台接口返回非正常状态:",data);
                                   }

                               },
                               error:function(){
                                   console.log("发生错误")
                               },
                               complete:function(){
                               }
                           });

                       }
                    }
                    self.initiativeList=list;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.queryRobotConfigList(1);

    /**
     * 用户策略类型初始化
     */
    self.strategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyList = data.data.resp;
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

        if (self.add.rosterType == 'NO_RULE') {
            return;

        } else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=WK" + "&rosterType=" + self.add.rosterType;
            $http.post(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        console.log(data, "查询分组");
                        self.strChannelGroups = data.data.resp;
                        if (self.strChannelGroups.length > 0) {
                            $('.mySelect').select2();
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

    self.strategyReload();

    self.changeFindChannelGroups = function () {
        self.findChannelGroups();
    }
//endregion

    /**
     * 优先级上移下移
     * @param type
     */
    $scope.move = function (type) {
        if ($("input[class='moveCheckbox iptCheck']:checked").length <=0) {
            alert("请选择一个进行移动");
            return;
        }
        var length = $scope.sortList.length;
        $('.moveCheckbox').each(function () {
            if (this.checked == true) {
                if (type == 'S') {//上移
                    var me = $(this).val() - 1;
                    if (me == 0) {
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 = $scope.sortList[me];//当前选中的
                    var move1 = $scope.sortList[me - 1];//上一个
                    $scope.sortList[me - 1] = move0;//self.strotList[me];//当前选中的上移一个
                    $scope.sortList[me] = move1;// 当前选中的
                    $scope.sortList[me - 1].sort = Number($(this).val()) - Number(1);
                    $scope.sortList[me].sort = Number($(this).val());
                } else if (type == 'X') {// 下移
                    var me = $(this).val() - 1;
                    if (me == length - 1) {
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = $scope.sortList[me];// 下一个banner
                    move0.sort = Number($(this).val()) + Number(1);
                    var move1 = $scope.sortList[me + 1];// 下一个banner
                    move1.sort = Number($(this).val());
                    $scope.sortList[me + 1] = move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    $scope.sortList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }

    /**
     * 生效失效页面
     */
    self.effectOrInvalid = function (isValid, id) {
        self.effectAndInvalid.valid = isValid;
        self.effectAndInvalid.id = id;
        $('#showInvalid').show();
    }

    /**
     * 确定生效和失效
     */
    self.confirmInvalid = function () {
        console.log(self.effectAndInvalid, "失效生效入参");
        var url = globalConfig.basePath + "/robot_Config/updateValid";
        $http.post(url, self.effectAndInvalid).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功!");
                    self.queryRobotConfigList(1);
                    $('#showInvalid').hide();

                } else {
                    alert(data.data.message);
                }

            }
        )

    }

    /**
     * 确定排序
     */
    $scope.moveCommit = function () {
        for (var i = 0; i < self.sortList.length; i++) {
            self.sortList[i].priority = self.sortList[i].sort;
        }
        var url = globalConfig.basePath + "/robot_Config/updateConfigPriority";
        $http.post(url, $scope.sortList).then(
            function (data) {
                console.log("排序返回");
                console.log(data);
                alert(data.data.message);
                //self.reset();
                //self.loading();
                // $scope.querySplashConfigList(1);
                $('#configPriority').hide();
                $scope.sortList = data.data.resp;
            }, function (response) {
                alert("请求失败了....");
            }
        );
    }




    /**
     * 查看机器人配置详情
     */
    self.checkRobotConfigById = function (id) {
        self.viewPage = 'check';
        var url = globalConfig.basePath + "/robot_Config/selectConfigById?id=" + id;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.robotDetail = data.data.resp;
                    console.log(self.robotDetail, "查看机器人配置详情");
                    if (self.robotDetail.pageCode != 'launcher' && self.robotDetail.pageCode != 'liCai' && self.robotDetail.pageCode != 'life'&& self.robotDetail.pageCode != 'configPage') {
                        var url = globalConfig.basePath + "/robot_tabConfig/getTabInfo?id=" + self.robotDetail.pageCode;
                        $.ajax({
                            type: "GET",
                            url: url,
                            async: false,
                            cache: false,
                            dataType: "json",
                            success: function (data) {
                                console.log("获取tabConfig接口返回:", data);
                                if (data.code == '000') {
                                    console.log("data.data.resp:", data.resp.tabName);
                                    self.robotDetail.tabName = data.resp.tabName;
                                } else {
                                    console.log("后台接口返回非正常状态:", data);
                                }

                            },
                            error: function () {
                                console.log("发生错误")
                            },
                            complete: function () {
                            }
                        });

                    }
                    //回显展示关联tab名称
                    if(self.robotDetail.tabId){
                        var url = globalConfig.basePath + "/robot_tabConfig/getTabInfo?id=" +self.robotDetail.tabId;
                        $.ajax({
                            type: "GET",
                            url: url,
                            async: false,
                            cache: false,
                            dataType: "json",
                            success: function (data) {
                                console.log("获取tabConfig接口返回:", data);
                                if (data.code == '000') {
                                    console.log("data.data.resp:", data.resp.tabName);
                                    self.robotDetail.tabIdName = data.resp.tabName;
                                } else {
                                    console.log("后台接口返回非正常状态:", data);
                                }

                            },
                            error: function () {
                                console.log("发生错误")
                            },
                            complete: function () {
                            }
                        });
                    }

                    if (self.robotDetail.welcomeText) {
                        self.robotDetail.welcomeText = JSON.parse(self.robotDetail.welcomeText);
                    }

                    if (self.robotDetail.typeList) {
                        self.robotDetail.typeList = JSON.parse(self.robotDetail.typeList);
                    }
                    if (self.robotDetail.rosterType) {
                        for (var i = 0; i < self.strategyList.length; i++) {
                            if (self.robotDetail.rosterType == self.strategyList[i].key) {
                                self.robotDetail.rosterTypeName = self.strategyList[i].value;
                            }
                        }
                    }
                    if (self.strChannelGroups) {
                        for (var i = 0; i < self.strChannelGroups.length; i++) {
                            if (self.robotDetail.rosterId == self.strChannelGroups[i].rosterId) {
                                self.robotDetail.rosterName = self.strChannelGroups[i].rosterName;
                            }
                        }
                    } else {
                        if (self.robotDetail.rosterType != 'NO_RULE') {

                            $http.post(globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=WK" + "&rosterType=" + self.robotDetail.rosterType).then(
                                function (data) {
                                    if (data.data.code == '000') {
                                        console.log(data, "查询分组");
                                        self.strChannelGroups = data.data.resp;
                                        for (var i = 0; i < self.strChannelGroups.length; i++) {
                                            if (self.robotDetail.rosterId == self.strChannelGroups[i].rosterId) {
                                                self.robotDetail.rosterName = self.strChannelGroups[i].rosterName;
                                            }
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
                    for (var i = 0; i < self.auditPersonList.length; i++) {
                        if (self.robotDetail.auditor == self.auditPersonList[i].no) {
                            self.robotDetail.auditorName = self.auditPersonList[i].name;
                        }
                    }

                    console.log(data, "查看返回的详情数据");
                } else {
                    alert(data.data.message);
                }
            }
        )

    }

    self.addProductCofig = function () {
        $('.mySelect2').select2();
        $('#addShow').show();
        $('#term').html(null);
        $('#termDesc').html(null);
        $('#bankRate').html(null);
        $('#bankRateType').html(null);
        $('#bankAddr').val(null);
        $('#fundType').html(null);
        $('#fundName').val(null);
        $('#rate').html(null);
        $('#productId').html(null);
        $('#productLiLv').html(null);
        $('#productName').val(null);

        self.isAdd = '1';
        self.isProductLabel = '1'
        self.configObject = {};
        self.configObject.introLabel = [[]];
        $("#int1").val("");
        self.configObject.taskObject = 'productConfig';
        self.rollBack=null;
        $('#addShow').show();
        $("#addShow *").attr("disabled",false);

    }
    self.closeProduct = function () {
        self.productList = null;
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#addShow').hide();
    }
    self.customCofig = function () {
        self.isAdd="1";
        self.configObject = {};
        // self.configObject.introLabel = [[]];
        self.configObject.taskObject = 'customConfig';
        self.configObject.projectType = 1;
        self.rollBack=null;
        $("#customJumpFile2").val("");

        self.add.fileUrl="";
        $('#addCustom').show();
        $("#addCustom *").attr("disabled",false);
        $('#customJumpFile2').attr("disabled",true);
    }




    self.pictureCofig = function () {
        self.isAdd="1";
        self.configObject = {};
        // self.configObject.introLabel = [[]];
        self.configObject.taskObject = 'pictureConfig';
        self.configObject.projectType = 3;
        self.rollBack=null;
        $('#customPicture2').val("");
        $('#Realtime').show();
        $("#Realtime *").attr("disabled",false);
    }

    self.closePictureConfig = function () {
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#Realtime').hide();
    }

    self.closeCustom = function () {
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#addCustom').hide();
    }


    self.closeThematic = function () {
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#addThematic').hide();
    }

    self.thematiCofig = function () {
        self.isAdd="1";
        self.isAfter='1';
        self.configObject = {};
        $("#fileType").val("");
        // self.configObject.introLabel = [[]];
        self.configObject.fileObject = [];
        self.configObject.taskObject = 'thematicConfig';
        self.configObject.projectType = 3;
        self.rollBack=null;
        self.projectType = self.configObject.projectType;
        $('#addThematic').show();
        $("#addThematic *").attr("disabled",false);

    }

    self.collectionCofig = function () {

        self.configObjectFileType="1";
        self.isAdd='1';
        self.configObject = {};
        // self.configObject.introLabel = [[]];
        self.configObject.fileObject = [];
        self.configObject.taskObject = 'contentCollection';
        self.configObject.projectType = 1;
        self.projectType = self.configObject.projectType;
        self.configObject.type = '内容合集';
        self.rollBack=null;
        $('#addCollection').show();
        $("#addCollection *").attr("disabled",false);

    }
    self.closeCollection = function () {
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#addCollection').hide();
    }

    self.singleCofig = function () {
        self.isAdd='1';
        self.add.imageUrl=null;
        self.configObject = {};
        // self.configObject.introLabel = [[]];
        self.configObject.taskObject = 'singleContent';
        self.configObject.projectType = 2;
        self.projectType=self.configObject.projectType;
        self.rollBack=null;
        $('#addSingle').show();
        $("#addSingle *").attr("disabled",false);
        $('#singleFile2').attr("disabled",true);

    }

    self.closeSingle = function () {
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#addSingle').hide();
    }

    self.newsCofig = function () {
        self.isAdd='1';
        self.configObject = {};
        // self.configObject.introLabel = [[]];
        self.configObject.taskObject = 'newsConfig';
        self.configObject.projectType = 2;
        self.projectType=self.configObject.projectType;
        self.rollBack=null;
        $("#newsFile2").val("");
        $('#addNews').show();
        $("#addNews *").attr("disabled",false);
        $('#newsFile2').attr("disabled",true);
    }

    self.closeNews = function () {
        if(self.add.typeList&&self.rollBack){
            self.add.typeList[self.indexOf] = self.rollBack;
        }
        $('#addNews').hide();

    }



    self.getWDProductList = function(){
        var url = globalConfig.basePath + "/robot_Config/getWDInfoList";
        $.ajax({
            type: 'GET',
            url: url,
            async:false,
            success: function (data) {
                console.log(data, "产品集合")

                for (var i = 0; i < data.resp.length; i++) {
                    if (data.resp[i].productCat == 'M' || data.resp[i].productCat == 'Q'
                        || data.resp[i].productCat == 'Y' || data.resp[i].productCat == 'X'
                        || data.resp[i].productCat == 'V') {
                        data.resp[i].productName = data.resp[i].productTypeDescribe;
                        data.resp[i].productTypeDescribe = data.resp[i].productTypeDescribe + "-" + data.resp[i].productPeriod;
                        data.resp[i].serialNoType = 0;
                        data.resp[i].productCode  = data.resp[i].productSecondCat;
                    } else {
                        if (data.resp[i].productCat != data.resp[i].productSecondCat) {
                            data.resp[i].serialNoType = 1;
                            data.resp[i].productCode = data.resp[i].lcProductId;
                            data.resp[i].productName = data.resp[i].productTypeDescribe;
                            data.resp[i].productTypeDescribe = data.resp[i].lcProductId + "-" + data.resp[i].productTypeDescribe + "-" + data.resp[i].productPeriod;
                        } else {
                            data.resp[i].productName = data.resp[i].productTypeDescribe;
                            data.resp[i].serialNoType = 2;
                            data.resp[i].productCode = data.resp[i].productCat;
                        }
                    }


                }


                self.WDProductList = data.resp;

            },
            error: function (data) {
                alert(data.message);
            }

        })

    }

    self.getBankProductList = function(){
        var  url = globalConfig.basePath + "/robot_Config/getBankInfoList";
        $.ajax({
            type: 'GET',
            url: url,
            async:false,
            success: function (data) {
                console.log(data, "银行产品集合")
              if(data.code=='000'&&data.resp!=null){
                  for (var i = 0; i < data.resp.length; i++) {
                      data.resp[i].productTypeDescribe = data.resp[i].bankName + "-" + data.resp[i].productName;
                      data.resp[i].productCode = data.resp[i].id;
                  }

                  self.BankProductList = data.resp;
              }


            },
            error: function (data) {
                alert(data.message);
            }

        })


    }

    self.getBankProductList();
    self.getWDProductList();


    self.getAllProduct = function (type) {
          //$('#bankAddr').val("");
        self.productList = null;
        if (type == '1') {
            self.productList = self.WDProductList;
            //清空基金属性
            if(self.temporaryObject){
                self.temporaryObject.fundName=null;
                self.temporaryObject.fundType=null;
                self.temporaryObject.rateType=null;
            }


            $("#productId").text("");
            $("#productLiLv").text("");

        }
        if (type == '3') {
            self.productList = self.BankProductList;
            //清空基金属性
            if(self.temporaryObject){
                self.temporaryObject.fundName=null;
                self.temporaryObject.fundType=null;
            }


            $("#productName").val("");
            $("#term").text("");
            $("#termDesc").text("");
            $("#bankRate").text("");
            $("#bankRate").text("");
            $("#bankRateType").text("");
        }

        if(type=='2'){
            //清空非基金的属性
            if(self.temporaryObject){
                self.temporaryObject.productName=null;
            }
            if(self.configObject.productCode){
                self.configObject.productCode=null;
            }

            $("#rate").text("");
            self.configObject.rateType=null;
             self.configObject.fundName=null;
             self.configObject.fundType=null;

        }




    }

    /**
     * 回显产品信息
     */
    self.echoProductInformation = function (productCode, type) {
        self.productInfo = null;
        if (productCode) {
            for (var i = 0; i < self.productList.length; i++) {
                if (productCode==self.productList[i].productCode){
                    self.productInfo = self.productList[i];
                    break;
                }
            }
            if (self.productInfo.productCat == 'M' || self.productInfo.productCat == 'Q'
                || self.productInfo.productCat == 'Y' || self.productInfo.productCat == 'X'
                || self.productInfo.productCat == 'V') {
                self.productInfo.serialNoType = 0;
            } else {
                if (self.productInfo.productCat != self.productInfo.productSecondCat) {
                    self.productInfo.serialNoType = 1;
                } else {
                    self.productInfo.serialNoType = 2;
                }
            }

                if (type == '1') {
                    if (self.temporaryObject){
                        self.temporaryObject.productCode = self.productInfo.productCode;
                            self.temporaryObject.productName = self.productInfo.productName;
                        self.temporaryObject.productRate = self.productInfo.standardInterestRate;
                    }

                    $('#productId').html(self.productInfo.productName);
                    $('#productLiLv').html(self.productInfo.standardInterestRate);
                }
                if (type == '3') {
                    if (self.temporaryObject){
                        self.temporaryObject.productCode = self.productInfo.id;
                        self.temporaryObject.productName = self.productInfo.productName;
                        self.temporaryObject.productRate = self.productInfo.profit;
                        self.temporaryObject.rateType = self.productInfo.profitDesc;
                        self.temporaryObject.term = self.productInfo.period + self.productInfo.timeUnit;
                        self.temporaryObject.termDesc = self.productInfo.periodDesc;
                        self.temporaryObject.linkAddr = self.productInfo.detailsUrl;
                        self.temporaryObject.bankCode = self.productInfo.bankCode;
                    }

                    $('#term').html(self.productInfo.period + self.productInfo.timeUnit);
                    $('#termDesc').html(self.productInfo.periodDesc);
                    $('#bankRate').html(self.productInfo.profit);
                    $('#bankRateType').html(self.productInfo.profitDesc);
                    $('#bankAddr').val(self.productInfo.detailsUrl);
                    $('#productName').val(self.productInfo.productName);
                    self.configObject.bankCode = self.productInfo.bankCode;
                }

        }

    }

    self.addToConfig = function () {
        $('#addConfigShow').show();
    }

    self.getUID =  function() { // 获取唯一值
        return 'xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }


    /**
     * 添加到类型列表里
     */
    self.addConfig = function (type) {
        if (self.add.typeList && self.add.typeList.length == 20){
            alert("最多添加二十条配置");
            return;
        }
        if (self.configObject.productType && self.configObject.productType == '2'){
            self.configObject.productCode = self.configObject.productCode.toString();
        }else if (self.configObject.productType && self.configObject.productType != '2'){
            self.configObject.productCode = $('#product').val();
        }

        var checkParams = self.checkParams(type);
        if(checkParams){
            return;
        }
        if(type==6){
            if(!self.configObject.fileObject||self.configObject.fileObject.length<=0){
                alert("文件必须上传");
                return;
            }
        }


        self.temporaryObject = angular.copy(self.configObject);
        if(type==4){
            self.temporaryObject.fileUrl=self.add.imageUrl;
        }
        if (type==3){
            self.temporaryObject.linkAddr = $('#newsFile2').val();
        }

        if (self.temporaryObject.taskObject == 'productConfig' && self.temporaryObject.productType != '2'){
            self.temporaryObject.productName = self.productInfo.productName;
        }

        // self.temporaryObject.productName= self.temporaryObject.productCode.productName;
        //给内容单片/合集/专题 添加唯一id
        if (type == '4' || type == '5' || type == '6'){
            self.temporaryObject.id = self.getUID();
        }

        self.introLabel = [];
        if (typeof (self.temporaryObject.introLabel) != "undefined" && self.temporaryObject.introLabel.length >= 1){
            for (var i = 0; i < self.temporaryObject.introLabel.length; i++) {
                var value = $('#' + "int" + (i + 1)).val();
                if (value && value!=''){
                    self.introLabel.push(value);
                }
            }
        }
        if (self.introLabel == []){
            self.temporaryObject.introLabel = null;
        }else{
            self.temporaryObject.introLabel = self.introLabel;
        }
        //这个时候产品是有的,code也是有的
        if (self.temporaryObject.productType && self.temporaryObject.productType == '1') {
            self.temporaryObject.serialNoType = self.productInfo.serialNoType;
            self.temporaryObject.productRate = $('#productLiLv').html();


        }else if (self.temporaryObject.productType == '2') {

                self.temporaryObject.fundType = $('#fundType').html();
                self.temporaryObject.fundName = $('#fundName').val();
                self.temporaryObject.linkAddr = $('#bankAddr').val();
                for (var i = 0; i < self.fundYieldFHBBase.length; i++) {
                    if (self.temporaryObject.rateType == self.fundYieldFHBBase[i].code) {
                        self.temporaryObject.rateType = self.fundYieldFHBBase[i].label;
                    }
                }
                self.temporaryObject.productRate = $('#rate').html();
                if(!self.temporaryObject.productRate){
                    alert("利率类型为空不能保存");
                    return;
                }


            } else if (self.temporaryObject.productType && self.temporaryObject.productType == '3') {

                self.temporaryObject.term = $('#term').html();
                self.temporaryObject.termDesc = $('#termDesc').html();
                self.temporaryObject.productRate = $('#bankRate').html();
                self.temporaryObject.rateType = $('#bankRateType').html();
                self.temporaryObject.linkAddr = $('#bankAddr').val();


            }

        if(!self.add.typeList){
            self.add.typeList=[];
        }
        self.add.typeList.push(self.temporaryObject);
        self.productList = null;
        self.titleName=self.configObject.title;
        self.temporaryObject = null;
        self.configObject = {};
        alert("添加成功!");
        if (type == '1') {
            $('#addShow').hide();
        }
        if (type == '3') {
            $('#addNews').hide();
        }
        if (type == '2') {
            $('#Realtime').hide();
        }
        if (type == '4') {
            $('#addSingle').hide();
        }
        if (type == '5') {
            $('#addCollection').hide();
        }
        if (type == '6') {
            $('#addThematic').hide();
        }
        if (type == '7') {
            $('#addCustom').hide();
        }


    }

    self.deleteFromTypeList = function (object) {
        var indexOf = self.add.typeList.indexOf(object);
        if (confirm('确定要删除吗?')) {
            if (indexOf > -1) {
                self.add.typeList.splice(indexOf, 1);
            }
        }

    }

    $('#newsCover').fileupload({
        autoUpload: true,//是否自动上传
        url: globalConfig.basePath + "/api/file/upload?fileType=img",//上传地址
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpg|jpeg|png|txt)$/i,
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log("上传接口返回:", data);
            if (data.result.code != '000') {
                alert("上传失败:" + data.result.message);
                return;
            }
            $('#newsCover2').prop("value", data.result.resp.url);
            $('#upNewCover').prop("src", data.result.resp.url);
            //文件名字
            self.file.fileName = data.files[0].name;
            self.file.fileUrl = data.result.resp.url;
            self.file.fileTime = data.result.resp.fileTime;
            self.file.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
            self.configObject.backGround= $('#newsCover2').val();
            self.file = {};
            alert("上传成功")
        }
    }).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                alert("上传失败：文件格式错误");
                console.log("上传失败：文件格式错误")
                data.files.error=null;
                return;
            }
        }
    });
    //根据类型获取要上传的尾缀
    self.getUrl = function (type) {
        console.log(type, "文件类型");
        var typeString = '';
        if (type == '1') {
            typeString = "audio";
        } else if (type == '2') {
            typeString = "video";
        } else if (type == '3') {
            typeString = "txt";
        } else if (type == '4') {
            typeString = "img";
        }
        return typeString;

    };

    //根据类型获取上传正则表达式
    self.getCode = function (type) {
        console.log(type, "类型")
        var code = '';
        if (type == '1') {
            if(self.add.pageCode == 'launcher' ){
                //launcher
                code = /(p\.|\/)(mp3|wma|ape|flac)$/i;

            }else if(self.add.pageCode != 'life'&&self.add.pageCode != 'launcher'&&self.add.pageCode != 'liCai'){
                //咨询
                code = /(p\.|\/)(mp3|flac)$/i;
            }else{
                code = /(p\.|\/)(mp3|wma|ape|flac)$/i;
            }


        } else if (type == '2') {

            if(self.add.pageCode == 'launcher' ){
                //launcher
                code = /(p\.|\/)(mp4|m4v|mkv)$/i;
            }else if(self.add.pageCode != 'life'&&self.add.pageCode != 'launcher'&&self.add.pageCode != 'liCai'){
                //咨询
                code = /(p\.|\/)(mp4|avi|wmv)$/i;
            }else{
                code = /(p\.|\/)(mp4|avi|rmvb|m4v|mkv|wmv)$/i;
            }
        } else if (type == '3') {
            code = /(\.|\/)(txt)$/i;
        }else if (type == '4') {
            if(self.add.pageCode == 'launcher' ){
                //launcher
                code = /(\.|\/)(gif|jpg|jpeg|png)$/i;
            }else if(self.add.pageCode != 'life'&&self.add.pageCode != 'launcher'&&self.add.pageCode != 'liCai'){
                //咨询
                code = /(\.|\/)(gif|jpg|png)$/i;
            }else{
                code = /(\.|\/)(gif|jpg|jpeg|png|tiff|pdf)$/i;
            }
        }
        console.log("使用的正则表达式:",code)
        return code;

    };

    //根据类型获取上传的大小限制
    self.getSize = function (type) {
        var size = '';
        if (type == '1') {
            size = 1 * 1024 * 1024 * 100
        } else if (type == '2') {
            size = 1 * 1024 * 1024 * 500;
        } else if (type == '3') {
            size = 1 * 1024 * 1024 * 30;
        } else if (type == '4') {
            size = 1 * 1024 * 1024 * 300;
        }
        console.log(size, "上传限制大小")
        return size;
    };
    self.uploadNews = function () {
        if(!self.configObject.jumpType){
            alert("请选择文件类型");
            return;
        }
        $('#newsFile').click();
        //咨询内容上传事件
        $('#newsFile').fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath + "/api/file/upload?fileType=" + self.getUrl(self.configObject.jumpType),
            dataType: 'json',
            acceptFileTypes: self.getCode(self.configObject.jumpType),
            maxFileSize: self.getSize(self.configObject.jumpType),
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log("后台返回map", data);
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;
                }
                $('#newsFile2').prop("value", data.result.resp.url);
                $('#newsFile').prop("src", data.result.resp.url);
                //文件名字
                self.file = {};
                self.file.fileName = data.files[0].name;
                self.file.fileUrl = data.result.resp.url;
                self.file.fileTime = data.result.resp.fileTime
                self.file.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");

                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传失败：文件格式错误");
                    data.files.error=null;
                    return;
                }
            }
        });

    }


    self.updateTypeInfo = function (x) {
         //是否可以修改合集内容中的文件类型  1:可以修改,2:不能修改
        self.configObjectFileType='2';

        //+和-产品介绍品显示和隐藏  1:展示  2：隐藏
        self.isProductLabel='1';
        self.isShow='2';
        self.temporaryObject = x;
        self.rollBack=angular.copy(x);
        console.log(self.temporaryObject, "要修改的配置");
        self.indexOf = self.add.typeList.indexOf(self.temporaryObject);
        self.isAdd = '2';
        self.configObject = self.temporaryObject;
        self.configObject.productCode = self.configObject.productCode+"";
        if (x.taskObject == 'productConfig') {

            if (self.configObject.introLabel.length < 1){
                self.configObject.introLabel.length = 1;
            }
            $('#addShow').show();
            $("#addShow *").attr("disabled",false);
           if (self.configObject.productType == '1') {
                     self.getAllProduct('1');
                    $('#productId').html(self.temporaryObject.productName);
                    $('#productLiLv').html(self.temporaryObject.productRate);

            }
            if (x.productType == '3') {


                self.getAllProduct('3');

                $('#term').html(self.temporaryObject.term);
                $('#termDesc').html(self.temporaryObject.termDesc);
                $('#bankRate').html(self.temporaryObject.productRate);
                $('#bankRateType').html(self.temporaryObject.rateType);
                $('#productName').val(self.temporaryObject.productName);
                self.configObject.productTypeDescribe=self.temporaryObject.productName;
            }
            if (x.productType == '2'){

                $('#rate').html(self.temporaryObject.productRate);
                $('#fundType').html(self.temporaryObject.fundType);
                $('#fundType').val(self.temporaryObject.fundType);
                $('#fundName').val(self.temporaryObject.fundName);
                for (var i = 0; i < self.fundYieldFHBBase.length; i++) {
                    if (self.fundYieldFHBBase[i].label == self.temporaryObject.rateType){
                        $('#rateFund').val(self.fundYieldFHBBase[i].code);
                        self.configObject.rateType=self.fundYieldFHBBase[i].code;

                    }
                }



            }
            $('#bankAddr').html(self.temporaryObject.linkAddr);
            $('#bankAddr').val(self.temporaryObject.linkAddr);





            if (self.temporaryObject.introLabel && self.temporaryObject.introLabel.length >= 1) {
                setTimeout(function () {

                    // $('#int1').val(self.temporaryObject.introLabel[0]);
                    //
                    //
                    // if ($('#int2')) {
                    //     $('#int2').val(self.temporaryObject.introLabel[1]);
                    // }
                    // if ($('#int3')) {
                    //     $('#int3').val(self.temporaryObject.introLabel[2]);
                    // }

                    for (var i = 0; i < self.temporaryObject.introLabel.length; i++) {
                        var index= Number(i)+ Number(1);
                        $('#int'+index).val(self.temporaryObject.introLabel[i]);
                    }


                }, 500)

            }

        }


        if (x.taskObject == 'newsConfig') {
            $('#addNews').show();
            $("#addNews *").attr("disabled",false);
            $('#newsFile2').attr("disabled",true);
        }
        if (x.taskObject == 'customConfig') {
            $('#addCustom').show();
            $("#addCustom *").attr("disabled",false);
            $('#customJumpFile2').attr("disabled",true);
        }
             self.add.fileUrl=x.fileUrl;
        if (x.taskObject == 'singleContent') {
            $('#addSingle').show();
            $("#addSingle *").attr("disabled",false);
            $('#singleFile2').attr("disabled",true);
            self.add.imageUrl=x.fileUrl;
        }
        if (x.taskObject == 'contentCollection') {
            $('#addCollection').show();
            $("#addCollection *").attr("disabled",false);
            $("#configObjectFileType").attr("disabled",true);

        }
        if (x.taskObject == 'pictureConfig') {
            $('#Realtime').show();
            $("#Realtime *").attr("disabled",false);
            $("#customPicture2").val(x.topPicture);
        }
        if (x.taskObject == 'thematicConfig') {
            $('#addThematic').show();
            $("#addThematic *").attr("disabled",false);
        }




        setTimeout(function () {
            $('.mySelect2').select2();
        },500)

    }

    self.commitUpdate = function (type) {
        console.log("self.temporaryObject:",self.temporaryObject);
        console.log("self.rollBack:",self.rollBack);
        var checkParams = self.checkParams(type);
        if (checkParams) {
            return;
        }
        if (self.configObject.productType == '2') {
            self.temporaryObject.fundType = $('#fundType').html();
            self.temporaryObject.fundName = $('#fundName').val();
            self.temporaryObject.linkAddr = $('#bankAddr').val();
            self.temporaryObject.productRate= $('#rate').html();
            if(!self.temporaryObject.productRate){
                alert("利率类型为空不能保存");
                return;
            }
            for (var i = 0; i < self.fundYieldFHBBase.length; i++) {
                if (self.temporaryObject.rateType == self.fundYieldFHBBase[i].code) {
                    self.temporaryObject.rateType = self.fundYieldFHBBase[i].label;
                }
            }
        }
        if (self.configObject.productType == '3') {
            self.temporaryObject.productName = $('#productName').val();
        }
        if(type==4){
            self.temporaryObject.fileUrl=self.add.imageUrl;
        }
        if(type==3){
            self.temporaryObject.linkAddr=$('#newsFile2').val();
        }
        if(type==7){
            self.temporaryObject.fileUrl=self.add.fileUrl;
        }
        if (type ==1){
            self.temporaryObject.serialNoType = self.productInfo.serialNoType;
        }
        if(type==6){
            if(!self.configObject.fileObject||self.configObject.fileObject.length<=0){
                alert("文件必须上传");
                return;
            }
            self.isAfter='0';
        }

        // /////////////

        self.isAdd = '1';
        if (typeof (self.temporaryObject.introLabel) != "undefined" && self.temporaryObject.introLabel.length >= 1){
            for (var i = 0; i < self.temporaryObject.introLabel.length; i++) {
                self.temporaryObject.introLabel[i] = $('#' + "int" + (i + 1)).val();
            }
        }
        self.nowObject = angular.copy(self.temporaryObject);
        self.add.typeList[self.indexOf] = self.nowObject;

        self.temporaryObject = null;
        console.log(self.add.typeList, "类型集合");
        alert("修改成功!");
        if (self.nowObject.taskObject == 'productConfig') {
            $('#addShow').hide();
        }
        if (self.nowObject.taskObject == 'newsConfig') {
            $('#addNews').hide();
        }
        if (self.nowObject.taskObject == 'customConfig') {
            $('#addCustom').hide();
        }
        if (self.nowObject.taskObject == 'singleConfig') {
            $('#addSingle').hide();
        }
        if (self.nowObject.taskObject == 'singleContent') {
            $('#addSingle').hide();
        }
        if (self.nowObject.taskObject == 'contentCollection') {
            $('#addCollection').hide();
        }
        if (self.nowObject.taskObject == 'pictureConfig') {
            $('#Realtime').hide();
        }
        if (self.nowObject.taskObject == 'thematicConfig') {
            $('#addThematic').hide();
        }
    }

    self.onlineOrOfflineTime = function (thisObject) {

        var upTime = $("#upTime").val();
        var downTime = $("#downTime").val();
        if(!upTime||!downTime){
            alert("请先配置整体上下线时间");
            return;
        }
        self.isTimeShow='1';
        self.thisindexOf = self.add.typeList.indexOf(thisObject);
        var typeListElement = self.add.typeList[self.thisindexOf];
        if(typeListElement){
             //如果设置了时间回显 否则回显整体上下线时间
            if(typeListElement.onlineTime&&typeListElement.offlineTime){
                $("#olineTime").val(typeListElement.onlineTime);
                $("#offTime").val(typeListElement.offlineTime);
            }else{
                $("#olineTime").val(upTime);
                $("#offTime").val(downTime);


            }

        }
        $('#addChannelShow').show();
    }

    self.getOnlineOrOffTimeForConfig = function () {
        if (!$('#olineTime').val() || !$('#offTime').val()) {
            alert("请填写上下线时间!");
            return;
        }
        if($('#olineTime').val()>$('#offTime').val()){
            alert("上线时间不能大于下线时间");
            return;
        }
        var upTime = $("#upTime").val();
        var downTime = $("#downTime").val();
        if(upTime&&$('#olineTime').val()<upTime){
            $('#olineTime').val(upTime);
        }

        if(downTime&&$('#offTime').val()>downTime){
            $('#offTime').val(downTime);
        }
        self.add.typeList[self.thisindexOf].onlineTime = $('#olineTime').val();
        self.add.typeList[self.thisindexOf].offlineTime = $('#offTime').val();
        alert("设置成功!");
        console.log(" self.add.typeList[self.thisindexOf]:", self.add.typeList[self.thisindexOf]);
        $('#olineTime').val(null);
        !$('#offTime').val(null);
        $('#addChannelShow').hide();
        console.log(self.add.typeList, "类型集合");

    }

    self.moveList = function (type, object) {
        var indexOf = self.add.typeList.indexOf(object);
        if (type == 'W') {
            if (indexOf == 0) {
                alert("已经是第一个了,还要怎么移?");
                return;
            } else {
                var indexOfOne = self.add.typeList[indexOf - 1];
                var indexTwo = self.add.typeList[indexOf];
                self.add.typeList[indexOf] = indexOfOne;
                self.add.typeList[indexOf - 1] = indexTwo;
            }
        } else {
            if (indexOf == self.add.typeList.length - 1) {
                alert("已经是最后一个了,还要怎么移?");
                return;
            } else {
                var indexOfOne = self.add.typeList[indexOf + 1];
                var indexTwo = self.add.typeList[indexOf];
                self.add.typeList[indexOf] = indexOfOne;
                self.add.typeList[indexOf + 1] = indexTwo;
            }
        }

    }

    self.hideTypeListTime = function () {
        $('#offTime').attr("disabled", false);
        $('#olineTime').attr("disabled", false);
        $('#addChannelShow').hide();
    }
    self.shenpi = function (id) {
        self.shenhe.id = id;
        $('#auditShow').show();
    }

    /**
     * 确认审核
     */
    self.auditConfirm = function () {
        var shenheresult = self.shenheresult;
        if(!shenheresult){
            alert("请选择审核结果");
            return;
        }
        self.shenhe.auditStatus = shenheresult;

        var url = globalConfig.basePath + "/robot_Config/auditConfigStatus";
        $http.post(url, self.shenhe).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功!");
                    $('#auditShow').hide();
                    self.queryRobotConfigList(1);
                } else {
                    alert(data.data.message);
                }
            }
        )

    }

    self.lookForRobotConfigOnlineOrOfflineTime = function (configObject) {
        self.isTimeShow='2';
        console.log("设置时间:",configObject);
        if (!configObject.offlineTime || !configObject.onlineTime) {
            alert("此配置项没有设置上下线时间!");
            return;
        } else {
            $('#addChannelShow').show();
            $('#offTime').val(configObject.offlineTime);
            $('#offTime').attr("disabled", true);
            $('#olineTime').val(configObject.onlineTime);
            $('#olineTime').attr("disabled", true);
        }

    }

    /**
     * 判断是否是json
     * @param str
     * @returns {boolean}
     */
    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }

            } catch (e) {
                console.log('error：' + str + '!!!' + e);
                return false;
            }
        }
        console.log('It is not a string!')
    }


    self.updateRobotConfig = function (configObject) {
        self.isUpdate = '2';
        self.add=angular.copy(configObject);
        self.add.tabId = self.add.tabId+"";
        console.log(self.add, "回显的对象");
        var d=/\.[^\.]+$/.exec(configObject.backGround);
        var image = /\.(gif|jpg|jpeg|png|tiff|pdf)/i;
        if(image.test(d)){
            self.backGround='1';
            self.flagBackGround=1;
        }

        var video = /\.(mp4|avi|rmvb|m4v|mkv|wmv)/i;
        if(video.test(d)){
            self.backGround='2';
            self.flagBackGround=2;
        }
        if(self.add.pageCode!='liCai'&&self.add.pageCode!='life'&&self.add.pageCode!='configPage'&&self.add.pageCode!='launcher'){
            var url = globalConfig.basePath + "/robot_tabConfig/getTabInfo?id=" + self.add.pageCode;
            $.ajax({
                type: "GET",
                url: url,
                async: false,
                cache: false,
                dataType: "json",
                success: function (data) {
                    console.log("获取tabConfig接口返回:", data);
                    if (data.code == '000') {
                        if(data.resp&&data.resp.tabName){
                            self.add.tabName = data.resp.tabName;
                        }
                    } else {
                        console.log("后台接口返回非正常状态:", data);
                    }

                },
                error: function () {
                    console.log("发生错误")
                },
                complete: function () {
                }
            });
        }

        // if (self.add.showType == 1{
        //  $('#tonglan').attr("checked",true);
        // }
        // if (self.add.showType == 2){
        //     $('#zhongtui').attr("checked",true);
        // }
        //
        // if (self.add.showType == 3){
        //     $('#xiaotuijian').attr("checked",true);
        // }
        if (self.add.pageCode) {
            var tabPosition;
            if (self.add.pageCode == 'liCai' && self.add.positionNo == '5') {
                tabPosition = 'LI_CAI_RECOMMAND'
            }

            if (self.add.pageCode == 'life' && self.add.positionNo == '5') {
                tabPosition = 'LIFE_RECOMMAND';
            }

            if ( self.add.positionNo == '6') {
                tabPosition = 'CONTENT_RECOMMAND';
            }

            var url = globalConfig.basePath + "/robot_tabConfig/getTabByPositionNo?positionNo=" + tabPosition;
            $http.get(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        console.log(data, "此位置的所有tab");

                        self.tabList = data.data.resp;
                    } else {
                        alert(data.data.message);

                    }
                }
            )
        }
        if (self.add.typeList) {
            if (isJSON(self.add.typeList)) {
                self.add.typeList = JSON.parse(self.add.typeList);
            }

        }
        if (!isNaN(self.add.audienceUser)) {
            self.add.audienceUser = self.add.audienceUser+"";
        }
        if (self.add.showType == '1') {
            $("#tonglan").prop("checked", true);
        } else if (self.add.showType == '2') {
            $("#zhongtui").prop("checked", true);
        } else {
            $("#xiaotuijian").prop("checked", true);
        }
        if (self.add.audienceUser) {
            self.add.audienceUser = self.add.audienceUser.toString();
        }

        self.viewPage = 'two';

        if (self.add.welcomeText != "null" && self.add.welcomeText) {

            if (isJSON(self.add.welcomeText)) {
                self.add.welcomeText = JSON.parse(self.add.welcomeText);
            }

            setTimeout(function () {
                $('#wel1').val(self.add.welcomeText[0]);
                $('#wel2').val(self.add.welcomeText[1]);
                $('#wel3').val(self.add.welcomeText[2]);
            }, 500)


        }

        if (self.add.rosterType != 'NO_RULE' && !self.strChannelGroups) {
            $.ajax({
                type: 'POST',
                url:  globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=WK" + "&rosterType=" + self.add.rosterType,
                async: false,
                dataType: "json",
                success: function (data) {
                    console.log("data:",data);
                    if (data.code == '000') {
                        self.strChannelGroups = data.resp;

                    } else {
                        alert(data.message);
                    }

                }

            });
        }
        setTimeout(function () {
            $('.mySelect').select2();
        },2000)
        if (self.add.rosterId) {
            self.add.rosterId = self.add.rosterId.toString();
            $("#memberId").val(self.add.rosterId);
        }

    }

    self.updateCommit = function () {
        var checkConfionInfo = self.checkConfionInfo();
        if(checkConfionInfo){
            return;
        }
        console.log("self.add:",self.add);
        self.add.auditStatus = 1;
        if (self.add.typeList&&self.add.typeList.length >= 1) {
            var list = self.add.typeList;
            self.add.typeList = JSON.stringify(self.add.typeList);
        }else{
            self.add.typeList=null;
        }
        var rosterId = $('#memberId').val();
        if ( rosterId&& !isNaN(rosterId)) {
            self.add.rosterId = rosterId;
        } else {
            self.add.rosterId = null;
        }
        self.add.showType = $('input[name="showType"]:checked').val();

        if (self.add.positionNo == '1' || self.add.positionNo == '2') {
            self.add.rosterId = null;
        }
        if (self.add.welcomeText && self.add.welcomeText.length >= 1) {
            self.add.welcomeText = JSON.stringify(self.add.welcomeText);
        }else{
            self.add.welcomeText=null;
        }
        console.log(self.add, "要修改的对象");
        var url = globalConfig.basePath + "/robot_Config/update";
        console.log(" self.add:", self.add);
        $http.post(url, self.add).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("修改成功!");
                    self.viewPage = 'one';
                    self.isUpdate == '1';
                    self.add.rosterType = 'NO_RULE';
                    self.add.welcomeText = [];
                    self.add = {};
                    self.configObject = {};
                    //更新首页列表数据
                    self.queryRobotConfigList();
                } else {
                    alert(data.data.message);
                    self.add.typeList = list;
                }

            }
        )



    }

    self.fileManage = function () {
        if(self.isShow=='1'){
            $("#fileManage *").attr("disabled",true);
            $(".headleLooks").hide();
            $("#fileHide").hide();
            $("#fileManageEnt").text("关闭")
        }else{
            $("#fileManage *").attr("disabled",false);
            $(".headleLooks").show();
            $("#fileHide").show();
            $("#fileManageEnt").text("确定")
        }

        if(!self.configObject.fileType){
            alert("请选择文件类型");
            return;
        }
        if(!self.configObject.allPeriods||self.configObject.allPeriods>999){
            alert("不能超过999期--期数为空");
            return;
        }
        self.file = {};
        self.filePeriods = [];
        for (var i = 1; i <= Number(self.configObject.allPeriods); i++) {
            self.filePeriods.push(i);
        }
        $('#fileManage').show();
    }
    //合集内容
    self.fileManangeUpload = function () {
        //获取选择的期数
        var periodsValue = $('#periods').val();
        if(!periodsValue){
            alert("请选择期数");
            return;
        }

        if(self.configObject.fileType==2){
            self.videoUrl = $("#manageFile").val();
            self.fileTime = $("#fileTime").val();
            self.fileName = $("#fileName").val();
            if(self.videoUrl){
               if(!self.fileName){
                   alert("文件名称不能为空");
                   return;
               }

                if(!self.fileTime){
                    alert("文件时常不能为空");
                    return;
                }

                //文件名字
                self.file.fileName = self.fileName;
                self.file.fileUrl = self.videoUrl;
                self.file.fileTime = self.fileTime;
                self.file.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                self.file.periods = periodsValue;
                var file = angular.copy(self.file);
                //缺少文件名
                alert("上传成功");
                //上传后放入config的集合;
                var flag=true;
                for (var i = 0; i <self.configObject.fileObject.length ; i++) {
                    var lengthElement = self.configObject.fileObject[i];
                    if(file.periods==lengthElement.periods){
                        //说明是覆盖往期上传直接替换
                        self.configObject.fileObject[i]=file;
                        self.addHotfileObject[i]=file;
                        flag=false;
                    }

                }
                if(flag){
                    self.configObject.fileObject.push(file);
                    self.addHotfileObject.push(file);
                }
                console.log("合集批量添加后的文件", self.addHotfileObject);
                console.log(self.configObject.fileObject, "文件合集对象");
                $scope.$apply();
                $('#fileManage').hide();
                self.fileManage();
                self.file = {};
                return;
            }


        }

        $('#fileManange').click();
        $('#fileManange').fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath + "/api/file/upload?fileType=" + self.getUrl(self.configObject.fileType),//上传地址
            dataType: 'json',
            acceptFileTypes: self.getCode(self.configObject.fileType),
            maxFileSize: self.getSize(self.configObject.fileType),
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;
                }
                //文件名字
                self.file.fileName = data.files[0].name;
                self.file.fileUrl = data.result.resp.url;
                self.file.fileTime = data.result.resp.fileTime
                self.file.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                self.file.periods = periodsValue;
                var file = angular.copy(self.file);
                //缺少文件名
                alert("上传成功");
                //上传后放入config的集合;
                 var flag=true;
                for (var i = 0; i <self.configObject.fileObject.length ; i++) {
                    var lengthElement = self.configObject.fileObject[i];
                    if(file.periods==lengthElement.periods){
                        //说明是覆盖往期上传直接替换
                        self.configObject.fileObject[i]=file;
                        self.addHotfileObject[i]=file;
                        flag=false;
                    }

                }
                  if(flag){
                      self.configObject.fileObject.push(file);
                      self.addHotfileObject.push(file);
                  }
             console.log("合集批量添加后的文件", self.addHotfileObject);
                console.log(self.configObject.fileObject, "文件合集对象");
                $scope.$apply();
                $('#fileManage').hide();
                self.fileManage();
                self.file = {};

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传文件失败：文件格式错误");
                    console.log("上传失败：文件格式错误")
                    data.files.error=null;
                    return ;
                }
            }
        });

    }

    self.deleteFromCollectionManage = function (x) {
        var indexOf = self.configObject.fileObject.indexOf(x);
        self.configObject.fileObject.splice(indexOf, 1);

        var indexOf = self.addHotfileObject.indexOf(x);
        self.addHotfileObject.splice(indexOf, 1);
        //self.addHotfileObject= angular.copy(self.configObject.fileObject);

    }

    self.topicUpload = function () {
        if(self.isShow=='1'){
            //查看回显
        $("#topicManage *").attr("disabled",true);
            $(".headleLooks").hide();
            $("#topicManageHide").hide();
            $("#topicManageEnt").text("关闭");
        }else{
            $("#topicManage *").attr("disabled",false);
            $(".headleLooks").show()
            $("#topicManageHide").show()
            $("#topicManageEnt").text("确定");
        }
       if(self.isAdd=='1'){
           //新增

           if(self.isAfter=="1"){
               self.configObject.fileObject = [];
               self.file = {};
           }
       }else {
           //修改
           if(self.temporaryObject&&self.temporaryObject.fileObject){
               self.configObject.fileObject =self.temporaryObject.fileObject;
           }
       }


        $('#topicManage').show();
    }
    self.topicManangeUploade = function () {

           var fileType = $("#fileType").val();
        if (!fileType) {
            alert("请选择文件类型")
            return;
        }
        $('#topicManange').click();
        $('#topicManange').fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath + "/api/file/upload?fileType=" + self.getUrl(fileType),//上传地址
            dataType: 'json',
            acceptFileTypes: self.getCode(fileType),
            maxFileSize: self.getSize(fileType),
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log("后台上传接口返回", data);
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;

                }
                var fileUrl = data.result.resp.url;
                //文件名字
                self.file.fileName = data.files[0].name;
                self.file.fileUrl = fileUrl;
                self.file.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                self.file.fileTime = data.result.resp.fileTime
                self.file.fileType=fileType;
                //上传后放入config的集合;
                self.configObject.fileObject.push(self.file);
                self.addHotfileObject.push(self.file);
                $scope.$apply();
                self.file = {};
                alert("上传成功");

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传失败：文件格式错误");
                    console.log("上传失败：文件格式错误")
                    data.files.error=null;
                    return;
                }
            }
        });
    }


    self.addHot = function (hotConfig) {
        self.configHotObject.hotFileObject=[];
        self.fileType = hotConfig.fileType;
        self.titleName=hotConfig.titleName;
        $("input[name='fileFlag']").prop("checked",false);
        self.addHotfileObject=hotConfig.fileObject;
        if(hotConfig.fileUrl&&hotConfig.taskObject=='singleContent'){
            self.file.fileName=hotConfig.fileName;
            self.file.fileUrl=hotConfig.fileUrl;
            self.file.updateTime=hotConfig.updateTime;
            self.file.fileTime=hotConfig.fileTime;
            self.file.periods='--';
            self.file.conver=hotConfig.cover;
            self.addHotfileObject=[];
            self.addHotfileObject.push(self.file);

        }
        if (hotConfig.taskObject=='thematicConfig'){
            self.contentIntro = hotConfig.contentIntro;
        }
        self.cover=hotConfig.cover;
        self.projectType = hotConfig.projectType;
        console.log(hotConfig, "hotConfig内容");
        console.log("self.addHotfileObject:",self.addHotfileObject);
        $('#addHot').show();

    }


    $('#customPicture').fileupload({
        autoUpload: true,//是否自动上传
        url: globalConfig.basePath + "/api/file/upload?fileType=img",//上传地址
        dataType: 'json',
        acceptFileTypes: self.getCode('4'),
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {//设置文件上传完毕事件的回调函数
            console.log(data, "返回上传图片");
            if (data.result.code != '000') {
                alert("上传失败:" + data.result.message);
                return;
            }
            var fileUrl = data.result.resp.url;
            //文件名字
            self.configObject.topPicture=fileUrl;
            self.configObject.updateTime=new Date().format("yyyy-MM-dd hh:mm:ss");
            if (self.add.positionNo == 4){
                $('#customPicture2').prop("value", fileUrl);
            }else {
                $('#customPicture3').prop("value", fileUrl);
            }
            alert("上传成功");
        }
    }).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                alert("上传失败：文件格式错误");
                data.files.error=null;
                return;
            }
        }
    });
    //合集封面图片上传
    $('#collectionCover').fileupload({
        autoUpload: true,//是否自动上传
        url: globalConfig.basePath + "/api/file/upload?fileType=img",//上传地址
        dataType: 'json',
        acceptFileTypes: self.getCode('4'),
        maxFileSize: 1 * 1024 * 1024 * 30,
        done: function (e, data) {
            //设置文件上传完毕事件的回调函数
            if (data.result.code != '000') {
                alert("上传失败:" + data.result.message);
                return;
            }
            var fileUrl = data.result.resp.url;
            self.configObject.cover = fileUrl;
            $('#collectionCover2').prop("value", fileUrl);
            alert("上传成功");

        }
    }).on('fileuploadprocessalways', function (e, data) {
        if (data.files.error) {
            if (data.files[0].error == 'File type not allowed') {
                alert("上传失败：文件格式错误");
                console.log("上传失败：文件格式错误")
                data.files.error=null;
                return;
            }
        }
    });

    self.addPictureLabel=function(){
        //合集标签上传
        $('#addPicture').click();
        $('#addPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath + "/api/file/upload?fileType=img",//上传地址
            dataType: 'json',
            acceptFileTypes: self.getCode('4'),
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;
                }
                var fileUrl = data.result.resp.url;
                //文件名字
                self.configObject.label = fileUrl;
                $('#collectionTitle2').prop("value", fileUrl);
                alert("上传成功");

            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传失败：文件格式错误");
                    console.log("上传失败：文件格式错误")
                    data.files.error=null;
                    return;
                }
            }
        });

    }



    //内容单片 封面/标签/文件上传
    self.fileUploads = function (type, id1, id2, isFileObject,title) {
        //校验是否选择了文件类型
        if (type == '10') {
            if (!self.configObject.fileType) {
                alert("请选择文件类型")
                return;
            }
        }
        $(id1).click();
        $(id1).fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath + "/api/file/upload?fileType=" + self.getUrl(type == '10' ? self.configObject.fileType : type),//上传地址
            dataType: 'json',
            acceptFileTypes: self.getCode(type == '10' ? self.configObject.fileType : type),
            maxFileSize: self.getSize(type == '10' ? self.configObject.fileType : type),
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log("上传接口返回", data);
                console.log(self.configObject.fileObject, "文件对象");
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;
                }
                var fileUrl = data.result.resp.url;
                var fileName = data.files[0].name;
                var fileTime = data.result.resp.fileTime;
                var updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                $(id2).val(fileUrl).trigger('change');
                $(id2).val(fileUrl).trigger('input');
                $(id2).prop("src", fileUrl);
                console.log(self.configObject, "文件对象");
                if(isFileObject==1){
                    //添加fileObject对象
                    self.file.fileName =fileName;
                    self.file.fileUrl = fileUrl;
                    self.file.fileTime =fileTime;
                    self.file.updateTime = updateTime;
                if(self.configObject.fileObject!=null){
                    self.configObject.fileObject.push(self.file);
                }else{
                    self.configObject.fileObject=[];
                    self.configObject.fileObject.push(self.file);
                }

                    self.addHotfileObject = [];
                    //添加到回显数组中
                    self.addHotfileObject.push(self.file)
                    self.file = {};

                }else if(isFileObject==2){
                    self.configObject.fileTime=fileTime;
                    //不添加fileObjectd对象
                    if(title=='封面'){
                        self.configObject.cover=fileUrl;
                        self.configObject.fileTime=null;
                    }else if(title=="标签"){
                        self.configObject.label=fileUrl;
                        self.configObject.fileTime=null;
                    }else if(title=="文件"){
                        self.configObject.fileUrl=fileUrl;
                        self.add.imageUrl=fileUrl;
                    }else if(title=="背景"){
                        self.configObject.backGround=fileUrl;
                        self.configObject.fileTime=null;
                    }
                    //如果是内容单片上传文件 设置时间和文件名称用于回显
                    if(id1=='#singleFile'){
                        self.configObject.updateTime=updateTime;
                        self.configObject.fileName=fileName;

                    }

                }
                alert("上传成功");
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传失败：文件格式错误");
                    console.log("上传失败：文件格式错误")
                    data.files.error=null;
                    return;
                }
            }
        });
    }

    //自定义推荐配置 图片/背景/文件上传
    self.customJumpFileUploads = function (type, id1, id2,title) {
        //校验是否选择了文件类型
        if (type == '10') {
            if (!self.configObject.jumpType) {
                alert("请选择文件类型")
                return;
            }
        }
        $(id1).click();
        $(id1).fileupload({
            autoUpload: true,//是否自动上传
            url: globalConfig.basePath + "/api/file/upload?fileType=" + self.getUrl(type == '10' ? self.configObject.jumpType : type),//上传地址
            dataType: 'json',
            acceptFileTypes: self.getCode(type == '10' ? self.configObject.jumpType : type),
            maxFileSize: self.getSize(type == '10' ? self.configObject.jumpType : type),
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log("上传接口返回", data);
                if (data.result.code != '000') {
                    alert("上传失败:" + data.result.message);
                    return;
                }
                $(id2).prop("value", data.result.resp.url);
                $(id2).prop("src", data.result.resp.url);

                // //文件名字
                var fileName = data.files[0].name;
                var fileUrl = data.result.resp.url;
                var fileTime = data.result.resp.fileTime;
                var updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                if(title=='封面'){
                    self.configObject.cover=fileUrl;
                }else if(title=="标签"){
                    self.configObject.label=fileUrl;
                }else if(title=="文件"){
                    self.configObject.fileUrl=fileUrl;
                    self.add.imageUrl=fileUrl;
                }else if(title=="背景"){
                    self.configObject.backGround=fileUrl;

                }else if(title=='图片'){
                    self.configObject.pictureUrl=fileUrl;
                }else if(title=='自定义文件'){
                    self.configObject.linkAddr=fileUrl;
                }


                alert("上传成功");
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传失败：文件格式错误");
                    console.log("上传失败：文件格式错误")
                    data.files.error=null;
                    return;
                }
            }
        });
    }
    //热门管理添加人们
    self.hotFileManage = function () {

        if (!self.configHotObject.hotFileObject || self.configHotObject.hotFileObject.length == 0) {
            alert("请选择文件");
            return;
        }

        if (!self.hotPage) {
            alert("请选择页面类型");
            return;
        }

        //添加选中的热门文件到tab—config表中
        var url = globalConfig.basePath + "/robot_tabConfig/addHotFile";

        self.configHotObject.tabId = self.hotPage;
        self.configHotObject.projectType = self.projectType;
        self.configObject.hotFileObject = JSON.stringify(self.configObject.hotFileObject);

        $http.post(url, self.configHotObject).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("添加成功")
                } else {
                    alert(data.data.message);
                }
            }
        )

        // self.configHotObject.hotFileObject=[]
        self.addHotfileObject = [];

        $('#addHot').hide();

    }

    //热门管理添加wenj
    self.addHots = function (flag, x,$index) {
        console.log("x:", x);
        console.log("fileType", self.fileType);
        console.log("self.projectType：", self.projectType);

        if (self.hotPage == null || self.hotPage == '' || self.hotPage == 'undefined') {
            alert("请选择页面");
            return;
        }

        if(flag){

            $.ajax({
                type: 'GET',
                url:  globalConfig.basePath + "/robot_Config/getHotListByTabId?tabId=" + self.hotPage,
                async: false,
                dataType: "json",
                success: function (data) {
                    console.log("data:",data);
                    if (data.code == '000') {
                        if(data.resp){
                            $scope.hotSortList= JSON.parse(data.resp);
                        }


                    } else {
                        alert(data.message);
                    }

                }

            });


            if($scope.hotSortList&&$scope.hotSortList.length>0){
                for (var i = 0; i < $scope.hotSortList.length; i++) {
                    var element = $scope.hotSortList[i];
                    if(element.singleContent){
                        if(element.singleContent.fileName==x.fileName){
                            alert("此文件已经存在:"+x.fileName);
                            $("#hotFile"+$index).prop("checked",false);
                            return;
                        }

                    }
                    if(element.contentCollection){
                        if(element.contentCollection.fileObject.fileName==x.fileName){
                            alert("此文件已经存在:"+x.fileName);
                            $("#hotFile"+$index).prop("checked",false);
                            return;
                        }

                    }
                    if(element.thematicConfig){
                        if(element.thematicConfig.fileObject.fileName==x.fileName){
                            alert("此文件已经存在:"+x.fileName);
                            $("#hotFile"+$index).prop("checked",false);
                            return;
                        }

                    }

                }
            }

            if(self.configHotObject.hotFileObject&&self.configHotObject.hotFileObject.length>0){
                for (var i = 0; i < self.configHotObject.hotFileObject.length; i++) {
                    var element = JSON.parse(self.configHotObject.hotFileObject[i]);
                    if(element.singleContent){
                        if(element.singleContent.fileName==x.fileName){
                            alert("此文件已经存在:"+x.fileName);
                            $("#hotFile"+$index).prop("checked",false);
                            return;
                        }

                    }
                    if(element.contentCollection){
                        if(element.contentCollection.fileObject.fileName==x.fileName){
                            alert("此文件已经存在:"+x.fileName);
                            $("#hotFile"+$index).prop("checked",false);
                            return;
                        }

                    }
                    if(element.thematicConfig){
                        if(element.thematicConfig.fileObject.fileName==x.fileName){
                            alert("此文件已经存在:"+x.fileName);
                            $("#hotFile"+$index).prop("checked",false);
                            return;
                        }

                    }

                }
            }
        }


        if (self.projectType == 1) {
            //内容合集
            self.HotConfig = {};
            self.HotConfig.contentCollection = {};
            self.HotConfig.contentCollection.fileObject = {};
            self.HotConfig.contentCollection.fileObject.fileTime = x.fileTime;
            self.HotConfig.contentCollection.fileObject.fileUrl = x.fileUrl;
            self.HotConfig.contentCollection.fileObject.fileName = x.fileName;
            self.HotConfig.contentCollection.fileObject.periods = x.periods;
            self.HotConfig.contentCollection.fileType = self.fileType;
            self.HotConfig.contentCollection.id = "";
            self.HotConfig.contentCollection.conver = self.cover;
            self.HotConfig.contentCollection.titleName = self.titleName;
            var jsonFileInfo = JSON.stringify(self.HotConfig);
            var number = self.configHotObject.hotFileObject.indexOf(jsonFileInfo);
            if (flag) {
                if (number <= -1) {
                  self.configHotObject.hotFileObject.push(jsonFileInfo);
                }

            } else {
                if (number > -1) {
                    self.configHotObject.hotFileObject.splice(number, 1);
                }


            }

        } else if (self.projectType == 2) {
            //内容单片
            self.HotConfig = {};
            self.HotConfig.singleContent = {};
            self.HotConfig.singleContent.fileType = self.fileType;
            self.HotConfig.singleContent.fileTime = x.fileTime;
            self.HotConfig.singleContent.fileUrl = x.fileUrl;
            self.HotConfig.singleContent.id = "";
            self.HotConfig.singleContent.fileName = x.fileName;
            self.HotConfig.singleContent.titleName = self.titleName;
            self.HotConfig.singleContent.cover = self.cover;
            var jsonFileInfo = JSON.stringify(self.HotConfig);
            var number = self.configHotObject.hotFileObject.indexOf(jsonFileInfo);
            if (flag) {
                if (number <= -1) {

                    var indexOf = self.configHotObject.hotFileObject.indexOf(jsonFileInfo);
                    if(indexOf>-1){
                        alert("此文件已经存在");
                        return;
                    }


                        self.configHotObject.hotFileObject.push(jsonFileInfo);
                }


            } else {
                if (number > -1) {
                    self.configHotObject.hotFileObject.splice(number, 1);
                }


            }
        } else if (self.projectType == 3) {
            //专题

            self.HotConfig = {};
            self.HotConfig.thematicConfig = {};
            self.HotConfig.thematicConfig.fileObject = {};
            self.HotConfig.thematicConfig.fileObject.fileTime = x.fileTime;
            self.HotConfig.thematicConfig.fileObject.fileUrl = x.fileUrl;
            self.HotConfig.thematicConfig.fileObject.fileName = x.fileName;
            self.HotConfig.thematicConfig.fileObject.fileType = x.fileType;
            self.HotConfig.thematicConfig.id = "";
            self.HotConfig.thematicConfig.cover = self.cover;
            self.HotConfig.thematicConfig.contentIntro = self.contentIntro;
            console.log(" self.fileType:", self.fileType)
            self.HotConfig.thematicConfig.titleName = self.titleName;
            var jsonFileInfo = JSON.stringify(self.HotConfig);

            var number = self.configHotObject.hotFileObject.indexOf(jsonFileInfo);
            if (flag) {
                if (number <= -1) {
                    self.configHotObject.hotFileObject.push(jsonFileInfo);
                }


            } else {
                if (number > -1) {
                    self.configHotObject.hotFileObject.splice(number, 1);
                }


            }


        }

        console.log("self.configHotObject.hotFileObject:", self.configHotObject.hotFileObject);


    }

    self.addHotFileClose = function () {
        $('#addHot').hide();
    }

    self.searchContentTab = function () {
        var tabId = $("#searchContentTab").val();
        if (tabId == null || tabId == '' || tabId == 'undefined') {
            alert("请选择页面");
            return;
        }
        var url = globalConfig.basePath + "/robot_Config/getHotListByTabId?tabId=" + tabId;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    if(!data.data.resp){
                        $scope.hotSortList="";
                        return;
                    }
                    var list = JSON.parse(data.data.resp);
                    console.log("list,", list)
                    for (var i = 0; i < list.length; i++) {
                        list[i].sort = i + 1;
                        console.info("list[i]:", list[i]);
                    }
                    $scope.hotSortList = list;
                    self.hotSortListRollBack=angular.copy(list);
                    console.log("$scope.hotSortList:", $scope.hotSortList);
                }
            }
        )


    }

    /**
     * 热门优先级上移下移
     * @param type
     */
    $scope.hotMove = function (type) {
        if ($("input[class='hotMoveCheckbox']:checked").length <=0) {
            alert("请选择一个进行移动");
            return;
        }
        var length = $scope.hotSortList.length;
        $('.hotMoveCheckbox').each(function () {
            if (this.checked == true) {
                if (type == 'S') {//上移
                    var me = $(this).val() - 1;
                    if (me == 0) {
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 = $scope.hotSortList[me];//当前选中的
                    var move1 = $scope.hotSortList[me - 1];//上一个
                    $scope.hotSortList[me - 1] = move0;//self.strotList[me];//当前选中的上移一个
                    $scope.hotSortList[me] = move1;// 当前选中的
                    $scope.hotSortList[me - 1].sort = Number($(this).val()) - Number(1);
                    $scope.hotSortList[me].sort = Number($(this).val());
                } else if (type == 'X') {// 下移
                    var me = $(this).val() - 1;
                    if (me == length - 1) {
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = $scope.hotSortList[me];// 下一个banner
                    move0.sort = Number($(this).val()) + Number(1);
                    var move1 = $scope.hotSortList[me + 1];// 下一个banner
                    move1.sort = Number($(this).val());
                    $scope.hotSortList[me + 1] = move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    $scope.hotSortList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }

    /**
     * 热门管理确定排序
     */
    $scope.hotMoveCommit = function () {
        if (confirm('确定要更改吗?')) {
            var tabId = $('#searchContentTab').val();
            if(!tabId){
                alert("请选择热门页面");
                return;
            }
            self.configObject.tabId = tabId;
            self.configObject.hotFileObject = $scope.hotSortList;
            console.log("````````", self.configObject);
            var url = globalConfig.basePath + "/robot_Config/updateTabHotList";
            $http.post(url, self.configObject).then(
                function (data) {
                    console.log(data);
                    alert(data.data.message);
                    var list = JSON.parse(data.data.resp);
                    $scope.hotSortList = list;
                }, function (response) {
                    alert("请求失败了....");
                }
            );
            // $("#searchContentTab").prop("value","");
            $("#hotPriority").hide();
        }

    }
    //热门管理删除按钮
    self.deleteHot = function (hotFile) {
        var indexOf = $scope.hotSortList.indexOf(hotFile);
        if (indexOf > -1) {
            $scope.hotSortList.splice(indexOf, 1);
        }
        console.log("删除后的$scope.hotSortList:", $scope.hotSortList);

    }

    self.checkParams = function (type) {

        if (type == 4) {
            //内容单片校验
            if (!self.configObject.titleName) {
                alert("请输入标题名称");
                return true;
            }

            if (!$("#singleCover2").val()) {
                alert("封面必上传");
                return true;
            }

            // if (!$("#singleTitle2").val()) {
            //     alert("标签必上传");
            //     return true;
            // }
            if (!self.configObject.fileType) {
                alert("文件类型必选");
                return true;
            }
            if (!$("#singleFile2").val()) {
                alert("文件必上传");
                return true;
            }

            if (!self.configObject.contentIntro) {
                alert("内容简介不能为空");
                return true;
            }

        } else if (type == 5) {
            //内容合集校验
            if (!self.configObject.titleName) {
                alert("请输入标题名称");
                return true;
            }

            if (!$("#collectionCover2").val()) {
                alert("封面必上传");
                return true;
            }

            // if (!$("#collectionTitle2").val()) {
            //     alert("标签必上传");
            //     return true;
            // }
            if (!self.configObject.fileType) {
                alert("文件类型必选");
                return true;
            }
            // if (!$("#singleFile2").val()) {
            //     alert("文件必上传");
            //     return true;
            // }
            if(self.configObject.fileObject==null||self.configObject.fileObject.length==0){
                alert("文件必上传");
                return true;
            }

            if (!self.configObject.contentIntro) {
                alert("内容简介不能为空");
                return true;
            }
        } else if (type == 3) {
            if (!self.configObject.recommandName) {
                alert("推荐名不能为空");
                return true;
            }
            if (!self.configObject.label) {
                alert("标签不能为空");
                return true;
            }
            if (!self.configObject.content) {
                alert("内容不能为空");
                return true;
            }

            // if (!$("#newsCover2").val()) {
            //     alert("背景不能为空");
            //     return true;
            // }

            if (!self.configObject.jumpType) {
                alert("跳转类型必选");
                return true;
            }
            if (self.configObject.jumpType == '4' &&!self.configObject.linkAddr) {
                alert("链接地址不能为空");
                return true;
            }


            if (self.configObject.jumpType != '4' && !$("#newsFile2").val()) {
                alert("文件必上传");
                return true;
            }

        } else if (type == 1) {
            //产品配置

            if (!self.configObject.recommandName) {
                alert("推荐名不能为空");
                return true;
            }
            if (!self.configObject.lightText) {
                alert("亮点文案不能为空");
                return true;
            }




            // if (!$("#fileUrl1").val()) {
            //     alert("背景必上传");
            //     return true;
            // }

            if (!self.configObject.productType) {
                alert("产品类型必选");
                return true;
            }


            if (self.configObject.productType != '2' && !self.configObject.productCode) {
                alert("请选择产品");
                return true;
            }
            if (self.configObject.productType != '2' && !self.configObject.productCode) {
                alert("请选择产品");
                return true;
            }
            if (self.configObject.productType == '2' && !self.configObject.productCode) {
                alert("请选择产品");
                return true;
            }


            //产品名称校验
            if(self.configObject.productType == '3'&&!$("#productName").val()){
                alert("产品名称不能为空");
                return true;
            }
            //产品名称校验
            if(self.configObject.productType == '1'&&!$("#productId").text()){
                alert("产品名称不能为空");
                return true;

            }
            if (self.configObject.productType == '2' && !$("#fundType").html()) {
                alert("基金类型不能为空");
                return true;
            }
            if (self.configObject.productType == '2' && !$('#fundName').val()) {
                alert("基金名称不能为空");
                return true;
            }
            if (self.configObject.productType == '2' && !self.configObject.rateType) {
                alert("基金利率不能为空");
                return true;
            }

            if (!$("#bankAddr").val()) {
                alert("链接地址不能为空");
                return true;
            }
            //////


        } else if (type == 2) {
            //图片配置

            if (!self.configObject.recommandName) {
                alert("推荐名称不能为空");
                return true;
            }
            if (self.add.positionNo == 4){
                if (!$("#customPicture2").val()) {
                    alert("图片必上传");
                    return true;
                }
            }else {
                if (!$("#customPicture3").val()) {
                    alert("图片必上传");
                    return true;
                }
            }



            delete self.configObject.productCode;
        } else if (type == 6) {
            //添加专题内容配置校验
            if (!self.configObject.titleName) {
                alert("请输入标题名称");
                return true;
            }

            if (!$("#thematicCover2").val()) {
                alert("封面必上传");
                return true;
            }

            // if (!$("#thematicTitle2").val()) {
            //     alert("标签必上传");
            //     return true;
            // }

            if (!self.configObject.contentIntro) {
                alert("内容简介不能为空");
                return true;
            }


        } else if (type == 7) {
            //添加自定义配置参数校验
            if (!self.configObject.recommandName) {
                alert("推荐名不能为空");
                return true;
            }
            if (!self.configObject.title) {
                alert("标题不能为空");
                return true;
            }

            if(!self.configObject.content){
                alert("内容不能为空");
                return true;
            }


            if(!$("#customfile").val()){
                alert("图片必上传");
                return true;
            }
            // if(!$("#customBfile").val()){
            //     alert("背景必上传");
            //     return true;
            // }
            if(!self.configObject.buttonText){
                alert("按钮文案不能为空");
                return true;
            }
            if(!self.configObject.jumpType){
                alert("跳转类型不能为空");
                return true;
            }

            if (self.configObject.jumpType == '4' &&!self.configObject.linkAddr) {
                alert("链接地址不能为空");
                return true;
            }
            if(self.configObject.jumpType!='4'&&!self.configObject.linkAddr){
                alert("文件必上传");
                return true;
            }

        }

    }


    self.checkConfionInfo = function () {
            self.add.backGround = $('#fileUrl').val();
            self.add.onlineTime = $('#upTime').val();
            self.add.offlineTime = $('#downTime').val();
            if (!self.add.configName) {
                alert("请填写名称");
                return true;
            }
        if((self.add.pageCode == 'liCai' &&self.add.positionNo == '5') || (self.add.pageCode == 'life' && self.add.positionNo == '5') || self.add.positionNo == '6'){
            if(!self.add.tabId){
                alert("推荐名称必选");
                return true;
            }
        }

            //校验展示样式是否选择
            if(self.add.positionNo != '1' && self.add.positionNo != '2'){
                var list= $('input:radio[name="showType"]:checked').val();

                if(list==null){
                    alert("请选择展示样式!");
                    return true;
                }
            }

            if (!self.add.backGround) {
                alert("背景底图不能为空");
                return true;
            }
            //欢迎文案
            if (self.add.positionNo == '1') {
                if (self.add.welcomeText == null || self.add.welcomeText.length == 0) {
                    alert("欢迎文案不能为空");
                    return true;
                }
                if (self.add.welcomeText.length >=1) {
                    for (var i = 0; i < self.add.welcomeText.length; i++) {
                        var value = $('#' + "wel" + (i + 1)).val();
                        if(!value){
                            alert("请输入欢迎文案");
                            return true;
                        }
                        self.add.welcomeText[i] =value;
                    }
                } else {
                    self.add.welcomeText = null;
                }
            }
            //新建类型校验
            if(self.add.positionNo != '1' && self.add.positionNo != '2'){
                if(self.add.typeList&& self.add.typeList.length>0){

                    for (var i = 0; i <self.add.typeList.length ; i++) {
                        var onlineTime = self.add.typeList[i].onlineTime;
                        var offlineTime = self.add.typeList[i].offlineTime;
                        var recommandName = self.add.typeList[i].recommandName;
                        var titleName = self.add.typeList[i].titleName;

                        if(!onlineTime||!offlineTime){
                            alert("推荐名称为:"+(titleName?titleName:recommandName)+":配置项上下线时间不能为空");
                            return true;
                        }
                        if(self.add.onlineTime>onlineTime){

                            self.add.typeList[i].onlineTime=self.add.onlineTime;

                        }

                        if(self.add.offlineTime<offlineTime){
                            self.add.typeList[i].offlineTime=self.add.offlineTime;
                        }
                    }
                }else {

                    alert("新建类型必填");
                    return true;
                }


            }
        if (!self.add.onlineTime || !self.add.offlineTime) {
            alert("请填写上线或者下线时间");
            return true;
        }
        if (self.add.onlineTime > self.add.offlineTime) {
            alert("上线时间不能大于下线时间");
            return true;
        }
            //受众用户校验
            if(self.add.positionNo !='1' && self.add.positionNo !='2'){

                if(!self.add.audienceUser){
                    alert("受众用户必选");
                    return true;
                }
            }
            //名单类型校验
            if(self.add.audienceUser == '1' || self.add.audienceUser == '2'){
                if(!self.add.rosterType){
                    alert("名单类型必选");
                    return true;
                }
            }
            //用户分组校验
            if(self.add.rosterType !='NO_RULE' && self.add.audienceUser !='0' && (self.add.audienceUser == '1' || self.add.audienceUser == '2')){
                if(!$("#memberId").val()){
                    alert("用户分组必选");
                    return true;
                }
            }

            //审核人校验
            if(!self.add.auditor){
                alert("审核人必选");
                return true;
            }





    }
    //重置按钮
    self.reset2=function () {

        self.search.pageCode=null;
        self.search.status=null;
        self.search.positionNo=null;
        self.search.valid=null;
        self.search.resourceType=null;
        self.search.auditStatus=null;

    }

    self.queryTypeInfo = function (x) {
        //+和-产品介绍品显示和隐藏  1:展示  2：隐藏
        self.isProductLabel='2';
        self.isShow='1';
        self.temporaryObject = x;
        console.log(self.temporaryObject, "要修改的配置");
        //self.indexOf = self.add.typeList.indexOf(self.temporaryObject);
        self.isAdd = '2';

        self.configObject = self.temporaryObject;
        self.configObject.productCode = self.configObject.productCode+"";
        if (x.taskObject == 'productConfig') {
            $('#addShow').show();
            $("#addShow *").attr("disabled",true);
            if (self.configObject.productType == '1') {
                self.getAllProduct('1');
                $('#productId').html(self.temporaryObject.productName);
                $('#productLiLv').html(self.temporaryObject.productRate);

            }
            if (x.productType == '3') {
                self.getAllProduct('3');
                $('#term').html(self.temporaryObject.term);
                $('#termDesc').html(self.temporaryObject.termDesc);
                $('#bankRate').html(self.temporaryObject.productRate);
                $('#bankRateType').html(self.temporaryObject.rateType);
                $('#bankAddr').val(self.temporaryObject.linkAddr);
                //$('#productName').val(self.temporaryObject.T.productName);
                $('#productName').val(self.temporaryObject.productName);





            }
            if (x.productType == '2'){

                $('#rate').html(self.temporaryObject.productRate);
                $('#fundType').html(self.temporaryObject.fundType);
                $('#fundName').val(self.temporaryObject.fundName);
                $('#bankAddr').val(self.temporaryObject.linkAddr);
                for (var i = 0; i < self.fundYieldFHBBase.length; i++) {
                    if (self.temporaryObject.rateType == self.fundYieldFHBBase[i].label){
                         self.temporaryObject.rateType = self.fundYieldFHBBase[i].code;
                    }
                }
                $('#rateFund').val(self.temporaryObject.rateType);




            }





            if (self.temporaryObject.introLabel && self.temporaryObject.introLabel.length >= 1) {
                setTimeout(function () {

                    $('#int1').val(self.temporaryObject.introLabel[0]);
                    if ($('#int2').length > 0) {
                        $('#int2').val(self.temporaryObject.introLabel[1]);

                    }
                    if ($('#int3').length > 0) {
                        $('#int3').val(self.temporaryObject.introLabel[2]);

                    }

                }, 500)

            }

        }


        if (x.taskObject == 'newsConfig') {
            $('#addNews').show();
            $("#addNews *").attr("disabled",true)

        }
        if (x.taskObject == 'customConfig') {
            $('#addCustom').show();
            $("#addCustom *").attr("disabled",true);
           self.add.fileUrl=x.fileUrl;

        }
        if (x.taskObject == 'singleContent') {
            $('#addSingle').show();
            $("#addSingle *").attr("disabled",true);
            self.add.imageUrl=x.fileUrl;
        }
        if (x.taskObject == 'contentCollection') {
            $('#addCollection').show();
            $("#addCollection *").attr("disabled",true)
        }
        if (x.taskObject == 'pictureConfig') {
            $('#Realtime').show();
            $("#Realtime *").attr("disabled",true);
        }
        if (x.taskObject == 'thematicConfig') {
            $('#addThematic').show();
            $("#addThematic *").attr("disabled",true);
        }
        setTimeout(function () {
    $('.mySelect2').select2();
},500)

}

self.clearcheckbox=function () {
    $("input[name='fileFlag']").prop("checked",false);
    self.configHotObject.hotFileObject=[];



}
    //关闭热门管理
    self.closeAddHot=function () {
        $('#fileManage').hide();
        //点击关闭后回滚之前的数据
        if(self.rollBack&&self.rollBack.fileObject){
            self.configObject.fileObject=angular.copy(self.rollBack.fileObject);
        }


    }

    self.clearPositionNoAndResourceType=function (type) {
        if(type==1){
            self.add.positionNo=null;
            self.add.resourceType=null;
        }else if(type==2){
            self.add.resourceType=null;
        }


    }

    //清空自定义配置文件url
    self.clearInputUrl=function () {
       $("#customJumpFile2").val("");
       self.add.fileUrl="";
       self.configObject.fileUrl="";
       self.configObject.linkAddr = null;
        $("#newsFile2").val("");
        if(self.configObject.jumpType!='2'){
            $('#newsFile2').attr("disabled",true);
        }else if(self.configObject.jumpType=='2'){
            $('#newsFile2').attr("disabled",false);
            $('#customJumpFile2').attr("disabled",false);

        }
    }

    function compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }

    self.checkPeriods=function () {

        if(!self.configObject.fileObject||self.configObject.fileObject.length==0){
            self.configObject.fileObject.sort(compare('periods'));
            alert("请上传文件")
            return ;
        }else{
            self.configObject.fileObject.sort(compare('periods'));

            var length = self.configObject.fileObject.length;
            var min = self.configObject.fileObject[0].periods;
            var max = self.configObject.fileObject[self.configObject.fileObject.length-1].periods;
              //if()
            if (Number(max)-Number(min)!=Number(length)-Number(1)) {
                for (var i = 0; i <length ; i++) {
                    if(self.configObject.fileObject[i].periods!=min){
                        alert("缺少第"+min+"期文件");
                        return;
                    }
                 min++;

                }


            }
        }

        $("#fileManage").hide();

    }

  self.clearfileObject=function () {

        if(self.configObjectFileType=='2'){
            alert("文件类型不能更改");
            return;
        }
      self.configObject.fileObject=[];
      self.addHotfileObject=[];
   }
   self.clearFileUrl=function () {
       self.add.imageUrl=null;
       $("#singleFile2").val("");

       if(self.configObject.fileType=='2'){
           $('#singleFile2').attr("disabled",false);
       }else{
           $('#singleFile2').attr("disabled",true);
       }

   }

   self.clearSonSelectValue=function () {
       self.search.positionNo=null;
       self.search.resourceType=null;
   }
    self.clearResourceTypeValue=function () {
        self.search.resourceType=null;
    }


    self.topicManageHide=function () {
        $('#topicManage').hide();
        self.isAfter='0'
    }

}])