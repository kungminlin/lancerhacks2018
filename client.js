// $('.button').click(function() {
//    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
//      var url = tabs[0].url;
//      console.log(url);
//    });
// });

console.log("test");

$("#assignmentForm").submit(function() {
	processForm();
	return false;
});

function processForm() {
	var name = document.forms["assignmentForm"]["name"].value;
	var desc = document.forms["assignmentForm"]["desc"].value;
	var time = document.forms["assignmentForm"]["time"].value;
	var object = {name: name, desc: desc, time: time};
	console.log(object.name);
	console.log(object.desc);
	console.log(object.time);
	if (name=="") {
		alert("Name must be filled out");
		return false;
	} else if (time<600) {
		alert("The time must be a value above 10 minutes");
		return false;
	} else {
		addAssignment(name, desc, time*60);
		return true;
	}
}

function updateAssignments() {
	chrome.storage.sync.get(['assignments'], function(assignments) {
		for (var i=0; i<assignments.length; i++) {
			console.log(assignments[i].name + ": " + assignments[i].time);
		}
	});
}

$('#start-button').click(function() {
	console.log("started timer");
	startTimer(10);
});
