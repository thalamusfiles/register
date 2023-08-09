---
title: Autenticação
description: Autenticação de chamadas de API
---

A autenticação do sistema Register é realizada pelo sistema [IAM - Thalamus](https://iam.thalamus.digital/).

O IAM permite criar tokens de acesso sem data de expiração para autenticação nas APIs.

Para realizar uma chamada autenticada basta informar o **token de aecsso** no header **Authorization** das requisições.