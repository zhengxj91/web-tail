



angular.module('webtail', []).controller('webtailController', function($scope) {


	var el = document.getElementById("tail");

	$scope.filter = "";
	$scope.name = "aki";

	$scope.disablescroll = false;
	$scope.disablescrollBtnText = "禁用自动滚动";
	$scope.dirs = [

	];


	$scope.logger = [];
	$scope.files = [

	];

	var socket = io.connect("http://"+location.host.split(":")[0]+":9999",{transports: ['websocket', 'polling', 'flashsocket']});

	socket.on('connect', function() {
		log('Connected');

		socket.emit("requestdirs");
	});

	$scope.file = "";


	var currentPath = "", currentPathFile = "", append = true;
	$scope.selectfile = function(file){

		console.log($scope.file)

		append = false;

		var path = currentPath + "/" + $scope.file;


		currentPathFile = path;
			

		socket.emit("request", {path: path});
	};

	$scope.selectpath = function(path){

		console.log(path)
		currentPath = path;
		socket.emit("requestfiles", {path: path});
	};

	socket.on("files", function(data){

		$scope.files = data.files;
		console.log(data.files)

		$scope.$apply();

		console.log(currentPath + "/" + data.files[0])
		socket.emit("request", {path: currentPath + "/" + data.files[0]});

	});
	socket.on("dirs", function(data){

		$scope.dirs = data;
		$scope.$apply();

		var path = data[0];

		currentPath = path;

		$scope.path = path;

		socket.emit("requestfiles", {path: path});

	});

	socket.on("tail", function(data){

		if(data.path != currentPathFile){
			return;
		}

		if(append){
			$scope.logger = $scope.logger.concat(data.lines);
		}else{
			$scope.logger = data.lines;
		}
		append = true;
		$scope.$apply();

		if(!$scope.disablescroll) document.getElementById("tail").scrollTop=20000000
	});


	function log(str){
		console.log(str)
	}
	
	socket.on('err', log);

	socket.on('message', log);


});