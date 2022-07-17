'use strict';
var app = angular.module('myApp', [], angular.noop);
app.controller("rootController", ['$scope', '$http', function ($scope, $http) {

    $scope.searchCondition = {pageSize: 10};
    $scope.operationType = 0;

    // 分页参数
    $scope.page = window.defaultPageParam ? window.defaultPageParam : {};
    $scope.page.fetchPageContent = submitSearch;

    // TODO 分页条件查询
    function submitSearch() {
        $scope.pageQueryBlackWhite($scope.page.currPage);
    }

    $scope.pageQueryBlackWhite = function (currentPage) {
        $scope.searchCondition.currentPage = currentPage;
        $scope.searchCondition.pageSize = $scope.page.perPageRowSize;
        var url = globalConfig.basePath + "/appconfig/WhiteBlankList/query";
        $http.post(url, $scope.searchCondition).then(function successCallback(callback) {

            if (callback.data.code == '000') {
                $scope.blackWhiteList = callback.data.resp.list;

                $scope.page.currPage = callback.data.resp.pageNum;
                $scope.page.lastPage = callback.data.resp.pages;
                $scope.page.totalRowSize = callback.data.resp.total;
                $scope.page.perPageRowSize = callback.data.resp.pageSize + '';
                $scope.page.startRow = callback.data.resp.startRow + '';
                $scope.page.endRow = callback.data.resp.endRow + '';
            } else {
                alert("error");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    $scope.pageQueryBlackWhite(1);
    $scope.resetBlackWhite = function () {
        $scope.searchCondition = {
            listChannel: '1',
            listType: '',
            listName: '',
            isValid: ''
        };
    };

    /**
     * 获取名单渠道列表
     * @param listChanel
     * @returns {string}
     */
    $scope.getListChanelName = function (listChanel) {
        var ListChanelName = "";
        if (listChanel == 1) {
            ListChanelName = "玖富钱包APP";
        } else if (listChanel == 2) {
            ListChanelName = "悟空理财APP";
        } else if (listChanel == 4) {
            ListChanelName = "任务中心";
        }
        return ListChanelName;
    };
    /**
     * 获取名单类型列表
     * @param listType
     * @returns {string}
     */
    $scope.getListTypeName = function (listType) {
        var listTypeName = "";
        if (listType == 1) {
            listTypeName = "黑名单";
        } else if (listType == 2) {
            listTypeName = "白名单";
        }
        return listTypeName;
    };

    // TODO 预增加逻辑 和 增加逻辑
    $scope.preAdd = function () {
        $scope.operationType = 1;
        $scope.operationRecord.isupdate = 0;
        $scope.operationRecord = {isValid: '1', listChannel: '1', ismp: '0'};
        $("#meun-status").hide();
        $('#add-start-bg1').show();
        $("#ismp").removeAttr('disabled', 'disabled');
    };
    // TODO 增加逻辑
    $scope.updateRecord = function () {
        // 验证参数
        if (!$scope.checkParam()) return;
        // 保存数据
        var url = null;
        if (!$scope.operationRecord.id) {
            url = globalConfig.basePath + "/appconfig/WhiteBlankList/add";
        } else {
            url = globalConfig.basePath + "/appconfig/WhiteBlankList/update";
            $scope.operationRecord.updateTime = null;
            $scope.operationRecord.createTime = null;
            if (fileParam.fileName) $scope.operationRecord.excelName = fileParam.fileName;
        }
        $http.post(url, $scope.operationRecord).then(function successCallback(callback) {
            $('#add-start-bg1').hide();
            if (callback.data.code == '000') {
                $scope.pageQueryBlackWhite(1);
                swalMsg("保存成功");
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    /**
     * 验证参数
     * @returns {boolean}
     */
    $scope.checkParam = function () {
        var result = false;
        if (!$scope.operationRecord.listChannel) {
            swalMsg("渠道不能为空");
            return result;
        }
        if (!$scope.operationRecord.listType) {
            swalMsg("名单类型不能为空");
            return result;
        }
        if (!$scope.operationRecord.listName) {
            swalMsg("名单名称不能为空");
            return result;
        }
        if ($scope.operationRecord.listChannel==4) {
        	 if (!$scope.operationRecord.taskId) {
        		 swalMsg("活动ID不能为空");
        		 return result;
        	 }
        }
        if (!$scope.operationRecord.isValid) {
            swalMsg("是否有效不能为空");
            return result;
        }
        if (!$scope.operationRecord.ismp) {
            swalMsg("名单来源不能为空");
            return result;
        }
        return result = true;
    };
    /**
     * 操作前的预处理
     * @param opType
     * @param record
     */
    $scope.preOperate = function (opType, record) {
        if (opType == 1) {// 展示
            $("#look-start-box1").show();
            $scope.showRecord = angular.copy(record);
            $scope.showRecord.ismp = record.ismp + '';

            // 向后台发送请求
            var url = globalConfig.basePath + "/appconfig/WhiteBlankList/details";
            $http.get(url + "?id=" + record.id).then(function successCallback(callback) {
                if (callback.data.code == '000') {
                    $scope.showRecord.datastatus = callback.data.resp.datastatus;
                    $scope.showRecord.excelName = callback.data.resp.excelName;
                    $scope.showRecord.datastatusStr = getDataStatusStr($scope.showRecord.datastatus, $scope.showRecord.ismp);
                } else {
                	if(callback.data.code == '222'){
                		
                	}else{
                		console.error(callback.data);
                        swalMsg("操作失败");
                	}
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                swalMsg(response);
            });
        } else if (opType == 2) { // 修改
            // 向后台发送请求
            var url = globalConfig.basePath + "/appconfig/WhiteBlankList/details";
            $http.get(url + "?id=" + record.id).then(function successCallback(callback) {

                if (callback.data.code == '000') {
                    $("#meun-status").show();
                    $('#add-start-bg1').show();
                    $("#ismp").attr('disabled', 'disabled');
                    $scope.operationRecord.isupdate = 1;//是否修改
                    $scope.operationRecordForFile = record;
                    $scope.operationRecord = angular.copy(record);
                    $scope.operationRecord.listChannel = $scope.operationRecord.listChannel + '';
                    $scope.operationRecord.ismp = record.ismp + '';

                    $scope.operationRecord.datastatus = callback.data.resp.datastatus;
                    $scope.operationRecord.excelName = callback.data.resp.excelName;
                    // 上传状态
                    $scope.operationRecord.datastatusStr = getDataStatusStr($scope.operationRecord.datastatus, $scope.operationRecord.ismp);

                    //配置文件上传参数
                    fileParam = {
                        blackWhiteId: $scope.operationRecord.id,
                        blackWhiteChannel: $scope.operationRecord.listChannel,
                        blackWhiteType: $scope.operationRecord.listType
                    };
                } else {
                	if (callback.data.code == '222'){
                		console.error(callback.data);
                        swalMsg(callback.data.message);
                	} else {
                		console.error(callback.data);
                        swalMsg("操作失败");
                	}
                }
            }, function errorCallback(response) {
                // 请求失败执行代码
                swalMsg(response);
            });
        } else if (opType == 3) { // 生效、失效
            $scope.operationRecord = record;
            $('#take-start-box1').show();
        }
    };
    // 改变是否
    $scope.changeisMap = function () {
        if ($scope.operationRecord.isupdate == 0) {
            return false;
        } else {
            var ismp = $scope.operationRecord.ismp;
            if (ismp == 1) {
                $scope.operationRecord.datastatusStr = "未同步"
            } else {
                $scope.operationRecord.datastatusStr = "未上传";
            }
        }

    }

    // 生效、失效
    $scope.validateRecord = function () {
        // 保存数据
        var url = null;
        if ($scope.operationRecord.isValid == '0') {
            url = globalConfig.basePath + "/appconfig/WhiteBlankList/takeEffect";
        } else {
            url = globalConfig.basePath + "/appconfig/WhiteBlankList/failure";
        }
        $http.get(url + "?id=" + $scope.operationRecord.id).then(function successCallback(callback) {
            $('#take-start-box1').hide();
            if (callback.data.code == '000') {
                $scope.pageQueryBlackWhite(1);
                swalMsg("操作成功");
            } else {
                console.error(callback.data);
                swalMsg("操作失败");
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            swalMsg(response);
        });
    };
    $scope.downloadTemplate = function (name, fileName) {
        window.open(globalConfig.basePath + "/appconfig/file/template?name=" + encodeURIComponent(name) + "&fileName=" + fileName);
    };
    $scope.downloadBlackWhiteFile = function (fileId, fileName) {
        if (fileName && fileName.length > 0) {
            window.open(globalConfig.basePath + "/appconfig/file/downloadBlackWhiteFile?blackWhiteListId=" + fileId);
        }
        /* alert("下载文件");
         var data = {blackWhiteListId:fileId,blackWhiteListName:fileName};
         DownLoad({
             url:globalConfig.basePath + "/appconfig/file/downloadBlackWhiteFile",
             data:data
         });*/
        /*var form = $('#conditionForm');
        form.attr("action",globalConfig.basePath + "/appconfig/file/downloadBlackWhiteFile");
        $('#conditionForm_blackWhiteListId').val(fileId);
        $('#conditionForm_blackWhiteListName').val(fileName);
        // form.attr("target","_blank");
        form.submit();*/
    };

    function DownLoad(options) {
        var config = $.extend(true, {method: 'post'}, options);
        var $iframe = $('<iframe id="down-file-iframe" />');
        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        }
        $iframe.append($form);
        $(document.body).append($iframe);
        $form[0].submit();
        $iframe.remove();
    }

    // post使用方式一
    /*$http({
        method:'post',
        url:url,
        data:data,
        param:"",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(obj) {
            if(angular.isObject(obj) && String(obj) !== '[object File]'){
                var str = [];
                for (var s in obj) {
                    str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                }
                return str.join("&");
            }
            return obj;
        }
    }).then(function successCallback(data) {
        console.log(data);
    }, function errorCallback(response) {
        // 请求失败执行代码
        alert("请求失败了....");
    });*/

    // post使用方式二
    /*$http.post(url,data)
        .then(
            function(response){
                if (response.data.success) {
                    deferred.resolve(response.data.content);
                } else {
                    deferred.reject(response.data.errorMsg);
                }
            },
            function(errResponse){
                deferred.reject(errResponse);
            }
        );*/
    //post使用方式三，config，参见http://blog.csdn.net/web1504/article/details/53125779
    // $http.post('/someUrl', data, config).then(successCallback, errorCallback);
    
    $scope.getDataStatushtml = function(datastatus, ismp) {

    	$('#fontColor').removeClass('trStyle');
        var datastatusStrName = "";
        if (datastatus == 0) {//未上传
            datastatusStrName = '未';
        }
        if (datastatus == 1) {//未上传
            datastatusStrName = '已';
        }
        if (datastatus == 2) {//未上传
            datastatusStrName = '正在';
        }
        datastatusStrName += (ismp == 1 ? "同步" : "上传");
        if (datastatus == 3) {//未上传
            datastatusStrName += '出错';
        }
        return datastatusStrName;
    }

}]);

var fileParam = {};

function importMemberData() {
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
    var appElement = document.querySelector('[ng-controller=rootController]');//获得绑定controllerdom节点
    var $scope = angular.element(appElement).scope(); //获得$scope对象
    var datastatus_var = $scope.operationRecord.datastatus;
    $scope.operationRecord.datastatus = 2;
    $scope.operationRecord.datastatusStr = getDataStatusStr($scope.operationRecord.datastatus, $scope.operationRecord.ismp);
    $scope.$apply();//刷新数据
    fileParam.append = $scope.operationRecord.append || false;
    if($scope.operationRecord.listChannel==4){
    	fileParam.blackWhiteId = $scope.operationRecord.taskId;
    }
    $.ajaxFileUpload({
        url: globalConfig.basePath + '/appconfig/file/uploadBlackWhiteMemberList?' + $.param(fileParam), //你处理上传文件的服务端
        secureuri: false,
        fileElementId: 'memberFile',
        success: function (callback) {
            var str = $(callback).find("body").text();//获取返回的字符串
            var json = $.parseJSON(str);//把字符串转化为json对象
            if (json.code == '000') {
                fileParam.fileName = json.resp;

                $scope.operationRecord.excelName = json.resp;
                $scope.operationRecordForFile.excelName = json.resp;
                $scope.operationRecord.datastatus = 1;
                $scope.operationRecord.datastatusStr = getDataStatusStr($scope.operationRecord.datastatus, $scope.operationRecord.ismp);
                $scope.$apply();//刷新数据
                // $('#updateMemberFileInput').val(fileParam.fileName);
                alert("用户名单文件上传完成，导入名单数据后台处理中，请关注名单状态变化！");
            } else if (json.code == '104') {
                alert("黑白名单正在上传中，请稍后");
            } else {
                $scope.operationRecord.datastatus = datastatus_var;
                $scope.operationRecord.datastatusStr = getDataStatusStr($scope.operationRecord.datastatus, $scope.operationRecord.ismp);
                $scope.$apply();//刷新数据
                console.error(json);
                alert(json.message);
            }
            $('#memberFile').val("");
        },
        error: function (errorRespon) {
            console.info(errorRespon);
            $scope.operationRecord.datastatus = datastatus_var;
            $scope.operationRecord.datastatusStr = getDataStatusStr($scope.operationRecord.datastatus, $scope.operationRecord.ismp);
            $scope.$apply();//刷新数据
            alert("文件上传失败："+errorRespon);
        }
    });
}

/**
 * 根据上传状态，isMp获取上传状态
 * @param datastatus
 * @param ismp
 */
function getDataStatusStr(datastatus, ismp) {
    var datastatusStrName = "";
    if (datastatus == 0) {//未上传
        datastatusStrName = '未';
    }
    if (datastatus == 1) {//未上传
        datastatusStrName = '已';
    }
    if (datastatus == 2) {//未上传
        datastatusStrName = '正在';
    }
    datastatusStrName += (ismp == 1 ? "同步" : "上传");
    if (datastatus == 3) {//未上传
        datastatusStrName += '失败';
    }
    return datastatusStrName;
}
