#!/bin/bash

#Configurações
GATSBY_TELEMETRY_DISABLED=1
PORT=4002

# Entra na pasta bin
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

# Troca para a pasta docs
cd ../docs/

# Inicia a aplicação
echo "Builda a imagem"
docker build -t register_docs_prod .

echo "Para e remove o container atual se existir"
docker stop register_docs_prod || true
docker container rm register_docs_prod || true

echo "Roda o container"
    docker run \
        -p $PORT:9000 \
        -v public:/var/www/docs/public:ro \
        --name register_docs_prod \
        -d register_docs_prod