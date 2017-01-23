
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

var maxResultsDisplay = 5;
var searchCollection = [];
var searchNextPageToken = "";
var searchCurrentPage = 0;
var searchTotalPages = 0;

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
		//searchCollection = [];
		
		var results = response.result;
		nextSearchPageToken = (results.nextPageToken !== undefined) ? results.nextPageToken : "";
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
			searchPopulateItem(searchItem);
		});
		
		var totalPages = searchCollection.length / maxResultsDisplay;
    if ((searchCollection.length % maxResultsDisplay) > 0 ) {
    	totalPages++;
    }
    
    searchTotalPages = totalPages;
    
    searchNextPageToken = (response.result.nextPageToken != undefined) ? response.result.nextPageToken : "";
    
    if (response.result.nextPageToken != undefined) {
    	$("#nextSearchPageBtn").prop("disabled", false);
    } else {
    	$("#nextSearchPageBtn").prop("disabled", true);
    }
		    
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

function searchPopulateItem(item) {
	var $img = $("<img/>").addClass("media-object").attr("src", item.thumbnail.thumbnailUrl).attr("alt", "Video Thumbnail").attr("width", item.thumbnail.thumbnailWidth).attr("height", item.thumbnail.thumbnailHeight);
	var $imgContainer = $("<div/>").addClass("media-left media-middle").append($img);
	
	
	var $titleHeader = $("<h4>").addClass("media-heading").text(item.videoTitle);
	var $span = $("<span>").append($("<a>").attr("href", "https://www.youtube.com/channel/" + item.channelId).attr("target", "_blank").text(item.channelTitle))
	
	var $previewBtn = $("<button/>").addClass("btn btn-default btn-info previewVidBtn").attr("value", item.videoId).text("Preview Video");
	var $addVideoBtn = $("<button/>").addClass("btn btn-default btn-success btnAddSearch").attr("value", item.id).text("Add Video");
	var $viewLink = $("<a>").addClass("btn btn-default").attr("target", "_blank").attr("href", "https://www.youtube.com/watch?v=" + item.videoId).text("View on Youtube");

	var $divContainer = $("<div/>").addClass("btn-group").append($previewBtn, $addVideoBtn, $viewLink);
	
	
	var $body = $("<div>").addClass("media-body").append($titleHeader, $span, $("<br>"), $divContainer);
	
	var $mainContainer = $("<div/>").addClass("media").append($imgContainer, $body);
	
	$("#search-container").append($mainContainer);
}

function handleSearchPages(action) {
	
	if (action == "next" ) {
		searchCurrentPage++;
	} else if (action == "previous") {
		searchCurrentPage--;
	}

	var startIndex = searchCurrentPage * maxResultsDisplay;
	var endIndex = ((startIndex+maxResultsDisplay) > searchCollection.length) ? searchCollection.length : startIndex+maxResultsDisplay;
	

	if (searchNextPageToken == "" && searchCurrentPage + 1 > searchTotalPages-1) {
		$("#nextSearchPageBtn").prop("disabled", true);
	} else {
		$("#nextSearchPageBtn").prop("disabled", false);
	}

	if (searchCurrentPage - 1 < 0) {
		$("#previosSearchPageBtn").prop("disabled", true);
	} else {
		$("#previosSearchPageBtn").prop("disabled", false);
	}

	$("#search-container").empty();
	for (var i = startIndex; i < endIndex; i++) {
		searchPopulateItem(searchCollection[i]);
	}
	
	if (searchNextPageToken != "" && startIndex >= searchCollection.length) {
		search(searchNextPageToken);
		$("#previosSearchPageBtn").prop("disabled", false);
		return;
	}
	
}



