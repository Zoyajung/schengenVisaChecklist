import {client} from '@/sanity/lib/client'
import {apiVersion, dataset, projectId} from '@/sanity/lib/config'
import {CHECKLIST_CONTEXT_QUERY} from '@/sanity/queries'
import {needsShortStaySchengenVisa} from '@/constants/visa-policy'
import {dateInSiteTimeZone} from '@/utils/date'

const DISCLAIMER =
  'This is an independent informational guide. We are not VFS, TLS, an embassy, a consulate, or a government website. Visa rules can change, so always verify requirements with the official source before applying.'

const DEFAULT_EU_SOURCE = {
  title: 'European Commission - Border crossing',
  url: 'https://home-affairs.ec.europa.eu/policies/schengen/border-crossing_en',
  sourceType: 'eu',
}

const EU_VISA_SOURCE = {
  title: 'European Commission - Schengen visa policy',
  url: 'https://home-affairs.ec.europa.eu/policies/schengen/visa-policy_en',
  sourceType: 'eu',
}

const UAE_TOURIST_ROUTE_GUIDANCE = {
  france: {
    portal: 'https://www.france-visas.gouv.fr/en/web/france-visas/',
    provider: 'France-Visas online portal, then VFS Global UAE for appointment and submission.',
    centers: ['VFS Global France Visa Application Centre in Dubai', 'VFS Global France Visa Application Centre in Abu Dhabi'],
    sources: [
      {title: 'France-Visas - United Arab Emirates', url: 'https://www.france-visas.gouv.fr/emirats-arabes-unis', sourceType: 'government'},
      {title: 'France-Visas - Visa application process', url: 'https://www.france-visas.gouv.fr/en/visa-application-guidelines', sourceType: 'government'},
      {title: 'France-Visas - Visa fees', url: 'https://www.france-visas.gouv.fr/documents/d/france-visas/frais-de-visa-anglais', sourceType: 'government'},
    ],
    whereToApply:
      'Start on France-Visas to complete the application and confirm your document list. UAE residents then submit the file and biometrics through the France visa application centre serving their emirate.',
    serviceFeeNotes:
      'France UAE applications start on France-Visas, but payment and service options are handled through the France visa application centre route shown for your emirate. Check France-Visas/VFS UAE for the current AED fee, service charge, and optional courier or premium services.',
    processingTimeNotes:
      'France-Visas gives the official application flow, but your practical timeline depends on France appointment availability in Dubai or Abu Dhabi, document forwarding, and consular processing after submission.',
  },
  germany: {
    portal: 'https://uae.diplo.de/ae-en/service/05-visaeinreise/1358934-1358934',
    provider: 'German Mission guidance with VFS Global UAE submission where instructed.',
    centers: ['VFS Global Dubai for Dubai and Northern Emirates applicants where instructed by the German Mission'],
    sources: [
      {title: 'German Missions in the UAE - Schengen Visa', url: 'https://uae.diplo.de/ae-en/service/05-visaeinreise/1358934-1358934', sourceType: 'embassy'},
      {title: 'German Missions in the UAE - Visit purpose checklist', url: 'https://uae.diplo.de/ae-en/service/05-visaeinreise/2633512-2633512', sourceType: 'embassy'},
    ],
    whereToApply:
      'Apply to Germany only if Germany is your main Schengen destination. The German Consulate General in Dubai decides UAE Schengen applications; follow the German Mission page for the correct VFS or consular submission route.',
    serviceFeeNotes:
      'Germany UAE applications are decided by the German mission, while VFS fees or service options apply when the German Mission instructs you to submit through VFS. Check the German Mission UAE page before paying.',
    processingTimeNotes:
      'For Germany from the UAE, plan around German Mission processing after VFS/consular submission. Appointment availability and file forwarding can add time before the consulate decision window starts.',
  },
  italy: {
    portal: 'https://visa.vfsglobal.com/dxb/en/ita/',
    provider: 'VFS Global Dubai for Dubai/Northern Emirates; BLS International Abu Dhabi for Abu Dhabi emirate where instructed.',
    centers: ['VFS Global Italy Visa Application Centre in Dubai', 'BLS Italy Visa Application Centre in Abu Dhabi'],
    sources: [
      {title: 'VFS Global - Italy visa from Dubai', url: 'https://visa.vfsglobal.com/dxb/en/ita/about-vfs', sourceType: 'vfs'},
      {title: 'Italy Embassy Abu Dhabi - Visas', url: 'https://ambabudhabi.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/', sourceType: 'embassy'},
      {title: 'VFS Global Italy Dubai - Tourism checklist', url: 'https://visa.vfsglobal.com/one-pager/italy/uae/english/dubai/pdf/tourism-checklist-2024.pdf', sourceType: 'vfs'},
    ],
    whereToApply:
      'Apply to Italy if Italy is your main Schengen destination. UAE submission route depends on the emirate issuing your UAE residence visa: Dubai/Northern Emirates commonly use VFS Dubai, while Abu Dhabi emirate applicants should check the Embassy/BLS route.',
    serviceFeeNotes:
      'Italy has different UAE submission routes: VFS Dubai for Dubai/Northern Emirates and BLS Abu Dhabi where the Embassy route applies. Check the correct provider for service fees, payment mode, and optional services.',
    processingTimeNotes:
      'For Italy from the UAE, timing depends strongly on whether your route is VFS Dubai or BLS Abu Dhabi, appointment availability, and how quickly the file reaches the Italian consular office.',
  },
  spain: {
    portal: 'https://uae.blsspainvisa.com/',
    provider: 'BLS Spain Visa Application Centre UAE.',
    centers: ['BLS Spain Visa Application Centre in the UAE'],
    sources: [
      {title: 'BLS Spain Visa UAE', url: 'https://uae.blsspainvisa.com/', sourceType: 'vfs'},
      {title: 'BLS Spain UAE - Transit checklist example', url: 'https://uae.blsspainvisa.com/assets/pdf/Transit-checklist.pdf', sourceType: 'vfs'},
    ],
    whereToApply:
      'Apply through BLS Spain UAE if Spain is your only or main Schengen destination. Use the BLS UAE portal to confirm the current category, appointment flow, and checklist for your visa purpose.',
    serviceFeeNotes:
      'Spain UAE applications use the BLS Spain UAE route. Check BLS UAE for the current service fee, accepted payment method, and optional services in addition to the Schengen visa fee.',
    processingTimeNotes:
      'For Spain from the UAE, the practical timeline depends on BLS appointment availability, submission completeness, and consular processing after BLS forwards the application.',
  },
  netherlands: {
    portal: 'https://www.netherlandsworldwide.nl/countries/united-arab-emirates/travel/applying-for-a-short-stay-schengen-visa',
    provider: 'NetherlandsWorldwide guidance, then VFS Global UAE application centre.',
    centers: ['VFS Global Netherlands Visa Application Centre in Abu Dhabi', 'VFS Global Netherlands Visa Application Centre in Dubai'],
    sources: [
      {title: 'NetherlandsWorldwide - Applying for a Schengen visa in the UAE', url: 'https://www.netherlandsworldwide.nl/countries/united-arab-emirates/travel/applying-for-a-short-stay-schengen-visa', sourceType: 'government'},
      {title: 'VFS Global Netherlands UAE official visit checklist example', url: 'https://visa.vfsglobal.com/one-pager/netherlands/uae/english/pdf/Checklist-Official-Visit-Visa.pdf', sourceType: 'vfs'},
    ],
    whereToApply:
      'Apply for a Netherlands short-stay Schengen visa through the NetherlandsWorldwide UAE guidance and the VFS Global application centre in Abu Dhabi or Dubai.',
    serviceFeeNotes:
      'Netherlands UAE applications use NetherlandsWorldwide guidance and VFS Global application centres in Abu Dhabi or Dubai. Check VFS Netherlands UAE for service fees, optional services, and local AED payment details.',
    processingTimeNotes:
      'For the Netherlands from the UAE, appointment availability at VFS Abu Dhabi or Dubai and the handoff to Dutch processing can make the real timeline longer than the standard consular decision period.',
  },
}

const ROUTE_GUIDANCE = {
  'afghanistan:germany': {
    portal: 'https://afghanistan.diplo.de/af-en/05-VisaEinreise',
    provider:
      'German Foreign Office guidance for Afghanistan. The German Embassy in Kabul is closed; short-stay Schengen applications for Afghanistan are routed through German missions in Islamabad, Dubai, or Istanbul according to the official page.',
    centers: ['German mission in Islamabad', 'German mission in Dubai', 'German mission in Istanbul'],
    sources: [
      {
        title: 'German Foreign Office Afghanistan - Visa and Entry',
        url: 'https://afghanistan.diplo.de/af-en/05-VisaEinreise',
        sourceType: 'embassy',
      },
      {
        title: 'German Foreign Office Afghanistan - Schengen Visa',
        url: 'https://afghanistan.diplo.de/af-en/05-visaeinreise/2005366-2005366',
        sourceType: 'embassy',
      },
      {
        title: 'German Foreign Office Afghanistan - Documents for Schengen Visa',
        url: 'https://afghanistan.diplo.de/af-en/05-visaeinreise/2699078-2699078',
        sourceType: 'embassy',
      },
    ],
    whereToApply:
      'For applicants residing in Afghanistan, Germany states that the Embassy in Kabul is currently closed and Schengen visa applications cannot be submitted in Kabul. Follow the German Foreign Office Afghanistan guidance for the current submission route through the German missions in Islamabad, Dubai, or Istanbul.',
    serviceFeeNotes:
      'Check the German Foreign Office Afghanistan page and the mission handling your application for the current visa fee, appointment process, and any local service or payment instructions.',
    processingTimeNotes:
      'For Germany from Afghanistan, plan extra time for the alternative submission route because the file may be handled outside Afghanistan. Do not book tight travel until the appointment route and processing timeline are confirmed on the German Foreign Office page.',
    documentAdditions: [
      {
        name: 'Afghanistan financial evidence',
        status: 'required',
        appliesWhen: 'Applicants applying through the German Afghanistan route',
        explanation:
          'Germany lists evidence of sufficient own funds in Afghanistan, including bank statements for the past 6 months and, if applicable, proof of property, payrolls, or similar financial evidence.',
        commonMistakes: ['Bank statements cover too short a period', 'Property or payroll proof is missing when used to support funds', 'Financial evidence is not translated when required'],
      },
      {
        name: 'German or English translations',
        status: 'conditional',
        appliesWhen: 'Documents are not already in German or English',
        explanation:
          'The German Afghanistan document guidance says documents that are not in German or English have to be translated before filing the visa application.',
        commonMistakes: ['Submitting local-language documents without translation', 'Translation does not match the original document', 'Names or dates differ between original and translation'],
      },
    ],
  },
}

const DESTINATION_GUIDANCE = {
  austria: {
    portal: 'https://www.bmeia.gv.at/en/travel-stay/entry-and-residence-in-austria/visa',
    countryName: 'Austria',
  },
  belgium: {
    portal: 'https://diplomatie.belgium.be/en/travel-to-belgium/visa',
    countryName: 'Belgium',
  },
  bulgaria: {
    portal: 'https://www.mfa.bg/en/services-travel/consular-services/travel-bulgaria/visa-bulgaria',
    countryName: 'Bulgaria',
  },
  croatia: {
    portal: 'https://mvep.gov.hr/services-for-citizens/consular-information-22802/visas-22807/visa-requirements-overview-22879/22879',
    countryName: 'Croatia',
  },
  czechia: {
    portal: 'https://mzv.gov.cz/jnp/en/information_for_aliens/short_stay_visa/index.html',
    countryName: 'Czechia',
  },
  denmark: {
    portal: 'https://nyidanmark.dk/en-GB/You-want-to-apply/Short-stay-visa',
    countryName: 'Denmark',
  },
  estonia: {
    portal: 'https://vm.ee/en/consular-visa-and-travel-information/visa-information',
    countryName: 'Estonia',
  },
  finland: {
    portal: 'https://um.fi/visa-to-visit-finland',
    countryName: 'Finland',
  },
  france: {
    portal: 'https://france-visas.gouv.fr/en/',
    countryName: 'France',
  },
  germany: {
    portal: 'https://www.auswaertiges-amt.de/en/visa-service',
    countryName: 'Germany',
  },
  greece: {
    portal: 'https://www.mfa.gr/en/visas/visas-for-foreigners-traveling-to-greece/',
    countryName: 'Greece',
  },
  hungary: {
    portal: 'https://konzinfo.mfa.gov.hu/en/how-apply-visa',
    countryName: 'Hungary',
  },
  iceland: {
    portal: 'https://island.is/en/visa-to-iceland',
    countryName: 'Iceland',
  },
  italy: {
    portal: 'https://vistoperitalia.esteri.it/home/en',
    countryName: 'Italy',
  },
  latvia: {
    portal: 'https://www.mfa.gov.lv/en/entry-latvia',
    countryName: 'Latvia',
  },
  liechtenstein: {
    portal: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html',
    countryName: 'Liechtenstein',
    note: 'Liechtenstein visa matters are handled through Swiss entry and visa rules.',
  },
  lithuania: {
    portal: 'https://keliauk.urm.lt/en/entry-to-lithuania/visas',
    countryName: 'Lithuania',
  },
  luxembourg: {
    portal: 'https://guichet.public.lu/en/citoyens/immigration/moins-3-mois/ressortissant-tiers/visa-entree.html',
    countryName: 'Luxembourg',
  },
  malta: {
    portal: 'https://identita.gov.mt/central-visa-unit-main-page/',
    countryName: 'Malta',
  },
  netherlands: {
    portal: 'https://www.netherlandsworldwide.nl/visa-the-netherlands/schengen-visa',
    countryName: 'Netherlands',
  },
  norway: {
    portal: 'https://www.udi.no/en/want-to-apply/visit-and-holiday/',
    countryName: 'Norway',
  },
  poland: {
    portal: 'https://www.gov.pl/web/diplomacy/visas',
    countryName: 'Poland',
  },
  portugal: {
    portal: 'https://vistos.mne.gov.pt/en/',
    countryName: 'Portugal',
  },
  romania: {
    portal: 'https://eviza.mae.ro/',
    countryName: 'Romania',
  },
  slovakia: {
    portal: 'https://www.mzv.sk/en/web/en/consular_info/visa',
    countryName: 'Slovakia',
  },
  slovenia: {
    portal: 'https://www.gov.si/en/topics/entry-and-residence/',
    countryName: 'Slovenia',
  },
  spain: {
    portal: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Servicios-consulares.aspx',
    countryName: 'Spain',
  },
  sweden: {
    portal: 'https://www.migrationsverket.se/English/Private-individuals/Visiting-Sweden/Visit-Sweden-for-less-than-90-days.html',
    countryName: 'Sweden',
  },
  switzerland: {
    portal: 'https://www.eda.admin.ch/eda/en/fdfa/entry-switzerland-residence/visa-requirements-application-form.html',
    countryName: 'Switzerland',
  },
}

const STARTER_TOURIST_DOCUMENTS = [
  {
    name: 'Passport',
    status: 'required',
    appliesWhen: 'Every applicant',
    explanation:
      'Use a valid passport or travel document with enough blank pages and validity beyond the planned Schengen exit date. Check the destination-specific rule before booking.',
    commonMistakes: ['Passport close to expiry', 'Damaged passport', 'Missing copy of bio/signature pages'],
  },
  {
    name: 'Residence proof',
    status: 'required',
    appliesWhen: 'Applicants applying from a country where they are not a citizen',
    explanation:
      'Include a residence permit, long-stay visa, national ID, or other legal residence evidence if the destination or appointment provider asks for proof that you can apply from your current country of residence.',
    commonMistakes: ['Residence document expires too soon', 'Copy is unclear', 'Name does not match passport exactly'],
  },
  {
    name: 'Completed Schengen visa application form',
    status: 'required',
    appliesWhen: 'Every short-stay visa applicant',
    explanation:
      'Complete the destination country form or online portal flow, then sign/date the form where required.',
    commonMistakes: ['Unsigned form', 'Different travel dates across form and bookings', 'Wrong main destination selected'],
  },
  {
    name: 'Recent biometric photo',
    status: 'required',
    appliesWhen: 'Every applicant unless the provider takes photo on site and says otherwise',
    explanation:
      'Prepare recent photos that match the destination/provider photo requirements.',
    commonMistakes: ['Old photo', 'Wrong background', 'Photo size does not match checklist'],
  },
  {
    name: 'Travel itinerary',
    status: 'required',
    appliesWhen: 'Tourist route',
    explanation:
      'Provide flight reservation or itinerary showing entry/exit and the main destination. Do not make non-refundable bookings unless the official source requires it.',
    commonMistakes: ['Itinerary main destination conflicts with selected consulate', 'Dates do not match hotel/insurance', 'No proof of return to the residence country'],
  },
  {
    name: 'Accommodation proof',
    status: 'required',
    appliesWhen: 'Tourist route',
    explanation:
      'Provide hotel bookings or host accommodation evidence covering the full Schengen stay.',
    commonMistakes: ['Missing nights', 'Applicant name not visible', 'Accommodation country does not match main destination'],
  },
  {
    name: 'Travel medical insurance',
    status: 'required',
    appliesWhen: 'Schengen short-stay route',
    explanation:
      'Use Schengen-compliant travel medical insurance covering the intended stay and all Schengen states. Verify minimum coverage on the official checklist.',
    commonMistakes: ['Coverage dates do not include the full trip', 'Policy does not mention Schengen/Europe coverage', 'Insured name differs from passport'],
  },
  {
    name: 'Proof of funds',
    status: 'required',
    appliesWhen: 'Every applicant unless a specific exemption applies',
    explanation:
      'Prepare recent bank statements and financial evidence showing you can cover the trip. Some destinations ask for a specific statement period.',
    commonMistakes: ['Statements too old', 'Low or unexplained balance', 'Missing salary credits or supporting explanation'],
  },
  {
    name: 'Employment or sponsor evidence',
    status: 'conditional',
    appliesWhen: 'Based on employment status, student status, sponsorship, or family support',
    explanation:
      'Employees commonly need a salary/NOC letter. Self-employed applicants may need trade license or company documents. Sponsored applicants may need sponsor documents.',
    commonMistakes: ['NOC has no leave dates', 'Letter has no salary/designation', 'Sponsor ID, passport, or residence proof missing when required'],
  },
  {
    name: 'Previous Schengen visas and biometrics evidence',
    status: 'conditional',
    appliesWhen: 'If you previously held Schengen visas or gave biometrics',
    explanation:
      'Include copies of previous Schengen visas if available. Biometrics may still be required depending on date, quality, and destination/provider rules.',
    commonMistakes: ['Assuming biometrics are never needed again', 'Not carrying old passport with previous visas', 'Previous visa copy is unreadable'],
  },
  {
    name: 'Minor applicant documents',
    status: 'conditional',
    appliesWhen: 'If the applicant is under 18',
    explanation:
      'Minors usually need birth certificate, parent/guardian documents, consent letters, and parent passport/visa copies as listed by the destination.',
    commonMistakes: ['Consent not signed by both parents when required', 'Birth certificate not translated/legalized when required', 'Parent names do not match'],
  },
  {
    name: 'Cover letter',
    status: 'optional',
    appliesWhen: 'Useful when the route has details to explain',
    explanation:
      'A concise cover letter can explain your itinerary, employment/sponsor situation, previous travel, and reason to return to your country of residence.',
    commonMistakes: ['Too long or emotional', 'Claims not supported by documents', 'Different dates than the form/bookings'],
  },
]

const VISA_FREE_TRAVEL_DOCUMENTS = [
  {
    name: 'Valid passport',
    status: 'required',
    appliesWhen: 'Every visa-exempt traveller',
    explanation:
      'Carry a valid ordinary passport or travel document accepted by the Schengen state you will enter. Check passport validity rules on the destination official source before travelling.',
    commonMistakes: ['Passport expires too soon', 'Damaged passport', 'Name does not match bookings'],
  },
  {
    name: 'Proof of travel purpose and itinerary',
    status: 'required',
    appliesWhen: 'Short-stay visa-free travel',
    explanation:
      'Be ready to explain your travel purpose and show itinerary evidence such as hotel bookings, host details, tour plans, or business meeting information if border officers ask.',
    commonMistakes: ['No clear accommodation plan', 'Dates do not match tickets', 'Purpose is unclear at the border'],
  },
  {
    name: 'Return or onward ticket',
    status: 'required',
    appliesWhen: 'Short-stay entry at the border',
    explanation:
      'Border officers may ask for proof that you will leave the Schengen area before the permitted stay ends.',
    commonMistakes: ['No onward travel proof', 'Return date exceeds allowed stay', 'Ticket details do not match itinerary'],
  },
  {
    name: 'Proof of funds',
    status: 'required',
    appliesWhen: 'Short-stay entry at the border',
    explanation:
      'Prepare evidence that you can support yourself during the stay, such as cards, bank evidence, cash, sponsorship, or host support where accepted.',
    commonMistakes: ['Insufficient evidence of funds', 'Sponsor support is not documented', 'Funds do not match trip length'],
  },
  {
    name: 'Travel medical insurance',
    status: 'optional',
    appliesWhen: 'Strongly recommended for visa-free travellers',
    explanation:
      'Travel medical insurance may not be a visa-free entry document, but it is strongly recommended for medical emergencies, cancellations, and travel disruption.',
    commonMistakes: ['Insurance dates do not cover the full trip', 'Policy excludes destination countries', 'Emergency coverage is too limited'],
  },
  {
    name: 'ETIAS travel authorisation',
    status: 'conditional',
    appliesWhen: 'When ETIAS becomes operational for your nationality',
    explanation:
      'Visa-exempt travellers will need to check whether ETIAS applies before travel once the system is operational.',
    commonMistakes: ['Assuming visa-free means no pre-travel authorisation ever', 'Using unofficial ETIAS websites', 'Passport details do not match the authorisation'],
  },
]

const RESULT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'summary',
    'applicationRoute',
    'steps',
    'documents',
    'feesAndTiming',
    'warnings',
    'officialSources',
    'disclaimer',
  ],
  properties: {
    summary: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'applicantProfile', 'visaRequired', 'confidence', 'lastCheckedDate'],
      properties: {
        title: {type: 'string'},
        applicantProfile: {type: 'string'},
        visaRequired: {type: 'boolean'},
        confidence: {type: 'string', enum: ['high', 'medium', 'low']},
        lastCheckedDate: {type: 'string'},
      },
    },
    applicationRoute: {
      type: 'object',
      additionalProperties: false,
      required: ['whereToApply', 'officialPortal', 'appointmentProvider', 'applicationCenters'],
      properties: {
        whereToApply: {type: 'string'},
        officialPortal: {type: 'string'},
        appointmentProvider: {type: 'string'},
        applicationCenters: {type: 'array', items: {type: 'string'}},
      },
    },
    steps: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['stepNumber', 'title', 'description'],
        properties: {
          stepNumber: {type: 'number'},
          title: {type: 'string'},
          description: {type: 'string'},
        },
      },
    },
    documents: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'status', 'appliesWhen', 'explanation', 'commonMistakes'],
        properties: {
          name: {type: 'string'},
          status: {type: 'string', enum: ['required', 'conditional', 'optional']},
          appliesWhen: {type: 'string'},
          explanation: {type: 'string'},
          commonMistakes: {type: 'array', items: {type: 'string'}},
        },
      },
    },
    feesAndTiming: {
      type: 'object',
      additionalProperties: false,
      required: ['visaFeeNotes', 'serviceFeeNotes', 'processingTimeNotes'],
      properties: {
        visaFeeNotes: {type: 'string'},
        serviceFeeNotes: {type: 'string'},
        processingTimeNotes: {type: 'string'},
      },
    },
    warnings: {type: 'array', items: {type: 'string'}},
    officialSources: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'url', 'sourceType'],
        properties: {
          title: {type: 'string'},
          url: {type: 'string'},
          sourceType: {type: 'string', enum: ['government', 'embassy', 'vfs', 'tls', 'eu']},
        },
      },
    },
    disclaimer: {type: 'string'},
  },
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function routeSlug(input) {
  const base = [
    input.destinationCountry,
    input.visaType,
    input.nationality,
    'from',
    input.residenceCountry,
  ].map(slugify).filter(Boolean).join('-')
  return `${base || 'schengen-checklist'}-${Date.now().toString(36)}`
}

function label(value) {
  return String(value || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function normalizeInput(body) {
  return {
    nationality: slugify(body?.nationality),
    residenceCountry: slugify(body?.residenceCountry),
    destinationCountry: slugify(body?.destinationCountry),
    visaType: slugify(body?.visaType),
    purpose: String(body?.purpose || '').trim(),
    employmentStatus: String(body?.employmentStatus || '').trim(),
    familyStatus: String(body?.familyStatus || '').trim(),
    previousBiometrics: Boolean(body?.previousBiometrics),
  }
}

function validateInput(input) {
  return input.nationality && input.residenceCountry && input.destinationCountry && input.visaType && input.purpose
}

function sourceList(context) {
  const byUrl = new Map()
  for (const source of context.sources || []) {
    if (source?.url) byUrl.set(source.url, source)
  }
  for (const rule of context.rules || []) {
    for (const source of rule.officialSources || []) {
      if (source?.url) byUrl.set(source.url, source)
    }
  }
  if (!byUrl.size) byUrl.set(DEFAULT_EU_SOURCE.url, DEFAULT_EU_SOURCE)
  return [...byUrl.values()]
}

function starterGuidance(input) {
  const routeGuidance = ROUTE_GUIDANCE[`${input.residenceCountry}:${input.destinationCountry}`]
  if (routeGuidance) return routeGuidance

  const uaeGuidance =
    input.residenceCountry === 'united-arab-emirates' && input.visaType === 'tourist'
      ? UAE_TOURIST_ROUTE_GUIDANCE[input.destinationCountry]
      : null

  return uaeGuidance || destinationGuidance(input)
}

function destinationGuidance(input) {
  const destination = DESTINATION_GUIDANCE[input.destinationCountry]
  if (!destination) return null

  return {
    portal: destination.portal,
    provider:
      `Use the official ${destination.countryName} visa portal to select the application location for your country of residence and confirm the current appointment provider.`,
    centers: [],
    sources: [
      {
        title: `${destination.countryName} official visa guidance`,
        url: destination.portal,
        sourceType: 'government',
      },
    ],
    whereToApply:
      `${destination.countryName} has destination-specific official visa guidance available. Use that official portal to confirm whether applicants residing in ${label(input.residenceCountry)} apply through an embassy, consulate, visa application centre, or represented Schengen mission. ${destination.note || ''}`.trim(),
    serviceFeeNotes:
      `Check the official ${destination.countryName} portal and the appointment provider selected for ${label(input.residenceCountry)} for the current visa fee, service fee, payment method, and optional services.`,
    processingTimeNotes:
      `For ${destination.countryName} from ${label(input.residenceCountry)}, processing depends on appointment availability, the local submission route, document forwarding, and consular decision time. Confirm the timeline on the official ${destination.countryName} source before booking travel.`,
    coverage: 'destination',
  }
}

function mergedSources(context, guidance) {
  const byUrl = new Map()
  for (const source of guidance?.sources || []) byUrl.set(source.url, source)
  byUrl.set(EU_VISA_SOURCE.url, EU_VISA_SOURCE)
  for (const source of sourceList(context)) byUrl.set(source.url, source)
  return [...byUrl.values()]
}

function documentsFromRules(rules) {
  return rules.map((rule) => ({
    name: rule.documentName,
    status: rule.status,
    appliesWhen: rule.conditionText || 'Applies to this selected route.',
    explanation: rule.explanation,
    commonMistakes: rule.commonMistakes || [],
  }))
}

function routeSpecificSources(context, input) {
  return sourceList(context).filter((source) => (
    source.destinationCountry?.slug === input.destinationCountry ||
    source.residenceCountry?.slug === input.residenceCountry
  ))
}

function withDocumentAdditions(documents, additions = []) {
  const seen = new Set(documents.map((document) => document.name.toLowerCase()))
  return [
    ...documents,
    ...additions.filter((document) => {
      const key = document.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }),
  ]
}

function fallbackResult(input, context) {
  const guidance = starterGuidance(input)
  const sources = mergedSources(context, guidance)
  const rules = context.rules || []
  const hasRouteSpecificSources = routeSpecificSources(context, input).length > 0
  const hasExactRouteGuidance = Boolean(
    ROUTE_GUIDANCE[`${input.residenceCountry}:${input.destinationCountry}`] ||
    (input.residenceCountry === 'united-arab-emirates' && input.visaType === 'tourist' && UAE_TOURIST_ROUTE_GUIDANCE[input.destinationCountry]),
  )
  const hasDestinationGuidance = guidance?.coverage === 'destination'
  const hasVerifiedRouteDetails = Boolean(hasExactRouteGuidance || rules.length || hasRouteSpecificSources)
  const now = dateInSiteTimeZone()
  const lastChecked = sources.map((source) => source.lastCheckedDate).filter(Boolean).sort().at(-1) || now
  const destination = label(input.destinationCountry)
  const residence = label(input.residenceCountry)
  const nationality = label(input.nationality)
  const visaRequired = needsShortStaySchengenVisa(input.nationality)
  const documents = rules.length
    ? documentsFromRules(rules)
    : visaRequired
      ? withDocumentAdditions(STARTER_TOURIST_DOCUMENTS, guidance?.documentAdditions)
      : VISA_FREE_TRAVEL_DOCUMENTS

  return {
    summary: {
      title: visaRequired
        ? `${destination} ${label(input.visaType)} visa checklist from ${residence}`
        : `${destination} visa-free travel checklist for ${nationality} citizens`,
      applicantProfile: visaRequired
        ? `${nationality} citizen residing in ${residence} applying for a ${destination} Schengen visa for ${input.purpose}.`
        : `${nationality} citizen planning short-stay visa-free travel to ${destination} for ${input.purpose}.`,
      visaRequired,
      confidence: hasVerifiedRouteDetails ? 'medium' : 'low',
      lastCheckedDate: lastChecked,
    },
    applicationRoute: {
      whereToApply:
        !visaRequired
          ? `A short-stay Schengen visa is generally not required for ordinary passport holders from ${nationality}. Check the official ${destination} source before travel for passport validity, stay-limit, ETIAS, border-document, and exception rules.`
          : guidance?.whereToApply ||
        `This route needs a country-specific official source check before you rely on it. Use the official ${destination} embassy, consulate, or visa-provider page that serves applicants residing in ${residence}.`,
      officialPortal: guidance?.portal || sources[0]?.url || DEFAULT_EU_SOURCE.url,
      appointmentProvider:
        !visaRequired
          ? 'No visa appointment is usually needed for ordinary short-stay visa-free travel. Border entry conditions still apply.'
          : guidance?.provider ||
        `Not verified for ${destination} from ${residence} in the current source set. Check the official ${destination} mission or appointed provider for ${residence}.`,
      applicationCenters: guidance?.centers || [],
    },
    steps: [
      ...(visaRequired
        ? [
            {
              stepNumber: 1,
              title: `Confirm ${destination} is the correct consulate`,
              description:
                `Apply to ${destination} only if it is your only destination, main destination, or first entry when no main destination can be identified.`,
            },
            {
              stepNumber: 2,
              title: 'Complete the official application flow',
              description:
                guidance?.portal
                  ? `Use ${guidance.portal} to confirm the current form, appointment flow, and route-specific checklist.`
                  : 'Use the destination country official portal to confirm the current form, appointment flow, and route-specific checklist.',
            },
            {
              stepNumber: 3,
              title: 'Prepare your residence and travel evidence pack',
              description:
                `Match passport, residence proof for ${residence}, employment/sponsor documents, bank statements, travel insurance, itinerary, and accommodation dates.`,
            },
            {
              stepNumber: 4,
              title: 'Attend appointment and give biometrics if required',
              description:
                input.previousBiometrics
                  ? 'Carry previous Schengen visa copies, but still be ready to give biometrics if the provider or consulate asks.'
                  : 'Expect fingerprints and photo collection at the application centre unless an official exemption applies.',
            },
          ]
        : [
            {
              stepNumber: 1,
              title: 'Confirm visa-free entry conditions',
              description:
                `Use the official ${destination} source to confirm ordinary-passport visa-free entry, stay limit, passport validity, and any ETIAS or border-document requirements.`,
            },
            {
              stepNumber: 2,
              title: 'Check the 90/180-day stay limit',
              description:
                'Visa-free Schengen stays are generally limited to short stays. Count previous Schengen days before planning your trip.',
            },
            {
              stepNumber: 3,
              title: 'Prepare border-entry evidence',
              description:
                'Carry proof of accommodation, return or onward travel, sufficient funds, travel purpose, and insurance if border officers ask.',
            },
            {
              stepNumber: 4,
              title: 'Travel with matching documents',
              description:
                'Make sure passport details match tickets, bookings, travel authorisations, and any supporting documents.',
            },
          ]),
    ],
    documents,
    feesAndTiming: {
      visaFeeNotes:
        visaRequired
          ? 'For short-stay Schengen visas, official fee tables commonly list EUR 90 for most adult applicants and EUR 45 for children aged 6-11, with exemptions for some categories. Confirm the local currency amount, payment method, and exemption rules on the destination/provider page before payment.'
          : 'A short-stay Schengen visa fee is usually not required for ordinary visa-free travel. Check official sources for ETIAS or other travel-authorisation fees when applicable.',
      serviceFeeNotes:
        !visaRequired
          ? 'No visa application centre service fee is usually needed for visa-free travel because there is no visa appointment. Airline, border, ETIAS, or travel-service costs may still apply.'
          : guidance?.serviceFeeNotes ||
        'External service providers may charge separate service and optional fees. These are separate from the consular visa fee.',
      processingTimeNotes:
        !visaRequired
          ? 'Visa-free travel usually does not have consular processing time, but you should confirm entry conditions before booking and allow time for any required travel authorisation.'
          : guidance?.processingTimeNotes ||
        `Plan around the official Schengen decision period, but do not book tight travel. For ${destination} from ${residence}, appointment availability and provider forwarding time can make the practical timeline longer than the consular decision window.`,
    },
    warnings: [
      hasVerifiedRouteDetails
        ? 'Review every document rule against the linked official source.'
        : hasDestinationGuidance
          ? `${destination} official visa guidance is linked, but the current dataset does not yet contain a verified residence-specific checklist for applicants in ${residence}. Confirm appointment provider, local fees, document translations, and submission rules on the official portal.`
          : `Confirm the latest ${destination} requirements for applicants in ${residence} on the official embassy, consulate, or visa-provider website before applying.`,
      'Never rely on this checklist as a guarantee of visa approval.',
    ],
    officialSources: sources.map((source) => ({
      title: source.title,
      url: source.url,
      sourceType: source.sourceType || 'government',
    })),
    disclaimer: DISCLAIMER,
  }
}

async function generateWithOpenAI(input, context, {useWebSearch = false} = {}) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_openai_api_key_here') return null

  const destination = label(input.destinationCountry)
  const residence = label(input.residenceCountry)
  const nationality = label(input.nationality)
  const tools = useWebSearch ? [{type: 'web_search'}] : undefined
  const researchInstruction = useWebSearch
    ? [
        'Use web search before producing the result.',
        `Research official visa guidance for ${destination} short-stay Schengen visa applicants residing in ${residence}.`,
        `Also verify whether ${nationality} ordinary passport holders generally need a short-stay Schengen visa or are visa-exempt.`,
        'Use only official government, embassy/consulate, EU, VFS, TLS, BLS, or other appointed-provider pages as sources.',
        'If you cannot verify a country-specific rule from an official source, keep the wording general and tell the user to confirm on the linked official source.',
      ].join('\n')
    : 'Use only the provided CMS data and route guidance.'

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHECKLIST_MODEL || 'gpt-5-mini',
      ...(tools ? {tools, tool_choice: 'auto'} : {}),
      input: [
        {
          role: 'system',
          content: [
            'You are helping generate an informational Schengen visa checklist.',
            researchInstruction,
            'If routeGuidance is provided in the CMS context, treat it as verified route guidance.',
            'Do not invent rules.',
            'If information is unclear, mark confidence as low.',
            'Never guarantee visa approval.',
            'Never claim this is an official embassy/VFS/TLS checklist.',
            'Always include official source links.',
            'Every country-specific statement must be supported by an official source in officialSources.',
            'For visa-exempt nationalities, do not create a visa document checklist; explain the short-stay border/ETIAS-style preparation instead.',
            'For visa-required nationalities, create a visa appointment document checklist.',
            'Return only JSON matching the schema.',
          ].join('\n'),
        },
        {
          role: 'user',
          content: JSON.stringify({userInputs: input, cmsContext: context, requiredDisclaimer: DISCLAIMER}),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'visa_checklist_result',
          strict: true,
          schema: RESULT_SCHEMA,
        },
      },
    }),
  })

  if (!res.ok) {
    console.error('[generate-checklist] OpenAI generation failed:', res.status, await res.text())
    return null
  }

  try {
    const data = await res.json()
    const text = data.output_text || data.output?.flatMap((item) => item.content || []).find((item) => item.type === 'output_text')?.text
    return text ? JSON.parse(text) : null
  } catch (err) {
    console.error('[generate-checklist] OpenAI response parse failed:', err)
    return null
  }
}

async function saveGeneratedResult({slug, input, result, context}) {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !token) {
    throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN to save generated results.')
  }

  const sourceRefs = sourceList(context)
    .filter((source) => source._id)
    .map((source) => ({
      _key: source._id,
      _type: 'reference',
      _ref: source._id,
    }))

  const mutation = {
    mutations: [
      {
        create: {
          _type: 'generatedResult',
          slug: {_type: 'slug', current: slug},
          userInputs: input,
          generatedJson: JSON.stringify(result, null, 2),
          sourceReferencesUsed: sourceRefs,
          confidenceLevel: result.summary?.confidence || 'low',
          status: 'aiGenerated',
          indexable: false,
          createdDate: new Date().toISOString(),
        },
      },
    ],
  }

  const res = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mutation),
  })

  if (!res.ok) throw new Error(`Sanity save failed with status ${res.status}`)
}

export async function POST(request) {
  try {
    const input = normalizeInput(await request.json())
    if (!validateInput(input)) {
      return Response.json({message: 'Missing required checklist fields.'}, {status: 400})
    }

    const context = (await client.fetch(CHECKLIST_CONTEXT_QUERY, input)) || {rules: [], sources: []}
    const routeGuidance = starterGuidance(input)
    const generationContext = {...context, routeGuidance}
    const hasExactRouteGuidance = Boolean(
      ROUTE_GUIDANCE[`${input.residenceCountry}:${input.destinationCountry}`] ||
      (input.residenceCountry === 'united-arab-emirates' && input.visaType === 'tourist' && UAE_TOURIST_ROUTE_GUIDANCE[input.destinationCountry]),
    )
    const shouldResearchLive = !context.rules?.length && !hasExactRouteGuidance
    const aiResult = context.rules?.length || shouldResearchLive
      ? await generateWithOpenAI(input, generationContext, {useWebSearch: shouldResearchLive})
      : null
    const result = aiResult || fallbackResult(input, context)
    const slug = routeSlug(input)

    await saveGeneratedResult({slug, input, result, context})

    return Response.json({slug, result})
  } catch (err) {
    console.error('[generate-checklist] error:', err)
    return Response.json({message: err instanceof Error ? err.message : 'Checklist generation failed.'}, {status: 500})
  }
}
