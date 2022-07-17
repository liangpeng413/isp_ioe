'use strict';
var app = angular.module('myApp', [], angular.noop);
app.controller("rootController", ['$scope','$http', function ($scope,$http) {

    $scope.searchCondition = {pageSize:10};
    $scope.add={};
    $scope.loginName = globalConfig.loginName;
    $scope.audit={};
    $scope.effectRecord={};
    /**
     *上传图片
     */
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
        /**
         * 添加
         */
        $('#addPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(pdf|jpg|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                var fileUrl = data.result.resp;
                $scope.add.imageUrl=fileUrl
                $('#fileName').prop("value", fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("上传图片失败：系统暂不支持该类型图片上传");
                    console.log("上传图片失败：系统暂不支持该类型图片上传")
                    return;
                }
            }
        });

        /**
         * 修改
         */
        $('#editPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(pdf|jpg|png)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                var fileUrl = data.result.resp;
                $scope.edit.imageUrl=fileUrl
                $('#editFileURL').prop("value", fileUrl);
                alert("上传成功")
            }
        }).on('fileuploadprocessalways', function (e, data) {
            if (data.files.error) {
                if (data.files[0].error == 'File type not allowed') {
                    alert("出错了", "请上传图片文件", "error");
                    return;
                }
            }
        });


    })

    function checknumKeepTwoPoint(expandProfit){
        var patt1=new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/);
        return patt1.test(expandProfit);
    }

    function checknumKeepZeroPoint(expandProfit){
        var patt1=new RegExp(/^[0-9]+([.]{0}[0-9]{0})?$/);
        return patt1.test(expandProfit);
    }

    // 分页参数
    $scope.page = window.defaultPageParam?window.defaultPageParam:{};
    $scope.page.fetchPageContent = submitSearch;
    function submitSearch(){
        $scope.querySecurityAssurance($scope.page.currPage);
    }


    /**
     * 搜索按钮
     * @param currentPage
     */
    $scope.querySecurityAssurance = function(currPage){
        $scope.searchCondition.pageNum = currPage;
        $scope.searchCondition.pageSize = $scope.page.perPageRowSize;
        $scope.searchCondition.createTimeStart = $("#createTimeStart").val();
        $scope.searchCondition.createTimeEnd = $("#createTimeEnd").val();
        var url = globalConfig.basePath+"/res/securityAssurance/securityQueryList";
        $http.post(url,$scope.searchCondition).then(function successCallback(callback) {
            if(callback.data.code == '000'){
                $scope.securityAssuranceList = callback.data.resp.list;
                $scope.page.currPage = callback.data.resp.pageNum;
                $scope.page.lastPage = callback.data.resp.pages;
                $scope.page.totalRowSize = callback.data.resp.total;
                $scope.page.perPageRowSize = callback.data.resp.pageSize+'';
                $scope.page.startRow = callback.data.resp.startRow+'';
                $scope.page.endRow = callback.data.resp.endRow+'';
            } else {
                alert("查询安全保障记录失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    $scope.querySecurityAssurance(1);

    /**
     * 重置按钮
     */
    $scope.resetSecurityAssurance = function(){
        $scope.searchCondition = {
            productChannel:'',
            auditStatus:'',
            fileName:'',
            fileType:'1',
            createTimeStart:'',
            createTimeEnd:''
        };
    };

    /**
     * 查看详情
     */
    $scope.showCheck = function(x){
        $scope.detail = angular.copy(x);
        $('#showCheckID').show();
    }

    /**
     * 关闭详情
     */
    $scope.hideCheck = function(){
        $('#showCheckID').hide();
    }

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
     * 添加安全保障
     */
    $scope.addSecurity = function(){
        $scope.add={};
        $('#addShow').show();
        $scope.add.productChannel='0';
        $scope.add.fileType='1';
        $scope.add.auditPerson='';
        $("#addFileName").val("");
        $("#addEndTime").val("");
        $("#addBalance").val("");
        $("#addPeriods").val("");
    }


    /**
     * 添加
     */
    $scope.commitSecurity = function(){
        $scope.add.endTime = $("#addEndTime").val();
        $scope.add.periods = $("#addPeriods").val();
        if ($scope.add.fileName == null|| $scope.add.fileName=="") {
            alert("文件名称不能为空");
            return;
        }

        if($scope.add.fileType==1){
            if ($scope.add.endTime == null|| $scope.add.endTime=="") {
                alert("截止时间不能为空");
                return;
            }
            if ($scope.add.balance == null|| $scope.add.balance=="") {
                alert("账户余额不能为空");
                return;
            }
            if (!checknumKeepTwoPoint($scope.add.balance)){
                alert("账户余额为数字,仅支持两位小数点");
                return;
            }
            if ($scope.add.periods == null|| $scope.add.periods=="") {
                alert("期数不能为空");
                return;
            }
            if (!checknumKeepZeroPoint($scope.add.periods)){
                alert("期数为数字,不包含小数");
                return;
            }
      }
        if ($scope.add.imageUrl == null|| $scope.add.imageUrl=="") {
            alert("请上传文件");
            return;
        }
        if ($scope.add.auditPerson == null|| $scope.add.auditPerson=="") {
            alert("请选择审核人");
            return;
        }else{
            $scope.add.auditNo=$scope.add.auditPerson.no;
            $scope.add.requestAuditPersonEmail=$scope.add.auditPerson.email;
            $scope.add.auditPerson=$scope.add.auditPerson.name;
        }

        var url =globalConfig.basePath+"/res/securityAssurance/securityAdd";
        $http.post(url,$scope.add).then(
            function(data){
                if(data.data.code=='000'){
                    alert('添加成功');
                    $('#addShow').hide();
                    $scope.add = {};
                }else{
                    alert("添加失败")
                }
                $scope.querySecurityAssurance(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 添加页面关闭
     */
    $scope.hideAdd = function(){
        $('#addShow').hide();
    }


    /**
     * 修改安全配置
     * @param x
     */
    $scope.updateCheck = function(x){
        $scope.edit={};
        $scope.securityEdit = angular.copy(x);
        $scope.edit.id=$scope.securityEdit.id;
        $scope.edit.productChannel=$scope.securityEdit.productChannel;
        $("#editProductChannel").attr("disabled","disabled");
        $scope.edit.fileType=$scope.securityEdit.fileType;
        $("#editFileType").attr("disabled","disabled");
        $scope.edit.fileName=$scope.securityEdit.fileName;
        $scope.edit.endTime=$scope.securityEdit.endTime;
        $scope.edit.balance=$scope.securityEdit.balance;
        $scope.edit.periods=$scope.securityEdit.periods;
        $scope.edit.imageUrl=$scope.securityEdit.fileURL;
        // $("#editFileURL").attr("disabled","disabled");
        $('#editShow').show();
    }

    /**
     * 修改保存
     */
    $scope.editSecurity = function(){
        $scope.edit.endTime = $("#editEndTime").val();
        if ($scope.edit.fileName == null|| $scope.edit.fileName=="") {
            alert("文件名称不能为空");
            return;
        }
        if($scope.edit.fileType==1){
            if ($scope.edit.endTime == null|| $scope.edit.endTime=="") {
                alert("截止时间不能为空");
                return;
            }
            if ($scope.edit.balance == null|| $scope.edit.balance=="") {
                alert("账户余额不能为空");
                return;
            }
            if (!checknumKeepTwoPoint($scope.edit.balance)){
                alert("账户余额为数字,仅支持两位小数点");
                return;
            }
            if ($scope.edit.periods == null|| $scope.edit.periods=="") {
                alert("期数不能为空");
                return;
            }
            if (!checknumKeepZeroPoint($scope.edit.periods)){
                alert("期数为数字,不包含小数");
                return;
            }
     }
        if ($scope.edit.imageUrl == null|| $scope.edit.imageUrl=="") {
            alert("请上传文件");
            return;
        }
        if ($scope.edit.auditPerson == null|| $scope.edit.auditPerson=="") {
            alert("请选择审核人");
            return;
        }else{
            $scope.edit.auditNo=$scope.edit.auditPerson.no;
            $scope.edit.requestAuditPersonEmail=$scope.edit.auditPerson.email;
            $scope.edit.auditPerson=$scope.edit.auditPerson.name;
        }
        var url =globalConfig.basePath+"/res/securityAssurance/securityEdit";
        $http.post(url,$scope.edit).then(
            function(data){
                if(data.data.code=='000'){
                    alert('修改成功');
                    $('#editShow').hide();
                    $scope.edit = {};
                }else{
                    alert("修改失败")
                }
                $scope.querySecurityAssurance(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 修改页面关闭
     */
    $scope.hideEdit = function(){
        $('#editShow').hide();
    }

    /**
     * 失效生效
     * @param x
     */
    $scope.validCheck = function(x){
        $scope.effectRecord = angular.copy(x);
        $('#takeEffect').show();
    };

    /**
     * 提交失效生效
     */
    $scope.validateRecord = function(){
        var url =globalConfig.basePath+"/res/securityAssurance/validCheck";
        $scope.effectRecord.auditNo=$scope.effectRecord.auditPerson.no;
        $scope.effectRecord.requestAuditPersonEmail=$scope.effectRecord.auditPerson.email;
        $scope.effectRecord.auditPerson=$scope.effectRecord.auditPerson.name;
        $http.post(url,$scope.effectRecord).then(
            function(data){
                if(data.data.code=='000'){
                    alert('成功');
                    $('.take-start-box').hide();
                    $scope.effectRecord ={};
                }else{
                    alert("失败")
                    $scope.effectRecord ={};
                }
                $scope.querySecurityAssurance(1);
            },function errorCallback(response) {
                $scope.effectRecord ={};
                alert("请求失败了....");
            }
        );
    }

    /**
     * 审核
     */
    $scope.auditCheck = function(x){
        $scope.audit.auditStatus=0;
        $scope.audit = angular.copy(x);
        $('#auditShow').show();
    }

    /**
     * 提交审核
     * @param x
     */
    $scope.confirm = function(){
        if ( $scope.audit.auditStatus ==0) {
            alert("请选择审核人");
            return;
        }
        $scope.audit.imageUrl=$scope.audit.fileURL;
        $scope.audit.auditNo=$scope.audit.auditPerson.no;
        $scope.audit.requestAuditPersonEmail=$scope.audit.auditPerson.email;
        $scope.audit.auditPerson=$scope.audit.auditPerson.name;
        var url =globalConfig.basePath+"/res/securityAssurance/auditCheck";
        $http.post(url,$scope.audit).then(
            function(data){
                if(data.data.code=='000'){
                    alert('成功');
                    $scope.audit ={};
                }else{
                    $scope.audit ={};
                    alert("失败")
                }
                $scope.querySecurityAssurance(1);
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
        $('#auditShow').hide()
    }



}]);