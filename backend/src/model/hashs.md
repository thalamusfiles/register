Resource
hashtextextended(resource_country_acronym || ':' || name, 1)

TypeKeyValue
hashtextextended( resource_country_acronym || ':' || resource.name || ':' || "type"  || ':' || "key" , 1)

Country
hashtextextended(resource_country_acronym || ':' || resource.name || ':' || code, 1)

State
hashtextextended(resource_country_acronym || ':' || resource.name || ':' || code, 1)

City
hashtextextended(resource_country_acronym || ':' || resource.name || ':' || code, 1)

Person
hashtextextended(resource_country_acronym || ':' || person_type || ':' || document_type || ':' || "document" , 1),

PersonResource
hashtextextended(resource_country_acronym || ':' || resource.name || ':'  || person.document , 1)

Establishment
hashtextextended(resource_country_acronym || ':'  || resource.name || ':'  extra_key, 1)

Contact
hashtextextended(resource_country_acronym || ':' || resource.name || ':' || extra_key, 1)

Partner
hashtextextended(resource_country_acronym || ':' || resource.name || ':' || establishment.extra_key || ':' || extra_key, 1)

