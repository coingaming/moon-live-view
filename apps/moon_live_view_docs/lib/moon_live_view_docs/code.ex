defmodule MoonLiveViewDocs.Code do
  @moduledoc false
  use Phoenix.Component

  @doc false
  defmacro __using__(_opts \\ []) do
    quote do
      import unquote(__MODULE__)
      @before_compile unquote(__MODULE__)

      Module.register_attribute(
        __MODULE__,
        :examples,
        persist: true,
        accumulate: true
      )
    end
  end

  defmacro __before_compile__(_env) do
    # Get the current generated documentation
    # configs = Module.get_attribute(env.module, :__moon_docs_pages__)

    quote do
      def get_code_example() do
        List.first(@examples)
      end
    end
  end

  def fetch_ast(path, fun) do
    path
    |> File.read!()
    |> Code.string_to_quoted!()
    |> Macro.prewalk(fn
      result = {:def, _, [{^fun, _, _} | _]} -> throw(result)
      other -> other
    end)

    {:error, ""}
  catch
    result -> {:ok, result}
  end

  @doc """
  Sets information about code for examples.

  This macro takes a list of function names as an argument and retrieves their AST (Abstract Syntax Tree).
  It then generates a map associating each function name with its corresponding AST representation.
  Finally, it sets this map as the `@examples` module attribute.

  ## Parameters
    * `functions` - A list of function names for which code information will be retrieved.

  ## Raises
    * `RuntimeError` - If the argument `functions` is not a non-empty list.

  ## Examples

  ```elixir
  set_info([:function_name])
  """
  defmacro set_info(functions) do
    quote do
      # If the name of the function_list is changed, please also change it in the set_renders.
      function_list = unquote(functions)

      Module.put_attribute(__MODULE__, :__set_info_called__, true)
      Module.put_attribute(__MODULE__, :function_list, function_list)

      if is_list(function_list) and length(function_list) > 0 do
        examples_map = get_examples(function_list, unquote(__CALLER__.file))
        @examples examples_map
      else
        raise "MoonLiveViewDocs.Code.set_info: The argument value is invalid"
      end

      # Add The function to load in the socket
      def handle_params(params, _url, socket) do
        example = params["example"]

        if example do
          {:noreply, socket |> assign(example: example)}
        else
          {:noreply, socket}
        end
      end
    end
  end

  defmacro set_renders(temp) do
    for item <- temp do
      item_to_show = "#{item}"

      quote do
        def render(%{:example => unquote(item_to_show)} = var!(assigns)) do
          var!(assigns) = var!(assigns) |> assign(:func_to_show, unquote(item))

          ~H"""
          <div>
            {Function.capture(__MODULE__, @func_to_show, 1).(var!(assigns))}
          </div>
          """
        end
      end
    end
  end

  @doc """
  Get map of code examples

  ## Parameters
    * `functions` - A list of function names for which code information will be retrieved.
    * `file` - File with examples.
  """
  def get_examples(functions, file) do
    functions
    |> Enum.reduce(%{}, fn fun, acc ->
      {:ok, ast} = MoonLiveViewDocs.Code.fetch_ast(file, fun)
      Map.put(acc, fun, Macro.to_string(ast))
    end)
  end

  defmacro use_documentation(_list \\ []) do
    quote do
      all_live_modules = MoonLiveViewDocs.Code.get_all_moon_live()
      all_css_modules = MoonLiveViewDocs.Code.get_all_moon_css()

      # unless Module.get_attribute(__MODULE__, :__all_docs_called__) do
      #  attr(:all_moon_modules, :list, default: [])
      # end
    end
  end

  @doc """
  Get all available modules in the code.
  """
  def get_all_moon_live() do
    :code.all_available()
    |> Enum.filter(fn {mod, _, _} -> "#{mod}" =~ "MoonLiveView." end)
    |> Enum.map(fn {mod, _, _} ->
      mod
      |> to_string()
      |> String.split(".")
    end)
    |> Enum.filter(fn [_, mod | _] -> mod === "MoonLiveView" end)
    |> Enum.map(fn [_, _, mod | _] -> mod end)
    |> Enum.uniq()
    # Temporary excluded components
    |> Enum.reject(&(&1 in ["Carousel"]))
    # Permanently excluded components
    |> Enum.reject(&(&1 in ["Icon", "LiveComponent", "Merge"]))
  end

  @doc """
  Get all available modules in the code.
  """
  def get_all_moon_css() do
    ["Chip"]
  end

  # def __on_definition__(env) do
  #   IO.inspect(env, label: ":OnDefinition #{__MODULE__}")
  # end
end

defmodule MoonLiveViewDocs.Code.DocsStruct do
  @moduledoc false
  defstruct [:description, :functions, :macros, :types, :callbacks, :behaviours, :modules]
end
