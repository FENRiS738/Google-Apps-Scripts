function categorize_items(line_item_name, quantity) {
  const itemNames = (line_item_name || '').split(',');
  const quantities = (quantity || '').split(',');

  const categories = [];
  const desiredOrder = ['CAB', 'PAN', 'FLR', 'FLA', 'CBA'];

  itemNames.forEach((item, index) => {
    const quantity = parseInt(quantities[index] || '0', 10);
    const [ , itemCategory, itemName ] = item.split(':').map(part => part.trim() || '');

    if (!itemCategory || !itemName || isNaN(quantity)) return;

    let categoryObject = categories.find(cat => cat["Category Name"] === itemCategory);
    if (!categoryObject) {
      categoryObject = { "Category Name": itemCategory, "Items": [] };
      categories.push(categoryObject);
    }

    if (itemCategory === 'CAB' || itemCategory === 'PAN') {
      for (let i = 0; i < quantity; i++) {
        categoryObject.Items.push({ "item": itemName });
      }
    } else {
      categoryObject.Items.push({ "item": `${itemName} x ${quantity}` });
    }
  });

  // Sort items alphabetically in each category
  categories.forEach(category => {
    category.Items.sort((a, b) => a.item.localeCompare(b.item));
  });

  categories.sort((a, b) => desiredOrder.indexOf(a["Category Name"]) - desiredOrder.indexOf(b["Category Name"]));

  const output = { Categories: categories };
  return output;
}

function doGet(e) {
  let rawData = e.parameters;

  let response = categorize_items(rawData.items[0], rawData.quantity[0])

  // Create a JSON response
  let jsonResponse = {
    success: true,
    input: {
      items: rawData.items[0],
      quantity: rawData.quantity[0]
    },
    output: response
  };

  // Return JSON output
  return ContentService
    .createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);
}
