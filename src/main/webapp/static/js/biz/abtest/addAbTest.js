var channelCode="WK";
var serviceCode = "";
var userActionCode = "";

$(function() {
	//绑定渠道改变事件
	$(document).on("change","#channel",function(){
		channelCode = $("#channel").val();
		//初始化时渠道改变事件：获取服务列表
		serviceSelectCreate();
    });
	
	//绑定服务改变事件
	$(document).on("change","#service",function(){
		serviceCode = $("#service").val();
		//初始化服务改变事件：获取用户行为
		userSelectCreate();
    });
	
    //绑定用户行为改变事件
    $(document).on("change","#user",function(){
    	$("#showUserAction").html($("#user").find("option:selected").text());
    	userActionCode = $("#user").val();
    	//根据用户行为生成触发节点：xxx成功 或 xxx失败
    	triggerNodeCreate();
    });
	
	//初始化时渠道改变事件：获取服务列表
	serviceSelectCreate();
	
	//渠道改变事件
	function serviceSelectCreate(){
		$.post(globalConfig.basePath + "/operation/init/byKey","type=12&code="+$("#channel").val(),function(data){
        	var strService="";
        	if(data.resp){
        		for (var i = 0; i < data.resp.length; i++) {
            		strService+="<option value='"+data.resp[i].key+"'>"+data.resp[i].value+"</option>"
    			}
        	}
        	$("#service").html("<option value=''>全部</option>"+strService)
        	userSelectCreate();
        },"json")
	}
	
	//初始化服务改变事件：获取用户行为
	function userSelectCreate(){
		$("#showService").html($("#service").find("option:selected").text());
		$.post(globalConfig.basePath  + "/operation/init/byKey","type=13&code="+$("#service").val(),function(res){
    		var strUser="";
        	if(res.resp){
        		for (var i = 0; i < res.resp.length; i++) {
        			strUser+="<option value='"+res.resp[i].key+"'>"+res.resp[i].value+"</option>"
    			}
        	}
        	$("#user").html("<option value=''>全部</option>"+strUser)
        },"json")
	}
    
    //名单类型初始化
    $.ajax({
            type: "post",
            url: globalConfig.basePath + "/operation/init/byKey",
            data: "type=2",
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code != '000') {
                    alert(data.message);
                    return;
                }
                var res = data.resp;
                if (res != "" && res != null) {
                    var str = "";
                    for (var i = 0; i < res.length; i++) {
                        str += "<option value='" + res[i].key + "'>" + res[i].value + "</option>"
                    }
                    //附加改变事件
                    $("#userStrategy").html(str);
                    //用户画像分组名单生成
                    findChannelGroups();
                }
            }
    });
    
    //用户名单类型-用户名单联动联动
    $(document).on("change","#userStrategy",function(){
    	findChannelGroups();
    })
    
    //$('#userNames').searchableSelect();
    
    //查询渠道现有分组
	function findChannelGroups(){
		if($("#userStrategy").val()=="NO_RULE"){
			//$("#userNames").html("");
			$("#userNames").html("<option value=''></option>");
			$("#userNames").next().remove();
	    	$('#userNames').searchableSelect();
	    	$('#userNameLikeSearch').hide();
		}else{
			$.post(globalConfig.basePath + "/ruleConfig/FindChannelGroups","channelCode="+channelCode+"&rosterType="+$("#userStrategy").val(), function (data) {
				var strChannelGroups="";
		    	if(data.code!='000'){
		        	alert(data.message);
		        	return;
		        }
		    	
		    	if(data.resp.length > 0){
		    		$('#userNameLikeSearch').show();
		    	}
		    	
		    	for (var i = 0; i < data.resp.length; i++) {
		   			strChannelGroups+="<option value='"+data.resp[i].rosterId+"'>"+data.resp[i].rosterName+"</option>";
				}
		    	$("#userNames").html(strChannelGroups);
		    	$("#userNames").next().remove();
		    	$('#userNames').searchableSelect();
		    }, "json");
		}
	}
    
    //预期结果状态生成
    $.ajax({
          type: "post",
          url: globalConfig.basePath + "/operation/init/byKey",
          data: "type=9" ,
          async: false,
          dataType: "json",
          success: function (data) {
          	if (data.code != '000') {
                  alert(data.message);
                  return;
              }
              var res = data.resp;
              var option = "";
              if (res != "" && res != null) {
                  for (var i = 0; i < res.length; i++) {
                      option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
                  }
                  $("#expResultStatus").html(option);
              }
          }
    });
	
	$("#returnBack").on("click", function() {
		if (confirm("现在返回将丢失填写数据，确定返回吗？")) {
			window.location.href = globalConfig.basePath + "/abtestList";
		}
	});
	
	function validate1(){
		//alert( $('#service').html());
		//$('#service').val('QB_NEW_USER');
		if(serviceCode==""||serviceCode=="null"||serviceCode==0){
			alert("服务类型不能为空");
			return false;
		}
		if(userActionCode==""||userActionCode=="null"||userActionCode==0){
			alert("用户行为不能为空");
			return false;
		}
		
		var strategyCycle = $('#strategyCycle').val();
		
		if( strategyCycle == '' || strategyCycle < 1 || strategyCycle >7 ){
			alert("执行触达后xxx自然日内有效只能在1到7之间");
			return false;
		}
		
		var touchTimeCount = $('#touchTimeCount').val();
		if( touchTimeCount == '' || touchTimeCount < 1 || touchTimeCount >30 ){
			alert("限制配置n个自然日只能在1到30之间");
			return false;
		}
		
		var touchCount = $('#touchCount').val();
		if( touchCount == '' || touchCount < 1 || touchCount >10 ){
			alert("限制配置最多触发n次只能在1到10之间");
			return false;
		}
		
		var number = queryUserNumber();
		if(number!=null && number < 5000){
			alert("用户名单数量："+number + ",小于5000");
			return false;
		}
		
		return true;
	}
	
	$("#queryUserNumberBtn").click(function () {
		$('#showUserNumber').html("");
		var number = queryUserNumber();
		$('#showUserNumber').html(number);
	});
	
	
	//查询名单数量
	function queryUserNumber(){
		var number;
		var userTagCode = $('#userNames').val();
		if(userTagCode != null && userTagCode != ""){
			$.ajax({
		        type: "get",
		        url: globalConfig.basePath + "/abTest/getTagInfo",
		        data: "userTagCode=" + userTagCode,
		        async: false,
		        dataType: "json",
		        success: function (data) {
		            if (data.code != '000') {
		                alert(data.message);
		            }else{
		            	number = data.resp.rosterCount;
		            }
		            
		        }
		    });
			return number;
		}
	}
	
	// 2=================================================================================================

	// 根据用户行为 1 初始化生成触发节点：xxx成功 或 xxx失败 2 ：初始化是否配触发策略
	function triggerNodeCreate(){
	    $.ajax({
	        type: "post",
	        url: globalConfig.basePath + "/operation/init/byKey",
	        data: "type=1&code=" + userActionCode,
	        async: false,
	        dataType: "json",
	        success: function (data) {
	            if (data.code != '000') {
	                alert(data.message);
	                return;
	            }
	            var res = data.resp;
	            if (res != "" && res != null) {
	                //var str = "<option value=''>全部</option>";
	                var str = "";
	                for (var i = 0; i < res.length; i++) {
	                    str += "<option value='" + res[i].key + "'>" + res[i].value + "</option>"
	                }
	                $("#triggerNode").html(str);
	            }
	            //初始化触发节点后，渲染：1 是否配触发策略(默认是)，
	            //$("#yesInputConfig").prop("checked",true);
	            //2 根据默认的第一个触发节点配置触发策略
	            postTriggerStrategy($("#triggerNode").val());
	        }
	    });
	}
	
	//触发节点改变事件：重新渲染：1 是否配触发策略为是，2 生成触发策略
	$(document).on('change',"#triggerNode",function(){
		//触发节点改变后，默认设置是否配触发策略为"是"
		//$("#yesInputConfig").prop("checked",true);
		//alert("触发节点改变，触发策略生成");
		postTriggerStrategy($("#triggerNode").val());
	});
	
	
	var isEffect = "1";
	
    // 绑定是否配触发策略事件
	$(document).on('change',"input[name=IS_EFFECT]",function(){
    	    var $this=$(this);
    	    //alert($this.val())
    	    if($this.val()==0){// 否，触发策略置灰
    	    	isEffect = "0";
    	    	$("#triggerStrategyContext").html("");
    	   	}else{
    	   		isEffect = "1";
    	   		postTriggerStrategy($("#triggerNode").val());
    	   	}
    });
	
	//根据触发节点和是否配触发策略 -> 配置触发策略
	function postTriggerStrategy(triggerNodeId) {
		//alert("渲染触发策略" + $("input[name=IS_EFFECT]:checked").val())
        //触发策略生成    triggerNodeId节点key
		//是否配触发策略
        /*if($("input[name=IS_EFFECT]:checked").val()=="0"){
        	$("#triggerStrategyContext").html("");
        	return;
        }*/
        
        // alert("触发策略生成")
        // 根据触发节点查询该节点下的触发策略
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/operation/init/byKey",
            data: "node=" + triggerNodeId,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code != '000') {
                    alert(data.message);
                    return;
                }
                var $data = data.resp;
                var triggerStrategy = "";
                if ($data != "" && $data != null) {
                	$("#yesInputConfig").prop("checked",true);
                	isEffect = "1";
                    $("#triggerStrategy").next().html("");
                    var str = "";
                    var select = "";
                    var text = "";
                    var node = "";
                    var count=0;
                    for (var i = 0; i < $data.length; i++) {
                        var remarks = $data[i].remarks;
                        var type = $data[i].type;
                        var description = $data[i].description;
                        var parentCode = $data[i].parentCode;
                        var ownCode = $data[i].ownCode;
                        var key = $data[i].key;
                        
                        var selectCountSum=0;
                        if (type == "select") {//下拉框内的option
                            //所有内含select的放到一组div，不是select的独自一组div
                            var num = 0;
                            //在本数组中不存在次text的父节点，就单起一组div
                            for (var j = 0; j < $data.length; j++) {
                                if (parentCode == $data[j].ownCode) {
                                    num++;
                                }
                                if($data[j].type=="select"){
                                	selectCountSum++;
                                }
                            }
                            if (num == 0) {
                            	
                                if (count == 0) {
                                    select = "<div class='deploy-item' style='margin-bottom:15px;text-align:right;'><label>" + remarks + "：</label>" + "<select id='"+ ownCode + "'" + " name='"+ownCode+"'><option value='" + key + "'>" + description + "</option>";
                                    count++;
                                } else {
                                    select = select + "<option value='" + key + "'>" + description + "</option>"
                                    count++;
                                }
                                if (count == selectCountSum) {
                                    select = select + "</select></div>";
                                    triggerStrategy += select;
                                }
                            }
                        }

                        if (type == "text") {//输入框
                            var num = 0;
                            //在本数组中不存在次text的父节点，就单起一组div
                            for (var j = 0; j < $data.length; j++) {
                                if (parentCode == $data[j].ownCode) {
                                    num++;
                                }
                            }
                            if (num == 0) {
                                text = "<div class='deploy-item' style='margin-bottom:15px;text-align:right;'><label>" + remarks + "：</label>" + "<input placeholder='" + description + "' type='text' style='margin-left: 15px' name='"+key+"' id='" + key + "'" + " required='required'/></div>";
                                triggerStrategy += text;
                            }
                        }
                        if (type == "number") {//输入框
                            var num = 0;
                            //在本数组中不存在次text的父节点，就单起一组div
                            for (var j = 0; j < $data.length; j++) {
                                if (parentCode == $data[j].ownCode) {
                                    num++;
                                }
                            }
                            if (num == 0) {
                                text = "<div class='deploy-item' style='margin-bottom:15px;text-align:right;'><label>" + remarks + "：</label>" + "<input placeholder='" + description + "' type='number' style='margin-left: 15px' name='"+key+"' id='" + key + "'" + " required='required'/></div>";
                                triggerStrategy += text;
                            }
                        }
                        if (type == "none") {//节点，以下分级
                            var num = 0;
                            //在本数组中不存在次text的父节点，就单起一组div
                            for (var j = 0; j < $data.length; j++) {
                                if (parentCode == $data[j].ownCode) {
                                    num++;
                                }
                            }
                            if (num == 0) {
                                //遍历本数组，讲子元素填充
                                var sonCode = "";
                                count = 0;
                                var selectStr=""
                                for (var z = 0; z < $data.length; z++) {
                                    if (ownCode == $data[z].parentCode) {
                                        if ($data[z].type == "text") {
                                            text = "<div class='deploy-item' style='margin-bottom:15px;text-align:right;'><label>" + $data[z].remarks + "：</label><input placeholder='" + $data[z].description + "' type='text' style='margin-left: 15px'" + " id='" + $data[z].key+"'" + " name='"+$data[z].key+"' required='required'/></div>";
                                            sonCode += text;
                                        }
                                        if ($data[z].type == "number") {
                                            text = "<div class='deploy-item' style='margin-bottom:15px;text-align:right;'><label>" + $data[z].remarks + "：</label><input placeholder='" + $data[z].description + "' type='number' style='margin-left: 15px'" + " id='" + $data[z].key + "'" + " name='"+$data[z].key+"' required='required'/></div>";
                                            sonCode += text;
                                        }
                                        selectCountSum=0;
                                        if ($data[z].type == "select") {//下拉框内的option
                                            //所有内含select的放到一组div，不是select的独自一组div
                                            var num = 0;
                                            //在本数组中不存在次text的父节点，就单起一组div
                                            for (var q = 0; q < $data.length; q++) {
                                                if (parentCode == $data[q].ownCode) {
                                                    num++;
                                                }
                                                if($data[q].type=="select"){
                                                	selectCountSum++;
                                                }
                                            }
                                            if (num == 0) {
                                            	
                                                if (count == 0) {
                                                	selectStr = "<div class='deploy-item' style='margin-bottom:15px;text-align:right;'><label>" + $data[z].remarks + "：</label>" + "<select " + "id='" + $data[z].ownCode +"'" + " name='"+$data[z].ownCode+"'><option value='" + $data[z].key + "'>" + $data[z].description + "</option>";
                                                    count++;
                                                } else {
                                                	selectStr = selectStr + "<option value='" + $data[z].key + "'>" + $data[z].description + "</option>"
                                                    count++;
                                                }
                                                if (count == selectCountSum) {
                                                	selectStr = selectStr + "</select></div>";
                                                	sonCode += selectStr;
                                                }
                                            }
                                        }
                                    }
                                }
                                node = "<div class='deploy-item' style='margin-bottom:15px'><label>" + remarks + "：</label><div>" + sonCode + "</div></div>"
                                triggerStrategy += node;
                            }
                        }
                    }
                }else{
                	isEffect = "0";
                	$("#noConfig").prop("checked",true);
                }
                $("#triggerStrategyContext").html(triggerStrategy);
                //触发节点无触发策略配置项，则是否启动触发策略按钮选择否，value=0
                /*if(triggerStrategy==""){
                	// alert($("#triggerStrategyContext").html());
                	$("input[type=radio][name=IS_EFFECT][value=0]").attr("checked",true);
                	$("input[type=radio][name=IS_EFFECT][value=1]").next().remove();
                	$("input[type=radio][name=IS_EFFECT][value=1]").remove();
                }*/
            }
        });
    };
    
    function valInputIsNull(id,msg){
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
    
    function validate2(){
    	//验证重复性
    	//return true;
    	
    	var result = false;
    	
    	if( !valInputIsNull('SUM_MIN_FAIL_COUNT','累计失败次数范围' + '不能为空') ){
    		result = false;
    		return result;
    	}
    	if( !valInputIsNull('SUM_MAX_FAIL_COUNT','累计失败次数范围' + '不能为空') ){
    		result = false;
    		return result;
    	}
    	if( !valInputIsNull('SUM_MIN_AMOUNT','累计最小金额' + '不能为空') ){
    		result = false;
    		return result;
    	}
    	if( !valInputIsNull('SUM_MAX_AMOUNT','累计最大金额' + '不能为空') ){
    		result = false;
    		return result;
    	}
    	if( !valInputIsNull('THIS_MIN_AMOUNT','当此最小金额' + '不能为空') ){
    		result = false;
    		return result;
    	}
    	if( !valInputIsNull('THIS_MAX_AMOUNT','当此最大金额' + '不能为空') ){
    		result = false;
    		return result;
    	}
    	if( !valInputIsNull('SUM_TIME_COUNT','累计计算有效期 ' + '不能为空') ){
    		result = false;
    		return result;
    	}

    	$.ajax({
            type: "POST",
            async: false,
            url: globalConfig.basePath + "/abTest/validate",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(GetValidateJsonData()),
            dataType: "json",
            success: function (data) {
            	if(data.code == '000'){
            		result = true;
            	}else{
            		alert(data.message);
            	}
            },
            error: function (data) {
                alert( data.message);
            }
        });
    	return result;
	};
    
    function GetValidateJsonData() {
	    var json = {
	        "channel": channelCode,								//渠道
	        "serviceTypeCode": serviceCode,						//服务
	        "userActionCode": userActionCode,					//用户行为
	        "strategyResult": $('#expResultStatus').val(),		//预期结果状态 
	        "strategyCycle": $('#strategyCycle').val(),			//执行触达后xxx自然日内有效
	        "userTagType": $('#userStrategy').val(),			//名单类型
	        "userTag": $("#userNames").val(),					//用户名单
	        "touchTimeCount": $('#touchTimeCount').val(),		//限制配置：n个自然日
	        "touchCount": $('#touchCount').val(),				//限制配置：最多触发n次
	        "touchCountType": 'NATUREDAY',						//限制配置：1个自然日内最多触发
	        "IS_EFFECT": isEffect,								//是否配触发策略
	        //"SUM_FAIL_COUNT": $('#SUM_FAIL_COUNT').val(),		//累计失败次数 
	        "SUM_MIN_FAIL_COUNT": $('#SUM_MIN_FAIL_COUNT').val(),		//累计失败次数 
	        "SUM_MAX_FAIL_COUNT": $('#SUM_MAX_FAIL_COUNT').val(),		//累计失败次数 
	        "SUM_MIN_AMOUNT": $('#SUM_MIN_AMOUNT').val(),		//累计最小金额 
	        "SUM_MAX_AMOUNT": $('#SUM_MAX_AMOUNT').val(),		//累计最大金额 
	        "THIS_MIN_AMOUNT": $('#THIS_MIN_AMOUNT').val(),		//当此最小金额 
	        "THIS_MAX_AMOUNT": $('#THIS_MAX_AMOUNT').val(),		//当此最大金额 
	        "SUM_TIME_COUNT": 1,								//累计计算有效期 
	        "SUM_TIME_COUNT_TYPE": "NATUREDAY",					//累计计算有效期单位（NATUREDAY自然日 DAY 天 WEEK周 MONTH 月 YEAR年））
	        "touchCode": $('#triggerNode').val(),				//触发节点code						
	    };
	    return json;
    };
	
	// 3=================================================================================================
    
    var currentVerName;
    var verArray = new Array();
    var verDivArray = new Array();
    var updateVerFlag;
    var verNo = 1;//用于版本名称顺序号，只会增加
    
    var chuDa_modalBox = {};
    chuDa_modalBox.modal = document.getElementById("chuDaConfigModal");
    chuDa_modalBox.openChuDaBtn = document.getElementById("openChuDaBtn");
    chuDa_modalBox.addChuDaBtn = document.getElementById("addChuDaBtn");
    chuDa_modalBox.closeChuDaBtn = document.getElementById("closeChuDaBtn");
    chuDa_modalBox.closeChuDaBtn2 = document.getElementById("closeChuDaBtn2");
    chuDa_modalBox.saveChuDaBtn = document.getElementById("saveChuDaBtn");
    chuDa_modalBox.show = function() {
    	this.modal.style.display = "block";
    }
    chuDa_modalBox.close = function() {
    	this.modal.style.display = "none";
    }
    
    chuDa_modalBox.init = function() {
    	var that = this;
    	this.closeChuDaBtn.onclick = function() {
    		that.close();
    	};
    	this.closeChuDaBtn2.onclick = function() {
    		that.close();
    	};
    	
    	//原始配置
    	this.openChuDaBtn.onclick = function() {
    		// 原始配置的版本名称固定为“原始版本”
    		$('#verName').val("原始版本");
    		$('#headVerName').html("原始版本");
    		$("#verName").attr("readonly", "readonly");
    		currentVerName="原始版本";
    		//判断是新增还是修改
    		if(verArray.length==0 || verArray[0].verName == null || verArray[0].verName == "" ){
    			updateVerFlag = "新增";
    		}else{
    			updateVerFlag = "修改";
    			//重新渲染原始配置对话框
    			reShowChuDaConfig(verDivArray[0].divHtml,verArray[0]);
    			//渲染后从新绑定事件
    			closeChuDaBtn.onclick = function() {
    		    	that.close();
    		    };
    		    closeChuDaBtn2.onclick = function() {
    		    	that.close();
    		    };
    		    //渲染后重新绑定事件
    		    saveChuDaBtn.onclick = function() {
    		    	var success = saveVer();
    	    		if(success){
    	    			that.close();
    	    		}
    		    };
    		}
            that.show();
    	};
    	
    	//添加版本
    	this.addChuDaBtn.onclick = function() {
    		$('#headVerName').html("添加版本");
    		//必须先添加原始版本
    		if(verArray.length==0 || verArray[0].verName == null || verArray[0].verName == "" ){
    			alert("必须先添加原始版本");
    			return;
    		}
    		
    		if(verArray.length > 20){
    			alert("最多只能添加20个版本");
    			return;
    		}
    		
    		$("#verName").val("版本" + (verNo++));
    		$("#verDesc").val("");
    		$("#verName").removeAttr("readonly");
    		$("#strategyType").val(verArray[0].strategyType);
    		$("#strategyType").trigger("change");
    		//$("#strategyType").attr("readonly", "readonly");
    		$('#strategyType').attr("disabled",true);
    		
    		//渲染奖励类型
    		if( $('#awardType').length > 0 ){
    			$("#awardType").val(verArray[0].awardType);
    			$("#awardType").trigger("change");
    		}
    		
    		//触达方式置灰
    		var isSetCdfs = $("input[name=IS_SET_CDFS]:checked").val();
			//不修改触达方式
    		if(isSetCdfs == '0'){
    			//触达方式与原始版本一致
    			$("#touchWay").val(verArray[0].touchWay);
    			$("#touchWay").trigger("change");
    			$('#touchWay').attr("disabled", "true");
    		}
    		
    		//触达时间
    		if( $('#strategyTime').length > 0 ){
    			$("#strategyTime").val(verArray[0].strategyTime);
    			$("#strategyTime").trigger("change");//显示触发时间，xxx分钟未达到预期结果
    		}
    		
    		//跳转类型和页面类型
    		if($("#touchWay").val() == 'SOFT_POPUP' || $("#touchWay").val() == 'POPUP' ||  $("#touchWay").val() == 'PUSH' ||  $("#touchWay").val() == 'BANNER'){
    			//跳转类型不可变
    			if(isVeriable('skipType')){
	    			$("#skipType").val(verArray[0].skipType);
	    			$("#skipType").trigger("change");
    			}
    			//专属banner的跳转类型名称为ssss
    			if(isVeriable('BANNER_BTN_URL_TYPE')){
	    			$("#BANNER_BTN_URL_TYPE").val(verArray[0].BANNER_BTN_URL_TYPE);
	    			$("#BANNER_BTN_URL_TYPE").trigger("change");
    			}
    			//页面类型不可变
    			if(isVeriable('PAGE_TYPE')){
    				$("#PAGE_TYPE").val(verArray[0].PAGE_TYPE);
    				$("#PAGE_TYPE").trigger("change");
    			}
    			if(isVeriable('PRIMORDIAL_PAGE')){
    				$("#PRIMORDIAL_PAGE").val(verArray[0].PRIMORDIAL_PAGE);
    			}
    		}
    		
    		//变量控制置灰,不可变的输入框填原始配置的数据
    		if(veriableConfigArray!=null && veriableConfigArray.length>0){
    			for(var i=0; i<veriableConfigArray.length; i++){
    				$('#' + veriableConfigArray[i]).val( verArray[0][veriableConfigArray[i]]);
    				if( $('#' + veriableConfigArray[i]).is("select") ){
    					$('#' + veriableConfigArray[i]).attr("disabled", "true");
    				}else{
    					$('#' + veriableConfigArray[i]).attr("readonly", "readonly");	
    				}
    				if(veriableConfigArray[i] == 'fileUrl'){
    					$("#headPic").attr("src",verArray[0].headPic);
    				}
    				if(veriableConfigArray[i] == 'IS_OPEN_CARD_HELP'){
    					//否
    					if(verArray[0].IS_OPEN_CARD_HELP == '1'){
    						$("#YES_IS_OPEN_CARD_HELP").prop("checked",true);
    						$("#NO_IS_OPEN_CARD_HELP").attr("disabled",true);
    					}else{
    						$("#NO_IS_OPEN_CARD_HELP").prop('checked','true');
    						$("#YES_IS_OPEN_CARD_HELP").attr("disabled",true);
    					}
    				}
    			}
    		}
    		
    		currentVerName="新增版本";	//临时叫"新增版本"
    		updateVerFlag = "新增";
    		that.show();
    	};
    	
    	//保存"原始配置"或"版本配置"
    	this.saveChuDaBtn.onclick = function() {
    		var success = saveVer();
    		if(success){
    			that.close();
    		}
    	};
    }
    
    chuDa_modalBox.init();
    
    function processSelect(verJsonObj,attrName){
    	var value = $('#' + attrName).val();
    	if(value!=null && value!=null){
    		verJsonObj[attrName] = value;
    		//alert(attrName + ":" + value);
    	}
    }
    
    //保存(原始和其他)
    function saveVer(){
    	if($('#verName').val()!=null && $('#verName').val().length>10){
    		alert("版本名称最多10个字");
    		return false;
    	}
    	if($('#verDesc').val()!=null && $('#verDesc').val().length>30){
    		alert("版本描述最多30个字");
    		return false;
    	}
		var currentVerIndex = -1;
		var verJsonObj = {};
	    var verJsonArray = $('#verForm').serializeArray();
	    var validateNull = true;
	    $.each(verJsonArray, function() {
	    	if(this.name == 'AWARD_CONTENT'){
	    		if(this.value == null || this.value.trim() == ''){
		    		alert("积分或卡券ID不能为空");
		    		validateNull = false;
		    		return false;
	    		}
	    	}
	    	if(this.name=='fileUrl'){
		    	if(this.value == null || this.value.trim() == ''){
		    		alert("上传文件不能为空");
		    		validateNull = false;
		    		return false;
		    	}
	    	}else{
	    		var headPic = $("#headPic").attr("src");
	    		verJsonObj['headPic'] = headPic;
	    	}
	    	if(this.name!='verDesc'){
		    	if(this.value == null || this.value.trim() == ''){
		    		alert(variableMap.get(this.name) + "不能为空");
		    		validateNull = false;
		    		return false;
		    	}
	    	}
	    	verJsonObj[this.name] = this.value.trim();
	    });
	    
	    if(validateNull == false){
	    	return false;
	    }
	    
	    processSelect(verJsonObj,"strategyType");	//触达类型
	    processSelect(verJsonObj,"touchWay");		//触达方式
	    processSelect(verJsonObj,"skipType");
	    processSelect(verJsonObj,"BANNER_BTN_URL_TYPE");
	    processSelect(verJsonObj,"PAGE_TYPE");
	    processSelect(verJsonObj,"PRIMORDIAL_PAGE");
	    processSelect(verJsonObj,"strategyTime");
	    //processSelect(verJsonObj,"strategyPage");
	    processSelect(verJsonObj,"awardType");		//奖励类型（积分或卡券）
	    
	    //保存（新增或修改）原始版本
	    if(currentVerName == "原始版本"){
	    	
	    	//修改原始版本
	    	if( verArray != null && verArray.length > 0){
	    		
	    		//修改触达类型
	    		if(verArray[0].strategyType != $('#strategyType').val()){
		    		if (confirm("确定修改触达类型吗?，修改后，所有版本配置和变量将失效")) {
			    		clearVerData();
			    		$("#variableDiv").html("");
			    		$("#yesSetCdfs").prop("checked",true);
			    		$("#showVariableConfig").html("");
		    		}else{
		    			return false;
		    		}
	    		}
	    		//修改触达方式
	    		else if(verArray[0].touchWay != $('#strategyWay').val()){
	    			var isSetCdfs = $("input[name=IS_SET_CDFS]:checked").val();
	    			//否
	        		if(isSetCdfs == '0'){
	        			if (confirm("确定修改触达方式吗?，修改后，所有版本配置和变量将失效")) {
	        				clearVerData();
				    		$("#variableDiv").html("");
				    		$("#yesSetCdfs").prop("checked",true);
				    		$("#showVariableConfig").html("");
	        			}else{
	        				return false;
	        			}
	        		}
	    		}
	    	}
	    	
	    	verJsonObj.verName="原始版本";
	    	verJsonObj.verDesc=$('#verDesc').val();
	    	verArray[0] = verJsonObj;
	    	$("#showBasicConfig").html("修改配置");
	    	currentVerIndex = 0;
	    }
	    //新增非原始版本
	    else if(currentVerName=="新增版本"){
	    	
	    	if( $('#verName').val() == null || $('#verName').val().trim() == ""){
	    		alert("版本名称不能为空");
	    		return false;
	    	}
	    	
	    	currentVerIndex = verArray.length;
	    	if($('#verName').val() == "原始版本" ||$('#verName').val() == "新增版本"  ){
	    		alert("版本名称不能为原始版本或新增版本");
	    		return false;
	    	}
	    	//版本名称不能重复
	    	for (var i = 0; i < verArray.length; i++) {
	       		if(verArray[i].verName == $('#verName').val()){
	       			alert("版本名称重复，请修改为其他名称");
	       			return false;
	       		}
	       	}
	    	
	    	verJsonObj.verName=$('#verName').val();
	    	verJsonObj.verDesc=$('#verDesc').val();
	    	verArray[currentVerIndex] = verJsonObj;
	    	addVerRow(verJsonObj);
	    }
	    //修改非原始版本
	    else{
	    	//找到当前修改的原始版本
	    	for (var i = 0; i < verArray.length; i++) {
	    		 if(currentVerName == verArray[i].verName){
	    			 currentVerIndex = i;
	    			 break;
	    		 }          
            }
	    	if(currentVerIndex == -1){
	    		alert("当前索引号数据错误");
	    		return false;
	    	}
	    	if($('#verName').val() == "原始版本" ||$('#verName').val() == "新增版本"  ){
	    		alert("版本名称不能为原始版本或新增版本");
	    		return false;
	    	}
	    	verJsonObj.verName=$('#verName').val();
	    	verJsonObj.verDesc=$('#verDesc').val();
	    	verArray[currentVerIndex] = verJsonObj;
	    }
	    console.log(JSON.stringify(verArray));
	    
	    //将当期模态对话框保存下来，用于回显
	    verDivArray[currentVerIndex] = new Object();
	    verDivArray[currentVerIndex].verName = verArray[currentVerIndex].verName;
	    verDivArray[currentVerIndex].divHtml = document.getElementById('chuDaConfigModal').innerHTML;
	    return true;
    }
    
    //修改版本
    chuDa_modalBox.updateVer = function(verName) {
    	$('#headVerName').html("修改版本");
    	var index = getCurrentVerDiv(verName);
    	$('#verName').val(verArray[index].verName);
		currentVerName = verName;
		updateVerFlag = "修改";
		reShowChuDaConfig(verDivArray[index].divHtml,verArray[index]);
		$("#verName").attr("readonly", "readonly");
		closeChuDaBtn.onclick = function() {
			chuDa_modalBox.close();
		};
		closeChuDaBtn2.onclick = function() {
			chuDa_modalBox.close();
		};
		saveChuDaBtn.onclick = function() {
			var success = saveVer();
			if(success){
				chuDa_modalBox.close();
		   	}
		};
		chuDa_modalBox.show();
    }
    
    function reShowChuDaConfig(divHtml,verJsonObj){
    	document.getElementById('chuDaConfigModal').innerHTML = divHtml;
		for(var p in verJsonObj){
			var value = verJsonObj[p];
			$('#' + p).val(value) ;
			
			if(verJsonObj.IS_OPEN_CARD_HELP != null){
				if(verJsonObj.IS_OPEN_CARD_HELP == '0'){
					$("input[name='IS_OPEN_CARD_HELP'][value='0']").attr('checked','true');
				}else{
					$("input[name='IS_OPEN_CARD_HELP'][value='1']").attr('checked','true');
				}

			}
		}
    }
    
    function getCurrentVerDiv(verNameParam){
    	if(verNameParam==null || verNameParam == ""){
    		alert("版本名称为空");
    		return;
    	}
    	var index = -1;
    	for (var i = 0; i < verArray.length; i++) {
	   		 if(verNameParam == verArray[i].verName){
	   			 index = i;
	   			 return index;
	   		 }          
    	}
    	if(index == -1){
    		alert("找不到版本数据:" + verNameParam);
    	}
    }
    
    //验证版本数据
    function validateVerParam(verName,verJsonObj){

    }
    
    //初始化弹出的模态对话框，绑定触达类型改变事件：触达类型改变->获取触达方式列表->默认渲染第一个触达方式下的触达内容
    function init_chuDa_modalBox(){
    	// 触达类型初始化
    	$.ajax({
                type: "post",
                url: globalConfig.basePath + "/operation/init/byKey",
                data: "type=4",
                async: false,
                dataType: "json",
                success: function (data) {
                    if (data.code != '000') {
                        alert(data.message);
                        return;
                    }
                    var res = data.resp;
                    if (res != "" && res != null) {
                        var option = "";
                        for (var i = 0; i < res.length; i++) {
                            option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
                        }
                        $("#strategyType").html(option);
                        // 绑定触达类型改变事件：触达类型改变->获取触达方式列表->默认渲染第一个触达方式下的触达内容
                        strategyTypeChange();
                        // 绑定触达方式改变事件
                        strategyWayChange();
                        // 初始化第一个触达类型下的触达方式及其类容
                       $.ajax({
                            type: "post",
                            url: globalConfig.basePath + "/operation/init/byKey",
                            data: "type=5&code=" + $("#strategyType").val(),
                            async: false,
                            dataType: "json",
                            success: function (strategyTypeData) {
                            	createStrategyWaySelect(strategyTypeData);
                            }
                        })
                    }
                }
    	});
    }
    
    //初始化调用一次，默认渲染第一个触达方式
    init_chuDa_modalBox();
    
    //初始化绑定触达类型变化事件，同时根据第一个默认的触达类型创建触达方式
    function strategyTypeChange() {
        $(document).on('change',"#strategyType",function(){
            var value = $(this).val();
            createStrategyWay(value);
        })
    }
    
    //绑定触达方式改变事件：生成触达内容
    function strategyWayChange() {
        $(document).on('change',"#touchWay",function(){
            strategyWaySelect($("#touchWay option:selected").html());
        })
    }
    
    //根据选择的触达类型，渲染触达方式，然后再渲染默认的第一个触达方式下的触达内容
    function createStrategyWay(strategyTypeValue){
		var strHtml = $("#strategyType option:selected").html();
		//先删除之前的触达方式
        $("#strategyWay").nextAll().remove();
        $(".award").remove();
        
        //如果触达类型是"奖励"，则在触达方式之前添加奖励类型（积分或者卡券），默认是卡券，因此先渲染卡券id和是否启动卡券模型辅助
        if (strHtml == "奖励") {
            var award1 = "<li class='award'><label>奖励类型：</label><select id='awardType' name='awardType'>" +
                			"<option value='CARD'>卡券</option>" +
                			"<option value='JIFEN'>积分</option>" +
                			"<option value='COUPON'>新卡券</option>" +
                			"</select></li>";
            var award2 = "<li class='award'><label>卡券ID：</label><input placeholder='' type='number' style='margin-left: 15px' id='AWARD_CONTENT' name='AWARD_CONTENT'/><span  style='color:red'></span></li>";
            var award3 = "<li class='award'><label>是否启动卡券模型辅助：</label><input placeholder='' type='radio' id='YES_IS_OPEN_CARD_HELP' name='IS_OPEN_CARD_HELP' style='margin-left: 15px;height:13px' value='1'/>是<input placeholder='' type='radio' id='NO_IS_OPEN_CARD_HELP' name='IS_OPEN_CARD_HELP' style='margin-left: 15px ;height:13px' checked='checked' value='0'/>否</li>";
            //在触达方式之前添加li标签
            $("#strategyWay").before(award1, award2, award3);
        }
        
        //获取触达类型下的触达方式
        $.ajax({
            type: "post",
            url: globalConfig.basePath + "/operation/init/byKey",
            data: "type=5&code=" + strategyTypeValue,
            async: false,
            dataType: "json",
            success: function (strategyTypeData) {
            	//渲染触达方式下拉列表，然后默认渲染第一个触达方式下的触达内容
           	 	createStrategyWaySelect(strategyTypeData);
            }
        })
	}
    
    //渲染触达方式下拉列表，然后默认渲染第一个触达方式下的触达内容
    function createStrategyWaySelect(strategyTypeData){
    	var strategyWay="";
    	if (strategyTypeData.resp != "" && strategyTypeData.resp != null) {
            //strategyWay += "<label>触达方式：</label><select id='strategyWaySelect' name='touchWay'>";
            strategyWay += "<label>触达方式：</label><select id='touchWay' name='touchWay'>";
            for (var i = 0; i < strategyTypeData.resp.length; i++) {
                if (strategyTypeData.resp[i].key == "NO_CONFIG") {
                    $("#strategyWay").html("<label>触达方式：</label><span class='noneConfig'>无配置</span>");
                	//$("#strategyWay").after("<li id='strategyTime'></li><li id='strategyPage'></li><li id='strategyConfig'></li>")
                	$("#strategyWay").after("<li id='strategyTime'></li><li id='strategyConfig'></li>")
                    $("#strategyTime").html("<label>触达时间：</label><span class='noneConfig'>无配置</span>");
                    /*$("#strategyPage").html("<label>触达页面：</label><span class='noneConfig'>无配置</span>");*/
                    $("#strategyConfig").html("<label>触达配置：</label><span class='noneConfig'>无配置</span>");
                    return;
                }
                //展示所有
                strategyWay += "<option value='" + strategyTypeData.resp[i].key + "'>" + strategyTypeData.resp[i].value + "</option>";
            }
            strategyWay += "</select>";
            $("#strategyWay").html(strategyWay);
            //根据触达方式不同，渲染不同的配置
            strategyWaySelect($("#strategyWay option:selected").html());
        }
    }
    
    // 根据触达方式不同，渲染不同的配置
    function strategyWaySelect(strategyWayValue) {
        $("#strategyWay").nextAll().remove();
        var str = "";
        if (strategyWayValue == "软弹窗") {
            str += "<li><label>跳转类型：</label> <select id='skipType' name='skipType'></select></li>";
            str += "<li class='LI_SKIP_URL'><label>链接地址：</label><input placeholder='' type='text' style='margin-left: 15px' id='SKIP_URL' name='SKIP_URL' required='required'/></li>";
            str += "<li class='LI_PAGE_TYPE'><label>页面类型：</label><select id='PAGE_TYPE' name='PAGE_TYPE'></select></li>";
            str += "<li class='LI_PRIMORDIAL_PAGE'><label>跳转页面：</label><select id='PRIMORDIAL_PAGE' name='PRIMORDIAL_PAGE'></select></li>";
            str += "<li><label>弹窗内容：</label><textarea maxlength='20' rows='2' cols='10' placeholder='不超过20个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='POP_PAGE_CONTENT' name='POP_PAGE_CONTENT' required='required' ></textarea></li>";
            str += "<li><label>按钮文案：</label><input placeholder='不超过4个字' maxlength='4' type='text' style='margin-left: 15px' id='BTN_CONTENT' name='BTN_CONTENT' required='required'/></li>";
            str += "<li><label>触达时间：</label> <select id='strategyTime' name='strategyTime'></select></li>";
            //str += "<li><label>触达页面：</label> <select id='strategyPage' name='strategyPage'></select></li>";
        }
        if (strategyWayValue == "弹窗") {
            str += "<li><label>跳转类型：</label> <select id='skipType' name='skipType'></select></li>";
            str += "<li><img id='headPic' name='headPic' src='${staticRoot}/img/9f_logo.png' width='50px' height='50px' style='padding: 5px'>"
                + "<span  id='uploadPhoto' class='btn btn-info btn-rounded btn-gradient btn-gradienta'>上传图片</span>"
                + "<input id='upload' type='file' name='upload' style='display: none' accept='image/!*'><input id='fileUrl' type='hidden' name='fileUrl' required='required'></li>";
            str += "<li class='LI_SKIP_URL'><label>链接地址：</label><input placeholder='' type='text' style='margin-left: 15px' id='SKIP_URL' name='SKIP_URL' required='required'/></li>";
            str += "<li class='LI_PAGE_TYPE'><label>页面类型：</label><select id='PAGE_TYPE' name='PAGE_TYPE'></select></li>";
            str += "<li class='LI_PRIMORDIAL_PAGE'><label>跳转页面：</label><select id='PRIMORDIAL_PAGE' name='PRIMORDIAL_PAGE'></select></li>";
            str += "<li><label>弹窗内容：</label><textarea maxlength='20' rows='2' cols='10' placeholder='不超过20个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='POP_PAGE_CONTENT' name='POP_PAGE_CONTENT' required='required'></textarea></li>";
            str += "<li><label>按钮文案：</label><input placeholder='不超过4个字' maxlength='4' type='text' style='margin-left: 15px' id='BTN_CONTENT' name='BTN_CONTENT' required='required'/></li>";
            str += "<li><label>触达时间：</label> <select id='strategyTime' name='strategyTime'></select></li>";
            //str += "<li><label>触达页面：</label> <select id='strategyPage' name='strategyPage'></select></li>";
        }
        if (strategyWayValue == "短信") {
            str += "<li><label>短信内容：</label><br><textarea maxlength='100' rows='5' cols='10' placeholder='不超过100个字' style='margin-left: 15px;resize:none;height: 160px;width: 300px' id='MESSAGE_CONTENT' name='MESSAGE_CONTENT' required='required'></textarea></li>";
            str += "<li><label>触达时间：</label><select id='strategyTime' name='strategyTime'></select></li>";
           // str += "<li><label>时间配置：</label><input placeholder='5-1440' min='5' max='1440' type='number' style='margin-left: 15px; width:80px' name='muchTime'/>分钟内未达到预期结果</li>";
            //str += "<li><label>触达页面：</label><span class='noneConfig'>无配置</span></li>";
        }
        if (strategyWayValue == "站内信") {
         	str += "<li><label>站内信标题：</label><br><textarea maxlength='15' rows='2' cols='10' placeholder='不超过15个字' style='margin-left: 15px;resize:none;height: 50px;width: 300px' id='TOUCH_PUSH_TITLE' name='TOUCH_PUSH_TITLE' required='required'></textarea></li>";
            str += "<li><label>站内信内容：</label><br><textarea maxlength='100' rows='5' cols='10' placeholder='不超过100个字' style='margin-left: 15px;resize:none;height: 160px;width: 300px' id='TOUCH_PUSH_CONTENT' name='TOUCH_PUSH_CONTENT' required='required'></textarea></li>";
            str += "<li><label>触达时间：</label><select id='strategyTime' name='strategyTime'></select></li>";
           // str += "<li><label>时间配置：</label><input placeholder='5-1440' min='5' max='1440' type='number' style='margin-left: 15px; width:80px' name='muchTime'/>分钟内未达到预期结果</li>";
            //str += "<li><label>触达页面：</label><span class='noneConfig'>无配置</span></li>";
        }
        if (strategyWayValue == "推送") {
        	str += "<li><label>跳转类型：</label> <select id='skipType' name='skipType'></select></li>";
        	str += "<li class='LI_SKIP_URL'><label>链接地址：</label><input placeholder='' type='text' style='margin-left: 15px' id='SKIP_URL' name='SKIP_URL' required='required'/></li>";
            str += "<li class='LI_PAGE_TYPE'><label>页面类型：</label><select id='PAGE_TYPE' name='PAGE_TYPE'></select></li>";
            str += "<li class='LI_PRIMORDIAL_PAGE'><label>跳转页面：</label><select id='PRIMORDIAL_PAGE' name='PRIMORDIAL_PAGE'></select></li>";
            str += "<li><label>标题内容：</label><br><textarea maxlength='15' rows='2' cols='10' placeholder='不超过15个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='TOUCH_PUSH_TITLE' name='TOUCH_PUSH_TITLE' required='required'></textarea></li>";
            str += "<li><label>推送内容：</label><br><textarea maxlength='30' rows='2' cols='10' placeholder='不超过30个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='TOUCH_PUSH_CONTENT' name='TOUCH_PUSH_CONTENT' required='required'></textarea></li>";
            str += "<li><label>触达时间：</label><select id='strategyTime' name='strategyTime'></select></li>";
            //str += "<li><label>时间配置：</label><input placeholder='5-1440' min='5' max='1440' type='number' style='margin-left: 15px; width:80px' name='muchTime'/>分钟内未达到预期结果</li>";
            //str += "<li><label>触达页面：</label><span class='noneConfig'>无配置</span></li>";
        }
//         if(strategyWayValue == "专属banner"){
       	if(strategyWayValue.search("专属banner") != -1){
        	str += "<li><label>banner内容：</label><br><textarea maxlength='20' rows='2' cols='10' placeholder='不超过20个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='BANNER_CONTENT' name='BANNER_CONTENT' required='required'></textarea></li>";
            str += "<li><label>按钮文案：</label><input placeholder='不超过4个字' maxlength='4' type='text' style='margin-left: 15px' id='BANNER_BTN_CONTENT' name='BANNER_BTN_CONTENT' required='required'/></li>";
            str += "<li><label>跳转类型：</label><select id='BANNER_BTN_URL_TYPE' name='BANNER_BTN_URL_TYPE'></select></li>";
            /*str += "<li><label>链接地址：</label><input placeholder='' type='text' style='margin-left: 15px' id='BANNER_BTN_URL' name='BANNER_BTN_URL' required='required'/></li>";*/
            str += "<li class='LI_SKIP_URL'><label>链接地址：</label><input placeholder='' type='text' style='margin-left: 15px' id='BANNER_BTN_URL' name='BANNER_BTN_URL' required='required'/></li>";
            str += "<li class='LI_PAGE_TYPE'><label>页面类型：</label><select id='PAGE_TYPE' name='PAGE_TYPE'></select></li>";
            str += "<li class='LI_PRIMORDIAL_PAGE'><label>跳转页面：</label><select id='PRIMORDIAL_PAGE' name='PRIMORDIAL_PAGE'></select></li>";
            str += "<li><label>触达时间：</label><select id='strategyTime' name='strategyTime'></select></li>";
            //str += "<li><label>触达页面：</label><select id='strategyPage' name='strategyPage'></select></li>";
        }
        //var str1 = "<li id='restrictConfig'><label>限制配置：1个自然日内最多触发</label><input placeholder='1-10' min='1' max='10' type='number' style='margin-left: 15px; width:80px' id='touchCount' name='touchCount'/>次 <input type='hidden' id='touchCountType' name='touchCountType' value='DAY'></li>";
        //str += str1;
       	//在线客户 或 电话客户 触达方式只能选择专属banner或软弹窗
        if($("#strategyType").val()=="CUSTOMER_SERVICE"||$("#strategyType").val()=="PHONE"){
        	str="";
        	if(strategyWayValue.search("专属banner") != -1){
                str += "<li><label>触达时间：</label></label> <select id='strategyTime' name='strategyTime'></select></li>";
                //str += "<li><label>触达页面：</label><select id='strategyPage' name='strategyPage'></select></li>";
                str += "<li id='restrictConfig'><label>限制配置：</label><span class='noneConfig'>无配置</span></li>";
        	}
        	if(strategyWayValue == "软弹窗"){
        		str += "<li><label>触达时间：</label></label> <select id='strategyTime' name='strategyTime'></select></li>";
                //str += "<li><label>触达页面：</label><select id='strategyPage' name='strategyPage'></select></li>";
                str += "<li id='restrictConfig'><label>限制配置：</label><span class='noneConfig'>无配置</span></li>";
        	}
        }
        //奖励 只能选择专属banner或软弹窗
       if($("#strategyType").val()=="AWARD"){
        	if(strategyWayValue.search("专属banner") != -1){
        		str="";
        		str += "<li><label>banner内容：</label><br><textarea maxlength='20' rows='2' cols='10' placeholder='不超过20个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='BANNER_CONTENT' name='BANNER_CONTENT' required='required'></textarea></li>";
                str += "<li><label>触达时间：</label></label> <select id='strategyTime' name='strategyTime'></select></li>";
                //str += "<li><label>触达页面：</label><select id='strategyPage' name='strategyPage'></select></li>";
                //str+="<li id='restrictConfig'><label>限制配置：1个自然日内最多触发</label><input placeholder='1-10' min='1' max='10' type='number' style='margin-left: 15px; width:80px' id='touchCount' name='touchCount'/>次 <input type='hidden' id='touchCountType' name='touchCountType' value='DAY'></li>";
        	}
        	if(strategyWayValue == "软弹窗"){
        		str="";
        		str += "<li><label>弹窗内容：</label><textarea maxlength='20' rows='2' cols='10' placeholder='不超过20个字' style='margin-left: 15px;resize:none;height: 50px;width: 150px' id='POP_PAGE_CONTENT' name='POP_PAGE_CONTENT' required='required' ></textarea></li>";
        		str += "<li><label>触达时间：</label></label> <select id='strategyTime' name='strategyTime'></select></li>";
                //str += "<li><label>触达页面：</label><select id='strategyPage' name='strategyPage'></select></li>";
                //str+="<li id='restrictConfig'><label>限制配置：1个自然日内最多触发</label><input placeholder='1-10' min='1' max='10' type='number' style='margin-left: 15px; width:80px' id='touchCount' name='touchCount'/>次 <input type='hidden' id='touchCountType' name='touchCountType' value='DAY'></li>";
        	}
        	
       }
       
       $("#strategyWay").after(str);
        
        //初始化相关下拉菜单及事件
        getStrategyWaySelect();
    }
    
    //奖励类型改变事件：卡券或积分进行不同的渲染
    $(document).on('change',"#awardType",function(){
		if($("#awardType").val()=="CARD"){//卡券
			var award2 = "<li class='award'><label>卡券ID：</label><input placeholder='' type='number' style='margin-left: 15px' id='AWARD_CONTENT' name='AWARD_CONTENT'/><span style='color:red'></span></li>";
            var award3 = "<li class='award'><label>是否启动卡券模型辅助：</label><input value='1' type='radio' id='YES_IS_OPEN_CARD_HELP' name='IS_OPEN_CARD_HELP' style='margin-left:15px;height:13px'/>是<input value='0' type='radio' id='NO_IS_OPEN_CARD_HELP' name='IS_OPEN_CARD_HELP' style='margin-left:15px ;height:13px'  checked='checked'/>否</li>";
			
            $(".award:not(':eq(0)')").remove();
			$(".award:eq(0)").after(award2,award3);
		}
		if($("#awardType").val()=="JIFEN"){//积分
			var award2 = "<li class='award'><label>积分：</label><input placeholder='1-99999' type='number' style='margin-left: 15px' id='AWARD_CONTENT' name='AWARD_CONTENT' required='required'/></li>";
			
			$(".award:not(':eq(0)')").remove();
			$(".award:eq(0)").after(award2);
		}
	})
	
	//跳转类型改变事件
	function bindSkipTypeChange(){
    	var skipType = $('#skipType').val();
    	var skipType2 = $('#BANNER_BTN_URL_TYPE').val();
        if( skipType == "URL" || skipType2 == "URL"){
        	$('.LI_SKIP_URL').show();
        	$("#SKIP_URL").removeAttr("readonly");
        	$('#SKIP_URL').attr("disabled",false);
        	$("#BANNER_BTN_URL").removeAttr("readonly");
        	$('#BANNER_BTN_URL').attr("disabled",false);
        	$('.LI_PAGE_TYPE').hide();
        	$('#PAGE_TYPE').attr("disabled",true);
        	$('.LI_PRIMORDIAL_PAGE').hide();
        	$('#PRIMORDIAL_PAGE').attr("disabled",true);
        }
    	if( skipType == "PRIMORDIAL" || skipType2 == "PRIMORDIAL" ){
    		$('.LI_SKIP_URL').hide();
    		$("#SKIP_URL").attr("readonly", "readonly");
    		$('#SKIP_URL').attr("disabled",true);
    		$("#BANNER_BTN_URL").attr("readonly", "readonly");
    		$('#BANNER_BTN_URL').attr("disabled",true);
        	$('.LI_PAGE_TYPE').show();
        	$('#PAGE_TYPE').attr("disabled",false);
        	$('.LI_PRIMORDIAL_PAGE').show();
        	$('#PRIMORDIAL_PAGE').attr("disabled",false);
        	
        	//根据渠道初始化页面类型
        	var condition = "";
    		if(channelCode == 'WK'){
    			condition = "type=17";
    		}
    		if(channelCode == 'QB'){
    			condition = "type=18";
    		}
    		$.ajax({
                type: "post",
                url: globalConfig.basePath + "/operation/init/byKey",
                data: condition,
                async: false,
                dataType: "json",
                success: function (data) {
	               	if (data.code != '000') {
	                        alert(data.message);
	                        return;
	                }
	                var res = data.resp;
	                if (res != "" && res != null) {
	                	var option = "";
	                    for (var i = 0; i < res.length; i++) {
	                    	option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
	                    }
	                    $("#PAGE_TYPE").html(option);
	                    $(document).on("change","#PAGE_TYPE",function(){
	                    	bindPageTypeChange();
	                    });
	                    bindPageTypeChange();
	                }
                }
    		});
        }
    }
    
    //根据页面类型绑定原生跳转地址
    function bindPageTypeChange(){
    	var PAGE_TYPE = $('#PAGE_TYPE').val();
    	$.post(globalConfig.basePath + "/operation/init/byKey","type=19&code="+PAGE_TYPE,function(data){
        	var str="";
        	if(data.resp){
        		for (var i = 0; i < data.resp.length; i++) {
            		str+="<option value='"+data.resp[i].key+"'>"+data.resp[i].value+"</option>"
    			}
        	}
        	$("#PRIMORDIAL_PAGE").html(str)
        },"json")
    }
    
	//初始化相关下拉菜单及事件
     function getStrategyWaySelect() {
        //跳转类型
        if ($("#skipType") || $("#BANNER_BTN_URL_TYPE") ) {
        	 $.ajax({
                 type: "post",
                 url: globalConfig.basePath + "/operation/init/byKey",
                 data: "type=6" ,
                 async: false,
                 dataType: "json",
                 success: function (data) {
                	 if (data.code != '000') {
                         alert(data.message);
                         return;
                     }
                     var res = data.resp;
                     if (res != "" && res != null) {
                         var option = "";
                         for (var i = 0; i < res.length; i++) {
                             option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
                         }
                         $("#skipType").html(option);
                         $("#BANNER_BTN_URL_TYPE").html(option);
                         $(document).on("change","#skipType",function(){
                         	bindSkipTypeChange();
                         });
                         $(document).on("change","#BANNER_BTN_URL_TYPE",function(){
                        	 bindSkipTypeChange();
                         });
                         bindSkipTypeChange();
                     }
                 }
           })
        }
        //  触达时间
        if ($("#strategyTime")) {
        	 $.ajax({
                 type: "post",
                 url: globalConfig.basePath + "/operation/init/byKey",
                 data: "type=7" ,
                 async: false,
                 dataType: "json",
                 success: function (data) {
                	 if (data.code != '000') {
                         alert(data.message);
                         return;
                     }
                     var res = data.resp;
                     if (res != "" && res != null) {
                         var option = "";
                         //触达方式短信，推送，站内信  有智能触达
                         var strategyWaySelectVal=$("#touchWay").val();
                         
                         for (var i = 0; i < res.length; i++) {
                        	 if(strategyWaySelectVal!="MESSAGE"&&strategyWaySelectVal!="PUSH"&&strategyWaySelectVal!="PUSH_MAIL"){
                                 if(res[i].key=="SMARTTOUCH"){
                                     continue ;
                                 }
                             }
                             option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
                         }
                         $("#strategyTime").html(option);
                         /*$(document).on("change","#strategyTime",function(){
                        	 $("[name=muchTime]").parent().remove();
                        	 alert($("#strategyTime").val());
                        	 if($("#strategyTime").val()=="SMARTTOUCH"){
                        		 $("#strategyTime").parent().after("<li><label>时间配置：</label><input placeholder='5-1440' min='5' max='1440' type='number' style='margin-left: 15px; width:80px' id='muchTime' name='muchTime'/>分钟内未达到预期结果</li>");
                        	 }
                         })*/
                     }
                 }
           })
        }
        
        
        
        //触达页面
        /*if ($("#strategyPage")) {
        	 $.ajax({
                 type: "post",
                 url: globalConfig.basePath + "/operation/init/byKey",
                 data: "type=8" ,
                 async: false,
                 dataType: "json",
                 success: function (data) {
                	 if (data.code != '000') {
                         alert(data.message);
                         return;
                     }
                     var res = data.resp;
                     if (res != "" && res != null) {
                         var option = "";
                         for (var i = 0; i < res.length; i++) {
                             option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
                         }
                         $("#strategyPage").html(option);
                     }
                 }
           })
        }*/
        //上传照片
        if ($("#uploadPhoto")) {
            $("#uploadPhoto").click(function () {
            	var isReturn = false;
            	for(var i=0; i<veriableConfigArray.length; i++){
            		if(veriableConfigArray[i] == 'fileUrl') {
            			alert('图片地址不可变');
            			isReturn = true;
            		}
            	}
            	if(isReturn == true){
            		return;
            	}
            	
                $("#upload").click();
                $("#upload").on("change", function () {
                    var objUrl = getObjectURL(this.files[0]);
                    //alert("本地地址" + objUrl);
                    if (objUrl) {
                        $("#headPic").attr("src", objUrl);
                    }
                    var file = $("#upload")[0].files[0];
                    var formData = new FormData();
                    formData.append("file", file);
                    //alert('开始上传');
                    $.ajax({
                        type: "post",
                        //url: "${ctx}/appconfig/file/uploadPic",
                        url: globalConfig.basePath + "/appconfig/file/uploadPic",
                        async: false,
                        cache: false,
                        data: formData,
                        contentType: false,//由于提交的对象是FormData,所以要在这里更改上传参数的类型
                        processData: false,//提交对象是FormData,不需要对数据做任何处理
                        success: function (data) {
                            if (data.code != "000") {
                                alert("上传失败");
                                return;
                            }
                            //alert(data.resp);
                            $("#fileUrl").val(data.resp);
                            alert("上传成功");
                        }
                    });
                })
            });
        }
    } 
    
    //智能触达-》触达时间
    $(document).on("change","#strategyTime",function(){
   	 $("[name=muchTime]").parent().remove();
   	 //alert($("#strategyTime").val());
   	 if($("#strategyTime").val()=="SMARTTOUCH"){
   		 $("#strategyTime").parent().after("<li><label>时间配置：</label><input placeholder='5-1440' min='5' max='1440' type='number' style='margin-left: 15px; width:80px' id='muchTime' name='muchTime'/>分钟内未达到预期结果</li>");
   	 }
    })
    
    //获取图片url
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) {
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) {
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    
    //审核人生成
    $.ajax({
          type: "post",
          url: globalConfig.basePath + "/operation/init/byKey",
          data:  "type=10",
          async: false,
          dataType: "json",
          success: function (data) {
        	  if (data.code != '000') {
                  alert(data.message);
                  return;
              }
              var res = data.resp;
              var option = "";
              if (res != "" && res != null) {
                  for (var i = 0; i < res.length; i++) {
                      option += "<option value='" + res[i].key + "'>" + res[i].value + "</option>";
                  }
                  $("#approverId").html(option);
              }
          }
    })
    // 3.2 =================================================================================================
    
    var veriableConfigArray = new Array();
    
    function isVeriable(key){
    	var result = false;
    	if(veriableConfigArray!=null && veriableConfigArray.length>0){
			for(var i=0; i<veriableConfigArray.length; i++){
				if(veriableConfigArray[i] == key){
					result = true;
					break;
				}
			}
    	}
    	return result;
    }
    
    var variableMap = new Map();
    
    variableMap.set('awardType','奖励类型');
    variableMap.set('AWARD_CONTENT','卡券ID或积分');
    variableMap.set('IS_OPEN_CARD_HELP','是否启动卡券模型辅助');
    variableMap.set('fileUrl','上传图片地址'); 
    variableMap.set('muchTime','时间配置：多少分钟内未达到预期结果');	//智能触达才有
        
    variableMap.set('skipType','跳转类型');
    variableMap.set('SKIP_URL','链接地址');
    variableMap.set('PAGE_TYPE','页面类型');
    variableMap.set('PRIMORDIAL_PAGE','跳转页面');
    variableMap.set('POP_PAGE_CONTENT','弹窗内容');
    variableMap.set('BTN_CONTENT','弹窗按钮文案');
    variableMap.set('strategyTime','触达时间');
    //variableMap.set('strategyPage','触达页面');
    variableMap.set('MESSAGE_CONTENT','短信内容');
    /*variableMap.set('TOUCH_PUSH_TITLE','站内信标题');
    variableMap.set('TOUCH_PUSH_CONTENT','站内信内容');
    variableMap.set('TOUCH_PUSH_TITLE','推送标题内容');
    variableMap.set('TOUCH_PUSH_CONTENT','推送内容');
    variableMap.set('TOUCH_PUSH_TITLE','推送标题内容');
    variableMap.set('TOUCH_PUSH_CONTENT','推送内容');*/
    variableMap.set('TOUCH_PUSH_TITLE','标题');
    variableMap.set('TOUCH_PUSH_CONTENT','内容');
    variableMap.set('BANNER_CONTENT','banner内容');
    variableMap.set('BANNER_BTN_CONTENT','banner按钮文案');
    variableMap.set('BANNER_BTN_URL_TYPE','banner跳转类型');
    variableMap.set('BANNER_BTN_URL','banner链接地址');
    variableMap.set('touchTimeCount','限制配置：xxx个自然日内最多触发多少次');
    variableMap.set('touchCount','限制配置：n个自然日内最多触发xxx次');
    
    var variable_modalBox = {};
    variable_modalBox.modal = document.getElementById("variableModal");
    variable_modalBox.openVarConfig = document.getElementById("openVarConfig");
    variable_modalBox.closeVarBtn = document.getElementById("closeVarBtn");
    variable_modalBox.saveVarBtn = document.getElementById("saveVarBtn");
    
    variable_modalBox.show = function() {
    	console.log(this.modal);
    	this.modal.style.display = "block";
    }
    
    variable_modalBox.close = function() {
    	this.modal.style.display = "none";
    }
    
    variable_modalBox.init = function() {
    	var that = this;
    	this.openVarConfig.onclick = function() {
    		if(openVeriableConfig()){
            	that.show();
    		}
    	}
    	this.closeVarBtn.onclick = function() {
    		that.close();
    	}
    	
    	//保存变量
    	this.saveVarBtn.onclick = function() {
    		
    		if(verArray!=null && verArray.length>1){
    			if (confirm("修改确定此配置吗?修改后，所有版本配置将失效")) {
    				;
    			}else{
    				return;
    			}
    		}
   
    		clearVerData();
    		var isSetCdfs = $("input[name=IS_SET_CDFS]:checked").val();
    		//否
    		var showVariableConfig="";
       		if(isSetCdfs == '0'){
       			var variableArray = getVariable();
           		if(variableArray != null && variableArray.length > 0){
       	    		var index = 0;
       	    		for(var i=0; i<variableArray.length; i++){
       	    			//将不可变的变量添加到veriableConfigArray数组中
        	   			if(!$("#c_" + variableArray[i]).prop('checked')){
        	   				veriableConfigArray[index++] = variableArray[i];
            			}
        	   			//将可变的变量显示出来
        	   			else{
        	   				showVariableConfig = showVariableConfig + variableMap.get(variableArray[i]) + "; ";
            			}
       	    		}
       	    		//alert(JSON.stringify(veriableConfigArray));
           		}
       		}
       		$("#showVariableConfig").html(showVariableConfig);
    		that.close();
    	};
    }
    variable_modalBox.init();
    
    function clearVerData(){
    	for(var i=0; i<verArray.length; i++){
			$("#" + verArray[i].verName).remove();
		}
    	var basic_verArray = verArray[0];
    	var basic_verDivArray = verDivArray[0];
    	
		rowArray = new Array();
		
		verDivArray = new Array();
		verArray = new Array();
		
		verDivArray[0] = basic_verDivArray;
        verArray[0] = basic_verArray;
        
        veriableConfigArray = new Array();
    }
    
    function openVeriableConfig(){
    	if(verArray.length==0 || verArray[0].verName == null || verArray[0].verName == "" ){
    		alert("必须先配置原始版本后，才能设置变量");
    		return false;
    	}
    	return true;
    };
    
	$(document).on('change',"input[name=IS_SET_CDFS]",function(){
    	    var $this=$(this);
    	    if($this.val()==0){
    	    	var variableArray = getVariable();
    	    	createVariableCheckBox(variableArray);
    	   	}else{
    	   		$("#variableDiv").html("");
    	   	}
    });
	
	//打开变量对话框时执行，获取当前的所有可用变量
    function getVariable(){
    	var variableArray = new Array();
    	document.getElementById('chuDaConfigModal').innerHTML = verDivArray[0].divHtml;
    	closeChuDaBtn.onclick = function() {
			chuDa_modalBox.close();
		};
		closeChuDaBtn2.onclick = function() {
			chuDa_modalBox.close();
		};
		saveChuDaBtn.onclick = function() {
			var success = saveVer();
			if(success){
				chuDa_modalBox.close();
		   	}
		};
	    var formData = $('#verForm').serializeArray();
	    var i=0;
		$.each(formData, function() {
			if(this.name!='verName' && this.name!='verDesc' && this.name!='strategyType' && this.name!='touchWay'){
				variableArray[i++] = this.name;
		    }
		});
		//alert(JSON.stringify(variableArray));
		return variableArray;
		
    };
    
    function createVariableCheckBox(variableArray){
    	if(variableArray!=null && variableArray.length>0){
    		var str="";
    		for (var i = 0; i < variableArray.length; i++) {
    			//if(variableArray[i] != 'fileUrl' && variableArray[i] != 'upload'){
    			str += "<p><input style='vertical-align:middle;' type='checkbox' id='c_" + variableArray[i] + "' name='c_" + variableArray[i] + "'/> &nbsp;&nbsp; " + "<sapn style='vertical-align:middle;'>" + variableMap.get(variableArray[i]) + "</sapn></p>";
    			//}
    		}
    		$("#variableDiv").html(str);
    	}
    }
    
    // 3.3 =================================================================================================

    var rowArray = new Array();
	
    function addVerRow(verJsonObj){
    	var cdVersion = new Object();
		cdVersion.verName = verJsonObj.verName;
		cdVersion.desc = verJsonObj.verDesc;
		rowArray[rowArray.length] = cdVersion;
		addNewRowForVersion(cdVersion);
    }

    function addNewRowForVersion(cdVersion) {
        var rowLength = $("#versionTable tr").length;
        var insertStr = "<tr id=" + cdVersion.verName + " style='background:white;'>"
                     /* + "<td>" + rowId + "</td>"*/
                      + "<td>" + cdVersion.verName + "</td>"
                      + "<td>" + cdVersion.desc + "</td>"
                      + "<td>"
    				  + 	"<input type='button' value='修改' style='width:50px' onclick='updateSelectedVersionRow(\"" + cdVersion.verName + "\");' />&nbsp;&nbsp;&nbsp;&nbsp;"
    				  + 	"<input type='button' value='删除' style='width:60px' onclick='deleteSelectedVersionRow(\"" + cdVersion.verName + "\");' />"
    				  + "</td>"
                      +"</tr>";
        $("#versionTable tr:eq(" + (rowLength - 1) + ")").after(insertStr); 
     }
    
    deleteSelectedVersionRow = function (verName) {
        if (confirm("确定删除吗？")) {      	
        	rowArray = $.grep( rowArray, function(cdVersion){
        		return cdVersion.verName != verName;
        	});
            verArray = $.grep( verArray, function(verJsonObj){
        		return verJsonObj.verName != verName;
        	});
            verDivArray = $.grep( verDivArray, function(verDivObj){
        		return verDivObj.verName != verName;
        	});
            $("#" + verName).remove();
        }
    }
    
    updateSelectedVersionRow = function (verName) {
    	chuDa_modalBox.updateVer(verName);
    }
    
    function validate3(){
    	if(verArray==null || verArray.length==0){
    		alert("必须配置原始版本");
    		return false;
    	}
    	if(verArray.length==1){
    		alert("必须至少添加一个版本");
    		return false;
    	}
    	return true;
    }
    
    // 4 =================================================================================================
    
    
    $('#saveTestBtn').click(function() {
    	var testName = $('#testName').val();
    	var approverId = $('#approverId').val();
    	
    	if(testName==null || testName==""){
    		alert("实验名称不能为空");
    		return;
    	}
    	
    	if(testName.length > 15){
    		alert("实验名称最多15个字符");
    		return;
    	}
    	
    	if(approverId==null || approverId==""){
    		alert("审核人不能为空");
    		return;
    	}
    	
    	$.ajax({
            type: "POST",
            url: globalConfig.basePath + "/abTest/save",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(GetJsonData()),
            dataType: "json",
            success: function (data) {
            	if(data.code == '000'){
            		window.location.href = globalConfig.basePath + "/abtestList";
            	}
            	else{
            		alert(data.message)
            		return;
            	}
            },
            error: function (message) {
                alert("提交错误");
                return;
            }
        });

	})
	
	function GetJsonData() {
	    var json = {
	        "channel": channelCode,								//渠道
	        "serviceTypeCode": serviceCode,						//服务
	        "userActionCode": userActionCode,					//用户行为
	        "strategyResult": $('#expResultStatus').val(),		//预期结果状态 
	        "strategyCycle": $('#strategyCycle').val(),			//执行触达后xxx自然日内有效
	        "userTagType": $('#userStrategy').val(),			//名单类型
	        "userTag": $("#userNames").val(),					//用户名单
	        "touchTimeCount": $('#touchTimeCount').val(),		//限制配置：n个自然日内
	        "touchCount": $('#touchCount').val(),				//限制配置：最多触发n次
	        "touchCountType": "NATUREDAY",						//限制配置：1个自然日内最多触发
	        "IS_EFFECT": isEffect,								//是否配触发策略
	        //"SUM_FAIL_COUNT": $('#SUM_FAIL_COUNT').val(),		//累计失败次数 
	        "SUM_MIN_FAIL_COUNT": $('#SUM_MIN_FAIL_COUNT').val(),		//累计失败次数 
	        "SUM_MAX_FAIL_COUNT": $('#SUM_MAX_FAIL_COUNT').val(),		//累计失败次数 
	        "SUM_MIN_AMOUNT": $('#SUM_MIN_AMOUNT').val(),		//累计最小金额 
	        "SUM_MAX_AMOUNT": $('#SUM_MAX_AMOUNT').val(),		//累计最大金额 
	        "THIS_MIN_AMOUNT": $('#THIS_MIN_AMOUNT').val(),		//当此最小金额 
	        "THIS_MAX_AMOUNT": $('#THIS_MAX_AMOUNT').val(),		//当此最大金额 
	        "SUM_TIME_COUNT": 1,								//累计计算有效期 
	        "SUM_TIME_COUNT_TYPE": "NATUREDAY",					//累计计算有效期单位（NATUREDAY自然日 DAY 天 WEEK周 MONTH 月 YEAR年））
	        "testName": $('#testName').val(),					//实验名称
	        "approverId": $('#approverId').val(),				//审核人ID
	        "strategyTab": "TRST_STRATEGY",						//实验策略
	        "touchCode": $('#triggerNode').val(),				//触发节点code
	        "touchType":verArray[0].strategyType,				//触达类型
	        "verArray": verArray								
	    };
	    return json;
    }
	
	$('.scene-deploy-2,.compile-deploy-3,.finish-deploy-4,.fuzzy-search,.filter-fuzzy').hide();

	$('.next-btn0').click(function() {
		
		var result = validate1();
		if(!result){
			return;
		}
		
		$('.basis-deploy-1').hide()
		$('.scene-deploy-2').show()
		$('.s-step1>b>b,.s-step1>p,.s-step1>em').addClass('active')
	})
	$('.next-btn1').click(function() {
		
		var result = validate2();
		if(!result){
			return;
		}
		
		$('.scene-deploy-2').hide()
		$('.compile-deploy-3').show()
		$('.s-step2>b>b,.s-step2>p,.s-step2>em').addClass('active')
	})
	$('.next-btn2').click(function() {
		
		var result = validate3();
		if(!result){
			return;
		}
		
		$("#showChannel2").html($("#channel").find("option:selected").text());
		$("#showService2").html($("#service").find("option:selected").text());
		$("#showUserAction2").html($("#user").find("option:selected").text());
		$("#showExpResultStatus2").html($("#expResultStatus").find("option:selected").text());
		$("#showUserNames2").html($("#userNames").text());
		$("#showVerCount2").html(verArray.length);
		
		$('.compile-deploy-3').hide()
		$('.finish-deploy-4').show()
		$('.s-step3>b>b,.s-step3>p,.s-step3>em').addClass('active')
	})
	$('#userStrategy').change(function() {
		index = $(this).children('option:selected').index()
		if (index !== 0) {
			$('.fuzzy-search').show()
		}
	})
	$('.back-btn1').click(function() {
		$('.basis-deploy-1').show()
		$('.scene-deploy-2').hide()
		$('.s-step1>b>b,.s-step1>p,.s-step1>em').removeClass('active')
	})
	$('.back-btn2').click(function() {
		$('.scene-deploy-2').show()
		$('.compile-deploy-3').hide()
		$('.s-step2>b>b,.s-step2>p,.s-step2>em').removeClass('active')
	})
	$('.back-btn3').click(function() {
		$('.compile-deploy-3').show()
		$('.finish-deploy-4').hide()
		$('.s-step3>b>b,.s-step3>p,.s-step3>em').removeClass('active')
	})
	// 模糊搜索
    $('.search_box').focus(function() {
        $('.search_content').show()
      })
      $('.search_content').on('mousemove','.search-item',function(){
          $(this).addClass("active")
          $(this).siblings().removeClass("active")
      })
      $('.search_box').blur(function(){
    	//alert(222222)
        setTimeout(function(){
          $('.search_content').hide()
        },1000)
      })
      $('.search_content').on('click','.search-item',function(){
          $('.search_box').val($(this).text()) ;
          $('.search_content').hide();
      })
      var search_input = $(".search_box"),
          search_content = $(".search_content");
	
      $(search_input).on("keyup", function() {
        if (search_input.val() == '') {
          $(".search_content .search-item").show()
          return
        }
        $(".search_content .search-item:contains(" + search_input.val().trim() + ")").show()
        $(".search_content .search-item:not(:contains(" + search_input.val().trim() + "))").hide()
      });
  	
  	 //$(".next-btn").trigger("click");
  	 //$(".next-btn1").trigger("click");
  	 
  	 
  	 if(globalConfig.cloneTestStartegyId != null && globalConfig.cloneTestStartegyId != '-1'){
  		 //alert("cloneTestStartegyId=" + globalConfig.cloneTestStartegyId);
  		 //查询策略详情
  		 var detailData;
  		 $.ajax({
	            type: "post",
	            url: globalConfig.basePath + "/abTest/detail",
	            data: "testStrategyId="+globalConfig.cloneTestStartegyId,
	            async: false,
	            dataType: "json",
	            success: function (data) {
	                if (data.code != '000') {
	                	alert(data.message);
	                    return;
	                }else{
	                	detailData = data.resp;
	                }
	            }
	  	});
  		 
  		if(detailData==null){
  			alert("查询实验详情错误");
  			return;
  		}
	  	
  		var channelCodeKey = detailData.testStrategyDto.channelCodeKey;
  		var serviceTypeCodeKey = detailData.testStrategyDto.serviceTypeCodeKey;
  		var userCodeKey = detailData.testStrategyDto.userCodeKey;
  		var strategyResultKey = detailData.testStrategyDto.strategyResultKey;	//预期状态
  		var strategyCycle = detailData.testStrategyDto.strategyCycle;	//执行触达后 xxx 自然日内有效
  		var userTagTypeKey = detailData.testStrategyDto.userTagTypeKey;	//名单类型
  		var userTag = detailData.testStrategyDto.userTag;	//名单id
  		var touchCount = detailData.testStrategyDto.touchCount;	//限制配置：1个自然日内最多触发 
  		var touchTimeCount = detailData.testStrategyDto.touchTimeCount;	//限制配置：1个自然日内最多触发 
  		var touchCodeKey = detailData.testStrategyDto.touchCodeKey;	//触发节点
  		var isEffectValue = null; //是否配触发策略
  			
  		var touchStrategyList = detailData.testStrategyDto.touchStrategyList;
  		for(var i=0; i<touchStrategyList.length; i++){
  			for(var i=0; i<touchStrategyList.length; i++){
  	  			 if(touchStrategyList[i].attrKey == 'IS_EFFECT'){
  	  				isEffectValue = touchStrategyList[i].attrValue;
  	  			 }
  	  		 }
  		}
	  	
	 	//渲染渠道
	 	$('#channel').val(channelCodeKey); 
	    $("#channel").trigger("change");

	    //渲染服务、用户行为、触发节点、是否配触发策略
	    setTimeout(function(){ 
	    	//xrService('QB_NEW_USER','QB_USER_OPEN_ACCOUNT','QB_USER_OPEN_ACCOUNT_FAIL',0,touchStrategyList);
	    	xrService(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList);
	    }, 1000);
	    
	    //同步渲染名单类型和名单ID
	    setTimeout(function(){ 
	    	xrUserTagType(userTagTypeKey,userTag)
	    }, 1000);
	    
	    //同步渲染以下内容
	    $('#expResultStatus').val(strategyResultKey);
	    $('#strategyCycle').val(strategyCycle);
	    $('#touchCount').val(touchCount);
	    $('#touchTimeCount').val(touchTimeCount);
    	
  	 }
  	 
  	 function xrService(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList){
  		$('#service').val(serviceTypeCodeKey);
    	$("#service").trigger("change");
    	setTimeout(function(){ 
    		xrUser(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList)
    	}, 1000);
  	 }
  	 
  	 function xrUser(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList){
  		$('#user').val(userCodeKey);
    	$("#user").trigger("change");
    	setTimeout(function(){ 
    		xrTouchCode(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList)
    	}, 1000);
  	 }
  	 
  	 function xrTouchCode(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList){
  		$('#triggerNode').val(touchCodeKey);
    	$("#triggerNode").trigger("change");
    	
    	setTimeout(function(){ 
    		xrIsEffect(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList);
    	}, 1000);
  	 }
  	
  	 function xrIsEffect(serviceTypeCodeKey,userCodeKey,touchCodeKey,isEffectValue,touchStrategyList){
  		if(isEffectValue==1){
  			$("#yesInputConfig").prop("checked",true);
  			isEffect = "1";
  		}
  		else{
  			$("#noConfig").prop("checked",true);
  			isEffect = "0";
  			$("#triggerStrategyContext").html("");
  		}
  		
  		if(touchStrategyList!=null && touchStrategyList.length>0){
	  		setTimeout(function(){ 
	  			xrTriggerStrategy(touchStrategyList);
	    	}, 1000);
  		}
  	 }
  	 
  	 function xrTriggerStrategy(touchStrategyList){
  		 for(var i=0; i<touchStrategyList.length; i++){
  			 if(touchStrategyList[i].attrKey != 'IS_EFFECT'){  				 
  				$('#'+touchStrategyList[i].attrKey).val(touchStrategyList[i].attrValue);
  			 }
  		 }
  	 }
  	
  	 function xrUserTagType(userTagTypeValue,userNames){
  		 $('#userStrategy').val(userTagTypeValue);
  		 if(userTagTypeValue != 'NO_RULE' && userTagTypeValue != '0'){
  			 //$("#userStrategy").trigger("change");
  			 $('#userNames').val(userNames);
  		 }
  	 }
})

