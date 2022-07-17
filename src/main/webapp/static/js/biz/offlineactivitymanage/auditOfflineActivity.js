'use strict';

var App = angular.module('splashAppOffline', [], angular.noop);
App.controller('splashControllerOffline', ['$scope', '$http', function ($scope, $http) {
    var self = $scope;
    self.search = {};
    self.search.configType = 1;


    self.add = {};
    self.updateScene = {};
    self.continuationTypeInfo = "";
    $scope.loginName = globalConfig.loginName;
    self.editpositions = '';


    /**
     * 拉取审核人列表
     */
    $scope.pullAuditPersons = function () {
        var url = globalConfig.basePath + "/otc/memberEnjoy/getAuditPersionList";
        $http.get(url).then(function successCallback(callback) {
            if (callback.data.code == '000') {
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


    //查询
    self.querySplashConfigList = function (pageNum) {
        // alert("线下活动查询list方法");
        if (!pageNum) {
            self.search.pageNo = self.pageNo;
        } else {
            if (pageNum > self.search.pageCount && self.search.pageCount>0) {
                self.search.pageNo = self.search.pageCount;
            } else {
                self.search.pageNo = pageNum;
            }
        }
        // self.search.onTime = $("#searchonTime").val();
        var url = globalConfig.basePath + "/audit_offline_activity/list";
        $http.post(url, self.search).then(
            function (data) {
                // alert("data.code: " + data.data.code);
                if (data.data.code == '000') {
                    if (data.data.resp.currentPage) {
                        self.search.pageNo = data.data.resp.currentPage;
                    } else {
                        self.search.pageNo = 1;
                    }
                    self.search.pageSize = data.data.resp.pageSize + "";
                    self.search.pageCount = data.data.resp.pageCount;
                    self.search.totalRowSize = data.data.resp.totalRowSize;
                    self.splashConfigList = data.data.resp.result;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    };

    //重置
    self.reset = function () {
        // self.search={};
        self.search.productChannel = "0";//渠道
        self.search.onlineStatus = "";//上线状态
        self.search.delFlag = "";//产品版本
        self.search.status = "";//是否生效
        self.search.pageSize = "5";
        self.search.pageNo=1;
    }


    //添加弹窗
    self.addScreen = function () {
        $('#addShow').show();
        self.add = {};
        self.add.productChannel = '0';
        self.add.configType = "1";
        self.add.giftType = 1;
    }


    //确认添加
    self.commitScreen = function () {
        if (self.add.productChannel == null) {
            alert("渠道不能为空");
            return;
        }
        if (!self.add.title) {
            alert("主题不能为空");
            return;
        }
        if (!self.add.city) {
            alert("城市不能为空");
            return;
        }
        
        if (!self.add.position) {
            alert("活动地点不能为空");
            return;
        }
        
        if (!self.add.notice) {
            alert("注意事项不能为空");
            return;
        }
        
        if (!self.add.activityTime) {
            alert("活动时间不能为空");
            return;
        }
        
        if (!self.add.requestAuditDescription) {
            alert("提审说明不能为空");
            return;
        }

        self.add.signTime = $('#signTime').val() + "";
        self.add.deadline = $('#deadline').val() + "";
         if (!self.add.signTime || !self.add.deadline) {
             alert("上线时间下线时间不能为空");
             return;
         }

        if (self.add.deadline <= self.add.signTime) {
            alert("下线时间必须大于上线时间");
            return;
        }
         var offlineTime = self.add.deadline;
         var offlineTimes = offlineTime.split(" ");
         var miniTime = "23:59:59";
         self.add.deadline = offlineTimes[0] + " " + miniTime;
        // 审核人
        var auditPerson = self.add.auditPerson;
        if (!self.add.auditPerson) {
            alert("审核人不能为空");
            return;
        } else {
            self.add.auditNo = self.add.auditPerson.no;
            self.add.requestAuditPersonEmail = self.add.auditPerson.email;
            self.add.auditPerson = self.add.auditPerson.name;
        }
        var url = globalConfig.basePath + "/audit_offline_activity";
        $http.post(url, self.add).then(
            function (data) {
                alert(data.data.message);
                $(".upstatus").html("");
                $('#addShow').hide();
                self.add = {};
                //self.reset();
                //self.loading();
                self.querySplashConfigList(1);
            }, function (response) {
                alert("请求失败了....");
            }
        );

    }


    //查询黑白名单列表
    self.queryWhiteAndBlack = function () {
        $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
            function (data) {
                self.blackList_qb = data.data.resp.black_qb;
                self.blackList_wk = data.data.resp.black_wk;
                self.whiteList_qb = data.data.resp.white_qb;
                self.whiteList_wk = data.data.resp.white_wk;
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }

    //查询黑白名单列表
    self.queryEditWhiteAndBlack = function () {
        $http.get(globalConfig.basePath + "/appconfig/WhiteBlankList/queryListName").then(
            function (data) {
                self.editblackList_qb = data.data.resp.black_qb;
                self.editblackList_wk = data.data.resp.black_wk;
                self.editwhiteList_qb = data.data.resp.white_qb;
                self.editwhiteList_wk = data.data.resp.white_wk;
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );

    }

    //按渠道类型获取版本列表
    self.getTypeVersionList = function (productChannel, versions, loginStatus) {
        self.search.productChannel = productChannel + "";
        var parentid;
        parentid = $('#addproductChannel').val();
        if (parentid)
            parentid = productChannel;
        if (!versions)
            versions = "";
        if (!loginStatus)
            loginStatus = 1;
        var type;//= getType(productChannel,'banner');
        if (productChannel == 0) {
            type = 'sys_product_version_wk_banner';
        } else if (productChannel == 2) {
            type = 'sys_product_version_wx_banner';
        } else if (productChannel == 1) {
            type = 'sys_product_version_qb_banner';
        } else if (productChannel == 3) {
            type = 'sys_product_version_hyplus_banner';
        }else if(productChannel==4){
            type = 'sys_product_version_applet_banner';
        }
        var url = globalConfig.basePath + "/rDict/getSearchVersionAndPosition?positiontype=sys_banner_position&versiontype=" + type + "&parentid=" + parentid + "&type=sys_banner&productVersion=" + versions + "&productChannel=" + productChannel + "&loginStatus=" + loginStatus;
        ;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //	if(data.data.resp.result[0].Version.length>0)
            self.typeVersionList = data.data.resp.result[0].Version;
            //self.search.productVersion = self.typeVersionList[0].label;
            //self.search.loginStatus='1';
            self.search.loginStatus = '';
            // self.searchPostionCheck();
            if (data.data.resp.result[0].Position.length > 0) {
                self.positionsList = data.data.resp.result[0].Position;
                self.search.position = self.positionsList[0].value;
            } else {
                self.positionsList = [];
                self.search.position = '';
            }
            self.loading();

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };

    //按渠道类型获取版本列表
    self.getEditTypeVersion = function (productChannel, versions, loginStatus) {
        self.search.productChannel = productChannel + "";
        var parentid;
        parentid = $('#addproductChannel').val();
        if (parentid)
            parentid = productChannel;
        if (!versions)
            versions = "";
        if (!loginStatus)
            loginStatus = 1;
        var type;//= getType(productChannel,'banner');
        if (productChannel == 0) {
            type = 'sys_product_version_wk_banner';
        } else if (productChannel == 2) {
            type = 'sys_product_version_wx_banner';
        } else if (productChannel == 1) {
            type = 'sys_product_version_qb_banner';
        } else if (productChannel == 3) {
            type = 'sys_product_version_hyplus_banner';
        }else if(productChannel==4){
            type = 'sys_product_version_applet_banner';
        }
        var url = globalConfig.basePath + "/rDict/getSearchVersionAndPosition?positiontype=sys_banner_position&versiontype=" + type + "&parentid=" + parentid + "&type=sys_banner&productVersion=" + versions + "&productChannel=" + productChannel + "&loginStatus=" + loginStatus;
        ;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            //	if(data.data.resp.result[0].Version.length>0)
            self.typeVersionList = data.data.resp.result[0].Version;
            if (data.data.resp.result[0].Position.length > 0) {
                self.positionsList = data.data.resp.result[0].Position;
            } else {
                self.positionsList = [];
            }
            self.updateScene.positions = self.editpositions;

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    };


    // 登陆选择
    self.searchPostionCheck = function () {
        var addproductChannel = $("#searchproductChannel").val();//渠道
        var versions = $("#searchproductVersion").val();//渠道;// 版本
//	         if(!versions){
//	            alert("请选择产品版本");
//	            return;
//	          }
//              // 登陆状态
        var addLoginStatus = $("#searchLoginStatus").val();//获取选中项的值
//              if(addLoginStatus==null){
//                  alert("请选择弹登陆状态");
//                  return;
//              }
        var url = globalConfig.basePath + "/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion=" + versions + "&productChannel=" + addproductChannel + "&loginStatus=" + addLoginStatus;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.resp.result.length == 0) {
                //self.addPositionsList = data.data.resp.result;
                var obj = new Object();
                var list = new Array();
//            	  				obj.value = "";
//            	  				obj.label ="请选择";
//            	  				list[0]=obj;
                self.positionsList = [];
                self.search.position = '';
            } else {
                self.positionsList = data.data.resp.result;
                self.search.position = self.positionsList[0].value;
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取公告位置失败了....");
        });
    }


    //查看
    self.check = function (id) {
        $('#showCheck').show();
        var url = globalConfig.basePath + "/audit_offline_activity?id=" + id;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            self.openScreen = data.data.resp;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
    }

    // self.check = function (query) {
    //     var url = globalConfig.basePath + "/audit_offline_activity?id=" + id;
    //     $http({
    //         method: 'GET',
    //         url: url,
    //     }).then(function successCallback(data) {
    //         var curCount = data.data.data.curCount;
    //         $('#showCheck').show();
    //         self.openScreen = {};
    //         console.log(query);
    //         self.openScreen.curCount = curCount;
    //         self.openScreen = angular.copy(query);
    //
    //     }, function errorCallback(response) {
    //         $('#showCheck').show();
    //         self.openScreen = {};
    //         console.log(query);
    //         self.openScreen.curCount = "服务端查询接口出错了!";
    //         self.openScreen = angular.copy(query);
    //         // 请求失败执行代码
    //         alert("服务端查询接口出问题了.");
    //     });
    // }


    //查看确定和取消
    self.checkOKAndNO = function () {
        $('#showCheck').hide();
    }


    self.isSelected = function (id) {
        if (self.continuationTypeInfo) {
            var versions = self.continuationTypeInfo.split(",");
            for (var i = 0; i < versions.length; i++) {
                if (id.length == versions[i].length && versions[i].indexOf(id) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    // *****************************************
    // 登陆选择
    self.editPostionCheck = function (editproductChannel, versions, editLoginStatus) {
        if (!editproductChannel) {
            if (editproductChannel != 0) {
                editproductChannel = $("#editproductChannel").val();//渠道
            }
        }

        if (!versions) {
            versions = "";// 版本
            $('.updateVersionCheckbox').each(function () {
                if (this.checked == true) {
                    versions += $(this).val() + ",";
                }
            });
        }

        if (!versions) {
            //alert("请选择产品版本");
            // $("#addLoginStatus0").prop("checked",false);
            //$("#addLoginStatus1").prop("checked",false);
            return;
        }
        // 登陆状态
        // var addLoginStatus = $("input[name='addLoginStatus']:checked").val();//获取选中项的值
        if (!editLoginStatus) {
            if (editLoginStatus != 0) {
                editLoginStatus = self.updateScene.loginStatus;
            }

        }

        if (editLoginStatus == null) {
            //alert("请选择弹登陆状态");
            return;
        }
        //var url = globalConfig.basePath+"/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion="+versions+"&productChannel="+addproductChannel+"&loginStatus="+addLoginStatus;
        var url = globalConfig.basePath + "/rDict/getChannelVersionAndPosition?type=sys_banner&productVersion=" + versions + "&productChannel=" + editproductChannel + "&loginStatus=" + editLoginStatus;

        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.resp.result.length == 0) {
                //self.addPositionsList = data.data.resp.result;
                var obj = new Object();
                var list = new Array();
                obj.value = "";
                obj.label = "请选择";
                list[0] = obj;
                //self.addPositionsList =list;
                self.editPositionsList = list;
            } else {
                //self.addPositionsList = data.data.resp.result;
                self.editPositionsList = data.data.resp.result;
                self.updateScene.positions = data.data.resp.result[0].value;
                //updateScene.productVersion
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取弹窗位置失败了....");
        });
    }

    self.queryEditWhiteAndBlack();
    //修改回显
    self.update = function (query) {
        console.log(query);
        $('#showUpdate').show();
        self.updateScene = {};
        // query.productChannel = query.productChannel + "";
        // query.loginStatus = query.loginStatus + "";
        // query.positions = query.positions + "";
        query.auditPerson = "";
        // query.type = query.type + "";
        self.updateScene = angular.copy(query);
    }


    self.update_older = function (query) {
        self.continuationTypeInfo = "";
        self.continuationTypeInfo = query.productVersion;
        $('#showUpdate').show();
        self.updateScene = {};
        query.productChannel = query.productChannel + "";
        query.loginStatus = query.loginStatus + "";
        query.positions = query.positions + "";
        self.updateScene = angular.copy(query);
        $("#editselectaddwhiteId").val("");
        $("#editselectaddblackId").val("");
        $('#editall').prop("checked", false);//默认全部不选择
        $("#editwhite").attr("checked", false);
        $("#editblack").attr("checked", false);
        //$("#editproductChannel").val(query.productChannel);
        var sequenceId = query.sequenceId;
        $("#editall").removeAttr("disabled");
        if (query.loginStatus == '0') {
            $("#editall").attr('disabled', 'disabled');
            $('#editall').prop("checked", true);

        }
        //var url = globalConfig.basePath+"/appConfig/banner/getVersionAndPosition?sequenceIde="+sequenceId;
        /***        var url = globalConfig.basePath+"/appConfig/banner/getVersionAndPosition?sequenceId="+sequenceId;
         $.ajax({
			   type: "GET",
			   dataType: 'json',
			   async:false,
			   url: url ,
			   success: function(data){
				   console.log(data);
//				   if(data.resp.result[0].Version.length>0){
//	        			self.typeVersionList = data.resp.result[0].Version;
				   if(data.code='000'){
					   var productVersion='';
					   for(var i=0;i<data.resp.result.length;i++){
						   productVersion=productVersion+data.resp.result[0].productVersion+",";
					   }
					   self.updateScene.productVersion=productVersion;
				   }
			   }
			});**/
        //self.queryWhiteAndBlack();
        self.queryEditWhiteAndBlack();
        query.valid = query.valid + "";
        query.whiteId = query.whiteId + "";
        query.blackId = query.blackId + "";
        self.updateScene = query;
        if (query.showType == 0) {
            $('#editall').prop("checked", true);
            $('#editwhite').prop("checked", false);
            $('#editblack').prop("checked", false);
            $("#editwhite").attr('disabled', 'disabled');
            $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");
            $("#editblack").attr('disabled', 'disabled');
            $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
            $("#editselectaddblackId").val("0");

        } else if (query.showType == 1) {
            $('#editwhite').prop("checked", true);
            $('#editblack').prop("checked", false);
            $('#editall').prop("checked", false);
        } else if (query.showType == 2) {
            $('#editblack').prop("checked", true);
            $('#editwhite').prop("checked", false);
            $('#editall').prop("checked", false);
        } else if (query.showType == 3) {
            $('#editblack').prop("checked", true);
            $('#editwhite').prop("checked", true);
            $('#editall').prop("checked", false);
        }
    }


    //修改
    self.update_old = function (query) {
        $('#showUpdate').show();
        self.updateScene = {};
        $("#editselectaddwhiteId").val("");
        $("#editselectaddblackId").val("");
        $('#editall').prop("checked", false);//默认全部不选择
        $("#editwhite").attr("checked", false);
        $("#editblack").attr("checked", false);
        var aa = 0;

        var param = query.productChannel;
        var parentid;
        parentid = $('#editproductChannel').val();
        if (parentid)
            parentid = query.productChannel;
        var type;
        if (param == 0 || param == 2) {
            type = 'sys_product_version_wk';
        } else {
            type = 'sys_product_version_qb';
        }
        var url = globalConfig.basePath + "/rDict/getVersionAndPosition?positiontype=sys_banner_position&versiontype=" + type + "&parentid=" + parentid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            console.log(aa);
            if (aa == 0) {
                if (data.data.resp.result[0].Version.length > 0) {
                    self.typeVersionList = data.data.resp.result[0].Version;
                    //self.updateScene.productVersion = self.typeVersionList[0].label;

                }
            }
            if (data.data.resp.result[0].Position.length > 0) {
                self.editPositionsList = data.data.resp.result[0].Position;
                console.log(query);
            }


        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("获取版本列表失败了....");
        });
        aa = 2;
        //self.getEditTypeVersionList(query);
        query.productChannel = query.productChannel + "";
        self.queryWhiteAndBlack();
        query.valid = query.valid + "";
        query.whiteId = query.whiteId + "";
        query.blackId = query.blackId + "";
        self.updateScene = query;

        var versions = query.productVersion.split(",");
        $('.updateVersionCheckbox').each(function () {
            var v = $(this).val();
            var a = 1;
            for (var i = 0; i < versions.length; i++) {
                if (v == versions[i]) {
                    a = 0;
                }
            }
            if (a == 0) {
                $(this).attr("checked", "checked");
            }
        })


        if (query.showType == 0) {
            $('#editall').prop("checked", true);
            $('#editblack').prop("checked", false);
            $('#editblack').prop("checked", false);
            $('#editwhite').attr('disabled', 'disabled');
            $('#editblack').attr('disabled', 'disabled');
            $("#editwhite").val("");
            $("#editblack").val("");
        } else if (query.showType == 1) {
            $("#editwhite").removeAttr("disabled");
            $("#editblack").removeAttr("disabled");
            $('#editall').prop("checked", false);
            $('#editwhite').prop("checked", true);
            $("#editblack").val("");
        } else if (query.showType == 2) {
            $('#editall').prop("checked", false);
            $('#editblack').prop("checked", true);
            $("#editwhite").val("");
        } else if (query.showType == 3) {
            $("#editwhite").removeAttr("disabled");
            $("#editblack").removeAttr("disabled");
            $("#editwhite").removeAttr("disabled");
            $("#editblack").removeAttr("disabled");
            $('#editall').prop("checked", false);
            $('#editwhite').prop("checked", true);
            $('#editblack').prop("checked", true);
        }
    }


    self.getEditTypeVersionList = function (param) {
        self.updateScene.positions = '0';
        var parentid;
        parentid = $('#editproductChannel').val();
        if (parentid)
            parentid = param;
        var type;
        if (param == 0 || param == 2) {
            type = 'sys_product_version_wk';
        } else {
            type = 'sys_product_version_qb';
        }
        var url = globalConfig.basePath + "/rDict/getVersionAndPosition?positiontype=sys_banner_position&versiontype=" + type + "&parentid=" + parentid;
        $.ajax({
            type: "GET",
            dataType: 'json',
            async: false,
            // data:{id:id},
            //data:redJson,
            url: url,
            success: function (data) {
                console.log(data);
                if (data.resp.result[0].Version.length > 0) {
                    self.typeVersionList = data.resp.result[0].Version;

                    if (data.resp.result[0].Position.length > 0) {
                        self.editPositionsList = data.resp.result[0].Position;
                        //console.log(query);
                    }
                }
            }
        });
    };


    //确认修改
    self.confirmUpdate = function () {
        if (self.updateScene.productChannel == null) {
            alert("渠道不能为空");
            return;
        }
        //
        if (!self.updateScene.title) {
            alert("主题不能为空");
            return;
        }
        
        if (!self.updateScene.city) {
            alert("城市不能为空");
            return;
        }
        
        if (!self.updateScene.position) {
            alert("活动地点不能为空");
            return;
        }
        
        if (!self.updateScene.notice) {
            alert("注意事项不能为空");
            return;
        }
        if (!self.updateScene.requestAuditDescription) {
            alert("提审说明不能为空");
            return;
        }
        
        if (!self.updateScene.activityTime) {
            alert("活动时间不能为空");
            return;
        }

        self.updateScene.signTime = $('#updateSignTime').val()+"";
        self.updateScene.deadline = $('#updateDeadline').val()+"";
         if (!self.updateScene.signTime || !self.updateScene.deadline) {
             alert("上线时间下线时间不能为空");
             return;
         }

         if (self.updateScene.deadline <= self.updateScene.signTime) {
             alert("下线时间必须大于上线时间");
             return;
         }
         var deadline = self.updateScene.deadline;
         var offlineTimes = deadline.split(" ");
         var miniTime = "23:59:59";
         self.updateScene.deadline = offlineTimes[0] + " " + miniTime;
        // 审核人
        var auditPerson = self.updateScene.auditPerson;
        if (!self.updateScene.auditPerson) {
            alert("审核人不能为空");
            return;
        } else {
            self.updateScene.auditNo = self.updateScene.auditPerson.no;
            self.updateScene.requestAuditPersonEmail = self.updateScene.auditPerson.email;
            self.updateScene.auditPerson = self.updateScene.auditPerson.name;
        }
        var url = globalConfig.basePath + "/audit_offline_activity";
        console.info(self.updateScene);

        $http.put(url, self.updateScene).then(
            function (data) {
                alert(data.data.message);
                $(".upstatus").html("");
                $('#showUpdate').hide();
                $('#fileUrl2').prop("value", "");
                $('#fileUrl1').prop("value", "");
                self.updateScene = {};
                self.querySplashConfigList(1);
            }, function (response) {
                alert("请求失败了....");
            }
        );
    }

    //取消修改
    self.updateCancel = function () {
        $('#showUpdate').hide();
        self.updateScene = {};
        // self.reset();
        // self.loading();
        self.querySplashConfigList(1);
    }

    //生效失效
    self.start = function (id, valid) {
        $('#showStart').show();
        self.start.startValid = valid;
        self.start.id = id;
    }

    //确定失效生效Banner
    self.confirmStart = function (id, valid) {
        if (valid == 0) {
            valid = 1;
        } else if (valid == 1) {
            valid = 0;
        }
        var url = globalConfig.basePath + "/appConfig/banner/takeEffectBanner?id=" + id + "&valid=" + valid;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            alert(data.data.message)
            //self.reset();
            //self.loading();
            self.querySplashConfigList(1);
            $('#showStart').hide();

        }, function errorCallback(response) {
            alert("失败....");
        });
        self.querySplashConfigList(1);
    }

    //取消生效失效线下活动
    self.cancelStart = function () {
        $('#showStart').hide();
    }


    //排序
    self.stort = function () {
        var searchproductChannel = $("#searchproductChannel").val();
        var searchproductVersion = $("#searchproductVersion").val();
        var searchpositions = $("#searchpositions").val();
        var searchLoginStatus = $("#searchLoginStatus").val();

        if (!searchproductChannel) {
            alert("请在查询条件中选择渠道");
            return;
        }
        if (!searchproductVersion) {

            alert("请在查询条件中选择产品版本");
            return;
        }
        if (!searchpositions) {
            alert("请在查询条件中Banner位置");
            return;
        }
        if (!searchLoginStatus) {
            alert("请在查询条件中选择登陆状态");
            return;
        }

//           if(searchLoginStatus=='0'){
//        		alert("只有已登陆状态才可以进行排序。");
//            return;
//        }

        $('#showPriority').show();
        var url = globalConfig.basePath + "/appConfig/banner/selectSort?productChannel=" + searchproductChannel + "&productVersion=" + searchproductVersion + "&positions=" + searchpositions;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.code == '000') {
                for (var i = 0; i < data.data.resp.result.length; i++) {
                    data.data.resp.result[i].priority = i + 1;
                }
                self.strotList = data.data.resp.result;
            }
            // self.strotList = data.data.resp.result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
    }

    //优先级排序
    self.stort_old = function () {
        var ids = "";
        $('.listChecked').each(function () {
            if (this.checked == true) {
                ids += $(this).val() + ",";
            }
        })
        if (ids == "" || ids == null) {
            alert("请选择要排序的对象");
            return;
        }
        $('#showPriority').show();
        var url = globalConfig.basePath + "/appConfig/banner/selectByPrimaryIds?ids=" + ids;
        $http({
            method: 'GET',
            url: url,
        }).then(function successCallback(data) {
            if (data.data.code == '000') {
                for (var i = 0; i < data.data.resp.result.length; i++) {
                    data.data.resp.result[i].priority = i + 1;
                }
                self.strotList = data.data.resp.result;
            }


        }, function errorCallback(response) {
            // 请求失败执行代码
            alert("根据id获取对象失败....");
        });
    }


    self.readcolor = function (count) {
        var length = self.strotList.length;
        if (count = 1) {
            $("#downMove").addClass("smalla-red");
            $("#upMove").removeClass("smalla-red");
        }
        if (count = length) {
            $("#upMove").addClass("smalla-red");
            $("#downMove").removeClass("smalla-red");
        }


    }
    //移动
    var moveList = new Array();
    self.move = function (type) {
        if ($("input[class='moveCheckbox']:checked").length > 1) {
            alert("请选择一个进行移动");
            return;
        }
        var length = self.strotList.length;


        $('.moveCheckbox').each(function () {
            if (this.checked == true) {
                if (type == 'S') {//上移
                    var me = $(this).val() - 1;
                    if (me == 0) {
                        alert("已经第一了你还要往那移");
                        return;
                    }
                    var move0 = self.strotList[me];//当前选中的
                    var move1 = self.strotList[me - 1];//上一个
                    self.strotList[me - 1] = move0;//self.strotList[me];//当前选中的上移一个
                    self.strotList[me] = move1;// 当前选中的
//                     self.strotList[me-1].priority = self.strotList[me-1].priority-1;
//                     self.strotList[me].priority =self.strotList[me].priority+1;
//                     self.strotList[me-1].priority =$(this).val()+1;
//                     self.strotList[me].priority =$(this).val()-1;
                    self.strotList[me - 1].priority = Number($(this).val()) - Number(1);
                    self.strotList[me].priority = Number($(this).val());
                } else if (type == 'X') {// 下移
                    var me = $(this).val() - 1;
                    if (me == length - 1) {
                        alert("已经最后了,还要往那移");
                        return;
                    }
                    var move0 = self.strotList[me];// 下一个banner
                    move0.priority = Number($(this).val()) + Number(1);
                    var move1 = self.strotList[me + 1];// 下一个banner
                    move1.priority = Number($(this).val());
                    self.strotList[me + 1] = move0; //self.strotList[me];// 当前的选中的放到移动的位置，
                    self.strotList[me] = move1;// 下一个移动到当前的位置
                }
            }
        })
    }

    //排序删除
    self.remove = function () {
        var length = self.strotList.length;
        $('.moveCheckbox').each(function () {
            if (this.checked == true) {
                var me = $(this).val() - 1;
                self.strotList.splice(me, 1);
            }
        })
        for (var i = 0; i < length - 1; i++) {
            self.strotList[i].priority = i + 1;
        }
    }

    //确定排序
    self.moveCommit = function () {
        var url = globalConfig.basePath + "/appConfig/banner/moveCommit";
        $http.post(url, self.strotList).then(
            function (data) {
                alert(data.data.message);
                //self.reset();
                //self.loading();
                self.querySplashConfigList(1);
                $('#showPriority').hide();
                self.strotList = {};
            }, function (response) {
                alert("请求失败了....");
            }
        );
    }

    //排序取消
    self.moveCancel = function () {
        $('#showPriority').hide();
        self.strotList = {};
    }


    //添加全部选中事件
    self.completeAll = function () {
        $("#white").attr("checked", false);
        $("#black").attr("checked", false);
        if ($('#all').is(':checked')) {
            $("#white").attr('disabled', 'disabled');
            $('#selectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            $("#selectaddwhiteId").val("");
            $("#black").attr('disabled', 'disabled');
            $('#selectaddblackId').attr('disabled', 'disabled');//下拉名单
            $("#selectaddblackId").val("");
        } else {
            $("#white").removeAttr('disabled', 'disabled');
            $("#selectaddwhiteId").removeAttr("disabled");
            $("#black").removeAttr('disabled', 'disabled');
            $("#selectaddblackId").removeAttr("disabled");
        }
    }

    //添加全部选中事件
    self.editAll = function () {
        $("#editwhite").attr("checked", false);
        $("#editblack").attr("checked", false);
        if ($('#editall').is(':checked')) {
            $("#editwhite").attr('disabled', 'disabled');
            $('#editselectaddwhiteId').attr('disabled', 'disabled');//下拉名单
            $("#editselectaddwhiteId").val("0");
            $("#editblack").attr('disabled', 'disabled');
            $('#editselectaddblackId').attr('disabled', 'disabled');//下拉名单
            $("#editselectaddblackId").val("0");
        } else {
            $("#editwhite").removeAttr('disabled', 'disabled');
            $("#editselectaddwhiteId").removeAttr("disabled");
            $("#editblack").removeAttr('disabled', 'disabled');
            $("#editselectaddblackId").removeAttr("disabled");
        }
    }


    //默认查询
    self.loading = function () {
        // alert("线下活动loading。。。")
        // self.search.productChannel = "0";
        self.search.productVersion = "";
        self.search.pageSize = "5";
        self.search.configType = "1";
        self.querySplashConfigList(1);

    }


    self.getTypeVersionList(0, "", 1);

// **************************审核********************************
    /**
     * 审批
     */
    self.audit = function (record) {
        if (record.status != 0) {
            alert('只能对待审核状态的数据进行操作');
            return;
        }
        self.status = "1";
        $('#auditShow').show();
        self.confirmRecord = angular.copy(record);
        // 	self.auditStatus = "2";
        self.auditDescription = "";

    };
    // 审核 点确定即调此方法
    self.confirm = function () {
        self.confirmRecord.status = self.status;
        self.confirmRecord.auditDescription = self.auditDescription;
        var url = globalConfig.basePath + "/audit_offline_activity/audit";
        $http.post(url, self.confirmRecord).then(function successCallback(callback) {

            if (callback.data.code == '000') {
                $('.take-start-box').hide();
                if (callback.data.resp.code == '000000') {
                	  alert("操作成功");
                      $scope.querySplashConfigList(1);
                }else{
                	 alert(callback.data.resp.message);
                }
            } else {
                console.error(callback.data);
                alert("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };


    //生效失效

    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function (opType, record) {
        record.requestAuditDescription = "";
        $scope.effectRecord = record;
        $scope.effectRecord.auditPerson = {};
        $scope.effectRecord.auditPerson.no = '';
        $('#takeEffect').show();
    };

    //确认执行失效（生效）
    $scope.validateRecord = function () {
        // 审核人
        //var auditPerson = self.effectRecord.auditPerson;
        if (!self.effectRecord.auditPerson.no) {
            alert("审核人不能为空");
            return;
        } else {
            self.effectRecord.auditNo = self.effectRecord.auditPerson.no;
            self.effectRecord.requestAuditPersonEmail = self.effectRecord.auditPerson.email;
            self.effectRecord.auditPerson = self.effectRecord.auditPerson.name;
        }

        if (self.effectRecord.delFlag == 'T') {
            self.effectRecord.delFlag = 'F';
        } else {
            self.effectRecord.delFlag = 'T';
        }

        var url = globalConfig.basePath + "/audit_offline_activity";
        $http.put(url, self.effectRecord).then(function (data) {
                $('#takeEffect').hide();
                if (data.data.code == '000') {
                    alert(data.data.message);
                    $scope.querySplashConfigList(1);
                }
            }, function (response) {
                alert("请求失败了....");
            }
        );


    };

    /**
     *是否显示类型
     */
    self.onShowValueType = function (positions) {

        if (positions == "0") {
            self.typeShow = true;
        } else {
            self.typeShow = false;
            self.videoShow = false;
            self.add.type = "1";
        }
    };
    /**
     * 是否显示视频
     */
    self.changeValueType = function (type) {
        if (type == "2") {
            self.videoShow = true;
            self.showPicer = false;
            $('#fileUrl').prop("value", "");
            $('#image_prew').prop("src", "");
            $('#fileUrl1').prop("value", "");
            $('#image_prew1').prop("src", "");
        } else {
            self.videoShow = false;
            self.showPicer = true;
            $('#fileUrl').prop("value", "");
            $('#image_prew').prop("src", "");
            $('#fileUrl1').prop("value", "");
            $('#image_prew1').prop("src", "");
        }
    }

    /**
     * 导出数据，操作前的预处理
     */
    $scope.export = function (record) {
        $scope.exportObj = {};
        self.exportObj.id = record.id;
        $('#export').show();
    };


    $scope.confirmExport = function () {
        // alert("导出。。。" + self.exportObj.key);
    	var key = self.exportObj.key;
    	if(key.length<4 ||key.length>8){
    		alert("请正确输入附件密码长度,长度为4~8");
    		return false;
    	}
        var url = globalConfig.basePath + "/audit_offline_activity/export?id=" + self.exportObj.id + "&key=" + key;
        $http.get(url).then(function (data) {
                $('#export').hide();
                if (data.data.code == '000') {
                	 alert(data.data.resp.message);
                     $scope.querySplashConfigList(1);
                }else{
                	alert(data.data.message);
                    $scope.querySplashConfigList(1);
                }
            }, function (response) {
                alert("请求失败了....");
            }
        );
    };

}]);
