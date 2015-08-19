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
}}])

.factory('matJson', ['$http', function($http){
    return {
      get: function(){
        return $http({
          method: "GET",
          url:'WallMaterialImages/InfoJson.json',
          async: false,
        success: function(){
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

.factory('xRequest', ['$http', function($http){
    return {
      get: function(){
      $http.defaults.useXDomain = true;
      return $http({
        method: "GET",
        url:'http://85.159.111.72/jsonWEBGL.json',
        async: false,
      success: function(){
      console.log("cors");
      }
    }).then(function(response){
        return response.data
      });
    }
  }}])

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