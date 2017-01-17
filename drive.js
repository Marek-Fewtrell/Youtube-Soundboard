
/**
 * Print files.
 */
function getSpreadsheetID() {
  var request = gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)",
      'q' : "name='Youtube Soundboard'"
    });

    request.execute(function(resp) {
      var files = resp.files;
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
		      }
		    } else {
		      console.log('No files found.');
		    }
      }
    });
}

