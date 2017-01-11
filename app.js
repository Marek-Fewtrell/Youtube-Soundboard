var player;

$(document).ready(function() {
	initialisePlayer();

	$("#saveListTable").on("click", ".btnDelete", function () {
		$(this).closest("tr").remove();
	});
	
	$("#saveListTable").on("click", ".btnCue", function () {
		//console.log($(this).val());
		cueVideoAction($(this).val());
	});
	
});

function search() {
	var q = $("#query").val();
	var request = gapi.client.youtube.search.list({
		q: q,
		part: 'snippet',
		type: 'video',
		pageToken: ''
	});
	
	request.execute(function(response) {
		var results = response.result;
		console.log(results);
		$.each(results.items, function(index, item) {
		
			var searchResultItem = "<div class=\"search-result\"><img src=\"" + item.snippet.thumbnails.default.url + "\" alt=\"Video Thumbnail\" width=\"" + item.snippet.thumbnails.default.width + "\" height=\"" + item.snippet.thumbnails.default.height +"\" />" + "<div><h4>" + item.snippet.title + "</h4><span><a href=\"https://www.youtube.com/channel/" + item.snippet.channelId +"\" target=\"_blank\">" + item.snippet.channelTitle + "</a></span><br /><button type=\"button\" value=\"" + item.id.videoId +"\" onclick=\"previewVideoAction('" + item.id.videoId + "')\">Preview Video</button><button type=\"button\" name=\"addVideo\" value=\"Add\" onclick=\"addVideoSearchAction('" + item.id.videoId + "')\">Add Video</button><a href=\"https://www.youtube.com/watch?v=" + item.id.videoId + "\" target=\"_blank\">View on Youtube</a></div></div>";
			
			$("#search-container").append(searchResultItem);
		});
		//$().html("<pre>" + str.items + "</pre>");
	})
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

function addVideoSearchAction(videoId) {
	var url = "https://www.youtube.com/watch?v=" + videoId;
	addToTable(name, url);
}

function addToTable(name, url) {
	var videoName = name;
	var videoURL = url;
	var videoID = videoURL.match(/v=([^&]+)/)[1];

	var actions = "<button class=\"btnCue\" value=\"" + videoID + "\">Cue Video</button><button class=\"btnDelete\" >Remove</button>";

	var row = '<tr id="'+ videoID + '"><td>' + videoName + '</td><td>' + url + '</td><td>' + actions + '</td></tr>';
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
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
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


