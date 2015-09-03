var app = angular.module('app',[
      'ui.bootstrap',
      'angularjs-dropdown-multiselect'
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

.factory('communicator', ['$http', function($http){
  var service = {}

  //service.
}])

.factory('jsonFactory', ['$http', function($http){
  var service = {}

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