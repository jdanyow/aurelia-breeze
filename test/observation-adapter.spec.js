import {BreezeObservationAdapter} from '../src/observation-adapter';
import breeze from 'breeze';
import getEntityManager from './breeze-setup';

describe('breeze observation adapter', function() {
  var entityManager, memberType, repositoryType;
  beforeAll(() => {
    entityManager = getEntityManager();
    memberType = entityManager.metadataStore.getEntityType('Member');
    repositoryType = entityManager.metadataStore.getEntityType('Repository');
  });

  beforeEach(() => {
    entityManager.clear();
  });

  it('can construct the adapter', () => {
    var adapter = new BreezeObservationAdapter();
    expect(adapter).toBeDefined();
  });

  it('ignores entity properties that are not observable', () => {
    var adapter = new BreezeObservationAdapter(),
        entity = memberType.createEntity();
    expect(adapter.getObserver(entity, 'entityAspect')).toBe(null);
    expect(adapter.getObserver(entity, 'entityType')).toBe(null);
  });

  it('ignores pojo properties', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = {
        foo: 'bar'
      };
    expect(adapter.getObserver(entity, 'foo')).toBe(null);
  });

  it('ignores undefined properties', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = {};
    expect(adapter.getObserver(entity, 'foo')).toBe(null);
  });

  it('handles breeze scalar properties', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = memberType.createEntity();
    expect(adapter.getObserver(entity, 'id')).not.toBe(null);
  });

  it('ignores non-scalar navigation properties', () => {
    var adapter = new BreezeObservationAdapter(),
      member = entityManager.createEntity(memberType, {
        memberId: 1,
        id: 1
      }),
      repository = entityManager.createEntity(repositoryType, {
        id: 'aurelia/binding',
        memberId: 1
      });

    expect(member.repositories).toBeDefined();
    expect(member.repositories.constructor).toBe(Array);
    expect(member.repositories.length).toBe(1);
    var descriptor = Object.getPropertyDescriptor(member, 'repository');
    expect(descriptor).toBeUndefined();

    expect(adapter.getObserver(member, 'repositories')).toBe(null);
  });

  it('handles scalar navigation properties', () => {
    var adapter = new BreezeObservationAdapter(),
      member = entityManager.createEntity(memberType, {
        memberId: 1,
        id: 1
      }),
      repository = entityManager.createEntity(repositoryType, {
        id: 'aurelia/binding',
        memberId: 1
      });

    expect(repository.member).toBeDefined();
    var descriptor = Object.getPropertyDescriptor(repository, 'member');
    expect(descriptor).toBeDefined();

    expect(adapter.getObserver(repository, 'member')).not.toBe(null);
  });

  it('handles non-scalar data properties', () => {
    var adapter = new BreezeObservationAdapter(),
      member = entityManager.createEntity(memberType, {
        memberId: 1,
        id: 1
      }),
      repository = entityManager.createEntity(repositoryType, {
        id: 'aurelia/binding',
        memberId: 1,
        files: ['breeze.js', 'aurelia.js']
      });

    expect(repository.files).toBeDefined();
    var descriptor = Object.getPropertyDescriptor(repository, 'files');
    expect(descriptor).toBeDefined();

    expect(adapter.getObserver(repository, 'files')).not.toBe(null);
  });


  it('handles detached entities', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = memberType.createEntity({
        id: 0
      });
    expect(adapter.getObserver(entity, 'id')).not.toBe(null);
    expect(adapter.getObserver(entity, 'login')).not.toBe(null);
  });

  it('handles attached entities', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = entityManager.createEntity(memberType, {
        memberId: 0,
        id: 0
      });
    expect(adapter.getObserver(entity, 'id')).not.toBe(null);
    expect(adapter.getObserver(entity, 'login')).not.toBe(null);
  });

  it('returns observer matching property-observer interface', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = entityManager.createEntity(memberType, {
        memberId: 0,
        id: 0
      }),
      observer = adapter.getObserver(entity, 'id');
    expect(observer.propertyName).toBe('id');
    expect(Object.prototype.toString.call(observer.getValue)).toBe('[object Function]');
    expect(Object.prototype.toString.call(observer.setValue)).toBe('[object Function]');
    expect(Object.prototype.toString.call(observer.subscribe)).toBe('[object Function]');
    expect(Object.prototype.toString.call(observer.unsubscribe)).toBe('[object Function]');
  });

  it('reuses property observers', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = entityManager.createEntity(memberType, {
        memberId: 0,
        id: 0
      }),
      observer1 = adapter.getObserver(entity, 'id'),
      observer2 = adapter.getObserver(entity, 'id');
    expect(observer1).toBe(observer2);
  });
});

describe('detached entity observation', function() {
  var entityManager, memberType, repositoryType, adapter, entity, idObserver, disposeId, loginObserver, disposeLogin, change;
  beforeAll(() => {
    entityManager = getEntityManager();
    memberType = entityManager.metadataStore.getEntityType('Member');
    repositoryType = entityManager.metadataStore.getEntityType('Repository');

    adapter = new BreezeObservationAdapter(),
    entity = memberType.createEntity({
      id: 0,
      login: 'foo'
    }),
    idObserver = adapter.getObserver(entity, 'id'),
    loginObserver = adapter.getObserver(entity, 'login');
  });

  it('is a detached entity', () => {
    expect(entity.entityAspect.entityState.isDetached()).toBe(true);
  });

  it('gets and sets value', () => {
    expect(idObserver.getValue()).toBe(entity.id);
    expect(loginObserver.getValue()).toBe(entity.login);
    entity.id = 1;
    entity.login = 'bar';
    expect(idObserver.getValue()).toBe(entity.id);
    expect(loginObserver.getValue()).toBe(entity.login);
    idObserver.setValue(0);
    loginObserver.setValue('foo');
    expect(entity.id).toBe(0);
    expect(entity.login).toBe('foo');
    expect(idObserver.getValue()).toBe(entity.id);
    expect(loginObserver.getValue()).toBe(entity.login);

    let callable = {
      call: (context, newValue, oldValue) => {
        change = {
          newValue: newValue,
          oldValue: oldValue
        };
      }
    };
    let context = 'test';
    idObserver.subscribe(context, callable);
    loginObserver.subscribe(context, callable);

    change = null;
    entity.id = 1;
    expect(change && change.newValue === 1 && change.oldValue === 0).toBe(true);

    change = null;
    idObserver.setValue(2);
    expect(change && change.newValue === 2 && change.oldValue === 1).toBe(true);

    change = null;
    entity.login = 'bar';
    expect(change && change.newValue === 'bar' && change.oldValue === 'foo').toBe(true);

    change = null;
    loginObserver.setValue('baz');
    expect(change && change.newValue === 'baz' && change.oldValue === 'bar').toBe(true);

    expect(entity.__breezeObserver__.subscribers).toBe(2);
    idObserver.unsubscribe(context, callable);
    expect(entity.__breezeObserver__.subscribers).toBe(1);
    loginObserver.unsubscribe(context, callable);
    expect(entity.__breezeObserver__.subscribers).toBe(0);

    idObserver.unsubscribe(context, callable);
    loginObserver.unsubscribe(context, callable);
    expect(entity.__breezeObserver__.subscribers).toBe(0);

    change = null;

    entity.id = 3;
    expect(change).toBe(null);

    idObserver.setValue(0);
    expect(change).toBe(null);

    entity.login = 'fizz';
    expect(change).toBe(null);

    change = null;
    loginObserver.setValue('foo');
    expect(change).toBe(null);

    idObserver.subscribe(context, callable);
    loginObserver.subscribe(context, callable);

    change = null;
    entity.id = 1;
    expect(change && change.newValue === 1 && change.oldValue === 0).toBe(true);

    change = null;
    idObserver.setValue(2);
    expect(change && change.newValue === 2 && change.oldValue === 1).toBe(true);

    change = null;
    entity.login = 'bar';
    expect(change && change.newValue === 'bar' && change.oldValue === 'foo').toBe(true);

    change = null;
    loginObserver.setValue('baz');
    expect(change && change.newValue === 'baz' && change.oldValue === 'bar').toBe(true);
  });
});

// todo: find way to reuse previous set of tests.
describe('attached entity observation', function() {
  var entityManager, memberType, repositoryType, adapter, entity, idObserver, disposeId, loginObserver, disposeLogin, change;
  beforeAll(() => {
    entityManager = getEntityManager();
    memberType = entityManager.metadataStore.getEntityType('Member');
    repositoryType = entityManager.metadataStore.getEntityType('Repository');

    adapter = new BreezeObservationAdapter(),
    entity = memberType.createEntity({
      id: 0,
      login: 'foo'
    }),
    idObserver = adapter.getObserver(entity, 'id'),
    loginObserver = adapter.getObserver(entity, 'login');
    entityManager.attachEntity(entity);
  });

  it('is an attached entity', () => {
    expect(entity.entityAspect.entityState.isDetached()).toBe(false);
  });

  it('gets and sets value', () => {
    expect(idObserver.getValue()).toBe(entity.id);
    expect(loginObserver.getValue()).toBe(entity.login);
    entity.id = 1;
    entity.login = 'bar';
    expect(idObserver.getValue()).toBe(entity.id);
    expect(loginObserver.getValue()).toBe(entity.login);
    idObserver.setValue(0);
    loginObserver.setValue('foo');
    expect(entity.id).toBe(0);
    expect(entity.login).toBe('foo');
    expect(idObserver.getValue()).toBe(entity.id);
    expect(loginObserver.getValue()).toBe(entity.login);

    let callable = {
      call: (context, newValue, oldValue) => {
        change = {
          newValue: newValue,
          oldValue: oldValue
        };
      }
    };
    let context = 'test';
    idObserver.subscribe(context, callable);
    loginObserver.subscribe(context, callable);

    change = null;
    entity.id = 1;
    expect(change && change.newValue === 1 && change.oldValue === 0).toBe(true);

    change = null;
    idObserver.setValue(2);
    expect(change && change.newValue === 2 && change.oldValue === 1).toBe(true);

    change = null;
    entity.login = 'bar';
    expect(change && change.newValue === 'bar' && change.oldValue === 'foo').toBe(true);

    change = null;
    loginObserver.setValue('baz');
    expect(change && change.newValue === 'baz' && change.oldValue === 'bar').toBe(true);

    expect(entity.__breezeObserver__.subscribers).toBe(2);
    idObserver.unsubscribe(context, callable);
    expect(entity.__breezeObserver__.subscribers).toBe(1);
    loginObserver.unsubscribe(context, callable);
    expect(entity.__breezeObserver__.subscribers).toBe(0);

    idObserver.unsubscribe(context, callable);
    loginObserver.unsubscribe(context, callable);
    expect(entity.__breezeObserver__.subscribers).toBe(0);

    change = null;

    entity.id = 3;
    expect(change).toBe(null);

    idObserver.setValue(0);
    expect(change).toBe(null);

    entity.login = 'fizz';
    expect(change).toBe(null);

    change = null;
    loginObserver.setValue('foo');
    expect(change).toBe(null);

    idObserver.subscribe(context, callable);
    loginObserver.subscribe(context, callable);

    change = null;
    entity.id = 1;
    expect(change && change.newValue === 1 && change.oldValue === 0).toBe(true);

    change = null;
    idObserver.setValue(2);
    expect(change && change.newValue === 2 && change.oldValue === 1).toBe(true);

    change = null;
    entity.login = 'bar';
    expect(change && change.newValue === 'bar' && change.oldValue === 'foo').toBe(true);

    change = null;
    loginObserver.setValue('baz');
    expect(change && change.newValue === 'baz' && change.oldValue === 'bar').toBe(true);
  });
});
