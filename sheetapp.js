
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
    	$("#savedVideosError").addClass("hidden");
    	console.log(response);
    	//TODO: replace this with a function call to separate logic.
    	savedVideosCollection = [];
    	
    	var results = response.result;
    	if (results.values != undefined && results.values.length > 0) {
    		$("#savedVideosInfo").addClass("hidden");
    	
		  	for (var i = 0; i < results.values.length; i++) {
		  		var name = (results.values[i][0] === undefined) ? "" : results.values[i][0];
		  		var url = (results.values[i][1] === undefined) ? "" : results.values[i][1];
		  		
		  		var videoObject = {"name": name, "url" : url, "rowNumber": 2+i};
		  		savedVideosCollection.push(videoObject);
		  		
		  		//addToTable(videoObject["name"], videoObject["url"], videoObject["rowNumber"]);
		  	}
		  	populateTable();
		  	visualFeedback("Successfully loaded the sheet.", true);
    	} else {
    		$("#savedVideosInfo").text('No data in table');
    		$("#savedVideosInfo").removeClass("hidden");
    		populateTable();
    	}
			setMessage(" ");
			
			$("#refreshSavedVideosBtn").removeClass("disabled");
			
  }, function(response) {
    setMessage('Error: ' + response.result.error.message);
    console.log(response);
    $("#savedVideosError").removeClass("hidden");
    if (response.status == 400) {
  			console.log("error code 400");
  			$("#savedVideosError").text(response.result.error.message);
  		} else if (response.status == 401) {
  			console.log("error code 401");
  			$("#savedVideosError").text(response.result.error.message);
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
  if (status) {
    $vfelement.addClass("visualFeedbackSuccess");
    setTimeout(function() {
      $vfelement.addClass("visualFeedbackDisappear");
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
	  $("#createEditModalError").addClass("hidden");
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
    $("#createEditModalError").removeClass("hidden");
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
		$("#createEditModalError").addClass("hidden");
		updateSingleVideo(rownumber, newName, newUrl);
		populateTable();
    closeModal();
    visualFeedback("Successfully updated client.", true);
  }, function(response) {
    visualFeedback("Unsuccessfully updated client.", false);
    $("#createEditModalError").removeClass("hidden");
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
  var therange = 'Sheet1!A' + rownumber + ':B' + rownumber;
  gapi.client.sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: therange
  }).then(function(response) {
  	$("#createEditModalError").addClass("hidden");
    visualFeedback("Successfully deleted client.", true);
    //Remove that item from the collection
    removeSingleVideo(rownumber);
    //Redisplay the table then.
    populateTable();
  }, function(response) {
		console.log("deleteRow failure");
		console.log(response);
    visualFeedback("Unsuccessfully deleted client.", false);
    
    $("#createEditModalError").removeClass("hidden");
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
