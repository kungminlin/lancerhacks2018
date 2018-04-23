chrome.storage.local.set({accuTime: 0});
chrome.storage.local.set({assignments: []});
chrome.storage.local.set({currTime: 0});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script: " + sender.tab.url :
		"from the extensions");
	if (request.add_assignment != null) {
		var assignment = request.add_assignment
		addAssignment(assignment.name, assignment.desc, assignment.time);
		sendResponse({farewell: "assignment added"});
	} else if (Number.isInteger(request.start_assignment.time)) {
		var assignment = request.start_assignment;
		startStudy(assignment.time, assignment.name);
	}
});

function addAssignment(name, desc, time) {
	chrome.storage.local.get(['assignments'], function(assignments) {
		assignments.assignments.push({name: name, desc: desc, time: time});
		chrome.storage.local.set({'assignments': assignments.assignments});
	});
	chrome.tabs.query({active: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {update_assignment: true});
	});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		console.log("test");
	 	chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {});
	});
}

function addToBank(time) {
	chrome.storage.local.get(['accuTime'], function(currTime) {
		chrome.storage.local.set({'accuTime': currTime+time}, function() {
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
}

function startBreak(time) {
	startTimer(300, "Break is over!", "Your " + time + " minute break is over! Blacklisted websites will now be blocked. Please choose your next assignment through the extension.");
}

function startTimer(time, title, desc) {
	var counter = time*60;
	var stopwatch = setInterval(function() {
		chrome.storage.local.set({'currTime': counter});
		var timeStr = pad(Math.floor(counter/3600)%60,2) + " : " + pad(Math.floor(counter/60)%60,2) + " : " + pad(counter%60,2);
		console.log(timeStr);
		chrome.browserAction.setTitle({title: timeStr});
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

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}