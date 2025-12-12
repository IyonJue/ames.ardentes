// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// Cartes personnages qui se retournent au clic
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// Gestion des onglets (univers + merch)
document.querySelectorAll('.tabs').forEach(tabContainer => {
  const buttons = tabContainer.querySelectorAll('.tab-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      if (!id) return;

      // boutons actifs
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // panneaux dans la même section
      const section = tabContainer.closest('section');
      if (!section) return;

      section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const panel = section.querySelector('#tab-' + id);
      if (panel) panel.classList.add('active');
    });
  });
});

// ===== QUIZ ARBRE À 5 ÉTAGES =====

const treeData = {
  start: {
    question: "Quand tu arrives dans un groupe en crise, on te reproche souvent de :",
    options: [
      { label: "Prendre trop vite le commandement.", next: "commandement" },
      { label: "Vouloir apaiser tout le monde avant d'agir.", next: "apaiser" },
      { label: "Observer longtemps sans parler.", next: "observer" },
      { label: "Questionner les règles et les décisions.", next: "questionner" },
      { label: "Bidouiller des solutions sans attendre l’accord de tous.", next: "bidouiller" }
    ]
  },

  // ÉTAGE 2
  commandement: {
    question: "On te confie une mission dangereuse. Ta priorité absolue, c’est :",
    options: [
      { label: "Tenir la ligne, quoi qu’il en coûte.", next: "elfe_chemin" },
      { label: "Éviter les pertes dans ton équipe, même si la mission échoue.", next: "fee_chemin" }
    ]
  },
  apaiser: {
    question: "Quel genre de \"réparation\" te parle le plus ?",
    options: [
      { label: "Panser des blessures physiques.", next: "fee_chemin" },
      { label: "Apaiser les traumatismes, les cauchemars, les regrets.", next: "mage_chemin" }
    ]
  },
  observer: {
    question: "Quand tu observes, tu le fais surtout pour :",
    options: [
      { label: "Comprendre comment les choses fonctionnent concrètement.", next: "humain_chemin" },
      { label: "Chercher des signes, des motifs, des prophéties cachées.", next: "mage_chemin" }
    ]
  },
  questionner: {
    question: "Face à une injustice flagrante, tu te vois plutôt :",
    options: [
      { label: "Organiser un mouvement sur le long terme.", next: "gnome_chemin" },
      { label: "Mettre un coup de pied dans la fourmilière maintenant.", next: "elfe_chemin" }
    ]
  },
  bidouiller: {
    question: "Tu as quelques heures et du matériel limité. Tu fabriques :",
    options: [
      { label: "Un système pour mieux distribuer les ressources.", next: "gnome_chemin" },
      { label: "Un gadget qui simplifie la vie de tout le monde.", next: "humain_chemin" }
    ]
  },

  // ÉTAGE 3 : chemins intermédiaires (on affine)
  elfe_chemin: {
    question: "Qu’est-ce qui te fait le plus peur ?",
    options: [
      { label: "Décevoir ceux qui comptent sur toi en première ligne.", next: "elfe_fin" },
      { label: "Être forcé·e de frapper des innocents.", next: "fee_fin" }
    ]
  },
  fee_chemin: {
    question: "Tu préfères soigner :",
    options: [
      { label: "Les corps : fractures, brûlures, épuisement.", next: "fee_fin" },
      { label: "Les liens : trahisons, colères, pertes.", next: "mage_fin" }
    ]
  },
  mage_chemin: {
    question: "Si tu découvrais un énorme secret sur la Stare, tu :",
    options: [
      { label: "Le gardes, le temps de tout comprendre.", next: "mage_fin" },
      { label: "Le partages avec un petit cercle de personnes clés.", next: "gnome_fin" }
    ]
  },
  gnome_chemin: {
    question: "On te donne les clés des réserves. Tu :",
    options: [
      { label: "Optimises tout, même si certains râlent.", next: "gnome_fin" },
      { label: "Crées des marges cachées pour les plus fragiles.", next: "fee_fin" }
    ]
  },
  humain_chemin: {
    question: "Ce qui te fait le plus vibrer, c’est :",
    options: [
      { label: "Imaginer et construire des choses qui n’existent pas encore.", next: "humain_fin" },
      { label: "Améliorer ce qui existe déjà pour le rendre plus juste.", next: "gnome_fin" }
    ]
  },

  // ÉTAGES 4–5 : fins (peuple déterminé)
  elfe_fin: {
    result: {
      peuple: "ELFE",
      texte: "Tu ressembles aux elfes de la Stare : tu tiens la ligne, tu protèges les autres en première ligne, et tu refuses d’obéir les yeux fermés quand quelque chose sonne faux."
    }
  },
  fee_fin: {
    result: {
      peuple: "FÉE",
      texte: "Tu te rapproches des fées : tu sais que tout combat laisse des cicatrices, et tu consacres ton énergie à réparer, apaiser, recoudre ce qui peut encore l’être."
    }
  },
  mage_fin: {
    result: {
      peuple: "MAGE",
      texte: "Tu partages beaucoup avec les mages : tu observes, tu gardes des secrets le temps de comprendre, et tu sais que les histoires du passé peuvent sauver l’avenir."
    }
  },
  gnome_fin: {
    result: {
      peuple: "GNOME",
      texte: "Ton esprit ressemble à celui des gnomes : tu pèses chaque ressource, tu vois les conséquences à long terme et tu construis des plans qui tiennent debout."
    }
  },
  humain_fin: {
    result: {
      peuple: "HUMAIN",
      texte: "Tu es proche des humains de la Stare : tu improvises, tu inventes, tu bidouilles des solutions et tu refuses qu’on t’enferme dans une seule façon de faire."
    }
  }
};

function initTreeQuiz() {
  const qEl = document.getElementById('treeQuestion');
  const oEl = document.getElementById('treeOptions');
  const rEl = document.getElementById('treeResult');
  if (!qEl || !oEl || !rEl) return;

  function renderNode(key) {
    const node = treeData[key];
    if (!node) return;

    rEl.textContent = "";

    // Feuille finale : on affiche le résultat
    if (node.result) {
      qEl.textContent = "Résultat :";
      oEl.innerHTML = "";
      const titre = document.createElement('strong');
      titre.textContent = node.result.peuple + " · ";
      const span = document.createElement('span');
      span.textContent = node.result.texte;
      rEl.innerHTML = "";
      rEl.appendChild(titre);
      rEl.appendChild(span);

      const restart = document.createElement('button');
      restart.textContent = "Recommencer le test";
      restart.className = "btn-ghost";
      restart.style.marginTop = "0.8rem";
      restart.addEventListener('click', () => renderNode('start'));
      oEl.appendChild(restart);
      return;
    }

    // Question intermédiaire
    qEl.textContent = node.question;
    oEl.innerHTML = "";
    node.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt.label;
      btn.addEventListener('click', () => renderNode(opt.next));
      oEl.appendChild(btn);
    });
  }

  renderNode('start');
}

document.addEventListener('DOMContentLoaded', initTreeQuiz);
