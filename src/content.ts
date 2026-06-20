import { Bot, Boxes, Braces, Building2, ClipboardCheck, Compass, Database, FileText, GitBranch, KeyRound, Map, PackageCheck, RadioTower, ShieldCheck, TerminalSquare, Truck, Warehouse } from 'lucide-react';

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  section: string;
  icon: keyof typeof icons;
  level?: 'guide' | 'reference' | 'runbook';
  tags: string[];
  body: DocBlock[];
};

export type DocBlock =
  | { type: 'lead'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'steps'; items: { title: string; text: string }[] }
  | { type: 'cards'; items: { title: string; text: string; href?: string }[] }
  | { type: 'callout'; tone?: 'info' | 'warning' | 'success'; title: string; text: string }
  | { type: 'code'; language?: string; code: string }
  | { type: 'table'; columns: string[]; rows: string[][] };

export const icons = {
  Bot, Boxes, Braces, Building2, ClipboardCheck, Compass, Database, FileText, GitBranch, KeyRound, Map, PackageCheck, RadioTower, ShieldCheck, TerminalSquare, Truck, Warehouse,
};

export const sections = ['Démarrer', 'Guides métier', 'Modules', 'Agents IA', 'Développeurs', 'Architecture', 'Opérations'];

export const docs: DocPage[] = [
  {
    slug: 'overview',
    title: 'Vue d’ensemble',
    description: 'Comprendre Pulsar en 5 minutes: plateforme logistique modulaire, postes de travail et agents employés gouvernés.',
    section: 'Démarrer', icon: 'Compass', level: 'guide', tags: ['vision','lsos','modules','agents'],
    body: [
      { type: 'lead', text: 'Pulsar est une plateforme LSOS modulaire pour manufacturiers, distributeurs et équipes logistiques: un core multi-tenant, des apps métier activables, des postes de travail opérationnels et des agents IA employés qui agissent sous gouvernance humaine.' },
      { type: 'cards', items: [
        { title: 'Core plateforme', text: 'Tenants, utilisateurs, RBAC, audit, documents, notifications, clés API, webhooks et registre de modules.', href: '/docs/platform-core' },
        { title: 'Apps métier', text: 'Transportation, Finance/Billing, Assets/Fleet, Warehouse/WMS, Yard/Dock, Customer Portal, Connect.', href: '/docs/modules' },
        { title: 'AI Workforce', text: 'Agents Hermes configurés dans Pulsar, outillés via MCP et contraints par ProposedActions, policies, caps et audit.', href: '/docs/ai-workforce' },
        { title: 'Tool experience', text: 'Pulsar évolue d’une admin SaaS vers de vrais workbenches: Dispatch, Yard Plan, WMS Fulfillment, Control Tower.', href: '/docs/workbenches' }
      ]},
      { type: 'h2', text: 'North star' },
      { type: 'p', text: 'Pulsar doit se lire comme un OS logistique modulaire: chaque module a sa mission, ses files de travail, ses permissions, ses KPIs et ses agents assignés. Les modules se tressent entre eux sans redevenir un simple menu TMS.' },
      { type: 'h2', text: 'Boucle économique couverte' },
      { type: 'steps', items: [
        { title: 'Demande client', text: 'Le client crée ou soumet un transport order via le portail.' },
        { title: 'Planification', text: 'L’ordre devient shipment, puis load avec route, capacité, coût estimé et sélection transporteur.' },
        { title: 'Exécution', text: 'Dispatch, suivi chauffeur, positions, POD photo, BOL PDF et suivi public.' },
        { title: 'Finance', text: 'Facture transporteur, audit de facture, relevé client, écarts et récupération.' },
        { title: 'Agents', text: 'Les agents surveillent les événements, proposent les actions et exécutent seulement selon l’autonomie accordée.' }
      ]},
      { type: 'callout', tone: 'success', title: 'État actuel', text: '6 modules métier actifs, environ 90 endpoints, 29 migrations, UI SvelteKit, API NestJS, seed démo, workbenches opérationnels et runtime Hermes managé par tenant.' }
    ]
  },
  {
    slug: 'getting-started', title: 'Démarrage local', description: 'Installer Pulsar, démarrer Postgres, seed le tenant démo et lancer API + web.', section: 'Démarrer', icon: 'TerminalSquare', level: 'runbook', tags: ['install','pnpm','postgres','dev'],
    body: [
      { type: 'lead', text: 'Ce guide reprend l’environnement de développement Pulsar depuis zéro.' },
      { type: 'h2', text: 'Prérequis' },
      { type: 'ul', items: ['Node.js récent', 'pnpm', 'Docker ou PostgreSQL local', 'Accès au repo Pulsar', 'Fichier .env créé depuis .env.example'] },
      { type: 'code', language: 'bash', code: 'cp .env.example .env\npnpm setup\npnpm db:up\npnpm db:migrate\npnpm db:seed\npnpm dev' },
      { type: 'h2', text: 'Compte de démonstration' },
      { type: 'table', columns: ['Champ','Valeur'], rows: [['Email','admin@pulsar.dev'], ['Mot de passe','admin123'], ['Tenant','acme'], ['Swagger','http://localhost:3000/api/docs'], ['Web','http://localhost:5173']] },
      { type: 'callout', tone: 'warning', title: 'Après un changement shared/database', text: 'Reconstruire les packages concernés avant de relancer l’API. L’API consomme les dist de @pulsar/shared et @pulsar/database.' },
      { type: 'code', language: 'bash', code: 'pnpm --filter @pulsar/shared build\npnpm --filter @pulsar/database build\npnpm typecheck\npnpm test' }
    ]
  },
  {
    slug: 'concepts', title: 'Concepts clés', description: 'Glossaire métier: order, shipment, load, route, tender, POD, ProposedAction.', section: 'Guides métier', icon: 'FileText', tags: ['glossaire','métier','workflow'],
    body: [
      { type: 'lead', text: 'Les écrans Pulsar utilisent un langage logistique précis. Cette page traduit les objets en termes opérationnels.' },
      { type: 'table', columns: ['Terme','Sens concret'], rows: [
        ['TransportOrder','Demande commerciale: livrer X palettes depuis une origine vers une destination à une date donnée.'],
        ['Shipment','Unité de fret planifiable dérivée d’un ordre. Le planificateur manipule les shipments.'],
        ['Load','Voyage physique camion/transporteur regroupant un ou plusieurs shipments.'],
        ['Route / Stop','Séquence ordonnée de cueillettes et livraisons, avec heures prévues et réelles.'],
        ['Tender','Offre de transport envoyée à un carrier, acceptée/refusée par lien sans compte.'],
        ['POD','Preuve de livraison: signataire, remarques et photo.'],
        ['ProposedAction','Action d’agent mise en attente pour approbation humaine ou exécutée selon policy.']
      ]},
      { type: 'h2', text: 'Cycle principal' },
      { type: 'code', language: 'text', code: 'TransportOrder: DRAFT → CONFIRMED → PLANNED → IN_EXECUTION → COMPLETED → CLOSED\nShipment:       PENDING → PLANNED → DISPATCHED → IN_TRANSIT → DELIVERED → CLOSED\nLoad:           OPEN → PLANNED → DISPATCHED → IN_TRANSIT → COMPLETED' },
      { type: 'callout', tone: 'info', title: 'Règle de conception', text: 'Les changements de statut passent par les state machines de @pulsar/shared. Ne jamais faire un update(status) direct sans canTransition*.' }
    ]
  },
  {
    slug: 'transportation', title: 'Transportation / Operations', description: 'Le TMS flagship: commandes, dispatch, routes, tracking, POD, BOL et coûts.', section: 'Modules', icon: 'Truck', tags: ['tms','dispatch','loads','shipments'],
    body: [
      { type: 'lead', text: 'Transportation est le premier module vertical de Pulsar. Il couvre la demande, la planification, l’exécution, la preuve et le coût.' },
      { type: 'h2', text: 'Parcours écran par écran' },
      { type: 'steps', items: [
        { title: 'Transport Orders', text: 'Créer, confirmer, annuler et fermer les demandes client.' },
        { title: 'Shipments', text: 'Former le bassin planifiable et assigner à des loads.' },
        { title: 'Loads', text: 'Affecter transporteur, chauffeur, véhicule, remorque, tarif et route.' },
        { title: 'Dispatch', text: 'Poste 3 panneaux: backlog non assigné, load builder, side panel carte/rates/scorecard/tender.' },
        { title: 'Tracking public', text: 'Partager un lien client avec statut, jalons, dernière position et POD sans exposer l’historique complet.' }
      ]},
      { type: 'h2', text: 'Invariants importants' },
      { type: 'ul', items: ['Chaque requête tenant-scoped filtre par tenantId issu du JWT.', 'Le coût détaillé d’un load COMPLETED est figé.', 'Le lane matching utilise les clés normalisées et compareLanes de @pulsar/shared.', 'Modifier un shipment assigné re-déclenche les checks de capacité du load.', 'Les positions publiques n’exposent que la dernière position du load non livré.'] }
    ]
  },
  {
    slug: 'modules', title: 'Carte des modules', description: 'Packaging LSOS: modules activables, responsabilités et liaisons inter-modules.', section: 'Modules', icon: 'Boxes', tags: ['modules','platform','packaging'],
    body: [
      { type: 'lead', text: 'Pulsar n’est pas un TMS avec des onglets. Chaque grand domaine est une app métier activable avec sa home, ses permissions, ses files et ses agents.' },
      { type: 'table', columns: ['Module','Mission','Statut'], rows: [
        ['Core','Tenants, auth, RBAC, audit, documents, notifications, registre modules','Livré'],
        ['Transportation','Orders, shipments, loads, routing, tracking, POD, dispatch','Livré'],
        ['Finance / Billing','Factures transporteurs, relevés client, freight audit autonome','Livré'],
        ['Assets / Fleet','Flotte interne, maintenance, conformité, historique asset','Livré'],
        ['Warehouse / WMS','Items, bins, inventory, receiving, picking, fulfillment TMS','Livré'],
        ['Yard / Dock','Gate, appointments, yard spots, plan 2D, dwell','Livré'],
        ['Connect','Clés API, webhooks, intégrations, MCP, event logs','En expansion'],
        ['AI Workforce','Employés IA, runtime, runs, policies, Control Tower','Livré']
      ]},
      { type: 'callout', tone: 'info', title: 'Encapsulation produit', text: 'Dans l’app, le bureau /apps doit servir de lanceur. Une fois dans un module, l’utilisateur doit voir l’univers de ce module, pas une navbar globale qui mélange tout.' }
    ]
  },
  {
    slug: 'workbenches', title: 'Postes de travail', description: 'La direction produit: remplacer les formulaires dispersés par des surfaces opérationnelles profondes.', section: 'Modules', icon: 'Map', tags: ['workbench','ux','dispatch','yard','wms'],
    body: [
      { type: 'lead', text: 'Le pivot produit de Pulsar est la tool experience: des écrans où l’opérateur travaille sans perdre le contexte.' },
      { type: 'cards', items: [
        { title: 'Dispatch Workbench', text: 'Backlog de shipments, load builder avec capacité live, carte, rate options, scorecard et tender.' },
        { title: 'Yard Plan', text: 'Plan 2D glisser-déposer: affecter, déplacer, inspecter une visite et sauvegarder la disposition.' },
        { title: 'WMS Fulfillment', text: 'File de shipments sortants, création de pick orders liés et statut préparé dérivé.' },
        { title: 'Agent Operations Center', text: 'À venir: supervise les agents, leurs runs, tâches, proposals, breakers et confiance.' }
      ]},
      { type: 'h2', text: 'Principe UX' },
      { type: 'p', text: 'Un workbench ne doit pas être une page liste + modal. Il doit garder le backlog, l’objet en cours, les preuves, les actions et le contexte latéral dans la même surface.' }
    ]
  },
  {
    slug: 'ai-workforce', title: 'AI Workforce', description: 'Employés IA Hermes dans Pulsar: rôles, autonomie, runs 24/7, policies et approbations.', section: 'Agents IA', icon: 'Bot', tags: ['agents','hermes','acp','mcp','governance'],
    body: [
      { type: 'lead', text: 'Hermes est le cerveau; Pulsar est la maison. Pulsar configure les employés IA, possède les outils, décide des droits, journalise les actions et impose la gouvernance.' },
      { type: 'h2', text: 'Niveaux d’autonomie' },
      { type: 'table', columns: ['Niveau','Comportement'], rows: [
        ['PROPOSE','Toute mutation devient une ProposedAction à approuver.'],
        ['ACT_LOW','Les mutations low-risk peuvent s’exécuter; les sensibles restent en file.'],
        ['AUTONOMOUS','Les mutations autorisées peuvent s’exécuter sans clic humain, mais caps et policies restent durs.']
      ]},
      { type: 'h2', text: 'Boucle 24/7' },
      { type: 'steps', items: [
        { title: 'Événement métier', text: 'Retard, échec tender, tâche opérationnelle ou anomalie crée un contexte.' },
        { title: 'AgentRun', text: 'Le dispatcher réveille un agent disponible selon tenant, catégorie et limites de concurrence.' },
        { title: 'Tool call', text: 'Les outils passent par le registre MCP et la session courte de l’agent.' },
        { title: 'Policy gate', text: 'evaluatePolicy tranche: auto-act, propose ou deny. Les caps débit/montant s’appliquent toujours.' },
        { title: 'Audit', text: 'Tout est traçable: run, task, proposal, approbateur, service user et breaker.' }
      ]},
      { type: 'callout', tone: 'warning', title: 'Règle de sécurité', text: 'Un outil MUTATING ou SENSITIVE ne s’exécute jamais directement dans le handler MCP. Il passe par ProposedAction puis par approve/auto-policy.' }
    ]
  },
  {
    slug: 'mcp', title: 'Connecter un agent MCP', description: 'Endpoint MCP Streamable HTTP, auth X-Agent-Key, outils exposés et workflow d’approbation.', section: 'Agents IA', icon: 'RadioTower', tags: ['mcp','agents','api'],
    body: [
      { type: 'lead', text: 'Pulsar expose ses opérations dispatch comme outils MCP scopés. Tout client MCP peut se connecter; Hermes est le runtime de référence.' },
      { type: 'table', columns: ['Champ','Valeur'], rows: [['URL','POST {API_BASE}/api/v1/mcp'], ['Transport','MCP Streamable HTTP stateless'], ['Auth','X-Agent-Key: <agent key> ou Authorization: Bearer <agent key>'], ['Accept','application/json, text/event-stream']] },
      { type: 'code', language: 'json', code: '{\n  "mcpServers": {\n    "pulsar": {\n      "type": "http",\n      "url": "http://localhost:3000/api/v1/mcp",\n      "headers": { "X-Agent-Key": "ak_REPLACE_WITH_YOUR_AGENT_KEY" }\n    }\n  }\n}' },
      { type: 'h2', text: 'Outils dispatch palier 1' },
      { type: 'table', columns: ['Tool','Tier','Permission'], rows: [
        ['list_transport_orders','READ','transportation.orders.read'], ['get_load','READ','transportation.planning.read'], ['list_shipments','READ','transportation.planning.read'], ['rate_options','READ','transportation.planning.read'], ['carrier_scorecard','READ','transportation.analytics.read'], ['create_load','MUTATING','transportation.planning.manage'], ['assign_shipment','MUTATING','transportation.planning.manage'], ['tender_load','SENSITIVE','transportation.planning.manage']
      ]}
    ]
  },
  {
    slug: 'api', title: 'API REST', description: 'Conventions REST, auth, pagination, erreurs, modules et sécurité tenant.', section: 'Développeurs', icon: 'Braces', tags: ['api','rest','openapi','jwt'],
    body: [
      { type: 'lead', text: 'L’API Pulsar est versionnée sous /api/v1 et documentée par Swagger en développement.' },
      { type: 'h2', text: 'Conventions' },
      { type: 'ul', items: ['JWT utilisateur pour l’UI et les endpoints tenant-scoped.', 'X-Api-Key pour intégrations machine-à-machine.', 'X-Agent-Key pour MCP et agents.', 'Pagination et enveloppes d’erreur cohérentes.', 'Permissions explicites avec @RequirePermissions(...) et modules avec @RequireModule(...).'] },
      { type: 'callout', tone: 'warning', title: 'Tenant isolation', text: 'Ne jamais accepter tenantId depuis le body. Le tenant vient du JWT, de la clé API ou de la clé agent résolue côté serveur.' },
      { type: 'code', language: 'bash', code: 'curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/loads\n\ncurl -H "X-Api-Key: pk_REPLACE" http://localhost:3000/api/v1/transport-orders' }
    ]
  },
  {
    slug: 'data-model', title: 'Modèle de données', description: 'Entités principales, workflows, append-only inventory et documents.', section: 'Architecture', icon: 'Database', tags: ['prisma','schema','workflows'],
    body: [
      { type: 'lead', text: 'Le modèle sépare la demande commerciale, l’unité planifiable, le voyage physique et les preuves d’exécution.' },
      { type: 'h2', text: 'Mapping logistique' },
      { type: 'table', columns: ['Concept','Entité Pulsar','Analogue'], rows: [
        ['Customer demand','TransportOrder','OTM Order Release / SAP Forwarding Order'], ['Planning unit','Shipment','Freight Unit'], ['Carrier execution','Load','Freight Order'], ['Stop sequence','Route / Stop','Itinerary / Stages'], ['Pricing','Rate / Lane / Accessorial','Agreement'], ['Visibility','TrackingEvent / Position','Tracking event'], ['Delivery proof','ProofOfDelivery / BOL','POD / document']
      ]},
      { type: 'h2', text: 'Patterns de données' },
      { type: 'ul', items: ['State machines dans @pulsar/shared pour les statuts.', 'InventoryLevel maintenu depuis StockMovement append-only.', 'Yard occupation dérivée des YardVisit actives.', 'ComplianceDocument a un statut calculé, non persisté.', 'costDetail d’un load complété est un snapshot figé.'] }
    ]
  },
  {
    slug: 'security-governance', title: 'Sécurité & gouvernance', description: 'RBAC, modules, audit, secrets, SSO, MFA et règles d’exécution agent.', section: 'Architecture', icon: 'ShieldCheck', tags: ['security','audit','rbac','mfa'],
    body: [
      { type: 'lead', text: 'Pulsar assume un environnement multi-tenant strict: les droits, modules actifs, clés et agents sont toujours scopés.' },
      { type: 'cards', items: [
        { title: 'RBAC', text: 'Chaque endpoint sensible porte une permission explicite.' },
        { title: 'Module registry', text: 'Un module désactivé coupe ses routes métier et ses pages publiques.' },
        { title: 'Audit logs', text: 'Status changes, mutations sensibles, approvals et actions agent sont journalisés.' },
        { title: 'Secrets', text: 'Les clés provider runtime sont chiffrées via CryptoService et ne sont jamais renvoyées en clair.' }
      ]},
      { type: 'h2', text: 'Règles agents' },
      { type: 'ul', items: ['Portée effective = permissions ∩ modules activés ∩ allowlist outil.', 'autoApprove ne lève jamais les plafonds.', 'Circuit breaker rétrograde, jamais escalade automatiquement.', 'Hermes indisponible retourne 503/skip best-effort, jamais crash du cœur Pulsar.'] }
    ]
  },
  {
    slug: 'deployment', title: 'Build & déploiement', description: 'Commandes de build, tests, CI et production statique du site docs.', section: 'Opérations', icon: 'PackageCheck', tags: ['build','ci','deploy','static'],
    body: [
      { type: 'lead', text: 'Cette page couvre le site docs. La documentation est une app statique Vite/React, prête pour GitHub Pages, Vercel, Netlify ou un bucket statique.' },
      { type: 'code', language: 'bash', code: 'pnpm install\npnpm build\npnpm preview' },
      { type: 'h2', text: 'Sortie' },
      { type: 'p', text: 'Le build produit un dossier dist/ autonome. Le routage interne est géré côté client; prévoir une règle de fallback vers index.html si l’hébergeur sert des URLs profondes.' },
      { type: 'h2', text: 'Qualité minimale avant publication' },
      { type: 'ul', items: ['pnpm build vert', 'Aucun fichier secret', 'Logo visible en header et favicon', 'Navigation mobile vérifiée', 'Recherche locale fonctionnelle', 'Pages d’introduction, modules, agents, API et runbooks présentes.'] }
    ]
  },
  {
    slug: 'roadmap', title: 'Roadmap docs', description: 'Comment maintenir cette documentation à mesure que Pulsar évolue.', section: 'Opérations', icon: 'GitBranch', tags: ['roadmap','maintenance','docs'],
    body: [
      { type: 'lead', text: 'La documentation doit rester un produit: utile pour vendre, onboarder, opérer et développer Pulsar.' },
      { type: 'h2', text: 'À alimenter ensuite' },
      { type: 'ul', items: ['Captures produit réelles par module.', 'Référence API générée depuis OpenAPI.', 'Guides “how-to” par persona: dispatcher, finance, warehouse, yard, admin.', 'Playbooks agents: freight audit, planning continue, exceptions, red-team.', 'Pages release notes par phase majeure.'] },
      { type: 'callout', tone: 'info', title: 'Principe éditorial', text: 'Chaque nouvelle phase Pulsar devrait ajouter une page “concept”, une page “how-to”, et une note “invariants dev” dans cette docs.' }
    ]
  }
];

export const featured = ['overview', 'transportation', 'ai-workforce', 'mcp', 'getting-started', 'workbenches'];

export function getDoc(slug: string) {
  return docs.find((doc) => doc.slug === slug) ?? docs[0];
}
