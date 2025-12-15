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

document.querySelectorAll('[data-target]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const id = btn.dataset.target;
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
// ===== CALENDRIER MENSUEL AGENDA =====
function initMonthlyCalendar() {
  const calendarEl = document.querySelector('.calendar');
  const eventsDataList = document.getElementById('eventsData');
  if (!calendarEl || !eventsDataList) return;

  const monthYearEl = document.getElementById('calendarMonthYear');
  const gridEl = calendarEl.querySelector('.calendar-grid');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  const eventDetail = document.getElementById('eventDetail');
  const eventTitle = document.getElementById('eventTitle');
  const eventMeta = document.getElementById('eventMeta');
  const eventDescription = document.getElementById('eventDescription');
  const eventGoogleLink = document.getElementById('eventGoogleLink');

  const events = Array.from(eventsDataList.querySelectorAll('.event-item')).map(li => ({
    date: li.dataset.date,   // YYYY-MM-DD
    time: li.dataset.time || '00:00',
    end: li.dataset.end || '',
    city: li.dataset.city || '',
    title: li.dataset.title || '',
    description: li.dataset.description || ''
  }));

  let current = new Date();
  current.setDate(1);

  function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth(); // 0-11

    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    // Nettoie les anciennes cases jours (on garde la première ligne avec .dow)
    gridEl.querySelectorAll('.calendar-day').forEach(d => d.remove());

    const firstDay = new Date(year, month, 1);
    const startingWeekday = (firstDay.getDay() + 6) % 7; // Lundi=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Cases vides avant le 1er
    for (let i = 0; i < startingWeekday; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day';
      gridEl.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';

      const num = document.createElement('div');
      num.className = 'calendar-day-number';
      num.textContent = day;
      cell.appendChild(num);

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      events
        .filter(ev => ev.date === dateStr)
        .forEach(ev => {
          const chip = document.createElement('div');
          chip.className = 'calendar-event';
          chip.textContent = ev.title || 'Événement';
          chip.addEventListener('click', () => showEvent(ev));
          cell.appendChild(chip);
        });

      gridEl.appendChild(cell);
    }
  }

  function showEvent(ev) {
    if (!eventDetail) return;
    eventDetail.style.display = 'block';
    eventTitle.textContent = ev.title || 'Événement';
    const metaParts = [];
    if (ev.date) metaParts.push(ev.date);
    if (ev.time) metaParts.push(`à ${ev.time}`);
    if (ev.city) metaParts.push(ev.city);
    eventMeta.textContent = metaParts.join(' – ');
    eventDescription.textContent = ev.description || '';

    // Lien Google Agenda
    const start = new Date(`${ev.date}T${ev.time || '00:00'}:00`);
    let end;
    if (ev.end) {
      end = new Date(`${ev.date}T${ev.end}:00`);
    } else {
      end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h par défaut
    }

    function formatForGCal(d) {
      return d.toISOString().replace(/-|:|\\.\\d\\d\\d/g, '');
    }

    const startStr = formatForGCal(start);
    const endStr = formatForGCal(end);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: ev.title,
      dates: `${startStr}/${endStr}`,
      details: ev.description,
      location: ev.city

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
// ========== AGENDA / PROCHAIN ÉVÉNEMENT ==========

async function loadNextEvent() {
  const nextEventText = document.getElementById('nextEventText');
  if (!nextEventText) return; // ne tourne que sur la home

  try {
    const res = await fetch('agenda.html');
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const items = Array.from(doc.querySelectorAll('.event-item'));
    if (items.length === 0) {
      nextEventText.textContent = 'Aucun événement à venir n’est renseigné pour le moment.';
      return;
    }

    const now = new Date();
    let best = null;
    let bestDate = null;

    items.forEach(li => {
      const dateStr = li.getAttribute('data-date');
      const timeStr = li.getAttribute('data-time') || '00:00';
      if (!dateStr) return;

      const date = new Date(dateStr + 'T' + timeStr + ':00');
      if (isNaN(date.getTime()) || date < now) return;

      if (!bestDate || date < bestDate) {
        bestDate = date;
        best = li;
      }
    });

    if (!best) {
      nextEventText.textContent = 'Aucun événement à venir n’est renseigné pour le moment.';
      return;
    }

    const title = best.querySelector('strong')?.textContent || 'Événement';
    const city = best.getAttribute('data-city') || '';
    const dateStr = best.getAttribute('data-date');
    const timeStr = best.getAttribute('data-time') || '';

    nextEventText.textContent =
      `${title} – ${dateStr} ${timeStr ? 'à ' + timeStr : ''}${city ? ' – ' + city : ''}`;
  } catch (e) {
    nextEventText.textContent = 'Impossible de charger le prochain événement pour le moment.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadNextEvent();
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

