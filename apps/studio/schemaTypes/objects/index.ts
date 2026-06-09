import {seo} from './seo'
import {aiSeo} from './aiSeo'
import {schemaConfig} from './schemaConfig'
import {faqList} from './faqList'
import {imageWithMeta} from './imageWithMeta'
import {link} from './link'
import {socialDefaults} from './socialDefaults'
import {analyticsConfig} from './analyticsConfig'
import {redirectSettings} from './redirectSettings'
import {portableText} from './portableText'

/** All reusable object schemas (registered, but not documents). */
export const objects = [
  seo,
  aiSeo,
  schemaConfig,
  faqList,
  imageWithMeta,
  link,
  socialDefaults,
  analyticsConfig,
  redirectSettings,
  portableText,
]
