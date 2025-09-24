defmodule MoonLiveView.Utils do
  @moduledoc "Some phoenix-related functions to be used in consumer apps"

  @doc "Library will serve these paths"
  def web_static_paths, do: ~w(icons)

  @doc "Generate a random id"
  def gen_rand_id() do
    :crypto.strong_rand_bytes(5)
    |> Base.encode32(case: :lower)
    |> String.replace(~r/=/, "")
  end

  @doc "List all icon names"
  def icons() do
    # we do use file-relative path here bc of umbrella's structure
    (__ENV__.file <> "../../../../priv/static/icons/*")
    |> Path.expand()
    |> Path.wildcard()
    |> Enum.map(fn path -> path |> String.split("/") |> List.last() |> String.split(".") |> hd end)
  end

  def join(classes) when is_list(classes) do
    classes |> Enum.join(" ") |> String.trim()
  end

  def push_custom_event(socket, event_name, id, detail \\ %{}) do
    Phoenix.LiveView.push_event(socket, event_name, %{id: id, detail: detail})
  end
end
