// $('.button').click(function() {
//    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
//      var url = tabs[0].url;
//      console.log(url);
//    });
// });

chrome.storage.sync.get(['assignments'], function(assignments) {
	for (var i=0; i<assignments.assignments.length; i++) {
		console.log(assignments.assignments[i].name + ": " + assignments.assignments[i].time);
		$("#assignment_list").append("<li class='assignment' id='" + i + "'>" + assignments.assignments[i].name + "</li>");
	}
	console.log("assignment updated");
});

$("#assignmentForm").submit(function() {
	processForm();
	return false;
});

$("#startButton").click(function() {
	chrome.runtime.sendMessage({start_assignment: true})
});

function processForm() {
	var name = document.forms["assignmentForm"]["name"].value;
	var desc = document.forms["assignmentForm"]["desc"].value;
	var time = document.forms["assignmentForm"]["time"].value;
	if (name=="") {
		alert("Name must be filled out");
		return false;
	} else if (time<10) {
		alert("The time must be a value above 10 minutes");
		return false;
	} else {
		$("#assignment_list").empty();
		chrome.runtime.sendMessage({add_assignment: {name: name, desc: desc, time: time*60}});
		chrome.storage.sync.get(['assignments'], function(assignments) {
			for (var i=0; i<assignments.assignments.length; i++) {
				console.log(assignments.assignments[i].name + ": " + assignments.assignments[i].time);
				$("#assignment_list").append("<li class='assignment' id='" + i + "'>" + assignments.assignments[i].name + "</li>");
			}
			console.log("assignment updated");
		});
		return true;
	}
}

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// 	console.log(sender.tab ?
// 		"from a content script: " + sender.tab.url :
// 		"from the extension");
// 	console.log("assignment updated");
// 	updateAssignments();
// });

// $('#start-button').click(function() {
// 	console.log("started timer");
// 	startTimer(10);
// });
