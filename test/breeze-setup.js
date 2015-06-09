export default function getEntityManager() {
  // support backingStore- other modelLibraries are not currently supported.
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // Create an EntityManager/MetadataStore to be shared with all tests.
  var dataService = new breeze.DataService({
        serviceName: "https://api.github.com/",
        hasServerMetadata: false
    }),

    entityManager = new breeze.EntityManager({dataService: dataService}),

   repositoryTypeConfig = {
      shortName: 'Repository',
      dataProperties: {
        id: { isPartOfKey: true },
        memberId: { dataType: breeze.DataType.Int64, isPartOfKey: true },
        files: { isScalar: false }
      },
      navigationProperties: {
        member: { entityTypeName: 'Member', associationName : 'Member_Repository', foreignKeyNames: ['memberId'], isScalar: true }
      }
    },

    memberTypeConfig = {
      shortName: 'Member',

      dataProperties: {
        memberId:    { dataType: breeze.DataType.Int64, isPartOfKey: true },
        id:          { dataType: breeze.DataType.Int64 },
        login:       { /* string type by default */ },
        html_url:    { }
      },
      navigationProperties: {
        repositories: { entityTypeName: 'Repository', associationName: 'Member_Repository', foreignKeyNames: ['memberId'], isScalar: false }
      }
    },

    repositoryType = new breeze.EntityType(repositoryTypeConfig),

    memberType = new breeze.EntityType(memberTypeConfig);

  entityManager.metadataStore.addEntityType(repositoryType);
  entityManager.metadataStore.addEntityType(memberType);

  return entityManager;
}
