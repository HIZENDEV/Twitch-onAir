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

setTimeout(function () {
  chrome.storage.sync.get(['username'], function (result) {
    request(result)
  });
}, 1000);


// chrome.storage.sync.get(['username'], function(result) {
//   request(result)
// });

var twitchUrl = null

function request(streamer) {
  var xhr = new XMLHttpRequest();
  if (streamer.username) {
    document.getElementById('usernameInput').value = streamer.username
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/" + streamer.username + "?client_id=d09letk8omg0i0acrqnfmg42irtqxt", true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        var data = JSON.parse(xhr.responseText);
        if(data["stream"]){
          show("container")
          hide('nothing')
          twitchUrl = data.stream.channel.url || 'https://twitch.tv'
          chrome.browserAction.setIcon({path: 'img/online.png'})
          document.getElementById('preview').src = data.stream.preview.large || ''
          document.getElementById('displayName').innerHTML = data.stream.channel.display_name || ''
          document.getElementById('userImage').src = data.stream.channel.logo || ''
          document.getElementById('title').innerHTML = data.stream.channel.status || ''
          document.getElementById('game').innerHTML = data.stream.channel.game || ''
          hide('loading')
        } else {
          hide("container")
          show('nothing')
          hide('loading')
          document.getElementById("info").innerHTML = 'You will be notified for the next stream'
          chrome.browserAction.setIcon({path: 'img/offline.png'})
        }
      }
    }
    xhr.send();
    document.getElementById("username").innerHTML = streamer.username|| ''
    hide('loading')
  } else {
    hide("container")
    show("nothing")
    document.getElementById("info").innerHTML = 'You should submit a streamer username'
  }
}


document.getElementById("submit").onclick = function() {
  registerStreamer()
};


document.getElementById("container").onclick = function () {
  var win = window.open(twitchUrl, '_blank');
  win.focus();
};

document.onkeydown = function () {
  if (window.event.keyCode == '13') {
    registerStreamer()
  }
}

function show(id) {
  var e = document.getElementById(id);
  if (e.style.display == 'none')
    e.style.display = 'block';
  else
    e.style.display = 'block';
}

function hide(id) {
  var e = document.getElementById(id);
  if (e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'none';
}