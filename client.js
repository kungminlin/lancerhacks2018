// $('.button').click(function() {
//    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
//      var url = tabs[0].url;
//      console.log(url);
//    });
// });

console.log("test");

function processForm() {
	var name = document.forms["assignmentForm"]["name"].value;
	var desc = document.forms["assignmentForm"]["desc"].value;
	var time = document.forms["assignmentForm"]["time"].value;
	if (name=="") {
		alert("Name must be filled out");
		return false;
	} else if (time==0) {
		alert("Invalid time");
		return false;
	} else {
		addAssignment(name, desc, time);
		return true;
	}
}

$('#start-button').click(function() {
	console.log("started timer");
	startTimer(10);
});
