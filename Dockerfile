# ARG BUILDER_IMAGE="hexpm/elixir:1.15.7-erlang-26.1.2-debian-bookworm-20231009-slim"
# ARG RUNNER_IMAGE="debian:bookworm-20231009-slim"

ARG ELIXIR_VERSION=1.18.4
ARG OTP_VERSION=27.3.4.2
ARG DEBIAN_VERSION=bookworm-20250811-slim

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"

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
COPY apps/moon_live_view_docs/mix.exs mix.lock ./
# RUN mix deps.get --only $MIX_ENV
# RUN mkdir config

COPY apps/moon_live_view_docs/config/config.exs apps/moon_live_view_docs/config/${MIX_ENV}.exs /config/
COPY apps/moon_live_view_docs/lib/moon_live_view_docs_web/storybook storybook
COPY apps/moon_live_view /moon_live_view

RUN mix deps.get --only $MIX_ENV


RUN mix dev.storybook
RUN mix compile
RUN mix deps.compile

RUN mkdir assets

COPY apps/moon_live_view_docs .

# Navigate to assets directory and run npm install
RUN npm install

# Go back to app root for mix commands
RUN mix compile
# RUN mix deps.compile
RUN ln -s /app/assets /assets
# compile assets
RUN mix assets.deploy

# Compile the release
# RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code

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

WORKDIR /app

RUN chown nobody /app

EXPOSE 4000

ENV MIX_ENV="prod"


COPY --from=builder --chown=nobody:root /app/_build/prod/rel/moon_live_view_docs ./
COPY --from=builder --chown=nobody:root /app/VERSION ./VERSION

USER nobody

CMD ["/app/bin/moon_live_view_docs", "start"]
