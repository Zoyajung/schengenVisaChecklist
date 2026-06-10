import {type LayoutProps} from 'sanity'
import '../../sanity.css'

/**
 * Studio layout wrapper whose only job is to pull in the global studio CSS so
 * styling lives in sanity.css rather than inline styles.
 */
export function StudioLayout(props: LayoutProps) {
  return props.renderDefault(props)
}

export default StudioLayout
