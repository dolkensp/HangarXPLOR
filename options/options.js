"use strict";

var browser = chrome || browser;

function saveOptions() {
  var showMeltValues = document.getElementById("showMeltValues").checked;

  browser.storage.local.set({
    showMeltValues: showMeltValues
  }, function () {
    // Alert the user that the save was successful
    var status = document.getElementById("status");
    status.textContent = "Options saved successfully!";
    setTimeout(function () {
      status.textContent = "";
    }, 1000);
  });
}

function loadOptions() {
  browser.storage.local.get({
    showMeltValues: true
  }, function (items) {
    document.getElementById("showMeltValues").checked = items.showMeltValues;
  });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.getElementById("save").addEventListener("click", saveOptions);
