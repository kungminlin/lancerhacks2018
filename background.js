// chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
// 	var url = tabs[0].url;
// 	console.log(url);x
//});

// var assignments = [];

// function addAssignment(assignment) {
// 	assignments.push(assignment);
// 	for (var i=0; i<assignments.length; i++) {

// 	}
// }

// function removeAssignment(id) {
// 	assignments.splice(id, 1);
// }
	
// function startTimer(assignment) {
// 	setTimeout(function() {
// 		$("#assignmentTitle").html(assignment.name);
// 	}, assignment.time*1000);
// }

function startTimer(time) {
	console.log("timer start!");
	var counter = time;
	var stopwatch = setInterval(function() {
		counter--;
		console.log(counter);
		$("#timer").html(counter);
	}, 1000);
	setTimeout(function() {
		alert("times up!");
	}, time*1000);
}