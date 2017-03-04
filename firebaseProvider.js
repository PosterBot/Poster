var firebase = require('firebase'),
    winston = require('winston'),
    fileManager = require('./fileManager'),
    colors = require('colors'),
  	provider = require('./firebaseProvider');

    require("firebase/auth");
    require("firebase/database");

function settings() {
  var settingsURL = "./settings/local_settings/firebase.json";
  var settings = fileManager.readDataFromJson(settingsURL);

  if (settings && settings.settings) {
    return settings
  } else {
    log('error', 'Can\'t found config. Please check URL: ' + settingsURL);
    return false
  }
}

var init = function (authBind) {
  var config = settings();
  if (config) {
      log('info', "Initialize App");
      firebase.initializeApp(config.settings);
      if (config.auth) {
        var auth = config.auth
        log('info', "Trying to authorization");
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            log('info', "Succefull authorization with " + user.email);
            authBind();
          } else {
            // User is signed out.
            log('info', "Signed out");
          }
        });

        firebase.auth().signInWithEmailAndPassword(auth.email, auth.password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          log('error',  errorCode + ": " + errorMessage);
        });
      } else {
        log('info', "Auth settings not found. Skiping authorization");
      }
      return true
  }

  return false
}

var API = {
  telegram: "telegram",
  vk: "vkontakte"
}

var apiConfig = function(updateBind) {
  for (var api in API) {
    apiKey(api)
  }
  firebase.database().ref('settings/apiKeys').on('value', function(snapshot) {
    if (snapshot.val()) {
      log('info', 'API config updated')
      updateBind(snapshot.val())
    }
  })

}

var apiKey = function(api, updateBind) {
  log('info', "Getting " + colors.blue(api) + " API config")
  var apiKeys = firebase.database().ref('settings/apiKeys')
  apiKeys.child(api).on('value', function(snapshot) {
    if (snapshot.val()) {
      log('info', 'Got ' + colors.blue(api) + " API config")
      updateBind(snapshot.val())
    } else {
      setDefaultApiData(api)
    }

  });
}

function setDefaultApiData(api) {
  log('info', "Reset config for " + colors.blue(api))
  var apiKey = firebase.database().ref('settings/apiKeys/' + api)
  if (api == API.vk) {
    apiKey.set({
      token: "",
      url: "https://oauth.vk.com/authorize?client_id=51111&scope=offline,group,photos,wall&display=page&response_type=token&redirect_uri=https://oauth.vk.com/blank.html"
    })
  } else {
    apiKey.set({
      token: "",
      googleApiKey: ""
    });
  }
}

function log(level, message) {
  // TODO: Need to create a global method with a enum of message groups
  winston.log(level, colors.red("Firebase"), message)
}


module.exports.init = init;
module.exports.apiConfig = apiConfig;
module.exports.apiKey = apiKey;
module.exports.API = API;
