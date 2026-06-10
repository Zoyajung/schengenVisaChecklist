const sourceProjection = `{
  _id,
  title,
  url,
  sourceType,
  lastCheckedDate,
  "country": country->{name, "slug": slug.current},
  "destinationCountry": destinationCountry->{name, "slug": slug.current},
  "residenceCountry": residenceCountry->{name, "slug": slug.current}
}`

export const COUNTRIES_QUERY = `*[_type == "country"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  isoCode,
  countryTypes,
  notes
}`

export const VISA_TYPES_QUERY = `*[_type == "visaType"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  examples
}`

export const CHECKLIST_CONTEXT_QUERY = `{
  "rules": *[
    _type == "checklistRule" &&
    (!defined(nationality) || nationality->slug.current == $nationality) &&
    (!defined(residenceCountry) || residenceCountry->slug.current == $residenceCountry) &&
    (!defined(destinationCountry) || destinationCountry->slug.current == $destinationCountry) &&
    (!defined(visaType) || visaType->slug.current == $visaType)
  ] | order(status asc, documentName asc) {
    _id,
    documentName,
    status,
    conditionText,
    explanation,
    commonMistakes,
    "nationality": nationality->{name, "slug": slug.current},
    "residenceCountry": residenceCountry->{name, "slug": slug.current},
    "destinationCountry": destinationCountry->{name, "slug": slug.current},
    "visaType": visaType->{name, "slug": slug.current},
    "officialSources": officialSources[]->${sourceProjection}
  },
  "sources": *[
    _type == "officialSource" &&
    (!defined(destinationCountry) || destinationCountry->slug.current == $destinationCountry) &&
    (!defined(residenceCountry) || residenceCountry->slug.current == $residenceCountry)
  ] | order(lastCheckedDate desc) ${sourceProjection}
}`

export const GENERATED_RESULT_BY_SLUG_QUERY = `*[_type == "generatedResult" && slug.current == $slug][0] {
  _id,
  "slug": slug.current,
  userInputs,
  generatedJson,
  confidenceLevel,
  status,
  createdDate,
  reviewedDate,
  reviewerNotes,
  indexable,
  "sourceReferencesUsed": sourceReferencesUsed[]->${sourceProjection}
}`

export const GENERATED_RESULTS_REVIEW_QUERY = `*[_type == "generatedResult"] | order(createdDate desc) [0...100] {
  _id,
  "slug": slug.current,
  userInputs,
  confidenceLevel,
  status,
  createdDate,
  reviewedDate,
  indexable
}`
