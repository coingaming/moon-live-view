defmodule MoonLiveViewDocsTest do
  use ExUnit.Case
  doctest MoonLiveViewDocs

  test "greets the world" do
    assert MoonLiveViewDocs.hello() == :world
  end
end
