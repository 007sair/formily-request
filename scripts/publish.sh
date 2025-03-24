#!/bin/sh

if [ "$GITHUB_REF_NAME" = 'beta' ]; then
  pnpm exec changeset version --snapshot beta
  pnpm publish -r --access public --tag beta
else
  pnpm exec changeset version
  pnpm publish -r --access public
  pnpm exec gh-pages -d site/docs-dist -r "https://$PAT_TOKEN@github.com/007sair/formily-request.git"
fi