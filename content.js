chrome.storage.local.get("companies", (data) => {
  const companies = data.companies || [];

  // Fonction pour filtrer les éléments
  const filterJobCards = () => {
      document.querySelectorAll('.job-card-container.relative.job-card-list').forEach((item) => {
          if (companies.some((company) => item.textContent.includes(company))) {
              item.setAttribute('style', 'display: none !important;');
          }
      });
  };

  // Exécution immédiate
  filterJobCards();

  // Exécution toutes les secondes
  setInterval(filterJobCards, 1000);
});
