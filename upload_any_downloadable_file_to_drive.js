function downloadFile(url, file__name, folder__id) {
  const response = UrlFetchApp.fetch(url);
  const blob = response.getBlob().setName(file__name);
  const folder = DriveApp.getFolderById(folder__id);
  folder.createFile(blob);
  Logger.log("File downloaded successfully: " + file__name);
}
