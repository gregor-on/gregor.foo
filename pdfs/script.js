// script.js
const addItemButton = document.getElementById('add-item');
const clearInputsButton = document.getElementById('clear-inputs'); // Renamed
const itemListItems = document.getElementById('item-list-items');
const generatePdfButton = document.getElementById('generate-pdf');
let items = []; // Use 'let' to allow reassignment

addItemButton.addEventListener('click', () => {
    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);

    if (itemName && !isNaN(itemPrice)) {
        items.push({ name: itemName, description: itemDescription, price: itemPrice });
        updateItemList();
        clearInputFields(); // Clear *input* fields after adding
    } else {
        alert("Please enter a valid item name and price.");
    }
});

clearInputsButton.addEventListener('click', clearInputFields);

function clearInputFields() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-description').value = '';
    document.getElementById('item-price').value = '';
}

function updateItemList() {
    itemListItems.innerHTML = ''; // Clear the list before updating
    items.forEach((item, index) => {
        const listItem = document.createElement('li');

        // Create a span for the item details
        const itemDetailsSpan = document.createElement('span');
        itemDetailsSpan.classList.add('item-details');
        itemDetailsSpan.textContent = `${item.name}  - ${item.description}- $${item.price.toFixed(2)}`;
        listItem.appendChild(itemDetailsSpan);

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️'; // Trash can emoji
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            items.splice(index, 1); // Remove the item from the array
            updateItemList();       // Re-render the list
        });
        listItem.appendChild(deleteButton);

        itemListItems.appendChild(listItem);
    });
}

generatePdfButton.addEventListener('click', () => {
    if (items.length === 0) {
        alert("Please add at least one item to the list.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const listName = document.getElementById('list-name').value || "ItemList";
    const companyName = document.getElementById('company-name').value || "";

    // Company name *above* list name
    if (companyName) {
        doc.setFontSize(16);
        doc.text(companyName, 10, 10);
    }

    doc.setFontSize(20);
    doc.text(listName, 10, companyName ? 20 : 10); // Adjust based on company name


    doc.setFontSize(12);

    let yPos = companyName ? 35 : 25; // Adjust based on company name.  Crucial!
    const lineHeight = 10;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const itemWidth = pageWidth * 0.2;      // 20% for item name
    const priceWidth = pageWidth * 0.1;    // 10% for price
    const descriptionWidth = pageWidth * 0.7; // 70% for description

    items.forEach(item => {
        // --- Inline layout within the PDF ---
        doc.setFont('helvetica', 'bold');
        doc.text(item.name, margin, yPos, { maxWidth: itemWidth });
        doc.setFont('helvetica', 'normal');
        const descriptionLines = doc.splitTextToSize(item.description, descriptionWidth);
        doc.text(descriptionLines, margin + itemWidth + priceWidth, yPos);
        doc.text(`$${item.price.toFixed(2)}`, margin + itemWidth, yPos, { maxWidth: priceWidth });


        // Calculate the height of the *highest* element (likely the description)
        const itemHeight = Math.max(lineHeight, descriptionLines.length * lineHeight);
        yPos += itemHeight + 5; // Add extra space


        if (yPos > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin + lineHeight;
        }
    });

    const now = new Date();
    const generatedDate = `Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFontSize(10);
    doc.text(generatedDate, margin, doc.internal.pageSize.getHeight() - 10);

    doc.save("item-list.pdf");
});
