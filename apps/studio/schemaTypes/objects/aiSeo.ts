import {defineType, defineField} from 'sanity'
import {createCharacterCount} from '../components/CharacterCount'

/**
 * AI search optimisation object — reused by every major content type.
 * Powers Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude and
 * voice assistants, plus the frontend's Quick Answer / Key Takeaways sections.
 *
 * Speakable schema is auto-generated from the Quick Answer field — no
 * separate speakable input is needed.
 */
export const aiSeo = defineType({
  name: 'aiSeo',
  title: 'AI SEO',
  type: 'object',
  options: {collapsible: true, collapsed: false},
  fields: [
    defineField({
      name: 'quickAnswer',
      title: 'Quick Answer',
      type: 'text',
      rows: 3,
      description:
        '50-80 words. The direct answer surfaced by AI search engines (Google AI Overviews, ChatGPT, Perplexity). Optional but recommended. ' +
        'Also used as the Speakable schema content for voice assistants — write it in clear, spoken-word sentences.',
      components: {input: createCharacterCount({recommendedMin: 250, recommendedMax: 500})},
      validation: (Rule) => Rule.max(700).warning('Keep quick answers concise enough for AI and voice surfaces.'),
    }),
    defineField({
      name: 'keyTakeaways',
      title: 'Key Takeaways',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Optional. Rendered as a highlighted list at the top of the article.',
    }),
  ],
})
