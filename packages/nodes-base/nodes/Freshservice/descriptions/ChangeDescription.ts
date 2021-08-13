import {
	INodeProperties,
} from 'n8n-workflow';

export const changeOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'change',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a change',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a change',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a change',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Retrieve all changes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a change',
			},
		],
		default: 'create',
	},
] as INodeProperties[];

export const changeFields = [
	// ----------------------------------------
	//              change: create
	// ----------------------------------------
	{
		displayName: 'Requester ID',
		name: 'requester_id',
		description: 'ID of the initiator of the change',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'change',
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
					'change',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'options',
				default: '',
				description: 'ID of the agent to whom the change is assigned',
				typeOptions: {
					loadOptionsMethod: [
						'getAgents',
					],
				},
			},
			{
				displayName: 'Approval Status',
				name: 'approval_status',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Open',
						value: 1,
					},
					{
						name: 'Planning',
						value: 2,
					},
					{
						name: 'Approval',
						value: 3,
					},
					{
						name: 'Pending Release',
						value: 4,
					},
					{
						name: 'Pending Review',
						value: 5,
					},
					{
						name: 'Closed',
						value: 6,
					},
				],
			},
			{
				displayName: 'Change Type',
				name: 'change_type',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Minor',
						value: 1,
					},
					{
						name: 'Standard',
						value: 2,
					},
					{
						name: 'Major',
						value: 3,
					},
					{
						name: 'Emergency',
						value: 4,
					},
				],
			},
			{
				displayName: 'Department ID',
				name: 'department_id',
				type: 'option',
				default: '',
				description: 'ID of the department initiating the change',
				typeOptions: {
					loadOptionsMethod: [
						'getDepartments',
					],
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Content of the change in HTML',
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'option',
				default: '',
				description: 'ID of the agent group to which the change is assigned',
				typeOptions: {
					loadOptionsMethod: [
						'getAgentGroups',
					],
				},
			},
			{
				displayName: 'Impact',
				name: 'impact',
				type: 'options',
				description: 'Impact of the change',
				default: 1,
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
				],
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 1,
				description: 'Priority of the change',
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
					{
						name: 'Urgent',
						value: 4,
					},
				],
			},
			{
				displayName: 'Risk',
				name: 'risk',
				type: 'options',
				default: 1,
				description: 'Risk of the change',
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
					{
						name: 'Very High',
						value: 4,
					},
				],
			},
			{
				displayName: 'Status',
				name: 'status',
				description: 'Status of the change',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Open',
						value: 1,
					},
					{
						name: 'Planning',
						value: 2,
					},
					{
						name: 'Approval',
						value: 3,
					},
					{
						name: 'Pending Release',
						value: 4,
					},
					{
						name: 'Pending Review',
						value: 5,
					},
					{
						name: 'Closed',
						value: 6,
					},
				],
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject of the change',
			},
		],
	},

	// ----------------------------------------
	//              change: delete
	// ----------------------------------------
	{
		displayName: 'Change ID',
		name: 'changeId',
		description: 'ID of the change to delete',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'change',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------------
	//               change: get
	// ----------------------------------------
	{
		displayName: 'Change ID',
		name: 'changeId',
		description: 'ID of the change to retrieve',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'change',
				],
				operation: [
					'get',
				],
			},
		},
	},

	// ----------------------------------------
	//              change: getAll
	// ----------------------------------------
	{
		displayName: 'Filters',
		name: 'Filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'change',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Predefined Filters',
				name: 'type',
				type: 'options',
				default: 'my_open',
				options: [
					{
						name: 'Closed',
						value: 'closed',
					},
					{
						name: 'My Open',
						value: 'my_open',
					},
					{
						name: 'Release Requested',
						value: 'release_requested',
					},
					{
						name: 'Requester ID',
						value: 'requester_id',
					},
					{
						name: 'Unassigned',
						value: 'unassigned',
					},
				],
			},
			{
				displayName: 'Sort Order',
				name: 'sort_by',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
				],
				default: 'asc',
			},
			{
				displayName: 'Updated Since',
				name: 'updated_since',
				type: 'dateTime',
				default: '',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: [
					'change',
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
					'change',
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
	//              change: update
	// ----------------------------------------
	{
		displayName: 'Change ID',
		name: 'changeId',
		description: 'ID of the change to update',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'change',
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
					'change',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'options',
				default: '',
				description: 'ID of the agent to whom the change is assigned',
				typeOptions: {
					loadOptionsMethod: [
						'getAgents',
					],
				},
			},
			{
				displayName: 'Approval Status',
				name: 'approval_status',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Open',
						value: 1,
					},
					{
						name: 'Planning',
						value: 2,
					},
					{
						name: 'Approval',
						value: 3,
					},
					{
						name: 'Pending Release',
						value: 4,
					},
					{
						name: 'Pending Review',
						value: 5,
					},
					{
						name: 'Closed',
						value: 6,
					},
				],
			},
			{
				displayName: 'Change Type',
				name: 'change_type',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Minor',
						value: 1,
					},
					{
						name: 'Standard',
						value: 2,
					},
					{
						name: 'Major',
						value: 3,
					},
					{
						name: 'Emergency',
						value: 4,
					},
				],
			},
			{
				displayName: 'Department ID',
				name: 'department_id',
				type: 'options',
				default: '',
				description: 'ID of the department initiating the change',
				typeOptions: {
					loadOptionsMethod: [
						'getDepartments',
					],
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Content of the change in HTML',
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'options',
				default: '',
				description: 'ID of the agent group to which the change is assigned',
				typeOptions: {
					loadOptionsMethod: [
						'getAgentGroups',
					],
				},
			},
			{
				displayName: 'Impact',
				name: 'impact',
				type: 'options',
				default: 1,
				description: 'Impact of the change',
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
				],
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 1,
				description: 'Priority of the change',
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
					{
						name: 'Urgent',
						value: 4,
					},
				],
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				default: 1,
				description: 'Priority of the change',
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
					{
						name: 'Urgent',
						value: 4,
					},
				],
			},
			{
				displayName: 'Requester ID',
				name: 'requester_id',
				type: 'options',
				default: '',
				description: 'ID of the initiator of the change',
				typeOptions: {
					loadOptionsMethod: [
						'getRequesters',
					],
				},
			},
			{
				displayName: 'Risk',
				name: 'risk',
				type: 'options',
				default: 1,
				description: 'Risk of the change',
				options: [
					{
						name: 'Low',
						value: 1,
					},
					{
						name: 'Medium',
						value: 2,
					},
					{
						name: 'High',
						value: 3,
					},
					{
						name: 'Very High',
						value: 4,
					},
				],
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				description: 'Status of the change',
				default: 1,
				options: [
					{
						name: 'Open',
						value: 1,
					},
					{
						name: 'Planning',
						value: 2,
					},
					{
						name: 'Approval',
						value: 3,
					},
					{
						name: 'Pending Release',
						value: 4,
					},
					{
						name: 'Pending Review',
						value: 5,
					},
					{
						name: 'Closed',
						value: 6,
					},
				],
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Subject of the change',
			},
		],
	},
] as INodeProperties[];