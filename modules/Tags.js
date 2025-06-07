/**
 * Tags Index Manager
 *
 * Provides tag-to-article mapping using the filesystem.
 * All tag operations are methods of the Tags class, which accepts a configuration object.
 * Follows ES6+ standards and OOP patterns.
 */

import { mkdirSync, writeFileSync, existsSync, unlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @class Tags
 * Manages bidirectional tag <-> article index using the filesystem.
 */
export class Tags {
  /**
   * @param {object} config - Example: { db: './my-tags' }
   */
  constructor(config) {
    if (!config || !config.db) throw new Error("Config with 'db' property required");
    /** @private */
    this.root = config.db;
  }

  /**
   * Add a tag to an article.
   * @param {string} tag - Tag name.
   * @param {string} articleId - Article identifier.
   */
  addTag(tag, articleId) {
    // Step 1: Build directory path for tag
    const dir = join(this.root, tag);

    // Step 2: Ensure directory exists
    mkdirSync(dir, { recursive: true });

    // Step 3: Create a file named by articleId inside the tag directory
    writeFileSync(join(dir, articleId), '1');
  }

  /**
   * Remove a tag from an article.
   * @param {string} tag - Tag name.
   * @param {string} articleId - Article identifier.
   */
  removeTag(tag, articleId) {
    // Step 1: Build file path
    const filePath = join(this.root, tag, articleId);

    // Step 2: Delete file if it exists
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  /**
   * Get all articles for a specific tag.
   * @param {string} tag - Tag name.
   * @returns {string[]} Array of article ids.
   */
  getArticlesForTag(tag) {
    // Step 1: Build directory path
    const dir = join(this.root, tag);

    // Step 2: List all files in directory if exists
    return existsSync(dir) ? readdirSync(dir) : [];
  }

  /**
   * Get articles that have ALL specified tags (intersection).
   * @param {string[]} tags - Array of tag names.
   * @returns {Set<string>} Set of article ids that have all tags.
   */
  getArticlesByTags(tags) {
    // Step 1: For each tag, get article ids as Set
    // Step 2: Intersect Sets so only articles with ALL tags remain
    return tags.reduce((acc, tag) => {
      const articles = new Set(this.getArticlesForTag(tag));
      return acc === null ? articles : new Set([...acc].filter(x => articles.has(x)));
    }, null) || new Set();
  }
}

// Example usage:
// const tags = new Tags({ db: './my-tags' });
// tags.addTag('news', 'article1');
// tags.addTag('tech', 'article1');
// tags.addTag('tech', 'article2');
// console.log(tags.getArticlesByTags(['news', 'tech'])); // Set { 'article1' }
