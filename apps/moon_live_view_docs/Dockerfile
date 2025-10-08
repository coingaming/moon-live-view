ARG BUILDER_IMAGE="hexpm/elixir:1.15.7-erlang-26.1.2-debian-bookworm-20231009-slim"
ARG RUNNER_IMAGE="debian:bookworm-20231009-slim"

FROM ${BUILDER_IMAGE} AS builder

# install build dependencies
RUN apt-get update -y && apt-get install -y build-essential ca-certificates git wget curl gnupg \
  && apt-get clean && rm -rf /var/lib/apt/lists/*_*

RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y

# prepare build dir
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
  mix local.rebar --force

# set build ENV
ENV MIX_ENV="prod"
ARG SECRET_KEY_BASE

# install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# copy compile-time config files before we compile dependencies
# to ensure any relevant config change will trigger the dependencies
# to be re-compiled.
COPY config/config.exs config/${MIX_ENV}.exs config/

COPY lib/moon_live_docs_web/storybook storybook

RUN mix dev.storybook
RUN mix compile
RUN mix deps.compile

# Ensure the icons are included
RUN mkdir assets

COPY . .

RUN npm install

RUN mix deps.get --only $MIX_ENV

RUN mix compile

# compile assets
RUN mix assets.deploy

# Compile the release
# RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code
# COPY config/runtime.exs config/
# COPY rel rel

RUN mix release

# start a new build stage so that the final image will only contain
# the compiled release and other runtime necessities
FROM ${RUNNER_IMAGE}

RUN apt-get update -y && apt-get install -y libstdc++6 openssl libncurses5 locales wget \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US:en"
ENV LC_ALL="en_US.UTF-8"

WORKDIR "/app"
RUN chown nobody /app

EXPOSE 4000

# set runner ENV
ENV MIX_ENV="prod"

# Only copy the final release from the build stage
COPY --from=builder --chown=nobody:root /app/_build/prod/rel/moon_live_docs ./
COPY --from=builder --chown=nobody:root /app/VERSION ./VERSION
COPY --from=builder --chown=nobody:root /app/deps/moon_assets/priv/static/icons ./assets/icons

COPY lib/moon_live_docs_web/storybook storybook

USER nobody

CMD ["/app/bin/moon_live_docs", "start"]
