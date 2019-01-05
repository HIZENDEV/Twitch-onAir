twitchListen();

setInterval(function() {
  twitchListen()
}, 3000);

function twitchListen() {
  chrome.storage.sync.get(['username'], function(result) {
    request(result)
  });
}
var twitchUrl = null
var notificationInfo = {}
var notificationReady = true
function request(streamer) {
  var xhr = new XMLHttpRequest();
  if (streamer.username) {
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/" + streamer.username + "?client_id=d09letk8omg0i0acrqnfmg42irtqxt", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var data = JSON.parse(xhr.responseText);
        if (data["stream"]) {
          twitchUrl = data.stream.channel.url || 'https://twitch.tv'
          notificationInfo.type = 'basic';
          notificationInfo.iconUrl = 'img/online.png';
          notificationInfo.title = data.stream.channel.display_name + ' is now streaming!';
          notificationInfo.message = data.stream.channel.status || 'Click to join the stream';
          chrome.browserAction.setIcon({ path: 'img/online.png' })
          if (notificationReady) {
            chrome.notifications.create(notificationInfo, callback);
          }
        } else {
          chrome.browserAction.setIcon({ path: 'img/offline.png' })
          notificationReady = true
        }
      }
    }
    xhr.send();
  }
}
chrome.notifications.onClicked.addListener(redirectWindow)

function callback() {
  notificationReady = false
  notificationInfo = {}
}

function redirectWindow() {
  var win = window.open(twitchUrl, '_blank');
  win.focus();
}