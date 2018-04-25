// Preloading Variables/Functions
var timing = false;
updateAssignments();
$(document).ready(function() {
	$(document).on("click", "li.assignment", function() {
		if (!timing) {
			console.log(parseInt($(this).children('.assignment_time')[0].innerText));
			chrome.runtime.sendMessage({start_assignment: {id: parseInt($(this).attr('data-assignmentId')), name: $(this).children('.assignment_name')[0].innerText, time: parseInt($(this).children('.assignment_time')[0].innerText)}});
		} 
	});
});

// Update URL Blacklist
chrome.storage.sync.get(['blacklist'], function(blacklist) {
	for (var i=0; i<blacklist.blacklist.length; i++) {
		$("#website_list").append("<li class='website'><p class='website_name'>" + blacklist.blacklist[i].name + "</p><p class='website_link'>" + blacklist.blacklist[i].link + "</p></li>");
	}
	console.log("blacklist updated");
})

// Check for Form Submission
$("#assignmentForm").submit(function() {
	processAssignment();
	return false;
});

$("#blacklistForm").submit(function() {
	processLink();
	return false;
})

// Message Listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.greeting == "hello") {
      	console.log("messaged!");
      	sendResponse({farewell: "goodbye"});
    }
});

// Helper Functions
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function updateAssignments() {
	chrome.storage.local.get(['assignments'], function(assignments) {
		$("#assignment_list").empty();
		for (var i=0; i<assignments.assignments.length; i++) {
			$("#assignment_list").append("<li data-assignmentId='" + assignments.assignments[i].id + "' class='assignment'><p class='assignment_name'>" + assignments.assignments[i].name + "</p><p class='assignment_time'>" + assignments.assignments[i].time/60 + " min.</p></li>");
		}
	}); 
}

// Constantly Loading Functions
var stopwatch = setInterval(function() {
	chrome.storage.local.get(['currTime'], function(time) {
		var timerStr = pad(Math.floor(time.currTime/3600)%60,2) + " : " + pad(Math.floor(time.currTime/60)%60,2) + " : " + pad(time.currTime%60,2);
		$('#timer').html(timerStr);
		if (time.currTime <= 0) timing = false;
		else timing = true;
	});
}, 100);

// Form Processing Functions
function processAssignment() {
	var name = document.forms["assignmentForm"]["name"].value;
	var desc = document.forms["assignmentForm"]["desc"].value;
	var time = document.forms["assignmentForm"]["time"].value;
	if (name=="") {
		alert("Name must be filled out");
		return false;
	} else if (time<=0) {
		alert("The time must be a value above 10 minutes");
		return false;
	} else {
		var id = (new Date()).getTime();
		$("#assignment_list").append("<li data-assignmentId='" + id + "' class='assignment'><p class='assignment_name'>" + name + "</p><p class='assignment_time'>" + time + " min.</p></li>");
		chrome.runtime.sendMessage({add_assignment: {id: id, name: name, desc: desc, time: time*60}});
		return true;
	}
}
function processLink() {
	var name = document.forms["blacklistForm"]["name"].value;
	var link = document.forms["blacklistForm"]["website"].value;
	if (link=="") {
		alert("Please input website link");
		return false;
	} else {
		$("#website_list").append("<li class='website'><p class='website_name'>" + name + "</p><p class='website_link'>" + link + "</p></li>");
		chrome.runtime.sendMessage({add_website: {name: name, link: link}});
		console.log("website added");
		return true;
	}
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// 	console.log(sender.tab ?
// 		"from a content script: " + sender.tab.url :
// 		"from the extension");
// 	if (request.greeting == "hello") console.log("success!");
// });
