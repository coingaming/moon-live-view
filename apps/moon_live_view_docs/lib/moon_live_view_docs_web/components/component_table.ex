defmodule MoonLiveViewDocsWeb.ComponentTable do
  @moduledoc "ComponentTable"

  use Phoenix.Component
  use MoonLiveView

  attr :title, :string, required: true
  attr :data, :map, required: true

  def component_table(assigns) do
    ~H"""
    <section class="flex flex-col gap-space-8">
      <div class="flex flex-col gap-space-24">
        <h2 class="text-heading-200">{@title}</h2>
        <div class="flex flex-col gap-space-16 text-body-400 text-primary">
          <p>
            These are props specific to the {@title} component:
          </p>
        </div>
        <div class="border border-primary rounded-8 overflow-hidden bg-primary">
          <div tabindex="0" class="focus:outline-none rounded-8 overflow-auto">
            <table class="border-separate bg-tertiary w-full table-auto border-0">
              <thead>
                <tr>
                  <th class="relative z-[1] bg-tertiary min-w-space-20 w-[100px]">
                    <div class="relative text-start select-none text-body-300 p-space-12">
                      <span class="text-secondary font-normal">Name</span>
                    </div>
                  </th>
                  <th class="relative z-[1] bg-tertiary w-[150px] min-w-space-20">
                    <div class="relative text-start select-none text-body-300 p-space-12">
                      <span class="text-secondary font-normal">Type</span>
                    </div>
                  </th>
                  <th class="relative z-[1] bg-tertiary w-[100px] min-w-space-20">
                    <div class="relative text-start select-none text-body-300 p-space-12">
                      <span class="text-secondary font-normal">Default</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <%= for row <- @data do %>
                  <tr id={row.id} class="border-transparent group/rows border-0">
                    <td class="relative box-border text-start text-body-300 p-space-12 group/rows before:bg-tertiary group/rows bg-primary group/rows after:bg-primary w-[100px] min-w-space-20">
                      <div class="flex flex-row gap-space-8 items-center">
                        <.tag size="2xs">
                          {row.name}
                          <%= if row.required do %>
                            <span>*</span>
                          <% end %>
                        </.tag>
                        <%!-- <.icon
                          name="info"
                          class="size-space-12 cursor-pointer"
                          phx-click={show_popover("#popover-#{row.id}")}
                        /> --%>
                        <%!-- <.popover id={"popover-#{row.id}"} side="top" align="left">
                          <div class="py-space-8 px-space-16">
                            {row.doc}
                          </div>
                        </.popover> --%>
                      </div>
                    </td>
                    <td class="relative box-border text-start text-body-300 p-space-12 group/rows group/rows bg-primary group/rows after:bg-primary w-[150px] min-w-space-20">
                      <span class="text-secondary">{row.type}</span>
                    </td>
                    <td class="relative box-border text-start text-body-300 p-space-12 group/rows group/rows bg-primary group/rows after:bg-primary w-[100px] min-w-space-20">
                      <span class="text-primary">{row.default}</span>
                    </td>
                  </tr>
                <% end %>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <%= if Enum.any?(@data, & &1.required) do %>
        <p class="text-secondary text-body-200">
          Properties indicated with <span class="text-info">*</span> are required.
        </p>
      <% end %>
    </section>
    """
  end
end
