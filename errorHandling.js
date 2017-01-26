
function errorHandling(response) {
	console.log("in errorHandling");
	console.log(response);
	var errorObject = {};
	if (response.result.error.errors != undefined) {
		errorObject.code = response.result.error.code;
		errorObject.status = response.result.error.errors[0].reason;
		errorObject.msg = response.result.error.errors[0].message;
	} else {
		errorObject.code = response.result.error.code;
		errorObject.status = response.result.error.status;
		errorObject.msg = response.result.error.message;
	}
	console.log("errorObject");
	console.log(errorObject);
	var errorMessage = "";
	
	
	if (errorObject.code == 301) {
		errorMessage = "This stuff should be sent to a different url";
	} else if (errorObject.code == 303) {
		errorMessage = "Request was success but need to redirect to a url";
	} else if (errorObject.code == 304) {
		errorMessage = "Something complicated happened.";
	} else if (errorObject.code == 307) {
		errorMessage = "Temporary redirect needed.";
  } else if (errorObject.code == 400) {
  	//Bad Request
  	console.log("error code 400");
  	switch(errorObject.status) {
  		case "badRequest":
  			errorMessage = "Request is invalid.";
	  		break;
			case "invalid":
				errorMessage = "Invalid value in request.";
				break;
			case "invalidQuery":
				errorMessage = "Invalid query.";
				break;
			case "keyExpired":
				errorMessage = "API key has expired.";
				break;
			case "keyInvalid":
				errorMessage = "API key is invalid";
				break;
			case "parseError":
				errorMessage = "Cannot parse the request body";
				break;
			case "required":
				errorMessage = "Missing required information";
				break;
			case "unknownApi":
				errorMessage = "API is not recognised";
				break;
			default:
				errorMessage = errorObject.msg;
  	}
  	
	} else if (errorObject.code == 401) {
		//Authorization
		console.log("error code 401");
		switch(errorObject.status) {
			case "UNAUTHENTICATED":
  		case "unauthorized":
  			errorMessage = "User is not authorised to make the request.";
				break;
			case "authError":
				errorMessage = "Authorisation credentials are invalid.";
				break;
			case "expired":
				errorMessage = "Session expired.";
				break;
			case "lockedDomainExpired":
				errorMessage = "Previously valid locked domain has expired.";
				break;
			case "required":
				errorMessage = "Log in to make this API request.";
				break;
			default:
				errorMessage = "An error related to authorisation has occured.";
  	}
		
	} else if (errorObject.code == 402) {
		errorMessage = "Money is required.";
	} else if (errorObject.code == 403) {
	
		switch(errorObject.status) {
			case "PERMISSION_DENIED":
			case "forbidden":
				errorMessage = "Forbidden and cannot be completed.";
				break;
			case "accessNotConfigured":
				errorMessage = "This project can't access that API/Blocked due to abuse/ marked for deletion.";
				break;
			case "accountDeleted":
				errorMessage = "The user account with the authorisation credentials has been deleted.";
				break;
			case "accountDisabled":
				errorMessage = "The user account with the authorisation credentials has been disabled.";
				break;
			case "accountUnverified":
				errorMessage = "The user account with the authorisation credentials has not been verified.";
				break;
			case "concurrentLimitExceeded":
				errorMessage = "Concurrent usage limit reached.";
				break;
			case "dailyLimitExceeded":
				errorMessage = "Daily quota limit reached/blocked for abuse.";
				break;
			case "insufficientAudience":
				errorMessage = "Cannot be completed for this audience";
				break;
			case "insufficientAuthorizedParty":
				errorMessage = "Cannot be completed for this application.";
				break;
			case "insufficientPermissions":
				errorMessage = "Authenticated user does not have sufficient permissions to execute this request.";
				break;
			case "limitExceeded":
				errorMessage = "Access or rate limitations reached.";
				break;
			case "quotaExceeded":
				errorMessage = "Requires more resources than the quota allows.";
				break;
			case "rateLimitExceeded":
				errorMessage = "Too many requests have been sent within a given time span.";
				break;
			case "servingLimitExceeded":
				errorMessage = "Overall rate limit for the API has been reached.";
				break;
			case "sslRequired":
				errorMessage = "Requires SSL";
				break;
			case "unknownAuth":
				errorMessage = "Server does not recognise authorisation scheme";
				break;
			case "userRateLimitExceeded":
				errorMessage = "Per-user rate limit reached.";
				break;
			case "domainPolicy":
				$("#retrievespreadsheetIdError").text("Cannot be used with user's domain");
				break;
			case "appNotAuthorizedToFile":
			case "sharingRateLimitExceeded":
			case "insufficientFilePermissions":
			
			//Search api
			case "accountDelegationForbidden":
			case "authenticatedUserAccountClosed":
				
			default: 
				errorMessage = errorObject.msg;
		}
	
	} else if (errorObject.code == 404) {
		//Not Found
		errorMessage = "Could not be found.";
	
	} else if (errorObject.code == 405) {
		errorMessage = "The HTTP method associated with the request is not supported.";
	} else if (errorObject.code == 409) {
		errorMessage = "Conflict with existing item, could already exist.";
	} else if (errorObject.code == 410) {
		errorMessage = "The request failed because the resource associated with the request has been deleted.";
	} else if (errorObject.code == 412) {
		errorMessage = "Something complicated happened.";
	} else if (errorObject.code == 413) {
		errorMessage = "The request is too large.";
	} else if (errorObject.code == 416) {
		errorMessage = "The request specified a range that cannot be satisfied.";
	} else if (errorObject.code == 417) {
		errorMessage = "A client expectation cannot be met by the server.";
	} else if (errorObject.code == 428) {
		errorMessage = "Something complicated happened.";
	} else if (errorObject.code == 429) {
		errorMessage = "Too many requests have been sent within a given time period.";
	} else if (errorObject.code == 500) {
		//Internal Error
		errorMessage = "An unexpected internal error occured.";
	} else if (errorObject.code == 501) {
		errorMessage = "Tried to execute an unknown method or operation.";
	} else if (errorObject.code == 503) {
		//Service Unavailable
		switch (errorObject.status) {
			case "backendError":
			case "backendNotConnected":
			case "notReady":
				errorMessage = "A backend error occured.";
		}
	}
	
	alert(errorMessage);
}

//Global Domain Errors
//API Domain Errors
/*
	Youtube
	Drive
	Sheets
	AUth?
*/
/*
	drive api
	result.status 401
	result.error.code 401
	result.error.status UNAUTHENTICATED
*/
/*
	When selecting a different spreadsheet to use.
	result.error.code 403
	result.error.status PERMISSION_DENIED
*/
/*
	When going to the next page of the existing spreadsheet files.
	result.error.code 403
	result.error.errors[0].domain global
	result.error.errors[0].reason insufficientFilePermissions
*/
/*
	When creating a new spreadsheet, after session timeout.
	result.error.code 401
	result.error.status UNAUTHENTICATED
*/
/*
	When refreshing the spreadsheet
	result.error.code 403
	result.error.status PERMISSION_DENIED
*/
/*
	When creating a new row in a spreadsheet, after session timeout.
	result.error.code 401
	result.error.status UNAUTHENTICATED
*/
/*
	When updating a row in a spreadsheet, after session timeout.
	result.error.code 401
	result.error.status UNAUTHENTICATED
*/
/*
	When deleting a row in a spreadsheet, after session timeout.
	result.error.code 401
	result.error.status UNAUTHENTICATED
*/

function APIDomainErrorHandling(reponse, domain) {
	
}
