import {
  Bot,
  Boxes,
  Braces,
  Building2,
  ClipboardCheck,
  Compass,
  Database,
  FileText,
  GitBranch,
  KeyRound,
  Map,
  PackageCheck,
  RadioTower,
  ShieldCheck,
  TerminalSquare,
  Truck,
  Warehouse,
} from 'lucide-react';

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
  Bot,
  Boxes,
  Braces,
  Building2,
  ClipboardCheck,
  Compass,
  Database,
  FileText,
  GitBranch,
  KeyRound,
  Map,
  PackageCheck,
  RadioTower,
  ShieldCheck,
  TerminalSquare,
  Truck,
  Warehouse,
};

export const sections = [
  'Démarrer',
  'Guides métier',
  'Modules',
  'Agents IA',
  'Développeurs',
  'Architecture',
  'Opérations',
];

type ModuleDoc = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: keyof typeof icons;
  status: string;
  users: string[];
  objects: string[];
  surfaces: string[];
  workflows: string[];
  rules: string[];
  integrations: string[];
};

const moduleDocs: ModuleDoc[] = [
  {
    slug: 'platform-core',
    title: 'Platform Core',
    short: 'Core',
    description:
      'Socle multi-tenant de Pulsar: tenants, utilisateurs, rôles, permissions, modules, audit, documents, notifications, préférences, SSO, API keys et console plateforme.',
    icon: 'ShieldCheck',
    status: 'Socle toujours actif',
    users: ['Admin plateforme', 'Admin tenant', 'Responsable sécurité', 'Équipe opérations'],
    objects: [
      'Tenant et configuration entreprise',
      'Utilisateurs, invitations, rôles et permissions',
      'Module registry et paramètres par module',
      'Audit logs, notifications et préférences bureau',
      'Documents, document center et fichiers signés',
      'API keys, SSO OIDC, MFA plateforme et console tenants',
    ],
    surfaces: [
      '/settings/users — utilisateurs, invitations, activation et révocation',
      '/settings/modules — activation des modules par tenant',
      '/settings/modules/[key] — configuration métier d’un module',
      '/settings/audit — audit logs',
      '/settings/sso — configuration OIDC par tenant',
      '/settings/api-keys — clés machine-à-machine',
      '/documents — document center transversal',
      '/platform/tenants — console plateforme pour créer/suspendre/réactiver des tenants',
      '/onboarding — checklist tenant calculée depuis l’état réel',
      '/personalize et /apps — préférences, thème et bureau Pulsar Desk',
    ],
    workflows: [
      'Créer ou activer un tenant depuis la console plateforme.',
      'Inviter les utilisateurs et leur assigner des rôles tenant.',
      'Activer les modules nécessaires: Transportation, Billing, WMS, Yard, Fleet, Procurement, etc.',
      'Configurer SSO, API keys, préférences, audit et paramètres par module.',
      'Laisser les équipes travailler dans les modules avec audit et isolation tenant en arrière-plan.',
    ],
    rules: [
      'Toute donnée tenant-scoped filtre par tenantId issu de la session, de la clé API ou de la clé agent; jamais depuis le body.',
      'Un module désactivé disparaît de la navigation et ses endpoints métier refusent les actions.',
      'Chaque endpoint sensible porte une permission explicite et les mutations critiques sont auditées.',
      'Les secrets sont chiffrés ou hashés et ne sont jamais renvoyés en clair.',
      'Le compte service agent est non-loginable et sert à l’attribution/audit des actions d’agents.',
    ],
    integrations: ['JWT', 'OIDC', 'API keys', 'Audit', 'Notifications', 'Documents', 'Module registry'],
  },
  {
    slug: 'transportation',
    title: 'Transportation / Operations — TMS',
    short: 'TMS',
    description:
      'Module transport de bout en bout: commandes, shipments, loads, routes, carrier tendering, dispatch, tracking, POD/BOL, coûts, lanes et tarifs.',
    icon: 'Truck',
    status: 'Module activable',
    users: ['Service client', 'Planificateur', 'Répartiteur', 'Responsable transport', 'Transporteur'],
    objects: [
      'Transport Order — demande commerciale à transporter',
      'Shipment — unité de fret planifiable',
      'Load — voyage camion qui regroupe un ou plusieurs shipments',
      'Route, stops et legs — séquence de cueillettes/livraisons',
      'Customer, location, carrier, driver, vehicle, trailer',
      'Lane, rate, accessorial et fuel table',
      'Tender, tracking event, POD, BOL et documents d’exécution',
    ],
    surfaces: [
      '/transport-orders — demandes de transport',
      '/shipments — fret à planifier ou suivre',
      '/dispatch — consolidation, load builder, tender et scorecard',
      '/planning — planning board',
      '/loads et /loads/[id] — voyages, route, coûts, tracking, documents',
      '/rate-studio, /lanes, /rates, /accessorials, /fuel-tables — tarification',
      '/customers, /carriers, /locations — données maîtres',
      '/track/[token], /driver/[token], /tender/[token] — surfaces publiques',
    ],
    workflows: [
      'Créer un Transport Order en DRAFT puis le confirmer.',
      'Transformer l’ordre en un ou plusieurs shipments.',
      'Regrouper les shipments dans un load et construire la route.',
      'Valider capacité, coût estimé, transporteur, chauffeur, véhicule, remorque et tarif.',
      'Tender ou assigner le load, puis dispatcher.',
      'Suivre transit, arrivées, départs, livraison, POD et BOL.',
      'Envoyer les coûts figés vers Billing, Freight Audit et Analytics.',
    ],
    rules: [
      'Les statuts passent par les state machines partagées de @pulsar/shared.',
      'Un load COMPLETED conserve estimatedCost et costDetail figés.',
      'Les distances OSRM/Nominatim sont best-effort et ne bloquent jamais le workflow.',
      'Une distance manuelle n’est jamais écrasée par un recalcul.',
      'Modifier poids/volume/palettes d’un shipment assigné revalide la capacité du load.',
      'Les liens publics exposent le minimum: pas d’historique complet ni données cross-tenant.',
    ],
    integrations: ['Customer Portal', 'Carrier Portal', 'Billing', 'Analytics', 'Agents MCP', 'Connect webhooks'],
  },
  {
    slug: 'dispatch-workbench',
    title: 'Dispatch Workbench',
    short: 'Dispatch',
    description:
      'Poste de travail du planificateur: backlog shipments, création de loads consolidés, contrôle capacité, route, coûts, scorecard et tender dans une même surface.',
    icon: 'Map',
    status: 'Workbench opérationnel',
    users: ['Planificateur', 'Répartiteur', 'Agent dispatcher'],
    objects: ['Backlog shipments', 'Load draft', 'Stops', 'Capacity check', 'Rate options', 'Carrier scorecard', 'Tender'],
    surfaces: ['/dispatch — backlog, builder de load, carte, side panel, rates et tender', '/planning — vue complémentaire de planification'],
    workflows: [
      'Sélectionner des shipments non assignés.',
      'Créer un load atomiquement avec route et legs.',
      'Contrôler poids, volume, palettes et alertes capacité.',
      'Comparer options tarifaires et scorecard transporteur.',
      'Tender, assigner ou préparer le dispatch.',
    ],
    rules: [
      'La consolidation maintient shipment_load_legs dans la même transaction.',
      'Les dépassements de capacité suivent la configuration Transportation: WARN ou BLOCK.',
      'Les tools agents create_load, assign_shipment et tender_load passent par ProposedAction sauf auto-approval capé.',
    ],
    integrations: ['Transportation', 'Carrier scorecards', 'Agents', 'Billing cost snapshot'],
  },
  {
    slug: 'customer-portal',
    title: 'Customer Portal',
    short: 'Client',
    description:
      'Libre-service client par lien tokenisé: consultation d’expéditions et soumission de nouvelles demandes sans créer un compte interne complet.',
    icon: 'Building2',
    status: 'Portail public',
    users: ['Client expéditeur', 'Service client', 'Admin tenant'],
    objects: ['Portal link', 'Customer', 'Transport Order', 'Shipment visibility', 'Tracking link'],
    surfaces: ['/portal/[token] — portail client public', '/customers — génération et révocation des liens clients'],
    workflows: [
      'Générer ou régénérer un lien portail pour un customer.',
      'Le client consulte ses commandes et expéditions visibles.',
      'Le client soumet une demande de transport.',
      'Pulsar crée un Transport Order DRAFT.',
      'Le service client valide et confirme avant planification.',
    ],
    rules: [
      'Le service public revérifie l’activation du module Customer Portal.',
      'Le token limite strictement les données au customer lié.',
      'Une demande client ne devient pas automatiquement planifiée: validation interne requise.',
    ],
    integrations: ['Transportation Orders', 'Public tracking', 'Documents selon configuration'],
  },
  {
    slug: 'carrier-portal',
    title: 'Carrier Portal',
    short: 'Carrier',
    description:
      'Surface externe pour transporteurs: consulter loads/tenders, accepter/refuser, transmettre preuves et statut sans accès tenant complet.',
    icon: 'RadioTower',
    status: 'Portail public',
    users: ['Transporteur', 'Dispatcher carrier', 'Planificateur Pulsar'],
    objects: ['Carrier link', 'Tender', 'Load', 'POD upload', 'Invoice upload', 'Payment visibility'],
    surfaces: ['/carrier-portal/[token] — portail transporteur', '/tender/[token] — réponse tender publique', '/settings/modules/carrier-portal — règles du portail'],
    workflows: [
      'Envoyer un tender ou lien transporteur.',
      'Le transporteur consulte l’offre ou ses voyages.',
      'Il accepte/refuse et ajoute les preuves autorisées.',
      'Pulsar reflète la réponse dans load/tender, documents et audit.',
    ],
    rules: [
      'Les liens transporteurs sont tokenisés et minimaux.',
      'podRequiresDispatched peut empêcher un POD trop tôt.',
      'Les réponses publiques ne contournent pas les règles de statut du load.',
    ],
    integrations: ['Transportation tenders', 'Documents', 'Billing AP visibility'],
  },
  {
    slug: 'billing-finance',
    title: 'Billing / Finance / Freight Audit',
    short: 'Finance',
    description:
      'Contrôle financier du transport: factures transporteurs, relevés clients, matching de factures entrantes, écarts, litiges, paiements et économies récupérées.',
    icon: 'ClipboardCheck',
    status: 'Module activable',
    users: ['Finance AP', 'Finance AR', 'Responsable transport', 'Agent audit'],
    objects: ['Carrier invoice', 'Customer invoice', 'Freight audit invoice', 'Audit line', 'Dispute', 'Savings'],
    surfaces: ['/finance — cockpit finance', '/invoices — receivables/payables', '/billing/freight-audit — intake et matching', '/billing/freight-audit/[id] — détail audit'],
    workflows: [
      'Créer des brouillons de factures transporteurs depuis les loads complétés.',
      'Approuver et marquer les factures transporteurs payées.',
      'Générer des relevés clients depuis les ordres livrés non facturés.',
      'Importer ou recevoir des factures transporteurs entrantes.',
      'Matcher les lignes contre le coût estimé figé et résoudre les écarts.',
    ],
    rules: [
      'Le rapprochement lit estimatedCost/costDetail figés; jamais de recompute sur un load complété.',
      'Les tolérances absolue et pourcentage sont configurables.',
      'Les écarts hors tolérance deviennent des cas à résoudre ou litiges.',
      'Exports, résolutions et approbations sensibles sont auditables.',
    ],
    integrations: ['Transportation loads', 'Rates', 'Documents', 'Agents ProposedAction', 'Analytics savings'],
  },
  {
    slug: 'procurement',
    title: 'Procurement / Bid Board',
    short: 'Achats',
    description:
      'Achat transport compétitif: RFP sur lanes, invitations carriers, bids, attribution, routing guide et création de rates depuis awards.',
    icon: 'ClipboardCheck',
    status: 'Module activable',
    users: ['Acheteur transport', 'Responsable transport', 'Transporteur invité'],
    objects: ['RFP', 'RFP lane', 'Carrier invitation', 'Bid', 'Award', 'Routing guide entry'],
    surfaces: ['/procurement/rfps — appels d’offres', '/procurement/rfps/[id] — lanes, invitations, bids et awards', '/procurement/routing-guide — guide de routage'],
    workflows: [
      'Créer un RFP et y ajouter des lanes.',
      'Inviter des carriers et collecter les offres.',
      'Comparer prix, couverture, contraintes et service.',
      'Attribuer une lane.',
      'Créer un rate depuis l’award si la configuration le permet.',
    ],
    rules: [
      'La configuration peut imposer l’unicité des bids.',
      'La création automatique de rate à l’attribution est contrôlée par module settings.',
      'Les awards alimentent le routing guide et les achats futurs.',
    ],
    integrations: ['Transportation lanes/rates', 'Carrier data', 'Routing guide', 'Analytics'],
  },
  {
    slug: 'fleet-assets',
    title: 'Fleet / Assets',
    short: 'Assets',
    description:
      'Disponibilité des véhicules, remorques et chauffeurs: conformité documentaire, maintenance, statut opérationnel et readiness.',
    icon: 'Boxes',
    status: 'Module activable',
    users: ['Gestionnaire flotte', 'Maintenance', 'Répartiteur', 'Compliance'],
    objects: ['Vehicle', 'Trailer', 'Driver', 'Maintenance order', 'Compliance document', 'Availability status'],
    surfaces: ['/assets — cockpit assets', '/fleet — roster véhicules/remorques/chauffeurs', '/fleet/vehicles/[id], /fleet/trailers/[id], /fleet/drivers/[id] — détails et conformité'],
    workflows: [
      'Identifier un asset indisponible, à maintenance ou document expirant.',
      'Créer un ordre de maintenance préventive, réparation ou inspection.',
      'Ajouter ou renouveler des documents de conformité.',
      'Mettre à jour la disponibilité selon maintenance et conformité.',
      'Réintégrer l’asset lorsqu’il redevient disponible.',
    ],
    rules: [
      'Un ordre de maintenance ouvert peut rendre l’asset indisponible.',
      'La fenêtre “expire bientôt” des documents est configurable.',
      'Un asset retiré ne redevient pas disponible par simple clôture de maintenance.',
    ],
    integrations: ['Transportation resources', 'Documents', 'Analytics readiness', 'Dispatch availability'],
  },
  {
    slug: 'wms',
    title: 'WMS / Warehouse / Inventory',
    short: 'Entrepôt',
    description:
      'Inventaire léger connecté au transport: articles, bins, réceptions, mouvements, inventaire, picking, fulfillment et comptages.',
    icon: 'Warehouse',
    status: 'Module activable',
    users: ['Opérateur entrepôt', 'Superviseur WMS', 'Planificateur transport'],
    objects: ['Item/SKU', 'Bin', 'Stock movement', 'Inventory level', 'Receipt', 'Pick order', 'Cycle count'],
    surfaces: ['/wms — cockpit entrepôt', '/wms/items — articles', '/wms/bins — emplacements', '/wms/inventory — inventaire', '/wms/receiving — réceptions', '/wms/picking — prélèvement', '/wms/fulfillment — préparation liée shipments', '/wms/cycle-counts — comptages'],
    workflows: [
      'Créer une réception DRAFT avec lignes attendues.',
      'Poster la réception pour écrire les mouvements de stock.',
      'Déplacer ou ajuster via mouvements transactionnels.',
      'Créer un pick order lié à un shipment sortant.',
      'Compléter le picking et dériver l’état de préparation du shipment.',
      'Lancer des cycle counts pour corriger les écarts.',
    ],
    rules: [
      'StockMovement est la source de vérité append-only.',
      'Les soldes ne sont pas édités directement hors transaction de mouvement.',
      'Le fulfillment se connecte au TMS sans ajouter un statut shipment bloquant inutile.',
    ],
    integrations: ['Transportation shipments', 'Locations warehouse', 'Documents', 'Analytics inventory'],
  },
  {
    slug: 'yard-dock',
    title: 'Yard / Dock',
    short: 'Cour',
    description:
      'Pilotage de cour physique: gate check-in/out, rendez-vous dock, emplacements, visites, moves, dwell et occupations temps réel.',
    icon: 'Map',
    status: 'Module activable',
    users: ['Gardien', 'Yard jockey', 'Superviseur quai', 'Répartiteur'],
    objects: ['Yard spot', 'Yard visit', 'Yard move', 'Dock appointment', 'Trailer occupancy'],
    surfaces: ['/yard — plan de cour', '/yard/gate — arrivée/départ', '/yard/appointments — rendez-vous', '/yard/spots — emplacements'],
    workflows: [
      'Créer ou recevoir un rendez-vous dock.',
      'Faire le check-in d’un camion/remorque à la gate.',
      'Assigner la visite à un spot ou une porte.',
      'Journaliser les moves spot-à-spot.',
      'Marquer arrivée/completion d’un rendez-vous.',
      'Faire le check-out et libérer le spot.',
    ],
    rules: [
      'Un spot ne peut pas avoir deux visites actives.',
      'Chaque changement de spot crée un YardMove dans la même transaction.',
      'Les coordonnées du plan sont display-only et ne modifient pas la logique métier.',
    ],
    integrations: ['Transportation arrivals', 'Fleet trailers', 'WMS dock flow', 'Analytics dwell'],
  },
  {
    slug: 'analytics-control-tower',
    title: 'Analytics / Control Tower',
    short: 'Analytics',
    description:
      'Vue KPI et exception: performance transporteurs, coûts, ponctualité, activité agents, control tower et attention items.',
    icon: 'Compass',
    status: 'Module activable',
    users: ['Manager ops', 'Responsable transport', 'Finance', 'Direction'],
    objects: ['KPI', 'Scorecard', 'Control tower signal', 'Carrier performance', 'Agent run metrics'],
    surfaces: ['/analytics — vue d’ensemble', '/analytics/control-tower — pilotage transverse', '/analytics/scorecards — scorecards', '/analytics/carriers — scorecards transporteurs', '/control-tower — control tower agents/opérations'],
    workflows: [
      'Lire les KPI calculés depuis les modules opérationnels.',
      'Identifier retards, écarts, faibles couvertures et exceptions.',
      'Drill-down vers loads, billing, workbench ou agents.',
      'Comparer transporteurs sur coût, service, tender et ponctualité.',
    ],
    rules: [
      'Les métriques sont calculées depuis les sources opérationnelles, pas inventées côté UI.',
      'Les pages analytics affichent le volume/scope pour interpréter les KPI.',
      'Les actions de correction repartent vers les modules sources.',
    ],
    integrations: ['Transportation', 'Billing', 'Fleet', 'Yard', 'WMS', 'Agents'],
  },
  {
    slug: 'ai-workforce',
    title: 'Agents / Operating Workbench',
    short: 'Agents',
    description:
      'Employés IA Hermes dans Pulsar: outils MCP scopés, tâches opérationnelles, actions proposées, approbations, caps, audit et runtime isolé.',
    icon: 'Bot',
    status: 'Gouvernance IA',
    users: ['Manager ops', 'Agent IA', 'Approbateur', 'Admin agents'],
    objects: ['Agent', 'Conversation', 'MCP tool', 'ProposedAction', 'OperationalTask', 'AgentRun', 'Policy', 'Runtime config'],
    surfaces: ['/agents — roster employés IA', '/agents/[id] — profil, activité, chat et config', '/agent-actions — file d’approbation', '/workbench — tâches opérationnelles', '/automation — règles et policies', '/settings/agents — registre agents', '/settings/agent-runtime — connexion modèle/Hermes', '/control-tower — monitoring agents'],
    workflows: [
      'Configurer le runtime Hermes par tenant et enregistrer un agent.',
      'Définir rôle, persona, modèle, permissions, autonomie et caps.',
      'Créer ou détecter des OperationalTasks depuis événements métier.',
      'L’agent lit via tools autorisés et propose les actions sensibles.',
      'Un humain approuve/rejette ou une policy auto-approve sous cap exécute.',
      'Runs, décisions, actions et audit alimentent la Control Tower.',
    ],
    rules: [
      'Un outil MUTATING/SENSITIVE ne s’exécute jamais directement dans le handler MCP.',
      'La portée = permissions agent ∩ modules activés ∩ allowlist outil.',
      'L’autonomie ne lève jamais les caps ni permissions.',
      'Hermes indisponible retourne une erreur contrôlée, jamais un crash du cœur Pulsar.',
      'Un processus Hermes par conversation maintient l’isolation tenant.',
    ],
    integrations: ['Hermes ACP', 'MCP endpoint', 'Tool registry', 'Audit', 'All business modules'],
  },
  {
    slug: 'connect-integrations',
    title: 'Connect / Integrations / Automation',
    short: 'Connect',
    description:
      'Ouverture plateforme: connecteurs, API keys, imports, inbox, webhooks, dry-runs, automatisations et outils MCP.',
    icon: 'Braces',
    status: 'Plateforme intégration',
    users: ['Admin intégrations', 'Développeur', 'Ops', 'Agent intégration'],
    objects: ['API key', 'Connector', 'Webhook delivery', 'Connect inbox item', 'Import run', 'Automation rule', 'MCP registration'],
    surfaces: ['/connect — cockpit intégrations', '/connect/inbox — messages et événements entrants', '/connect/imports — imports CSV/fichiers', '/integrations — connecteurs et dry-runs', '/settings/api-keys — accès API', '/automation — règles d’automatisation'],
    workflows: [
      'Créer une clé API avec scopes tenant.',
      'Configurer un connecteur ou import avec mapping/dry-run.',
      'Recevoir ou importer des données, puis créer les objets métier.',
      'Émettre des webhooks sortants avec retries bornés.',
      'Définir des règles d’automatisation qui créent tâches ou actions.',
    ],
    rules: [
      'Les secrets sont masqués sur lecture et stockés de façon sécurisée.',
      'Les retries webhooks sont bornés et best-effort.',
      'Une erreur intégration reste observable sans bloquer le cœur opérationnel.',
      'Les imports respectent tenant, scopes et validation métier.',
    ],
    integrations: ['ERP', 'CSV', 'Webhooks', 'MCP tools', 'Documents', 'Transportation/Billing/WMS sources'],
  },
];

const personas = [
  ['Service client', 'Crée/confirme les orders, suit les clients', 'Transportation, Customer Portal'],
  ['Planificateur', 'Construit loads, routes, tenders, consolidation', 'Transportation, Dispatch, Analytics'],
  ['Répartiteur', 'Dispatch, suivi, retards, POD, driver links', 'Transportation, Workbench'],
  ['Responsable transport', 'Carriers, lanes, rates, scorecards', 'Transportation, Procurement, Analytics'],
  ['Finance AP/AR', 'Factures transporteurs, relevés clients, paiements', 'Billing, Freight Audit'],
  ['Acheteur transport', 'RFP, bids, awards, routing guide', 'Procurement'],
  ['Gestionnaire flotte', 'Maintenance et conformité', 'Fleet'],
  ['Opérateur entrepôt', 'Réception, inventaire, picking', 'WMS'],
  ['Gardien / yard jockey', 'Gate, spot, move, rendez-vous', 'Yard'],
  ['Admin tenant', 'Modules, users, permissions, SSO, API keys', 'Core, Connect'],
  ['Manager ops', 'KPI, exceptions, agents, performance', 'Analytics, Agents, Control Tower'],
  ['Agent IA', 'Lit, propose et exécute sous caps/audit', 'Agents + modules autorisés'],
];

const globalFlow = [
  'Client, ERP, portail ou import crée une demande.',
  'Service client confirme le Transport Order.',
  'Les shipments sont planifiés dans Dispatch/Planning.',
  'Un load, une route, un transporteur et un coût sont déterminés.',
  'Tender, portail transporteur ou dispatcher déclenchent l’exécution.',
  'Tracking, POD, BOL et documents ferment la preuve opérationnelle.',
  'Billing génère AP/AR et Freight Audit rapproche les écarts.',
  'Workbench et agents traitent les exceptions sous gouvernance.',
  'Analytics remonte KPI, scorecards et décisions à prendre.',
];

const crossRules = [
  'Tenant isolation: le tenant vient de la session, de la clé API ou de la clé agent, jamais du body.',
  'Module activation: l’UI et l’API respectent les modules activés par tenant.',
  'Permissions: chaque endpoint métier est protégé par permission et rôle tenant.',
  'Audit: créations, mutations sensibles, transitions et approbations sont journalisées.',
  'State machines: les transitions de statut passent par les workflows partagés.',
  'Coûts figés: les coûts de loads complétés ne sont pas recalculés pour billing/audit.',
  'Liens publics: tokenisés, minimaux et sans exposition cross-tenant.',
  'Agents gouvernés: tools scopés, caps, ProposedAction et audit obligatoires.',
  'Best-effort externe: routage, webhooks, email et runtime IA se dégradent proprement.',
];

function modulePage(module: ModuleDoc): DocPage {
  return {
    slug: module.slug,
    title: module.title,
    description: module.description,
    section: module.slug === 'ai-workforce' ? 'Agents IA' : 'Modules',
    icon: module.icon,
    level: 'guide',
    tags: ['module', module.short.toLowerCase(), module.status.toLowerCase()],
    body: [
      { type: 'lead', text: module.description },
      { type: 'callout', tone: 'info', title: 'Statut du module', text: module.status },
      { type: 'h2', text: 'Utilisateurs principaux' },
      { type: 'ul', items: module.users },
      { type: 'h2', text: 'Objets métier' },
      { type: 'ul', items: module.objects },
      { type: 'h2', text: 'Surfaces dans le site Pulsar' },
      { type: 'ul', items: module.surfaces },
      { type: 'h2', text: 'Workflow couvert' },
      { type: 'steps', items: module.workflows.map((text, index) => ({ title: `Étape ${index + 1}`, text })) },
      { type: 'h2', text: 'Règles importantes' },
      { type: 'ul', items: module.rules },
      { type: 'h2', text: 'Connexions avec les autres modules' },
      { type: 'ul', items: module.integrations },
    ],
  };
}

const moduleCards = moduleDocs.map((module) => ({
  title: module.title,
  text: `${module.status} — ${module.description}`,
  href: `/docs/${module.slug}`,
}));

const moduleRows = moduleDocs.map((module) => [
  module.title,
  module.status,
  module.users.join(', '),
  module.surfaces.slice(0, 3).join(' | '),
]);

const overview: DocPage = {
  slug: 'overview',
  title: 'Vue d’ensemble',
  description:
    'Comprendre Pulsar en 5 minutes: plateforme logistique modulaire, postes de travail et agents employés gouvernés.',
  section: 'Démarrer',
  icon: 'Compass',
  level: 'guide',
  tags: ['vision', 'lsos', 'modules', 'agents'],
  body: [
    {
      type: 'lead',
      text:
        'Pulsar est une plateforme LSOS modulaire pour manufacturiers, distributeurs, 3PL et équipes logistiques: un core multi-tenant, des apps métier activables, des postes de travail opérationnels et des agents IA employés qui agissent sous gouvernance humaine.',
    },
    { type: 'cards', items: moduleCards.slice(0, 6) },
    { type: 'h2', text: 'North star' },
    {
      type: 'p',
      text:
        'Pulsar doit se lire comme un OS logistique modulaire: chaque module a sa mission, ses files de travail, ses permissions, ses KPIs et ses agents assignés. Les modules se tressent entre eux sans redevenir un simple menu TMS.',
    },
    { type: 'h2', text: 'Boucle économique couverte' },
    { type: 'steps', items: globalFlow.map((text, index) => ({ title: `Phase ${index + 1}`, text })) },
    {
      type: 'callout',
      tone: 'success',
      title: 'Documentation publiée sur ce site',
      text:
        'La documentation fonctionnelle détaillée des modules vit maintenant dans pulsar-docs, avec pages dédiées et navigation GitHub Pages.',
    },
  ],
};

const modulesIndex: DocPage = {
  slug: 'modules',
  title: 'Documentation complète des modules',
  description:
    'Carte fonctionnelle de tous les modules Pulsar: mission, utilisateurs, objets, surfaces, workflows, règles et connexions inter-modules.',
  section: 'Modules',
  icon: 'Boxes',
  level: 'reference',
  tags: ['modules', 'fonctionnel', 'workflow', 'produit'],
  body: [
    {
      type: 'lead',
      text:
        'Cette page est le sommaire métier des modules Pulsar. Chaque carte ouvre une page dédiée qui détaille les objets, écrans, workflows et règles opérationnelles.',
    },
    { type: 'cards', items: moduleCards },
    { type: 'h2', text: 'Vue comparative' },
    { type: 'table', columns: ['Module', 'Statut', 'Utilisateurs', 'Surfaces clés'], rows: moduleRows },
    { type: 'h2', text: 'Workflow business global — de la demande au cash' },
    { type: 'steps', items: globalFlow.map((text, index) => ({ title: `Phase ${index + 1}`, text })) },
    { type: 'h2', text: 'Personas et responsabilités' },
    { type: 'table', columns: ['Persona', 'Utilisation principale', 'Modules fréquents'], rows: personas },
    { type: 'h2', text: 'Règles transversales' },
    { type: 'ul', items: crossRules },
  ],
};

const gettingStarted: DocPage = {
  slug: 'getting-started',
  title: 'Démarrage local',
  description: 'Installer Pulsar, démarrer Postgres, seed le tenant démo et lancer API + web.',
  section: 'Démarrer',
  icon: 'TerminalSquare',
  level: 'runbook',
  tags: ['install', 'pnpm', 'postgres', 'dev'],
  body: [
    { type: 'lead', text: 'Ce guide reprend l’environnement de développement Pulsar depuis zéro.' },
    { type: 'h2', text: 'Prérequis' },
    { type: 'ul', items: ['Node.js récent', 'pnpm', 'Docker ou PostgreSQL local', 'Accès au repo Pulsar', 'Fichier .env créé depuis .env.example'] },
    { type: 'code', language: 'bash', code: 'cp .env.example .env\npnpm setup\npnpm db:up\npnpm db:migrate\npnpm db:seed\npnpm dev' },
    { type: 'h2', text: 'Compte de démonstration' },
    { type: 'table', columns: ['Champ', 'Valeur'], rows: [['Email', 'admin@pulsar.dev'], ['Mot de passe', 'admin123'], ['Tenant', 'acme'], ['Swagger', 'http://localhost:3000/api/docs'], ['Web', 'http://localhost:5173']] },
    { type: 'callout', tone: 'warning', title: 'Après un changement shared/database', text: 'Reconstruire les packages concernés avant de relancer l’API. L’API consomme les dist de @pulsar/shared et @pulsar/database.' },
  ],
};

const concepts: DocPage = {
  slug: 'concepts',
  title: 'Concepts clés',
  description: 'Glossaire métier: order, shipment, load, route, tender, POD, ProposedAction.',
  section: 'Guides métier',
  icon: 'FileText',
  tags: ['glossaire', 'métier', 'workflow'],
  body: [
    { type: 'lead', text: 'Les écrans Pulsar utilisent un langage logistique précis. Cette page traduit les objets en termes opérationnels.' },
    { type: 'table', columns: ['Terme', 'Sens concret'], rows: [['TransportOrder', 'Demande commerciale: livrer X palettes depuis une origine vers une destination à une date donnée.'], ['Shipment', 'Unité de fret planifiable dérivée d’un ordre. Le planificateur manipule les shipments.'], ['Load', 'Voyage physique camion/transporteur regroupant un ou plusieurs shipments.'], ['Route / Stop', 'Séquence ordonnée de cueillettes et livraisons, avec heures prévues et réelles.'], ['Tender', 'Offre de transport envoyée à un carrier, acceptée/refusée par lien sans compte.'], ['POD', 'Preuve de livraison: signataire, remarques et photo.'], ['ProposedAction', 'Action d’agent mise en attente pour approbation humaine ou exécutée selon policy.']] },
    { type: 'h2', text: 'Cycle principal' },
    { type: 'code', language: 'text', code: 'TransportOrder: DRAFT → CONFIRMED → PLANNED → IN_EXECUTION → COMPLETED → CLOSED\nShipment:       PENDING → PLANNED → DISPATCHED → IN_TRANSIT → DELIVERED → CLOSED\nLoad:           OPEN → PLANNED → DISPATCHED → IN_TRANSIT → COMPLETED' },
  ],
};

const workbenches: DocPage = {
  slug: 'workbenches',
  title: 'Postes de travail',
  description: 'Remplacer les formulaires dispersés par des surfaces opérationnelles profondes.',
  section: 'Modules',
  icon: 'Map',
  tags: ['workbench', 'ux', 'dispatch', 'yard', 'wms'],
  body: [
    { type: 'lead', text: 'Le pivot produit de Pulsar est la tool experience: des écrans où l’opérateur travaille sans perdre le contexte.' },
    { type: 'cards', items: moduleCards.filter((card) => ['Dispatch Workbench', 'Yard / Dock', 'WMS / Warehouse / Inventory', 'Agents / Operating Workbench'].includes(card.title)) },
    { type: 'h2', text: 'Principe UX' },
    { type: 'p', text: 'Un workbench ne doit pas être une page liste + modal. Il doit garder le backlog, l’objet en cours, les preuves, les actions et le contexte latéral dans la même surface.' },
  ],
};

const mcp: DocPage = {
  slug: 'mcp',
  title: 'Connecter un agent MCP',
  description: 'Endpoint MCP Streamable HTTP, auth X-Agent-Key, outils exposés et workflow d’approbation.',
  section: 'Agents IA',
  icon: 'RadioTower',
  tags: ['mcp', 'agents', 'api'],
  body: [
    { type: 'lead', text: 'Pulsar expose ses opérations comme outils MCP scopés. Tout client MCP peut se connecter; Hermes est le runtime de référence.' },
    { type: 'table', columns: ['Champ', 'Valeur'], rows: [['URL', 'POST {API_BASE}/api/v1/mcp'], ['Transport', 'MCP Streamable HTTP stateless'], ['Auth', 'X-Agent-Key: <agent key> ou Authorization: Bearer <agent key>'], ['Accept', 'application/json, text/event-stream']] },
    { type: 'code', language: 'json', code: '{\n  "mcpServers": {\n    "pulsar": {\n      "type": "http",\n      "url": "http://localhost:3000/api/v1/mcp",\n      "headers": { "X-Agent-Key": "ak_REPLACE_WITH_YOUR_AGENT_KEY" }\n    }\n  }\n}' },
    { type: 'h2', text: 'Outils dispatch palier 1' },
    { type: 'table', columns: ['Tool', 'Tier', 'Permission'], rows: [['list_transport_orders', 'READ', 'transportation.orders.read'], ['get_load', 'READ', 'transportation.planning.read'], ['list_shipments', 'READ', 'transportation.planning.read'], ['rate_options', 'READ', 'transportation.planning.read'], ['carrier_scorecard', 'READ', 'transportation.analytics.read'], ['create_load', 'MUTATING', 'transportation.planning.manage'], ['assign_shipment', 'MUTATING', 'transportation.planning.manage'], ['tender_load', 'SENSITIVE', 'transportation.planning.manage']] },
  ],
};

const api: DocPage = {
  slug: 'api',
  title: 'API REST',
  description: 'Conventions REST, auth, pagination, erreurs, modules et sécurité tenant.',
  section: 'Développeurs',
  icon: 'Braces',
  tags: ['api', 'rest', 'openapi', 'jwt'],
  body: [
    { type: 'lead', text: 'L’API Pulsar est versionnée sous /api/v1 et documentée par Swagger en développement.' },
    { type: 'h2', text: 'Conventions' },
    { type: 'ul', items: ['JWT utilisateur pour l’UI et les endpoints tenant-scoped.', 'X-Api-Key pour intégrations machine-à-machine.', 'X-Agent-Key pour MCP et agents.', 'Pagination et enveloppes d’erreur cohérentes.', 'Permissions explicites avec @RequirePermissions(...) et modules avec @RequireModule(...).'] },
    { type: 'callout', tone: 'warning', title: 'Tenant isolation', text: 'Ne jamais accepter tenantId depuis le body. Le tenant vient du JWT, de la clé API ou de la clé agent résolue côté serveur.' },
  ],
};

const dataModel: DocPage = {
  slug: 'data-model',
  title: 'Modèle de données',
  description: 'Entités principales, workflows, append-only inventory et documents.',
  section: 'Architecture',
  icon: 'Database',
  tags: ['prisma', 'schema', 'workflows'],
  body: [
    { type: 'lead', text: 'Le modèle sépare la demande commerciale, l’unité planifiable, le voyage physique et les preuves d’exécution.' },
    { type: 'h2', text: 'Mapping logistique' },
    { type: 'table', columns: ['Concept', 'Entité Pulsar', 'Analogue'], rows: [['Customer demand', 'TransportOrder', 'OTM Order Release / SAP Forwarding Order'], ['Planning unit', 'Shipment', 'Freight Unit'], ['Carrier execution', 'Load', 'Freight Order'], ['Stop sequence', 'Route / Stop', 'Itinerary / Stages'], ['Pricing', 'Rate / Lane / Accessorial', 'Agreement'], ['Visibility', 'TrackingEvent / Position', 'Tracking event'], ['Delivery proof', 'ProofOfDelivery / BOL', 'POD / document']] },
    { type: 'h2', text: 'Patterns de données' },
    { type: 'ul', items: ['State machines dans @pulsar/shared pour les statuts.', 'InventoryLevel maintenu depuis StockMovement append-only.', 'Yard occupation dérivée des YardVisit actives.', 'ComplianceDocument a un statut calculé.', 'costDetail d’un load complété est un snapshot figé.'] },
  ],
};

const security: DocPage = {
  slug: 'security-governance',
  title: 'Sécurité & gouvernance',
  description: 'RBAC, modules, audit, secrets, SSO, MFA et règles d’exécution agent.',
  section: 'Architecture',
  icon: 'ShieldCheck',
  tags: ['security', 'audit', 'rbac', 'mfa'],
  body: [
    { type: 'lead', text: 'Pulsar assume un environnement multi-tenant strict: les droits, modules actifs, clés et agents sont toujours scopés.' },
    { type: 'cards', items: [{ title: 'RBAC', text: 'Chaque endpoint sensible porte une permission explicite.' }, { title: 'Module registry', text: 'Un module désactivé coupe ses routes métier et ses pages publiques.' }, { title: 'Audit logs', text: 'Status changes, mutations sensibles, approvals et actions agent sont journalisés.' }, { title: 'Secrets', text: 'Les clés provider runtime sont chiffrées et ne sont jamais renvoyées en clair.' }] },
    { type: 'h2', text: 'Règles transversales' },
    { type: 'ul', items: crossRules },
  ],
};

const deployment: DocPage = {
  slug: 'deployment',
  title: 'Build & déploiement',
  description: 'Commandes de build, tests, CI et production statique du site docs.',
  section: 'Opérations',
  icon: 'PackageCheck',
  tags: ['build', 'ci', 'deploy', 'static'],
  body: [
    { type: 'lead', text: 'Cette page couvre le site docs. La documentation est une app statique Vite/React publiée sur GitHub Pages.' },
    { type: 'code', language: 'bash', code: 'pnpm install\npnpm build\npnpm preview' },
    { type: 'h2', text: 'GitHub Pages' },
    { type: 'p', text: 'Le workflow .github/workflows/pages.yml build le dossier dist puis le déploie sur https://samchampagne.github.io/pulsar-docs/.' },
  ],
};

const roadmap: DocPage = {
  slug: 'roadmap',
  title: 'Roadmap docs',
  description: 'Comment maintenir cette documentation à mesure que Pulsar évolue.',
  section: 'Opérations',
  icon: 'GitBranch',
  tags: ['roadmap', 'maintenance', 'docs'],
  body: [
    { type: 'lead', text: 'La documentation doit rester un produit: utile pour vendre, onboarder, opérer et développer Pulsar.' },
    { type: 'h2', text: 'À alimenter ensuite' },
    { type: 'ul', items: ['Captures produit réelles par module.', 'Référence API générée depuis OpenAPI.', 'Guides how-to par persona: dispatcher, finance, warehouse, yard, admin.', 'Playbooks agents: freight audit, planning continue, exceptions, red-team.', 'Release notes par phase majeure.'] },
  ],
};

export const docs: DocPage[] = [
  overview,
  gettingStarted,
  concepts,
  modulesIndex,
  ...moduleDocs.map(modulePage),
  workbenches,
  mcp,
  api,
  dataModel,
  security,
  deployment,
  roadmap,
];

export const featured = ['overview', 'modules', 'transportation', 'ai-workforce', 'mcp', 'getting-started'];

export function getDoc(slug: string) {
  return docs.find((doc) => doc.slug === slug) ?? docs[0];
}
