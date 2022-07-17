'use strict';// 严谨模式
var App = angular.module('popupApp', [], angular.noop);
App.controller('popupController',['$scope','$http', function($scope,$http) {
    var self = $scope;
    self.search = {};// 查询
    self.add={};// 添加
    self.detail={};
    self.updatePopup={};// 修改
    self.showPopup={};// 查看
    $scope.loginName = globalConfig.loginName;
    self.search.productChannel = '0';


    //版本控制查询
    self.queryVersionControlList = function(paegNum2){
        if(self.pages<paegNum2&&paegNum2!=1){
            return;
        }
        if(!paegNum2){
            self.search.pageNum = 1;
        } else {
            self.search.pageNum = paegNum2;
        }

        var url = globalConfig.basePath + "/appConfig/versionControl/queryVersionControlList";
        $http.post(url,self.search).then(
            function(data){
                self.total = data.data.resp.totalRowSize;
                self.pages = data.data.resp.pageCount;
                self.contentConfigList = data.data.resp.result;
            },function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    //重置
    self.reset2 = function(){
        // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.status="";//上线状态
        self.search.valid="";//是否生效
        self.search.position="";//版本控制位置
        self.search.priority="";
        self.search.auditStatus="";
        self.search.type="";
        self.search.clientType='';
        self.search.version='';
        //self.search.onTime="";//在线时间
        $("#searchonTime").val("");
        $("#searchoffTime").val("");
        self.getAddTypeVersionList(0);
        self.search.pageSize = "5";
    }


    //*************************************Add 版本控制************************************

    $scope.selctPageOne =function(){
        if(self.jumpType=='3'){
            var type="gonggao_onePage"
            $http.get(globalConfig.basePath + "/rDict/getVersionByType"+"?type="+type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
            })
        }

    }

    //版本控制Box
    self.addContentBox = function(){
        self.add={};

        $('#addShow').show();

        self.add.productChannel = "0";
        self.add.clientType="";
        self.add.isMinVersion='0';

    }


    // 选择版本
    self.addversionCheckbox=function(){
        self.addPostionCheck();
    }


    self.addpostion=function(){
        var versions = "";
        $('.versionCheckbox').each(function() {
            if (this.checked == true) {
                if($(this).val()){
                    versions += $(this).val() + ",";
                }
            }
        });
        if(!versions){
            alert("请选择产品版本");
            return;
        }


    }

    // 登陆选择
    self.addLoginStatus = function(param){
        if(param=='0' || param=='2'){
            $("#all").attr('disabled','disabled');
            $('#all').prop("checked",true);
            $("#white").attr('disabled','disabled');
            $('#white').prop("checked",false);
            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#selectaddwhiteId").val("");
            $("#black").attr('disabled','disabled');
            $('#black').prop("checked",false);
            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
            $("#selectaddblackId").val("");

        }else{
            $("#all").removeAttr("disabled");
            if($('#all').is(':checked')){
                $("#editwhite").attr('disabled','disabled');
                $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
                $("#editselectaddwhiteId").val("0");
                $("#editblack").attr('disabled','disabled');
                $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
                $("#editselectaddblackId").val("0");
            }else{

                $('#all').prop("checked",true);
                $("#white").removeAttr('disabled','disabled');
                $("#selectaddwhiteId").removeAttr("disabled");
                $("#black").removeAttr('disabled','disabled');
                $("#selectaddblackId").removeAttr("disabled");

            }

        }

        self.addPostionCheck();
    }

    //确认添加版本控制
    $scope.saveVersion = function(){

        if(!self.add.productChannel){
            alert("渠道不能为空");
            return ;
        }
        if(!self.add.clientType){
            alert("客户端类型不能为空");
            return ;
        }
        if(self.add.productChannel == 0 && self.add.clientType == 1) {
            if (!self.add.md5) {
                alert("MD5不能为空");
                return;
            }
        }
        if(!self.add.version){
            alert("版本号不能为空");
            return ;
        }
        ///^\d+\.\d+\.\d+$/
        if(!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/.test(self.add.version)){
            alert("请输入0.0.0格式的版本号");
            return ;
        }
        if(!self.add.description){
            alert("更新文案不能为空");
            return ;
        }
        if(self.add.clientType=='1' && !self.add.jumpAddress){
            alert("跳转地址不能为空");
            return;
        }

        //上线时间
        self.add.onlineTime = $('#queryOnlineTime').val()+"";
        if(!self.add.onlineTime){
            alert("上线时间不能为空");
            return;
        }
        if(!self.add.isMinVersion){
            alert("最低版本不能为空");
            return;
        }
//        if(self.add.productChannel=='0' && self.add.version != '4.0.0'){
//            alert("该版本号不存在");
//            return;
//        }
        //审核人
        var requestAuditPersio =self.add.auditPerson;
        //提审说明
        var auditDescription=self.add.requestAuditDescription;
        // 审核人
        if(!requestAuditPersio){
            alert("审核人不能为空");
            return ;
        }else{
            self.add.auditNo=self.add.auditPerson.no;
            self.add.auditPerson=self.add.auditPerson.name;
        }
        if(auditDescription!=null){
            if(auditDescription.length>18){
                alert("审核说明不能超过18个字符");
                return;
            }
        }
        var url = globalConfig.basePath + "/appConfig/versionControl/addVersionControl";
        $http.post(url,self.add).then(
            function(data){
                var num = data.data.resp;
                if(num == 0){
                    alert(data.data.message);
                    $('#addShow').hide();
                    self.add = {};
                    window.location.reload();
                }else if(num == 1){
                    alert('该版本号已存在或不符合规定');
                    return false;
                }else if(num == 2){
                    alert('最低版本号需大于上次最低版本号');
                    return false;
                }else if(num == 3){
                    alert('新增版本号需大于最新版本号');
                    return false;
                }else if(num == 4){
                    alert('请确认是否已配置一个最低版本,如未配置，【最低版本】请选择是！');
                    return false;
                }
                self.getVersionInfo();
            },function(response) {
                alert("请求失败了....");
                window.location.reload();
            }
        );

    };

    //添加弹框上传图片
    var url = globalConfig.basePath + "/appconfig/file/uploadPic";
    $(function () {
        $('#addPicture').fileupload({
            autoUpload: true,//是否自动上传
            url: url,//上传地址
            dataType: 'json',
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|avi)$/i,
            maxFileSize: 1 * 1024 * 1024 * 30,
            done: function (e, data) {//设置文件上传完毕事件的回调函数
                console.log(data.result);
                var fileUrl = data.result.resp;
                $('#fileUrl').prop("value", fileUrl);
                $('#image_prew').prop("src", fileUrl);
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
    });


    //添加全部选中事件
    self.completeAll = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $('#selectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#selectaddwhiteId").val("");
            $("#black").attr('disabled','disabled');
            $('#selectaddblackId').attr('disabled','disabled');//下拉名单
            $("#selectaddblackId").val("");
        }else {
            $("#white").removeAttr('disabled','disabled');
            $("#selectaddwhiteId").removeAttr("disabled");
            $("#black").removeAttr('disabled','disabled');
            $("#selectaddblackId").removeAttr("disabled");
        }
    }


    //************************版本控制查看**************************
    //查看
    self.toView = function(query){
        self.showPopup=query;

        $('#showContentView').show();

    }


    //修改取消按钮
    $scope.hsjgonto = function(){
        $("#upateContent").hide();
    }


//************************修改*****************************

    self.update = function(query){
        $scope.detail = angular.copy(query);
        self.detail.productChannel=self.detail.productChannel+"";
        $scope.detail.auditPerson = '';
        self.detail.clientType = query.clientType+'';
        self.abc = $scope.detail.isMinVersion;
        if(self.detail.clientType == '2'){
            if(self.detail.productChannel==0){
                self.detail.jumpAddress = 'itms-apps://itunes.apple.com/app/id1188618711';
            }else if (self.detail.productChannel==6){
                self.detail.jumpAddress = 'https://itunes.apple.com/cn/app/id1478234742?mt=8';
            }

            $("#addressS").attr("disabled","disabled");
        }else{
            $("#addressS").attr("disabled",false);
        }
        $('#upateContent').show();

    }



 self.updateSure =function() {

     if(!self.detail.productChannel){
         alert("渠道不能为空");
         return ;
     }

     if(!self.detail.clientType){
         alert("客户端类型不能为空");
         return ;
     }
     if(!self.detail.version){
         alert("版本号不能为空");
         return ;
     }

     if(self.detail.productChannel == 0 && self.detail.clientType == 1) {
         if (!self.detail.md5) {
             alert("MD5不能为空");
             return;
         }
     }
     if(!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/.test(self.detail.version)){
         alert("请输入0.0.0格式的版本号");
         return ;
     }
     if(!self.detail.description){
         alert("更新文案不能为空");
         return ;
     }

     if(self.detail.clientType=='1' && !self.detail.jumpAddress){
         alert("跳转地址不能为空");
         return;
     }

     //上线时间
     self.detail.onlineTime = $('#editOnlineTime').val()+"";
     if(!self.detail.onlineTime){
         alert("上线时间不能为空");
         return;
     }
    /* if(self.detail.isMinVersion ==null || self.detail.isMinVersion ==''){
         alert("最低版本不能为空");
         return;
     }*/
     //审核人
     var requestAuditPersio =self.detail.auditPerson;
     //提审说明
     var auditDescription=self.detail.requestAuditDescription;
     // 审核人
     if(!requestAuditPersio){
         alert("审核人不能为空");
         return ;
     }else{
         self.detail.auditNo=self.detail.auditPerson.no;
         self.detail.auditPerson=self.detail.auditPerson.name;
     }
     if(auditDescription!=null){
         if(auditDescription.length>18){
             alert("审核说明不能超过18个字符");
             return;
         }
     }
    
     var url = globalConfig.basePath + '/appConfig/versionControl/updateVersionControl';
     $http.post(url, self.detail).then(function successCallback(data) {
         if (data.data.code == '000') {
             var num = data.data.resp;
             if(num == 0){
                 alert("修改成功");
                 $("#editTask").hide();
                 window.location.reload();
                 return;
             }else if(num == 1){
                 alert('该版本号已存在或不符合规定');
                 return;
             }else if(num == 2){
                 alert('最低版本号需大于上次最低版本号');
                 return;
             }else if(num == 3){
                 alert('当前版本不是最新版本后，只能修改【最低版本】选项配置');
                 return;
             }

         }
     }), function errorCallback(response) {
        alert(response);
     }

 }

     self.initAddress = function (type) {
         if(type == 2){
             if(self.add.productChannel==0){
                 self.add.jumpAddress = 'itms-apps://itunes.apple.com/app/id1188618711';
                 self.detail.jumpAddress = 'itms-apps://itunes.apple.com/app/id1188618711';
             }else if (self.add.productChannel==6){
                 self.add.jumpAddress = 'https://itunes.apple.com/cn/app/id1478234742?mt=8';
                 self.detail.jumpAddress = 'https://itunes.apple.com/cn/app/id1478234742?mt=8';
             }

             $("#addressI").attr("disabled","disabled");
             $("#addressS").attr("disabled","disabled");
         }else{
             $("#addressI").removeAttr("disabled");
             self.add.jumpAddress = '';
             $("#addressS").removeAttr("disabled");
             self.detail.jumpAddress = '';
         }
     }
    //添加全部选中事件
    self.editAll = function(){
        $("#editwhite").attr("checked",false);
        $("#editblack").attr("checked",false);
        if($('#editall').is(':checked')){
            $("#editwhite").attr('disabled','disabled');
            $('#editselectaddwhiteId').attr('disabled','disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");
            $("#editblack").attr('disabled','disabled');
            $('#editselectaddblackId').attr('disabled','disabled');//下拉名单
            $("#editselectaddblackId").val("0");
        }else {
            $("#editwhite").removeAttr('disabled','disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");
            $("#editblack").removeAttr('disabled','disabled');
            $("#editselectaddblackId").removeAttr("disabled");
        }
    }


    //取消修改
    $scope.updateCancel = function(){
        $('#showUpdate').hide();

    }

    self.isSelected = function(id){

   		if(self.position){
   			if(self.position=="1,2"){
   	    		return true;
   	    	}
   			if(self.position==id){
   				return true;
   			}
   		}
   		return false;
 	 }

    //********************失效***************************
    //生效失效版本控制
    self.start = function(id,valid){
        $('#showStart').show();
        self.start.startValid=valid;
        self.start.id = id;
    }
    //确定失效生效版本控制
    self.confirmStart = function(id,valid){
        if(valid==0){
            valid=1;
        }else if(valid==1){
            valid=0;
        }
        var url = globalConfig.basePath+"/appConfig/Popup/takeEffectPopup?id="+id+"&valid="+valid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            //self.reset();
            // self.loading();
            self.queryVersionControlList(1);
            $('#showStart').hide();

        }, function errorCallback(response) {
            alert("失败....");
        });
        self.queryVersionControlList(1);
    }

    //取消生效失效版本控制
    self.cancelStart = function(){
        $('#showStart').hide();
    }

    //列表-获取显示客户端版本信息
    self.getVersionInfo = function () {
        var url = globalConfig.basePath+"/appConfig/versionControl/getVersionInfo";
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            var result = data.data.resp;
            self.androidMaxVersion = result.androidMaxVersion;
            self.androidMinVersion = result.androidMinVersion;
            self.iosMaxVersion = result.iosMaxVersion;
            self.iosMinVersion = result.iosMinVersion;

        }, function errorCallback(response) {
            alert("失败....");
        });
    }

    self.getVersionInfo();



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
     * 进行生效/失效版本控制
     */
    $scope.start = function (id,valid,SequenceId) {
        var url = "";
        if (valid == 0){
            url =  globalConfig.basePath+"/appConfig/announcementNew/takeEffect?id="+id+"&SequenceId="+SequenceId;
        }else if (valid == 1){
            url =  globalConfig.basePath+"/appConfig/announcementNew/failure?id="+id+"&SequenceId="+SequenceId;
        }
        $http({
            method: 'POST',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            $('#showStart').hide();
            //$scope.queryAnnouncement(1);
            self.queryVersionControlList(1);
        }, function errorCallback(response) {
            alert("失败....");
        });
    }

    //默认查询
    self.loading = function(){
        self.search.pageSize = "5";

        self.queryVersionControlList(1);
    }
    self.loading();
    // self.loading();


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
    // **************************审核********************************
    /**
     * 审核box
     */
    self.audit = function(record){
        if(record.auditStatus != "0"){
            alert('只能对待审核状态的数据进行操作');
            return;
        }
        self.auditStatus = "1";
        $('#auditShow').show();
        self.confirmRecord = angular.copy(record);
        self.auditDescription = "";

    };

    /**
     * 审核操作
     */
    self.confirm = function(){
        self.confirmRecord.auditStatus = self.auditStatus;
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath+"/appConfig/versionControl/auditing";
        $http.post(url,self.confirmRecord).then(function successCallback(callback) {

            if(callback.data.code == '000'){
                $('.take-start-box').hide();
                $scope.queryVersionControlList(1);
                alert("操作成功");
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };

    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function(opType,record){
        record.requestAuditDescription="";
        $scope.effectRecord = record;
        $scope.effectRecord.auditPerson={};
        self.effectRecord.auditPerson.no='';
        $('#takeEffect').show();
    };


    $scope.validateRecord = function(){
        // 审核人
        //var auditPerson = self.effectRecord.auditPerson;
        if(!self.effectRecord.auditPerson.no){
            alert("审核人不能为空");
            return ;
        }else{
            self.effectRecord.auditNo=self.effectRecord.auditPerson.no;
            self.effectRecord.requestAuditPersonEmail=self.effectRecord.auditPerson.email;
            self.effectRecord.auditPerson=self.effectRecord.auditPerson.name;
        }

        if(self.effectRecord.valid=='1'){
            self.effectRecord.valid='0';
        }else{
            self.effectRecord.valid='1';
        }
        var url = globalConfig.basePath+"/appConfig/announcementNew/takeEffectNew";
        $http.post(url,self.effectRecord).then( function(data){
                $('#takeEffect').hide();
                if(data.data.code == '000'){
                    alert(data.data.message);
                    $scope.queryVersionControlList(1);
                }
            },function(response) {
                alert("请求失败了....");
            }
        );


    };
    $scope.openTopTip = function(x){
    	self.topRecord = x;
    	$('#moveTop').show();
    }
    $scope.moveTop = function(){
        var url = globalConfig.basePath+"/appConfig/announcementNew/moveTop";
        $http.post(url,self.topRecord).then( function(data){
                $('#moveTop').hide();
                alert('置顶成功');
                $scope.queryVersionControlList(1);
            },function(response) {
                alert("请求失败了....");
            }
        );


    };
    $scope.moveTopCancel = function(){
    	$('#moveTop').hide();
    }

}])

App.filter("priorityFilter",function(){
    return function (val) {
        var res="";
        switch (val){
            case 0:
                res="正常"
                break;
            case 1:
                res="置顶"
                break;
        }
        return res;
    }
})

App.filter("positionFilter",function(){
    return function (val) {
        var res="";
        switch (val){
            case '301':
                res="社区资讯"
                break;
            case '2':
                res="我的页"
                break;
            case '1,2':
                res="首页/我的页"
                break;
        }
        return res;
    }
})
