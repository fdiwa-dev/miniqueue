# MiniQueue — Marketing & Outreach Plan

> Généré le 2026-06-03
> Produit : MiniQueue — REST API pour job queues (Node.js, SQLite, pas de Redis)
> Site : https://fdiwa-dev.github.io/miniqueue/
> Repo : https://github.com/fdiwa-dev/miniqueue
> Product Hunt : https://www.producthunt.com/posts/miniqueue
> Lemon Squeezy : https://miniqueue.lemonsqueezy.com
> Email : fdiwaassisstantbot@gmail.com

---

## 1. Annuaires SaaS — Statut des Soumissions

### ✅ Product Hunt (DÉJÀ FAIT)
https://www.producthunt.com/posts/miniqueue
→ MiniQueue est déjà listé. Maintenir en updatant les réponses aux commentaires.

### ❌ SaasHub (https://saashub.com)
**Statut : NON SOUMIS — Soumission manuelle requise**
- Page de soumission : https://saashub.com/submit
- **Instructions** : Cliquer sur le bouton "Submit" en haut à droite. Formulaire nécessite :
  - Nom du produit
  - URL du site
  - Description courte
  - Tags / Catégories
  - Email de contact
- **Tags conseillés** : `job-queue`, `nodejs`, `api`, `sqlite`, `backend`
- **Note** : Site très actif pour les outils SaaS/dev. Soumettre via email à support@saashub.com si le formulaire n'est pas trouvé.

### ❌ AlternativeTo (https://alternativeto.net)
**Statut : NON SOUMIS — Soumission manuelle requise**
- Lien soumission : https://alternativeto.net/contribute/
- **Instructions** : Aller sur "Contribute" → "Add Software". Remplir :
  - Titre : MiniQueue
  - Description courte
  - URL du site / repo GitHub
  - Catégorie : "Development Tools" ou "Task Queue"
- **Stratégie** : Ajouter MiniQueue comme alternative à Bull, BullMQ, Bee-Queue, Kue
  - Lien alternative : https://alternativeto.net/software/bull/
  - Cliquer sur "Suggest an alternative" → lier MiniQueue

### ❌ LibHunt (https://libhunt.com)
**Statut : NON SOUMIS — Soumission manuelle requise**
- Lien soumission : https://libhunt.com/contribute
- **Instructions** : Il faut proposer le package. Aller sur :
  - Catégorie Node.js queue packages
  - Ajouter via https://libhunt.com/submit
- **Alternative** : Ajouter un commentaire sur https://nodejs.libhunt.com/bull-alternatives pour mentionner MiniQueue

### ❌ SaaSworthy (https://www.saasworthy.com)
**Statut : NON SOUMIS — Soumission manuelle requise (site protégé par Cloudflare)**
- Page de listing : https://www.saasworthy.com/listing
- **Instructions** : Le site a une protection Cloudflare. Soumission manuelle depuis un navigateur normal :
  1. Aller sur https://www.saasworthy.com
  2. Cliquer "Add Listing" ou "Submit Your SaaS"
  3. Remplir les détails (nom, URL, description, pricing)
- **Catégorie** : Developer Tools → Task Queue / Background Jobs

### ❌ GetLatka (https://getlatka.com)
**Statut : NON SOUMIS — Pas de soumission directe pour les petits SaaS**
- GetLatka est un annuaire/analyse de SaaS B2B. Pas de soumission directe évidente.
- **Recommandation** : Contacter l'équipe via support@getlatka.com pour ajouter MiniQueue.
- **Alternative** : Utiliser leur "Founder Survey" ou "Company Profile" request.

### 📌 Sourcify (https://sourcify.net)
**Non listé dans le brief mais recommandé** — Annuaire open source / paid products.

---

## 2. Template d'Email de Cold Outreach

### Version Française

**Objet :** Une alternative plus simple à Bull/BullMQ (pas de Redis)

**Corps :**

Bonjour [Prénom],

Je développe MiniQueue — une API REST de job queue pour Node.js qui tourne **sans Redis** (SQLite natif).

Pourquoi c'est utile :
- ✅ **Zéro dépendance Redis** — juste `npm install miniqueue`
- ✅ **API REST simple** (POST /jobs, GET /jobs/:id)
- ✅ **Pas d'infra à gérer** — parfait pour les petites/moyennes apps
- ✅ **Pricing simple** — $5/mois (Pro), $15/mois (Business)

J'ai vu que [nom repo/projet] utilise Bull/BullMQ. Si tu cherches une alternative plus légère — surtout pour des projets sans Redis ou en dev — MiniQueue pourrait t'intéresser.

👉 https://fdiwa-dev.github.io/miniqueue/

Des questions ou du feedback ? Je suis preneur !

Bien cordialement,
[Prénom Nom]
fdiwaassisstantbot@gmail.com

---

### English Version

**Subject:** A simpler Bull/BullMQ alternative (no Redis)

**Body:**

Hi [Name],

I built MiniQueue — a REST job queue API for Node.js that runs **without Redis** (native SQLite).

Why it matters:
- ✅ **Zero Redis dependency** — just `npm install miniqueue`
- ✅ **Simple REST API** (POST /jobs, GET /jobs/:id)
- ✅ **No infra to manage** — perfect for small/medium apps
- ✅ **Simple pricing** — $5/mo (Pro), $15/mo (Business)

I saw that [repo/project] uses Bull/BullMQ. If you're looking for a lighter alternative — especially for projects without Redis or in dev — MiniQueue might be worth a look.

👉 https://fdiwa-dev.github.io/miniqueue/

Happy to answer any questions or get feedback!

Best,
[Name]
fdiwaassisstantbot@gmail.com

---

## 3. Prospects GitHub — Repos utilisant Bull/BullMQ/Bee-Queue

### Top Prospects identifiés

| # | Repo | URL | Pourquoi cible |
|---|------|-----|----------------|
| 1 | **OptimalBits/bull** (lib) | https://github.com/OptimalBits/bull | 16k stars, **150 issues ouvertes**, librairie Bull elle-même — les utilisateurs frustrés cherchent des alternatives |
| 2 | **taskforcesh/bullmq** (lib) | https://github.com/taskforcesh/bullmq | 7k+ stars, librairie BullMQ — même public, dépendance Redis lourde |
| 3 | **bee-queue/bee-queue** (lib) | https://github.com/bee-queue/bee-queue | 4k stars, **37 issues ouvertes** — dépendance Redis, pas de REST API |
| 4 | **pulsecron/pulse** | https://github.com/pulsecron/pulse | **25 issues ouvertes**, se présente comme alternative aux queues Redis-based — concurrence directe, bonne cible pour migration |
| 5 | **n8n-io/n8n** | https://github.com/n8n-io/n8n | Workflow automation avec queues — utilise Bull/BullMQ en interne |
| 6 | **parse-community/parse-server** | https://github.com/parse-community/parse-server | Utilise des job queues, pourrait bénéficier de MiniQueue |
| 7 | **jwasham/coding-interview-university** | https://github.com/jwasham/coding-interview-university | **113 issues ouvertes** — pas une cible directe mais très suivi, mentionner MiniQueue dans les ressources |
| 8 | **balerter/balerter** | https://github.com/balerter/balerter | OSS monitoring tool — utilise des queues pour l'alerte |
| 9 | **Cryptoytb/chronostash** | https://github.com/Cryptoytb/chronostash | Utilise BullMQ pour backup DB — petite équipe, besoin simple |
| 10 | **Adityaveer756/Job-importer-system** | https://github.com/Adityaveer756/Job-importer-system | Utilise Bull/Redis — projet de job import, parfait pour MiniQueue |

### Méthode alternative pour trouver plus de prospects

Quand l'API GitHub sera disponible à nouveau, lancer :

```
curl -H "Accept: application/vnd.github+json" \
  "https://api.github.com/search/repositories?q=bullmq+OR+bee-queue+OR+%22bull%22+queue&sort=stars&per_page=30"
```

Et filtrer les repos avec `open_issues_count > 0` et `language:JavaScript` ou `language:TypeScript`.

### Comment faire l'outreach GitHub

1. **Pour chaque repo** : trouver des issues où l'utilisateur demande une alternative à Redis ou une simplification
   - Exemple : issues Bull #1304 (infinite loop on BRPOPLPUSH), #758 (cluster mode issues)
2. **Commenter** en mentionnant MiniQueue comme solution plus simple
3. **Ne pas spammer** — être utile, pas promoteur
4. **Priorité** : repos avec 50+ stars et issues actives sur les queues

---

## 4. Actions Recommandées (Priorisées)

### Priorité Haute (cette semaine)
- [ ] Soumettre MiniQueue sur **AlternativeTo** comme alternative à Bull
- [ ] Soumettre sur **SaaSHub**
- [ ] Poster dans les issues Bull #1304 et #758 en mentionnant MiniQueue

### Priorité Moyenne (cette quinzaine)
- [ ] Soumettre sur **LibHunt**
- [ ] Contacter **GetLatka** par email
- [ ] Soumettre sur **SaaSworthy** (depuis un vrai navigateur)

### Priorité Faible (ce mois)
- [ ] Chercher des repos additionnels (quand l'API GitHub sera disponible)
- [ ] Ajouter MiniQueue aux listes "awesome-nodejs" et autres awesome lists
- [ ] Envoyer les cold outreach emails de test à 3-5 prospects
