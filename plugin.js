//All initialization cases

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  	chrome.pageAction.show(tabs[0].id);
});

chrome.tabs.onCreated.addListener(function(tab) {
	chrome.pageAction.show(tab.id);
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
	if (info.status === "complete") {
		chrome.pageAction.show(tabId);
	}
});
