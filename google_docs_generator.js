function formattedData(parsed_data) {
  let data = {
    date: parsed_data.date[0],
    fname: parsed_data.fname[0],
    lname: parsed_data.lname[0],
    address: parsed_data.address[0],
    city: parsed_data.city[0],
    state: parsed_data.state[0],
    items: JSON.parse(parsed_data.items[0]),
    sub_total: parsed_data.sub_total[0],
    total_tax: parsed_data.total_tax[0],
    grand_total: parsed_data.grand_total[0],
    payment_method: parsed_data.payment[0]
  }

  return data;
}

function getProductTableFromData(items) {
  var tableData = [];

  items.forEach(function (item) {
    tableData.push([item.description, item.image_name.split(",").join("\n"), item.quantity]);
  });
  return tableData;
}

function formatTableColumns(table) {
  table.setColumnWidth(0, 170); // Adjust width for "Description"
  table.setColumnWidth(1, 170); // Adjust width for "Images"
  table.setColumnWidth(2, 170);  // Adjust width for "Quantity"
}

function main(rawData) {
  let parsed_data = JSON.parse(rawData);

  let data = formattedData(parsed_data);

  let doc = DriveApp.getFileById("1D9HHVLZHbqIZr7aJJ9Pp_VpmlneNA1mTeoA_K_LC16k");
  let newDoc = doc.makeCopy().setName("Invoice: " + data.fname + " " + data.date);
  let openDoc = DocumentApp.openById(newDoc.getId());
  let body = openDoc.getBody();


  // Replacing placeholders with actual data
  body.replaceText("{{Date}}", data.date);
  body.replaceText("{{First_Name}}", data.fname);
  body.replaceText("{{Last_Name}}", data.lname);
  body.replaceText("{{Address}}", data.address);
  body.replaceText("{{City}}", data.city);
  body.replaceText("{{State}}", data.state);

  if (data.payment_method == "stripe") {
    body.replaceText("{{Status}}", "Paid");
    body.replaceText("{{Status_Description}}", "Thank you for completing the payment process.")
  } else if (data.payment_method == "partial.ly") {
    body.replaceText("{{Status}}", "Open");
    body.replaceText("{{Status_Description}}", "To check your current payment plan balance, please visit partial.ly/customer.")
  } else {
    body.replaceText("{{Status}}", "None");
  }

  if (data.payment_method == "none") {
    body.replaceText("{{Sub_Total}}", "0.0");
    body.replaceText("{{Sales_Tax}}", "0.0");
    body.replaceText("{{Grand_Total}}", "0.0");
  } else {
    body.replaceText("{{Sub_Total}}", data.sub_total);
    body.replaceText("{{Sales_Tax}}", data.total_tax);
    body.replaceText("{{Grand_Total}}", data.grand_total);
  }

  // Generating product table and inserting it into the document
  let tableData = getProductTableFromData(data.items);

  let table_element = body.findText("{{Table}}");
  let table = body.insertTable(body.getChildIndex(table_element.getElement().getParent()), tableData);

  table_element.getElement().removeFromParent();

  // Formatting table columns
  formatTableColumns(table);

  openDoc.saveAndClose();

  // Convert the newly created document to PDF
  let pdf = DriveApp.getFileById(newDoc.getId()).getAs('application/pdf');

  // Save the PDF back to Google Drive
  let pdfFile = DriveApp.createFile(pdf).setName("Invoice: " + data.fname + " " + data.date + ".pdf");

  // Make the PDF publicly accessible
  pdfFile.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);

  // Return a link that allows direct download
  let pdfDownloadLink = "https://drive.google.com/uc?export=download&id=" + pdfFile.getId();

  return pdfDownloadLink;
}

function doGet(e) {
  let rawData = JSON.stringify(e.parameters);
  let downloadLink = main(rawData);

  // Create a JSON response
  let jsonResponse = {
    success: true,
    message: "Invoice generated successfully.",
    pdf_url: downloadLink
  };

  // Return JSON output
  return ContentService
    .createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);
}

