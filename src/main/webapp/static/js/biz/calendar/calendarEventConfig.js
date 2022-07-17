'use strict';

var App = angular.module('eventConfig', [], angular.noop);
App.controller('eventConfigController', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};
    self.search.channel = 'wk';

    self.pageQueryEventConfig = function(pageNum) {
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        self.search.pageSize=10;
        var url = globalConfig.basePath + "/calendar/pageQueryEventConfig";
        $http.post(url, self.search).then(
            function (data) {
                if (data.data.code == '000') {
                    if (data.data.resp.curPageNumber) {
                        self.search.pageNo = data.data.resp.curPageNumber;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageCount = data.data.resp.pageSize;
                    self.search.perPageRowSize = data.data.resp.perPageRowSize + "";
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.eventConfigList = data.data.resp.resultList;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.pageQueryEventConfig(1);

    /**重置*/
    self.reset = function () {
        var pageNo = 1;
        var pageCount = 0;
        var perPageRowSize = 10;
        var totalRowSize =0;
        var pageSize = 10;
        self.search = {};
        self.search.channel = 'qb';
        self.search.pageNo = pageNo;
        self.search.pageCount = pageCount;
        self.search.perPageRowSize = perPageRowSize;
        self.search.totalRowSize = totalRowSize;
        self.search.pageSize = pageSize;
    }


    //显示
    self.showAddEventConfig = function () {
        self.eventParam = {};
        //添加時讓編輯
        self.popupShow=0;
        $('#showAddPopup').show();
    }

    //region 上传图片
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
        //添加icon
        $('#addIcon').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpeg|png|txt)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                console.log(e);
                var fileUrl = data.result.resp;
                $('#iconUrl').prop("value",fileUrl);
                $('#image_prew').prop("src",fileUrl);
                self.eventParam.iconUrl=fileUrl;
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }
        });

        //添加底部
        $('#addBottomPhoto').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpeg|png|txt)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data);
                console.log(e);
                var fileUrl = data.result.resp;
                $('#addBottomPhotoUrl').prop("value",fileUrl);
                $('#image_prew_bottom').prop("src",fileUrl);
                self.eventParam.bottomUrl=fileUrl;
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    return;
                }
            }
        });
    })
    //endregion

    //添加事件类型
    self.addOrUpEventConfig = function (type) {

        if(!self.eventParam.channel || self.eventParam.channel ==''){
            alert("请选择渠道");
            return;
        }
        if(!self.eventParam.eventName || self.eventParam.eventName ==''){
            alert("请填写事件类型名称");
            return;
        }
        if(!self.eventParam.eventRule || self.eventParam.eventRule ==''){
            alert("请关联事件类型规则");
            return;
        }
        if(!self.eventParam.iconUrl || self.eventParam.iconUrl ==''){
            alert("请上传icon图片");
            return;
        }
        if(!self.eventParam.labelType || self.eventParam.labelType ==''){
            alert("请选择日历标注类型");
            return;
        }
        if(self.eventParam.labelType=='2'){
            if(!self.eventParam.colorValue || self.eventParam.colorValue==''){
                alert("请选择颜色值");
                return;
            }
            if(!self.eventParam.text || self.eventParam.text==''){
                alert("请填写文案");
                return;
            }
        }else if(self.eventParam.labelType==3){
            if(!self.eventParam.bottomUrl || self.eventParam.bottomUrl==''){
                alert("请上传底部图片");
                return;
            }
        }
        self.eventParam.createPerson = globalConfig.loginName;
        self.eventParam.updatePerson = globalConfig.loginName;

        //type==0 添加  1 == 修改
        var url = globalConfig.basePath + "/calendar/addOrUpEventConfig";
        $http.post(url, self.eventParam).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功")
                    $('#showAddPopup').hide();
                    self.eventParam={};
                    self.pageQueryEventConfig(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //取消添加修改查看
    self.cancelAddEventConfig = function () {
        self.eventParam={}
        self.popupShow = 0;
        $('#showAddPopup').hide();
    }

    //查看
    self.checkAndUpdate = function (eventConfigId,type) {
        var url = globalConfig.basePath + "/calendar/getEventConfig?id="+eventConfigId;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.popupShow = type;
                    self.eventParam = data.data.resp;
                    $('#showAddPopup').show();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //生效失效
    self.effectOperation = function (type,id) {
        self.effectType = type;
        self.effectId = id;
        $('#showIsEffectPopup').show();
    }

    //确定生效失效
    self.commitEffect = function (type,id) {
        var url = globalConfig.basePath + "/calendar/eventConfigEffectOperation?id="+id+"&type="+type;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("操作成功！")
                    $('#showIsEffectPopup').hide();
                    self.effectType=null;
                    self.effectId=null;
                    self.pageQueryEventConfig(1);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.cancelEffect = function () {
        $('#showIsEffectPopup').hide();
        self.effectType=null;
        self.effectId=null;
    }

    //事件通知优先级排序
    self.showEventConfigPriorityShow = function () {
        var url = globalConfig.basePath + "/calendar/queryEventConfigPriority?channel="+self.search.channel;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    if(data.data.resp.length>0){
                        for(var i=0;i<data.data.resp.length;i++){
                            data.data.resp[i].eventPriority =i+1;
                        }
                        self.strotList = data.data.resp;
                    }
                    $('#showPriority').show();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //取消排序
    self.cancelPriority = function () {
        $('#showPriority').hide();
        self.priorityChannel = null;
        self.strotList = [];
    }

    //排序移动
    var moveList = new Array();
    self.move = function(type){
        if( $("input[class='moveCheckbox']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
        var length = self.strotList.length;
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
                if(type=='S'){//上移
                    var me =$(this).val()-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  self.strotList[me];//当前选中的
                    var move1 = self.strotList[me-1];//上一个
                    self.strotList[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                    self.strotList[me] = move1;// 当前选中的
                    self.strotList[me-1].eventPriority =Number($(this).val())-Number(1);
                    self.strotList[me].eventPriority =Number($(this).val());
                }else if(type=='X'){// 下移
                    var me =$(this).val()-1;
                    if(me==length-1){
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = self.strotList[me];// 下一个banner
                    move0.eventPriority=Number($(this).val())+Number(1);
                    var move1 = self.strotList[me+1];// 下一个banner
                    move1.eventPriority=Number($(this).val());
                    self.strotList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    self.strotList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }

    //确定排序
    self.moveCommit = function(){
        var url = globalConfig.basePath+"/calendar/moveCommitPriority";
        $http.post(url,self.strotList).then(
            function(data){
                alert("操作成功");
                $('#showPriority').hide();
                self.strotList = [];
            },function(response) {
                alert("请求失败了....");
            }
        );
    }

    self.showEventConfigPriorityShow2 = function () {
        self.labelType="";
        $('#showCalendarPriority').show();

    }

    self.priorityOperation = function () {
        self.strotList=[];
        if(self.labelType==''){
            return;
        }
        var url = globalConfig.basePath + "/calendar/calendarPriorityOperation?channel="+self.search.channel+"&labelType="+self.labelType;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    if(data.data.resp.length>0){
                        for(var i=0;i<data.data.resp.length;i++){
                            data.data.resp[i].eventPriority =i+1;
                        }
                        self.strotList = data.data.resp;
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    self.cancelCalendarPriority = function () {
        $('#showCalendarPriority').hide();
        self.labelType = null;
        self.strotList = [];
    }

    //排序移动
    self.move2 = function(type){
        if( $("input[class='moveCheckbox']:checked").length > 1){
            alert("请选择一个进行移动");
            return;
        }
        var length = self.strotList.length;
        $('.moveCheckbox').each(function(){
            if(this.checked == true){
                if(type=='S'){//上移
                    var me =$(this).val()-1;
                    if(me==0){
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 =  self.strotList[me];//当前选中的
                    var move1 = self.strotList[me-1];//上一个
                    self.strotList[me-1] = move0;//self.strotList[me];//当前选中的上移一个
                    self.strotList[me] = move1;// 当前选中的
                    self.strotList[me-1].labelPriority =Number($(this).val())-Number(1);
                    self.strotList[me].labelPriority =Number($(this).val());
                }else if(type=='X'){// 下移
                    var me =$(this).val()-1;
                    if(me==length-1){
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = self.strotList[me];// 下一个banner
                    move0.labelPriority=Number($(this).val())+Number(1);
                    var move1 = self.strotList[me+1];// 下一个banner
                    move1.labelPriority=Number($(this).val());
                    self.strotList[me+1] =move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    self.strotList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }

    //日历排序确定
    self.moveCalendarCommit = function(){
        if(!self.labelType||self.labelType==""){
            alert("请选择标注类型");
            return;
        }
        if(self.strotList.length==0){
            alert("请添加数据后再排序！");
            $('#showCalendarPriority').hide();
            return;
        }
        var url = globalConfig.basePath+"/calendar/moveCalendarCommitPriority";
        $http.post(url,self.strotList).then(
            function(data){
                alert("操作成功");
                $('#showCalendarPriority').hide();
                self.strotList = [];
            },function(response) {
                alert("请求失败了....");
            }
        );
    }



}])

