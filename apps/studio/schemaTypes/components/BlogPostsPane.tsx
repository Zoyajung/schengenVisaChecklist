import {useState, useEffect} from 'react'
import {useClient} from 'sanity'
import {usePaneRouter} from 'sanity/structure'
import {IntentLink} from 'sanity/router'

const API_VERSION = '2025-01-01'

const STATUS_OPTIONS = [
  {label: 'All Posts', value: ''},
  {label: 'Draft', value: 'draft'},
  {label: 'In Review', value: 'review'},
  {label: 'Approved', value: 'approved'},
  {label: 'Published', value: 'published'},
  {label: 'Archived', value: 'archived'},
]

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  de: 'DE',
  ar: 'AR',
}

const formatUpdatedDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('en', {day: '2-digit', month: 'short', year: 'numeric'}).format(new Date(value))
    : null

type Post = {
  _id: string
  title: string | null
  language: string | null
  status: string | null
  publishedAt: string | null
  _updatedAt: string | null
  author: {name: string} | null
}

const canonicalId = (id: string) => id.replace(/^drafts\./, '')
const isDraft = (id: string) => id.startsWith('drafts.')

function mergeDrafts(posts: Post[]): Post[] {
  const byId = new Map<string, Post>()

  for (const post of posts) {
    const id = canonicalId(post._id)
    const current = byId.get(id)
    if (!current || (isDraft(post._id) && !isDraft(current._id))) {
      byId.set(id, post)
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    const dateA = new Date(a.publishedAt || a._updatedAt || 0).getTime()
    const dateB = new Date(b.publishedAt || b._updatedAt || 0).getTime()
    return dateB - dateA
  })
}

/**
 * Custom blog-posts list pane.
 *
 * Layout mirrors Sanity's native document list:
 *   - The pane itself is the narrow middle column
 *   - Clicking a row opens the document editor as the right-hand pane
 *     (via usePaneRouter's ChildLink — same mechanism Sanity uses internally)
 *
 * Status dropdown at the top re-queries the dataset and replaces the list
 * in place; no page navigation occurs.
 */
export function BlogPostsPane() {
  const [filter, setFilter] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const client = useClient({apiVersion: API_VERSION})
  // ChildLink is a curried StateLink pre-wired to this pane's position in the
  // URL stack. Rendering <ChildLink childId={id}> pushes a new pane to the
  // right — exactly how Sanity's own documentTypeList works.
  const {ChildLink} = usePaneRouter()

  useEffect(() => {
    setLoading(true)
    const condition = filter ? '_type == "blogPost" && status == $s' : '_type == "blogPost"'
    client
      .fetch<Post[]>(
        `*[${condition}] | order(publishedAt desc) {
          _id,
          title,
          language,
          status,
          publishedAt,
          _updatedAt,
          author->{name}
        }`,
        {s: filter},
      )
      .then((data) => {
        setPosts(mergeDrafts(data))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [filter, client])

  const activeLabel = STATUS_OPTIONS.find((o) => o.value === filter)?.label ?? 'All Posts'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: 'inherit',
        background: 'var(--card-bg-color)',
        color: 'var(--card-fg-color)',
        overflow: 'hidden',
      }}
    >
      {/* ── Filter bar ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 10px',
          borderBottom: '1px solid var(--card-border-color)',
          flexShrink: 0,
        }}
      >
        <span style={{fontSize: 11, opacity: 0.55, whiteSpace: 'nowrap'}}>Status</span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            flex: 1,
            padding: '5px 8px',
            borderRadius: 3,
            background: 'var(--card-muted-bg-color)',
            color: 'var(--card-fg-color)',
            border: '1px solid var(--card-border-color)',
            fontSize: 12,
            cursor: 'pointer',
            outline: 'none',
            appearance: 'auto',
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* IntentLink for "create" is correct — it opens a new blank doc */}
        <IntentLink
          intent="create"
          params={{type: 'blogPost'}}
          style={{
            flexShrink: 0,
            padding: '5px 11px',
            borderRadius: 3,
            background: '#2276fc',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          + New
        </IntentLink>
      </div>

      {/* ── Count label ────────────────────────────────────────────── */}
      <div
        style={{
          padding: '4px 12px',
          fontSize: 11,
          opacity: 0.4,
          borderBottom: '1px solid var(--card-border-color)',
          flexShrink: 0,
        }}
      >
        {loading
          ? 'Loading…'
          : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}${filter ? ` · ${activeLabel}` : ''}`}
      </div>

      {/* ── Post list ──────────────────────────────────────────────── */}
      <div style={{flex: 1, overflowY: 'auto'}}>
        {!loading && posts.length === 0 && (
          <div style={{padding: '24px 16px', opacity: 0.4, fontSize: 12, textAlign: 'center'}}>
            No posts found.
          </div>
        )}

        {posts.map((post) => (
          // Outer div carries the border and block-level layout.
          // ChildLink (renders as <a>) pushes a right-hand document pane for
          // this post ID, keeping the list pane visible — proper 3-column layout.
          <div
            key={post._id}
            style={{borderBottom: '1px solid var(--card-border-color)'}}
          >
            <ChildLink childId={post._id}>
              <div
                style={{
                  padding: '10px 12px',
                  color: 'var(--card-fg-color)',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                }}
              >
                <div style={{fontSize: 13, fontWeight: 500, marginBottom: 2}}>
                  {post.title ?? 'Untitled'}
                </div>
                <div style={{fontSize: 11, opacity: 0.5}}>
                  {[
                    LANGUAGE_LABELS[post.language ?? 'en'] ?? 'EN',
                    post.author?.name,
                    formatUpdatedDate(post._updatedAt),
                    post.status ?? 'no status',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
            </ChildLink>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogPostsPane
