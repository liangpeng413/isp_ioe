function addTaskPage($scope, $http, $timeout) {
    $scope.taskCode = "";
    $scope.taskRules = [];
    $scope.requirements = [];
    $scope.selectRule = {};
    $scope.currentRuleList = [];
    $scope.editable = false;
    $scope.editables = true;
    $scope.taskDetailList = [];
    $scope.prizeList = [];
    $scope.moduleList = [];
    var widgetTypes = [];
    var typeKey="";
    //添加全部选中事件
    $scope.complete = function(){
        $("#white").attr("checked",false);
        $("#black").attr("checked",false);
        if($('#all').is(':checked')){
            $("#white").attr('disabled','disabled');
            $("#black").attr('disabled','disabled');
            $("#whiteID").attr('disabled','disabled');
            $("#blackSelect").attr('disabled','disabled');      
            $scope.addTask.whiteId = '';
            $scope.addTask.blackId = '';
        }
        else {
            $("#white").removeAttr('disabled','disabled');
            $("#black").removeAttr('disabled','disabled');
        }
    }

    //添加白名单
    $scope.baiChecked = function(){
        if($('#white').is(':checked')){
            $('#whiteID').removeAttr('disabled','disabled');
        }else{
            $scope.addTask.whiteId = '';
            $("#whiteID").attr('disabled','disabled');
        }
    }
    //添加黑名单
    $scope.blackClick = function(){
        if($('#black').is(':checked')){
            $('#blackSelect').removeAttr('disabled','disabled');
        }else{
            $scope.addTask.blackId = '';
            $("#blackSelect").attr('disabled','disabled');
        }
    }

    $scope.shownScopeList = [
        {value: "none", label: "全部", checked: true},
        {value: "white", label: "白名单", checked: false},
        {value: "black", label: "黑名单", checked: false}
    ];

    $scope.showScopedItem = function (value) {
        $.each($scope.shownScopeList, function (n, v) {
            if (v.value === value) {
                v.checked = true;
            } else {
                v.checked = false;
            }
        })
    };

    $scope.getShownScopeItem = function () {
        var blackWhiteLimit = "";
        $.each($scope.shownScopeList, function (n, v) {
            if (v.checked) {
                blackWhiteLimit = v;
                return;
            }
        });
        return blackWhiteLimit;
    };

    $scope.changeEditStatus = function (status) {
        $scope.editable = status;
    };

    rule($scope, $http);

    addTask($scope, $http);

    viewTask($scope, $http);

    /**
     * type: activityType.activityType
     * pid: activityType.id
     * moduleCode: moduleCode 模块code
     *
     * */
    $scope.loadRules = function (type, pid, moduleCode) {
        // console.log("loadRules 方法参数");
        // console.log(type + "," + pid + "," + moduleCode);
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
    	}else if(typeKey==8){
            typeKey="dl_";
        }else if(type==30){
            typeKey="dj_";
        }else if(type==44){
            typeKey="fx_";
        }else if(type==45){
            typeKey="fw_";
        }else if(type==46){
            typeKey="sh_";
        }

        $http.post(globalConfig.basePath + "/router/web/activity/dict/rules", {activityType: type,
                pid: pid,
                moduleCode: moduleCode}).then(function (result) {
            var data = result.data.resp.data;
            // console.log("/web/activity/dict/rules 内置规则接口");
            // console.log(data);
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
                // $scope.taskRules = rules; 原
                $scope.taskRules = rules;
                //任务完成条件
                $scope.requirements = data.requirements;
                // $scope.requirements = [{"ruleText": "ruleText完成条件"}];
                $scope.selectRule = $scope.taskRules[0];
            }
        });
    };

    //任务模块
    $scope.loadModuleTypes = function(pid) {
        //pid 为查types接口返回的id
        // alert("load module");
        // var url = globalConfig.basePath + "/router/web/query/task/module";
        var url = globalConfig.basePath + "/router/web/query/task/module";
        $http.post(url, {"pid": pid}).then(function (result) {
            // console.log("查模块参数：" + pid + "; and返回：");
            // console.log(result);
            if (result.data.code == '000') {
                // alert("code" + result.data.code);
                var data = result.data.resp.data;
                $scope.moduleList = data.moduleList;
                // console.log("查模块jiekou返回，000内, $scope.moduleList");
                // console.log($scope.moduleList);
            }
        });
    }

    //查询活动类型
    $scope.queryTypes = function (channel) {
        // alert("查活动类型");
        $http.get(globalConfig.basePath + "/router/web/activity/type/list?channel=" + channel)
            .then(
                function (response) {
                    var data = response.data.resp.data;
                    // console.log("queryTypes");
                    // console.log(data);
                    var types = [];
                    // $.each(data.activityTypeList, function (n, v) {
                    //     types.push(v);
                    //     /* if (v.name === '赠送类') {
                    //          types.push(v);
                    //      }*/
                    // });
                    $scope.types = data.activityTypeList;
                    $scope.queryData.types = $scope.types;
                }
            );
    }

    $http.get(globalConfig.basePath + "/rDict/getVersionByType?type=display_widget").then(function (result) {
        widgetTypes = result.data.resp.result;
    });

    $scope.getWidgetType = function (code) {
    	 code=typeKey+code;
        var targetType = {value: 'text'};
        $.each(widgetTypes, function (n, w) {
            if (w.label === code) {
                if (w.value === '') {
                    w.value = 'text';
                }

                if (w.value === 'select' && !$scope.selectRule.ruleValue) {
                    $scope.selectRule.ruleValue = $scope.parseRuleKey(w.description.split(";")[0]);
                }
                
              /*  if (w.value === 'checkbox' && !$scope.selectRule.ruleValue) {
                    $scope.selectRule.ruleValue = $scope.parseRuleKey(w.description.split(";")[0]);
                }*/
                targetType = w;
                return;
            }
        });
        return targetType;
    };

    //查询条件的输入类型，这里可以查到字典表里配置的信息，条件的value、label、description、parent_id等
    $scope.getWidgetTypeRequirement = function (code) {
        code = "tj_" + code;
        var targetType = {value: 'text'};
        // console.log("widgetTypes");
        // console.log(widgetTypes);
        $.each(widgetTypes, function (n, w) {
            if (w.label === code) {
                //tj_default表示此条件无需输入值
                if (w.value === 'tj_default') {
                    targetType = w;
                }

                if (w.value === 'select' && !$scope.selectRule.ruleValue) {
                    $scope.selectRule.ruleValue = $scope.parseRuleKey(w.description.split(";")[0]);
                }

                /*  if (w.value === 'checkbox' && !$scope.selectRule.ruleValue) {
                      $scope.selectRule.ruleValue = $scope.parseRuleKey(w.description.split(";")[0]);
                  }*/
                targetType = w;
                return;
            }
        });
        return targetType;
    };

    $scope.parseRuleKey = function (r) {
    	var a = r.substring(0, r.lastIndexOf("-"));
        return a;
    };

    $scope.getRuleValue = function (rule) {
        if (rule.ruleValue === 'T') {
            return '是';
        }
        console.log(rule.ruleValue.indexOf('-'));
        if (rule.ruleValue.indexOf('-') >= 0) {
            var ruleDesList = $scope.getWidgetType(rule.ruleKey).description.split(";");
            var ruleList = rule.ruleValue.split(",");
            var target = "";
            $.each(ruleDesList, function (n, v) {
            	$.each(ruleList,function(i,j){
            		if ($scope.parseRuleKey(v) === j) {
            			 target = target + v.substring(v.lastIndexOf("-") + 1)+"&";
                    }
            	})
            });
            target =  target.substring(0,target.lastIndexOf("&"));
            return target;
        }

        if(rule.ruleValue.indexOf(',')>0){
            var ruleDesList = $scope.allCategoryList;
            var ruleList = rule.ruleValue.split(",");
            var target = "";
            $.each(ruleDesList, function (n, v) {
                $.each(ruleList,function(i,j){
                    if (v.categoryId == j) {
                        target = target + v.categoryName +"&";
                    }
                })
            });
            target =  target.substring(0,target.lastIndexOf("&"));
            return target;
        }
        return rule.ruleValue;
    };

    $scope.splitDescription = function (code) {
        var result = $scope.getWidgetType(code).description.split(";");
        var defaultValue = result[0];
        $scope.selectRule.ruleValue = defaultValue.substring(defaultValue.lastIndexOf("-") + 1);
        return result;
    };

    $scope.selectPageOne =function(channel) {
        console.log("查询一级页，参数channel：" + channel + "； 返回：");
        if($scope.addTask.buttonType == '2') {
            var type = "";
            if (channel == 'WK') {
                type = "wk_protogenesis_page_one";
            } else {
                type = "qb_protogenesis_page_one";
            }
            //原生original_bd_url
            $http.get(globalConfig.basePath + "/rDict/getVersionByType" + "?type=" + type
            ).success(function(data) {
                $scope.rDictList = data.resp.result;
                console.log($scope.rDictList);
            });
        }
    }

    //根据一级页面查询二级页面
    $scope.selectPageOneByRDict = function(channel, pageOne, pageTow) {
        console.log("根据一级页查询二级页，参数：" + channel + "; " + pageOne);
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
            $scope.rPositionDictList = data.resp.result;
            if($scope.rPositionDictList.length=='1') {
                $scope.addTask.pageTwo = data.resp.result[0].value;
            } else if (pageTow) {
                $scope.addTask.pageTwo = pageTow;
            }
        });
    }


    //排序移动 来自banner
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

    $scope.getModule = function (moduleCode, activityTypeId) {
        // alert(moduleCode + $scope.addTask.activityType.id);
        var moduleList = [];
        var targetModule = {};
        var url = globalConfig.basePath + "/router/web/query/task/module";
        var promise = $http.post(url, {"pid": activityTypeId});
        promise.then(function (result) {
            console.log("getModule 查模块接口参数：" + activityTypeId);
            console.log("getModule 查模块接口返回");
            console.log(result);
            if (result.data.code == '000') {
                // alert("code" + result.data.code);
                moduleList = result.data.resp.data.moduleList;
                // console.log("moduleList变量赋值后");
                // console.log(moduleList);
                if (moduleList) {
                    $scope.moduleList = moduleList;
                    $.each(moduleList, function (n, module) {
                        console.log("n");
                        console.log(n);
                        if (module.moduleCode == moduleCode) {
                            targetModule = module;
                            console.log("getModule moduleCode ==");
                            console.log(module);
                            return module;
                            // return;
                        }
                    });
                    // return targetModule;
                }
            }
            // return targetModule;
        });
        // console.log("查出的moduleList");
        // console.log(moduleList);

    }

    //处理添加页的类型和模块
    $scope.getTypeAddPage = function () {
        // alert("getTypeAddPage");
        $scope.queryTypes("QB");
        // $scope.loadModuleTypes($scope.types[0].id);
        return $scope.types[0];
    }

    //根据key获取必要条件对象
    $scope.getRequirementByRuleKey = function (ruleKey) {
        // alert("getRequirementByRuleKey");
        var target = {};
        $.each($scope.requirements, function (n, requirement) {
            if (ruleKey === requirement.ruleKey) {
                // console.log("ruleKey === " + ruleKey);
                target = requirement;
                return;
            }
        });
        return target;
    }

    //适用商品类型选中全部商品
    var i=0
    $scope.muTexAll = function () {
        if(i==0){
            i=1;
        }else if(i==1){
            i=0;
        }
        if(i==1){
            $('.versionCheckbox').each(function() {
                $(this).prop("checked",true);
            });
        }else if(i==0){
            $('.versionCheckbox').each(function() {
                $(this).prop("checked",false);
            });
        }

    }

    //其他商品类型选中
    $scope.muTex=function(){
        $scope.getCateIdCheck();
    }

    $scope.getCateIdCheck = function(){
        var cateIds ="";
        $('.noAllId').each(function() {
            if (this.checked == true) {
                cateIds += $(this).val() + ",";
            }
        });
        shopTypeCode= cateIds;
        $scope.getCateType(shopTypeCode);
    }

    $scope.getCateType = function(shopTypeCode){
        var queryUrl = globalConfig.basePath + "/missionCenter/getCategoryList?shopTypeCode="+shopTypeCode;
        $http.get(queryUrl).then(
            function (data) {
                if (data.data.code == '000'){
                    $scope.aggregationPageUrl =data.data.resp.aggregationPageUrl;
                    $scope.categoryList = data.data.resp.categoryList;
                    if(''==shopTypeCode){
                        $scope.allCategoryList = data.data.resp.categoryList;
                    }
                }else {
                    alert("获取适用品类失败")
                }
            }
        );
    }



}

function viewTask($scope, $http) {
    $scope.viewTask = function (id, editable) {
        $scope.changeEditStatus(editable);
        $scope.editables = false;
        $http.get(globalConfig.basePath + "/router/web/activity/detail?id=" + id).then(function (result) {
            var task = result.data.resp.data;
            console.log("查看单个详情，接口返回");
            console.log(task);
            $scope.addTask = {
                activityType: $scope.getType(task.activityType),
                title: task.title,
                id: task.id,
                startTime: task.startTime,
                endTime: task.endTime,
                channel: task.channel,
                activityName: task.activityName,
                img: task.img,
                go: task.go,
                isEnable: task.isEnable,
                blackWhiteLimit: task.blackWhiteLimit || 'none',
                // moduleType: $scope.getModule(task.moduleCode, task.activityType),
                moduleCode: task.moduleCode,
                buttonType: task.buttonType + "",
                buttonDesc: task.buttonDesc,
                ruleList: task.ruleList,
                selectRequirement: task.ruleList[0],
                taskTag: task.taskTag,
                subTitle:task.remark
            };
            // $scope.getModule($scope.addTask.moduleCode, $scope.addTask.activityType.id);
            console.log("查看单个详情, 页面得到");
            console.log($scope.addTask);
            if ($scope.addTask.buttonType == 1) {
                $scope.addRedirectUrlIf = true;
            } else if ($scope.addTask.buttonType == 2) {
                $scope.addNativePageIf = true;
                // $scope.addPageTwoIf = true;
                $scope.addRedirectUrlIf = false;
                var pageOneTowArr = $scope.addTask.go.split(";");
                $scope.addTask.pageOne = pageOneTowArr[0];
                $scope.addTask.pageTow = pageOneTowArr[1];
                $scope.selectPageOne($scope.addTask.channel);
                $scope.selectPageOneByRDict($scope.addTask.channel, pageOneTowArr[0], pageOneTowArr[1]);
            }
            //加载页面需要的模块List
            $scope.loadModuleTypes($scope.addTask.activityType.id);
            $http.get(globalConfig.basePath + "/hdWhiteBlack/getByHdId?id=" + task.activityCode).then(function (result) {
            	var showType = result.data.resp.showType;
            	if(showType == 0){
                    $scope.allxx = true;
                    $scope.whitexx = false;
                    $scope.blackxx = false;
                    $("#white").attr('disabled','disabled');
                    $("#black").attr('disabled','disabled');
                    //$('#all').attr('disabled','disabled');
                   	$('#all').removeAttr('disabled','disabled');
                    $("#whiteID").attr('disabled','disabled');
                    $("#blackSelect").attr('disabled','disabled');
                }else if(showType == 1){
               	 	$("#white").removeAttr('disabled','disabled');
               	 	$("#black").removeAttr('disabled','disabled');
               	 	$("#whiteID").removeAttr('disabled','disabled');
               	    $scope.addTask.whiteId = result.data.resp.whiteId + '';
               	 	$scope.allxx = false;
               	 	$scope.blackxx = false;
                    $scope.whitexx = true;
                }else if(showType == 2){
                	 $("#white").removeAttr('disabled','disabled');
                	 $("#black").removeAttr('disabled','disabled');
                	 $("#blackSelect").removeAttr('disabled','disabled');
                	 $scope.addTask.blackId = result.data.resp.blackId + '';
                	 $scope.allxx = false;
                     $scope.whitexx = false;
                     $scope.blackxx = true;
                }else if(showType == 3){
               	 	$("#white").removeAttr('disabled','disabled');
               	 	$("#black").removeAttr('disabled','disabled');
               	 	$("#whiteID").removeAttr('disabled','disabled');
                    $("#blackSelect").removeAttr('disabled','disabled');
                    $scope.addTask.whiteId = result.data.resp.whiteId + '';
                    $scope.addTask.blackId = result.data.resp.blackId + '';
                    $scope.allxx = false;
                    $scope.whitexx = true;
                    $scope.blackxx = true;
                }
            });
            
            $scope.showScopedItem($scope.addTask.blackWhiteLimit);
            $scope.loadRules(task.activityType, $scope.addTask.activityType.id, task.moduleCode);

            $scope.taskCode = task.activityCode;
            setTimeout(function () {
                $("#addStartTime").val(longToStr(task.startTime));
                $("#addEndTime").val(longToStr(task.endTime));
            }, 100);

            queryTaskDetail($scope.taskCode, $http, function (result) {
                var data = result.data.resp.data;
                var values = [];
                $.each(data.configKeyList, function (n, detail) {
                    values.push({"value": detail.value});
                });
                $scope.taskDetailList = values;
            });


            $http.get(globalConfig.basePath + "/router/web/activity/pool/list?activityCode=" + task.activityCode).then(function (result) {
                $scope.prizeList = result.data.resp.data.activityPrizePoolList;
            });

            loadRuleByTask($scope, $http);

            $scope.getCateType("");
        });


    }
}

function queryTaskDetail(code, $http, cb) {
    $http.get(globalConfig.basePath + "/router/web/activity/config/list?activityCode=" + code).then(cb);
}

function addTask($scope, $http) {

    $scope.saveTask = function () {
        if (!$scope.addTask.activityType) {
            alert("活动类型不能为空");
            return;
        }
        if (!$scope.addTask.activityName) {
            alert("活动名称不能为空");
            return;
        }
        if (!$scope.addTask.moduleCode) {
            alert("任务模块不能为空");
            return;
        }
        if (!$scope.addTask.selectRequirement || !$scope.addTask.selectRequirement.ruleKey
                || !$scope.addTask.selectRequirement.ruleValue) {
            alert("任务条件不能为空");
            return;
        }
        $scope.addTask.selectRequirement.ruleValue = $scope.addTask.selectRequirement.ruleValue.replace(/[&\|\\\*^%$#@\-]/g, "");
        if (!$scope.addTask.selectRequirement.ruleValue) {
            alert("请正确填写输入项");
            return;
        }
        if ($scope.addTask.selectRequirement.ruleKey == 'limit_amount_and_max_count') {
            var rules = $scope.addTask.selectRequirement.ruleValue.split(',');
            if (rules.length != 2) {
                alert("任务条件无效,必须是以英文逗号【,】间隔的数字");
                return;
            }
        } else {
            //单值的校验, 以parent_id存数据类型（比如数字 int），description字段存储数字范围
            var widgetRequirement = $scope.getWidgetTypeRequirement($scope.addTask.selectRequirement.ruleKey);
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
                        // alert($scope.addTask.selectRequirement.ruleValue);
                        if (parseInt($scope.addTask.selectRequirement.ruleValue) < parseInt(split[0])
                                || parseInt($scope.addTask.selectRequirement.ruleValue) > parseInt(split[1])) {
                            alert("请正确填写数字范围");
                            return;
                        }
                    }
                }
            }
        }
        $scope.addTask.ruleList = [{id: $scope.addTask.id, ruleKey: $scope.addTask.selectRequirement.ruleKey,
            ruleValue: $scope.addTask.selectRequirement.ruleValue}];

        var endTime = $("#addEndTime").val();
        var startTime = $("#addStartTime").val();

        if (!endTime) {
            alert("活动结束时间不能为空");
            return;
        }
        if (!startTime) {
            alert("活动开始时间不能为空");
            return;
        }

        var body = angular.copy($scope.addTask);
        if (body.activityName.length > 18) {
            alert("活动名称18个字以内");
            return;
        }
        if (body.taskTag && body.taskTag.length > 5) {
            alert("任务标签5个字以内");
            return;
        }
        if (!body.buttonDesc) {
            alert("按钮文字不能为空");
            return;
        }
        if (body.buttonDesc.length > 10) {
            alert("按钮文字10个字以内");
            return;
        }
        if (!body.buttonType || body.buttonType == 1) {
            if (!body.go && body.channel != 'JF_LIFE') {
                alert("跳转不能为空");
                return;
            }
            body.buttonType = 1;
        }
        if (body.buttonType == 2) {
            if (!body.pageOne || !body.pageTwo) {
                alert("原生跳转不能为空");
                return;
            }
            body.go = body.pageOne + ";" + body.pageTwo;
        }

        body.blackWhiteLimit = $scope.getShownScopeItem().value;

        if (body.title && body.title.length > 32) {
            alert("活动描述32个字以内");
            return;
        }

        var detailLengthValidate = false;
        $.each($scope.taskDetailList, function (n, v) {
            if (v.value.length > 50) {
                detailLengthValidate = true;
            }
        });

        if (detailLengthValidate) {
            alert("活动细则50个字符以内");
            return;
        }

        $scope.loadModuleTypes(body.activityType.id);
        $scope.loadRules(body.activityType.activityType, body.activityType.id, body.moduleCode);
        //activityType.id 为 structure_dict表的主键id，一期接口不是这样，同一字段改了含义
        // body.activityType = body.activityType.id; 原
        //原为上边，下边接口方改动
        body.activityType = body.activityType.activityType;
        // body.moduleCode = body.moduleType.moduleCode;
        if (!$scope.taskCode) {
            body.activityCode = body.channel + "ZSL" + new Date().getTime();
        } else {
            body.activityCode = $scope.taskCode;
        }
        body.createUser = globalConfig.userName;

        var minusOneSec = true;

        $.each(endTime.split(" ")[1].split(":"), function (n, v) {
            if (v !== "00") {
                minusOneSec = false;
            }
        });

        if (minusOneSec) {
            var endDateStr = strToDate(endTime);
            body.endTime = strToDate(getDate(endDateStr)).getTime() - 1000;
            $("#addEndTime").val(longToStr(body.endTime));
        } else {
            body.endTime = strToDate(endTime).getTime();
        }

        body.startTime = strToDate(startTime).getTime();
        if (body.endTime < body.startTime) {
            alert("结束时间不能早于开始时间");
            return;
        }
        if (body.endTime < new Date().getTime()) {
            alert("结束时间不能早于当前时间");
            return;
        }
        body.img = $("#fileUrl").val();

        if (!body.img && body.channel!='JF_LIFE') {
            alert("活动图片不能为空");
            return;
        }
        $scope.addTask.img = body.img;
        $scope.taskCode = body.activityCode;
        
        var all = $("#all").prop("checked");
        if(all){
            $scope.addTask.showType = 0;
            body.blackWhiteLimit = 'none';
        }else{
            var white = $("#white").prop("checked");
            var black = $("#black").prop("checked");
            if(white&&black){
                $scope.addTask.showType = 3;
                body.blackWhiteLimit = 'black_white';
                if(($scope.addTask.blackId==""||$scope.addTask.blackId==undefined)||($scope.addTask.whiteId==""||$scope.addTask.whiteId==undefined)){
        			alert('请选择黑白名单');
            		return;	
        		}
            }else{
                if(white){
                    $scope.addTask.showType = 1;
                    body.blackWhiteLimit = 'white';
                    if($scope.addTask.whiteId==""||$scope.addTask.whiteId==undefined){
            			alert('请选择白名单');
                		return;	
            		}
                }else if(black){
                    $scope.addTask.showType = 2;
                    body.blackWhiteLimit = 'black';
                    if($scope.addTask.blackId==""||$scope.addTask.blackId==undefined){
            			alert('请选择黑名单');
                		return;	
            		}
                }else{
                    alert('请选择展示人群');
                    return;
                }
            }
        }

        if($scope.addTask.channel == 'JF_LIFE'){
            if (!$scope.addTask.subTitle) {
                alert("首页气泡任务简称不能为空");
                return;
            }
        }

        // console.log("创建时的参数");
        // console.log(body);
        $http.post(globalConfig.basePath + "/router/web/activity/create", body).then(function (result) {
            // console.log("创建任务返回：");
            // console.log(result);
            var response = result.data.resp;
            if (response.success) {
                updateTaskDetail(body.activityCode);
                if (!body.id) {
                    $scope.changeEditStatus(false);
                }
                var add = {};
                add.taskId = body.activityCode;
                add.blackId = $scope.addTask.blackId;
                add.whiteId = $scope.addTask.whiteId;
                add.showType =  $scope.addTask.showType;
                if($scope.addTask.channel=='QB' || $scope.addTask.channel=='JF_LIFE'){
                	add.productChannel = 1;
                }else{
                	add.productChannel = 0;
                }
                $http.post(globalConfig.basePath + "/hdWhiteBlack/add", add).then(function (result) {
                    if (result.data.code='000') {
                        alert("保存成功!");
                        $scope.editables = false;
                        $scope.getCateType("");
                    } else {
                        alert("保存失败:" + result.data.message);
                    }
                });
                //alert("保存成功!");
            } else {
                alert("保存失败:" + response.message);
            }
        });
    };

    function updateTaskDetail(code) {
        queryTaskDetail(code, $http, function (result) {
            var list = result.data.resp.data.configKeyList;
            if (list) {
                $.each(list, function (n, d) {
                    $http.delete(globalConfig.basePath + "/router/web/activity/config/delete?id=" + d.id);
                })
            }

            $.each($scope.taskDetailList, function (n, v) {
                var value = v.value;
                if (value && value.length > 0) {
                    var taskDetailBody = {
                        activityCode: code,
                        createUser: globalConfig.loginName,
                        value: value,
                        sort: n,
                        configKey: 'WKZSL' + new Date().getTime() + n
                    };

                    $http.post(globalConfig.basePath + "/router/web/activity/config/add", taskDetailBody).then(function (result) {
                        if (result.status !== 200) {
                            alert("添加活动细则失败");
                        }
                    });
                }
            });
        });
    }
}

function rule($scope, $http) {
    $scope.removeRule = function (rule) {
        if (confirm("确认删除规则?")) {
            $http.get(globalConfig.basePath + "/router/web/activity/rule/delete?id=" + rule.id).then(function (result) {
                if (result.status === 200) {
                    loadRuleByTask($scope, $http);
                    alert("删除成功");
                } else {
                    alert("删除失败");
                }
            })
        }
    };

    $scope.addRule = function (rule,type) {
        var value=null;
    	if(type==1){
            value = rule.ruleValue;
            if(!value){
             $("#writeId").find("input[type='checkbox']").each(
                    function() {
                        if ($(this).is(":checked") == true) {
                            value += $(this).val() + ",";
                        };
                    });
             value = value.substring(0,value.lastIndexOf(","));
            }
            if (!value) {
                alert("输入项不能为空");
                return
            }
        }else{
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
        }

        var body = {
            activityCode: $scope.taskCode, createUser: globalConfig.userName, ruleKey: rule.ruleKey,
            ruleValue: value
        };
        $http.post(globalConfig.basePath + "/router/web/activity/rule/bind", body).then(function (result) {
            if (result.status === 200) {
                loadRuleByTask($scope, $http);
                alert("添加成功");
            } else {
                alert("添加失败:" + result.status);
            }
        })
    };
}

function loadRuleByTask($scope, $http) {
    $http.get(globalConfig.basePath + "/router/web/activity/rule/list?activityCode=" + $scope.taskCode).then(function (result) {
        var data = result.data.resp.data;
        $scope.currentRuleList = data.activityRuleList;
    });

}
