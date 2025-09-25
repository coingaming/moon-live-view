defmodule MoonLiveViewDocsWeb.MigrationTable do
  @moduledoc "MigrationTable"

  use Phoenix.Component
  use MoonLiveView

  attr :title, :string, required: true
  attr :data, :map, required: true

  slot :description do
    attr(:class, :string)
  end

  def migration_table(assigns) do
    ~H"""
    <section class="flex flex-col gap-space-8">
      <div class="flex flex-col gap-space-24">
        <h2 class="text-heading-100">{@title}</h2>
        <p class="max-w-3xl">
          {render_slot(@description)}
        </p>
        <div class="border-1 border-primary rounded-8 overflow-hidden">
          <div tabindex="0" class="focus:outline-none rounded-8 overflow-auto">
            <table class="bg-secondary w-full table-auto text-primary">
              <thead>
                <tr class="border-b-1 border-primary">
                  <th class="bg-tertiary w-1/3 w-space-full text-start select-none text-body-300 p-space-12 border-e-1 border-primary">
                    <span class="font-medium">Old token</span>
                  </th>
                  <th class="bg-tertiary w-1/3 w-space-full text-start select-none text-body-300 p-space-12">
                    <span class="font-medium">New token</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <%= for row <- @data do %>
                  <tr id={row.id} class="border-b-1 last:border-b-0 border-secondary text-primary">
                    <td class="text-start text-body-300 px-space-12 py-space-8 whitespace-nowrap">
                      {row.old}
                    </td>
                    <td class="text-start text-body-300 px-space-12 py-space-8 whitespace-nowrap">
                      {row.new}
                    </td>
                  </tr>
                <% end %>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
    """
  end
end

F
