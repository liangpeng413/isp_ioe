App.controller("copyDetailController",['$scope','$http',function ($scope,$http) {
    var self = $scope;

    /**
     * 修改
     */
    self.$on('abTestUpdateShow',function (b,param) {
        self.updateId=param.id;
        self.copy(param);
        self.showUpdateVersion(param);
        self.queryTagSelectList(param);
        self.checktimedetail(param);
        self.updshowrealtimeTag = "";
    })

    /**
     * 修改版本回显
     */
    self.showUpdateVersion = function (param) {
        self.update={}
        if(param.channelCode=='悟空理财'){
            self.update.channel = 'WK';
        }else if(param.channelCode=='钱包'){
            self.update.channel = 'QB';
        }
        var url = globalConfig.basePath + "/abTest/getAbTestDetail?testStrategyId=" + param.id;
        $http.get(url).then(
            function (data) {
                console.log("abtest修改反显的数据",data);
                if (data.data.code == '000') {
                    //是否为修改
                    self.isUpdate=1;

                    //回显版本
                    var versionList = data.data.resp.data.touchVersionDtoList;
                    //回显其他版本
                    self.otherVersions=[];
                    angular.forEach(versionList,function (each) {
                        if(each.versionName=='原始版本'){
                            //版本回显
                            self.ysVersion={};
                            self.returnShowVersion(0,each);
                        }else{
                            self.returnShowVersion(1,each);
                        }

                    })

                    //变量回显
                    var strategyConvert =data.data.resp.data.strategyConvert;
                    self.isConfigValable=strategyConvert.canUpdateTouchWay;
                    var canUpdateAttribute = strategyConvert.canUpdateAttribute;
                    self.varableChedked(self.isConfigValable);
                    setTimeout(function () {
                        var tests = '';
                        if(self.copyVarableList!=null && self.copyVarableList!='undefined' && canUpdateAttribute != null && canUpdateAttribute != ''){
                            angular.forEach(self.copyVarableList,function (each) {
                                if(canUpdateAttribute.indexOf(each.key) != -1){
                                    tests += each.value + ";"
                                    $('.'+each.key).attr("checked","checked");
                                }
                            })
                            self.tests=tests;
                            self.canUpdateAttribute=canUpdateAttribute;
                        }
                    })
                }

            }
        )
    }

    /**
     * 修改版本回显
     * @type:0 原始版本,1其他版本
     * @versionParam 版本数据
     */
    self.returnShowVersion = function (type,versionParam) {
        self.version={};
        //版本名称
        self.version.verName = versionParam.versionName;
        self.version.headVerName = versionParam.versionName;
        //版本描述
        self.version.verDesc=versionParam.remark;
        //触达类型
        self.version.strategyType = versionParam.touchType;
        //触达方式-默认值
        self.strategyTypeChange(self.version.strategyType);
        self.version.touchWay = versionParam.touchWay;
        //在线客服or电话客服
        if(self.version.strategyType=='CUSTOMER_SERVICE' || self.version.strategyType=='PHONE'){
            //触达时间
            self.version.strategyTime = versionParam.touchTimeType;
        }
        //奖励or自定义
        if('AWARD'==self.version.strategyType || 'USER_DEFINED'==self.version.strategyType){
            //多奖励
            if('AWARD'==self.version.strategyType){
                self.version.awardContentDto = versionParam.parentContentDto.awardContentDto;
                console.log(self.version,"版本回显");
                for (var i = 0;i < self.version.awardContentDto.length;i++){
                    if (self.version.awardContentDto[i].awardType == 'JIFEN' && self.update.channel == 'QB'){
                        $.ajax({
                            url:globalConfig.basePath+"/smart_marketing/initiative/getIntegralId?jfRuleId="+self.version.awardContentDto[i].jfRuleId,
                            type:"get",
                            dataType:"json",
                            contentType:"text/html;charset=utf-8",
                            data:self.version.awardContentDto[i].jfRuleId,
                            async: false,
                            success:function (data) {
                                console.log("校验数据返回",data);
                                if (data.code=='000' && data.resp.code=='2000'){

                                    self.version.awardContentDto[i].awardDesc  = '积分-'+self.version.awardContentDto[i].awardContent+'-剩余额度:'+data.resp.data.availablePoint;

                                }
                            }

                        })
                    }else {
                        continue;
                    }
                }

            }

            //短信
            if('MESSAGE' == self.version.touchWay){
                //短信DTO
                var messageContentDto = versionParam.parentContentDto.messageContentDto;
                //短信内容
                self.version.MESSAGE_CONTENT = messageContentDto.messageContent;
                //触达时间
                self.version.strategyTime = versionParam.touchTimeType;
                //时间配置
                if('SMARTTOUCH'==self.version.strategyTime){
                    self.version.muchTime = versionParam.muchTime;
                }
            }

            //站内信
            if('PUSH_MAIL' == self.version.touchWay){
                //站内信dto
                var pushMailContentDto = versionParam.parentContentDto.pushMailContentDto;
                //站内信标题
                self.version.TOUCH_PUSH_TITLE = pushMailContentDto.touchPushTitle;
                //站内信内容
                self.version.TOUCH_PUSH_CONTENT = pushMailContentDto.touchPushContent;
                //触达时间
                self.version.strategyTime = versionParam.touchTimeType;
                //时间配置
                if('SMARTTOUCH'==self.version.strategyTime){
                    self.version.muchTime = versionParam.muchTime;
                }
            }

            //推送
            if('PUSH' == self.version.touchWay){
                var pushContentDto = versionParam.parentContentDto.pushContentDto;
                //跳转类型
                self.version.skipType =pushContentDto.skipType;

                if(self.version.skipType=='URL'){
                    //连接地址
                    self.version.SKIP_URL = pushContentDto.skipUrl;
                }
                if(self.version.skipType=='PRIMORDIAL'){

                    //页面类型集合
                    querySkipType2();
                    self.version.PAGE_TYPE = pushContentDto.pageType;

                    //跳转页面
                    queryPageType2(self.version.PAGE_TYPE);
                    self.version.PRIMORDIAL_PAGE = pushContentDto.primordialPage;
                }
                //标题内容
                self.version.TOUCH_PUSH_TITLE = pushContentDto.touchPushTitle;
                //推送内容
                self.version.TOUCH_PUSH_CONTENT = pushContentDto.touchPushContent;
                //触达时间
                self.version.strategyTime = versionParam.touchTimeType;
                //时间配置
                if('SMARTTOUCH'==self.version.strategyTime){
                    self.version.muchTime = versionParam.muchTime;
                }
            }

            //自定义+banner
            if('USER_DEFINED'==self.version.strategyType && 'BANNER'==self.version.touchWay){
                var bannerContentDto = versionParam.parentContentDto.bannerContentDto;
                //banner内容
                self.version.BANNER_CONTENT = bannerContentDto.bannerContent;
                //banner文案
                self.version.BANNER_BTN_CONTENT = bannerContentDto.bannerBtnContent;
                //跳转类型
                self.version.skipType =pushContentDto.skipType;

                if(self.version.skipType=='URL'){
                    //连接地址
                    self.version.SKIP_URL = pushContentDto.skipUrl;
                }
                if(self.version.skipType=='PRIMORDIAL'){
                    //页面类型集合
                    querySkipType2();
                    self.version.PAGE_TYPE = pushContentDto.pageType;;
                    //跳转页面
                    queryPageType2(self.version.PAGE_TYPE);
                    self.version.PRIMORDIAL_PAGE = pushContentDto.primordialPage;
                }
                //触达时间
                self.version.strategyTime = versionParam.touchTimeType;
                //时间配置
                if('SMARTTOUCH'==self.version.strategyTime){
                    self.version.muchTime = versionParam.muchTime;
                }
            }

            //奖励+banner
            if('AWARD'==self.version.strategyType && 'BANNER'==self.version.touchWay){

                var bannerContentDto = versionParam.parentContentDto.bannerContentDto;
                //banner内容
                self.version.BANNER_CONTENT = bannerContentDto.bannerContent;
                //触达时间
                self.version.strategyTime = versionParam.touchTimeType;
                //时间配置
                if('SMARTTOUCH'==self.version.strategyTime){
                    self.version.muchTime = versionParam.muchTime;
                }

            }
        }
        var versionDto = angular.copy(self.version);
        if(type==0){
            //是否显示修改原始版本
            self.showVersion =1;
            self.ysVersion = angular.copy(versionDto);
        }else{
            self.otherVersions.push(versionDto);
        }


    }



    /**
     * 智能分析统计页+添加版本
     */
    self.$on('generationStrategyAbTest',function (d,param) {
        self.updateShow = 1;
        self.isUpdate=0;
        var url = globalConfig.basePath + "/strategy/detail?strategyId=" + param.strategyId;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.update={};
                    //策略信息
                    self.update.testStrategyDto = data.data.resp.strategyDto;
                    //版本信息
                    self.update.touchWayDto = data.data.resp.touchWayDto;

                    //理财渠道
                    self.update.channel = param.channel;
                    //服务类型
                    self.queryBasicsConfig(12,self.update.channel);
                    self.update.serviceTypeCode = self.update.testStrategyDto.serviceTypeCode;
                    //用户行为
                    self.queryBasicsConfig(13,self.update.serviceTypeCode);
                    self.update.userActionCode = self.update.testStrategyDto.userActionCode;
                    //预期状态
                    self.expectStatus();
                    self.update.strategyResult = self.update.testStrategyDto.strategyResult;
                    //触达日
                    self.update.strategyCycle = self.update.testStrategyDto.strategyCycle;
                    //限制配置-触发次数
                    self.update.touchCount = self.update.testStrategyDto.touchCount;
                    //限制配置-触发周期天数
                   self.update.touchTimeCount = self.update.testStrategyDto.touchTimeCount
                    //名单操作
                    self.strategyReload();

                    //触发节点
                    self.queryBasicsConfig(1,self.update.userActionCode);
                    self.update.touchCode = self.update.testStrategyDto.touchCode;
                    //是否配触发策略
                    if(null != self.update.testStrategyDto.touchStrategyList && self.update.testStrategyDto.touchStrategyList.length>0){
                        var list = self.update.testStrategyDto.touchStrategyList;
                        angular.forEach(list,function (each) {
                            if(each.attrKey == 'IS_EFFECT'){
                                self.update.IS_EFFECT =each.attrValue;
                            }
                        })
                        if(1==self.update.IS_EFFECT){
                            $("#xzInputConfig").prop("checked",true);
                            $("#noxzConfig").prop("checked",false);
                            self.huixianDeploy(self.update.testStrategyDto.touchStrategyList,self.update.touchCode);
                        }else{
                            $("#xzInputConfig").prop("checked",false);
                            $("#noxzConfig").prop("checked",true);
                        }
                    }

                    //原始版本操作
                    self.version={};
                    //版本名称
                    self.version.verName = '原始版本';
                    self.version.headVerName = '原始版本';
                    //版本描述
                    self.version.verDesc="";
                    //触达类型
                    self.version.strategyType = self.update.testStrategyDto.touchType;
                    //触达方式-默认值
                    self.strategyTypeChange(self.version.strategyType);
                    self.version.touchWay = self.update.touchWayDto.touchWay;
                    //在线客服or电话客服
                    if(self.version.strategyType=='CUSTOMER_SERVICE' || self.version.strategyType=='PHONE'){
                        //触达时间
                        self.version.strategyTime = self.update.touchWayDto.touchTimeType;
                    }
                    //奖励or自定义
                    if('AWARD'==self.version.strategyType || 'USER_DEFINED'==self.version.strategyType){
                        //多奖励
                        if('AWARD'==self.version.strategyType){
                            self.version.awardContentDto = self.update.touchWayDto.parentContentDTO.awardContentDto;
                            for (var i = 0;i < self.version.awardContentDto.length;i++){
                                if (self.version.awardContentDto[i].awardType == 'JIFEN' && self.update.channel == 'QB'){
                                    $.ajax({
                                        url:globalConfig.basePath+"/smart_marketing/initiative/getIntegralId?jfRuleId="+self.version.awardContentDto[i].jfRuleId,
                                        type:"get",
                                        dataType:"json",
                                        contentType:"text/html;charset=utf-8",
                                        data:self.version.awardContentDto[i].jfRuleId,
                                        async: false,
                                        success:function (data) {
                                            console.log("校验数据返回",data);
                                            if (data.code=='000' && data.resp.code=='2000'){

                                                self.version.awardContentDto[i].awardDesc  = '积分-'+self.version.awardContentDto[i].awardContent+'-剩余额度:'+data.resp.data.availablePoint;

                                            }
                                        }

                                    })
                                }else {
                                    continue;
                                }
                            }
                        }

                        //短信
                        if('MESSAGE' == self.version.touchWay){
                            //短信DTO
                            var messageContentDto = self.update.touchWayDto.parentContentDTO.messageContentDto;
                            //短信内容
                            self.version.MESSAGE_CONTENT = messageContentDto.messageContent;
                            //触达时间
                            self.version.strategyTime = self.update.touchWayDto.touchTimeType;
                            //时间配置
                            if('SMARTTOUCH'==self.version.strategyTime){
                                self.version.muchTime = self.update.touchWayDto.muchTime;
                            }
                        }

                        //站内信
                        if('PUSH_MAIL' == self.version.touchWay){
                            //站内信dto
                            var pushMailContentDto = self.update.touchWayDto.parentContentDTO.pushMailContentDto;
                            //站内信标题
                            self.version.TOUCH_PUSH_TITLE = pushMailContentDto.touchPushTitle;
                            //站内信内容
                            self.version.TOUCH_PUSH_CONTENT = pushMailContentDto.touchPushContent;
                            //触达时间
                            self.version.strategyTime = self.update.touchWayDto.touchTimeType;
                            //时间配置
                            if('SMARTTOUCH'==self.version.strategyTime){
                                self.version.muchTime = self.update.touchWayDto.muchTime;
                            }
                        }

                        //推送
                        if('PUSH' == self.version.touchWay){
                            var pushContentDto = self.update.touchWayDto.parentContentDTO.pushContentDto;
                            //跳转类型
                            self.version.skipType =pushContentDto.skipType;

                            if(self.version.skipType=='URL'){
                                //连接地址
                                self.version.SKIP_URL = pushContentDto.skipUrl;
                            }
                            if(self.version.skipType=='PRIMORDIAL'){
                                //页面类型集合
                                querySkipType2();
                                self.version.PAGE_TYPE = pushContentDto.pageType;
                                //跳转页面
                                queryPageType2(self.version.PAGE_TYPE);
                                self.version.PRIMORDIAL_PAGE = pushContentDto.primordialPage;
                            }
                            //标题内容
                            self.version.TOUCH_PUSH_TITLE = pushContentDto.touchPushTitle;
                            //推送内容
                            self.version.TOUCH_PUSH_CONTENT = pushContentDto.touchPushContent;
                            //触达时间
                            self.version.strategyTime = self.update.touchWayDto.touchTimeType;
                            //时间配置
                            if('SMARTTOUCH'==self.version.strategyTime){
                                self.version.muchTime = self.update.touchWayDto.muchTime;
                            }
                        }

                        //自定义+banner
                        if('USER_DEFINED'==self.version.strategyType && 'BANNER'==self.version.touchWay){
                            var bannerContentDto = self.update.touchWayDto.parentContentDTO.bannerContentDto;
                            //banner内容
                            self.version.BANNER_CONTENT = bannerContentDto.bannerContent;
                            //banner文案
                            self.version.BANNER_BTN_CONTENT = bannerContentDto.bannerBtnContent;
                            //跳转类型
                            self.version.skipType =pushContentDto.skipType;

                            if(self.version.skipType=='URL'){
                                //连接地址
                                self.version.SKIP_URL = pushContentDto.skipUrl;
                            }
                            if(self.version.skipType=='PRIMORDIAL'){
                                //页面类型集合
                                querySkipType2();
                                self.version.PAGE_TYPE = pushContentDto.pageType;
                                //跳转页面
                                queryPageType2(self.version.PAGE_TYPE);
                                self.version.PRIMORDIAL_PAGE = pushContentDto.primordialPage;
                            }
                            //触达时间
                            self.version.strategyTime = self.update.touchWayDto.touchTimeType;
                            //时间配置
                            if('SMARTTOUCH'==self.version.strategyTime){
                                self.version.muchTime = self.update.touchWayDto.muchTime;
                            }
                        }

                        //奖励+banner
                        if('AWARD'==self.version.strategyType && 'BANNER'==self.version.touchWay){
                            var bannerContentDto = self.update.touchWayDto.parentContentDTO.bannerContentDto;
                            //banner内容
                            self.version.BANNER_CONTENT = bannerContentDto.bannerContent;
                            //触达时间
                            self.version.strategyTime = self.update.touchWayDto.touchTimeType;
                            //时间配置
                            if('SMARTTOUCH'==self.version.strategyTime){
                                self.version.muchTime = self.update.touchWayDto.muchTime;
                            }

                        }
                    }

                    var versionParam = angular.copy(self.version);
                    //是否显示修改原始版本
                    self.showVersion =1;
                    self.ysVersion = angular.copy(versionParam);
                    //其他版本集合
                    self.otherVersions=[];
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )
    })

    self.$on('copyStart',function (d,param) {
        self.isUpdate=0;
        self.copy(param);
    })

    self.copy = function (param) {
        self.updateShow=1;
        var url = globalConfig.basePath + "/abTest/detail?testStrategyId="+param.id;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.update={};
                    self.update.testStrategyDto=data.data.resp.testStrategyDto;
                    self.update.touchVersionDtoList = data.data.resp.touchVersionDtoList;
                    //理财渠道
                    self.update.channel = self.update.testStrategyDto.channelCodeKey;
                    //服务类型
                    self.queryBasicsConfig(12,self.update.channel);
                    self.update.serviceTypeCode = self.update.testStrategyDto.serviceTypeCodeKey;
                    //用户行为
                    self.queryBasicsConfig(13,self.update.serviceTypeCode);
                    self.update.userActionCode = self.update.testStrategyDto.userCodeKey;
                    //预期状态
                    self.expectStatus();
                    self.update.strategyResult = self.update.testStrategyDto.strategyResultKey;
                    //触达日
                    self.update.strategyCycle = self.update.testStrategyDto.strategyCycle;
                    //限制配置-触发次数
                    self.update.touchCount = self.update.testStrategyDto.touchCount;
                    //限制配置-触发周期天数
                    self.update.touchTimeCount = self.update.testStrategyDto.touchTimeCount
                    //名单操作
                    strategyReload2();
                    self.update.memberListName = self.update.testStrategyDto.userTagTypeKey;
                    membersReload2();
                    self.update.memberListId = self.update.testStrategyDto.userTag;

                    //触发节点
                    self.queryBasicsConfig(1,self.update.userActionCode);
                    self.update.touchCode = self.update.testStrategyDto.touchCodeKey;
                    //是否配触发策略
                    if(null != self.update.testStrategyDto.touchStrategyList && self.update.testStrategyDto.touchStrategyList.length>0){

                        var list = self.update.testStrategyDto.touchStrategyList;
                        angular.forEach(list,function (each) {
                            if(each.attrKey == 'IS_EFFECT'){
                                self.update.IS_EFFECT =each.attrValue;
                            }
                        })
                        if(1==self.update.IS_EFFECT){
                            $("#xzInputConfig").prop("checked",true);
                            $("#noxzConfig").prop("checked",false);
                            self.huixianDeploy(self.update.testStrategyDto.touchStrategyList,self.update.touchCode);
                        }else{
                            $("#xzInputConfig").prop("checked",false);
                            $("#noxzConfig").prop("checked",true);
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

    /**
     * 触发策略加载
     */
    self.huixianDeploy = function (list,node) {
        self.update.numberParamList =[];
        var url = globalConfig.basePath + "/operation/init/byKey?node="+node;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    var result = data.data.resp;
                    //所有的头list
                    var noneList = [];
                    angular.forEach(result,function (each) {
                        if(each.type=="none"){
                            noneList.push(each);
                        }
                    })
                    angular.forEach(noneList,function (each) {
                        var dataList = [];
                        angular.forEach(result,function(eachParent){
                            if(each.ownCode == eachParent.parentCode){
                                angular.forEach(list,function (resultEach) {
                                    if(resultEach.attrKey==eachParent.key){
                                        eachParent.value=resultEach.attrValue;
                                    }
                                })
                                dataList.push(eachParent);

                            }
                        })
                        if(dataList[0].type=="number"){
                            self.update.numberParam ={};
                            self.update.numberParam.param = each;
                            self.update.numberParam.list = dataList;
                            self.update.numberParamList.push(self.update.numberParam);

                        }

                    })
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 策略赋值
     */
    self.giveValue = function (list) {
        angular.forEach(list,function (each) {
            $('#'+each.attrKey).val(each.attrValue);
        })
    }

    /**
     * 理财渠道变更
     */
    self.channelChange = function () {
        //服务类型
        self.queryBasicsConfig(12,self.update.channel);
        //用户行为
        self.queryBasicsConfig(13,self.update.serviceTypeCode);
        //触发节点
        self.queryBasicsConfig(1,self.update.userActionCode);
    }

    /**
     * 服务类型变更
     */
    self.serviceTypeChange = function () {
        //用户行为
        self.queryBasicsConfig(13,self.update.serviceTypeCode);
        //触发节点
        self.queryBasicsConfig(1,self.update.userActionCode);
    }

    /**
     * 用户行为变更
     */
    self.userActionChange = function () {
        //触发节点
        self.queryBasicsConfig(1,self.update.userActionCode);
        setTimeout(function () {
            self.update.touchCode = self.update.touchCodeList[0].key;
        },1000);

    }


    /**
     * 基础配置查询
     */
    self.queryBasicsConfig = function (type,code) {
        if(type==12){
            self.update.serviceTypeCode='';
        }
        if(type==13){
            self.update.userActionCode='';
        }
        if(type==1){
            self.update.touchCode='';
        }
        var url =  globalConfig.basePath + "/operation/init/byKey?type="+type+"&code="+code;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    //服务类型查询
                    if(type==12){
                        self.update.serviceTypeCodeList = data.data.resp;
                    }
                    //用户行为
                    else if(type==13){
                        self.update.userActionCodeList = data.data.resp;
                    }
                    //触发节点
                    else if(type==1){
                        self.update.touchCodeList = data.data.resp;
                    }
                } else {
                    alert(data.data.message);
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 预期状态
     */
    self.expectStatus = function () {
        self.update.strategyResult = '';
        var url = globalConfig.basePath + "/operation/init/byKey?type=9";
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.update.expectStatusList = data.data.resp;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    /**
     * 返回
     */
    self.return = function () {
        //向主作用于传递值
        self.$emit("returnTable1");
        self.isUpdate=0;
        self.update={}
        self.isConfigValable = 1;
    }
    
    //region 名单操作
    /**用户策略类型初始化*/
    self.strategyReload = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=2";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.update.strategyList = data.data.resp;
                    self.update.memberListName= "NO_RULE"
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
        var channelCode = self.update.channel;
        if (self.update.memberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
            self.update.memberCount=null;
        }else {
            var url = globalConfig.basePath + "/ruleConfig/FindChannelGroups?channelCode="+channelCode+"&rosterType="+self.update.memberListName
            $http.post(url).then(
                function (data) {
                    if (data.data.code == '000') {
                        self.update.strChannelGroups = data.data.resp;
                        if (self.update.strChannelGroups.length > 0) {
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
    self.queryMemberCount = function () {
        var userTagCode = self.update.memberListId;
        var channelCode = self.update.channel;
        if(null == userTagCode || "" == userTagCode){
            alert("请选择名单");
            return;
        }
        var url = globalConfig.basePath + "/abTest/getTagInfo?userTagCode="+userTagCode+"&channelCode="+channelCode;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.update.memberCount = data.data.resp.rosterCount;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        )

    }

    //endregion

    /**
     * 跳转至场景配置
     */
    self.goTable = function (type) {
        //region **进入2
        if(type==2){
            //数据校验
            if(self.update.serviceTypeCode=="" || self.update.serviceTypeCode==null || self.update.serviceTypeCode==0){
                alert("服务类型不能为空");
                return;
            }
            if(self.update.userActionCode=="" || self.update.userActionCode==null || self.update.userActionCode==0){
                alert("用户行为不能为空");
                return;
            }
            if(self.update.strategyResult=="" || self.update.strategyResult==null ||self.update.strategyResult==0){
                alert("预期状态不能为空");
                return;
            }
            if(self.update.strategyCycle == null || self.update.strategyCycle == '' || self.update.strategyCycle < 1 || self.update.strategyCycle >7 ){
                alert("执行触达后xxx自然日内有效只能在1到7之间");
                return;
            }
            if(self.update.touchTimeCount == null || self.update.touchTimeCount == '' || self.update.touchTimeCount < 1 || self.update.touchTimeCount >30 ){
                alert("限制配置n个自然日只能在1到30之间");
                return;
            }
            if(self.update.touchCount == null ||self.update.touchCount == '' || self.update.touchCount < 1 || self.update.touchCount >10 ){
                alert("限制配置最多触发n次只能在1到10之间");
                return;
            }
            if(self.update.memberListId!=null && self.update.memberCount!=null && self.update.memberCount < 5000){
                alert("用户名单数量："+self.update.memberCount + ",小于5000");
                return;
            }
            $('.s-step0>b>b,.s-step0>p,.s-step0>em').removeClass('active');
            $('.s-step1>b>b,.s-step1>p,.s-step1>em').addClass('active');
            self.updateShow=2;
            //服务类型名称
            angular.forEach(self.update.serviceTypeCodeList,function (each) {
                if(each.key==self.update.serviceTypeCode){
                    self.update.serviceCodeName=each.value;
                }
            })
            //用户行为名称
            angular.forEach(self.update.userActionCodeList,function (each) {
                if(each.key==self.update.userActionCode){
                    self.update.userCodeName=each.value;
                }
            })
            if(null==self.update.IS_EFFECT || '' == self.update.IS_EFFECT){
                self.update.IS_EFFECT=0;
            }

            // //触发节点
            // if(self.update.touchCode==null || self.update.touchCode==''){
            //     self.update.touchCode = self.touchCodeList[0].key;
            // }
        }
        //endregion
        //region **返回1
        else if(type==1){
            $('.s-step0>b>b,.s-step0>p,.s-step0>em').addClass('active');
            $('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active');
            self.updateShow=1;
        }
        //endregion
        //region **进入3
        else if(type==3){
            self.update.strategyCondition=[];
            //region   **触发策略校验(不可删除）
            if(self.update.IS_EFFECT==1){
                if( !self.valInputIsNull('SUM_MIN_FAIL_COUNT','累计失败次数范围' + '不能为空') ){
                    return;
                }else{
                    if($('#SUM_MIN_FAIL_COUNT').length>0){
                        var param = {};
                        param.strategyConditionKey = 'SUM_MIN_FAIL_COUNT';
                        param.strategyConditionValue = $('#SUM_MIN_FAIL_COUNT').val();
                        self.update.strategyCondition.push(param);
                    }
                }
                if( !self.valInputIsNull('SUM_MAX_FAIL_COUNT','累计失败次数范围' + '不能为空') ){
                    return;
                }else{
                    if($('#SUM_MAX_FAIL_COUNT').length>0){
                        var param = {};
                        param.strategyConditionKey = 'SUM_MAX_FAIL_COUNT';
                        param.strategyConditionValue = $('#SUM_MAX_FAIL_COUNT').val();
                        self.update.strategyCondition.push(param);
                    }
                }
                if( !self.valInputIsNull('SUM_MIN_AMOUNT','累计最小金额' + '不能为空') ){
                    return;
                }else{
                    if($('#SUM_MIN_AMOUNT').length>0) {
                        var param = {};
                        param.strategyConditionKey = 'SUM_MIN_AMOUNT';
                        param.strategyConditionValue = $('#SUM_MIN_AMOUNT').val();
                        self.update.strategyCondition.push(param);
                    }
                }
                if( !self.valInputIsNull('SUM_MAX_AMOUNT','累计最大金额' + '不能为空') ){
                    return;
                }else{
                    if($('#SUM_MAX_AMOUNT').length>0) {
                        var param = {};
                        param.strategyConditionKey = 'SUM_MAX_AMOUNT';
                        param.strategyConditionValue = $('#SUM_MAX_AMOUNT').val();
                        self.update.strategyCondition.push(param);
                    }
                }
                if( !self.valInputIsNull('THIS_MIN_AMOUNT','当此最小金额' + '不能为空') ){
                    return;
                }else{
                    if($('#THIS_MIN_AMOUNT').length>0) {
                        var param = {};
                        param.strategyConditionKey = 'THIS_MIN_AMOUNT';
                        param.strategyConditionValue = $('#THIS_MIN_AMOUNT').val();
                        self.update.strategyCondition.push(param);
                    }
                }
                if( !self.valInputIsNull('THIS_MAX_AMOUNT','当此最大金额' + '不能为空') ){
                    return;
                }else{
                    if($('#THIS_MAX_AMOUNT').length>0) {
                        var param = {};
                        param.strategyConditionKey = 'THIS_MAX_AMOUNT';
                        param.strategyConditionValue = $('#THIS_MAX_AMOUNT').val();
                        self.update.strategyCondition.push(param);
                    }
                }
                if( !self.valInputIsNull('SUM_TIME_COUNT','累计计算有效期 ' + '不能为空') ){
                    return;
                }else{
                    if($('#SUM_TIME_COUNT').length>0) {
                        var param = {};
                        param.strategyConditionKey = 'SUM_TIME_COUNT';
                        param.strategyConditionValue = 1;
                        self.update.strategyCondition.push(param);
                    }
                }

                if(self.update.serviceTypeCode =='QB_USER_DEFINED' || self.update.serviceTypeCode =='WK_USER_DEFINED' ){
                    var data = "";
                    var queryInfo = $(".query-updinfo");
                    for (var i = 0; i < queryInfo.length; i++) {
                        var queryList = queryInfo.eq(i).find(".query-list");
                        for (var j = 0; j < queryList.length; j++) {
                            if (queryList.eq(j).find(".inp1 select").val() != null) {
                                var param = {};
                                param.strategyConditionKey = "REALTIME_TAG",
                                    param.strategyConditionValue =  queryList.eq(j).find(".inp1 select").val(),
                                    self.update.strategyCondition.push(param);
                                    self.update.REALTIME_TAG = queryList.eq(j).find(".inp1 select").val();
                                    self.update.triggerNode = queryList.eq(j).find(".inp1 select").val();
                                    self.update.touchCode = queryList.eq(j).find(".inp1 select").val()
                                    for (let k = 0; k < self.tagSelectList.length; k++) {
                                        if(self.update.touchCode == self.tagSelectList[k].english){
                                            var param1 = {};
                                            self.update.REALTIME_TYPE = self.tagSelectList[k].option;
                                            param1.strategyConditionKey = "REALTIME_TYPE",
                                                param1.strategyConditionValue = self.update.REALTIME_TYPE
                                            self.update.strategyCondition.push(param1);
                                        }
                                    }
                            }
                            //判断是否存在多选
                            if (queryList.eq(j).find("[type=checkbox]").length > 0) {
                                var checkboxList = queryList.eq(j).find("[type=checkbox]");
                                for (var z = 0; z < checkboxList.length; z++) {
                                    data = checkboxList.eq(z).val();
                                }
                            } else {
                                if (queryList.eq(j).find(".inp2 select").val() != null) {
                                    var param = {};
                                    param.strategyConditionKey= "REALTIME_CRITERIA",
                                        param.strategyConditionValue =queryList.eq(j).find(".inp2 select").val()
                                    self.update.strategyCondition.push(param);
                                    self.update.REALTIME_CRITERIA = queryList.eq(j).find(".inp2 select").val();
                                }
                            }
                            //特殊处理between,使用逗号分割
                            if (queryList.eq(j).find(".inp2 select").val() != null) {
                                var param = {};
                                if (queryList.eq(j).find(".inp2 select").val() == "between") {
                                    var startTime = queryList.eq(j).find(".dateno1").eq(0).val();//between对应的开始日期
                                    var endTime = queryList.eq(j).find(".dateno2").eq(0).val();//between对应的结束日期
                                    var param = {};
                                    param.strategyConditionKey = "REALTIME_VALUE",
                                        param.strategyConditionValue =  "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime
                                    self.update.strategyCondition.push(param);
                                    self.update.REALTIME_VALUE = "&conditionGroup[" + i + "][" + j + "].queryValue=" + startTime + "," + endTime
                                } else {
                                    var param = {};
                                    param.strategyConditionKey = "REALTIME_VALUE",
                                        param.strategyConditionValue = queryList.eq(j).find(".inp3 input").val()
                                    self.update.strategyCondition.push(param);
                                    self.update.REALTIME_VALUE = queryList.eq(j).find(".inp3 input").val()
                                }
                            }
                        }
                    }
                }
                //银行
                if(self.update.serviceTypeCode =='WK_BANK_FLOW'|| self.update.serviceTypeCode =='QB_BANK_FLOW'){
                    var str = "";
                    $(".updBankCode").each(function () {
                        if (this.checked == true) {
                            if($(this).val() !=null){
                                str += $(this).val() + ",";
                                }else{
                                 str = "";
                            }
                        }
                    })
                    var checkdbanks = str.substring(0, str.length - 1);
                    if (checkdbanks != null) {
                        self.update.BANK_CODE = checkdbanks
                    }
                }
                //预期结果银行
                    if(self.update.strategyResult == 'BANK_OPEN_SUCCESS' ||self.update.strategyResult == 'BANK_PAY_SUCCESS'){
                        var str = "";
                        $(".updyqBankCode").each(function () {
                            if(this.checked==true){
                                str += $(this).val() + ",";
                            }
                        })
                        var checkdbanks = str.substring(0,str.length-1);
                        if (checkdbanks != null) {
                            self.update.bankCode = checkdbanks;
                        }else{
                            alert("请添加银行选项");
                            return
                        }
                }
            }
            //endregion
            var url = globalConfig.basePath + "/abTest/validate";
            $http.post(url, self.GetValidateJsonData()).then(
                function (data) {
                    if (data.data.code == '000') {
                        $('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active');
                        $('.s-step2>b>b,.s-step2>p,.s-step2>em').addClass('active');
                        self.updateShow=3;
                        //原始版本显示
                        if(null == self.ysVersion || angular.equals({},self.ysVersion)){
                            self.showVersion = 0;
                            //原始版本
                            self.ysVersion={}
                            //其他版本集合
                            self.otherVersions=[];
                            self.version={}
                        }

                    } else {
                        alert(data.data.message)
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        }
        //endregion
        //region **返回2
        else if(type==4){
            $('.s-step1>b>b,.s-step1>p,.s-step1>em').addClass('active');
            $('.s-step2>b>b,.s-step2>p,.s-step2>em').removeClass('active');
            self.updateShow=2;

        }
        //endregion
        //region **进入4
        else if(type==5){
            if(null==self.ysVersion || angular.equals({},self.ysVersion)){
                alert("必须配置版本");
                return;
            }
            if(null==self.otherVersions ||angular.equals([],self.ysVersion) || self.otherVersions.length<1){
                alert("最少配置一个子版本");
                return;
            }
            $('.s-step3>b>b,.s-step3>p,.s-step3>em').addClass('active');
            $('.s-step2>b>b,.s-step2>p,.s-step2>em').removeClass('active');
            self.updateShow=4;

            //显示预期状态
            self.update.showExpResultStatusName = $("#expResultStatus2").find("option:selected").text();
            //显示用户分组
            if(self.update.memberListName != 'NO_RULE'){
                self.update.showMemberGroup = $("#memberGroup2").find("option:selected").text();
            }else{
                self.update.showMemberGroup='';
            }
            //查询审核人
            self.queryAuditorList();
        }
        //endregion
        //region **返回3
        else if(type==6){
            $('.s-step2>b>b,.s-step2>p,.s-step2>em').removeClass('active');
            $('.s-step3>b>b,.s-step3>p,.s-step3>em').addClass('active');
            self.updateShow=3;
        }
        //endregion
    }


    //region **回显入第三步数据校验(不可删除）
    self.valInputIsNull = function(id,msg){
        var result = true;
        if( $('#'+id).length > 0){
            var value = $('#'+id).val();
            if( value == null || value == ''){
                alert(msg);
                result = false;
            }
        }

        return result;
    }

    self.GetValidateJsonData = function() {
        var json = {
            "channel": self.update.channel,				    //渠道
            "serviceTypeCode": self.update.serviceTypeCode,		    //服务类型
            "userActionCode": self.update.userActionCode,			    //用户行为
            "strategyResult": self.update.strategyResult,	    //预期结果状态
            "strategyCycle": self.update.strategyCycle,		    //执行触达后xxx自然日内有效
            "userTagType": self.update.memberListName,		    //名单类型
            "userTag": self.update.memberListId,			    //用户名单
            "touchTimeCount": self.update.touchTimeCount,	    //限制配置：n个自然日
            "touchCount": self.update.touchCount,			    //限制配置：最多触发n次
            "touchCountType": 'NATUREDAY',						    //限制配置：1个自然日内最多触发
            "IS_EFFECT": self.update.IS_EFFECT,				    //是否配触发策略
            //"SUM_FAIL_COUNT": $('#SUM_FAIL_COUNT').val(),		    //累计失败次数
            "SUM_MIN_FAIL_COUNT": $('#SUM_MIN_FAIL_COUNT').val(),	//累计失败次数
            "SUM_MAX_FAIL_COUNT": $('#SUM_MAX_FAIL_COUNT').val(),	//累计失败次数
            "SUM_MIN_AMOUNT": $('#SUM_MIN_AMOUNT').val(),		    //累计最小金额
            "SUM_MAX_AMOUNT": $('#SUM_MAX_AMOUNT').val(),		    //累计最大金额
            "THIS_MIN_AMOUNT": $('#THIS_MIN_AMOUNT').val(),		    //当此最小金额
            "THIS_MAX_AMOUNT": $('#THIS_MAX_AMOUNT').val(),		    //当此最大金额
            "SUM_TIME_COUNT": 1,								    //累计计算有效期
            "SUM_TIME_COUNT_TYPE": "NATUREDAY",					    //累计计算有效期单位（NATUREDAY自然日 DAY 天 WEEK周 MONTH 月 YEAR年））
            "touchCode": self.update.touchCode,				//触发节点code
            "REALTIME_TAG":self.update.REALTIME_TAG,
            "REALTIME_CRITERIA":self.update.REALTIME_CRITERIA,
            "REALTIME_VALUE":self.update.REALTIME_VALUE,
            "REALTIME_TYPE":self.update.REALTIME_TYPE,
            "BANK_CODE":self.update.BANK_CODE,
            "bankCode":self.update.bankCode,
        };
        return json;
    };

    //endregion


    /**
     * 是否配置触发策略
     */
    self.isEffectBtn = function (type) {
        if(type=="0"){
            self.update.numberParamList=[];
            $('#xzInputConfig').prop('checked',false);
            $("#noxzConfig").prop('checked',true);
        }else{
            $('#noxzConfig').prop('checked',false);
            $("#xzInputConfig").prop('checked',true);
            self.bankInfoList();
        }
        self.update.IS_EFFECT = type;
        if(self.update.IS_EFFECT==1){
            self.queryOkDeploy();
        }
    }
    
    /**
     * 触发策略加载
     */
    self.queryOkDeploy = function () {
        $('#noxzConfig').prop('checked',false);
        $("#xzInputConfig").prop('checked',true);
        self.update.numberParamList =[];
        var url = globalConfig.basePath + "/operation/init/byKey?node="+self.update.touchCode;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    var result = data.data.resp;
                    //所有的头list
                    var noneList = [];
                    angular.forEach(result,function (each) {
                        if(each.type=="none"){
                            noneList.push(each);
                        }
                    })
                    angular.forEach(noneList,function (each) {
                        var dataList = [];
                        angular.forEach(result,function(eachParent){
                            if(each.ownCode == eachParent.parentCode){
                                dataList.push(eachParent);
                            }
                        })
                        if(dataList[0].type=="number"){
                            self.update.numberParam ={};
                            self.update.numberParam.param = each;
                            self.update.numberParam.list = dataList;
                            self.update.numberParamList.push(self.update.numberParam);

                        }

                    })
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 添加原始版本
     */
    self.ysVersionConfig = function (type) {

        //新增原始版本版本
        if(type=='addYS'){
            //定义原始版本
            self.versionConfig = 'rootVersion';

            $('#versionConfig').show();
            self.version.verName = '原始版本';
            self.version.headVerName = '原始版本';
            //触达类型-默认值
            self.version.strategyType = 'USER_DEFINED';

            //触达方式-默认值
            self.strategyTypeChange(self.version.strategyType);

            //触达时间-默认值
            self.version.strategyTime = 'THIS';

            //跳转类型-默认值
            self.version.skipType = 'URL';
        }
        //添加其他版本
        else if(type=='other'){
            //定义原始版本
            self.versionConfig = 'otherVersion';
            angular.copy(self.ysVersion,self.version);
            if(self.isConfigValable==2){
                //全部变量只读
                angular.forEach(self.varableList,function (each) {
                    //变量修改
                    if(self.canUpdateAttribute.indexOf(each.key) != -1){
                        if($('#'+each.key).is("select")){
                            $('#'+each.key).removeAttr("disabled");
                        }else{
                            $('#'+each.key).removeAttr("readonly");
                            $('#'+each.key).val("");
                        }
                    }else{
                        if($('#'+each.key).is("select")){
                            $('#'+each.key).attr("disabled", "true");
                        }else{
                            $('#'+each.key).attr("readonly", "readonly");
                        }
                    }

                })

                //触达方式
                $("#touchWay2").attr("disabled", true);
            }else{
                //修改触达方式触达方式
                $("#touchWay2").attr("disabled", false);
            }
            //触达类型
            $("#strategyType2").attr("disabled", true);
            //版本描述置空
            $("#verDesc2").val("");
            self.version.verDesc=null;

            var number = parseInt(self.otherVersions.length)+1;
            if(number>20){
                alert("最多可添加20个子版本");
                return;
            }
            self.version.verName = '版本'+number;
            self.version.headVerName = '版本'+number;

            self.noDisabled();
        }

    }

    /**
     * 不可编辑方法
     */
    self.noDisabled = function(){
        if(self.isConfigValable==2){
            angular.forEach(self.varableList,function (each) {
                if($('#'+each.key).is("select")){
                    $('#'+each.key).attr("disabled", "disabled");
                }else{
                    $('#'+each.key).attr("readonly", "readonly");
                }
            })
            if(self.canUpdateAttribute != null && self.canUpdateAttribute.length>0){
                //变量修改
                angular.forEach(self.canUpdateAttribute.split(','),function (each) {
                    if($('#'+each).is("select")){
                        $('#'+each).removeAttr("disabled");
                    }else{
                        $('#'+each).removeAttr("readOnly");
                        $('#'+each).val("");
                    }

                })
            }
        }

        //触达类型
        $("#strategyType2").attr("disabled", true);
        //版本描述置空
        $("#verDesc2").val("");
        self.version.verDesc=null;
        $('#versionConfig').show();
    }


    /**
     * 添加版本-触达类型改变
     */
    self.strategyTypeChange = function (strategyType) {
        //自定义和奖励
        if('USER_DEFINED'==strategyType ||'AWARD' == strategyType){
            self.version.touchWay = 'MESSAGE';
            if('AWARD' == strategyType){
                self.version.awardContentDto=[];
            }
        }
        //电话客服和在线客服
        else{
            self.version.touchWay = 'BANNER';
        }
    }

    /**
     * 跳转类型查询
     */
    self.querySkipType = function () {
        if(self.version.skipType=='URL'){
            return;
        }
        var type = '';
        if(self.update.channel == 'WK'){
            type=17;
        }
        if(self.update.channel == 'QB'){
            type=18;
        }
        var url = globalConfig.basePath + "/operation/init/byKey?type="+type;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.version.PAGE_TYPEList = data.data.resp;
                    self.version.PAGE_TYPE = data.data.resp[0].key;
                    self.queryPageType();
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }



    /**
     * 根据页面类型绑定原生跳转地址
     */
    self.queryPageType = function () {
        if(self.version.skipType=='URL'){
            return;
        }
        var url = globalConfig.basePath + "/operation/init/byKey?type=19&code="+self.version.PAGE_TYPE;
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.version.PRIMORDIAL_PAGEList = data.data.resp;
                    if(self.version.PRIMORDIAL_PAGEList.length>0){
                        self.version.PRIMORDIAL_PAGE = data.data.resp[0].key;
                    }
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }



    /**
     * 关闭版本配置
     */
    self.closeVersionCongif =function () {
        $('#versionConfig').hide();
    }

    /**
     * 添加奖励
     */
    self.addJiangliParam={};
    self.addRewardAction = function () {
        if(self.version.awardContentDto.length>=5){
            alert("最多添加五个奖励");
            return;
        }
        self.addJiangliParam.awardType='CARD';
        $('#rewardShow').show();
    }

    /**
     * 关闭奖励
     */
    self.closeReward = function () {
        $('#rewardShow').hide();
    }


    /**
     * 查询积分额度
     * @param x
     * @param updateNumber
     */
    self.selectintegral2 = function(x){
        var allContent = null;
        if (self.addJiangliParam.awardType=='JIFEN'){
            var jifenValue = x.jifenValue;
            var productChannel=0;
            if(self.update.channel == 'QB'){
                productChannel=1;
            }else if(self.update.channel == 'WK'){
                productChannel=2;
            }
            $.ajax({
                url:globalConfig.basePath+"/smart_marketing/initiative/checkPointRuleId?pointRuleId=" + x.jfRuleId+"&productChannel="+productChannel+"&scene=9",
                type:"get",
                dataType:"json",
                contentType:"text/html;charset=utf-8",
                data:x.jfRuleId,
                async: false,
                success:function (data) {
                    console.log("校验数据返回",data);
                    if (data.code=='000'){
                        if (typeof (data.resp.data) == "undefined" || !data.resp.data){
                            alert("积分规则不存在，请重试！");
                            return;
                        }else if (data.resp.data.status =='0' || data.resp.data.status =='9'){
                            alert("积分规则不在有效期内，请重试!");
                            return;
                        }
                        else if (data.resp.data.status == '2'){
                            alert("该积分规则无法使用，请重试!");
                            return;
                        }else {
                            allContent = '积分-'+jifenValue+'-剩余额度:'+data.resp.data.availablePoint;

                        }
                    }else{
                        alert(data.message);
                        return;
                    }
                }

            })


        }
        return allContent;
    }



    /**
     * 确认添加奖励
     */
    self.addReward = function () {
        var param2 = new Object();
        //卡券
        if(self.addJiangliParam.awardType=='CARD' || self.addJiangliParam.awardType=='newCoupon' || self.addJiangliParam.awardType=='mallCoupon'){
            if(self.addJiangliParam.cardId==null || self.addJiangliParam.cardId==''||self.addJiangliParam.cardId=='undefined'){
                alert("卡券id不能为空")
                return;
            }
            // 奖励类型
            var awardType = self.addJiangliParam.awardType;
            var awardContent = self.addJiangliParam.cardId;
            var param = new Object();
            param.channel = self.update.channel;
            param.couponId = awardContent;
            param.awardType=awardType;
            var url = globalConfig.basePath + "/prize/getCouponName";
            $http.post(url,param).then(
                function (data) {
                    if (data.data.code == '000') {
                        //卡券名称
                        var couponName = data.data.resp.couponName;
                        //卡券面值
                        var discount = data.data.resp.discount;
                        param2.awardContent=awardContent;
                        param2.awardType=awardType;
                        param2.awardDesc = awardContent+"-"+data.data.resp.couponName+"-"+data.data.resp.couponTypeName+"-"+data.data.resp.discount+"-"+data.data.resp.couponCount;
                        param2.openCardHelp=0;
                        self.version.awardContentDto.push(param2);
                        $('#rewardShow').hide();
                        self.addJiangliParam.cardId=null;
                    } else {
                        alert(data.data.message)
                        $('#rewardShow').hide();
                    }
                }, function errorCallback(response) {
                    alert("请求失败了....");
                }
            );
        }else{
            var param2 = new Object();
            if (!self.addJiangliParam.jfRuleId){
                alert("积分id不能为空!");
                return;
            }
            if(self.addJiangliParam.jifenValue==null ||self.addJiangliParam.jifenValue==''||self.addJiangliParam.jifenValue=='undefined'){
                alert("积分不能为空")
                return;
            }
            if(self.addJiangliParam.jifenDesc==null ||self.addJiangliParam.jifenDesc==''||self.addJiangliParam.jifenDesc=='undefined'){
                alert("积分描述不能为空")
                return;
            }
            var awardDesc = self.selectintegral2(self.addJiangliParam);
            if (!awardDesc){
                return;
            }

            var awardType = self.addJiangliParam.awardType;
            var awardContent = self.addJiangliParam.jifenValue;

                param2.awardContent=awardContent;
                param2.awardType=awardType;
                param2.awardDesc = awardDesc;
                param2.jiFenDesc=self.addJiangliParam.jifenDesc;
                param2.jfRuleId = self.addJiangliParam.jfRuleId;


            self.version.awardContentDto.push(param2);
            $('#rewardShow').hide();
            self.addJiangliParam.jifenValue=null;
            self.addJiangliParam.jifenDesc=null;
        }
        //放入版本
        // self.version.awardContentDto = angular.copy(self.awardContentDto);
        self.addJiangliParam={};
    }

    /**
     * 删除奖励
     */
    self.deleteReward = function (param) {
        var indexOf = self.version.awardContentDto.indexOf(param);
        if (confirm('确定要删除吗?')) {
            if (indexOf > -1) {
                self.version.awardContentDto.splice(indexOf, 1);
            }
        }
    }

    /**
     * 保存版本
     */
    self.versionStore = function (type) {

        //版本描述
        if(null == self.version.verDesc || '' == self.version.verDesc){
            alert("请输入版本描述");
            return;
        }

        //触达类型
        if(null == self.version.strategyType || '' == self.version.strategyType){
            alert("请选择触达类型");
            return;
        }

        //在线客服/电话客服
        if('CUSTOMER_SERVICE' == self.version.strategyType || 'PHONE' == self.version.strategyType){
            //触达时间
            if(null == self.version.strategyTime || '' == self.version.strategyTime){
                alert("请选择触达时间");
                return;
            }
        }
        //奖+自定义
        else if('AWARD'==self.version.strategyType || 'USER_DEFINED'==self.version.strategyType){
            //奖励时多奖励
            if('AWARD'==self.version.strategyType && self.version.awardContentDto.length<1){
                alert("请选择奖励类型");
                return;
            }

            //短信
            if('MESSAGE' == self.version.touchWay){
                //短信内容
                if(null == self.version.MESSAGE_CONTENT){
                    alert("请填写短信内容");
                    return;
                }
                //触达时间
                if(null == self.version.strategyTime || '' == self.version.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.version.strategyTime=='SMARTTOUCH'){
                    if(null == self.version.muchTime || '' == self.version.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }
            }

            //站内信
            if('PUSH_MAIL' == self.version.touchWay){
                //站内信标题
                if(null == self.version.TOUCH_PUSH_TITLE || '' == self.version.TOUCH_PUSH_TITLE){
                    alert("请填写站内信标题");
                    return;
                }
                //站内信内容
                if(null == self.version.TOUCH_PUSH_CONTENT || '' == self.version.TOUCH_PUSH_CONTENT){
                    alert("请填写站内信内容");
                    return;
                }
                //触达时间
                if(null == self.version.strategyTime || '' == self.version.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.version.strategyTime=='SMARTTOUCH'){
                    if(null == self.version.muchTime || '' == self.version.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }
            }

            //推送
            if('PUSH' == self.version.touchWay){
                //跳转类型
                if(null == self.version.skipType || '' == self.version.skipType){
                    alert("请选择跳转类型");
                    return;
                }
                //连接地址
                if(self.version.skipType=='URL'){
                    if(null == self.version.SKIP_URL || '' == self.version.SKIP_URL){
                        alert("请填写链接地址");
                        return;
                    }
                }
                if(self.version.skipType=='PRIMORDIAL'){
                    //面类型
                    if(null == self.version.PAGE_TYPE || '' == self.version.PAGE_TYPE){
                        alert("请选择页面类型");
                        return;
                    }
                    //跳转页面
                    if(null == self.version.PRIMORDIAL_PAGE || '' == self.version.PRIMORDIAL_PAGE){
                        alert("请选择跳转页面");
                        return;
                    }
                }
                //标题内容
                if(null == self.version.TOUCH_PUSH_TITLE || '' == self.version.TOUCH_PUSH_TITLE){
                    alert("请填写标题内容");
                    return;
                }
                //推送内容
                if(null == self.version.TOUCH_PUSH_CONTENT || '' == self.version.TOUCH_PUSH_CONTENT){
                    alert("请填写推送内容");
                    return;
                }
                //触达时间
                if(null == self.version.strategyTime || '' == self.version.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
                if(self.version.strategyTime=='SMARTTOUCH'){
                    if(null == self.version.muchTime || '' == self.version.muchTime){
                        alert("请配置时间");
                        return;
                    }
                }
            }

            //自定义+banner
            if('USER_DEFINED'==self.version.strategyType && 'BANNER' == self.version.touchWay){
                //banner内容
                if(null == self.version.BANNER_CONTENT || '' == self.version.BANNER_CONTENT){
                    alert("请填写banner内容");
                    return;
                }
                //按钮文案
                if(null == self.version.BANNER_BTN_CONTENT || '' == self.version.BANNER_BTN_CONTENT){
                    alert("请填写按钮文案");
                    return;
                }
                //跳转类型
                if(null == self.version.skipType || '' == self.version.skipType){
                    alert("请选择跳转类型");
                    return;
                }
                //连接地址
                if(self.version.skipType=='URL'){
                    if(null == self.version.SKIP_URL || '' == self.version.SKIP_URL){
                        alert("请填写链接地址");
                        return;
                    }
                }
                if(self.version.skipType=='PRIMORDIAL'){
                    //面类型
                    if(null == self.version.PAGE_TYPE || '' == self.version.PAGE_TYPE){
                        alert("请选择页面类型");
                        return;
                    }
                    //跳转页面
                    if(null == self.version.PRIMORDIAL_PAGE || '' == self.version.PRIMORDIAL_PAGE){
                        alert("请选择跳转页面");
                        return;
                    }
                }
                //触达时间
                if(null == self.version.strategyTime || '' == self.version.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
            }

            //奖励+banner
            if('AWARD' == self.version.strategyType && 'BANNER' == self.version.touchWay){
                //banner内容
                if(null == self.version.BANNER_CONTENT || '' == self.version.BANNER_CONTENT){
                    alert("请填写banner内容");
                    return;
                }
                //触达时间
                if(null == self.version.strategyTime || '' == self.version.strategyTime){
                    alert("请选择触达时间");
                    return;
                }
            }
        }

        var versionParam = angular.copy(self.version);

        //原始版本保存
        if(type==0){
            //是否显示修改原始版本
            self.showVersion =1;
            self.ysVersion = angular.copy(versionParam);
        }
        //其他版本
        else if(type==1){
            self.otherVersions.push(versionParam);
        }
        //其他版本修改
        else if(type==2){
            self.otherVersions[self.updateOtherIndex] = versionParam;
            self.updateOtherIndex=null;
        }
        //主版本修改
        else if(type == 3){
            if(confirm("修改原始版本其他版本数据将丢失,您确定修改吗?")){
                self.otherVersions=[];
                self.showVersion =1;
                //置空变量
                self.tests="";
                self.canUpdateAttribute=[];
                self.isConfigValable=1;
                $("#yesSetCdfsRadio").prop("checked",true);
                $("#noSetCdfsRadio").prop("checked",false);

                self.ysVersion = angular.copy(versionParam);
            }
        }
        $('#versionConfig').hide();
    }

    /**
     * 变量
     */
    self.isConfigValable=1;
    self.variable = function () {
        if(self.isConfigValable==1){
            $('#yesSetCdfsRadio').prop('checked',true);
            $("#noSetCdfsRadio").prop('checked',false);
        }else{
            $('#yesSetCdfsRadio').prop('checked',false);
            $("#noSetCdfsRadio").prop('checked',true);
        }
        $('#addVariableShow').show();
    }

    /**
     * 是否改变变量
     */
    self.varableChedked = function (type) {
        if(type==1 && self.showVersion==1 && self.isConfigValable==2){
            if(confirm("确定修改将删除其他版本信息,确认修改吗?")){
                self.otherVersions=[];
            }
        }
        self.varableList = [];
        if(type==2 && self.showVersion==0){
            alert('请配置版本');
            $('#yesSetCdfsRadio').prop('checked',true);
            $("#noSetCdfsRadio").prop('checked',false);
            return;
        }
        self.varableList = [];
        //是否配置变量
        self.isConfigValable = type;

        //在线客服/电话客服
        if ('CUSTOMER_SERVICE' == self.version.strategyType || 'PHONE' == self.version.strategyType) {
            var param = {};
            param.key = "strategyTime";
            param.value = "触达时间";
            self.varableList.push(param);
        }
        //奖+自定义
        else if ('AWARD' == self.version.strategyType || 'USER_DEFINED' == self.version.strategyType) {
            //奖励时多奖励
            if ('AWARD' == self.version.strategyType && self.version.awardContentDto.length < 1) {
                var param = {};
                param.key = "strategyType";
                param.value = "奖励类型";
                self.varableList.push(param);
            }

            //短信
            if('MESSAGE' == self.version.touchWay){
                //短信内容
                var param1 = {};
                param1.key = "MESSAGE_CONTENT";
                param1.value = "短信内容";
                self.varableList.push(param1);
                //触达时间
                var param2 = {};
                param2.key = "strategyTime";
                param2.value = "触达时间";
                self.varableList.push(param2);

                if(self.version.strategyTime=='SMARTTOUCH'){
                    ////触达时间
                    var param3 = {};
                    param3.key = "muchTime";
                    param3.value = "时间配置";
                    self.varableList.push(param3);
                }
            }

            //站内信
            if('PUSH_MAIL' == self.version.touchWay){
                //站内信标题
                var param1 = {};
                param1.key = "TOUCH_PUSH_TITLE";
                param1.value = "站内信标题";
                self.varableList.push(param1);

                //站内信内容
                var param2 = {};
                param2.key = "TOUCH_PUSH_CONTENT";
                param2.value = "站内信内容";
                self.varableList.push(param2);

                //触达时间
                var param3 = {};
                param3.key = "strategyTime";
                param3.value = "择触达时间";
                self.varableList.push(param3);

                if(self.version.strategyTime=='SMARTTOUCH'){
                    ////触达时间
                    var param4 = {};
                    param4.key = "muchTime";
                    param4.value = "时间配置";
                    self.varableList.push(param4);
                }
            }

            //推送
            if('PUSH' == self.version.touchWay){
                var param = {};
                param.key = "skipType";
                param.value = "跳转类型";
                self.varableList.push(param);

                //连接地址
                if (self.version.skipType == 'URL') {
                    var param1 = {};
                    param1.key = "SKIP_URL";
                    param1.value = "链接地址";
                    self.varableList.push(param1);
                }
                if (self.version.skipType == 'PRIMORDIAL') {
                    //面类型
                    var param2 = {};
                    param2.key = "PAGE_TYPE";
                    param2.value = "页面类型";
                    self.varableList.push(param2);

                    //跳转页面
                    var param3 = {};
                    param3.key = "PRIMORDIAL_PAGE";
                    param3.value = "跳转页面";
                    self.varableList.push(param3);
                }

                //标题内容
                var param4 = {};
                param4.key = "TOUCH_PUSH_TITLE";
                param4.value = "标题内容";
                self.varableList.push(param4);

                //推送内容
                var param5 = {};
                param5.key = "TOUCH_PUSH_CONTENT";
                param5.value = "推送内容";
                self.varableList.push(param5);

                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);

                if(self.version.strategyTime=='SMARTTOUCH'){
                    ////触达时间
                    var param7 = {};
                    param7.key = "muchTime";
                    param7.value = "时间配置";
                    self.varableList.push(param7);
                }

            }

            if ('USER_DEFINED' == self.version.strategyType && 'BANNER' == self.version.touchWay){
                var param = {};
                param.key = "skipType";
                param.value = "跳转类型";
                self.varableList.push(param);

                //连接地址
                if (self.version.skipType == 'URL') {
                    var param1 = {};
                    param1.key = "SKIP_URL";
                    param1.value = "链接地址";
                    self.varableList.push(param1);
                }
                if (self.version.skipType == 'PRIMORDIAL') {
                    //面类型
                    var param2 = {};
                    param2.key = "PAGE_TYPE";
                    param2.value = "页面类型";
                    self.varableList.push(param2);

                    //跳转页面
                    var param3 = {};
                    param3.key = "PRIMORDIAL_PAGE";
                    param3.value = "跳转页面";
                    self.varableList.push(param3);
                }

                //banner内容
                var param4 = {};
                param4.key = "BANNER_CONTENT";
                param4.value = "banner内容";
                self.varableList.push(param4);

                //banner文案
                var param5 = {};
                param5.key = "BANNER_BTN_CONTENT";
                param5.value = "banner文案";
                self.varableList.push(param5);

                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);
            }
            if('AWARD' == self.version.strategyType && 'BANNER' == self.version.touchWay){
                //banner内容
                var param4 = {};
                param4.key = "BANNER_CONTENT";
                param4.value = "banner内容";
                self.varableList.push(param4);
                //触达时间
                var param6 = {};
                param6.key = "strategyTime";
                param6.value = "触达时间";
                self.varableList.push(param6);

            }
        }

        //复制到初始化回显使用
        self.copyVarableList=angular.copy(self.varableList);
    }

    /**
     * 关闭变量弹窗
     */
    self.closeVariable = function () {
        $('#addVariableShow').hide();
    }


    /**
     * 保存变量弹窗
     */
    self.saveVariable = function () {
        if(confirm("变量修改后其他版本将删除,确认修改吗?")){
            self.otherVersions=[];
        }
        var variables = "";
        var tests = "";
        $(".checkbox").each(function() {
            if (this.checked == true) {
                var text = $(this).val();
                angular.forEach(self.varableList,function (each) {
                    if(each.key==text){
                        tests += each.value + ";"
                    }
                })
                variables += text+",";
            }
        })
        //可修改变量变量key
        self.canUpdateAttribute = variables.substring(0,variables.length-1);
        //可修改变量值
        self.tests = tests;
        $('#addVariableShow').hide();
    }

    /**
     * 修改原始版本
     */
    self.updateVersionConfig = function (type,param) {
        if(type==0){
            //全部变量只读
            angular.forEach(self.varableList,function (each) {
                if($('#'+each.key).is("select")){
                    $('#'+each.key).removeAttr("disabled");
                }else{
                    $('#'+each.key).removeAttr("readonly");
                }
            })
            //触达类型
            $("#strategyType2").removeAttr("disabled");
            //触达方式
            $("#touchWay2").removeAttr("disabled");
            angular.copy(self.ysVersion,self.version);
            self.versionConfig = 'updateRootVersion';

        }
        //修改其他版本
        if(type==1){
            angular.copy(param,self.version);
            self.versionConfig = 'updateOtherVersion';
            var index = self.otherVersions.indexOf(param);
            self.updateOtherIndex = index;
        }
        $('#versionConfig').show();

    }

    /**
     * 删除其他版本
     */
    self.delOtherVersion = function (param) {
        var index = self.otherVersions.indexOf(param);
        if(confirm("删除后数据将丢失,您确定要删除吗?")){
            self.otherVersions.splice(index,1);
        }
    }

    //审核人生成
    self.queryAuditorList = function () {
        var url = globalConfig.basePath + "/operation/init/byKey?type=10";
        $http.post(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.update.auditors = data.data.resp;
                    self.update.approverId = data.data.resp[0].key;
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 确认保存
     */
    self.commitUpdateAdd = function () {
        if(self.update.testName== null || self.update.testName == ''){
            alert("请填写实验名称");
            return;
        }
        if(self.update.approverId == null || self.update.approverId == ''){
            alert("请选择审核人!");
            return;
        }

        var url = globalConfig.basePath + "/abTest/addNewAbTest";
        $http.post(url,self.getData2()).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("添加成功");
                    self.updateShow=null;
                    self.update={};
                    self.updateShow=1;
                    //其他版本集合
                    self.otherVersions=[];
                    //原始版本
                    self.ysVersion={};
                    // 是否配置变量
                    self.isConfigValable=1;
                    //版本添加修改控制
                    self.showVersion=0;
                    //结果控制
                    self.commitData={};

                    $('.s-step3>b>b,.s-step3>p,.s-step3>em').removeClass('active');
                    $('.s-step0>b>b,.s-step0>p,.s-step0>em').addClass('active')
                    //返回主页
                    self.return();

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    /**
     * 添加数据包装
     */
    self.commitData={}
    self.getData2 = function () {
        if(self.isUpdate==1){
            self.commitData.testStrategyId = self.updateId;
        }
        //region 基础配置
        self.commitData.aioTestStrategyDtoPara={};
        //理财渠道
        self.commitData.aioTestStrategyDtoPara.channel = self.update.channel;
        //服务类型
        self.commitData.aioTestStrategyDtoPara.serviceTypeCode = self.update.serviceTypeCode;
        //用户行为
        self.commitData.aioTestStrategyDtoPara.userActionCode = self.update.userActionCode;
        //期望结果(预期状态)
        self.commitData.aioTestStrategyDtoPara.strategyResult =self.update.strategyResult;
        //周期(执行触达后x日内有效)
        self.commitData.aioTestStrategyDtoPara.strategyCycle = self.update.strategyCycle;
        //策略标签
        self.commitData.aioTestStrategyDtoPara.strategyTab = "TRST_STRATEGY";
        //触发节点
        self.commitData.aioTestStrategyDtoPara.touchCode = self.update.touchCode;
        //触发次数(限制配置-次数)
        self.commitData.aioTestStrategyDtoPara.touchCount = self.update.touchCount;
        //触发周期天数(限制配置-多少日内触发)
        self.commitData.aioTestStrategyDtoPara.touchTimeCount = self.update.touchTimeCount;
        //触发次数时间
        self.commitData.aioTestStrategyDtoPara.touchCountType = "NATUREDAY";
        //触达类型
        self.commitData.aioTestStrategyDtoPara.touchType = self.ysVersion.strategyType;
        //实验名称
        self.commitData.aioTestStrategyDtoPara.testName = self.update.testName;
        //名单类型
        self.commitData.aioTestStrategyDtoPara.userTagType = self.update.memberListName;
        if(self.update.memberListName != 'NO_RULE'){
            //用户标签(用户名单id)
            self.commitData.aioTestStrategyDtoPara.userTag = self.update.memberListId;
        }else{
            self.commitData.aioTestStrategyDtoPara.userTag = null;
        }
        //审核人id
        self.commitData.aioTestStrategyDtoPara.auditId = self.update.approverId;
        //endregion

        //region 触发策略
        // 策略条件
        self.commitData.aioTestStrategyDtoPara.strategyCondition=[];
        self.commitData.aioTestStrategyDtoPara.strategyCondition=angular.copy(self.update.strategyCondition);
        var param={}
        param.strategyConditionKey = 'SUM_TIME_COUNT';
        param.strategyConditionValue = 1;
        self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param);
        var param2 ={};
        param2.strategyConditionKey = 'SUM_TIME_COUNT_TYPE';
        param2.strategyConditionValue = "NATUREDAY";
        self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param2);
        //是否配置策略
        var param3={};
        param3.strategyConditionKey = 'IS_EFFECT';
        param3.strategyConditionValue = self.update.IS_EFFECT;
        self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param3);
        //endregion
        //修改银行
        if(self.update.serviceTypeCode =='WK_BANK_FLOW' ||self.update.serviceTypeCode =='QB_BANK_FLOW'){
            var param4 ={};
            param4.strategyConditionKey = 'BANK_CODE';
            param4.strategyConditionValue = self.update.BANK_CODE;
            self.commitData.aioTestStrategyDtoPara.strategyCondition.push(param4);
        }
        //修改预期银行
            if(self.update.strategyResult =="BANK_OPEN_SUCCESS" || self.update.strategyResult =="BANK_PAY_SUCCESS" ){
                var str = "";
                $(".updyqBankCode").each(function () {
                    if(this.checked==true){
                        str += $(this).val() + ",";
                    }
                })
                var checkdbanks = str.substring(0,str.length-1);
                self.commitData.aioTestStrategyDtoPara.bankCode  = checkdbanks;
        }
        //region 变量配置
        self.commitData.aioTestStrategyConvert={};
        self.commitData.aioTestStrategyConvert.canUpdateAttribute = self.canUpdateAttribute;
        self.commitData.aioTestStrategyConvert.canUpdateTouchWay =self.isConfigValable;
        //endregion
        self.commitData.aioStrategyVersion=[];
        //放入原始版本集合
        self.commitData.aioStrategyVersion.push(self.updateVersion(self.ysVersion));
        angular.forEach(self.otherVersions,function (each) {
            //放入其他版本集合
            self.commitData.aioStrategyVersion.push(self.updateVersion(each));
        })
        //endregion
        return self.commitData;

    }

    //region  版本操作
    self.updateVersion = function(param){
        var aioStrategyVersion={};
        //原始版本 param
        if(param.strategyTime=='SMARTTOUCH'){
            //时间配置
            aioStrategyVersion.muchTime=param.muchTime;
        }
        //描述
        aioStrategyVersion.remark = param.verDesc;
        //触达时间
        aioStrategyVersion.touchTimeType = param.strategyTime;
        //触达方式
        aioStrategyVersion.touchWay = param.touchWay;
        //版本名称
        aioStrategyVersion.versionName = param.verName;

        //触达方式
        aioStrategyVersion.parentContentDto={}
        //奖励
        aioStrategyVersion.parentContentDto.awardContentDto=[];
        if('AWARD'==param.strategyType){
            aioStrategyVersion.parentContentDto.awardContentDto = param.awardContentDto;
        }
        // banner实体
        aioStrategyVersion.parentContentDto.bannerContentDto={}
        if('BANNER'==param.touchWay){
            //banneer内容
            aioStrategyVersion.parentContentDto.bannerContentDto.bannerContent = param.BANNER_CONTENT;
            //按钮文案
            aioStrategyVersion.parentContentDto.bannerContentDto.bannerBtnContent = param.BANNER_BTN_CONTENT;
            //跳转类型
            aioStrategyVersion.parentContentDto.bannerContentDto.bannerBtnUrlType = param.skipType;
            if('URL' == param.skipType){
                //按钮url
                aioStrategyVersion.parentContentDto.bannerContentDto.bannerBtnUrl = param.BANNER_BTN_URL;
            }else if('PRIMORDIAL' == param.skipType){
                //页面类型
                aioStrategyVersion.parentContentDto.bannerContentDto.pageType = param.PAGE_TYPE;
                //原生跳转页面
                aioStrategyVersion.parentContentDto.bannerContentDto.primordialPage = param.PRIMORDIAL_PAGE;
            }
        }
        //短信
        aioStrategyVersion.parentContentDto.messageContentDto={};
        if('MESSAGE' == param.touchWay){
            //短信内容
            aioStrategyVersion.parentContentDto.messageContentDto.messageContent = param.MESSAGE_CONTENT;
        }
        //推送
        aioStrategyVersion.parentContentDto.pushContentDto={}
        if('PUSH' == param.touchWay){
            //跳转类型
            aioStrategyVersion.parentContentDto.pushContentDto.skipType = param.skipType;
            if('URL' == param.skipType){
                //按钮url
                aioStrategyVersion.parentContentDto.pushContentDto.skipUrl = param.SKIP_URL;
            }else if('PRIMORDIAL' == param.skipType){
                //页面类型
                aioStrategyVersion.parentContentDto.pushContentDto.pageType = param.PAGE_TYPE;
                //原生跳转页面
                aioStrategyVersion.parentContentDto.pushContentDto.primordialPage = param.PRIMORDIAL_PAGE;
            }
            //推送内容
            aioStrategyVersion.parentContentDto.pushContentDto.touchPushContent = param.TOUCH_PUSH_CONTENT;
            //推送标题
            aioStrategyVersion.parentContentDto.pushContentDto.touchPushTitle = param.TOUCH_PUSH_TITLE;
        }
        //站内信
        aioStrategyVersion.parentContentDto.pushMailContentDto={}
        if('PUSH_MAIL' == param.touchWay){
            //站内信内容
            aioStrategyVersion.parentContentDto.pushMailContentDto.touchPushContent = param.TOUCH_PUSH_CONTENT;
            //站内信标题
            aioStrategyVersion.parentContentDto.pushMailContentDto.touchPushTitle = param.TOUCH_PUSH_TITLE;
        }

        return aioStrategyVersion;
    }
    //endregion

    /**
     * 确认修改
     */
    self.updateSaveBtn = function () {
        if(self.update.testName== null || self.update.testName == ''){
            alert("请填写实验名称");
            return;
        }
        if(self.update.approverId == null || self.update.approverId == ''){
            alert("请选择审核人!");
            return;
        }
        var url = globalConfig.basePath + "/abTest/updateAbTest";
        $http.post(url,self.getData2()).then(
            function (data) {
                if (data.data.code == '000') {
                    alert("添加成功");
                    self.updateShow=null;
                    self.update={};
                    self.updateShow=1;
                    //其他版本集合
                    self.otherVersions=[];
                    //原始版本
                    self.ysVersion={};
                    // 是否配置变量
                    self.isConfigValable=1;
                    //版本添加修改控制
                    self.showVersion=0;
                    //结果控制
                    self.commitData={};

                    //是否为修改
                    self.isUpdate=0;

                    $('.s-step3>b>b,.s-step3>p,.s-step3>em').removeClass('active');
                    $('.s-step0>b>b,.s-step0>p,.s-step0>em').addClass('active')
                    //返回主页
                    self.return();

                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }


    function querySkipType2() {
        var type = '';
        if(self.update.channel == 'WK'){
            type=17;
        }
        if(self.update.channel == 'QB'){
            type=18;
        }
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/operation/init/byKey",
            data: "type="+type ,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code == '000') {
                    self.version.PAGE_TYPEList = data.resp;
                }else {
                    alert(data.message)
                }
            }
        })
    }


    function queryPageType2(type) {
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/operation/init/byKey",
            data: "type=19&code="+type ,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code == '000') {
                    self.version.PRIMORDIAL_PAGEList = data.resp;
                }else {
                    alert(data.message)
                }
            }
        })
    }

    //名单类型查询
    function strategyReload2() {
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/operation/init/byKey",
            data: "type=2" ,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code == '000') {
                    self.update.strategyList = data.resp;
                }else {
                    alert(data.message)
                }
            }
        })
    }

    //修改反显名单
    function membersReload2(){
        var channelCode = self.update.channel;
        if (self.update.memberListName=="NO_RULE") {
            $('#userNames').searchableSelect();
            $('#userNameLikeSearch').hide();
            self.update.memberCount=null;
        }else {
            $.ajax({
                type: "post",
                url: globalConfig.basePath + "/ruleConfig/FindChannelGroups",
                data: "channelCode="+channelCode+"&rosterType="+self.update.memberListName,
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data.code == '000') {
                        self.update.strChannelGroups = data.resp;
                        if (self.update.strChannelGroups.length > 0) {
                            $('#userNameLikeSearch').show();
                        }
                    }else {
                        alert(data.message)
                    }
                }
            })
        }
    }

    //触发节点回显
    self.queryTagSelectList = function (param) {
        if(param.channelCode=='悟空理财'){
            self.code = 'WK';
        }else if(param.channelCode=='钱包'){
            self.code = 'QB';
        }
        self.code = self.update.channel;
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.code + "&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.tagSelectList = userData.resp.data;
            }
        });
    }

    self.tagSelectListChange = function () {
        self.updinitdata();
    }



    self.checktimedetail = function (param) {
        var url = globalConfig.basePath + "/abTest/detail?testStrategyId="+param.id;
        $http.get(url).then(
            function (data) {
                if (data.data.code == '000') {
                    self.options = data.data.resp.testStrategyDto.touchStrategyList;
                    self.queryinitdata(data);
                    self.updbankschecked(data);
                } else {
                    alert(data.data.message)
                }
            }, function errorCallback(response) {
                alert("请求失败了....");
            }
        );
    }

    //修改实时数据时回显
    self.queryinitdata = function (data) {
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        self.code = data.data.resp.testStrategyDto.channelCodeKey;
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode="+self.code + "&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.querySelectDataList = userData.resp.data
                self.options = data.data.resp.testStrategyDto.touchStrategyList;
                self.options.forEach(function (value, index, array) {
                    if (value.attrKey === "REALTIME_TAG") {
                        self.updshowrealtimeTag = value.attrValue;
                    } else if (value.attrKey === "REALTIME_CRITERIA") {
                        self.updshowrealtimeCrteria = value.attrValue;
                    } else if (value.attrKey === "REALTIME_VALUE") {
                        self.updshowrealtimeValue = value.attrValue;
                    }
                });
                $('.query-updwrap').html(null);
                $('.query-updinfo').html(null);
                var $this = $(this);
                // 1 属性名下拉菜单 option
                for (var i = 0; i < self.querySelectDataList.length; i++) {
                    if (self.updshowrealtimeTag == self.querySelectDataList[i].english) {
                        self.initQueryNameList += "<option  value='" + self.querySelectDataList[i].english + "'>" + self.querySelectDataList[i].chinese + "</option>"
                        if (self.querySelectDataList[i].option == "date") {//时间格式
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text' value='" + self.updshowrealtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "number") {//数字格式
                            self.initQueryValue = "<input type='number' class='inp-text' value='" + self.updshowrealtimeValue+"'>";
                        } else if (self.querySelectDataList[i].option == "string") {//字符串格式
                            self.initQueryValue += "<input type='text' class='inp-text' value='" + self.updshowrealtimeValue+"'>";
                        }
                        for (var j = 0; j < self.querySelectDataList[i].list.length; j++) {
                            if (self.querySelectDataList[i].list[j].code == self.updshowrealtimeCrteria) {
                                self.initQueryCriteriaList += "<option value='" + self.querySelectDataList[i].list[j].code + "'>" + self.querySelectDataList[i].list[j].value + "</option>"
                            }
                        }
                    }
                }
            }
        });
        //and初始化
        var strBigGroup = `<div class="query-updinfo">
		        <div class="add-new-box">
		          <div class="query-list"><span class="circleLetter query-item-name"></span>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`

        ////////////////实时标签组件
        $('.query-updwrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }
        // 小组件 添加 query-selewrap
        $(".query-updwrap").on("click", " .query-seleinfo .add-button", function () {
            $(this).parent().find('.add-new-box').append(strSmallGroupInit)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        });
        // -
        $(".query-updwrap").on("click", " .query-updinfo .add-new-box .remove-query-info", function () {
            let $parent = $(this).parent()
            let $parents = $parent.parent()
            if ($parents.children().length >= 2) {
                $parent.remove()
            } else {
                $parents.parent().next().remove();
                $parents.parent().remove();
            }
        });
        // 添加 wrap 分组的
        $('.add-query-info-button').on('click', function () {
            $('.query-updwrap').append(strBigGroup)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        })
        $('.query-updwrap').on('click', ".remove-query-info, .add-button", function () {
            conditionDesc();
        });
        $('.add-query-info-button').on('click', null, function () {
            conditionDesc();
        });
        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }

    }


    //修改时调用实时标签
    self.updinitdata = function(){
        self.initQueryNameList = "";
        self.initQueryValue = "";
        self.initQueryCriteriaList = "";
        self.code = self.update.channel;
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/ruleConfigAddDetail/queryList",
            data: "channelCode=" + self.code + "&dataType=2",
            async: false,
            dataType: "json",
            success: function (userData) {
                if (userData.code != "000") {
                    alert(userData.message)
                    return;
                }
                if (userData.resp.success != true) {
                    alert(userData.resp.message)
                    return;
                }
                self.updinitSelectDataList = userData.resp.data
                // 1 属性名下拉菜单 option
                var $this = $(this);
                $('.query-updwrap').html(null);
                $('.query-updinfo').html(null);
                self.checkedupdrealtimeTag = $("#updtagSelectListid option:selected").val();
                for (var i = 0; i < self.updinitSelectDataList.length; i++) {
                    if (self.checkedupdrealtimeTag == self.updinitSelectDataList[i].english) {
                            self.initQueryNameList += "<option  value='" + self.updinitSelectDataList[i].english + "'>" + self.updinitSelectDataList[i].chinese + "</option>"
                        $this.parent().find("span").remove();
                        $this.parent().find(".dateno2").remove();
                        if (self.updinitSelectDataList[i].option == "date") {//时间格式
                            self.initQueryValue = "<input type='datetime-local' step='01' class='inp-text'>";
                        } else if (self.updinitSelectDataList[i].option == "number") {//数字格式
                            self.initQueryValue = "<input type='number' class='inp-text'>";
                        } else if (self.updinitSelectDataList[i].option == "string") {//字符串格式
                            self.initQueryValue = "<input type='text' class='inp-text'>";
                        }
                        //操作符下拉框inp2
                        for (var j = 0; j < self.updinitSelectDataList[i].list.length; j++) {
                            self.initQueryCriteriaList += "<option value='" + self.updinitSelectDataList[i].list[j].code + "'>" + self.updinitSelectDataList[i].list[j].value + "</option>"
                        }
                    }
                }
            }
        });
        //and初始化
        var strBigGroup = `<div class="query-updinfo">
		        <div class="add-new-box">
		          <div class="query-list"><span class="circleLetter query-item-name"></span>
		            <div class="inp inp1">
		                <select class="demo-1">` + self.initQueryNameList + `
		                </select>
		              </div>
		              <div class="inp inp2">
		                <select class="demo-1">` + self.initQueryCriteriaList + `
		                </select>
		              </div>
		              <div class="inp inp3">` + self.initQueryValue + `
		              </div>
		              <p class="remove-query-info">
		                  <span></span>
		              </p>
		          </div>
		        </div>
		      </div><br>`

        ////////////////实时标签组件
        $('.query-updwrap').append(strBigGroup);

        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }
        // 小组件 添加 query-selewrap
        $(".query-updwrap").on("click", " .query-seleinfo .add-button", function () {
            $(this).parent().find('.add-new-box').append(strSmallGroupInit)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        });
        // -
        $(".query-updwrap").on("click", " .query-updinfo .add-new-box .remove-query-info", function () {
            let $parent = $(this).parent()
            let $parents = $parent.parent()
            if ($parents.children().length >= 2) {
                $parent.remove()
            } else {
                $parents.parent().next().remove();
                $parents.parent().remove();
            }
        });
        // 添加 wrap 分组的
        $('.add-query-info-button').on('click', function () {
            $('.query-updwrap').append(strBigGroup)
            $('.demo-1').selectMania({
                size: 'small',
                themes: ['darkblue'],
                placeholder: 'Please select me!',
                removable: true,
                search: true,
            });
        })
        $('.query-updwrap').on('click', ".remove-query-info, .add-button", function () {
            conditionDesc();
        });
        $('.add-query-info-button').on('click', null, function () {
            conditionDesc();
        });
        var groupPrexArray = new Array();
        for (var i = 0; i < 26; i++) {
            groupPrexArray[i] = String.fromCharCode(65 + i);
        }


    }


    /*银行策略获取银行信息*/
    self.bankInfoList = function(){
        self.checkboxParamList= [];
        var url = globalConfig.basePath + "/smart_marketing/initiative/getBankList";
        $http({
            method: 'post',
            url: url,
        }).then(
            function(data) {
                self.checkboxParamList = data.data;
            },function(response) {
                alert("请求失败了....");
            }
        );
    };
    self.bankInfoList();


    //银行修改回显
    self.updbankschecked =function(data){
        $("#updAllchecked").prop("checked", false);//全部
        self.aioActionStrategyDtoPara = data.data.resp.testStrategyDto;
        self.bankCode = self.aioActionStrategyDtoPara.bankCode;
        self.aioActionStrategyDtoPara.touchStrategyList.forEach(function(value , index , array){
            if(value.attrKey === "BANK_CODE") {
                self.updrealbankcode = value.attrValue;
            }
        });
        self.bankInfoList();
        setTimeout(function () {
            if(self.updrealbankcode!=null){
                var count = 0;
                var bankCode = self.updrealbankcode.split(",");
                for(var i=0;i<bankCode.length;i++){
                    $(".updBankCode").each(function () {
                        if(bankCode[i]==$(this).val()){
                            count++;
                            $(this).prop("checked",true);
                        }
                    })
                }
                if(count == self.checkboxParamList.length){
                    $("#updAllchecked").prop("checked", true);//全部
                }
            }if(self.bankCode != null){
                var count = 0;
                var bankCode = self.bankCode.split(",");
                for(var i=0;i<bankCode.length;i++){
                    $(".updyqBankCode").each(function () {
                        if(bankCode[i]==$(this).val()){
                            count++;
                            $(this).prop("checked",true);
                        }
                    })
                }
                if(count == self.checkboxParamList.length){
                    $("#updyqAllchecked").prop("checked", true);//全部
                }
            }
        },800)
    }

}])

