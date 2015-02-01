import {Q, Deferred} from '../src/promise-adapter';

describe('breeze promise adapter', function() {
  var resolveCallback, rejectCallback, data;

  beforeEach(() => {
    resolveCallback = jasmine.createSpy('resolveCallback');
    rejectCallback = jasmine.createSpy('rejectCallback');
    data = {};

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('can defer', function(){
    var deferred = Q.defer();
    expect(deferred instanceof Deferred).toBeTruthy();
    expect(deferred.promise).toBeDefined();
    expect(deferred.resolve).toBeDefined();
    expect(deferred.reject).toBeDefined();    
  });

  it('can resolve deferred', function(){
    var deferred = Q.defer();

    deferred.promise
      .then(resolveCallback, rejectCallback);
    deferred.resolve(data);

    jasmine.clock().tick(100);    

    setTimeout(() => {
      expect(resolveCallback).toHaveBeenCalledWith({});
      expect(rejectCallback.calls.any()).toBe(false);
    }, 0);
  });

  it('can reject deferred', function(){
    var deferred = Q.defer();

    deferred.promise
      .then(resolveCallback, rejectCallback);
    deferred.reject(data);

    jasmine.clock().tick(100); 
    
    setTimeout(() => {
      expect(resolveCallback.calls.any()).toBe(false);
      expect(rejectCallback).toHaveBeenCalledWith({});
    }, 0);
  });

  it('can resolve', function(){
    Q.resolve(data).then(resolveCallback, rejectCallback);

    jasmine.clock().tick(100);    

    setTimeout(() => {
      expect(resolveCallback).toHaveBeenCalledWith({});
      expect(rejectCallback.calls.any()).toBe(false);
    }, 0);
  });

 it('can reject', function(){
    Q.reject(data).then(resolveCallback, rejectCallback);

    jasmine.clock().tick(100); 
    
    setTimeout(() => {
      expect(resolveCallback.calls.any()).toBe(false);
      expect(rejectCallback).toHaveBeenCalledWith({});
    }, 0);
  });
});