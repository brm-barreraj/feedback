angular.module('starter.services', [])

.service('ServiceGeneral', function ($http, $q, $rootScope, $cordovaFileTransfer){

  // http://127.0.0.1/ionic/feedback/server/serviceApp.php (Local Julian)
  // http://fbapp.brm.com.co/fbappFundacion/appFeedback/serviceApp.php (Pruebas)
  var urlService = "http://fbapp.brm.com.co/fbappFundacion/appFeedback/serviceApp.php";

  this.post = function(parameters) {
    var dfd = $q.defer();
    var statusImg=false;
    
    $http.post(urlService,parameters,{timeout:10000, headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'}})
    .success(function(data) {
      dfd.resolve(data);
    })
    .error(function(data) {
      dfd.reject(data);
    });
    return dfd.promise;
  };

  this.gmail = function(access_token) {
    var dfd = $q.defer();
    $http.get("https://www.googleapis.com/plus/v1/people/me", {params: {access_token: access_token}})
    .then(function(data) {
      dfd.resolve(data);
    }, function(data) {
      dfd.reject(data);
    });
    return dfd.promise;
  };

  this.setUserData = function(user) {
    $rootScope.usuName = user.nombre;
    $rootScope.usuEmail = user.email;
    $rootScope.usuImg = user.imagen;
    window.localStorage.setItem('us3r4ppSUg', JSON.stringify(user));
  };

  this.getUserData = function() {
    var user = JSON.parse( window.localStorage.getItem('us3r4ppSUg'));
    if (user != null && user.idUsuario != "") {
      $rootScope.usuName = user.nombre;
      $rootScope.usuEmail = user.email;
      $rootScope.usuImg = user.imagen;
      return user;
    }else{
      return false;
    }
  };

  this.setStatusImg = function(status) {
    statusImg = status;
  };

  this.getStatusImg = function() {
    return statusImg;
  };

  this.deleteUser = function() {
    localStorage.removeItem('us3r4ppSUg');
  };

  this.validEmail = function(email) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if ( !expr.test(email) ){
      return false;
    }else{
      return true;
    }
  };

    // Returns the local path inside the app for an image
  this.pathForImage = function(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  };

  this.uploadFile = function(parameters) {
    // File name only
    var filename = parameters.imagen;

    // File for Upload
    var targetPath = this.pathForImage(filename);
   
    var options = {
      timeout:10000,
      fileKey: "imagen",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : parameters
    };

    var dfd = $q.defer();

    $cordovaFileTransfer.upload(urlService, targetPath, options)
    //$cordovaFileTransfer.upload("http://fbapp.brm.com.co/fbappFundacion/appFeedback/prueba.php", targetPath, options)
    .then(function(result) {
      dfd.resolve(result);
    }, function(data) {
      dfd.reject(data);
    });
    return dfd.promise;
  };
})

.service('ServiceSugerenciaData', function (){
  var sugerencia={};
  // Guardamos el id de la marca
  this.setMarca = function(idMarca) {
    sugerencia.idMarca = idMarca;
    console.log("setMarca",sugerencia);
  };
  // Guardamos el titulo y la descripción
  this.setPaso1 = function(parameters) {
    sugerencia.titulo = parameters.titulo;
    sugerencia.descripcion = parameters.descripcion;
    console.log("setPaso1",sugerencia);
  };
  // Guardamos el objetivo
  this.setPaso2 = function(objetivo) {
    sugerencia.objetivo = objetivo;
    console.log("setPaso2",sugerencia);
  };

  this.get = function() {
    console.log("get",sugerencia);
    return sugerencia;
  };

  this.reset = function() {
    sugerencia={};
  };

});