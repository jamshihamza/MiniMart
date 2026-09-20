# Operation Permission and Error Matrix

  ---------------------------------------------------------------------------------------------------------------------
  Contract                Required permission/capability               Stable error codes
  ----------------------- -------------------------------------------- ------------------------------------------------
  API-SYS-001             `device-only`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SYS-002             `device-only`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SYS-003             `device-only`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SYS-004             `device-only`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SYS-005             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SYS-006             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-001             `device-only`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-002             `device-only`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-003             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-004             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-005             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-006             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-007             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-008             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-009             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-IAM-010             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-011             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-012             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-013             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-014             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-IAM-015             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-016             `system.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-017             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-018             `system.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ORG-001             `organization.read`                          AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ORG-002             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-ORG-003             `organization.read`                          AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ORG-004             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ORG-005             `organization.read`                          AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ORG-006             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-ORG-007             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ORG-008             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ORG-009             `organization.read`                          AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ORG-010             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ORG-011             `organization.read`                          AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ORG-012             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-ORG-013             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ORG-014             `organization.write`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-001             `catalog.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CAT-002             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-003             `catalog.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CAT-004             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-CAT-005             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-006             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-007             `catalog.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CAT-008             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-009             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-010             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-011             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-CAT-012             `catalog.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CAT-013             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-014             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-CAT-015             `catalog.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CAT-016             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-CAT-017             `catalog.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PRI-001             `pricing.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PRI-002             `pricing.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PRI-003             `pricing.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PRI-004             `pricing.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PRI-005             `pricing.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PRI-006             `pricing.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PRI-007             `pricing.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PRI-008             `pricing.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SUP-001             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SUP-002             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SUP-003             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SUP-004             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-SUP-005             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SUP-006             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SUP-007             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SUP-008             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SUP-009             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PUR-001             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PUR-002             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PUR-003             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PUR-004             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PUR-005             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PUR-006             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PUR-007             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PUR-008             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PUR-009             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PUR-010             `procurement.post`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PUR-011             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PUR-012             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PUR-013             `procurement.read`                           AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-PUR-014             `procurement.write`                          AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PUR-015             `procurement.post`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-INV-001             `inventory.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-002             `inventory.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-003             `inventory.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-004             `inventory.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-005             `inventory.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-006             `inventory.write`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-INV-007             `inventory.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-008             `inventory.write`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, PRECONDITION_FAILED,
                                                                       RESOURCE_NOT_FOUND ...

  API-INV-009             `inventory.post`                             AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-INV-010             `inventory.write`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-POS-001             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-002             `sales.read`                                 AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-POS-003             `sales.read`                                 AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-POS-004             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-005             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-POS-006             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-007             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-POS-008             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-009             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-010             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-011             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-012             `sales.post`                                 AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-POS-013             `sales.read`                                 AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-POS-014             `sales.write`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PAY-001             `payment.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PAY-002             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-003             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-004             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-005             `payment.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PAY-006             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-007             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-008             `payment.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PAY-009             `payment.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PAY-010             `payment.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-PAY-011             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-012             `payment.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-013             `payment.post`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-RET-001             `returns.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-RET-002             `returns.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED
                                                                       ...

  API-RET-003             `returns.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-RET-004             `returns.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND ...

  API-RET-005             `returns.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-RET-006             `returns.post`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED
                                                                       ...

  API-RET-007             `returns.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-RET-008             `returns.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED,
                                                                       REFUND_OBLIGATION_OUTSTANDING,
                                                                       RESOURCE_NOT_FOUND, RETURN_ELIGIBILITY_CHANGED,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CUS-001             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CUS-002             `credit.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND ...

  API-CUS-003             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CUS-004             `credit.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED ...

  API-CUS-005             `credit.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND ...

  API-CUS-006             `credit.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND ...

  API-CRD-001             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CRD-002             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CRD-003             `credit.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED ...

  API-CRD-004             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CRD-005             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CRD-006             `credit.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND ...

  API-CRD-007             `credit.read`                                AUTHENTICATION_REQUIRED, CREDIT_CHANGED,
                                                                       CREDIT_POLICY_REJECTED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CRD-008             `credit.post`                                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND ...

  API-CSH-001             `cash.read`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, SHIFT_STATE_CHANGED,
                                                                       VALIDATION_FAILED

  API-CSH-002             `cash.read`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, SHIFT_STATE_CHANGED,
                                                                       VALIDATION_FAILED

  API-CSH-003             `cash.write`                                 AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED,
                                                                       BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE ...

  API-CSH-004             `cash.write`                                 AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED,
                                                                       BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE ...

  API-CSH-005             `cash.read`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, SHIFT_STATE_CHANGED,
                                                                       VALIDATION_FAILED

  API-CSH-006             `cash.post`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED,
                                                                       BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE ...

  API-CSH-007             `cash.post`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED,
                                                                       BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE ...

  API-CSH-008             `cash.read`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, SHIFT_STATE_CHANGED,
                                                                       VALIDATION_FAILED

  API-CSH-009             `cash.read`                                  AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, SHIFT_STATE_CHANGED,
                                                                       VALIDATION_FAILED

  API-CSH-010             `cash.write`                                 AUTHENTICATION_REQUIRED,
                                                                       BUSINESS_DAY_STATE_CHANGED,
                                                                       BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE ...

  API-ACC-001             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-002             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-003             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-004             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-005             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-006             `accounting.post`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-007             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-008             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-009             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-ACC-010             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-011             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-012             `accounting.post`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-013             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-014             `accounting.post`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-015             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-016             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-017             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-ACC-018             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-019             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-020             `accounting.post`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-021             `accounting.read`                            AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-022             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-023             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       PRECONDITION_FAILED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-ACC-024             `accounting.write`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-RPT-001             `reporting.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-RPT-002             `reporting.read`                             AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-RPT-003             `reporting.write`                            AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IMP-001             `import.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IMP-002             `import.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IMP-003             `import.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IMP-004             `import.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IMP-005             `import.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-AUD-001             `audit.read`                                 AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-AUD-002             `audit.read`                                 AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-BR-001              `backup.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-BR-002              `backup.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-BR-003              `backup.write`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SUPT-001            `support.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SUPT-002            `support.write`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SUPT-003            `support.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CTRY-001            `country.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CTRY-002            `country.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-CTRY-003            `country.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-HW-001              `hardware.read`                              AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-HW-002              `hardware.read`                              AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IAM-021             `session.lock`                               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-022             `session.unlock`                             AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IAM-023             `iam.user.credential.reset`                  AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-PAY-014             `payment.credit.use`                         AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-015             `payment.commitment.recover`                 AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED ...

  API-PAY-016             `payment.read`                               AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PAYMENT_ALREADY_COMMITTED,
                                                                       PAYMENT_RECOVERY_REQUIRED, PAYMENT_UNCERTAIN,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-CRD-009             `credit.collection.reverse`                  AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       CREDIT_CHANGED, CREDIT_POLICY_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND ...

  API-ACC-025             `accounting.supplier-payment.reverse`        AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-026             `accounting.financial-transaction.reverse`   AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-027             `accounting.transfer.reverse`                AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-ACC-028             `accounting.expense.reverse`                 AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-INV-011             `inventory.adjustment.read`                  AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-012             `inventory.adjustment.read`                  AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       INSUFFICIENT_STOCK, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       STOCK_CHANGED, VALIDATION_FAILED

  API-INV-013             `inventory.adjustment.edit`                  AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, PRECONDITION_FAILED,
                                                                       RESOURCE_NOT_FOUND ...

  API-INV-014             `inventory.adjustment.post`                  AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-INV-015             `inventory.adjustment.correct`               AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, INSUFFICIENT_STOCK,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE ...

  API-IMP-006             `import.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IMP-007             `import.create`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IMP-008             `import.cancel`                              AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-IMP-009             `import.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-IMP-010             `export.read`                                AUTHENTICATION_REQUIRED, INCOMPATIBLE_CLIENT,
                                                                       PERMISSION_DENIED, RESOURCE_NOT_FOUND,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-SYS-007             `operation.cancel`                           AUTHENTICATION_REQUIRED, BUSINESS_RULE_REJECTED,
                                                                       IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST,
                                                                       INCOMPATIBLE_CLIENT, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, SERVICE_UNAVAILABLE,
                                                                       VALIDATION_FAILED

  API-SYS-008             `operation.read`                             AUTHENTICATION_REQUIRED, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, INCOMPATIBLE_CLIENT,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-029             `accounting.read`                            AUTHENTICATION_REQUIRED, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, INCOMPATIBLE_CLIENT,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-030             `accounting.read`                            AUTHENTICATION_REQUIRED, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, INCOMPATIBLE_CLIENT,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-031             `accounting.read`                            AUTHENTICATION_REQUIRED, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, INCOMPATIBLE_CLIENT,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-032             `accounting.read`                            AUTHENTICATION_REQUIRED, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, INCOMPATIBLE_CLIENT,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED

  API-ACC-033             `accounting.read`                            AUTHENTICATION_REQUIRED, PERMISSION_DENIED,
                                                                       RESOURCE_NOT_FOUND, INCOMPATIBLE_CLIENT,
                                                                       SERVICE_UNAVAILABLE, VALIDATION_FAILED
  ---------------------------------------------------------------------------------------------------------------------
