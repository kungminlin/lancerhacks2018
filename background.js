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

chrome.storage.sync.set({'accuTime': 0}, function(){
	console.log('Accumulated time is set to ' + 0);
})

function addToBank(time) {
	chrome.storage.sync.get(['accuTime'], function(currTime) {
		chrome.storage.sync.set({'accuTime': currTime+time}, function() {
			console.log('Updated accumulated time');
		});
	});
}

if (!window.Notification) {
	alert('Notification not supported');
} else {
	Notification.requestPermission(function(p) {
		if (p === 'denied') alert('You have denied notification');
		else if (p === 'granted') return;
	});
}

function startTimer(time) {
	console.log("time 	r start!");
	var counter = time;
	var stopwatch = setInterval(function() {
		console.log(counter);
		$("#timer").html(counter);
		if (counter <= 0) {
			clearInterval(stopwatch);
			var notify;
			if (Notification.permission === 'default') {
				alert('Notification not enabled');
			} else {
				notify = new Notification('Title', {
					body: 'Description'
				});
			}
		}
		counter--;
	}, 1000);

}