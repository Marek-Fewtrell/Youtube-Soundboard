
var savedVideosCollection = [];

/*
 * Function: getSheet
 * Retrieves the sheet and gets the data from it.
 *
*/
function getSheet() {
	setInfoMessage("Loading data, please wait");
  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2:B'
    }).then(function(response) {
    	$("#savedVideosError").hide();
    	//TODO: replace this with a function call to separate logic.
    	savedVideosCollection = [];
    	
    	var results = response.result;
    	if (results.values != undefined && results.values.length > 0) {
		  	for (var i = 0; i < results.values.length; i++) {
		  		var name = (results.values[i][0] === undefined) ? "" : results.values[i][0];
		  		var url = (results.values[i][1] === undefined) ? "" : results.values[i][1];
		  		
		  		var videoObject = {"name": name, "url" : url, "rowNumber": 2+i};
		  		savedVideosCollection.push(videoObject);
		  	}
		  	populateTable();
		  	visualFeedback("Successfully loaded the sheet.", true);
		  	$("#savedVideosInfo").hide();
    	} else {
    		$("#savedVideosInfo").text('No data in table');
    		populateTable();
    	}
			$("#refreshSavedVideosBtn").removeClass("disabled");
			
  }, function(response) {
    $("#savedVideosInfo").hide();
    setErrorMessage(errorHandling(response));
    /*
			401 error
			Reauthorise this.
			Clear the table, and populate it again.
			The spreadsheet will have already been selected
		*/
  });
}

/*
 * Function: visualFeedback
 * Creates a simply visual feedback for actions done.
 *
 * Params:
 * message - Text to be placed in pre element.
 * status - Success is true.
 */
function visualFeedback(message, status) {
  var $vfelement = $("#visualFeedback");
  $vfelement.text(message);
  $vfelement.show();
  if (status) {
    $vfelement.addClass("visualFeedbackSuccess");
    setTimeout(function() {
      $vfelement.fadeOut(1000);
    }, 5000);
  } else {
    $vfelement.addClass("visualFeedbackFailure");
  }
}

/*
 * Function: setMessage
 * Set the message to be displayed to the user
 *
 * Params:
 * message - message to be displayed.
 */
function setInfoMessage(message) {
	$("#savedVideosInfo").show();
	$('#savedVideosInfo').text(message);
}

function setErrorMessage(message) {
	$("#savedVideosError").removeClass("hidden");
	$('#savedVideosErrorMessage').text(message);
}


//======================== CRUD Operations ========================

/*
 * Function: createClientRow
 * Creates a new row in the sheets.
 *
*/
function createRow() {
	//setInfoMessage("Creating new row.");
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    values:
      [
        [
          $("#videoNameInput").val(),
          $("#urlInput").val()
        ]
      ]
  }).then(function(response) {
	  $("#createEditModalError").hide();
    closeModal();
    visualFeedback("Successfully created.", true);
		$("#savedVideosInfo").hide();
    //Create a new object in the collection and upated the table.
    //No need to make a new request.
    var results = response.result;
    var updatedRange = results.updates.updatedRange.match(/[0-9]+$/)[0];
    
    addSingleVideo($("#videoNameInput").val(), $("#urlInput").val(), updatedRange);
    
    populateTable();
    
  }, function(response) {
    //visualFeedback("Unsuccessfully created.", false);
    $("#createEditModalError").show();
    $("#createEditModalError").removeClass("hidden");
    $("#createEditModalErrorMessage").text(errorHandling(response));
  });
}

/*
 * Function: updateClientRow
 * Updates a row in the sheets.
 *
*/
function updateRow(rownumber, newName, newUrl) {
	setInfoMessage("Updating row.");
  var therange = 'Sheet1!A' + rownumber + ':B' + rownumber;
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: therange,
    valueInputOption: "USER_ENTERED",
    values:
      [
        [
          newName,
          newUrl
        ]
      ],
  }).then(function(response) {
    /*
		Check the repsonse for correct number of updates.
		if (response.result.updatedCells === 4) {}
		*/
		$("#createEditModalError").hide();
		updateSingleVideo(rownumber, newName, newUrl);
		populateTable();
    closeModal();
    visualFeedback("Successfully updated.", true);
    $("#savedVideosInfo").hide();
  }, function(response) {
    //visualFeedback("Unsuccessfully updated.", false);
    $("#createEditModalError").show();
    $("#createEditModalError").removeClass("hidden");
    $("#createEditModalErrorMessage").text(errorHandling(response));
  });
}

/*
 * Function: deleteClientRow
 * Button action which will delete the selected row.
 *
*/
function deleteRow(rownumber) {
	setInfoMessage("Deleting row.");
  var therange = 'Sheet1!A' + rownumber + ':B' + rownumber;
  gapi.client.sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: therange
  }).then(function(response) {
    visualFeedback("Successfully deleted.", true);
    //Remove that item from the collection
    removeSingleVideo(rownumber);
    //Redisplay the table then.
    populateTable();
    $("#savedVideosInfo").hide();
  }, function(response) {
		visualFeedback("Unsuccessfully deleted.", false);
		setErrorMessage(errorHandling(response));
  });
}
