import {BreezeObservationAdapter} from '../src/index';
import breeze from 'breeze-client';

beforeAll(function() {
  // used to confirm breeze properties are defined as expected.
  if(typeof Object.getPropertyDescriptor !== 'function'){
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  // support backingStore- other modelLibraries are not currently supported.
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  // Create an EntityManager/MetadataStore to be shared with all tests.
  this.dataService = new breeze.DataService({
        serviceName: "https://api.github.com/",
        hasServerMetadata: false 
    });
        
  this.entityManager = new breeze.EntityManager({dataService: this.dataService});

  this.repositoryTypeConfig = {
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

  this.memberTypeConfig = {
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

  this.repositoryType = new breeze.EntityType(this.repositoryTypeConfig);

  this.memberType = new breeze.EntityType(this.memberTypeConfig);
  
  this.entityManager.metadataStore.addEntityType(this.repositoryType);
  this.entityManager.metadataStore.addEntityType(this.memberType);

  // The following block is here to confirm breeze is working with jspm module loading.
  // This is not really part of the test suite and will be removed.
  var query = breeze.EntityQuery.from('orgs/aurelia/members').toType('Member');
  try
  {
    this.entityManager.executeQuery(query)
      .then(queryResult => {
        var members = queryResult.results;
        console.info('Breeze is working with jspm module loading.');
      })
      .fail(reason => {
        console.error('An error occurred executing a Breeze query:  ' + reason.toString());
      })
      .done();
  }
  catch(e) {
    console.error('Breeze is not working with jspm module loading:  ' + e.toString());
  }
});

beforeEach(function() {
  this.entityManager.clear();
});

describe('breeze observation adapter', function() {
  it('can construct the adapter', function(){
    var adapter = new BreezeObservationAdapter();
    expect(adapter).toBeDefined();
  });  

  it('ignores entity properties that are not observable', function(){
    var adapter = new BreezeObservationAdapter(),
    	entity = this.memberType.createEntity();
    expect(adapter.handlesProperty(entity, 'entityAspect')).toBe(false);
    expect(adapter.handlesProperty(entity, 'entityType')).toBe(false);
  });

  it('ignores pojo properties', function(){
    var adapter = new BreezeObservationAdapter(),
    	entity = { foo: 'bar' };
    expect(adapter.handlesProperty(entity, 'foo')).toBe(false);
  });

  it('ignores undefined properties', function(){
    var adapter = new BreezeObservationAdapter(),
      entity = { };
    expect(adapter.handlesProperty(entity, 'foo')).toBe(false);
  });

  it('handles breeze scalar properties', function(){
    var adapter = new BreezeObservationAdapter(),
    	entity = this.memberType.createEntity();
    expect(adapter.handlesProperty(entity, 'id')).toBe(true);
  });

  it('can observe detached entities', function(){
    var adapter = new BreezeObservationAdapter(),
    	entity = this.memberType.createEntity({ id: 0 }),
    	observer = adapter.getObserver(entity, 'id'),
    	change,
    	disposeSubscription = observer.subscribe((newValue, oldValue) => {
        change = { newValue: newValue, oldValue: oldValue };
	    });
	  
    expect(entity.entityAspect.entityState.isDetached()).toBe(true);

    expect(Object.prototype.toString.call(disposeSubscription)).toBe('[object Function]');
	  
    expect(observer.getValue()).toBe(0);

    change = null;
	  entity.id = 1;
    expect(change && change.newValue === 1 && change.oldValue === 0).toBe(true);
    expect(observer.getValue()).toBe(1);
    
    change = null;
    observer.setValue(2);
    expect(change && change.newValue === 2 && change.oldValue === 1).toBe(true);
    
    disposeSubscription();
    expect(entity.__breezeObserver__.observing).toBe(false);

    change = null;
    entity.id = 3;
    expect(change).toBeNull();
  });

  it('can observe attached entities', function(){
    var adapter = new BreezeObservationAdapter(),
      entity = this.entityManager.createEntity(this.memberType, { id: 0 }),
      observer = adapter.getObserver(entity, 'login'),
      change,
      disposeSubscription = observer.subscribe((newValue, oldValue) => {
        change = { newValue: newValue, oldValue: oldValue };
      });
    
    expect(entity.entityAspect.entityState.isAdded()).toBe(true);

    expect(Object.prototype.toString.call(disposeSubscription)).toBe('[object Function]');
    
    expect(observer.getValue()).toBe(null);

    change = null;
    entity.login = 'ward';
    expect(change && change.newValue === 'ward' && change.oldValue === null).toBe(true);
    expect(observer.getValue()).toBe('ward');    

    change = null;
    observer.setValue('eisenbergeffect');
    expect(change && change.newValue === 'eisenbergeffect' && change.oldValue === 'ward').toBe(true);
    
    disposeSubscription();
    expect(entity.__breezeObserver__.observing).toBe(false);

    change = null;
    entity.login = 'jdanyow';
    expect(change).toBeNull();
  });

  it('cannot observe non-scalar navigation properties', function(){
    var adapter = new BreezeObservationAdapter(),
      member = this.entityManager.createEntity(this.memberType, { id: 1 }),
      repository = this.entityManager.createEntity(this.repositoryType, { id: 'aurelia/binding', memberId: 1 });

    expect(member.repositories).toBeDefined();
    expect(member.repositories.constructor).toBe(Array);
    expect(member.repositories.length).toBe(1);
    var descriptor = Object.getPropertyDescriptor(member, 'repository');
    expect(descriptor).toBeUndefined();

    expect(adapter.handlesProperty(member, 'repositories')).toBe(false);
  });

  it('can observe scalar navigation properties', function(){
    var adapter = new BreezeObservationAdapter(),
      member = this.entityManager.createEntity(this.memberType, { id: 1 }),
      repository = this.entityManager.createEntity(this.repositoryType, { id: 'aurelia/binding', memberId: 1 });

    expect(repository.member).toBeDefined();
    var descriptor = Object.getPropertyDescriptor(repository, 'member');
    expect(descriptor).toBeDefined();

    expect(adapter.handlesProperty(repository, 'member')).toBe(true);
  });

  it('can observe non-scalar data properties', function(){
    var adapter = new BreezeObservationAdapter(),
      member = this.entityManager.createEntity(this.memberType, { id: 1 }),
      repository = this.entityManager.createEntity(this.repositoryType, { id: 'aurelia/binding', memberId: 1, files: ['breeze.js', 'aurelia.js'] });

    expect(repository.files).toBeDefined();
    var descriptor = Object.getPropertyDescriptor(repository, 'files');
    expect(descriptor).toBeDefined();

    expect(adapter.handlesProperty(repository, 'files')).toBe(true);
  });
});
