// script.js
const addItemButton = document.getElementById('add-item');
const clearInputsButton = document.getElementById('clear-inputs');
const itemListItems = document.getElementById('item-list-items');
const generatePdfButton = document.getElementById('generate-pdf');
let items = [];

addItemButton.addEventListener('click', () => {
    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);

    if (itemName && !isNaN(itemPrice)) {
        items.push({ name: itemName, description: itemDescription, price: itemPrice });
        updateItemList();
        clearInputFields();
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
    itemListItems.innerHTML = '';
    items.forEach((item, index) => {
        const listItem = document.createElement('li');

        // Create spans for each part of the item details
        const itemNameSpan = document.createElement('span');
        itemNameSpan.classList.add('item-name-display');
        itemNameSpan.textContent = item.name;

        const itemDescriptionSpan = document.createElement('span');
        itemDescriptionSpan.classList.add('item-description-display');
        itemDescriptionSpan.textContent = item.description;

        const itemPriceSpan = document.createElement('span');
        itemPriceSpan.classList.add('item-price-display');
        itemPriceSpan.textContent = `$${item.price.toFixed(2)}`;

         // Create a container for all details and add the spans
        const itemDetailsContainer = document.createElement('span');
        itemDetailsContainer.classList.add('item-details');
        itemDetailsContainer.appendChild(itemNameSpan);
        itemDetailsContainer.appendChild(itemDescriptionSpan);
        itemDetailsContainer.appendChild(itemPriceSpan);

        listItem.appendChild(itemDetailsContainer);


        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            items.splice(index, 1);
            updateItemList();
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

    if (companyName) {
        doc.setFontSize(16);
        doc.text(companyName, 10, 10);
    }

    doc.setFontSize(20);
    doc.text(listName, 10, companyName ? 20 : 10);

    doc.setFontSize(12);

    let yPos = companyName ? 35 : 25;
    const lineHeight = 10;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth() - 2 * margin;
    const itemWidth = pageWidth * 0.2;
    const descriptionWidth = pageWidth * 0.6;  //Corrected
    const priceWidth = pageWidth * 0.2; // Corrected.  Must total 1.0 (100%)

    items.forEach(item => {
        // --- Inline layout within the PDF ---
        doc.setFont('helvetica', 'bold');
        doc.text(item.name, margin, yPos, { maxWidth: itemWidth });
        doc.setFont('helvetica', 'normal');
        // Description *after* name
        const descriptionLines = doc.splitTextToSize(item.description, descriptionWidth);
        doc.text(descriptionLines, margin + itemWidth, yPos, { maxWidth: descriptionWidth});
        // Price *after* description
        doc.text(`$${item.price.toFixed(2)}`, margin + itemWidth + descriptionWidth, yPos, { maxWidth: priceWidth });

        const itemHeight = Math.max(lineHeight, descriptionLines.length * lineHeight);
        yPos += itemHeight + 5;

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
