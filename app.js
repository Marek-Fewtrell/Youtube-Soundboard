
var player;

var nextSearchPageToken = "";
var previousSearchPageToken = "";

var loopVideoBool = false;

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
		changeModalAction("edit");
		populateModal(videoItem.name, videoItem.url);
		$("#videoRowNumberHolder").val(videoItem.rowNumber);
	});
	
	$("#newSavedVideoBtn").on("click", function() {
		changeModalAction("create");
		clearModal();
	});
	
	$("#modalApplyBtn").on("click", function () {
		var action = $("#modalAction").val();
		if (action == "create") {
			addVideoURLAction();
		} else if (action == "edit") {
			updateVideoAction();
		}
	});
	
	$("#search-container").on("click", ".btnAddSearch", function () {
		var searchItem = searchCollection[$(this).val()];
		changeModalAction("create");
		addVideoSearchAction(searchItem.videoTitle, searchItem.videoId);
	});
	
	$("#search-container").on("click", ".previewVidBtn", function () {
		previewVideoAction($(this).val());
	});
	
	$("#fileSelector").on("click", ".spreadSheetIDBtn", function() {
		$(".spreadSheetIDBtn").removeClass("active");
		
		SPREADSHEET_ID = $(this).val();
		$(this).addClass("active");
		$("#myModal2").modal("hide");
		getSheet();
		
		$("#newSavedVideoBtn").attr("disabled", false);
		$("#refreshSavedVideosBtn").attr("disabled", false);
	});
	
	$("#myModal").on('show.bs.modal', function () {
		$("#createEditModalError").addClass("hidden");
	});
	
	$("#loopVideoBtn").on("click", function (event) {
		if (loopVideoBool) {
			loopVideoBool = false;
		} else {
			loopVideoBool = true;
		}
	});
	
	//Enables the Enter Key to be used in the search bar to trigger the search functionality.
	$("#query").keypress(function (e) {
		if (e.which == 13) {
			$("#btnQuery").click();
			return false;
		}
	});
	
});

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

	var $editBtn = $("<button/>").addClass("btn btn-default btnEdit glyphicon glyphicon-pencil").attr("value", rownumber);
	var $cueVideoBtn = $("<button/>").addClass("btn btn-default btnCue glyphicon glyphicon-play-circle").attr("value", videoID);
	var $removeBtn = $("<button/>").addClass("btn btn-default btnDelete btn-danger glyphicon glyphicon-trash").attr("value", rownumber);
	
	var $nameCol = $("<td/>").append(videoName);
	var $link = $("<a>").attr("href", url).attr("target", "_blank").addClass("btn btn-default glyphicon glyphicon-link");
	
	var $divContainer = $("<span>").addClass("btn-group").append($cueVideoBtn, $link, $editBtn, $removeBtn);
	
	var $row = $("<tr>").append($nameCol, $("<td>").append($divContainer));
	$("#saveListTable").append($row);
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
function clearModal() {
	$("#videoNameInput").val("");
	$("#urlInput").val("");
}
function populateModal(name, url) {
	$("#videoNameInput").val(name);
	$("#urlInput").val(url);
	openModal();
}
function changeModalAction(action) {
	$("#modalAction").val(action);
	$("#modalTitle").text(action);
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
	if (index == -1) {
		return false;
	}
	// splice()
	savedVideosCollection.splice(index, 1);
}

function previewVideoAction(videoId) {
	player.loadVideoById({
		videoId: videoId
	});
}

function cueVideoAction(videoID) {
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

// This function creates an <iframe> (and YouTube player)
//   after the API code downloads.
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

//The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
	//This starts playing a video after pressing the stop button.
  if (loopVideoBool == true && event.data == YT.PlayerState.ENDED) {
  	playVideo();
  }
}


