import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import {
	adjustAddresses,
	getFilterQuery,
	magentoApiRequest,
	magentoApiRequestAllItems,
	validateJSON,
} from './GenericFunctions';

import {
	customerFields,
	customerOperations,
} from './CustomerDescription';

import {
	productFields,
	productOperations,
} from './ProductDescription';

import {
	AddressExtensionAttributes,
	CustomAttribute,
	Customer,
	CustomerAttributeMetadata,
	Filter,
	NewCustomer,
	NewProduct,
	Search,
	SearchCriteria,
} from './Types';

import * as moment from 'moment-timezone';
import { IData } from '../Google/CloudNaturalLanguage/Interface';

export class Magento2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Magento 2',
		name: 'magento2',
		icon: 'file:magento.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Magento API',
		defaults: {
			name: 'Magento 2',
			color: '#ec6737',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'magento2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Product',
						value: 'product',
					},
				],
				default: 'customer',
				description: 'The resource to operate on.',
			},
			...customerOperations,
			...customerFields,
			...productOperations,
			...productFields,
		],
	};

	methods = {
		loadOptions: {
			async getCountries(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/directorycountries
				const countries = await magentoApiRequest.call(this, 'GET', '/rest/default/V1/directory/countries');
				const returnData: INodePropertyOptions[] = [];
				for (const country of countries) {
					returnData.push({
						name: country.full_name_english,
						value: country.id,
					});
				}
				return returnData;
			},
			async getGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/customerGroupsdefault#operation/customerGroupManagementV1GetDefaultGroupGet
				const group = await magentoApiRequest.call(this, 'GET', '/rest/default/V1/customerGroups/default');
				const returnData: INodePropertyOptions[] = [];
				returnData.push({
					name: group.code,
					value: group.id,
				});
				return returnData;
			},
			async getStores(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/storestoreConfigs
				const stores = await magentoApiRequest.call(this, 'GET', '/rest/default/V1/store/storeConfigs');
				const returnData: INodePropertyOptions[] = [];
				for (const store of stores) {
					returnData.push({
						name: store.base_url,
						value: store.id,
					});
				}
				return returnData;
			},
			async getWebsites(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/storewebsites
				const websites = await magentoApiRequest.call(this, 'GET', '/rest/default/V1/store/websites');
				const returnData: INodePropertyOptions[] = [];
				for (const website of websites) {
					returnData.push({
						name: website.name,
						value: website.id,
					});
				}
				return returnData;
			},
			async getCustomAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/attributeMetadatacustomer#operation/customerCustomerMetadataV1GetAllAttributesMetadataGet
				const resource = this.getCurrentNodeParameter('resource') as string;
				const attributes = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/attributeMetadata/${resource}`) as CustomerAttributeMetadata[];
				const returnData: INodePropertyOptions[] = [];
				for (const attribute of attributes) {
					if (attribute.system === false) {
						returnData.push({
							name: attribute.frontend_label as string,
							value: attribute.attribute_code as string,
						});
					}
				}
				return returnData;
			},
			async getSystemAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/attributeMetadatacustomer#operation/customerCustomerMetadataV1GetAllAttributesMetadataGet
				const resource = this.getCurrentNodeParameter('resource') as string;
				const attributes = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/attributeMetadata/${resource}`) as CustomerAttributeMetadata[];
				const returnData: INodePropertyOptions[] = [];
				for (const attribute of attributes) {
					if (attribute.system === true && attribute.frontend_label !== null) {
						returnData.push({
							name: attribute.frontend_label as string,
							value: attribute.attribute_code as string,
						});
					}
				}
				return returnData;
			},
			async getProductTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/productslinkstypes
				const types = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/types`) as IDataObject[];
				const returnData: INodePropertyOptions[] = [];
				for (const type of types) {
					returnData.push({
						name: type.label as string,
						value: type.name as string,
					});
				}
				return returnData;
			},
			async getCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/categories#operation/catalogCategoryManagementV1GetTreeGet
				const { items: categories } = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/categories/list`, {}, {
					search_criteria: {
						filter_groups: [
							{
								filters: [
									{
									field: 'is_active',
									condition_type: 'eq',
									value: 1,
									},
								],
							},
						],
					},
				}) as { items: IDataObject[] };
				const returnData: INodePropertyOptions[] = [];
				for (const category of categories) {
					returnData.push({
						name: category.name as string,
						value: category.id as string,
					});
				}
				return returnData;
			},
			async getAttributeSets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/productsattribute-setssetslist#operation/catalogAttributeSetRepositoryV1GetListGet
				const { items: attributeSets } = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/attribute-sets/sets/list`, {}, {
					search_criteria: 0,
				}) as { items: IDataObject[] };
				const returnData: INodePropertyOptions[] = [];
				for (const attributeSet of attributeSets) {
					returnData.push({
						name: attributeSet.attribute_set_name as string,
						value: attributeSet.attribute_set_id as string,
					});
				}
				return returnData;
			},
			async getProductAttributes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				//https://magento.redoc.ly/2.3.7-admin/tag/productsattribute-setssetslist#operation/catalogAttributeSetRepositoryV1GetListGet
				const { items: attributes } = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/attributes`, {}, {
					search_criteria: 0,
				}) as { items: IDataObject[] };
				
				const returnData: INodePropertyOptions[] = [];
				for (const attribute of attributes) {
					returnData.push({
						name: attribute.default_frontend_label as string,
						value: attribute.attribute_id as string,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = (items.length as unknown) as number;
		const timezone = this.getTimezone();
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'customer') {
					if (operation === 'create') {
						// https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1SavePut
						const email = this.getNodeParameter('email', i) as string;
						const firstname = this.getNodeParameter('firstname', i) as string;
						const lastname = this.getNodeParameter('lastname', i) as string;

						const {
							addresses,
							customAttributes,
							extensionAttributes,
							password,
							...rest
						} = this.getNodeParameter('additionalFields', i) as {
							addresses: [
								{
									street: string,
								}
							],
							extensionAttributes: AddressExtensionAttributes,
							customAttributes: {
								customAttribute: CustomAttribute[],
							},
							password: string,
						};

						const body: NewCustomer = {
							customer: {
								email,
								firstname,
								lastname,
							},
						};

						body.customer!.addresses = adjustAddresses(addresses || []);

						body.customer!.custom_attributes = customAttributes?.customAttribute || {};

						body.customer!.extension_attributes = extensionAttributes;

						if (password) {
							body.password = password;
						}

						Object.assign(body.customer, rest);

						responseData = await magentoApiRequest.call(this, 'POST', '/rest/V1/customers', body);
					}

					if (operation === 'delete') {
						//https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1SavePut
						const customerId = this.getNodeParameter('customerId', i) as string;

						responseData = await magentoApiRequest.call(this, 'DELETE', `/rest/default/V1/customers/${customerId}`);

						responseData = { success: true };
					}

					if (operation === 'get') {
						//https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1GetByIdGet
						const customerId = this.getNodeParameter('customerId', i) as string;

						responseData = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/customers/${customerId}`);
					}

					if (operation === 'search') {
						//https://magento.redoc.ly/2.3.7-admin/tag/customerssearch
						const filters = this.getNodeParameter('filters', i) as { and: Filter[], or: Filter[] };
						const sort = this.getNodeParameter('options.sort', i, {}) as { sort: [{ direction: string, field: string }] };
						const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
						const jsonParameters = this.getNodeParameter('jsonParameters', 0) as boolean;
						let qs: Search | undefined = {};
						
						if (jsonParameters === false) {
							qs = getFilterQuery(Object.assign(filters, sort));
						} else {
							const filterJson = this.getNodeParameter('filterJson', i) as string;
							if (validateJSON(filterJson) !== undefined) {
								qs = JSON.parse(filterJson);
							} else {
								throw new NodeApiError(this.getNode(), { message: 'Filter (JSON) must be a valid json' });
							}
						} 

						if (qs === undefined) {
							throw new NodeApiError(this.getNode(), { message: 'At least one filter must be defined' });
						}

						if (returnAll === true) {
							qs.search_criteria!.page_size = 100;
							responseData = await magentoApiRequestAllItems.call(this, 'items', 'GET', `/rest/default/V1/customers/search`, {}, qs as unknown as IDataObject);
						
						} else {
							const limit = this.getNodeParameter('limit', 0) as number;
							qs.search_criteria!.page_size = limit;
							responseData = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/customers/search`, {}, qs as unknown as IDataObject);
							responseData = responseData.items;
						}
					}

					if (operation === 'update') {
						//https://magento.redoc.ly/2.3.7-admin/tag/customerscustomerId#operation/customerCustomerRepositoryV1SavePut
						const customerId = this.getNodeParameter('customerId', i) as string;
						
						const {
							addresses,
							customAttributes,
							extensionAttributes,
							password,
							...rest
						} = this.getNodeParameter('updateFields', i) as {
							addresses: [
								{
									street: string,
								}
							],
							extensionAttributes: AddressExtensionAttributes,
							customAttributes: {
								customAttribute: CustomAttribute[],
							},
							password: string,
						};

						const body: NewCustomer = {
							customer: {
							},
						};

						body.customer!.addresses = adjustAddresses(addresses || []);

						body.customer!.custom_attributes = customAttributes?.customAttribute || {};

						body.customer!.extension_attributes = extensionAttributes;

						if (password) {
							body.password = password;
						}

						Object.assign(body.customer, rest);

						responseData = await magentoApiRequest.call(this, 'PUT', `/rest/V1/customers/${customerId}`, body);
					}
				}

				if (resource === 'product') {
					if (operation === 'create') {
						// https://magento.redoc.ly/2.3.7-admin/tag/products#operation/catalogProductRepositoryV1SavePost
						const sku = this.getNodeParameter('sku', i) as string;
						const attributeSetId = this.getNodeParameter('attributeSetId', i) as number;
						const name = this.getNodeParameter('name', i) as string;

						const {
							customAttributes,
							...rest
						} = this.getNodeParameter('additionalFields', i) as {
							customAttributes: {
								customAttribute: CustomAttribute[],
							},
						};

						const body: NewProduct = {
							product: {
								sku,
								attribute_set_id: attributeSetId,
								name,
							},
						};

						body.product!.custom_attributes = customAttributes?.customAttribute || {};

						 Object.assign(body.product, rest);

						responseData = await magentoApiRequest.call(this, 'POST', '/rest/default/V1/products', body);
					}

					if (operation === 'delete') {
						//https://magento.redoc.ly/2.3.7-admin/tag/productssku#operation/catalogProductRepositoryV1DeleteByIdDelete
						const sku = this.getNodeParameter('sku', i) as string;

						responseData = await magentoApiRequest.call(this, 'DELETE', `/rest/default/V1/products/${sku}`);

						responseData = { success: true };
					}

					if (operation === 'get') {
						//https://magento.redoc.ly/2.3.7-admin/tag/productssku#operation/catalogProductRepositoryV1GetGet
						const sku = this.getNodeParameter('sku', i) as string;

						responseData = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/products/${sku}`);
					}

					if (operation === 'search') {
						//https://magento.redoc.ly/2.3.7-admin/tag/customerssearch
						const filters = this.getNodeParameter('filters', i) as { and: Filter[], or: Filter[] };
						const sort = this.getNodeParameter('options.sort', i, {}) as { sort: [{ direction: string, field: string }] };
						const returnAll = this.getNodeParameter('returnAll', 0) as boolean;
						const jsonParameters = this.getNodeParameter('jsonParameters', 0) as boolean;
						let qs: Search | undefined = {};

						if (jsonParameters === false) {
							qs = getFilterQuery(Object.assign(filters, sort));
						} else {
							const filterJson = this.getNodeParameter('filterJson', i) as string;
							if (validateJSON(filterJson) !== undefined) {
								qs = JSON.parse(filterJson);
							} else {
								throw new NodeApiError(this.getNode(), { message: 'Filter (JSON) must be a valid json' });
							}
						}

						if (qs === undefined) {
							throw new NodeApiError(this.getNode(), { message: 'At least one filter must be defined' });
						}

						if (returnAll === true) {
							qs.search_criteria!.page_size = 100;
							responseData = await magentoApiRequestAllItems.call(this, 'items', 'GET', `/rest/default/V1/products`, {}, qs as unknown as IDataObject);

						} else {
							const limit = this.getNodeParameter('limit', 0) as number;
							qs.search_criteria!.page_size = limit;
							responseData = await magentoApiRequest.call(this, 'GET', `/rest/default/V1/products`, {}, qs as unknown as IDataObject);
							responseData = responseData.items;
						}
					}

					if (operation === 'update') {
						//https://magento.redoc.ly/2.3.7-admin/tag/productssku#operation/catalogProductRepositoryV1SavePut
						const sku = this.getNodeParameter('sku', i) as string;

						const {
							customAttributes,
							...rest
						} = this.getNodeParameter('updateFields', i) as {
							customAttributes: {
								customAttribute: CustomAttribute[],
							},
						};

						if (!Object.keys(rest).length) {
							throw new NodeApiError(this.getNode(), { message: 'At least one parameter has to be updated' });
						}

						const body: NewProduct = {
							product: {
								sku,
							},
						};

						body.product!.custom_attributes = customAttributes?.customAttribute || {};

						Object.assign(body.product, rest);

						responseData = await magentoApiRequest.call(this, 'PUT', `/rest/default/V1/products/${sku}`, body);
					}
				}

				Array.isArray(responseData)
					? returnData.push(...responseData)
					: returnData.push(responseData);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
