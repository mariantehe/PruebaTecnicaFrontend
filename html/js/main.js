document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, buscando botón...');
  const loadButton = document.getElementById('loadProductsBtn');

  if (loadButton) {
    console.log('Botón encontrado, añadiendo evento click');
    loadButton.addEventListener('click', loadProducts);
  } else {
    console.error('Error: Botón "loadProductsBtn" no encontrado. Verifica el ID en products.html.');
  }
});

async function loadProducts() {
  console.log('Iniciando carga de productos...');
  try {
    const apiUrl = 'https://api.escuelajs.co/api/v1/products';
    const response = await fetch(apiUrl, { mode: 'cors' });

    if (!response.ok) {
      throw new Error(`Error en la red: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Productos recibidos: ${data.length}`);
    const products = data.slice(0, 17);

    const container = document.getElementById('products-container');
    if (!container) {
      throw new Error('Contenedor "products-container" no encontrado. Verifica el ID en products.html.');
    }

    // No eliminar las cards existentes, solo añadir nuevas
    products.forEach(product => {
      console.log(`Creando card para producto: ${product.title}`);
      const col = document.createElement('div');
      col.classList.add('col');

      const card = document.createElement('div');
      card.classList.add('card', 'shadow-sm');

      const img = document.createElement('img');
      img.src = product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/225?text=No+Image';
      img.alt = product.title || 'Producto sin título';
      img.classList.add('bd-placeholder-img', 'card-img-top');
      img.setAttribute('width', '100%');
      img.setAttribute('height', '225');
      card.appendChild(img);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const title = document.createElement('p');
      title.classList.add('card-text');
      title.textContent = product.title || 'Sin título';
      cardBody.appendChild(title);

      const description = document.createElement('p');
      description.classList.add('card-text');
      description.textContent = product.description
        ? product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '')
        : 'Sin descripción';
      cardBody.appendChild(description);

      const flexContainer = document.createElement('div');
      flexContainer.classList.add('d-flex', 'justify-content-between', 'align-items-center');

      const btnGroup = document.createElement('div');
      btnGroup.classList.add('btn-group');

      const viewButton = document.createElement('button');
      viewButton.type = 'button';
      viewButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
      viewButton.textContent = 'View';
      viewButton.addEventListener('click', () => showModal(product));
      btnGroup.appendChild(viewButton);

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
      editButton.textContent = 'Edit';
      btnGroup.appendChild(editButton);

      flexContainer.appendChild(btnGroup);

      const price = document.createElement('small');
      price.classList.add('text-body-secondary');
      price.textContent = product.price ? `$${product.price.toFixed(2)}` : '$0.00';
      flexContainer.appendChild(price);

      cardBody.appendChild(flexContainer);
      card.appendChild(cardBody);
      col.appendChild(card);
      container.appendChild(col);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    const container = document.getElementById('products-container');
    if (container) {
      const errorCol = document.createElement('div');
      errorCol.classList.add('col');
      errorCol.innerHTML = '<p class="text-danger">Error al cargar los productos. Intenta de nuevo.</p>';
      container.appendChild(errorCol);
    }
  }
}

function showModal(product) {
  console.log(`Abriendo modal para producto: ${product.title || 'Sin título'}`);
  const modalTitle = document.querySelector('#productModal .modal-title');
  const modalBody = document.querySelector('#productModal .modal-body');

  if (!modalTitle || !modalBody) {
    console.error('Error: Elementos del modal no encontrados. Verifica el ID "productModal" en products.html.');
    return;
  }

  modalTitle.textContent = product.title || 'Sin título';
  modalBody.innerHTML = '';

  const fullDesc = document.createElement('p');
  fullDesc.textContent = product.description || 'Sin descripción';
  modalBody.appendChild(fullDesc);

  const category = document.createElement('p');
  category.textContent = product.category && product.category.name
    ? `Categoría: ${product.category.name}`
    : 'Categoría: No especificada';
  modalBody.appendChild(category);

  if (product.images && product.images[1]) {
    const img2 = document.createElement('img');
    img2.src = product.images[1];
    img2.alt = 'Imagen 2';
    img2.classList.add('img-fluid', 'mb-2');
    img2.style.maxWidth = '50%';
    modalBody.appendChild(img2);
  }
  if (product.images && product.images[2]) {
    const img3 = document.createElement('img');
    img3.src = product.images[2];
    img3.alt = 'Imagen 3';
    img3.classList.add('img-fluid', 'mb-2');
    img3.style.maxWidth = '50%';
    modalBody.appendChild(img3);
  }

  try {
    const modalElement = document.getElementById('productModal');
    if (!modalElement) {
      throw new Error('Elemento modal "productModal" no encontrado.');
    }
    const modal = new bootstrap.Modal(modalElement, { keyboard: true });
    modal.show();
  } catch (error) {
    console.error('Error al abrir el modal:', error);
  }
}