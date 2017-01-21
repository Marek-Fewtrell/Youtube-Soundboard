
var spreadsheetSearchNextPageToken = "";

/**
 * Print files.
 */
function getSpreadsheetID(pageToken) {
	if (pageToken === undefined) {
		pageToken = "";
	}
  var request = gapi.client.drive.files.list({
      'pageSize': 10,
      //'fields': "nextPageToken, files(id, name)",
      'q' : "trashed = false and mimeType contains 'application/vnd.google-apps.spreadsheet'",
      'pageToken' : pageToken
    }).then(function(resp) {
    	console.log(resp);
    	$("#retrievespreadsheetIdError").text("");
	    var files = resp.result.files;
	    $("#fileSelector").empty();
	    if (files.length == 1) {
	    	var file = files[0];
	    	var $item = $("<button>").text(file.name).addClass("list-group-item spreadSheetIDBtn").val(file.id);
	      $("#fileSelector").append($item);
	    	$("#myModal2").modal("show");
	    } else {
			  if (files && files.length > 0) {
			    for (var i = 0; i < files.length; i++) {
			      var file = files[i];
			      var $item = $("<button>").text(file.name).addClass("list-group-item spreadSheetIDBtn").val(file.id);
			      if (file.id == SPREADSHEET_ID) {
			      	$item.addClass("active");
			      }
			      $("#fileSelector").append($item);
			    }
			    
			    spreadsheetSearchNextPageToken = (resp.result.nextPageToken != undefined) ? resp.result.nextPageToken : "";
			    
			    if (resp.result.nextPageToken != undefined) {
			    	$("#spreadsheetSelectNextPage").removeClass("hidden");
			    }
			    
			    
			    $("#myModal2").modal("show");
			  } else {
			  	var $item = $("<span>").text("No files found.").addClass("list-group-item");
	      	$("#fileSelector").append($item);
			  	$("#myModal2").modal("show");
			  }
	    }
    }, function(reason) {
    	if (reason.status == 400) {
  			console.log("error code 400");
  			$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  		} else if (reason.status == 401) {
  			console.log("error code 401");
  			$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  		} else if (reason.status == 403) {
  			switch(reason.result.error.errors[0].reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  					break;
  				case "insufficientFilePermissions":
  					$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  					break;
  				case "domainPolicy":
  					$("#retrievespreadsheetIdError").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#retrievespreadsheetIdError").text("The function has failed to do something correctly");
  			}
  		} else if (reason.status == 404) {
  			$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  		} else if (reason.status == 500) {
  			$("#retrievespreadsheetIdError").text("An unexpected error occured.");
  		}
    });
}


function createSheet() {
	var spreadsheetName = prompt("Enter file name", "Youtube Sounboard");
  gapi.client.sheets.spreadsheets.create({
      properties: {
      	title : spreadsheetName
      },
      'sheets' : [
      	{
      		data : [
      			{
      				startRow : 0,
      				startColumn : 0,
      				rowData : [
      					{
      						values : [
      							{
      								userEnteredValue : {
      									stringValue : "Video Name"
      								}
      							},
      							{
      								userEnteredValue : {
      									stringValue : "Video URL"
      								}
      							}
      						]
      					}
      				]
      			}
      		]
      	}
      ]
    }).then(function(response) {
	    $("#retrievespreadsheetIdErrorCreate").text("");
    	console.log(response);
    	var result = response.result;
    	
    	//disable the create spreadsheet btn ??
    	
			var $item = $("<button>").text(result.properties.title + "(New)").addClass("list-group-item spreadSheetIDBtn").val(result.spreadsheetId);
			$("#fileSelector").prepend($item);
			
  }, function(reason) {
  	console.log(reason);
    if (reason.status == 400) {
  			console.log("error code 400");
  			$("#retrievespreadsheetIdErrorCreate").text(reason.result.error.message);
  		} else if (reason.status == 401) {
  			$("#retrievespreadsheetIdErrorCreate").text(reason.result.error.message);
  		} else if (reason.status == 403) {
  			switch(reason.result.error.errors.reason) {
  				case "dailyLimitExceeded":
  				case "userRateLimitExceeded":
  				case "rateLimitExceeded":
  				case "sharingRateLimitExceeded":
  					$("#retrievespreadsheetIdErrorCreate").text(reason.result.error.message);
  					break;
  				case "appNotAuthorizedToFile":
  					$("#retrievespreadsheetIdErrorCreate").text(reason.result.error.message);
  					break;
  				case "insufficientFilePermissions":
  					$("#retrievespreadsheetIdErrorCreate").text(reason.result.error.message);
  					break;
  				case "domainPolicy":
  					$("#retrievespreadsheetIdErrorCreate").text("Cannot be used with user's domain");
  					break;
  				default: 
  					$("#retrievespreadsheetIdErrorCreate").text("The function has failed to do something correctly");
  			}
  		} else if (reason.status == 404) {
  			$("#retrievespreadsheetIdErrorCreate").text(reason.result.error.message);
  		} else if (reason.status == 500) {
  			$("#retrievespreadsheetIdErrorCreate").text("An unexpected error occured.");
  		}
  });
}
