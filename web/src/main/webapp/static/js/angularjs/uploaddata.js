(function() {
	'use strict';

	angular.module('ogpHavester.controllers.uploadDataCtrl', ['ogpHarvester.services', 'ngRoute', 'ui.bootstrap', 'pascalprecht.translate', 'ngFileUpload', 'ngCookies'])

	.config(['$routeProvider',
		function config($routeProvider) {
		$routeProvider.when('/uploadData', {
			template: 'resources/uploaddata.html',
			controller: 'UploadDataCtrl'
		});
	}
	]).controller('UploadDataCtrl', ['$scope', 'Upload', '$http', '$q','$cookies', '$interval', function ($scope, Upload, $http, $q, $cookies, $interval)  {
		
		try { angular.module("ngFileUpload") } catch(err) { console.log(err); }
		try { angular.module("ngCookies") } catch(err) { console.log(err); }

		if($cookies['downloads']!=null) {
			$scope.downloads = JSON.parse($cookies['downloads']);
		} else {
			$scope.downloads = [];
			$cookies['downloads'] = JSON.stringify($scope.downloads);
		}
		
		$scope.refreshView = $interval(function(){
			angular.forEach($scope.downloads, function(download) {	
				if(download.locked && download.ticket>=0) {
					download.ticket = download.ticket + 1;	
				}
				
				if(download.ticket > 10) {
					download.status = 'File sent';
					download.statusColor = 'black';
					download.zipFile = '';
					download.ticket=-1;
				}
			});
		},1000);
		
		$scope.uploadFiles = function(files, errFiles) {
			$scope.files = files;
			$scope.errFiles = errFiles;
			angular.forEach(files, function(file) {
				if(file.name.substr(file.name.length - 4, file.name.length)==='.zip') {
					$scope.downloads.push({'workspace': '', 'dataset': file.name.substr(0, file.name.length - 4), 'fileName':  file.name, 'fileSize':  $scope.bytesConverter(file.size, 2), 'zipFile': file, 'status' : 'Ready', 'statusColor' : 'green', 'valid' : true, 'locked' : false, 'ticket' : 0})
				} else {
					$scope.downloads.push({'workspace': '', 'dataset': file.name.substr(0, file.name.length - 4), 'fileName':  file.name, 'fileSize':  $scope.bytesConverter(file.size, 2), 'zipFile': file, 'status' : 'Not a zip file', 'statusColor' : 'red', 'valid' : false, 'locked' : false, 'ticket' : 0})
				}
			});
			$cookies['downloads'] = JSON.stringify($scope.downloads);
		}

		$scope.sendFiles = function() {
			
			var validSet = true;
			
			angular.forEach($scope.downloads, function(download) {
				if(!download.locked && download.valid && download.workspace==='') {
					download.status = 'Workspace name required';
					download.statusColor = 'red';
					validSet = false
				} else if(!download.locked && download.valid && download.dataset==='') {
					download.status = 'Dataset name required';
					download.statusColor = 'red';
					validSet = false
				} else if(!download.locked && !download.valid) {
					download.status = 'Not allowed';
					download.statusColor = 'red';
					validSet = false
				} else if(!download.locked) {
					download.status = 'Ready';
					download.statusColor = 'green';
				}
			});			
			
			if(validSet) {
				angular.forEach($scope.downloads, function(download) {
					if(download.valid && !download.locked) {
						download.status = 'Sending...';
						download.statusColor = 'blue';
						download.locked = true;
					}
				});
			}
			
			$cookies['downloads'] = JSON.stringify($scope.downloads);
		}

		$scope.expandWorkspace = function(workspace) {
			if(workspace!=null && workspace!='') {
				if ( window.confirm('Rename all workspaces with ' + workspace + ' ?') ) {
					angular.forEach($scope.downloads, function(download) {
						if(!download.locked) {
							download.workspace = workspace;
						}
					});
					$cookies['downloads'] = JSON.stringify($scope.downloads);
				}
			}
		}

		$scope.remove = function(array, index){
			if(window.confirm('Remove the file?')) {
				array.splice(index, 1);
				$cookies['downloads'] = JSON.stringify(array);
			}
		}
		
		$scope.clean = function(array, index){
			array.splice(index, 1);
			$cookies['downloads'] = JSON.stringify(array);
		}

		$scope.bytesConverter = function(bytes, precision) {
			if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
			if (typeof precision === 'undefined') precision = 1;
			var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
		};


	}]);

})();