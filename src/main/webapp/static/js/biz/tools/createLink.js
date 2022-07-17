


'use strict';
var App = angular.module('linkApp', [], angular.noop);
App.controller("linkController", ['$scope','$http',  function ($scope,$http) {
	$scope.copy = function(type){
		if(type=='0'){
			var Url2=document.getElementById("link0");
			Url2.select(); // 选择对象
			document.execCommand("Copy"); // 执行浏览器复制命令
			alert("已复制好，可贴粘。");
		}
		if(type=='1'){
			var Url2=document.getElementById("link1");
			Url2.select(); // 选择对象
			
			document.execCommand("Copy"); // 执行浏览器复制命令
			alert("已复制好，可贴粘。");
		}
		if(type=='2'){
			var Url2=document.getElementById("link2");
			Url2.select(); // 选择对象
			document.execCommand("Copy"); // 执行浏览器复制命令
			alert("已复制好，可贴粘。");
		}
	
	}


}]);