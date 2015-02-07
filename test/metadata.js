export default function init(thisObj) {
  // support backingStore- other modelLibraries are not currently supported.
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // Create an EntityManager/MetadataStore to be shared with all tests.
  thisObj.dataService = new breeze.DataService({
        serviceName: "https://api.github.com/",
        hasServerMetadata: false 
    });
        
  thisObj.entityManager = new breeze.EntityManager({dataService: thisObj.dataService});

  thisObj.repositoryTypeConfig = {
    shortName: 'Repository',
    dataProperties: {
      id: { isPartOfKey: true },
      memberId: { dataType: breeze.DataType.Int64, isPartOfKey: true },
      files: { isScalar: false }
    },
    navigationProperties: {
      member: { entityTypeName: 'Member', associationName : 'Member_Repository', foreignKeyNames: ['memberId'], isScalar: true }
    }
  };

  thisObj.memberTypeConfig = {
    shortName: 'Member',

    dataProperties: {
      id:          { dataType: breeze.DataType.Int64, isPartOfKey: true },
      login:       { /* string type by default */ },
      html_url:    { }
    },
    navigationProperties: {
      repositories: { entityTypeName: 'Repository', associationName: 'Member_Repository', foreignKeyNames: ['id'], isScalar: false }
    }
  };

  thisObj.repositoryType = new breeze.EntityType(thisObj.repositoryTypeConfig);

  thisObj.memberType = new breeze.EntityType(thisObj.memberTypeConfig);
  
  thisObj.entityManager.metadataStore.addEntityType(thisObj.repositoryType);
  thisObj.entityManager.metadataStore.addEntityType(thisObj.memberType);

  // // The following block is here to confirm breeze is working with jspm module loading.
  // // This is not really part of the test suite and will be removed.
  // var query = breeze.EntityQuery.from('orgs/aurelia/members').toType('Member');
  // try
  // {
  //   thisObj.entityManager.executeQuery(query)
  //     .then(queryResult => {
  //       var members = queryResult.results;
  //       console.info('Breeze is working with jspm module loading.');
  //     })
  //     .fail(reason => {
  //       console.error('An error occurred executing a Breeze query:  ' + reason.toString());
  //     })
  //     .done();
  // }
  // catch(e) {
  //   console.error('Breeze is not working with jspm module loading:  ' + e.toString());
  // }
}