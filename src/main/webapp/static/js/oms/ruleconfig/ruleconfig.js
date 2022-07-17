var filePath;

'use strict';// 严谨模式
var App = angular.module('rulerconfigAPP', [], angular.noop);
App.controller('rulerconfigController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};
    self.search.pageSize = 20;
    self.search.channelCode = "QB";
    // 新增
    self.add = {};
    self.operationType = '1';
    // 分组明细
    self.mince = {};
    self.uploadChannel = null;
    //添加智能服务策略
    self.toUpdate = {};
    self.strategy = 'smart';
    self.toUpdate.aioActionStrategyDtoPara = {};
    self.toUpdate.aioTouchWayDtoPara = {};
    self.add.tabel1 = {};
    self.add.tabel1.IS_EFFECT = 0;
    self.add.reward = {};
    self.black = {};
    self.black.channelCode = 'QB';
    self.black.rosterId = null;
    self.uploadWay = null;
    //
    self.file = null;
    self.addblack = {};
    self.addblack.uploadContent = {};
    self.addblack.upType = '0';
    self.addblack.dataType = 'memberId';
    self.addblack.channelCode = 'QB';
    self.updateMember = {};
    self.detailMember = {};
    self.upWay = null;
    self.reloadMeber = {};
    self.dataType = '1';

    var startTime = laydate({
        elem: '#upTime2',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    })

    var endTime = laydate({
        elem: '#downTime2',
        istime: true,
        format: 'YYYY-mm-DD hh:mm:ss',
        event: 'click'
    });
    self.querySplashConfigList = function (pageNum) {
        if ($('#qd').val()!=='NO_CHANNEL'){
            self.search.channelCode = $('#qd').val();
        }
        if (!pageNum) {
            self.search.pageNo = self.page.pageNo;
        } else {
            if (pageNum > self.search.pageCount) {
                if (self.search.pageCount == 0) {
                    self.search.pageNo = 1;
                } else {
                    self.search.pageNo = self.search.pageCount;
                }
            } else {
                self.search.pageNo = pageNum;
            }
        }
        var url = globalConfig.basePath + "/ruleConfigAddDetail/FindGroupsList";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data, "名单列表");
                    self.search.pageNo = data.data.resp.currentPage;
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.totalRowSize % self.search.pageSize == 0 ? parseInt(data.data.resp.totalRowSize / self.search.pageSize) : (parseInt(data.data.resp.totalRowSize / self.search.pageSize) + 1);
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.splashConfigList = data.data.resp.result;
                    self.channelCodeMember = self.splashConfigList[0].channelCode + "";
                    console.log(self.channelCodeMember, "渠道显示");
                    $('#qd').val("NO_CHANNEL");

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };


    // 默认查询
    self.loading = function () {
        self.search.productChannel = "0";
        self.search.pageSize = "5";
        self.search.channelCode = "QB"
        self.querySplashConfigList(1);
        self.operationType = 0;
    }

    // 打开弹窗
    self.addOpenRulerConfig = function () {
        self.operationType = 1;
        self.add.channelCode = "WK";
        self.add.rosterType = "1";

    }

    self.reloadMember = function(){
        self.reloadMeber.rosterId = self.rosterId.toString();
        self.reloadMeber.channelCode = self.channelCode;
        self.reloadMeber.rosterName = self.rosterName;
        self.reloadMeber.rosterTypeName = self.rosterTypeName;
        self.reloadMeber.dataType = self.CoditionDataType;
        if (self.reloadMeber.rosterTypeName=='智能画像'){
            self.reloadMeber.rosterType = '1';
        }
        if (self.reloadMeber.rosterTypeName == '用户名单'){
            self.reloadMeber.rosterType = '2';

        }
        self.reloadMeber.createUser = self.createUser;
        self.reloadMeber.conditionGroup = self.ownRules;
        $http.post(globalConfig.basePath+"/ruleConfigAddDetail/updateMember",JSON.stringify(self.reloadMeber)).then(
            function (data) {
                console.log(data,"更新名单返回值");
                if (data.data.code=='000'){
                    alert("更新成功!");
                    $('#RuleUpdate').hide();
                    self.querySplashConfigList(1);
                }
            }
        )

    }


    /**
     * 确定更新来源为文件上传的名单
     */
    self.updateCommit = function(){
        if (!self.updateMember.rosterName){
              alert("名单名称不能为空!");
              return;
        }
        if (!$('#uploadTo').val()){
            alert("上传方式不能为空!");
            return;
        }
        if (document.getElementById("upOne").checked == true){
            self.updateMember.uploadMode = 1;
        }
        if (document.getElementById("upTwo").checked == true){
            self.updateMember.uploadMode = 2;
        }
        var file = $("#upfile")[0].files[0];
        if(file == null){
            alert("请先选择需要上传的文件");
            return;
        }

        var maskingDiv=`<div id="maskingDiv" style="width: 100%;height:100%;background-color: black;opacity:0.7;position:fixed;top:0px;left:0px;z-index: 10000;">
		<span style="color: white;position:fixed;top:50%;left:50%;font-size: 20px">正在上传...</span>
	</div>`;
        $("body").prepend(maskingDiv);
        self.updateMember.uploadWay = $('#uploadTo').val();
        if (self.updateMember.channel=='QB'){
            self.updateMember.channelName = 'QB';
        }
        if (self.updateMember.channel=='SC'){
            self.updateMember.channelName = 'SC';
        }
        if (self.updateMember.channel=='WK'){
            self.updateMember.channelName = 'WK';
        }
        var fileName=file.name;
        var type=fileName.substr(fileName.lastIndexOf("."));
        if(type!=".csv"){
            alert("只支持csv文件");
            return;
        }
        if (document.getElementById("upno").checked == true){
            self.updateMember.isRepeat = 2;
        }
        if (document.getElementById("upyes").checked == true){
            self.updateMember.isRepeat = 1;
        }
        var formData = new FormData();
        formData.append("channelName",self.updateMember.channelName);
        formData.append("file", file);
        formData.append("channelCode", self.updateMember.channel);
        formData.append("uploadType",self.updateMember.uploadWay);
        formData.append("isRepeat",self.updateMember.isRepeat);
        formData.append("rosterName", self.updateMember.rosterName);
        formData.append("createUser", globalConfig.userName);
        formData.append("updateMode",self.updateMember.uploadMode);
        formData.append("rosterId",self.updateMember.rosterId);
        $.ajax({
            type: "post",
            url: globalConfig.basePath+"/ruleConfig/importUserList",
            async: true,
            cache: false,
            data: formData,
            contentType: false,//由于提交的对象是FormData,所以要在这里更改上传参数的类型
            processData: false,//提交对象是FormData,不需要对数据做任何处理
            success: function (data) {
                $("#maskingDiv").remove();
                alert(data.message);
                if(data.code=="000"){
                    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
                    var $scope = angular.element(appElement).scope();
                    $scope.search.channelCode=self.updateMember.channel;
                    $scope.querySplashConfigList(1);

                    $("#updateShow").hide();
                    $("#upfile").val("");
                    self.updateMember = {};
                }
            }
        });


    }




    /**
     * 更新来源为文件上传的名单
     * @param rosterId
     */
    self.updateMebmerRoster = function (rosterId) {
        if (rosterId) {
           $('#updateShow').show();

          $http.post(globalConfig.basePath+"/ruleConfigAddDetail/getMemberInfo2",rosterId).then(
              function (data) {
                  console.log(data,"名单信息返回数据");
                  if (data.data.code=='SUCCESS'){

                  self.updateMember = data.data.data;
                  if (self.updateMember.isRepeat!=null && self.updateMember.isRepeat!="") {
                      document.getElementById("upOne").checked = true;
                      $('#upyes').attr("disabled",false);
                      $('#upno').attr("disabled",false);
                      if (self.updateMember.isRepeat == 1) {
                          document.getElementById("upyes").checked = true;
                          document.getElementById("upno").checked = false;
                      } else {
                          document.getElementById("upyes").checked = false;
                          document.getElementById("upno").checked = true;
                      }
                  }
                      self.updateMember.rosterId = rosterId;
                  }
              }

          )

        } else {
            alert("此条数据的名单id为空!");
            return;
        }


    }

    /**
     * 更新名单点击补充上传
     */
    self.supplementUpload = function(isDisable){
        if (isDisable==1) {
                $('#upyes').attr("disabled", false);
                $('#upno').attr("disabled", false);
        }else {

            if (self.updateMember.isRepeat == 1) {
                document.getElementById("upyes").checked = true;
                document.getElementById("upno").checked = false;
                $('#upyes').attr("disabled",true);
                $('#upno').attr("disabled",true);

            } else {
                document.getElementById("upyes").checked = false;
                document.getElementById("upno").checked = true;
                $('#upyes').attr("disabled",true);
                $('#upno').attr("disabled",true);
            }
        }
    }


    /**
     * 黑名单列表
     */
    self.queryBlackList = function (pageNum) {

        for (var i = 2; i <= 10; i++) {
            $('#context-' + i).hide();
        }
        document.getElementById('1').className = 'OK';

        if (!pageNum) {
            self.black.pageNo = 1;
        } else {
            if (pageNum > self.black.pageNo && self.black.pageCount > 0) {
                self.black.pageNo = self.black.pageCount;
            } else {
                self.black.pageNo = pageNum;
            }
        }
        if (!self.black.pageNo) {
            self.black.pageSize = '5';

        }
        self.operationType = 6;
        console.log(self.black, "页面入参");
        var url = globalConfig.basePath + "/ruleConfig/blacklist";
        $http.post(url, JSON.stringify(self.black)).then(
            function (data) {
                self.shenheren();
                console.log(data, "页面返回数据");
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.black.pageNo = data.data.resp.currentPage;
                    } else {
                        self.black.pageNo = 1;
                    }
                    self.black.pageSize = data.data.resp.pageSize + "";
                    self.black.pageCount = data.data.resp.pageCount;
                    self.black.totalRowSize = data.data.resp.totalRowSize;
                    self.BlackList = data.data.resp.result;
                    console.log(self.shenheList, "审核人所有信息");
                    if (!self.BlackList) {
                        alert("返回数据为空!");
                        return;
                    } else {
                        for (var i = 0; i < self.shenheList.length; i++) {
                            for (var y = 0; y < self.BlackList.length; y++) {
                                if (self.shenheList[i].key == self.BlackList[y].createuser) {
                                    self.BlackList[y].createuser = self.shenheList[i].value;
                                }
                            }
                        }
                    }

                }
            }, function errorCallback(data) {
                alert(data.data.message);
            }
        );
    }

    /**
     * 关闭添加黑名单
     */
    self.close = function () {

        $('#addBlackShow').hide();
    }

    /**
     * 添加黑名单
     */
    self.addBlackList = function () {
        $('#addBlackShow').show();
    }


    self.RuleList = function(channelCode,dataType) {
        console.log("查数据类型",dataType);
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode=" + channelCode+"&dataType="+dataType,
            async: false,
            dataType: "json",
            success: function (userData) {
                console.log(userData, "所有的规则");
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.initSelectDataList = userData.resp.data;
                console.log("所有的数据",self.initSelectDataList);
            }

        })
    }



    /**
     * 导出用户id
     */
    self.exportMemberId = function (MemberId,channelCode){
        if (channelCode=='钱包渠道'){
             channelCode = 'QB';
        }
        if (channelCode=='玖富商城'){
            channelCode = 'SC';
        }
        if (channelCode=='悟空渠道'){
            channelCode = 'WK';
        }
       window.open(globalConfig.basePath+"/ruleConfigAddDetail/exportMemberId?MemberId="+MemberId+"&channelCode="+channelCode);
    }
    /**
     * 黑名单查询条件重置
     */
    self.resetAttributes = function(){
        self.black.channelCode = 'QB';
        self.black.rosterName = '';
        self.black.memberId = '';
        self.black.mobile = '';
        self.black.state = 0;
    }



    /**
     * 查看所有名单类型
     */
    self.checkRosterTypeList = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.strategyList = data.data.resp;

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    self.checkRosterTypeList();

    /**
     * 跳转用户画像添加页面
     * @constructor
     */
    self.goToAddUserMember = function(){
        window.location.href=globalConfig.basePath+"/ruleConfigIndex/newNameList?dataType="+self.dataType;

    }


   self.ReCreate = function(){
      window.location.href=globalConfig.basePath+"/ruleConfigIndex/newNameList?rosterId="+self.rosterId+"&channelCode="+self.channelCode+"&dataType="+self.CoditionDataType;



   }


    /**
     * 查看条件规则
     */
    self.checkRules = function(MemberId,channelCode,rosterTypeName,rosterName,createUser,isUpdate,dataType) {
        console.log("传进来的dataType",dataType);
        self.CoditionDataType = dataType;
        if (isUpdate && isUpdate == 2){
            $('#RuleUpdate').show();
        }else {
            $('#RuleShow').show();
        }
        if (channelCode == '悟空渠道') {
            channelCode = 'WK';
        }
        if (channelCode == '钱包渠道') {
            channelCode = 'QB';
        }
        if (channelCode == '玖富商城') {
            channelCode = 'SC';
        }
        if (channelCode == '三方渠道') {
            channelCode = 'SF'
        }

        self.rosterId = MemberId;
         self.channelCode = channelCode;
         self.rosterTypeName = rosterTypeName;
         self.rosterName = rosterName;
         self.createUser = createUser;

        self.RuleList(channelCode,dataType);
        if (MemberId) {
            $http.get(globalConfig.basePath + "/ruleConfigAddDetail/queryMemberRosterRules?MemberId=" + MemberId).then(
                function (data) {

                    if (data.data.code == '000') {
                        $('#ruleToShow').html(null);
                        $('#ruleUpdateShow').html(null);
                        console.log(data, "查询条件list");
                        self.ownRules = data.data.resp.data.conditionGroup;
                        self.updateTime = data.data.resp.data.updateDate;
                        self.detailRules = '';
                        for (var i = 0; i < data.data.resp.data.conditionGroup.length; i++) {
                            for (var y = 0; y < data.data.resp.data.conditionGroup[i].length; y++) {
                                for (var x = 0;x < self.initSelectDataList.length;x++){
                                if (self.initSelectDataList[x].english==data.data.resp.data.conditionGroup[i][y].queryName){

                                    data.data.resp.data.conditionGroup[i][y].queryName=self.initSelectDataList[x].chinese;
                                    for (var t = 0;t < self.initSelectDataList[x].list.length;t++){
                                        if (data.data.resp.data.conditionGroup[i][y].queryCriteria == self.initSelectDataList[x].list[t].code){
                                            data.data.resp.data.conditionGroup[i][y].queryCriteria = self.initSelectDataList[x].list[t].value;
                                        }
                                    }
                                }
                                

                        }

                                if (y == data.data.resp.data.conditionGroup[i].length - 1 && y==0){
                                    self.detailRules = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ data.data.resp.data.conditionGroup[i][y].queryName + data.data.resp.data.conditionGroup[i][y].queryCriteria + data.data.resp.data.conditionGroup[i][y].queryValue + "<br/>";
                                    if (isUpdate && isUpdate == 2) {
                                        $('#ruleUpdateShow').append(self.detailRules)
                                    } else {
                                        $('#ruleToShow').append(self.detailRules);
                                    }
                                }else {
                                    if (y==0) {
                                        self.detailRules = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "(" + (parseInt(y) + 1) + data.data.resp.data.conditionGroup[i][y].queryName + data.data.resp.data.conditionGroup[i][y].queryCriteria + data.data.resp.data.conditionGroup[i][y].queryValue + "<br/>";
                                        if (isUpdate && isUpdate == 2) {
                                            $('#ruleUpdateShow').append(self.detailRules)
                                        } else {
                                            $('#ruleToShow').append(self.detailRules);
                                        }
                                    }
                                    if (y !=data.data.resp.data.conditionGroup[i].length - 1 && y!=0){
                                        self.detailRules = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ (parseInt(y) + 1) +data.data.resp.data.conditionGroup[i][y].queryName + data.data.resp.data.conditionGroup[i][y].queryCriteria + data.data.resp.data.conditionGroup[i][y].queryValue + "<br/>";
                                        if (isUpdate && isUpdate == 2) {
                                            $('#ruleUpdateShow').append(self.detailRules)
                                        } else {
                                            $('#ruleToShow').append(self.detailRules);
                                        }
                                    }
                                    if (y == data.data.resp.data.conditionGroup[i].length - 1 && y != 0) {
                                        self.detailRules = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + (parseInt(y) + 1) + data.data.resp.data.conditionGroup[i][y].queryName + data.data.resp.data.conditionGroup[i][y].queryCriteria + data.data.resp.data.conditionGroup[i][y].queryValue + ")" + "<br/>";
                                        if (isUpdate && isUpdate == 2) {
                                            $('#ruleUpdateShow').append(self.detailRules)
                                        } else {
                                            $('#ruleToShow').append(self.detailRules);
                                        }
                                    }
                                }
                            if (y == data.data.resp.data.conditionGroup[i].length - 1 && i != data.data.resp.data.conditionGroup.length - 1) {
                                self.detailRules = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+" and "+"<br>";
                                if (isUpdate && isUpdate==2){
                                    $('#ruleUpdateShow').append(self.detailRules)
                                }else {
                                    $('#ruleToShow').append(self.detailRules);
                                }
                            } else {
                                if (y < data.data.resp.data.conditionGroup[i].length - 1) {
                                    self.detailRules = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+" or "+"<br>";
                                    if (isUpdate && isUpdate==2){
                                        $('#ruleUpdateShow').append(self.detailRules)
                                    }else {
                                        $('#ruleToShow').append(self.detailRules);
                                    }
                                }
                            }

                        }
                        }

                    } else {
                        alert(data.data.message);

                    }
                }
            )
        }
    }


    /**
     * 点击新增名单
     */
    self.addMember = function(){
        $('#Realtime').show();
    }

    /**
     * 关闭新增名单弹窗
     */
    self.closeRealTimePortrait = function(){
        $('#Realtime').hide();
    }

    /**
     * 黑名单分组查询
     */
    self.blackGroup = function(channelCode){
        var url = globalConfig.basePath+"/ruleConfig/blackGroup?channelCode="+channelCode+"&rosterType=BLACK_LIST";
        $http.get(url).then(
            function (data) {
                if (data.data.code=='000'){
                    console.log(data,"黑名单分组信息");

                    if (data.data.resp.data) {
                        self.blackGroupList = data.data.resp.data;
                        self.black.rosterId = data.data.resp.data[0].rosterId+"";
                    }else {
                        alert("查询黑名单分组,分组返回数据为空!");
                        return;
                    }

                }else {
                    alert("接口返回不成功");
                }

            }
        )

    }

    // 默认查询
    self.loading();
    // 新增名单
    self.addRulerConfigxxx=function(){
        self.operationType = 1;
        self.channelCode="WK";
        // var baseCtx =$("#baseCtx").val();
        var baseCtx =$("#baseCtx").val();
        var url = baseCtx+"/ruleConfigAddDetail/addSubgroup";
        $http.post(url,self).then(
            function(data){
                if(data.data.code=='000'){
                    if(data.data.resp.success){

                    }else{
                        alert(data.data.resp.message)
                    }
                    $scope.pageList = data.data.resp.data;
                    $scope.total = data.data.resp.totalRowSize;
                    $scope.pages = data.data.resp.pageCount;
                    // if($scope.pages<pageNum);
                    // $scope.search.pageNum = $scope.pages;
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }

    // 返回值
    self.upBanck = function(){
        $(".continuationTypeInfoBox").removeAttr("checked");
        self.operationType = 0;
        $(".continuationTypeInfoBox").attr("checked",false);
    }

    // 分组细分
    self.rulerConfigDeatil=function(flage){
        if(!self.mince.channelCode){
            self.mince.channelCode="WK";
        }
        if(flage){
            self.operationType = flage;
        }
        self.minceListCount = 0;
        self.minceListRest=0;
        var url = globalConfig.basePath+"/ruleConfigAddDetail/querySubList";
        $http.post(url,self.mince).then(
            function(data){
                if(data.data.code=='000'){
                    if(data.data.resp.success){
                        self.minceList = data.data.resp.data;
                        self.mince.rosterId="";
                        // 清空数据
                        self.minceListCount = 0;
                        self.minceListRest=self.minceListCount;
                        console.log(self.minceListRest,"可分配数量");
                        $('.divBox-wrap').html('');
                        //
                        //$('.conduct-select-test').selectMania("clear");
                        // 测试下拉框样式
                        var QueryCriteriaList="<option value='' checked>--请选择--</option>";
                        for(var j=0;j<self.minceList.length;j++){
                            QueryCriteriaList+="<option value='"+self.minceList[j].rosterId+"'>"+self.minceList[j].rosterName+"</option>"
                        }
                        $('.conduct-select-test').empty();
                        $('.conduct-select-test').html(QueryCriteriaList);
                        if(flage){
                            $('.conduct-select-test').selectMania({
                                size: 'small',
                                themes: ['square'],
                                placeholder: 'Please select me!',
                                removable: false,
                                search: true,
                            });
                            $('.conduct-select-test').selectMania("update");
                        }else{
                            $('.conduct-select-test').selectMania("update");
                        }

                    }else{
                        alert(data.data.resp.message)
                    }
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    // 查询分组名单数量接口
    self.namelistNumber=function(){
        if(!self.mince.channelCode){
            self.mince.channelCode="WK";
        }
        // 初始化可分配数量
        self.minceListCount=0;
        self.minceListRest=self.minceListCount;
        if(!$('#rosterId').val()){
            alert("请选择分组");
            return false;
        }
        self.mince.rosterId = $('#rosterId').val();
        var url = globalConfig.basePath+"/ruleConfigAddDetail/querySubListCount";
        $http.post(url,self.mince).then(
            function(data){
                var channelCode =self.mince.channelCode;
                var rosterId =self.mince.rosterId;
                // 清空之前的分组model数据,并初始化数据
                self.mince={channelCode:channelCode,rosterId:rosterId};
                $('.divBox-wrap').html('');
                self.minceListCount = 0;
                if(data.data.code=='000'){
                    console.log(data,"分组可配置数量查询");
                    if(data.data.resp.success){
                        self.minceListCount = data.data.resp.data.number;
                        self.minceListRest=self.minceListCount;
                    }else{
                        alert(data.data.resp.message)
                    }
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }




    // 保存数据
    self.saveFenzuData=function(){
        if(!self.mince.channelCode){
            self.mince.channelCode="WK";
        }

        if(!self.mince.rosterId){
            alert("选择分组不能为空");
            return false;
        }

        self.mince.grouplist=[];
        var list=[];
        var falge=false;
        // 分组明细
        $('.divBox').each(function() {
            var obj={};
            var sonRosterName = $(this.children).children(".bot-gorop-name").children("input[name='fzhuName']").val();
            var sonRosterCount = $(this.children).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
            obj.sonRosterName=sonRosterName;
            obj.sonRosterCount=sonRosterCount;
            if(sonRosterCount<=0){
                alert("子分组名称:"+sonRosterName+" 的数量大于0的正整数");
                falge=true;
                return false;
            }
            list.push(obj);
        });
        if(list.length<=0){
            alert("请添加子分组");
            return false;
        }
        self.mince.grouplist=list;
        self.mince.rosterCount=self.minceListCount;
        if(falge){
            return false;
        }
        if(self.minceListRest<0){
            alert("可分配的数必须大于0");
            return false;
        }

        var url = globalConfig.basePath+"/ruleConfigAddDetail/addSubgroup";
        $http.post(url,self.mince).then(
            function(data){
                if(data.data.code=='000'){
                    if(data.data.resp.success){
                        alert(data.data.resp.message)
                        self.minceListCount = 0;
                        self.mince={channelCode:"WK"};
                        self.operationType==0;
                        self.loading();
                    }else{
                        alert(data.data.resp.message)
                    }
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }

    /**
     * 调用接口查询策略敏感度
     * @type {{}}
     */
    self.analysis={}
    self.showAnalysis = function (param,type) {
        self.operationType = 3;
        if(type==0){
            self.analysis=param;
            self.analysis.feature='1';
            self.analysis.strategyType='0';
            self.analysis.type=type;
            self.changeSensitivity(type);
        }else{
            $('#tanShow').hide();
            if("QB"==self.tanChannel){
                self.analysis.channelCode = "钱包渠道";
            }if("SC"==self.tanChannel){
                self.analysis.channelCode = "玖富商城";
            }else{
                self.analysis.channelCode = "悟空渠道";
            }
            self.analysis.rosterName = '全部用户';
            self.analysis.rosterTypeName = '-';
            self.analysis.feature='1';
            self.analysis.strategyType='0';
            self.analysis.type=type;
            self.changeSensitivity(type);
            self.queryUserCount(self.tanChannel);
        }
        self.showCharts();

    }

    /**
     * 查询全部用户数
     */
    self.queryUserCount = function (channel) {
        $http.get(globalConfig.basePath + "/ruleConfigAddDetail/queryUserCount"+"?channel="+channel).success(
            function(data) {
                if(data.code=='000'){
                    self.analysis.rosterCount = data.resp;
                }else{
                    alert(data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        )
    }

    self.returnHome = function () {
        self.operationType = 0;
        self.analysis={};
    }

    /**
     * 策略敏感度查询
     */
    self.changeSensitivity = function () {
        self.select={};
        if("悟空渠道" == self.analysis.channelCode){
            self.select.channel = 'WK';
        }else if("钱包渠道" == self.analysis.channelCode){
            self.select.channel = 'QB';
        }else if("玖富商城" == self.analysis.channelCode){
            self.select.channel = 'SC';
        }else{
            alert("数据异常");
            return;
        }
        // self.select.feature = self.analysis.feature
        self.select.strategyType = self.analysis.strategyType;
        if(self.analysis.type==0){
            self.select.rosterId = self.analysis.rosterId;
        }
        var url = globalConfig.basePath+"/ruleConfigAddDetail/selectSensitivity";
        $http.post(url,self.select).then(
            function(data){
                if(data.data.code=='000'){

                    self.sensitivityList = data.data.resp.result;
                    console.log(self.sensitivityList,"策略敏感度");
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //三期--策略敏感度--创建分组
    self.createGroup=function(arg){
        // 渠道
        var channelCode=self.tanChannel;
        //特征类型   例如：会员等级
        var featureType=arg.featureType;
        //特征      例如：LV0
        var feature=arg.feature;
        var url=globalConfig.basePath+"/ruleConfigIndex/newNameList?feature="+feature+"&channel="+channelCode+"&featureType="+featureType+"&dataType="+1;
        location.href=url;
    };

    self.showTZFX = function () {
        $('#tanShow').show();
        self.tanChannel='WK';
    }

    self.closeTZFX = function () {
        $('#tanShow').hide();
    }

    self.showCharts = function () {
        if(self.analysis.feature==1 || self.analysis.feature==6){
            $('#container').hide();
            $('#containerBar').show();
            self.showPieCharts();
        }else{
            $('#containerBar').hide();
            $('#container').show();
            self.showBarCharts();
        }
    }

    /**
     * 柱状图
     */
    self.showBarCharts = function () {
        self.pie={};
        self.pie.featureType = self.analysis.feature;
        if("悟空渠道" == self.analysis.channelCode){
            self.pie.channel = 'WK';
        }else if("钱包渠道" == self.analysis.channelCode){
            self.pie.channel = 'QB';
        }else if("玖富商城" == self.analysis.channelCode){
            self.pie.channel = 'SC';
        }else{
            alert("数据异常");
            return;
        }
        if(self.analysis.type==0) {
            self.pie.rosterId = self.analysis.rosterId;
        }
        var url = globalConfig.basePath+"/abTest/selectFeature";
        $http.post(url,self.pie).then(
            function(datas){
                if(datas.data.code=='000'){
                    var chart = {
                        type: 'column'
                    };
                    var typeName="";
                    if(self.analysis.feature==2){
                        typeName="年龄";
                    }else if(self.analysis.feature==3){
                        typeName="手机号地区";
                    }else if(self.analysis.feature==4){
                        typeName="出借次数";
                    }else if(self.analysis.feature==5){
                        typeName="出借期限偏好";
                    }else if(self.analysis.feature==7){
                        typeName="推广渠道";
                    }else if(self.analysis.feature==8){
                        typeName="来源渠道";
                    }else if(self.analysis.feature==9){
                        typeName="可用卡券数";
                    }
                    var title = {
                        text: "用户在不同"+typeName+"的分布"
                    };
                    var subtitle = {
                        text: ''
                    };
                    /**拼装图饼数据-开始*/
                    var names = [];
                    var values = [];
                    for(var i = 0;i<datas.data.resp.result.length;i++){
                        names.push(datas.data.resp.result[i].feature);
                        var param={};
                        param.y=parseInt(datas.data.resp.result[i].featureNum);
                        param.total=parseInt(datas.data.resp.result[i].featureRate*100);
                        values.push(param);
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
                    var tooltip = {
                        headerFormat: '<span style="font-size:10px;color:{series.color};padding:0">{series.name}:</span>' +
                            '<span>{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">人数: </td>' +
                            '<td style="padding:0"><b>{point.y}&nbsp&nbsp </b></td>' +
                            '<td style="color:{series.color};padding:0">占比: </td>' +
                            '<td style="padding:0"><b>{point.total}% </b></td></tr>',
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

                    var series= [{
                        name: typeName,
                        data: values
                    }];

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
            }
        )
    }


    /**
     * 显示饼图
     */
    self.showPieCharts = function () {
        self.pie={};
        self.pie.featureType = self.analysis.feature;
        if("悟空渠道" == self.analysis.channelCode){
            self.pie.channel = 'WK';
        }else if("钱包渠道" == self.analysis.channelCode){
            self.pie.channel = 'QB';
        }else if("玖富商城" == self.analysis.channelCode){
            self.pie.channel = 'SC';
        }else{
            alert("数据异常");
            return;
        }
        if(self.analysis.type==0) {
            self.pie.rosterId = self.analysis.rosterId;
        }
        var url = globalConfig.basePath+"/abTest/selectFeature";
        $http.post(url,self.pie).then(
            function(datas){
                if(datas.data.code=='000'){
                    var chart = {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    };
                    var typeName="";
                    if(self.analysis.feature==1){
                        typeName="性别";
                    }else if(self.analysis.feature==6){
                        typeName="会员等级";
                    }
                    var title = {
                        text: "用户在不同"+typeName+"的分布"
                    };
                    var tooltip = {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%({point.y})</b>'
                    };
                    var plotOptions = {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %({point.y})',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    };
                    /**拼装图饼数据-开始*/
                    var strs = [];
                    for(var i = 0;i<datas.data.resp.result.length;i++){
                        var pieValue=[];
                        pieValue.push(datas.data.resp.result[i].feature);
                        pieValue.push(parseInt(datas.data.resp.result[i].featureNum));
                        strs.push(pieValue);
                    }
                    /**拼装图饼数据-结束*/
                    var series= [{
                        type: 'pie',
                        name: '占比',
                        data: strs
                    }];
                    var json = {};
                    json.chart = chart;
                    json.title = title;
                    json.tooltip = tooltip;
                    json.series = series;
                    json.plotOptions = plotOptions;
                    $('#containerBar').highcharts(json);
                }else{
                    alert(data.data.message)
                }
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }




//==============================================MADE IN KOUWEI=========================================================================

    self.openNewPage = function(){
        window.open(globalConfig.basePath);
    }


    /**
     * 下载模板
     */
    self.downloadTemplate = function(){
        var url = globalConfig.basePath+"/ruleConfig/exportTemplate";
        window.open(url);

    }



    /**
     * 点击确定上传
     */
    self.commitRecord = function() {


        if (self.addblack.upType == '0') {
            self.addBlackReturn = {};

            if (self.addblack.dataType == 'memberId') {
                self.addblack.memberIdList = [];
                self.addblack.mobileList = [];
                for (var i = 1; i <= 10; i++) {
                    if ($('#'+i).val()) {
                        self.addblack.memberIdList.push($('#'+i).val());
                    } else {
                        break;
                    }
                }
                console.log(self.addblack.memberIdList,"黑名单数据");
                if(self.addblack.memberIdList == null || self.addblack.memberIdList.length==0){
                    alert("请录入用户ID数据");
                    return false;
                }
            } else {
                self.addblack.memberIdList = [];
                self.addblack.mobileList = [];
                for (var i = 1; i <= 10; i++) {
                    if ($('#'+i).val()) {
                        self.addblack.mobileList.push($('#'+i).val());
                    } else {
                        break;
                    }
                }
                console.log(self.addblack.mobileList,"黑名单数据");
                if(self.addblack.mobileList == null || self.addblack.mobileList.length==0){
                    alert("请录入用户手机号数据");
                    return false;
                }
            }
            self.addblack.createUser = globalConfig.loginName;
            var url = globalConfig.basePath + "/ruleConfig/shoudong";
            $('#showStart4').show();
            $http.post(url, self.addblack).then(
                function (data) {
                    $('#showStart4').hide();
                    if (data.data.code == '000') {
                        console.log(data, "上传文件返回的数据");

                        self.addBlackReturn.failNumber = data.data.resp.data.failNumber;
                        self.addBlackReturn.successNumber = data.data.resp.data.successNumber;
                        self.addBlackReturn.uploadNumber = data.data.resp.data.uploadNumber;
                        $('#zong').text(self.addBlackReturn.uploadNumber);
                        $('#success').text(self.addBlackReturn.successNumber);
                        $('#fail').text(self.addBlackReturn.failNumber);
                        $('#addBlackShow').hide();
                        $('#showStart3').show();

                    }
                }
            )


        } else {
            self.addBlackReturn = {};
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
            self.addblack.channelCode = self.addblack.channelCode;
            self.addblack.createUser = globalConfig.loginName;
            $('#showStart4').show();
            $.ajaxFileUpload({
                url: globalConfig.basePath + '/ruleConfig/parseFileToJson?'+ $.param(self.addblack), //你处理上传文件的服务端
                secureuri: false,
                fileElementId: 'memberFile',
                success: function (data) {
                    console.log(data,"上传黑名单返回内容");
                    $('#showStart4').hide();
                    var str = $(data).find("body").text();//获取返回的字符串
                    var json = $.parseJSON(str);
                    console.log(json,"文件上传返回值对象");
                    if (json.code=='000'){

                        self.addBlackReturn.failNumber = json.resp.data.failNumber;
                        self.addBlackReturn.successNumber = json.resp.data.successNumber;
                        self.addBlackReturn.uploadNumber = json.resp.data.uploadNumber;

                        $('#zong').text(self.addBlackReturn.uploadNumber);
                        $('#success').text(self.addBlackReturn.successNumber);
                        $('#fail').text(self.addBlackReturn.failNumber);
                        $('#addBlackShow').hide();
                        $('#showStart3').show();
                    }
                },
                error: function (errorRespon) {
                    console.info(errorRespon);
                    alert("文件上传失败");
                }
            });


        }
    }

    /**
     * 下载失败名单
     */
    self.downLoadFailMember = function(){

        window.open(globalConfig.basePath+"/ruleConfig/downfailMember");

    }


    /**
     * 黑名单管理生效失效
     */
    self.validOrInvalid = function(memberId,state){
        self.memberId = memberId;
        if (state == '有效'){
            self.state = 2;
        }
        if (state == '无效'){
            self.state = 1;
        }
        if ($('#IS').text()=="生效"){
            $('#showStart').show();
        } else {
            $('#showStart2').show();
        }


    }

    /**
     * 确认生效或失效
     */
    self.confirmEffectiveOrInvalid = function(){
        var url = globalConfig.basePath+"/ruleConfig/EffectivemeberList?id="+self.memberId+"&state="+self.state;
        $http.get(url).then(
            function (data) {
                console.log(data);
                if (data.data.code == '000'){
                    alert("操作成功!");
                    $('#showStart2').hide();
                    $('#showStart').hide();
                    self.queryBlackList(1);
                } else {
                    alert("操作失败!");
                    $('#showStart2').hide();
                    $('#showStart').hide();
                }
            },function error(data) {

                alert("请求失败!");

            }

        )


    }

    /**
     * 生成服务策略
     */
    self.showCreateServiceStrategyPage = function (id) {
        self.smartServiceOrAbTestId = id;
        document.getElementById("createStrategy").style.display = 'block';

    }

    /**
     * 进入创建服务策略
     */
    self.createServiceStrategy = function () {
        if (self.strategy == 'smart'){
            document.getElementById("createStrategy").style.display = 'none';
            self.operationType = 4;
            self.addService(self.smartServiceOrAbTestId);

        } else {
            document.getElementById("createStrategy").style.display = 'none';
            self.operationType = 5;
            var param={
                'strategyId':self.smartServiceOrAbTestId,
                'channel': function () {
                    if (self.analysis.channelCode == '悟空渠道') {
                        return 'WK';
                    } else if (self.analysis.channelCode == '玖富商城') {
                        return 'SC';
                    } else {
                        return 'QB';
                    }
                }
            }
            self.$broadcast('generationStrategyAbTest',param);
        }
    }

    /**
     * 关闭创建服务策略页面
     */
    self.closeCreateServiceStrategyPage = function () {
        document.getElementById("createStrategy").style.display = 'none';
        self.strategy = 'smart';
    }
    self.blackGroup("QB");
    /**
     * 黑名单管理
     */
    self.blackManage = function(){
        self.operationType = 6;

        self.queryBlackList(1);

    }

    $scope.selectPageOne = function () {
        var type = '';
        if (self.analysis.channelCode == '悟空渠道') {
            type = 17;
        }
        if (self.analysis.channelCode == '钱包渠道') {
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
                alert("请求失败了....");
            }
        );

    };

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
                alert("请求失败了....");
            }
        );

    }

    self.selectPageOneforUpdate = function (x) {
        var type = '';
        if (self.analysis.channelCode == '悟空渠道') {
            type = 17;
        }
        if (self.analysis.channelCode == '钱包渠道') {
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
                alert("请求失败了....");
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
                alert("请求失败了....");
            }
        );

    }

    self.selectChannelGroup = function (x) {
        self.pie = {};
        if("悟空渠道" == self.analysis.channelCode){
            self.pie.channel = 'WK';
        }else if("钱包渠道" == self.analysis.channelCode){
            self.pie.channel = 'QB';
        }else if("玖富商城" == self.analysis.channelCode){
            self.pie.channel = 'SC';
        }else{
            alert("数据异常");
            return;
        }
        if (self.toUpdate.aioActionStrategyDtoPara.userTagType == 'NO_RULE') {
            $('#userNameLikeSearch1').hide();
        } else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode=" + self.pie.channel + "&rosterType=" + self.toUpdate.aioActionStrategyDtoPara.userTagType;
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
                    alert("请求失败了....");
                }
            )
        }
    }

    //审核人列表
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

    self.rosterTypeSelect = function (x) {


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
                alert("请求失败了....");
            }
        );
    };

    /**
     * 是配置触发策略
     * @param rad
     */
    self.radioChange = function (rad,updateNumber) {
        if (rad == "0") {
            self.add.tabel1.selectParamList = [];
            self.add.tabel1.textParamList = [];
            self.add.tabel1.numberParamList = [];
            $('#yesInputConfig').prop('checked', false);
            $("#noConfig").prop('checked', true);
            self.add.tabel1.IS_EFFECT = 0;
        } else {
            $('#noConfig').prop('checked', false);
            $("#yesInputConfig").prop('checked', true);
            self.add.tabel1.IS_EFFECT = 1;
        }
        self.add.tabel1.IS_EFFECT = rad + '';
        if (self.add.tabel1.IS_EFFECT == 1) {
            self.queryOkDeploy(updateNumber);
        }
    }

    //查看名单类型
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
                alert("请求失败了....");
            }
        );
    };

    self.selectexpectedStatus = function () {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=9")
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectExpectedStatus = data.data.resp;

                    }
                    else {
                        alert(data.data.message);

                    }
                }
            )
    }

    /**
     * 查询可配置策略
     */
    self.queryOkDeploy = function (updateNum) {
        self.add.tabel1.selectParamList = [];
        self.add.tabel1.textParamList = [];
        self.add.tabel1.numberParamList = [];

        var url = globalConfig.basePath + "/operation/init/byKey?node=" + self.toUpdate.aioActionStrategyDtoPara.touchCode;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    var result = data.data.resp;
                    //所有的头list
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
                            console.log(self.add.tabel1.numberParamList, "数字触发条件");

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
                alert("请求失败了....");
            }
        );
    }

    self.selectToNodeCode = function (userActionCode) {
        $http.get(globalConfig.basePath + "/operation/init/byKey?type=1&code=" + userActionCode)
            .then(
                function (data) {
                    console.log(data);
                    if (data.data.code == '000') {
                        self.selectNodeCode = data.data.resp;
                    }
                    else {
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
                    }
                    else {
                        alert(data.data.message);

                    }
                }
            )

    }
    self.addService = function (strategyId) {

        self.selectexpectedStatus();
        self.toUpdate = {};
        var url = globalConfig.basePath + "/strategy/detail?strategyId=" + strategyId;

        $http.get(url).then(
            function (data) {
                console.log(data, "回显全部数据");
                if (data.data.code == '000') {

                    self.toUpdate.aioActionStrategyDtoPara = data.data.resp.strategyDto;

                    self.toUpdate.aioTouchWayDtoPara = data.data.resp.touchWayDto;
                    var yuansheng = data.data.resp.touchWayDto.parentContentDTO;
                    self.toUpdate.approverId = data.data.resp.approverId;
                    self.toUpdate.approverNote = data.data.resp.approverNote;
                    self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto = [];
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
                    self.selectPageOneforUpdate(1);
                    self.shenheren();
                    self.rosterTypeSelect(1);
                    self.selectToNodeCode(self.toUpdate.aioActionStrategyDtoPara.userActionCode);
                    self.selectToResultType();


                    for (var i = 0; i < self.toUpdate.aioActionStrategyDtoPara.touchStrategyList.length; i++) {
                        if (self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[i].attrKey == 'IS_EFFECT') {
                            self.add.tabel1.IS_EFFECT = self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[i].attrValue;
                            break;
                        }
                    }

                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition = [];
                    self.radioChange(self.toUpdate.aioActionStrategyDtoPara.touchStrategyList[i].attrValue, 1);
                    self.viewPage = 'update';


                    if (!self.toUpdate.aioActionStrategyDtoPara.userTag) {
                        self.toUpdate.aioActionStrategyDtoPara.userTag = null;
                    }


                    console.log(self.add.tabel1.numberParamList, "收到的数组");

                    $('#appover').val(self.toUpdate.approverNote);
                    $('#approverId').val(self.toUpdate.approverId);
                    self.checkRosterTypeSelect();


                } else {
                    alert(data.data.message);
                }
            }
        )


    }


    //==================================================================
    self.addCount1 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('2').className = 'OK';
            $('#context-2').show();
        }

    }
    self.addCount2 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('3').className = 'OK';
            $('#context-3').show();
        }
    }
    self.addCount3 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('4').className = 'OK';
            $('#context-4').show();
        }
    }
    self.addCount4 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('5').className = 'OK';
            $('#context-5').show();
        }
    }
    self.addCount5 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('6').className = 'OK';
            $('#context-6').show();
        }
    }
    self.addCount6 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('7').className = 'OK';
            $('#context-7').show();
        }
    }
    self.addCount7 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('8').className = 'OK';
            $('#context-8').show();
        }
    }
    self.addCount8 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
        }else{
            document.getElementById('9').className = 'OK';
            $('#context-9').show();
        }
    }
    self.addCount9 = function(){
        if ($('.OK').length==9){
            alert("最多只能添加10个!");
            return;
        }else{
            document.getElementById('10').className = 'OK';
            $('#context-10').show();
        }
    }
    self.addCount10 = function(){
        alert("最多只能添加10个!");
        return;
    }

    self.lessCount1 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('1').className = 'look-start-2';
            $('#context-1').hide();
            $('#1').val(null);
        }


    }
    self.lessCount2 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('2').className = 'look-start-2';
            $('#context-2').hide();
            $('#2').val(null);
        }
    }
    self.lessCount3 = function(){
        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('3').className = 'look-start-2';
            $('#context-3').hide();
            $('#3').val(null);
        }
    }
    self.lessCount4 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('4').className = 'look-start-2';
            $('#context-4').hide();
            $('#4').val(null);
        }
    }
    self.lessCount5 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('5').className = 'look-start-2';
            $('#context-5').hide();
            $('#5').val(null);
        }
    }
    self.lessCount6 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('6').className = 'look-start-2';
            $('#context-6').hide();
            $('#6').val(null);
        }
    }
    self.lessCount7 = function(){

        if ($('.OK').length == 1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('7').className = 'look-start-2';
            $('#context-7').hide();
            $('#7').val(null);
        }
    }
    self.lessCount8 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('8').className = 'look-start-2';
            $('#context-8').hide();
            $('#8').val(null);
        }
    }
    self.lessCount9 = function(){

        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('9').className = 'look-start-2';
            $('#context-9').hide();
            $('#9').val(null);
        }
    }
    self.lessCount10 = function(){
        if ($('.OK').length==1){
            alert("最少要添加一个!");
            return;
        }else{
            document.getElementById('10').className = 'look-start-2';
            $('#context-10').hide();
            $('#10').val(null);
        }
    }





    //===================================================================



    self.commitUpdate = function(){
        self.toUpdate.aioActionStrategyDtoPara.strategyId = null;
        if (self.toUpdate.aioTouchWayDtoPara.touchWay=='BANNER'){
            if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.bannerContentDto.bannerBtnUrlType=='PRIMORDIAL'){
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.bannerContentDto.pageType = self.add.pageType;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.bannerContentDto.primordialPage = self.add.jumpPage;
            }
        }
        if (self.toUpdate.aioTouchWayDtoPara.touchWay == 'SOFT_POPUP'){
            if (self.toUpdate.aioTouchWayDtoPara.parentContentDTO.softPopupContentDto.skipType=='PRIMORDIAL'){
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.softPopupContentDto.pageType = self.add.pageType;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.softPopupContentDto.primordialPage = self.add.jumpPage;

            }
        }
        if(self.toUpdate.aioTouchWayDtoPara.touchWay == 'PUSH'){
            if(self.toUpdate.aioTouchWayDtoPara.parentContentDTO.pushContentDto.skipType == 'PRIMORDIAL'){
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.pushContentDto.pageType = self.add.pageType;
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.pushContentDto.primordialPage= self.add.jumpPage;
            }
        }
        // "touchCountType":'NATUREDAY',						    //限制配置：1个自然日内最多触发
        //     "status":"UNAUDITED",
        //     "invalidTime":$('#upTime').val(),
        //     "validTime":$('#downTime').val(),
        self.toUpdate.aioActionStrategyDtoPara.touchCountType = 'NATUREDAY';
        self.toUpdate.aioActionStrategyDtoPara.invalidTime = $('#downTime2').val();
        self.toUpdate.aioActionStrategyDtoPara.validTime = $('#upTime2').val();
        self.toUpdate.aioActionStrategyDtoPara.status = "UNAUDITED";
        console.log(self.toUpdate);
        if (self.add.tabel1.numberParamList&&self.add.tabel1.numberParamList.length>0){
            for(var i = 0;i<self.add.tabel1.numberParamList.length;i++){
                for (var x = 0; x < self.add.tabel1.numberParamList[i].list.length;x++){
                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
                        "strategyConditionKey":self.add.tabel1.numberParamList[i].list[x].key,
                        "strategyConditionValue":$('#'+"up"+self.add.tabel1.numberParamList[i].list[x].key).val()
                    })
                }

            }
        }
        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
            "strategyConditionKey":"IS_EFFECT",
            "strategyConditionValue":self.add.tabel1.IS_EFFECT
        })

        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
            "strategyConditionKey":"SUM_TIME_COUNT_TYPE",
            "strategyConditionValue":"NATUREDAY"
        })
        self.toUpdate.aioActionStrategyDtoPara.strategyCondition.push({
            "strategyConditionKey":"SUM_TIME_COUNT",
            "strategyConditionValue":'1'
        })
        console.log(self.toUpdate.aioActionStrategyDtoPara.strategyCondition,"策略条件");
        if ("悟空渠道" == self.analysis.channelCode){
            self.qudao = 'WK';
        }if ("玖富商城" == self.analysis.channelCode){
            self.qudao = 'SC';
        }else {
            self.qudao = 'QB';
        }
        self.toUpdate.aioActionStrategyDtoPara.channel = self.qudao;
        self.toUpdate.aioTouchWayDtoPara.parentContentDto = self.toUpdate.aioTouchWayDtoPara.parentContentDTO;
        console.log(self.toUpdate,"查看修改的数据");
        $http.post(globalConfig.basePath+"/smartStrategy/insert", JSON.stringify(self.toUpdate)).then(
            function (data) {
                if (data.data.code == '000') {
                    console.log(data);
                    alert("添加成功!");
                    self.toUpdate.aioActionStrategyDtoPara.strategyCondition = [];
                    self.toUpdate = {};
                    self.operationType = 3;


                }else {
                    alert(data.data.message);
                }
            }, function errorCallback(data) {
                alert("请求异常!");
            }
        );


    }
//==============================================以下为多奖励======================================================
    //查询卡券信息
    $scope.getCoupon = function (channel, couponId,awardType) {
        var param = new Object();
        param.channel = channel;
        param.couponId = couponId;
        param.awardType = awardType;
        var url = globalConfig.basePath + "/prize/getCouponName";
        var promise = $http.post(url, param);
        return promise.then(function (resut) {
            // var response = resut.data;
            // var total = response.otherData[0];
            // params.total(total);
            // return response.data;
            if (resut.data.code == '000') {
                // $scope.add.name = data.data.resp.couponName;
                //$scope.add.faceValue = data.data.resp.discount;
                // $scope.search.couponId=null;
                // $scope.search.prizeType=null;
                // $scope.search.channel=null;
                // alert("成功啦啦啦 卡券");
                console.log("调commonjs 的查卡券方法返回: ", resut);
                self.tempCoupon = resut.data.resp;
                return resut.data.resp;
            }else{
                alert(resut.data.message);
                return;
            }
        });
    }


    /**
     * 生效
     * @param x
     */
    self.confirmshixiao = function(){



    }

    /**
     *
     * @param x
     */
    self.confirmshengxiao = function(){

    }

    self.commitAddAction = function (x) {

        console.log(x);


        if (x.awardType == 'JIFEN') {
            x.awardDesc = "积分-" + x.awardContent;
        }
        setTimeout(function () {
            self.qd = '';
            if ("悟空渠道" == self.analysis.channelCode) {
                self.qd = 'WK'
            } if ("玖富商城" == self.analysis.channelCode) {
                self.qd = 'SC'
            }else {
                self.qd = 'QB';
            }
            var length = self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto.length;
            if (x.awardType == 'JIFEN') {
                self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto[length] = {
                    "awardType": x.awardType,
                    "awardContent": x.awardContent,
                    "jiFenDesc": x.jiFenDesc,
                    "awardDesc": x.awardDesc,
                    "openCardHelp": '0'
                }

            }
            else {
                self.getCoupon(self.qd, x.awardContent,x.awardType);
                setTimeout(function () {

                    // console.log("返回值处卡券 setTimeOut 内 coupon：", coupon);
                    console.log("setTImeOut内 Coupon: ", $scope.tempCoupon);
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
            console.log(self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto);
            self.add.reward = {};
            $scope.$apply();
        }, 1000);
    };




    self.addAction = function () {

        document.getElementById("s").style.display = "block";

    };
    self.deleteAction = function (award,updateNumber) {
        if (updateNumber == '1'){
            var indexOf = self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto.indexOf(award);
            if (confirm('确定要删除吗?')) {
                if (indexOf > -1) {
                    self.toUpdate.aioTouchWayDtoPara.parentContentDTO.awardContentDto.splice(indexOf, 1);
                }
            }
        } else {
            var indexOf = self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto.indexOf(award);
            if (confirm('确定要删除吗?')) {
                if (indexOf > -1) {
                    self.add.aioTouchWayDtoPara.parentContentDto.awardContentDto.splice(indexOf, 1);
                }
            }
        }
    }

    /**
     * 返回
     */
    self.$on('returnTable1',function () {
        self.operationType=3;
        self.querySplashConfigList(1);
    })

}]);



// **************************************************************************
// ************************ 分组明细 ************************************
// **************************************************************************

var count=0;
//\点击修改的时候
var inpVal1;
var inpVal2;
var initElement = `<div class="divBox">
				      <div class="bot-gorop">
				        <div class="bot-gorop-name">
				          <input type="text" value="分组`+count+`" name="fzhuName" />
				        </div>
				        <div class="bot-gorop-moun" >
				            <input type="text" value="0" name="fzhuNameValue" onblur="fzuOnblur(this)"  onfocus="fzuOnfocus(this)" onchange="fzuOnblur(this)"  />
				        </div>
				        <div class="togShow1 togHide">
				        		<span class="top-modify"  onclick="fzuEdit(this)">修改</span>
				        		<span class="remove" onclick="fzuDele(this)">删除</span>
				        	</div>
				        	<div class="togShow2 " >
				        		<span class="save" onclick="fzuSave(this)">保存</span>
				        		<span class="bot-modify"  onclick="fzuCancle(this)">取消</span>
				        	</div>
				      </div>
			  	</div>`;


function fzuCancle(x){
    let inp1 = $(x).parent().parent().find('.bot-gorop-name input').val()
    let inp2 = $(x).parent().parent().find('.bot-gorop-moun input').val()
    if (inp1 == '' || inp2 == '' || inp1 == 0 || inp2 == 0) {
        $(x).parents('.divBox').remove()
    } else {
        $(x).parent().parent().find('.togShow2').addClass('togHide')
        $(x).parent().parent().find('.togShow1').removeClass('togHide')
        $(x).parent().parent().find('.bot-gorop-name input').attr("disabled",true);
        $(x).parent().parent().find('.bot-gorop-moun input').attr("disabled",true);
        $(x).parent().parent().find('.bot-gorop-name input').addClass('inpHide')
        $(x).parent().parent().find('.bot-gorop-moun input').addClass('inpHide')
        $(x).parent().parent().find('.bot-gorop-name input').val(inpVal1)
        $(x).parent().parent().find('.bot-gorop-moun input').val(inpVal2)
    }

}



/**
 * 上传黑名单
 */
function importOpenMemberData(){

    var xlsfile = $("#memberFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    $("#updateMemberFileInput").val(xlsfilename);

};




// 删除
function fzuDele(x){
    var sonRosterName = $(x.parentNode.parentNode).children(".bot-gorop-name").children("input[name='fzhuName']").val();
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    if(sonRosterCount>0){
        anglarjsscope.minceListRest=parseInt(anglarjsscope.minceListRest)+parseInt(sonRosterCount);
        anglarjsscope.$apply();
    }
    $(x).parents('.divBox').remove()

}

// 修改
function fzuEdit(x){
    inpVal1 = $(x).parent().parent().find('.bot-gorop-name input').val()
    inpVal2 = $(x).parent().parent().find('.bot-gorop-moun input').val()
    $(x.parentNode.parentNode).children(".bot-gorop-name").children("input[name='fzhuName']").attr("readonly",false);
    $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").attr("disabled",false);
    $(x).parent().parent().find('.togShow2').removeClass('togHide')
    $(x).parent().parent().find('.togShow1').addClass('togHide')
    $(x).parent().parent().find('.bot-gorop-name input').attr("disabled",false);
    $(x).parent().parent().find('.bot-gorop-moun input').attr("disabled",false);
    $(x).parent().parent().find('.bot-gorop-name input').removeClass('inpHide')
    $(x).parent().parent().find('.bot-gorop-moun input').removeClass('inpHide')

}

// 保存
function fzuSave(x){

    var sonRosterName = $(x.parentNode.parentNode).children(".bot-gorop-name").children("input[name='fzhuName']").val();
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    let inp1 = $(x).parent().parent().find('.bot-gorop-name input').val()
    let inp2 = $(x).parent().parent().find('.bot-gorop-moun input').val()
    console.log(inp1)
    console.log(inp2)
    if (inp1 == '' || inp2 == '') {
        alert('不能为空')
    } else {
        // 通过controller来获取Angular应用
        var appElement = document.querySelector('[ng-controller=rulerconfigController]');
        // 获取$scope变量
        var anglarjsscope = angular.element(appElement).scope();
        if(anglarjsscope.minceListRest<0){
            alert("不能保存分组数量不能大于可分配数量");
            return false;
        }
        $(x).parent().parent().find('.togShow2').addClass('togHide')
        $(x).parent().parent().find('.togShow1').removeClass('togHide')
        $(x).parent().parent().find('.bot-gorop-name input').attr("disabled",true);
        $(x).parent().parent().find('.bot-gorop-moun input').attr("disabled",true);
        $(x).parent().parent().find('.bot-gorop-name input').addClass('inpHide')
        $(x).parent().parent().find('.bot-gorop-moun input').addClass('inpHide')
    }
//		  $('input').attr("readonly",true)//将input元素设置为readonly、
//		  $('input').attr("readonly",false)//去除input元素的readonly属性
//		  $('input').attr("disabled",true)//将input元素设置为disabled
    // $('input').attr("disabled",false)//去除input元素的disabled属性
    var obj={};
    obj.sonRosterName=sonRosterName;
    obj.sonRosterCount=sonRosterCount;
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    //anglarjsscope.diaoyongTest();
}

// 改变数据
function fzuOnchange(x){
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    if(!anglarjsscope.minceListRest){
        anglarjsscope.minceListRest=0;
    }
    if(!sonRosterCount){
        sonRosterCount=0;
    }
    anglarjsscope.minceListRest=parseInt(anglarjsscope.minceListRest)-parseInt(sonRosterCount);
    anglarjsscope.$apply();
    if(anglarjsscope.minceListRest<0){
        alert("分组数量不能大于可分配数量");
        return false;
    }
}

// 失焦
function fzuOnblur(x){
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    if(!anglarjsscope.minceListRest){
        anglarjsscope.minceListRest=0;
    }
    if(!sonRosterCount){
        sonRosterCount=0;
    }
    anglarjsscope.minceListRest=parseInt(anglarjsscope.minceListRest)-parseInt(sonRosterCount);
    anglarjsscope.$apply();
    if(anglarjsscope.minceListRest<0){
        alert("分组数量不能大于可分配数量");
        return false;
    }
}

// 聚焦
function fzuOnfocus(x){
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    var sonRosterCount = $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val();
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
//		if(anglarjsscope.minceListRest<sonRosterCount){
//			alert("分组数量不能大于可分配数量");
//		//return false;
//		}
    //if(sonRosterCount>=0 && anglarjsscope.minceListRest>=0){
    anglarjsscope.minceListRest=parseInt(anglarjsscope.minceListRest)+parseInt(sonRosterCount);
    anglarjsscope.$apply();
    $(x.parentNode.parentNode).children(".bot-gorop-moun").children("input[name='fzhuNameValue']").val(0);
    //}
}

// 新增分组
function addFenzu(){

    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    if(!$('#rosterId').val()){
        alert("请选择分组");
        return false;
    }
    if(anglarjsscope.minceListRest<=0){
        alert("可分配数量不能小于等于0");
        return false;
    }

    count++;

    // <input type="text" value="0" name="fzhuNameValue" onblur="fzuOnblur(this)"  onfocus="fzuOnfocus(this)" onchange="fzuOnblur(this)"  />
    var initElementsec = `<div class="divBox">
		      <div class="bot-gorop">
		        <div class="bot-gorop-name">
		          <input type="text" value="分组`+count+`" name="fzhuName" maxlength="50"/>
		        </div>
		        <div class="bot-gorop-moun" >
		            <input type="text" value="0" name="fzhuNameValue" onblur="fzuOnblur(this)"  onfocus="fzuOnfocus(this)" />
		        </div>
		        <div class="togShow1 togHide">
		        		<span class="top-modify"  onclick="fzuEdit(this)">修改</span>
		        		<span class="remove" onclick="fzuDele(this)">删除</span>
		        	</div>
		        	<div class="togShow2 " >
		        		<span class="save" onclick="fzuSave(this)">保存</span>
		        		<span class="bot-modify"  onclick="fzuCancle(this)">取消</span>
		        	</div>
		      </div>
		</div>`;
    $(".divBox-wrap").append(initElementsec);
    //$(".divBox-wrap").append(initElement);
    $(".divBox-wrap .divBox").last().find('.top-gorop').hide();
}


// 打开分组
function rulerConfigDeatil(x){
    count=0;
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    anglarjsscope.rulerConfigDeatil(x);
    anglarjsscope.$apply();
    $('.divBox-wrap').html('');

}


// 重置
function minceReset(){
    // 初始化分组数据
    count=0;
    // 通过controller来获取Angular应用
    var appElement = document.querySelector('[ng-controller=rulerconfigController]');
    // 获取$scope变量
    var anglarjsscope = angular.element(appElement).scope();
    anglarjsscope.minceListRest=anglarjsscope.minceListCount;

    if(!anglarjsscope.mince.channelCode){
        anglarjsscope.mince.channelCode="WK";
    }

    if(!anglarjsscope.mince.rosterId){
        anglarjsscope.mince.rosterId="";
    }
    var channelCode =anglarjsscope.mince.channelCode;
    var rosterId =anglarjsscope.mince.rosterId;
    // 清空之前的分组model数据,并初始化数据
    anglarjsscope.mince={channelCode:channelCode,rosterId:rosterId};


    anglarjsscope.$apply();
    $('.divBox-wrap').html('');
}
	
	




