
var savedVideosCollection = [];

/*
 * Function: getSheet
 * Retrieves the sheet and gets the data from it.
 *
*/
function getSheet() {
	setMessage("Loading data, please wait");
  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2:B'
    }).then(function(response) {
    	
    	//TODO: replace this with a function call to separate logic.
    	savedVideosCollection = [];
    	
    	var results = response.result;
    	if (results.values.length > 0) {
		  	for (var i = 0; i < results.values.length; i++) {
		  		var name = (results.values[i][0] === undefined) ? "" : results.values[i][0];
		  		var url = (results.values[i][1] === undefined) ? "" : results.values[i][1];
		  		
		  		var videoObject = {"name": name, "url" : url, "rowNumber": 2+i};
		  		savedVideosCollection.push(videoObject);
		  		
		  		//addToTable(videoObject["name"], videoObject["url"], videoObject["rowNumber"]);
		  	}
		  	populateTable();
		  	//visualFeedback(message, status);
    	} else {
    		console.log('No data found');
    	}
			setMessage(" ");
			
			$("#refreshSavedVideosBtn").removeClass("disabled");
			
  }, function(response) {
    setMessage('Error: ' + response.result.error.message);
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
  var vfelement = $("#visualFeedback");
  vfelement.innerHTML = message;
  if (status) {
    vfelement.className = "visualFeedbackSuccess";
    setTimeout(function() {
      vfelement.className += " visualFeedbackDisappear";
    }, 5000);
  } else {
    vfelement.className = "visualFeedbackFailure";
  }
}

/*
 * Function: setMessage
 * Set the message to be displayed to the user
 *
 * Params:
 * message - message to be displayed.
 */
function setMessage(message) {
	$('#statusMessages').text(message);
}


//======================== CRUD Operations ========================

/*
 * Function: createClientRow
 * Creates a new row in the sheets.
 *
*/
function createRow() {
	//setModalMessage("Creating new client row.");
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
    closeModal();
    visualFeedback("Successfully created .", true);

    //Create a new object in the collection and upated the table.
    //No need to make a new request.
    var results = response.result;
    var updatedRange = results.updates.updatedRange.match(/[0-9]+$/)[0];
    
    addSingleVideo($("#videoNameInput").val(), $("#urlInput").val(), updatedRange);
    
    addToTable($("#videoNameInput").val(), $("#urlInput").val(), updatedRange);
  }, function(response) {
    visualFeedback("Unsuccessfully created client.", true);
    console.log("CreateRow function failure");
    console.log(response);
  });
}

/*
 * Function: updateClientRow
 * Updates a row in the sheets.
 *
*/
function updateRow(rownumber, newName, newUrl) {
	//setModalMessage("Updating client row.");
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
    //debuggingText(response);

		updateSingleVideo(rownumber, newName, newUrl);
		populateTable();
    closeModal();
    visualFeedback("Successfully updated client.", true);
  }, function(response) {
    visualFeedback("Unsuccessfully updated client.", false);
  });
}

/*
 * Function: deleteClientRow
 * Button action which will delete the selected row.
 *
*/
function deleteRow(rownumber) {
  var therange = 'Sheet1!A' + rownumber + ':B' + rownumber;
  gapi.client.sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: therange
  }).then(function(response) {
    //visualFeedback("Successfully deleted client.", true);
    //Remove that item from the collection
    removeSingleVideo(rownumber);
    //Redisplay the table then.
    populateTable();
  }, function(response) {
		console.log("deleteRow failure");
		console.log(response);
    visualFeedback("Unsuccessfully deleted client.", false);
  });
}
