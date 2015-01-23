import {BreezeObservationAdapter} from '../src/index';
import breeze from 'breeze.js';

beforeAll(function() {
  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore");

  this.dataService = new breeze.DataService({
        serviceName: "https://api.github.com/",
        hasServerMetadata: false 
    });
        
  this.entityManager = new breeze.EntityManager({dataService: this.dataService});

  this.memberTypeConfig = {
      shortName: 'Member',

      dataProperties: {
        id:          { dataType: breeze.DataType.Int64, isPartOfKey: true },
        login:       { /* string type by default */ },
        html_url:    { }
      }  
    };

  this.memberType = new breeze.EntityType(this.memberTypeConfig);
        
  this.entityManager.metadataStore.addEntityType(this.memberType);

  // var query = breeze.EntityQuery.from('orgs/aurelia/members').toType('Member');
  // entityManager.executeQuery(query)
  //   .then(queryResult => {
  //     var members = queryResult.results;
  //   })
  //   .fail(reason => {
  //   });
});

describe('breeze observation adapter', function() {
  it('can construct the adapter', function(){
    var adapter = new BreezeObservationAdapter();
    expect(adapter).toBeDefined();
  });  

  it('ignores existing, non breeze scalar properties', function(){
    var adapter = new BreezeObservationAdapter(),
    	entity = this.memberType.createEntity();
    expect(adapter.handlesProperty(entity, 'entityAspect')).toBe(false);
  });

  it('ignores pojo object properties', function(){
    var adapter = new BreezeObservationAdapter(),
    	entity = { foo: 'bar' };
    expect(adapter.handlesProperty(entity, 'foo')).toBe(false);
  });

  it('can handle breeze scalar properties', function(){
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
});
