var App = angular.module('myApp', [], angular.noop);
App.controller("rootController",['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var self = $scope;
    self.queryTask={};
    self.queryTask.channel='WK';
    self.selectRule = {};
    self.viewPage = 1;
    var typeKey="";
    var widgetTypes = [];
    self.addTask = {};
    self.jfParamList=[];
    self.taskDetailList = [];
    self.taskRules = {};
    self.auditStatus = '2';
    self.auditStatus = '';
    self.BlackRoster = {};
    self.WhiteRoster = {};
    self.BlackRoster.rosterId = '';
    self.WhiteRoster.rosterId = '';
    self.taskDeatil = {};
    self.taskDeatil.pageOne = '';
    self.taskDeatil.pageTwo = '';
    self.reviewStatus = {};
    self.auditor = globalConfig.loginName;
    console.log(self.auditor,"等数人是谁?");

    /**
     * 根据渠道查询--活动类型
     * @param channel
     */
    self.queryTypes = function (channel) {
        $http.get(globalConfig.basePath + "/router/web/activity/type/list?channel=" + channel)
            .then(
                function (response) {
                    var data = response.data.resp.data;
                    self.types = data.activityTypeList;
                }
            );
    }

    self.queryTypesPage = function (channel) {
        $http.get(globalConfig.basePath + "/router/web/activity/type/list?channel=" + channel)
            .then(
                function (response) {
                    var data = response.data.resp.data;
                    self.searchTyps = data.activityTypeList;
                }
            );
    }

    self.queryTypesPage('WK');


    /**
     * 审核
     */
    self.preOperate = function(Info){
        $('#auditShow').show();
        self.reviewStatus.activityCode = Info.activityCode;
        self.reviewStatus.auditor = globalConfig.loginName;
        self.reviewStatus.updateUser = globalConfig.loginName;


    }


    /**
     * 确定审核
     */
    self.Review = function(status){
        self.reviewStatus.auditStatus = status;
        var url = globalConfig.basePath+"/taskcenter/updateStatus";
        $http.post(url,self.reviewStatus).then(
            function (data) {
            console.log(data,"审核返回的数据");
            if (data.data.code=='000'){
                $('#auditShow').hide();
                    alert("操作成功!");
                    self.queryTaskPage(1);
                }


            }
        )

    }


    /**
     * 生效失效
     * @param v
     */
    $scope.updateEnabled = function (v) {
        var updateBody = {
            isEnable: !!!v.isEnable,
            id: v.id,
            updateUser: globalConfig.loginName
        };
        console.log(updateBody,"要修改的内容!");
        var message = !!!v.isEnable ? "生效" : "失效";
        if (confirm("确认" + message + "?")) {
            $http.put(globalConfig.basePath + "/taskcenter/invaild", updateBody).then(function (result) {
                if (result.status === 200) {
                    if (updateBody.isEnable == false) {
                        $scope.stickRemove(v.activityCode);
                    }
                    alert("修改成功");
                    $scope.queryTaskPage(1);
                }
            });
        }

    };

    /**
     * 确定执行置顶
     */
    $scope.moveTop = function() {
        $scope.topRecord.taskStartTime = longToStr($scope.topRecord.taskStartTime);
        $scope.topRecord.taskEndTime = longToStr($scope.topRecord.taskEndTime);
        // console.log("置顶方法，record");
        // console.log(record);
        $scope.topRecord.startTime = $('#stickStartTime').val() + "";
        $scope.topRecord.endTime = $('#stickEndTime').val() + "";
        console.log("置顶方法，topRecord");
        console.log($scope.topRecord);
        if ($scope.topRecord.startTime > $scope.topRecord.endTime) {
            alert("开始时间不能大于结束时间");
            $scope.moveTopCancel();
            return;
        }
        if ($scope.topRecord.startTime < $scope.topRecord.taskStartTime) {
            alert("置顶开始时间不能小于任务开始时间");
            $scope.moveTopCancel();
            return;
        }
        if ($scope.topRecord.endTime > $scope.topRecord.taskEndTime) {
            alert("置顶结束时间不能大于任务结束时间");
            $scope.moveTopCancel();
            return;
        }
        if (!$scope.topRecord.stickDesc) {
            alert("置顶文案不能为空");
            $scope.moveTopCancel();
            return;
        }
        var url = globalConfig.basePath + "/router/web/activity/stick";
        $http.post(url, $scope.topRecord).then(function(data) {
                $('#moveTop').hide();
                alert('置顶成功');
                $scope.queryTaskPage(1);
                // $scope.querySplashConfigList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );
    }


    /**
     * 确定排序
     */
    $scope.moveCommit = function() {
        var url = globalConfig.basePath + "/router/web/activity/stick/sort";
        $http.post(url, {activityList: $scope.sortList}).then(
            function(data){
                console.log("排序返回");
                console.log(data);
                alert(data.data.message);
                //self.reset();
                //self.loading();
                // $scope.querySplashConfigList(1);
                $('#showPriority').hide();
                $scope.sortList = {};
            },function(response) {
                alert("请求失败了....");
            }
        );
    }


    /**
     * 排序操作
     * @param type
     */
    $scope.move = function(type) {
        if($("input[class='moveCheckbox']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
        var length = $scope.sortList.length;
        $('.moveCheckbox').each(function() {
            if(this.checked == true) {
                if(type=='S') {//上移
                    var me =$(this).val() - 1;
                    if(me==0) {
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  $scope.sortList[me];//当前选中的
                    var move1 = $scope.sortList[me-1];//上一个
                    $scope.sortList[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                    $scope.sortList[me] = move1;// 当前选中的
                    $scope.sortList[me-1].sort =Number($(this).val())-Number(1);
                    $scope.sortList[me].sort =Number($(this).val());
                }else if(type=='X'){// 下移
                    var me =$(this).val()-1;
                    if(me==length-1){
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = $scope.sortList[me];// 下一个banner
                    move0.sort=Number($(this).val())+Number(1);
                    var move1 = $scope.sortList[me+1];// 下一个banner
                    move1.sort=Number($(this).val());
                    $scope.sortList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    $scope.sortList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }


    /**
     * 回退页面
     */
    self.returnPageOne = function(){
        self.viewPage = 1;
        //添加修改控制（0添加 1修改）
        self.isUpdate = null;
        self.addTask={};

    }

    self.sort = function(){
        var	searchproductChannel = $("#searchProductChannel").val();

        if(!searchproductChannel) {
            alert("请在查询条件中选择渠道");
            return;
        }
        $('#showPriority').show();
        var body = {
            channel: $("#searchProductChannel").val()
        };
        var url = globalConfig.basePath+"/router/web/query/activity/stick/sort";
        $http.post(url, body).then(function successCallback(result) {
            console.log(result,"查询优先级排序结果");
            var data = result.data.resp.data;
            for(var i=0; i < data.length; i++) {
                data[i].sort = i + 1;
            }
            $scope.sortList = data;
            // $scope.strotList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });


    }


    /**
     * 关闭优先级排序
     */
    self.moveCancel = function(){
        $('#showPriority').hide();
        self.sortList = {};
    }

    /**p
     * 查询任务模块
     * @param idp
     */
    self.loadModuleTypes = function (pid) {
        var url = globalConfig.basePath + "/router/web/query/task/module";
        $http.post(url, {"pid": pid})
            .then(function (result) {
                if (result.data.code == '000') {
                    var data = result.data.resp.data;
                    self.moduleList = data.moduleList;
                }
            });
    }

    /**
     * 搜索重置
     */
    self.queryReset = function () {
        self.queryTask={};
        self.queryTask.channel='WK';
        $('#startTime').val("");
        $('#endTime').val("");


    }


    /**
     * 置顶或取消置顶
     */
    $scope.stick = function(task) {
        if (task.stickStatus == 2) {
            //取消置顶
            if(confirm('确定取消置顶?')) {
                //执行取消置顶
                var url = globalConfig.basePath + "/router/web/activity/stick/remove";
                var body = {"activityCode": task.activityCode, "updateUser": globalConfig.loginName};
                $http.post(url, body).then(
                    function(data) {
                        // console.log("取消置顶返回");
                        // console.log(data);
                        $scope.queryTaskPage(1);
                        alert(data.data.message);
                    },function(response) {
                        alert("请求失败了....");
                    }
                );
            }
            return;
        }
        $scope.openStickTip(task);
    }

    /**
     * 取消置顶框
     */
    $scope.moveTopCancel = function() {
        $('#moveTop').hide();
    }

    /**
     * 置顶弹出框
     */
    $scope.openStickTip = function(task) {
        $scope.topRecord = {activityCode: task.activityCode,
            updateUser: globalConfig.userName,
            taskStartTime: task.startTime,
            taskEndTime: task.endTime,
            startTime: "",
            endTime: ""};
        $('#moveTop').show();
    }



    /**
     * 查看置顶详情
     */
    self.getStickDetail = function(task){
        console.log(task,"传过来的数据");
        $scope.stickDetail = {};
        var url = globalConfig.basePath + "/router/web/activity/stick/detail";
        var body = {"activityCode": task.activityCode};
        $http.post(url, body).then(
            function(data) {
                console.log("置顶详情返回");
                console.log(data);
                $scope.stickDetail = data.data.resp.data;
                // alert(data.data.message);
            }, function(response) {
                alert("请求失败了....");
            }
        );
        $('#stickDetail').show();
    }

    /**
     * 关闭置顶详情
     */
    self.closeStickDetail = function(){
        $('#stickDetail').hide();
    }


    /**
     * 取消置顶
     */
    $scope.stickRemove = function(activityCode) {
        //执行取消置顶
        var url = globalConfig.basePath + "/router/web/activity/stick/remove";
        var body = {"activityCode": activityCode, "updateUser": globalConfig.loginName};
        $http.post(url, body).then(
            function(data) {
            },function(response) {
            }
        );
    }

    /**
     * 分页条件查询
     * @param pageNumber
     */
    self.queryTaskPage = function (pageNum) {
        if (!pageNum) {
            self.queryTask.pageNo = 1;
        } else {
            if (pageNum > self.queryTask.lastPage && self.queryTask.lastPage > 0) {
                self.queryTask.pageNo = self.queryTask.lastPage;
            } else {
                self.queryTask.pageNo = pageNum;
            }
        }
        if (!self.queryTask.pageSize) {
            self.queryTask.pageSize = '10';
        }
        if (self.queryTask.pageSize=='0'){
            self.queryTask.pageSize = 10;
        }
        self.queryTask.startTime =  $("#startTime").val() ? strToDate($("#startTime").val()).getTime() : "";
        self.queryTask.endTime = $("#endTime").val() ? strToDate($("#endTime").val()).getTime() : "";
        self.queryTask.activityType = self.queryTask.type? self.queryTask.type.activityType : "";
        console.log(self.queryTask,"分页入参");
        $http.post(globalConfig.basePath + "/router/web/activity/list", self.queryTask)
            .then(
                function (result) {
                    console.log(result,"返回的结果");
                    if (result.data.code == '000') {
                        var data = result.data.resp.data;
                        self.queryList = data.activityList;
                        self.queryTask.totalRowSize = data.totalCount;
                        self.queryTask.lastPage = data.totalPage;
                        for (var i = 0;i <self.authorList.length;i++){
                            for (var y = 0;y < self.queryList.length; y++){
                                if (self.queryList[y].createUser == self.authorList[i].key){
                                    self.queryList[y].createUser = self.authorList[i].value;
                                }
                            }
                        }

                    }else{
                        alert(result.data.message)
                    }
                }
            )
    }
    self.queryTaskPage();

    Date.prototype.format5 = function (fmt) {
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


    self.queryTaskDetail = function (Info) {

        self.queryAuditorList();
        self.bankDetail();
        //如果渠道为聚生活，则使用钱包的渠道查询黑白名单
        if (Info){
            var url = globalConfig.basePath+"/taskcenter/taskdetail?activityCode="+Info.activityCode+"&channel="+Info.channel+"&path="+globalConfig.basePath;
            $http.get(url).then(
                function (data) {
                    console.log(data,"查看详情的数据");
                    if (data.data.code == '000' && data.data.resp.message == "成功"){
                        self.taskDetail = {};
                        self.taskDeatil = data.data.resp.data;
                        //如果为小程序查询适用商品类型
                        if(Info.channel=='JF_LIFE'){
                            self.getCateType('');
                        }
                        self.rosterTypeList = data.data.resp.rosterTypeList;
                        if (self.taskDeatil.rosterList) {
                            if (self.taskDeatil.rosterList.length == 1) {

                                if (self.taskDeatil.rosterList[0].rosterCategory == 1) {
                                    self.WhiteRoster = self.taskDeatil.rosterList[0];
                                } else {
                                    self.BlackRoster = self.taskDeatil.rosterList[0];

                                }

                            }else {

                            }
                        }
                        self.taskDeatil.buttonType = self.taskDeatil.buttonType+"";
                        self.taskDeatil.activityType = self.taskDeatil.activityType+"";
                        self.types = data.data.resp.activityList.data.activityTypeList;
                        var pid;
                        for (var i = 0;i < self.types.length;i++){
                            if (self.taskDeatil.activityType == self.types[i].activityType){
                                pid = self.types[i].id;
                            }

                        }

                        self.loadModuleTypes(pid);
                        self.loadRules(self.taskDeatil.activityType, pid, self.taskDeatil.moduleCode);

                            self.findDetailChannelGroups();


                        self.taskDeatil.prizeSendRule = self.taskDeatil.prizeSendRule+"";
                        self.rPositionDictList = data.data.resp.jumpTypeList;
                        self.rDictList = data.data.resp.pageTypeList;
                        if (self.taskDeatil.buttonType==1 || self.taskDeatil.buttonType==3){
                            self.taskDeatil.pageOne = data.data.resp.data.go;
                            self.taskDeatil.pageTwo = null;
                        }else {
                            self.taskDeatil.pageOne = data.data.resp.data.go.toString().split(";")[0].toString();
                            self.taskDeatil.pageTwo = data.data.resp.data.go.toString().split(";")[1].toString();
                        }

                        self.taskDeatil.channel = self.taskDeatil.channel+"";
                        self.currentRuleList = self.taskDeatil.ruleList;
                        if (self.addTask.auditors && self.addTask.auditors.length > 0){
                            for (var i = 0;i < self.addTask.auditors.length;i++){
                                if (self.addTask.auditors[i].key == self.taskDeatil.createUser){
                                    self.taskDeatil.createUser = self.addTask.auditors[i].value;
                                }
                                if (self.addTask.auditors[i].key == self.taskDeatil.updateUser){
                                    self.taskDeatil.updateUser = self.addTask.auditors[i].value;
                                }

                            }
                            for (var i = 0;i < self.addTask.auditors.length;i++){
                                if (self.addTask.auditors[i].key == Info.auditor){
                                    self.taskDeatil.auditor = self.addTask.auditors[i].value;
                                }
                            }

                        }



                        if (self.taskDeatil.prizeList.length>0){
                            for (var i = 0;i < self.taskDeatil.prizeList.length;i++){
                                if (self.taskDeatil.prizeList[i].prizeType == 'point')
                                {
                                    $.ajax({
                                        url:globalConfig.basePath+"/smart_marketing/initiative/getIntegralId?jfRuleId="+self.taskDeatil.prizeList[i].couponId,
                                        type:"get",
                                        dataType:"json",
                                        contentType:"text/html;charset=utf-8",
                                        data:self.taskDeatil.prizeList[i].couponId,
                                        async: false,
                                        success:function (data) {
                                            if (data.code=='000' && data.resp.code=='2000'){
                                                self.taskDeatil.prizeList[i].remark = "积分-"+self.taskDeatil.prizeList[i].prizeValue+"-剩余额度:"+data.resp.data.availablePoint;
                                            }
                                        }

                                    })

                                }else {
                                    continue;
                                }
                            }
                        }

                        if (self.taskDeatil.blackWhiteLimit == 'white'){
                            document.getElementById("white").checked = true;
                            document.getElementById("black").checked = false;
                            document.getElementById("all2").checked = false;
                            $('#white').attr("disabled",true);
                            $('#black').attr("disabled",true);
                            $('#selectWRoster').attr("disabled",true);
                            $('#all2').attr("disabled",true);
                            $('#whiteRList').show();
                            $('#BlackRList').hide();


                        }
                        if (self.taskDeatil.blackWhiteLimit == 'black'){
                            document.getElementById("black").checked = true;
                            document.getElementById("all2").checked = false;
                            document.getElementById("white").checked = false;
                            $('#black').attr("disabled",true);
                            $('#white').attr("disabled",true);
                            $('#all2').attr("disabled",true);
                            $('#BlackRList').show();
                            $('#whiteRList').hide();
                            $('#selectBRoster').attr("disabled",true);
                        }
                        if (self.taskDeatil.blackWhiteLimit == 'none'){
                            self.BlackRoster.rosterType="NO_RULE";
                            self.WhiteRoster.rosterType="NO_RULE";
                            $('#blackTypevalue').attr("disabled",true);
                            $('#whiteTypevalue').attr("disabled",true);
                            $('#whiteRList').hide();
                            $('#BlackRList').hide();
                            document.getElementById("all2").checked = true;
                            document.getElementById("white").checked = false;
                            document.getElementById("black").checked = false;
                            $('#all2').attr("disabled",true);
                            $('#black').attr("disabled",true);
                            $('#white').attr("disabled",true);
                        }
                        if (self.taskDeatil.blackWhiteLimit == 'black_white'){
                            document.getElementById("black").checked = true;
                            document.getElementById("white").checked = true;
                            document.getElementById("all2").checked = false;
                            $('#whiteRList').show();
                            $('#BlackRList').show();
                            $('#selectBRoster').attr("disabled",true);
                            $('#selectWRoster').attr("disabled",true);
                            $('#black').attr("disabled",true);
                            $('#white').attr("disabled",true);
                            $('#all2').attr("disabled",true);
                        }
                        var date = new Date(self.taskDeatil.startTime);
                        var date2 = new Date(self.taskDeatil.endTime);
                        if (self.taskDeatil.updateTime) {
                            var date3 = new Date(self.taskDeatil.updateTime);
                            $('#updateTime').val(self.dateToString(date3));
                        }
                        // $('#taskTimeTo').val(date2.getFullYear()+"-"+date2.getMonth()+"-"+date2.getDate()+"  "+date2.getHours()+"时"+date2.getMinutes()+"分"+date2.getSeconds()+"秒");
                        // $('#taskTimeEnd').val(date2.getFullYear()+"-"+date2.getMonth()+"-"+date2.getDate()+"  "+date2.getHours()+"时"+date2.getMinutes()+"分"+date2.getSeconds()+"秒");
                        $('#taskTimeTo').val(self.dateToString(date));
                        $('#taskTimeEnd').val(self.dateToString(date2));


                        if (self.taskDeatil.taskShow == 1){
                            document.getElementById("showYes").checked = true;
                        }else {
                            document.getElementById("showNo").checked = true;
                        }

                        if (self.taskDeatil.pushMessage == 1){
                            document.getElementById("pushYes").checked = true;
                        }else {
                            document.getElementById("pushNo").checked = true;
                        }
                        self.viewPage = 2;

                    }else {
                        alert("接口返回失败!");
                    }

                }
            )
        }


    }

    /**
     * 添加任务
     */
    self.addShow = function () {
        $('#channelShow').show();
        self.addTask = {};
    }

    self.dateToString = function(TimeStamp){
      return  new Date(TimeStamp).format5("yyyy-MM-dd hh:mm:ss");

    }

    /**
     * 确定添加任务
     */
    self.addTaskTop = function(){
        if(null == self.addTask.channel){
            alert("请选择渠道！")
            return;
        }
        $('#channelShow').hide();
        //添加任务的类型
        self.queryTypes(self.addTask.channel);
        //查询适用商品
        self.getCateType('');



        //显示添加弹窗
        self.viewPage = 3;
        //添加修改控制（0添加 1修改）
        self.isUpdate = 0;
        //初始化页面跳转类型(默认原生跳转)
        self.addTask.buttonType = '1';
        //查询页面类型
        self.selectPageOne(self.addTask.channel);

        //奖励发放形式（钱包，悟空自动发放，聚生活小程序手动发放）
        if(self.addTask.channel == 'QB' || self.addTask.channel == 'WK'){
            self.addTask.grantStatus ='1';
        }else{
            self.addTask.grantStatus ='2';
        }

        //奖品列表
        self.prizeTypeList=[];
        //查询奖品列表(奖励类型)
        // self.pullPrizeType();
        //黑白名单显示操作
        self.nameIds=null;
        $('#memberListAll').prop("checked",true);
        $('#memberListWhite').prop("checked",false);
        $('#memberListBlack').prop("checked",false);
        //用户名单
        self.strategyReload();
        //用户黑名单
        self.strategyBlackReload();
        //审核人查询
        self.queryAuditorList();
        //规则数组
        self.addTask.ruleList = [];
        //规则
        self.addTask.selectRequirement = {};
        //奖励列表
        self.addTask.prizeList = [];
        //发放形式
        if(self.addTask.channel != 'JF_LIFE'){
            self.addTask.grantStatus = '2';
            self.addTask.prizeSendRule = '1'
            self.addTask.prizeType = '1';
        }else{
            self.addTask.grantStatus = '1';
            self.addTask.prizeSendRule = '1';
            self.addTask.prizeType = '3';
        }
        //添加状态
        self.addStruts = 0;

        //活动细则
        self.taskDetailList = [];
        //开始结束时间
        $('#addTaskStartTime').val('');
        $('#addTaskEndTime').val('');
        //是否前端显示
        $('#yesIsView').prop('checked',true);
        $('#noIsView').prop('checked',false);
        //完成任务是否推送通知
        $('#yesIsPush').prop('checked',true);
        $('#noIsPush').prop('checked',false);
    }

    /**
     * 返回列表页
     */
    self.returnPage = function(){
        self.viewPage = 1;
        self.queryTaskPage(1);
        self.addTask = {};
        $('#all').prop("checked",false);
        $('.mySelect2').select2();
        $('.mySelect').select2();

    }

    /**
     * 取消添加任务
     */
    self.moveTopCancel2 = function () {
        self.addTask = {};
        $('#channelShow').hide();
    }

    /**
     * 查询页面类型
     * @param channel
     */
    self.selectPageOne = function(channel){
        if(self.addTask.buttonType == '2') {
            var type = "";
            if (channel == 'WK') {
                type = "wk_protogenesis_page_one";
            } else {
                type = "qb_protogenesis_page_one";
            }
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
            ).success(function(data) {
                self.rDictList = data.resp.result;
            });
        }
    }


    /**
     * 根据以及页面查询二级页面（跳转页面）
     * @param channel 渠道
     * @param pageOne 页面类型
     * @param pageTow
     */
    self.selectPageOneByRDict = function (channel, pageOne, pageTow) {
        var type;
        if (channel == 'WK') {
            type = "wk_protogenesis_page_two";
        } else {
            type = "qb_protogenesis_page_two";
        }
        $http.get(globalConfig.basePath + "/dict/findSceneTwoList?type=" + type + "&value=" + pageOne
        ).success(function(data) {
            console.log("根据一级页查二级页返回 data：");
            console.log(data);
            self.rPositionDictList = data.resp.result;
            if(self.rPositionDictList.length=='1') {
                self.addTask.pageTwo = data.resp.result[0].value;
            } else if (pageTow) {
                self.addTask.pageTwo = pageTow;
            }
        });
    }

    /**
     * 任务类型联动任务模块
     * @param type
     */
    self.changeActivityType = function (type) {
        if (!type) {
            type = {};
        }
        //任务模块查询
        self.loadModuleTypes(type.id);
        self.addTask.moduleCode="";
        //规则查询
        self.loadRules(type.activityType, type.id, self.addTask.moduleCode);
        self.changModuleType(type, self.addTask.moduleCode);
        self.addTask.target = null;
        self.addTask.selectRequirement.ruleKey=null;
    }

    /**
     * 任务类型联动任务模块
     * @param type
     */
    self.changeActivityType2 = function (type) {
        if (!type) {
            type = {};
        }
        if(self.addTask.ruleList!=null && self.addTask.ruleList.length>0){
            if(confirm("确定变换任务类型吗？变换后将删除规则信息")){
                self.addTask.ruleList=[];
            }
        }
        //任务模块查询
        self.loadModuleTypes(type.id);
        self.addTask.moduleCode="";
        //规则查询
        self.loadRules(type.activityType, type.id, self.addTask.moduleCode);
        self.changModuleType(type, self.addTask.moduleCode);
        self.addTask.target = null;
        self.addTask.selectRequirement.ruleKey=null;
    }

    /**
     * 任务模块联动任务规则
     * （2.9有改动）
     * @param type
     * @param moduleCode
     */
    self.changModuleType = function (type, moduleCode) {
        self.loadRules(type.activityType, type.id, moduleCode);
        self.addTask.target = null;
        self.addTask.selectRequirement.ruleKey=null;
    }

    /**
     * 任务模块联动任务规则
     * （2.9有改动）
     * @param type
     * @param moduleCode
     */
    self.changModuleType2 = function (type, moduleCode) {
        if(self.addTask.ruleList!=null && self.addTask.ruleList.length>0){
            if(confirm("确定变换任务类型吗？变换后将删除规则信息")){
                self.addTask.ruleList=[];
            }
        }
        self.loadRules(type.activityType, type.id, moduleCode);
        self.addTask.target = null;
        self.addTask.selectRequirement.ruleKey=null;
    }

    /**
     * 任务规则查询
     */
    self.loadRules = function (type, pid, moduleCode) {
        typeKey="";
        if(type==1){
            typeKey="yq_";
        }else if(type==2){
            typeKey="cj_";
        }else if(type==7){
            typeKey="xt_";
        }else if(type==9){
            typeKey="tx_";
        }else if(type==10){
            typeKey="cz_";
        }else if(type==11){
            typeKey="kh_";
        }else if(type==12){
            typeKey="bk_";
        }else if(type==13){
            typeKey="zf_";
        }else if(type==8){
            typeKey="dl_";
        }else if(type==21){
            typeKey="zljx_";
        }else if(type==30){
            typeKey="dj_";
        }else if(type==44){
            typeKey="fx_";
        }else if(type==45){
            typeKey="fw_";
        }else if(type==46){
            typeKey="sh_";
        }else if(type==48){
            typeKey="pc_";
        }else if(type==49){
            typeKey="xgcg_";
        }else if(type==50){
            typeKey="cgsq_";
        }else if(type==51){
            typeKey="sg_";
        }else if(type==52){
            typeKey="dt_";
        }else if(type==55){
            typeKey="kj_";
        }else if(type==56){
            typeKey="xyk_";
        }else if(type==57){
            typeKey="cy_";
        }else if(type==58){
            typeKey="sqcj_";
        }else if(type==59){
            typeKey="sqht_";
        }else if(type==60){
            typeKey="yhkh_";
        }else if(type==61){
            typeKey="yhgm_";
        }else if(type==62){
            typeKey="yhdd_";
        }else if(type==63){
            typeKey="zzkj_";
        }else if(type==64){
            typeKey="sm_";
        }else if(type==66){
            typeKey="jjts_";
        }
        // /web/activity/dict/rules 内置规则接口
            $http.post(globalConfig.basePath + "/router/web/activity/dict/rules",{activityType: type,pid: pid,moduleCode: moduleCode}).then(
                function (result) {
                    var data = result.data.resp.data;
                    console.log(data,"返回的数据");
                    if (data) {
                        var rules = [];
                        $.each(data.rules, function (an, v) {
                            var ruleKey=typeKey+v.ruleKey;
                            $.each(widgetTypes, function (wn, w) {
                                if (w.label === ruleKey) {
                                    if (w.value === "true") {
                                        v.ruleValue = 'T';
                                    } else {
                                        v.ruleValue = '';
                                    }
                                    rules.push(v);
                                    return;
                                }
                            });
                        });
                        // self.taskRules = rules; 原
                        self.taskRules = rules;


                        //任务完成条件
                        self.requirements = data.requirements;
                        // self.requirements = [{"ruleText": "ruleText完成条件"}];
                        self.selectRule = self.taskRules[0];
                        self.AllRuleList = [];
                        for(var i = 0;i < self.taskRules.length;i++){
                            self.AllRuleList.push(self.taskRules[i]);
                        }
                        for(var i = 0;i < self.requirements.length;i++){
                            self.AllRuleList.push(self.requirements[i]);
                        }

                    }
        })


    }





    self.getRuleByKey = function (key) {
        var targetRule = {};

        if (self.AllRuleList) {
            console.log(self.AllRuleList, "任务规则");
            $.each(self.AllRuleList, function (n, rule) {
                if (rule.ruleKey === key) {
                    targetRule = rule;
                    return
                }
            });
        }else {
            return;

        }

        return targetRule;
    };

    /**
     * 本地字典表查询
     */
    $http.get(globalConfig.basePath + "/rDict/getVersionByType?type=display_widget").then(function (result) {
        widgetTypes = result.data.resp.result;
    });

    /**
     * 查询条件的输入类型，这里可以查到字典表里配置的信息，条件的value、label、description、parent_id等
     * （2.9有改动）
     * @param code
     * @returns {{value: string}}
     */
    self.getWidgetTypeRequirement = function (code) {
        code = "tj_" + code;
        var targetType = {value: 'text'};
        $.each(widgetTypes, function (n, w) {
            if (w.label === code) {
                //tj_default表示此条件无需输入值
                if (w.value === 'tj_default') {
                    targetType = w;
                }

                if (w.value === 'select' && !self.selectRule.ruleValue) {
                    self.selectRule.ruleValue = self.parseRuleKey(w.description.split(";")[0]);
                }
                targetType = w;
                return;
            }
        });
        return targetType;
    }

    self.getWidgetType = function (code) {
        code=typeKey+code;
        var targetType = {value: 'text'};
        $.each(widgetTypes, function (n, w) {
            if (w.label === code) {
                if (w.value === '') {
                    w.value = 'text';
                }

                if (w.value === 'select' && !self.selectRule.ruleValue) {
                    self.selectRule.ruleValue = self.parseRuleKey(w.description.split(";")[0]);
                }
                targetType = w;
                return;
            }
        });
        return targetType;
    }

    self.parseRuleKey = function (r) {
        var a = r.substring(0, r.lastIndexOf("-"));
        return a;
    };

    self.addTaskDetail = function () {
        self.taskDetailList.push({"value": ""});

    };

    self.minusTaskDetail = function (index) {
        self.taskDetailList.splice(index, 1);
    };

    /**
     * 拉取奖品类型列表
     */
    self.pullPrizeType = function(){
        var url = globalConfig.basePath+"/prize/getPrizeTypeList";
        $http.get(url).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                self.prizeTypeList = callback.data.resp;
            } else {
                alert("查询奖品类型列表信息失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("查询奖品类型列表信息异常");
        });
    };

    /**
     * 名单选择
     * @param type （0：全部 1：白名单 2：黑名单）
     */
    self.complete = function(type){
        if(type==0){
            if(!$('#memberListAll').is(":checked")){
                self.nameIds=1;
            }else{
                //控制是否可编辑
                self.nameIds=null;
                self.whiteSelection=null;
                self.blackSelection=null;
                $('#memberListWhite').prop("checked",false);
                $('#memberListBlack').prop("checked",false);
                //白名单类型
                self.addTask.memberListName = 'NO_RULE';
                self.strategyReload();
                //黑单类型
                self.addTask.memberBlackListName = 'NO_RULE';
                self.strategyBlackReload();
            }
        }else if(type==1){
            if($('#memberListWhite').is(":checked")){
                self.whiteSelection=1;
            }else{
                self.whiteSelection=null;
                //白名单类型
                self.addTask.memberListName = 'NO_RULE';
                self.strategyReload();
            }
        }else if(type==2){
            if($('#memberListBlack').is(":checked")){
                self.blackSelection=1;
            }else{
                self.blackSelection=null;
                //黑单类型
                self.addTask.memberBlackListName = 'NO_RULE';
                self.strategyBlackReload();
            }
        }
    }
    self.authorList={};
    /**
     * 审核人查询
     */
    //审核人生成
    self.queryAuditorList = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=10";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data.data.resp,"审核人列表");
                    self.addTask.auditors = data.data.resp;
                    self.authorList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }
    /**
     * 活动类型转换
     * @param typeId
     * @returns {null}
     */
    self.getType = function (typeId) {
        var targetType = {};
        if (self.searchTyps) {
            //问题：原来是用type.id匹配，接口方改了id字段的含义，原id字段现为type.activityType
            $.each(self.searchTyps, function (n, type) {
                // if (type.id === typeId) {
                if (type.activityType === typeId) {
                    targetType = type;
                    return
                }
            });
            return targetType;
        }
        return null;

    };

    /**
     * 根据key获取必要条件对象
     */
    self.getRequirementByRuleKey = function (ruleKey) {
        var target = {};
        $.each(self.requirements, function (n, requirement) {
            if (ruleKey === requirement.ruleKey) {
                target = requirement;
                return;
            }
        });
        return target;
    }

    self.getChangeByRuleKey = function(ruleKey){
        var target = {};
        $.each(self.requirements, function (n, requirement) {
            if (ruleKey === requirement.ruleKey) {
                target = requirement;
                self.addTask.target = target;
            }
        });
    }

    /**
     * 添加任务完成条件
     */
    self.addCompletionConditions = function(){
        if (!self.addTask.selectRequirement || !self.addTask.selectRequirement.ruleKey
            || !self.addTask.selectRequirement.ruleValue) {
            alert("任务条件不能为空");
            return;
        }
        if (self.addTask.selectRequirement.ruleKey == 'limit_amount_and_max_count') {
            var rules = self.addTask.selectRequirement.ruleValue.split(',');
            if (rules.length != 2) {
                alert("任务条件无效,必须是以英文逗号【,】间隔的数字");
                return;
            }
        } else {
            //单值的校验, 以parent_id存数据类型（比如数字 int），description字段存储数字范围
            var widgetRequirement = self.getWidgetTypeRequirement(self.addTask.selectRequirement.ruleKey);
            // console.log('widgetRequirement 用于计算验证的对象 widget');
            // console.log(widgetRequirement);
            if (widgetRequirement && widgetRequirement.parentId == 'int') {
                // alert("进入int判断");
                // var description = widgetRequirement.description;
                if (widgetRequirement.description) {
                    // alert("进入description判断");
                    var split = widgetRequirement.description.split('-');
                    if (split.length == 2) {
                        // alert("进入length==2判断");
                        // alert(self.addTask.selectRequirement.ruleValue);
                        if (parseInt(self.addTask.selectRequirement.ruleValue) < parseInt(split[0])
                            || parseInt(self.addTask.selectRequirement.ruleValue) > parseInt(split[1])) {
                            alert("请正确填写数字范围");
                            return;
                        }
                    }
                }
            }
        }
        angular.forEach(self.addTask.ruleList,function (each) {
            if(each.isEssential){
                var indexOf = self.addTask.ruleList.indexOf(each);
                self.addTask.ruleList.splice(indexOf,1);
            }
        })
        var param={};
        param.isEssential=true;
        param.ruleKey = self.addTask.selectRequirement.ruleKey;
        param.ruleValue = self.addTask.selectRequirement.ruleValue;
        // self.addTask.completionConditions=param;
        // self.addTask.completionConditionsText=$('#completionConditions option:selected').text();
        self.addTask.ruleList.push(param);
    }

    /**
     * 删除任务完成条件
     */
    // self.removeCompletionConditions = function(){
    //     self.addTask.completionConditions=null;
    //     self.addTask.completionConditionsText=null;
    // }

    /**
     * 添加规则
     * @param rule
     * @param type
     */
    self.addRule = function (rule,type) {
        if(null == self.addTask.activityTypes){
            alert("请选择任务类型");
            return;
        }
        if(null == self.addTask.moduleCode){
            alert("请选择任务模块");
            return;
        }
        var value=null
        var chekLeng=0;
        var checkNum="";
        if(type==1){
            value = rule.ruleValue;
            if(!value){
                $("#writeId").find("input[type='checkbox']").each(
                    function() {
                        if ($(this).is(":checked") == true) {
                            if($(this).val()=='ACTT'){
                                var deadline="";
                               if(self.addTask.channel=='WK'){
                                   deadline = $("#wkActtDeadline"+$(this).val()).val();
                               }else if(self.addTask.channel=='QB'){
                                   deadline = $("#qbActtDeadline"+$(this).val()).val();
                               }
                               if(deadline!=""){
                                   var dale="";
                                   var temp = deadline.split(/[\n\s+,，；;]/g);
                                   if(temp.length>5){
                                       //alert("最多填写5个期限");
                                       chekLeng = temp.length;
                                       return ;
                                   }else{
                                       for(var i=0;i<temp.length;i++){
                                           if (!(/(^[1-9]\d*$)/.test(temp[i]))) {
                                              // alert("输入的"+temp[i]+"不是正整数");
                                               checkNum =  temp[i];
                                               return ;
                                           }
                                           dale=dale+temp[i]+";";
                                       }
                                       dale = dale.substring(0,dale.lastIndexOf(";"));
                                   }

                                   value +=$(this).val()+"-"+dale+ ",";
                               }else{
                                   value +=$(this).val()+"-*"+",";
                               }
                            }else{
                                value += $(this).val() + ",";
                            }
                        };
                    });
                value = value.substring(0,value.lastIndexOf(","));
            }
            if(chekLeng!=0){
                alert("最多填写5个期限");
                return;
            }else if(checkNum!=""){
                alert("输入的"+checkNum+"不是正整数");
                return;
            }else if (!value) {
                alert("输入项不能为空");
                return
            }
        }else if(type==2){
            var countNum=0;
            var categoryId = "";
            var categoryUrl="";
            $('.versionCheckbox').each(function() {
                if (this.checked == true) {
                    var cids =  $(this).val().split("|");
                    categoryId += cids[0] + ",";
                    countNum++
                    if(countNum==1){
                        categoryUrl = cids[1];
                    }
                }
            });
            if (categoryId==""){
                alert("适用品类不能为空");
                return;
            }
            value=categoryId.substring(0,categoryId.length-1);
        }else if(type==3) {
            self.bankProductData = self.bankProductData;
            var  bankValue ="";
            var  checkedCount = 0;
            var count1 = 0;
            var count3 = 0;
            $('.bankId').each(function () {
                if (this.checked == true) {
                    var bankids = "";
                    count1 ++;
                    var count2 = 0;
                    bankids = $(this).val();
                    var bankName = "";
                    var bankValue1 = "";
                    var bankProductId="";
                   // bankValue1 += bankids +"-";
                    if(bankids == "BINH"){
                        bankValue1 = bankids +"-" +"*"+ ",";
                        checkedCount ++;
                    }
                    $('.bankProductId').each(function() {
                        if (this.checked == true) {
                            var param = JSON.parse($(this).val());
                            var cids =  param.bankProductId;
                            if (bankids == param.bankCode) {
                                bankProductId = bankids+"-"+ cids+",";
                                bankValue1 +=  bankProductId;
                            }
                            angular.forEach(self.bankProductData,function (each) {
                                if(each.bankCode == bankids){
                                 bankName = each.bankName;
                                    if(param.bankCode == each.bankCode){
                                        count2 ++;
                                    }
                                }
                            });
                        }
                    })
                    if(bankids != "BINH"){
                        if(count2 == 0){
                            count3 = 1;
                            alert("请选择"+bankName+"产品" );
                            return;
                        }
                    }
                    bankValue += bankValue1;
                }
            })

            if(checkedCount == 0 && count3 ==1){
                return;
            }else if(checkedCount !=0 && checkedCount!=count1 && count3 == 1){
                return;
            }else{
              //  bankValue = bankValue1;
                 value  = bankValue.substring(0,bankValue.length-1);

            }
          //  value  = bankValue.substring(0,bankValue.length-1);
        }

        if(self.addTask.ruleList.length>0){
            //相同规则计数
            var ruleCount = 0;
            angular.forEach(self.addTask.ruleList,function (each) {
                if(!each.isEssential && rule.ruleKey==each.ruleKey){
                    ruleCount++;
                }
            })
            if(ruleCount>0){
                alert("相同规则只能配置一次");
                return;
            }
        }
        var param = {};
        param.isEssential=false;
        param.ruleKey = rule.ruleKey;
        param.ruleValue = value;
        self.addTask.ruleList.push(param);
    };

    /**
     * 删除规则
     * @param rule
     */
    self.removeRule = function(rule){
        var indexOf = self.addTask.ruleList.indexOf(rule);
        if(confirm("确定要删除吗?")){
            if(indexOf > -1){
                self.addTask.ruleList.splice(indexOf,1);
            }
        }
    }

    /**
     * 积分规则ID校验
     */
    self.ruleIdCheck = function(ruleId){
        if(ruleId==null || ruleId==''){
            alert("请输入积分规则ID");
            return;
        }
        var productChannel=0;
        if(self.addTask.channel == 'QB'){
            productChannel=1;
        }else if(self.addTask.channel == 'WK'){
            productChannel=2;
        }
        $http.get(globalConfig.basePath+"/smart_marketing/initiative/checkPointRuleId?pointRuleId="+ruleId+"&productChannel="+productChannel+"&scene=4").then(
            function (data) {
                console.log("pointData="+data);
                if (data.data.code=='000'){
                    if (typeof(data.data.resp.data)=="undefined" || data.data.resp.data == null){
                        alert("积分规则不存在，请重试！");
                        self.addTask.ruleId=null;
                        return;
                    }else if (data.data.resp.data.status =='0' || data.data.resp.data.status =='9'){
                        alert("积分规则不在有效期内，请重试！");
                        self.addTask.ruleId=null;
                        return;
                    }else if (data.data.resp.data.status == '2'){
                        alert("该积分规则无法使用，请重试!");
                        self.addTask.ruleId=null;
                        return;
                    }else{
                        var param={}
                        param.ruleId=ruleId;
                        param.availablePoint = data.data.resp.data.availablePoint;
                        self.jfParamList.push(param)
                    }
                }else{
                    console.log("pointData="+data.message);
                    console.log("pointData="+data.data);
                    alert(data.data.message);
                    return;
                }
            }
        )
    }


    self.getPointCount = function(ruleId){
        var count = "";
        angular.forEach(self.jfParamList,function (each) {
            if(ruleId==each.ruleId){
                count = each.availablePoint;
            }
        })
        return count;
    }

    /**
     * 添加奖励
     */
    self.addReward = function(){
        var param2={};
        if(self.addTask.grantStatus==null ||self.addTask.grantStatus==""){
            alert("请选择发放形式");
            return;
        }
        //会员等级
        var level = null;
        //判断是否按照会员专享
        if(self.addTask.prizeSendRule == null || self.addTask.prizeSendRule == ""){
            alert("请选择发放规则");
            return;
        }else{
            if(self.addTask.prizeSendRule==1){
                if(self.addTask.prizeList.length>=4){
                    alert("普通规则最多可配置4个奖励")
                    return;
                }
            }else if(self.addTask.prizeSendRule==2){
                level = self.addTask.level;
                if(level==null){
                    alert("请选择会员等级");
                    return;
                }
                var count = 0;
                angular.forEach(self.addTask.prizeList,function (each) {
                    if(each.level==level){
                        count++;
                    }
                })
                if(count>=4){
                    alert("同一等级最多配置4个奖励");
                    return;
                }
            }
        }

        if(self.addTask.prizeType==null ||self.addTask.prizeType==""){
            alert("请选择奖励类型");
            return;
        }

        //判断类型为卡券,积分,步值
        if(self.addTask.prizeType==1 || self.addTask.prizeType=='newCoupon' || self.addTask.prizeType=='mallCoupon'){

            if(self.addTask.couponId==null || self.addTask.couponId==""){
                alert("请您输入卡券ID");
                return;
            }
            var param = new Object();
            param.channel = self.addTask.channel;
            param.couponId = self.addTask.couponId;
            param.awardType=self.addTask.prizeType;
            //卡券校验
            var url = globalConfig.basePath + "/prize/getCouponName";
            $http.post(url,param).then(
                function (data) {
                    if(data.data.code == '000'){
                        //卡券名称
                        var name = data.data.resp.couponName;
                        //卡券面值
                        var prizeValue = data.data.resp.discount;
                        //卡券类型
                        var couponTypeName = data.data.resp.couponTypeName;
                        //卡券类型(需要转换)
                        var prizeType = data.data.resp.couponsType;
                        var couponCount=data.data.resp.couponCount;
                        //回显描述
                        if(level==null){
                            var remark ='*'+param.couponId+'-'+couponTypeName+'-'+name+'-'+prizeValue+'-'+couponCount;
                        }else{
                            var remark ='*'+self.levelTransformation(level)+'-'+param.couponId+'-'+couponTypeName+'-'+name+'-'+prizeValue+'-'+couponCount;
                        }

                        param2.couponId = self.addTask.couponId
                        param2.name = name;
                        param2.prizeType = prizeType;
                        param2.prizeValue = prizeValue;
                        param2.remark = remark;
                        //会员等级
                        param2.level = level;
                        //奖励类型为新卡券时，标识卡券来源(0-渠道，1-卡券中台,2商城卡券)
                        if(self.addTask.prizeType=='newCoupon'){
                            param2.couponSource=1;
                        }else if(self.addTask.prizeType=='mallCoupon'){
                            param2.couponSource=2;
                        }else{
                            param2.couponSource=0;
                        }
                        self.addTask.prizeList.push(param2);
                    }else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            )
        }else if(self.addTask.prizeType==2){

                if(self.addTask.ruleId==null ||self.addTask.ruleId=="" ){
                    alert("积分规则ID!");
                    return;
                }

            if(self.addTask.prizeValue==null || self.addTask.prizeValue==""){
                alert("请输入积分值!");
                return;
            }
            if(self.addTask.prizeDesc==null || self.addTask.prizeDesc==""){
                alert("请输入积分描述!");
                return;
            }
            var productChannel=0;
            if(self.addTask.channel == 'QB'){
                productChannel=1;
            }else if(self.addTask.channel == 'WK'){
                productChannel=2;
            }

                $http.get(globalConfig.basePath+"/smart_marketing/initiative/checkPointRuleId?pointRuleId="+self.addTask.ruleId+"&productChannel="+productChannel+"&scene=4").then(
                    function (data) {
                        if (data.data.code=='000'){
                            if (typeof(data.data.resp.data)=="undefined" || data.data.resp.data == null){
                                alert("积分规则不存在，请重试！");
                                self.addTask.ruleId=null;
                                return;
                            }else if (data.data.resp.data.status =='0' || data.data.resp.data.status =='9'){
                                alert("积分规则不在有效期内，请重试！");
                                self.addTask.ruleId=null;
                                return;
                            }else if (data.data.resp.data.status == '2'){
                                alert("该积分规则无法使用，请重试!");
                                self.addTask.ruleId=null;
                                return;
                            }else{


                                param2.jfCount = data.data.resp.data.availablePoint;

                                if(self.addTask.channel == 'QB'){
                                    param2.name = self.addTask.prizeValue+'积分';
                                }else {
                                    param2.name = self.addTask.prizeValue+'空粉币';
                                }
                                param2.couponId = self.addTask.ruleId;
                                param2.prizeDesc = self.addTask.prizeDesc;

                                //积分
                                param2.prizeType = 'point';
                                param2.prizeValue = self.addTask.prizeValue;
                                if(level == null){
                                    param2.remark ='*'+'积分'+'-'+self.addTask.prizeValue;
                                }else{
                                    param2.remark ='*'+self.levelTransformation(level)+'-积分'+'-'+self.addTask.prizeValue;
                                }
                                param2.level = level;
                                self.addTask.prizeList.push(param2);
                            }
                        }else{
                            alert(data.data.message);
                            return;
                        }
                    }
                )
        }else if(self.addTask.prizeType==3){
            if(self.addTask.prizeValue==null || self.addTask.prizeValue==""){
                alert("请输入步值!");
                return;
            }
            if(self.addTask.prizeDesc==null || self.addTask.prizeDesc==""){
                alert("请输入奖励描述!");
                return;
            }
            param2.name = self.addTask.prizeValue+'步数';
            param2.prizeDesc = self.addTask.prizeDesc;
            //步数
            param2.prizeType = 'step';
            param2.prizeValue = self.addTask.prizeValue;
            param2.remark = '*'+'步数'+'-'+self.addTask.prizeValue;
            self.addTask.prizeList.push(param2);
        }else if(self.addTask.prizeType==4){
            if(self.addTask.prizeValue==null || self.addTask.prizeValue==""){
                alert("请填写红包面值");
                return;
            }
            param2.name = self.addTask.prizeValue+'会员回馈金';
            //会员回馈金
            param2.prizeType = 'HKJ';
            param2.prizeValue = self.addTask.prizeValue;
            param2.prizeDesc = self.addTask.prizeValue+'-会员回馈金';
            if(level == null){
                param2.remark = '*'+'会员回馈金'+'-'+self.addTask.prizeValue;
            }else{
                param2.remark ='*'+self.levelTransformation(level)+'-会员回馈金'+'-'+self.addTask.prizeValue;
            }
            param2.level = level;
            self.addTask.prizeList.push(param2);
        } else if(self.addTask.prizeType==51){
            if(self.addTask.prizeValue==null || self.addTask.prizeValue==""){
                alert("请填写黄金豆数量");
                return;
            }
            if(self.addTask.prizeDesc==null || self.addTask.prizeDesc==""){
                alert("请输入奖励描述!");
                return;
            }
            param2.name = self.addTask.prizeValue+'黄金豆';
            //会员回馈金
            param2.prizeType = '51';
            param2.prizeValue = self.addTask.prizeValue;
            param2.prizeDesc = self.addTask.prizeDesc;
            if(level == null){
                param2.remark = '*'+'黄金豆'+'-'+self.addTask.prizeValue;
            }else{
                param2.remark ='*'+self.levelTransformation(level)+'-黄金豆'+'-'+self.addTask.prizeValue;
            }
            param2.level = level;
            self.addTask.prizeList.push(param2);
        }
    }


    self.levelTransformation = function(level){
        var levelName = null;
        switch (level) {
            case '0' :
                levelName = 'lv0普通会员';
                break;
            case '100' :
                levelName = 'lv0普通会员';
                break;
            case '1' :
                levelName = 'lv1白银会员';
                break;
            case '101' :
                levelName = 'lv1白银会员';
                break;
            case '2' :
                levelName = 'lv2黄金会员';
                break;
            case '102' :
                levelName = 'lv2黄金会员';
                break;
            case '3' :
                levelName = 'lv3白金会员';
                break;
            case '103' :
                levelName = 'lv3白金会员';
                break;
            case '4' :
                levelName = 'lv4钻石会员';
                break;
            case '104' :
                levelName = 'lv4钻石会员';
                break;
            case '5' :
                levelName = 'lv5荣耀会员';
                break;
            case '105' :
                levelName = 'lv5荣耀会员';
                break;
        }
        return levelName;
    }

    /**
     * 改变发放形式或者规则删除所有奖励重配
     */
    self.changePrizeList = function(){
        if(self.addTask.prizeList!=null && self.addTask.prizeList.length>0){
            if(confirm("确认更改吗,更改后将重置奖池.是否确定更改?")){
                self.addTask.prizeList=[];
            }
        }
    }

    /**
     * 删除奖励
     * @param prize
     */
    self.deleteReward = function(prize){
        var indexOf = self.addTask.prizeList.indexOf(prize);
        if(confirm("确定要删除吗?")){
            if(indexOf > -1){
                self.addTask.prizeList.splice(indexOf,1);
            }
        }
    }

    /**
     * 适用商品类型选中全部商品
     * @type {number}
     */
    self.productType=0
    self.muTexAll = function () {
        if(self.productType==0){
            self.productType=1;
        }else if(self.productType==1){
            self.productType=0;
        }
        if(self.productType==1){
            $('.versionCheckbox').each(function() {
                $(this).prop("checked",true);
            });
        }else if(self.productType==0){
            $('.versionCheckbox').each(function() {
                $(this).prop("checked",false);
            });
        }

    }

    /**
     *

     */
    self.muTex=function(){
        self.getCateIdCheck();
    }

    /**
     * 获取选中
     */
    self.getCateIdCheck = function(){
        var cateIds ="";
        $('.noAllId').each(function() {
            if (this.checked == true) {
                cateIds += $(this).val() + ",";
            }
        });
        shopTypeCode= cateIds;
        self.getCateType(shopTypeCode);
    }

    /**
     * 查询适用品类
     * @param shopTypeCode
     */
    self.getCateType = function(shopTypeCode){
        var queryUrl = globalConfig.basePath + "/missionCenter/getCategoryList?shopTypeCode="+shopTypeCode;
        $http.get(queryUrl).then(
            function (data) {
                if (data.data.code == '000'){
                    self.aggregationPageUrl =data.data.resp.aggregationPageUrl;
                    self.categoryList = data.data.resp.categoryList;
                    if(''==shopTypeCode){
                        self.allCategoryList = data.data.resp.categoryList;
                    }
                }else {
                    alert("获取适用品类失败")
                }
            }
        );
    }

    /**
     * 组合规则变动
     */
    self.ruleChange = function(param){
        if(param.ruleKey=='limit_bank_product'){
            var queryUrl = globalConfig.basePath + "/missionCenter/getBankDetail";
            $http.get(queryUrl).then(
                function (data) {
                    if (data.data.code == '000'){
                        self.bankDetailList =data.data.resp;
                        self.bankDetail();
                    }else {
                        alert("获取银行详情失败")
                    }
                }
            );
        }
    }

    self.bankDetail = function(){
        self.getbankIdCheck();
    }

    /**
     * 获取bank选中
     */
    self.getbankIdCheck = function(){
        var bankIds ="";
        $('.bankId').each(function() {
            if (this.checked == true) {
                bankIds += $(this).val() + ",";
            }
        });
        bankCodes= bankIds;
        self.getBankProduct(bankCodes);
    }

    self.getBankProduct = function(bankCodes){
        var channel = self.addTask.channel;
        var queryUrl = globalConfig.basePath + "/missionCenter/getBankProduct?channel="+channel+"&bankCodes="+bankCodes;
        $http.get(queryUrl).then(
            function (data) {
                if (data.data.code == '000'){
                    self.bankProductList =data.data.resp;
                    if(''==bankCodes){
                        //用于回显
                        self.bankProductData = data.data.resp;
                    }
                }else {
                    alert("获取银行精选产品失败")
                }
            }
        );
    }




    /**
     * 确认添加任务
     */
    self.saveTask = function(type){
        //任务名称
        if(self.addTask.activityName == null || self.addTask.activityName == ''){
            alert("请填写任务名称");
            return;
        }
        //按钮文字
        if(self.addTask.buttonDesc == null || self.addTask.buttonDesc == ''){
            alert("请填写按钮文字");
            return;
        }
        //按钮类型
        if(self.addTask.buttonType == null || self.addTask.buttonType == ''){
            alert("请填写按钮类型");
            return;
        }else{
            //跳转链接
            if(self.addTask.buttonType==1 || self.addTask.buttonType==3){
                if(self.addTask.channel!='JF_LIFE'){
                    if(self.addTask.go == null || self.addTask.go =='' ){
                        alert("请填写跳转链接跳转链接");
                        return;
                    }
                }
            }else{
                //页面类型
                if(self.addTask.pageOne == null || self.addTask.pageOne =='' ){
                    alert("请填写页面类型");
                    return;
                }
                //跳转页面
                if(self.addTask.pageTwo == null || self.addTask.pageTwo == ""){
                    alert("请填写跳转页面");
                    return;
                }
                self.addTask.go = self.addTask.pageOne+';'+self.addTask.pageTwo;
            }
        }
        //首页气泡简称
        if(self.addTask.channel=='JF_LIFE') {
            if (self.addTask.subTitle == null || self.addTask.subTitle == '') {
                alert("请输入气泡简称")
                return;
            }
        }

        //黑白名单列表
        self.addTask.rosterList=[];
        //黑白名单
        if(self.nameIds == null && self.whiteSelection == null && self.blackSelection == null){
            self.addTask.blackWhiteLimit = 'none';
        }else if(self.nameIds != null && self.whiteSelection != null && self.blackSelection == null){
            if(self.addTask.memberListId==null){
                alert("请选择白名单");
                return;
            }
            self.addTask.blackWhiteLimit = 'white';
            var param = new Object();
            param.rosterCategory = 1;
            param.rosterType = self.addTask.memberListName;
            param.rosterId = self.addTask.memberListId;
            self.addTask.rosterList.push(param);
        }else if(self.nameIds != null && self.whiteSelection == null && self.blackSelection != null){
            if(self.addTask.memberBlackListId==null){
                alert("请选择黑名单");
                return;
            }
            self.addTask.blackWhiteLimit = 'black';
            var param = new Object();
            param.rosterCategory = 2;
            param.rosterType = self.addTask.memberBlackListName;
            param.rosterId = self.addTask.memberBlackListId;
            self.addTask.rosterList.push(param);
        }else if(self.nameIds != null && self.whiteSelection != null && self.blackSelection != null){
            if(self.addTask.memberListId==null){
                alert("请选择白名单");
                return;
            }
            if(self.addTask.memberBlackListId==null){
                alert("请选择黑名单");
                return;
            }
            self.addTask.blackWhiteLimit = 'black_white';
            var param = new Object();
            param.rosterCategory = 1;
            param.rosterType = self.addTask.memberListName;
            param.rosterId = self.addTask.memberListId;
            self.addTask.rosterList.push(param);
            var param1 = new Object();
            param1.rosterCategory = 2;
            param1.rosterType = self.addTask.memberBlackListName;
            param1.rosterId = self.addTask.memberBlackListId;
            self.addTask.rosterList.push(param1);
        }else if(self.nameIds != null && self.whiteSelection == null && self.blackSelection == null){
            alert("请选择名单");
            return;
        }
        var startTime = $('#addTaskStartTime').val();
        var endTime = $('#addTaskEndTime').val();
        // endTime = endTime.substring(0,11)+"23:59:59";
        //任务时间
        if(startTime == null || startTime == ''){
            alert("请选择任务开始时间");
            return;
        }else{
            self.addTask.startTime = strToDate(startTime).getTime();
        }
        if(endTime == null || endTime == ''){
            alert("请选择任务结束时间");
            return;
        }else{
            // endTime = endTime.substring(0,11)+'23:59:59';
            self.addTask.endTime = strToDate(endTime).getTime();
        }
        if(self.addTask.startTime>self.addTask.endTime){
            alert("开始时间不能大于结束时间！");
            return;
        }
        //是否前端展示
        self.addTask.taskShow = $('input:radio[name="isAddViewShow"]:checked').val()

        //完成任务是否推送通知
        self.addTask.pushMessage = $('input:radio[name="isAddPushMessage"]:checked').val()
        //审核人
        if(self.addTask.auditor == null || self.addTask.auditor == ''){
            alert("请选择审核人");
            return;
        }

        //规则判断
        if(self.addTask.ruleList==null || self.addTask.ruleList.size < 1){
            alert('请配置规则');
            return;
        }else{
            var count = 0;
            angular.forEach(self.addTask.ruleList,function (each) {
                if(each.isEssential){
                    count++;
                }
            })
            if(count<1){
                alert('请配置任务完成条件');
                return;
            }
        }

        self.addTask.configKeyList = [];
        var index = 0;
        //活动细则
        $('.taskDetailAdd').each(function(){
            var param = new Object();
            param.configKey = self.addTask.channel + "ZSL" + new Date().getTime()+index;
            param.sort = index;
            param.value = this.value;
            index++;
            self.addTask.configKeyList.push(param);
        })

        //奖励规则
        if(self.addTask.prizeList == null || self.addTask.prizeList.size < 1){
            alert("请配置奖池");
            return;
        }
        if(type==0){
            //添加人
            self.addTask.createUser = globalConfig.loginName;
            //任务id
            self.addTask.activityCode = self.addTask.channel + "ZSL" + new Date().getTime();
        }
        //修改人
        self.addTask.updateUser = globalConfig.loginName;
        //活动类型
        self.addTask.activityType = self.addTask.activityTypes.activityType;
        self.addStruts = 1;
        //添加请求地址
        var url = globalConfig.basePath + "/missionCenter/saveTask";
        $http.post(url,JSON.stringify(self.addTask)).then(
            function (data) {
               if(data.data.code=='000'){
                   alert("操作成功");
                   //显示添加弹窗
                   self.viewPage=1;
                   self.addTask={};
                   //查询初始页
                   self.queryTaskPage(1);
                   self.isUpdate = null;
                   self.addStruts = 0;
                   $('#addTaskStartTime').val('');
                   $('#addTaskEndTime').val('');
                   $('#all').prop("checked",false);
                   $('.mySelect2').select2();
                   $('.mySelect').select2();
                   self.jfParamList = [];
               }else{
                   alert(data.data.message);
                   self.addStruts = 0;
               }
            }, function errorCallback(response) {
                alert("请求失败了....");
                self.addStruts = 0;
            }
        )
    }

    /**
     * 字符串转换为日期对象
     * @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
     */
    this.strToDate = function(dateStr){
        var data = dateStr;
        var reCat = /(\d{1,4})/gm;
        var t = data.match(reCat);
        t[1] = t[1] - 1;
        eval('var d = new Date('+t.join(',')+');');
        return d;
    }

    //版本展示
    self.getRuleValue = function (rule) {
        if (rule.ruleValue === 'T') {
            return '是';
        }
        console.log(rule.ruleValue.indexOf('-'));
        if (rule.ruleValue.indexOf('-') >= 0 && rule.ruleKey!='limit_bank_product') {
            var ruleDesList =null;
            if(self.addTask.channel == 'WK'){
                ruleDesList = self.getWidgetType(rule.ruleKey).parentId.split(";");
            }else {
                 ruleDesList = self.getWidgetType(rule.ruleKey).description.split(";");
            }

            var ruleList = rule.ruleValue.split(",");
            var target = "";
            $.each(ruleDesList, function (n, v) {
                $.each(ruleList,function(i,j){
                    var textStr="";
                    if(j.substring(0, j.lastIndexOf("-"))=='ACTT'){
                        var p =j.split("-");
                        //j=j.substring(0, j.lastIndexOf("-"));
                        j=p[0];
                        textStr=p[1];
                    }
                    if (self.parseRuleKey(v) === j) {
                        if(j=='ACTT'){
                            target = target + v.substring(v.lastIndexOf("-") + 1)+"-"+textStr+"&";
                        }else{
                            target = target + v.substring(v.lastIndexOf("-") + 1)+"&";
                        }
                    }
                })
            });
            target =  target.substring(0,target.lastIndexOf("&"));
            return target;
        }
        if(rule.ruleKey=='limit_bank_product'){
            var target = "";
            var productList = self.bankProductData;
            var bankList = self.bankDetailList;
            if(productList==null || productList.length < 1){
                return rule.ruleValue;
            }
            var resultProductList = rule.ruleValue.split(",");
            var array = [];
            var arrayBankName = "";
            for (var i = 0; i < resultProductList.length; i++) {
                if(resultProductList[i].indexOf('-')>0){
                    var value1 = resultProductList[i].substring(resultProductList[i].indexOf('-')+1);
                    if(value1 == "*"){
                        var bankName = resultProductList[i].substring(0,resultProductList[i].indexOf('-'));
                        for (var j = 0; j <bankList.length ; j++) {
                             if(bankName== bankList[j].bankCode){
                                 arrayBankName += bankList[j].bankName +"-*&";
                             }
                        }
                    }else{
                        array.push(value1);
                    }
                }else{
                    array.push(resultProductList[i]);
                }
            }
            arrayBankName =arrayBankName.substring(0,arrayBankName.length-1);
            $.each(productList, function (n, v) {
                $.each(array,function(i,j){
                    if (v.bankProductId == j) {/*银行产品描述v.description*/
                        target = target + v.productName + "("+v.description +")"+"&";
                    }
                })
            });
            target =  target.substring(0,target.lastIndexOf("&"));
            if(target==null || target == ""){
                return arrayBankName;
            }else{
                if(arrayBankName != ""){
                    return target + "&" +arrayBankName;
                }else{
                    return target;
                }
            }
        }

        if(rule.ruleValue.indexOf(',')>0){
            var ruleDesList = self.allCategoryList;
            var ruleList = rule.ruleValue.split(",");
            var target = "";
            if(ruleDesList!=null && ruleDesList.length>0){
                $.each(ruleDesList, function (n, v) {
                    $.each(ruleList,function(i,j){
                        if (v.categoryId == j) {
                            target = target + v.categoryName +"&";
                        }
                    })
                });
                target =  target.substring(0,target.lastIndexOf("&"));
            }
            if(target==null || target == ""){
                return rule.ruleValue;
            }else{
                return target + arrayBankName;
            }
        }
        return rule.ruleValue;
    };

    /**
     * 修改
     */
    self.modifyDetail = function(param){
        self.addStruts=0;
        var url = globalConfig.basePath+ "/missionCenter/getTaskDetail?activityCode="+param.activityCode;
        $http.get(url).then(
            function (data) {
                if(data.data.code=='000'){
                    //是否修改(0添加，1修改)
                    self.isUpdate = 1;
                    self.addTask={};
                    //规则数组
                    self.addTask.ruleList = [];
                    //规则
                    self.addTask.selectRequirement={};
                    //活动细则
                    self.taskDetailList = [];

                    //奖励列表
                    self.addTask.prizeList=[];
                    self.viewPage=3;
                    //渠道
                    self.addTask.channel = param.channel;
                    if(self.addTask.channel=='JF_LIFE'){
                        self.getCateType('');
                        //气泡简称
                        self.addTask.subTitle = param.subTitle;
                    }
                    //添加任务的类型
                    self.queryTypes(self.addTask.channel);
                    //任务名称
                    self.addTask.activityName = param.activityName;
                    //任务id
                    self.addTask.activityCode = param.activityCode;
                    //查询银行精选
                    self.getBankProduct("");
                    //查询结果
                    var result = data.data.resp;
                    //任务标签
                    self.addTask.taskTag = result.taskTag;
                    //活动描述
                    self.addTask.title = result.title;
                    //按钮文字
                    self.addTask.buttonDesc = result.buttonDesc;
                    //按钮类型
                    self.addTask.buttonType = result.buttonType+'';
                    if(result.buttonType=='1' || result.buttonType=='3'){
                        self.addTask.go = result.go;
                    }else{
                        var jumpPages = [];
                        jumpPages = result.go.split(";");
                        //页面类型
                        self.selectPageOne(self.addTask.channel);
                        self.addTask.pageOne = jumpPages[0];
                        //跳转页面
                        self.selectPageOneByRDict(self.addTask.channel,self.addTask.pageOne,null)
                        self.addTask.pageTwo = jumpPages[1];
                    }

                    //名单处理
                    if('none' == result.blackWhiteLimit){
                        $('#memberListAll').prop("checked",true);
                        $('#memberListWhite').prop("checked",false);
                        $('#memberListBlack').prop("checked",false);

                        //白名单类型
                        self.strategyReload();
                        self.addTask.memberListName = 'NO_RULE';
                        //黑名单类型
                        self.strategyBlackReload();
                        self.addTask.memberBlackListName = 'NO_RULE';
                    }else if('white' == result.blackWhiteLimit){
                        //名单列表
                        var rosterList = result.rosterList;
                        self.nameIds=1;
                        $('#memberListAll').prop("checked",false);
                        $('#memberListWhite').prop("checked",true);
                        $('#memberListBlack').prop("checked",false);
                        self.whiteSelection=1;
                        angular.forEach(rosterList,function (each) {
                            if(each.rosterCategory==1){
                                self.strategyReload();
                                setTimeout(function () {
                                    self.addTask.memberListName = each.rosterType;
                                    self.changeFindChannelGroups();
                                    self.addTask.memberListId = each.rosterId;
                                },500)
                            }
                        })
                        //黑名单类型
                        self.strategyBlackReload();
                        self.addTask.memberBlackListName = 'NO_RULE';
                    }else if('black' == result.blackWhiteLimit){
                        //名单列表
                        var rosterList = result.rosterList;
                        self.nameIds=1;
                        $('#memberListAll').prop("checked",false);
                        $('#memberListWhite').prop("checked",false);
                        $('#memberListBlack').prop("checked",true);
                        self.blackSelection=1;
                        angular.forEach(rosterList,function (each) {
                            if(each.rosterCategory==2){
                                self.strategyBlackReload();
                                setTimeout(function () {
                                    self.addTask.memberBlackListName = each.rosterType;
                                    self.changeBlackFindChannelGroups();
                                    self.addTask.memberBlackListId = each.rosterId;
                                },500)
                            }
                        })
                        //白名单类型
                        self.strategyReload();
                        self.addTask.memberListName = 'NO_RULE';
                    }else if('black_white' == result.blackWhiteLimit){
                        //名单列表
                        var rosterList = result.rosterList;
                        self.nameIds=1;
                        $('#memberListAll').prop("checked",false);
                        $('#memberListWhite').prop("checked",true);
                        $('#memberListBlack').prop("checked",true);
                        self.whiteSelection=1;
                        self.blackSelection=1;
                        angular.forEach(rosterList,function (each) {
                            if(each.rosterCategory==1){
                                self.strategyReload();
                                setTimeout(function () {
                                    self.addTask.memberListName = each.rosterType;
                                    self.changeFindChannelGroups();
                                    self.addTask.memberListId = each.rosterId;
                                },500)
                            }else if(each.rosterCategory==2){
                                self.strategyBlackReload();
                                setTimeout(function () {
                                    self.addTask.memberBlackListName = each.rosterType;
                                    self.changeBlackFindChannelGroups();
                                    self.addTask.memberBlackListId = each.rosterId;
                                },500)
                            }
                        })
                    }

                    //任务时间
                    var startTime = self.dateToString(result.startTime);
                    var endTime = self.dateToString(result.endTime);
                    $('#addTaskStartTime').val(startTime);
                    $('#addTaskEndTime').val(endTime);
                    //任务是否前端展示
                    if(result.taskShow==1){
                        $('#yesIsView').prop('checked',true);
                        $('#noIsView').prop('checked',false);
                    }else{
                        $('#yesIsView').prop('checked',false);
                        $('#noIsView').prop('checked',true);
                    }
                    //任务完成后是否推送通知
                    if(result.pushMessage==1){
                        $('#yesIsPush').prop('checked',true);
                        $('#noIsPush').prop('checked',false);
                    }else{
                        $('#yesIsPush').prop('checked',false);
                        $('#noIsPush').prop('checked',true);
                    }
                    //审核人
                    self.queryAuditorList();
                    self.addTask.auditor = result.auditor;
                    //任务类型
                    self.queryTypes(param.channel);
                    setTimeout(function(){
                        angular.forEach(self.types,function (each) {
                            if(each.activityType == result.activityType ){
                                self.addTask.activityTypes=each;
                                self.changeActivityType(self.addTask.activityTypes);
                                setTimeout(function () {
                                    self.addTask.moduleCode =result.moduleCode;
                                    self.changModuleType(self.addTask.activityTypes,self.addTask.moduleCode);
                                },200)
                            }
                        })
                    },1000)
                    //任务完成条件
                    self.addTask.ruleList = result.ruleList;
                    //活动细则
                    self.taskDetailList = result.configKeyList;
                    //发放形式
                    if(self.addTask.channel != 'JF_LIFE'){
                        self.addTask.grantStatus='2';
                        self.addTask.prizeSendRule='1'
                        self.addTask.prizeType = '1';
                    }else{
                        self.addTask.grantStatus='1';
                        self.addTask.prizeSendRule='1';
                        self.addTask.prizeType = '3';
                    }
                    //发放规则
                    self.addTask.prizeSendRule = result.prizeSendRule+'';
                    //奖励

                        if(null != result.prizeList && result.prizeList.length>0 ){
                            angular.forEach(result.prizeList,function (each) {
                                if (each.prizeType == 'point'){
                                    $.ajax({
                                        url:globalConfig.basePath+"/smart_marketing/initiative/getIntegralId?jfRuleId="+each.couponId,
                                        type:"get",
                                        dataType:"json",
                                        contentType:"text/html;charset=utf-8",
                                        data:each.couponId,
                                        async: false,
                                        success:function (data) {
                                            if (data.code=='000' && data.resp.code=='2000'){
                                                each.jfCount = data.resp.data.availablePoint;
                                            }
                                        }

                                    })
                                }

                            })
                            self.addTask.prizeList = result.prizeList;
                        }




                }else{
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )
    }

    self.queryAuditorList();

//region 白名单操作
    /**
     * 用户策略类型初始化
     */
    self.strategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.addTask.strategyList = data.data.resp;
                    self.addTask.memberListName= "NO_RULE"
                    self.findChannelGroups();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.findChannelGroups = function () {
        var channelCode = null;
        if(self.addTask.channel=='JF_LIFE'){
            channelCode='QB';
        }else{
            channelCode = self.addTask.channel;
        }
        if (self.addTask.memberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
            self.addTask.memberCount=null;
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.addTask.memberListName;
            $http.post(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.addTask.strChannelGroups = data.data.resp;
                        if (self.addTask.strChannelGroups.length > 0) {
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




    /**
     * 查询名单用户数
     */
    self.queryMemberCount = function (type) {
        var userTagCode = null;
        if(1==type){
            userTagCode = self.addTask.memberListId;
        }else{
            userTagCode = self.addTask.memberBlackListId;
        }
        if(null == userTagCode || "" === userTagCode){
            alert("请选择名单");
            return;
        }
        var channelCode = self.addTask.channel;
        var url = globalConfig.basePath + "/abTest/getTagInfo?userTagCode="+userTagCode+"&channelCode="+channelCode;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    if(1==type){
                        self.addTask.memberCount = data.data.resp.rosterCount;
                    }else{
                        self.addTask.memberBlackCount = data.data.resp.rosterCount;
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )

    }

//endregion

//region 黑名单
    /**
     * 用户策略类型初始化
     */
    self.strategyBlackReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.addTask.strategyBlackList = data.data.resp;
                    self.addTask.memberBlackListName= "NO_RULE";
                    self.findBlackChannelGroups();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.findBlackChannelGroups = function () {
        var channelCode = null;
        if(self.addTask.channel=='JF_LIFE'){
            channelCode='QB';
        }else{
            channelCode = self.addTask.channel;
        }
        if (self.addTask.memberBlackListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userBlackNameLikeSearch').hide();
            self.addTask.memberCount=null;
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.addTask.memberBlackListName
            $http.post(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.addTask.strBlackChannelGroups = data.data.resp;
                        if (self.addTask.strBlackChannelGroups.length > 0) {
                            $('#userBlackNameLikeSearch').show();
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
        self.findBlackChannelGroups();
    }

    self.changeBlackFindChannelGroups = function () {
        self.findBlackChannelGroups();
    }
//endregion

//region 查看用戶名單使用(寇)
    self.findDetailChannelGroups = function () {
        var channelCode = null;
        if(self.taskDeatil.channel=='JF_LIFE'){
            channelCode='QB';
        }else{
            channelCode = self.taskDeatil.channel;
        }
        if (self.taskDeatil.rosterList) {
            if (self.taskDeatil.rosterList.length == 1) {
                var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + channelCode + "&rosterType=" + self.taskDeatil.rosterList[0].rosterType;
                if (self.taskDeatil.rosterList[0].rosterCategory == 1) {
                    self.WhiteRoster.rosterId = self.taskDeatil.rosterList[0].rosterId;
                    self.WhiteRoster.rosterType = self.taskDeatil.rosterList[0].rosterType;
                    $http.post(url).then(
                        function (data) {
                            if (data.data.code == '000') {
                                self.taskDeatil.whiteMemberRoster = data.data.resp;
                            } else {
                                alert(data.data.message)
                            }
                        }, function errorCallback(response) {
                            alert("请求失败了....");
                        }
                    )
                } else {

                    self.BlackRoster.rosterId = self.taskDeatil.rosterList[0].rosterId;
                    self.BlackRoster.rosterType = self.taskDeatil.rosterList[0].rosterType;
                    $http.post(url).then(
                        function (data) {
                            if (data.data.code == '000') {
                                self.taskDeatil.blackMemberRoster = data.data.resp;
                            } else {
                                alert(data.data.message)
                            }
                        }, function errorCallback(response) {
                            alert("请求失败了....");
                        }
                    )
                }
            }
            else {
                if (self.taskDeatil.rosterList[0].rosterCategory == 1) {
                    var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + channelCode + "&rosterType=" + self.taskDeatil.rosterList[0].rosterType;
                    self.WhiteRoster.rosterId = self.taskDeatil.rosterList[0].rosterId;
                    self.WhiteRoster.rosterType = self.taskDeatil.rosterList[0].rosterType;
                    $http.post(url).then(
                        function (data) {
                            if (data.data.code == '000') {
                                self.taskDeatil.whiteMemberRoster = data.data.resp;
                            } else {
                                alert(data.data.message)
                            }
                        }, function errorCallback(response) {
                            alert("请求失败了....");
                        }
                    )
                } else {
                    var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + channelCode + "&rosterType=" + self.taskDeatil.rosterList[0].rosterType;
                    self.BlackRoster.rosterId = self.taskDeatil.rosterList[0].rosterId;
                    self.BlackRoster.rosterType = self.taskDeatil.rosterList[0].rosterType;
                    $http.post(url).then(
                        function (data) {
                            if (data.data.code == '000') {
                                self.taskDeatil.blackMemberRoster = data.data.resp;
                            } else {
                                alert(data.data.message)
                            }
                        }, function errorCallback(response) {
                            alert("请求失败了....");
                        }
                    )
                }
                if (self.taskDeatil.rosterList[1].rosterCategory==1){


                    var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + channelCode + "&rosterType=" + self.taskDeatil.rosterList[1].rosterType;
                    self.WhiteRoster.rosterId = self.taskDeatil.rosterList[1].rosterId;
                    self.WhiteRoster.rosterType = self.taskDeatil.rosterList[1].rosterType;

                    $http.post(url).then(
                        function (data) {
                            if (data.data.code == '000') {
                                self.taskDeatil.whiteMemberRoster = data.data.resp;
                            } else {
                                alert(data.data.message)
                            }
                        }, function errorCallback(response) {
                            alert("请求失败了....");
                        }
                    )

                }else {
                    var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + channelCode + "&rosterType=" + self.taskDeatil.rosterList[1].rosterType;
                    self.BlackRoster.rosterId = self.taskDeatil.rosterList[1].rosterId;
                    self.BlackRoster.rosterType = self.taskDeatil.rosterList[1].rosterType;
                    $http.post(url).then(
                        function (data) {
                            if (data.data.code == '000') {
                                self.taskDeatil.blackMemberRoster = data.data.resp;
                            } else {
                                alert(data.data.message)
                            }
                        }, function errorCallback(response) {
                            alert("请求失败了....");
                        }
                    )



                }
            }


        }

        console.log(self.taskDeatil.whiteMemberRoster,"白名单对应的列表");
        console.log(self.taskDeatil.blackMemberRoster,"黑名单对应的列表");
        console.log(self.BlackRoster.rosterId,"黑名单id");
        self.BlackRoster.rosterId = self.BlackRoster.rosterId+"";
        self.WhiteRoster.rosterId = self.WhiteRoster.rosterId+"";
        console.log(self.WhiteRoster.rosterId,"白名单id");
        console.log(self.WhiteRoster.rosterType,"白名单类型");
        console.log(self.BlackRoster.rosterType,"黑名单类型");
    }


    /**
     * 查询用户名单人数
     */
    self.queryDetailCount =function(RosterType){
        var userTagCode = null;
        if (1==RosterType){
            userTagCode = self.WhiteRoster.rosterId;
        }else {
            userTagCode = self.BlackRoster.rosterId;
        }
        var channelCode = self.taskDeatil.channel;
        if (null == userTagCode || "" == userTagCode){
            alert("请选择名单");
            return;
        }
        var url = globalConfig.basePath + "/abTest/getTagInfo?userTagCode="+userTagCode+"&channelCode="+channelCode;
        $http.get(url).then(
            function (data) {
                if(data.data.code == '000'){
                    if (1==RosterType){
                        self.WhiteRoster.rosterCount = data.data.resp.rosterCount;
                    }else{
                        self.BlackRoster.rosterCount = data.data.resp.rosterCount;
                    }
                }else {
                    alert(data.data.message);

                }
            },function errorBack() {
                alert("请求失败了!");
            }
        )
    }
//endregion

}])