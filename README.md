# Youtube-Soundboard
A simple application which you can select youtube videos and add them to a soundboard to be played back at the press of a button.
Additionally, you can search youtube and select videos by the integrated search functionality.

How to use:
1. Download JQuery(v 3.1.1) and Bootstrap(v 3.3.7) to the directory or change the line in index.html to include them from a CDN.
2. Enable Youtube Data API in the Google Developer Console to receive an API Key.
3. Enable the Google Sheets API in the Google Developer Console and create and OAuth Client ID.
4. Create a new spredsheet or use an existing one and get the Spreadsheet ID.
5. FInally, create a file named secret.js and include the following line with your API key.
..* ```
var apiKey = "**API_KEY_HERE**";

var CLIENT_ID = "**CLIENT_ID_HERE**";

var SPREADSHEET_ID = "**SPREADSHEET_ID_HERE**";
```
