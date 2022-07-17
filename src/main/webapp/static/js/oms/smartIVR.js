'use strict';

var App = angular.module('popupApp', [], angular.noop);
App.controller('popupController', ['$scope', '$http', function ($scope, $http) {

    $scope.searchCondition = {pageSize: 10};
    $scope.operationType = 0;
    $scope.operationRecord = {};

    /**
     * 导出外呼数据
     */
    $scope.exportExport = function () {
        window.location.href = globalConfig.basePath + "/smartIVR/reportExport";
    };

    // 打开数据
    $scope.OpenSmartIVR = function () {
        $("#OpenSmartIVR").show();
        $("#memberFile").val("");
        $('#wavFile').val("");
        $("#updateMemberFileInput").val("");
    }

    /**
     * 下载导入模板
     */
    $scope.downloadTemplet  = function () {
        window.location.href = globalConfig.basePath + "/smartIVR/downloadTemplet";
    }



}]);


function importOpenMemberData() {
    var xlsfile = $("#memberFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    $("#updateMemberFileInput").val(xlsfilename);
}

function importOpenWavData() {
    var xlsfile = $("#wavFile").val();
    var xlsfilename = xlsfile.substring(xlsfile.lastIndexOf("\\") + 1, xlsfile.length);
    //$("#updateWavFileInput").val(xlsfilename);
    $.ajaxFileUpload({
        url: globalConfig.basePath + '/smartIVR/uploadWav', //你处理上传文件的服务端
        secureuri: false,
        fileElementId: 'wavFile',
        success: function (data) {
        	var resp = $.parseJSON(data.childNodes[0].innerText);
        	var url = resp.resp + "";
            alert("音频上传成功");
            $("#updateWavFileInput").val(url);
        },
        error: function (errorRespon) {
            console.info(errorRespon);
            alert("文件上传失败");
        }
    });
}

var fileParams = {};

function queryJob(jobId, onProcess, onComplete) {
    $.getJSON(globalConfig.basePath + "/appConfig/job/" + jobId, function (result) {
        var status = result.resp;
        var rate = status.replace(/0/g, '').length / status.length;
        onProcess(parseInt(rate * 100));
        setTimeout(function () {
            if (result.resp.indexOf(0) >= 0) {
                queryJob(jobId, onProcess, onComplete);
            } else {
                onComplete();
            }
        }, 1000);
    })
}

function commitRecord() {
    fileParams = {};
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
    var addStartHour = $('#addStartHour').val();

    var addEndHour = $('#addEndHour').val();
    fileParams['startTime'] = addStartHour;
    fileParams['endHour'] = addEndHour;

    $('.ivr-button').hide();
    $('.ivr-processing-status span').text("0%");
    $('.ivr-processing-status').show();
    $.ajaxFileUpload({
        url: globalConfig.basePath + '/smartIVR/uploadMemberList?' + $.param(fileParams), //你处理上传文件的服务端
        secureuri: false,
        fileElementId: 'memberFile',
        success: function (callback) {
            var str = $(callback).find("body").text();//获取返回的字符串
            var json = $.parseJSON(str);//把字符串转化为json对象
            var jobId = json.resp;
            if (jobId !== undefined) {
                queryJob(jobId, function (rate) {
                    $('.ivr-processing-status span').text(rate + "%");
                }, function () {
                    alert("用户名单导入成功！");
                    $('.ivr-button').show();
                    $('.ivr-processing-status').hide();
                })
            } else {
                console.error(json.data);
                alert("上传文件有误");
            }
            $('#memberFile').val();

        },
        error: function (errorRespon) {
            console.info(errorRespon);
            alert("文件上传失败");
        }
    });
    $("#OpenSmartIVR").hide();

}

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

    $.ajaxFileUpload({
        url: globalConfig.basePath + '/smartIVR/uploadMemberList?' + $.param(fileParam), //你处理上传文件的服务端
        secureuri: false,
        fileElementId: 'addmemberFile',
        success: function (callback) {
            var str = $(callback).find("body").text();//获取返回的字符串
            var json = $.parseJSON(str);//把字符串转化为json对象
            if (json.code == '000') {
//                fileParam.fileName =json.resp;
//                var appElement = document.querySelector('[ng-controller=rootController]');//获得绑定controllerdom节点
//                var $scope = angular.element(appElement).scope(); //获得$scope对象
//                $scope.operationRecord.excelName = fileParam.fileName;
//                $scope.operationRecordForFile.excelName = fileParam.fileName;
//                $scope.$apply();//刷新数据
//                // $('#updateMemberFileInput').val(fileParam.fileName);
                alert("用户名单导入成功！");
            } else {
                console.error(json.data);
                alert("上传文件有误");
            }
            $('#memberFile').val();

        },
        error: function (errorRespon) {
            console.info(errorRespon);
            alert("文件上传失败");
        }
    });


}

function exportExport(){
    var load = new Loading();
    load.init({
        target: "#loading-content"
    });
    load.start();
    $('#loading2').click(function(){
        var load = new Loading();
        load.init({
            target: "#loading-content"
        });
        load.start();
        setTimeout(function() {
            load.stop();
        }, 3000)
    });
    var timer = setInterval(function getState(){
        //判断是否生成excel成功
        $.ajax({
            url: globalConfig.basePath + '/smartIVR/exportState?taskId=' + taskId, //你处理上传文件的服务端
            secureuri: false,
            success: function (callback) {
                var str = $(callback).find("body").text();//获取返回的字符串
                var json = $.parseJSON(str);//把字符串转化为json对象
                var state = json.resp;
                if(state == "true"){
                   // $.fn.jqLoading("destroy");
                    clearInterval(timer);
                    load.stop();
                }
            },
            error: function (errorRespon) {
                console.info(errorRespon);
                alert("下载失败");
            }
        });
    },100);
    $.ajax({
        url: globalConfig.basePath + '/smartIVR/reportExport', //你处理上传文件的服务端
        secureuri: false,
        success: function (callback) {

        },
        error: function (errorRespon) {
            console.info(errorRespon);
        }
    });
}
