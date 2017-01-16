
var player;

var nextSearchPageToken = "";
var previousSearchPageToken = "";

$(document).ready(function() {
	initialisePlayer();

	$("#saveListTable").on("click", ".btnDelete", function () {
		var confirmBoxResult = confirm("Are you sure you want to delete that?");
		if (confirmBoxResult == true) {
			deleteRow($(this).val());
			//$(this).closest("tr").remove(); //Alternative to redoing the table.
		}
	});
	
	$("#saveListTable").on("click", ".btnCue", function () {
		cueVideoAction($(this).val());
	});
	
	$("#saveListTable").on("click", ".btnEdit", function() {
		var index = getSingleVideoIndex($(this).val());
		var videoItem = savedVideosCollection[index];
		populateModal(videoItem.name, videoItem.url);
		$("#videoRowNumberHolder").val(videoItem.rowNumber);
	});
	
	$("#search-container").on("click", ".btnAddSearch", function () {
		//Maybe use this to replace the onclick event on the buttons for each search item.
		alert("heelo");
	});
	
	//Enables the Enter Key to be used in the search bar to trigger the search functionality.
	$("#query").keypress(function (e) {
		if (e.which == 13) {
			$("#btnQuery").click();
			return false;
		}
	});
	
});

function nextPageSearch() {
	search(nextSearchPageToken);
}

function previousPageSearch() {
	search(previousSearchPageToken);
}
  
function addVideoURLAction() {
	var url = $("#urlInput").val();
	var name = $("#videoNameInput").val();

	createRow();
	//closeModal(); //Maybe use this to separate the functionality.
}

function updateVideoAction() {
	var newUrl = $("#urlInput").val();
	var newName = $("#videoNameInput").val();
	var rownumber = $("#videoRowNumberHolder").val();
	updateRow(rownumber, newName, newUrl);
}

function addVideoSearchAction(name, videoId) {
	var url = "https://www.youtube.com/watch?v=" + videoId;
	populateModal(name, url);
}

function addToTable(name, url, rownumber) {
	//Use some sort of validation.
	/*if (rownumber === undefined) {
		//rownumber = 0;
		return;
	}*/
	
	var videoName = name;
	var videoURL = url;
	var videoID = videoURL.match(/v=([^&]+)/)[1];

	var actions = "<div class=\"btn-group\"><button class=\"btn btn-default btnEdit\" value=\"" + rownumber + "\">Edit</button><button class=\"btnCue btn btn-default\" value=\"" + videoID + "\">Cue Video</button><button value=\"" + rownumber + "\" class=\"btnDelete btn btn-default btn-danger\" >Remove</button></div>";

	var row = '<tr><td>' + videoName + '</td><td><a href=\"' + url + '\" target="_blank" class="btn btn-default">View on Youtube</a></td><td>' + actions + '</td></tr>';
	$("#saveListTable").append(row);
}

function populateTable() {
	$("#saveListTable tr:gt(0)").remove();
	$.each(savedVideosCollection, function(index, item) {
		addToTable(item["name"], item["url"], item["rowNumber"]);
	});
}

function openModal() {
	$("#myModal").modal("show");
}
function closeModal() {
	$("#myModal").modal("hide");
}

function populateModal(name, url) {
	$("#videoNameInput").val(name);
	$("#urlInput").val(url);
	openModal();
}


function getVideoDetails(url) {

}

function refreshSavedVideoTable() {
	$("#saveListTable tr:gt(0)").remove();
	getSheet();
}

function validateUrl(url) {
	var pattern = /https:\/\/www.youtube.com\/watch\?v\=([^&]+)/;
	if (pattern.test(url)) {
		return true;
	} else {
		return false;
	}
}

function addSingleVideo(name, url, rownumber) {
	var newVideoItem = {"name": name, "url" : url, "rowNumber": rownumber};
	var previousLength = savedVideosCollection.length;
	var newLength = savedVideosCollection.push(newVideoItem);
	if (newLength > previousLength) {
		return true;
	} else {
		return false;
	}
}

function getSingleVideoIndex(rownumber) {
	/*$.each(savedVideosCollection, function(index, item) {
		if (item.rowNumber == rownumber) {
			
		}
	});*/
	var videoIndex = -1;
	for ( var i = 0; i < savedVideosCollection.length; i++) {
		if (savedVideosCollection[i].rowNumber == rownumber) {
			//videoObject = savedVideosCollection[i];
			videoIndex = i;
			break;
		}
	}
	return videoIndex;
}

function updateSingleVideo(rownumber, name, url) {
	//var videoObject = savedVideosCollection[index];
	var index = getSingleVideoIndex(rownumber);
	if (index == -1) {
		return false;
	}
	var videoObject = savedVideosCollection[index];
	videoObject.name = name;
	videoObject.url = url;
	return true;
}

function removeSingleVideo(rownumber) {
	//Should just retrieve the new sheet.
	var index = getSingleVideoIndex(rownumber);
	console.log("removeSingleVideo rownumber:" + rownumber + " index:" + index);
	if (index == -1) {
		return false;
	}
	// splice()
	savedVideosCollection.splice(index, 1);
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


