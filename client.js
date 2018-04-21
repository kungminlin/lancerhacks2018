// $('.button').click(function() {
//    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs){
//      var url = tabs[0].url;
//      console.log(url);
//    });
// });

console.log("test");

$('#start-button').click(function() {
	console.log("started timer");
	startTimer(10);
});
