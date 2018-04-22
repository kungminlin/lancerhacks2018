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

chrome.storage.sync.set({accuTime: 0});
chrome.storage.sync.set({assignments: []});
chrome.storage.sync.set({currTime: 0});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script: " + sender.tab.url :
		"from the extensions");
	console.log("received assignment");
	if (request.add_assignment != null) {
		var assignment = request.add_assignment
		addAssignment(assignment.name, assignment.desc, assignment.time);
		sendResponse({farewell: "assignment added"});
	} else if (request.start_assignment != null) {
		var assignment = request.start_assignment
		startStudy(parseInt(assignment.assignment_time), assignment.assignment_name);
	}
});

function addAssignment(name, desc, time) {
	chrome.storage.sync.get(['assignments'], function(assignments) {
		assignments.assignments.push({name: name, desc: desc, time: time});
		chrome.storage.sync.set({'assignments': assignments.assignments});
	});
	chrome.tabs.query({active: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {update_assignment: true});
	});
}

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

function startStudy(time, assignmentName) {
	startTimer(time, assignmentName + " completed!", "Please click on this notification in order to choose your next step.");
	console.log('timer start!');
}

function startBreak(time) {
	startTimer(300, "Break is over!", "Your " + time + " minute break is over! Blacklisted websites will now be blocked. Please choose your next assignment through the extension.");
}

function startTimer(time, title, desc) {
	console.log("timer start!");
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
				notify = new Notification(title, {
					body: desc
				});
				notify.onclick = function() {
					chrome.tabs.create({url:"assignments.html"});
				}
			}
		}
		counter--;
	}, 1000);

}