// Central schema registry for the Studio. Every document and object type is
// merged here so the Studio config can import one array and stay consistent
// with the actual schema folders.

import {documents} from './documents'
import {objects} from './objects'

export const schemaTypes = [...documents, ...objects]
