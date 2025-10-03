defmodule MoonLiveView.Checkbox do
  use MoonLiveView.Component

  attr :id, :string, default: nil, doc: "Unique identifier for the checkbox component"
  attr :checked, :boolean, default: false, doc: "Indicates whether the checkbox is checked"
  attr :disabled, :boolean, default: false, doc: "Indicates whether the checkbox is disabled"
  attr :indeterminate, :boolean, default: false, doc: "Indicates whether the checkbox is indeterminate"
  attr :class, :string, default: nil, doc: "Additional classes to add to the checkbox."
  attr :rest, :global, doc: "Additional attributes to add to the checkbox component."

  slot :label, doc: "Label for the checkbox"

  def checkbox(assigns) do
    ~H"""
    <label>
      <input
        id={@id}
        type="checkbox"
        class={join(["moon-checkbox", @class])}
        checked={@checked}
        disabled={@disabled}
        data-indeterminate={@indeterminate}
        phx-hook="CheckboxHook"
        {@rest}
      />
      <span :if={@label != []}>
        {render_slot(@label)}
      </span>
    </label>
    """
  end
end
