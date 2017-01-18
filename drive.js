
/**
 * Print files.
 */
function getSpreadsheetID() {
  var request = gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)",
      'q' : "name='Youtube Soundboard' or mimeType contains 'spreadsheet'"
    });

    request.execute(function(resp) {
    	console.log(resp);
      var files = resp.files;
      $("#fileSelector").empty();
      if (files.length == 1) {
      	var file = files[0];
      	/*console.log("Found the one file:");
      	console.log(file.name + " id(" + file.id + ")");*/
      	SPREADSHEET_ID = file.id;
      	getSheet();
      } else {
      	//TODO: Create a way to select the file needed, maybe?
      	// Or simply create the file needed.
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
