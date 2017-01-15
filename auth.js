//========================== Google Access Code Start ==========================

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/youtube.readonly"];


/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      client_id: CLIENT_ID,
      scope: SCOPES,
      immediate: true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    //loadSheetsApi();
    loadAPIClientInterfaces();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
  var discoveryUrl =
      'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(getSheet);
}

function loadAPIClientInterfaces() {
	var sheetsDiscoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
	var youtubeDiscoveryUrl = "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest";
	gapi.client.load(youtubeDiscoveryUrl).then(function() {
		gapi.client.load(sheetsDiscoveryUrl).then(getSheet);
	});
}

function handleInit() {
	console.log("In handleInit.");
	var discoveryDocURLs = ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
	gapi.client.init(
		{
			apiKey: apiKey, 
			discoveryDocs : discoveryDocURLs, 
			clientId: CLIENT_ID, 
			scope : SCOPES
		});
		checkAuth();
	console.log("Finished handleInit.");
}

//========================== Google Access Code End ==========================
