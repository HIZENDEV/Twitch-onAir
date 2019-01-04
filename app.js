function registerStreamer() {
  // Get a value saved in a form.
  var value = document.getElementById('usernameInput').value
  // Check that there's some code there.
  if (!value) {
    message('Error: No value specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({
    'username': value
  }, function() {
    chrome.storage.sync.get(['username'], function(result) {
      request(result)
    });
  });
}



chrome.storage.sync.get(['username'], function(result) {
  request(result)
});

function request(streamer) {
  var xhr = new XMLHttpRequest();
  if (streamer.username) {
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/" + streamer.username + "?client_id=d09letk8omg0i0acrqnfmg42irtqxt", true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        var data = JSON.parse(xhr.responseText);
        if(data["stream"]){
          document.getElementById("info").innerHTML = 'yes';
          chrome.browserAction.setIcon({path: 'img/online.png'})
        } else {
          document.getElementById("info").innerHTML = 'no';
          chrome.browserAction.setIcon({path: 'img/offline.png'})
        }
      }
    }
    xhr.send();
    document.getElementById("username").innerHTML = streamer.username;
  } else {
    document.getElementById("username").innerHTML = 'You should add a streamer username';
  }
}


document.getElementById("submit").onclick = function() {
  registerStreamer()
};
