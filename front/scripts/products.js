
import { database } from "./database.js";
import { getProdId, loadProducts} from "./functions.js";

// -------- Variaveis do projeto ------------------------
const sectionProducts = document.querySelector(".section-product-grid")
//Fitros
//Funçoes com parametros

async function fetchAllProducts() {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/produtos`);
        if (!response.ok) throw new Error("Erro ao carregar produtos");
        const produtos = await response.json();
        console.log('teste')
        loadProducts(produtos, sectionProducts);
        
    } catch (error) {
        console.error("Erro:", error);
    }
  }

fetchAllProducts();
getProdId();

// getProdId()
