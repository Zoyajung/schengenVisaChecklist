// =============================================================================
// Sanity content typedefs (JSDoc) — describes the shapes returned by GROQ
// queries, not raw Sanity documents. Import in components for IDE autocomplete:
//
//   /** @typedef {import('@/sanity/types').Post} Post */
//
// These mirror the projections in sanity/queries/. If you change a query
// projection, update the matching typedef here.
// =============================================================================

/**
 * @typedef {Object} SanityImage
 * @property {string} [url]
 * @property {string} [alt]
 * @property {string} [caption]
 * @property {string} [credit]
 * @property {string} [lqip]       - Low-quality image placeholder (base64)
 * @property {{width:number,height:number,aspectRatio:number}} [dimensions]
 */

/**
 * @typedef {Object} Seo
 * @property {string} [metaTitle]
 * @property {string} [metaDescription]
 * @property {string} [canonicalUrl]
 * @property {string} [ogTitle]
 * @property {string} [ogDescription]
 * @property {SanityImage} [ogImage]
 * @property {string} [twitterTitle]
 * @property {string} [twitterDescription]
 * @property {SanityImage} [twitterImage]
 * @property {{noindex?:boolean,nofollow?:boolean}} [robots]
 */

/**
 * @typedef {Object} AiSeo
 * @property {string} [quickAnswer]       - 50–80 word direct answer for AI/voice search
 * @property {string} [summary]
 * @property {string[]} [keyTakeaways]
 * @property {Faq[]} [commonQuestions]
 * @property {string} [speakableContent]  - Voice-search friendly version
 */

/**
 * @typedef {Object} SchemaConfig
 * @property {string} [primarySchemaType]   - e.g. "article", "blogPosting", "howTo"
 * @property {boolean} [enableFaqSchema]
 * @property {boolean} [enableSpeakable]
 * @property {boolean} [enableBreadcrumb]
 * @property {boolean} [enableVideoSchema]
 * @property {boolean} [enableImageSchema]
 */

/**
 * @typedef {Object} Faq
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {Object} Author
 * Author embedded in blog posts (from `authorFields` projection).
 * No standalone author profile page — displayed via BlogAuthorCard component only.
 * @property {string} _id
 * @property {string} name
 * @property {string} [slug]
 * @property {string} [role]
 * @property {string} [bio]
 * @property {string[]} [expertise]
 * @property {string} [credentials]
 * @property {SanityImage} [image]
 * @property {{platform:string,url:string}[]} [socials]
 */

/**
 * @typedef {Object} Category
 * @property {string} _id
 * @property {string} name
 * @property {string} slug
 * @property {string} [description]
 * @property {SanityImage} [image]
 * @property {Seo} [seoDefaults]           - Inherited by posts in this category
 * @property {AiSeo} [aiSeoDefaults]
 * @property {SchemaConfig} [schemaDefaults]
 * @property {Faq[]} [faqDefaults]
 * @property {Object} [socialDefaults]
 */

/**
 * @typedef {Object} Post
 * @property {string} _id
 * @property {string} title
 * @property {string} slug
 * @property {string} [language]           - Content language; missing legacy values resolve to "en"
 * @property {string} [translationGroup]   - Shared ID linking translations of the same post
 * @property {string} [sourceLanguage]     - Original language used to create this translation
 * @property {string} [excerpt]
 * @property {string[]} [tags]
 * @property {boolean} [tocEnabled]
 * @property {string} [publishedAt]
 * @property {string} [updatedAt]
 * @property {string[]} [oldSlugs]         - Previous slugs, trigger 301 redirects
 * @property {SanityImage} [featuredImage]
 * @property {Author} [author]
 * @property {Category} [category]
 * @property {any[]} [body]                - Portable Text blocks
 * @property {Faq[]} [faq]
 * @property {Seo} [seo]
 * @property {AiSeo} [aiSeo]
 * @property {SchemaConfig} [schemaConfig]
 * @property {Post[]} [relatedPosts]
 */

/**
 * @typedef {Object} LandingPageSeo
 * SEO + schema metadata for code-built landing pages. No page content here —
 * layout lives in the Next.js page file; this drives the <head> only.
 * @property {string} _id
 * @property {string} title
 * @property {string} slug                 - Route identifier: "/" = home, "about" = /about
 * @property {string} [visibility]         - "public" | "hidden"
 * @property {Faq[]} [faq]
 * @property {Seo} [seo]
 * @property {AiSeo} [aiSeo]
 * @property {SchemaConfig} [schemaConfig]
 * @property {string} [publishedAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} SiteSettings
 * Singleton — top of the SEO/schema inheritance chain.
 * @property {string} [name]
 * @property {string} [url]
 * @property {string} [description]
 * @property {string} [legalName]
 * @property {string} [contactEmail]
 * @property {string} [titleTemplate]      - e.g. "%s | YourBrand"
 * @property {SanityImage} [logo]
 * @property {Seo} [defaultSeo]
 * @property {SchemaConfig} [defaultSchemaConfig]
 * @property {Object} [socialDefaults]
 * @property {{platform:string,url:string}[]} [socialProfiles]
 * @property {Object} [analytics]
 */

/**
 * @typedef {Object} Redirect
 * @property {string} source
 * @property {string} destination
 * @property {boolean} permanent           - true = 301, false = 302
 */

export {}
