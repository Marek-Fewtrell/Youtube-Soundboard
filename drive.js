
var spreadsheetSearchCollection = [];
var spreadsheetSearchNextPageToken = "";
var spreadsheetSearchCurrentPage = 0;
var spreadsheetSearchTotalPages = 0;

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
    	$("#retrievespreadsheetIdError").text("");
	    var files = resp.result.files;
	    $("#fileSelector").empty();
    
		  if (files && files.length > 0) {
		    for (var i = 0; i < files.length; i++) {
		      var file = files[i];
		      spreadsheetSearchCollection.push(file);
		      /*var $item = $("<button>").text(file.name).addClass("list-group-item spreadSheetIDBtn").val(file.id);
		      if (file.id == SPREADSHEET_ID) {
		      	$item.addClass("active");
		      }
		      $("#fileSelector").append($item);*/
		      spreadsheetSearchPopulateItem(file);
		    }
		    
		    var totalPages = spreadsheetSearchCollection.length / 10;
		    if ((spreadsheetSearchCollection.length % 10) > 0 ) {
		    	totalPages++;
		    }
		    
		    spreadsheetSearchTotalPages = totalPages;
		    
		    spreadsheetSearchNextPageToken = (resp.result.nextPageToken != undefined) ? resp.result.nextPageToken : "";
		    
		    if (resp.result.nextPageToken != undefined) {
		    	$("#spreadsheetSelectNextPage").prop("disabled", false);
		    } else {
		    	$("#spreadsheetSelectNextPage").prop("disabled", true);
		    }
		    
		    $("#myModal2").modal("show");
		  } else {
		  	var $item = $("<span>").text("No files found.").addClass("list-group-item");
      	$("#fileSelector").append($item);
		  	$("#myModal2").modal("show");
		  }

    }, function(response) {
    	$("#retrievespreadsheetIdError").removeClass("hidden");
    	$("#retrievespreadsheetIdError").show();
    	$("#retrievespreadsheetIdErrorMessage").text(errorHandling(response));
    });
}

function spreadsheetSearchPopulateItem(file) {
	var $item = $("<button>").text(file.name).addClass("list-group-item spreadSheetIDBtn").val(file.id);
	if (file.id == SPREADSHEET_ID) {
  	$item.addClass("active");
  }
  $("#fileSelector").append($item);
}

function clearSpreadsheetCollection() {
	spreadsheetSearchCollection = [];
	spreadsheetSearchNextPageToken = "";
	spreadsheetSearchCurrentPage = 0;
	spreadsheetSearchTotalPages = 0;
	getSpreadsheetID();
}

function handleSpreadsheetSearchPages(action) {
	
	if (action == "next" ) {//&& spreadsheetSearchCurrentPage + 1 <= spreadsheetSearchTotalPages) {
		spreadsheetSearchCurrentPage++;
	} else if (action == "previous") {
		spreadsheetSearchCurrentPage--;
	}

	var startIndex = spreadsheetSearchCurrentPage * 10;
	var endIndex = ((startIndex+10) > spreadsheetSearchCollection.length) ? spreadsheetSearchCollection.length : startIndex+10;
	

	if (spreadsheetSearchNextPageToken == "" && spreadsheetSearchCurrentPage + 1 > spreadsheetSearchTotalPages-1) {
		$("#spreadsheetSelectNextPage").prop("disabled", true);
	} else {
		$("#spreadsheetSelectNextPage").prop("disabled", false);
	}

	if (spreadsheetSearchCurrentPage - 1 < 0) {
		$("#spreadsheetSelectPrevPage").prop("disabled", true);
	} else {
		$("#spreadsheetSelectPrevPage").prop("disabled", false);
	}

	$("#fileSelector").empty();
	for (var i = startIndex; i < endIndex; i++) {
		spreadsheetSearchPopulateItem(spreadsheetSearchCollection[i]);
	}
	
	if (spreadsheetSearchNextPageToken != "" && startIndex >= spreadsheetSearchCollection.length) {
		getSpreadsheetID(spreadsheetSearchNextPageToken);
		$("#spreadsheetSelectPrevPage").prop("disabled", false);
		return;
	}
	
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
	    $("#retrievespreadsheetIdErrorCreate").hide();
    	var result = response.result;
    	
    	//disable the create spreadsheet btn ??
    	
			var $item = $("<button>").text(result.properties.title + "(New)").addClass("list-group-item spreadSheetIDBtn").val(result.spreadsheetId);
			$("#fileSelector").prepend($item);
			
  }, function(response) {
	  $("#retrievespreadsheetIdErrorCreate").show();
	  $("#retrievespreadsheetIdErrorCreate").removeClass("hidden");
  	$("#retrievespreadsheetIdErrorCreateMessage").text(errorHandling(response));
  	
  });
}
