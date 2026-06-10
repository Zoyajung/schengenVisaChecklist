import {landingPageSeo} from './landingPageSeo'
import {blogPost} from './blogPost'
import {category} from './category'
import {author} from './author'
import {faqItem} from './faqItem'
import {redirect} from './redirect'
import {siteSettings} from './siteSettings'
import {country} from './country'
import {visaType} from './visaType'
import {officialSource} from './officialSource'
import {checklistRule} from './checklistRule'
import {generatedResult} from './generatedResult'

/** All document schema types. */
export const documents = [
  // SEO metadata for code-built landing pages
  landingPageSeo,
  // Blog content
  blogPost,
  category,
  author,
  faqItem,
  // Site management
  redirect,
  // Singleton
  siteSettings,
  // Visa checklist MVP
  country,
  visaType,
  officialSource,
  checklistRule,
  generatedResult,
]
