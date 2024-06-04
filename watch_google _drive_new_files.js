function watchNewFiles() {
  var previousTime = minusOneMinute();
  var currentTime = getCurrentTime();

  const query = '"1FeDIqEqo740xJCJ02jwWY1yOvoBjChPj" in parents and trashed = false and createdTime >= "' + previousTime + '" and createdTime <= "' + currentTime + '"';
  let pageToken = null;
  do {
    try {
      data = Drive.Files.list({
        q: query,
        pageSize: 100,
        pageToken: pageToken,
      });
      let files = data.files;
      if (!files || files.length === 0) {
        Logger.log('No Files found.');
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        /*
        { 
          Implement your webhook call Here
        }
        */
        Logger.log('%s (ID: %s)', file.name, file.id);
      }
      pageToken = files.nextPageToken;
    } catch (err) {
      Logger.log('Failed with error %s', err.message);
    }
  } while (pageToken);
}

function setupTrigger() {
  ScriptApp.newTrigger('watchNewFiles').timeBased().everyMinutes(1).create();
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