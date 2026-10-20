import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {validate} from './validate.mjs';
const catalog=JSON.parse(readFileSync(new URL('../catalog.json',import.meta.url),'utf8'));
for(const mutate of [c=>c.sounds.push({...c.sounds[0]}),c=>c.sounds[0].sha256='0'.repeat(64),c=>c.sounds[0].license='unknown',c=>c.sounds[0].path='../secret.ogg',c=>c.sources[0].redistributionVerified=false,c=>c.sounds[0].durationSeconds=999,c=>c.sounds[0].sourceId='missing']) {const copy=structuredClone(catalog);mutate(copy);assert.throws(()=>validate(copy));}
console.log('7 invalid catalog fixtures rejected: duplicates, tampering, license, path traversal, unverified source, duration, missing provenance.');
