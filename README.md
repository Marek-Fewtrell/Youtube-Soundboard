# Youtube-Soundboard
A customisable soundboard which allows you to search and save Youtube videos to be played back at the press of a button. This application uses Google Spreadsheets to hold it's data. 

### Google Account Permissions:
+ Google Docs (Spreadsheets)
+ Google Drive (metadata for files)
+ Youtube (Search)

## Deployment
### How to use:
1. Download JQuery(v 3.1.1) and Bootstrap(v 3.3.7) to the directory or change the line in index.html to include them from a CDN.
2. Enable Youtube Data API in your Google Developer Console to receive an API Key.
3. Enable the Google Sheets API in the Google Developer Console and create an OAuth Client ID.
4. FInally, create a file named secret.js and include the following line with your API key.

..* ```
var apiKey = "**API_KEY_HERE**";

var CLIENT_ID = "**OAuth_CLIENT_ID_HERE**";

var SPREADSHEET_ID = "";
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
