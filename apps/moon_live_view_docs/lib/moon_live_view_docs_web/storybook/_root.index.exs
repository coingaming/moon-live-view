defmodule Storybook.Root do
  # See https://hexdocs.pm/phoenix_storybook/PhoenixStorybook.Index.html for full index
  # documentation.

  use PhoenixStorybook.Index

  def folder_icon, do: {:fa, "book-open", :light, "psb-mr-1"}
  def folder_name, do: "Storybook"

  # TBD: To be added later

  # def entry("customization") do
  #   [
  #     name: "Customization"
  #   ]
  # end

  # def entry("icons") do
  #   [
  #     name: "Icons"
  #     # icon: {:fa, "hand-wave", :thin}
  #   ]
  # end

  # def entry("migration") do
  #   [
  #     name: "Migration to V4"
  #   ]
  # end

  # def entry("tokens") do
  #   [
  #     name: "Tokens"
  #   ]
  # end
end
