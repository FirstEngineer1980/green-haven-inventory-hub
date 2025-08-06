
export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  closed_at?: string;
  processed_at: string;
  currency: string;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  taxes_included: boolean;
  financial_status: 'pending' | 'authorized' | 'partially_paid' | 'paid' | 'partially_refunded' | 'refunded' | 'voided';
  fulfillment_status: 'fulfilled' | 'null' | 'partial' | 'restocked' | null;
  tags: string;
  note?: string;
  customer: ShopifyCustomer;
  shipping_address: ShopifyAddress;
  billing_address: ShopifyAddress;
  line_items: ShopifyLineItem[];
  fulfillments: ShopifyFulfillment[];
  refunds: ShopifyRefund[];
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: 'disabled' | 'invited' | 'enabled' | 'declined';
  total_spent: string;
  last_order_id?: string;
  note?: string;
  verified_email: boolean;
  multipass_identifier?: string;
  tax_exempt: boolean;
  phone?: string;
  tags: string;
  last_order_name?: string;
  currency: string;
  addresses: ShopifyAddress[];
  accepts_marketing_updated_at: string;
  marketing_opt_in_level?: string;
  tax_exemptions: string[];
  email_marketing_consent?: ShopifyMarketingConsent;
  sms_marketing_consent?: ShopifyMarketingConsent;
  admin_graphql_api_id: string;
  default_address: ShopifyAddress;
}

export interface ShopifyAddress {
  id?: string;
  customer_id?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
  name: string;
  province_code?: string;
  country_code: string;
  country_name: string;
  default?: boolean;
}

export interface ShopifyLineItem {
  id: string;
  variant_id?: string;
  title: string;
  quantity: number;
  sku?: string;
  variant_title?: string;
  vendor?: string;
  fulfillment_service: string;
  product_id: string;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management?: string;
  properties: ShopifyProperty[];
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status?: string;
  price_set: ShopifyPriceSet;
  total_discount_set: ShopifyPriceSet;
  discount_allocations: ShopifyDiscountAllocation[];
  duties: ShopifyDuty[];
  admin_graphql_api_id: string;
  tax_lines: ShopifyTaxLine[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix?: string;
  status: 'active' | 'archived' | 'draft';
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
  image: ShopifyImage;
}

export interface ShopifyVariant {
  id: string;
  product_id: string;
  title: string;
  price: string;
  sku?: string;
  position: number;
  inventory_policy: 'deny' | 'continue';
  compare_at_price?: string;
  fulfillment_service: string;
  inventory_management?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode?: string;
  grams: number;
  image_id?: string;
  weight: number;
  weight_unit: string;
  inventory_item_id: string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export interface ShopifyFulfillment {
  id: string;
  order_id: string;
  status: 'pending' | 'open' | 'success' | 'cancelled' | 'error' | 'failure';
  created_at: string;
  service: string;
  updated_at: string;
  tracking_company?: string;
  shipment_status?: string;
  location_id: string;
  line_items: ShopifyLineItem[];
  tracking_number?: string;
  tracking_numbers: string[];
  tracking_url?: string;
  tracking_urls: string[];
  receipt: ShopifyReceipt;
  name: string;
  admin_graphql_api_id: string;
}

export interface ShopifyRefund {
  id: string;
  order_id: string;
  created_at: string;
  note?: string;
  user_id?: string;
  processed_at: string;
  restock: boolean;
  duties: ShopifyDuty[];
  admin_graphql_api_id: string;
  refund_line_items: ShopifyRefundLineItem[];
  transactions: ShopifyTransaction[];
  order_adjustments: ShopifyOrderAdjustment[];
}

// Supporting interfaces
export interface ShopifyProperty {
  name: string;
  value: string;
}

export interface ShopifyPriceSet {
  shop_money: ShopifyMoney;
  presentment_money: ShopifyMoney;
}

export interface ShopifyMoney {
  amount: string;
  currency_code: string;
}

export interface ShopifyDiscountAllocation {
  amount: string;
  amount_set: ShopifyPriceSet;
  discount_application_index: number;
}

export interface ShopifyDuty {
  id: string;
  harmonized_system_code?: string;
  country_code_of_origin?: string;
  shop_money: ShopifyMoney;
  presentment_money: ShopifyMoney;
  tax_lines: ShopifyTaxLine[];
  admin_graphql_api_id: string;
}

export interface ShopifyTaxLine {
  channel_liable?: boolean;
  price: string;
  price_set: ShopifyPriceSet;
  rate: number;
  title: string;
  compare_at: number;
}

export interface ShopifyOption {
  id: string;
  product_id: string;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyImage {
  id: string;
  product_id: string;
  position: number;
  created_at: string;
  updated_at: string;
  alt?: string;
  width: number;
  height: number;
  src: string;
  variant_ids: string[];
  admin_graphql_api_id: string;
}

export interface ShopifyReceipt {
  testcase: boolean;
  authorization: string;
}

export interface ShopifyRefundLineItem {
  id: string;
  quantity: number;
  line_item_id: string;
  location_id?: string;
  restock_type: 'no_restock' | 'cancel' | 'return' | 'legacy_restock';
  subtotal: number;
  subtotal_set: ShopifyPriceSet;
  total_tax: number;
  total_tax_set: ShopifyPriceSet;
  line_item: ShopifyLineItem;
}

export interface ShopifyTransaction {
  id: string;
  order_id: string;
  kind: 'authorization' | 'capture' | 'sale' | 'void' | 'refund';
  gateway: string;
  status: 'pending' | 'failure' | 'success' | 'error';
  message?: string;
  created_at: string;
  test: boolean;
  authorization?: string;
  location_id?: string;
  source_name: string;
  amount: string;
  currency: string;
  admin_graphql_api_id: string;
  parent_id?: string;
}

export interface ShopifyOrderAdjustment {
  id: string;
  order_id: string;
  refund_id: string;
  amount: string;
  amount_set: ShopifyPriceSet;
  kind: 'shipping_refund' | 'refund_discrepancy';
  reason: string;
  tax_amount: string;
  tax_amount_set: ShopifyPriceSet;
  admin_graphql_api_id: string;
}

export interface ShopifyMarketingConsent {
  state: 'not_subscribed' | 'pending' | 'subscribed' | 'unsubscribed' | 'redacted';
  opt_in_level: 'single_opt_in' | 'confirmed_opt_in' | 'unknown';
  consent_updated_at?: string;
  consent_collected_from?: 'SHOPIFY' | 'OTHER';
}

// Webhook interfaces
export interface ShopifyWebhook {
  id: string;
  address: string;
  topic: string;
  created_at: string;
  updated_at: string;
  format: 'json' | 'xml';
  fields?: string[];
  metafield_namespaces?: string[];
  private_metafield_namespaces?: string[];
  api_client_id: string;
  api_version: string;
}

// API response interfaces
export interface ShopifyApiResponse<T> {
  data: T;
  errors?: ShopifyApiError[];
}

export interface ShopifyApiError {
  field?: string;
  message: string;
  code?: string;
}
