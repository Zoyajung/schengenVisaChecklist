import {type StringInputProps, type TextInputProps} from 'sanity'

type Thresholds = {
  recommendedMin?: number
  recommendedMax?: number
  hardLimit?: number
}

/**
 * Factory that returns a Sanity input component wrapping the default string/text
 * input with a live character counter. The counter exposes a `data-state` of
 * `ok | warn | error` that sanity.css styles into a badge — no inline styles.
 *
 *   components: {input: createCharacterCount({recommendedMin: 50, recommendedMax: 60, hardLimit: 70})}
 */
export function createCharacterCount(thresholds: Thresholds = {}) {
  const {recommendedMin = 0, recommendedMax = 0, hardLimit = 0} = thresholds

  return function CharacterCountInput(props: StringInputProps | TextInputProps) {
    const value = (props.value as string) || ''
    const len = value.length

    let state: 'ok' | 'warn' | 'error' = 'ok'
    if (hardLimit && len > hardLimit) state = 'error'
    else if (recommendedMax && len > recommendedMax) state = 'warn'
    else if (recommendedMin && len > 0 && len < recommendedMin) state = 'warn'

    const hint = [
      recommendedMax ? `${recommendedMin || 0}–${recommendedMax} recommended` : '',
      hardLimit ? `max ${hardLimit}` : '',
    ]
      .filter(Boolean)
      .join(' · ')

    return (
      <div className="ds-charcount">
        {props.renderDefault(props)}
        <div className="ds-counter" data-state={state}>
          <span className="ds-counter__num">{len}</span>
          {hint ? <span className="ds-counter__hint">{hint}</span> : null}
        </div>
      </div>
    )
  }
}

export default createCharacterCount
