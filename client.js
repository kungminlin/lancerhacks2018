var timing = false;

$(document).ready(function() {
	$(document).on("click", "li.assignment", function() {
		if (!timing) {
			console.log(parseInt($(this).children('.assignment_time')[0].innerText));
			chrome.runtime.sendMessage({start_assignment: {name: $(this).children('.assignment_name')[0].innerText, time: parseInt($(this).children('.assignment_time')[0].innerText)}});
		} else {
			//alert("still timing!");
		}
	});
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var stopwatch = setInterval(function() {
	chrome.storage.sync.get(['currTime'], function(time) {
		$('#timer').html(pad(Math.floor(time.currTime/3600)%60,2) + " : " + pad(Math.floor(time.currTime/60)%60,2) + " : " + pad(time.currTime%60,2));
		if (time.currTime <= 0) timing = false;
		else timing = true;
	});
}, 100);

chrome.storage.sync.get(['assignments'], function(assignments) {
	for (var i=0; i<assignments.assignments.length; i++) {
		console.log(assignments.assignments[i].name + ": " + assignments.assignments[i].time);
		$("#assignment_list").append("<li class='assignment'><p class='assignment_name'>" + assignments.assignments[i].name + "</p><p class='assignment_time'>" + assignments.assignments[i].time + " min.</p></li>");
	}
	console.log("assignment updated");
}); 

$("#assignmentForm").submit(function() {
	processForm();
	return false;
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
		$("#assignment_list").append("<li class='assignment'><p class='assignment_name'>" + name + "</p><p class='assignment_time'>" + time + " min.</p></li>");
		chrome.runtime.sendMessage({add_assignment: {name: name, desc: desc, time: time*60}});
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
