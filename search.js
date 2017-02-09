

var Search = function(){
	var searchCollection = []; //collection of search pages for current search query.
	
	this.addItem = function(item) {
		searchCollection.push(item);
	};
	
	this.getCollection = function() {
		return searchCollection;
	};
	this.collectionLength = function() {
		return searchCollection.length;
	};
	
	this.maxResultsDisplay = 5; //Number of results to display per page.
	this.searchNextPageToken = ""; //search next page token
	this.searchCurrentPage = 0; //Search current page of current search query
	this.searchTotalPages = 0; //Total number of pages for current search query
};

var SearchItem = function( index, videoId, title, channelId, channelTitle, thumbnailUrl, thumbnailsHeight, thumbnailsWidth) {
	this.id = index;
	this.videoId = videoId;
	this.videoTitle = title;
	this.channelId = channelId;
	this.channelTitle = channelTitle;
	this.thumbnail = {};
	this.thumbnail.thumbnailUrl = thumbnailUrl;
	this.thumbnail.thumbnailHeight = thumbnailsHeight;
	this.thumbnail.thumbnailWidth = thumbnailsWidth;
};

var mySearch = new Search();

//var maxResultsDisplay = 5; //Number of results to display per page.
//var searchCollection = []; //collection of search pages for current search query.
//var searchNextPageToken = ""; //search next page token
//var searchCurrentPage = 0; //Search current page of current search query
//var searchTotalPages = 0; //Total number of pages for current search query

/*
 * Function: search
 * Makes an API call with the current query. If a page token is supplied, it retrieves that page of the search request.
 *
 * Params:
 * pageToken - string token of page to retrieve if needed.
*/
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
		$("#searchError").hide();
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
			
			var newSearchItem = new SearchItem(index, item.id.videoId, item.snippet.title, item.snippet.channelId, item.snippet.channelTitle, item.snippet.thumbnails.default.url, item.snippet.thumbnails.default.height, item.snippet.thumbnails.default.width);
			
			//searchCollection.push(newSearchItem);
			mySearch.addItem(newSearchItem);
			searchPopulateItem(newSearchItem);
		});
		
		var totalPages = mySearch.collectionLength() / mySearch.maxResultsDisplay;
    if ((mySearch.collectionLength() % mySearch.maxResultsDisplay) > 0 ) {
    	totalPages++;
    }
    
    mySearch.searchTotalPages = totalPages;
    
    mySearch.searchNextPageToken = (response.result.nextPageToken != undefined) ? response.result.nextPageToken : "";
    
    if (response.result.nextPageToken != undefined) {
    	$("#nextSearchPageBtn").prop("disabled", false);
    } else {
    	$("#nextSearchPageBtn").prop("disabled", true);
    }
		    
	}, function(response) {
		$("#searchError").removeClass("hidden");
		$("#searchError").show();
		$("#searchErrorMessage").text(errorHandling(response));
	});
}

/*
 * Function: searchPopulateItem
 * Creates and adds a item from the search result to the list of results displayed on the page.
 *
 * Params:
 * item - An item from the search result.
*/
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


/*
 * Function: handleSearchPages
 * It handles the multiple pages of a search result when viewed. It saves the results of each page for the current query so multiple request
 *  aren't made when returning to previously views search result pages.
 *
 * Params:
 * action - Youtube Search result button action. next or previous.
*/
function handleSearchPages(action) {
	
	if (action == "next" ) {
		mySearch.searchCurrentPage++;
	} else if (action == "previous") {
		mySearch.searchCurrentPage--;
	}

	var startIndex = mySearch.searchCurrentPage * mySearch.maxResultsDisplay;
	var endIndex = ((startIndex+mySearch.maxResultsDisplay) > mySearch.collectionLength()) ? mySearch.collectionLength() : startIndex+mySearch.maxResultsDisplay;
	

	if (mySearch.searchNextPageToken == "" && mySearch.searchCurrentPage + 1 > mySearch.searchTotalPages-1) {
		$("#nextSearchPageBtn").prop("disabled", true);
	} else {
		$("#nextSearchPageBtn").prop("disabled", false);
	}

	if (mySearch.searchCurrentPage - 1 < 0) {
		$("#previosSearchPageBtn").prop("disabled", true);
	} else {
		$("#previosSearchPageBtn").prop("disabled", false);
	}

	$("#search-container").empty();
	var tempCollection = mySearch.getCollection();
	for (var i = startIndex; i < endIndex; i++) {
		searchPopulateItem(tempCollection[i]);
	}
	
	if (mySearch.searchNextPageToken != "" && startIndex >= mySearch.collectionLength()) {
		search(mySearch.searchNextPageToken);
		$("#previosSearchPageBtn").prop("disabled", false);
		return;
	}
	
}



