/*
 *
 *
*/

//Youtube Player object.
var player;

var myApp = {

	//Loop button state
	loopVideoBool: false

};


$(document).ready(function() {
	//Loads the youtube player.
	initialisePlayer();

	//Saved Video delete button action.
	$("#saveListTable").on("click", ".btnDelete", function () {
		var confirmBoxResult = confirm("Are you sure you want to delete that?");
		if (confirmBoxResult == true) {
			deleteRow($(this).val());
			//$(this).closest("tr").remove(); //Alternative to repopulating the table.
		}
	});
	
	//Saved Video cue button action.
	$("#saveListTable").on("click", ".btnCue", function () {
		cueVideoAction($(this).val());
	});
	
	//Saved Video edit button action.
	$("#saveListTable").on("click", ".btnEdit", function() {
		var index = getSingleVideoIndex($(this).val());
		var videoItem = mySheet.savedVideosCollection[index];
		changeModalAction("edit");
		populateModal(videoItem.name, videoItem.url);
		$("#videoRowNumberHolder").val(videoItem.rowNumber);
	});
	
	//Saved Video create button action
	$("#newSavedVideoBtn").on("click", function() {
		changeModalAction("create");
		clearModal();
	});
	
	//Create/Edit Saved Video apply button action
	$("#modalApplyBtn").on("click", function () {
		var action = $("#modalAction").val();
		if (action == "create") {
			addVideoURLAction();
		} else if (action == "edit") {
			updateVideoAction();
		}
	});
	
	//Youtube Search add video button action
	$("#search-container").on("click", ".btnAddSearch", function () {
		var searchItem = mySearch.searchCollection[$(this).val()];
		changeModalAction("create");
		addVideoSearchAction(searchItem.videoTitle, searchItem.videoId);
	});
	
	//Youtube Search preview video button action
	$("#search-container").on("click", ".previewVidBtn", function () {
		previewVideoAction($(this).val());
	});
	
	//App Settings select file action
	$("#fileSelector").on("click", ".spreadSheetIDBtn", function() {
		$(".spreadSheetIDBtn").removeClass("active");
		
		SPREADSHEET_ID = $(this).val();
		$(this).addClass("active");
		$("#myModal2").modal("hide");
		getSheet();
		
		$("#newSavedVideoBtn").attr("disabled", false);
		$("#refreshSavedVideosBtn").attr("disabled", false);
	});
	
	//Create/Edit Modal on open action
	$("#myModal").on('show.bs.modal', function () {
		$("#createEditModalError").addClass("hidden");
	});
	
	//Youtube Player loop button toggle action
	$("#loopVideoBtn").on("click", function (event) {
		if (myApp.loopVideoBool) {
			myApp.loopVideoBool = false;
		} else {
			myApp.loopVideoBool = true;
		}
	});
	
	$("#videoPlayerCollapse").on('show.bs.collapse', function(){
		$("#vPCollapseIcon").removeClass("glyphicon-chevron-left");
		$("#vPCollapseIcon").addClass("glyphicon-chevron-down");
  });
  $("#videoPlayerCollapse").on('hide.bs.collapse', function(){
  	$("#vPCollapseIcon").removeClass("glyphicon-chevron-down");
  	$("#vPCollapseIcon").addClass("glyphicon-chevron-left");
  });
  
  $("#searchCollapse").on('show.bs.collapse', function(){
		$("#sCollapseIcon").removeClass("glyphicon-chevron-left");
		$("#sCollapseIcon").addClass("glyphicon-chevron-down");
  });
  $("#searchCollapse").on('hide.bs.collapse', function(){
  	$("#sCollapseIcon").removeClass("glyphicon-chevron-down");
  	$("#sCollapseIcon").addClass("glyphicon-chevron-left");
  });
	
	//Enables the Enter Key to be used in the search bar to trigger the search functionality.
	$("#query").keypress(function (e) {
		if (e.which == 13) {
			$("#btnQuery").click();
			return false;
		}
	});
	
});

/*
 * Function: addVideoURLAction
 * Create/Edit create video action. Creates a new row in the backend.
 */
function addVideoURLAction() {
	var url = $("#urlInput").val();
	var name = $("#videoNameInput").val();

	createRow();
	//closeModal(); //Maybe use this to separate the functionality.
}

/*
 * Function: updateVideoAction
 * Create/Edit update video action. Updates the backend.
 */
function updateVideoAction() {
	var newUrl = $("#urlInput").val();
	var newName = $("#videoNameInput").val();
	var rownumber = $("#videoRowNumberHolder").val();
	updateRow(rownumber, newName, newUrl);
}

/*
 * Function: addVideoSearchAction
 * Youtube Search add video button action.
 *
 * Params:
 * name - Name of the video.
 * videoId - Id of the youtube video.
 */
function addVideoSearchAction(name, videoId) {
	var url = "https://www.youtube.com/watch?v=" + videoId;
	populateModal(name, url);
}

/*
 * Function: addToTable
 * Creates and adds a row to the Saved Video table.
 *
 * Params:
 * name - Name to display.
 * url - URL of the video.
 * rownumber - The number of the row it is in.
 */
function addToTable(name, url, rownumber) {
	//Use some sort of validation.
	/*if (rownumber === undefined) {
		//rownumber = 0;
		return;
	}*/
	
	var videoName = name;
	var videoURL = url;
	var videoID;
	if (validateUrl(videoURL)) {
		videoID = videoURL.match(/v=([^&]+)/)[1];
	} else {
		videoID = null;
	}
	

	var $editBtn = $("<button/>").addClass("btn btn-default btnEdit glyphicon glyphicon-pencil").attr("value", rownumber);
	var $cueVideoBtn = $("<button/>").addClass("btn btn-default btnCue glyphicon glyphicon-play-circle").attr("value", videoID);
	var $removeBtn = $("<button/>").addClass("btn btn-default btnDelete btn-danger glyphicon glyphicon-trash").attr("value", rownumber);
	
	var $nameCol = $("<td/>").append(videoName);
	var $link = $("<a>").attr("href", url).attr("target", "_blank").addClass("btn btn-default glyphicon glyphicon-link");
	
	if (videoID === null) {
		$link.attr("disabled", "true").attr("href", null);
		$cueVideoBtn.attr("disabled", "true");
	}
	
	var $btnGroup = $("<span>").addClass("btn-group").append($cueVideoBtn, $link, $editBtn, $removeBtn);
	
	var $row = $("<tr>").append($nameCol, $("<td>").append($btnGroup));
	$("#saveListTable").append($row);
}

/*
 * Function: populateTable
 * Populates the Saved Video table with any videos currently in the collection.
 */
function populateTable() {
	$("#saveListTable tr:gt(0)").remove();
	$.each(mySheet.savedVideosCollection, function(index, item) {
		addToTable(item["name"], item["url"], item["rowNumber"]);
	});
}

/*
 * Function: openModal
 * Opens the Create/Edit Modal.
 */
function openModal() {
	$("#myModal").modal("show");
}

/*
 * Function: closeModal
 * Closes the Create/Edit Modal.
 */
function closeModal() {
	$("#myModal").modal("hide");
}

/*
 * Function: clearModal
 * Clears the inputs of the Create/Edit modal.
 */
function clearModal() {
	$("#videoNameInput").val("");
	$("#urlInput").val("");
}

/*
 * Function: populateModal
 * Populates the Create/Edit modal inputs with a videos info. Then opens the modal.
 *
 * Params:
 * name - Name of video.
 * url - URL of video.
 */
function populateModal(name, url) {
	$("#videoNameInput").val(name);
	$("#urlInput").val(url);
	openModal();
}

/*
 * Function: changeModalAction
 * Changes the Create/Edit Modal action of the apply button.
 *
 * Params:
 * action - The string of the action to do. create/edit.
 */
function changeModalAction(action) {
	$("#modalAction").val(action);
	$("#modalTitle").text(action);
}

//Future functionality.
function getVideoDetails(url) {

}

/*
 * Function: refreshSavedVideoTable
 * Clears the Saved Videos table and retrieves new data.
 */
function refreshSavedVideoTable() {
	$("#saveListTable tr:gt(0)").remove();
	getSheet();
}

/*
 * Function: validateUrl
 * Validates a url to be a correct youtube url.
 *
 * Params:
 * url - the string youtube url.
 */
function validateUrl(url) {
	var pattern = /https:\/\/www.youtube.com\/watch\?v\=([^&]+)/;
	if (pattern.test(url)) {
		return true;
	} else {
		return false;
	}
}

/*
 * Function: addSingleVideo
 * Adds a new video to the collection which is displayed in the Saved Videos table.
 *
 * Params:
 * name - Name to display.
 * url - Url of the video.
 * rownumber - The number of the row it is in.
 */
function addSingleVideo(name, url, rownumber) {
	var newVideoItem = {"name": name, "url" : url, "rowNumber": rownumber};
	var previousLength = mySheet.savedVideosCollection.length;
	var newLength = mySheet.savedVideosCollection.push(newVideoItem);
	if (newLength > previousLength) {
		return true;
	} else {
		return false;
	}
}

/*
 * Function: getSingleVideoIndex
 * Retrieves the location of a video from the collection. Using the row number it occupies in the spreadsheet.
 *
 * Params:
 * rownumber - The number of the row it is in.
 */
function getSingleVideoIndex(rownumber) {
	/*$.each(mySheet.savedVideosCollection, function(index, item) {
		if (item.rowNumber == rownumber) {
			
		}
	});*/
	var videoIndex = -1;
	for ( var i = 0; i < mySheet.savedVideosCollection.length; i++) {
		if (mySheet.savedVideosCollection[i].rowNumber == rownumber) {
			//videoObject = mySheet.savedVideosCollection[i];
			videoIndex = i;
			break;
		}
	}
	return videoIndex;
}

/*
 * Function: updateSingleVideo
 * Updates the name and url of a video in the collection which is displayed in the Saved Videos table.
 *
 * Params:
 * rownumber - The number of the row it is in.
 * name - New name.
 * url - New Url of the video.
 */
function updateSingleVideo(rownumber, name, url) {
	var index = getSingleVideoIndex(rownumber);
	if (index == -1) {
		return false;
	}
	var videoObject = mySheet.savedVideosCollection[index];
	videoObject.name = name;
	videoObject.url = url;
	return true;
}

/*
 * Function: removeSingleVideo
 * Removes a video from the collection which is displayed in the Saved Videos table.
 *
 * Params:
 * rownumber - The number of the row it is in.
 */
function removeSingleVideo(rownumber) {
	//Should just retrieve the new sheet.
	var index = getSingleVideoIndex(rownumber);
	if (index == -1) {
		return false;
	}
	// splice()
	mySheet.savedVideosCollection.splice(index, 1);
}

/*
 * Function: previewVideoAction
 * Loads and plays a video. Set by the Youtube video Id.
 *
 * Params:
 * videoId - the youtube video Id.
 */
function previewVideoAction(videoId) {
	player.loadVideoById({
		videoId: videoId
	});
}

/*
 * Function: cueVideoAction
 * Loads but doesn't play a video. Set by the Youtube video Id.
 *
 * Params:
 * videoID - the youtube video Id.
 */
function cueVideoAction(videoID) {
	player.cueVideoById({
		videoId:videoID
	});
}

/*
 * Function: playVideo
 * Plays the Youtube Player if it a video is able to be played. Such as cued or paused.
 */
function playVideo() {
	player.playVideo();
}

/*
 * Function: pauseVideo
 * Pauses the Youtube PLayer if it is playing a video.
 */
function pauseVideo() {
	player.pauseVideo();
}

/*
 * Function: stopVideo
 * Stops the Youtube Player if it is currently playing a video.
 */
function stopVideo() {
	player.stopVideo();
}

/*
 * Function: initialisePlayer
 * Initilises the Youtube Player Iframe.
 * For more information see https://developers.google.com/youtube/iframe_api_reference
 */
function initialisePlayer() {
	var tag = document.createElement('script');
	
	tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

/*
 * Function: onYouTubeIframeAPIReady
 * This function creates an <iframe> (and YouTube player)
 *   after the API code downloads.
*/
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'dv13gl0a-FA',
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

/*
 * Function: onPlayerStateChange
 * The API calls this function when the player's state changes.
*/
function onPlayerStateChange(event) {
	//This starts playing a video after pressing the stop button.
  if (myApp.loopVideoBool == true && event.data == YT.PlayerState.ENDED) {
  	playVideo();
  }
}


