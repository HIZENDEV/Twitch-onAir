twitchListen();

setInterval(function() {
  twitchListen()
}, 60000);

function twitchListen() {
  chrome.storage.sync.get(['username'], function(result) {
    request(result)
  });
}

function request(streamer) {
  var xhr = new XMLHttpRequest();
  if (streamer.username) {
    document.getElementById('usernameInput').value = streamer.username
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/" + streamer.username + "?client_id=d09letk8omg0i0acrqnfmg42irtqxt", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var data = JSON.parse(xhr.responseText);
        if (data["stream"]) {
          show("container")
          hide('nothing')
          chrome.browserAction.setIcon({ path: 'img/online.png' })
          document.getElementById('preview').src = data.stream.preview.large || ''
          document.getElementById('displayName').innerHTML = data.stream.channel.display_name || ''
          document.getElementById('userImage').src = data.stream.channel.logo || ''
          document.getElementById('title').innerHTML = data.stream.channel.status || ''
          document.getElementById('game').innerHTML = data.stream.channel.game || ''
        } else {
          hide("container")
          show('nothing')
          document.getElementById("info").innerHTML = 'You will be notified for the next stream'
          chrome.browserAction.setIcon({ path: 'img/offline.png' })
        }
      }
    }
    xhr.send();
    document.getElementById("username").innerHTML = streamer.username || ''
  } else {
    hide("container")
    show('nothing')
    document.getElementById("info").innerHTML = 'You should submit a streamer username'
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