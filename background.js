chrome.storage.local.set({accuTime: 0});
chrome.storage.local.set({assignments: []});
chrome.storage.local.set({currTime: 0});
chrome.storage.sync.set({blacklist: []});
var blockedSites = [];

// Message Listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script: " + sender.tab.url :
		"from the extensions");
	if (request.add_assignment != null) {
		var assignment = request.add_assignment
		addAssignment(assignment.id, assignment.name, assignment.desc, assignment.time);
		sendResponse({farewell: "assignment added"});
	} else if (request.start_assignment != null && Number.isInteger(request.start_assignment.time) && Number.isInteger(request.start_assignment.id) && request.start_assignment.name != "") {
		var assignment = request.start_assignment;
		startStudy(assignment.id, assignment.name, assignment.time);
	} else if (request.add_website.name != "") {
		var website = request.add_website;
		addURL(website.name, website.link);
		sendResponse({farewell: "website added"});
	}
});

// Add Assignment to Assignment List
function addAssignment(id, name, desc, time) {
	chrome.storage.local.get(['assignments'], function(assignments) {
		assignments.assignments.push({id: id, name: name, desc: desc, time: time});
		chrome.storage.local.set({'assignments': assignments.assignments});
	});
}

// Add URL to Blacklist
function addURL(name, link) {
	chrome.storage.sync.get(['blacklist'], function(blacklist) {
		blacklist.blacklist.push({name: name, link: link});
		chrome.storage.sync.set({'blacklist': blacklist.blacklist});
		blockedSites = [];
		for (var i=0; i<blacklist.blacklist.length; i++) {
			blockedSites.push(processURL(blacklist.blacklist[i].link));
		}
	});
}

// Format URL for Web Request (Depreciated; Must Fix)
function processURL(link) {
	for (var i=0; i<link.length; i++) {
		if (link.charAt(i)==":") link = '*' + link.substring(i, link.length);
	}
	link = link + "/*";
	return link;
}

var blockURL = function(details) { return {cancel: true}; }

function startStudy(assignmentId, assignmentName, time) {
	var counter = time;
	if (blockedSites.length > 0) {
		console.log(blockedSites);
		chrome.webRequest.onBeforeRequest.addListener(
		    blockURL,
		    {urls: blockedSites},
		    ["blocking"]
		);
		
	}
	var stopwatch = setInterval(function() {
		chrome.storage.local.set({'currTime': counter});
		var timeStr = pad(Math.floor(counter/3600)%60,2) + " : " + pad(Math.floor(counter/60)%60,2) + " : " + pad(counter%60,2);
		console.log(timeStr);
		chrome.browserAction.setTitle({title: timeStr});
		if (counter <= 0) {
			chrome.webRequest.onBeforeRequest.removeListener(blockURL);
			chrome.storage.local.get(['assignments'], function(assignments) {
				var assignments = assignments.assignments;
				for (var i=0; i<assignments.length; i++) if (assignments[i].id == assignmentId) assignments.splice(i, 1);
				chrome.storage.local.set({assignments: assignments});
			});
			clearInterval(stopwatch);
			var notify;
			if (Notification.permission === 'default') {
				alert('Notification not enabled');
			} else {
				notify = new Notification(assignmentName + " completed!", {
					body: "You have completed the assignment! You can now choose to take a break or continue studying."
				});
				notify.onclick = function() {
					chrome.tabs.create({url:"assignments.html"});
				}
			}
		}
		counter--;
	}, 1000);
	console.log("done");
}

// function startBreak(time) {
// 	startTimer(300, "Break is over!", "Your " + time + " minute break is over! Blacklisted websites will now be blocked. Please choose your next assignment through the extension.");
// }

// function startTimer(time, title, desc) {
// 	var counter = time*60;
// 	if (blockedSites.length > 0) {
// 		console.log(blockedSites);
// 		chrome.webRequest.onBeforeRequest.addListener(
// 		    blockURL,
// 		    {urls: blockedSites},
// 		    ["blocking"]
// 		);
		
// 	}
// 	var stopwatch = setInterval(function() {
// 		chrome.storage.local.set({'currTime': counter});
// 		var timeStr = pad(Math.floor(counter/3600)%60,2) + " : " + pad(Math.floor(counter/60)%60,2) + " : " + pad(counter%60,2);
// 		console.log(timeStr);
// 		chrome.browserAction.setTitle({title: timeStr});
// 		if (counter <= 0) {
// 			chrome.webRequest.onBeforeRequest.removeListener(blockURL);
// 			clearInterval(stopwatch);
// 			var notify;
// 			if (Notification.permission === 'default') {
// 				alert('Notification not enabled');
// 			} else {
// 				notify = new Notification(title, {
// 					body: desc
// 				});
// 				notify.onclick = function() {
// 					chrome.tabs.create({url:"assignments.html"});
// 				}
// 			}
// 		}
// 		counter--;
// 	}, 1000);
// }

// function addToBank(time) {
// 	chrome.storage.local.get(['accuTime'], function(currTime) {
// 		chrome.storage.local.set({'accuTime': currTime+time}, function() {
// 			console.log('Updated accumulated time');
// 		});
// 	});
// }