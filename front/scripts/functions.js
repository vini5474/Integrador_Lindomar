async function fetchProduct(id) {
  try {
    console.log('teste')

      const response = await fetch(`http://127.0.0.1:8000/api/produtos/${id}`);
      if (!response.ok) throw new Error("Produto não encontrado");

      const produto = await response.json();
      console.log(produto)

      // Preencha os elementos HTML com os dados do produto
      document.getElementById("id").value = produto.id;
      document.getElementById("tituloProduto").value = produto.tituloProduto;
      document.getElementById("preco").value = produto.preco;
      document.getElementById("descricao").value = produto.descricao;
      document.getElementById("catProduto").value = produto.catProduto;
      document.getElementById("classProduto").value = produto.classProduto;
      document.getElementById("exibirHome").value = produto.exibirHome;

      const imageContainer = document.getElementById("imageContainer");
      imageContainer.innerHTML = produto.imgProduto
          ? `<img src="http://127.0.0.1:8000/${produto.imgProduto}" alt="Imagem do Produto">`
          : "<p>Sem imagem</p>";
  } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível carregar os dados do produto.");
  }
}

export function loadProducts(productList, load) {
  /* carrega os produtos na home e na pagina de prododus*/

  productList.forEach((produto) => {
    let preco = parseFloat(produto.preco) || 0;
    const precoFormatado = preco > 0 ? `R$ ${preco.toFixed(2)}` : "Preço indisponível";
    const valParcela = (produto.preco / 10).toFixed(2);
    const html = `<div class="product-card idprod" id="${produto.id}">
        <div>
          <img id="${produto.id}"
            src="http://localhost:8000/${produto.imgProduto}"
            alt="${produto.tituloProduto}"
          />
        </div>
        <div class="product-card-info-container">

          <h2 class="product-card-title" title="${produto.tituloProduto}">
          ${produto.tituloProduto}
          </h2>
          
          <h4 class="product-card-reference">Cod. ${produto.id}</h4>
          <h3 class="product-card-price">R$ ${precoFormatado}</h3>
          <h4 class="product-card-installment">
            10x de R$ ${valParcela} s/juros
          </h4>
        </div>
        <a href="./product.html">
        <button id="${produto.id}" class="product-card-btn">COMPRAR</button>
        </a>
      </div>`;
    load.innerHTML += html;
  });
}

// captura o codigo/id do produto
export function getProdId(){
  let itens = document.querySelectorAll(".idprod")
  console.log(itens)
  itens.forEach(item => item.addEventListener('click',(evento)=>{
      let prodID = evento.target.id
      localStorage.setItem('prodId',prodID)
      
  }))
}

// localiza o produto na base de dados
export function findProduct(productList, productId){
  let produto = productList.find(produto => produto.id == productId)
  return produto
}

//carrega o produto na pagina do produto

export function loadProduct(produto,selecaoProduto){

const productCategory = document.querySelector("#product-category");
productCategory.innerText = `${produto.categoriaProduto}`;

const productTitle = document.querySelector("#product-title")

productTitle.children[0].innerText = `COD: ${produto.id}`
productTitle.children[1].innerText = `${produto.tituloProduto}`


 const HTML = `<div class="product_images_container">

 <div class="images_selector">

   <i class="bi bi-chevron-double-up"></i>
 <ul>
   <li><img src="${produto.imgProduto}" alt="" class="product_thumb"></li>
   <li><img src="${produto.imgProduto}"" alt="" class="product_thumb"></li>
   <li><img src="${produto.imgProduto}"" alt="" class="product_thumb"></li>
   <li><img src="${produto.imgProduto}"" alt="" class="product_thumb"></li>
 </ul>
 <i class="bi bi-chevron-double-down"></i>
 </div>
 <div class="images_main">
   <img src="${produto.imgProduto}" alt="">
 </div>
</div>


<div class="product_description_container">
 <h3 class="main-text">
   Descrição

 </h3>
 <p class="product_description">
   ${produto.descricao}
 </p>
</div>`
selecaoProduto.innerHTML = HTML

const price = document.querySelector(".product_price_container")
const parcela = (produto.preco/10).toFixed(2)
price.children[0].innerText = `R$ ${produto.preco.toFixed(2)}`
price.children[1].innerText = `Ou em ate 10x sem juros de R$ ${parcela} no cartão de credito`



}

function cartTotal(cartItens) {
  return cartItens.reduce((total, item) => total + item.preco * item.quantity, 0);
}


export function loadCartItem(cartItens,cartItensHTML){

  if(cartItens.length == [] || cartItens.length == [] ){
    cartItensHTML.innerHTML = `Seu carrinho está vazio`
  } else {
    cartItens.forEach(item => {  
      let html = `
      <div class="cart_item" id="${item.id}">
                  <div class="cart_item_main_img">
                      <img src="${item.imgProduto}" alt="">
                  </div>
                  <div class="cart_item_info">
                      <p>${item.tituloProduto}</p>
                      <p>
                          R$ ${item.preco}
                          <span>Un.</span>
                      </p>
  
                      <h3>R$ ${(item.preco)*(item.quantity)}</h3>
                     <div class="cart_item_qtd_selector">
                      <div class="cart_item_qtd_selector_container">
                          <i class="bi bi-dash"></i>
                          <span>${item.quantity}</span>
                          <i class="bi bi-plus"></i>
                      </div>
                      <button id="${item.id}" class="remove">remover</button>
                     </div>
                  </div>
              </div>
  `
  cartItensHTML.innerHTML += html
  })
  const total = cartTotal(cartItens);
  localStorage.setItem('totalValue', total);
  const price = document.querySelector('.total.container-flex:nth-child(1) h3:nth-child(2)');
  price.innerHTML = `R$ ${total.toFixed(2)}`}

  }
  
  export function removeCartItem(sacolaCompras) {
    let botaoDel = document.querySelectorAll("button.remove"); /* remover produto do carrinho */
    let cartItens = document.querySelector(".grid_col_1");
  
    botaoDel.forEach(botao => botao.addEventListener('click', (event) => {
      let item = event.target.closest(".cart_item");  // Seleciona o elemento do item do carrinho
      let itemId = item.id;
  
      // Remove o elemento do DOM
      cartItens.removeChild(item);
  
      // Encontra e remove o item da lista de compras
      let index = sacolaCompras.findIndex(i => i.id == itemId);
      if (index > -1) {
        sacolaCompras.splice(index, 1);
      }
  
      // Atualiza o total no localStorage
      localStorage.setItem('listaCompras', JSON.stringify(sacolaCompras));
  
      // Recalcula o total e atualiza a interface
      const total = cartTotal(sacolaCompras);
      localStorage.setItem('totalValue', total);
  
      const priceElement = document.querySelector('.total.container-flex:nth-child(1) h3:nth-child(2)');
      priceElement.innerText = `R$ ${total.toFixed(2)}`;
      updateTotal()
    }));
  }
 


export function shop(pedidos){

const form = document.querySelector('#billing form');
const inputs = form.querySelectorAll('input,select');
const inputValues = {};
inputs.forEach((input) => {
  if (input.type!== 'submit' && input.type!== 'button') {
    inputValues[input.name] = input.value;
  }
});
console.log(inputValues);
const order = {
   id: pedidos.length > 0? pedidos[pedidos.length - 1].id + 1 : 1,
   address:{...inputValues},
   items: JSON.parse(localStorage.getItem("listaCompras")),
   totalValue: parseFloat(localStorage.getItem("totalValue"))
};

pedidos.push(order);
localStorage.setItem("pedidos", JSON.stringify(pedidos));;
alert("pedido realizado com sucesso")
localStorage.removeItem("listaCompras");
localStorage.removeItem("totalValue");
window.location = "./index.html"
updateTotal()
} 


function obterFreteSelecionado() {
  // Seleciona o botão de rádio marcado
  const freteSelecionado = document.querySelector('input[name="frete"]:checked');

  // Verifica se algum botão está selecionado
  if (freteSelecionado) {
    const valorFrete = parseFloat(freteSelecionado.value);
    console.log(`Frete selecionado: R$ ${valorFrete}`);
    return valorFrete;
  } else {
    alert("Selecione uma opção de frete.");
    return 0;
  }
}
export function updateTotal() {
  const subtotalElement = document.getElementById('subtotal');
  const subtotal = parseFloat(subtotalElement.innerText.replace('R$', '').trim()) || 0;

  const selectedFreight = document.querySelector('input[name="frete"]:checked');
  const freightValue = selectedFreight ? parseFloat(selectedFreight.value) : 0;

  // Atualiza a interface
  document.getElementById('frete').innerText = `R$ ${freightValue.toFixed(2)}`;
  document.getElementById('totalCarrinho').innerText = `R$ ${(subtotal + freightValue).toFixed(2)}`;

  // Armazena no localStorage
  localStorage.setItem('subtotal', subtotal.toFixed(2));
  localStorage.setItem('frete', freightValue.toFixed(2));
  localStorage.setItem('totalCarrinho', (subtotal + freightValue).toFixed(2));
}

// Evita erro ao tentar carregar frete sem valor selecionado
document.querySelectorAll('input[name="frete"]').forEach(input => {
  input.addEventListener('change', updateTotal);
});

document.addEventListener('DOMContentLoaded', updateTotal);