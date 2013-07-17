// Saves options to localStorage.
function save_options() {
  var url = $("#redmineUrl").val();
  if(url.charAt(url.length - 1) == '/')
    $("#redmineUrl").val(url.substring(0, url.length-1));

  if($("#checkInterval").val() < 1) {
    $("#message-checkInterval").text("Must be positive number.");
    $("#checkInterval").val(5);
    setTimeout(function() {
      $("#message-checkInterval").empty();
    }, 3000);
    return;
  }
  $(".setting-item").each(function() {
    var id = $(this).attr("id");
    settings[id] = $(this).val();
  });
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 1000);
  chrome.extension.getBackgroundPage().refresh();
}

$(document).ready(function() {
  $("#save").click(save_options);
  $(".setting-item").each(function() {
    var id = $(this).attr("id");
    $(this).val(settings[id]);
  });

  $("#advanced-settings-label").toggle(
    function() { $("#advanced-settings").show(); $("#advanced-settings-label .collapse-icon").text("-"); },
    function() { $("#advanced-settings").hide(); $("#advanced-settings-label .collapse-icon").text("+"); }
  );
});

