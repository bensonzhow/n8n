import {
	INodeProperties,
} from 'n8n-workflow';

export const assetTypeOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an asset type',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an asset type',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an asset type',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all asset types',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an asset type',
			},
		],
		default: 'create',
	},
] as INodeProperties[];

export const assetTypeFields = [
	// ----------------------------------------
	//            assetType: create
	// ----------------------------------------
	{
		displayName: 'Name',
		name: 'name',
		description: 'Name of the asset type',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Short description of the asset type',
			},
			{
				displayName: 'Parent Asset Type ID',
				name: 'parent_asset_type_id',
				type: 'options',
				default: '',
				description: 'ID of the parent asset type',
				typeOptions: {
					loadOptionsMethod: [
						'getAssetTypes',
					],
				},
			},
		],
	},

	// ----------------------------------------
	//            assetType: delete
	// ----------------------------------------
	{
		displayName: 'assetType ID',
		name: 'assetTypeId',
		description: 'ID of the assetType to delete',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//              assetType: get
	// ----------------------------------------
	{
		displayName: 'assetType ID',
		name: 'assetTypeId',
		description: 'ID of the assetType to retrieve',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'get',
				],
			},
		},
	},

	// ----------------------------------------
	//            assetType: getAll
	// ----------------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'How many results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
	},

	// ----------------------------------------
	//            assetType: update
	// ----------------------------------------
	{
		displayName: 'assetType ID',
		name: 'assetTypeId',
		description: 'ID of the asset type to update',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'update',
				],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'Update Fields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'assetType',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Short description of the asset type',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the asset type',
			},
			{
				displayName: 'Parent Asset Type ID',
				name: 'parent_asset_type_id',
				type: 'options',
				default: '',
				description: 'ID of the parent asset type',
				typeOptions: {
					loadOptionsMethod: [
						'getAssetTypes',
					],
				},
			},
		],
	},
] as INodeProperties[];