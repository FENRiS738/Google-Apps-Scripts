function categorize_items(line_item_name, quantity) {
  const itemNames = (line_item_name || '').split(',');
  const quantities = (quantity || '').split(',');

  // Initialize an array to hold the final categorized items
  const categories = [];

  // Loop through each item and its corresponding quantity
  itemNames.forEach((item, index) => {
    const quantity = parseInt(quantities[index] || '0', 10); // Convert quantity to an integer
    const itemCategory = item.split(':')[1].trim(); // e.g., "Cabinets"
    const itemName = item.split(':')[2].trim(); // e.g., "Cabinets 1 test"

    // Find or create the item category object
    let categoryObject = categories.find(cat => cat["Category Name"] === itemCategory);
    if (!categoryObject) {
      categoryObject = { "Category Name": itemCategory, "Items": [] };
      categories.push(categoryObject);
    }

    // Check the category and process accordingly
    if (itemCategory === 'CAB' || itemCategory === 'PAN') {
      // Duplicate the item for each quantity
      for (let i = 0; i < quantity; i++) {
        categoryObject.Items.push({ "item": itemName });
      }
    } else {
      // For other categories, include the quantity directly in the item name
      categoryObject.Items.push({ "item": `${itemName} x ${quantity}` });
    }
  });

  // Sort the categories by their "Category Name" in the desired order
  const desiredOrder = ['CAB', 'PAN', 'FLR', 'FLA', 'CBA'];
  categories.sort((a, b) => desiredOrder.indexOf(a["Category Name"]) - desiredOrder.indexOf(b["Category Name"]));

  // Wrap the categories in a "Categories" array
  const output = {
    Categories: categories
  };

  console.log(output);
  return output;
}
