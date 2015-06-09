import {Q, Deferred} from '../src/promise-adapter';

describe('breeze promise adapter', function() {
  var resolveCallback, rejectCallback, data;

  beforeEach(() => {
    resolveCallback = jasmine.createSpy('resolveCallback');
    rejectCallback = jasmine.createSpy('rejectCallback');
    data = {};
  });

  it('can defer', () => {
    var deferred = Q.defer();
    expect(deferred instanceof Deferred).toBeTruthy();
    expect(deferred.promise).toBeDefined();
    expect(deferred.resolve).toBeDefined();
    expect(deferred.reject).toBeDefined();
  });

  it('can resolve deferred', (done) => {
    var deferred = Q.defer();

    deferred.promise
      .then(resolveCallback, rejectCallback);
    deferred.resolve(data);

    setTimeout(() => {
      expect(resolveCallback).toHaveBeenCalledWith({});
      expect(rejectCallback.calls.any()).toBe(false);
      done();
    }, 50);
  });

  it('can reject deferred', (done) => {
    var deferred = Q.defer();

    deferred.promise
      .then(resolveCallback, rejectCallback);
    deferred.reject(data);

    setTimeout(() => {
      expect(resolveCallback.calls.any()).toBe(false);
      expect(rejectCallback).toHaveBeenCalledWith({});
      done();
    }, 50);
  });

  it('can resolve', (done) => {
    Q.resolve(data).then(resolveCallback, rejectCallback);

    setTimeout(() => {
      expect(resolveCallback).toHaveBeenCalledWith({});
      expect(rejectCallback.calls.any()).toBe(false);
      done();
    }, 50);
  });

  it('can reject', (done) => {
    Q.reject(data).then(resolveCallback, rejectCallback);

    setTimeout(() => {
      expect(resolveCallback.calls.any()).toBe(false);
      expect(rejectCallback).toHaveBeenCalledWith({});
      done();
    }, 50);
  });
});
