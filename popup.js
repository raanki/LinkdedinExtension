document.addEventListener("DOMContentLoaded", () => {
  const companyList = document.getElementById("company-list");
  const newCompanyInput = document.getElementById("new-company");
  const addCompanyButton = document.getElementById("add-company");
  const searchInput = document.getElementById("search-company");
  const saveButton = document.getElementById("save");
  const resetButton = document.getElementById("reset");
  const runButton = document.getElementById("run");
  const flashMessages = document.getElementById("flash-messages");

  // Entreprises par défaut
  const defaultCompanies = [
    'OpenClassrooms',
    'MeteoJobs',
    'WebForce3',
    'CESI',
    'METEOJOB by CleverConnect',
    'ISCOD',
    'School',
    'ÉCOLES',
    'TieTalent',
    'Institut F2I',
    'Sup de Vinci - école d\'informatique',
    'ESPL - Campus des Écoles Supérieures des Pays de Loire',
    'Groupe Alternance',
    'AI2 Education: Applied Institute of Artificial Intelligence'
  ];

  // Charger les entreprises sauvegardées ou utiliser les valeurs par défaut
  chrome.storage.local.get("companies", (data) => {
    const companies = data.companies && data.companies.length > 0
      ? data.companies
      : defaultCompanies;

    companies.forEach((company) => addCompanyToList(company));
  });

  // Ajouter une entreprise à la liste
  addCompanyButton.addEventListener("click", () => {
    const newCompany = newCompanyInput.value.trim();
    if (newCompany) {
      addCompanyToList(newCompany);
      newCompanyInput.value = "";
      showFlashMessage("Entreprise ajoutée avec succès !", "success");
    } else {
      showFlashMessage("Veuillez entrer un nom d'entreprise valide.", "danger");
    }
  });

  // Réinitialiser la liste des entreprises à la liste par défaut
  resetButton.addEventListener("click", () => {
    // Réinitialiser le stockage local avec les entreprises par défaut
    chrome.storage.local.set({ companies: defaultCompanies }, () => {
      // Réinitialiser l'affichage de la liste
      companyList.innerHTML = ""; // Supprimer l'existant
      defaultCompanies.forEach((company) => addCompanyToList(company)); // Réinsérer les valeurs par défaut
      showFlashMessage("Liste réinitialisée avec succès !", "success");
    });
  });

  // Fonction pour ajouter une entreprise dans la liste HTML
  function addCompanyToList(company) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = company;
  
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-sm btn-danger";
    deleteButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`; // Ajoute l'icône Font Awesome
    deleteButton.addEventListener("click", () => {
      li.remove();
      showFlashMessage("Entreprise supprimée avec succès !", "warning");
    });
  
    li.appendChild(deleteButton);
    companyList.appendChild(li);
  }
  

  // Barre de recherche pour filtrer les entreprises
  searchInput.addEventListener("input", () => {
    const filterText = searchInput.value.toLowerCase();
    const items = companyList.querySelectorAll("li");
  
    items.forEach((item) => {
      const companyName = item.firstChild.nodeValue.trim().toLowerCase(); // Récupère uniquement le texte brut
      if (companyName.includes(filterText)) {
        item.setAttribute('style', 'display: flex !important;'); // Affiche l'élément
      } else {
        item.setAttribute('style', 'display: none !important;'); // Cache l'élément
      }
    });
  });
  

  // Sauvegarder la liste des entreprises
  saveButton.addEventListener("click", () => {
    const companies = Array.from(companyList.children).map((li) => li.textContent.replace("❌", "").trim());
    chrome.storage.local.set({ companies }, () => {
      showFlashMessage("Liste sauvegardée avec succès !", "success");
    });
  });

  // Lancer le script
  runButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
      showFlashMessage("Script lancé avec succès !", "info");
    });
  });

  // Fonction pour afficher un message flash
  function showFlashMessage(message, type) {
    const flashMessage = document.createElement("div");
    flashMessage.className = `alert alert-${type} alert-dismissible fade show`;
    flashMessage.role = "alert";
    flashMessage.innerHTML = `
      ${message}
    `;
    flashMessages.appendChild(flashMessage);

    // Supprimer le message automatiquement après 3 secondes
    setTimeout(() => {
      flashMessage.remove();
    }, 3000);
  }
});
