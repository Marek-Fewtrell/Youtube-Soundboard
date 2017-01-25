
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
    	$("#savedVideosError").addClass("hidden");
    	console.log(response);
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
    //setErrorMessage('Error: ' + response.result.error.message);
    console.log(response);
    $("#savedVideosInfo").hide();
    $("#savedVideosError").show();
    if (response.status == 400) {
  			console.log("error code 400");
  			$("#savedVideosError").text(response.result.error.message);
  		} else if (response.status == 401) {
  			console.log("error code 401");
  			$("#savedVideosError").text(response.result.error.message);
  			//Reauthorise this.
  			//Clear the table, and populate it again.
  			//The spreadsheet will have already been selected.
  			checkAuth();
  		} else if (response.status == 403) {
  			switch(response.result.error.errors[0].reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#savedVideosError").text(response.result.error.message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#savedVideosError").text(response.result.error.message);
  					break;
  				case "insufficientFilePermissions":
  					$("#savedVideosError").text(response.result.error.message);
  					break;
  				case "domainPolicy":
  					$("#savedVideosError").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#savedVideosError").text("The function has failed to do something correctly");
  			}
  		} else if (response.status == 404) {
  			$("#savedVideosError").text(response.result.error.message);
  		} else if (response.status == 500) {
  			$("#savedVideosError").text("An unexpected error occured.");
  		}
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
	console.log("visualFeedback function");
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
	$('#savedVideosError').text(message);
}


//======================== CRUD Operations ========================

/*
 * Function: createClientRow
 * Creates a new row in the sheets.
 *
*/
function createRow() {
	setInfoMessage("Creating new row.");
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
    $("#createEditModalError").text("Was unsuccessful.");
    console.log("CreateRow function failure");
    console.log(response);
    if (response.status == 400) {
  			console.log("error code 400");
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 401) {
  			console.log("error code 401");
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 403) {
  			switch(response.result.error.errors[0].reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "insufficientFilePermissions":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "domainPolicy":
  					$("#createEditModalError").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#createEditModalError").text("The function has failed to do something correctly");
  			}
  		} else if (response.status == 404) {
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 500) {
  			$("#createEditModalError").text("An unexpected error occured.");
  		}
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
    //debuggingText(response);
		$("#createEditModalError").addClass("hidden");
		updateSingleVideo(rownumber, newName, newUrl);
		populateTable();
    closeModal();
    visualFeedback("Successfully updated.", true);
    $("#savedVideosInfo").hide();
  }, function(response) {
    visualFeedback("Unsuccessfully updated.", false);
    $("#createEditModalError").show();
    $("#createEditModalError").text("Was unsuccessful.");
    if (response.status == 400) {
  			console.log("error code 400");
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 401) {
  			console.log("error code 401");
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 403) {
  			switch(response.result.error.errors[0].reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "insufficientFilePermissions":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "domainPolicy":
  					$("#createEditModalError").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#createEditModalError").text("The function has failed to do something correctly");
  			}
  		} else if (response.status == 404) {
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 500) {
  			$("#createEditModalError").text("An unexpected error occured.");
  		}
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
		console.log("deleteRow failure");
		console.log(response);
    visualFeedback("Unsuccessfully deleted.", false);
    if (response.status == 400) {
  			console.log("error code 400");
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 401) {
  			console.log("error code 401");
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 403) {
  			switch(response.result.error.errors[0].reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "insufficientFilePermissions":
  					$("#createEditModalError").text(response.result.error.message);
  					break;
  				case "domainPolicy":
  					$("#createEditModalError").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#createEditModalError").text("The function has failed to do something correctly");
  			}
  		} else if (response.status == 404) {
  			$("#createEditModalError").text(response.result.error.message);
  		} else if (response.status == 500) {
  			$("#createEditModalError").text("An unexpected error occured.");
  		}
  });
}
