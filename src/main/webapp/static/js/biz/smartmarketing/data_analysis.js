'use strict';
// 真正的数据分析
 var a = new Object();
var App = angular.module('data_analysis', [], angular.noop).constant('a', a);
App.controller('data_analysis_controller', ['$scope', '$http', function ($scope, $http){
    var startTime = laydate({
        elem: '#startTimeBe',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime = laydate({
        elem: '#endTimeBe',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })


    var self = $scope;

    self.search = {};
    self.search.channelCode = 'QB';
    //项目数据分析数据量类型（1项目总数据、2每日数据分析）
    self.projectDataAmountType = '1';

    self.projectDataType = '1';
    self.twoList = {};
    self.viewPage ='two';
    self.twoList.productName='';
    self.checkProjectObj = {};
    self.analysisPageProject = {};
    self.action = [];
    self.search.actionteamId = "null";
    self.jsonTest = {};
    smartCommon($scope, $http);



    self.default = function(pageNum){
        var ten = $('#timeStrDiv').val();
        console.log(ten);
        if ($('#dataChannel').val()){
            self.search.channelCode = $('#dataChannel').val();
        }
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        self.viewPage = 'two';
        if (ten){
            self.search.timeStr = ten;
        }


        var url = globalConfig.basePath+"/smart_marketing/data/list";
        $http.post(url,self.search).then(
            function (data) {
                // alert(data);
                console.log("数据分析-项目接口入参：",self.search);
                console.log(data);
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.initiativeList1 = data.data.resp.result;
                    if (self.search.channelCode=='WK'){
                       self.channelName = '悟空理财';
                    }
                    if (self.search.channelCode == 'QB'){
                        self.channelName = '玖富钱包';
                    }

                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    self.defaultTime = function(pageNum){
        var ten = $('#timeStrDiv').val();
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        self.viewPage = 'two';
        if (ten) {
            self.search.timeStr = ten;
        }

        var url = globalConfig.basePath+"/smart_marketing/data/dateAnalysis";
        $http.post(url,self.search).then(
            function (data) {
                // alert(data);
                console.log("数据分析-项目接口入参：",self.search);
                console.log(data);
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.initiativeList1 = data.data.resp.result;

                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }


    self.reset = function () {
        $("#startTimeBe").val(null);
        $("#endTimeBe").val(null);
        $("#startTimeBe1").val(null);
        $("#endTimeBe1").val(null);
        self.search.channelCode = 'QB';
    }


    //导出数据分析
    self.exportDataAnalysis = function(){
    	  var form = $('#conditionForm');
          form.attr("action",globalConfig.basePath + "/smart_marketing/data/data_export");
          form.attr("target","downloadIframe");
          form.submit();
    }

    self.returnT = function(){
        self.search.projectId = null;
        self.defaultTime(1);

        self.viewPage = 'two';
    }

    self.exportAnalysisData = function(){
        // if (!$('#startTimeBe1').val()){
        //     $('#startTimeBe1').val("null");
        // }
        // if (!$('#endTimeBe1').val()){
        //     $('#endTimeBe1').val("null");d
        // }

        if ($('#startTimeBe1').val()&&$('#endTimeBe1').val()&&self.search.actionteamId!="null"&&self.search.actionteamId) {
            window.open(globalConfig.basePath + "/smart_marketing/data/data_export2?projectDataAmountType=" + self.projectDataAmountType + "&projectId=" + self.pId + "&channelCode=" + self.analysisPageProject.channelCode +"&actionteamId=" + self.search.actionteamId + "&startTime=" + $('#startTimeBe1').val() + "&endTime=" + $('#endTimeBe1').val()+"&purpose="+self.analysisPageProject.purpose+"&productType="+self.analysisPageProject.productType+"&timeStr="+$('#timeStrDiv').val());

        }
        if (!$('#startTimeBe1').val()&&!$('#endTimeBe1').val()&&self.search.actionteamId!="null"&&self.search.actionteamId){
            window.open(globalConfig.basePath + "/smart_marketing/data/data_export2?projectDataAmountType=" + self.projectDataAmountType + "&projectId=" + self.pId + "&channelCode=" + self.analysisPageProject.channelCode+"&actionteamId=" + self.search.actionteamId+"&purpose="+self.analysisPageProject.purpose+"&productType="+self.analysisPageProject.productType+"&timeStr="+$('#timeStrDiv').val());
        }
        if ($('#startTimeBe1').val()&&$('#endTimeBe1').val()&&self.search.actionteamId=="null"){
            window.open(globalConfig.basePath + "/smart_marketing/data/data_export2?projectDataAmountType=" + self.projectDataAmountType + "&projectId=" + self.pId + "&channelCode=" + self.analysisPageProject.channelCode+ "&startTime=" + $('#startTimeBe1').val() + "&endTime=" + $('#endTimeBe1').val()+"&purpose="+self.analysisPageProject.purpose+"&productType="+self.analysisPageProject.productType+"&timeStr="+$('#timeStrDiv').val());
        }
        if (!$('#startTimeBe1').val()&&!$('#endTimeBe1').val()&&self.search.actionteamId=="null"){
            window.open(globalConfig.basePath + "/smart_marketing/data/data_export2?projectDataAmountType=" + self.projectDataAmountType + "&projectId=" + self.pId + "&channelCode=" + self.analysisPageProject.channelCode+"&purpose="+self.analysisPageProject.purpose+"&productType="+self.analysisPageProject.productType+"&timeStr="+$('#timeStrDiv').val());
        }
        // var form = $('#conditionForm1');
        // form.attr("action",globalConfig.basePath + "/smart_marketing/data/data_export2");
        // form.attr("target","downloadIframe");
        // form.submit();
    }


    //数据分析-项目 4种情况
    self.listProjectAnalysis = function (pageNum,id) {
        if(self.search.startTime!=null){
            if (self.search.endTime==null){
                alert("起止时间都要输入！");
                return;
            }
        }
        if (self.search.endTime!=null){
            if (self.search.startTime==null){
                alert("起止时间都要输入！");
                return;
            }
        }
        if (id){

        self.search.projectId = id;
        self.productId = id;

        self.checkProject(id);


        }else {
            self.search.projectId = self.productId;
        }
        self.viewPage = 'query';
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount > 0){                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        if ( $("#startTimeBe1").val()!=null &&  $("#startTimeBe1").val()!='') {
            self.search.startTime = $("#startTimeBe1").val();
        }else{
            self.search.startTime = null;
        }
        if ($("#endTimeBe1").val()!=null && $("#endTimeBe1").val()!=''){
            self.search.endTime = $("#endTimeBe1").val();
        }else {
            self.search.endTime = null;
        }

        if (self.search.projectId==""||self.search.projectId=='') {
            self.search.projectId = null;
        }
        if (self.projectDataAmountType == '1'){
            // $('#dl').show();
            // $('#d2').show();
            if (self.projectDataType == '1'){
                var url = globalConfig.basePath + "/smart_marketing/data/list_default";
            }


            if (self.projectDataType == '2'){
                url = globalConfig.basePath +"/smart_marketing/data/defult_reward";
            }
        }
        if (self.projectDataAmountType == '2'){
            if (self.projectDataType == '1') {

                url = globalConfig.basePath + "/smart_marketing/data/daily_data_lend";

            }
            if (self.projectDataType == '2'){
                url = globalConfig.basePath +"/smart_marketing/data/daily_reward_data";
            }
        }
        self.search.purpose = self.analysisPageProject.purpose;
        self.search.productType = self.analysisPageProject.productType;
        setTimeout(function () {
            $http.post(url,self.search).then(
                function (data) {
                    // alert(data);
                    console.log("数据分析-项目接口入参：",self.search);
                    console.log(data);
                    if (data.data.code == '000') {
                        if (data.data.resp.currentPage) {
                            self.search.pageNo = data.data.resp.currentPage;
                        } else {
                            self.search.pageNo = 1;
                        }
                        self.search.pageSize = data.data.resp.pageSize + "";
                        self.search.pageCount = data.data.resp.pageCount;
                        self.search.totalRowSize = data.data.resp.totalRowSize;

                        if (self.projectDataType =='2'){
                            self.initiativeList1 = data.data.resp.result;
                            if (self.initiativeList1) {
                                for (var i = 0; i < self.initiativeList1.length; i++) {
                                    if (self.initiativeList1[i].purposeAmount){
                                        self.initiativeList1[i].purposeAmount=parseFloat(self.initiativeList1[i].purposeAmount).toFixed(2);
                                    }
                                    if (self.initiativeList1[i].purposeCost){
                                        self.initiativeList1[i].purposeCost=parseFloat(self.initiativeList1[i].purposeCost).toFixed(2);

                                    }
                                    if (self.initiativeList1[i].purposeAnnualAmount){
                                        self.initiativeList1[i].purposeAnnualAmount=parseFloat(self.initiativeList1[i].purposeAnnualAmount).toFixed(2);
                                    }
                                    self.pId = self.initiativeList1[0].productId;
                                    self.updateTime = self.initiativeList1[0].updateTime;
                                    self.initiativeList1[i].touchMemberCount = parseInt(self.initiativeList1[i].touchMemberCount);
                                    self.initiativeList1[i].activationMemberCount = parseInt(self.initiativeList1[i].activationMemberCount);
                                    if (self.initiativeList1[i].purposeNum) {
                                        self.initiativeList1[i].purposeNum = parseInt(self.initiativeList1[i].purposeNum);
                                    }
                                }

                            }
                        }else {
                            if (data.data.resp.result){
                            self.initDataList = data.data.resp.result.splice(0,data.data.resp.result.length);
                            console.log("initData",self.initDataList);
                            console.log(self.initDataList,"初始化数据");
                            self.titleProperty = self.initDataList[0];
                            self.initDataList = self.initDataList[1];
                                self.pId = self.initDataList[0].productId;
                            // self.titleProperty = JSON.parse(self.titleProperty);
                                self.dataResultArray = {
                                    touchContent: new Array()
                                };
                                var oneData = [];


                                   for (var i = 0;i < self.initDataList.length;i++){
                                       oneData = [];
                                       for (var key in self.titleProperty){
                                       for (var key1 in self.initDataList[i]){
                                           if (key == key1){
                                               oneData.push(self.initDataList[i][key1])
                                           }
                                       }

                                   }
                                       self.dataResultArray.touchContent[i] = oneData;
                               }
                                console.log("获取到结果数据",self.dataResultArray);
                            console.log(self.titleProperty);
                            // console.log(self.initiativeList1,"获取达到的数据和对象");
                            }else{
                                alert("接口返回数据为空!");
                            }
                        }
                        if (self.projectDataAmountType == '1'){
                            // $('#dl').show();
                            // $('#d2').show();
                            if (self.projectDataType == '1'){
                                $('#cjordinary').show();
                                $('#cjdaily').hide();
                                $('#jldaily').hide();
                                $('#jlordinary').hide();
                            }


                            if (self.projectDataType == '2'){
                                $('#jldaily').hide();
                                $('#jlordinary').show();
                                $('#cjordinary').hide();
                                $('#cjdaily').hide();
                            }
                        }
                        if (self.projectDataAmountType == '2'){
                            if (self.projectDataType == '1') {

                                $('#cjordinary').show();
                                $('#cjdaily').hide();
                                $('#jldaily').hide();
                                $('#jlordinary').hide();


                            }
                            if (self.projectDataType == '2'){
                                $('#jldaily').show();
                                $('#jlordinary').hide();
                                $('#cjordinary').hide();
                                $('#cjdaily').hide();
                            }
                        }

                    } else {
                        alert(data.data.message);
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        },1000)


    }


    self.gotoDetail = function(id){
        var url = globalConfig.basePath + "/smart_marketing/initiative/detail?id=" + id;
        $http.post(url,id).then(
            function (data) {
                // alert(data);
                console.log("主动营销详情 data:");
                console.log(data);
                if (data.data.code == '000') {
                    data.data.resp.auditUserId = data.data.resp.auditUserId + "";
                    self.checkProjectObj = data.data.resp;
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
        console.log(self.checkProjectObj, 'checkProjectObj ...');
        self.listUserNameList("QB", "RULE_GROUP");
        self.viewPage = 'check';

    }

    self.listRunLog = function (pageNo, projectId) {
        // alert(pageNo + projectId);
        // projectId = 55;
        // pageNo = 1;
        if (!pageNo) {
            pageNo = 1;
            self.searchExe.pageNo = pageNo;
        } else {
            if (pageNo > self.searchExe.pageCount && self.searchExe.pageCount > 0) {
                self.searchExe.pageNo = self.searchExe.pageCount;
            } else {
                self.searchExe.pageNo = pageNo;
            }
        }
        // alert(self.searchExe.pageNo);
        var url = globalConfig.basePath + "/smart_marketing/initiative/execute_log?pageNo=" + pageNo + "&projectId=" + projectId;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            console.log("执行记录查询。。。");
            console.log(data);
            if (data.data.code == '000') {
                if (data.data.resp.currentPage) {
                    self.searchExe.pageNo = data.data.resp.currentPage;
                } else {
                    self.searchExe.pageNo = 1;
                }
                self.searchExe.pageSize = data.data.resp.pageSize + "";
                self.searchExe.pageCount = data.data.resp.pageCount;
                self.searchExe.totalRowSize = data.data.resp.totalRowSize;
                self.executeLogList = data.data.resp.result;
                $('#showRunLog').show();
            } else {
                alert(data.data.message);
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("查询失败了....");
        });
    }

    self.load = function () {
       if (self.viewPage == 'two'){
           self.default();
       }


       if (self.viewPage=='query') {
           self.search.channelCode = 'QB';
           self.search.channelName = "玖富钱包";
           self.listProjectAnalysis(1);
       }


       setTimeout(function () {
           var timeStr = $('#timeStrDiv').text();
           // alert("timeStr " + timeStr);
           if (timeStr) {
               // alert("进入 if");
               self.search.timeStr = timeStr;
               self.defaultTime(1);
           }else {
               self.default(1);
           }
       }, 10);
    }




    self.reset1 = function () {
        self.search.projectId = null;
        self.search.projectName = null;
        $("#startTimeBe").val(null);
        $("#endTimeBe").val(null);
        $("#startTimeBe1").val(null);
        $("#endTimeBe1").val(null);
        self.search.channelCode = 'QB';


    }
    self.listUserNameList = function (channelCode, userGroupType) {
        // alert("查用户分组名单数据, channel: " + channelCode);
        var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + channelCode + "&rosterType=" + userGroupType;
        $http.post(url).then(
            function (data) {
                console.log("ll 查用户分组名单数据 ", data);
                if (data.data.code == '000') {
                    self.userNameListList = data.data.resp;
                    console.log("userNameListList 赋值后。。", self.userNameListList);
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询用户分组名单数据，请求失败了 lala ....");
            }
        );

    }

    self.queryfxList = function(pageNo){

        if (!pageNo) {
            pageNo = 1;
            self.search.pageNo = pageNo;
        } else {
            if (pageNo > self.search.pageCount && self.searchExe.pageCount > 0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNo;
            }
        }
        if ($('#startTimeBe').val()!=null&&$('#startTimeBe').val()!=""){

            self.search.startTime = $('#startTimeBe').val()
        }else {
            self.search.startTime = null;
        }
        if ($('#endTimeBe').val()!=null&&$('#endTimeBe').val()!=""){
            self.search.endTime = $('#endTimeBe').val()
        }else {
            self.search.endTime = null;
        }
        var url = globalConfig.basePath + "/smart_marketing/data/list";
        console.log(self.search);
        $http.post(url,self.search).then(
            function (data) {

                if (data.data.code == '000') {
                    self.initiativeList1 = data.data.resp.result;
                    self.channelName = self.search.channelCode=='QB'?"玖富钱包":"悟空理财";
                    console.log(self.initiativeList1);
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("查询项目分析失败了 lala ....");
            }
        );


    }

    $scope.load();


    self.checkProject = function (id) {
        var url = globalConfig.basePath + "/smart_marketing/initiative/detail?id=" + id;
        $.ajax({
            type: "post",
            url: url,
            data:id,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code == '000') {
                    self.analysisPageProject = data.resp;
                    self.checkProjectObj =data.resp;
                    for (var i = 0 ;i<data.resp.actionGroups.length;i++){
                        self.action[i] = data.resp.actionGroups[i];
                    }
                    console.log(self.action, '动作组下拉框数组');
                    console.log(self.analysisPageProject, '数据分析页查出的project对象');
                }else {
                    alert(data.message)
                }
            }

        })
        // $http.post(url).then(
        //     function (data) {
        //         if (data.data.code == '000') {
        //             self.analysisPageProject = data.data.resp;
        //             self.checkProjectObj =data.data.resp;
        //             for (var i = 0 ;i<data.data.resp.actionGroups.length;i++){
        //                 self.action[i] = data.data.resp.actionGroups[i];
        //             }
        //             console.log(self.action, '动作组下拉框数组');
        //             console.log(self.analysisPageProject, '数据分析页查出的project对象');
        //         } else {
        //             alert(data.data.message);
        //         }
        //     }, function errorCallback(response) {
        //         alert("请求失败了....");
        //     }
        // );
    }

}]);