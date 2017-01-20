
/**
 * Print files.
 */
function getSpreadsheetID() {
  var request = gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)",
      'q' : "name='Youtube Soundboard' or mimeType contains 'spreadsheet'"
    }).then(function(resp) {
    $("#retrievespreadsheetIdError").text("");
    	console.log("getSpreadsheetID function success");
	  	console.log(resp);
	    var files = resp.result.files;
	    $("#fileSelector").empty();
	    if (files.length == 1) {
	    	var file = files[0];
	    	/*console.log("Found the one file:");
	    	console.log(file.name + " id(" + file.id + ")");*/
	    	SPREADSHEET_ID = file.id;
	    	getSheet();
	    } else {
			  if (files && files.length > 0) {
			  	console.log('Files:');
			    for (var i = 0; i < files.length; i++) {
			      var file = files[i];
			      console.log(file.name + ' (' + file.id + ')');
			      
			      var $item = $("<button>").text(file.name).addClass("list-group-item spreadSheetIDBtn").val(file.id);
			      if (file.id == SPREADSHEET_ID) {
			      	$item.addClass("active");
			      }
			      $("#fileSelector").append($item);
			    }
			    $("#myModal2").modal();
			  } else {
			    console.log('No files found.');
			  }
	    }
    }, function(reason) {
    	console.log("getSpreadsheetID function failure");
    	console.log(reason);
    	
    	if (reason.status == 400) {
  			console.log("error code 400");
  			$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  		} else if (reason.status == 401) {
  			console.log("error code 401");
  			$("#retrievespreadsheetIdError").text(reason.result.error.errors[0].message);
  		} else if (reason.status == 403) {
  			//var regexExp = /LimitExceeded/;
  			
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
    	console.log(response);
    	var result = response.result;
    	
    	//disable the create spreadsheet btn ??
    	
			var $item = $("<button>").text(result.properties.title + "(New)").addClass("list-group-item spreadSheetIDBtn").val(result.spreadsheetId);
			$("#fileSelector").prepend($item);
			
  }, function(response) {
    //setMessage('Error: ' + response.result.error.message);
    console.log(response);
  });
}
