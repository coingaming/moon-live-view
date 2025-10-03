defmodule FilterComponents do
  @moduledoc "Filtering components"
  def filter(list) do
    list
    |> Enum.filter(fn item ->
      case item do
        "Component" -> false
        "Components" -> false
        "MixProject" -> false
        "Utils" -> false
        "Link" -> false
        _ -> true
      end
    end)
  end
end
