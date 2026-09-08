/* JobAI SaaS — client-side resume encryption only. No network calls. */
(function(root){
'use strict';

var VERSION=1;
var ITERATIONS=310000;
var SALT_BYTES=16;
var IV_BYTES=12;
var MIN_SECRET_LENGTH=10;

function requireCrypto(){
  if(!root.crypto || !root.crypto.subtle) throw new Error('Web Crypto API is not available');
  return root.crypto;
}

function bytesToBase64(bytes){
  if(typeof btoa==='function'){
    var s='';
    for(var i=0;i<bytes.length;i++) s+=String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  if(typeof Buffer!=='undefined') return Buffer.from(bytes).toString('base64');
  throw new Error('Base64 encoder is not available');
}

function base64ToBytes(value){
  if(typeof atob==='function'){
    var s=atob(value), out=new Uint8Array(s.length);
    for(var i=0;i<s.length;i++) out[i]=s.charCodeAt(i);
    return out;
  }
  if(typeof Buffer!=='undefined') return new Uint8Array(Buffer.from(value,'base64'));
  throw new Error('Base64 decoder is not available');
}

function assertSecret(secret){
  if(typeof secret!=='string' || secret.length<MIN_SECRET_LENGTH){
    throw new Error('Encryption passphrase must contain at least '+MIN_SECRET_LENGTH+' characters');
  }
}

async function deriveKey(secret,salt,usage){
  assertSecret(secret);
  var c=requireCrypto();
  var enc=new TextEncoder();
  var material=await c.subtle.importKey('raw',enc.encode(secret),{name:'PBKDF2'},false,['deriveKey']);
  return c.subtle.deriveKey(
    {name:'PBKDF2',salt:salt,iterations:ITERATIONS,hash:'SHA-256'},
    material,
    {name:'AES-GCM',length:256},
    false,
    usage
  );
}

async function encryptResume(resumeObject,secret){
  if(!resumeObject || typeof resumeObject!=='object') throw new Error('Resume payload must be an object');
  assertSecret(secret);
  var c=requireCrypto();
  var salt=c.getRandomValues(new Uint8Array(SALT_BYTES));
  var iv=c.getRandomValues(new Uint8Array(IV_BYTES));
  var key=await deriveKey(secret,salt,['encrypt']);
  var plain=new TextEncoder().encode(JSON.stringify(resumeObject));
  var encrypted=await c.subtle.encrypt({name:'AES-GCM',iv:iv},key,plain);
  return JSON.stringify({
    v:VERSION,
    alg:'AES-GCM-256',
    kdf:'PBKDF2-SHA256',
    iter:ITERATIONS,
    salt:bytesToBase64(salt),
    iv:bytesToBase64(iv),
    data:bytesToBase64(new Uint8Array(encrypted))
  });
}

async function decryptResume(encryptedPayload,secret){
  assertSecret(secret);
  var parsed=typeof encryptedPayload==='string'?JSON.parse(encryptedPayload):encryptedPayload;
  if(!parsed || parsed.v!==VERSION || parsed.alg!=='AES-GCM-256' || parsed.kdf!=='PBKDF2-SHA256'){
    throw new Error('Unsupported encrypted resume format');
  }
  if(parsed.iter!==ITERATIONS) throw new Error('Unsupported encryption iteration count');
  var c=requireCrypto();
  var salt=base64ToBytes(parsed.salt);
  var iv=base64ToBytes(parsed.iv);
  var cipher=base64ToBytes(parsed.data);
  var key=await deriveKey(secret,salt,['decrypt']);
  var plain=await c.subtle.decrypt({name:'AES-GCM',iv:iv},key,cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}

function looksEncrypted(encryptedPayload){
  try{
    var p=typeof encryptedPayload==='string'?JSON.parse(encryptedPayload):encryptedPayload;
    return !!(p && p.v===VERSION && p.alg==='AES-GCM-256' && p.kdf==='PBKDF2-SHA256' && p.salt && p.iv && p.data);
  }catch(_){return false;}
}

root.JobAICloudCrypto={
  version:VERSION,
  encryptResume:encryptResume,
  decryptResume:decryptResume,
  looksEncrypted:looksEncrypted
};
})(typeof window!=='undefined'?window:globalThis);
