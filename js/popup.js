function getNotes(issueId) {
$.get(getBaseUrl() + "/issues/" + issueId + '.xml?include=journals&key=' + settings.apiKey,
      function(data) {
      $(data).find("journal:last").each(function() {
          var name = $(this).children("user").attr("name");
          var notes = $(this).children("notes").text();
          $(this).children("notes")
          $("#notes-"+issueId).append(
          $("<dl/>").append($("<dt/>").text("From " + name + ":"))
              .append($("<dd/>").text(notes))
          );
      });
      });
}

setTimeout(function() {
  if(!localStorage["redmineUrl"]) {
    $("#loaging-message").text("You should set up the first.");
    chrome.extension.getBackgroundPage().goOptions();
    return;
  }
  var lastReaded = new Date(0);
  if(localStorage["lastReaded"]) {
    lastReaded.setTime(localStorage["lastReaded"]);
  }
  $.ajax({
    url: getFeedUrl(),
    type: 'GET',
    cache: false,
    success: function(data) {
    $("#loading-message").remove();
    $("#header").show();
    $(data).find("issue:lt(5)").each(function() {
      var issue = $(this);
      var updatedOn = new Date(issue.find("updated_on").text());
      if(lastReaded < updatedOn) {
        lastReaded.setTime(updatedOn.getTime());
      }
                
      var ticket = $('<div class="ticket"/>');
      var issueId = issue.find("id").text();
      ticket.append(
        $("<a/>")
          .attr("href", getBaseUrl() + "/issues/" + issueId)
          .attr("target", "_blank")
          .text(issue.find("subject").text())
      );
      ticket.append(
        $("<p/>").text(issue.find("description").text())
      );
      ticket.append($("<div/>").attr("id", "notes-" + issueId));
      getNotes(issueId);
      $("body").append(ticket);
    });
    localStorage["lastReaded"]   = lastReaded.getTime();
    localStorage["lastNotified"] = lastReaded.getTime();
    drawBadge(0);
    },
    error: function(request, status, e) {
      $("#loading-message").text("Failed to load.");
    }
  });
}, 0);


$("#setting").click(function () {
  chrome.extension.getBackgroundPage().goOptions();
});
