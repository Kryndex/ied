import url from 'url'
import {map} from 'rxjs/operator/map'
import {_do} from 'rxjs/operator/do'
import {retry} from 'rxjs/operator/retry'
import {publishReplay} from 'rxjs/operator/publishReplay'
import {EmptyObservable} from 'rxjs/observable/EmptyObservable'
import {concat} from 'rxjs/operator/concat'
import {mergeMap} from 'rxjs/operator/mergeMap'
import path from 'path'

import * as util from '../util'
import * as config from '../config'
import * as fsCache from '../fs_cache'
import {CorruptedPackageError} from '../errors'

/**
 * internal cache used for (pending) HTTP requests (= tarball downloads).
 * @type {Object}
 */
export const cache = {}

export function download (uri) {
  const cached = cache[uri]
  if (cached) return cached
  const result = fsCache.download(uri)
    ::retry(5)
    ::publishReplay().refCount()
  cache[uri] = result
  return result
}

/**
 * obtain a dependency's `package.json` file using the pre-configured registry.
 * @param  {String} parentTarget - absolute parent's node_modules path.
 * @param  {String} name - name of the dependency that should be looked up in
 * the registry.
 * @param  {String} version - SemVer compatible version string.
 * @param  {String} baseDir - project-level `node_modules` base directory.
 * @return {Observable} - observable sequence of `package.json` objects.
 */
export function resolve (parentTarget, name, version, baseDir) {

  // const _path = path.join(parentTarget, 'node_modules', name)
  // return match(name, version)
  //   ::map((pkgJSON) => {
  //     const target = path.join(baseDir, 'node_modules', pkgJSON.dist.shasum)
  //     return new TarballDependency(parentTarget, pkgJSON, target, _path)
  //   })
}

/**
 * represents a dependency that has been downloaded as a tarball.
 */
export class TarballDependency {
  /**
   * create instance.
   * @param  {String} parentTarget - absolute parent's node_modules path.
   * @param  {String} target - final destination of the extracted tarball.
   * @param  {String} path - path of the parent dependency's symlink used for
   * exposing the dependency.
   */
  constructor (parentTarget, pkgJSON, target, path) {
    this.parentTarget = parentTarget
    this.pkgJSON = pkgJSON
    this.target = target
    this.path = path
  }

  fetch () {
    return EmptyObservable.create()
  }
}
