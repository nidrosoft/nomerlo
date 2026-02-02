/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_mutations from "../admin/mutations.js";
import type * as admin_queries from "../admin/queries.js";
import type * as applications_inviteQueries from "../applications/inviteQueries.js";
import type * as applications_mutations from "../applications/mutations.js";
import type * as applications_queries from "../applications/queries.js";
import type * as billingSettings_mutations from "../billingSettings/mutations.js";
import type * as billingSettings_queries from "../billingSettings/queries.js";
import type * as calendar_mutations from "../calendar/mutations.js";
import type * as calendar_queries from "../calendar/queries.js";
import type * as crons from "../crons.js";
import type * as documents_mutations from "../documents/mutations.js";
import type * as documents_queries from "../documents/queries.js";
import type * as expenses_mutations from "../expenses/mutations.js";
import type * as expenses_queries from "../expenses/queries.js";
import type * as http from "../http.js";
import type * as invoices_mutations from "../invoices/mutations.js";
import type * as invoices_queries from "../invoices/queries.js";
import type * as leases_mutations from "../leases/mutations.js";
import type * as leases_queries from "../leases/queries.js";
import type * as lib_helpers from "../lib/helpers.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as listings_mutations from "../listings/mutations.js";
import type * as listings_queries from "../listings/queries.js";
import type * as maintenance_mutations from "../maintenance/mutations.js";
import type * as maintenance_queries from "../maintenance/queries.js";
import type * as messages_mutations from "../messages/mutations.js";
import type * as messages_queries from "../messages/queries.js";
import type * as notifications_mutations from "../notifications/mutations.js";
import type * as notifications_queries from "../notifications/queries.js";
import type * as organizations_mutations from "../organizations/mutations.js";
import type * as organizations_queries from "../organizations/queries.js";
import type * as payments_actions from "../payments/actions.js";
import type * as payments_mutations from "../payments/mutations.js";
import type * as payments_queries from "../payments/queries.js";
import type * as properties_mutations from "../properties/mutations.js";
import type * as properties_queries from "../properties/queries.js";
import type * as seed from "../seed.js";
import type * as subscriptions_actions from "../subscriptions/actions.js";
import type * as subscriptions_mutations from "../subscriptions/mutations.js";
import type * as subscriptions_queries from "../subscriptions/queries.js";
import type * as tenants_mutations from "../tenants/mutations.js";
import type * as tenants_queries from "../tenants/queries.js";
import type * as units_mutations from "../units/mutations.js";
import type * as units_queries from "../units/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as vendors_mutations from "../vendors/mutations.js";
import type * as vendors_queries from "../vendors/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/mutations": typeof admin_mutations;
  "admin/queries": typeof admin_queries;
  "applications/inviteQueries": typeof applications_inviteQueries;
  "applications/mutations": typeof applications_mutations;
  "applications/queries": typeof applications_queries;
  "billingSettings/mutations": typeof billingSettings_mutations;
  "billingSettings/queries": typeof billingSettings_queries;
  "calendar/mutations": typeof calendar_mutations;
  "calendar/queries": typeof calendar_queries;
  crons: typeof crons;
  "documents/mutations": typeof documents_mutations;
  "documents/queries": typeof documents_queries;
  "expenses/mutations": typeof expenses_mutations;
  "expenses/queries": typeof expenses_queries;
  http: typeof http;
  "invoices/mutations": typeof invoices_mutations;
  "invoices/queries": typeof invoices_queries;
  "leases/mutations": typeof leases_mutations;
  "leases/queries": typeof leases_queries;
  "lib/helpers": typeof lib_helpers;
  "lib/permissions": typeof lib_permissions;
  "listings/mutations": typeof listings_mutations;
  "listings/queries": typeof listings_queries;
  "maintenance/mutations": typeof maintenance_mutations;
  "maintenance/queries": typeof maintenance_queries;
  "messages/mutations": typeof messages_mutations;
  "messages/queries": typeof messages_queries;
  "notifications/mutations": typeof notifications_mutations;
  "notifications/queries": typeof notifications_queries;
  "organizations/mutations": typeof organizations_mutations;
  "organizations/queries": typeof organizations_queries;
  "payments/actions": typeof payments_actions;
  "payments/mutations": typeof payments_mutations;
  "payments/queries": typeof payments_queries;
  "properties/mutations": typeof properties_mutations;
  "properties/queries": typeof properties_queries;
  seed: typeof seed;
  "subscriptions/actions": typeof subscriptions_actions;
  "subscriptions/mutations": typeof subscriptions_mutations;
  "subscriptions/queries": typeof subscriptions_queries;
  "tenants/mutations": typeof tenants_mutations;
  "tenants/queries": typeof tenants_queries;
  "units/mutations": typeof units_mutations;
  "units/queries": typeof units_queries;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "vendors/mutations": typeof vendors_mutations;
  "vendors/queries": typeof vendors_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
