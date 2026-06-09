import type {StructureResolver} from 'sanity/structure'
import {BlogPostsPane} from '../schemaTypes/components/BlogPostsPane'

// Known landingPageSeo document IDs.
const HOME_DOC_ID = 'b8a86865-821d-4365-8c03-b240be64601c'
const FAQ_DOC_ID = '6bcf3f82-6348-47ed-8692-e1aaa39a2bbd'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog Posts')
        .schemaType('blogPost')
        .child(
          S.component()
            .id('blog-posts-list')
            .title('Blog Posts')
            .component(BlogPostsPane)
            .child((documentId) =>
              S.document().documentId(documentId).schemaType('blogPost'),
            ),
        ),

      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),

      S.listItem()
        .title('Authors')
        .schemaType('author')
        .child(S.documentTypeList('author').title('Authors')),

      S.listItem()
        .title('FAQ Items')
        .schemaType('faqItem')
        .child(S.documentTypeList('faqItem').title('FAQ Items')),

      S.divider(),

      S.listItem()
        .title('Visa Checklist MVP')
        .id('visa-checklist-group')
        .child(
          S.list()
            .title('Visa Checklist MVP')
            .items([
              S.listItem()
                .title('Countries')
                .schemaType('country')
                .child(S.documentTypeList('country').title('Countries')),
              S.listItem()
                .title('Visa Types')
                .schemaType('visaType')
                .child(S.documentTypeList('visaType').title('Visa Types')),
              S.listItem()
                .title('Official Sources')
                .schemaType('officialSource')
                .child(S.documentTypeList('officialSource').title('Official Sources')),
              S.listItem()
                .title('Checklist Rules')
                .schemaType('checklistRule')
                .child(S.documentTypeList('checklistRule').title('Checklist Rules')),
              S.listItem()
                .title('Generated Results')
                .schemaType('generatedResult')
                .child(S.documentTypeList('generatedResult').title('Generated Results')),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title('Site Settings')
        .id('site-settings-group')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('Landing Page')
                .id('landing-page-home')
                .child(
                  S.document()
                    .schemaType('landingPageSeo')
                    .documentId(HOME_DOC_ID),
                ),

              S.listItem()
                .title('FAQ')
                .id('landing-page-faq')
                .child(
                  S.document()
                    .schemaType('landingPageSeo')
                    .documentId(FAQ_DOC_ID),
                ),
            ]),
        ),
    ])
