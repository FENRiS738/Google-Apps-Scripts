
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var currentNumRows = sheet.getLastRow();
  var scriptProperties = PropertiesService.getScriptProperties();
  var previousNumRows = parseInt(scriptProperties.getProperty('numRows'), 10) || 0;

  if (currentNumRows > previousNumRows) {
    var newRows = currentNumRows - previousNumRows;
    for (var i = 1; i <= newRows; i++) {
      var newRow = previousNumRows + i;
      var newRowValues = sheet.getRange(newRow, 1, 1, sheet.getLastColumn()).getValues()[0];
      /*
      { 
        Implement your webhook call Here
      }
      */
      Logger.log('New row added at row ' + newRow + ': ' + newRowValues);

    }
  }
  scriptProperties.setProperty('numRows', currentNumRows);
}

function initializeRowCount() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var currentNumRows = sheet.getLastRow();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('numRows', currentNumRows);
}
