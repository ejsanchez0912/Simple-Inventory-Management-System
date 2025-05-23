document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const itemForm = document.getElementById('itemForm');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const inventoryList = document.getElementById('inventoryList');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Form fields
    const itemIdField = document.getElementById('itemId');
    const nameField = document.getElementById('name');
    const quantityField = document.getElementById('quantity');
    const priceField = document.getElementById('price');
    
    // API endpoints
    const API_URL = {
        CREATE: 'api/create.php',
        READ: 'api/read.php',
        UPDATE: 'api/update.php',
        DELETE: 'api/delete.php'
    };
    
    // Load inventory items
    loadInventory();
    
    // Event listeners
    itemForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    searchBtn.addEventListener('click', searchItems);
    resetBtn.addEventListener('click', loadInventory);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchItems();
        }
    });
    
    // Load all inventory items
    function loadInventory() {
        // Show loading state
        inventoryList.innerHTML = '<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
        
        fetch(API_URL.READ)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    displayInventory(data);
                } else {
                    console.error('Error loading inventory:', data.error);
                    alert('Error loading inventory. Please try again.');
                    inventoryList.innerHTML = '<tr><td colspan="6" class="text-center">Error loading data</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error loading inventory. Please try again.');
                inventoryList.innerHTML = '<tr><td colspan="6" class="text-center">Error loading data</td></tr>';
            });
            
        // Reset search input
        searchInput.value = '';
    }
    
    // Display inventory items in the table
    function displayInventory(items) {
        inventoryList.innerHTML = '';
        
        if (items.length === 0) {
            inventoryList.innerHTML = '<tr><td colspan="6" class="text-center"><i class="fas fa-info-circle"></i> No items found</td></tr>';
            return;
        }
        
        items.forEach(item => {
            const row = document.createElement('tr');
            
            // Format the price to 2 decimal places
            const formattedPrice = parseFloat(item.price).toFixed(2);
            
            // Format the date
            const createdDate = new Date(item.created_at);
            const formattedDate = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString();
            
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${formattedPrice}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            
            inventoryList.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Handle form submission (create or update)
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const item = {
            name: nameField.value.trim(),
            quantity: parseInt(quantityField.value),
            price: parseFloat(priceField.value)
        };
        
        // Validate input
        if (item.name === '') {
            alert('Please enter a name for the item');
            nameField.focus();
            return;
        }
        
        if (isNaN(item.quantity) || item.quantity < 0) {
            alert('Please enter a valid quantity');
            quantityField.focus();
            return;
        }
        
        if (isNaN(item.price) || item.price < 0) {
            alert('Please enter a valid price');
            priceField.focus();
            return;
        }
        
        const isEditing = itemIdField.value !== '';
        
        if (isEditing) {
            // Update existing item
            item.id = parseInt(itemIdField.value);
            
            fetch(API_URL.UPDATE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Item updated successfully!');
                    resetForm();
                    loadInventory();
                } else {
                    alert('Error: ' + (data.error || 'Failed to update item'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error updating item. Please try again.');
            });
        } else {
            // Create new item
            fetch(API_URL.CREATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Item added successfully!');
                    resetForm();
                    loadInventory();
                } else {
                    alert('Error: ' + (data.error || 'Failed to add item'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding item. Please try again.');
            });
        }
    }
    
    // Handle edit button click
    function handleEdit(e) {
        const itemId = e.target.closest('.edit-btn').getAttribute('data-id');
        const row = e.target.closest('tr');
        const cells = row.querySelectorAll('td');
        
        // Fill form with item data
        itemIdField.value = itemId;
        nameField.value = cells[1].textContent;
        quantityField.value = cells[2].textContent;
        priceField.value = cells[3].textContent.replace('$', '');
        
        // Update form UI for editing
        formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Item';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Item';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        document.querySelector('.form-container') ? 
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' }) : 
            document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Handle delete button click
    function handleDelete(e) {
        const itemId = e.target.closest('.delete-btn').getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this item?')) {
            fetch(API_URL.DELETE, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: itemId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert('Item deleted successfully!');
                    loadInventory();
                } else {
                    alert('Error: ' + (data.error || 'Failed to delete item'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting item. Please try again.');
            });
        }
    }
    
    // Reset form to add new item state
    function resetForm() {
        itemForm.reset();
        itemIdField.value = '';
        formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Item';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Item';
        cancelBtn.style.display = 'none';
    }
    
    // Search items
    function searchItems() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            loadInventory();
            return;
        }
        
        // Show loading state
        inventoryList.innerHTML = '<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Searching...</td></tr>';
        
        fetch(API_URL.READ)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filteredItems = data.filter(item => 
                        item.name.toLowerCase().includes(searchTerm) || 
                        item.id.toString().includes(searchTerm)
                    );
                    displayInventory(filteredItems);
                } else {
                    console.error('Error searching inventory:', data.error);
                    alert('Error searching inventory. Please try again.');
                    inventoryList.innerHTML = '<tr><td colspan="6" class="text-center">Error searching data</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error searching inventory. Please try again.');
                inventoryList.innerHTML = '<tr><td colspan="6" class="text-center">Error searching data</td></tr>';
            });
    }
});
