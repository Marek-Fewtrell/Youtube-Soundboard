
var player;

var nextSearchPageToken = "";
var previousSearchPageToken = "";

$(document).ready(function() {
	initialisePlayer();

	$("#saveListTable").on("click", ".btnDelete", function () {
		$(this).closest("tr").remove();
	});
	
	$("#saveListTable").on("click", ".btnCue", function () {
		//console.log($(this).val());
		cueVideoAction($(this).val());
	});
	
	$("#query").keypress(function (e) {
		if (e.which == 13) {
			$("#btnQuery").click();
			return false;
		}
	});
	
});

function search(pageToken) {
	if (typeof pageToken == 'undefined') {
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
			
			var searchResultItem = "<div class=\"media\"><div class=\"media-left media-middle\"><img src=\"" + item.snippet.thumbnails.default.url + "\" class=\"media-object\" alt=\"Video Thumbnail\" width=\"" + item.snippet.thumbnails.default.width + "\" height=\"" + item.snippet.thumbnails.default.height +"\" /></div>" + "<div class=\"media-body\"><h4 class=\"media-heading\">" + item.snippet.title + "</h4><span><a href=\"https://www.youtube.com/channel/" + item.snippet.channelId +"\" target=\"_blank\">" + item.snippet.channelTitle + "</a></span><br /><div class=\"btn-group\"><button class=\"btn btn-default btn-info\" type=\"button\" value=\"" + item.id.videoId +"\" onclick=\"previewVideoAction('" + item.id.videoId + "')\">Preview Video</button><button  class=\"btn btn-default btn-success\" type=\"button\" name=\"addVideo\" value=\"Add\" onclick=\"addVideoSearchAction('" + item.snippet.title + "', '" + item.id.videoId + "')\">Add Video</button><a href=\"https://www.youtube.com/watch?v=" + item.id.videoId + "\" target=\"_blank\" class=\"btn btn-default\">View on Youtube</a></div></div></div>";
			
			$("#search-container").append(searchResultItem);
		});
	})
}

function nextPageSearch() {
console.log("Next page search function executed");
	search(nextSearchPageToken);
}

function previousPageSearch() {
console.log("Previous page search function executed");
	search(previousSearchPageToken);
}

function handleAPILoaded() {
	//enable buttons to be used or something.
	gapi.client.setApiKey(apiKey);
	gapi.client.load('youtube', 'v3', function() {
		//api is ready
	});
}
  
function addVideoURLAction() {
	var url = $("#urlInput").val();
	var name = $("#videoNameInput").val();

	addToTable(name, url);
}

function addVideoSearchAction(name, videoId) {
	var url = "https://www.youtube.com/watch?v=" + videoId;
	addToTable(name, url);
}

function addToTable(name, url) {
	var videoName = name;
	var videoURL = url;
	var videoID = videoURL.match(/v=([^&]+)/)[1];

	var actions = "<button class=\"btnCue btn btn-default\" value=\"" + videoID + "\">Cue Video</button><button class=\"btnDelete btn btn-default btn-danger\" >Remove</button>";

	var row = '<tr id="'+ videoID + '"><td>' + videoName + '</td><td><a href=\"' + url + '\" target="_blank">View on Youtube</a></td><td>' + actions + '</td></tr>';
	$("#saveListTable").append(row);
}

function getVideoDetails(url) {

}

function validateUrl() {

}

function previewVideoAction(videoId) {
	console.log("preview " +videoId);
	player.loadVideoById({
		videoId: videoId
	});
}

function cueVideoAction(videoID) {
	console.log("Hello " + videoID);
	player.cueVideoById({
		videoId:videoID
	});
}

function playVideo() {
	player.playVideo();
}

function pauseVideo() {
	player.pauseVideo();
}

function stopVideo() {
	player.stopVideo();
}
	
function initialisePlayer() {
	var tag = document.createElement('script');
			
	tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'dv13gl0a-FA',
    events: {
      'onReady': onPlayerReady/*,
      'onStateChange': onPlayerStateChange*/
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}


