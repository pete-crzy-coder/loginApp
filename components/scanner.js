import { readdir, readFile } from "fs/promises";
import path from "path";

/**
 * Asynchronously scans all JSON files in a directory and checks if
 * a specified string exists in a specified top-level field.
 *
 * @param {string} dirPath
 *        Absolute or relative path to the directory containing JSON files.
 *
 * @param {string} fieldName
 *        The top-level JSON field to inspect.
 *
 * @param {string} searchString
 *        The string to search for within the specified field.
 *
 * @returns {Promise<boolean>}
 *          Resolves to true if any JSON file contains the string in the field, false otherwise.
 *
 * @throws {Error}
 *         Throws if the directory cannot be read.
 */
export async function findStringInJsonField(dirPath, fieldName, searchString) {
    const files = await readdir(dirPath);

    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const fullPath = path.join(dirPath, file);

        try {
            const raw = await readFile(fullPath, "utf8");
            const data = JSON.parse(raw);

            if (
                typeof data[fieldName] === "string" &&
                (data[fieldName]) == (searchString)
            ) {
                return true; // Found, stop scanning
            }
        } catch {
            // Bad JSON or unreadable file, ignore
        }
    }

    return false; // Nothing matched
}

/**
 * Asynchronously scans all JSON files in a directory and checks if
 * a specified string exists in a specified top-level field.
 *
 * @param {string} dirPath
 *        Absolute or relative path to the directory containing JSON files.
 *
 * @param {string} fieldName
 *        The top-level JSON field to inspect.
 *
 * @param {string} searchString
 *        The string to search for within the specified field.
 *
 * @returns {Promise<boolean>|<string>}
 *          Resolves to filename if any JSON file contains the string in the field, false otherwise.
 *
 * @throws {Error}
 *         Throws if the directory cannot be read.
 */
export async function findStringInJsonField2(dirPath, fieldName, searchString) {
    const files = await readdir(dirPath);

    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const fullPath = path.join(dirPath, file);

        try {
            const raw = await readFile(fullPath, "utf8");
            const data = JSON.parse(raw);

            if (
                typeof data[fieldName] === "string" &&
                (data[fieldName]) == (searchString)
            ) {
                return file; // Found, stop scanning
            }
        } catch {
            // Bad JSON or unreadable file, ignore
        }
    }

    return false; // Nothing matched
}

export default findStringInJsonField;