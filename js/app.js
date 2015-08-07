var app = angular.module('app',[
      'ui.bootstrap'
      ])

.directive('select', function($interpolate) {
  return {
    restrict: 'E',
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      var defaultOptionTemplate;
      scope.defaultOptionText = attrs.defaultOption || 'Select...';
      defaultOptionTemplate = '<option value="" disabled selected style="display: none;">{{defaultOptionText}}</option>';
      elem.prepend($interpolate(defaultOptionTemplate)(scope));
      }
    };
  })

.factory('menuJson', ['$http', function($http){
    return {
      get: function(){
      return $http({
        method: "GET",
        url:'jsonWEBGL.json',
        async: false,
      success: function(){
      console.log("new");
      }
    }).then(function(response){
        return response.data
      });
    }
  }
}])

.factory('matJson', ['$http', function($http){
    return {
      get: function(){
        return $http({
          method: "GET",
          url:'WallMaterialImages/InfoJson.json',
          async: false,
        success: function(){
        console.log("new");
        }
      }).then(function(response){
          return response.data
        }); 
      }
    }
  }])

.factory('floorJson', ['$http', function($http){
    return {
      get: function(){
        return $http({
          method: "GET",
          url:'WallMaterialImages/FloorJson.json',
          async: false,
        success: function(){
        console.log("new");
        }
      }).then(function(response){
          return response.data
        }); 
      }
    }
  }])
/*
.controller('mainCtrl',['$scope','$modal','$compile','$http','$window', '$rootScope', function($scope, $modal, $compile,$http,$window, $rootScope){
  var prepinacSave = 0;
  var myStorage;
  
  console.logError = console.log;

  var login = function(){
    var email = "plastovecky@enli.sk";
    var password = "enliportal";

    var request = $http.post('http://dev.enli.sk/api/tokens', {username: email, password: password});
    request.then(function(response) {
    saveDataToStorage(response.data);
  }, function(err){
    console.log('Server Error');
    console.dir(err);
    });
  };

  login();

  function saveDataToStorage(data) {
    if ($window.Storage) {
      //myStorage = $window.sessionStorage;
      myStorage = $window.localStorage;
      myStorage.setItem('token', JSON.stringify(data.token.value));
      myStorage.setItem('user', JSON.stringify(data.user));
      console.log('Token was stored' + myStorage);
      getSave();
    } else {
      console.log('Storage is not suported');
    }
  };

  var getSave = function(){
    var placeID = "55802cadd2aa3c3d6240679f";

    var promise = $http({
      method : 'GET',
      url : 'http://dev.enli.sk/api/places/'+placeID+'/save', 
      //transformRequest: angular.identity,
      headers : { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token'))}
    });
    promise.success(function(data,status,headers,conf) {
      console.log(data,status,headers,conf);
      console.log("Toto su data" + data);
      $scope.LoadSave = data;
    return data;
    });
  };
  //Neviem preco to nefunguje ale nejako takto by sa malo robit obmedzenie pre radio buttony pomocou sipiek 
  $(document).keydown(function(e)
  {
    console.log("asdfasdfasdfasdfasdf")
      if(prepinacSave == 1){
         // $('#canvas').blur();
      // return false;
     }
  });

  var prepinacSet = 0;
  var prepinacLoad = 0;
  $scope.isSettingOpened = false;

  $scope.SetSettings = function(){
  if(prepinacSet == 0){
    $('#Settings').css({ right: 315 + 'px' });
    prepinacSet = 1;
    }
  else if(prepinacSet == 1){
    $('#Settings').css({ right: -300 + 'px' });
    prepinacSet = 0;
    }
  }

  $scope.SetSave = function(){
    if(prepinacSave == 0){
    $('#SaveProject').css({ top: 315 + 'px' });
    prepinacSave = 1;
  }
  else if(prepinacSave == 1){
    $('#SaveProject').css({ top: -300 + 'px' });
    prepinacSave = 0;
    }
  }

  $scope.SetLoad = function(){
    if(prepinacLoad == 0){
    $('#LoadProject').css({ top: 315 + 'px' });
    prepinacLoad = 1;
  }
  else if(prepinacLoad == 1){
    $('#LoadProject').css({ top: -300 + 'px' });
    prepinacLoad = 0;
    }
  }

  $scope.selectedTemplate = {};

  $scope.selectedTemplate.path = "partials/podorys.tpl.html";


  $scope.Podorys = function(){
    SendMessage("CanvasEditor","changeArea",0);
  }
  $scope.DW = function(){
    console.log("zmena na DW");
    SendMessage("CanvasEditor","changeArea",2);
  }
  $scope.Interier = function(){
    SendMessage("CanvasEditor","changeArea",5);
  }

  $scope.D2D = function(){
    console.log("Klikol som");
    SendMessage("CanvasEditor","SetView2D");
  }
  $scope.D3D = function(){
    SendMessage("CanvasEditor","SetView3D");
  }
  $scope.Center = function(){
    SendMessage("Main Camera","ResetPosition");
  }
  $scope.Undo = function(){
    SendMessage("UndoRedo","Undo");

  }
  $scope.Redo = function(){
    SendMessage("UndoRedo","Redo");
  }
  $scope.FPS = function(){
    SendMessage("EventSystem","FpsPosition");
  }
  $scope.Kvalita = function(value){
    SendMessage("Settings","setLevel",value);
  }
  $scope.HranySet = function(value){
    SendMessage("Settings","setAA",value);
  }
  $scope.RozmerySet = function(value){
    SendMessage("Settings","ShowTextFromWeb",value);
  }
  $scope.UlozitProjekt = function(value){
    SendMessage("Save Game Manager","SaveFromWeb","Mysave1");
  }

  setShowRozmery = function(show){
    if(show === "0"){
      console.log("Volame ta ?");
      $('#RozmeryVypnute').prop('checked',true);
      $scope.RozmerySet(0);
    }
    else{
      $('#RozmeryZapnute').prop('checked',true);
      $scope.RozmerySet(1);
    }
  }

  $scope.NovyProjekt = function(){
  
  var projectModal= $modal.open({
    //backdrop: 'static',
    keyboard: false,
    templateUrl: 'partials/newProject.html',
    controller: 'NewProjectCtrl',
    transclude:true

    });
    //windowClass: 'detailWindow'
  }

  savingFinished = function(value){
    if(value === "1"){
    console.log("Ukladanie skoncilo dobre");
  }
  else if(value === "0")
    console.log("Ukladanie skoncilo zle");
  }

  loadingFinished = function(value){
  }

  $scope.OtvoritProjekt = function(jsonstring){
    SendMessage("Save Game Manager","LoadAndDeserializeFromWeb",jsonstring);
    console.log(jsonstring);
  }
}]) 
*/
/*
.controller('NewProjectCtrl',['$scope', '$modalInstance', function($scope, $modalInstance){
  $scope.cancel = function () {
    console.log("Malo by to vypnut");
    $modalInstance.dismiss('cancel');
  }

  $scope.ok = function () {
    console.log("ok");
    $modalInstance.close(SendMessage("NewProject","NewProject"));
    SendMessage("NewProject","NewProject");
  }
}])
*/
.directive('creatorDir', [ function(){
  return{
    restrict: 'A',
    //controller: "superCtrl",
    templateUrl: 'webglview.html',
    //replace: true,
    //transclude: true,
    link: function(scope,element,attr) {
      console.log("FIRE & BLOOD");
    }
  };
}])