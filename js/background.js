var timer = null;

function goOptions() {
  chrome.tabs.create({url : "options.html"});
}

function refresh() {
  if (timer != null) {
    clearTimeout(timer);
  }
  startRequest();
}

function startRequest() {
  updateIssues();
  scheduleRequest();
}

function scheduleRequest() {
  timer = window.setTimeout(startRequest, settings.checkInterval * 60 * 1000);
}

function updateIssues() {
  if (!settings.redmineUrl) {
    return;
  }
  $.ajax({
    type: "GET",
    url: getFeedUrl(),
    cache: false,
    dataType: "xml",
    timeout: 10000,
    success: function(data) {
      var lastReaded   = new Date(0),
        lastNotified = new Date(0),
        unreadCount = 0,
        issues = $(data).find("issue");

      if (localStorage["lastReaded"]) {
        lastReaded.setTime(localStorage["lastReaded"]);
      }
      if (localStorage["lastNotified"]) {
        lastNotified.setTime(localStorage["lastNotified"]);
      } else {
        lastNotified.setTime(lastReaded.getTime());
      }

      $(issues.get().reverse()).each(function() {
        var updatedOn = new Date($(this).find("updated_on").text());
        if (lastNotified < updatedOn) {
          lastNotified.setTime(updatedOn.getTime());
          if (unreadCount < 4) {
            showNotification($(this));
          }
        }
        if (lastReaded < updatedOn) {
          unreadCount++;
        }
      });
      drawBadge(unreadCount);
      localStorage["lastNotified"] = lastNotified.getTime();
    }
  });
}

function requestPermission(callback) {
  webkitNotifications.requestPermission(callback);
}

function showNotification(issue) {
  if (window.webkitNotifications.checkPermission() > 0) {
    requestPermission(showNotification);
  } else {
    var n = window.webkitNotifications.createNotification("img/icon.png",
      issue.children("subject").text(),
      issue.children("description").text());
    n.ondisplay = function() {
      setTimeout(function() { n.cancel() }, 10000);
    };
    n.show();
  }
}

startRequest();