import {BreezeObservationAdapter} from '../src/observation-adapter';
import breeze from 'breeze';
import initMetadata from './metadata';

describe('breeze observation adapter', function() {
  beforeAll(() => {
    initMetadata(this);
  });

  beforeEach(() => {
    this.entityManager.clear();
  });

  it('can construct the adapter', () => {
    var adapter = new BreezeObservationAdapter();
    expect(adapter).toBeDefined();
  });

  it('ignores entity properties that are not observable', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = this.memberType.createEntity();
    expect(adapter.handlesProperty(entity, 'entityAspect')).toBe(false);
    expect(adapter.handlesProperty(entity, 'entityType')).toBe(false);
  });

  it('ignores pojo properties', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = {
        foo: 'bar'
      };
    expect(adapter.handlesProperty(entity, 'foo')).toBe(false);
  });

  it('ignores undefined properties', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = {};
    expect(adapter.handlesProperty(entity, 'foo')).toBe(false);
  });

  it('handles breeze scalar properties', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = this.memberType.createEntity();
    expect(adapter.handlesProperty(entity, 'id')).toBe(true);
  });

  it('can observe detached entities', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = this.memberType.createEntity({
        id: 0
      }),
      observer = adapter.getObserver(entity, 'id'),
      change,
      disposeSubscription = observer.subscribe((newValue, oldValue) => {
        change = {
          newValue: newValue,
          oldValue: oldValue
        };
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

  it('can observe attached entities', () => {
    var adapter = new BreezeObservationAdapter(),
      entity = this.entityManager.createEntity(this.memberType, {
        id: 0
      }),
      observer = adapter.getObserver(entity, 'login'),
      change,
      disposeSubscription = observer.subscribe((newValue, oldValue) => {
        change = {
          newValue: newValue,
          oldValue: oldValue
        };
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

  it('cannot observe non-scalar navigation properties', () => {
    var adapter = new BreezeObservationAdapter(),
      member = this.entityManager.createEntity(this.memberType, {
        id: 1
      }),
      repository = this.entityManager.createEntity(this.repositoryType, {
        id: 'aurelia/binding',
        memberId: 1
      });

    expect(member.repositories).toBeDefined();
    expect(member.repositories.constructor).toBe(Array);
    expect(member.repositories.length).toBe(1);
    var descriptor = Object.getPropertyDescriptor(member, 'repository');
    expect(descriptor).toBeUndefined();

    expect(adapter.handlesProperty(member, 'repositories')).toBe(false);
  });

  it('can observe scalar navigation properties', () => {
    var adapter = new BreezeObservationAdapter(),
      member = this.entityManager.createEntity(this.memberType, {
        id: 1
      }),
      repository = this.entityManager.createEntity(this.repositoryType, {
        id: 'aurelia/binding',
        memberId: 1
      });

    expect(repository.member).toBeDefined();
    var descriptor = Object.getPropertyDescriptor(repository, 'member');
    expect(descriptor).toBeDefined();

    expect(adapter.handlesProperty(repository, 'member')).toBe(true);
  });

  it('can observe non-scalar data properties', () => {
    var adapter = new BreezeObservationAdapter(),
      member = this.entityManager.createEntity(this.memberType, {
        id: 1
      }),
      repository = this.entityManager.createEntity(this.repositoryType, {
        id: 'aurelia/binding',
        memberId: 1,
        files: ['breeze.js', 'aurelia.js']
      });

    expect(repository.files).toBeDefined();
    var descriptor = Object.getPropertyDescriptor(repository, 'files');
    expect(descriptor).toBeDefined();

    expect(adapter.handlesProperty(repository, 'files')).toBe(true);
  });
});