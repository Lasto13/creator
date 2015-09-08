var app = angular.module('app',[
  'ui.bootstrap',
  'angularjs-dropdown-multiselect'
  ])

.factory('httpRequestInterceptor', ['$window', function($window){
  return {
    request: function (config) {
      var oToken;
      config.headers = config.headers || {};
      if ($window.Storage && $window.localStorage.getItem('token')) {
        oToken = JSON.parse($window.localStorage.getItem('token'));
      }
      
      if (oToken) {
        config.headers.Authorization = 'Bearer'+' '+oToken;
        console.log(config.headers.Authorization);
      }
      return config;
    }
  };
}])
/*
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
  //$httpProvider.responseInterceptors.push('securityInterceptor');
}])
*/
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

.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
      return filtered;
    };
  })

.factory('communicator', ['$http', '$window', '$timeout', '$q',  function($http, $window, $timeout, $q){
  var service = {}

  service.login = function(login, pass){

    return $http.post('http://dev.enli.sk/api/tokens', { username: login, password: pass })
    
    .then(function (response) {
        document.getElementById('loginScreen').style.opacity = '0';
        document.getElementById('loginScreen').style.display = 'none';

        $timeout(function() {
            initialize();
        }, 1500);
      return response
    },
    function (err) {getErrorText('Nesprávne meno alebo heslo'); console.log('Server Error'); console.dir(err); });
  };

  service.saveDataToStorage = function(data) {
    if ($window.Storage) {
      myStorage = $window.localStorage;
      myStorage.setItem('token', JSON.stringify(data.token.value));
      myStorage.setItem('user', JSON.stringify(data.user));
    } else {console.log('Storage is not suported');}
  };

  service.userPlaces = function() {
    var params = {
      limit: 100
    };
    return $http.get('http://dev.enli.sk/api/places', { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token')) }, params : params })
    .then(function(resp){
      return resp.data.places;
    }, function(err){
      console.log('server response ERROR');
      console.dir(err);
    });
  };

  service.getSave = function (placeID) {
    var placeID = JSON.parse(myStorage.getItem('place'));
    var params = {
      limit: 100
    };
    return $http.get('http://dev.enli.sk/api/places/' + placeID + '/save', { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token')) }, params : params })
      .then(function(resp, status, headers, conf){
          return resp
      })
  };

  service.saveScene = function (saveName) {
    var token = myStorage.getItem('token');
    var placeID = JSON.parse(myStorage.getItem('place'));

    SendMessage("Save Game Manager", "setTokens", token);
    SendMessage("Save Game Manager", "setAdvertisement", placeID);
    SendMessage("Save Game Manager", "SaveFromWeb", saveName);
    
    SendMessage('FunctionsManager','SetInputEnabled','1');
  };

  service.deleteSave = function(saveName){
    var _placeID = JSON.parse(myStorage.getItem('place'));
      
    return $http.delete('http://dev.enli.sk/api/places/' + _placeID + '/save/' + saveName, { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + JSON.parse(myStorage.getItem('token')) }})
      .then(function(resp, status, headers, conf){
          return resp
      })
  }

  return service
}])

.factory('jsonFactory', ['$http', function($http){
  var service = {};

  service.loadMenu = function(){
    $http.defaults.useXDomain = true;
    return $http({
        method: "GET",
        url:'http://85.159.111.72/jsonWEBGL.json',
        async: false,
    }).then(function(response){
        return response.data
    });
  }

  service.loadFloors = function(){
      $http.defaults.useXDomain = true;
      return $http({
        method: "GET",
        url:'http://85.159.111.72/FloorJson.json',
        async: false,
      }).then(function(response){
        return response.data
      });
  }

  service.loadWalls = function(){
    $http.defaults.useXDomain = true;
    return $http({
      method: "GET",
      url:'http://85.159.111.72/WallJson.json',
      async: false,
      success: function(){
        $scope.calculateMatBoxes();
      }
    }).then(function(response){
      return response.data
    });
  }

  return service;

}])

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