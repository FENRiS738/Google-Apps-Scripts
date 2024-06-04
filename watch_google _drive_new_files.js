function watchNewFiles() {
  var previousTime = minusOneMinute();
  var currentTime = getCurrentTime();

  const query = 'trashed = false and createdTime >= "' + previousTime + '" and createdTime <= "' + currentTime + '"';
  var pageToken = null;

  do {
    try {
      data = Drive.Files.list({
        q: query,
        pageSize: 100,
        pageToken: pageToken,
      });

      var files = data.files;
      
      if (!files || files.length === 0) {
        Logger.log('No Files found.');
        return;
      }

      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.mimeType === "application/vnd.google-apps.folder") {
          files.pop(file);
        }
      }

      if (files.length === 0) {
        Logger.log('No Files found. (2)');
        return;
      }

      pageToken = files.nextPageToken;
      callWebhook(files)
    } catch (err) {
      Logger.log('Failed with error %s', err.message);
    }
  } while (pageToken);
}

function setupTrigger() {
  ScriptApp.newTrigger('watchNewFiles').timeBased().everyMinutes(1).create();
}

function callWebhook(payload) {
  // Convert payload to JSON string (if not already)
  const jsonString = typeof payload === 'object' ? JSON.stringify(payload) : payload;

  // Set up the request options
  const options = {
    "method": "post",
    "payload": jsonString,
    "contentType": "application/json"  // Set content type for JSON
  };

  // Fetch the URL with options
  const response = UrlFetchApp.fetch("https://hook.eu1.make.com/w6ddcib2w1vw7jx3g2a132enx9newtu3", options);

  // Check response code (optional)
  if (response.getResponseCode() === 200) {
    Logger.log("Webhook call successful!");
  } else {
    Logger.log("Error: " + response.getResponseCode());
  }
}

function minusOneMinute() {
  var now = new Date();
  now.setMinutes(now.getMinutes() - 1);
  now.setSeconds(00);
  var res = formatDateTimeWithSameZone(now);
  return res;
}

function getCurrentTime() {
  var now = new Date();
  now.setSeconds(00);
  var res = formatDateTimeWithSameZone(now);
  return res;
}

function formatDateTimeWithSameZone(originalDate) {
  var formattedDateTime = Utilities.formatDate(originalDate, "GMT+05:30", "yyyy-MM-dd'T'HH:mm:ssZ");
  return formattedDateTime;
}
