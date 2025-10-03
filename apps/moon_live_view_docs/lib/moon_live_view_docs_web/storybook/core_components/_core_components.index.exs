defmodule Storybook.CoreComponents do
  use PhoenixStorybook.Index

  # Full index page documentation at https://hexdocs.pm/phoenix_storybook/0.8.1/PhoenixStorybook.Index.html
  # Icons implementation full documentation at https://hexdocs.pm/phoenix_storybook/0.8.1/icons.html

  def folder_open?, do: true
  # Icons examples:
  # def entry("table"), do: [icon: {:fa, "table", :thin}]

  # def entry("avatar") do
  #   [name: "Avatar", icon: {:fa, "user"}]
  # end

  # def entry("button") do
  #   [
  #     name: "Button",
  #     # Choose an appropriate icon, or use "generic"
  #     icon: {:fa, "hand-wave", :thin}
  #   ]
  # end
end
