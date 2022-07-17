'use strict';
var App = angular.module('myApp', [], angular.noop);
App.controller("rootController", ['$scope','$http', function ($scope,$http) {
    $scope.search = {};
    /**
     * 分页查询
     * @param pageNum
     */
    $scope.queryAnnouncement = function (pageNum) {
        var param = {};
        var pageNum = pageNum;
        if (pageNum > $scope.search.pageCount || pageNum<1){
            pageNum = 1;
        }
        var pageSize = $('#pageSize').val();
        var queryProductChannel = $("#queryProductChannel").val();
        if (queryProductChannel == ""){
            queryProductChannel = 0;
        }
        param.productChannel = queryProductChannel;
        var valid = $("#queryValid").val();
        if (valid != null && valid != '') {
            param.valid = valid;
        }
        param.productVersion = $("#queryProductVersion").val();
        var position = $("#queryPosition").val();
        if (position != null && position != '') {
            param.position = position;
        }
        var onlineTime = $("#queryOnlineTime").val();
        if (onlineTime != null && onlineTime != '') {
            param.onlineTime = $("#queryOnlineTime").val() + " 00:00:00";
        }
        var onlineStatus = $("#queryOnlineStatus").val();
        if (onlineStatus != null && onlineStatus != '') {
            param.onlineStatus = onlineStatus;
        }
        param.pageNum = pageNum;
        param.pageSize = pageSize ;
        $scope.param = param;
        var url = globalConfig.basePath + "/appConfig/announcement/query";
        $http({
            method:'post',
            url:url,
            data:param
        }).then(function successCallback(data) {
            $scope.search.pageNo = data.data.resp.pageNum;
            $scope.search.pageSize = data.data.resp.pageSize+"";
            $scope.search.pageCount = data.data.resp.pages;
            $scope.search.totalRowSize = data.data.resp.total;
            $scope.list = data.data.resp.list;
        }, function errorCallback(response) {
            alert("请求失败了....");
        });
    }
        $scope.queryAnnouncement(1);

    /**
     * 重置搜索
     */
    $scope.reset = function () {
        $('input[name="queryOnlineTime"]').val('');
        $('select[id="queryProductChannel"]').find('option[value=""]').prop('selected',true);
        $('select[name="queryValid"]').find('option[value=""]').prop('selected',true);
        $('select[name="queryProductVersion"]').find('option[value="3.1~3.4"]').prop('selected',true);
        $('select[name="queryPosition"]').find('option[value=""]').prop('selected',true);
        $('select[name="queryOnlineStatus"]').find('option[value=""]').prop('selected',true);
        $scope.getTypeVersionList(0);
    }



    //按渠道类型获取版本列表
    $scope.getTypeVersionList = function(param) {
        if (param == ""){
            param == 0;
        }
        var type;
        if(param==0){
            type = 'sys_product_version_wk';
        }else if(param==1){
            type = 'sys_product_version_qb';
        }else{
            type = 'sys_product_version_wx';
        }
        var url = globalConfig.basePath+"/rDict/getVersionByType?type="+type;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.typeVersionList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };
    $scope.getTypeVersionList(0);

    /**
     * 查询黑白名单
     */
    $scope.queryWhiteAndBlack = function(){
        $http.get(globalConfig.basePath+"/appconfig/WhiteBlankList/queryListName").then(
            function(data){
                $scope.blackList_qb = data.data.resp.black_qb;
                $scope.blackList_wk = data.data.resp.black_wk;
                $scope.whiteList_qb = data.data.resp.white_qb;
                $scope.whiteList_wk = data.data.resp.white_wk;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }
    /**
     * 添加查询黑白名单
     */
    $scope.add = function () {
        $scope.queryWhiteAndBlack();
        $scope.add.productChannel = "";
        $("#addPositionHome").prop("checked", false);
        $("#addPositionJFB").prop("checked", false);
        $("#addAnnouncementDesc").val('');
        $("#addTitle").val('');
        $("#addRedirectUrl").val('');
        $("#addOnlineTime").val('');
        $("#addOfflineTime").val('');
        $("#showTypeAll").prop("checked", true);
        $("#White").prop("checked", false);
        $("#Black").prop("checked", false);
        $("#addWhiteId").val('');
        $("#addBlackId").val('');
        $("input[name='versionCheckbox']").prop("checked", false);
        
    }


    /**
     * 选择展示人群对应的联动
     */
    $scope.Mutex = function () {
        if ($('#showTypeAll').is(":checked")) {
            $("#White").prop("checked", false);
            $("#Black").prop("checked", false);
        }else if ($('#Black').is(":checked")){
            $("#showTypeAll").prop("checked", false);
        }else if ($('#White').is(":checked")){
            $("#showTypeAll").prop("checked", false);
        }
    }
    /**
     * 修改时选择展示人群对应的联动
     */
    $scope.upMutex = function () {
        if ($('#upShowTypeAll').is(":checked")) {
            $("#upWhite").prop("checked", false);
            $("#upBlack").prop("checked", false);
        }else if ($('#upBlack').is(":checked")){
            $("#upShowTypeAll").prop("checked", false);
        }else if ($('#upWhite').is(":checked")){
            $("#upShowTypeAll").prop("checked", false);
        }
    }
    /**
     * 添加公告
     */
    $scope.addAnnouncement = function () {
        var param = {};
        var ProductChannel = $('#addProductChannel').val();
        if (ProductChannel == ""){
            ProductChannel = 0;
        }
        param.productChannel = ProductChannel;
        var ProductVersion = "";
        $("[name='versionCheckbox']").each(function() {
            if (this.checked == true) {
                ProductVersion += $(this).val() + ",";
            }
        });
        if (ProductVersion == ""){
            alert("请选择产品版本");
            return;
        }
        param.productVersion = ProductVersion;
        var position = "";
        var addPositionHome = $('input:checkbox[id="addPositionHome"]:checked').val();
        if (addPositionHome != null && addPositionHome != '') {
            position = position + addPositionHome;
        }
        var addPositionJFB = $('input:checkbox[id="addPositionJFB"]:checked').val();
        if (addPositionJFB != null && addPositionJFB != '') {
            if (position != "") {
                position = position + "," + addPositionJFB;
            }else {
                position = position + addPositionJFB;
            }
        }
        if (position == ""){
            alert("请选择产品位置");
            return;
        }
        param.position = position;
        var addAnnouncementDesc = $('#addAnnouncementDesc').val();
        if (addAnnouncementDesc != null && addAnnouncementDesc != '') {
            param.announcementDesc = addAnnouncementDesc;
        }
        var addTitle = $('#addTitle').val();
        if (addTitle == null || addTitle==''){
            alert("公告标题不能为空");
            return;
        }
            param.title = addTitle;
        var addRedirectUrl = $('#addRedirectUrl').val();
        if (addRedirectUrl == null || addRedirectUrl==''){
            alert("跳转链接不能为空");
            return;
        }
            param.redirectUrl = addRedirectUrl;
        var addOnlineTime = $('#addOnlineTime').val();
        if (addOnlineTime == null || addOnlineTime == ''){
            alert("上线时间不能为空");
            return;
        }
            param.onlineTime = addOnlineTime;
        var addOfflineTime = $('#addOfflineTime').val();
        if (addOfflineTime == null || addOfflineTime==''){
            alert("下线时间不能为空");
            return;
        }
            param.offlineTime = addOfflineTime;
        var addValid = $('#addValid').val();
        param.valid = addValid;


        var showTypeAll = $('input:checkbox[id="showTypeAll"]:checked').val();
        var White = $('input:checkbox[id="White"]:checked').val();
        var addWhiteId = $('#addWhiteId').val();
        if (White != null && White != '') {
            if (addWhiteId == null || addWhiteId == ''){
                alert("请选择白名单类型")
                return;
            }
            param.whiteId = addWhiteId;
        }
        var Black = $('input:checkbox[id="Black"]:checked').val();
        var addBlackId = $('#addBlackId').val();
        if (Black != null && Black != '') {
            if (addBlackId == null || addBlackId == ''){
                alert("请选择黑名单类型")
                return;
            }
            param.blackId = addBlackId;
        }
        if (showTypeAll ==null  && White==null && Black==null ){
            alert("请选择展示人群");
            return;
        }
        if (showTypeAll != null && showTypeAll != '') {
            param.showType = showTypeAll;
        }else if (White != null && White != '' && Black != null && Black != '') {
            param.showType = 3;
        } else if (White != null && White != '' && Black == null || Black == '') {
            param.showType = White;
        } else if (Black != null && Black != '' && White == null || White == '') {
            param.showType = Black;
        }
        var url = globalConfig.basePath + "/appConfig/announcement/add";
        $http({
            method:'post',
            url:url,
            data:param
        }).then(function successCallback(data) {
            $('#addShow').hide();
            alert(data.data.message);
            window.location = globalConfig.basePath + "/res/announcement"
        }, function errorCallback(response) {
            alert("请求失败了....");
        });
    }


    /**
     * 查看详情
     */
    $scope.check = function (Announcement) {
        $('#showCheck').show();
        $scope.Announcement = Announcement;
    }


    /**
     * 关闭详情框
     */
    $scope.closeCheck = function () {
        $('#showCheck').hide();
    }


    /**
     * 打开修改框
     */
    $scope.update = function (Announcement) {
        $scope.sequenceId = Announcement.sequenceId;
        $('#showUpdate').show();
        $scope.queryWhiteAndBlack();
        $scope.Announcement = angular.copy(Announcement);
        Announcement.whiteId = Announcement.whiteId+"";
        Announcement.blackId = Announcement.blackId+""
        $scope.updateScene = Announcement;
        var productChannel = Announcement.productChannel;
        if (productChannel == 0){
            productChannel = '';
            $scope.Announcement.productChannel = '';
        }
        $("#upProductChannel").val(productChannel);
        var productVersion = Announcement.productVersion.split(",");
        $('.updateVersionCheckbox').each(function(){
            var v= $(this).val();
            var a = 1;
            for (var i=0;i<productVersion.length;i++){
                if(v==productVersion[i]){
                    a = 0;
                }
            }
            if(a==0){
                $(this).attr("checked",true);
            }
        })
        if (Announcement.position.indexOf(1) != -1){
            $('#upPositionHome').prop('checked',true);
        }
        if (Announcement.position.indexOf(2) != -1){
            $('#upPositionJFB').prop('checked',true);
        }
        if (Announcement.showType == 0){
            $('#upShowTypeAll').prop("checked",true);
            $('#upWhite').prop("checked",false);
            $('#upBlack').prop("checked",false);
        }else if (Announcement.showType == 1){
            $('#upWhite').prop("checked",true);
            $('#upBlack').prop("checked",false);
            $('#upShowTypeAll').prop("checked",false);
        }else if (Announcement.showType == 2){
            $('#upBlack').prop("checked",true);
            $('#upWhite').prop("checked",false);
            $('#upShowTypeAll').prop("checked",false);
        }else if (Announcement.showType == 3){
            $('#upShowTypeAll').prop("checked",false);
            $('#upBlack').prop("checked",true);
            $('#upWhite').prop("checked",true);

        }
    }

    /**
     * 关闭修改框
     */
    $scope.closeUp = function () {
        $('#showUpdate').hide();
        $('#upPositionHome').attr("checked",false);
        $('#upPositionJFB').attr("checked",false);
        $scope.queryAnnouncement(1);
    }

    /**
     * 修改公告
     */
    $scope.updateAnnouncement = function (id) {
        var param = {};
        param.id = id;
        var upTitle = $('#upTitle').val();
        if (upTitle == null || upTitle==''){
            alert("公告标题不能为空");
            return;
        }
        param.title = upTitle;
        param.sequenceId = $scope.sequenceId;
        var position = "";
        var upPositionHome = $('input:checkbox[id="upPositionHome"]:checked').val();
        if (upPositionHome != null && upPositionHome != '') {
            position = position + upPositionHome;
        }
        var upPositionJFB = $('input:checkbox[id="upPositionJFB"]:checked').val();
        if (upPositionJFB != null && upPositionJFB != '') {
            if (position != "") {
                position = position + "," + upPositionJFB;
            }else {
                position = position + upPositionJFB;
            }
        }
        if (position == ""){
            alert("请选择产品位置");
            return;
        }
        param.position = position;
        var upAnnouncementDesc = $('#upAnnouncementDesc').val();
        param.announcementDesc = upAnnouncementDesc;
        var upRedirectUrl = $('#upRedirectUrl').val();
        if (upRedirectUrl == null || upRedirectUrl==''){
            alert("跳转链接不能为空");
            return;
        }
        param.redirectUrl = upRedirectUrl;
        var upOnlineTime = $('#upOnlineTime').val();
        if (upOnlineTime == null || upOnlineTime == ''){
            alert("上线时间不能为空");
            return;
        }
        param.onlineTime = upOnlineTime;
        var upOfflineTime = $('#upOfflineTime').val();
        if (upOfflineTime == null || upOfflineTime==''){
            alert("下线时间不能为空");
            return;
        }
        param.offlineTime = upOfflineTime;
        var upValid = $('#upValid').val();
        param.valid = upValid;
        var showTypeAll = $('input:checkbox[id="upShowTypeAll"]:checked').val();
        var White = $('input:checkbox[id="upWhite"]:checked').val();
        var addWhiteId = $('#upWhiteId').val();
        param.whiteId = addWhiteId;
        var Black = $('input:checkbox[id="upBlack"]:checked').val();
        var addBlackId = $('#upBlackId').val();
        param.blackId = addBlackId;
        if (showTypeAll ==null  && White==null && Black==null ){
            alert("请选择展示人群");
            return;
        }
        if (showTypeAll != null && showTypeAll != '') {
            param.showType = showTypeAll;
        }else if (White != null && White != '' && Black != null && Black != '') {
            param.showType = 3;
        } else if (White != null && White != '' && Black == null || Black == '') {
            param.showType = White;
        } else if (Black != null && Black != '' && White == null || White == '') {
            param.showType = Black;
        }
        var url = globalConfig.basePath + "/appConfig/announcement/update";
        $http({
            method:'post',
            url:url,
            data:param
        }).then(function successCallback(data) {
            $('#showUpdate').hide();
            alert(data.data.message);
            $scope.queryAnnouncement(1);
        }, function errorCallback(response) {
            alert("请求失败了....");
        });
    }


    /**
     * 打开生效弹框
     */
    $scope.startShow = function (id,valid,SequenceId) {
        $('#showStart').show();
        $scope.SequenceId = SequenceId;
        $scope.id = id;
        $scope.isValid = valid;
    }

    /**
     * 关闭生效弹框
     */
    $scope.cancel = function () {
        $('#showStart').hide();
    }

    /**
     * 进行生效/失效公告
     */
    $scope.start = function (id,valid,SequenceId) {
        var url = "";
        if (valid == 0){
            url =  globalConfig.basePath+"/appConfig/announcement//takeEffect?id="+id+"&SequenceId="+SequenceId;
        }else if (valid == 1){
            url =  globalConfig.basePath+"/appConfig/announcement/failure?id="+id+"&SequenceId="+SequenceId;
        }
        $http({
            method: 'POST',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            $('#showStart').hide();
            $scope.queryAnnouncement(1);
        }, function errorCallback(response) {
            alert("失败....");
        });
    }

    /**
     * 打开优先级排序框
     */
    $scope.stort = function () {
        $('#showPriority').show();
        var productChannel = $("#queryProductChannel").val();
        if (productChannel == ""){
            productChannel = 0;
        }
        var productVersion = $("#queryProductVersion").val();
        var url = globalConfig.basePath + "/appConfig/announcement/queryByConditions?productChannel="+productChannel+"&productVersion="+productVersion;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            $scope.sortinglist = data.data.resp;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取对象失败....");
        });
    }

    /**
     * 移动
     * @type {Array}
     */
    var moveList = new Array();
    $scope.move = function(type){
        if( $("input[class='moveCheckbox']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
        var length = $scope.sortinglist.length;
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
                if(type=='S'){
                    var me =$(this).val()-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move1 = $scope.sortinglist[me-1];
                    $scope.sortinglist[me-1] = $scope.sortinglist[me];
                    $scope.sortinglist[me] = move1;
                    $scope.sortinglist[me-1].priority = $scope.sortinglist[me-1].priority-1;
                    $scope.sortinglist[me].priority =$scope.sortinglist[me].priority+1;
                }else if(type=='X'){
                    var me =$(this).val()-1;
                    if(me==length-1){
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move1 = $scope.sortinglist[me+1];
                    $scope.sortinglist[me+1] = $scope.sortinglist[me];
                    $scope.sortinglist[me] = move1;
                    $scope.sortinglist[me+1].priority = $scope.sortinglist[me+1].priority+1;
                    $scope.sortinglist[me].priority =$scope.sortinglist[me].priority-1;
                }
            }
        })

    }
    //排序取消
    $scope.moveCancel = function(){
        $scope.sortinglist={};
        $('#showPriority').hide();
    }

    /**
     * 进行优先级排序
     */
    $scope.theSorting = function () {
        var url = globalConfig.basePath+"/appConfig/announcement/priority";
        $http.post(url,$scope.sortinglist).then(
            function(data){
                alert(data.data.message);
                $scope.sortinglist = {};
                $scope.queryAnnouncement(1);
                $('#showPriority').hide();
            },function(response) {
                alert("请求失败了....");
            }
        );
    }
}]);