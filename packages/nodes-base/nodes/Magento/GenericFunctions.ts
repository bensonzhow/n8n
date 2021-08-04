import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError
} from 'n8n-workflow';

import {
	Address,
	Filter,
	FilterGroup,
	Search,
} from './Types';

export async function magentoApiRequest(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, headers: IDataObject = {}, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('magento2Api') as IDataObject;

	let options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${credentials.accessToken}`,
		},
		method,
		body,
		qs,
		uri: uri || `${credentials.host}${resource}`,
		json: true,
	};
	try {
		options = Object.assign({}, options, option);
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		console.log(JSON.stringify(options, null, 2));
		//@ts-ignore
		return await this.helpers.request.call(this, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function magentoApiRequestAllItems(this: IHookFunctions | ILoadOptionsFunctions | IExecuteFunctions, propertyName: string, method: string, resource: string, body: any = {}, query: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any

	const returnData: IDataObject[] = [];

	let responseData;

	do {
		responseData = await magentoApiRequest.call(this, method, resource, body, query);
		returnData.push.apply(returnData, responseData[propertyName]);
		query['current_page'] = (query.current_page) ? (query.current_page as number)++ : 1;
	} while (
		returnData.length < responseData.total_count
	);

	return returnData;
}

export function getAddressesUi() {
	return {
		displayName: 'Addresses',
		name: 'addresses',
		placeholder: 'Add Address',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				values: [
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Country',
						name: 'country_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getCountries',
						},
						default: '',
					},
					{
						displayName: 'Default Billing',
						name: 'default_billing',
						type: 'boolean',
						default: false,
						descrition: 'Weather this address is default billing address',
					},
					{
						displayName: 'Default Shipping',
						name: 'default_billing',
						type: 'boolean',
						default: false,
						descrition: 'Weather this address is default shipping address',
					},
					{
						displayName: 'Fax',
						name: 'fax',
						type: 'string',
						default: '',
					},
					{
						displayName: 'First Name',
						name: 'firstname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Last Name',
						name: 'lastname',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Middle Name',
						name: 'middlename',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Postcode',
						name: 'postcode',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Prefix',
						name: 'prefix',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Region',
						name: 'region',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Street',
						name: 'street',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Suffix',
						name: 'suffix',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Telephone',
						name: 'telephone',
						type: 'string',
						default: '',
					},
				],
			},
		],
	};
}

// tslint:disable-next-line: no-any
export function adjustAddresses(addresses: [{ street: string }]): Address[] {
	const _addresses: Address[] = [];
	for (let i = 0; i < addresses.length; i++) {
		_addresses.push({
			...addresses[i],
			street: [addresses[i].street],
		});
	}
	return _addresses;
}

export function getSearchFilters(resource: string, attributeFunction: string) {
	return [
		{
			displayName: 'JSON Parameters',
			name: 'jsonParameters',
			type: 'boolean',
			displayOptions: {
				show: {
					resource: [
						resource,
					],
					operation: [
						'search',
					],
				},
			},
			default: false,
		},
		{
			displayName: 'Filters',
			name: 'filters',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			displayOptions: {
				show: {
					resource: [
						resource,
					],
					operation: [
						'search',
					],
					jsonParameters: [
						false,
					],
				},
			},
			default: '',
			placeholder: 'Add Filter',
			options: [
				{
					displayName: 'OR',
					name: 'or',
					values: [
						...getConditions(attributeFunction),
					],
				},
				{
					displayName: 'AND',
					name: 'and',
					values: [
						...getConditions(attributeFunction),
					],
				},
			],
		},
		{
			displayName: 'Filters (JSON)',
			name: 'filterJson',
			type: 'string',
			typeOptions: {
				alwaysOpenEditWindow: true,
			},
			displayOptions: {
				show: {
					resource: [
						resource,
					],
					operation: [
						'search',
					],
					jsonParameters: [
						true,
					],
				},
			},
			placeholder: `https://devdocs.magento.com/guides/v2.4/rest/performing-searches.html</br>
{
	"search_criteria": {
		"filter_groups": [
			{
				"filters": [
					{
						"field": "email",
						"condition_type": "eq",
						"value": "jhon@testing.com"
					}
				]
			}
		],
	"page_size": 100
	}
}
			`,
			default: '',
		},
		{
			displayName: 'Options',
			name: 'options',
			type: 'collection',
			placeholder: 'Add Option',
			default: {},
			displayOptions: {
				show: {
					resource: [
						resource,
					],
					operation: [
						'search',
					],
				},
			},
			options: [
				{
					displayName: 'Sort',
					name: 'sort',
					type: 'fixedCollection',
					placeholder: 'Add Sort',
					typeOptions: {
						multipleValues: true,
					},
					default: [],
					options: [
						{
							displayName: 'Sort',
							name: 'sort',
							values: [
								{
									displayName: 'Direction',
									name: 'direction',
									type: 'options',
									options: [
										{
											name: 'ASC',
											value: 'asc',
										},
										{
											name: 'DESC',
											value: 'DESC',
										},
									],
									default: 'asc',
									description: 'The sorting direction',
								},
								{
									displayName: 'Field',
									name: 'field',
									type: 'options',
									typeOptions: {
										loadOptionsMethod: attributeFunction,
									},
									default: '',
									description: `The sorting field`,
								},
							],
						},
					],
				},
			],
		},
	];
}

function getConditionTypeFields() {
	return {
		displayName: 'Condition Type',
		name: 'condition_type',
		type: 'options',
		options: [
			{
				name: 'Equals',
				value: 'eq',
			},
			{
				name: 'Greater than',
				value: 'gt',
			},
			{
				name: 'Greater than or equal',
				value: 'gteq',
			},
			{
				name: 'In',
				value: 'in',
				description: 'The value can contain a comma-separated list of values',
			},
			{
				name: 'Like',
				value: 'like',
				description: 'The value can contain the SQL wildcard characters when like is specified.',
			},
			{
				name: 'Less Than',
				value: 'lt',
			},
			{
				name: 'Less Than or Equal',
				value: 'lte',
			},
			{
				name: 'More or Equal',
				value: 'moreq',
			},
			{
				name: 'Not Equal',
				value: 'neq',
			},
			{
				name: 'Not In',
				value: 'nin',
				description: 'Not in. The value can contain a comma-separated list of values',
			},
			{
				name: 'Not Null',
				value: 'notnull',
			},
			{
				name: 'Null',
				value: 'null',
			},
		],
		default: 'eq',
	};
}

function getConditions(attributeFunction: string) {
	return [
		{
			displayName: 'Field',
			name: 'field',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: attributeFunction,
			},
			default: '',
		},
		getConditionTypeFields(),
		{
			displayName: 'Value',
			name: 'value',
			type: 'string',
			displayOptions: {
				hide: {
					condition_type: [
						'null',
						'notnull',
					],
				},
			},
			default: '',
		},
	];
}

export function getFilterQuery(data: { and?: Filter[], or?: Filter[], sort: [{ direction: string, field: string  }] }): Search | undefined {
	if (data?.or?.length) {
		return {
			search_criteria: {
				filter_groups: [
					{
						filters: data?.or,
					},
				],
				sort_orders: data.sort,
			},
		};
	} else if (data?.and?.length){
		return {
			search_criteria: {
				filter_groups: data?.and.map((filter: Filter) => {
					return {
						filters: [filter],
					};
				}) as FilterGroup[],
				sort_orders: data.sort,
			},
		};
	}
	return undefined;
}

export function validateJSON(json: string | undefined): any { // tslint:disable-line:no-any
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = undefined;
	}
	return result;
}

export function getCustomerOptionalFields() {
	return [
		getAddressesUi(),
		{
			displayName: 'Confirmation',
			name: 'confirmation',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Custom Attributes',
			name: 'customAttributes',
			type: 'fixedCollection',
			default: '',
			placeholder: 'Add Custom Attribute',
			options: [
				{
					displayName: 'Custom Attribute',
					name: 'customAttribute',
					values: [
						{
							displayName: 'Attribute Code',
							name: 'attribute_code',
							type: 'options',
							typeOptions: {
								loadOptionsMethod: 'getCustomAttributes',
							},
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		},
		{
			displayName: 'Date of Birth',
			name: 'dob',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Default Billing Address ID',
			name: 'default_billing',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Default Shipping Address ID',
			name: 'default_shipping',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					'/operation': [
						'update',
					],
				},
			},
			description: 'Email Address',
		},
		{
			displayName: 'Extension Attributes',
			name: 'extensionAttributes',
			type: 'collection',
			placeholder: 'Add Extension Attribute',
			default: {},
			options: [
				{
					displayName: 'Amazon ID',
					name: 'amazon_id',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Is Subscribed',
					name: 'is_subscribed',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Vertex Customer Code',
					name: 'vertex_customer_code',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Vertex Customer Country',
					name: 'vertex_customer_country',
					type: 'string',
					default: '',
				},
			],
		},
		{
			displayName: 'First Name',
			name: 'firstname',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					'/operation': [
						'update',
					],
				},
			},
			description: 'First name',
		},
		{
			displayName: 'Gender',
			name: 'gender',
			type: 'options',
			options: [
				{
					name: 'Male',
					value: 1,
				},
				{
					name: 'Female',
					value: 2,
				},
				{
					name: 'Not Specified',
					value: 3,
				},
			],
			default: '',
		},
		{
			displayName: 'Group ID',
			name: 'group_id',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getGroups',
			},
			default: '',
		},
		{
			displayName: 'Last Name',
			name: 'lastname',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					'/operation': [
						'update',
					],
				},
			},
			description: 'Last name',
		},
		{
			displayName: 'Middle Name',
			name: 'middlename',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Prefix',
			name: 'prefix',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Store ID',
			name: 'store_id',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getStores',
			},
			default: '',
		},
		{
			displayName: 'Suffix',
			name: 'suffix',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Tax Vat',
			name: 'taxvat',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Website ID',
			name: 'website_id',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getWebsites',
			},
			default: '',
		},
	];
}

export function getProductOptionalFields() {
	return [
		{
			displayName: 'Attribute Set ID',
			name: 'attribute_set_id',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getAttributeSets',
			},
			default: '',
			displayOptions: {
				show: {
					'/operation': [
						'update',
					],
				},
			},
		},
		{
			displayName: 'Name',
			name: 'name',
			type: 'string',
			displayOptions: {
				show: {
					'/operation': [
						'update',
					],
				},
			},
			default: '',
		},
		{
			displayName: 'Custom Attributes',
			name: 'customAttributes',
			type: 'fixedCollection',
			default: '',
			placeholder: 'Add Custom Attribute',
			options: [
				{
					displayName: 'Custom Attribute',
					name: 'customAttribute',
					values: [
						{
							displayName: 'Attribute Code',
							name: 'attribute_code',
							type: 'options',
							typeOptions: {
								loadOptionsMethod: 'getCustomAttributes',
							},
							default: '',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
						},
					],
				},
			],
		},
		{
			displayName: 'Parent Category ID',
			name: 'category',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getCategories',
			},
			default: '',
		},
		{
			displayName: 'Price',
			name: 'price',
			type: 'number',
			default: 0,
		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			options: [
				{
					name: 'Enabled',
					value: 1,
				},
				{
					name: 'Disabled',
					value: 2,
				},
			],
			default: '',
		},
		{

			displayName: 'Type ID',
			name: 'type_id',
			type: 'options',
			typeOptions: {
				loadOptionsMethod: 'getProductTypes',
			},
			default: '',
		},
		{
			displayName: 'Visibility',
			name: 'visibility',
			type: 'options',
			options: [
				{
					name: 'Not Visible',
					value: 1,
				},
				{
					name: 'Catalog',
					value: 2,
				},
				{
					name: 'Search',
					value: 3,
				},
				{
					name: 'Catalog & Search',
					value: 4,
				},
			],
			default: 4,
		},
		{
			displayName: 'Weight',
			name: 'weight',
			type: 'number',
			default: 0,
		},
	];
}