w# LOGS - Registros de logs realizados por este sistema.

O sistema Register realiza log de todos os controladores e serviços sistema.

A configuração do level do sistema esta disponível em **backend/src/config/kig,config.ts**

O log do sistema são agrupados em 3 categorias:

* Log/Info: São os logs das operações principais do sistema. Ex: log da chamada do controlador.
* Verbobe/Trace: São os logs dos caminhos e operações realizadas durante as operações principais. Ex: log das funções dos serviços.
* Debug: Log dos dados utilizados durante todo o processo. Ex: log das váriaveis.

Logs do Sistema:

* EstablishmentController
* * EstablishmentController.findByZipcode
* * EstablishmentController.findByZipcodeRandom
* * EstablishmentController.findByBusinessType
* * EstablishmentController.findByBusinessTypeRandom
* PersonController
* * PersonController.findLegalByDocument
* * PersonController.findLegalByRandom
* * PersonController.findNaturalByDocument
* * PersonController.findNaturalByRandom
* AddressController
* * AddressController.findStates
* * AddressController.findCitiesByState
* TypeKeyValueController
* * TypeKeyValueController.findBRCNAES

* RelEstablishmentController
* * RelEstablishmentController.totalByMonthAndState
* * RelEstablishmentController.totalByMonthAndStateCrosstab
* * RelEstablishmentController.totalByMonthAndNature
* * RelEstablishmentController.totalByMonthAndMainActivity

* AuthController
* * AuthController.iam
* * AuthController.iamCallback
* * AuthController.token
* * AuthController.logout
