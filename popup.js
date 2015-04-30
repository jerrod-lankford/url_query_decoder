var tbody;

//Hack to convert string url to a Location element in order to parse out the query params
function parseUrl(url) {
	var a = document.createElement('a');
	a.href = url;
	return {
		search : a.search.substr(1),
		hash : a.hash.substr(1)
	};
}

//Get all pairs of query parameters from a given query string minus the starting character (? or #)
function parseQueryParams(qs) {
	if (qs) {
	    qs = qs.split("+").join(" ");

	    var params = {}, tokens,
	        re = /[?&]?([^=]+)=([^&]*)/g;

	    while (tokens = re.exec(qs)) {
	        params[decodeURIComponent(tokens[1])]
	            = decodeURIComponent(tokens[2]);
	    }

	    return params;
	}
	return null;
}

function copyFullUrl() {
	var fullUrl = document.getElementById("fullUrl");
	fullUrl.focus();
	document.execCommand('SelectAll');
	document.execCommand("Copy", false, null);
	document.getSelection().removeAllRanges(); //Deselct text
	fullUrl.blur(); //Unfocus div
}

function buildButtons(params) {
	if (params) {
		Object.keys(params).forEach(function (key) { 
		    var value = params[key];
		    buildButton(key,value);
		});
	}
}

//Create the elements containing the buttons for each key value pair
function buildButton(key,value) {
	var tr = document.createElement('tr');
	var buttonCell = document.createElement('td');
	var button = document.createElement('button');

	var textDiv = document.createElement('div');
	var textCell = document.createElement('td');

	//Construct button
	button.setAttribute('type', 'button');
	button.setAttribute('class', 'btn btn-primary paramButtons');
	button.innerHTML = key;
	button.addEventListener('click', function() {
		copyToClipboard(key);
	});
	//End button

	//Text field
	textDiv.innerHTML = value;
	textDiv.setAttribute('id', 't_' + key); //Use a t_ before the id to avoid id conflicts
	textDiv.setAttribute('class', 'params textDiv');
	textDiv.contentEditable = true;
	//End text field


	buttonCell.appendChild(button);
	textCell.appendChild(textDiv);
	tr.appendChild(buttonCell);
	tr.appendChild(textCell);
	tbody.appendChild(tr);
}

//Get the text box associated with the parameter
function copyToClipboard(key){
    var textBox = document.getElementById("t_" + key);
    textBox.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.getSelection().removeAllRanges(); //Deselct text
    textBox.blur();
}

function init() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  	tbody = document.getElementById("tableBody");
		tbody.innerHTML = "";

		//Set the full url text box and the onclick listener for the button
		//We have to convert & to &amp; otherwise setting the inner html of the div will cause some encoding to happen
		//Eg. &param1 was getting changed to {paragraphSymbol}m1
		document.getElementById("fullUrl").innerHTML = decodeURIComponent(tabs[0].url).replace("&", "&amp;");
		document.getElementById("fullButton").addEventListener('click', copyFullUrl);

		var urlQuery = parseUrl(tabs[0].url);

		//RM decided that we should have query params after a hash for some reason
		//E.G. https://clmwb.ibm.com:9444/rdm/web?debug=true#action=com.ibm.rdm.web.pages.showArtifact..
		//So to work around this I parse both the hash string and the search string as if they are query strings
		if (urlQuery) {
			buildButtons(parseQueryParams(urlQuery.search));
			buildButtons(parseQueryParams(urlQuery.hash));
		}
	});
}

window.onload=init;