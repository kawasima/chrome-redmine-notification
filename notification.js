var settings = {
    get apiKey() {
	if(!localStorage["apiKey"]) return "";
	return localStorage["apiKey"];
    },
    set apiKey(val) {
	localStorage["apiKey"] = val;
    },
    get redmineUrl() {
	if(!localStorage["redmineUrl"]) return "";
	return localStorage["redmineUrl"];
    },
    set redmineUrl(val) {
	localStorage["redmineUrl"] = val;
    },
    get query() {
	if(!localStorage["query"])
	    return "assigned_to_id=me&set_filter=1&sort=updated_on%3Adesc";
	return localStorage["query"];
    },
    set query(val) {
	localStorage["query"] = val;
    },
    get checkInterval() {
	if(!localStorage["checkInterval"]) return 10;
	return localStorage["checkInterval"];
    },
    set checkInterval(val) {
	localStorage["checkInterval"] = val;
    }
}

function getBaseUrl() {
	return settings.redmineUrl;
}

function getFeedUrl() {
	return getBaseUrl()
		+ "/issues.xml?key=" + settings.apiKey
		+ "&" + settings.query;
}

function drawBadge(unreadCount) {
	switch(unreadCount) {
	case 0:
		chrome.browserAction.setTitle({title:"No unread tickets"});
		chrome.browserAction.setBadgeText({text:""});
		break;
	case 1:
		chrome.browserAction.setTitle({title:"You have one unread ticket."});
		chrome.browserAction.setBadgeText({text:"1"});
		break;
	default:
		chrome.browserAction.setTitle({title:"You have " + unreadCount + "unread tickets"});
		chrome.browserAction.setBadgeText({text:unreadCount+""});
		break;
	}
}

