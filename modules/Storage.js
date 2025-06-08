/**
 * Multiprocess/Multiuser Safe File Storage (OOP Version)
 *
 * This class provides a robust, multiuser-safe file storage solution using revisioned and UUID-named files.
 * All operations are implemented as methods, with no reliance on small utility functions.
 * Each step in read/write/clean operations is numbered and explained.
 * Follows ES6+ (2020+) and Firefox JavaScript idioms, and uses JSDoc for documentation.
 */

import { resolve, join } from 'node:path';
import { existsSync, mkdirSync, readdir, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';

/**
 * Generates a random UUID v4 string.
 * Uses crypto.randomUUID() if available, otherwise uses a polyfill.
 * @returns {string} UUID string.
 */
function generateUUIDv4() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

/**
 * Alphanumeric, case-insensitive natural sort.
 * @param {string[]} arr
 * @returns {string[]}
 */
function alphanumSort(arr) {
  return arr.slice().sort(new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare);
}

/**
 * @class UndDatabase
 * Multiprocess/Multiuser safe, revisioned file storage.
 */
export default class Storage {
  /**
   * @param {object} configuration - Example: { db: './my-db' }
   */
  constructor(configuration) {
    /** @private */
    this.rootPath = null;
    /** @private */
    this.configuration = configuration;
    if (configuration && configuration.db) {
      this.setPath(configuration.db);
    }
  }

  /**
   * 1. Set the root directory for storage. Creates directory if missing.
   * @param {string} location - Path to database root.
   */
  setPath(location) {
    // Step 1: Resolve path
    this.rootPath = resolve(location);

    // Step 2: Ensure directory exists
    if (!existsSync(this.rootPath)) {
      mkdirSync(this.rootPath, { recursive: true });
    }
  }

  /**
   * 2. Clean up all but the latest revision in each object directory (or a specific id).
   * @param {string=} id - Optional object id (directory name).
   * @returns {string[]} List of deleted file paths.
   */
  clean(id) {
    // Step 1: Get all object ids if id not specified, else just [id]
    const ids = id ? [id] : this.allSync();

    /** @type {string[]} */
    const deletedFiles = [];

    // Step 2: For each object directory:
    for (const objectId of ids) {
      const directory = join(this.rootPath, objectId);
      if (!existsSync(directory)) continue;

      // Step 3: List files and sort
      let files = readdirSync(directory).filter(f => f.endsWith('.json'));
      files = alphanumSort(files);

      // Step 4: Remove the latest file from deletion
      files.pop();

      // Step 5: Delete all other files
      for (const file of files) {
        const fullPath = join(directory, file);
        unlinkSync(fullPath);
        deletedFiles.push(fullPath);
      }
    }
    // Step 6: Return deleted file paths
    return deletedFiles;
  }

  /**
   * 3. Get the latest revision number for an object id.
   * @param {string} id
   * @returns {number} Latest revision number (integer).
   */
  rev(id) {
    // Step 1: Find directory for object id
    const directory = join(this.rootPath, id);

    // Step 2: List all revision files
    let files = [];
    if (existsSync(directory)) {
      files = readdirSync(directory).filter(f => f.endsWith('.json'));
    }

    // Step 3: If no files, fake a base revision
    if (files.length === 0) files.push('0-a.json');

    // Step 4: Sort files and pick latest
    files = alphanumSort(files);
    const latestFile = files[files.length - 1];

    // Step 5: Parse revision number from filename
    const [revPart] = latestFile.split('-');
    const revision = parseInt(revPart, 10);
    return Number.isNaN(revision) ? 1 : revision;
  }

  /**
   * 4. Check if an object id exists.
   * @param {string} id
   * @returns {boolean}
   */
  has(id) {
    const directory = join(this.rootPath, id);
    return existsSync(directory);
  }

  /**
   * 5. List all object ids (directory names) in the root storage path.
   * @returns {string[]}
   */

  async all() {
    if (!existsSync(this.rootPath)) return [];
    return new Promise((resolve, reject) => {
      readdir(this.rootPath, (err, files) => {
        if (err) return reject(err);
        const dirs = files.filter(entry => {
          try {
            return existsSync(join(this.rootPath, entry)) && !entry.startsWith('.');
          } catch {
            return false;
          }
        });
        resolve(dirs);
      });
    });
  }

  /**
   * Synchronous version of all(), for internal use.
   * @returns {string[]}
   */
  allSync() {
    if (!existsSync(this.rootPath)) return [];
    return readdirSync(this.rootPath).filter(entry => {
      return existsSync(join(this.rootPath, entry)) && !entry.startsWith('.');
    });
  }

  /**
   * 6. Get the latest revision of an object as parsed JSON.
   * @param {string} id
   * @returns {object|null} Latest object data or null if not found.
   */
  get(id) {
    // Step 1: Validate id
    if (!id) throw new Error('id is required');

    // Step 2: Check if directory exists
    if (!this.has(id)) return null;

    // Step 3: List and sort files
    const directory = join(this.rootPath, id);
    let files = readdirSync(directory).filter(f => f.endsWith('.json'));
    if (files.length === 0) return null;

    files = alphanumSort(files);
    const latestFile = files[files.length - 1];

    // Step 4: Read and parse JSON
    const data = readFileSync(join(directory, latestFile), 'utf8');
    return JSON.parse(data);
  }

  /**
   * 7. Put (save) a new revision of an object.
   * @param {object} data - Must include 'id' (object id).
   * @returns {object} The updated object (including .rev and .uid).
   */
  put(data) {
    // Step 1: Validate input
    if (!data) throw new Error('data is required');
    if (!data.id) throw new Error('data.id is required');

    // Step 2: Determine if revision present in data
    const hasRevision = Object.prototype.hasOwnProperty.call(data, 'rev');
    let rev = 0;

    // Step 3: Check if object directory exists
    const directory = join(this.rootPath, data.id);
    const dataExists = existsSync(directory);

    // Step 4: Decide revision number
    if (hasRevision) {
      rev = data.rev;
    } else if (dataExists) {
      rev = this.rev(data.id);
    } else {
      rev = 0;
    }

    // Step 5: Increment revision
    rev += 1;

    // Step 6: Generate a new UUID for this revision
    const uid = generateUUIDv4();

    // Step 7: Compose the new object, including .rev and .uid fields
    const updated = { ...data, rev, uid };

    // Step 8: Ensure object directory exists
    if (!dataExists) {
      mkdirSync(directory, { recursive: true });
    }

    // Step 9: Create filename as '<rev>-<uuid>.json'
    const filename = `${rev}-${uid}.json`;
    const fullpath = join(directory, filename);

    // Step 10: Write JSON to file (pretty-printed)
    writeFileSync(fullpath, JSON.stringify(updated, null, 2), 'utf8');

    // Step 11: Return the updated object
    return updated;
  }
}

// Example usage:
// const und = new UndDatabase({ db: './my-db' });
// und.put({ id: 'alice-profile', name: 'Alice' });
// const alice = und.get('alice-profile');
// console.log(alice);
