angular.module('starter.controllers', ['ionic','ngCordova','ngCordovaOauth'])

.controller('menu', function($scope, $stateParams, $ionicLoading, $ionicPopup, $state, $cordovaOauth, $ionicHistory, ServiceGeneral) {
  var userData = ServiceGeneral.getUserData();
  if (userData) {
    $scope.imagen = userData.imagen;
    $scope.nombre = userData.nombre;
    $scope.email = userData.email;
  }
  // Cerrar sesión
  $scope.unlogin = function(){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    ServiceGeneral.deleteUser();
    $state.go('app.login');
  }
})

.controller('register', function($scope, $stateParams, $ionicLoading, $ionicPopup, $state, $cordovaOauth, $ionicHistory, ServiceGeneral) {
  
  var userData = ServiceGeneral.getUserData();
  if (userData) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.suggestions-row');
  }

  // Registro de invitado
  $scope.doLogin = function(usuario){
    if (usuario && usuario.username && usuario.username != "" && usuario.email && usuario.email != "" && ServiceGeneral.validEmail(usuario.email)) {
      $ionicLoading.show({
        template: 'Cargando...'
      });
      var parameters = {
        accion : "setInvitado",
        nombre : usuario.username,
        email : usuario.email
      };
      ServiceGeneral.post(parameters)
      .then(function(result){
        $ionicLoading.hide();
        if(result.error == 1){
          ServiceGeneral.setUserData({idUsuario: result.data, nombre: usuario.username, email: usuario.email, imagen: ''});
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.suggestions-row');
        }else if(result.error == 2){
          $ionicPopup.alert({
            title: 'Warning',
            template: 'El usuario ya existe'
          });
        }else if(result.error == 3){
          $ionicPopup.alert({
            title: 'Datos incorrectos',
            template: 'Por favor ingresa nombre y correo correctamente'
          });
        }else{
          $ionicPopup.alert({
            title: 'Ocurrió un error',
            template: 'Por favor intenta de nuevo'
          });
        }
      },function(err){
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Sin conexión a Internet',
          content: 'Lo sentimos, no se detectó ninguna conexión a Internet. Vuelve a conectarte e inténtalo de nuevo.'
        });
      });
    }else{
      $ionicPopup.alert({
        title: 'Datos incorrectos',
        template: 'Por favor ingresa nombre y correo correctamente'
      });
    }
  }
})

.controller('login', function($scope, $stateParams, $ionicLoading, $ionicPopup, $state, $cordovaOauth, $ionicHistory, ServiceGeneral) {
  $scope.menu="white"; 
  var userData = ServiceGeneral.getUserData();
  if (userData) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.suggestions-row');
  }

  // Login por medio de gmail
  $scope.doLogin = function() {
    $cordovaOauth.google("1041899427311-k4fabaje85gsu3hv26fkssre93igqjia.apps.googleusercontent.com", ["email", "profile"]).then(function(result) {
      ServiceGeneral.gmail(result.access_token)
      .then(function(user) {
        var domain = user.data.domain;
        var usuario = {};
        if (domain == "brm.com.co" || domain == "a3bpo.co" || domain == "preferente.com.co" || domain == "deeploy.co") {
          usuario.nombre = user.data.name.givenName;
          usuario.apellido = user.data.name.familyName;
          usuario.imagen = user.data.image.url;
          usuario.email = user.data.emails[0].value;
          $ionicLoading.show({
            template: 'Cargando...'
          });
          var parameters = {
            accion : "setUsuarioBrm",
            nombre : usuario.nombre,
            apellido : usuario.apellido,
            imagen : usuario.imagen,
            email : usuario.email
          };
          ServiceGeneral.post(parameters)
          .then(function(result){
            $ionicLoading.hide();
            if(result.error == 1){
              ServiceGeneral.setUserData({idUsuario: result.data, nombre: usuario.nombre, email: usuario.email, imagen: usuario.imagen});
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              $state.go('app.suggestions-row');
            }else{
              $ionicPopup.alert({
                title: 'Ocurrió un error',
                template: 'Por favor intenta de nuevo'
              });
            }
          },function(err){
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Sin conexión a Internet',
              content: 'Lo sentimos, no se detectó ninguna conexión a Internet. Vuelve a conectarte e inténtalo de nuevo.'
            });
          });
        }else{
          $ionicPopup.alert({
            title: 'Usuario incorrecto',
            content: 'Esta cuenta no está permitida'
          });
        };
      }, function(error) {
        console.log("Error: " + error);
      });
    }, function(error) {
      console.log("Auth Failed..!! Error: "+error);
    });
  };
})

.controller('suggestions', function($scope, $stateParams, $ionicLoading, $ionicPopup, $state, $cordovaOauth, $ionicModal, ServiceGeneral, ServiceSugerenciaData) {
  $scope.menu="white";
  $scope.paramName="";
  var userData = ServiceGeneral.getUserData();
  $scope.suggestions = [];

  $scope.getSuggestions = function(){
    $ionicLoading.show({
      template: 'Cargando...'
    });
    var parameters = {
      accion : "getListaSugerencia",
      idUsuario : userData.idUsuario
    };
    ServiceGeneral.post(parameters)
    .then(function(result){
      $ionicLoading.hide();
      if(result.error == 1){
        // traemos el listado de sugerencias
        $scope.suggestions = result.data;
      }else if(result.error == 2){
        // No hay sugerencias 

        //Falta poner mensaje
      }else if(result.error == 3){
        // usuario no existe
        $ionicPopup.alert({
          title: 'Usuario incorrecto',
          template: 'Ingresa tus datos'
        });
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        ServiceGeneral.deleteUser();
        $state.go('app.login');
      }else{
        $ionicPopup.alert({
          title: 'Ocurrió un error',
          template: 'Por favor intenta de nuevo'
        });
      }
    },function(err){
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Sin conexión a Internet',
        content: 'Lo sentimos, no se detectó ninguna conexión a Internet. Vuelve a conectarte e inténtalo de nuevo.'
      });
    });
  }

  $scope.doRefresh = function() {
    $scope.getSuggestions();
  };

  if (userData) {
    $scope.getSuggestions();
  }else{
    $ionicPopup.alert({
      title: 'Usuario incorrecto',
      content: 'Ingresa tus datos'
    });
    $state.go('app.login');
  }

  $ionicModal.fromTemplateUrl('templates/companies.html', {
    scope: $scope
  }).then(function(modalCompanies) {
    $scope.modalCompanies = modalCompanies;
  });

  // Ordenar titulo || fecha || calificacion
  $scope.orderList = function(campo){
    $scope.paramName=campo;
    $scope.reverse=!$scope.reverse;
    $scope.closeOrder();
  }

  // Filtar marca
  $scope.filterList = function(campo){
    $scope.brandName=campo;
    $scope.closeFilter();
  }

  $scope.closeCompanies = function() {
    $scope.modalCompanies.hide();
  };

  $scope.createSuggerence = function() {
    $scope.modalCompanies.show();
  };

  $ionicModal.fromTemplateUrl('templates/filter.html', {
    scope: $scope
  }).then(function(modalFilter) {
    $scope.modalFilter = modalFilter;
  });

  $scope.closeFilter = function() {
    $scope.modalFilter.hide();
  };

  $scope.filter = function() {
    $scope.modalFilter.show();
  };


  $ionicModal.fromTemplateUrl('templates/order.html', {
    scope: $scope
  }).then(function(modalOrder) {
    $scope.modalOrder = modalOrder;
  });

  $scope.closeOrder = function() {
    $scope.modalOrder.hide();
  };

  $scope.order = function() {
    $scope.modalOrder.show();
  };

  $scope.viewSquare = function() {
      $state.go('app.suggestions-square');
  };

  $scope.viewRow = function() {
      $state.go('app.suggestions-row');
  };

  $scope.stepone = function(idMarca) {
    $scope.closeCompanies();
    ServiceSugerenciaData.setMarca(idMarca);
    $state.go('app.stepone');
  };
})

.controller('suggestionDetail', function($scope, $stateParams, $ionicLoading, $ionicPopup, $state, $cordovaOauth, ServiceGeneral) {
  $scope.suggestion = {};
  $scope.idSugerencia = 0;
  if ($stateParams.suggestionid != null && $stateParams.suggestionid != "") {
    $scope.idSugerencia = $stateParams.suggestionid;
    $ionicLoading.show({
      template: 'Cargando...'
    });
    var parameters = {
      accion : "getSugerencia",
      idSugerencia : $scope.idSugerencia
    };
    ServiceGeneral.post(parameters)
    .then(function(result){
      $ionicLoading.hide();
      if(result.error == 1){
        // traemos el resultado
        $scope.suggestion = result.data;
      }else{
        $ionicPopup.alert({
          title: 'Ocurrió un error',
          template: 'Por favor intenta de nuevo'
        });
        // Falta Redirigir al listado de sugerencias
      }
    },function(err){
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Sin conexión a Internet',
        content: 'Lo sentimos, no se detectó ninguna conexión a Internet. Vuelve a conectarte e inténtalo de nuevo.'
      });
      // Falta Redirigir al listado de sugerencias
    });
  }else{
    $ionicPopup.alert({
      title: 'Warning',
      content: 'Sugerencia incorrecta'
    });
    // Falta Redirigir a tipo usuario
  }

  // Calificar sugerencia
  $scope.setQualification = function(cantidad) {
    var userData = ServiceGeneral.getUserData();
    if (userData) {
      if ($scope.idSugerencia > 0) {
        var parameters = {
          accion : "setCalificacion",
          idUsuario : userData.idUsuario,
          idSugerencia : $scope.idSugerencia,
          cantidad : cantidad
        };
        ServiceGeneral.post(parameters)
        .then(function(result){
          if(result.error == 1){
            // traemos el resultado
            $state.go($state.current, {}, {reload: true});
          }else if(result.error == 2){
            $ionicPopup.alert({
              title: 'Calificación',
              template: 'Ya calificaste esta sugerencia'
            });
          }else {
            $ionicPopup.alert({
              title: 'Ocurrió un error',
              template: 'Intenta de nuevo'
            });
          }
          $ionicLoading.hide();
        },function(err){
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Sin conexión a Internet',
            content: 'Lo sentimos, no se detectó ninguna conexión a Internet. Vuelve a conectarte e inténtalo de nuevo.'
          });
          $state.go('app.suggestions-row');
        });
      }else{
        $ionicPopup.alert({
          title: 'Warning',
          content: 'Sugerencia incorrecta'
        });
        $state.go('app.suggestions-row');
      }
    }else{
      // usuario no existe
      $ionicPopup.alert({
        title: 'Usuario incorrecto',
        template: 'Ingrese sus datos'
      });
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      ServiceGeneral.deleteUser();
      $state.go('app.login');
    }
  }
})

.controller('createSuggerence', function($scope, $stateParams, $ionicLoading, $ionicPopup, $state, $cordovaOauth, $ionicHistory, $ionicModal, $timeout, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $cordovaActionSheet, ServiceGeneral, ServiceSugerenciaData) {

  $scope.message=""; 
  $scope.image = null;
  $scope.statusFinish = false;
  $scope.data = {}
  $scope.data.title = ServiceSugerenciaData.get().titulo;
  $scope.data.description = ServiceSugerenciaData.get().descripcion;
  $scope.data.objetive = ServiceSugerenciaData.get().objetivo;

  // Modal de la alerta
  $ionicModal.fromTemplateUrl('templates/alert.html', {
    scope: $scope
  }).then(function(modalAlert) {
    $scope.modalAlert = modalAlert;
  });

  // Cerrar alerta
  $scope.closeAlert = function() {
    if (!$scope.statusFinish) {
      $scope.modalAlert.hide();
    }else{
      $scope.modalAlert.hide();
      $state.go('app.suggestions-row');
    }
  };

  // Abrir alerta
  $scope.openAlert = function() {
    $scope.modalAlert.show();
  };

  // Click finalizar sin subir imagen
  $scope.finishWithoutImg = function() {
    if ($scope.data.objetive != "" && $scope.data.objetive != undefined) {
      ServiceGeneral.setStatusImg(false);
      ServiceSugerenciaData.setPaso2($scope.data.objetive);
      $scope.message="Estás seguro que deseas guardar sin subir una imagen"; 
      $scope.openAlert();
    } else{
      $ionicPopup.alert({
        title: 'Datos incorrectos',
        content: 'Verifica que el objetivo este correctos'
      });
    };
  };


  // Click del Paso 1 al paso 2
  $scope.steptwo = function() {
    if ($scope.data.title != "" && $scope.data.title != undefined && $scope.data.description != "" && $scope.data.description != undefined) {
      ServiceSugerenciaData.setPaso1({titulo: $scope.data.title, descripcion: $scope.data.description});
      $state.go('app.steptwo');
    } else{
      $ionicPopup.alert({
        title: 'Datos incorrectos',
        content: 'Verifica que el título y la descripción esten correctos'
      });
    };
  }

  // Click del Paso 2 al paso 3
  $scope.stepthree = function() {
   if ($scope.data.objetive != "" && $scope.data.objetive != undefined) {
      ServiceSugerenciaData.setPaso2($scope.data.objetive);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      ServiceGeneral.setStatusImg(true);
      $state.go('app.stepthree');
    } else{
      $ionicPopup.alert({
        title: 'Datos incorrectos',
        content: 'Verifica que el objetivo este correcto'
      });
    };
  }

  // Present Actionsheet for switch beteen Camera / Library
  $scope.loadImage = function() {
    var options = {
      title: 'Seleccione la fuente',
      buttonLabels: ['Galería de fotos', 'Usar la cámara'],
      addCancelButtonWithLabel: 'Cancelar',
      androidEnableCancelButton : true,
    };
    $cordovaActionSheet.show(options).then(function(btnIndex) {
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type);
      }
    });
  };

  $scope.pathForImage = function(imagen){
    return ServiceGeneral.pathForImage(imagen);
  }

  // Take image with the camera or from library and store it inside the app folder
  // Image will not be saved to users Library.
  $scope.selectPicture = function(sourceType) {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false
    };
   
    $cordovaCamera.getPicture(options).then(function(imagePath) {
      // Grab the file name of the photo in the temporary directory
      var currentName = imagePath.replace(/^.*[\\\/]/, '');
   
      //Create a new name for the photo
      var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
   
      // If you are trying to load image from the gallery on Android we need special treatment!
      if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        window.FilePath.resolveNativePath(imagePath, function(entry) {
          window.resolveLocalFileSystemURL(entry, success, fail);
          function fail(e) {
            console.error('Error: ', e);
          }
          
          function success(fileEntry) {
            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
            // Only copy because of access rights
            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          };
        }
      );
      } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
          $scope.image = newFileName;
          console.log("$scope.image ----",$scope.image);
        }, function(error){
          $scope.showAlert('Error', error.exception);
        });
      }
    },
    function(err){
      // Not always an error, maybe cancel was pressed...
    })
  };

  // Guardar la sugerencia
  $scope.finish = function(data) {
    if (!$scope.statusFinish) {
      statusImg = ServiceGeneral.getStatusImg();
      console.log("$scope.statusImg",statusImg);
      console.log("$scope.image",$scope.image);
      if (statusImg == true && $scope.image != null && $scope.image != "" || statusImg == false && $scope.image == null) {
        var sugerencia = ServiceSugerenciaData.get();
        var userData = ServiceGeneral.getUserData();
        if (userData) {
          if (sugerencia && 
              sugerencia.idMarca && sugerencia.idMarca != "" && sugerencia.idMarca != undefined &&
              sugerencia.titulo && sugerencia.titulo != "" && sugerencia.titulo != undefined &&
              sugerencia.objetivo && sugerencia.objetivo != "" && sugerencia.objetivo != undefined &&
              sugerencia.descripcion && sugerencia.descripcion != "" && sugerencia.descripcion != undefined) {
            $ionicLoading.show({
              template: 'Cargando...'
            });
            var parameters = {
              accion : "setSugerencia",
              idUsuario : userData.idUsuario,
              idMarca : sugerencia.idMarca,
              imagen : $scope.image,
              titulo : sugerencia.titulo,
              objetivo : sugerencia.objetivo,
              descripcion : sugerencia.descripcion
            };
            console.log($scope.image);
            if ($scope.image != null) {
              ServiceGeneral.uploadFile(parameters)
              .then(function(result){
                console.log("upload result",JSON.stringify(result.response));
                $scope.finishError(JSON.parse(result.response));
              },function(err){
                console.log(JSON.stringify(err));
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: 'Ocurrio un error',
                  content: 'Por favor intenta de nuevo'
                });
              });
            } else{
              ServiceGeneral.post(parameters)
              .then(function(result){
                console.log("upload result",result);
                $scope.finishError(result);
              },function(err){
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: 'Sin conexión a Internet',
                  content: 'Lo sentimos, no se detectó ninguna conexión a Internet. Vuelve a conectarte e inténtalo de nuevo.'
                });
              });
            };
              
          }else{
            $ionicPopup.alert({
              title: 'Datos incorrectos',
              template: 'Por favor ingresa los datos de nuevo'
            });
            $state.go('app.companies');
          }
        }else{
          $ionicPopup.alert({
            title: 'Usuario incorrecto',
            template: 'Ingresa tus datos'
          });
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          ServiceGeneral.deleteUser();
          $state.go('app.login');
        }
      }else{
        if(statusImg == true && $scope.image == null){
          $ionicPopup.alert({
            title: 'Imagen incorrecta',
            template: 'Por favor selecciona una imagen'
          });
        }
      }
    }else{
      $scope.closeAlert();
      $state.go('app.suggestions-row');
    }
  }

  // Errores al guardar la sugerencia
  $scope.finishError = function(result) {
    $ionicLoading.hide();
    if(result.error == 1){
      console.log(result.data);
      // Reiniciamos variables
      ServiceSugerenciaData.reset();
      // Cerramos alerta
      $scope.closeAlert();
      // Mostramos que se a creado correctamnete
      $timeout(function() {
        $scope.message="Se ha creado la sugerencia correctamente"; 
        $scope.statusFinish = true;
        $scope.openAlert();
      }, 600);
    }else if(result.error == 2){
      // usuario no existe
      $ionicPopup.alert({
        title: 'Usuario incorrecto',
        template: 'Ingrese sus datos'
      });
      ServiceGeneral.deleteUser();
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.login');
    }else if(result.error == 3){
      $ionicPopup.alert({
        title: 'Datos incorrectos',
        template: 'Por favor ingresa de nuevo los datos'
      });
      $state.go('app.companies');
    }else if(result.error == 4){
      $ionicPopup.alert({
        title: 'Imagen demasiado pesada',
        template: 'Por favor sube otra imagen'
      });
      $state.go('app.companies');
    }else{
      $ionicPopup.alert({
        title: 'Ocurrió un error',
        template: 'Por favor intenta de nuevo'
      });
    }
  }
});
