interface Props {
  label: string
  value: number
  setValue: (val: number) => void
  min: number
  max: number
}

export default function NumberStepper({ label, value, setValue, min, max }: Props) {
  const decrease = () => setValue(Math.max(min, value - 1))
  const increase = () => setValue(Math.min(max, value + 1))

  return (
    <div className="stepper-field">
      <label className="stepper-label">{label}</label>
      <div className="stepper-controls">
        <button className="stepper-btn" onClick={decrease} disabled={value <= min}>-</button>
        <span className="stepper-value">{value}</span>
        <button className="stepper-btn" onClick={increase} disabled={value >= max}>+</button>
      </div>
    </div>
  )
}
