
/*
 * Deprecated
 * Previously used to load the search api.
*/
function handleSearchAPILoaded() {
	gapi.client.setApiKey(apiKey);
	var discoveryUrl = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";
	/*gapi.client.load('youtube', 'v3', function() {
		//api is ready
	});*/
	
	//gapi.client.load(discoveryUrl).then(checkAuth);
}

var searchCollection = [];

function search(pageToken) {
	if (pageToken === undefined) {
		pageToken = "";
	}
	
	var q = $("#query").val();
	var request = gapi.client.youtube.search.list({
		q: q,
		part: 'snippet',
		type: 'video',
		pageToken: pageToken //Forgot to add this variable.
	}).then(function(response) {
		$("#searchError").text("");
		$("#search-container").empty();
		searchCollection = [];
		
		var results = response.result;
		nextSearchPageToken = (results.nextPageToken !== undefined) ? results.nextPageToken : "blah2";
		previousSearchPageToken = (results.prevPageToken !== undefined) ? results.prevPageToken : "";
		
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
		
		$.each(results.items, function(index, item) {
			
			var searchItem = {
				"id" : index,
				"videoId" : item.id.videoId,
				"videoTitle" : item.snippet.title,
				"channelId" : item.snippet.channelId,
				"channelTitle" : item.snippet.channelTitle,
				"thumbnail" : {
					"thumbnailUrl" : item.snippet.thumbnails.default.url,
					"thumbnailHeight" : item.snippet.thumbnails.default.height,
					"thumbnailWidth" : item.snippet.thumbnails.default.width
				}
			};
			
			searchCollection.push(searchItem);
			
			var $img = $("<img/>").addClass("media-object").attr("src", item.snippet.thumbnails.default.url).attr("alt", "Video Thumbnail").attr("width", item.snippet.thumbnails.default.width).attr("height", item.snippet.thumbnails.default.height);
			var $imgContainer = $("<div/>").addClass("media-left media-middle").append($img);
			
			
			var $titleHeader = $("<h4>").addClass("media-heading").text(item.snippet.title);
			var $span = $("<span>").append($("<a>").attr("href", "https://www.youtube.com/channel/" + item.snippet.channelId).attr("target", "_blank").text(item.snippet.channelTitle))
			
			var $previewBtn = $("<button/>").addClass("btn btn-default btn-info previewVidBtn").attr("value", item.id.videoId).text("Preview Video");
			var $addVideoBtn = $("<button/>").addClass("btn btn-default btn-success btnAddSearch").attr("value", index).text("Add Video");
			var $viewLink = $("<a>").addClass("btn btn-default").attr("target", "_blank").attr("href", "https://www.youtube.com/watch?v=" + item.id.videoId).text("View on Youtube");
	
			var $divContainer = $("<div/>").addClass("btn-group").append($previewBtn, $addVideoBtn, $viewLink);
			
			
			var $body = $("<div>").addClass("media-body").append($titleHeader, $span, $("<br>"), $divContainer);
			
			var $mainContainer = $("<div/>").addClass("media").append($imgContainer, $body);
			
			$("#search-container").append($mainContainer);
			
		});
	}, function(response) {
		console.log("Search error");
		console.log(response);
    if (response.status == 400) {
  			console.log("error code 400");
  			$("#searchError").text(response.result.error.message);
  		} else if (response.status == 401) {
  			console.log("error code 401");
  			$("#searchError").text(response.result.error.message);
  		} else if (response.status == 403) {
  			switch(response.result.error.errors[0].reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#searchError").text(response.result.error.message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#searchError").text(response.result.error.message);
  					break;
  				case "insufficientFilePermissions":
  					$("#searchError").text(response.result.error.message);
  					break;
  				case "domainPolicy":
  					$("#searchError").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#searchError").text("The function has failed to do something correctly");
  			}
  		} else if (response.status == 404) {
  			$("#searchError").text(response.result.error.message);
  		} else if (response.status == 500) {
  			$("#searchError").text("An unexpected error occured.");
  		}
	});
}


