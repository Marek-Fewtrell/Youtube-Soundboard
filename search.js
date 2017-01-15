
function handleAPILoaded() {
	//enable buttons to be used or something.
	gapi.client.setApiKey(apiKey);
	var discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";
	/*gapi.client.load('youtube', 'v3', function() {
		//api is ready
	});*/
	
	//gapi.client.load(discoveryUrl).then(checkAuth);
}

function search(pageToken) {
	if (pageToken === undefined) {
		pageToken = "";
		console.log("no page token given");
	}
	
	var q = $("#query").val();
	var request = gapi.client.youtube.search.list({
		q: q,
		part: 'snippet',
		type: 'video',
		pageToken: pageToken //Forgot to add this variable.
	});
	
	console.log("page token before request:" + pageToken);
	
	request.execute(function(response) {
		$("#search-container").empty();
		console.log(response);
	
		var results = response.result;
		console.log(results);
		nextSearchPageToken = (typeof results.nextPageToken != 'undefined') ? results.nextPageToken : "blah2";
		previousSearchPageToken = (typeof results.prevPageToken != 'undefined') ? results.prevPageToken : "";
		
		if (nextSearchPageToken == "") {
			$("#nextSearchPageBtn").prop("disabled", true);
		} else {
			$("#nextSearchPageBtn").prop("disabled", false);
		}
		
		if (previousSearchPageToken == "") {
			$("#previosSearchPageBtn").prop("disabled", true);
		} else {
			$("#previosSearchPageBtn").prop("disabled", false);
		}
		
		console.log("next page token after request: " + nextSearchPageToken);
		console.log("previous page token before request: " + previousSearchPageToken);
		
		
		$.each(results.items, function(index, item) {
			
			var searchResultItem = "<div class=\"media\"><div class=\"media-left media-middle\"><img src=\"" + item.snippet.thumbnails.default.url + "\" class=\"media-object\" alt=\"Video Thumbnail\" width=\"" + item.snippet.thumbnails.default.width + "\" height=\"" + item.snippet.thumbnails.default.height +"\" /></div>" + "<div class=\"media-body\"><h4 class=\"media-heading\">" + item.snippet.title + "</h4><span><a href=\"https://www.youtube.com/channel/" + item.snippet.channelId +"\" target=\"_blank\">" + item.snippet.channelTitle + "</a></span><br /><div class=\"btn-group\"><button class=\"btn btn-default btn-info\" type=\"button\" value=\"" + item.id.videoId +"\" onclick=\"previewVideoAction('" + item.id.videoId + "')\">Preview Video</button><button  class=\"btn btn-default btn-success btnAddSearch\" type=\"button\" name=\"addVideo\" value=\"Add\" onclick=\"addVideoSearchAction('" + item.snippet.title + "', '" + item.id.videoId + "')\">Add Video</button><a href=\"https://www.youtube.com/watch?v=" + item.id.videoId + "\" target=\"_blank\" class=\"btn btn-default\">View on Youtube</a></div></div></div>";
			
			$("#search-container").append(searchResultItem);
		});
	}, function (response) {
		console.log("Search error");
		console.log(response);
	})
}


